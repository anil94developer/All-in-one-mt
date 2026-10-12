import {  Dimensions } from 'react-native';
const screenWidth = Math.round(Dimensions.get('screen').width)
const screenHeight = Math.round(Dimensions.get('screen').height)
export {
    screenWidth,
    screenHeight
   
}
console.log(screenWidth,'----------')

