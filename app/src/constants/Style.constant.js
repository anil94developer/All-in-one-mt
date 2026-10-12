import { StyleSheet } from 'react-native';

import { fontFamily } from './font';

import { screenHeight, screenWidth } from './Sizes.constant';
import { StatusBar } from 'react-native';
import { currentTheme } from './ThemeProvider';
import { lightTheme } from './Colors.constant';

export const StyleConstants = StyleSheet.create({

  text1: {
    fontSize: 18,
    color: currentTheme().textColor,
    fontWeight: '600'
  },

  textBlue: {
    fontSize: 18,
    color: lightTheme.themeColor,
    fontWeight: '500'
  },
  textBlue2: {
    fontSize: 14,
    color: lightTheme.themeColor,
    fontWeight: '400'
  },
  textBlue3: {
    fontSize: 16,
    color: lightTheme.themeColor,
    fontWeight: '400'
  },
  text2: { fontSize: 20, fontWeight: 'bold', color: currentTheme().textColor },
  text3: {
    fontSize: 15,
    color: currentTheme().textColor,
    // fontWeight: '600'
  },
  text4: {
    fontSize: 14,
    color: currentTheme().textColor,
    // fontWeight: '600'
  },
  textSize14: {
    fontSize: 16, color: currentTheme().black
  },
  text5: {
    fontSize: 14,
    color: currentTheme().textColor,
    fontWeight: 'bold'
  },
  textSize20: {
    fontSize: 20,
    color: currentTheme().textColor,
    fontWeight: '400'
  },
  textDrawer: {
    fontSize: 16,
    color: currentTheme().textColor,
    fontWeight: '400',
    marginLeft: 10 
  },
  textGrey: {
    fontSize: 15,
    color: "grey",
    // fontWeight: '600'
  },
  textGreySize12: {
    fontSize: 12,
    color: "grey",
    // fontWeight: '600'
  },
  textGreySize14: {
    fontSize: 14,
    color: "grey",
    // fontWeight: '600'
  },
  btnTx: {
    color: currentTheme().antiTextColor, fontSize: 18, fontWeight: '400'
  },
  textWhite1: {
    color: currentTheme().antiTextColor, fontSize: 18, fontWeight: '400'
  },
  textWhite2: {
    color: currentTheme().antiTextColor, fontSize: 20, fontWeight: '400'
  },
  textWhite3: {
    color: currentTheme().antiTextColor, fontSize: 16
  },
  textWhite4: {
    color: currentTheme().antiTextColor, fontSize: 14
  },
  textWhite5: {
    color: currentTheme().antiTextColor, fontSize: 11
  },


  // container
  container: {
    flex: 1,
    backgroundColor: currentTheme().White,
    // alignItems: 'center',
    // marginTop:StatusBar.currentHeight,
    // width: screenWidth,
    // paddingHorizontal: 50,
  },
  container2: {
    flex: 1,
    backgroundColor: currentTheme().appBgColor2,
    // paddingHorizontal:10,
    paddingVertical: 10

  },
  container3: {
    flex: 1,
    backgroundColor: currentTheme().White,
    // alignItems: 'center',
    paddingTop: 65,
    // width: screenWidth,
    // paddingHorizontal: 50,
  },
  innerContainer: {
    // backgroundColor: "red",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  innerContainer2: {
    width: '90%',
    alignSelf: 'center'
  },
  innerButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  outerContainer: {
    marginBottom: 60,
  },
  buttonContainer: {
    backgroundColor: currentTheme().themeColor,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    height: 40,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: currentTheme().themeColor,
    backgroundColor: currentTheme().secondaryColor,
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardCenterContainer: {
    paddingHorizontal: 10,
    flexDirection: 'column',
    flex: 1,
  },
  cardTextContainer: { flexDirection: 'row' },
  documentTypeContainer: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  viewButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  // text
  cardCenterHeadText: {
    color: currentTheme().black,
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardCenterText: {
    color: currentTheme().black,
    paddingHorizontal: 10,
    // backgroundColor: "red",
  },
  defaultText: {
    color: currentTheme().black,
    // backgroundColor: "red",
  },
  buttonText: {
    color: currentTheme().White,
    fontSize: 15,
    fontWeight: 'bold',
  },
  modalLayer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: currentTheme().White,
    marginBottom: "3%"

  },
  Textinput2: {
    height: 50, width: screenWidth - 40, borderWidth: 1, borderRadius: 8, marginTop: 5, justifyContent: 'center',
    borderColor: currentTheme().cardColor2,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: currentTheme().backgroundbg


  },
  Textinput5: {
    height: 150, width: screenWidth - 40, borderWidth: 1, borderRadius: 8, marginTop: 5, justifyContent: 'center',
    borderColor: currentTheme().cardColor2,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: currentTheme().backgroundbg


  },
  Textinput3: {
    height: 150,
    width: screenWidth - 40,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    justifyContent: 'center',
    borderColor: currentTheme().cardColor2,
    // paddingHorizontal: 12,
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: currentTheme().backgroundbg


  },
  Textinput: {
    paddingStart: 10,
    // width: "95%",
    alignSelf: 'center',
    borderRadius: 5,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F7F7F9',
    backgroundColor: currentTheme().inputbg,
    borderRadius:10


  },
  TextinputDisable: {
    width: '100%',
    height: 40,
    marginVertical: 5,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'red',
    backgroundColor: currentTheme().lightGray,
    // placeholderTextColor: "red",
    borderColor: currentTheme().themeColor,
    borderWidth: 1,
    justifyContent: 'center',
  },
  btnoutline: {
    borderWidth: 1,
    width: screenWidth - 32,
    // flex: 1,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderColor: currentTheme().White,
    // marginTop: 16
    marginBottom: 16,
  },
  RowView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginLeft:20
  },
  RowView2: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    marginLeft: 20
  },
  icon: {
    height: 20,
    width: 20,
  },
  textsigup: {
    // color: currentTheme().black,
    fontWeight: '400',
    fontSize: 18,
  },
  bottunth: {
    // backgroundColor: currentTheme().White,
    height: 30,
    justifyContent: 'center',
    width: screenWidth,
    alignItems: 'center',
    height: screenWidth * (50 / 375),
    borderRadius: 4,
    // marginBottom:
  },
  errText: {
    color: currentTheme().errors,
    fontSize: 12,
    fontFamily: fontFamily.Regular,
    // marginTop: -10,
    marginLeft: 20,
    fontWeight: 'bold',
    width: screenWidth - 32,
    // marginHorizontal:4
  },
  ImageI: {
    width: 15,
    height: 15,
  },
  cardViewkyc: {
    marginTop: 25,
    backgroundColor: currentTheme().cardligth,
    paddingVertical: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    elevation: 5,
  },
  TextBold: {
    color: currentTheme().Black,
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
  },
  // modal style start
  modalManView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:currentTheme().themeColor
  },
  modalbg: {
    backgroundColor: currentTheme().White,
    opacity: 0.7,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardModalView: {
    width: screenWidth - 20,
    marginHorizontal: 50,
    borderColor: currentTheme().Primary,
    backgroundColor: currentTheme().White,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    borderRadius: 10,
  },
  modalHeaderContainer: {
    // justifyContent: "space-between",
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: currentTheme().White,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopEndRadius: 10,
    padding: 10,
  },
  modalHeaderText: {
    color: currentTheme().White,
    fontSize: 20,
    fontFamily: fontFamily.Regular,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalCloseIconContainer: {
    padding: 5,
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: currentTheme().secondaryColor,
    height: 30,
    width: 30,
  },
  modalCloseIcon: {
    height: 20,
    width: 20,
    tintColor: currentTheme().White,
  },
  modalInnerViewContainer: { padding: 10 },
  // modal style finish
  cardView: {
    // marginHorizontal: 10,
    borderColor: currentTheme().Primary,
    backgroundColor: currentTheme().White,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height:'100%',
    marginTop:10
  },
  itemList: {
    // marginHorizontal: 10,
    width:screenWidth-40,
    alignSelf:'center',
    borderColor: currentTheme().Primary,
    backgroundColor: currentTheme().White,
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8, 
    marginTop:10
  },
  modalView: {
    backgroundColor: currentTheme().White,
    borderRadius: 1,
    padding: 10,
    width: screenWidth - 20,
  },
  textStylemodal: {
    color: currentTheme().Black,
    padding: 10,
    fontFamily: fontFamily.medium,
  },
  textitem: {
    color: currentTheme().themeColor,
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  textStyle: {
    color: currentTheme().Black,
  },
  codeFieldRoot: {
    marginTop: 40,
    width: screenWidth - 100,
    alignSelf: 'center',
  },
  cell: {
    bottom: 10,
    borderRadius: 5,
    height: 45,
    width: 45,
    lineHeight: 40,
    fontSize: 20,
    borderWidth: 2,
    borderColor: currentTheme().themeColor,
    color: currentTheme().themeColor,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: currentTheme().themeColor,
  },
  securityCheck: {
    width: 35,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // alert start
  alertText: {
    color: 'red',
    fontWeight: 'bold',
  },
  // attachement image start
  attachementImage: {
    width: 50,
    height: 50,
  },
  // radio button start
  selected: {
    backgroundColor: currentTheme().themeColor,
    color: currentTheme().White,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 50,
  },
  unSelected: {
    borderWidth: 1,
    borderColor: currentTheme().themeColor,
    color: currentTheme().themeColor,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 50,
  },
  // action button container style
  actionButtonContainer: {
    backgroundColor: currentTheme().themeColor,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 3,
    alignItems: 'center',
  },
  actionButtonText: {
    color: currentTheme().White,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // date
  selectDateContainer: {
    justifyContent: 'space-between',
    // backgroundColor: currentTheme().White,
    backgroundColor: '#FFFAEF',
    paddingHorizontal: 5,
    // paddingVertical: 5,
    // flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    // borderWidth: 1,
    borderColor: currentTheme().White,
    borderRadius: 5,
    // height: 50,
  },
  selectDate: {
    color: currentTheme().black,
    paddingHorizontal: 10,
  },
  selectDateIcon: {
    width: 15,
    height: 15,
    tintColor: currentTheme().themeColor,
    justifyContent: 'flex-end',
  },
  selectDateImageOuterContainer: {
    flexDirection: 'row',
    paddingVertical: 7,
  },
  selectDateImageContainer: {
    borderWidth: 1,
    borderColor: currentTheme().themeColor,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    marginHorizontal: 2,
  },
  text8: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 8,
    fontWeight: 'normal'
  },
  textBold8: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 8,
    fontWeight: 'bold'
  },
  text10: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 10,
    fontWeight: 'normal'
  },
  textBold10: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 10,
    fontWeight: 'bold'
  },
  text12: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 12,
    fontWeight: 'normal'
  },
  textBold12: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    fontWeight: 'bold'
  },
  text14: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 14,
    fontWeight: 'normal'
  },
  textBold14: {

    // fontFamily: fontFamily.bold,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: fontFamily.bold
  },
  text16: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 16,
    fontWeight: 'normal'
  },
  textBold16: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 16,
    fontWeight: 'bold'
  },
  text18: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 18,
    fontWeight: 'normal'
  },
  textBold18: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 18,
    fontWeight: 'bold'
  },
  text20: {
    // color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 20,
    fontWeight: 'normal'
  },
  textBold20: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 20,
    fontWeight: 'bold'
  },
  text22: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 22,
    fontWeight: 'normal'
  },
  textBold22: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 22,
    fontWeight: 'bold'
  },
  text24: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 24,
    fontWeight: 'normal'
  },
  textBold24: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 24,
    fontWeight: 'bold'
  },
  text26: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 26,
    fontWeight: 'normal'
  },
  textBold26: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 26,
    fontWeight: 'bold'
  },
  text28: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 28,
    fontWeight: 'normal'
  },
  textBold28: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 28,
    fontWeight: 'bold'
  },
  text30: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 30,
    fontWeight: 'normal'
  },
  textBold30: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 30,
    fontWeight: 'bold'
  },
  text32: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 32,
    fontWeight: 'normal'
  },
  textBold32: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 32,
    fontWeight: 'bold'
  },
  text34: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 34,
    fontWeight: 'normal'
  },
  textBold34: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 34,
    fontWeight: 'bold'
  },
  text36: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 36,
    fontWeight: 'normal'
  },
  textBold36: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 36,
    fontWeight: 'bold'
  },
  text38: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 38,
    fontWeight: 'normal'
  },
  textBold38: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 38,
    fontWeight: 'bold'
  },
  text40: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 40,
    fontWeight: 'normal'
  },
  textBold40: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 40,
    fontWeight: 'bold'
  },
  text42: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.Regular,
    fontSize: 42,
    fontWeight: 'normal'
  },
  textBold42: {
    color: currentTheme().textColor,
    fontFamily: fontFamily.bold,
    fontSize: 42,
    fontWeight: 'bold'
  },
});
