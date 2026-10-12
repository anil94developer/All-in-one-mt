import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";

import { WebView } from "react-native-webview";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import { screenHeight, screenWidth } from "../constants/Sizes.constant";
import { useFocusEffect } from "@react-navigation/native";

import Header from "../../../Widget/Header";
import { currentTheme } from "../../../constants/ThemeProvider";
import LargefillBtn from "../../../component/Button/LargefillBtn";
import { postApiCall } from "../../../services/AppSetting";
import { base } from "../../../constants/Data.constant";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DeleteAccount = (props) => {
  const [visible, setVisible] = useState(true);

  const _goBack = () => {
    props.navigation.navigate("Tabs", { screen: "Setting" });
  };

  const deleteHandler =async ()=>{
    let result = await postApiCall(base.deleteAccount)
    console.log('=--=result',result);
    if(result.status == true){

      Toast.show({type:'success',text2:'!Error Delete Account' ,text1:result.message})
      await AsyncStorage.removeItem("token")
      await AsyncStorage.removeItem("userId")
      props.navigation.navigate('Login')
    }
    
  }

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header view */}
      <Header
        leftButtonType="back"
        title={"Delete Account"}
        leftButtonAction={_goBack}
        // rightButttonType="refresh"
        // rightButtonAction={
        //     <Text style={styles.mainText}>Total- {allTot}</Text>
        // }
      />
      <View style={{ marginHorizontal: 10 }}>
        <Text style={styles.deleteText}>
          Are you sure you want to delete your account? Please read how account
          deletion will affect. Deleting your account removes personal
          information our database. Tour email becomes permanently reserved and
          same email cannot be re-use to register a new account.
        </Text>
        <View style={{ marginBottom: 20 }}>
          <LargefillBtn
            // animating={loading}
            label="Delete"
            backgroundColor={currentTheme().themeColor}
            onPress={() => 
              deleteHandler()
            }
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: "400",
    color: currentTheme().gary,
    marginVertical:14
    // textAlign:"center"
  },
});

export default DeleteAccount;
