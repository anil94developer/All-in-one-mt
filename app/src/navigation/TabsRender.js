import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Keyboard,
} from "react-native";

import { fontFamily } from "../constants/font";
import { screenWidth } from "../constants/Sizes.constant";

import { icons, images } from "../assets/images";
import { currentTheme } from "../constants/ThemeProvider";
import { getApiCall } from "../services/AppSetting";
import { base } from "../constants/Data.constant";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import HomeScreen from '../screen/MyBooking';
export default function TabsRender({ state, descriptors, navigation, props }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { strings } = useLanguage();
  const [notificationCount, setNotificationCount] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getNotificationList();
      // navigation.navigate("Tabs",{screen:"Home"});
    }, [props])
  );

  useEffect(() => {
    // navigation.navigate(route.name);
    //   console.log(route.name)

    console.log("-------navigation-------k--", JSON.stringify(navigation));
    // navigation.navigate("Home");
  }, []);
  const getNotificationList = async () => {
    try {
      const result = await getApiCall(base.notificationList);
      console.log(JSON.stringify(result), "-----------blog-");
      if (result.status) {
        let count = [];
        result?.data?.map((item, index) => {
          if (!item.is_read) {
            count.push(item);
          }
        });
        setNotificationCount(count.length);
      } else {
        // Toast.show({ type: 'error', text1: result.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [keyboardStatus, setKeyboardStatus] = useState(false);
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);

  return keyboardStatus ? (
    <></>
  ) : (
    <View style={[ls.tabsBox, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key],
          label =
            options.tabBarLabel == false
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name,
          isFocused = state.index === index,
          onPress = () => {
            console.log(route.key);
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
              console.log(route.name);
            }
          },
          onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
        return (
          <TouchableOpacity
            key={label}
            accessibilityStates={isFocused ? ["selected"] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={ls.activeTab}
          >
            <View
              style={[
                isFocused ? ls.activeTabButton : ls.tabButton,
                {
                  borderLeftColor: isFocused
                    ? currentTheme().bgColor1
                    : currentTheme().bgColor1,
                  borderRightColor: isFocused
                    ? currentTheme().bgColor1
                    : currentTheme().bgColor1,
                  borderTopColor: isFocused
                    ? currentTheme().bgColor1
                    : currentTheme().bgColor1,
                  borderBottomColor: isFocused
                    ? currentTheme().bgColor1
                    : currentTheme().bgColor1,
                },
              ]}
            >
              {
                label == "Home" ? (
                  <Image
                    source={images.home}
                    style={[
                      isFocused ? ls.activeTabIcon : ls.deactiveTabIcon,
                      { tintColor: currentTheme().antiTextColor },
                    ]}
                  />
                )
                  :
                  label == "Inventory" ? (
                    <Image
                      source={images.inventoryIcon}
                      style={[
                        isFocused ? ls.activeTabIcon : ls.deactiveTabIcon,
                        { tintColor: currentTheme().antiTextColor },
                      ]}
                    />
                  )
                    :

                    label == "Quotes" ? (
                      <Image
                        source={images.quotes}
                        style={[
                          isFocused ? ls.activeTabIcon : ls.deactiveTabIcon,
                          { tintColor: currentTheme().antiTextColor },
                        ]}
                      />
                    ) :
                      label == "Notify Center" ? (
                        <Image
                          source={images.notifications}
                          style={[
                            isFocused ? ls.activeTabIcon : ls.deactiveTabIcon,
                            { tintColor: currentTheme().antiTextColor },
                          ]}
                        />
                      ) : label == "Profile" ? (
                        <Image
                          source={images.profile2}
                          style={[
                            isFocused ? ls.activeTabIcon : ls.deactiveTabIcon,
                            { tintColor: currentTheme().antiTextColor },
                          ]}
                        />
                      ) :
                        (
                          <></>
                        )}
            </View>
            <Text
              style={[
                isFocused ? ls.activeTabText : ls.tabText,
                { color: currentTheme().antiTextColor },
              ]}
            >
              {label == "Home"
                ? strings.tabs_home || "Home"
                : label == "Inventory"
                  ? strings.tabs_inventory || "Inventory"
                  : label == "Quotes"
                    ? strings.tabs_quotes || "Quotes"
                    : label == "Notify Center"
                      ? strings.tabs_notify || "Notify Center"
                      : strings.tabs_profile || "Profile"}

            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const ls = StyleSheet.create({
  tab: {
    height: 70,
    flex: 1,
    justifyContent: "center",
    backgroundColor: currentTheme().themeColor,
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    height: 50,
    width: 50,
    // margin: 2,
    flex: 1,
    justifyContent: "center",
    backgroundColor: currentTheme().themeColor,
    alignItems: "center",
  },
  tabButton: {
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    bottom: -26,
  },
  activeTabButton: {
    borderRadius: 60,
    backgroundColor: currentTheme().themeColor,
    borderBottomWidth: 8,
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    // borderLeftColor: currentTheme().bgColor1,
    // borderRightColor: currentTheme().bgColor1,
    // borderTopColor: currentTheme().bgColor1,
    // borderBottomColor: currentTheme().bgColor1,

    bottom: 1,
    height: 65,
    width: 65,
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    color: currentTheme().White,
    // textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: 400,
    // fontFamily: fontFamily.regular,
    // marginBottom: 20
    marginTop: 16,
  },
  activeTabText: {
    color: currentTheme().bgColor1,
    // textTransform: 'capitalize',
    fontSize: 12,
    fontWeight: 600,
    // fontFamily: fontFamily.regular,
    marginTop: 10,

    marginBottom: 18,
  },
  tabIcon: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
  deactiveTabIcon: {
    opacity: 1,
    width: 24,
    height: 24,
    resizeMode: "contain",
    tintColor: currentTheme().antiTextColor,
  },
  activeTabIcon: {
    alignSelf: "center",
    width: 26,
    height: 26,
    tintColor: currentTheme().antiTextColor,
    resizeMode: "contain",
  },
  tabsBox: {
    flexDirection: "row",
    borderTopColor: currentTheme().bgColor1,
    // borderTopWidth: 1,
    // overflow: 'hidden',
    backgroundColor: currentTheme().themeColor,
    height: 70,
  },
  activeTabhome: {
    alignSelf: "center",
    width: 50,
    height: 50,
    // marginTop: -10,
    // tintColor: currentTheme().White,
    // backgroundColor:currentTheme().cards,
    // borderRadius:10,
    // padding:10
  },
});
