


import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, PermissionsAndroid, TouchableOpacity, Platform } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { screenHeight, screenWidth } from "../../constants/Sizes.constant";
import { icons, images } from "../../assets/images"
import { StyleConstants } from "../../constants/Style.constant";
import LargefillBtn from "../Button/LargefillBtn";
import { lightTheme } from "../../constants/Colors.constant";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import SignUp from "../../Screen/Auth/SignUp.js";
import { useFocusEffect } from '@react-navigation/native';
import { currentTheme } from "../../constants/ThemeProvider";

export default function MapScreen(props) {
  const {
    propsLocation,
    screen,
    addLat,
    addLng
  } = props.route.params;
  const mapRef = useRef(null);
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState(26.9124);
  const [lng, setLng] = useState(75.7873);
  const [address, setAddress] = useState('');
  const [fullAddress, setFullAddress] = useState('');
 
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }); 

  useFocusEffect(
    React.useCallback(() => {
    
      const config = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      };
      try {
        Geolocation.getCurrentPosition(
          position => {
            getCoordsFromAddressName(
              position.coords.latitude,
              position.coords.longitude,
            );
            setInitialRegion({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
            console.log("latitude======",lat,lng)
          },
     
          error => {},
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      } catch (e) {
        console.log('Geolocation error=>', e);
      }
   

 _checkPermission()
      setLandmark('');
      setCity('');
    //     setLat(addLat)
    //   setLng(addLng)
    //   setInitialRegion({
    //     latitude: addLat,
    // longitude: addLng,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,
    //   })
      // getLocation();
      // console.log('skjcbhjsdchjwd', propLandmark, propCity);
    }, [props]),
  );
 

  const getLocation = async () => {
    // console.log('get geo location');
    const config = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
    };
    try {
      Geolocation.getCurrentPosition(
        position => {
          getCoordsFromAddressName(
            position.coords.latitude,
            position.coords.longitude,
          );
          setLat( position.coords.latitude)
          setLng( position.coords.longitude)
          console.log("latitude======",lat,lng)
        },
   
        error => {},
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (e) {
      console.log('Geolocation error=>', e);
    }
  };
  const requestLocation = async () => {
    // console.log('request location');
    await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then(data => {
        getLocation();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const _checkPermission = async () => {
    try {
      if (Platform.OS == 'android') {
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        //  console.log('resultlllll', result);
        if (result == true) {
          requestLocation();
          // get_list();
        } else if (result == false) {
          const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          if (status === 'never_ask_again') {
            LocationServicesDialogBox.checkLocationServicesIsEnabled({
              message: 'Allow for location',
              ok: 'YES',
              cancel: 'NO',
              enableHighAccuracy: true,
              showDialog: true,
              openLocationServices: true,
              preventOutSideTouch: false,
              preventBackClick: false,
              providerListener: false,
            })
              .then(function (success) {
                requestLocation();

                console.log(success, 'success');
              })
              .catch(error => {
                console.log(error.message);
              });
            // Linking.openSettings();
            // Your code
          } else if (status === 'denied') {
            _checkPermission();
          } else if (status === 'granted') {
            requestLocation();
          }
        }
      } else {
        Geolocation.requestAuthorization('whenInUse');
        getLocation();
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getCoordsFromAddressName = (latitude, longitude) => {
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        'AIzaSyArqlT_3Q9fHcisw6lvvUGTcObXGz3GEJk',
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(JSON.stringify(responseJson), '-------------stst------');
        setLat(responseJson.results[0].geometry.location.lat);
        setLng(responseJson.results[0].geometry.location.lng);
        setFullAddress(responseJson.results[0].formatted_address);
        setAddress(responseJson.results[0].address_components[1].long_name);
        setLandmark(responseJson.results[0].address_components[2]?.long_name);
        setCity(responseJson.results[0].address_components[4]?.long_name);

       
        mapRef.current.animateToRegion(
          { 
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          1000,
        );
      });
    //  setRegion({
    //         latitude: loc.lat,
    //         longitude: loc.lng,
    //         latitudeDelta: 0.003,
    //         longitudeDelta: 0.003
    //     }
    // );
  };

  const onMapRegionChange = region => {
    getCoordsFromAddressName(region.latitude, region.longitude);
    setLat(region.latitude);
    setLng(region.longitude);

    
    setInitialRegion({region});
  };
  return (
    <View style={{flex: 1}}>
      <TouchableOpacity 
        onPress={() => props.navigation.goBack({ Edit: "No" })}
        style={{
          backgroundColor: currentTheme().White,
          width: 40,
          height: 40,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          zIndex: 9999,
          top: 10,
          left: 10,
        }}>
        <Image
          source={images.back}
          style={[Style.leftButtonIcon, {tintColor: currentTheme().textColor}]}
        />
      </TouchableOpacity>
      <View style={Style.AutoCmplt}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          GooglePlacesDetailsQuery={{fields: 'geometry'}}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            //  console.log(JSON.stringify(data), '==========');
            setInitialRegion({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            
            mapRef.current.animateToRegion(
              { 
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
              1000,
            );
            setLat(details.geometry.location.lat);
            setLng(details.geometry.location.lng);
            setAddress(data.structured_formatting.main_text);
            setFullAddress(data.description);
          }}
          query={{
            key: 'AIzaSyArqlT_3Q9fHcisw6lvvUGTcObXGz3GEJk',
            language: 'en',
          }}
          // listUnderlayColor='red'
          // listViewDisplayed={'auto'}
          textInputProps={{placeholderTextColor: currentTheme().gary}}
          styles={{
            description: {color: currentTheme().black},
            textInputContainer: {
              // backgroundColor: 'grey',
              width: '80%',
            },
            listView: {marginLeft: -60},
            textInput: {
              height: 40,
              // width:'100%',
              color: '#5d5d5d',
              fontSize: 16,
              marginHorizontal: 0,
            },
            predefinedPlacesDescription: {
              // backgroundColor:'red',
              // width:'80%',
              color: '#1faadb',
            },
          }}
        />
      </View>
      <View style={Style.addSheet}>
        <View style={[StyleConstants.innerContainer, {marginTop: 20}]}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Image source={icons.locationRed} style={{width: 20, height: 20}} />
            <View style={{marginLeft: 15}}>
              <Text style={StyleConstants.text2}>{address}</Text>
              <Text style={{width: 300, color: 'grey'}}>{fullAddress}</Text>
            </View>
          </View>
          <View style={{marginTop: 20}}>
            <LargefillBtn
              onPress={() => {
                screen=="Specialist"?
                props.navigation.navigate("Specialists", { address: fullAddress, latitude: lat, longitude: lng, setAddress: { setAddress }, Edit: "No" })
                :
                screen == "Dealer"?
                props.navigation.navigate("Dealers", { address: fullAddress, latitude: lat, longitude: lng, setAddress: { setAddress }, Edit: "No" })
                :screen=="Profile"?

                props.navigation.navigate("BasicDetails", { address: fullAddress, latitude: lat, longitude: lng, setAddress: { setAddress }, Edit: "No" }):
                screen=="RegisterScreen"?
                props.navigation.navigate("Register", { address: fullAddress, latitude: lat, longitude: lng, Edit: "No" })
                :

                props.navigation.navigate("EditBusinessDetails", { address: fullAddress, latitude: lat, longitude: lng, setAddress: { setAddress }, Edit: "No" })

              }}
              label={'Continue'}
              backgroundColor={lightTheme.themeColor}
            />
          </View>
        </View>
      </View>
      {/* {initialRegion && ( */}
        <MapView
        ref={mapRef} 
        apikey={'AIzaSyArqlT_3Q9fHcisw6lvvUGTcObXGz3GEJk'}
        style={{flex: 1, position: 'relative'}} 
        initialRegion={initialRegion}
        followsUserLocation={true}
        showsTraffic={false}
        showsMyLocationButton={true}
        zoomEnabled={true}
        showsUserLocation={true}  
        resetOnChange={true}
        moveOnMarkerPress={true}
        onRegionChangeComplete={reg => onMapRegionChange(reg)}

        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>
      {/* )} */}

      {/* <MapView
        ref={mapRef}
       
        apikey={'AIzaSyArqlT_3Q9fHcisw6lvvUGTcObXGz3GEJk'}
        style={{flex: 1, position: 'relative'}}
        initialRegion={mapInitRegion}
        followsUserLocation={true}
        showsTraffic={false}
        showsMyLocationButton={true}
        zoomEnabled={true}
        showsUserLocation={true}  
        resetOnChange={true}
        moveOnMarkerPress={true}
        onRegionChangeComplete={reg => onMapRegionChange(reg)}
     
      >
       
      </MapView> */}
      <View
        style={{
          position: 'absolute',
          zIndex: 1000,
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'center',
          flex: 1,
          top: screenHeight / 2.6,
        }}>
        <Image
          source={icons.locationRed}
          style={{
            height: 50,
            width: 50,
            resizeMode: 'contain',
          }}
        />
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  addSheet: {
    width: screenWidth,
    // height: screenHeight / 4.5,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    zIndex: 9999,
  },
  AutoCmplt: {
    position: 'absolute',
    zIndex: 9999,
    width: '85%',
    marginTop: 10,
    alignSelf: 'flex-end',
    paddingHorizontal: 10,
    // flex: 1,
  },
  leftButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});