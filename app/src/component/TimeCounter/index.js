import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ColorsConstant } from '../../constants/Colors.constant';
import { fontFamily } from '../../constants/font';
// import { font, color } from '../common_styles/Color';
import { currentTheme, useTheme } from '../../constants/ThemeProvider';


const TimeCounter = ({ startCounting, resetOtpState,count }) => {
//   const { theme, updateTheme } = useTheme()

    const [counter, setCounter] = useState(count);
    const [isResendEnable, setResendEnable] = useState(true);

    useEffect(() => {
        if (startCounting) {
            const timer =
                counter > 0
                    ? setInterval(() => {
                        setCounter(counter - 1);
                    }, 1000)
                    : setResendEnable(false);
            return () => clearInterval(timer);
        }
    }, [counter, startCounting]);

    const onResend = () => {
        resetOtpState();
        setResendEnable(true);
        if (counter > 0) {
        } else {
            setCounter(60);
        }
    };

    return (
        <View>
            <View style={{ marginVertical: 20, alignItems: 'center' }}>
                <TouchableOpacity disabled={isResendEnable} onPress={onResend}>
                    <Text
                        style={{
                            fontFamily: fontFamily.robotoRegular,
                            color: isResendEnable ? currentTheme().gary : currentTheme().themeColor,
                            fontSize: 20,
                            textDecorationLine: 'underline',
                        }}>
                        Resend Code?
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text
                    style={{
                        fontFamily: fontFamily.robotoMedium,
                        color: currentTheme().black,
                        fontSize: 20,
                    }}>
                    00:{counter?.toString()?.length < 2 ? `0${counter}` : counter}
                </Text>
            </View> 
        </View>
    );
};

export default TimeCounter;