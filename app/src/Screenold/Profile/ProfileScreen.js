/* eslint-disable prettier/prettier */
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  I18nManager,
  Image,
  ImageBackground,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { currentTheme } from '../../constants/ThemeProvider';
import { screenHeight, screenWidth } from '../../constants/Sizes.constant';
import { images, icons } from '../../assets/images';
import { useFocusEffect, } from '@react-navigation/native';
import { lang, langague_change } from '../../Language/languge';
import LargefillBtn from '../../component/Button/LargefillBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base, imageServerUrl } from '../../constants/Data.constant';
import { getApiCall, postApiCall } from '../../services/AppSetting';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import moment from 'moment'; 
import { useTranslation } from 'react-i18next';
// import { FlatList, / } from 'react-native-gesture-handler';
import Divider from '../../component/Divider';
import { open_link } from '../../Utlies/FunctionFile';
import { StyleConstants } from '../../constants/Style.constant';
import { app_setting, get_profile } from '../../services/User';
import Loading from '../../component/loading'; 
import { postDataContent } from '../../services/Ops';
import Header from '../../Widget/Header';
// import i18n, { changeLanguage } from 'i18next'

const ProfileScreen = props => {
  const { t } = useTranslation()
  const [language, setLanguage] = useState('en')
  const [loader, setLoader] = useState(false)
  const [userProfileData, setUserProfileData] = useState('')
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] =useState(false)
  const [appSetting, setAppSetting]= useState({})

  useEffect(() => {
    const get_data = async () => {
      setUserProfileData(await get_profile()) 
      setAppSetting(await app_setting())  
        setLoading(false) 
    }
    get_data()
  }, [props])


  const handler = () => {
    props.navigation.navigate('Tabs', { screen: 'Home' })
  }
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        handler()
        // return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, [props]))


  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Serv U Application',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (e) {

    }
  }



  // const SubComponent = ({ index,item }) => {
  //   return (

  //       <TouchableOpacity key={index} onPress={()=>{item.route}} style={styles.flex}>
  //         <View style={styles.subflex}>
  //           <Image source={item.icon} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
  //           <Text style={[styles.label, { color: currentTheme().textColor }]}>{item.name}</Text>
  //         </View>
  //         <Image source={icons.leftArrow} style={styles.rightimg} />
  //       </TouchableOpacity>

  //   );
  // };

  const logoutHandler = () => {
    Alert.alert('Logout', 'Are you sure you want logout ?', [
      {
        text: 'Yes',
        onPress: async () => {
          await AsyncStorage.removeItem("phone")
          await AsyncStorage.removeItem("email")

          props.navigation.navigate('Login')
        }
      },
      {
        text: 'No',
        onPress: () => console.log('no'),
      },
    ]);
  };


  const delete_account = () => {
    Alert.alert(t('Delete Acount'), t('Are you sure delete account'), [
      {
        text: t('Yes'),
        onPress: async () => {
          delete_account_fun()
        }
      },
      {
        text: t('No'),
        onPress: () => console.log('no'),
      },
    ]);
  };


  const delete_account_fun = async () => {
    let phone_number = await AsyncStorage.getItem("phone")

    var body = new FormData();
    body.append("phone_number", phone_number); 
    let result = await postDataContent(base.deleteAccount, body);
    console.log(result)
    if (result.success == 1) {
      Toast.show({ type: 'success', text1: result.msg });
      AsyncStorage.clear();
      props.navigation.navigate("Login")
    } else {
      Toast.show({ type: 'error', text1: result.msg });
    }
  };

  const _goBack = () => {
    props.navigation.goBack()
}
  return (
    <SafeAreaView>
      <ScrollView  >
        <View style={[styles.container, {  }]}>
        {/* <Header
                leftButtonType="back"
                title="Profile"
                leftButtonAction={_goBack}
                rightButttonType="refresh"
            /> */}
          { loading &&
              <Loading />
            }
              {/* <View
                // source={images.headerbg}
                style={{ width: screenWidth, height: 200 ,backgroundColor:currentTheme().themeColor,borderBottomEndRadius:50,borderTopStartRadius:50}}>
                <TouchableOpacity onPress={() => {}}style={[styles.header, {
                  borderColor: currentTheme().inputBorderColor1,
                  backgroundColor: currentTheme().bgColor
                }]}>
                  {userProfileData.image == null || userProfileData.image == '' ? 
                  <Image style={styles.headerimg} source={images.logo} />
                    :
                    <ImageBackground style={styles.headerimg} imageStyle={{borderRadius:350}} source={{ uri:  userProfileData.image }}>
                    </ImageBackground>
                  }
                   
                  <View style={[StyleConstants.RowView, { marginLeft: 20, width: screenWidth - 170 }]}>
                    <View>
                      <Text style={[styles.headertxt, { color: currentTheme().black, }]}>{userProfileData.name}</Text>
                      <Text style={[styles.dob, { color: currentTheme().black }]}>{userProfileData.phone_number}</Text>
                      <Text style={[styles.dob, { color: currentTheme().black }]}>{moment(userProfileData.dob).format("MM/DD/YYYY")}</Text>
                    </View>
                    <Image source={icons.nextArrow} style={{ width: 24, height: 24, tintColor: currentTheme().gary }} />
                  </View>
                </TouchableOpacity>
              </View>
 

          <View style={[styles.subheader, { borderColor: currentTheme().antiTextColor, backgroundColor: currentTheme().White }]}>
            <TouchableOpacity onPress={() => { props.navigation.navigate("SetPassword", { screen: "changepassword", mobile: 9982669294, country_code: 91 }) }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.lock} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Change Password</Text>
              </View>
              <Image source={icons.nextArrow} style={styles.rightimg} />
            </TouchableOpacity> 
            <TouchableOpacity onPress={() => { onShare() }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.userPlus} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Invite Friends</Text>
              </View>
              <Image source={icons.nextArrow} style={styles.rightimg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { open_link(appSetting.share_url) }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.star} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Rate us on App Store</Text>
              </View> 
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { delete_account() }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.delete2} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Delete Account</Text>
              </View> 
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => { props.navigation.navigate("Content", { screen: "About us", url: "about-us" }) }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.about} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>About Us</Text>
              </View>
              <Image source={icons.nextArrow} style={styles.rightimg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { props.navigation.navigate("Content", { screen: "Privacy Policy", url: "privacy-policy" }) }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.privacy} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Privacy Policy</Text>
              </View>
              <Image source={icons.nextArrow} style={styles.rightimg} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { props.navigation.navigate("Content", { screen: "Terms Conditions", url: "terms-and-conditions" }) }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.trems} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Terms & Conditions</Text>
              </View>
              <Image source={icons.nextArrow} style={styles.rightimg} />
            </TouchableOpacity>
            <Divider /> 
            <TouchableOpacity onPress={() => { logoutHandler() }} style={styles.flex}>
              <View style={styles.subflex}>
                <Image source={icons.logout} style={[styles.lefticon, { tintColor: currentTheme().textColor }]} />
                <Text style={[styles.label, { color: currentTheme().textColor }]}>Logout</Text>
              </View> 
            </TouchableOpacity>
            <View style={{ height: 20 }}></View>
 
          </View>  */}
            <View style={{ flex: 1 }}>
            <View style={{ width: screenWidth, height: 140, backgroundColor: currentTheme().themeColor }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 30 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Drawers',{screen:'Home'})}
                        style={{ borderWidth: 1, height: 40, width: 40, borderRadius: 50, borderColor: currentTheme().White, justifyContent: 'center' }}>
                        <Image source={images.backarrow} style={{ height: 18, width: 8, alignSelf: 'center' }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: currentTheme().White, right: 20, alignSelf: 'center', fontWeight: '600' }}>Profile</Text>
                    <View></View>
                </View>
            </View>
            <View style={{ alignSelf: 'center', marginTop: -50 }}>
                <Image source={images.image} style={{ height: 120, height: 120 }} resizeMode="contain" />
            </View>
            <Text style={{ color: currentTheme().textColor, fontSize: 20, fontWeight: '500', textAlign: "center" }}>{userProfileData.name}</Text>
            <Text style={{ color: "#9EA4AE", fontSize: 18, textAlign: 'center' }}>{userProfileData.phone_number}</Text>

            <TouchableOpacity onPress={() => { props.navigation.navigate("SetPassword", { screen: "changepassword", mobile: userProfileData.phone_number, country_code: 91 }) }} 
             style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 20
            }}>
                <Image source={images.lock} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Change Password</Text>

            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { onShare() }}  style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.invite} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Invite Friends</Text>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => { open_link(appSetting.share_url) }}  style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.star} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Rate Us On App Store</Text>

            </TouchableOpacity>
            <TouchableOpacity onPress={() => { delete_account() }}  style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.delete} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Delete Account</Text>

            </TouchableOpacity>
            {/* <TouchableOpacity style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.about} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>About Us</Text>

            </TouchableOpacity>
            <TouchableOpacity style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.privacy} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Privacy Policy</Text>

            </TouchableOpacity>
            <TouchableOpacity style={{
                borderWidth: 1, height: 50, width: screenWidth - 40, borderRadius: 10, borderColor: '#E5E7EB', alignSelf: 'center',
                flexDirection: 'row', alignItems: 'center', marginTop: 10
            }}>
                <Image source={images.terms} style={{ height: 27, width: 27, left: 15 }} resizeMode="contain" />
                <Text style={{ color: currentTheme().textColor, fontSize: 18, left: 30 }}>Terms & Conditions</Text>

            </TouchableOpacity> */}
            <View style={{ marginTop: 25 }}>
                <TouchableOpacity onPress={() => props.navigation.navigate('MilanNight')}
                    style={{
                        backgroundColor: currentTheme().themeColor, height: 50, width: screenWidth - 40,
                        borderRadius: 10, alignSelf: 'center', justifyContent: 'center', flexDirection: 'row', alignItems: 'center'
                    }}>
                    <Image source={images.logout} style={{ height: 27, width: 27,tintColor:currentTheme().White }} resizeMode='contain' />
                    <Text style={{ color: currentTheme().White, fontSize: 18, fontWeight: '600', marginLeft: 10 }}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>

           </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  header: {
    width: screenWidth - 40,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20
  },
  headerimg: {
    height: 58,
    width: 58,
    borderRadius: 29,
    alignSelf: 'center',

  },
  headertxt: {
    fontSize: 18,
    fontWeight: '500',
    // alignSelf: 'center',
    marginVertical: 5,
  },
  dob: {
    fontSize: 15,
    fontWeight: '400',
    // alignSelf: 'center',

    marginBottom: 5,
  },
  editimg: {
    height: 20,
    width: 20,
    borderRadius: 29,
    alignSelf: 'flex-end',
    top: 0,
    bottom: 0,
    tintColor: currentTheme().orange

  },
  subheader: {
    width: screenWidth - 40,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 20,
    marginTop: 20,
    bottom: 10,
    top: -60

  },
  rightimg: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    tintColor: currentTheme().gary
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    // backgroundColor:currentTheme().borderColor
  },
  lefticon: {
    height: 24,
    width: 24,

  },
  label: {
    fontSize: 16,
    fontWeight: '400',

    marginLeft: 20,
  },
  subflex: {
    flexDirection: 'row',
  },
  divider: {
    borderBottomWidth: 1,
    marginTop: 20,

    marginHorizontal: 20,
  },
});
