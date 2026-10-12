import React, { useEffect } from 'react';
import { base, mainUrl } from '../../constants/Data.constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Image, NativeModules, Platform,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'; 
import { screenHeight, screenWidth } from '../../constants/Sizes.constant';
import { images } from '../../assets/images'; 
import { currentTheme } from '../../constants/ThemeProvider'; 
import { get_profile } from '../../services/User';
 
function Splash(props) {

  useEffect(() => {
     
    const get_data = async () => {
      // AsyncStorage.clear()
      let userData = await get_profile();
      //console.log(userData)
      if (userData.status == "0") {
        AsyncStorage.setItem("accountStatus", "0")
        global.accountStatus = "0"

      } else {

        AsyncStorage.setItem("accountStatus", "1")

        global.accountStatus = "1"

      }
     check_login();
      // setLoading(false)
    }
   get_data()


  }, [props]);

  const check_login = async () => {
    setTimeout(async () => {
      let phone = await AsyncStorage.getItem('phone');
      if (phone == '' || phone == null) {
       props.navigation.navigate('SignUp');
      } else {
        // props.navigation.replace('HomeScreen');

        props.navigation.replace('Drawers', { screen: 'Home' });
      }
    }, 2000);
  };

  // fadeAnim will be used as the value for opacity. Initial Value: 0
   
  return (
    <View style={{ flex: 1, backgroundColor: currentTheme().themeColor }}>
      <View style={ls.flexView}>
        <Image source={images.logo} style={ls.logo} />
        {/* <Text style={[StyleConstants.textBold14, { color: currentTheme().primaryColor, textAlign: 'center'}]}>{t("login_screen.text")}</Text> */}

      </View>
    </View>
  );
}
const ls = StyleSheet.create({
  flexView: {
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:currentTheme().backgroundbg
  },
  splashLogoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    height: 120,
    width: 120,
    // resizeMode:''
    borderRadius:100
  },
});
export default Splash;
