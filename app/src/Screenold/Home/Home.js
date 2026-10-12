/* eslint-disable curly */
/* eslint-disable prettier/prettier */
/* eslint-disable semi */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from 'react'
// eslint-disable-next-line prettier/prettier
import { StyleSheet, Text, TouchableOpacity, View, RefreshControl, Image, TextInput, ImageBackground, FlatList, SafeAreaView, BackHandler, Alert, Linking, ScrollView } from 'react-native'
import { icons, images } from '../../assets/images';
import { currentTheme } from '../../constants/ThemeProvider';
import { StyleConstants } from '../../constants/Style.constant';
import { screenHeight, screenWidth } from '../../constants/Sizes.constant';
import { get_banner, get_home_data, get_slider } from '../../services/Dashboard';
import { base } from '../../constants/Data.constant';
import { app_setting, get_profile } from '../../services/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SmailFillBtn from '../../component/Button/SmallFillBtn';
import { list } from '../../enums/List';
import SmallSlider from '../../component/Slider/SmallSlider';
const Home = props => {
  // eslint-disable-next-line prettier/prettier
  const [loading, setLoading] = useState(true);
  const [homeData, setHomeData] = useState([])
  const [bannerData, setBannerData] = useState([])
  const [search, setSearch] = useState("")
  const [userData, setUserData] = useState("")
  const [refreshing, setRefreshing] = React.useState(false);
  const [accountStatus, setAccountStatus] = useState("0")
  const [appSetting, setAppSetting] = useState({})

  useEffect(() => {
    get_data()
  }, [props])
  const get_data = async () => {
    get_profile_data()
    setAppSetting(await app_setting())
    let result = await get_home_data()
    setHomeData(result.result)
    setUserData(await get_profile())
    let sliderResult = await get_slider(base.slider)
    console.log(sliderResult)
    setBannerData(sliderResult)
    ///onRefresh()

    if (homeData) {
      setLoading(false)
    }

  }
  const get_profile_data = async () => {
    let userData = await get_profile();
    console.log(userData)
    if (userData.status == "0") {
      AsyncStorage.setItem("accountStatus", "0")
      global.accountStatus = "0"
      setAccountStatus("0")
    } else {
      global.accountStatus = "1"
      AsyncStorage.setItem("accountStatus", "1")
      setAccountStatus("1")


    }
    // setLoading(false)
  }

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to go back?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  function timeConvert(timeStr) {
    const [hoursStr, minutesStr] = timeStr.split(":");
    let [hours, minutes] = [parseInt(hoursStr), parseInt(minutesStr)];

    // Adjust hours for PM
    if (timeStr.includes("pm") && hours !== 12) {
      hours += 12;
    }
    // Adjust hours for AM
    if (timeStr.includes("am") && hours === 12) {
      hours = 0;
    }

    // Create a new Date object and set the hours and minutes
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);

    // Convert time to seconds and return
    return Math.floor(time.getTime() / 1000);
  }

  const renderItem = ({ item, index }) => {
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const closeTimeInSeconds = timeConvert(item.close_time);

    // Determine market status
    const marketStatus = timeConvert(item.open_time) > timeConvert("07:00 am") && currentTimeInSeconds <= closeTimeInSeconds;

    //console.log(  timeConvert(item.close_time) , new Date().getTime()/1000)
    return <TouchableOpacity
      disabled={(global.accountStatus == "0" || accountStatus == "0") || !marketStatus || item.game_status == "0"}
      onPress={() => { props.navigation.navigate("GameScreen", { selectItem: item }) }}
      style={styles.header}>
      <Text style={{ color: currentTheme().themeColor, fontSize: 20, fontWeight: 'bold', flex: 1 }}>{item.games_name}</Text>
      <View style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image source={icons.watch} style={[StyleConstants.icon, { tintColor: currentTheme().success, height: 15, width: 15 }]} />
          <Text style={{ color: currentTheme().success, fontSize: 12, marginLeft: 5 }}>OPEN:- {item.open_time}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', alignContent: 'flex-end', alignItems: 'flex-end', }}>
          <Image source={icons.watch} style={[StyleConstants.icon, { tintColor: currentTheme().errors, alignSelf: 'flex-end', height: 15, width: 15 }]} />
          <Text style={{ color: currentTheme().errors, fontSize: 12, alignContent: 'center', marginLeft: 5 }}>CLOSE:- {item.close_time}</Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={(global.accountStatus == "0" || accountStatus == "0") || !marketStatus || item.game_status == "0"}
        onPress={() => { props.navigation.navigate("GameScreen", { selectItem: item }) }}
        style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

        <TouchableOpacity
          onPress={() => { props.navigation.navigate("ChartScreen", { games_name: item.games_name }) }}
          style={{ flex: 1, height: 50, width: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Image source={icons.chart} style={[{ height: 30, width: 30 }]} />
        </TouchableOpacity>
        {/* <View style={{ flex: 2, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}> */}



        {/* <Text style={{ color: marketStatus && item.game_status == "1" ? currentTheme().success : currentTheme().errors }}>{marketStatus && item.game_status == "1" ? 'Market is open. Enjoy !' : 'Market is closed'}</Text> */}
        <Text style={{ flex: 2, color: currentTheme().blue, fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>{item.open_pana}_{item.open_digit}{item.close_digit}_{item.close_pana}</Text>


        {/* </View> */}
        {/* <View style={{flex:1, paddingHorizontal: 10, flexDirection: 'row', }}> */}

        <TouchableOpacity
          disabled={(global.accountStatus == "0" || accountStatus == "0") || !marketStatus || item.game_status == "0"}

          onPress={() => { props.navigation.navigate("GameScreen", { selectItem: item }) }}
          // onPress={() => { props.navigation.navigate("ChartScreen", { games_name: item.games_name }) }}
          style={{ flex: 1, height: 50, width: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Image source={(global.accountStatus == "0" || accountStatus == "0") || !marketStatus || item.game_status == "0" ? icons.closebtn : icons.startButton} style={[{ height: 40, width: 40, borderRadius: 10, resizeMode: 'stretch' }]} />
        </TouchableOpacity>
        {/* </View> */}

      </TouchableOpacity>
    </TouchableOpacity>
  };


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      get_data()
      // get_profile_data()
    }, 2000);
  }, []);


  return (

    <View style={{ flex: 1 }}>
      <View style={{ width: screenWidth, height: 200, backgroundColor: currentTheme().themeColor }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 30 }}>
          <TouchableOpacity onPress={() => props.navigation.openDrawer()}
            style={{ borderWidth: 1, height: 40, width: 40, borderColor: currentTheme().White, justifyContent: 'center', backgroundColor: currentTheme().White, borderRadius: 5 }} >
            <Image source={images.filter} style={{ height: 30, width: 30, alignSelf: 'center' }} resizeMode='contain' />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, color: currentTheme().White, alignSelf: 'center', fontWeight: '600' }}>Home</Text>
          {global.accountStatus == "1" || accountStatus == "1" ?
            <Text style={[styles.text, { color: currentTheme().White, fontSize: 20, fontWeight: '600' }]}> ₹ {userData.wallet}</Text>
              :
            <></>
          }
        </View>
      </View>

      <View style={{ marginTop: -110, borderRadius: 20 }}>
        <SmallSlider list={bannerData} />

      </View>
 

      <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'center' }}>
        {global.accountStatus == "1" || accountStatus == "1" ?
          <>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.navigate('Withdraw')}>

              <Text style={[styles.btnText, styles.btn]}>Withdraw</Text>
              <Image source={icons.minus}
                style={[styles.icon, {}]}></Image>
            </TouchableOpacity>

          </>
          :
          <></>
        }
        <TouchableOpacity style={{ marginHorizontal: 10, marginTop: 5 }} onPress={() => Linking.openURL('whatsapp://send?text=hello&phone=' + appSetting.admin_wp)}>
          <Image source={icons.whatapp}
            style={styles.icon}></Image>
          {/* <Text style={styles.btnText}>WhatsApp</Text> */}
        </TouchableOpacity>
        {global.accountStatus == "1" || accountStatus == "1" ?
          <>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.navigate('AddFund')}>

              <Text style={[styles.btn, styles.btnText]}>Add Point</Text>
              <Image source={icons.plus}
                style={[styles.icon, {}]}></Image>

            </TouchableOpacity>

          </>
          :
          <></>
        }
      </View>
      <View style={[{ marginTop: 10, height: screenHeight / 2 }]}>
        <FlatList
          data={homeData}
          renderItem={renderItem}
          numColumns={1}
          style={{
          }}
          showsVerticalScrollIndicator={false}
          // ListFooterComponent={(
          //   <View style={{ height: 100 }}></View>
          // )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

      </View>

    </View>




  );
}


export default Home;


const styles = StyleSheet.create({

  tgl: {
    backgroundColor: currentTheme().White,
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  search: {
    width: '85%',
    marginLeft: 10,
    borderRadius: 5,
    height: 45,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10
  },
  slider: {
    // height: screenWidth / 1.7,
    marginTop: 10,
    // marginLeft:8
  },
  image: {
    height: 110,
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
    // flex:1
  },
  title: {
    color: currentTheme().textColor,
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    margin: 4,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth - 30,
    padding: 1,
    borderRadius: 10,
    backgroundColor: currentTheme().lightGray,
    // flexDirection: 'row'
  },
  text: {
    fontSize: 16,
    color: '#000'
  },
  btn: {
    borderRadius: 10,
    backgroundColor: currentTheme().themeColor,
    padding: 10,
    // marginHorizontal: 5,
    // flex: 1,
    // width:screenWidth/3.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    height: 40, width: 40,
    alignSelf: 'center',
    marginLeft: 5
  },
  btnText: {
    color: currentTheme().antiTextColor,
    marginHorizontal: 10
    // marginLeft: 5
  }
});