import {
  View,
  Dimensions,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ColorsConstant, lightTheme } from '../../constants/Colors.constant';
import { currentTheme } from '../../constants/ThemeProvider';
import { screenWidth } from '../../constants/Sizes.constant';
// import images from '../asstes/images';
import { fontFamily } from '../../constants/font';
import { screenHeight } from '../../constants/Sizes.constant';
import { getApiCall } from '../../services/AppSetting';
import { base } from '../../constants/Data.constant';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import { Dialog } from '../../context/DialogContext';

function HomeSlider(props) {
   const navigation = useNavigation()
  const ref = useRef(null)

  const { list, home, hide, banner,disabled } = props;
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const [activeSlide, setActiveSlide] = useState(0)

  const [listData, setListData] = useState([])
  useEffect(() => {
    getBannerList();
  }, [props])


  const getBannerList = async () => {
    try {

      const result = await getApiCall(base.bannerList)
      // console.log(JSON.stringify(result.data), '-----------banner-')
      if (result.status) {

        // Toast.show({ type: 'success', text1: result.message });
        setListData(result.data)

      } else {
        Dialog.show({ type: 'error', text1: 'Error', text2: result.message });


      }
    } catch (error) {
      console.log(error)
    }
  }


  // const setSliderPage = event => {
  //   const { currentPage } = sliderState;
  //   const { x } = event.nativeEvent.contentOffset;
  //   const indexOfNextScreen = Math.round(x / screenWidth);

  //   if (indexOfNextScreen !== currentPage) {
  //     setSliderState({
  //       ...sliderState,
  //       currentPage: indexOfNextScreen,
  //     });
  //   }
  // };

  // const { currentPage: pageIndex } = sliderState;

  const getpagination = () => {
    // const { entries, activeSlide } = state
    return (
      hide == "hide" ?
        <>
        </>
        :
        <Pagination
          dotsLength={listData?.length}
          activeDotIndex={activeSlide}
          containerStyle={{ marginTop: "-4%", marginBottom: -10 }}
          dotStyle={styles.activepaginationDots}
          inactiveDotStyle={{ 
            height: 10,
            width: 10,
            borderRadius: 10 / 2,
            borderWidth: 1,
            borderColor: home == "home" ? currentTheme().themeColor : currentTheme().White,
            marginLeft: 1,
            backgroundColor: home == "home" ? currentTheme().White : currentTheme().themeColor

          }}
          inactiveDotOpacity={1}
          inactiveDotScale={1}
        />
    );
  }
  const renderItemBannerData = ({ item, index }) => {

    return (
      <TouchableOpacity disabled={disabled}  onPress={()=>{item.type == "category" ? item.category_type == "service" ? navigation.navigate("ServiceCategory",{categoryid:item.category_id}) :navigation.navigate("Products",{categoryid:item.category_id}) : null  }} key={index} >
        <Image
          source={{ uri: item.image }}
          style={{
            // start:10,
            start: 10,
            height: 170,
            width: screenWidth - 35,
            borderRadius: 10,
            marginHorizontal: 2,

          }}
          resizeMode='stretch'
        />

      </TouchableOpacity>
    );

  };

  const _render_item = dataList => {
    return dataList.map((item, index) => {
      // console.log(index +1 , list.length,'-------------lenth')
      return (
        <View key={index} style={{
          width: screenWidth - 45,
          borderRadius: 20,
          marginHorizontal: 6,
          marginRight: index + 1 == dataList.length ? 30 : 1
        }}>
          <Image
            source={{ uri: item.image }}
            style={{
              start: 10,
              height: 170,
              width: screenWidth - 45,
              borderRadius: 10,
              marginHorizontal: 2,
            }}
            resizeMode='contain'
          />

        </View>
      );
    });
  };


  const styles = StyleSheet.create({
    imageStyle: {
      height: screenWidth * (391 / 375),
    },
    // activepaginationDots: {
    //   height: 10,
    //   width: 30,
    //   borderRadius: 10 / 2,
    //   backgroundColor: currentTheme().themeColor,
    //   // marginLeft: 10,
    // },
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
      alignItems: 'center',
      width: screenWidth,
      justifyContent: 'center'
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
      backgroundColor: home == "home" ? currentTheme().themeColor : currentTheme().White,
      marginLeft: 1,
    },
    // inactivepaginationDots: {
    //   height: 10,
    //   width: 10,
    //   borderRadius: 10 / 2,
    //   borderWidth: 1,
    //   borderColor: home == "home" ? currentTheme().themeColor : currentTheme().White,
    //   marginLeft: 10,
    // },
    paginationWrapperPosition: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {/* <ScrollView
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false} 
        onScroll={event => {
          setSliderPage(event); 
        }}>
        {_render_item(list?.length>0?list:listData)}
      </ScrollView>
      {
        hide != "hide" &&
        <View style={[styles.paginationWrapper, { flexDirection: 'row' }]}>
          {list?.length>0?list:listData.map((key, index) => (
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
      } */}
      <Carousel
        ref={ref}
        loop={true}
        autoplay={true}
        data={listData}
        renderItem={renderItemBannerData}
        sliderWidth={screenWidth}
        itemWidth={screenWidth - 10}

        activeSlideAlignment="center"
        onSnapToItem={(index) => setActiveSlide(index)}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}

        useNativeDriver

        autoplayDelay={3000}
        autoplayInterval={3000}

      />

      {getpagination()}
    </View>
  );
}



export default HomeSlider;


