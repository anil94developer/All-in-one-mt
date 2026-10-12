/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ImageBackground, Alert, Linking } from 'react-native';
import { currentTheme } from '../../constants/ThemeProvider';
import { screenWidth } from '../../constants/Sizes.constant';
 
import { StyleConstants } from '../../constants/Style.constant';
import { tags } from 'react-native-svg/lib/typescript/xml';
import { app_setting, get_profile } from '../../services/User';
import { imageServerUrl } from '../../constants/Data.constant';
import { t } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons, images } from '../../assets/images';

function DrawerScreen(props) {

    const [userProfileData, setUserProfileData] = useState('')
    const [appSetting, setAppSetting] = useState({})
    const [accountStatus, setAccountStatus] = useState("0")

    useEffect(() => {
        const get_data = async () => {
            let userData = await get_profile();
            setAppSetting(await app_setting())

            console.log(userData)
            setUserProfileData(userData)
        }
        get_data()
        get_profile_data()
    }, [props])
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

    const get_profile_data = async () => {
        let userData = await get_profile();

        console.log("userData------",userData)


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

    return (
        <View style={{ flex: 1, backgroundColor: currentTheme().bgColor1 }}>
            <View style={styles.blueHead}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={styles.ImgBorder}>
                        <Image style={styles.headerimg} source={images.logo} />
                    </View>
                    <View style={{ marginLeft: 15 }}>
                        <Text style={StyleConstants.textWhite2}>
                            {userProfileData?.phone_number}
                        </Text>
                        <Text style={StyleConstants.textWhite2}>
                            {userProfileData?.name}
                        </Text>
                        <Text style={[StyleConstants.textWhite3, { width: screenWidth * (150 / 375) }]}>
                            {userProfileData?.email}
                        </Text>
                    </View>
                </View>
            </View>


            <View style={{ flex: 3 }}>
                <TouchableOpacity onPress={() => props.navigation.navigate('ProfileScreen')} style={styles.tags}>
                    <Image source={icons.userIcon} style={styles.icon} />
                    <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                        Profile  
                    </Text>
                </TouchableOpacity>
                {global.accountStatus == "1" || accountStatus == "1" ?
                    <>
                        <TouchableOpacity onPress={() => props.navigation.navigate('AddFund')} style={styles.tags}>
                            <Image source={icons.rupee} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Add Fund
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => props.navigation.navigate('Withdraw')} style={styles.tags}>
                            <Image source={icons.withdraw} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Withdraw
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => props.navigation.navigate('Wallet')} style={styles.tags}>
                            <Image source={icons.wallet} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Wallet
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('BankDetails')} style={styles.tags}>
                            <Image source={icons.bank} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Manage Bank
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('MarketRate')} style={styles.tags}>
                            <Image source={icons.rupee} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Market Rate
                            </Text>
                        </TouchableOpacity>
                        {/* <View style={{ margin: 20, backgroundColor: currentTheme().textColor, height: 1 }} /> */}
                        <TouchableOpacity onPress={() => props.navigation.navigate('FundTransfer')} style={styles.tags}>
                            <Image source={icons.transaction} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Transfer Fund
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => props.navigation.navigate('BidHistory')} style={styles.tags}>
                            <Image source={icons.transaction} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Bid History
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => props.navigation.navigate('WiningHistory')} style={styles.tags}>
                            <Image source={icons.transaction} style={styles.icon} />
                            <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                                Wining History
                            </Text>
                        </TouchableOpacity>
                    </>

                    :
                    <></>
                }
                <TouchableOpacity onPress={() => logoutHandler()} style={{ flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 10 }}>
                <Image source={icons.logout1} style={styles.socialIcon} />
                <Text style={[StyleConstants.textSize20, { marginLeft: 10 }]}>Log out</Text>
            </TouchableOpacity>
                <View style={{ margin: 20, backgroundColor: currentTheme().textColor, height: 1 }} />


                {/* <TouchableOpacity onPress={() => Linking.openURL(appSetting.share_url)} style={styles.tags}>
                    <Image source={icons.star} style={styles.icon} />
                    <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                        Game Rate
                    </Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity onPress={() => props.navigation.navigate('Wallet')} style={styles.tags}>
                    <Image source={icons.forwardIcon} style={styles.icon} />
                    <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                        How To Play
                    </Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => props.navigation.navigate('Wallet')} style={styles.tags}>
                    <Image source={icons.profile} style={styles.icon} />
                    <Text style={[StyleConstants.textDrawer, { marginLeft: 15 }]}>
                        Change Password
                    </Text>
                </TouchableOpacity> */}

            </View>


            <View style={{ flex: 1 }}>
                {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image source={icons.facebook} style={styles.socialIcon} />
                    <Image source={icons.twitter} style={styles.socialIcon} />
                    <Image source={icons.linkedIn} style={styles.socialIcon} />
                </View> */}
                {/* <View style={{ marginLeft: 20, marginTop: 10 }}>
                    <Text style={StyleConstants.textSize20}>
                        Version 1.1
                    </Text>
                </View> */}
            </View>
            

        </View>
    )
}
// const s = StyleConstants, c = ColorsConstant, styles = StyleSheet.create({

// })
export default DrawerScreen

const styles = StyleSheet.create({
    blueHead: {
        backgroundColor: currentTheme().themeColor,
        height: screenWidth / 2.8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImgBorder: {
        width: 70,
        height: 70,
        borderWidth: 1,
        borderColor: currentTheme().White,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    lngLine: {
        alignSelf: 'center',
        // position: 'absolute',
        borderBottomColor: currentTheme().themeColor,
        borderBottomWidth: 0.5,
        width: screenWidth * (290 / 375),
        top: 15,
        // borderRadius: 10
    },
    tags: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, padding: 10 },
    tags2: { flexDirection: 'row', alignItems: 'center', marginLeft: 20, marginTop: 20 },
    socialIcon: {
        width: 25,
        height: 25,
        marginLeft: 20
    },
    icon: {
        width: 20, height: 20, tintColor: currentTheme().textColor
    },
    headerimg: {
        height: 58,
        width: 58,
        borderRadius: 29,
        alignSelf: 'center',

    },
})