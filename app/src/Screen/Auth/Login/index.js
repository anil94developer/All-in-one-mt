import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  BackHandler,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import { screenWidth } from "../../../constants/Sizes.constant";
import { base } from "../../../config/appConfig";
import { Dialog } from "../../../context/DialogContext";
import { postDataJson } from "../../../services/Ops";
import { useAppSetting } from "../../../context/AppSettingContext";
import { AuthPhoneIcon } from "../../../component/MatkaIcons";
import { useLanguage } from "../../../context/LanguageContext";

function Login(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const [step, setStep] = useState(1); // 1: Mobile Input, 2: OTP Input
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates?.height || 280);
      }
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const { appSetting } = useAppSetting();

  // Login button continuous balanced left-right sway & scale pulse animation
  const translateXLoginAnim = useRef(new Animated.Value(0)).current;
  const scaleLoginAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loginLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateXLoginAnim, {
            toValue: -7,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleLoginAnim, {
            toValue: 1.03,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateXLoginAnim, {
            toValue: 0,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleLoginAnim, {
            toValue: 1,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateXLoginAnim, {
            toValue: 7,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleLoginAnim, {
            toValue: 1.03,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateXLoginAnim, {
            toValue: 0,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleLoginAnim, {
            toValue: 1,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(120),
      ])
    );
    loginLoop.start();
    return () => loginLoop.stop();
  }, [translateXLoginAnim, scaleLoginAnim]);

  useEffect(() => {
    const backAction = () => {
      if (step === 2) {
        setStep(1);
        setOtp("");
        return true;
      }
      Alert.alert("Hold on!", "Are you sure you want to exit app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [step]);

  useEffect(() => {
    const get_saved_mobile = async () => {
      let saved = (await AsyncStorage.getItem("mobile")) || (await AsyncStorage.getItem("phone"));
      if (saved) {
        setMobileNumber(saved);
      }
    };
    get_saved_mobile();
  }, []);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer]);

  const send_otp_handler = async () => {
    Keyboard.dismiss();
    if (mobileNumber === "") {
      Dialog.show({
        type: "error",
        text1: "Mobile Number Required!",
        text2: "Please enter 10-digit mobile number",
      });
      return;
    }
    if (mobileNumber.length !== 10) {
      Dialog.show({
        type: "error",
        text1: "Invalid Mobile Number!",
        text2: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    try {
      setLoading(true);
      AsyncStorage.setItem("mobile", mobileNumber);

      const body = {
        mobile: mobileNumber,
        phone_number: mobileNumber,
      };

      let result = await postDataJson(base.sendOtp, body);

      if (result && (result.status === true || result.success === "1" || result.success === 1)) {
        setLoading(false);
        setStep(2);
        setTimer(30);
        setOtp("");
        const sentOtpMsg = result.otp ? `Your OTP code is: ${result.otp}` : (result.message || result.msg || "OTP Sent Successfully!");
        Dialog.show({
          type: "success",
          text1: "OTP Sent!",
          text2: sentOtpMsg,
        });
      } else {
        // Fallback retry direct login if sendOtp endpoint fails
        const fallbackResult = await postDataJson(base.login, {
          mobile: mobileNumber,
          phone_number: mobileNumber,
          password: mobileNumber,
        });
        if (fallbackResult && (fallbackResult.status === true || fallbackResult.success === "1" || fallbackResult.success === 1)) {
          setLoading(false);
          const data = fallbackResult.data || fallbackResult;
          AsyncStorage.setItem("phone", mobileNumber);
          AsyncStorage.setItem("mobile", mobileNumber);
          if (data?.token) AsyncStorage.setItem("token", data.token);
          AsyncStorage.setItem("userData", JSON.stringify(data));
          AsyncStorage.setItem("accountStatus", "1");
          global.accountStatus = "1";
          Dialog.show({
            type: "success",
            text1: "Login Successful!",
            text2: fallbackResult.message || "Welcome back.",
          });
          props.navigation.replace("Drawers", { screen: "Home" });
          return;
        }
        setLoading(false);
        Dialog.show({
          type: "error",
          text1: "OTP Error",
          text2: result?.message || result?.msg || "Failed to send OTP. Please try again.",
        });
      }
    } catch (e) {
      setLoading(false);
      Dialog.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection.",
      });
    }
  };

  const verify_otp_handler = async () => {
    Keyboard.dismiss();
    if (otp === "" || otp.length < 4) {
      Dialog.show({
        type: "error",
        text1: "OTP Required!",
        text2: "Please enter 4-digit OTP code",
      });
      return;
    }

    try {
      setLoading(true);
      const body = {
        mobile: mobileNumber,
        phone_number: mobileNumber,
        otp: otp,
      };

      let result = await postDataJson(base.verifyOtp, body);

      if (result && (result.status === true || result.success === "1" || result.success === 1)) {
        setLoading(false);
        const data = result.data || result;

        AsyncStorage.setItem("phone", mobileNumber);
        AsyncStorage.setItem("mobile", mobileNumber);
        if (data?.token) AsyncStorage.setItem("token", data.token);
        AsyncStorage.setItem("userData", JSON.stringify(data));
        AsyncStorage.setItem("accountStatus", "1");
        global.accountStatus = "1";

        Dialog.show({
          type: "success",
          text1: "Login Successful!",
          text2: result.message || result.msg || "Welcome back.",
        });

        props.navigation.replace("Drawers", { screen: "Home" });
      } else {
        setLoading(false);
        Dialog.show({
          type: "error",
          text1: "Verification Failed",
          text2: result?.message || result?.msg || "Invalid OTP code. Please try again.",
        });
      }
    } catch (e) {
      setLoading(false);
      Dialog.show({
        type: "error",
        text1: "Network Error",
        text2: "Please check your internet connection.",
      });
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: keyboardHeight > 0 ? keyboardHeight + 50 : 30 + insets.bottom },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Logo */}
          <View style={styles.logoRow}>
            <Text style={styles.logoBhau}>Bhau</Text>
            <Text style={styles.logoMatka}>Matka</Text>
          </View>

        {/* Floating White Card */}
        <View style={styles.card}>
          {step === 1 ? (
            <>
              <Text style={styles.title}>{strings.welcome_back || 'Welcome Back'}</Text>
              <Text style={styles.subtitle}>{strings.login_continue || 'Enter mobile number to get OTP'}</Text>

              {/* Phone Number Field */}
              <Text style={styles.inputLabel}>{(strings.phone_label || 'Phone Number').toUpperCase()}</Text>
              <View style={styles.inputContainer}>
                <AuthPhoneIcon size={20} color="#1E293B" />
                <TextInput
                  style={styles.textInput}
                  placeholder={strings.phone_placeholder || 'Enter 10-digit Mobile Number'}
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={10}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                />
              </View>

              {/* Send OTP Button */}
              <Animated.View
                style={{
                  transform: [
                    { translateX: translateXLoginAnim },
                    { scale: scaleLoginAnim },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={send_otp_handler}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={styles.loginBtnWrapper}
                >
                  <LinearGradient
                    colors={["#07152B", "#162846", "#07152B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.loginBtnText}>GET OTP</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </>
          ) : (
            <>
              <Text style={styles.title}>Enter OTP Code</Text>
              <View style={styles.phoneChangeRow}>
                <Text style={styles.subtitle}>OTP sent to +91 {mobileNumber}</Text>
                <TouchableOpacity onPress={() => { setStep(1); setOtp(''); }}>
                  <Text style={styles.changePhoneText}> (Edit)</Text>
                </TouchableOpacity>
              </View>

              {/* OTP Input Field */}
              <Text style={styles.inputLabel}>ENTER 4-DIGIT OTP</Text>
              <View style={[styles.inputContainer, { justifyContent: 'center' }]}>
                <TextInput
                  style={[styles.textInput, { textAlign: 'center', fontSize: 22, letterSpacing: 10, fontWeight: '700', marginLeft: 0 }]}
                  placeholder="----"
                  placeholderTextColor="#CBD5E1"
                  keyboardType="numeric"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  autoFocus={true}
                />
              </View>

              {/* Resend Timer Row */}
              <View style={styles.resendRow}>
                {timer > 0 ? (
                  <Text style={styles.resendTimerText}>Resend OTP in <Text style={styles.boldTimer}>{timer}s</Text></Text>
                ) : (
                  <TouchableOpacity onPress={send_otp_handler} disabled={loading}>
                    <Text style={styles.resendBtnText}>RESEND OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Verify OTP Button */}
              <Animated.View
                style={{
                  transform: [
                    { translateX: translateXLoginAnim },
                    { scale: scaleLoginAnim },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={verify_otp_handler}
                  disabled={loading}
                  activeOpacity={0.85}
                  style={styles.loginBtnWrapper}
                >
                  <LinearGradient
                    colors={["#07152B", "#162846", "#07152B"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginGradient}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.loginBtnText}>VERIFY & LOGIN</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </>
          )}

          {/* Footer Register Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{strings.dont_have_account || "Don't have an account?"} </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("SignUp")}
            >
              <Text style={styles.footerLink}>{strings.signup_title || 'Register Here'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#061224",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 50,
    paddingBottom: 30,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36,
  },
  logoBhau: {
    fontSize: 34,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  logoMatka: {
    fontSize: 34,
    fontWeight: "900",
    color: "#E2B048",
    marginLeft: 6,
    letterSpacing: -0.5,
  },
  card: {
    width: screenWidth - 36,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
    shadowColor: "#0A1931",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#07152B",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  phoneChangeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  changePhoneText: {
    color: "#C58B24",
    fontSize: 14,
    fontWeight: "800",
    marginTop: -14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#07152B",
    letterSpacing: 0.8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderWidth: 1.4,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginLeft: 12,
    paddingVertical: 0,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: -4,
  },
  resendTimerText: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "500",
  },
  boldTimer: {
    color: "#07152B",
    fontWeight: "800",
  },
  resendBtnText: {
    color: "#C58B24",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  loginBtnWrapper: {
    borderRadius: 26,
    shadowColor: "#07152B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginBottom: 22,
  },
  loginGradient: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
  footerLink: {
    color: "#E2B048",
    fontSize: 14,
    fontWeight: "800",
  },
});

export default Login;
