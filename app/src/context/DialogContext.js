import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Polyline } from 'react-native-svg';
import { currentTheme } from '../constants/ThemeProvider';
import { ExitDoorGraphic } from '../component/MatkaIcons';

const DialogContext = createContext(null);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }
  return context;
};

const AlertDialog = ({ visible, type = 'error', title, message, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const btnPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(btnPulseAnim, {
            toValue: 1.035,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(btnPulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, scaleAnim, opacityAnim, btnPulseAnim]);

  if (!visible) return null;

  const isSuccess = type === 'success';
  const isWarning = type === 'warning';

  const glowBorder = isSuccess
    ? 'rgba(16, 185, 129, 0.25)'
    : isWarning
    ? 'rgba(245, 158, 11, 0.25)'
    : 'rgba(239, 35, 60, 0.25)';

  const glowBg = isSuccess
    ? 'rgba(16, 185, 129, 0.08)'
    : isWarning
    ? 'rgba(245, 158, 11, 0.08)'
    : 'rgba(239, 35, 60, 0.08)';

  const badgeColors = isSuccess
    ? ['#10B981', '#059669', '#047857']
    : isWarning
    ? ['#F59E0B', '#D97706', '#B45309']
    : ['#EF233C', '#D90429', '#A8001C'];

  const btnColors = isSuccess
    ? ['#10B981', '#059669', '#047857']
    : isWarning
    ? ['#F59E0B', '#D97706', '#B45309']
    : ['#EF233C', '#D90429', '#A8001C'];

  // Clean title & message to guarantee NO OTP text
  let cleanTitle = title || (isSuccess ? 'सफल / SUCCESS' : isWarning ? 'चेतावनी / WARNING' : 'त्रुटि / ERROR');
  let cleanMsg = message || '';
  if (typeof cleanMsg === 'string') {
    cleanMsg = cleanMsg
      .replace(/user registered successfully\.?\s*verify otp to get approved\.?/gi, 'आपका खाता सफलतापूर्वक बन गया है! अब आप खेल सकते हैं।')
      .replace(/verify otp to get approved\.?/gi, 'Welcome to Bhau Matka! Your account is ready.')
      .replace(/verify otp/gi, '')
      .replace(/otp/gi, '')
      .trim();
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Tappable Backdrop */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        >
          <Animated.View style={[styles.overlayBackdrop, { opacity: opacityAnim }]} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.alertModalCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Top-Right Close Cross Button ('✕' / Galat wala) */}
          <TouchableOpacity
            style={styles.alertCloseCrossBtn}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6L18 18"
                stroke="#64748B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>

          {/* Glowing Ring with Vector Icon */}
          <View style={styles.alertIconWrap}>
            <View style={[styles.alertGlowRing, { borderColor: glowBorder, backgroundColor: glowBg }]}>
              <LinearGradient
                colors={badgeColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.alertBadgeCircle}
              >
                {isSuccess ? (
                  <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                    <Polyline
                      points="20 6 9 17 4 12"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : isWarning ? (
                  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 8V13M12 16.5H12.01"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="#FFFFFF"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </LinearGradient>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.alertModalTitle}>{cleanTitle}</Text>

          {/* Gold Accent Divider Line */}
          <LinearGradient
            colors={['rgba(212, 151, 38, 0.1)', '#D49726', 'rgba(212, 151, 38, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.alertGoldDivider}
          />

          {/* Message */}
          <Text style={styles.alertModalMessage}>{cleanMsg}</Text>

          {/* Glowing Action Button with Micro-Pulse */}
          <Animated.View style={[styles.alertBtnWrap, { transform: [{ scale: btnPulseAnim }] }]}>
            <TouchableOpacity style={styles.alertBtnTouch} onPress={onClose} activeOpacity={0.85}>
              <LinearGradient
                colors={btnColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.alertBtnGradient}
              >
                <Text style={styles.alertBtnText}>THEEK HAI / OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const ConfirmDialog = ({ visible, title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const btnPulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(btnPulseAnim, {
            toValue: 1.04,
            duration: 650,
            useNativeDriver: true,
          }),
          Animated.timing(btnPulseAnim, {
            toValue: 1,
            duration: 650,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, scaleAnim, opacityAnim, btnPulseAnim]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.overlayBackdrop, { opacity: opacityAnim }]} />
        <Animated.View
          style={[
            styles.exitModalCard,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          {/* Top Door Exit Graphic with subtle glow ring */}
          <View style={styles.doorGraphicWrap}>
            <View style={styles.doorGlowCircle}>
              <ExitDoorGraphic size={76} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.exitModalTitle}>{title || 'लॉगआउट'}</Text>

          {/* Gold Accent Divider Line */}
          <LinearGradient
            colors={['rgba(212, 151, 38, 0.1)', '#D49726', 'rgba(212, 151, 38, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.exitGoldDivider}
          />

          {/* Message */}
          <Text style={styles.exitModalMessage}>
            {message || 'क्या आप अभी बाहर निकलना चाहते हैं?'}
          </Text>

          {/* Action Buttons Row */}
          <View style={styles.exitBtnRow}>
            {/* Left Button: Slate Gray Gradient 'नहीं / Cancel' */}
            <TouchableOpacity
              style={styles.exitBtnTouch}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#64748B', '#475569', '#334155']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.exitBtnGradient}
              >
                <Text style={styles.exitBtnText}>{cancelText || 'नहीं'}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Right Button: Red Exit Gradient with Pulse */}
            <Animated.View style={[styles.exitBtnTouch, { transform: [{ scale: btnPulseAnim }] }]}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={onConfirm}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#EF233C', '#D90429', '#A8001C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={styles.exitBtnGradient}
                >
                  <Text style={styles.exitBtnText}>{confirmText || 'लॉगआउट'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3, 7, 18, 0.72)',
  },
  alertModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 22,
    width: '100%',
    maxWidth: 326,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(212, 151, 38, 0.25)',
  },
  alertIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  alertGlowRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  alertBadgeCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  alertModalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#08172E',
    marginTop: 10,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  alertGoldDivider: {
    width: '100%',
    height: 2,
    marginVertical: 12,
  },
  alertModalMessage: {
    fontSize: 14.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '600',
    marginBottom: 20,
    paddingHorizontal: 6,
  },
  alertCloseCrossBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  alertBtnWrap: {
    width: '100%',
    marginTop: 6,
  },
  alertBtnTouch: {
    width: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  alertBtnGradient: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  confirmBtnRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: currentTheme().inputBorderColor,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  exitModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 24,
    paddingBottom: 22,
    paddingHorizontal: 22,
    width: '100%',
    maxWidth: 326,
    alignItems: 'center',
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    borderWidth: 1.2,
    borderColor: 'rgba(212, 151, 38, 0.25)',
  },
  doorGraphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  doorGlowCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(239, 35, 60, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(239, 35, 60, 0.18)',
  },
  exitModalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#08172E',
    marginTop: 8,
    letterSpacing: 0.3,
  },
  exitGoldDivider: {
    width: '100%',
    height: 2,
    marginVertical: 14,
  },
  exitModalMessage: {
    fontSize: 15,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '500',
  },
  exitBtnRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  exitBtnTouch: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  exitBtnGradient: {
    height: 48,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

// Confirm dialog - use from anywhere: Dialog.confirm({ title, message, confirmText, onConfirm })
export const Dialog = {
  show: (opts) => {
    if (typeof global.__dialogShow === 'function') {
      const { type = 'error', text1, text2, title, message } = opts || {};
      const defaultTitle = type === 'error' ? 'Error' : type === 'success' ? 'Success' : 'Warning';
      const t = title || (text2 ? text1 : null) || defaultTitle;
      const m = message || text2 || (text1 && !text2 ? text1 : '');
      global.__dialogShow({ type, title: t || defaultTitle, message: m });
    }
  },
  confirm: (opts) => {
    if (typeof global.__dialogConfirm === 'function') {
      global.__dialogConfirm(opts);
    }
  },
};

export const DialogProvider = ({ children }) => {
  const [state, setState] = useState({
    visible: false,
    type: 'error',
    title: '',
    message: '',
  });
  const [confirmState, setConfirmState] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
  });

  const hideDialog = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const showDialog = useCallback(({ type = 'error', title = '', message = '', text1, text2 }) => {
    let rawMsg = message || text2 || '';
    if (typeof rawMsg === 'string') {
      rawMsg = rawMsg
        .replace(/user registered successfully\.?\s*verify otp to get approved\.?/gi, 'आपका खाता सफलतापूर्वक बन गया है! अब आप खेल सकते हैं।')
        .replace(/verify otp to get approved\.?/gi, 'Welcome to Bhau Matka! Your account is ready.')
        .replace(/verify otp/gi, '')
        .replace(/otp/gi, '')
        .trim();
    }
    setState({
      visible: true,
      type: type || 'error',
      title: title || text1 || '',
      message: rawMsg,
    });
  }, []);

  const showConfirm = useCallback(({ title = 'Confirm', message = '', confirmText = 'Confirm', cancelText = 'Cancel', confirmColor, onConfirm }) => {
    setConfirmState({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      confirmColor,
      onConfirm,
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmState((s) => ({ ...s, visible: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    confirmState.onConfirm?.();
    hideConfirm();
  }, [confirmState.onConfirm, hideConfirm]);

  const showError = useCallback((title, message) => showDialog({ type: 'error', title, message }), [showDialog]);
  const showSuccess = useCallback((title, message) => showDialog({ type: 'success', title, message }), [showDialog]);
  const showWarning = useCallback((title, message) => showDialog({ type: 'warning', title, message }), [showDialog]);

  const showDialogRef = useRef(showDialog);
  const showConfirmRef = useRef(showConfirm);
  showDialogRef.current = showDialog;
  showConfirmRef.current = showConfirm;
  useEffect(() => {
    global.__dialogShow = (opts) => showDialogRef.current(opts);
    global.__dialogConfirm = (opts) => showConfirmRef.current(opts);
    return () => {
      delete global.__dialogShow;
      delete global.__dialogConfirm;
    };
  }, []);

  return (
    <DialogContext.Provider value={{ showDialog, showConfirm, showError, showSuccess, showWarning, hideDialog }}>
      {children}
      <AlertDialog
        visible={state.visible}
        type={state.type}
        title={state.title}
        message={state.message}
        onClose={hideDialog}
      />
      <ConfirmDialog
        visible={confirmState.visible}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        confirmColor={confirmState.confirmColor}
        onConfirm={handleConfirm}
        onCancel={hideConfirm}
      />
    </DialogContext.Provider>
  );
};
