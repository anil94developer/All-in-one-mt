// ModalComponent.js

import React, { useEffect, useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { currentTheme } from '../../constants/ThemeProvider';
import { screenWidth } from '../../constants/Sizes.constant';
import { StyleConstants } from '../../constants/Style.constant';
import { useTranslation } from 'react-i18next';

const ModalComponent = ({ isVisible, closeModal, modalContent, onPress }) => {

  const { t } = useTranslation()


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={[styles.modalContainer, {
        backgroundColor: currentTheme().modelbg,
      }]}>
        <View style={[styles.modalContent, {
          backgroundColor: currentTheme().backgroundbg,
        }]}>
          <View style={[styles.textInput, {
            backgroundColor: currentTheme().backgroundbg,
            borderColor: currentTheme().cardColor2,
          }]}>
            <Text style={[StyleConstants.text16, { color: currentTheme().textColor, }]}>{modalContent}</Text>
          </View>
          <TouchableOpacity style={[styles.btnBg, {
            backgroundColor: currentTheme().themeColor,
          }]} onPress={() => [closeModal(), onPress]}>
            <Text style={[styles.closeButton, StyleConstants.textBold16, {
              color: currentTheme().antiTextColor,
            }]}>{t("button.ok_btn")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: currentTheme().modelbg,
  },
  modalContent: {
    backgroundColor: currentTheme().backgroundbg,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%', // Adjust the width as needed
  },
  btnBg: {
    backgroundColor: currentTheme().themeColor,
    width: screenWidth - 120,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginTop: 10
  },
  textInput: {
    minHeight: 100,
    borderColor: currentTheme().cardColor2,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 20,
    padding: 8,
    width: '100%',
    backgroundColor: currentTheme().backgroundbg,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
  closeButton: {
    // marginTop: 10,
    fontSize: 16,
    color: currentTheme().antiTextColor,

  },
});

export default ModalComponent;
