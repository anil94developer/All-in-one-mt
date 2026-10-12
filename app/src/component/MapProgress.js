import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const MapProgress = (props) => {
    if (!props.data || props.data.lenght === 0) return null;

    const firstItem = props.data.shift();
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.verticalLine}></View>
            <View style={styles.verticalWrap}>
                <View style={styles.itemWrap}>
                    <View style={styles.firstPoint}></View>
                    <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text>{firstItem.title}</Text>
                    </View>
                </View>

                {props.data.map((item) => (
                    <View style={styles.itemWrap}>
                        <View style={styles.pointWrap}>
                            <Text
                                style={[
                                    styles.markerText,
                                    item.isCurrent ? styles.currentMarker : null,
                                ]}>
                                {item.letter}
                            </Text>
                        </View>
                        <View style={{ marginLeft: 5, flex: 1 }}>
                            <Text style={item.isCurrent ? styles.currentMarker : null}>
                                {item.title}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default MapProgress

const styles = StyleSheet.create({
    verticalLine: {
      backgroundColor: 'black',
      width: 2,
      height: '95%',
      position: 'absolute',
      marginLeft: 35,
      marginTop: 20,
    },
    verticalWrap: {
      justifyContent: 'space-between',
      height: '100%',
    },
    itemWrap: {
      width: 200,
      height: 40,
      borderWidth: 1,
      marginLeft: 20,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    pointWrap: {
      backgroundColor: 'black',
      height: 20,
      width: 20,
      marginLeft: 5,
      alignItems: 'center',
    },
    firstPoint: {
      backgroundColor: 'black',
      borderRadius: 20,
      height: 10,
      width: 10,
      marginLeft: 10,
    },
    markerText: { color: 'white' },
    currentMarker: { color: 'green' },
  });
  