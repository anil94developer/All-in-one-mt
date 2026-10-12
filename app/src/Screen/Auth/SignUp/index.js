
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Linking,
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
import { screenHeight, screenWidth } from "../../../constants/Sizes.constant";
import { currentTheme } from "../../../constants/ThemeProvider";
import { base } from "../../../config/appConfig";
import { Dialog } from "../../../context/DialogContext";
import { postDataJson } from "../../../services/Ops";
import { useAppSetting } from "../../../context/AppSettingContext";
import {
  AuthUserIcon,
  AuthPhoneIcon,
  AuthLockIcon,
  AuthEyeIcon,
  AuthEyeOffIcon,
} from "../../../component/MatkaIcons";
import { useLanguage } from "../../../context/LanguageContext";

function SignUp(props) {
  const insets = useSafeAreaInsets();
  const { strings } = useLanguage();
  const { appSetting } = useAppSetting();
  const [firstName, setFirstName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // Register button continuous balanced left-right sway & scale pulse animation
  const translateXRegisterAnim = useRef(new Animated.Value(0)).current;
  const scaleRegisterAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const registerLoop = Animated.loop(
      Animated.sequence([
        // Step 1: Smooth sway left and gentle scale up
        Animated.parallel([
          Animated.timing(translateXRegisterAnim, {
            toValue: -7,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleRegisterAnim, {
            toValue: 1.03,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Step 2: Smooth return to center
        Animated.parallel([
          Animated.timing(translateXRegisterAnim, {
            toValue: 0,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleRegisterAnim, {
            toValue: 1,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Step 3: Smooth sway right and gentle scale up
        Animated.parallel([
          Animated.timing(translateXRegisterAnim, {
            toValue: 7,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleRegisterAnim, {
            toValue: 1.03,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Step 4: Smooth return to center
        Animated.parallel([
          Animated.timing(translateXRegisterAnim, {
            toValue: 0,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleRegisterAnim, {
            toValue: 1,
            duration: 360,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(120),
      ])
    );
    registerLoop.start();
    return () => registerLoop.stop();
  }, [translateXRegisterAnim, scaleRegisterAnim]);

  const signup_method = async () => {
    Keyboard.dismiss();
    if (mobileNumber === "" || password === "" || firstName === "") {
      Dialog.show({
        type: "error",
        text1: "Signup Error !",
        text2: "Please fill Signup details",
      });
    } else if (mobileNumber.length !== 10) {
      Dialog.show({
        type: "error",
        text1: "Mobile Number Error !",
        text2: "Please Enter Mobile Minimum Length 10",
      });
    } else if (password.length < 6) {
      Dialog.show({
        type: "error",
        text1: "Password Error !",
        text2: "Please Enter Password Minimum Length 6",
      });
    } else {
      setLoading(true);
      try {
        const body = {
          name: firstName,
          mobile: mobileNumber,
          password: password,
        };

        const result = await postDataJson(base.signUp, body);

        if (result && result.status === true) {
          setLoading(false);
          const { data } = result;

          AsyncStorage.setItem("phone", mobileNumber);
          AsyncStorage.setItem("mobile", mobileNumber);
          AsyncStorage.setItem("password", password);
          AsyncStorage.setItem(`pwd_${mobileNumber}`, password);
          if (data?.token) AsyncStorage.setItem("token", data.token);
          AsyncStorage.setItem("userData", JSON.stringify(data));
          AsyncStorage.setItem("accountStatus", "1");
          global.accountStatus = "1";

          Dialog.show({
            type: "success",
            text1: "Registration Successful!",
            text2: result?.message || result?.msg || "Welcome to Bhau Matka! Your account has been registered successfully.",
          });

          props.navigation.replace("Drawers", { screen: "Home" });
        } else {
          setLoading(false);
          Dialog.show({
            type: "error",
            text1: "Signup Failed",
            text2: result?.message || result?.msg || "Something went wrong. Please try again.",
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
          <Text style={styles.title}>{strings.create_account || 'Create your new\naccount'}</Text>
          <Text style={styles.subtitle}>{strings.signup_get_started || 'Join Bhau Matka'}</Text>

          {/* Username Field */}
          <View style={styles.inputContainer}>
            <AuthUserIcon size={20} color="#1E293B" />
            <TextInput
              style={styles.textInput}
              placeholder={strings.username_label || 'Username'}
              placeholderTextColor="#94A3B8"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
          </View>

          {/* Phone Number Field */}
          <View style={styles.inputContainer}>
            <AuthPhoneIcon size={20} color="#1E293B" />
            <TextInput
              style={styles.textInput}
              placeholder={strings.phone_placeholder || 'Phone Number'}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          {/* Password Field */}
          <View style={styles.inputContainer}>
            <AuthLockIcon size={20} color="#1E293B" />
            <TextInput
              style={styles.textInput}
              placeholder={strings.password_placeholder || 'Password'}
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              maxLength={20}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {showPassword ? (
                <AuthEyeOffIcon size={20} color="#64748B" />
              ) : (
                <AuthEyeIcon size={20} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>

          {/* Register Button with Continuous Left-Right & Scale Animation */}
          <Animated.View
            style={{
              transform: [
                { translateX: translateXRegisterAnim },
                { scale: scaleRegisterAnim },
              ],
            }}
          >
            <TouchableOpacity
              onPress={signup_method}
              disabled={loading}
              activeOpacity={0.85}
              style={styles.registerBtnWrapper}
            >
              <LinearGradient
                colors={["#07152B", "#162846", "#07152B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.registerGradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.registerBtnText}>{(strings.register_btn || strings.signup_title || 'REGISTER').toUpperCase()}</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Sign In Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>{strings.already_have_account || 'Already have an account?'} </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}
            >
              <Text style={styles.footerLink}>{strings.login_title || 'Sign In'}</Text>
            </TouchableOpacity>
          </View>

          {/* Optional Privacy Policy */}

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
    marginBottom: 32,
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
    fontSize: 25,
    fontWeight: "800",
    color: "#07152B",
    textAlign: "left",
    lineHeight: 33,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderWidth: 1.4,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  registerBtnWrapper: {
    borderRadius: 26,
    shadowColor: "#07152B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 6,
    marginBottom: 22,
  },
  registerGradient: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  registerBtnText: {
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
  privacyRow: {
    alignSelf: "center",
    marginTop: 14,
  },
  privacyText: {
    fontSize: 12,
    color: "#94A3B8",
    textDecorationLine: "underline",
  },
});

export default SignUp;



