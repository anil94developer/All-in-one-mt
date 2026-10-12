const db = require('../config/db');

module.exports = function initSupportSocket(io) {
  global.supportSocketIO = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] New client connected: ${socket.id}`);

    // Join room (e.g. room_9988776655)
    // Join room (e.g. room_9988776655 or admin_support_channel)
    socket.on('join_room', async (data) => {
      try {
        const { room_id, user_type, role, user_name } = data || {};
        if (!room_id) return;

        const isAdmin = user_type === 'admin' || role === 'admin' || room_id === 'admin_support_channel';
        if (isAdmin) {
          socket.join('admin_support_channel');
          console.log(`[Socket.io] Admin socket ${socket.id} joined admin_support_channel`);
        }

        if (room_id !== 'admin_support_channel') {
          const cleanRoom = String(room_id).replace(/[^0-9]/g, '').slice(-10);
          if (cleanRoom) {
            const roomName = `room_${cleanRoom}`;
            socket.join(roomName);
            console.log(`[Socket.io] Socket ${socket.id} joined ${roomName} as ${role || user_type || 'user'}`);

            io.to(roomName).emit('user_status', {
              room_id: cleanRoom,
              user_type: role || user_type || 'user',
              status: 'online',
              socket_id: socket.id
            });
          }
        }
      } catch (err) {
        console.error('Error in join_room:', err);
      }
    });

    // Send Message Event
    socket.on('send_message', async (data, ack) => {
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
          media_duration,
        } = data || {};

        const cleanRoom = String(room_id || sender_id || '').replace(/[^0-9]/g, '').slice(-10);
        if (!cleanRoom) {
          if (typeof ack === 'function') ack({ success: false, error: 'room_id required' });
          return;
        }

        const type = msg_type || 'text';
        const sType = sender_type || 'user';
        const sId = sender_id || cleanRoom;
        const sName = sender_name || (sType === 'admin' ? 'Support Admin' : 'User');
        const rId = receiver_id || (sType === 'admin' ? cleanRoom : 'admin');

        // Prevent duplicate insertion within 2 seconds
        const [existing] = await db.query(
          `SELECT * FROM support_messages 
           WHERE room_id = ? AND sender_type = ? AND message = ? AND msg_type = ? 
           AND created_at >= NOW() - INTERVAL 2 SECOND 
           ORDER BY id DESC LIMIT 1`,
          [cleanRoom, sType, message || '', type]
        );

        if (existing.length > 0) {
          if (typeof ack === 'function') ack({ success: true, data: existing[0] });
          return;
        }

        // Insert message into DB
        const [result] = await db.query(
          `INSERT INTO support_messages 
           (room_id, sender_type, sender_id, sender_name, receiver_id, message, msg_type, media_url, media_name, media_size, media_duration, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
          [
            cleanRoom,
            sType,
            sId,
            sName,
            rId,
            message || '',
            type,
            media_url || data.url || '',
            media_name || data.name || '',
            media_size || data.size || '',
            media_duration || 0,
          ]
        );

        const [[savedMsg]] = await db.query('SELECT * FROM support_messages WHERE id = ?', [result.insertId]);

        const roomName = `room_${cleanRoom}`;
        // Broadcast to user room AND admin support channel
        io.to(roomName).emit('new_message', savedMsg);
        io.to('admin_support_channel').emit('new_message', savedMsg);

        // Also notify the admin channel for live inbox update
        io.to('admin_support_channel').emit('admin_inbox_update', {
          room_id: cleanRoom,
          last_message: savedMsg,
          unread_delta: sType === 'user' ? 1 : 0
        });

        if (typeof ack === 'function') ack({ success: true, data: savedMsg });
      } catch (err) {
        console.error('Error in send_message socket event:', err);
        if (typeof ack === 'function') ack({ success: false, error: err.message });
      }
    });

    // Typing Indicator
    socket.on('typing', (data) => {
      const { room_id, sender_type, is_typing } = data || {};
      if (!room_id) return;
      const cleanRoom = String(room_id).replace(/[^0-9]/g, '').slice(-10);
      socket.to(`room_${cleanRoom}`).emit('user_typing', {
        room_id: cleanRoom,
        sender_type,
        is_typing: Boolean(is_typing),
      });
    });

    // Mark as Read
    socket.on('mark_read', async (data) => {
      try {
        const { room_id, user_type } = data || {};
        if (!room_id) return;
        const cleanRoom = String(room_id).replace(/[^0-9]/g, '').slice(-10);
        const reader = user_type || 'admin';
        const targetSender = reader === 'admin' ? 'user' : 'admin';

        await db.query(
          `UPDATE support_messages 
           SET status = 'read' 
           WHERE (room_id = ? OR room_id = ?) AND sender_type = ?`,
          [room_id, cleanRoom, targetSender]
        );

        io.to(`room_${cleanRoom}`).emit('messages_read', {
          room_id: cleanRoom,
          by: reader
        });
      } catch (err) {
        console.error('Error in mark_read socket event:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};
