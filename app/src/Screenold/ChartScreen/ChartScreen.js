import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Widget/Header'
import { currentTheme } from '../../constants/ThemeProvider'
import { screenHeight, screenWidth } from '../../constants/Sizes.constant'
import { gameList4 } from '../../enums/panaList'
import { get_game_chart } from '../../services/Game'
import Loading from '../../component/loading'

export default function ChartScreen(props) {
    const { games_name } = props.route.params;
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState([])

    useEffect(() => {
        const get_data = async () => {
            var body = new FormData();
            body.append("games_name", games_name);
            let result = await get_game_chart(body)
            setHomeData(result)
            setLoading(false)
        }
        get_data()
    }, [props])


    const _goBack = () => {
        props.navigation.goBack()
    }


    const get_color = (value) => {
        if (value == '00' || value == '11' || value == '22' || value == '33' || value == '44' || value == '55' || value == '66' || value == '77' || value == '88' || value == '99' || value == '05' || value == '50' || value == '16' || value == '61' || value == '27' || value == '72' || value == '38' || value == '83' || value == '94' || value == '49') {
            return true
        } else {
            return false
        }

    }
    return (
        <View style={{ height:screenHeight, backgroundColor: currentTheme().themeColor }}>
            <Header
                leftButtonType="back"
                title="Chart"
                leftButtonAction={_goBack}
                rightButttonType="refresh"
            />
            {loading && <Loading />}
            
            <FlatList
                style={{ alignSelf: 'center',borderRadius:20 }}
                data={homeData}
                numColumns={4}
                renderItem={({ item, index }) => {
                    const open_number = item.open_number.split("");
                    const open_digit = item.open_number.split("-");
                    const close_number = item.close_number.split("");
                    const close_digit = item.close_number.split("-");
                    let txtColor=get_color(open_digit[1] + "" + close_digit[1]) ? 'red' : 'black'
                    return (
                        <View style={{ margin: 5, width: screenWidth / 5, padding: 5, backgroundColor: currentTheme().lightGray }}>
                            <Text style={{ fontSize: 10, alignSelf: 'center', color: txtColor }}>{item.result_date}</Text>
                            <View style={{ backgroundColor: txtColor, height: 1 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, alignSelf: 'center', color: txtColor }}>{open_number[0]}</Text>
                                    <Text style={{ fontSize: 10, alignSelf: 'center' , color: txtColor}}>{open_number[1]}</Text>
                                    <Text style={{ fontSize: 10, alignSelf: 'center' , color: txtColor}}>{open_number[2]}</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ fontSize: 15, alignSelf: 'center', fontWeight: 'bold', color: txtColor }}>{open_digit[1]}</Text>
                                    <Text style={{ fontSize: 15, alignSelf: 'center', fontWeight: 'bold' , color: txtColor}}>{close_digit[1]}</Text>

                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 10, alignSelf: 'center', color: txtColor }}>{close_number[0]}</Text>
                                    <Text style={{ fontSize: 10, alignSelf: 'center', color: txtColor }}>{close_number[1]}</Text>
                                    <Text style={{ fontSize: 10, alignSelf: 'center', color: txtColor }}>{close_number[2]}</Text>
                                </View>
                            </View>

                        </View>
                    )
                }
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({})