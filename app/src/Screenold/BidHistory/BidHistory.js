import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { currentTheme } from '../../constants/ThemeProvider';

import { screenWidth } from '../../constants/Sizes.constant';
import moment from 'moment';
import LargefillBtn from '../../component/Button/LargefillBtn';
import Header from '../../Widget/Header';
import SmallFillBtn from '../../component/Button/SmallFillBtn';
import { list } from '../../enums/list';
import { StyleConstants } from '../../constants/Style.constant';
import { postDataContent } from '../../services/Ops';
import { base } from '../../constants/Data.constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from '../../component/DatePicker/DatePicker';

export default function BidHistory(props) {
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(moment(new Date()).add(1, 'day'))
  const [history, setHistory] = useState([])

  useEffect(() => {
    get_data()
  }, [props])

  const get_data = async () => {
    let phone_number = await AsyncStorage.getItem("phone")

    var body = new FormData();
    body.append("phone_number", phone_number);
    body.append("date1", moment(fromDate).format("YYYY-MM-DD"))//phone_number);
    body.append("date2", moment(toDate).format("YYYY-MM-DD"))//phone_number);
    console.log(body)
    let result = await postDataContent(base.get_bid_history, body);
    console.log("bid history", result)
    setHistory(result.result)
  }
  const _goBack = () => {
    props.navigation.goBack()
  }


  return (
    <View style={{ flex: 1 }}>
      <Header
        leftButtonType="back"
        title="Bid History"
        leftButtonAction={_goBack}
        rightButttonType="refresh"
      />

      <View style={{ backgroundColor: currentTheme().lightGray, }}>

        <View >

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', left: 15, marginVertical: 20 }}>
            <View>
              <Text style={{ color: currentTheme().textColor, fontSize: 20, fontWeight: '500' }}>From Date</Text>
              <View style={{ borderWidth: 1, padding: 10, width: screenWidth / 3, borderColor: "#FF493E", borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFAEF' }}>
                <DatePicker
                  selectedDate={fromDate}
                  setSelectedDate={setFromDate}
                  mode='date'
                  label='To Date'
                  width={screenWidth / 3.1}

                />
              </View>

            </View>
            <View>
              <Text style={{ color: currentTheme().textColor, fontSize: 20, fontWeight: '500' }}>To Date</Text>
              <View style={{ borderWidth: 1, padding: 10, width: screenWidth / 3, borderColor: "#FF493E", borderRadius: 10, alignItems: 'center', backgroundColor: '#FFFAEF' }}>

                <DatePicker
                  selectedDate={toDate}
                  setSelectedDate={setToDate}
                  mode='date'
                  label='To Date'
                  width={screenWidth / 3.1}

                />
              </View>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
            {/* <View style={{ flex: 1 }}>
              <SmallFillBtn width={screenWidth / 2.5} onPress={() => { }} label={"Reset"} backgroundColor={currentTheme().errors} />
            </View> */}
            <View style={{ flex: 1 }}>
              <SmallFillBtn width={screenWidth / 2.5} onPress={() => { get_data() }} label={"Apply"} backgroundColor={currentTheme().themeColor} />
            </View>
          </View>
        </View>
      </View>

      {history.length > 0 ?
        <FlatList
          data={history}
          style={{ paddingVertical: 20, marginBottom: 30 }}
          renderItem={({ item, index }) => (
            <View style={[StyleConstants.cardView, { flexDirection: 'row', marginTop: 10, borderRadius: 10, width: screenWidth - 30 }]}>
              <View style={{ flex: 2, padding: 10 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme().textColor }}>{item.game_name}</Text>
                <Text style={{ fontSize: 12, color: currentTheme().textColor }}>{item.date}</Text>

              </View>
              <View style={{ flex: 3, padding: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: currentTheme().Blue, alignSelf: 'center' }}>{item.game_type}</Text>
                <Text style={{ fontSize: 12, fontWeight: 'bold', color: currentTheme().themeColor, alignSelf: 'center' }}>
                  {item.game_type == "Single Pana" && item.session == "Open" &&
                    "Open Pana :- " + item.open_pana}
                  {item.game_type == "Single Pana" && item.session == "Close" &&
                    "Close Pana :- " + item.close_pana}


                  {item.game_type == "Single Digit" && item.session == "Open" &&
                    "Open Digit :- " + item.open_digit}
                  {item.game_type == "Single Digit" && item.session == "Close" &&
                    "Close Digit :- " + item.close_digit}

                  {item.game_type == "Jodi Digit" && item.session == "Open" &&
                    "Open Digit :- " + item.open_digit}
                  {item.game_type == "Jodi Digit" && item.session == "Open" &&
                    "\nClose Digit :- " + item.close_digit}


                  {item.game_type == "Double Pana" && item.session == "Open" &&
                    "Open Pana :- " + item.open_pana}
                  {item.game_type == "Double Pana" && item.session == "Close" &&
                    "Close pans :- " + item.close_pana}

                  {item.game_type == "Triple Pana" && item.session == "Open" &&
                    "Open Pana :- " + item.open_pana}
                  {item.game_type == "Triple Pana" && item.session == "Close" &&
                    "Close Pana :- " + item.close_pana}

{item.game_type == "Half Sangam" && item.session == "Open" && item.open_pana != "NA" &&
                    "Open Pana :- " + item.open_pana} {'\n'}
                  {item.game_type == "Half Sangam" && item.session == "Open" && item.close_digit != "NA" &&
                    "Close Digit :- " + item.close_digit}

                  {item.game_type == "Half Sangam" && item.session == "Open" && item.close_pana != "NA" &&
                    "Open Pana :- " + item.close_pana} {'\n'}
                  {item.game_type == "Half Sangam" && item.session == "Open" && item.open_digit != "NA" &&
                    "Close Digit :- " + item.open_digit}
                

                  {item.game_type == "Full Sangam" && item.session == "Open" &&
                    "Open Pana :- " + item.open_pana} {'\n'}
                  {item.game_type == "Full Sangam" && item.session == "Open" &&
                    "Close Pana :- " + item.close_pana}


                </Text>

              </View>
              <View style={{ flex: 3, backgroundColor: currentTheme().themeColor, padding: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 14, color: currentTheme().White, alignSelf: 'center' }}>Session: {item.session}</Text>

                <Text style={{ fontSize: 18, color: currentTheme().White, alignSelf: 'center' }}>{item.points_action} Points</Text>

              </View>
            </View>
          )
          }
          ListFooterComponent={(
            <View style={{ height: 20 }}></View>
          )}
        />
        :
        <></>

      }
    </View>
  )
}

const styles = StyleSheet.create({})