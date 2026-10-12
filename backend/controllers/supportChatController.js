const db = require('../config/db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Configure multer storage for chat attachments
const chatUploadDir = path.join(__dirname, '..', 'uploads', 'chat');
if (!fs.existsSync(chatUploadDir)) {
  fs.mkdirSync(chatUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, chatUploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const safeName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB limit
});

exports.uploadMiddleware = upload.any();

// Upload Chat Attachment Endpoint
exports.uploadAttachment = async (req, res) => {
  try {
    const uploadedFile = req.file || (req.files && req.files[0]);
    if (uploadedFile) {
      const fileUrl = `/uploads/chat/${uploadedFile.filename}`;
      const mime = uploadedFile.mimetype || '';
      let msgType = 'document';
      if (mime.startsWith('image/')) msgType = 'image';
      else if (mime.startsWith('audio/')) msgType = 'voice';

      return res.json({
        success: '1',
        status: true,
        media_url: fileUrl,
        url: fileUrl,
        media_name: uploadedFile.originalname,
        name: uploadedFile.originalname,
        media_size: (uploadedFile.size / 1024).toFixed(1) + ' KB',
        size: (uploadedFile.size / 1024).toFixed(1) + ' KB',
        msg_type: msgType,
        type: msgType,
      });
    }

    // Handle base64 upload if sent in JSON body
    const { base64, filename, filetype, msg_type, duration } = req.body;
    if (base64) {
      let cleanBase64 = String(base64).trim();
      let ext = '.jpg';
      let mimeType = '';

      if (cleanBase64.startsWith('data:')) {
        const commaIdx = cleanBase64.indexOf(',');
        if (commaIdx !== -1) {
          const header = cleanBase64.substring(0, commaIdx);
          cleanBase64 = cleanBase64.substring(commaIdx + 1);
          const mimeMatch = header.match(/data:([^;]+)/);
          if (mimeMatch) mimeType = mimeMatch[1];
        }
      }

      if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
      else if (mimeType.includes('png')) ext = '.png';
      else if (mimeType.includes('webp')) ext = '.webp';
      else if (mimeType.includes('audio') || mimeType.includes('webm')) ext = '.webm';
      else if (mimeType.includes('mp3')) ext = '.mp3';
      else if (mimeType.includes('pdf')) ext = '.pdf';
      else if (filename) {
        ext = path.extname(filename) || '.jpg';
      }

      cleanBase64 = cleanBase64.replace(/\s+/g, '');
      const buffer = Buffer.from(cleanBase64, 'base64');

      const safeName = Date.now() + '-' + Math.round(Math.random() * 1e9) + (ext || '');
      const filePath = path.join(chatUploadDir, safeName);
      fs.writeFileSync(filePath, buffer);

      const fileUrl = `/uploads/chat/${safeName}`;
      return res.json({
        success: '1',
        status: true,
        media_url: fileUrl,
        media_name: filename || safeName,
        media_size: (buffer.length / 1024).toFixed(1) + ' KB',
        media_duration: duration || 0,
        msg_type: msg_type || (ext.includes('webm') || ext.includes('mp3') ? 'voice' : 'image'),
      });
    }

    return res.status(400).json({ success: '0', status: false, msg: 'No file or base64 provided' });
  } catch (err) {
    console.error('Error uploading chat attachment:', err);
    return res.status(500).json({ success: '0', status: false, error: err.message });
  }
};

// Get Chat Messages History for a Specific Room / User
exports.getChatHistory = async (req, res) => {
  const roomId = req.params?.room_id || req.query.room_id || req.query.phone || req.user?.phone;
  if (!roomId) {
    return res.status(400).json({ success: '0', msg: 'room_id is required' });
  }

  const cleanRoom = String(roomId).replace(/[^0-9]/g, '').slice(-10) || String(roomId);

  try {
    const limit = parseInt(req.query.limit || '100', 10);
    const [messages] = await db.query(
      `SELECT * FROM support_messages 
       WHERE (room_id = ? OR room_id = ? OR room_id LIKE ?)
       ORDER BY id ASC LIMIT ?`,
      [roomId, cleanRoom, `%${cleanRoom}`, limit]
    );

    // Also fetch user basic info if available
    let userInfo = null;
    try {
      const [u] = await db.query(
        "SELECT id, phone, name, wallet, email FROM user_info WHERE (phone = ? OR phone = ? OR phone LIKE ?) LIMIT 1",
        [roomId, cleanRoom, `%${cleanRoom}`]
      );
      if (u.length > 0) userInfo = u[0];
    } catch (e) {}

    return res.json({
      success: '1',
      status: true,
      room_id: cleanRoom,
      user: userInfo,
      data: messages,
      messages,
    });
  } catch (err) {
    console.error('Error getting chat history:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// Save a Message via REST (fallback or direct POST)
exports.saveMessage = async (req, res) => {
  try {
    const {
      room_id,
      sender_type,
      sender_id,
      sender_name,
      receiver_id,
      message,
      msg_type,
      media_url,
      media_name,
      media_size,
      media_duration
    } = req.body;

    const targetRoom = String(room_id || req.user?.phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!targetRoom) {
      return res.status(400).json({ success: '0', msg: 'room_id is required' });
    }

    const type = msg_type || 'text';
    const sType = sender_type || (req.user?.role === 'admin' ? 'admin' : 'user');
    const sId = sender_id || req.user?.phone || 'admin';
    const sName = sender_name || (sType === 'admin' ? 'Support Admin' : 'User');
    const rId = receiver_id || (sType === 'admin' ? targetRoom : 'admin');
    // Prevent duplicate insertion within 2 seconds
    const [existing] = await db.query(
      `SELECT * FROM support_messages 
       WHERE room_id = ? AND sender_type = ? AND message = ? AND msg_type = ? 
       AND created_at >= NOW() - INTERVAL 2 SECOND 
       ORDER BY id DESC LIMIT 1`,
      [targetRoom, sType, message || '', type]
    );

    if (existing.length > 0) {
      return res.json({ success: '1', status: true, data: existing[0], message: existing[0] });
    }

    const [insertResult] = await db.query(
      `INSERT INTO support_messages 
       (room_id, sender_type, sender_id, sender_name, receiver_id, message, msg_type, media_url, media_name, media_size, media_duration, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
      [
        targetRoom,
        sType,
        sId,
        sName,
        rId,
        message || '',
        type,
        media_url || req.body.url || '',
        media_name || req.body.name || '',
        media_size || req.body.size || '',
        media_duration || 0
      ]
    );

    const [[savedMsg]] = await db.query('SELECT * FROM support_messages WHERE id = ?', [insertResult.insertId]);

    // If global io instance exists, broadcast
    if (global.supportSocketIO) {
      global.supportSocketIO.to(`room_${targetRoom}`).emit('new_message', savedMsg);
      global.supportSocketIO.to('admin_support_channel').emit('new_message', savedMsg);
      global.supportSocketIO.to('admin_support_channel').emit('admin_inbox_update', {
        room_id: targetRoom,
        last_message: savedMsg
      });
    }

    return res.json({ success: '1', status: true, data: savedMsg, message: savedMsg });
  } catch (err) {
    console.error('Error saving message:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// Get List of Active Conversations for Admin (Inbox)
exports.getConversationsList = async (req, res) => {
  try {
    // Group by room_id, find last message, unread count for admin
    const [rooms] = await db.query(`
      SELECT 
        sm.room_id,
        MAX(sm.id) AS last_msg_id,
        COUNT(CASE WHEN sm.sender_type = 'user' AND sm.status != 'read' THEN 1 END) AS unread_count
      FROM support_messages sm
      GROUP BY sm.room_id
      ORDER BY last_msg_id DESC
    `);

    if (rooms.length === 0) {
      return res.json({ success: '1', status: true, data: [], conversations: [] });
    }

    const lastMsgIds = rooms.map(r => r.last_msg_id);
    const [lastMsgs] = await db.query(
      `SELECT * FROM support_messages WHERE id IN (?)`,
      [lastMsgIds]
    );

    const msgMap = {};
    lastMsgs.forEach(m => { msgMap[m.room_id] = m; });

    // Fetch user details for each room
    const phoneList = rooms.map(r => r.room_id);
    const [users] = await db.query(
      `SELECT id, phone, name, wallet, email FROM user_info WHERE phone IN (?)`,
      [phoneList]
    );

    const userMap = {};
    users.forEach(u => {
      userMap[u.phone] = u;
    });

    const conversations = rooms.map(r => {
      const u = userMap[r.room_id] || {};
      const lastMsg = msgMap[r.room_id] || {};
      return {
        room_id: r.room_id,
        phone: r.room_id,
        user_phone: r.room_id,
        name: u.name || lastMsg.sender_name || `User ${r.room_id.slice(-4)}`,
        user_name: u.name || lastMsg.sender_name || `User ${r.room_id.slice(-4)}`,
        username: u.username || '',
        wallet: u.wallet || '0',
        user_wallet: u.wallet || '0',
        profile_pic: u.profile_pic || '',
        unread_count: r.unread_count || 0,
        last_message: lastMsg.message || (lastMsg.msg_type === 'image' ? '📷 Photo' : lastMsg.msg_type === 'voice' ? '🎤 Voice Message' : '📎 Attachment'),
        last_msg_type: lastMsg.msg_type || 'text',
        last_msg_time: lastMsg.created_at || null,
        last_sender: lastMsg.sender_type || 'user'
      };
    });

    return res.json({
      success: '1',
      status: true,
      data: conversations,
      conversations
    });
  } catch (err) {
    console.error('Error getting conversations list:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// Mark Messages as Read
exports.markAsRead = async (req, res) => {
  const { room_id, user_type } = req.body;
  if (!room_id) return res.status(400).json({ success: '0', msg: 'room_id is required' });

  const cleanRoom = String(room_id).replace(/[^0-9]/g, '').slice(-10);
  const readerType = user_type || 'admin'; // If admin is viewing, mark user messages as read

  try {
    const senderToMark = readerType === 'admin' ? 'user' : 'admin';
    await db.query(
      `UPDATE support_messages 
       SET status = 'read' 
       WHERE (room_id = ? OR room_id = ? OR room_id LIKE ?) AND sender_type = ?`,
      [room_id, cleanRoom, `%${cleanRoom}`, senderToMark]
    );

    if (global.supportSocketIO) {
      global.supportSocketIO.to(`room_${cleanRoom}`).emit('messages_read', {
        room_id: cleanRoom,
        by: readerType
      });
    }

    return res.json({ success: '1', status: true, msg: 'Messages marked as read' });
  } catch (err) {
    console.error('Error marking as read:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};
