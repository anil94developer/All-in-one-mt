import { StyleSheet } from "react-native";
 
import { fontFamily } from "../../../constants/font";
import { screenWidth, screenHeight } from "../../../constants/Sizes.constant";
import { currentTheme } from "../../../constants/ThemeProvider";
// import { width, color, getStatusBarHeight, font } from "../../common_styles/Color";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // alignItems: "center",
        backgroundColor: currentTheme().appBgColor2,
        // paddingTop: 10
    },
    logo: {
        width: screenWidth, height: screenHeight * (150 / screenHeight)
    },
    otpText: {
        fontSize: 30,
        color: currentTheme().White,
        // marginBottom: screenWidth * (20 / 375),
        fontFamily: fontFamily.robotoBold,
        fontWeight: 'bold'
    },
    otpSubText: {
        color: currentTheme().White,
        fontSize: 22,
        fontFamily: fontFamily.robotoRegular,
        textAlign: "center"
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginVertical: screenWidth * (20 / 375), alignItems: "center" ,},
    cell: {
        paddingVertical: screenWidth * (13 / 375),
        width: screenWidth * (58 / screenWidth),
        height: screenHeight * (58 / screenHeight),
        margin: screenWidth * (5 / 375),
        fontSize: 20,
        textAlign: 'center',
        backgroundColor: currentTheme().bgColor,
        borderRadius: 8,
        color: currentTheme().textColor,
        fontFamily: fontFamily.robotoBold,
        borderWidth: 1,
        borderColor: currentTheme().gary
    },
    focusCell: {
        borderColor: '#000',
        color:'#000'
    },
    resendOtp: {
        color: '#98DBFF',
        fontSize: 18,
        fontFamily: fontFamily.robotoRegular,
        textDecorationLine: "underline"
    },
    timerText: {
        fontFamily: fontFamily.robotoRegular,
        fontSize: 22,
        color: currentTheme().White,
        marginTop: screenWidth * (22 / 375)
    },
    
})
export default styles