import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  TouchableWithoutFeedback,
  Button,
  Platform,
  FlatList,
  TouchableOpacity
} from "react-native";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { StyleConstants } from "../../constants/Style.constant";
import { ColorsConstant } from "../../constants/Colors.constant";
import { currentTheme } from "../../constants/ThemeProvider";
// ::::::::::::::::::::::::::::::::: import constants



const DatePicker = (props) => {
  const { selectedDate, setSelectedDate, minimumDate, maximumDate, mode, width, label, onPress } = props
  // const [toSelectedDate, setToSelectedDate] = useState(selectedDate);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    mode == 'date' ?

      setSelectedDate(date)
      :
      setSelectedDate(moment(date).format("hh:mm A"))

    // onPress(date)
    // setToSelectedDate(date);
    hideDatePicker();
  };

  return (

    <View style={{}}>
      {/* <Text style={[styles.label, { color: currentTheme().black }]}>
        {label}
      </Text> */}
      <View style={{ flexDirection: "row", top: 5 }}>
        <View style={{
          // flex: 9 
        }}>
          <TouchableOpacity
            style={[StyleConstants.selectDateContainer, { width: width, }]}
            onPress={showDatePicker}
          >
            <Text style={StyleConstants.selectDate}>
              {mode == "date" ?
                `${selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : moment().format("DD MMMM YYYY")}`
                : `${selectedDate ? moment(selectedDate).format("hh:mm A") : moment().format("hh:mm A")}`

              }
            </Text>
            {/* <Image
                source={DateIcon}
                style={StyleConstants.selectDateIcon}
              /> */}
            <DateTimePickerModal
              is24Hour={false}
              isVisible={isDatePickerVisible}
              mode={mode}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    borderColor: currentTheme().black,
    flex: 1,
  },
  label: {
    // fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    // marginBottom: "3%"

  },
  filterBoxContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 15,
  },
  filterBox: {
    backgroundColor: currentTheme().themeColor,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  filterBoxText: { fontSize: 15, color: currentTheme().White },
  searchContainer: {
    backgroundColor: currentTheme().White,
    paddingVertical: 5,
  },
  searchInnerContainer: {
    marginHorizontal: 10,
  },
  cardContainer: {
    // flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: currentTheme().themeColor,
    backgroundColor: currentTheme().secondaryColor,
    // backgroundColor: "#9ED2C6",
    borderRadius: 5,
    // flexDirection: "row",
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardLeftContainer: {},
  cardUserImages: { width: 50, height: 50 },
  cardCenterContainer: {
    flexDirection: "column",
    flex: 1,
    paddingHorizontal: 10,
  },
  cardCenterHeadText: {
    color: currentTheme().black,
    fontWeight: "bold",
    fontSize: 15,
  },
  cardCenterText: { color: currentTheme().black },
  cardTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardCenterTextIcon: { width: 15, height: 15 },
  rightIcon: { width: 10, height: 10 },
  cardRightContainer: {},
  cardRightText: { color: currentTheme().black },
  cardRightIconContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
});

export default DatePicker;
