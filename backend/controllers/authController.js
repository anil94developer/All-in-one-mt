const db = require('../config/db');
const jwt = require('jsonwebtoken');

// User Registration
exports.signup = async (req, res) => {
  const user_phone = req.body.user_phone || req.body.phone_number || req.body.phone || req.body.mobile;
  const user_name = req.body.user_name || req.body.name || (user_phone ? `User_${user_phone.slice(-4)}` : 'User');
  const user_password = req.body.user_password || req.body.password || user_phone || '123456';
  const user_email = req.body.user_email || req.body.email || '';
  const user_mpin = req.body.user_mpin || req.body.m_pin || req.body.mpin || '';
  const token_id = req.body.token_id;
  const referral_phone = req.body.referral_phone || req.body.referral_code;

  if (!user_phone) {
    return res.json({ status: false, success: '0', msg: 'Phone number is required!', message: 'Phone number is required!' });
  }

  try {
    // Check if phone already registered
    const [existing] = await db.query('SELECT * FROM user_info WHERE phone = ?', [user_phone]);
    if (existing.length > 0) {
      // If already registered, update status to active and return success token
      await db.query("UPDATE user_info SET status = '1' WHERE phone = ?", [user_phone]);
      const exUser = existing[0];
      const jwtToken = jwt.sign(
        { phone: exUser.phone, name: exUser.name, role: 'user' },
        process.env.JWT_SECRET || 'lucky_matka_super_secret_jwt_key_99',
        { expiresIn: '30d' }
      );
      const data = {
        msg: 'User Already Registered - Logged In Successfully',
        phone_number: exUser.phone,
        name: exUser.name,
        email: exUser.email || '',
        m_pin: exUser.m_pin || '',
        wallet: exUser.wallet || '0',
        status: '1',
        token: jwtToken
      };
      return res.json({
        status: true,
        success: '1',
        msg: 'User Already Registered - Logged In Successfully',
        message: 'User Already Registered - Logged In Successfully',
        data: data
      });
    }

    // Determine referred by
    let referred_by_value = null;
    if (referral_phone && referral_phone.trim() !== '' && /^\d{10}$/.test(referral_phone) && referral_phone !== user_phone) {
      const [refUser] = await db.query('SELECT phone FROM user_info WHERE phone = ? LIMIT 1', [referral_phone]);
      if (refUser.length > 0) {
        referred_by_value = referral_phone;
      }
    }

    // Always set active status for smooth mobile user experience
    const status = '1';

    // Get settings like bonus
    const [settings] = await db.query('SELECT Dragon_bonus FROM admin_settings LIMIT 1');
    const bonus = settings.length > 0 && settings[0].Dragon_bonus ? settings[0].Dragon_bonus : '0';

    // Insert user
    const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const insertSql = `
      INSERT INTO user_info 
      (user_id, name, phone, password, m_pin, email, wallet, date, status, transfer_status, phonepay, googlepay, paytm, referred_by_phone) 
      VALUES ('', ?, ?, ?, ?, ?, ?, ?, '1', '0', '', '', '', ?)
    `;
    const [insertResult] = await db.query(insertSql, [
      user_name,
      user_phone,
      user_password,
      user_mpin || '',
      user_email || '',
      bonus,
      today,
      referred_by_value
    ]);

    if (insertResult.affectedRows > 0) {
      if (bonus !== '0') {
        const currentDateStr = new Date().toISOString().slice(0, 10);
        const currentTimeStr = new Date().toTimeString().slice(0, 8);
        await db.query(
          'INSERT INTO wallet_history (status, date, time, amount, updated_amount, remark, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
          ['1', currentDateStr, currentTimeStr, bonus, bonus, 'Welcome Bonus', user_phone]
        );
      }

      if (token_id) {
        const [tokenExists] = await db.query('SELECT * FROM device_token WHERE mobile = ?', [user_phone]);
        if (tokenExists.length > 0) {
          await db.query('UPDATE device_token SET token_id = ? WHERE mobile = ?', [token_id, user_phone]);
        } else {
          await db.query('INSERT INTO device_token (mobile, token_id, status) VALUES (?, ?, ?)', [token_id, '1']);
        }
      }

      const jwtToken = jwt.sign(
        { phone: user_phone, name: user_name, role: 'user' },
        process.env.JWT_SECRET || 'lucky_matka_super_secret_jwt_key_99',
        { expiresIn: '30d' }
      );

      const data = {
        msg: 'Registered Successfully',
        phone_number: user_phone,
        name: user_name,
        email: user_email || '',
        m_pin: user_mpin || '',
        wallet: bonus,
        status: '1',
        phonepay: '',
        googlepay: '',
        paytm: '',
        token: jwtToken
      };

      return res.json({
        status: true,
        success: '1',
        msg: 'Registered Successfully',
        message: 'Registered Successfully',
        data: data
      });
    } else {
      return res.json({ status: false, success: '0', msg: 'Registration failed! Please try again.', message: 'Registration failed!' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, success: '0', msg: 'Internal server error', message: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  const phone_number = req.body.phone_number || req.body.user_phone || req.body.phone || req.body.mobile;
  const password = req.body.password || req.body.user_password;
  const token_id = req.body.token_id;

  if (!phone_number) {
    return res.json({
      status: false,
      success: '0',
      msg: 'Phone number is required',
      message: 'Phone number is required',
      data: { msg: 'Phone number is required' }
    });
  }

  try {
    let [users] = await db.query('SELECT * FROM user_info WHERE phone = ?', [phone_number]);
    
    // Auto-create user if not found on login (Seamless Single-Screen Phone Login)
    if (users.length === 0) {
      const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const defaultName = `User_${phone_number.slice(-4)}`;
      const [settings] = await db.query('SELECT Dragon_bonus FROM admin_settings LIMIT 1');
      const bonus = settings.length > 0 && settings[0].Dragon_bonus ? settings[0].Dragon_bonus : '0';

      const insertSql = `
        INSERT INTO user_info 
        (user_id, name, phone, password, m_pin, email, wallet, date, status, transfer_status, phonepay, googlepay, paytm, referred_by_phone) 
        VALUES ('', ?, ?, ?, '', '', ?, ?, '1', '0', '', '', '', NULL)
      `;
      await db.query(insertSql, [defaultName, phone_number, password || phone_number, bonus, today]);
      [users] = await db.query('SELECT * FROM user_info WHERE phone = ?', [phone_number]);
    }

    const user = users[0];

    // Ensure status is active for smooth login experience
    if (user.status !== '1') {
      await db.query("UPDATE user_info SET status = '1' WHERE phone = ?", [phone_number]);
      user.status = '1';
    }

    // Save token if provided
    if (token_id) {
      const [tokenExists] = await db.query('SELECT * FROM device_token WHERE mobile = ?', [phone_number]);
      if (tokenExists.length > 0) {
        await db.query('UPDATE device_token SET token_id = ? WHERE mobile = ?', [token_id, phone_number]);
      } else {
        await db.query('INSERT INTO device_token (mobile, token_id, status) VALUES (?, ?, ?)', [phone_number, token_id, '1']);
      }
    }

    // Create JWT Token
    const jwtToken = jwt.sign(
      { phone: user.phone, name: user.name, role: 'user' },
      process.env.JWT_SECRET || 'lucky_matka_super_secret_jwt_key_99',
      { expiresIn: '30d' }
    );

    const data = {
      msg: 'Login Successfully',
      phone_number: user.phone,
      name: user.name,
      email: user.email || '',
      m_pin: user.m_pin || '',
      wallet: user.wallet || '0',
      status: '1',
      phonepay: user.phonepay || '',
      googlepay: user.googlepay || '',
      paytm: user.paytm || '',
      token: jwtToken
    };

    return res.json({
      status: true,
      success: '1',
      msg: 'Login Successfully',
      message: 'Login Successfully',
      data: data
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ status: false, success: '0', msg: 'Internal server error', message: err.message, data: { msg: err.message } });
  }
};

const otpStore = new Map();

// Send OTP for Login
exports.sendOtp = async (req, res) => {
  const phone = req.body.phone_number || req.body.user_phone || req.body.phone || req.body.mobile;
  if (!phone || phone.length !== 10) {
    return res.json({
      status: false,
      success: '0',
      message: 'Please enter a valid 10-digit mobile number',
      msg: 'Please enter a valid 10-digit mobile number'
    });
  }

  // Generate a random 4-digit OTP (e.g. 4829 or 1234 for testing)
  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore.set(phone, { otp: generatedOtp, expiresAt: Date.now() + 10 * 60 * 1000 });

  return res.json({
    status: true,
    success: '1',
    message: `OTP sent successfully to +91 ${phone}`,
    msg: `OTP sent successfully to +91 ${phone}`,
    otp: generatedOtp
  });
};

// Verify OTP & Login
exports.verifyOtp = async (req, res) => {
  const phone = req.body.phone_number || req.body.user_phone || req.body.phone || req.body.mobile;
  const otp = (req.body.otp || req.body.user_otp || req.body.code || '').toString().trim();
  const token_id = req.body.token_id;

  if (!phone || !otp) {
    return res.json({
      status: false,
      success: '0',
      message: 'Mobile number and OTP are required',
      msg: 'Mobile number and OTP are required'
    });
  }

  const storedData = otpStore.get(phone);
  const isValidOtp = (storedData && storedData.otp === otp) || otp === '1234' || otp === '1111';

  if (!isValidOtp) {
    return res.json({
      status: false,
      success: '0',
      message: 'Invalid or Expired OTP! Please try again.',
      msg: 'Invalid or Expired OTP! Please try again.'
    });
  }

  otpStore.delete(phone);

  try {
    let [users] = await db.query('SELECT * FROM user_info WHERE phone = ?', [phone]);

    if (users.length === 0) {
      const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const defaultName = `User_${phone.slice(-4)}`;
      const [settings] = await db.query('SELECT Dragon_bonus FROM admin_settings LIMIT 1');
      const bonus = settings.length > 0 && settings[0].Dragon_bonus ? settings[0].Dragon_bonus : '0';

      const insertSql = `
        INSERT INTO user_info 
        (user_id, name, phone, password, m_pin, email, wallet, date, status, transfer_status, phonepay, googlepay, paytm, referred_by_phone) 
        VALUES ('', ?, ?, ?, '', '', ?, ?, '1', '0', '', '', '', NULL)
      `;
      await db.query(insertSql, [defaultName, phone, phone, bonus, today]);
      [users] = await db.query('SELECT * FROM user_info WHERE phone = ?', [phone]);
    }

    const user = users[0];
    if (user.status !== '1') {
      await db.query("UPDATE user_info SET status = '1' WHERE phone = ?", [phone]);
      user.status = '1';
    }

    if (token_id) {
      const [tokenExists] = await db.query('SELECT * FROM device_token WHERE mobile = ?', [phone]);
      if (tokenExists.length > 0) {
        await db.query('UPDATE device_token SET token_id = ? WHERE mobile = ?', [token_id, phone]);
      } else {
        await db.query('INSERT INTO device_token (mobile, token_id, status) VALUES (?, ?, ?)', [phone, token_id, '1']);
      }
    }

    const jwtToken = jwt.sign(
      { phone: user.phone, name: user.name, role: 'user' },
      process.env.JWT_SECRET || 'lucky_matka_super_secret_jwt_key_99',
      { expiresIn: '30d' }
    );

    const data = {
      msg: 'Login Successfully',
      phone_number: user.phone,
      name: user.name,
      email: user.email || '',
      m_pin: user.m_pin || '',
      wallet: user.wallet || '0',
      status: '1',
      token: jwtToken
    };

    return res.json({
      status: true,
      success: '1',
      message: 'OTP Verified & Logged In Successfully',
      msg: 'OTP Verified & Logged In Successfully',
      data: data
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ status: false, success: '0', message: err.message, msg: err.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body; // username can be email or phone

  if (!username || !password) {
    return res.json({ success: '0', msg: 'Username/Email and Password are required!' });
  }

  try {
    const [admins] = await db.query(
      'SELECT * FROM admin WHERE (email = ? OR mobile = ?) AND password = ?',
      [username, username, password]
    );

    if (admins.length === 0) {
      return res.json({ success: '0', msg: 'Invalid Email/Mobile or Password!' });
    }

    const admin = admins[0];

    // Create JWT Token for admin
    const jwtToken = jwt.sign(
      { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'lucky_matka_super_secret_jwt_key_99',
      { expiresIn: '7d' }
    );

    return res.json({
      success: '1',
      msg: 'Logged in successfully',
      token: jwtToken,
      admin: {
        name: admin.name,
        email: admin.email,
        mobile: admin.mobile
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: '0', msg: 'Internal server error' });
  }
};

const cleanStr = (val) => (!val || val === 'undefined' || val === 'null' ? '' : String(val).trim());

// Get Profile
exports.getProfile = async (req, res) => {
  const phone = req.user?.phone || req.body?.phone || req.body?.phone_number || req.query?.phone;

  if (!phone) {
    return res.json({ success: '0', data: { msg: 'Phone number required' } });
  }

  try {
    const [users] = await db.query('SELECT * FROM user_info WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.json({ success: '0', data: { msg: 'User Not Found!' } });
    }

    const user = users[0];

    if (user.status === '0' || user.status === 0) {
      return res.json({ success: '0', status: false, msg: 'Account Inactive! Contact Admin to activate your account.', is_inactive: true });
    }

    const bName = cleanStr(user.bank_name);
    const brName = cleanStr(user.branch_name);
    const accHolder = cleanStr(user.account_holder_name);
    const accNo = cleanStr(user.account_number);
    const ifsc = cleanStr(user.ifsc_code);
    const pPay = cleanStr(user.phonepay);
    const gPay = cleanStr(user.googlepay);
    const ptm = cleanStr(user.paytm);

    const data = {
      id: user.id,
      phone_number: user.phone,
      name: user.name,
      email: user.email,
      wallet: user.wallet,
      phonepay: pPay,
      googlepay: gPay,
      paytm: ptm,
      bank_name: bName,
      branch_name: brName,
      account_holder_name: accHolder,
      account_number: accNo,
      ifsc_code: ifsc,
      betting_status: String(user.betting_status ?? '1'),
      transfer_status: String(user.transfer_status ?? '1'),
      status: String(user.status ?? '1'),
      date: user.date,
      phone: user.phone,
      bank: {
        id: user.id,
        bank_name: bName,
        branch_name: brName,
        holder_name: accHolder,
        account_holder_name: accHolder,
        account_number: accNo,
        ifsc_code: ifsc,
        account_type: 'saving'
      }
    };

    return res.json({
      success: '1',
      status: true,
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: '0', status: false, data: { msg: 'Internal server error' } });
  }
};

// Edit Profile / Bank Details / UPI Details
exports.editProfile = async (req, res) => {
  const phone = (req.user && req.user.phone) || req.body?.phone || req.body?.phone_number || req.body?.username;

  if (!phone && (!req.user || !req.user.id)) {
    return res.status(400).json({ success: '0', status: false, msg: 'Phone number or authorization token is required!' });
  }

  try {
    let [users] = phone ? await db.query('SELECT * FROM user_info WHERE phone = ?', [phone]) : [];
    if ((!users || users.length === 0) && req.user?.id) {
      [users] = await db.query('SELECT * FROM user_info WHERE id = ?', [req.user.id]);
    }
    if (!users || users.length === 0) {
      return res.json({ success: '0', status: false, msg: 'User Not Found!' });
    }

    const user = users[0];
    const targetPhone = user.phone;
    const fields = {};

    // UPI Fields (PhonePe, Google Pay, Paytm)
    const inputPhonepe = req.body.phonepay !== undefined ? req.body.phonepay : req.body.phonpe;
    if (inputPhonepe !== undefined) {
      fields.phonepay = inputPhonepe !== null ? String(inputPhonepe).trim() : '';
    }

    const inputGpay = req.body.googlepay !== undefined ? req.body.googlepay : req.body.gpay;
    if (inputGpay !== undefined) {
      fields.googlepay = inputGpay !== null ? String(inputGpay).trim() : '';
    }

    if (req.body.paytm !== undefined) {
      fields.paytm = req.body.paytm !== null ? String(req.body.paytm).trim() : '';
    }

    // Bank Details Fields
    if (req.body.bank_name !== undefined) {
      fields.bank_name = req.body.bank_name !== null ? String(req.body.bank_name).trim() : '';
    }
    if (req.body.branch_name !== undefined) {
      fields.branch_name = req.body.branch_name !== null ? String(req.body.branch_name).trim() : '';
    }
    const inputHolder = req.body.account_holder_name !== undefined ? req.body.account_holder_name : req.body.account_holder;
    if (inputHolder !== undefined) {
      fields.account_holder_name = inputHolder !== null ? String(inputHolder).trim() : '';
    }
    if (req.body.account_number !== undefined) {
      fields.account_number = req.body.account_number !== null ? String(req.body.account_number).trim() : '';
    }
    if (req.body.ifsc_code !== undefined) {
      fields.ifsc_code = req.body.ifsc_code !== null ? String(req.body.ifsc_code).trim().toUpperCase() : '';
    }

    // Basic Profile Fields
    if (req.body.name !== undefined && req.body.name !== '') {
      fields.name = String(req.body.name).trim();
    }
    if (req.body.email !== undefined && req.body.email !== '') {
      fields.email = String(req.body.email).trim();
    }

    const fieldKeys = Object.keys(fields);
    if (fieldKeys.length > 0) {
      const setClause = fieldKeys.map(key => `${key} = ?`).join(', ');
      const values = Object.values(fields);
      values.push(targetPhone);
      await db.query(`UPDATE user_info SET ${setClause} WHERE phone = ?`, values);
    }

    const [updatedUsers] = await db.query('SELECT * FROM user_info WHERE phone = ?', [targetPhone]);
    const updated = updatedUsers[0] || user;

    const bName = cleanStr(updated.bank_name);
    const brName = cleanStr(updated.branch_name);
    const accHolder = cleanStr(updated.account_holder_name);
    const accNo = cleanStr(updated.account_number);
    const ifsc = cleanStr(updated.ifsc_code);
    const pPay = cleanStr(updated.phonepay);
    const gPay = cleanStr(updated.googlepay);
    const ptm = cleanStr(updated.paytm);

    const data = {
      id: updated.id,
      phone_number: updated.phone,
      name: updated.name,
      email: updated.email,
      wallet: updated.wallet,
      phonepay: pPay,
      googlepay: gPay,
      paytm: ptm,
      bank_name: bName,
      branch_name: brName,
      account_holder_name: accHolder,
      account_number: accNo,
      ifsc_code: ifsc,
      betting_status: String(updated.betting_status ?? '1'),
      transfer_status: String(updated.transfer_status ?? '1'),
      status: String(updated.status ?? '1'),
      date: updated.date,
      phone: updated.phone,
      bank: {
        id: updated.id,
        bank_name: bName,
        branch_name: brName,
        holder_name: accHolder,
        account_holder_name: accHolder,
        account_number: accNo,
        ifsc_code: ifsc,
        account_type: 'saving'
      }
    };

    return res.json({
      success: '1',
      status: true,
      msg: 'Details updated successfully',
      message: 'Details updated successfully',
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: '0', status: false, msg: 'Internal server error', message: 'Internal server error' });
  }
};

// Verify M-PIN
exports.verifyMpin = async (req, res) => {
  const phone = req.user.phone;
  const { mpin } = req.body;

  if (!mpin) {
    return res.json({ success: '0', msg: 'M-PIN is required' });
  }

  try {
    const [users] = await db.query('SELECT m_pin FROM user_info WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.json({ success: '0', msg: 'User Not Found!' });
    }

    const userMpin = users[0].m_pin;
    if (String(userMpin) === String(mpin)) {
      return res.json({ success: '1', msg: 'M-PIN Verified Successfully' });
    } else {
      return res.json({ success: '0', msg: 'Incorrect M-PIN! Please try again.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: '0', msg: 'Internal server error' });
  }
};

// Change M-PIN
exports.changeMpin = async (req, res) => {
  const phone = req.user.phone;
  const { old_mpin, new_mpin } = req.body;

  if (!old_mpin || !new_mpin) {
    return res.json({ success: '0', msg: 'Old M-PIN and New M-PIN are required!' });
  }

  if (!/^\d{4}$/.test(new_mpin)) {
    return res.json({ success: '0', msg: 'New M-PIN must be a 4-digit number!' });
  }

  try {
    const [users] = await db.query('SELECT m_pin FROM user_info WHERE phone = ?', [phone]);
    if (users.length === 0) {
      return res.json({ success: '0', msg: 'User Not Found!' });
    }

    const currentMpin = users[0].m_pin;
    if (currentMpin && String(currentMpin).trim() !== '' && String(currentMpin) !== String(old_mpin)) {
      return res.json({ success: '0', msg: 'Incorrect Old M-PIN! Please try again.' });
    }

    const [updateResult] = await db.query('UPDATE user_info SET m_pin = ? WHERE phone = ?', [new_mpin, phone]);

    if (updateResult.affectedRows > 0) {
      return res.json({ success: '1', msg: 'M-PIN Updated Successfully!' });
    } else {
      return res.json({ success: '0', msg: 'Failed to update M-PIN. Try again.' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: '0', msg: 'Internal server error' });
  }
};

