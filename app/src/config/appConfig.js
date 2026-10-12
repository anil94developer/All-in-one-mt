/* eslint-disable prettier/prettier */
import { Platform } from 'react-native';

// const GOOGLE_MAPS_APIKEY = 'AIzaSyCnNf6kIq3DO1pSmHlP3qlehZgeaibm4oM';
const GOOGLE_MAPS_APIKEY = 'AIzaSyArqlT_3Q9fHcisw6lvvUGTcObXGz3GEJk';

// Host machine server URLs for Physical Device & Android Emulator
const DEV_LAN_IP = '10.48.241.89'; // Your Computer LAN IP
const domainUrl = Platform.OS === 'android' ? 'http://localhost:5001' : 'http://localhost:5001';
const fallbackUrl = `http://${DEV_LAN_IP}:5001`;

const mainUrl = domainUrl + '/api/';
const imageServerUrl = domainUrl + '/';
const USER_TYPE = "User";

const base = {
  // Auth
  login: mainUrl + 'login',
  sendOtp: mainUrl + 'send-otp',
  verifyOtp: mainUrl + 'verify-otp',
  signUp: mainUrl + 'signup',
  verifyMpin: mainUrl + 'verify-mpin',
  forgetPassword: mainUrl + 'forgot-password',
  changePassword: mainUrl + 'profile/change-mpin',
  updatePassword: mainUrl + 'profile/change-mpin',

  // Profile & Bank
  getProfile: mainUrl + 'profile',
  editProfile: mainUrl + 'profile/update',
  getBank: mainUrl + 'profile',
  updateBank: mainUrl + 'profile/update',
  updateUpi: mainUrl + 'bank/update-upi',
  addBank: mainUrl + 'profile/update',
  bankUpdate: mainUrl + 'profile/update',

  // Games & Rates
  home: mainUrl + 'games',
  getKalyanMarket: mainUrl + 'games',
  getGameRate: mainUrl + 'games/rates',
  get_rates: mainUrl + 'games/rates',
  getGameChart: mainUrl + 'games/chart',
  getGameType: mainUrl + 'game-types',

  // Gali Desawar
  galiGames: mainUrl + 'gali-desawar/games',
  galiRates: mainUrl + 'gali-desawar/rates',
  galiPlaceBid: mainUrl + 'gali-desawar/place-bid',
  galiBidHistory: mainUrl + 'gali-desawar/bid-history',
  galiWinHistory: mainUrl + 'gali-desawar/win-history',

  // Bids & Winning
  setBid: mainUrl + 'games/bid',
  betPlace: mainUrl + 'games/bid',
  get_bid_history: mainUrl + 'games/bid-history',
  getBidHistory: mainUrl + 'games/bid-history',
  get_win_report: mainUrl + 'games/win-history',
  getWinningHistory: mainUrl + 'games/win-history',

  // Wallet & Requests
  getWallet: mainUrl + 'wallet/info',
  app_setting: mainUrl + 'app-setting',
  appSetting: mainUrl + 'app-setting',
  amountSetting: mainUrl + 'app-setting',
  slider: mainUrl + 'sliders',
  get_wallet_history: mainUrl + 'wallet/history',
  getDepositHistory: mainUrl + 'wallet/history',
  withdrawRequest: mainUrl + 'wallet/withdraw-request',
  sendWithdraw: mainUrl + 'wallet/withdraw-request',
  getWithdrawList: mainUrl + 'wallet/withdraw-history',
  getWithdrawRequest: mainUrl + 'wallet/withdraw-history',
  addMoney: mainUrl + 'wallet/fund-request',
  fundRequest: mainUrl + 'wallet/fund-request',
  walletAddAmount: mainUrl + 'wallet/fund-request',
  getDepositRequests: mainUrl + 'wallet/deposit-requests',
  recentDeposits: mainUrl + 'wallet/recent-deposits',
  notifications: mainUrl + 'notifications',
  getNotifications: mainUrl + 'notifications',
  contactUs: mainUrl + 'contact-us',
  supportHistory: mainUrl + 'support/history',
  supportSend: mainUrl + 'support/send',
  supportUpload: mainUrl + 'support/upload',
  supportMarkRead: mainUrl + 'support/mark-read',
};

export { mainUrl, base, GOOGLE_MAPS_APIKEY, domainUrl, imageServerUrl, USER_TYPE };
