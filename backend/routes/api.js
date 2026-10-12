const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const gameController = require('../controllers/gameController');
const walletController = require('../controllers/walletController');
const { verifyToken } = require('../middlewares/auth');

// Public App Info / Branding endpoint
router.get('/app-info', async (req, res) => {
  try {
    const db = require('../config/db');
    // Ensure mpin_status and slider_status columns exist in admin_settings table
    try {
      await db.query(`ALTER TABLE admin_settings ADD COLUMN mpin_status VARCHAR(10) DEFAULT '1'`);
    } catch (e) {}
    try {
      await db.query(`ALTER TABLE admin_settings ADD COLUMN slider_status VARCHAR(10) DEFAULT '1'`);
    } catch (e) {}
    try {
      await db.query(`ALTER TABLE admin_settings ADD COLUMN referral_status VARCHAR(10) DEFAULT '1'`);
    } catch (e) {}

    const [settings] = await db.query('SELECT app_link, upi_name, mpin_status, slider_status, referral_status, alert_message FROM admin_settings LIMIT 1');
    const [admins] = await db.query('SELECT name FROM admin WHERE id = 1');
    const [contacts] = await db.query('SELECT mobile, wp_mobile FROM contact_detail LIMIT 1');
    let appName = 'Lucky';
    if (settings.length > 0 && settings[0].app_link && !settings[0].app_link.startsWith('http')) {
      appName = settings[0].app_link;
    } else if (settings.length > 0 && settings[0].upi_name && !settings[0].upi_name.startsWith('http')) {
      appName = settings[0].upi_name;
    } else if (admins.length > 0 && admins[0].name) {
      appName = admins[0].name;
    }

    const contactInfo = contacts.length > 0 ? contacts[0] : {};
    const wpNum = contactInfo.wp_mobile || contactInfo.mobile || '';
    const mpinStatus = (settings.length > 0 && settings[0].mpin_status !== undefined && settings[0].mpin_status !== null) ? String(settings[0].mpin_status) : '1';
    const sliderStatus = (settings.length > 0 && settings[0].slider_status !== undefined && settings[0].slider_status !== null) ? String(settings[0].slider_status) : '1';
    const referralStatus = (settings.length > 0 && settings[0].referral_status !== undefined && settings[0].referral_status !== null) ? String(settings[0].referral_status) : '1';
    const alertMessage = settings.length > 0 ? (settings[0].alert_message || '') : '';

    let sliders = [];
    if (sliderStatus === '1') {
      try {
        const [rows] = await db.query("SELECT * FROM slider_images WHERE status = '1' ORDER BY display_order ASC, id DESC");
        sliders = rows.map(r => r.slider_image);
      } catch (e) {
        sliders = [];
      }
    }

    return res.json({
      success: '1',
      data: {
        app_name: appName,
        app_logo: '/img/logo.png',
        mobile: contactInfo.mobile || '',
        wp_mobile: wpNum,
        mpin_status: mpinStatus,
        slider_status: sliderStatus,
        referral_status: referralStatus,
        sliders: sliders,
        alert_message: alertMessage
      }
    });
  } catch (err) {
    return res.json({
      success: '1',
      data: {
        app_name: 'Lucky',
        app_logo: '/img/logo.png',
        mobile: '',
        wp_mobile: '',
        mpin_status: '1',
        slider_status: '1',
        sliders: []
      }
    });
  }
});

// Unified App Setting Endpoint (Admin Configuration Link)
router.get('/app-setting', async (req, res) => {
  try {
    const db = require('../config/db');

    // Auto-alter admin_settings to support Offer, Ad, and Popup Modal settings
    const safeAlter = async (query) => { try { await db.query(query); } catch (e) {} };
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN mpin_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN slider_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN referral_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_title VARCHAR(255) DEFAULT '🔥 वेलकम बोनस ऑफर!'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_description TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_image TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_btn_text VARCHAR(100) DEFAULT 'पैसे जोड़ें'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN offer_btn_action VARCHAR(50) DEFAULT 'deposit'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN ad_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN ad_title VARCHAR(255) DEFAULT ''`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN ad_description TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN ad_image TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN ad_link VARCHAR(255) DEFAULT ''`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_status VARCHAR(10) DEFAULT '1'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_title VARCHAR(255) DEFAULT 'विशेष सूचना'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_message TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_image TEXT`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_btn_text VARCHAR(100) DEFAULT 'आगे बढ़ें'`);
    await safeAlter(`ALTER TABLE admin_settings ADD COLUMN popup_btn_action VARCHAR(50) DEFAULT 'dismiss'`);

    const [settings] = await db.query('SELECT * FROM admin_settings LIMIT 1');
    const [contacts] = await db.query('SELECT * FROM contact_detail LIMIT 1');
    const setting = settings[0] || {};
    const contact = contacts[0] || {};

    const mpinStatus = (setting.mpin_status !== undefined && setting.mpin_status !== null) ? String(setting.mpin_status) : '1';
    const sliderStatus = (setting.slider_status !== undefined && setting.slider_status !== null) ? String(setting.slider_status) : '1';
    const referralStatus = (setting.referral_status !== undefined && setting.referral_status !== null) ? String(setting.referral_status) : '1';
    const offerStatus = (setting.offer_status !== undefined && setting.offer_status !== null) ? String(setting.offer_status) : '1';
    const adStatus = (setting.ad_status !== undefined && setting.ad_status !== null) ? String(setting.ad_status) : '1';
    const popupStatus = (setting.popup_status !== undefined && setting.popup_status !== null) ? String(setting.popup_status) : '1';

    let sliders = [];
    if (sliderStatus === '1') {
      try {
        const [rows] = await db.query("SELECT * FROM slider_images WHERE status = '1' ORDER BY display_order ASC, id DESC");
        sliders = rows;
      } catch (e) {
        sliders = [];
      }
    }

    const appSettingObj = {
      app_name: setting.app_link && !setting.app_link.startsWith('http') ? setting.app_link : 'Bhau Matka',
      mobile_number: contact.mobile || setting.mobile || '',
      whatsapp_number: contact.wp_mobile || contact.mobile || setting.whatsapp || '',
      home_text: setting.alert_message || setting.home_text || '',
      alert_message: setting.alert_message || '',
      app_link: setting.app_link || '',
      app_version: setting.app_version || '1.0.0',
      need_update: setting.need_update || 'No',
      under_maintenance: setting.under_maintenance || 'No',
      message: setting.alert_message || '',
      privacyPolicy: setting.privacy_policy || '',
      telegram_link: setting.telegram_link || '',
      qr_code: setting.payment_barcode_image || '',
      google_pay: setting.gpay_upi || '',
      upi_payment: setting.upi_payment_id || setting.payment_upi_id || '',
      upi_payment_id: setting.upi_payment_id || setting.payment_upi_id || '',
      payment_upi_id: setting.upi_payment_id || setting.payment_upi_id || '',
      upi_name: setting.upi_name || 'Bhau Matka',
      mpin_status: mpinStatus,
      slider_status: sliderStatus,
      referral_status: referralStatus,
      offer_status: offerStatus,
      offer_title: setting.offer_title !== undefined && setting.offer_title !== null ? setting.offer_title : '',
      offer_description: setting.offer_description !== undefined && setting.offer_description !== null ? setting.offer_description : '',
      offer_image: setting.offer_image || '',
      offer_btn_text: setting.offer_btn_text || 'पैसे जोड़ें',
      offer_btn_action: setting.offer_btn_action || 'deposit',
      ad_status: adStatus,
      ad_title: setting.ad_title || '',
      ad_description: setting.ad_description || '',
      ad_image: setting.ad_image || '',
      ad_link: setting.ad_link || '',
      popup_status: popupStatus,
      popup_title: setting.popup_title || 'विशेष सूचना',
      popup_message: setting.popup_message || '',
      popup_image: setting.popup_image || '',
      popup_btn_text: setting.popup_btn_text || 'आगे बढ़ें',
      popup_btn_action: setting.popup_btn_action || 'dismiss',
      min_withdrawal: setting.min_withdrawal || '1000',
      max_withdrawal: setting.max_withdrawal || '50000',
      min_deposite: setting.min_deposite || '100',
      max_deposite: setting.max_deposite || '100000',
      min_bid_amt: setting.min_bid_amt || '10',
      max_bid_amt: setting.max_bid_amt || '50000',
      withdraw_open_time: setting.withdraw_open_time || '09:00',
      withdraw_close_time: setting.withdraw_close_time || '21:00',
      withdrawal_start_time: setting.withdraw_open_time || '09:00',
      withdrawal_end_time: setting.withdraw_close_time || '21:00',
      how_to_play: setting.how_to_play || '',
      content: setting.content || '',
      share_message: setting.content || `Play and win with Bhau Matka! Download now: ${setting.app_link || ''}`,
      contact_email: contact.email || contact.alt_email || 'info@admin.com',
      email: contact.email || contact.alt_email || 'info@admin.com',
      contact_address: contact.address || '',
      address: contact.address || '',
      landline: contact.landline || '',
      facebook: contact.facebook || '',
      twitter: contact.twitter || '',
      youtube: contact.youtube || '',
      instagram: contact.instagram || '',
      sliders: sliders
    };

    return res.json({
      status: true,
      success: '1',
      data: {
        app_setting: appSettingObj,
        amount_setting: appSettingObj,
        ...appSettingObj
      }
    });
  } catch (err) {
    return res.status(500).json({ status: false, success: '0', error: err.message });
  }
});

// Notifications & Notices endpoint (Dynamic from DB)
router.get('/notifications', async (req, res) => {
  try {
    const db = require('../config/db');
    const [settings] = await db.query('SELECT * FROM admin_settings LIMIT 1');
    const setting = settings[0] || {};

    const list = [];
    let idCounter = 1;

    // 1. Admin Alert Message
    if (setting.alert_message || setting.home_text) {
      list.push({
        id: String(idCounter++),
        tag: '#NOTICE',
        title: 'NOTICE BOARD',
        message: setting.alert_message || setting.home_text,
        date: new Date().toISOString()
      });
    }

    // 2. Admin Popup Notice
    if (setting.popup_status === '1' && (setting.popup_title || setting.popup_message)) {
      list.push({
        id: String(idCounter++),
        tag: '#ALERT',
        title: setting.popup_title || 'IMPORTANT NOTICE',
        message: setting.popup_message || '',
        date: new Date().toISOString()
      });
    }

    // 3. Special Offer Announcement
    if (setting.offer_status === '1' && (setting.offer_title || setting.offer_description)) {
      list.push({
        id: String(idCounter++),
        tag: '#OFFER',
        title: setting.offer_title || 'SPECIAL OFFER',
        message: setting.offer_description || 'Check out our latest exciting deposit offer!',
        date: new Date().toISOString()
      });
    }

    // 4. Live Recent Winner Highlights from DB
    try {
      const [recentWins] = await db.query(
        "SELECT game_name, winning_points, points_action, date FROM user_winning_report ORDER BY id DESC LIMIT 5"
      );
      recentWins.forEach((w) => {
        list.push({
          id: String(idCounter++),
          tag: '#WINNER',
          title: 'WINNER HIGHLIGHT',
          message: `Player won ₹${Number(w.winning_points || 0).toLocaleString('en-IN')} in ${w.game_name || 'Market'}!`,
          date: w.date || new Date().toISOString()
        });
      });
    } catch (e) {}

    return res.json({ success: '1', data: list, result: list });
  } catch (err) {
    return res.status(500).json({ success: '0', error: err.message });
  }
});

router.get('/notices', (req, res) => res.redirect('/api/notifications'));

// Dedicated How To Play endpoint
router.get('/how-to-play', async (req, res) => {
  try {
    const db = require('../config/db');
    const [settings] = await db.query('SELECT how_to_play FROM admin_settings LIMIT 1');
    const howToPlay = settings[0]?.how_to_play || '';
    return res.json({ success: '1', data: { how_to_play: howToPlay } });
  } catch (err) {
    return res.status(500).json({ success: '0', error: err.message });
  }
});

// Dedicated Contact Details endpoint
router.get('/contact-us', async (req, res) => {
  try {
    const db = require('../config/db');
    const [contacts] = await db.query('SELECT * FROM contact_detail LIMIT 1');
    return res.json({ success: '1', data: contacts[0] || {} });
  } catch (err) {
    return res.status(500).json({ success: '0', error: err.message });
  }
});

router.get('/settings/app-setting', (req, res) => res.redirect('/api/app-setting'));
router.get('/settings/amount-setting', (req, res) => res.redirect('/api/app-setting'));

// Public Sliders endpoint
router.get('/sliders', async (req, res) => {
  try {
    const db = require('../config/db');
    const [settings] = await db.query('SELECT slider_status FROM admin_settings LIMIT 1');
    const sliderStatus = (settings.length > 0 && settings[0].slider_status !== undefined && settings[0].slider_status !== null) ? String(settings[0].slider_status) : '1';

    if (sliderStatus === '0') {
      return res.json({ status: true, success: '1', slider_status: '0', data: [] });
    }

    const [rows] = await db.query("SELECT * FROM slider_images WHERE status = '1' ORDER BY display_order ASC, id DESC");
    return res.json({ status: true, success: '1', slider_status: '1', data: rows, result: rows });
  } catch (err) {
    return res.status(500).json({ success: '0', error: err.message });
  }
});

router.get('/slider/get-slider', (req, res) => res.redirect('/api/sliders'));

// Auth endpoints
router.post('/signup', authController.signup);
router.post('/auth/register', authController.signup);
router.post('/authController/signup', authController.signup);

router.post('/login', authController.login);
router.post('/auth/login', authController.login);
router.post('/authController/login', authController.login);

router.post('/send-otp', authController.sendOtp);
router.post('/auth/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/auth/verify-otp', authController.verifyOtp);

router.post('/verify-mpin', verifyToken, authController.verifyMpin);
router.post('/forgot-password', authController.changeMpin);
router.post('/authController/forgot-password', authController.changeMpin);

// Profile endpoints (Protected)
router.get('/profile', verifyToken, authController.getProfile);
router.get('/user/profile', verifyToken, authController.getProfile);
router.get('/authController/get_profile', verifyToken, authController.getProfile);
router.get('/bank/get-bank', verifyToken, authController.getProfile);

router.post('/profile/update', verifyToken, authController.editProfile);
router.post('/edit_profile.php', verifyToken, authController.editProfile);
router.post('/authController/edit_profile', verifyToken, authController.editProfile);
router.post('/bank/update-bank', verifyToken, authController.editProfile);
router.post('/bank/update-upi', verifyToken, authController.editProfile);
router.post('/update_bank.php', verifyToken, authController.editProfile);
router.post('/add_bank.php', verifyToken, authController.editProfile);

router.post('/profile/change-mpin', verifyToken, authController.changeMpin);
router.post('/change_password.php', verifyToken, authController.changeMpin);
router.post('/authController/change_password', verifyToken, authController.changeMpin);

// Game endpoints (Public market listings & rates, Protected bids & history)
router.get('/games', gameController.getGames);
router.get('/get_games.php', gameController.getGames);
router.get('/market/get-kalyan-market', gameController.getGames);

router.get('/game-types', gameController.getGameTypes);
router.get('/games/types', gameController.getGameTypes);
router.get('/game/get-game-type', gameController.getGameTypes);
router.get('/get_game_type.php', gameController.getGameTypes);

router.get('/games/rates', gameController.getRates);
router.get('/game/get-game-rate', gameController.getRates);
router.get('/get_rates.php', gameController.getRates);

router.post('/games/bid', verifyToken, gameController.placeBid);
router.post('/bid/bet-place', verifyToken, gameController.placeBid);
router.post('/set_bid_new.php', verifyToken, gameController.placeBid);

router.get('/games/bid-history', verifyToken, gameController.getBidHistory);
router.post('/games/bid-history', verifyToken, gameController.getBidHistory);
router.get('/bid/get-bid-history', verifyToken, gameController.getBidHistory);
router.post('/bid/get-bid-history', verifyToken, gameController.getBidHistory);
router.get('/get_bid_history.php', verifyToken, gameController.getBidHistory);
router.post('/get_bid_history.php', verifyToken, gameController.getBidHistory);

router.get('/games/win-history', verifyToken, gameController.getWinReport);
router.post('/games/win-history', verifyToken, gameController.getWinReport);
router.get('/bid/get-winning-history', verifyToken, gameController.getWinReport);
router.post('/bid/get-winning-history', verifyToken, gameController.getWinReport);
router.get('/get_win_report.php', verifyToken, gameController.getWinReport);
router.post('/get_win_report.php', verifyToken, gameController.getWinReport);

router.get('/games/chart', gameController.getGameChart);
router.get('/game/get-game-chart', gameController.getGameChart);
router.get('/get_game_chart.php', gameController.getGameChart);

// Wallet & Transactions endpoints (Protected)
router.get('/wallet/info', verifyToken, walletController.getWalletInfo);
router.get('/user/wallet', verifyToken, walletController.getWalletInfo);
router.get('/get_wallet.php', verifyToken, walletController.getWalletInfo);

router.post('/wallet/fund-request', verifyToken, walletController.submitFundRequest);
router.post('/wallet/add-amount', verifyToken, walletController.submitFundRequest);
router.post('/add_amount.php', verifyToken, walletController.submitFundRequest);

router.post('/wallet/withdraw-request', verifyToken, walletController.submitWithdrawRequest);
router.post('/wallet/send-withdraw', verifyToken, walletController.submitWithdrawRequest);
router.post('/withdraw_request.php', verifyToken, walletController.submitWithdrawRequest);

router.get('/wallet/history', verifyToken, walletController.getWalletHistory);
router.post('/wallet/history', verifyToken, walletController.getWalletHistory);
router.get('/wallet/get-wallet-history', verifyToken, walletController.getWalletHistory);
router.post('/wallet/get-wallet-history', verifyToken, walletController.getWalletHistory);
router.get('/get_wallet_history.php', verifyToken, walletController.getWalletHistory);
router.post('/get_wallet_history.php', verifyToken, walletController.getWalletHistory);

router.get('/wallet/withdraw-history', verifyToken, walletController.getWithdrawHistory);
router.post('/wallet/withdraw-history', verifyToken, walletController.getWithdrawHistory);
router.get('/withdraw/get-withdraw-list', verifyToken, walletController.getWithdrawHistory);
router.post('/withdraw/get-withdraw-list', verifyToken, walletController.getWithdrawHistory);
router.get('/get_request_history.php', verifyToken, walletController.getWithdrawHistory);
router.post('/get_request_history.php', verifyToken, walletController.getWithdrawHistory);

router.get('/wallet/deposit-requests', verifyToken, walletController.getDepositRequestStatus);
router.post('/wallet/deposit-requests', verifyToken, walletController.getDepositRequestStatus);
router.get('/wallet/get-deposit-history', verifyToken, walletController.getDepositRequestStatus);
router.post('/wallet/get-deposit-history', verifyToken, walletController.getDepositRequestStatus);
router.get('/get_deposit_history.php', verifyToken, walletController.getDepositRequestStatus);
router.post('/get_deposit_history.php', verifyToken, walletController.getDepositRequestStatus);
router.get('/wallet/recent-deposits', walletController.getRecentDepositsFeed);

// Real-time Support Chat Endpoints
const supportChatController = require('../controllers/supportChatController');
router.get('/support/history', supportChatController.getChatHistory);
router.get('/support/history/:room_id', supportChatController.getChatHistory);
router.post('/support/send', supportChatController.saveMessage);
router.post('/support/upload', supportChatController.uploadMiddleware, supportChatController.uploadAttachment);
router.post('/support/mark-read', supportChatController.markAsRead);
router.get('/support/conversations', supportChatController.getConversationsList);
router.get('/support/users', supportChatController.getConversationsList);
// Gali Desawar User & Mobile Endpoints
const galiDesawarController = require('../controllers/galiDesawarController');
router.get('/gali-desawar/games', galiDesawarController.getUserGames);
router.get('/gali-desawar/rates', galiDesawarController.getGaliRates);
router.post('/gali-desawar/place-bid', verifyToken, galiDesawarController.placeUserBid);
router.get('/gali-desawar/bid-history', verifyToken, galiDesawarController.getUserBidHistory);
router.get('/gali-desawar/win-history', verifyToken, galiDesawarController.getUserWinHistory);

module.exports = router;
