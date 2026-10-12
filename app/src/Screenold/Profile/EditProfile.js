/* eslint-disable prettier/prettier */
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { icons, images } from '../../../asstes/images'
import LargefillBtn from '../../../component/Button/LargefillBtn'
import { screenHeight, screenWidth } from '../../../constants/Sizes.constant'
import { currentTheme } from '../../../constants/ThemeProvider'
// import { fontFamily } from '../../../constants/font'
import { lang } from '../../../Language/languge'
import ImageModal from '../../../component/ImageModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { base, imageServerUrl } from '../../../constants/Data.constant'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import mime from 'mime'
import { postDataContent } from '../../../services/Ops'
import LargeTextInput from '../../../component/TextInput/LargeTextInput'
import DatePicker from '../../../component/DatePicker/Datepicker'
import Header from '../../../Widget/Header'
import CountryModal from '../../../component/CountryandMobile/CountryModal'
import DropDownCom from '../../../component/DropDownCom'
import { get_profile } from '../../../services/User'
import Loading from '../../../component/loading'
import { postApiCall } from '../../../services/AppSetting'
import { isValidFullName } from '../../../services/Validation'

const EditProfile = (props) => {
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false); 
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [date, setDate] = useState(new Date());
    const [modalOpen, setModalOpen] = useState(false);
    const [dateVisible, setDateVisible] = useState(false);
    const [modalVisibleImage, setModalVisibleImage] = useState(false);
    const [imageUri, setImageUri] = useState('');
    const [imageName, setImageName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [country, setCountry] = useState('249');
    const [countryCode, setCountryCode] = useState('SD');
    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false)
    const [gender, setGender] = useState('')
    const [userProfileData, setUserProfileData] = useState({})
    
    const [genderId, setGenderId] = useState("");
    const [genderList, setGenderList] = useState([
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" },
      { label: "Others", value: "Others" },
      
    ]);

    const uploadImage = async (name, imageUri) => {
        // console.log("dsdddsfsf")
        try {
            setLoading(true)
            const newImageUri = "file:///" + imageUri.split("file:/").join("");

            const formData = new FormData();
            formData.append('image', {
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: newImageUri.split("/").pop()
            });
            formData.append('type', "profile")
            console.log(JSON.stringify(formData), '--------------formdata---------')
            let token = await AsyncStorage.getItem("token")
            let result = await postDataContent(base.profileUpload, formData, token);
            console.log(result, '---------------add image--------------')
            if (result != undefined) {
                if (result.status) {
                    setLoading(false)
                    setImageUrl(imageServerUrl + result.data.upload)
                    // Toast.show({ type: 'success', text1: result.message });
                } else {
                    setLoading(false)
                    // Toast.show({ type: 'error', text1: result.message });
                }
            } else {
                uploadImage(name, imageUri)
                setLoading(false)
            }
        } catch (error) {
            Toast.show({ type: 'error', text1: error.message });
            // uploadImage(name,imageUri)
            setLoading(false)
        } finally {
            setLoading(false)

        }


    }
    const onSelect = country => {
        console.log('country-=-=-', country.callingCode[0]);
        setCountryCode(country.cca2);
        setCountry(country.callingCode[0]);
        // setVisible(false)
    };

    const _goBack = () => {
        props.navigation.goBack()
    }

    const profile_update_handler = async () => {
        if (mobileNumber === '' || fullName === '' || email === '' || date === '') {
          Toast.show({ type: 'error', text1: 'Profile Update Error !', text2: 'Please fill Profile details' });
          // Vibration.vibrate(300);
        }else if(!isValidFullName(fullName)){
            Toast.show({ type: 'error', text1: 'Profile Update Error !', text2: 'Full name allow only alpha characters.' });

        }
         else {
          try { 
            setLoading(true);
            let body = {
              'name':fullName,
              'country_code': country,
              'mobile_number': mobileNumber, 
              'email': email,
              'gender': gender,
              'dob':date,
              'image':imageUrl,
              'address':"", 
              'latitude': '26.336332',
              'longitude': '75.5655656'
            };
            let result = await postApiCall(base.updateProfile, body);
            if (result.status == true) { 
              setLoading(false);
              Toast.show({ type: 'success', text1: 'Congratulations Update Successful !', text2: result.message });
              props.navigation.navigate('Tabs',{screen:'profile'})
            } else {
              setLoading(false);
              Toast.show({ type: 'error', text1: 'Update Error !', text2: result.message });
              // Vibration.vibrate(300);
            }
          } catch (e) {
            Toast.show({ type: 'error', text1: 'Network Issue !', text2: 'Please check your internet connection' });
            setLoading(false);
            // Vibration.vibrate(300);
    
          }
        }
      };

    useEffect(() => {
        
        const get_profile_data = async () => {
        let data=await get_profile()
        setLoading(false)
        
        setFullName(data.name)
        setEmail(data.email)
        setMobileNumber(data.mobile_number)
        setDate(data.dob)
        setImageUrl(data.image)
        setGender(data.gender)
        // setFullName(data.name)
        // setFullName(data.name)
        // setFullName(data.name)
        // setFullName(data.name)
        }
        get_profile_data()
      }, [props])

    return (
        <View style={styles.container}>
            <Header
                leftButtonType="back"
                title={"Personal Details"}
                leftButtonAction={_goBack}
            // rightButttonType="refresh"
            // rightButtonAction={
            //     <Text style={styles.mainText}>Total- {allTot}</Text>
            // }
            />
            {loading && <Loading />}

            <ScrollView style={{ flex: 1, marginTop: 20 }} showsVerticalScrollIndicator={false}>

                {/* <Image
                    source={images.authbg}
                    style={{ height: screenHeight / 4, width: screenWidth + 36, resizeMode: 'cover' }}
                /> */}

                <View style={{ marginHorizontal: 20 }}>
                    {imageUri || imageUrl ? (
                        console.log(imageServerUrl + imageUrl),
                        //   <Image style={styles.avtar} source={{ uri:  imageServerUrl+imageUrl}} />
                        <Image source={{ uri: imageUrl }} style={{ height: 92, width: 92, borderRadius: 46, resizeMode: 'contain', borderWidth: 1, borderColor: '#00000050' }} />

                    ) : (
                        <Image source={icons.user} style={{ height: 92, width: 92, borderRadius: 46, resizeMode: 'contain', borderWidth: 1, borderColor: '#00000050' }} />

                    )}
                    {/* <Image  source={icons.user} style={{height:92,width:92,borderRadius:46,resizeMode:'contain',borderWidth:1,borderColor:'#00000050'}}/> */}
                    <TouchableOpacity onPress={() => setModalVisibleImage(true)}>
                        <Image source={icons.edit} style={{ height: 24, width: 24, borderRadius: 46, resizeMode: 'contain', left: 70, top: -27, tintColor: currentTheme().cardColor9 }} />
                    </TouchableOpacity>
                </View>
                {modalVisibleImage && (
                    <ImageModal
                        modalVisibleImage={modalVisibleImage}
                        setModalVisibleImage={setModalVisibleImage}
                        image={imageName}
                        setImage={setImageName}
                        imageUri={imageUri}
                        setImageUri={setImageUri}
                        cameraVisable={true}
                        galleryVisable={true}
                        onPress={(name, uri) => {

                            console.log("ssasasassa")
                            uploadImage(name, uri)
                        }}
                    />
                )}

                <LargeTextInput
                    label={lang('signup_screen.full_name')}
                    validationType="text"
                    placeholder={lang('signup_screen.full_name')}
                    value={fullName}
                    // keyboardType="number-pad"
                    onChangeText={e => {
                        setFullName(e);
                    }}
                    returnKeyType="next"
                    style={[styles.txtInput, { borderColor: currentTheme().inputBorderColor }]}
                />

                {/* <View style={{marginTop: 10}}> */}
                <View  style={{ width: screenWidth-40,marginHorizontal:20 }}>
                    <CountryModal
                        value={mobileNumber}
                        withFlag={false}
                        withEmoji={false}
                        validationType={'mobile'}
                        visible={visible}
                        setVisible={setVisible}
                        onSelect={onSelect}
                        label={lang('login_screen.mobile_number')}
                        keyboardType={'numeric'}
                        countryCode={countryCode}
                        country={country}
                        placeholder={lang('login_screen.mobile_number')}
                        maxLength={12}
                        onChangeText={e => setMobileNumber(e)}
                    />
                </View>
                <View style={{ marginTop: 10 }}>
                    <LargeTextInput
                        label={lang('signup_screen.email')}
                        validationType="email"
                        placeholder={lang('signup_screen.email')}
                        value={email}
                        // keyboardType="number-pad"
                        onChangeText={e => {
                            setEmail(e);
                        }}
                        returnKeyType="next"
                        style={[styles.txtInput, { borderColor: currentTheme().inputBorderColor }]}
                    />
                </View>
                <View style={{ width: screenWidth - 50, alignSelf: 'center',marginTop:-5 }}>
                <DropDownCom
                    name={"Gender"}
                    placeholder={"Select"}
                    value={gender}
                    setName={setGender}
                    setId={setGenderId}
                    list={genderList}
                    onPress={(e) => {
                        setGenderId(e);
                    }}
                    bgType={"White"}
                    
                    id={genderId}
                />
                </View>
                <View style={{ marginHorizontal: 4,marginTop:5 }}>
                    <DatePicker
                        selectedDate={date}
                        setSelectedDate={setDate}
                        // minimumDate
                        // maximumDate
                        mode='date'
                        width='100%'
                        label='Date Of Birth'
                    // onPress={()=>setDateVisible(true)}

                    />

                </View>
                <View style={{ marginTop: screenWidth * (14 / 375) }}>
                    <LargefillBtn
                        animating={btnLoading}
                        label={'Save'}
                        onPress={() => {
                            profile_update_handler()
                            // props.navigation.navigate('ProductCategories')
                            // props.navigation.navigate('Drawers', { screen: 'Home' });

                            //   set_password();
                            //props.navigation.navigate('Login');
                        }}
                        backgroundColor={currentTheme().themeColor}
                    />
                </View>
                {/* <Text onPress={() => { props.navigation.navigate('Drawers', { screen: 'Home' }) }} style={{ marginVertical: 10, alignSelf: 'center', color: currentTheme().primaryColor, textDecorationLine: 'underline' }}>{lang('intro_screen.skip')}</Text> */}

            </ScrollView>
        </View>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: currentTheme().bgColor,
    },
    outerContainer: {
        flex: 9,
        width: '100%',
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textInputView: {
        paddingStart: 20,
        backgroundColor: currentTheme().White,
        width: screenWidth * (335 / 375),
        borderRadius: 20,
        flexDirection: 'row',
    },
    // logo: { backgroundColor: "red" },
    logo: { width: screenWidth, height: screenHeight * (150 / screenHeight) },
    loginText: {
        fontSize: 30,
        alignSelf: 'center',
        color: currentTheme().black,
        // marginBottom: screenWidth * (20 / 375),
        // fontFamily: fontFamily.robotoBold,
        fontWeight: 'bold',
    },
    mobileNumber: {
        color: currentTheme().White,
        fontSize: 22,
        marginTop: 5,
        // fontFamily: fontFamily.robotoRegular,
    },
    poweredByOuter: { flex: 1 },
    poweredByContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    poweredByLogo: { marginLeft: 10, width: 20, height: 20 },
    modelContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99,
    },
    modalImage: {
        width: 200,
        height: 50,
        alignSelf: 'center',
    },
    modalText: {
        fontSize: 20,
        color: currentTheme().black,
        alignSelf: 'center',
        marginTop: 30,
    },
    modalInnerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
})