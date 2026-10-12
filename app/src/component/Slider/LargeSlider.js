import {
    View,
    Dimensions,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useState} from 'react';
  import {ColorsConstant, lightTheme} from '../../constants/Colors.constant';
  import { currentTheme } from '../../constants/ThemeProvider';
  import {screenWidth} from '../../constants/Sizes.constant';
  // import images from '../asstes/images';
  import {fontFamily} from '../../constants/font';
  import {screenHeight} from '../../constants/Sizes.constant';
  
  function LargeSlider(props) {

    
    const {list, navigation,home} = props;
    const [sliderState, setSliderState] = useState({currentPage: 0});
    const setSliderPage = event => {
      const {currentPage} = sliderState;
      const {x} = event.nativeEvent.contentOffset;
      const indexOfNextScreen = Math.round(x / screenWidth);
  
      if (indexOfNextScreen !== currentPage) {
        setSliderState({
          ...sliderState,
          currentPage: indexOfNextScreen,
        });
      }
    };
  
    const {currentPage: pageIndex} = sliderState;

    const styles = StyleSheet.create({
      imageStyle: {
        height: screenWidth * (391 / 375),
      },
      wrapper: {
        alignItems: 'center',
        backgroundColor: "black",
        flex: 1,
        paddingTop: screenWidth * (20 / 375),
        paddingHorizontal: screenWidth * (35 / 375),
      },
      header: {
        fontSize: 41,
        color: 'white',
        marginBottom: screenWidth * (20 / 375),
      },
      paragraph: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
      },
      paginationWrapper: {
        position: 'absolute',
        bottom: screenWidth * (20 / 375),
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems:'center',
        width:screenWidth,
        justifyContent:'center'
      },
      buttonContent: {
        position: 'absolute',
        bottom: screenWidth * (60 / 375),
        alignSelf: 'center',
      },
      activepaginationDots: {
        height: 10,
        width: 30,
        borderRadius: 10 / 2,
        backgroundColor: home == "home" ?currentTheme().themeColor:currentTheme().White,
        marginLeft: 10,
      },
      inactivepaginationDots: {
        height: 10,
        width: 10,
        borderRadius: 10 / 2,
        borderWidth:1,
        borderColor:home == "home" ?currentTheme().themeColor:currentTheme().White,
        marginLeft: 10,
      },
      paginationWrapperPosition: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    });
  
    const _render_item = list => {
      return list.map((item, index) => {
        return (
          <View key={index}>
            <Image 
              source={{uri: item.image}}
              style={{
                // start:10,
                height: 240,
                width: screenWidth, 
                // borderRadius:20,
                // marginHorizontal:2,
              }}
              resizeMode='cover'
            />
            {/* <View
              style={{
                alignItems: 'center',
                backgroundColor: ColorsConstant.themeColor,
                flex: 1,
                paddingTop: screenWidth * (20 / 375),
                paddingHorizontal: screenWidth * (35 / 375),
              }}>
              <Text
                style={{
                  fontSize: 41,
                  color: 'white',
                  marginBottom: screenWidth * (20 / 375),
                  fontFamily: fontFamily.robotoBold,
                }}>
                {item.heading}
              </Text>
              <Text
                style={{
                  fontSize: 22,
                  color: 'white',
                  textAlign: 'center',
                  fontFamily: fontFamily.robotoBold,
                }}>
                {item.subHeading}
              </Text>
            </View> */}
             
          </View>
        );
      });
    };
    return (
      <View style={{flex: 1}}>
        <ScrollView
        //   style={{flex: 1}}
          horizontal={true}
          scrollEventThrottle={16} 
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onScroll={event => {
            setSliderPage(event);
          }}>
          {_render_item(list || [])}
        </ScrollView>
        <View style={[styles.paginationWrapper, {flexDirection: 'row'}]}>
          {list.map((key, index) => (
            <View
              style={
                pageIndex === index
                  ? styles.activepaginationDots
                  : styles.inactivepaginationDots
              }
              key={index}
            />
          ))}
          
        </View>
      
      </View>
    );
  }
  
  
  
  export default LargeSlider;
  