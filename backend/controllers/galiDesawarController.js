const db = require('../config/db');

// Helper: Get Indian Standard Time (IST) Date
function getISTDate() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs + 5.5 * 3600000);
}

function getFormattedISTDate(d = getISTDate()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Convert "06:15 PM" to minutes from 00:00 (0..1439)
function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const s = timeStr.trim().toLowerCase();
  const match = s.match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3];

  if (modifier === 'pm' && hours < 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// Check if Gali market is currently open for placing bets
function checkIsMarketOpen(game) {
  if (game.status === 0 || game.status === '0') return false;
  if (game.market_status === 0 || game.market_status === '0') return false;

  const closeTimeStr = game.close_time;
  if (!closeTimeStr) return true; // If no close time set, default open if market_status is 1

  const closeMins = parseTimeToMinutes(closeTimeStr);
  if (closeMins === null) return true;

  const nowIST = getISTDate();
  const currentMins = nowIST.getHours() * 60 + nowIST.getMinutes();

  const openTimeStr = game.open_time;
  const openMins = parseTimeToMinutes(openTimeStr);

  // If openMins and closeMins:
  // e.g. Open 04:30 PM (990), Close 04:15 PM (975) -> Overnight or day window
  // Standard Gali Desawar markets accept bets throughout the day up until close_time
  // If close time is 03:15 AM (195 mins) and result is 05:00 AM (300 mins):
  // Bets stop at 03:15 AM. Between 03:15 AM and 05:00 AM it's closed. From 05:00 AM onwards (or next cycle), it opens for the next day.
  if (openMins !== null && closeMins < openMins) {
    // Overnight close time e.g. close 03:15 AM, result 05:00 AM
    if (currentMins >= closeMins && currentMins < openMins) {
      return false; // Between close and result declaration
    }
    return true;
  }

  // Normal day close e.g. close 06:00 PM (1080 mins), open/result 06:15 PM (1095 mins)
  if (currentMins > closeMins && (openMins === null || currentMins < openMins + 60)) {
    return false;
  }

  return true;
}

// ==========================================
// 1. ADMIN: GAMES MANAGEMENT (CRUD)
// ==========================================

// GET /api/admin/gali-desawar/games
exports.getAdminGames = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM galidisswar_game_name ORDER BY id ASC');
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in getAdminGames:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/gali-desawar/games
exports.addAdminGame = async (req, res) => {
  try {
    const { game_name, game_name_hindi, open_time, close_time, status, market_status } = req.body;
    if (!game_name || !game_name.trim()) {
      return res.status(400).json({ success: '0', msg: 'Game name is required' });
    }

    const [result] = await db.query(
      `INSERT INTO galidisswar_game_name 
       (game_name, game_name_hindi, open_time, close_time, status, market_status, action) 
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [
        game_name.trim(),
        (game_name_hindi || '').trim(),
        (open_time || '11:00 PM').trim(),
        (close_time || '10:45 PM').trim(),
        status !== undefined ? Number(status) : 1,
        market_status !== undefined ? Number(market_status) : 1,
      ]
    );

    return res.json({
      success: '1',
      msg: 'Gali Desawar game added successfully',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Error in addAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// PUT /api/admin/gali-desawar/games/:id
exports.updateAdminGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { game_name, game_name_hindi, open_time, close_time, status, market_status } = req.body;

    if (!id) {
      return res.status(400).json({ success: '0', msg: 'Game ID is required' });
    }

    await db.query(
      `UPDATE galidisswar_game_name 
       SET game_name = ?, game_name_hindi = ?, open_time = ?, close_time = ?, status = ?, market_status = ? 
       WHERE id = ?`,
      [
        (game_name || '').trim(),
        (game_name_hindi || '').trim(),
        (open_time || '').trim(),
        (close_time || '').trim(),
        status !== undefined ? Number(status) : 1,
        market_status !== undefined ? Number(market_status) : 1,
        id,
      ]
    );

    return res.json({ success: '1', msg: 'Game updated successfully' });
  } catch (err) {
    console.error('Error in updateAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// DELETE /api/admin/gali-desawar/games/:id
exports.deleteAdminGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: '0', msg: 'Game ID is required' });
    }

    await db.query('DELETE FROM galidisswar_game_name WHERE id = ?', [id]);
    return res.json({ success: '1', msg: 'Game deleted successfully' });
  } catch (err) {
    console.error('Error in deleteAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/gali-desawar/games/toggle
exports.toggleGameStatus = async (req, res) => {
  try {
    const { id, field, value } = req.body;
    if (!id || !['status', 'market_status'].includes(field)) {
      return res.status(400).json({ success: '0', msg: 'Valid id and field are required' });
    }

    await db.query(`UPDATE galidisswar_game_name SET ${field} = ? WHERE id = ?`, [Number(value), id]);
    return res.json({ success: '1', msg: `${field} updated successfully` });
  } catch (err) {
    console.error('Error in toggleGameStatus:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 2. ADMIN: RESULT DECLARE & WIN/LOSS SETTLEMENT
// ==========================================

// POST /api/admin/gali-desawar/declare-result
exports.declareResult = async (req, res) => {
  const { game_name, result_date, declare_result } = req.body;

  if (!game_name || !result_date || declare_result === undefined || declare_result === null) {
    return res.status(400).json({ success: '0', msg: 'Game name, date, and 2-digit result are required' });
  }

  const rawNum = String(declare_result).trim();
  if (rawNum.length < 1 || rawNum.length > 2 || isNaN(rawNum)) {
    return res.status(400).json({ success: '0', msg: 'Result must be a 1 or 2 digit number (e.g., 05, 73)' });
  }

  // Pad to 2 digits (e.g. "5" -> "05")
  const formattedResult = rawNum.padStart(2, '0');
  const leftDigit = formattedResult[0];
  const rightDigit = formattedResult[1];

  try {
    // 1. Fetch Rates for Left Digit, Right Digit, and Jodi
    const [rateRows] = await db.query('SELECT * FROM galidisswar_game_rates WHERE status = 1');
    const rateMap = {
      'Left Digit': 9.5,
      'Right Digit': 9.5,
      'Jodi Digit': 95,
    };
    rateRows.forEach((r) => {
      const min = parseFloat(r.min_value) || 10;
      const max = parseFloat(r.max_value) || (r.game_type === 'Jodi Digit' ? 950 : 95);
      rateMap[r.game_type] = max / min;
    });

    // 2. Insert or update in galidisswar_result_history
    const [existing] = await db.query(
      'SELECT id FROM galidisswar_result_history WHERE game_name = ? AND result_date = ?',
      [game_name, result_date]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE galidisswar_result_history 
         SET declare_result = ?, left_digit = ?, right_digit = ?, numbers = ? 
         WHERE id = ?`,
        [formattedResult, leftDigit, rightDigit, formattedResult, existing[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO galidisswar_result_history 
         (game_name, result_date, declare_result, left_digit, right_digit, numbers) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [game_name, result_date, formattedResult, leftDigit, rightDigit, formattedResult]
      );
    }

    // 3. Process Pending Bids for this Game and Date
    const [pendingBids] = await db.query(
      `SELECT * FROM galidisswar_bid_history 
       WHERE TRIM(game_name) = TRIM(?) AND date = ? AND status = 'pending'`,
      [game_name, result_date]
    );

    let winnersCount = 0;
    let totalPayout = 0;
    const nowIST = getISTDate();
    const currentDateStr = getFormattedISTDate(nowIST);
    const currentTimeStr = nowIST.toTimeString().slice(0, 8);

    for (const bid of pendingBids) {
      const bidDigit = String(bid.digit || '').trim();
      const bidPoints = parseFloat(bid.points) || 0;
      const gType = (bid.game_type || '').trim();
      let isWin = false;
      let multiplier = 9.5;

      if (gType.toLowerCase().includes('left')) {
        isWin = bidDigit === leftDigit;
        multiplier = rateMap['Left Digit'] || 9.5;
      } else if (gType.toLowerCase().includes('right')) {
        isWin = bidDigit === rightDigit;
        multiplier = rateMap['Right Digit'] || 9.5;
      } else if (gType.toLowerCase().includes('jodi')) {
        isWin = bidDigit === formattedResult;
        multiplier = rateMap['Jodi Digit'] || 95;
      }

      if (isWin && bidPoints > 0) {
        winnersCount++;
        const winAmount = Math.round(bidPoints * multiplier);
        totalPayout += winAmount;

        // A. Credit user wallet in user_info
        const phone = bid.username;
        await db.query('UPDATE user_info SET wallet = wallet + ? WHERE phone = ?', [winAmount, phone]);

        // Get updated balance
        const [[userWalletRow]] = await db.query('SELECT wallet FROM user_info WHERE phone = ?', [phone]);
        const updatedBal = userWalletRow ? userWalletRow.wallet : 0;

        // B. Insert into galidisswar_winning_report
        await db.query(
          `INSERT INTO galidisswar_winning_report 
           (username, bid_id, game_name, game_type, session, open_pana, open_digit, close_pana, close_digit, points_action, digit, winning_points, date) 
           VALUES (?, ?, ?, ?, 'Close', 'NA', ?, 'NA', ?, 1, ?, ?, ?)`,
          [phone, bid.id, game_name, gType, leftDigit, rightDigit, bidDigit, winAmount, result_date]
        );

        // C. Insert into wallet_history
        await db.query(
          `INSERT INTO wallet_history 
           (status, date, time, amount, updated_amount, remark, phone_number) 
           VALUES ('1', ?, ?, ?, ?, ?, ?)`,
          [currentDateStr, currentTimeStr, winAmount, updatedBal, `Gali Desawar Win: ${game_name} (${formattedResult})`, phone]
        );

        // D. Update bid record to 'win'
        await db.query(
          'UPDATE galidisswar_bid_history SET status = "win", win_amount = ? WHERE id = ?',
          [winAmount, bid.id]
        );
      } else {
        // Mark as 'loss'
        await db.query(
          'UPDATE galidisswar_bid_history SET status = "loss" WHERE id = ?',
          [bid.id]
        );
      }
    }

    return res.json({
      success: '1',
      msg: `Result declared successfully! Result: ${formattedResult}. Winners: ${winnersCount}, Total payout credited: ₹${totalPayout}`,
      declared_result: formattedResult,
      left_digit: leftDigit,
      right_digit: rightDigit,
      winners_count: winnersCount,
      total_payout: totalPayout,
    });
  } catch (err) {
    console.error('Error in declareResult:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// GET /api/admin/gali-desawar/results
exports.getResultsList = async (req, res) => {
  try {
    const { game_name, date, limit = 100 } = req.query;
    let sql = 'SELECT * FROM galidisswar_result_history WHERE 1=1';
    const params = [];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }
    if (date) {
      sql += ' AND result_date = ?';
      params.push(date);
    }

    sql += ' ORDER BY result_date DESC, id DESC LIMIT ?';
    params.push(Number(limit) || 100);

    const [rows] = await db.query(sql, params);
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in getResultsList:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// DELETE /api/admin/gali-desawar/results/:id - Revert Declared Result
exports.revertResult = async (req, res) => {
  try {
    const { id } = req.params;
    const [[resRow]] = await db.query('SELECT * FROM galidisswar_result_history WHERE id = ?', [id]);
    if (!resRow) {
      return res.status(404).json({ success: '0', msg: 'Result entry not found' });
    }

    const { game_name, result_date } = resRow;

    // 1. Fetch winning records to reverse wallets
    const [wins] = await db.query(
      'SELECT * FROM galidisswar_winning_report WHERE TRIM(game_name) = TRIM(?) AND date = ?',
      [game_name, result_date]
    );

    const nowIST = getISTDate();
    const currentDateStr = getFormattedISTDate(nowIST);
    const currentTimeStr = nowIST.toTimeString().slice(0, 8);

    for (const w of wins) {
      const winPts = parseFloat(w.winning_points) || 0;
      const phone = w.username;
      if (winPts > 0) {
        await db.query('UPDATE user_info SET wallet = GREATEST(0, wallet - ?) WHERE phone = ?', [winPts, phone]);

        const [[uRow]] = await db.query('SELECT wallet FROM user_info WHERE phone = ?', [phone]);
        const updatedBal = uRow ? uRow.wallet : 0;

        await db.query(
          `INSERT INTO wallet_history 
           (status, date, time, amount, updated_amount, remark, phone_number) 
           VALUES ('0', ?, ?, ?, ?, ?, ?)`,
          [currentDateStr, currentTimeStr, winPts, updatedBal, `Revert Gali Result: ${game_name}`, phone]
        );
      }
    }

    // 2. Reset bids back to 'pending'
    await db.query(
      'UPDATE galidisswar_bid_history SET status = "pending", win_amount = 0 WHERE TRIM(game_name) = TRIM(?) AND date = ?',
      [game_name, result_date]
    );

    // 3. Delete winning records
    await db.query('DELETE FROM galidisswar_winning_report WHERE TRIM(game_name) = TRIM(?) AND date = ?', [game_name, result_date]);

    // 4. Delete result record
    await db.query('DELETE FROM galidisswar_result_history WHERE id = ?', [id]);

    return res.json({
      success: '1',
      msg: `Result for ${game_name} on ${result_date} reverted successfully. Wallets and bids restored to pending state.`,
    });
  } catch (err) {
    console.error('Error in revertResult:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 3. ADMIN: BET HISTORY REPORT
// ==========================================

// GET /api/admin/gali-desawar/bids
exports.getAdminBidHistory = async (req, res) => {
  try {
    const { game_name, date, username, status, page = 1, limit = 50 } = req.query;
    let sql = 'SELECT * FROM galidisswar_bid_history WHERE 1=1';
    const params = [];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }
    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    if (username && username.trim()) {
      sql += ' AND username LIKE ?';
      params.push(`%${username.trim()}%`);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    // Summary count and sum
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total_count, COALESCE(SUM(points), 0) as total_points, COALESCE(SUM(win_amount), 0) as total_win_amount');
    const [[summary]] = await db.query(countSql, params);

    const offset = (Number(page) - 1) * Number(limit);
    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(sql, params);

    return res.json({
      success: '1',
      data: rows,
      summary: {
        total_count: summary.total_count || 0,
        total_points: summary.total_points || 0,
        total_win_amount: summary.total_win_amount || 0,
      },
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error in getAdminBidHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 4. ADMIN: WINNING REPORT
// ==========================================

// GET /api/admin/gali-desawar/wins
exports.getAdminWinHistory = async (req, res) => {
  try {
    const { game_name, date, username, page = 1, limit = 50 } = req.query;
    let sql = 'SELECT * FROM galidisswar_winning_report WHERE 1=1';
    const params = [];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }
    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    if (username && username.trim()) {
      sql += ' AND username LIKE ?';
      params.push(`%${username.trim()}%`);
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total_count, COALESCE(SUM(winning_points), 0) as total_win_amount');
    const [[summary]] = await db.query(countSql, params);

    const offset = (Number(page) - 1) * Number(limit);
    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const [rows] = await db.query(sql, params);

    return res.json({
      success: '1',
      data: rows,
      summary: {
        total_count: summary.total_count || 0,
        total_win_amount: summary.total_win_amount || 0,
      },
      page: Number(page),
      limit: Number(limit),
    });
  } catch (err) {
    console.error('Error in getAdminWinHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 5. ADMIN: SELL / RISK ANALYSIS REPORT
// ==========================================

// GET /api/admin/gali-desawar/sell-report
exports.getAdminSellReport = async (req, res) => {
  try {
    const { game_name, date } = req.query;
    const queryDate = date || getFormattedISTDate();

    let sql = 'SELECT game_type, digit, COUNT(*) as bid_count, SUM(points) as total_points FROM galidisswar_bid_history WHERE date = ?';
    const params = [queryDate];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }

    sql += ' GROUP BY game_type, digit ORDER BY total_points DESC';
    const [rows] = await db.query(sql, params);

    return res.json({
      success: '1',
      date: queryDate,
      game_name: game_name || 'all',
      data: rows,
    });
  } catch (err) {
    console.error('Error in getAdminSellReport:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 6. RATES MANAGEMENT
// ==========================================

// GET /api/admin/gali-desawar/rates (also used by User API)
exports.getGaliRates = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM galidisswar_game_rates ORDER BY id ASC');
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in getGaliRates:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/gali-desawar/rates
exports.updateGaliRates = async (req, res) => {
  try {
    const { rates } = req.body;
    if (!Array.isArray(rates)) {
      return res.status(400).json({ success: '0', msg: 'Rates array is required' });
    }

    for (const r of rates) {
      if (r.id) {
        await db.query(
          'UPDATE galidisswar_game_rates SET min_value = ?, max_value = ?, status = ? WHERE id = ?',
          [r.min_value || '10', r.max_value || '95', r.status !== undefined ? Number(r.status) : 1, r.id]
        );
      }
    }

    return res.json({ success: '1', msg: 'Rates updated successfully' });
  } catch (err) {
    console.error('Error in updateGaliRates:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 7. USER / MOBILE APP APIS
// ==========================================

// GET /api/gali-desawar/games (Public / User)
exports.getUserGames = async (req, res) => {
  try {
    const [games] = await db.query('SELECT * FROM galidisswar_game_name WHERE status = 1 OR status = "1" OR status IS NULL ORDER BY id ASC');

    const todayStr = getFormattedISTDate();
    const yesterdayDate = new Date(getISTDate().getTime() - 24 * 3600000);
    const yesterdayStr = getFormattedISTDate(yesterdayDate);

    // Fetch today's and yesterday's results
    const [results] = await db.query(
      'SELECT game_name, result_date, declare_result FROM galidisswar_result_history WHERE result_date IN (?, ?) ORDER BY result_date DESC',
      [todayStr, yesterdayStr]
    );

    const resultMap = {};
    results.forEach((r) => {
      const gKey = r.game_name.trim().toLowerCase();
      if (!resultMap[gKey]) {
        resultMap[gKey] = r;
      }
    });

    const enrichedGames = games.map((g) => {
      const isOpen = checkIsMarketOpen(g);
      const gKey = g.game_name.trim().toLowerCase();
      const resEntry = resultMap[gKey];
      const resultVal = resEntry ? resEntry.declare_result : '**';

      return {
        id: g.id,
        name: g.game_name,
        game_name: g.game_name,
        game_name_hindi: g.game_name_hindi || g.game_name,
        open_time: g.open_time,
        close_time: g.close_time,
        time: g.open_time,
        result: resultVal,
        isOpen: isOpen,
        market_status: isOpen ? '1' : '0',
        status: g.status,
      };
    });

    return res.json({
      status: true,
      success: '1',
      data: enrichedGames,
      markets: enrichedGames,
      games: enrichedGames,
    });
  } catch (err) {
    console.error('Error in getUserGames:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/gali-desawar/place-bid (Protected User)
exports.placeUserBid = async (req, res) => {
  try {
    const phone = req.user.phone;
    let bids = req.body.bids || req.body;
    if (!Array.isArray(bids)) {
      bids = [bids];
    }

    if (bids.length === 0) {
      return res.status(400).json({ status: false, success: '0', msg: 'Please provide at least one bid' });
    }

    // 1. Check user status & betting status
    const [userRows] = await db.query('SELECT wallet, status, betting_status FROM user_info WHERE phone = ?', [phone]);
    if (userRows.length === 0) {
      return res.status(404).json({ status: false, success: '0', msg: 'User account not found' });
    }
    const user = userRows[0];
    if (user.status === 0 || user.status === '0') {
      return res.status(403).json({ status: false, success: '0', msg: 'Your account is deactivated' });
    }
    if (user.betting_status === 0 || user.betting_status === '0') {
      return res.status(403).json({ status: false, success: '0', msg: 'Betting is blocked for your account' });
    }

    const currentWallet = parseFloat(user.wallet) || 0;

    // 2. Validate market
    const sampleBid = bids[0];
    const gameName = sampleBid.game_name || sampleBid.market_name || (sampleBid.market && sampleBid.market.name) || req.body.game_name || req.body.market_name;
    const marketId = sampleBid.market_id || (sampleBid.market && sampleBid.market.id) || req.body.market_id || req.body.id;

    let gameRow = null;
    if (marketId) {
      const [[m]] = await db.query('SELECT * FROM galidisswar_game_name WHERE id = ?', [marketId]);
      gameRow = m;
    }
    if (!gameRow && gameName) {
      const [[m]] = await db.query('SELECT * FROM galidisswar_game_name WHERE TRIM(game_name) = TRIM(?)', [gameName]);
      gameRow = m;
    }

    if (!gameRow) {
      return res.status(404).json({ status: false, success: '0', msg: 'Game not found in Gali Desawar' });
    }

    if (!checkIsMarketOpen(gameRow)) {
      return res.status(400).json({ status: false, success: '0', msg: 'Bidding is currently closed for this market' });
    }

    // 3. Validate total points and bid formats
    let totalPoints = 0;
    const validatedBids = [];

    for (const b of bids) {
      const pts = parseInt(b.points || b.amount, 10);
      const digit = String(b.digit || '').trim();
      const gType = b.game_type || b.gameType || req.body.game_type || req.body.gameType || 'Left Digit';

      if (isNaN(pts) || pts < 10) {
        return res.status(400).json({ status: false, success: '0', msg: 'Minimum bid amount is 10 points' });
      }

      if (gType === 'Jodi Digit' && digit.length !== 2) {
        return res.status(400).json({ status: false, success: '0', msg: 'Jodi digit must be exactly 2 digits (00-99)' });
      } else if (gType !== 'Jodi Digit' && digit.length !== 1) {
        return res.status(400).json({ status: false, success: '0', msg: 'Haruf digit must be 1 digit (0-9)' });
      }

      totalPoints += pts;
      validatedBids.push({
        game_name: gameRow.game_name,
        game_type: gType,
        digit,
        points: pts,
      });
    }

    if (totalPoints > currentWallet) {
      return res.status(400).json({ status: false, success: '0', msg: 'Insufficient wallet balance' });
    }

    // 4. Deduct points from wallet & insert bids
    const nowIST = getISTDate();
    const todayStr = getFormattedISTDate(nowIST);
    const currentTimeStr = nowIST.toTimeString().slice(0, 8);
    const newWallet = currentWallet - totalPoints;

    await db.query('UPDATE user_info SET wallet = ? WHERE phone = ?', [newWallet, phone]);

    // Insert wallet history entry
    await db.query(
      `INSERT INTO wallet_history 
       (status, date, time, amount, updated_amount, remark, phone_number) 
       VALUES ('0', ?, ?, ?, ?, ?, ?)`,
      [todayStr, currentTimeStr, totalPoints, newWallet, `Bid on ${gameRow.game_name} (Gali Desawar)`, phone]
    );

    // Insert each bid into galidisswar_bid_history
    for (const vb of validatedBids) {
      await db.query(
        `INSERT INTO galidisswar_bid_history 
         (username, bid_id, game_name, game_type, digit, points, date, status, win_amount) 
         VALUES (?, 0, ?, ?, ?, ?, ?, 'pending', 0)`,
        [phone, vb.game_name, vb.game_type, vb.digit, vb.points, todayStr]
      );
    }

    return res.json({
      status: true,
      success: '1',
      msg: 'Bids placed successfully!',
      bids_placed: validatedBids.length,
      total_points: totalPoints,
      new_balance: newWallet,
    });
  } catch (err) {
    console.error('Error in placeUserBid:', err);
    return res.status(500).json({ status: false, success: '0', error: err.message });
  }
};

// GET /api/gali-desawar/bid-history (Protected User)
exports.getUserBidHistory = async (req, res) => {
  try {
    const phone = req.user.phone;
    const { date, game_name } = req.query;
    let sql = 'SELECT * FROM galidisswar_bid_history WHERE username = ?';
    const params = [phone];

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }

    sql += ' ORDER BY id DESC LIMIT 100';
    const [rows] = await db.query(sql, params);

    return res.json({
      status: true,
      success: '1',
      data: rows,
    });
  } catch (err) {
    console.error('Error in getUserBidHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// GET /api/gali-desawar/win-history (Protected User)
exports.getUserWinHistory = async (req, res) => {
  try {
    const phone = req.user.phone;
    const { date, game_name } = req.query;
    let sql = 'SELECT * FROM galidisswar_winning_report WHERE username = ?';
    const params = [phone];

    if (date) {
      sql += ' AND date = ?';
      params.push(date);
    }
    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
    }

    sql += ' ORDER BY id DESC LIMIT 100';
    const [rows] = await db.query(sql, params);

    return res.json({
      status: true,
      success: '1',
      data: rows,
    });
  } catch (err) {
    console.error('Error in getUserWinHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};
