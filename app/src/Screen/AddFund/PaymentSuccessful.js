import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets/images';
import LinearGradient from 'react-native-linear-gradient';

const PaymentSuccessful = (props) => {
  const insets = useSafeAreaInsets();
  const orderid = props.route?.params?.orderid;

  useEffect(() => {
    const backAction = () => {
      props.navigation.replace('Drawers', { screen: 'Home' });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [props]);

  const displayOrderId =
    orderid?.hash || orderid?.order?._id || orderid?.txn_id || orderid?.order_id || 'SUCCESS';

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#061224" translucent={false} />

      <View style={[styles.bodyWrapper, { paddingBottom: 30 + insets.bottom }]}>
        <View style={styles.card}>
          <Image
            source={images.success}
            style={styles.successImage}
            resizeMode="contain"
          />

          <Text style={styles.successTitle}>Payment Successful!</Text>

          <Text style={styles.subtitle}>
            Your funds have been added to your wallet successfully.
          </Text>

          {Boolean(displayOrderId) && (
            <View style={styles.orderIdBadge}>
              <Text style={styles.orderIdLabel}>Transaction ID</Text>
              <Text style={styles.orderIdValue} numberOfLines={1}>
                {displayOrderId}
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.homeBtn}
            onPress={() => props.navigation.replace('Drawers', { screen: 'Home' })}
          >
            <LinearGradient
              colors={['#E2B048', '#C99732', '#9E6833']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnText}>Go to Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentSuccessful;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061224',
  },
  bodyWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  successImage: {
    height: 120,
    width: 120,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  orderIdBadge: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 28,
    width: '100%',
  },
  orderIdLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  orderIdValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  homeBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#061224',
  },
});
