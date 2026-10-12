// import React from 'react';
// import {
//     Alert,
//     Animated,
//     Image, Text,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { CurvedBottomBar } from 'react-native-curved-bottom-bar';
// import Home from '../Screen/Home';

// import ReanimatedCurveTabBar from react-native-curved-bottom-tabbar"";
// export default function App() {
//     // const _renderIcon = (routeName, selectedTab) => {
//     //     let icon = '';

//     //     switch (routeName) {
//     //         case 'title1':
//     //             icon = require('../asstes/icon/add.png');
//     //             break;
//     //         case 'title2':
//     //             icon = require('../asstes/icon/add.png');
//     //             break;
//     //     }

//     //     return (
//     //         <Image source={icon} style={{ height: 25, width: 25 }} />
//     //     );
//     // };
//     // const renderTabBar = ({ routeName, selectedTab, navigate }) => {
//     //     return (
//     //         <TouchableOpacity
//     //             onPress={() => navigate(routeName)}
//     //             style={styles.tabbarItem}>
//     //             {_renderIcon(routeName, selectedTab)}
//     //         </TouchableOpacity>
//     //     );
//     // };

//     return (
//         <View style={styles.con}>
//             <ReanimatedCurveTabBar

//                 height={230}

//                 iconsArray={[1,2,3].map((item, index) =>
//                 (<View style={styles.icon}>
//                     <Text>{index + 1}</Text>
//                 </View>)
//                 )}

//                 onPress={(btnNum) => console.log(btnNum)}

//                 topGap={15}

//                 tabColor={'white'}
//                 backgroundColor={'firebrick'}

//                 duration={300}

//                 sidesRadius={1}

//                 marginBottom={23}

//                 scaleYCircle={1.4}

//                 iconTranslateY={-5}
//                 lockTranslateYAnime={true}

//                 iconScale={1.4}
//                 lockScaleAnime={true}

//                 iconDropY={30}
//                 allowDropAnime={true}
//                 dropWithFirst={false}

//             />
//         </View>
//         // <CurvedBottomBar.Navigator
//         //     screenOptions={{ headerShown: false }}
//         //     type='up'
//         //     circlePosition='LEFT'
//         //     style={styles.bottomBar}
//         //     shadowStyle={styles.shawdow}
//         //     height={60}
//         //     circleWidth={150}
//         //     bgColor="white"
//         //     initialRouteName="title1"
//         //     borderTopLeftRight
//         //     renderCircle={({ selectedTab, navigate }) => (

//         //         <Animated.View style={styles.btnCircleUp}>
//         //             <TouchableOpacity
//         //                 style={styles.button}
//         //                 onPress={() => Alert.alert('Click Action')}
//         //             >
//         //                 <Image source={require('../asstes/image/logo.png')} style={{ height: 25, width: 25 }} />
//         //             </TouchableOpacity>

//         //         </Animated.View>

//         //     )}
//         //     // tabBar={renderTabBar}
//         // >
//         //     <CurvedBottomBar.Screen
//         //         name="title1"
//         //         position='LEFT'
//         //         component={() => <Home />}
//         //     />
//         //     <CurvedBottomBar.Screen
//         //         name="title2"
//         //         component={() => <Home />}
//         //         position="RIGHT"
//         //     />
//         // </CurvedBottomBar.Navigator>
//     );
// }

// export const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//     },
//     shawdow: {
//         shadowColor: '#DDDDDD',
//         shadowOffset: {
//             width: 0,
//             height: 0,
//         },
//         shadowOpacity: 1,
//         shadowRadius: 5,
//     },
//     button: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     bottomBar: { width: "100%" },
//     btnCircleUp: {
//         width: 50,
//         height: 50,
//         borderRadius: 30,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#E8E8E8',
//         bottom: 18,
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 1,
//         },
//         shadowOpacity: 0.2,
//         shadowRadius: 1.41,
//         elevation: 1,
//     },
//     imgCircle: {
//         width: 30,
//         height: 30,
//         tintColor: 'gray',
//     },
//     tabbarItem: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     img: {
//         width: 30,
//         height: 30,
//     },
//     screen1: {
//         flex: 1,
//         backgroundColor: '#BFEFFF',
//     },
//     screen2: {
//         flex: 1,
//         backgroundColor: '#FFEBCD',
//     },
// });