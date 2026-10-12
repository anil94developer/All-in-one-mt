/* eslint-disable prettier/prettier */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { langague_change } from '../Language/languge';

export const STRINGS = {
  en: {
    // General
    cancel: 'Cancel',
    confirm: 'OK',
    prev: '← Prev',
    next: 'Next →',
    exit_confirm_title: 'Exit',
    exit_confirm_msg: 'Do you want to exit now?',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',

    // Home Action Cards
    add_money: 'Add Money',
    add_money_sub: 'Instant Add Money',
    withdraw: 'Withdraw',
    withdraw_sub: 'Get Instant Withdrawal',
    starline: 'Starline',
    starline_sub: 'Play Starline Market',
    gali_desawar: 'Gali Desawar',
    gali_desawar_sub: 'Play Disawar Market',

    // Home Ticker
    fast_deposit: 'FAST DEPOSIT',
    fast_withdrawal: 'FAST WITHDRAWAL',
    support_247: '24×7 SUPPORT',

    // Home Sections
    todays_markets: "TODAY'S MARKETS",
    view_all: 'View All ›',
    market_running: 'Market Running',
    market_closed: 'Market Closed',
    open_label: 'Open',
    close_label: 'Close',
    game_chart: 'Game Chart',

    // Bottom Navigation
    nav_my_bids: 'My Bids',
    nav_wallet: 'Wallet',
    nav_home: 'Home',
    nav_passbook: 'Passbook',
    nav_support: 'Support',

    // Bidding Closed Modal
    closed_title: 'Bidding is closed for today',
    open_pill: 'OPEN',
    close_pill: 'CLOSE',
    open_result_time: 'Open Result Time',
    open_bid_last: 'Open Bid Last Time',
    close_result_time: 'Close Result Time',
    close_bid_last: 'Close Bid Last Time',
    ok_btn: 'OK',

    // Drawer Menu
    drawer_home: 'Home',
    drawer_profile: 'Profile',
    drawer_game_rate: 'Game Rate',
    drawer_win_history: 'Win History',
    drawer_bid_history: 'Bid History',
    drawer_charts: 'Market Charts',
    drawer_funds: 'Funds',
    drawer_notice: 'Notice Board',
    drawer_language: 'Language',
    drawer_share: 'Share App',
    drawer_contact: 'Contact Us',
    drawer_how_to_play: 'How to Play',
    drawer_logout: 'Logout',

    // Passbook Screen
    passbook_title: 'Passbook',
    tab_all: 'All',
    tab_credit: 'Deposit',
    tab_debit: 'Withdrawal',
    no_data_found: 'No data found',

    // Wallet / Funds Screen
    funds_title: 'Funds',
    add_funds_title: 'Add Funds',
    add_funds_sub: 'Instantly add money to wallet',
    withdraw_funds_title: 'Withdraw',
    withdraw_funds_sub: 'Request withdrawal winnings',
    bank_detail_title: 'Bank Detail',
    bank_detail_sub: 'Manage bank for withdrawals',
    add_history_title: 'Add Fund History',
    add_history_sub: 'Recharge and deposit records',
    withdraw_history_title: 'Withdraw Fund History',
    withdraw_history_sub: 'Pending and success requests',

    // Market Rate Screen
    market_rate_title: 'Game Rate',
    single_digit: 'Single Digit',
    jodi_digit: 'Jodi Digit',
    single_pana: 'Single Pana',
    double_pana: 'Double Pana',
    triple_pana: 'Triple Pana',
    half_sangam: 'Half Sangam',
    full_sangam: 'Full Sangam',
    sp: 'Single Pana',
    dp: 'Double Pana',
    tp: 'Triple Pana',
    single: 'Single',
    jodi: 'Jodi',
    red_bracket: 'Red Bracket',
    cycle_pana: 'Cycle Pana',
    motor_pana: 'Motor Pana',
    sp_motor: 'SP Motor',
    dp_motor: 'DP Motor',
    tp_motor: 'TP Motor',
    family_pana: 'Family Pana',

    // Win History Screen
    win_history_title: 'Win History',
    no_winnings_found: 'No winning history found',

    // Notice Screen
    notice_title: 'Notice Board',

    // Bank Details Screen
    bank_manage_title: 'Bank & UPI Details',
    kyc_access: 'KYC & BANK ACCESS',
    primary_bank: 'PRIMARY BANK ACCOUNT',
    add_bank_btn: 'ADD NOW',
    edit_bank_btn: 'EDIT',
    upi_options: 'UPI OPTIONS',

    // Chart Screen
    charts_title: 'Market Charts',
    main_charts: 'Main Market Chart',
    starline_charts: 'Starline Chart',
    gali_charts: 'Gali Desawar Chart',

    // How To Play Screen
    how_to_play_title: 'How to Play',
    htp_intro_title: 'How to Use',
    htp_intro_body: 'Here you can view general information regarding Bids, Wallet, Add Money, Withdrawal and your History.',
    htp_bid_title: '1. Bid Information',
    htp_bid_body: 'A bid is an entry made according to available game rules. Verify selected game, date, time and applicable rules before submission.',
    htp_result_title: '2. Result & Winning',
    htp_result_body: 'Results are declared according to game timetable. Winning amounts are credited directly to your wallet as per platform rules.',
    htp_deposit_title: '3. Add Money',
    htp_deposit_body: 'Minimum deposit is ₹100. Money is added instantly to your wallet via UPI.',
    htp_history_title: '5. Bid & Win History',
    htp_history_body: 'Check your submitted bids in Bid History and winning records in Win History.',

    // Profile Screen
    profile_title: 'Profile',
    edit_profile: 'Edit Profile',
    change_password: 'Change Password',
    select_language: 'Language',
    notifications: 'Notifications',
    logout: 'Logout',

    // Withdraw Screen
    withdraw_title: 'Withdraw Funds',
    request_withdrawal: 'Request Withdrawal',
    amount_label: 'Amount (₹):',
    amount_placeholder: 'Enter amount',
    method_label: 'Method:',
    submit_withdrawal: 'SUBMIT WITHDRAWAL',
    select_method: 'Select Method',

    // Contact Us Screen
    contact_title: 'Contact Us',
    contact_sub: 'We usually respond within a few minutes',
    phone_call: 'Phone Call',
    telegram: 'Telegram',
    whatsapp: 'Whatsapp',
    chat_us: 'Chat Us',

    // Bid History Screen
    bids_title: 'My Bids',
    no_bids_found: 'No Bids Found',
    select_date: 'Select Date',

    // Auth Screens
    login_title: 'Login',
    signup_title: 'Sign Up',
    phone_placeholder: 'Mobile Number',
    password_placeholder: 'Password',
    forgot_password: 'Forgot Password?',
    dont_have_account: "Don't have an account?",
    already_have_account: 'Already have an account?',

    // Select Language Screen
    select_language_title: 'Select Language',
    next_btn: 'Next',

    // Add Fund Screen
    add_fund_header: 'Add Funds',
    current_balance: 'Current Balance',
    enter_amount: 'Enter Amount',
    select_upi_app: 'Select UPI App',
    pay_now: 'Pay Now',
    people_active_now: 'People Active Now',
    recent_add_money: 'Recent Add Money',
    amount_added: 'Amount added',
    please_enter_amount: 'Please enter amount',
    deposit_success: 'Amount added to wallet successfully.',

    // Contact Us Screen
    support_title: 'Support',
    support_chat_welcome: 'Hello! How can we help you? Send your question or query here.',
    type_message: 'Type a message...',

    // Notice Screen
    admin_update_title: 'Admin Updates',
    admin_update_sub: 'Showing latest admin notifications',

    // Market Rate Screen
    play_type_header: 'PLAY TYPE',
    payout_header: 'PAYOUT ₹10',
    wins_header: '₹10 WINS',

    // Game Screen
    play_game: 'Play Game',
    market_closed_msg: 'Market is closed',

    // Bid Screen
    open_bid: 'Open Bid',
    close_bid: 'Close Bid',
    digits_pana: 'Digits / Pana',
    bid_amount: 'Bid Amount',
    add_bid: 'Add Bid',
    submit_bid: 'Submit Bid',
    no_bids_for_date: 'No bid records available for this date',

    // Bank Details & Add Bank
    add_bank_title: 'Add Bank',
    account_holder_name: 'Account Holder Name',
    enter_account_holder: 'Enter Account Holder Name',
    account_number: 'Account Number',
    enter_account_number: 'Enter Account Number',
    confirm_account_number: 'Confirm Account Number',
    enter_confirm_account: 'Enter Confirm Account Number',
    ifsc_code: 'IFSC Code',
    enter_ifsc: 'Enter IFSC Code',
    bank_name: 'Bank Name',
    enter_bank_name: 'Enter Bank Name',
    branch_address: 'Branch Address',
    enter_branch_address: 'Enter Branch Address',
    submit: 'Submit',

    // Fund Transfer
    fund_transfer_title: 'Fund Transfer',
    transfer_amount: 'Transfer Amount',
    enter_transfer_amount: 'Enter Transfer Amount',
    receiver_phone: 'Receiver Mobile Number',

    // Profile Screen
    settings: 'Settings',
    username_label: 'Username',
    enter_username: 'Enter Username',
    update_and_save: 'Update & Save',
    email_label: 'Email',

    // Auth Screens
    welcome_back: 'Welcome Back',
    login_continue: 'Login to your account to continue',
    phone_label: 'Phone Number',
    password_label: 'Password',
    remember_me: 'Remember Me',
    create_account: 'Create Account',
    signup_get_started: 'Sign up to get started',
    referral_code_optional: 'Referral Code (Optional)',
    register_btn: 'Register',

    // Tabs
    tabs_home: '',
    tabs_inventory: 'Inventory',
    tabs_quotes: 'Quotes',
    tabs_notify: 'Notify Center',
    tabs_profile: 'Profile',

    // Added Dynamic Keys
    result_chart: "Result Chart",
    mobile_number: "Mobile Number",
    special_offer: "Special Offer",
    wallet_balance: "Wallet Balance",
    bonus_note: "Claim best offer and play games",
    special_notice: "Special Notice",
    popup_default_msg: "Always ready to serve you!",
    profile_settings: "Profile Settings",
    account_security: "Account Security",
    pwd_change_title: "Change Password",
    pwd_current_label: "Current Password",
    pwd_new_label: "New Password",
    pwd_confirm_label: "Confirm New Password",
    pwd_current_required: "Current password is required.",
    pwd_new_required: "New password is required.",
    pwd_min_chars: "New password must be at least 6 characters.",
    pwd_confirm_required: "Confirm password is required.",
    pwd_mismatch: "Passwords do not match.",
    pwd_updated_success: "Your password has been updated successfully.",
    pwd_security_desc: "Protect your account by updating your password regularly.",
    pwd_update_btn: "UPDATE PASSWORD",
    left_digit: "Left Digit",
    right_digit: "Right Digit",
    single_digit_bulk: "Single Digit Bulk",
    htp_bank_title: "6. Bank & UPI",
    htp_bank_body: "Keep your Bank Account and UPI info verified. Always use payment accounts registered in your own name.",
    htp_important_title: "7. Important Information",
    htp_important_body: "Use this service only if permitted in your location. Follow all applicable laws and platform rules.",
    htp_footer_note: "Please read the applicable rules carefully before using the service.",
    place_bet: "Place Bet",
    bid_points: "Bid Points",
    enter_points: "Enter Points",
    bid_list: "BID LIST",
    no_bids_added: "No bids added yet",
    digit: "Digit",
    points: "Points",
    bids_count_label: "BIDS",
    total_label: "TOTAL",
    session: "Session",
    remove: "Remove",
    digit_pana: "Digit/Pana",
    account_blocked_msg: "Sorry, your account is blocked",
    delete: "Delete",
    enter_digit: "Enter Digits",
    enter_pana: "Enter Pana",
    pana: "Pana",
    type: "Type",

  },

  hi: {
    // General
    cancel: 'रद्द करें',
    confirm: 'ठीक है',
    prev: '← पिछला',
    next: 'आगे →',
    exit_confirm_title: 'छोड़ें',
    exit_confirm_msg: 'क्या आप अभी बाहर निकलना चाहते हैं?',
    yes: 'हाँ',
    no: 'नहीं',
    save: 'सहेजें',
    edit: 'बदलें',
    add: 'जोड़ें',
    close: 'बंद करें',
    error: 'त्रुटि',
    success: 'सफल',
    loading: 'लोड हो रहा है...',

    // Home Action Cards
    add_money: 'पैसे जोड़ें',
    add_money_sub: 'तुरंत पैसे जोड़ें',
    withdraw: 'पैसे निकालें',
    withdraw_sub: 'तुरंत निकासी पाएं',
    starline: 'स्टारलाइन',
    starline_sub: 'स्टारलाइन खेलें',
    gali_desawar: 'गली देसावर',
    gali_desawar_sub: 'देसावर खेलें',

    // Home Ticker
    fast_deposit: 'फास्ट डिपॉजिट',
    fast_withdrawal: 'फास्ट विथड्रॉल',
    support_247: '24×7 सपोर्ट',

    // Home Sections
    todays_markets: 'आज के मार्केट्स',
    view_all: 'सभी देखें ›',
    market_running: 'मार्केट चालू है',
    market_closed: 'मार्केट बंद है',
    open_label: 'ओपन',
    close_label: 'क्लोज',
    game_chart: 'गेम चार्ट',

    // Bottom Navigation
    nav_my_bids: 'मेरी बिड्स',
    nav_wallet: 'वॉलेट',
    nav_home: 'होम',
    nav_passbook: 'पासबुक',
    nav_support: 'सपोर्ट',

    // Bidding Closed Modal
    closed_title: 'आज के लिए बिडिंग बंद है',
    open_pill: 'ओपन',
    close_pill: 'क्लोज',
    open_result_time: 'ओपन रिजल्ट समय',
    open_bid_last: 'ओपन बिड अंतिम समय',
    close_result_time: 'क्लोज रिजल्ट समय',
    close_bid_last: 'क्लोज बिड अंतिम समय',
    ok_btn: 'ठीक है',

    // Drawer Menu
    drawer_home: 'होम',
    drawer_profile: 'प्रोफ़ाइल',
    drawer_game_rate: 'खेल की दर',
    drawer_win_history: 'जीत का इतिहास',
    drawer_bid_history: 'बिड इतिहास',
    drawer_charts: 'मार्केट चार्ट्स',
    drawer_funds: 'फंड्स',
    drawer_notice: 'सूचनाएं',
    drawer_language: 'भाषा',
    drawer_share: 'ऐप शेयर करें',
    drawer_contact: 'संपर्क करें',
    drawer_how_to_play: 'कैसे उपयोग करें',
    drawer_logout: 'लॉगआउट',

    // Passbook Screen
    passbook_title: 'पासबुक',
    tab_all: 'सभी',
    tab_credit: 'जमा (क्रेडिट)',
    tab_debit: 'निकासी (डेबिट)',
    no_data_found: 'कोई डेटा नहीं मिला',

    // Wallet / Funds Screen
    funds_title: 'फंड्स',
    add_funds_title: 'पैसे जोड़ें',
    add_funds_sub: 'तुरंत वॉलेट में पैसे जोड़ें',
    withdraw_funds_title: 'पैसे निकालें',
    withdraw_funds_sub: 'जीती हुई राशि निकालें',
    bank_detail_title: 'बैंक विवरण',
    bank_detail_sub: 'निकासी के लिए बैंक प्रबंधित करें',
    add_history_title: 'जमा इतिहास',
    add_history_sub: 'रीचार्ज व जमा रिकॉर्ड्स',
    withdraw_history_title: 'निकासी इतिहास',
    withdraw_history_sub: 'निकासी अनुरोध रिकॉर्ड्स',

    // Market Rate Screen
    market_rate_title: 'खेल की दर',
    single_digit: 'सिंगल डिजिट',
    jodi_digit: 'जोड़ी डिजिट',
    single_pana: 'सिंगल पाना',
    double_pana: 'डबल पाना',
    triple_pana: 'ट्रिपल पाना',
    half_sangam: 'हाफ संगम',
    full_sangam: 'फुल संगम',
    sp: 'सिंगल पाना',
    dp: 'डबल पाना',
    tp: 'ट्रिपल पाना',
    single: 'सिंगल',
    jodi: 'जोड़ी',
    red_bracket: 'रेड ब्रैकेट',
    cycle_pana: 'साइकिल पाना',
    motor_pana: 'मोटर पाना',
    sp_motor: 'एसपी मोटर',
    dp_motor: 'डीपी मोटर',
    tp_motor: 'टीपी मोटर',
    family_pana: 'फैमिली पाना',

    // Win History Screen
    win_history_title: 'जीत का इतिहास',
    no_winnings_found: 'कोई जीत रिकॉर्ड नहीं मिला',

    // Notice Screen
    notice_title: 'सूचनाएं',

    // Bank Details Screen
    bank_manage_title: 'बैंक व यूपीआई विवरण',
    kyc_access: 'बैंक और केवाईसी',
    primary_bank: 'प्राथमिक बैंक खाता',
    add_bank_btn: 'जोड़ें',
    edit_bank_btn: 'बदलें',
    upi_options: 'यूपीआई विकल्प',

    // Chart Screen
    charts_title: 'मार्केट चार्ट्स',
    main_charts: 'मेन मार्केट चार्ट',
    starline_charts: 'स्टारलाइन चार्ट',
    gali_charts: 'गली देसावर चार्ट',

    // How To Play Screen
    how_to_play_title: 'कैसे उपयोग करें',
    htp_intro_title: 'कैसे उपयोग करें',
    htp_intro_body: 'यहाँ आप Bid, Wallet, Add Money, Withdrawal और अपनी History से जुड़ी सामान्य जानकारी देख सकते हैं।',
    htp_bid_title: '1. Bid की जानकारी',
    htp_bid_body: 'Bid उपलब्ध game rules के अनुसार की गई एक entry होती है। Submit करने से पहले selected game, date, time और लागू rules को ध्यान से देखें।',
    htp_result_title: '2. Result और Winning',
    htp_result_body: 'Result निर्धारित game schedule और लागू rules के अनुसार प्रकाशित होते हैं। यदि कोई winning amount लागू होती है, तो उसका processing platform के applicable rules के अनुसार किया जाता है।',
    htp_deposit_title: '3. Add Money',
    htp_deposit_body: 'Minimum Deposit: ₹100. UPI के ज़रिए तुरंत पैसे वॉलेट में जुड़ जाते हैं।',
    htp_history_title: '5. Bid & Win History',
    htp_history_body: 'आप Bid History में अपनी submitted bid records देख सकते हैं। Result और applicable winning records को Win History में देखा जा सकता है।',

    // Profile Screen
    profile_title: 'प्रोफ़ाइल',
    edit_profile: 'प्रोफ़ाइल बदलें',
    change_password: 'पासवर्ड बदलें',
    select_language: 'भाषा',
    notifications: 'सूचनाएं',
    logout: 'लॉगआउट',

    // Withdraw Screen
    withdraw_title: 'फंड निकालें',
    request_withdrawal: 'निकासी अनुरोध',
    amount_label: 'राशि (₹):',
    amount_placeholder: 'राशि दर्ज करें',
    method_label: 'भुगतान तरीका:',
    submit_withdrawal: 'निकासी अनुरोध भेजें',
    select_method: 'तरीका चुनें',

    // Contact Us Screen
    contact_title: 'संपर्क करें',
    contact_sub: 'हम आमतौर पर कुछ ही मिनटों में जवाब देते हैं',
    phone_call: 'फ़ोन कॉल',
    telegram: 'टेलीग्राम',
    whatsapp: 'व्हाट्सएप',
    chat_us: 'चैट करें',

    // Bid History Screen
    bids_title: 'मेरी बिड्स',
    no_bids_found: 'कोई बिड्स नहीं मिलीं',
    select_date: 'तारीख चुनें',

    // Auth Screens
    login_title: 'लॉग इन करें',
    signup_title: 'साइन अप करें',
    phone_placeholder: 'मोबाइल नंबर',
    password_placeholder: 'पासवर्ड',
    forgot_password: 'पासवर्ड भूल गए?',
    dont_have_account: 'क्या आपका खाता नहीं है?',
    already_have_account: 'पहले से खाता है?',

    // Select Language Screen
    select_language_title: 'भाषा चुनें',
    next_btn: 'आगे',

    // Add Fund Screen
    add_fund_header: 'फंड जोड़ें',
    current_balance: 'वर्तमान शेष',
    enter_amount: 'राशि दर्ज करें',
    select_upi_app: 'UPI ऐप चुनें',
    pay_now: 'अभी भुगतान करें',
    people_active_now: 'लोग सक्रिय हैं',
    recent_add_money: 'हाल ही में जोड़े गए पैसे',
    amount_added: 'राशि जोड़ी गई',
    please_enter_amount: 'कृपया राशि दर्ज करें',
    deposit_success: 'वॉलेट में राशि सफलतापूर्वक जोड़ी गई।',

    // Contact Us Screen
    support_title: 'सपोर्ट',
    support_chat_welcome: 'नमस्ते! हम आपकी क्या सहायता कर सकते हैं? हमें अपना प्रश्न या समस्या यहाँ लिख कर भेजें।',
    type_message: 'संदेश टाइप करें...',

    // Notice Screen
    admin_update_title: 'नवीनतम एडमिन अपडेट',
    admin_update_sub: 'नवीनतम एडमिन नोटिफिकेशन दिखाए जा रहे हैं',

    // Market Rate Screen
    play_type_header: 'खेल प्रकार',
    payout_header: 'पेआउट ₹10',
    wins_header: '₹10 जीत',

    // Game Screen
    play_game: 'गेम खेलें',
    market_closed_msg: 'मार्केट बंद है',

    // Bid Screen
    open_bid: 'ओपन बिड',
    close_bid: 'क्लोज बिड',
    digits_pana: 'अंक / पाना',
    bid_amount: 'बिड राशि',
    add_bid: 'बिड जोड़ें',
    submit_bid: 'बिड सबमिट करें',
    no_bids_for_date: 'के लिए कोई बिड रिकॉर्ड उपलब्ध नहीं है।',

    // Bank Details & Add Bank
    add_bank_title: 'बैंक जोड़ें',
    account_holder_name: 'खाताधारक का नाम',
    enter_account_holder: 'खाताधारक का नाम दर्ज करें',
    account_number: 'खाता संख्या',
    enter_account_number: 'खाता संख्या दर्ज करें',
    confirm_account_number: 'खाता संख्या की पुष्टि करें',
    enter_confirm_account: 'पुष्टि के लिए खाता संख्या फिर से दर्ज करें',
    ifsc_code: 'IFSC कोड',
    enter_ifsc: 'IFSC कोड दर्ज करें',
    bank_name: 'बैंक का नाम',
    enter_bank_name: 'बैंक का नाम दर्ज करें',
    branch_address: 'शाखा का पता',
    enter_branch_address: 'शाखा का पता दर्ज करें',
    submit: 'सबमिट करें',

    // Fund Transfer
    fund_transfer_title: 'फंड ट्रांसफर',
    transfer_amount: 'ट्रांसफर राशि',
    enter_transfer_amount: 'राशि दर्ज करें',
    receiver_phone: 'प्राप्तकर्ता का मोबाइल नंबर',

    // Profile Screen
    settings: 'सेटिंग्स',
    username_label: 'यूज़रनेम',
    enter_username: 'यूज़रनेम दर्ज करें',
    update_and_save: 'अपडेट करें और सेव करें',
    email_label: 'ईमेल',

    // Auth Screens
    welcome_back: 'स्वागत है',
    login_continue: 'आगे बढ़ने के लिए अपने खाते में लॉग इन करें',
    phone_label: 'मोबाइल नंबर',
    password_label: 'पासवर्ड',
    remember_me: 'मुझे याद रखें',
    create_account: 'खाता बनाएं',
    signup_get_started: 'शुरू करने के लिए साइन अप करें',
    referral_code_optional: 'रेफरल कोड (वैकल्पिक)',
    register_btn: 'रजिस्टर करें',

    // Tabs
    tabs_home: 'होम',
    tabs_inventory: 'इन्वेंटरी',
    tabs_quotes: 'कोट्स',
    tabs_notify: 'सूचना केंद्र',
    tabs_profile: 'प्रोफ़ाइल',

    // Added Dynamic Keys
    result_chart: "रिजल्ट चार्ट",
    mobile_number: "मोबाइल नंबर",
    special_offer: "स्पेशल ऑफर",
    wallet_balance: "वॉलेट बैलेंस",
    bonus_note: "बेस्ट ऑफर का लाभ उठाएं और गेम खेलें",
    special_notice: "विशेष सूचना",
    popup_default_msg: "आपकी सेवा में सदैव तत्पर!",
    profile_settings: "प्रोफ़ाइल सेटिंग्स",
    account_security: "खाता सुरक्षा",
    pwd_change_title: "पासवर्ड बदलें",
    pwd_current_label: "वर्तमान पासवर्ड",
    pwd_new_label: "नया पासवर्ड",
    pwd_confirm_label: "नया पासवर्ड कन्फर्म करें",
    pwd_current_required: "कृपया अपना वर्तमान पासवर्ड दर्ज करें।",
    pwd_new_required: "कृपया नया पासवर्ड दर्ज करें।",
    pwd_min_chars: "नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
    pwd_confirm_required: "कृपया पासवर्ड की पुष्टि करें।",
    pwd_mismatch: "दोनों पासवर्ड मेल नहीं खाते।",
    pwd_updated_success: "पासवर्ड सफलतापूर्वक बदल दिया गया है।",
    pwd_security_desc: "नियमित रूप से पासवर्ड बदलकर अपने खाते को सुरक्षित रखें।",
    pwd_update_btn: "पासवर्ड अपडेट करें",
    left_digit: "लेफ्ट डिजिट",
    right_digit: "राइट डिजिट",
    single_digit_bulk: "सिंगल डिजिट बल्क",
    htp_bank_title: "6. बैंक और यूपीआई",
    htp_bank_body: "अपनी Bank Account और UPI information सही और verified रखें। केवल अपने नाम से जुड़े payment account का उपयोग करें।",
    htp_important_title: "7. महत्वपूर्ण जानकारी",
    htp_important_body: "इस service का उपयोग तभी करें जब आपके स्थान पर इसकी अनुमति हो। सभी लागू कानून, platform rules और age requirements का पालन करें।",
    htp_footer_note: "Service का उपयोग करने से पहले लागू rules को ध्यान से पढ़ें।",
    place_bet: "दांव लगाएं",
    bid_points: "बिड पॉइंट्स",
    enter_points: "पॉइंट्स दर्ज करें",
    bid_list: "बिड सूची",
    no_bids_added: "अभी तक कोई बिड नहीं जोड़ी गई",
    digit: "अंक",
    points: "पॉइंट्स",
    bids_count_label: "बिड्स",
    total_label: "कुल",
    session: "सत्र",
    remove: "हटाएं",
    digit_pana: "अंक/पाना",
    account_blocked_msg: "क्षमा करें, आपका खाता ब्लॉक है",
    delete: "हटाएं",
    enter_digit: "अंक दर्ज करें",
    enter_pana: "पाना दर्ज करें",
    pana: "पाना",
    type: "प्रकार",

  },

  gu: {
    // Gujarati
    cancel: 'રદ કરો',
    confirm: 'બરાબર',
    prev: '← પાછળ',
    next: 'આગળ →',
    exit_confirm_title: 'બહાર નીકળો',
    exit_confirm_msg: 'શું તમે બહાર નીકળવા માંગો છો?',
    yes: 'હા',
    no: 'ના',
    save: 'સાચવો',
    edit: 'બદલો',
    add: 'ઉમેરો',
    close: 'બંધ કરો',
    error: 'ભૂલ',
    success: 'સફળ',
    loading: 'લોડ થઈ રહ્યું છે...',

    add_money: 'પૈસા ઉમેરો',
    add_money_sub: 'ઝડપી પૈસા ઉમેરો',
    withdraw: 'પૈસા ઉપાડો',
    withdraw_sub: 'ઝડપી ઉપાડ મેળવો',
    starline: 'સ્ટારલાઇન',
    starline_sub: 'સ્ટારલાઇન રમો',
    gali_desawar: 'ગલી દેસાવર',
    gali_desawar_sub: 'દેસાવર રમો',

    fast_deposit: 'ઝડપી ડિપોઝિટ',
    fast_withdrawal: 'ઝડપી ઉપાડ',
    support_247: '24×7 સપોર્ટ',

    todays_markets: 'આજના માર્કેટ',
    view_all: 'બધા જુઓ ›',
    market_running: 'માર્કેટ ચાલુ છે',
    market_closed: 'માર્કેટ બંધ છે',
    open_label: 'ઓપન',
    close_label: 'ક્લોઝ',
    game_chart: 'ગેમ ચાર્ટ',

    nav_my_bids: 'મારી બિડ્સ',
    nav_wallet: 'વૉલેટ',
    nav_home: 'હોમ',
    nav_passbook: 'પાસબુક',
    nav_support: 'સપોર્ટ',

    closed_title: 'આજના માટે બિડિંગ બંધ છે',
    open_pill: 'ઓપન',
    close_pill: 'ક્લોઝ',
    open_result_time: 'ઓપન પરિણામ સમય',
    open_bid_last: 'ઓપન બિડ છેલ્લો સમય',
    close_result_time: 'ક્લોઝ પરિણામ સમય',
    close_bid_last: 'ક્લોઝ બિડ છેલ્લો સમય',
    ok_btn: 'બરાબર',

    drawer_home: 'હોમ',
    drawer_profile: 'પ્રોફાઇલ',
    drawer_game_rate: 'ગેમ રેટ',
    drawer_win_history: 'જીતનો ઇતિહાસ',
    drawer_bid_history: 'બિડ ઇતિહાસ',
    drawer_charts: 'માર્કેટ ચાર્ટ્સ',
    drawer_funds: 'ફંડ્સ',
    drawer_notice: 'નોટિસ બોર્ડ',
    drawer_language: 'ભાષા',
    drawer_share: 'એપ શેર કરો',
    drawer_contact: 'સંપર્ક કરો',
    drawer_how_to_play: 'કેવી રીતે રમવું',
    drawer_logout: 'લૉગઆઉટ',

    passbook_title: 'પાસબુક',
    tab_all: 'બધા',
    tab_credit: 'જમા',
    tab_debit: 'ઉપાડ',
    no_data_found: 'કોઈ ડેટા મળ્યો નથી',

    funds_title: 'ફંડ્સ',
    add_funds_title: 'પૈસા ઉમેરો',
    add_funds_sub: 'વોલેટમાં તાત્કાલિક પૈસા ઉમેરો',
    withdraw_funds_title: 'પૈસા ઉપાડો',
    withdraw_funds_sub: 'જીતેલી રકમ ઉપાડો',
    bank_detail_title: 'બેંક વિગતો',
    bank_detail_sub: 'ઉપાડ માટે બેંક મેનેજ કરો',
    add_history_title: 'જમા ઇતિહાસ',
    add_history_sub: 'રિચાર્જ અને ડિપોઝિટ રેકોર્ડ્સ',
    withdraw_history_title: 'ઉપાડ ઇતિહાસ',
    withdraw_history_sub: 'ઉપાડ વિનંતી રેકોર્ડ્સ',

    market_rate_title: 'ગેમ રેટ',
    single_digit: 'સિંગલ ડિજિટ',
    jodi_digit: 'જોડી ડિજિટ',
    single_pana: 'સિંગલ પાના',
    double_pana: 'ડબલ પાના',
    triple_pana: 'ટ્રિપલ પાના',
    half_sangam: 'હાફ સંગમ',
    full_sangam: 'ફુલ સંગમ',
    sp: 'સિંગલ પાના',
    dp: 'ડબલ પાના',
    tp: 'ટ્રિપલ પાના',
    single: 'સિંગલ',
    jodi: 'જોડી',
    red_bracket: 'રેડ બ્રેકેટ',
    cycle_pana: 'સાયકલ પાના',
    motor_pana: 'મોટર પાના',
    sp_motor: 'એસપી મોટર',
    dp_motor: 'ડીપી મોટર',
    tp_motor: 'ટીપી મોટર',
    family_pana: 'ફેમિલી પાના',

    win_history_title: 'જીતનો ઇતિહાસ',
    no_winnings_found: 'કોઈ જીત રેકોર્ડ મળ્યો નથી',

    notice_title: 'નોટિસ બોર્ડ',

    bank_manage_title: 'બેંક અને યુપીઆઈ વિગતો',
    kyc_access: 'બેંક અને કેવાયસી',
    primary_bank: 'પ્રાથમિક બેંક ખાતું',
    add_bank_btn: 'ઉમેરો',
    edit_bank_btn: 'બદલો',
    upi_options: 'યુપીઆઈ વિકલ્પો',

    charts_title: 'માર્કેટ ચાર્ટ્સ',
    main_charts: 'મેન માર્કેટ ચાર્ટ',
    starline_charts: 'સ્ટારલાઇન ચાર્ટ',
    gali_charts: 'ગલી દેસાવર ચાર્ટ',

    how_to_play_title: 'કેવી રીતે રમવું',
    htp_intro_title: 'કેવી રીતે ઉપયોગ કરવો',
    htp_intro_body: 'અહીં તમે Bid, Wallet, Add Money, Withdrawal અને તમારી History સંબંધિત સામાન્ય માહિતી જોઈ શકો છો.',
    htp_bid_title: '1. Bid માહિતી',
    htp_bid_body: 'Bid એ ઉપલબ્ધ નિયમો અનુસાર કરવામાં આવેલ એન્ટ્રી છે.',
    htp_result_title: '2. પરિણામ અને જીત',
    htp_result_body: 'પરિણામો નિર્ધારિત સમયપત્રક મુજબ જાહેર થાય છે.',
    htp_deposit_title: '3. પૈસા ઉમેરો',
    htp_deposit_body: 'ન્યૂનતમ ડિપોઝિટ: ₹100.',
    htp_history_title: '5. Bid & Win ઇતિહાસ',
    htp_history_body: 'તમારા બિડ અને જીતના રેકોર્ડ તપાસો.',

    profile_title: 'પ્રોફાઇલ',
    edit_profile: 'પ્રોફાઇલ બદલો',
    change_password: 'પાસવર્ડ બદલો',
    select_language: 'ભાષા',
    notifications: 'સૂચનાઓ',
    logout: 'લૉગઆઉટ',

    withdraw_title: 'ફંડ ઉપાડો',
    request_withdrawal: 'ઉપાડ વિનંતી',
    amount_label: 'રકમ (₹):',
    amount_placeholder: 'રકમ દાખલ કરો',
    method_label: 'પદ્ધતિ:',
    submit_withdrawal: 'ઉપાડ વિનંતી મોકલો',
    select_method: 'પદ્ધતિ પસંદ કરો',

    contact_title: 'સંપર્ક કરો',
    contact_sub: 'અમે સામાન્ય રીતે થોડીવારમાં જવાબ આપીએ છીએ',
    phone_call: 'ફોન કૉલ',
    telegram: 'ટેલિગ્રામ',
    whatsapp: 'વ્હોટ્સએપ',
    chat_us: 'ચેટ કરો',

    bids_title: 'મારી બિડ્સ',
    no_bids_found: 'કોઈ બિડ્સ મળી નથી',
    select_date: 'તારીખ પસંદ કરો',

    login_title: 'લૉગિન કરો',
    signup_title: 'સાઇન અપ કરો',
    phone_placeholder: 'મોબાઇલ નંબર',
    password_placeholder: 'પાસવર્ડ',
    forgot_password: 'પાસવર્ડ ભૂલી ગયા?',
    dont_have_account: 'ખાતું નથી?',
    already_have_account: 'પહેલેથી ખાતું છે?',

    // Select Language Screen
    select_language_title: 'ભાષા પસંદ કરો',
    next_btn: 'આગળ',

    // Add Fund Screen
    add_fund_header: 'પૈસા ઉમેરો',
    current_balance: 'વર્તમાન સિલક',
    enter_amount: 'રકમ દાખલ કરો',
    select_upi_app: 'UPI એપ પસંદ કરો',
    pay_now: 'હમણાં ચૂકવો',
    people_active_now: 'લોકો સક્રિય છે',
    recent_add_money: 'તાજેતરમાં ઉમેરેલા પૈસા',
    amount_added: 'રકમ ઉમેરાઈ',
    please_enter_amount: 'કૃપા કરીને રકમ દાખલ કરો',
    deposit_success: 'વોલેટમાં સફળતાપૂર્વક રકમ ઉમેરાઈ.',

    // Contact Us Screen
    support_title: 'સપોર્ટ',
    support_chat_welcome: 'નમસ્તે! અમે તમને કેવી રીતે મદદ કરી શકીએ? તમારો પ્રશ્ન અહીં મોકલો.',
    type_message: 'સંદેશ લખો...',

    // Notice Screen
    admin_update_title: 'નવીનતમ એડમિન અપડેટ',
    admin_update_sub: 'નવીનતમ એડમિન સૂચનાઓ બતાવવામાં આવી રહી છે',

    // Market Rate Screen
    play_type_header: 'રમતના પ્રકાર',
    payout_header: 'પેઆઉટ ₹10',
    wins_header: '₹10 જીત',

    // Game Screen
    play_game: 'ગેમ રમો',
    market_closed_msg: 'માર્કેટ બંધ છે',

    // Bid Screen
    open_bid: 'ઓપન બિડ',
    close_bid: 'ક્લોઝ બિડ',
    digits_pana: 'અંક / પાના',
    bid_amount: 'બિડ રકમ',
    add_bid: 'બિડ ઉમેરો',
    submit_bid: 'બિડ સબમિટ કરો',
    no_bids_for_date: 'આ તારીખ માટે કોઈ બિડ રેકોર્ડ નથી.',

    // Bank Details & Add Bank
    add_bank_title: 'બેંક ઉમેરો',
    account_holder_name: 'ખાતાધારકનું નામ',
    enter_account_holder: 'ખાતાધારકનું નામ દાખલ કરો',
    account_number: 'ખાતા નંબર',
    enter_account_number: 'ખાતા નંબર દાખલ કરો',
    confirm_account_number: 'ખાતા નંબરની પુષ્ટિ કરો',
    enter_confirm_account: 'ખાતા નંબર ફરી દાખલ કરો',
    ifsc_code: 'IFSC કોડ',
    enter_ifsc: 'IFSC કોડ દાખલ કરો',
    bank_name: 'બેંકનું નામ',
    enter_bank_name: 'બેંકનું નામ દાખલ કરો',
    branch_address: 'શાખાનું સરનામું',
    enter_branch_address: 'શાખાનું સરનામું દાખલ કરો',
    submit: 'સબમિટ કરો',

    // Fund Transfer
    fund_transfer_title: 'ફંડ ટ્રાન્સફર',
    transfer_amount: 'ટ્રાન્સફર રકમ',
    enter_transfer_amount: 'રકમ દાખલ કરો',
    receiver_phone: 'મેળવનારનો મોબાઈલ નંબર',

    // Profile Screen
    settings: 'સેટિંગ્સ',
    username_label: 'વપરાશકર્તા નામ',
    enter_username: 'વપરાશકર્તા નામ દાખલ કરો',
    update_and_save: 'અપડેટ કરો અને સાચવો',
    email_label: 'ઈમેલ',

    // Auth Screens
    welcome_back: 'સ્વાગત છે',
    login_continue: 'ચાલુ રાખવા માટે તમારા ખાતામાં લૉગ ઇન કરો',
    phone_label: 'મોબાઈલ નંબર',
    password_label: 'પાસવર્ડ',
    remember_me: 'મને યાદ રાખો',
    create_account: 'ખાતું બનાવો',
    signup_get_started: 'શરૂ કરવા માટે સાઇન અપ કરો',
    referral_code_optional: 'રેફરલ કોડ (વૈકલ્પિક)',
    register_btn: 'રજીસ્ટર કરો',

    // Tabs
    tabs_home: 'હોમ',
    tabs_inventory: 'ઇન્વેન્ટરી',
    tabs_quotes: 'કોટ્સ',
    tabs_notify: 'નોટિફાય સેન્ટર',
    tabs_profile: 'પ્રોફાઇલ',

    // Added Dynamic Keys
    result_chart: "પરિણામ ચાર્ટ",
    mobile_number: "મોબાઇલ નંબર",
    special_offer: "સ્પેશિયલ ઑફર",
    wallet_balance: "વૉલેટ બેલેન્સ",
    bonus_note: "શ્રેષ્ઠ ઑફરનો લાભ લો અને રમો",
    special_notice: "ખાસ સૂચના",
    popup_default_msg: "તમારી સેવામાં સદૈવ તત્પર!",
    profile_settings: "પ્રોફાઇલ સેટિંગ્સ",
    account_security: "ખાતા સુરક્ષા",
    pwd_change_title: "પાસવર્ડ બદલો",
    pwd_current_label: "વર્તમાન પાસવર્ડ",
    pwd_new_label: "નવો પાસવર્ડ",
    pwd_confirm_label: "નવો પાસવર્ડ કન્ફર્મ કરો",
    pwd_current_required: "કૃપા કરીને તમારો વર્તમાન પાસવર્ડ દાખલ કરો.",
    pwd_new_required: "કૃપા કરીને નવો પાસવર્ડ દાખલ કરો.",
    pwd_min_chars: "નવો પાસવર્ડ ઓછામાં ઓછો 6 અક્ષરોનો હોવો જોઈએ.",
    pwd_confirm_required: "કૃપા કરીને પાસવર્ડ કન્ફર્મ કરો.",
    pwd_mismatch: "બંને પાસવર્ડ મેળ ખાતા નથી.",
    pwd_updated_success: "પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો છે.",
    pwd_security_desc: "નિયમિત રીતે પાસવર્ડ બદલીને તમારા ખાતાને સુરક્ષિત રાખો.",
    pwd_update_btn: "પાસવર્ડ અપડેટ કરો",
    left_digit: "લેફ્ટ ડિજિટ",
    right_digit: "રાઇટ ડિજિટ",
    single_digit_bulk: "સિંગલ ડિજિટ બલ્ક",
    htp_bank_title: "6. બેંક અને યુપીઆઈ",
    htp_bank_body: "તમારું બેંક એકાઉન્ટ અને UPI માહિતી ચકાસાયેલ રાખો. હંમેશા તમારા પોતાના નામે નોંધાયેલા પેમેન્ટ એકાઉન્ટનો ઉપયોગ કરો.",
    htp_important_title: "7. મહત્વપૂર્ણ માહિતી",
    htp_important_body: "તમારા વિસ્તારમાં મંજૂરી હોય તો જ આ સેવાનો ઉપયોગ કરો. તમામ લાગુ કાયદા અને પ્લેટફોર્મના નિયમોનું પાલન કરો.",
    htp_footer_note: "સેવાનો ઉપયોગ કરતા પહેલા લાગુ નિયમો કાળજીપૂર્વક વાંચો.",
    place_bet: "બિડ લગાવો",
    bid_points: "બિડ પોઇન્ટ્સ",
    enter_points: "પોઇન્ટ્સ દાખલ કરો",
    bid_list: "બિડ યાદી",
    no_bids_added: "હજુ સુધી કોઈ બિડ ઉમેરવામાં આવી નથી",
    digit: "અંક",
    points: "પોઇન્ટ્સ",
    bids_count_label: "બિડ્સ",
    total_label: "કુલ",
    session: "સત્ર",
    remove: "દૂર કરો",
    digit_pana: "અંક/પાના",
    account_blocked_msg: "માફ કરશો, તમારું ખાતું બ્લોક છે",
    delete: "કાઢી નાખો",
    enter_digit: "અંક દાખલ કરો",
    enter_pana: "પાના દાખલ કરો",
    pana: "પાના",
    type: "પ્રકાર",

  },

  mr: {
    // Marathi
    cancel: 'रद्द करा',
    confirm: 'ठीक आहे',
    prev: '← मागे',
    next: 'पुढे →',
    exit_confirm_title: 'बाहेर पडा',
    exit_confirm_msg: 'तुम्हाला आता बाहेर पडायचे आहे का?',
    yes: 'होय',
    no: 'नाही',
    save: 'जतन करा',
    edit: 'संपादित करा',
    add: 'जोडा',
    close: 'बंद करा',
    error: 'त्रुटी',
    success: 'यशस्वी',
    loading: 'लोड होत आहे...',

    add_money: 'पैसे जोडा',
    add_money_sub: 'त्वरित पैसे जोडा',
    withdraw: 'पैसे काढा',
    withdraw_sub: 'त्वरित पैसे काढा',
    starline: 'स्टारलाइन',
    starline_sub: 'स्टारलाइन खेळा',
    gali_desawar: 'गली देसावर',
    gali_desawar_sub: 'देसावर खेळा',

    fast_deposit: 'जलद ठेव',
    fast_withdrawal: 'जलद पैसे काढणे',
    support_247: '24×7 सपोर्ट',

    todays_markets: 'आजचे मार्केट',
    view_all: 'सर्व पहा ›',
    market_running: 'मार्केट सुरू आहे',
    market_closed: 'मार्केट बंद आहे',
    open_label: 'ओपन',
    close_label: 'क्लोज',
    game_chart: 'गेम चार्ट',

    nav_my_bids: 'माझ्या बिड्स',
    nav_wallet: 'वॉलेट',
    nav_home: 'होम',
    nav_passbook: 'पासबुक',
    nav_support: 'सपोर्ट',

    closed_title: 'आजसाठी बिडिंग बंद आहे',
    open_pill: 'ओपन',
    close_pill: 'क्लोज',
    open_result_time: 'ओपन निकाल वेळ',
    open_bid_last: 'ओपन बिड अंतिम वेळ',
    close_result_time: 'क्लोज निकाल वेळ',
    close_bid_last: 'क्लोज बिड अंतिम वेळ',
    ok_btn: 'ठीक आहे',

    drawer_home: 'होम',
    drawer_profile: 'प्रोफाइल',
    drawer_game_rate: 'गेम दर',
    drawer_win_history: 'जिंकण्याचा इतिहास',
    drawer_bid_history: 'बिड इतिहास',
    drawer_charts: 'मार्केट चार्ट्स',
    drawer_funds: 'निधी',
    drawer_notice: 'सूचना फलक',
    drawer_language: 'भाषा',
    drawer_share: 'अॅप शेअर करा',
    drawer_contact: 'संपर्क साधा',
    drawer_how_to_play: 'कसे खेळायचे',
    drawer_logout: 'लॉगआउट',

    passbook_title: 'पासबुक',
    tab_all: 'सर्व',
    tab_credit: 'क्रेडिट (ठेव)',
    tab_debit: 'डेबिट (निकासी)',
    no_data_found: 'कोणताही डेटा आढळला नाही',

    funds_title: 'निधी',
    add_funds_title: 'पैसे जोडा',
    add_funds_sub: 'वॉलेटमध्ये त्वरित पैसे जोडा',
    withdraw_funds_title: 'पैसे काढा',
    withdraw_funds_sub: 'जिंकलेली रक्कम काढा',
    bank_detail_title: 'बँक तपशील',
    bank_detail_sub: 'पैसे काढण्यासाठी बँक व्यवस्थापित करा',
    add_history_title: 'ठेव इतिहास',
    add_history_sub: 'रिचार्ज आणि ठेव नोंदी',
    withdraw_history_title: 'काढण्याचा इतिहास',
    withdraw_history_sub: 'पैसे काढण्याच्या विनंती नोंदी',

    market_rate_title: 'गेम दर',
    single_digit: 'सिंगल डिजिट',
    jodi_digit: 'जोडी डिजिट',
    single_pana: 'सिंगल पाना',
    double_pana: 'डबल पाना',
    triple_pana: 'ट्रिपल पाना',
    half_sangam: 'हाफ संगम',
    full_sangam: 'फुल संगम',
    sp: 'सिंगल पाना',
    dp: 'डबल पाना',
    tp: 'ट्रिपल पाना',
    single: 'सिंगल',
    jodi: 'जोडी',
    red_bracket: 'रेड ब्रॅकेट',
    cycle_pana: 'सायकल पाना',
    motor_pana: 'मोटर पाना',
    sp_motor: 'एसपी मोटर',
    dp_motor: 'डीपी मोटर',
    tp_motor: 'टीपी मोटर',
    family_pana: 'फॅमिली पाना',

    win_history_title: 'जिंकण्याचा इतिहास',
    no_winnings_found: 'कोणताही जिंकण्याचा विक्रम आढळला नाही',

    notice_title: 'सूचना फलक',

    bank_manage_title: 'बँक व यूपीआई तपशील',
    kyc_access: 'बँक आणि केवायसी',
    primary_bank: 'प्राथमिक बँक खाते',
    add_bank_btn: 'जोडा',
    edit_bank_btn: 'संपादित करा',
    upi_options: 'यूपीआई पर्याय',

    charts_title: 'मार्केट चार्ट्स',
    main_charts: 'मुख्य मार्केट चार्ट',
    starline_charts: 'स्टारलाइन चार्ट',
    gali_charts: 'गली देसावर चार्ट',

    how_to_play_title: 'कसे खेळायचे',
    htp_intro_title: 'कसे वापरावे',
    htp_intro_body: 'येथे आपण Bid, Wallet, Add Money, Withdrawal आणि History शी संबंधित माहिती पाहू शकता.',
    htp_bid_title: '1. Bid माहिती',
    htp_bid_body: 'Bid ही उपलब्ध नियमांनुसार केलेली नोंद आहे.',
    htp_result_title: '2. निकाल आणि जिंकणे',
    htp_result_body: 'वेळापत्रकानुसार निकाल जाहीर केले जातात.',
    htp_deposit_title: '3. पैसे जोडा',
    htp_deposit_body: 'किमान ठेव: ₹100.',
    htp_history_title: '5. Bid & Win इतिहास',
    htp_history_body: 'आपल्या बिड आणि विजयाच्या नोंदी तपासा.',

    profile_title: 'प्रोफाइल',
    edit_profile: 'प्रोफाइल संपादित करा',
    change_password: 'पासवर्ड बदला',
    select_language: 'भाषा',
    notifications: 'सूचना',
    logout: 'लॉगआउट',

    withdraw_title: 'निधी काढा',
    request_withdrawal: 'पैसे काढण्याची विनंती',
    amount_label: 'रक्कम (₹):',
    amount_placeholder: 'रक्कम प्रविष्ट करा',
    method_label: 'पद्धत:',
    submit_withdrawal: 'विनंती सबमिट करा',
    select_method: 'पद्धत निवडा',

    contact_title: 'संपर्क साधा',
    contact_sub: 'आम्ही सहसा काही मिनिटांत उत्तर देतो',
    phone_call: 'फोन कॉल',
    telegram: 'टेलिग्राम',
    whatsapp: 'व्हॉट्सअॅप',
    chat_us: 'चॅट करा',

    bids_title: 'माझ्या बिड्स',
    no_bids_found: 'कोणत्याही बिड्स आढळल्या नाहीत',
    select_date: 'तारीख निवडा',

    login_title: 'लॉग इन करा',
    signup_title: 'साइन अप करा',
    phone_placeholder: 'मोबाईल नंबर',
    password_placeholder: 'पासवर्ड',
    forgot_password: 'पासवर्ड विसरलात?',
    dont_have_account: 'खाते नाही का?',
    already_have_account: 'आधीच खाते आहे का?',

    // Select Language Screen
    select_language_title: 'भाषा निवडा',
    next_btn: 'पुढे',

    // Add Fund Screen
    add_fund_header: 'पैसे जोडा',
    current_balance: 'सध्याची शिल्लक',
    enter_amount: 'रक्कम प्रविष्ट करा',
    select_upi_app: 'UPI अॅप निवडा',
    pay_now: 'आता पैसे द्या',
    people_active_now: 'लोक सक्रिय आहेत',
    recent_add_money: 'अलीकडे जोडलेले पैसे',
    amount_added: 'रक्कम जोडली',
    please_enter_amount: 'कृपया रक्कम प्रविष्ट करा',
    deposit_success: 'वॉलेटमध्ये रक्कम यशस्वीरित्या जोडली गेली.',

    // Contact Us Screen
    support_title: 'सपोर्ट',
    support_chat_welcome: 'नमस्ते! आम्ही तुम्हाला कशी मदत करू शकतो? तुमचा प्रश्न येथे पाठवा.',
    type_message: 'संदेश टाईप करा...',

    // Notice Screen
    admin_update_title: 'नवीनतम प्रशासकीय अपडेट',
    admin_update_sub: 'नवीनतम अॅडमिन सूचना दाखवत आहे',

    // Market Rate Screen
    play_type_header: 'खेळाचा प्रकार',
    payout_header: 'पेआउट ₹10',
    wins_header: '₹10 विजय',

    // Game Screen
    play_game: 'गेम खेळा',
    market_closed_msg: 'मार्केट बंद आहे',

    // Bid Screen
    open_bid: 'ओपन बिड',
    close_bid: 'क्लोज बिड',
    digits_pana: 'अंक / पाना',
    bid_amount: 'बिड रक्कम',
    add_bid: 'बिड जोडा',
    submit_bid: 'बिड सबमिट करा',
    no_bids_for_date: 'या तारखेसाठी कोणताही बिड रेकॉर्ड उपलब्ध नाही.',

    // Bank Details & Add Bank
    add_bank_title: 'बँक जोडा',
    account_holder_name: 'खातेदाराचे नाव',
    enter_account_holder: 'खातेदाराचे नाव प्रविष्ट करा',
    account_number: 'खाते क्रमांक',
    enter_account_number: 'खाते क्रमांक प्रविष्ट करा',
    confirm_account_number: 'खाते क्रमांकाची पुष्टी करा',
    enter_confirm_account: 'खाते क्रमांक पुन्हा प्रविष्ट करा',
    ifsc_code: 'IFSC कोड',
    enter_ifsc: 'IFSC कोड प्रविष्ट करा',
    bank_name: 'बँकेचे नाव',
    enter_bank_name: 'बँकेचे नाव प्रविष्ट करा',
    branch_address: 'शाखेचा पत्ता',
    enter_branch_address: 'शाखेचा पत्ता प्रविष्ट करा',
    submit: 'सबमिट करा',

    // Fund Transfer
    fund_transfer_title: 'फंड ट्रान्सफर',
    transfer_amount: 'ट्रान्सफर रक्कम',
    enter_transfer_amount: 'रक्कम प्रविष्ट करा',
    receiver_phone: 'प्राप्तकर्त्याचा मोबाईल नंबर',

    // Profile Screen
    settings: 'सेटिंग्ज',
    username_label: 'वापरकर्ता नाव',
    enter_username: 'वापरकर्ता नाव प्रविष्ट करा',
    update_and_save: 'अपडेट करा आणि सेव्ह करा',
    email_label: 'ईमेल',

    // Auth Screens
    welcome_back: 'पुन्हा स्वागत आहे',
    login_continue: 'पुढे जाण्यासाठी आपल्या खात्यात लॉग इन करा',
    phone_label: 'मोबाईल नंबर',
    password_label: 'पासवर्ड',
    remember_me: 'मला लक्षात ठेवा',
    create_account: 'खाते तयार करा',
    signup_get_started: 'सुरू करण्यासाठी साइन अप करा',
    referral_code_optional: 'रेफरल कोड (पर्यायी)',
    register_btn: 'नोंदणी करा',

    // Tabs
    tabs_home: 'होम',
    tabs_inventory: 'इन्व्हेंटरी',
    tabs_quotes: 'कोट्स',
    tabs_notify: 'सूचना केंद्र',
    tabs_profile: 'प्रोफाइल',

    // Added Dynamic Keys
    result_chart: "निकाल चार्ट",
    mobile_number: "मोबाईल नंबर",
    special_offer: "विशेष ऑफर",
    wallet_balance: "वॉलेट शिल्लक",
    bonus_note: "सर्वोत्तम ऑफरचा लाभ घ्या आणि खेळा",
    special_notice: "विशेष सूचना",
    popup_default_msg: "आपल्या सेवेत सदैव तत्पर!",
    profile_settings: "प्रोफाइल सेटिंग्ज",
    account_security: "खाते सुरक्षा",
    pwd_change_title: "पासवर्ड बदला",
    pwd_current_label: "सध्याचा पासवर्ड",
    pwd_new_label: "नवीन पासवर्ड",
    pwd_confirm_label: "नवीन पासवर्ड निश्चित करा",
    pwd_current_required: "कृपया तुमचा सध्याचा पासवर्ड प्रविष्ट करा.",
    pwd_new_required: "कृपया नवीन पासवर्ड प्रविष्ट करा.",
    pwd_min_chars: "नवीन पासवर्ड किमान 6 अक्षरांचा असावा.",
    pwd_confirm_required: "कृपया पासवर्ड निश्चित करा.",
    pwd_mismatch: "दोन्ही पासवर्ड जुळत नाहीत.",
    pwd_updated_success: "पासवर्ड यशस्वीरित्या बदलला आहे.",
    pwd_security_desc: "नियमितपणे पासवर्ड बदलून आपले खाते सुरक्षित ठेवा.",
    pwd_update_btn: "पासवर्ड अपडेट करा",
    left_digit: "लेफ्ट डिजिट",
    right_digit: "राइट डिजिट",
    single_digit_bulk: "सिंगल डिजिट बल्क",
    htp_bank_title: "6. बँक आणि यूपीआय",
    htp_bank_body: "आपले बँक खाते आणि UPI माहिती सत्यापित ठेवा. नेहमी आपल्या नावावर नोंदणीकृत पेमेंट खात्याचा वापर करा.",
    htp_important_title: "7. महत्त्वाची माहिती",
    htp_important_body: "आपल्या भागात परवानगी असेल तरच या सेवेचा वापर करा. सर्व लागू कायदे आणि प्लॅटफॉर्म नियमांचे पालन करा.",
    htp_footer_note: "सेवेचा वापर करण्यापूर्वी लागू नियम काळजीपूर्वक वाचा.",
    place_bet: "दाव लावा",
    bid_points: "बिड पॉइंट्स",
    enter_points: "पॉइंट्स प्रविष्ट करा",
    bid_list: "बिड यादी",
    no_bids_added: "अद्याप कोणतीही बिड जोडलेली नाही",
    digit: "अंक",
    points: "पॉइंट्स",
    bids_count_label: "बिड्स",
    total_label: "एकूण",
    session: "सत्र",
    remove: "काढून टाका",
    digit_pana: "अंक/पाना",
    account_blocked_msg: "माफ करा, आपले खाते ब्लॉक केले आहे",
    delete: "हटवा",
    enter_digit: "अंक प्रविष्ट करा",
    enter_pana: "पाना प्रविष्ट करा",
    pana: "पाना",
    type: "प्रकार",

  },

  kn: {
    // Kannada
    cancel: 'ರದ್ದುಮಾಡಿ',
    confirm: 'ಸರಿ',
    prev: '← ಹಿಂದಿನ',
    next: 'ಮುಂದೆ →',
    exit_confirm_title: 'ನಿರ್ಗಮಿಸಿ',
    exit_confirm_msg: 'ನೀವು ಈಗ ನಿರ್ಗಮಿಸಲು ಬಯಸುವಿರಾ?',
    yes: 'ಹೌದು',
    no: 'ಇಲ್ಲ',
    save: 'ಉಳಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    add: 'ಸೇರಿಸಿ',
    close: 'ಮುಚ್ಚಿ',
    error: 'ದೋಷ',
    success: 'ಯಶಸ್ವಿ',
    loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',

    add_money: 'ಹಣ ಸೇರಿಸಿ',
    add_money_sub: 'ತಕ್ಷಣ ಹಣ ಸೇರಿಸಿ',
    withdraw: 'ಹಿಂಪಡೆಯಿರಿ',
    withdraw_sub: 'ತಕ್ಷಣ ಹಿಂಪಡೆಯಿರಿ',
    starline: 'ಸ್ಟಾರ್‌ಲೈನ್',
    starline_sub: 'ಸ್ಟಾರ್‌ಲೈನ್ ಆಡಿ',
    gali_desawar: 'ಗಲಿ ದೇಸಾವರ್',
    gali_desawar_sub: 'ದೇಸಾವರ್ ಆಡಿ',

    fast_deposit: 'ವೇಗದ ಠೇವಣಿ',
    fast_withdrawal: 'ವೇಗದ ಹಿಂಪಡೆಯುವಿಕೆ',
    support_247: '24×7 ಬೆಂಬಲ',

    todays_markets: 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆಗಳು',
    view_all: 'ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ ›',
    market_running: 'ಮಾರುಕಟ್ಟೆ ಚಾಲನೆಯಲ್ಲಿದೆ',
    market_closed: 'ಮಾರುಕಟ್ಟೆ ಮುಚ್ಚಲಾಗಿದೆ',
    open_label: 'ತೆರೆದ',
    close_label: 'ಮುಚ್ಚಲಾಗಿದೆ',
    game_chart: 'ಗೇಮ್ ಚಾರ್ಟ್',

    nav_my_bids: 'ನನ್ನ ಬಿಡ್‌ಗಳು',
    nav_wallet: 'ವಾಲೆಟ್',
    nav_home: 'ಮುಖಪುಟ',
    nav_passbook: 'ಪಾಸ್‌ಬುಕ್',
    nav_support: 'ಬೆಂಬಲ',

    closed_title: 'ಇಂದಿನ ಬಿಡ್ಡಿಂಗ್ ಮುಚ್ಚಲಾಗಿದೆ',
    open_pill: 'ಓಪನ್',
    close_pill: 'ಕ್ಲೋಸ್',
    open_result_time: 'ಓಪನ್ ಫಲಿತಾಂಶ ಸಮಯ',
    open_bid_last: 'ಓಪನ್ ಬಿಡ್ ಕೊನೆಯ ಸಮಯ',
    close_result_time: 'ಕ್ಲೋಸ್ ಫಲಿತಾಂಶ ಸಮಯ',
    close_bid_last: 'ಕ್ಲೋಸ್ ಬಿಡ್ ಕೊನೆಯ ಸಮಯ',
    ok_btn: 'ಸರಿ',

    drawer_home: 'ಮುಖಪುಟ',
    drawer_profile: 'ಪ್ರೊಫೈಲ್',
    drawer_game_rate: 'ಗೇಮ್ ದರ',
    drawer_win_history: 'ಗೆಲುವಿನ ಇತಿಹಾಸ',
    drawer_bid_history: 'ಬಿಡ್ ಇತಿಹಾಸ',
    drawer_charts: 'ಮಾರುಕಟ್ಟೆ ಚಾರ್ಟ್‌ಗಳು',
    drawer_funds: 'ನಿಧಿಗಳು',
    drawer_notice: 'ಸೂಚನಾ ಫಲಕ',
    drawer_language: 'ಭಾಷೆ',
    drawer_share: 'ಆ್ಯಪ್ ಹಂಚಿಕೊಳ್ಳಿ',
    drawer_contact: 'ಸಂಪರ್ಕಿಸಿ',
    drawer_how_to_play: 'ಹೇಗೆ ಆಡುವುದು',
    drawer_logout: 'ಲಾಗ್‌ಔಟ್',

    passbook_title: 'ಪಾಸ್‌ಬುಕ್',
    tab_all: 'ಎಲ್ಲ',
    tab_credit: 'ಠೇವಣಿ',
    tab_debit: 'ಹಿಂಪಡೆಯುವಿಕೆ',
    no_data_found: 'ಯಾವುದೇ ಡೇಟಾ ಕಂಡುಬಂದಿಲ್ಲ',

    funds_title: 'ನಿಧಿಗಳು',
    add_funds_title: 'ಹಣ ಸೇರಿಸಿ',
    add_funds_sub: 'ವಾಲೆಟ್‌ಗೆ ತಕ್ಷಣ ಹಣ ಸೇರಿಸಿ',
    withdraw_funds_title: 'ಹಣ ಹಿಂಪಡೆಯಿರಿ',
    withdraw_funds_sub: 'ಗೆದ್ದ ಮೊತ್ತವನ್ನು ಹಿಂಪಡೆಯಿರಿ',
    bank_detail_title: 'ಬ್ಯಾಂಕ್ ವಿವರಗಳು',
    bank_detail_sub: 'ಹಿಂಪಡೆಯಲು ಬ್ಯಾಂಕ್ ನಿರ್ವಹಿಸಿ',
    add_history_title: 'ಠೇವಣಿ ಇತಿಹಾಸ',
    add_history_sub: 'ರೀಚಾರ್ಜ್ ಮತ್ತು ಠೇವಣಿ ದಾಖಲೆಗಳು',
    withdraw_history_title: 'ಹಿಂಪಡೆಯುವ ಇತಿಹಾಸ',
    withdraw_history_sub: 'ಹಿಂಪಡೆಯುವ ವಿನಂತಿ ದಾಖಲೆಗಳು',

    market_rate_title: 'ಗೇಮ್ ದರ',
    single_digit: 'ಸಿಂಗಲ್ ಡಿಜಿಟ್',
    jodi_digit: 'ಜೋಡಿ ಡಿಜಿಟ್',
    single_pana: 'ಸಿಂಗಲ್ ಪಾನಾ',
    double_pana: 'ಡಬಲ್ ಪಾನಾ',
    triple_pana: 'ಟ್ರಿಪಲ್ ಪಾನಾ',
    half_sangam: 'ಹಾಫ್ ಸಂಗಮ್',
    full_sangam: 'ಫುಲ್ ಸಂಗಮ್',
    sp: 'ಸಿಂಗಲ್ ಪಾನಾ',
    dp: 'ಡಬಲ್ ಪಾನಾ',
    tp: 'ಟ್ರಿಪಲ್ ಪಾನಾ',
    single: 'ಸಿಂಗಲ್',
    jodi: 'ಜೋಡಿ',
    red_bracket: 'ರೆಡ್ ಬ್ರಾಕೆಟ್',
    cycle_pana: 'ಸೈಕಲ್ ಪಾನಾ',
    motor_pana: 'ಮೋಟಾರ್ ಪಾನಾ',
    sp_motor: 'ಎಸ್ಪಿ ಮೋಟಾರ್',
    dp_motor: 'ಡಿಪಿ ಮೋಟಾರ್',
    tp_motor: 'ಟಿಪಿ ಮೋಟಾರ್',
    family_pana: 'ಫ್ಯಾಮಿಲಿ ಪಾನಾ',

    win_history_title: 'ಗೆಲುವಿನ ಇತಿಹಾಸ',
    no_winnings_found: 'ಯಾವುದೇ ಗೆಲುವಿನ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ',

    notice_title: 'ಸೂಚನಾ ಫಲಕ',

    bank_manage_title: 'ಬ್ಯಾಂಕ್ ಮತ್ತು ಯುಪಿಐ ವಿವರಗಳು',
    kyc_access: 'ಬ್ಯಾಂಕ್ ಮತ್ತು ಕೆವೈಸಿ',
    primary_bank: 'ಪ್ರಾಥಮಿಕ ಬ್ಯಾಂಕ್ ಖಾತೆ',
    add_bank_btn: 'ಸೇರಿಸಿ',
    edit_bank_btn: 'ಸಂಪಾದಿಸಿ',
    upi_options: 'ಯುಪಿಐ ಆಯ್ಕೆಗಳು',

    charts_title: 'ಮಾರುಕಟ್ಟೆ ಚಾರ್ಟ್‌ಗಳು',
    main_charts: 'ಮುಖ್ಯ ಮಾರುಕಟ್ಟೆ ಚಾರ್ಟ್',
    starline_charts: 'ಸ್ಟಾರ್‌ಲೈನ್ ಚಾರ್ಟ್',
    gali_charts: 'ಗಲಿ ದೇಸಾವರ್ ಚಾರ್ಟ್',

    how_to_play_title: 'ಹೇಗೆ ಆಡುವುದು',
    htp_intro_title: 'ಹೇಗೆ ಬಳಸುವುದು',
    htp_intro_body: 'ಇಲ್ಲಿ ನೀವು Bid, Wallet, Add Money, Withdrawal ಮತ್ತು History ಸಂಬಂಧಿಸಿದ ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸಬಹುದು.',
    htp_bid_title: '1. Bid ಮಾಹಿತಿ',
    htp_bid_body: 'Bid ಎನ್ನುವುದು ಲಭ್ಯವಿರುವ ನಿಯಮಗಳ ಪ್ರಕಾರ ಮಾಡಿದ ನಮೂದು ಆಗಿದೆ.',
    htp_result_title: '2. ಫಲಿತಾಂಶ ಮತ್ತು ಗೆಲುವು',
    htp_result_body: 'ವೇಳಾಪಟ್ಟಿಯ ಪ್ರಕಾರ ಫಲಿತಾಂಶಗಳನ್ನು ಪ್ರಕಟಿಸಲಾಗುತ್ತದೆ.',
    htp_deposit_title: '3. ಹಣ ಸೇರಿಸಿ',
    htp_deposit_body: 'ಕನಿಷ್ಠ ಠೇವಣಿ: ₹100.',
    htp_history_title: '5. Bid & Win ಇತಿಹಾಸ',
    htp_history_body: 'ನಿಮ್ಮ ಬಿಡ್ ಮತ್ತು ಗೆಲುವಿನ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',

    profile_title: 'ಪ್ರೊಫೈಲ್',
    edit_profile: 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ',
    change_password: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
    select_language: 'ಭಾಷೆ',
    notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    logout: 'ಲಾಗ್‌ಔಟ್',

    withdraw_title: 'ಹಣ ಹಿಂಪಡೆಯಿರಿ',
    request_withdrawal: 'ಹಿಂಪಡೆಯುವ ವಿನಂತಿ',
    amount_label: 'ಮೊತ್ತ (₹):',
    amount_placeholder: 'ಮೊತ್ತ ನಮೂದಿಸಿ',
    method_label: 'ವಿಧಾನ:',
    submit_withdrawal: 'ವಿನಂತಿ ಸಲ್ಲಿಸಿ',
    select_method: 'ವಿಧಾನ ಆಯ್ಕೆಮಾಡಿ',

    contact_title: 'ಸಂಪರ್ಕಿಸಿ',
    contact_sub: 'ನಾವು ಸಾಮಾನ್ಯವಾಗಿ ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ಉತ್ತರಿಸುತ್ತೇವೆ',
    phone_call: 'ಫೋನ್ ಕರೆ',
    telegram: 'ಟೆಲಿಗ್ರಾಮ್',
    whatsapp: 'ವಾಟ್ಸಾಪ್',
    chat_us: 'ಚಾಟ್ ಮಾಡಿ',

    bids_title: 'ನನ್ನ ಬಿಡ್‌ಗಳು',
    no_bids_found: 'ಯಾವುದೇ ಬಿಡ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    select_date: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',

    login_title: 'ಲಾಗಿನ್ ಮಾಡಿ',
    signup_title: 'ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    phone_placeholder: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    password_placeholder: 'ಪಾಸ್‌ವರ್ಡ್',
    forgot_password: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?',
    dont_have_account: 'ಖಾತೆ ಹೊಂದಿಲ್ಲವೇ?',
    already_have_account: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?',

    // Select Language Screen
    select_language_title: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    next_btn: 'ಮುಂದೆ',

    // Add Fund Screen
    add_fund_header: 'ಹಣ ಸೇರಿಸಿ',
    current_balance: 'ಪ್ರಸ್ತುತ ಬಾಕಿ',
    enter_amount: 'ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    select_upi_app: 'UPI ಅಪ್ಲಿಕೇಶನ್ ಆಯ್ಕೆಮಾಡಿ',
    pay_now: 'ಈಗ ಪಾವತಿಸಿ',
    people_active_now: 'ಜನರು ಸಕ್ರಿಯರಾಗಿದ್ದಾರೆ',
    recent_add_money: 'ಇತ್ತೀಚೆಗೆ ಸೇರಿಸಲಾದ ಹಣ',
    amount_added: 'ಮೊತ್ತ ಸೇರಿಸಲಾಗಿದೆ',
    please_enter_amount: 'ದಯವಿಟ್ಟು ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    deposit_success: 'ವಾಲೆಟ್‌ಗೆ ಮೊತ್ತವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸೇರಿಸಲಾಗಿದೆ.',

    // Contact Us Screen
    support_title: 'ಬೆಂಬಲ',
    support_chat_welcome: 'ನಮಸ್ಕಾರ! ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು? ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಕಳುಹಿಸಿ.',
    type_message: 'ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...',

    // Notice Screen
    admin_update_title: 'ಇತ್ತೀಚಿನ ನಿರ್ವಾಹಕ ಅಪ್‌ಡೇಟ್‌ಗಳು',
    admin_update_sub: 'ಇತ್ತೀಚಿನ ನಿರ್ವಾಹಕ ಅಧಿಸೂಚನೆಗಳನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ',

    // Market Rate Screen
    play_type_header: 'ಆಟದ ಪ್ರಕಾರ',
    payout_header: 'ಪಾವತಿ ₹10',
    wins_header: '₹10 ಗೆಲುವು',

    // Game Screen
    play_game: 'ಆಟವಾಡಿ',
    market_closed_msg: 'ಮಾರುಕಟ್ಟೆ ಮುಚ್ಚಲಾಗಿದೆ',

    // Bid Screen
    open_bid: 'ಓಪನ್ ಬಿಡ್',
    close_bid: 'ಕ್ಲೋಸ್ ಬಿಡ್',
    digits_pana: 'ಅಂಕಿಗಳು / ಪಾನಾ',
    bid_amount: 'ಬಿಡ್ ಮೊತ್ತ',
    add_bid: 'ಬಿಡ್ ಸೇರಿಸಿ',
    submit_bid: 'ಬಿಡ್ ಸಲ್ಲಿಸಿ',
    no_bids_for_date: 'ಈ ದಿನಾಂಕಕ್ಕೆ ಯಾವುದೇ ಬಿಡ್ ಲಭ್ಯವಿಲ್ಲ.',

    // Bank Details & Add Bank
    add_bank_title: 'ಬ್ಯಾಂಕ್ ಸೇರಿಸಿ',
    account_holder_name: 'ಖಾತೆದಾರರ ಹೆಸರು',
    enter_account_holder: 'ಖಾತೆದಾರರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    account_number: 'ಖಾತೆ ಸಂಖ್ಯೆ',
    enter_account_number: 'ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    confirm_account_number: 'ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ದೃಢೀಕರಿಸಿ',
    enter_confirm_account: 'ಖಾತೆ ಸಂಖ್ಯೆಯನ್ನು ಮತ್ತೊಮ್ಮೆ ನಮೂದಿಸಿ',
    ifsc_code: 'IFSC ಕೋಡ್',
    enter_ifsc: 'IFSC ಕೋಡ್ ನಮೂದಿಸಿ',
    bank_name: 'ಬ್ಯಾಂಕಿನ ಹೆಸರು',
    enter_bank_name: 'ಬ್ಯಾಂಕಿನ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    branch_address: 'ಶಾಖೆಯ ವಿಳಾಸ',
    enter_branch_address: 'ಶಾಖೆಯ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ',
    submit: 'ಸಲ್ಲಿಸಿ',

    // Fund Transfer
    fund_transfer_title: 'ಹಣ ವರ್ಗಾವಣೆ',
    transfer_amount: 'ವರ್ಗಾವಣೆ ಮೊತ್ತ',
    enter_transfer_amount: 'ಮೊತ್ತವನ್ನು ನಮೂದಿಸಿ',
    receiver_phone: 'ಸ್ವೀಕರಿಸುವವರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',

    // Profile Screen
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    username_label: 'ಬಳಕೆದಾರ ಹೆಸರು',
    enter_username: 'ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
    update_and_save: 'ಅಪ್‌ಡೇಟ್ ಮಾಡಿ ಮತ್ತು ಉಳಿಸಿ',
    email_label: 'ಇಮೇಲ್',

    // Auth Screens
    welcome_back: 'ಮತ್ತೆ ಸ್ವಾಗತ',
    login_continue: 'ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
    phone_label: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    password_label: 'ಪಾಸ್‌ವರ್ಡ್',
    remember_me: 'ನನ್ನನ್ನು ನೆನಪಿಡಿ',
    create_account: 'ಖಾತೆ ತೆರೆಯಿರಿ',
    signup_get_started: 'ಪ್ರಾರಂಭಿಸಲು ಸೈನ್ ಅಪ್ ಮಾಡಿ',
    referral_code_optional: 'ರೆಫರಲ್ ಕೋಡ್ (ಐಚ್ಛಿಕ)',
    register_btn: 'ನೋಂದಾಯಿಸಿ',

    // Tabs
    tabs_home: 'ಮುಖಪುಟ',
    tabs_inventory: 'ದಾಸ್ತಾನು',
    tabs_quotes: 'ಉಲ್ಲೇಖಗಳು',
    tabs_notify: 'ಅಧಿಸೂಚನೆ ಕೇಂದ್ರ',
    tabs_profile: 'ಪ್ರೊಫೈಲ್',

    // Added Dynamic Keys
    result_chart: "ಫಲಿತಾಂಶ ಚಾರ್ಟ್",
    mobile_number: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    special_offer: "ವಿಶೇಷ ಕೊಡುಗೆ",
    wallet_balance: "ವಾಲೆಟ್ ಬ್ಯಾಲೆನ್ಸ್",
    bonus_note: "ಅತ್ಯುತ್ತಮ ಕೊಡುಗೆಯ ಲಾಭ ಪಡೆಯಿರಿ ಮತ್ತು ಆಟವಾಡಿ",
    special_notice: "ವಿಶೇಷ ಸೂಚನೆ",
    popup_default_msg: "ನಿಮ್ಮ ಸೇವೆಗೆ ಸದಾ ಸಿದ್ಧ!",
    profile_settings: "ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    account_security: "ಖಾತೆ ಭದ್ರತೆ",
    pwd_change_title: "ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ",
    pwd_current_label: "ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",
    pwd_new_label: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
    pwd_confirm_label: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    pwd_current_required: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    pwd_new_required: "ದಯವಿಟ್ಟು ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    pwd_min_chars: "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.",
    pwd_confirm_required: "ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ.",
    pwd_mismatch: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ.",
    pwd_updated_success: "ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.",
    pwd_security_desc: "ನಿಯಮಿತವಾಗಿ ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸುವ ಮೂಲಕ ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ.",
    pwd_update_btn: "ಪಾಸ್‌ವರ್ಡ್ ಅಪ್‌ಡೇಟ್ ಮಾಡಿ",
    left_digit: "ಎಡ ಅಂಕಿ",
    right_digit: "ಬಲ ಅಂಕಿ",
    single_digit_bulk: "ಸಿಂಗಲ್ ಡಿಜಿಟ್ ಬಲ್ಕ್",
    htp_bank_title: "6. ಬ್ಯಾಂಕ್ ಮತ್ತು ಯುಪಿಐ",
    htp_bank_body: "ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆ ಮತ್ತು ಯುಪಿಐ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ ಇರಿಸಿ. ಯಾವಾಗಲೂ ನಿಮ್ಮದೇ ಹೆಸರಿನಲ್ಲಿರುವ ಪಾವತಿ ಖಾತೆಯನ್ನು ಬಳಸಿ.",
    htp_important_title: "7. ಪ್ರಮುಖ ಮಾಹಿತಿ",
    htp_important_body: "ನಿಮ್ಮ ಸ್ಥಳದಲ್ಲಿ ಅನುಮತಿಯಿದ್ದರೆ ಮಾತ್ರ ಈ ಸೇವೆಯನ್ನು ಬಳಸಿ. ಎಲ್ಲಾ ಅನ್ವಯವಾಗುವ ಕಾನೂನುಗಳು ಮತ್ತು ವೇದಿಕೆಯ ನಿಯಮಗಳನ್ನು ಪಾಲಿಸಿ.",
    htp_footer_note: "ಸೇವೆಯನ್ನು ಬಳಸುವ ಮೊದಲು ಅನ್ವಯವಾಗುವ ನಿಯಮಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಓದಿ.",
    place_bet: "ಬೆಟ್ ಹಾಕಿ",
    bid_points: "ಬಿಡ್ ಪಾಯಿಂಟ್‌ಗಳು",
    enter_points: "ಪಾಯಿಂಟ್‌ಗಳನ್ನು ನಮೂದಿಸಿ",
    bid_list: "ಬಿಡ್ ಪಟ್ಟಿ",
    no_bids_added: "ಇನ್ನೂ ಯಾವುದೇ ಬಿಡ್ ಸೇರಿಸಲಾಗಿಲ್ಲ",
    digit: "ಅಂಕಿ",
    points: "ಪಾಯಿಂಟ್‌ಗಳು",
    bids_count_label: "ಬಿಡ್‌ಗಳು",
    total_label: "ಒಟ್ಟು",
    session: "ಅಧಿವೇಶನ",
    remove: "ತೆಗೆದುಹಾಕಿ",
    digit_pana: "ಅಂಕಿ/ಪಾನಾ",
    account_blocked_msg: "ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಖಾತೆಯನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ",
    delete: "ಅಳಿಸಿ",
    enter_digit: "ಅಂಕಿಗಳನ್ನು ನಮೂದಿಸಿ",
    enter_pana: "ಪಾನಾ ನಮೂದಿಸಿ",
    pana: "ಪಾನಾ",
    type: "ಮಾದರಿ",

  },

  ml: {
    // Malayalam
    cancel: 'റദ്ദാക്കുക',
    confirm: 'ശരി',
    prev: '← മുൻപത്തെ',
    next: 'അടുത്തത് →',
    exit_confirm_title: 'പുറത്തുകടക്കുക',
    exit_confirm_msg: 'നിങ്ങൾക്ക് ഇപ്പോൾ പുറത്തുകടക്കണോ?',
    yes: 'അതെ',
    no: 'ഇല്ല',
    save: 'സംരക്ഷിക്കുക',
    edit: 'എഡിറ്റ്',
    add: 'ചേർക്കുക',
    close: 'അടയ്ക്കുക',
    error: 'പിശക്',
    success: 'വിജയം',
    loading: 'ലോഡ് ചെയ്യുന്നു...',

    add_money: 'പണം ചേർക്കുക',
    add_money_sub: 'ഉടൻ പണം ചേർക്കുക',
    withdraw: 'പിൻവലിക്കുക',
    withdraw_sub: 'ഉടൻ പിൻവലിക്കൽ നേടുക',
    starline: 'സ്റ്റാർലൈൻ',
    starline_sub: 'സ്റ്റാർലൈൻ കളിക്കുക',
    gali_desawar: 'ഗലി ദേസാവർ',
    gali_desawar_sub: 'ദേസാവർ കളിക്കുക',

    fast_deposit: 'വേഗത്തിലുള്ള നിക്ഷേപം',
    fast_withdrawal: 'വേഗത്തിലുള്ള പിൻവലിക്കൽ',
    support_247: '24×7 പിന്തുണ',

    todays_markets: 'ഇന്നത്തെ വിപണികൾ',
    view_all: 'എല്ലാം കാണുക ›',
    market_running: 'വിപണി പ്രവർത്തിക്കുന്നു',
    market_closed: 'വിപണി അടച്ചു',
    open_label: 'തുറക്കുക',
    close_label: 'അടയ്ക്കുക',
    game_chart: 'ഗെയിം ചാർട്ട്',

    nav_my_bids: 'എന്റെ ബിഡുകൾ',
    nav_wallet: 'വാലറ്റ്',
    nav_home: 'ഹോം',
    nav_passbook: 'പാസ്ബുക്ക്',
    nav_support: 'പിന്തുണ',

    closed_title: 'ഇന്നത്തെ ലേലം വിളി അടച്ചു',
    open_pill: 'ഓപ്പൺ',
    close_pill: 'ക്ലോസ്',
    open_result_time: 'ഓപ്പൺ ഫല സമയം',
    open_bid_last: 'ഓപ്പൺ ബിഡ് അവസാന സമയം',
    close_result_time: 'ക്ലോസ് ഫല സമയം',
    close_bid_last: 'ക്ലോസ് ബിഡ് അവസാന സമയം',
    ok_btn: 'ശരി',

    drawer_home: 'ഹോം',
    drawer_profile: 'പ്രൊഫൈൽ',
    drawer_game_rate: 'ഗെയിം നിരക്ക്',
    drawer_win_history: 'വിജയ ചരിത്രം',
    drawer_bid_history: 'ബിഡ് ചരിത്രം',
    drawer_charts: 'മാർക്കറ്റ് ചാർട്ടുകൾ',
    drawer_funds: 'ഫണ്ടുകൾ',
    drawer_notice: 'നോട്ടീസ് ബോർഡ്',
    drawer_language: 'ഭാഷ',
    drawer_share: 'ആപ്പ് പങ്കിടുക',
    drawer_contact: 'ബന്ധപ്പെടുക',
    drawer_how_to_play: 'എങ്ങനെ കളിക്കാം',
    drawer_logout: 'ലോഗ് ഔട്ട്',

    passbook_title: 'പാസ്ബുക്ക്',
    tab_all: 'എല്ലാം',
    tab_credit: 'നിക്ഷേപം',
    tab_debit: 'പിൻവലിക്കൽ',
    no_data_found: 'ഡാറ്റയൊന്നും കണ്ടെത്തിയില്ല',

    funds_title: 'ഫണ്ടുകൾ',
    add_funds_title: 'പണം ചേർക്കുക',
    add_funds_sub: 'വാലറ്റിലേക്ക് ഉടൻ പണം ചേർക്കുക',
    withdraw_funds_title: 'പണം പിൻവലിക്കുക',
    withdraw_funds_sub: 'വിജയിച്ച തുക പിൻവലിക്കുക',
    bank_detail_title: 'ബാങ്ക് വിശദാംശങ്ങൾ',
    bank_detail_sub: 'പിൻവലിക്കലിനായി ബാങ്ക് കൈകാര്യം ചെയ്യുക',
    add_history_title: 'നിക്ഷേപ ചരിത്രം',
    add_history_sub: 'റീചാർജ്, നിക്ഷേപ റെക്കോർഡുകൾ',
    withdraw_history_title: 'പിൻവലിക്കൽ ചരിത്രം',
    withdraw_history_sub: 'പിൻവലിക്കൽ അഭ്യർത്ഥന റെക്കോർഡുകൾ',

    market_rate_title: 'ഗെയിം നിരക്ക്',
    single_digit: 'സിംഗിൾ ഡിജിറ്റ്',
    jodi_digit: 'ജോഡി ഡിജിറ്റ്',
    single_pana: 'സിംഗിൾ പാന',
    double_pana: 'ഡബിൾ പാന',
    triple_pana: 'ട്രിപ്പിൾ പാന',
    half_sangam: 'ഹാഫ് സംഗം',
    full_sangam: 'ഫുൾ സംഗം',
    sp: 'സിംഗിൾ പാന',
    dp: 'ഡബിൾ പാന',
    tp: 'ട്രിപ്പിൾ പാന',
    single: 'സിംഗിൾ',
    jodi: 'ജോഡി',
    red_bracket: 'റെഡ് ബ്രാക്കറ്റ്',
    cycle_pana: 'സൈക്കിൾ പാന',
    motor_pana: 'മോട്ടോർ പാന',
    sp_motor: 'എസ്പി മോട്ടോർ',
    dp_motor: 'ഡിപി മോട്ടോർ',
    tp_motor: 'ടിപി മോട്ടോർ',
    family_pana: 'ഫാമിലി പാന',

    win_history_title: 'വിജയ ചരിത്രം',
    no_winnings_found: 'വിജയ ചരിത്രം കണ്ടെത്തിയില്ല',

    notice_title: 'നോട്ടീസ് ബോർഡ്',

    bank_manage_title: 'ബാങ്ക് & യുപിഐ വിശദാംശങ്ങൾ',
    kyc_access: 'ബാങ്ക് & കെവൈസി',
    primary_bank: 'പ്രാഥമിക ബാങ്ക് അക്കൗണ്ട്',
    add_bank_btn: 'ചേർക്കുക',
    edit_bank_btn: 'എഡിറ്റ്',
    upi_options: 'യുപിഐ ഓപ്ഷനുകൾ',

    charts_title: 'മാർക്കറ്റ് ചാർട്ടുകൾ',
    main_charts: 'പ്രധാന മാർക്കറ്റ് ചാർട്ട്',
    starline_charts: 'സ്റ്റാർലൈൻ ചാർട്ട്',
    gali_charts: 'ഗലി ദേസാവർ ചാർട്ട്',

    how_to_play_title: 'എങ്ങനെ കളിക്കാം',
    htp_intro_title: 'എങ്ങനെ ഉപയോഗിക്കാം',
    htp_intro_body: 'ഇവിടെ നിങ്ങൾക്ക് Bid, Wallet, Add Money, Withdrawal, History എന്നിവയെക്കുറിച്ചുള്ള വിവരങ്ങൾ കാണാം.',
    htp_bid_title: '1. Bid വിവരങ്ങൾ',
    htp_bid_body: 'ലഭ്യമായ നിയമങ്ങൾ അനുസരിച്ച് നൽകിയ എൻട്രിയാണ് Bid.',
    htp_result_title: '2. ഫലവും വിജയവും',
    htp_result_body: 'സമയക്രമം അനുസരിച്ച് ഫലങ്ങൾ പ്രഖ്യാപിക്കുന്നു.',
    htp_deposit_title: '3. പണം ചേർക്കുക',
    htp_deposit_body: 'കുറഞ്ഞ നിക്ഷേപം: ₹100.',
    htp_history_title: '5. Bid & Win ചരിത്രം',
    htp_history_body: 'നിങ്ങളുടെ ബിഡുകളും വിജയങ്ങളും പരിശോധിക്കുക.',

    profile_title: 'പ്രൊഫൈൽ',
    edit_profile: 'പ്രൊഫൈൽ എഡിറ്റ് ചെയ്യുക',
    change_password: 'പാസ്‌വേഡ് മാറ്റുക',
    select_language: 'ഭാഷ',
    notifications: 'അറിയിപ്പുകൾ',
    logout: 'ലോഗ് ഔട്ട്',

    withdraw_title: 'ഫണ്ട് പിൻവലിക്കുക',
    request_withdrawal: 'പിൻവലിക്കൽ അഭ്യർത്ഥന',
    amount_label: 'തുക (₹):',
    amount_placeholder: 'തുക നൽകുക',
    method_label: 'രീതി:',
    submit_withdrawal: 'അഭ്യർത്ഥന സമർപ്പിക്കുക',
    select_method: 'രീതി തിരഞ്ഞെടുക്കുക',

    contact_title: 'ബന്ധപ്പെടുക',
    contact_sub: 'ഞങ്ങൾ സാധാരണയായി ഏതാനും മിനിറ്റുകൾക്കുള്ളിൽ മറുപടി നൽകും',
    phone_call: 'ഫോൺ കോൾ',
    telegram: 'ടെലിഗ്രാം',
    whatsapp: 'വാട്‌സ്ആപ്പ്',
    chat_us: 'ചാറ്റ് ചെയ്യുക',

    bids_title: 'എന്റെ ബിഡുകൾ',
    no_bids_found: 'ബിഡുകൾ ഒന്നും കണ്ടെത്തിയില്ല',
    select_date: 'തീയതി തിരഞ്ഞെടുക്കുക',

    login_title: 'ലോഗിൻ ചെയ്യുക',
    signup_title: 'സൈൻ അപ്പ് ചെയ്യുക',
    phone_placeholder: 'മൊബൈൽ നമ്പർ',
    password_placeholder: 'പാസ്‌വേഡ്',
    forgot_password: 'പാസ്‌വേഡ് മറന്നോ?',
    dont_have_account: 'അക്കൗണ്ട് ഇല്ലേ?',
    already_have_account: 'ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?',

    // Select Language Screen
    select_language_title: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    next_btn: 'അടുത്തത്',

    // Add Fund Screen
    add_fund_header: 'പണം ചേർക്കുക',
    current_balance: 'നിലവിലെ ബാലൻസ്',
    enter_amount: 'തുക നൽകുക',
    select_upi_app: 'UPI ആപ്പ് തിരഞ്ഞെടുക്കുക',
    pay_now: 'ഇപ്പോൾ പണമടയ്ക്കുക',
    people_active_now: 'ആളുകൾ ഇപ്പോൾ സജീവമാണ്',
    recent_add_money: 'സമീപകാലത്ത് ചേർത്ത പണം',
    amount_added: 'തുക ചേർത്തു',
    please_enter_amount: 'ദയവായി തുക നൽകുക',
    deposit_success: 'വാലറ്റിലേക്ക് തുക വിജയകരമായി ചേർത്തു.',

    // Contact Us Screen
    support_title: 'പിന്തുണ',
    support_chat_welcome: 'നമസ്കാരം! ഞങ്ങൾക്ക് നിങ്ങളെ എങ്ങനെ സഹായിക്കാനാകും? നിങ്ങളുടെ ചോദ്യം ഇവിടെ അയക്കുക.',
    type_message: 'സന്ദേശം ടൈപ്പ് ചെയ്യുക...',

    // Notice Screen
    admin_update_title: 'ഏറ്റവും പുതിയ അഡ്മിൻ അപ്‌ഡേറ്റുകൾ',
    admin_update_sub: 'ഏറ്റവും പുതിയ അഡ്മിൻ അറിയിപ്പുകൾ കാണിക്കുന്നു',

    // Market Rate Screen
    play_type_header: 'കളി തരം',
    payout_header: 'പേഔട്ട് ₹10',
    wins_header: '₹10 വിജയം',

    // Game Screen
    play_game: 'ഗെയിം കളിക്കുക',
    market_closed_msg: 'മാർക്കറ്റ് അടച്ചിരിക്കുന്നു',

    // Bid Screen
    open_bid: 'ഓപ്പൺ ബിഡ്',
    close_bid: 'ക്ലോസ് ബിഡ്',
    digits_pana: 'അക്കങ്ങൾ / പാന',
    bid_amount: 'ബിഡ് തുക',
    add_bid: 'ബിഡ് ചേർക്കുക',
    submit_bid: 'ബിഡ് സമർപ്പിക്കുക',
    no_bids_for_date: 'ഈ തീയതിയിൽ ബിഡ് റെക്കോർഡുകൾ ലഭ്യമല്ല.',

    // Bank Details & Add Bank
    add_bank_title: 'ബാങ്ക് ചേർക്കുക',
    account_holder_name: 'അക്കൗണ്ട് ഉടമയുടെ പേര്',
    enter_account_holder: 'അക്കൗണ്ട് ഉടമയുടെ പേര് നൽകുക',
    account_number: 'അക്കൗണ്ട് നമ്പർ',
    enter_account_number: 'അക്കൗണ്ട് നമ്പർ നൽകുക',
    confirm_account_number: 'അക്കൗണ്ട് നമ്പർ സ്ഥിരീകരിക്കുക',
    enter_confirm_account: 'അക്കൗണ്ട് നമ്പർ വീണ്ടും നൽകുക',
    ifsc_code: 'IFSC കോഡ്',
    enter_ifsc: 'IFSC കോഡ് നൽകുക',
    bank_name: 'ബാങ്കിന്റെ പേര്',
    enter_bank_name: 'ബാങ്കിന്റെ പേര് നൽകുക',
    branch_address: 'ബ്രാഞ്ച് വിലാസം',
    enter_branch_address: 'ബ്രാഞ്ച് വിലാസം നൽകുക',
    submit: 'സമർപ്പിക്കുക',

    // Fund Transfer
    fund_transfer_title: 'ഫണ്ട് ട്രാൻസ്ഫർ',
    transfer_amount: 'കൈമാറ്റ തുക',
    enter_transfer_amount: 'തുക നൽകുക',
    receiver_phone: 'സ്വീകർത്താവിന്റെ മൊബൈൽ നമ്പർ',

    // Profile Screen
    settings: 'ക്രമീകരണങ്ങൾ',
    username_label: 'ഉപയോക്തൃനാമം',
    enter_username: 'ഉപയോക്തൃനാമം നൽകുക',
    update_and_save: 'അപ്ഡേറ്റ് ചെയ്ത് സംരക്ഷിക്കുക',
    email_label: 'ഇമെയിൽ',

    // Auth Screens
    welcome_back: 'വീണ്ടും സ്വാഗതം',
    login_continue: 'തുടരുന്നതിന് നിങ്ങളുടെ അക്കൗണ്ടിലേക്ക് ലോഗിൻ ചെയ്യുക',
    phone_label: 'മൊബൈൽ നമ്പർ',
    password_label: 'പാസ്‌വേഡ്',
    remember_me: 'എന്നെ ഓർക്കുക',
    create_account: 'അക്കൗണ്ട് ഉണ്ടാക്കുക',
    signup_get_started: 'ആരംഭിക്കുന്നതിന് സൈൻ അപ്പ് ചെയ്യുക',
    referral_code_optional: 'റഫറൽ കോഡ് (ഓപ്ഷണൽ)',
    register_btn: 'രജിസ്റ്റർ ചെയ്യുക',

    // Tabs
    tabs_home: 'ഹോം',
    tabs_inventory: 'ഇൻവെന്ററി',
    tabs_quotes: 'ഉദ്ധരണികൾ',
    tabs_notify: 'അറിയിപ്പ് കേന്ദ്രം',
    tabs_profile: 'പ്രൊഫൈൽ',

    // Added Dynamic Keys
    result_chart: "ഫല ചാർട്ട്",
    mobile_number: "മൊബൈൽ നമ്പർ",
    special_offer: "പ്രത്യേക ഓഫർ",
    wallet_balance: "വാലറ്റ് ബാലൻസ്",
    bonus_note: "മികച്ച ഓഫർ നേടി ഗെയിമുകൾ കളിക്കുക",
    special_notice: "പ്രത്യേക അറിയിപ്പ്",
    popup_default_msg: "എപ്പോഴും നിങ്ങളുടെ സേവനത്തിൽ!",
    profile_settings: "പ്രൊഫൈൽ ക്രമീകരണങ്ങൾ",
    account_security: "അക്കൗണ്ട് സുരക്ഷ",
    pwd_change_title: "പാസ്‌വേഡ് മാറ്റുക",
    pwd_current_label: "നിലവിലെ പാസ്‌വേഡ്",
    pwd_new_label: "പുതിയ പാസ്‌വേഡ്",
    pwd_confirm_label: "പുതിയ പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    pwd_current_required: "നിങ്ങളുടെ നിലവിലെ പാസ്‌വേഡ് നൽകുക.",
    pwd_new_required: "പുതിയ പാസ്‌വേഡ് നൽകുക.",
    pwd_min_chars: "പുതിയ പാസ്‌വേഡ് കുറഞ്ഞത് 6 പ്രതീകങ്ങൾ ആയിരിക്കണം.",
    pwd_confirm_required: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക.",
    pwd_mismatch: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",
    pwd_updated_success: "പാസ്‌വേഡ് വിജയകരമായി അപ്‌ഡേറ്റുചെയ്‌തു.",
    pwd_security_desc: "പതിവായി പാസ്‌വേഡ് മാറ്റി അക്കൗണ്ട് സുരക്ഷിതമായി സൂക്ഷിക്കുക.",
    pwd_update_btn: "പാസ്‌വേഡ് അപ്‌ഡേറ്റ് ചെയ്യുക",
    left_digit: "ഇടത് അക്കം",
    right_digit: "വലത് അക്കം",
    single_digit_bulk: "സിംഗിൾ ഡിജിറ്റ് ബൾക്ക്",
    htp_bank_title: "6. ബാങ്കും യുപിഐയും",
    htp_bank_body: "നിങ്ങളുടെ ബാങ്ക് അക്കൗണ്ടും യുപിഐ വിവരങ്ങളും പരിശോധിച്ച് ഉറപ്പാക്കുക. എപ്പോഴും നിങ്ങളുടെ സ്വന്തം പേരിലുള്ള പേയ്‌മെന്റ് അക്കൗണ്ട് ഉപയോഗിക്കുക.",
    htp_important_title: "7. പ്രധാനപ്പെട്ട വിവരങ്ങൾ",
    htp_important_body: "നിങ്ങളുടെ ലൊക്കേഷനിൽ അനുവാദമുണ്ടെങ്കിൽ മാത്രം ഈ സേവനം ഉപയോഗിക്കുക. എല്ലാ ബാധകമായ നിയമങ്ങളും പ്ലാറ്റ്‌ഫോം നിയമങ്ങളും പാലിക്കുക.",
    htp_footer_note: "സേവനം ഉപയോഗിക്കുന്നതിന് മുമ്പ് ബാധകമായ നിയമങ്ങൾ ശ്രദ്ധാപൂർവ്വം വായിക്കുക.",
    place_bet: "പന്തയം വെക്കുക",
    bid_points: "ബിഡ് പോയിന്റുകൾ",
    enter_points: "പോയിന്റുകൾ നൽകുക",
    bid_list: "ബിഡ് ലിസ്റ്റ്",
    no_bids_added: "ഇതുവരെ ബിഡുകൾ ചേർത്തിട്ടില്ല",
    digit: "അക്കം",
    points: "പോയിന്റുകൾ",
    bids_count_label: "ബിഡുകൾ",
    total_label: "ആകെ",
    session: "സെഷൻ",
    remove: "നീക്കം ചെയ്യുക",
    digit_pana: "അക്കം/പാന",
    account_blocked_msg: "ക്ഷമിക്കണം, നിങ്ങളുടെ അക്കൗണ്ട് ബ്ലോക്ക് ചെയ്‌തിരിക്കുന്നു",
    delete: "ഇല്ലാതാക്കുക",
    enter_digit: "അക്കങ്ങൾ നൽകുക",
    enter_pana: "പാന നൽകുക",
    pana: "പാന",
    type: "തരം",

  },
};

// Helper: wrap dictionary in Proxy with hierarchical fallback
function createFallbackDict(lang) {
  const dict = STRINGS[lang] || STRINGS.en || STRINGS.hi || {};
  return new Proxy(dict, {
    get(target, prop) {
      if (typeof prop === 'string') {
        if (prop in target && target[prop] !== undefined && target[prop] !== '') {
          return target[prop];
        }
        if (lang !== 'en' && STRINGS.en && STRINGS.en[prop]) {
          return STRINGS.en[prop];
        }
        if (STRINGS.hi && STRINGS.hi[prop]) {
          return STRINGS.hi[prop];
        }
      }
      return target[prop];
    },
  });
}

const LanguageContext = createContext({
  language: 'hi',
  isHindi: true,
  strings: createFallbackDict('hi'),
  changeLanguage: () => { },
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('hi');

  useEffect(() => {
    const loadLang = async () => {
      try {
        const saved = await AsyncStorage.getItem('appLanguage');
        if (saved && STRINGS[saved]) {
          setLanguageState(saved);
        } else {
          setLanguageState('hi');
        }
      } catch (e) {
        setLanguageState('hi');
      }
    };
    loadLang();
  }, []);

  const changeLanguage = useCallback(async (newLang) => {
    try {
      await AsyncStorage.setItem('appLanguage', newLang);
      await AsyncStorage.setItem('language', newLang);
      await AsyncStorage.setItem('language_selected', 'true');
      await langague_change(newLang);
    } catch (e) { }
    setLanguageState(newLang);
  }, []);

  const isHindi = language === 'hi';
  const strings = React.useMemo(() => createFallbackDict(language), [language]);

  const t = useCallback(
    (key) => {
      if (!key) return '';
      return strings[key] || key;
    },
    [strings]
  );

  const contextValue = React.useMemo(
    () => ({ language, isHindi, strings, changeLanguage, t }),
    [language, isHindi, strings, changeLanguage, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
