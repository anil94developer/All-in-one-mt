import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getApiCall } from '../services/AppSetting';
import { base } from '../config/appConfig';

const AppSettingContext = createContext(null);

export const useAppSetting = () => {
  const context = useContext(AppSettingContext);
  if (!context) {
    throw new Error('useAppSetting must be used within AppSettingProvider');
  }
  return context;
};

const defaultSetting = {
  mobile_number: '',
  whatsapp_number: '',
  home_text: '',
  app_link: '',
  app_version: '',
  need_update: 'No',
  under_maintenance: 'No',
  message: '',
  privacyPolicy: '',
  telegram_link: '',
  qr_code: '',
  google_pay: '',
  upi_payment: '',
  marchant_Id: '',
  offer_status: '0',
  offer_title: '',
  offer_description: '',
  offer_image: '',
  offer_btn_text: 'पैसे जोड़ें',
  offer_btn_action: 'deposit',
  ad_status: '0',
  ad_title: '',
  ad_description: '',
  ad_image: '',
  ad_link: '',
  popup_status: '0',
  popup_title: '',
  popup_message: '',
  popup_image: '',
  popup_btn_text: 'आगे बढ़ें',
  popup_btn_action: 'dismiss',
};

export const AppSettingProvider = ({ children }) => {
  const [appSetting, setAppSetting] = useState(defaultSetting);
  const [loading, setLoading] = useState(true);

  const fetchAppSetting = useCallback(async () => {
    try {
      const result = await getApiCall(base.appSetting);
      if (result && (result.status === true || result.success === '1' || result.success === 1)) {
        const s = result.data?.app_setting || result.data || result;
        setAppSetting({
          app_name: s.app_name ?? s.appName ?? 'Bhau Matka',
          mobile_number: (s.mobile_number ?? s.mobile ?? s.admin_mobile ?? '').toString().trim(),
          whatsapp_number: (s.whatsapp_number ?? s.wp_mobile ?? s.admin_wp ?? s.whatsapp ?? '').toString().trim(),
          home_text: (s.home_text ?? s.alert_message ?? s.message ?? '').toString().trim(),
          alert_message: (s.alert_message ?? s.home_text ?? '').toString().trim(),
          app_link: (s.app_link ?? s.share_url ?? '').toString().trim(),
          app_version: (s.app_version ?? s.app_vesrion ?? '1.0.0').toString().trim(),
          need_update: (s.need_update ?? 'No').toString(),
          under_maintenance: (s.under_maintenance ?? s.under_mantainance ?? 'No').toString(),
          message: (s.message ?? s.alert_message ?? '').toString().trim(),
          privacyPolicy: s.privacyPolicy ?? s.privacy_policy ?? '',
          telegram_link: (s.telegram_link ?? '').toString().trim(),
          qr_code: s.qr_code ?? s.payment_barcode_image ?? '',
          google_pay: s.google_pay ?? s.gpay_upi ?? '',
          upi_payment: s.upi_payment ?? s.upi_payment_id ?? s.payment_upi_id ?? '',
          marchant_Id: s.marchant_Id ?? '',
          mpin_status: (s.mpin_status ?? '1').toString(),
          slider_status: (s.slider_status ?? '1').toString(),
          referral_status: (s.referral_status ?? '1').toString(),
          offer_status: (s.offer_status !== undefined && s.offer_status !== null ? s.offer_status : '0').toString(),
          offer_title: s.offer_title !== undefined && s.offer_title !== null ? s.offer_title : '',
          offer_description: s.offer_description !== undefined && s.offer_description !== null ? s.offer_description : '',
          offer_image: s.offer_image ?? '',
          offer_btn_text: s.offer_btn_text || 'पैसे जोड़ें',
          offer_btn_action: s.offer_btn_action || 'deposit',
          ad_status: (s.ad_status ?? '1').toString(),
          ad_title: s.ad_title ?? '',
          ad_description: s.ad_description ?? '',
          ad_image: s.ad_image ?? '',
          ad_link: s.ad_link ?? '',
          popup_status: (s.popup_status ?? '1').toString(),
          popup_title: s.popup_title ?? 'विशेष सूचना',
          popup_message: s.popup_message ?? '',
          popup_image: s.popup_image ?? '',
          popup_btn_text: s.popup_btn_text ?? 'आगे बढ़ें',
          popup_btn_action: s.popup_btn_action ?? 'dismiss',
          min_withdrawal: s.min_withdrawal ?? '1000',
          max_withdrawal: s.max_withdrawal ?? '50000',
          min_deposite: s.min_deposite ?? '100',
          max_deposite: s.max_deposite ?? '100000',
          min_bid_amt: s.min_bid_amt ?? '10',
          max_bid_amt: s.max_bid_amt ?? '50000',
          withdraw_open_time: s.withdraw_open_time ?? '09:00',
          withdraw_close_time: s.withdraw_close_time ?? '21:00',
          withdrawal_start_time: s.withdrawal_start_time ?? s.withdraw_open_time ?? '09:00',
          withdrawal_end_time: s.withdrawal_end_time ?? s.withdraw_close_time ?? '21:00',
          how_to_play: (s.how_to_play ?? '').toString().trim(),
          content: (s.content ?? s.share_message ?? '').toString().trim(),
          share_message: (s.share_message ?? s.content ?? '').toString().trim(),
          contact_email: (s.contact_email ?? s.email ?? 'info@admin.com').toString().trim(),
          contact_address: (s.contact_address ?? s.address ?? '').toString().trim(),
          landline: (s.landline ?? '').toString().trim(),
          sliders: Array.isArray(s.sliders) ? s.sliders : [],
        });
      }
    } catch (e) {
      setAppSetting(defaultSetting);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppSetting();
  }, [fetchAppSetting]);

  return (
    <AppSettingContext.Provider value={{ appSetting, loading, refresh: fetchAppSetting }}>
      {children}
    </AppSettingContext.Provider>
  );
};
