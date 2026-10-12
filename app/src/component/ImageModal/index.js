import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  PermissionsAndroid,
} from 'react-native';
import { Dialog } from '../../context/DialogContext';
import ImagePicker from 'react-native-image-crop-picker';

// ::::::::::::::::::::::::::::::::: import constants
import { StyleConstants } from '../../constants/Style.constant';
import { MarginConstant } from '../../constants/Margin.constant';
import { screenWidth } from '../../constants/Sizes.constant';
import DocumentPicker, { types } from 'react-native-document-picker';
import images, { icons } from '../../assets/images';
import { currentTheme } from '../../constants/ThemeProvider';

function ImageModal(props) {
  const {
    modalVisibleImage,
    setModalVisibleImage,
    image,
    setImage,
    imageUri,
    setImageUri,
    cameraVisable,
    galleryVisable,
    documentVisable,
    videoVisable,
    onPress,
  } = props;

  const [fileType, setFileType] = useState("image");



  ////////////////////image picker//////////////////
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        pic_camera();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pic_camera = () => {
    setFileType("image")
    ImagePicker.openCamera({
      cropping: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        try {
          console.log('image.path', image.path);
          // if (image.size / 1000 > 5120 || image.size / 1000 < 10) {
          //   Toast.show({
          //     type: 'error',
          //     text2: 'Please image select only Min size 10 KB to Max size 5 MB',
          //   });
          // } else {
          setModalVisibleImage(false);

          setImageUri(image.path);

          let name = new Date().getTime() + '.png';
          setImage(name);
          onPress(name, image.path, "image");
          // }
        } catch (e) { }
      })
      .catch(error => {
        // add this to your code
      });
  };

  const pic_gallery = () => {
    setFileType("image")

    ImagePicker.openPicker({
      // width: 300,
      // height: 400,
      cropping: true,
      compressImageQuality: 0.5,
    })
      .then(image => {
        console.log('image.path', image.path);
        if (image.size / 1000 > 5120 || image.size / 1000 < 10) {
          Dialog.show({
            type: 'error',
            text1: 'Image Size',
            text2: 'Please image select only Min size 10 KB to Max size 5 MB',
          });
        } else {
          setModalVisibleImage(false);

          setImageUri(image.path);
          let name = new Date().getTime() + '.png';
          setImage(name);
          onPress(name, image.path, "image");
          // setModalVisibleImage(false);
        }
      })
      .catch(error => {
        setModalVisibleImage(false);

        // add this to your code
      });
  };

  const handleVideoSelection = () => {
    setFileType("video")

    const options = {
      title: 'Video Picker',
      mediaType: 'video',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };
    ImagePicker.openPicker(options)
      .then(image => {
        console.log('image.path', image.path);

        setModalVisibleImage(false);

        setImageUri(image.path);
        let name = new Date().getTime() + '.mp4';
        setImage(name);
        onPress(name, image.path, "video");
        // setModalVisibleImage(false);

      })
      .catch(error => {
        setModalVisibleImage(false);

        // add this to your code
      });
  }
  const [fileResponse, setFileResponse] = useState([]);

  // const handleDocumentSelection = useCallback(async () => {
  //   try {
  //   setFileType("document")

  //     const response = await DocumentPicker.pick({
  //       presentationStyle: 'pageSheet',
  //     });
  //     setModalVisibleImage(false);

  //     console.log("-------",response);
  //     setFileResponse(response[0]);
  //     setImageUri(response[0].uri);

  //     let name = new Date().getTime() + '.pdf';
  //     setImage(name);
  //     onPress(name, image.path,"document");
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }, []);
  const handleDocumentSelection = async () => {
    setFileType("document")
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'pageSheet',
        type: [types.pdf, types.doc, types.docx, types.csv]
      });
      setModalVisibleImage(false);

      console.log(response);
      setFileResponse(response[0]);
      setImageUri(response[0].uri);

      let name = new Date().getTime() + '.pdf';
      setImage(name);
      // console.log(image.path)
      onPress(name, response[0].uri, "document");
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <View style={s.container}>
      <View
        style={{
          // borderWidth: 1,
          borderColor: currentTheme().themeColor,
          borderStyle: 'dashed',
          backgroundColor: currentTheme().themeColor,
        }}>
        <Modal
          animationType="slide"
          transparent={true}
          bottom={20}
          visible={modalVisibleImage}
          onRequestClose={() => {
            setModalVisibleImage(false);
          }}>
          <TouchableOpacity
            onPress={() => setModalVisibleImage(false)}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              // bottom: 20,
              zIndex: 99,
              // backgroundColor:'#000fff'
            }}>
            <View
              style={[
                s.modalView,
                {
                  width: screenWidth - 30,
                  backgroundColor: currentTheme().themeColor,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 20,
                  borderRadius: 20,
                  // paddingHorizontal: 50,
                  // height:200,
                  // flex:1
                },
              ]}>
              {/* <Image source={images.solidsent} style={{ height: 160, width: 265, resizeMode: 'contain' }} /> */}
              <View
                style={[
                  // s.modalView,
                  {
                    // width:screenWidth-30,
                    // backgroundColor: currentTheme().primaryColor,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 50,
                    marginTop: 20,
                    borderRadius: 1,
                    padding: 10,
                    width: screenWidth - 20,

                    // height:100,
                    // flex:1
                  },
                ]}>
                {cameraVisable &&
                  <TouchableOpacity
                    onPress={() =>
                      Platform.OS == 'android'
                        ? requestCameraPermission()
                        : pic_camera()
                    }>
                    <Image
                      source={require('../../assets/icon/camera.png')}
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: 'contain',
                        alignSelf: 'center',
                        tintColor: currentTheme().antiTextColor,
                      }}
                    />
                    <Text style={{ color: currentTheme().antiTextColor }}>Camera</Text>
                  </TouchableOpacity>
                }
                {galleryVisable && (
                  <TouchableOpacity onPress={() => pic_gallery()}>
                    <Image
                      source={require('../../assets/icon/gallery.png')}
                      style={{
                        height: 40,
                        width: 40,
                        resizeMode: 'contain',
                        tintColor: currentTheme().antiTextColor,
                      }}
                    />
                    <Text style={{ color: currentTheme().antiTextColor }}>Gallery</Text>
                  </TouchableOpacity>
                )}
                {documentVisable && (
                  <TouchableOpacity onPress={() => handleDocumentSelection()}>
                    <Image
                      source={require('../../assets/icon/attached.png')}
                      style={{
                        height: 40, width: 40, resizeMode: 'cover',
                        tintColor: currentTheme().antiTextColor, alignSelf: 'center'
                      }}
                    />
                    <Text style={{ color: currentTheme().White }}>
                      Document
                    </Text>
                  </TouchableOpacity>
                )}
                {videoVisable && (
                  <TouchableOpacity onPress={() => handleVideoSelection()}>
                    <Image
                      source={icons.videoUpload}
                      style={{
                        height: 40, width: 40, resizeMode: 'cover',
                        tintColor: currentTheme().antiTextColor, alignSelf: 'center'
                      }}
                    />
                    <Text style={{ color: currentTheme().White, textAlign: 'center' }}>
                      Video
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </View>
  );
}
const s = StyleConstants,
  styles = StyleSheet.create({
    text: {
      color: currentTheme().TextWhite,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    imageField: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      height: 25,
      width: 25,
      resizeMode: 'cover',
    },
    textNote: {
      color: currentTheme().Error,
      fontSize: 14,
      marginBottom: 30,
    },
    text: {
      color: currentTheme().TextWhite,
      fontWeight: 'bold',
      marginBottom: 40,
      marginTop: 40,
    },
  });
export default ImageModal;
