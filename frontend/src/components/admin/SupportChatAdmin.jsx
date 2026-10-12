import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../../utils/api';

const BACKEND_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/api\/?$/, '');

// Format helper for timestamps
const formatChatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const timeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

  if (isToday) return timeStr;
  
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${timeStr}`;

  return `${d.toLocaleDateString([], { day: '2-digit', month: 'short' })}, ${timeStr}`;
};

// Format bytes
const formatFileSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

// Mini Audio Player Component for Voice Notes
const VoiceMessagePlayer = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration || 0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.log('Audio play error:', e));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setAudioDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const formatSecs = (sec) => {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const fullUrl = (audioUrl?.startsWith('http') || audioUrl?.startsWith('blob:') || audioUrl?.startsWith('data:')) ? audioUrl : `${BACKEND_BASE}${audioUrl}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px', maxWidth: '300px', padding: '6px 2px' }}>
      <audio
        ref={audioRef}
        src={fullUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current && audioRef.current.duration) {
            setAudioDuration(audioRef.current.duration);
          }
        }}
      />
      <button
        type="button"
        onClick={togglePlay}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isPlaying ? '#ef4444' : '#22c55e',
          color: '#ffffff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px'
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <input
          type="range"
          min="0"
          max={audioDuration || 1}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
          style={{
            width: '100%',
            height: '4px',
            accentColor: '#22c55e',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', opacity: 0.85 }}>
          <span>{formatSecs(currentTime)}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span>🎙️</span>
            {formatSecs(audioDuration || duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function SupportChatAdmin({ adminName = 'Admin Support' }) {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userTypingStatus, setUserTypingStatus] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // Socket and Message scroll refs
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const selectedUserRef = useRef(selectedUser);

  // Camera Modal States
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedPhotoBlob, setCapturedPhotoBlob] = useState(null);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversation list from backend
  const fetchConversations = async () => {
    try {
      const res = await api.get('/admin/support/conversations');
      if (res.data && res.data.success === '1') {
        const list = res.data.data || res.data.conversations || [];
        setConversations(list);
      }
    } catch (err) {
      console.error('Error fetching support conversations:', err);
    }
  };

  // Initialize Socket.io connection & Auto-Poll Heartbeat
  useEffect(() => {
    fetchConversations();

    // 4-second heartbeat to guarantee conversations list is always fresh
    const pollInterval = setInterval(() => {
      fetchConversations();
    }, 4000);

    const socket = io(BACKEND_BASE, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 2000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Admin Support Chat Socket connected:', socket.id);
      setSocketConnected(true);
      // Join admin notification channel
      socket.emit('join_room', {
        room_id: 'admin_support_channel',
        role: 'admin',
        user_type: 'admin',
        user_name: adminName
      });
    });

    socket.on('disconnect', () => {
      console.log('Admin Support Chat Socket disconnected');
      setSocketConnected(false);
    });

    // Handle new message in active room OR admin support channel
    socket.on('new_message', (msg) => {
      const activeUser = selectedUserRef.current;
      const activePhone = String(activeUser?.phone || activeUser?.room_id || activeUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
      const msgRoom = String(msg?.room_id || '').replace(/[^0-9]/g, '').slice(-10);

      if (activePhone && msgRoom && activePhone === msgRoom) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          if (msg.sender_type === 'admin') {
            const tempIdx = prev.findIndex(
              (m) =>
                String(m.id).startsWith('temp_') &&
                (m.message === msg.message ||
                  (m.media_name && msg.media_name && m.media_name === msg.media_name) ||
                  (m.media_url && msg.media_url && m.media_url === msg.media_url))
            );
            if (tempIdx !== -1) {
              const copy = [...prev];
              copy[tempIdx] = msg;
              return copy;
            }
          }
          return [...prev, msg];
        });
        // Auto mark as read
        if (msg.sender_type !== 'admin') {
          socket.emit('mark_read', { room_id: msgRoom, reader_type: 'admin' });
        }
      }

      // Refresh inbox list immediately
      fetchConversations();
    });

    // Handle incoming updates for inbox list
    socket.on('admin_inbox_update', (data) => {
      fetchConversations();
    });

    // Handle typing indicator from user
    socket.on('user_typing', ({ room_id, is_typing }) => {
      const activeUser = selectedUserRef.current;
      const activePhone = String(activeUser?.phone || activeUser?.room_id || activeUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
      const cleanRoom = String(room_id || '').replace(/[^0-9]/g, '').slice(-10);
      if (activePhone && cleanRoom && activePhone === cleanRoom) {
        setUserTypingStatus(is_typing);
      }
    });

    // Handle read receipt update
    socket.on('messages_read', ({ room_id, reader_type }) => {
      const activeUser = selectedUserRef.current;
      const activePhone = String(activeUser?.phone || activeUser?.room_id || activeUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
      const cleanRoom = String(room_id || '').replace(/[^0-9]/g, '').slice(-10);
      if (reader_type === 'user' && activePhone && cleanRoom && activePhone === cleanRoom) {
        setMessages((prev) =>
          prev.map((m) => (m.sender_type === 'admin' ? { ...m, status: 'read' } : m))
        );
      }
    });

    return () => {
      clearInterval(pollInterval);
      socket.disconnect();
    };
  }, [adminName]);

  // When selectedUser changes: fetch messages and join room
  useEffect(() => {
    if (!selectedUser) return;

    setUserTypingStatus(false);
    setLoadingHistory(true);

    const cleanPhone = String(selectedUser?.phone || selectedUser?.room_id || selectedUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone) {
      setLoadingHistory(false);
      return;
    }

    // Join room on socket
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('join_room', {
        room_id: cleanPhone,
        role: 'admin',
        user_name: adminName
      });
      socketRef.current.emit('mark_read', {
        room_id: cleanPhone,
        reader_type: 'admin'
      });
    }

    // Fetch history from REST API
    api.get(`/admin/support/history/${cleanPhone}`)
      .then((res) => {
        if (res.data && res.data.success === '1') {
          setMessages(res.data.data || []);
          // Clear unread badge in local list
          setConversations((prev) =>
            prev.map((c) => {
              const cPhone = String(c.phone || c.room_id || c.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
              return cPhone === cleanPhone ? { ...c, unread_count: 0 } : c;
            })
          );
        }
      })
      .catch((err) => {
        console.error('Error fetching chat history:', err);
      })
      .finally(() => {
        setLoadingHistory(false);
        setTimeout(() => scrollToBottom('auto'), 150);
      });
  }, [selectedUser, adminName]);

  // Handle typing debounce
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!selectedUser || !socketRef.current) return;
    const cleanPhone = String(selectedUser.phone).replace(/[^0-9]/g, '').slice(-10);

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', { room_id: cleanPhone, sender_type: 'admin', is_typing: true });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current.emit('typing', { room_id: cleanPhone, sender_type: 'admin', is_typing: false });
    }, 1500);
  };

  // Send Text Message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedUser) return;

    setInputText('');
    const cleanPhone = String(selectedUser?.phone || selectedUser?.room_id || selectedUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone) return;

    const msgPayload = {
      room_id: cleanPhone,
      sender_type: 'admin',
      sender_id: 'admin',
      sender_name: adminName || 'Support Admin',
      receiver_id: selectedUser.id || cleanPhone,
      message: text,
      msg_type: 'text'
    };

    // Optimistic local add
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      ...msgPayload,
      id: tempId,
      status: 'sent',
      created_at: new Date().toISOString()
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    // Send via socket if connected, else fallback to REST
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', msgPayload);
    } else {
      try {
        await api.post('/admin/support/send', msgPayload);
      } catch (err) {
        console.log('Admin send note:', err);
      }
    }

    // Refresh inbox list
    fetchConversations();
  };

  // Upload and Send File/Image (Reusable for file picker, camera photo, etc.)
  const uploadAndSendFile = async (file, type = 'file') => {
    if (!file || !selectedUser) return;

    const cleanPhone = String(selectedUser?.phone || selectedUser?.room_id || selectedUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
    if (!cleanPhone) return;

    setUploading(true);

    const isImg = type === 'image' || file.type?.startsWith('image/');
    const localPreviewUrl = isImg ? URL.createObjectURL(file) : null;
    const tempId = `temp_${Date.now()}`;

    // Optimistic message placeholder so user sees image/file immediately
    const optimisticMsg = {
      id: tempId,
      room_id: cleanPhone,
      sender_type: 'admin',
      sender_id: 'admin',
      sender_name: adminName || 'Support Admin',
      receiver_id: selectedUser.id || cleanPhone,
      message: file.name,
      msg_type: isImg ? 'image' : 'document',
      media_url: localPreviewUrl || '',
      media_name: file.name,
      media_size: `${(file.size / 1024).toFixed(1)} KB`,
      status: 'sending',
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('room_id', cleanPhone);

      const res = await api.post('/admin/support/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && (res.data.success === '1' || res.data.success === true || res.data.status === true)) {
        const fileData = res.data;
        const mediaUrl = fileData.media_url || fileData.url;
        const mediaName = fileData.media_name || fileData.name || file.name;
        const mediaSize = fileData.media_size || fileData.size || `${(file.size / 1024).toFixed(1)} KB`;
        const resolvedType = fileData.msg_type || fileData.type || (isImg ? 'image' : 'document');

        const msgPayload = {
          room_id: cleanPhone,
          sender_type: 'admin',
          sender_id: 'admin',
          sender_name: adminName || 'Support Admin',
          receiver_id: selectedUser.id || cleanPhone,
          message: file.name,
          msg_type: resolvedType,
          media_url: mediaUrl,
          media_name: mediaName,
          media_size: mediaSize
        };

        // Update optimistic item with real media_url and mark as sent
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, ...msgPayload, id: tempId, status: 'sent' } : m
          )
        );

        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('send_message', msgPayload);
        } else {
          await api.post('/admin/support/send', msgPayload);
        }

        fetchConversations();
      } else {
        throw new Error(res.data?.msg || 'Upload failed');
      }
    } catch (err) {
      console.error('Error uploading attachment:', err);
      alert('Failed to upload file. Please try again.');
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setUploading(false);
    }
  };

  // Triggered by hidden file inputs
  const handleFileUpload = async (e, type = 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser) return;
    e.target.value = ''; // Reset input
    await uploadAndSendFile(file, type);
  };

  // Open Camera Modal (Webcam live stream) with auto-fallback to file picker
  const handleCameraClick = async () => {
    if (!selectedUser) {
      alert('Please select a conversation first.');
      return;
    }

    // Check if getUserMedia is available in this browser environment
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      cameraInputRef.current?.click();
      return;
    }

    setCameraError(null);
    setCapturedPhotoBlob(null);
    setCapturedPhotoPreview(null);
    setShowCameraModal(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      setCameraStream(stream);
    } catch (err) {
      console.warn('Camera access could not be initialized:', err);
      setCameraError(
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera permission was denied. Please allow camera access in browser settings or choose a photo from files.'
          : 'Could not access camera. You can choose a photo from your computer.'
      );
    }
  };

  // Bind video element whenever modal is shown and stream is ready
  useEffect(() => {
    if (showCameraModal && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch((e) => console.log('Video play caught:', e));
    }
  }, [showCameraModal, cameraStream]);

  // Close Camera Modal and stop stream tracks
  const closeCameraModal = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (capturedPhotoPreview) {
      URL.revokeObjectURL(capturedPhotoPreview);
      setCapturedPhotoPreview(null);
    }
    setCapturedPhotoBlob(null);
    setCameraError(null);
    setShowCameraModal(false);
  };

  // Capture snapshot from webcam video
  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        setCapturedPhotoBlob(blob);
        setCapturedPhotoPreview(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.9);
  };

  // Retake photo
  const retakeSnapshot = () => {
    if (capturedPhotoPreview) {
      URL.revokeObjectURL(capturedPhotoPreview);
    }
    setCapturedPhotoBlob(null);
    setCapturedPhotoPreview(null);
  };

  // Send the captured snapshot photo
  const sendCapturedSnapshot = async () => {
    if (!capturedPhotoBlob || !selectedUser) return;
    const photoBlob = capturedPhotoBlob;
    closeCameraModal();

    const file = new File([photoBlob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
    await uploadAndSendFile(file, 'image');
  };

  // Start Live Audio Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingSeconds(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recorder:', err);
      alert('Microphone access is required to record voice notes.');
    }
  };

  // Cancel Audio Recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  // Send Audio Recording
  const sendRecording = () => {
    if (!mediaRecorderRef.current || !selectedUser) return;
    const finalSeconds = recordingSeconds;

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      mediaRecorderRef.current.stream?.getTracks().forEach((track) => track.stop());

      setUploading(true);
      const cleanPhone = String(selectedUser?.phone || selectedUser?.room_id || selectedUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
      if (!cleanPhone) {
        setUploading(false);
        return;
      }

      const tempId = `temp_${Date.now()}`;
      const localAudioUrl = URL.createObjectURL(audioBlob);
      const fileName = `voice_${Date.now()}.webm`;

      const optimisticMsg = {
        id: tempId,
        room_id: cleanPhone,
        sender_type: 'admin',
        sender_id: 'admin',
        sender_name: adminName || 'Support Admin',
        receiver_id: selectedUser.id || cleanPhone,
        message: 'Voice Note',
        msg_type: 'voice',
        media_url: localAudioUrl,
        media_name: fileName,
        media_size: audioBlob.size,
        media_duration: finalSeconds,
        status: 'sending',
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      setTimeout(() => scrollToBottom(), 50);

      try {
        const formData = new FormData();
        formData.append('file', audioBlob, fileName);
        formData.append('room_id', cleanPhone);
        formData.append('duration', finalSeconds);

        const res = await api.post('/admin/support/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.data && (res.data.success === '1' || res.data.success === true || res.data.status === true)) {
          const fileData = res.data;
          const mediaUrl = fileData.media_url || fileData.url;
          const msgPayload = {
            room_id: cleanPhone,
            sender_type: 'admin',
            sender_id: 'admin',
            sender_name: adminName || 'Support Admin',
            receiver_id: selectedUser.id || cleanPhone,
            message: 'Voice Note',
            msg_type: 'voice',
            media_url: mediaUrl,
            media_name: fileData.media_name || fileName,
            media_size: audioBlob.size,
            media_duration: finalSeconds
          };

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId ? { ...m, ...msgPayload, id: tempId, status: 'sent' } : m
            )
          );

          if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('send_message', msgPayload);
          } else {
            await api.post('/admin/support/send', msgPayload);
          }

          fetchConversations();
        } else {
          throw new Error('Upload voice note failed');
        }
      } catch (err) {
        console.error('Error sending voice note:', err);
        alert('Failed to send voice recording.');
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      } finally {
        setUploading(false);
        setIsRecording(false);
        setRecordingSeconds(0);
      }
    };

    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    mediaRecorderRef.current.stop();
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (c.name || c.user_name || '').toLowerCase().includes(q);
    const phoneMatch = String(c.phone || c.room_id || '').includes(q);
    const userMatch = (c.username || '').toLowerCase().includes(q);
    return nameMatch || phoneMatch || userMatch;
  });

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 120px)',
      minHeight: '620px',
      backgroundColor: '#1b202e',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
    }}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'document')}
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e, 'image')}
      />

      {/* 1. LEFT SIDEBAR: Conversations List */}
      <div style={{
        width: '360px',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: '#222736',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#2a3042',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>💬</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: '#ffffff' }}>Support Chat</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: socketConnected ? '#22c55e' : '#f59e0b' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: socketConnected ? '#22c55e' : '#f59e0b',
                  display: 'inline-block'
                }}></span>
                <span>{socketConnected ? 'Real-time Connected' : 'Connecting...'}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={fetchConversations}
            title="Refresh Conversations"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '6px',
              color: '#a6b0cf',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            🔄
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#1b202e',
            borderRadius: '8px',
            padding: '6px 12px',
            gap: '8px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ color: '#74788d', fontSize: '0.9rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Search user by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#74788d', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Conversation List Items */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#74788d' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
              <p style={{ margin: 0, fontSize: '0.88rem' }}>No active support chats found</p>
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', opacity: 0.7 }}>Users who message from the app will appear here instantly</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const convPhone = String(conv.phone || conv.room_id || conv.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
              const selPhone = String(selectedUser?.phone || selectedUser?.room_id || selectedUser?.user_phone || '').replace(/[^0-9]/g, '').slice(-10);
              const isSelected = selectedUser && selPhone && selPhone === convPhone;
              const displayName = conv.name || conv.user_name || conv.username || `User ${convPhone.slice(-4)}`;
              const initials = displayName.slice(0, 2).toUpperCase();
              const hasUnread = (conv.unread_count || 0) > 0;

              return (
                <div
                  key={convPhone || conv.room_id}
                  onClick={() => setSelectedUser({ ...conv, phone: convPhone, room_id: convPhone })}
                  style={{
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#2f384f' : 'transparent',
                    borderLeft: isSelected ? '4px solid #22c55e' : '4px solid transparent',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#556ee6',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}>
                    {initials}
                  </div>

                  {/* Info Column */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{
                        color: '#ffffff',
                        fontWeight: hasUnread ? '700' : '600',
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {displayName}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: hasUnread ? '#22c55e' : '#74788d', flexShrink: 0 }}>
                        {formatChatTime(conv.last_message_time)}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        color: hasUnread ? '#d1d5db' : '#8890a5',
                        fontSize: '0.78rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px'
                      }}>
                        {conv.last_msg_type === 'image' && '📷 Photo'}
                        {conv.last_msg_type === 'voice' && '🎙️ Voice note'}
                        {conv.last_msg_type === 'document' && '📄 Document'}
                        {(!conv.last_msg_type || conv.last_msg_type === 'text') && (conv.last_message || `📱 ${conv.phone}`)}
                      </span>

                      {/* Unread count badge */}
                      {hasUnread && (
                        <span style={{
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          fontSize: '0.68rem',
                          fontWeight: 'bold',
                          borderRadius: '10px',
                          padding: '1px 6px',
                          minWidth: '18px',
                          textAlign: 'center'
                        }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT MAIN CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#131824' }}>
        {!selectedUser ? (
          /* Empty Chat Placeholder */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#74788d',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              backgroundColor: '#222736',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              marginBottom: '20px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
            }}>
              💬
            </div>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px', fontSize: '1.25rem' }}>Bhau Matka Support Center</h3>
            <p style={{ maxWidth: '440px', fontSize: '0.88rem', lineHeight: '1.5', margin: 0 }}>
              Select a conversation from the left to start live chatting with app users. You can exchange instant messages, photos, live voice recordings, and receipts.
            </p>
          </div>
        ) : (
          /* Active Chat View */
          <>
            {/* Chat Header */}
            <div style={{
              height: '66px',
              backgroundColor: '#222736',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '0 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#556ee6',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }}>
                  {(selectedUser.name || selectedUser.user_name || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: '#ffffff' }}>
                      {selectedUser.name || selectedUser.user_name || `User ${selectedUser.phone}`}
                    </h3>
                    <span style={{
                      backgroundColor: 'rgba(34,197,94,0.15)',
                      color: '#22c55e',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '4px',
                      padding: '1px 6px',
                      fontSize: '0.72rem',
                      fontWeight: '600'
                    }}>
                      ₹ {parseFloat(selectedUser.wallet || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#8890a5', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📱 {selectedUser.phone}</span>
                    {userTypingStatus && (
                      <span style={{ color: '#22c55e', fontStyle: 'italic', fontWeight: 'bold' }}>
                        typing...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Header Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedUser.phone);
                    alert(`Copied phone: ${selectedUser.phone}`);
                  }}
                  title="Copy Phone Number"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  📋 Copy Phone
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cleanPhone = String(selectedUser.phone).replace(/[^0-9]/g, '').slice(-10);
                    api.get(`/admin/support/history/${cleanPhone}`).then((res) => {
                      if (res.data?.success === '1') setMessages(res.data.data || []);
                    });
                  }}
                  title="Refresh Chat"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Chat Messages Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              backgroundColor: '#10141d',
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}>
              {loadingHistory ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: '#8890a5' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⏳</div>
                  <span style={{ fontSize: '0.85rem' }}>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ margin: 'auto', textAlign: 'center', color: '#74788d' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👋</div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#ffffff' }}>No messages yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.78rem' }}>Send a welcome message to assist this customer</p>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isAdmin = m.sender_type === 'admin';
                  const rawMediaUrl = m.media_url || '';
                  const fullMediaUrl = (rawMediaUrl.startsWith('http') || rawMediaUrl.startsWith('blob:') || rawMediaUrl.startsWith('data:'))
                    ? rawMediaUrl
                    : rawMediaUrl ? `${BACKEND_BASE}${rawMediaUrl}` : '';

                  return (
                    <div
                      key={m.id || idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        minWidth: '140px',
                        backgroundColor: isAdmin ? '#005c4b' : '#202c33',
                        color: '#ffffff',
                        borderRadius: isAdmin ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                        padding: '8px 12px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                        position: 'relative'
                      }}>
                        {/* Sender Label */}
                        <div style={{
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          color: isAdmin ? '#86efac' : '#93c5fd',
                          marginBottom: '4px'
                        }}>
                          {isAdmin ? 'Support Admin' : (m.sender_name || 'Customer')}
                        </div>

                        {/* Image Message */}
                        {m.msg_type === 'image' && (
                          <div style={{ marginBottom: '6px' }}>
                            {fullMediaUrl ? (
                              <img
                                src={fullMediaUrl}
                                alt="Attachment"
                                onClick={() => setPreviewImage(fullMediaUrl)}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '280px',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  objectFit: 'cover',
                                  display: 'block'
                                }}
                              />
                            ) : (
                              <div style={{ padding: '8px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                <span>🖼️ Image Attachment</span>
                              </div>
                            )}
                            {m.message && m.message !== 'Image Attachment' && m.message !== m.media_name && !m.message.startsWith('camera_') && (
                              <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>{m.message}</p>
                            )}
                          </div>
                        )}

                        {/* Voice Note Message */}
                        {m.msg_type === 'voice' && (
                          <div style={{ marginBottom: '4px' }}>
                            <VoiceMessagePlayer audioUrl={fullMediaUrl} duration={m.media_duration} />
                          </div>
                        )}

                        {/* Document Message */}
                        {m.msg_type === 'document' && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            marginBottom: '4px'
                          }}>
                            <span style={{ fontSize: '1.6rem' }}>📄</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                margin: 0,
                                fontSize: '0.85rem',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {m.media_name || m.message || 'Attached Document'}
                              </p>
                              {m.media_size && (
                                <span style={{ fontSize: '0.7rem', opacity: 0.75 }}>
                                  {formatFileSize(m.media_size)}
                                </span>
                              )}
                            </div>
                            <a
                              href={fullMediaUrl}
                              target="_blank"
                              rel="noreferrer"
                              download
                              style={{
                                backgroundColor: '#22c55e',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '4px 10px',
                                fontSize: '0.75rem',
                                textDecoration: 'none',
                                fontWeight: 'bold'
                              }}
                            >
                              Download
                            </a>
                          </div>
                        )}

                        {/* Standard Text Message */}
                        {(!m.msg_type || m.msg_type === 'text') && (
                          <p style={{
                            margin: 0,
                            fontSize: '0.88rem',
                            lineHeight: '1.4',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                            {m.message}
                          </p>
                        )}

                        {/* Timestamp & Status Ticks */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px',
                          marginTop: '4px',
                          fontSize: '0.68rem',
                          color: 'rgba(255,255,255,0.65)'
                        }}>
                          <span>{formatChatTime(m.created_at)}</span>
                          {isAdmin && (
                            <span style={{ color: m.status === 'read' ? '#53bdeb' : 'rgba(255,255,255,0.65)', fontWeight: 'bold' }}>
                              {m.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area */}
            <div style={{
              backgroundColor: '#202636',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}>
              {isRecording ? (
                /* Active Audio Recording Bar */
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#171b26',
                  borderRadius: '24px',
                  padding: '8px 18px',
                  border: '1px solid #ef4444'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'inline-block',
                      animation: 'pulse 1s infinite'
                    }}></span>
                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.88rem' }}>
                      Recording Voice Note...
                    </span>
                    <span style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.88rem' }}>
                      {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={cancelRecording}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #74788d',
                        borderRadius: '16px',
                        color: '#ef4444',
                        padding: '4px 12px',
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={sendRecording}
                      disabled={uploading}
                      style={{
                        backgroundColor: '#22c55e',
                        border: 'none',
                        borderRadius: '16px',
                        color: '#ffffff',
                        padding: '6px 16px',
                        fontSize: '0.82rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {uploading ? 'Sending...' : 'Send Voice Note ➤'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Message Input Bar */
                <>
                  {/* Camera / Photo Button */}
                  <button
                    type="button"
                    onClick={handleCameraClick}
                    title="Open Camera / Take Photo"
                    disabled={uploading}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    📷
                  </button>

                  {/* Attachment / Document Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach File or Document"
                    disabled={uploading}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    📎
                  </button>

                  {/* Voice Record Button */}
                  <button
                    type="button"
                    onClick={startRecording}
                    title="Record Voice Note"
                    disabled={uploading}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.15rem',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    🎙️
                  </button>

                  {/* Text Input Field */}
                  <form onSubmit={handleSendMessage} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Type a message to customer... (Press Enter to send)"
                      value={inputText}
                      onChange={handleInputChange}
                      disabled={uploading}
                      style={{
                        width: '100%',
                        backgroundColor: '#171b26',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '24px',
                        padding: '10px 18px',
                        color: '#ffffff',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </form>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || uploading}
                    title="Send Message"
                    style={{
                      backgroundColor: inputText.trim() ? '#22c55e' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '42px',
                      height: '42px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      color: '#ffffff',
                      cursor: inputText.trim() ? 'pointer' : 'default',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ➤
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Camera Capture Modal */}
      {showCameraModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#1e2433',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#252c3e'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.3rem' }}>📷</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 'bold' }}>
                    {capturedPhotoPreview ? 'Review Photo' : 'Camera'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {capturedPhotoPreview
                      ? 'Ready to send to customer'
                      : 'Live preview — Snap a photo or choose from files'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCameraModal}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body / Camera Viewport */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {capturedPhotoPreview ? (
                /* Captured Image Preview */
                <div style={{ width: '100%', maxHeight: '380px', overflow: 'hidden', borderRadius: '12px', border: '2px solid #22c55e', backgroundColor: '#000' }}>
                  <img
                    src={capturedPhotoPreview}
                    alt="Captured snapshot"
                    style={{ width: '100%', maxHeight: '380px', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              ) : cameraError ? (
                /* Camera Error / Permission Fallback */
                <div
                  style={{
                    width: '100%',
                    padding: '30px 20px',
                    textAlign: 'center',
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.25)'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚠️</div>
                  <p style={{ color: '#fca5a5', fontSize: '0.92rem', margin: '0 0 16px', lineHeight: 1.5 }}>
                    {cameraError}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCameraModal();
                      cameraInputRef.current?.click();
                    }}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    📁 Choose Photo from Files
                  </button>
                </div>
              ) : (
                /* Live Video Feed */
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxHeight: '380px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    backgroundColor: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: '100%', maxHeight: '380px', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.72rem',
                      color: '#22c55e'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#22c55e',
                        display: 'inline-block'
                      }}
                    ></span>
                    <span>LIVE CAMERA</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                style={{
                  width: '100%',
                  marginTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                {capturedPhotoPreview ? (
                  <>
                    <button
                      type="button"
                      onClick={retakeSnapshot}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      🔄 Retake
                    </button>
                    <button
                      type="button"
                      onClick={sendCapturedSnapshot}
                      disabled={uploading}
                      style={{
                        flex: 2,
                        padding: '12px',
                        borderRadius: '10px',
                        backgroundColor: '#22c55e',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                      }}
                    >
                      {uploading ? 'Sending Photo...' : '🚀 Send Photo ➤'}
                    </button>
                  </>
                ) : !cameraError ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        closeCameraModal();
                        cameraInputRef.current?.click();
                      }}
                      style={{
                        padding: '12px 18px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#cbd5e1',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      🖼️ Choose File Instead
                    </button>
                    <button
                      type="button"
                      onClick={takeSnapshot}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        borderRadius: '10px',
                        backgroundColor: '#3b82f6',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
                      }}
                    >
                      <span>📸</span>
                      <span>Capture Photo</span>
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Enlarged Preview"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: '8px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
