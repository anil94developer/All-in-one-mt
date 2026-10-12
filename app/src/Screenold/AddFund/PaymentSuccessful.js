/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  Modal,
  BackHandler,
} from 'react-native';
import React, { createRef, useEffect, useState } from 'react';
import { currentTheme } from '../../constants/ThemeProvider';
import { images } from '../../assets/images';
import LargefillBtn from '../../component/Button/LargefillBtn';
const PaymentSuccessful = props => {
  const {orderid,type} = props.route.params;

  useEffect(() => {
    console.log('--=-=-=orderrr',JSON.stringify(orderid));
    const backAction = () => {
      //_goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);

  return (
    <View style={styles.container}>
    <Image source={images.success} style={{ height: 200, width: 200,alignSelf:'center' }} />
      <Text style={{fontWeight:'bold',color:currentTheme().black,fontSize:20,alignSelf:'center',marginVertical:10,textAlign:'center'}}>Your order id is {orderid?.hash}{orderid?.order?._id}</Text> 
      <Text style={{fontWeight:'bold',color:currentTheme().success,fontSize:30,alignSelf:'center',marginVertical:40}}>Payment Successful!</Text> 
      <LargefillBtn label="Go to My Services" onPress={()=>type == 'service' ?  props.navigation.navigate("Tabs",{screen:"Services"}) :  props.navigation.navigate("Tabs",{screen:"Orders"})}/>  
    </View>
  );
};

export default PaymentSuccessful;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent:'center',
    alignContent:'center',padding:10
  } 
});

