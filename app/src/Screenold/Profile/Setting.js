/* eslint-disable prettier/prettier */

import React, { useState } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Image, BackHandler, StyleSheet } from 'react-native'
import images, { icons } from "../../../asstes/images";
import { StyleConstants } from "../../../constants/Style.constant";
import { currentTheme, useTheme } from "../../../constants/ThemeProvider";
import { useFocusEffect } from "@react-navigation/native";
import { base } from "../../../constants/Data.constant";
import { getApiCall } from "../../../services/AppSetting";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { postApiCall } from "../../../services/AppSetting";
import { putData } from "../../../services/Ops";
import { Switch } from 'react-native-switch'
import Header from "../../../Widget/Header";
import { screenWidth } from "../../../constants/Sizes.constant";


const Setting = (props) => {
    const { theme } = useTheme()
    const [allNotification, setAllNotification] = useState(false);
    const [newOfferNotification, setNewOfferNotification] = useState(false);
    const [orderNotication, setOrderNotication] = useState(false);
    const [setupDevicePIN, setSetupDevicePIN] = useState(false);


    const handler = () => {
        props.navigation.navigate("Tabs", { screen: "Settings" })
    }
    useFocusEffect(
        React.useCallback(() => {
            // getNotificationList()
            const backAction = () => {
                handler()
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );

            return () => backHandler.remove();
        }, [props]))


    const _goBack = () => {
        props.navigation.navigate('Drawers', { screen: 'Home' });
    };
    return (
        <View style={[styles.container]}>
            <Header
                leftButtonType="back"
                title={"Settings"}
                leftButtonAction={_goBack}

            />


            <Text style={{ fontSize: 16, color: theme.black, fontWeight: "700", marginHorizontal: 20, marginTop: 40 }} >Manage Notification</Text>
            <Text style={{ fontSize: 16, color: theme.black, fontWeight: "500", marginTop: 20, marginHorizontal: 20 }}>Manage which events you would like receive app notifications for.</Text>
            <View style={{ borderBottomWidth: 1, marginHorizontal: 20, marginVertical: 20, borderBottomColor: theme.gary }} />
            <View style={{ backgroundColor: currentTheme().White, paddingVertical: 20, marginHorizontal: 10, width: screenWidth - 20 }}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20 }}>
                    <Text style={{ fontSize: 16, color: theme.black, fontWeight: "500", marginTop: 0, marginHorizontal: 0, width: screenWidth * (250 / 375) }}>All Notification</Text>
                    <View
                    //  style={{backgroundColor:isEnabledInquiry ? theme.themeColor : theme.gary,borderRadius:15}}
                    >

                        <Switch
                            value={allNotification}
                            onValueChange={() => setAllNotification(!allNotification)}
                            // disabled={false}
                            activeText={''}
                            inActiveText={''}
                            circleSize={24}
                            // outerCircleStyle={{alignSelf:'flex-end'}}
                            // barHeight={1}
                            circleBorderWidth={1}
                            backgroundActive={theme.themeColor}
                            backgroundInactive={theme.gary}
                            circleActiveColor={theme.White}
                            circleInActiveColor={theme.themeColor}
                            containerStyle={{ marginHorizontal: 20, borderWidth: 1, borderColor: currentTheme().White }}
                            // // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            // changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ height: 22, width: 22, position: 'absolute' }} // style for inner animated circle for what you (may) be rendering inside the circle
                        // outerCircleStyle={{backgroundColor:'red'}} // style for outer animated circle
                        // renderActiveText={false}
                        // renderInActiveText={false}
                        // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        // switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        // switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        // switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, color: theme.black, fontWeight: "500", marginTop: 0, marginHorizontal: 0, width: screenWidth * (250 / 375) }}>New Offer Notification</Text>
                    <View>
                        <Switch
                            value={newOfferNotification}
                            onValueChange={() => setNewOfferNotification(!newOfferNotification)}
                            // disabled={false}
                            activeText={''}
                            inActiveText={''}
                            circleSize={24}
                            // outerCircleStyle={{alignSelf:'flex-end'}}
                            // barHeight={1}
                            circleBorderWidth={1}
                            backgroundActive={theme.themeColor}
                            backgroundInactive={theme.gary}
                            circleActiveColor={theme.White}
                            circleInActiveColor={theme.themeColor}
                            containerStyle={{ marginHorizontal: 20, borderWidth: 1, borderColor: currentTheme().White }}
                            // // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            // changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ height: 22, width: 22, position: 'absolute' }} // style for inner animated circle for what you (may) be rendering inside the circle
                        // outerCircleStyle={{}} // style for outer animated circle
                        // renderActiveText={false}
                        // renderInActiveText={false}
                        // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        // switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        // switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        // switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20 }}>
                    <Text style={{ fontSize: 16, color: theme.black, fontWeight: "500", marginTop: 0, marginHorizontal: 0, width: screenWidth * (250 / 375) }}>Order Status Change Notification</Text>
                    <View>
                        <Switch
                            value={setupDevicePIN}
                            onValueChange={() => setSetupDevicePIN(!setupDevicePIN)}
                            // disabled={false}
                            activeText={''}
                            inActiveText={''}
                            circleSize={24}

                            ios_backgroundColor={theme.White}

                            // outerCircleStyle={{alignSelf:'flex-end'}}
                            // barHeight={1}
                            circleBorderWidth={1}
                            backgroundActive={theme.themeColor}
                            backgroundInactive={theme.gary}
                            circleActiveColor={theme.White}
                            circleInActiveColor={theme.themeColor}
                            containerStyle={{ marginHorizontal: 20, borderWidth: 1, borderColor: currentTheme().White }}
                            // // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            // changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ height: 22, width: 22, position: 'absolute' }} // style for inner animated circle for what you (may) be rendering inside the circle
                        // outerCircleStyle={{}} // style for outer animated circle
                        // renderActiveText={false}
                        // renderInActiveText={false}
                        // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        // switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        // switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        // switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 20 }}>
                    <View>
                        <Text style={{ fontSize: 16, color: theme.black, fontWeight: "500", marginTop: 0, marginHorizontal: 0, width: screenWidth * (250 / 375) }}>Setup Device PIN</Text>
                        <Text style={{ color: currentTheme().themeColor }}>Change</Text>
                    </View>
                    <View>
                        <Switch
                            value={orderNotication}
                            onValueChange={() => setOrderNotication(!orderNotication)}
                            // disabled={false}
                            activeText={''}
                            inActiveText={''}
                            circleSize={24}

                            ios_backgroundColor={theme.White}

                            // outerCircleStyle={{alignSelf:'flex-end'}}
                            // barHeight={1}
                            circleBorderWidth={1}
                            backgroundActive={theme.themeColor}
                            backgroundInactive={theme.gary}
                            circleActiveColor={theme.White}
                            circleInActiveColor={theme.themeColor}

                            containerStyle={{ marginHorizontal: 20, borderWidth: 1, borderColor: currentTheme().White }}
                            // // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            // changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ height: 22, width: 22, position: 'absolute' }} // style for inner animated circle for what you (may) be rendering inside the circle
                        // outerCircleStyle={{}} // style for outer animated circle
                        // renderActiveText={false}
                        // renderInActiveText={false}
                        // switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        // switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        // switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        // switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: currentTheme().bgColor
    }
})