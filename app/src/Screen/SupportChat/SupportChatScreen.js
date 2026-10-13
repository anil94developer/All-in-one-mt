/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Keyboard,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { WebView } from 'react-native-webview';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker, { types } from 'react-native-document-picker';
import axios from 'axios';

import { useAppSetting } from '../../context/AppSettingContext';
import { useLanguage } from '../../context/LanguageContext';
import { domainUrl, base } from '../../config/appConfig';
import {
  BackArrow,
  WhatsAppGreenIcon,
  ClipIcon,
  SendPaperPlaneIcon,
} from '../../component/MatkaIcons';
import {
  postDataContent,
  postDataJson,
  getData,
  getActiveHost,
  setActiveHost,
  KNOWN_HOSTS,
} from '../../services/Ops';

// Candidate backend hosts for resilient connectivity on physical devices & emulators
const CANDIDATE_HOSTS = [
  'http://10.136.70.89:5001',
  'http://localhost:5001',
  'http://10.0.2.2:5001',
  'http://192.168.2.1:5001',
];

const resolveMediaUrl = (url, activeHostUrl) => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('file://')) {
    return url;
  }
  const currentHost = getActiveHost() || activeHostUrl || domainUrl;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (url.includes('localhost:5001') && currentHost && !currentHost.includes('localhost')) {
      return url.replace('http://localhost:5001', currentHost);
    }
    return url;
  }
  return `${currentHost}${url.startsWith('/') ? '' : '/'}${url}`;
};

const formatAudioTime = (seconds) => {
  if (isNaN(seconds) || seconds === null || seconds === undefined || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

// Audio Recording & Playback HTML Engine for WebView (Dual DOM Audio + Web Audio API fallback)
const AUDIO_BRIDGE_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
    var mediaRecorder = null;
    var audioChunks = [];
    var recStartTime = 0;
    var activeAudio = null;
    var audioCtx = null;
    var currentSource = null;

    function getAudioStream() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices.getUserMedia({ audio: true });
      }
      var legacyGetUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      if (legacyGetUserMedia) {
        return new Promise(function(resolve, reject) {
          legacyGetUserMedia.call(navigator, { audio: true }, resolve, reject);
        });
      }
      return Promise.reject(new Error("Microphone API not available in WebView"));
    }

    function getAudioContext() {
      try {
        if (!audioCtx) {
          var AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      } catch (e) {
        console.warn('AudioContext init note:', e);
      }
      return audioCtx;
    }

    window.startRecording = async function() {
      try {
        var stream = await getAudioStream();
        audioChunks = [];
        var mimeType = 'audio/webm';
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
          if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm';
          else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
          else if (MediaRecorder.isTypeSupported('audio/aac')) mimeType = 'audio/aac';
          else mimeType = '';
        }
        mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType: mimeType }) : new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(e) {
          if (e.data && e.data.size > 0) audioChunks.push(e.data);
        };
        mediaRecorder.onstop = function() {
          var duration = Math.max(1, Math.round((Date.now() - recStartTime) / 1000));
          var outType = mimeType || 'audio/webm';
          var blob = new Blob(audioChunks, { type: outType });
          var reader = new FileReader();
          reader.onloadend = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUDIO_RECORDED',
              base64: reader.result,
              duration: duration
            }));
          };
          reader.readAsDataURL(blob);
        };
        mediaRecorder.start(100);
        recStartTime = Date.now();
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RECORDING_STARTED' }));
      } catch (err) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'RECORDING_ERROR', error: err.message }));
      }
    };

    window.stopRecording = function() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(function(t) { t.stop(); });
        }
      }
    };

    window.cancelRecording = function() {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        audioChunks = [];
        mediaRecorder.stop();
        if (mediaRecorder.stream) {
          mediaRecorder.stream.getTracks().forEach(function(t) { t.stop(); });
        }
      }
    };

    var currentUrl = null;
    var cachedBuffers = {};
    var webAudioTimer = null;
    var webAudioStartTime = 0;
    var webAudioDuration = 0;

    window.playAudio = function(url, startTime) {
      window.stopAnyAudio();
      currentUrl = url;
      var startOffset = (typeof startTime === 'number' && startTime > 0) ? startTime : 0;
      var played = false;

      try {
        var player = document.getElementById('globalVoicePlayer');
        if (!player) {
          player = document.createElement('audio');
          player.id = 'globalVoicePlayer';
          player.setAttribute('playsinline', 'true');
          player.setAttribute('preload', 'auto');
          document.body.appendChild(player);
        }

        activeAudio = player;
        player.src = url;
        player.load();

        if (startOffset > 0) {
          try { player.currentTime = startOffset; } catch(e){}
        }

        player.onplay = function() {
          played = true;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUDIO_PLAYING',
            url: url,
            currentTime: player.currentTime || startOffset,
            duration: player.duration || 0
          }));
        };

        player.ontimeupdate = function() {
          if (player.duration) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUDIO_TIME_UPDATE',
              currentTime: player.currentTime,
              duration: player.duration,
              url: url
            }));
          }
        };

        player.onloadedmetadata = function() {
          if (startOffset > 0 && player.currentTime < startOffset) {
            try { player.currentTime = startOffset; } catch(e){}
          }
          if (player.duration) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUDIO_TIME_UPDATE',
              currentTime: player.currentTime || startOffset,
              duration: player.duration,
              url: url
            }));
          }
        };

        player.onended = function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'AUDIO_ENDED', url: url }));
        };

        player.onerror = function(e) {
          if (!played) {
            console.log('DOM audio failed, falling back to Web Audio API...');
            playWithWebAudio(url, startOffset);
          }
        };

        var p = player.play();
        if (p !== undefined) {
          p.catch(function(err) {
            if (!played) {
              console.log('play() rejected, falling back to Web Audio API...', err);
              playWithWebAudio(url, startOffset);
            }
          });
        }
      } catch (e) {
        playWithWebAudio(url, startOffset);
      }
    };

    function playWithWebAudio(url, startTime) {
      try {
        var ctx = getAudioContext();
        if (!ctx) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUDIO_PLAY_ERROR',
            error: 'Audio engine unavailable',
            url: url
          }));
          return;
        }

        var offset = (typeof startTime === 'number' && startTime > 0) ? startTime : 0;

        function startDecodedBuffer(decoded) {
          if (currentSource) {
            try { currentSource.stop(); } catch(e){}
          }
          var source = ctx.createBufferSource();
          source.buffer = decoded;
          source.connect(ctx.destination);
          webAudioDuration = decoded.duration;
          webAudioStartTime = ctx.currentTime - offset;

          source.onended = function() {
            if (webAudioTimer) clearInterval(webAudioTimer);
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'AUDIO_ENDED', url: url }));
          };

          source.start(0, Math.min(offset, decoded.duration));
          currentSource = source;

          if (webAudioTimer) clearInterval(webAudioTimer);
          webAudioTimer = setInterval(function() {
            if (currentSource) {
              var cur = Math.min(webAudioDuration, Math.max(0, ctx.currentTime - webAudioStartTime));
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'AUDIO_TIME_UPDATE',
                currentTime: cur,
                duration: webAudioDuration,
                url: url
              }));
            } else {
              clearInterval(webAudioTimer);
            }
          }, 200);

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUDIO_PLAYING',
            url: url,
            currentTime: offset,
            duration: webAudioDuration
          }));
        }

        if (cachedBuffers[url]) {
          startDecodedBuffer(cachedBuffers[url]);
          return;
        }

        fetch(url)
          .then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.arrayBuffer();
          })
          .then(function(buf) {
            return ctx.decodeAudioData(buf);
          })
          .then(function(decoded) {
            cachedBuffers[url] = decoded;
            startDecodedBuffer(decoded);
          })
          .catch(function(fetchErr) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUDIO_PLAY_ERROR',
              error: fetchErr.message || String(fetchErr),
              url: url
            }));
          });
      } catch (ex) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'AUDIO_PLAY_ERROR',
          error: ex.message,
          url: url
        }));
      }
    }

    window.seekAudio = function(seconds) {
      var target = Math.max(0, Number(seconds) || 0);
      var player = document.getElementById('globalVoicePlayer');
      if (player && player.src && !player.error) {
        try {
          player.currentTime = target;
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'AUDIO_TIME_UPDATE',
            currentTime: target,
            duration: player.duration || 0
          }));
          return;
        } catch(e) {}
      }

      if (currentUrl) {
        if (cachedBuffers[currentUrl]) {
          playWithWebAudio(currentUrl, target);
        } else if (player) {
          try {
            player.currentTime = target;
          } catch(e){}
        }
      }
    };

    window.pauseAudio = function() {
      window.stopAnyAudio();
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'AUDIO_PAUSED' }));
    };

    window.stopAnyAudio = function() {
      if (activeAudio) {
        try { activeAudio.pause(); } catch(e){}
      }
      if (currentSource) {
        try { currentSource.stop(); } catch(e){}
        currentSource = null;
      }
      if (webAudioTimer) {
        clearInterval(webAudioTimer);
        webAudioTimer = null;
      }
    };
  </script>
</head>
<body style="background:transparent;margin:0;padding:0;">
  <audio id="globalVoicePlayer" preload="auto" playsinline style="display:none;"></audio>
</body>
</html>
`;

// Interactive Voice Note Bubble Player with Dynamic Seek Bar & Real-Time Remaining Time
const VoiceBubblePlayer = ({
  msg,
  fullMediaUrl,
  isPlaying,
  currentTime,
  totalDuration,
  onPlayPause,
  onSeek,
  isUser,
}) => {
  const [barWidth, setBarWidth] = useState(150);

  const serverDuration = Number(msg.media_duration) || 0;
  const effectiveDuration = isPlaying && totalDuration > 0
    ? totalDuration
    : (serverDuration > 0 ? serverDuration : (totalDuration > 0 ? totalDuration : 1));

  const effectiveCurrentTime = isPlaying
    ? Math.min(currentTime, effectiveDuration)
    : 0;

  const remainingSeconds = Math.max(0, effectiveDuration - effectiveCurrentTime);

  const progressPercent = effectiveDuration > 0
    ? Math.min(100, Math.max(0, (effectiveCurrentTime / effectiveDuration) * 100))
    : 0;

  const handleBarPress = (e) => {
    const tapX = e.nativeEvent.locationX;
    const currentW = barWidth > 0 ? barWidth : 150;
    const ratio = Math.max(0, Math.min(1, tapX / currentW));
    const targetSeconds = ratio * effectiveDuration;
    onSeek(targetSeconds);
  };

  const activeColor = isUser ? '#22C55E' : '#D4AF37';

  return (
    <View style={styles.voiceNoteContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPlayPause}
        style={[
          styles.voicePlayBtn,
          { backgroundColor: isPlaying ? '#EF4444' : activeColor },
        ]}
      >
        <Text style={styles.voicePlayIcon}>
          {isPlaying ? '⏸' : '▶'}
        </Text>
      </TouchableOpacity>

      <View style={styles.voiceDetails}>
        {/* Interactive Seek Bar */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleBarPress}
          style={styles.voiceSeekBarHitArea}
        >
          <View
            style={[styles.voiceWaveformBar, { backgroundColor: isUser ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)' }]}
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0) setBarWidth(w);
            }}
          >
            <View
              style={[
                styles.voiceWaveformFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: isPlaying ? activeColor : (isUser ? '#86EFAC' : '#FDE68A'),
                },
              ]}
            />
            {isPlaying && (
              <View
                style={[
                  styles.voiceSeekThumb,
                  {
                    left: `${Math.min(96, Math.max(0, progressPercent))}%`,
                    backgroundColor: activeColor,
                  },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>

        {/* Time Meta Row: Played Time (Left) & Pending / Remaining Time (Right) */}
        <View style={styles.voiceMetaRow}>
          <Text style={[styles.voiceDurationText, isUser ? styles.voiceTextUser : styles.voiceTextAdmin]}>
            {isPlaying ? `▶ ${formatAudioTime(effectiveCurrentTime)}` : '🎙️ Voice Note'}
          </Text>
          <Text style={[styles.voiceDurationText, isUser ? styles.voiceTextUser : styles.voiceTextAdmin]}>
            {isPlaying
              ? `-${formatAudioTime(remainingSeconds)} left`
              : (serverDuration > 0 ? formatAudioTime(serverDuration) : '')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function SupportChatScreen(props) {
  const { appSetting } = useAppSetting();
  const { strings } = useLanguage();

  const [currentUser, setCurrentUser] = useState({ phone: '9966322889', name: 'User', id: '1' });
  const [activeHostUrl, setActiveHostUrl] = useState(
    getActiveHost() || domainUrl
  );
  const [socketConnected, setSocketConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [adminTyping, setAdminTyping] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Audio Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioUrl, setPlayingAudioUrl] = useState(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);

  // Modals
  const [attachModalVisible, setAttachModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const socketRef = useRef(null);
  const scrollViewRef = useRef(null);
  const webViewRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const typingTimerRef = useRef(null);
  const userPhoneRef = useRef('9966322889');
  const isSendingRef = useRef(false);

  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Keyboard show auto-scroll and visibility listener
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 120);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Load User Data & Connect on Screen Mount
  useEffect(() => {
    initChatSystem();
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  const getStoredUser = async () => {
    try {
      const p1 = await AsyncStorage.getItem('phone');
      const p2 = await AsyncStorage.getItem('mobile');
      const uStr = await AsyncStorage.getItem('userData');
      const u = uStr ? JSON.parse(uStr) : {};
      const rawPhone = p1 || p2 || u?.phone || u?.phone_number || u?.mobile || u?.user_phone || u?.number || '9966322889';
      const cleanPhone = String(rawPhone).replace(/[^0-9]/g, '').slice(-10) || '9966322889';
      const name = (await AsyncStorage.getItem('name')) || u?.name || u?.user_name || u?.username || `User ${cleanPhone.slice(-4)}`;
      const id = u?.id || u?.user_id || cleanPhone;
      return { phone: cleanPhone, name, id };
    } catch (e) {
      return { phone: '9966322889', name: 'User', id: '1' };
    }
  };

  const initChatSystem = async () => {
    const user = await getStoredUser();
    userPhoneRef.current = user.phone;
    setCurrentUser(user);

    // Fast-probe all backend hosts in parallel
    const host = await detectFastestHost();
    setActiveHostUrl(host);

    // Fetch initial chat history
    fetchChatHistory(host, user.phone);

    // Connect Socket.io
    connectSocket(host, user);
  };

  // Parallel Host Detector
  const detectFastestHost = async () => {
    const existing = getActiveHost();
    if (existing) {
      console.log('[SupportChat] Using existing active host from Ops:', existing);
      return existing;
    }

    try {
      const probeList = KNOWN_HOSTS || CANDIDATE_HOSTS;
      const fastest = await Promise.any(
        probeList.map(async (h) => {
          await axios.get(`${h}/api/support/history/testroom`, { timeout: 2500 });
          return h;
        })
      );
      console.log('[SupportChat] Fastest backend host connected:', fastest);
      setActiveHost(fastest);
      return fastest;
    } catch (e) {
      const fallback = getActiveHost() || domainUrl;
      console.log('[SupportChat] Fallback to host:', fallback);
      setActiveHost(fallback);
      return fallback;
    }
  };

  // Fetch Message History
  const fetchChatHistory = async (host, phone) => {
    try {
      const res = await getData(`${domainUrl}/api/support/history/${phone}`);
      if (res && (res.success === '1' || res.status === true)) {
        const history = res.data || res.messages || [];
        setMessages(history);
      }
    } catch (err) {
      console.log('Error fetching history:', err.message);
    }
  };

  // Initialize Socket Connection
  const connectSocket = (host, user) => {
    if (socketRef.current) socketRef.current.disconnect();

    const socket = io(host, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1500,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('App Support Socket connected:', socket.id);
      setSocketConnected(true);
      socket.emit('join_room', {
        room_id: user.phone,
        role: 'user',
        user_id: user.id,
        user_name: user.name,
      });
      socket.emit('mark_read', {
        room_id: user.phone,
        reader_type: 'user',
      });
    });

    socket.on('disconnect', () => {
      console.log('App Support Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('new_message', (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        if (msg.sender_type === 'user') {
          const tempIdx = prev.findIndex(
            (m) => String(m.id).startsWith('temp_') && m.message === msg.message
          );
          if (tempIdx !== -1) {
            const next = [...prev];
            next[tempIdx] = msg;
            return next;
          }
        }
        return [...prev, msg];
      });
      if (msg.sender_type === 'admin') {
        socket.emit('mark_read', {
          room_id: user.phone,
          reader_type: 'user',
        });
      }
    });

    socket.on('user_typing', ({ room_id, sender_type, is_typing }) => {
      if (sender_type === 'admin') {
        setAdminTyping(is_typing);
      }
    });

    socket.on('messages_read', ({ room_id, reader_type }) => {
      if (reader_type === 'admin') {
        setMessages((prev) =>
          prev.map((m) => (m.sender_type === 'user' ? { ...m, status: 'read' } : m))
        );
      }
    });
  };

  // Typing emitter
  const handleTextChange = (text) => {
    setInputText(text);
    const phone = userPhoneRef.current;
    if (!socketRef.current || !phone) return;

    socketRef.current.emit('typing', {
      room_id: phone,
      sender_type: 'user',
      is_typing: true,
    });

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit('typing', {
          room_id: phone,
          sender_type: 'user',
          is_typing: false,
        });
      }
    }, 1500);
  };

  // SEND TEXT MESSAGE
  const handleSendText = async () => {
    const text = inputText.trim();
    if (!text || isSendingRef.current) return;
    isSendingRef.current = true;

    const phone = userPhoneRef.current || currentUser.phone || '9966322889';
    setInputText('');

    const payload = {
      room_id: phone,
      sender_type: 'user',
      sender_id: currentUser.id || phone,
      sender_name: currentUser.name || 'User',
      message: text,
      msg_type: 'text',
    };

    // Instant Optimistic Local Bubble
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      ...payload,
      id: tempId,
      status: 'sent',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('send_message', payload);
      } else {
        await postDataJson(`${domainUrl}/api/support/send`, payload);
      }
    } catch (e) {
      console.log('REST send fallback log:', e.message);
    } finally {
      setTimeout(() => {
        isSendingRef.current = false;
      }, 350);
    }
  };

  // UPLOAD & SEND ATTACHMENT (IMAGE / VOICE / DOC)
  const uploadAndSendMedia = async (mediaData) => {
    setUploading(true);
    const phone = userPhoneRef.current || currentUser.phone || '9966322889';

    // Instant Optimistic Local Bubble for Attachment
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      room_id: phone,
      sender_type: 'user',
      sender_id: currentUser.id || phone,
      sender_name: currentUser.name || 'User',
      message: mediaData.name || (mediaData.type === 'voice' ? 'Voice Note' : 'Attachment'),
      msg_type: mediaData.type || 'document',
      media_url: mediaData.uri || '',
      local_uri: mediaData.uri || null,
      media_name: mediaData.name || 'Attachment',
      media_size: '',
      media_duration: mediaData.duration || 0,
      id: tempId,
      status: 'sending',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      let uploadRes = null;

      if (mediaData.uri) {
        let cleanUri = mediaData.uri;
        if (Platform.OS === 'android' && !cleanUri.startsWith('file://') && !cleanUri.startsWith('content://')) {
          cleanUri = `file://${cleanUri}`;
        }

        const formData = new FormData();
        formData.append('file', {
          uri: cleanUri,
          name: mediaData.name || `attachment_${Date.now()}`,
          type: mediaData.mime || (mediaData.type === 'image' ? 'image/jpeg' : 'application/octet-stream'),
        });
        formData.append('room_id', phone);

        console.log('[SupportChat] Uploading file via postDataContent:', cleanUri);
        uploadRes = await postDataContent(`${domainUrl}/api/support/upload`, formData);
      } else if (mediaData.base64) {
        console.log('[SupportChat] Uploading base64 via postDataJson');
        uploadRes = await postDataJson(`${domainUrl}/api/support/upload`, {
          base64: mediaData.base64,
          filename: mediaData.name || `voice_${Date.now()}.webm`,
          msg_type: mediaData.type || 'voice',
          duration: mediaData.duration || 0,
          room_id: phone,
        });
      }

      console.log('[SupportChat] Upload response:', uploadRes);

      if (uploadRes && (uploadRes.success === '1' || uploadRes.status === true) && uploadRes.media_url) {
        const liveHost = getActiveHost();
        if (liveHost && liveHost !== activeHostUrl) {
          setActiveHostUrl(liveHost);
        }

        const payload = {
          room_id: phone,
          sender_type: 'user',
          sender_id: currentUser.id || phone,
          sender_name: currentUser.name || 'User',
          message: mediaData.name || (mediaData.type === 'voice' ? 'Voice Note' : 'Attachment'),
          msg_type: uploadRes.msg_type || mediaData.type || 'document',
          media_url: uploadRes.media_url,
          media_name: uploadRes.media_name || mediaData.name,
          media_size: uploadRes.media_size,
          media_duration: uploadRes.media_duration || mediaData.duration || 0,
        };

        // Update the optimistic bubble with finalized server data
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, ...payload, status: 'sent' } : m))
        );

        // Send via Socket or REST fallback
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('send_message', payload);
        } else {
          await postDataJson(`${domainUrl}/api/support/send`, payload);
        }
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        const errMsg = uploadRes?.message || uploadRes?.error || 'Failed to upload attachment to server.';
        Alert.alert('Upload Error', errMsg);
      }
    } catch (err) {
      console.log('[SupportChat] Attachment error:', err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      Alert.alert('Upload Error', 'Could not upload attachment. Please check connection.');
    } finally {
      setUploading(false);
    }
  };

  // Permissions Helpers
  const requestCameraPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const already = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (already) return true;

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'Bhau Matka requires Camera access to take photos.',
          buttonPositive: 'Allow',
          buttonNegative: 'Cancel',
        }
      );
      return (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      );
    } catch (err) {
      console.log('Camera permission check error:', err);
      return true;
    }
  };

  // 1. CAMERA CAPTURE
  const handleCameraCapture = async () => {
    setAttachModalVisible(false);

    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        Alert.alert(
          'Camera Permission',
          'Please allow Camera permission in device settings to take photos.'
        );
        return;
      }

      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: false,
        compressImageMaxWidth: 1200,
        compressImageMaxHeight: 1200,
        compressImageQuality: 0.7,
        includeBase64: false,
      });

      if (image && image.path) {
        uploadAndSendMedia({
          uri: image.path,
          name: `camera_${Date.now()}.jpg`,
          type: 'image',
          mime: image.mime || 'image/jpeg',
        });
      }
    } catch (err) {
      if (err.code !== 'E_PICKER_CANCELLED' && !err.message?.includes('cancelled')) {
        console.log('Camera capture error:', err);
        Alert.alert('Camera Error', err.message || 'Could not open camera.');
      }
    }
  };

  // 2. GALLERY PHOTO PICKER
  const handleGalleryPicker = async () => {
    setAttachModalVisible(false);

    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: false,
        compressImageMaxWidth: 1200,
        compressImageMaxHeight: 1200,
        compressImageQuality: 0.7,
        includeBase64: false,
      });

      if (image && image.path) {
        uploadAndSendMedia({
          uri: image.path,
          name: `photo_${Date.now()}.jpg`,
          type: 'image',
          mime: image.mime || 'image/jpeg',
        });
      }
    } catch (err) {
      if (err.code !== 'E_PICKER_CANCELLED' && !err.message?.includes('cancelled')) {
        console.log('Gallery picker error:', err);
        Alert.alert('Gallery Error', err.message || 'Could not open gallery.');
      }
    }
  };

  // 3. DOCUMENT / FILE PICKER
  const handleDocumentPicker = async () => {
    setAttachModalVisible(false);

    try {
      const res = await DocumentPicker.pick({
        type: [types.allFiles],
        copyTo: 'cachesDirectory',
      });

      const picked = Array.isArray(res) ? res[0] : res;
      if (picked && (picked.fileCopyUri || picked.uri)) {
        const fileUri = picked.fileCopyUri || picked.uri;
        uploadAndSendMedia({
          uri: fileUri,
          name: picked.name || `doc_${Date.now()}`,
          type: picked.type?.startsWith('image/') ? 'image' : 'document',
          mime: picked.type || 'application/octet-stream',
        });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err) || err.message?.includes('cancelled')) {
        return;
      }
      console.log('DocumentPicker error:', err);
      Alert.alert('File Picker', 'Could not open file picker.');
    }
  };

  // 4. AUDIO / VOICE FILE PICKER (From storage)
  const handleAudioFilePicker = async () => {
    setAttachModalVisible(false);

    try {
      const res = await DocumentPicker.pick({
        type: [types.audio],
        copyTo: 'cachesDirectory',
      });

      const picked = Array.isArray(res) ? res[0] : res;
      if (picked && (picked.fileCopyUri || picked.uri)) {
        const fileUri = picked.fileCopyUri || picked.uri;
        uploadAndSendMedia({
          uri: fileUri,
          name: picked.name || `audio_${Date.now()}.mp3`,
          type: 'voice',
          mime: picked.type || 'audio/mpeg',
          duration: 0,
        });
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err) && !err.message?.includes('cancelled')) {
        console.log('Audio picker error:', err);
        Alert.alert('Audio Picker', 'Could not pick audio file.');
      }
    }
  };

  // 5. LIVE VOICE RECORDING
  const handleStartRecording = async () => {
    if (isRecording) return;

    if (Platform.OS === 'android') {
      try {
        const alreadyGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        if (!alreadyGranted) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'Bhau Matka requires Microphone access to record voice notes.',
              buttonPositive: 'Allow',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED && granted !== PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Alert.alert('Microphone Required', 'Please enable microphone permission in device settings.');
            return;
          }
        }
      } catch (err) {
        console.log('Mic permission error:', err);
      }
    }

    setIsRecording(true);
    setRecordingSeconds(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.startRecording(); true;');
    }
  };

  const handleStopAndSendRecording = () => {
    if (!isRecording) return;
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.stopRecording(); true;');
    }
  };

  const handleCancelRecording = () => {
    if (!isRecording) return;
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordingSeconds(0);

    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.cancelRecording(); true;');
    }
  };

  // Audio Player via WebView Bridge
  const handlePlayVoice = (mediaUrl) => {
    if (!mediaUrl) return;
    const fullAudioUrl = resolveMediaUrl(mediaUrl, activeHostUrl);
    console.log('[SupportChat] Triggering voice note playback:', fullAudioUrl);

    if (playingAudioUrl === fullAudioUrl) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript('window.pauseAudio(); true;');
      }
      setPlayingAudioUrl(null);
    } else {
      setPlayingAudioUrl(fullAudioUrl);
      setAudioCurrentTime(0);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.playAudio(${JSON.stringify(fullAudioUrl)}, 0); true;`);
      }
    }
  };

  // Seek Audio to a specific timestamp
  const handleSeekVoice = (mediaUrl, targetSeconds) => {
    if (!mediaUrl) return;
    const fullAudioUrl = resolveMediaUrl(mediaUrl, activeHostUrl);
    const safeTarget = Math.max(0, Number(targetSeconds.toFixed(2)));
    console.log('[SupportChat] Seeking to:', safeTarget, fullAudioUrl);

    setAudioCurrentTime(safeTarget);

    if (playingAudioUrl === fullAudioUrl) {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`window.seekAudio(${safeTarget}); true;`);
      }
    } else {
      setPlayingAudioUrl(fullAudioUrl);
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(
          `window.playAudio(${JSON.stringify(fullAudioUrl)}, ${safeTarget}); true;`
        );
      }
    }
  };

  // Handle messages from WebView audio engine
  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'AUDIO_RECORDED') {
        uploadAndSendMedia({
          base64: data.base64,
          name: `voice_${Date.now()}.webm`,
          type: 'voice',
          duration: data.duration,
        });
      } else if (data.type === 'AUDIO_PLAYING') {
        if (data.url) setPlayingAudioUrl(data.url);
        if (typeof data.currentTime === 'number') setAudioCurrentTime(data.currentTime);
        if (typeof data.duration === 'number' && data.duration > 0) setAudioDuration(data.duration);
      } else if (data.type === 'AUDIO_TIME_UPDATE') {
        if (typeof data.currentTime === 'number') {
          setAudioCurrentTime(data.currentTime);
        }
        if (typeof data.duration === 'number' && data.duration > 0) {
          setAudioDuration(data.duration);
        }
      } else if (data.type === 'AUDIO_ENDED' || data.type === 'AUDIO_PAUSED') {
        setPlayingAudioUrl(null);
        if (data.type === 'AUDIO_ENDED') {
          setAudioCurrentTime(0);
        }
      } else if (data.type === 'AUDIO_PLAY_ERROR') {
        console.warn('[SupportChat] Audio playback error:', data.error);
        setPlayingAudioUrl(null);
        setAudioCurrentTime(0);
        Alert.alert('Voice Note Notice', 'Could not play voice note: ' + (data.error || 'Playback failed'));
      } else if (data.type === 'RECORDING_ERROR') {
        Alert.alert('Microphone Notice', 'Live voice recording could not access microphone: ' + data.error);
        handleCancelRecording();
      }
    } catch (e) {
      console.log('WebView msg parse error:', e);
    }
  };

  // WhatsApp External Launcher
  const openExternalWhatsApp = () => {
    const num = String(appSetting?.whatsapp_number || appSetting?.mobile_number || '9966322889').replace(/[^0-9]/g, '');
    const url = `whatsapp://send?phone=${num}&text=${encodeURIComponent('Hello Support, I need help.')}`;
    Linking.openURL(url).catch(() => Linking.openURL(`https://wa.me/${num}`));
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      {/* Hidden Audio Engine WebView with non-zero dimensions to keep WebChromeClient active */}
      <View style={{ width: 1, height: 1, opacity: 1, position: 'absolute', top: -100, left: -100 }} pointerEvents="none">
        <WebView
          ref={webViewRef}
          source={{
            html: AUDIO_BRIDGE_HTML,
            baseUrl: 'http://localhost',
          }}
          mixedContentMode="always"
          mediaCapturePermissionGrantType="grant"
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          androidHardwareAccelerationDisabled={false}
          originWhitelist={['*']}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
        />
      </View>

      {/* 1. TOP HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => props.navigation.goBack()}
          style={styles.backCircleBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <BackArrow size={20} color="#E2B048" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            {strings.nav_support || 'Customer Support'}
          </Text>
          <View style={styles.onlineBadgeRow}>
            <View
              style={[
                styles.onlineDot,
                { backgroundColor: socketConnected ? '#22C55E' : '#F59E0B' },
              ]}
            />
            <Text style={styles.headerSubtitle}>
              {adminTyping ? 'Support is typing...' : socketConnected ? 'Live Connected' : 'Connecting...'}
            </Text>
          </View>
        </View>

        {/* WhatsApp External Quick Launcher */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openExternalWhatsApp}
          style={styles.whatsappHeaderBtn}
          title="Open WhatsApp"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <WhatsAppGreenIcon size={36} />
        </TouchableOpacity>
      </View>

      {/* 2. CHAT MESSAGES AREA */}
      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Welcome Announcement Card */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeCardTitle}>👋 24/7 Live Support Helpdesk</Text>
            <Text style={styles.welcomeCardDesc}>
              Messages and attachments are directly connected with Admin. You can send photos, documents, and live voice notes.
            </Text>
          </View>

          {messages.map((msg, index) => {
            const isUser = msg.sender_type === 'user';
            const fullMediaUrl = msg.local_uri || resolveMediaUrl(msg.media_url, activeHostUrl);

            return (
              <View
                key={msg.id || index}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowRight : styles.messageRowLeft,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.supportBubble,
                  ]}
                >
                  {/* Sender Name */}
                  <Text style={[styles.senderLabel, isUser ? styles.senderLabelUser : styles.senderLabelAdmin]}>
                    {isUser ? 'You' : (msg.sender_name || 'Bhau Support Admin')}
                  </Text>

                  {/* 1. Image Attachment */}
                  {msg.msg_type === 'image' && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        setPreviewImageUrl(fullMediaUrl);
                        setImageModalVisible(true);
                      }}
                      style={styles.imagePreviewContainer}
                    >
                      <Image
                        source={{ uri: fullMediaUrl }}
                        style={styles.bubbleImage}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}

                  {/* 2. Voice Note Attachment */}
                  {msg.msg_type === 'voice' && (
                    <VoiceBubblePlayer
                      msg={msg}
                      fullMediaUrl={fullMediaUrl}
                      isPlaying={Boolean(
                        playingAudioUrl &&
                        (playingAudioUrl === fullMediaUrl || (msg.media_url && playingAudioUrl.includes(msg.media_url)))
                      )}
                      currentTime={audioCurrentTime}
                      totalDuration={audioDuration}
                      onPlayPause={() => handlePlayVoice(fullMediaUrl)}
                      onSeek={(targetTime) => handleSeekVoice(fullMediaUrl, targetTime)}
                      isUser={isUser}
                    />
                  )}

                  {/* 3. Document Attachment */}
                  {msg.msg_type === 'document' && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => Linking.openURL(fullMediaUrl).catch(() => {})}
                      style={styles.documentCard}
                    >
                      <Text style={{ fontSize: 26, marginRight: 8 }}>📄</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.docName} numberOfLines={1}>
                          {msg.media_name || msg.message || 'Document'}
                        </Text>
                        <Text style={styles.docSize}>
                          {msg.media_size || 'Tap to view / download'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* 4. Text Message */}
                  {(!msg.msg_type || msg.msg_type === 'text') && (
                    <Text style={isUser ? styles.userBubbleText : styles.supportBubbleText}>
                      {msg.message}
                    </Text>
                  )}

                  {/* Timestamp & Status Checkmark */}
                  <View style={styles.bubbleFooter}>
                    <Text style={styles.bubbleTime}>
                      {moment(msg.created_at || new Date()).format('hh:mm A')}
                    </Text>
                    {isUser && (
                      <Text
                        style={[
                          styles.statusTick,
                          { color: msg.status === 'read' ? '#0284C7' : '#94A3B8' },
                        ]}
                      >
                        {msg.status === 'read' ? '✓✓' : '✓'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* 3. BOTTOM INPUT BAR */}
        <View
          style={[
            styles.bottomBarContainer,
            {
              paddingBottom: keyboardVisible
                ? (Platform.OS === 'ios' ? 10 : 8)
                : Math.max(insets.bottom + 6, Platform.OS === 'android' ? 26 : 14),
            },
          ]}
        >
          {isRecording ? (
            /* Recording Mode Bar */
            <View style={styles.recordingPill}>
              <View style={styles.recordingStatusRow}>
                <View style={styles.pulsingRedDot} />
                <Text style={styles.recordingLabel}>Recording Voice Note...</Text>
                <Text style={styles.recordingTime}>
                  0:{(recordingSeconds % 60).toString().padStart(2, '0')}
                </Text>
              </View>

              <View style={styles.recordingActionsRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCancelRecording}
                  style={styles.cancelRecBtn}
                >
                  <Text style={styles.cancelRecText}>✕ Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleStopAndSendRecording}
                  style={styles.sendVoiceBtn}
                >
                  <Text style={styles.sendVoiceText}>Send ➤</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Normal Input Bar */
            <>
              <View style={styles.inputPill}>
                {/* Paperclip Attachment Menu */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setAttachModalVisible(true)}
                  style={styles.pillIconBtn}
                >
                  <ClipIcon size={22} color="#64748B" />
                </TouchableOpacity>

                {/* Direct Camera Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCameraCapture}
                  style={styles.pillIconBtn}
                >
                  <Text style={{ fontSize: 20 }}>📷</Text>
                </TouchableOpacity>

                {/* Text Input Field */}
                <TextInput
                  style={styles.textInput}
                  placeholder={strings.type_message || 'संदेश टाइप करें...'}
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={handleTextChange}
                  multiline={true}
                  maxHeight={90}
                  onFocus={() => {
                    setTimeout(() => {
                      scrollViewRef.current?.scrollToEnd({ animated: true });
                    }, 150);
                  }}
                />

                {/* Microphone Button */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleStartRecording}
                  style={styles.pillIconBtn}
                >
                  <Text style={{ fontSize: 20 }}>🎙️</Text>
                </TouchableOpacity>
              </View>

              {/* Green Circular Send Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSendText}
                style={[
                  styles.sendGreenBtn,
                  { backgroundColor: inputText.trim() ? '#25D366' : '#22C55E' },
                ]}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <SendPaperPlaneIcon size={22} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* 4. ATTACHMENT SHEET OVERLAY */}
      {attachModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setAttachModalVisible(false)}
          />
          <View
            style={[
              styles.attachSheetContainer,
              {
                paddingBottom: Math.max(insets.bottom + 16, 28),
              },
            ]}
          >
            <Text style={styles.attachSheetTitle}>Share Attachment</Text>

            <View style={styles.attachGrid}>
              {/* Camera Option */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCameraCapture}
                style={styles.attachItem}
              >
                <View style={[styles.attachIconCircle, { backgroundColor: '#EF4444' }]}>
                  <Text style={styles.attachIconText}>📷</Text>
                </View>
                <Text style={styles.attachItemLabel}>Camera</Text>
              </TouchableOpacity>

              {/* Gallery Option */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGalleryPicker}
                style={styles.attachItem}
              >
                <View style={[styles.attachIconCircle, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.attachIconText}>🖼️</Text>
                </View>
                <Text style={styles.attachItemLabel}>Gallery</Text>
              </TouchableOpacity>

              {/* Document Option */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleDocumentPicker}
                style={styles.attachItem}
              >
                <View style={[styles.attachIconCircle, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.attachIconText}>📄</Text>
                </View>
                <Text style={styles.attachItemLabel}>Document</Text>
              </TouchableOpacity>

              {/* Audio / Voice File Option */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAudioFilePicker}
                style={styles.attachItem}
              >
                <View style={[styles.attachIconCircle, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.attachIconText}>🎵</Text>
                </View>
                <Text style={styles.attachItemLabel}>Audio File</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setAttachModalVisible(false)}
              style={styles.attachCancelBtn}
            >
              <Text style={styles.attachCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 5. IMAGE LIGHTBOX MODAL */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.imageModalBackdrop}>
          <TouchableOpacity
            style={styles.closeImageBtn}
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={styles.closeImageText}>✕</Text>
          </TouchableOpacity>
          {previewImageUrl && (
            <Image
              source={{ uri: previewImageUrl }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  headerBar: {
    backgroundColor: '#061224',
    minHeight: 56,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2B048',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(226, 176, 72, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#E2B048',
    letterSpacing: 0.3,
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  whatsappHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#EBE5DE',
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  welcomeCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
    alignItems: 'center',
  },
  welcomeCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  welcomeCardDesc: {
    fontSize: 11.5,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 16,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  messageRowLeft: {
    justifyContent: 'flex-start',
  },
  messageRowRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  supportBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 2,
  },
  senderLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  senderLabelAdmin: {
    color: '#0284C7',
  },
  senderLabelUser: {
    color: '#16A34A',
  },
  supportBubbleText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 19,
  },
  userBubbleText: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 19,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  bubbleTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  statusTick: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 4,
  },
  bubbleImage: {
    width: 220,
    height: 180,
    borderRadius: 8,
  },
  voiceNoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 210,
    maxWidth: 275,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  voicePlayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  voicePlayIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  voiceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  voiceSeekBarHitArea: {
    paddingVertical: 7,
    justifyContent: 'center',
  },
  voiceWaveformBar: {
    height: 5,
    borderRadius: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  voiceWaveformFill: {
    height: 5,
    borderRadius: 3,
  },
  voiceSeekThumb: {
    position: 'absolute',
    top: -4,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  voiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  voiceDurationText: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  voiceTextUser: {
    color: '#E2E8F0',
  },
  voiceTextAdmin: {
    color: '#94A3B8',
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 8,
    borderRadius: 8,
    minWidth: 180,
  },
  docName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  docSize: {
    fontSize: 10.5,
    color: '#64748B',
  },
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    backgroundColor: '#EBE5DE',
  },
  inputPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    paddingHorizontal: 8,
    minHeight: 48,
    maxHeight: 110,
    elevation: 2,
  },
  pillIconBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    maxHeight: 90,
  },
  sendGreenBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    elevation: 3,
  },
  recordingPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderRadius: 26,
    paddingHorizontal: 14,
    height: 48,
  },
  recordingStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulsingRedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  recordingLabel: {
    color: '#EF4444',
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  recordingTime: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: 'bold',
  },
  recordingActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelRecBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#64748B',
  },
  cancelRecText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sendVoiceBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  sendVoiceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    zIndex: 9999,
    elevation: 25,
  },
  attachSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    paddingBottom: 28,
  },
  attachSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  attachGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  attachItem: {
    alignItems: 'center',
  },
  attachIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    elevation: 3,
  },
  attachIconText: {
    fontSize: 24,
  },
  attachItemLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  attachCancelBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  attachCancelText: {
    color: '#64748B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imageModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeImageBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeImageText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fullImage: {
    width: '92%',
    height: '80%',
  },
});
