import { FlatList, StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../Widget/Header'
import { get_game_rate } from '../../services/Game'
// import NoDataFound from '../../component/NoDataFound/NoDataFound'
import { StyleConstants } from '../../constants/Style.constant'
import { currentTheme } from '../../constants/ThemeProvider'
import { screenWidth } from '../../constants/Sizes.constant'

export default function MarketRate(props) {

  const [gameRate, setGameRate] = useState([])
  useEffect(() => {
    const getGame = async () => {
      setGameRate(await get_game_rate())
    }
    getGame()
  }, [props])
  const _goBack = () => {
    props.navigation.goBack()
  }

  let data = [
    { "id": "1", "name": "Single Digit", "image": require('../../assets/image/sd.png'), "type": "Open" },
    { "id": "2", "name": "Jodi Digit", "image": require('../../assets/image/jodi.png'), "type": "Open" },
    { "id": "3", "name": "Single Pana", "image": require('../../assets/image/sp.png'), "type": "Open" },
    { "id": "4", "name": "Double Pana", "image": require('../../assets/image/dp.png'), "type": "Open" },
    { "id": "5", "name": "Triple Pana", "image": require('../../assets/image/tp.png'), "type": "Open" },
    { "id": "6", "name": "Half Sangam", "image": require('../../assets/image/half.png'), "type": "Open" },
    { "id": "7", "name": "Full Sangam", "image": require('../../assets/image/full.png'), "type": "Open" }
  ]
  return (
    <View style={{ flex: 1 }}>
      <Header
        leftButtonType="back"
        title="Market Rate"
        leftButtonAction={_goBack}
        rightButttonType="refresh"
      />
      <View style={{ padding: 10, flex: 6 }}>
        {gameRate.length > 0 ?
          <FlatList
            data={gameRate}
            numColumns={2}
            style={{  marginBottom: 30 }}
            renderItem={({ item, index }) => (
              <View style={[StyleConstants.cardView, {   marginTop: 10, borderRadius: 10, width: screenWidth/2 - 30,borderRadius:30 }]}>
                <Image source={data[index].image} style={{ height: 150, width: '100%' }} />

                <View style={{ flex: 3, backgroundColor: currentTheme().themeColor, padding: 20, justifyContent: 'center', flexDirection: 'row' }}>
                  <Text style={{ fontSize: 18, color: currentTheme().White, alignSelf: 'center' }}>{item.min_value} - </Text>

                  <Text style={{ fontSize: 18, color: currentTheme().White, alignSelf: 'center' }}>{item.max_value} Points</Text>

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
    </View>
  )
}

const styles = StyleSheet.create({})