import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Linking, View, Image } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

import { useNavigation } from '@react-navigation/native';
import { icons, images } from '../../assets/images';
import { currentTheme } from '../../constants/ThemeProvider';

const QrScreen = () => {
    const navigation = useNavigation();
    const [torchEnabled, setTorchEnabled] = useState(false);

    const onSuccess = (e) => {
        Linking.openURL(e.data).catch((err) =>
            console.error('An error occurred', err)
        );
    };

    const toggleTorch = () => {
        setTorchEnabled(!torchEnabled);
    };

    return (
        <>
            {/* Custom header with back icon */}
            <View style={[styles.header, { backgroundColor: currentTheme().backgroundbg }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={icons.leftarrow1} style={{ height: 25, width: 30, tintColor: currentTheme().secondaryColor }} resizeMode='contain' />
                </TouchableOpacity>
                {/* Add a space between the icons */}
                <View style={[, { flex: 0, backgroundColor: currentTheme().backgroundbg }]} />
                <TouchableOpacity onPress={toggleTorch}>
                    <TouchableOpacity onPress={toggleTorch}>
                        {torchEnabled ? (
                            <Image source={icons.torch} style={{ height: 25, width: 30, tintColor: currentTheme().secondaryColor }} />
                        ) : (
                            <Image source={icons.flashlight} style={{ height: 25, width: 30, tintColor: currentTheme().secondaryColor }} />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>

            {/* QR code scanner component */}
            <QRCodeScanner
                onRead={onSuccess}
                cameraTimeout={10000}
                flashMode={torchEnabled ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                bottomContent={
                    <TouchableOpacity style={[styles.buttonTouchable, {}]}>
                        <Text style={styles.buttonText}>OK. Got it!</Text>
                    </TouchableOpacity>
                }
            />
        </>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: currentTheme().backgroundbg
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});

export default QrScreen;
