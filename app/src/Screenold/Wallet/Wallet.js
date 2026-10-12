/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState, useContext } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    Platform,
    TextInput,
    TouchableOpacity,
    FlatList,
    ImageBackground,
} from 'react-native';
import { currentTheme } from '../../constants/ThemeProvider';
import { list } from '../../enums/List';
import { screenWidth } from '../../constants/Sizes.constant';
import { get_profile, get_wallet_history } from '../../services/User';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postDataContent } from '../../services/Ops';
import { base } from '../../constants/Data.constant';
import { images } from '../../assets/images';
import SmailFillBtn from '../../component/Button/SmallFillBtn';
import DatePicker from '../../component/DatePicker/DatePicker';
import { StyleConstants } from '../../constants/Style.constant';

function Wallet(props) {

    const [wallet, setWallet] = useState("")
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(moment(new Date()).add(1, 'day'))

    useEffect(() => {
        const get_data = async () => {
            setLoading(true)
            let userData = await get_profile();

            setWallet(userData.wallet)
            setLoading(false)

        }
        get_history_data()
        get_data()
    }, [props])

    const get_history_data = async () => {
        let phone_number = await AsyncStorage.getItem("phone")
        setLoading(true)

        var body = new FormData();
        body.append("phone_number", phone_number);
        body.append("date1", moment(fromDate).format("YYYY-MM-DD"))//phone_number);
        body.append("date2", moment(toDate).format("YYYY-MM-DD"))//phone_number);
        console.log(body)
        let result = await postDataContent(base.get_wallet_history, body);
        console.log("bid history", result)
        setHistory(result.result)
        setLoading(false)

    }


    const _goBack = () => {
        props.navigation.goBack()
    }
    return ( 
        <View style={{ flex: 1 }}>
            <View   style={{ width: screenWidth, height: 200,backgroundColor:currentTheme().themeColor }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 30 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate("Drawers",{screen:"Home"})}
                        style={{  height: 40, width: 40,  justifyContent: 'center', borderRadius: 5 }} >
                        <Image source={images.back} style={{ height: 30, width: 30, alignSelf: 'center' }} resizeMode='contain' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: currentTheme().White, right: 15, alignSelf: 'center', fontWeight: '600' }}>Wallet</Text>
                     
                </View>
                </View>
            <View   style={{ height: 180, width: 350, alignSelf: 'center', marginTop: -90, borderRadius: 21,backgroundColor:currentTheme().cardColor1 }} resizeMode='contain' >
            
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginVertical: 25 }}>
                    <View>
                        <Text style={{ color: currentTheme().White, fontSize: 40, fontWeight: '600' }}>₹ {wallet}</Text>
                        <Text style={{ color: currentTheme().White, fontSize: 20 }}>Total Balance</Text>
                    </View>
                    <Image source={images.square} style={{ height: 73, width: 73 }} />
                </View>
                <View style={{ marginTop: -15 }}>
                    <SmailFillBtn
                        label={"Add Fund"}
                        backgroundColor={"#FABB21"}
                        color={currentTheme().textColor}
                        onPress={() => ""}
                    />
                </View>
                </View>
             
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', left: 15, marginVertical: 20 }}>
                <View>
                    <Text style={{ color: currentTheme().textColor, fontSize: 20, fontWeight: '500' }}>From Date</Text>
                    <View style={{ borderWidth: 1,  padding:10, width: screenWidth / 3, borderColor: "#FF493E", borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFAEF' }}>
                        <DatePicker
                            selectedDate={fromDate}
                            setSelectedDate={setFromDate}
                            mode='date'
                            label='To Date'
                            width={screenWidth / 3.1}

                        />
                    </View>

                </View>
                <View>
                    <Text style={{ color: currentTheme().textColor, fontSize: 20, fontWeight: '500' }}>To Date</Text>
                    <View style={{ borderWidth: 1,  padding:10, width: screenWidth / 3, borderColor: "#FF493E", borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFAEF' }}>

                        <DatePicker
                            selectedDate={toDate}
                            setSelectedDate={setToDate}
                            mode='date'
                            label='To Date'
                            width={screenWidth / 3.1}

                        />
                    </View>
                </View>
            </View>
            <View style={{ marginVertical: 15 }}>
                <SmailFillBtn
                    label={"Apply"}
                    backgroundColor={currentTheme().themeColor}
                    color={currentTheme().White}
                    onPress={() => get_history_data()}
                />
            </View>
             <FlatList
                data={history}
                style={{ paddingVertical: 20, }}
                renderItem={({ item, index }) => (
                    <View style={[StyleConstants.cardView, { flexDirection: 'row', marginTop: 10, borderRadius: 5, width: screenWidth - 30 }]}>
                       
                        <View style={{ flex: 2, padding: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: currentTheme().textColor }}>{item.remark}</Text>
                            <Text style={{ fontSize: 12, color: currentTheme().textColor }}>{item.date}</Text>

                        </View>
                        <View style={{ flex: 1, backgroundColor: '#FF493E', padding: 10, justifyContent: 'center', borderRadius: 5 }}>
                            <Text style={{ fontSize: 18, color: currentTheme().White, alignSelf: 'center' }}>₹ {item.amount}</Text>

                        </View>
                        {/* <View style={{ flex: 2, padding: 10, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme().textColor, alignSelf: 'center' }}>{item.time}</Text>
                </View> */}

                    </View>
                )
                }
                ListFooterComponent={(
                    <View style={{ height: 100 }}></View>
                )}
                showsVerticalScrollIndicator={false} />
        </View>

    );
}
export default Wallet;
