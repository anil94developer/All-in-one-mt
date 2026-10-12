import React from "react";
import {View, Text, Image} from 'react-native';
import { currentTheme } from "./ThemeProvider";
import { images } from "../assets/images";
import { screenHeight } from "./Sizes.constant";

export default function NoData(){
    return(
        <View style={{flex:1,backgroundColor:currentTheme().bgColor1,alignItems:'center',justifyContent:'center',height:screenHeight/2}}>
            <Image source={images.noData} style={{width:220,height:220}} resizeMode="contain" />

        </View>
    )
}