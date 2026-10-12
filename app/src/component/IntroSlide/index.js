// import {
//   View,
//   Dimensions,
//   ScrollView,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   StatusBar
// } from 'react-native';
// import React, { useState, useRef } from 'react';
// import { ColorsConstant } from '../../constants/Colors.constant';
// import { screenWidth } from '../../constants/Sizes.constant';
// // import images from '../asstes/images';
// import { fontFamily } from '../../constants/font';
// import { screenHeight } from '../../constants/Sizes.constant';
// import { StyleConstants } from '../../constants/Style.constant';
// import icon from '../../constants/image';
// import images from '../../asstes/images';
// import { MarginConstant } from '../../constants/Margin.constant';

// function IntroSlide(props) {

//   const { list, navigation } = props;
//   const [current, setCurrent] = useState(1)
//   const [scrollWidth, setScrollWidth] = useState(screenHeight)
//   const [sliderState, setSliderState] = useState({ currentPage: 0 });
//   const scroll = useRef(null)

//   const setSliderPage = event => {
//     const { currentPage } = sliderState;
//     const { x } = event.nativeEvent.contentOffset;
//     const indexOfNextScreen = Math.round(x / screenWidth);
//     console.log('innnn',indexOfNextScreen);

//     if (indexOfNextScreen !== currentPage) {
//       setSliderState({
//         ...sliderState,
//         currentPage: indexOfNextScreen,
//       });
//     }
//     setCurrent(currentPage + 1)
//   };



//   const { currentPage: pageIndex } = sliderState;

//   const _render_item = list => {
//     return list.map((item, index) => {
//       console.log('item', item);
//       return (
//         <View key={index} style={{
//           flex: 1,
//            backgroundColor: ColorsConstant.themeColor,

//         }}>

//         

//          
//           <View style={[styles.paginationWrapper, { flex: 1,marginHorizontal:10,marginTop:23 }]}>
//             {list.map((key, index) => (
//               // console.log(index,'index'),
//               <View
//                 style={[
//                   pageIndex === index
//                     ? styles.activepaginationDots
//                     : styles.inactivepaginationDots
//                 ]}
//                 key={index}
//               />
//             ))}
//           </View>
//         </View>
//       );
//     });
//   };
//   return (
//     <View style={[{
//       flex: 1,
//       // backgroundColor: 'red',
//        backgroundColor: ColorsConstant.themeColor,
//       marginTop: StatusBar.currentHeight
//     }]}>
//       {/* <View style={{ flex: 1,
//          width: screenWidth - 20,
//          backgroundColor:'pink',
//           alignSelf: 'center',
//            marginTop: MarginConstant.margin10 }}>
//         {
//           current <= 2 &&
//           <TouchableOpacity
//             onPress={() => navigation('Login')}
//             style={{
//               alignSelf: 'flex-end',
//               flex: 1,

//             }}>
//             <Text
//               style={{
//                 fontSize: 20,
//                 fontFamily: fontFamily.robotoBold,
//                 color: ColorsConstant.White,
//                 textDecorationLine: 'underline',

//               }}>
//               Skip
//             </Text>
//           </TouchableOpacity>
//         }

//       </View> */}
//         <View style={{ flex: 9,  }}>
//         <ScrollView
//           style={{ flex: 1 }}
//           horizontal={true}
//           scrollEventThrottle={16}
//           pagingEnabled={true}
//           showsHorizontalScrollIndicator={false}
//           ref={(ref) => (scroll.current = ref)}
//           onScroll={event => {
//             setSliderPage(event);
//             console.log('event',current);
//           }}>
//           {_render_item(list || [])}
//         </ScrollView>
//       </View> 
//       <View style={[StyleConstants.RowView, { alignSelf: 'center', flex: 1 }]}>

//         {current > 1 &&
//           <TouchableOpacity style={{ backgroundColor: ColorsConstant.White, paddingHorizontal: 17, paddingVertical: 15, borderRadius: 50 }} onPress={() => {
//             let vv = scrollWidth - screenWidth;

//             // console.log(screenWidth * current - 1)


//             if (current == 3) {
//               scroll.current.scrollTo({ y: screenWidth })
//               console.log(current, '------821 ----------', list.length)

//             }
//             if (current == 2) {
//               scroll.current.scrollTo({ y: 0 })
//               console.log(current, '------411 ----------', list.length)

//             }
//             if (current <= list.length) {
//               setCurrent(current - 1)
//               setScrollWidth(scrollWidth - screenWidth)

//             } else {
//               console.log(current, '------prev1 else----------', list.length)
//             }
//           }} > 
//             <Image source={icon.slideLeftArrow} />
//           </TouchableOpacity>
//         }
//         {
//           current >= list.length ?
//             <TouchableOpacity style={{ backgroundColor: ColorsConstant.White, paddingVertical: 10, paddingHorizontal: 30, borderRadius: 50 }} onPress={() => { navigation("Login") }} >
//               <Text style={{ color: ColorsConstant.primaryColor }}>
//                 Next
//               </Text>
//             </TouchableOpacity>
//             :
//             <TouchableOpacity style={{ backgroundColor: ColorsConstant.White, paddingHorizontal: 17, paddingVertical: 15, borderRadius: 50 }} onPress={() => {
//               scroll.current.scrollTo({ y: screenWidth * current })
//               setCurrent(current + 1)
//               setScrollWidth(scrollWidth + screenWidth)


//             }} >
//               <Image source={icon.slideRightArrow} />
//               {/* <Text style={{ color: ColorsConstant.White }}>
//                 Next1
//               </Text> */}
//             </TouchableOpacity>
//         }
//       </View>

//     </View >
//   );
// }

// const styles = StyleSheet.create({
//   imageStyle: {
//     height: screenWidth * (391 / 375),
//   },
//   wrapper: {
//     alignItems: 'center',
//     backgroundColor: ColorsConstant.themeColor,
//     flex: 1,
//     paddingTop: screenWidth * (20 / 375),
//     paddingHorizontal: screenWidth * (35 / 375),
//   },
//   header: {
//     fontSize: 41,
//     color: 'white',
//     marginBottom: screenWidth * (20 / 375),
//   },
//   paragraph: {
//     fontSize: 22,
//     color: 'white',
//     textAlign: 'center',
//   },
//   paginationWrapper: {
//     // position: 'absolute',
//     // bottom: screenWidth * (50 / 375),
//     // left: 0,
//     // right: 0,
//     flexDirection: 'row',
//     justifyContent: 'flex-start'
//   },
//   buttonContent: {
//     position: 'absolute',
//     bottom: screenWidth * (60 / 375),
//     alignSelf: 'center',
//   },
//   activepaginationDots: {
//     height: 8,
//     width: 8,
//     borderRadius: 10 / 2,
//     backgroundColor: ColorsConstant.White,
//     marginLeft: 10,
//   },
//   inactivepaginationDots: {
//     height: 8,
//     width: 8,
//     borderRadius: 10 / 2,
//     backgroundColor: "#5C40CC",
//     marginLeft: 10,
//   },
//   paginationWrapperPosition: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
// });

// export default IntroSlide;



import {
  View,
  Dimensions,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import React, { useState, useRef } from 'react';
import { ColorsConstant } from '../../constants/Colors.constant';
import { screenWidth } from '../../constants/Sizes.constant';
// import images from '../asstes/images';
import { fontFamily } from '../../constants/font';
import { screenHeight } from '../../constants/Sizes.constant';
import { StyleConstants } from '../../constants/Style.constant';
import icon from '../../constants/image';
import images from '../../assets/images';
// import images from '../../asstes/images';

function IntroSlide(props) {
  const { list, navigation } = props;
  const [current, setCurrent] = useState(1);
  const [scrollWidth, setScrollWidth] = useState(screenHeight);
  const [sliderState, setSliderState] = useState({ currentPage: 0 });
  const scroll = useRef(null);

  const setSliderPage = event => {
    const { currentPage } = sliderState;
    const { x } = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / screenWidth);

    if (indexOfNextScreen !== currentPage) {
      setSliderState({
        ...sliderState,
        currentPage: indexOfNextScreen,
      });
    }
    setCurrent(currentPage + 1);
  };

  const { currentPage: pageIndex } = sliderState;

  const _render_item = list => {
    return list.map((item, index) => {
      return (
        <View style={[{
          flex: 1,
          width: screenWidth,
          // backgroundColor: 'red',
          backgroundColor: ColorsConstant.themeColor,
          marginTop: StatusBar.currentHeight
        }]}>
          <View style={{
            flex: 5,
            marginTop: 90
          }}>
            <Image
              // source={images.slide}
              source={item.image}
              style={{
                height: 276,
                width: screenWidth,
                // alignSelf:'center's
              }}
              resizeMode='contain'
            />
          </View>
          <View
            style={{
              // width: screenWidth * (150 / 375),
              flex: 3,
              marginHorizontal: 20,
              marginTop: 23
              //  backgroundColor:'red'
            }}>
            <Text
              style={{
                fontSize: 24,
                color: ColorsConstant.White,
                fontFamily: fontFamily.robotoBold,
                marginTop: 30,
                fontWeight: '700'

              }}>
              {item.heading}
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: ColorsConstant.White,
                fontWeight: '400',
                // marginBottom: screenWidth * (20 / 375),
                fontFamily: fontFamily.robotoRegular,
                // width:screenWidth-20
                marginTop: 23
              }}>
              {item.subHeading}
            </Text>
          </View>

          <View
            style={[
              styles.paginationWrapper, { flex: 1 }

            ]}>
            {list.map((key, index) => (
              <View
                style={[
                  pageIndex === index
                    ? styles.activepaginationDots
                    : styles.inactivepaginationDots,
                ]}
                key={index}
              />
            ))}
          </View>


          {
            current >= list.length ?
              <TouchableOpacity
                style={{
                  backgroundColor: ColorsConstant.secondaryColor,
                  padding: 15,
                  borderRadius: 50,
                  alignSelf: 'center',
                  height: 48,
                  width: screenWidth - 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 100
                }}
                onPress={navigation('Login')}

              >

                <Text style={{ color: ColorsConstant.White }}>
                  Let's Go
                </Text>
              </TouchableOpacity> :

              <TouchableOpacity
                style={{
                  backgroundColor: ColorsConstant.secondaryColor,
                  padding: 15,
                  borderRadius: 50,
                  alignSelf: 'center',
                  height: 48,
                  width: screenWidth - 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 0
                }}
                // onPress={() => {
                //   scroll.current.scrollTo({ y: screenWidth * current });
                //   setCurrent(current + 1);
                //   setScrollWidth(scrollWidth + screenWidth);
                // }}
                onPress={() => {
                  scroll.current.scrollTo({ y: screenWidth * current });
                  let vv = current + 1;
                  setCurrent(vv);
                  console.log(current, 'current');
                  setScrollWidth(scrollWidth + screenWidth);
                  // console.log(screenWidth * current - 1)
                  if (vv == 4) {
                    scroll.current.scrollTo({ y: screenWidth });
                    console.log(current, '------821 ---current4-------', list.length);
                  }
                  if (vv == 3) {
                    scroll.current.scrollTo({ y: screenWidth });
                    console.log(current, '------821 -----current3-----', list.length);
                  }
                  if (vv == 2) {
                    scroll.current.scrollTo({ y: 0 });
                    console.log(current, '------411 ----current2------', list.length);
                  }

                }}
              >

                <Text style={{ color: ColorsConstant.White }}>
                  Next
                </Text>
              </TouchableOpacity>

          }
          {current >= list.length ? (
            <View></View>
          ) : (
            <View style={{ marginBottom: 50, }}>

              <TouchableOpacity
                onPress={() => navigation('PostalCode')}
                style={{
                  // justifyContent: 'flex-end',
                  // marginLeft: '62%',
                  marginTop: 30,
                  alignSelf: 'center',
                  // height: screenHeight * (186 / screenHeight),
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fontFamily.robotoBold,
                    color: ColorsConstant.White,
                    textDecorationLine: 'underline',
                    // marginLeft: 10,
                  }}>
                  Skip
                </Text>

              </TouchableOpacity>

            </View>
          )}
        </View>

      );
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: ColorsConstant.primaryColor }}>
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={ref => (scroll.current = ref)}
        onScroll={event => {
          setSliderPage(event);
        }}>
        {_render_item(list || [])}
      </ScrollView>


    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    height: screenWidth * (391 / 375),
  },
  wrapper: {
    alignItems: 'center',
    backgroundColor: ColorsConstant.themeColor,
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
    // position: 'absolute',
    // bottom: screenWidth * (10 / 375),
    // left: 0,
    // right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 10, marginTop: 23,
    // backgroundColor:ColorsConstant.themeColor
  },
  buttonContent: {
    position: 'absolute',
    bottom: screenWidth * (60 / 375),
    alignSelf: 'center',
  },
  activepaginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: ColorsConstant.primaryColor,
    marginLeft: 10,
  },
  inactivepaginationDots: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: ColorsConstant.gary,
    marginLeft: 10,
  },
  paginationWrapperPosition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default IntroSlide;


{/* <View
        style={[
          StyleConstants.RowView,
          {
            width:screenWidth,
            alignSelf: 'center',
            paddingBottom: 10,
          },
        ]}>
        {current <= 1 && <Text></Text>}

        {current > 1 && (
          <TouchableOpacity
            style={{
              backgroundColor: ColorsConstant.Blue,
              padding: 15,
              borderRadius: 50,
            }}
            onPress={() => {
              let vv = scrollWidth - screenWidth;

              // console.log(screenWidth * current - 1)
              if (current == 3) {
                scroll.current.scrollTo({ y: screenWidth });
                console.log(current, '------821 ----------', list.length);
              }
              if (current == 2) {
                scroll.current.scrollTo({ y: 0 });
                console.log(current, '------411 ----------', list.length);
              }
              if (current <= list.length) {
                setCurrent(current - 1);
                setScrollWidth(scrollWidth - screenWidth);
              } else {
                console.log(current, '------prev1 else----------', list.length);
              }
            }}>
            {/* <Text style={{ color: ColorsConstant.White }}>
              Prev
            </Text> */}
{/* <Image
              source={images.close}
              style={{ height: 40, width: 40, resizeMode: 'contain' }}
            />
          </TouchableOpacity>
        )}
        {current >= list.length ? (
          // <TouchableOpacity
          //   onPress={() => navigation('PostalCode')}
          //   style={{
          //     backgroundColor: 'pink',//ColorsConstant.primaryColor,
          //     width: 80,
          //     height: 40,
          //     borderRadius: 20,
          //     justifyContent: 'center',
          //     marginRight: 16,
          //   }}>
          //   <Text
          //     style={{
          //       textAlign: 'center',
          //       fontSize: 16,
          //       fontFamily: fontFamily.regular,
          //       fontWeight: 400,
          //       color: ColorsConstant.white,
          //     }}>
          //     {' '}
          //     Finish{' '}
          //   </Text>
          // </TouchableOpacity>
        ) : (
          // <TouchableOpacity
          //   style={{
          //     backgroundColor: ColorsConstant.secondaryColor,
          //     padding: 15,
          //     borderRadius: 50,
          //     alignSelf:'center',
          //     height:48,
          //     width:screenWidth,
          //     justifyContent:'center',
          //     alignItems:'center'
          //   }}
          //   onPress={() => {
          //     scroll.current.scrollTo({ y: screenWidth * current });
          //     setCurrent(current + 1);
          //     setScrollWidth(scrollWidth + screenWidth);
          //   }}>
          //   {/* <Image
          //     source={images.homeSlider}
          //     style={{ height: 40, width: 40, resizeMode: 'contain' }}
          //   /> */}
//   <Text style={{ color: ColorsConstant.White }}>
//       Next
//     </Text>
{/* // </TouchableOpacity>
        )} */}
{/* </View> */ } 