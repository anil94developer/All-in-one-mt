import * as React from "react";
import { Alert, Appearance, StatusBar, Text } from "react-native";
import { NavigationContainer, ServerContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { screenWidth } from "../constants/Sizes.constant";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { currentTheme, useTheme } from "../constants/ThemeProvider";
// ::::::::::::::::::::::::::::::::: importing screen
// import Splash from "../Screen/Splash"; 

import Splash from "../Screen/Splash";
import Login from "../Screen/Auth/Login";
import SignUp from "../Screen/Auth/SignUp";
// import PhoneNumber from "../Screen/Auth/Login/PhoneNumber";
import Home from "../Screen/Home/Home";
import DrawerScreen from "../Screen/DrawerScreen/DrawerScreen";
import GameScreen from "../Screen/GameScreen/GameScreen";
import BidScreen from "../Screen/BidScreen/BidScreen";
import AccountBlock from "../Screen/AcountBlock/AccountBlock";
import AppUpdate from "../Screen/AppUpdate/AppUpdate";
import UnderMaintenance from "../Screen/UnderMaintenance/UnderMaintenance";
import AddFund from "../Screen/AddFund/AddFund";
import AddBank from "../Screen/AddBank/AddBank";
import Withdraw from "../Screen/Withdraw/Withdraw";
import PaymentSuccessful from "../Screen/AddFund/PaymentSuccessful";
import ProfileScreen from "../Screen/Profile/ProfileScreen";
import SetPassword from "../Screen/Auth/Login/SetPassword";
//
import Wallet from "../Screen/Wallet/Wallet";
import WiningHistory from "../Screen/WiningHistory/WiningHistory";
import Passbook from "../Screen/Passbook/Passbook";
import BankDetails from "../Screen/BankDetails/BankDetails";
import MarketRate from "../Screen/MarketRate/MarketRate";
import FundTransfer from "../Screen/FundTransfer/FundTransfer";
import BidHistory from "../Screen/BidHistory/BidHistory";
import ChartScreen from "../Screen/ChartScreen/ChartScreen";
// import TabsRender from "./TabsRender"; 
// import Wallet from "../Screen/Auth/Login/Home";
// import BidPlace from "../Screen/Auth/Login/BidPlace";
// import Profile from "../Screen/Auth/Login/Profile";
// import MilanNight from "../Screen/Auth/Login/MilanNight";
// import PlayGame from "../Screen/Auth/Login/PlayGame";
// import DrawerScreen from "../Screen/DrawerScreen/DrawerScreen";


import SelectLanguage from "../Screen/Language/SelectLanguage";
import NoticeScreen from "../Screen/Notice/NoticeScreen";
import ContactUsScreen from "../Screen/ContactUs/ContactUsScreen";
import HowToPlayScreen from "../Screen/HowToPlay/HowToPlayScreen";
import SupportChatScreen from "../Screen/SupportChat/SupportChatScreen";
import GaliDesawarScreen from "../Screen/GaliDesawar/GaliDesawarScreen";
import GaliGameTypeScreen from "../Screen/GaliDesawar/GaliGameTypeScreen";
import GaliBidScreen from "../Screen/GaliDesawar/GaliBidScreen";
import StarlineGamesScreen from "../Screen/Starline/StarlineGamesScreen";
import StarlineGameTypeScreen from "../Screen/Starline/StarlineGameTypeScreen";
import StarlineBidScreen from "../Screen/Starline/StarlineBidScreen";

const Drawer = createDrawerNavigator(),
  Stack = createNativeStackNavigator(),
  Tab = createBottomTabNavigator(),
  PromoStack = (props) => {
    // let initialRoute = 'Home';
    let initialRoute = "Splash";
    return (
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
        presentation="card"
        initialRouteName={initialRoute}
        {...props}
      >
        <Stack.Screen name="SelectLanguage" component={SelectLanguage} />
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="UnderMaintenance" component={UnderMaintenance} />
        <Stack.Screen name="AppUpdate" component={AppUpdate} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Drawers" component={Drawers} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AddFund" component={AddFund} />
        <Stack.Screen name="Withdraw" component={Withdraw} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SetPassword" component={SetPassword} />
        <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="WiningHistory" component={WiningHistory} />
        <Stack.Screen name="Passbook" component={Passbook} />
        <Stack.Screen name="FundTransfer" component={FundTransfer} />
        <Stack.Screen name="BidHistory" component={BidHistory} />
        <Stack.Screen name="BankDetails" component={BankDetails} />
        <Stack.Screen name="AddBank" component={AddBank} />
        <Stack.Screen name="MarketRate" component={MarketRate} />
        <Stack.Screen name="ChartScreen" component={ChartScreen} />
        <Stack.Screen name="PaymentSuccessful" component={PaymentSuccessful} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="BidScreen" component={BidScreen} />
        <Stack.Screen name="AccountBlock" component={AccountBlock} />
        <Stack.Screen name="NoticeScreen" component={NoticeScreen} />
        <Stack.Screen name="ContactUsScreen" component={ContactUsScreen} />
        <Stack.Screen name="HowToPlayScreen" component={HowToPlayScreen} />
        <Stack.Screen name="SupportChatScreen" component={SupportChatScreen} />
        <Stack.Screen name="GaliDesawarScreen" component={GaliDesawarScreen} />
        <Stack.Screen name="GaliGameTypeScreen" component={GaliGameTypeScreen} />
        <Stack.Screen name="GaliBidScreen" component={GaliBidScreen} />
        <Stack.Screen name="StarlineGamesScreen" component={StarlineGamesScreen} />
        <Stack.Screen name="StarlineGameTypeScreen" component={StarlineGameTypeScreen} />
        <Stack.Screen name="StarlineBidScreen" component={StarlineBidScreen} />
        {/* 
        <Stack.Screen name="PhoneNumber" component={PhoneNumber}/> 
        
        
       
        
        
       
        <Stack.Screen name="SetPassword" component={SetPassword} /> 
         
   
       

 */}









        {/* <Stack.Screen name="Wallet" component={Wallet} />
        <Stack.Screen name="BidPlace" component={BidPlace} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="MilanNight" component={MilanNight} />
        <Stack.Screen name="PlayGame" component={PlayGame} />
   
      */}


      </Stack.Navigator>
    );
  },
  Drawers = (props) => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            width: screenWidth * (240 / 375),


          },
        }}
        drawerType={"front"}
        drawerContent={(props) => <DrawerScreen {...props} />}
        {...props}
      >
        <Drawer.Screen
          name="Home"
          ref={new Date().getTime()}
          component={Home}
          options={{ headerShown: false }}
        />
      </Drawer.Navigator>
    );
  },

  TabsStack = (props) => {
    let initialRoute =
      typeof props.route.params === "undefined"
        ? "Home"
        : props.route.params.activeScreen;
    if (initialRoute === "undefined" || typeof initialRoute === "undefined") {
      initialRoute = "Home";
    }
    return (
      <Tab.Navigator
        key={props}
        initialRouteName={"Home"}
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <TabsRender {...props} initialRoute={"Home"} />}
      >
        <Tab.Screen name={"Home"}>{(props) => <Home {...props} />}</Tab.Screen>
        <Tab.Screen name={"Inventory"}>
          {(props) => <InventoryTabs {...props} />}
        </Tab.Screen>
        <Tab.Screen name={"Quotes"} initialParams={{ page: "NewQuotesCom" }}>
          {(props) => <Quotes {...props} />}
        </Tab.Screen>
        <Tab.Screen name={"Notify Center"}>
          {(props) => <NotifyCenter {...props} />}
        </Tab.Screen>
        <Tab.Screen name={"Profile"}>
          {(props) => <Profile {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  };

export default function Router() {
  const { theme, updateTheme } = useTheme();
  React.useEffect(() => {
    let systemTheme = Appearance.getColorScheme();
    updateTheme(systemTheme == "dark" ? "light" : "dark");
  }, []);

  let ref = React.useRef(null);
  let initialScreen = "Promo";

  return (
    <NavigationContainer ref={ref}>
      <StatusBar backgroundColor="#061224" barStyle="light-content" translucent={false} />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={initialScreen}
      >
        <Stack.Screen
          name="Promo"
          component={PromoStack}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

