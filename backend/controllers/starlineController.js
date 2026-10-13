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

// Calculate single digit sum of a 3-digit pana (e.g. "125" -> (1+2+5)%10 = 8)
function calculatePanaDigit(panaStr) {
  if (!panaStr || typeof panaStr !== 'string') return '';
  const digits = panaStr.trim().split('').map(Number).filter(n => !isNaN(n));
  if (digits.length === 0) return '';
  const sum = digits.reduce((acc, curr) => acc + curr, 0);
  return String(sum % 10);
}

// ==========================================
// 1. GAME LIST (CRUD & TOGGLE)
// ==========================================

// GET /api/admin/starline/games
exports.getAdminGames = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM starline_game_name ORDER BY id ASC');
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in starline.getAdminGames:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/starline/games
exports.addAdminGame = async (req, res) => {
  try {
    const { games_name, games_name_hindi, open_time, close_time, market_status, game_status } = req.body;
    if (!games_name || !games_name.trim()) {
      return res.status(400).json({ success: '0', msg: 'Game name is required' });
    }

    const [result] = await db.query(
      `INSERT INTO starline_game_name 
       (games_name, games_name_hindi, open_time, close_time, market_status, digit, game_status) 
       VALUES (?, ?, ?, ?, ?, '', ?)`,
      [
        games_name.trim(),
        (games_name_hindi || '').trim(),
        (open_time || '10:00 am').trim(),
        (close_time || '10:30 am').trim(),
        market_status !== undefined ? String(market_status) : '1',
        game_status !== undefined ? String(game_status) : '1'
      ]
    );

    return res.json({
      success: '1',
      msg: 'Starline game added successfully',
      data: { id: result.insertId, games_name, open_time, close_time }
    });
  } catch (err) {
    console.error('Error in starline.addAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// PUT /api/admin/starline/games/:id
exports.updateAdminGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { games_name, games_name_hindi, open_time, close_time, market_status, game_status } = req.body;

    if (!games_name || !games_name.trim()) {
      return res.status(400).json({ success: '0', msg: 'Game name is required' });
    }

    await db.query(
      `UPDATE starline_game_name 
       SET games_name = ?, games_name_hindi = ?, open_time = ?, close_time = ?, market_status = ?, game_status = ? 
       WHERE id = ?`,
      [
        games_name.trim(),
        (games_name_hindi || '').trim(),
        (open_time || '').trim(),
        (close_time || '').trim(),
        market_status !== undefined ? String(market_status) : '1',
        game_status !== undefined ? String(game_status) : '1',
        id
      ]
    );

    return res.json({ success: '1', msg: 'Starline game updated successfully' });
  } catch (err) {
    console.error('Error in starline.updateAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// DELETE /api/admin/starline/games/:id
exports.deleteAdminGame = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM starline_game_name WHERE id = ?', [id]);
    return res.json({ success: '1', msg: 'Starline game deleted successfully' });
  } catch (err) {
    console.error('Error in starline.deleteAdminGame:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/starline/games/toggle
exports.toggleGameStatus = async (req, res) => {
  try {
    const { id, field } = req.body; // field = 'game_status' or 'market_status'
    if (!id) return res.status(400).json({ success: '0', msg: 'Game ID is required' });

    const targetField = field === 'market_status' ? 'market_status' : 'game_status';
    const [[current]] = await db.query(`SELECT ${targetField} FROM starline_game_name WHERE id = ?`, [id]);
    if (!current) return res.status(404).json({ success: '0', msg: 'Game not found' });

    const currentVal = String(current[targetField]);
    const newVal = currentVal === '1' ? '0' : '1';

    await db.query(`UPDATE starline_game_name SET ${targetField} = ? WHERE id = ?`, [newVal, id]);
    return res.json({ success: '1', msg: 'Status updated successfully', [targetField]: newVal });
  } catch (err) {
    console.error('Error in starline.toggleGameStatus:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 2. DECLARE RESULT & WINNERS
// ==========================================

// Helper to fetch rates map
async function getRatesMultiplierMap() {
  const [rateRows] = await db.query('SELECT * FROM starline_game_rates WHERE status = "1"');
  const rateMap = {
    'Single Digit': 10,
    'Single Pana': 150,
    'Double Pana': 300,
    'Triple Pana': 1000
  };
  rateRows.forEach((r) => {
    const min = parseFloat(r.min_value) || 10;
    const max = parseFloat(r.max_value) || 100;
    const type = (r.type || '').trim();
    if (type) {
      rateMap[type] = max / min;
    }
  });
  return rateMap;
}

// POST /api/admin/starline/declare-result/preview
exports.previewWinners = async (req, res) => {
  try {
    const { game_name, result_date, pana, digit } = req.body;
    if (!game_name || !result_date || !pana) {
      return res.status(400).json({ success: '0', msg: 'Game name, date, and pana are required' });
    }

    const cleanPana = String(pana).trim();
    const cleanDigit = (digit !== undefined && digit !== '') ? String(digit).trim() : calculatePanaDigit(cleanPana);

    const rateMap = await getRatesMultiplierMap();

    // Fetch pending bids for this game and date
    const [bids] = await db.query(
      `SELECT * FROM starline_bid_history 
       WHERE TRIM(game_name) = TRIM(?) AND date = ? AND (status = 'pending' OR status IS NULL OR status = '')`,
      [game_name.trim(), result_date]
    );

    const winners = [];
    let totalWinningAmount = 0;

    for (const bid of bids) {
      const gType = (bid.game_type || '').trim();
      const bidDigit = String(bid.digit || '').trim();
      const bidPana = String(bid.pana || '').trim();
      const points = parseFloat(bid.points_action || bid.points || 0);

      let isWin = false;
      let multiplier = 10;

      if (gType.toLowerCase().includes('digit')) {
        isWin = (bidDigit === cleanDigit);
        multiplier = rateMap['Single Digit'] || 10;
      } else if (gType.toLowerCase().includes('triple')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Triple Pana'] || 1000;
      } else if (gType.toLowerCase().includes('double')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Double Pana'] || 300;
      } else if (gType.toLowerCase().includes('single') && gType.toLowerCase().includes('pana')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Single Pana'] || 150;
      } else if (gType.toLowerCase().includes('pana')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Single Pana'] || 150;
      }

      if (isWin && points > 0) {
        const winAmount = Math.round(points * multiplier);
        totalWinningAmount += winAmount;
        winners.push({
          bid_id: bid.id,
          username: bid.username,
          game_name: bid.game_name,
          game_type: gType,
          digit: bidDigit,
          pana: bidPana,
          points: points,
          win_amount: winAmount,
          multiplier
        });
      }
    }

    return res.json({
      success: '1',
      data: {
        total_bids: bids.length,
        winners_count: winners.length,
        total_winning_amount: totalWinningAmount,
        pana: cleanPana,
        digit: cleanDigit,
        winners
      }
    });
  } catch (err) {
    console.error('Error in starline.previewWinners:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/starline/declare-result
exports.declareResult = async (req, res) => {
  const { game_name, result_date, pana, digit } = req.body;

  if (!game_name || !result_date || !pana) {
    return res.status(400).json({ success: '0', msg: 'Game name, date, and pana are required' });
  }

  const cleanPana = String(pana).trim();
  const cleanDigit = (digit !== undefined && digit !== '') ? String(digit).trim() : calculatePanaDigit(cleanPana);
  const resultDisplay = `${cleanPana}-${cleanDigit}`;

  try {
    const rateMap = await getRatesMultiplierMap();

    // 1. Check existing in starline_result_history
    const [existing] = await db.query(
      'SELECT id FROM starline_result_history WHERE TRIM(game_name) = TRIM(?) AND result_date = ?',
      [game_name.trim(), result_date]
    );

    // 2. Fetch pending bids
    const [bids] = await db.query(
      `SELECT * FROM starline_bid_history 
       WHERE TRIM(game_name) = TRIM(?) AND date = ? AND (status = 'pending' OR status IS NULL OR status = '')`,
      [game_name.trim(), result_date]
    );

    let winnersCount = 0;
    let totalPayout = 0;
    const winnersList = [];
    const nowIST = getISTDate();
    const currentDateStr = getFormattedISTDate(nowIST);
    const currentTimeStr = nowIST.toTimeString().slice(0, 8);

    for (const bid of bids) {
      const gType = (bid.game_type || '').trim();
      const bidDigit = String(bid.digit || '').trim();
      const bidPana = String(bid.pana || '').trim();
      const points = parseFloat(bid.points_action || bid.points || 0);

      let isWin = false;
      let multiplier = 10;

      if (gType.toLowerCase().includes('digit')) {
        isWin = (bidDigit === cleanDigit);
        multiplier = rateMap['Single Digit'] || 10;
      } else if (gType.toLowerCase().includes('triple')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Triple Pana'] || 1000;
      } else if (gType.toLowerCase().includes('double')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Double Pana'] || 300;
      } else if (gType.toLowerCase().includes('single') && gType.toLowerCase().includes('pana')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Single Pana'] || 150;
      } else if (gType.toLowerCase().includes('pana')) {
        isWin = (bidPana === cleanPana);
        multiplier = rateMap['Single Pana'] || 150;
      }

      if (isWin && points > 0) {
        winnersCount++;
        const winAmount = Math.round(points * multiplier);
        totalPayout += winAmount;
        const phone = bid.username;

        // Credit user wallet
        await db.query('UPDATE user_info SET wallet = wallet + ? WHERE phone = ?', [winAmount, phone]);

        // Get updated balance
        const [[userWalletRow]] = await db.query('SELECT wallet FROM user_info WHERE phone = ?', [phone]);
        const updatedBal = userWalletRow ? userWalletRow.wallet : 0;

        // Insert into starline_winning_report
        await db.query(
          `INSERT INTO starline_winning_report 
           (username, bid_id, game_name, game_type, session, pana, digit, close_pana, close_digit, winning_points, date, points_action) 
           VALUES (?, ?, ?, ?, 'Open', ?, ?, '', '', ?, ?, ?)`,
          [phone, bid.id, game_name, gType, bidPana, bidDigit, winAmount, result_date, points]
        );

        // Insert into wallet_history
        try {
          await db.query(
            `INSERT INTO wallet_history 
             (status, date, time, amount, updated_amount, remark, phone_number) 
             VALUES ('1', ?, ?, ?, ?, ?, ?)`,
            [currentDateStr, currentTimeStr, winAmount, updatedBal, `Starline Win: ${game_name} (${resultDisplay})`, phone]
          );
        } catch (we) {}

        // Update bid record to 'win'
        await db.query('UPDATE starline_bid_history SET status = "win", win_amount = ? WHERE id = ?', [winAmount, bid.id]);

        winnersList.push({
          bid_id: bid.id,
          username: phone,
          game_type: gType,
          pana: bidPana,
          digit: bidDigit,
          points,
          win_amount: winAmount
        });
      } else {
        // Mark as loss
        await db.query('UPDATE starline_bid_history SET status = "loss", win_amount = 0 WHERE id = ?', [bid.id]);
      }
    }

    // 3. Save to starline_result_history
    if (existing.length > 0) {
      await db.query(
        `UPDATE starline_result_history 
         SET declare_result = ?, pana = ?, digit = ?, numbers = ?, winners_count = ?, total_winning_points = ? 
         WHERE id = ?`,
        [resultDisplay, cleanPana, cleanDigit, resultDisplay, winnersCount, totalPayout, existing[0].id]
      );
    } else {
      await db.query(
        `INSERT INTO starline_result_history 
         (game_name, result_date, declare_result, pana, digit, numbers, winners_count, total_winning_points) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [game_name.trim(), result_date, resultDisplay, cleanPana, cleanDigit, resultDisplay, winnersCount, totalPayout]
      );
    }

    // 4. Upsert into starline_result_chart
    try {
      const [chartExist] = await db.query(
        'SELECT id FROM starline_result_chart WHERE TRIM(game_name) = TRIM(?) AND date = ?',
        [game_name.trim(), result_date]
      );
      if (chartExist.length > 0) {
        await db.query(
          'UPDATE starline_result_chart SET open_panna = ?, open_digit = ?, status = "1" WHERE id = ?',
          [cleanPana, cleanDigit, chartExist[0].id]
        );
      } else {
        await db.query(
          'INSERT INTO starline_result_chart (game_name, date, open_panna, open_digit, status) VALUES (?, ?, ?, ?, "1")',
          [game_name.trim(), result_date, cleanPana, cleanDigit]
        );
      }
    } catch (ce) {}

    return res.json({
      success: '1',
      msg: `Result declared successfully for ${game_name}! ${winnersCount} winners found.`,
      data: {
        game_name,
        result_date,
        pana: cleanPana,
        digit: cleanDigit,
        result_text: resultDisplay,
        winners_count: winnersCount,
        total_payout: totalPayout,
        winners: winnersList
      }
    });
  } catch (err) {
    console.error('Error in starline.declareResult:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// GET /api/admin/starline/results
exports.getResultsList = async (req, res) => {
  try {
    const { game_name, date, limit } = req.query;
    let sql = 'SELECT * FROM starline_result_history WHERE 1=1';
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
    params.push(parseInt(limit || '100', 10));

    const [rows] = await db.query(sql, params);
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in starline.getResultsList:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// GET /api/admin/starline/results/:id/winners
exports.getWinnersForResult = async (req, res) => {
  try {
    const { id } = req.params;
    const [[resultRecord]] = await db.query('SELECT * FROM starline_result_history WHERE id = ?', [id]);
    if (!resultRecord) {
      return res.status(404).json({ success: '0', msg: 'Result record not found' });
    }

    const [winners] = await db.query(
      `SELECT * FROM starline_winning_report 
       WHERE TRIM(game_name) = TRIM(?) AND date = ? 
       ORDER BY id DESC`,
      [resultRecord.game_name, resultRecord.result_date]
    );

    return res.json({
      success: '1',
      data: {
        result: resultRecord,
        winners
      }
    });
  } catch (err) {
    console.error('Error in starline.getWinnersForResult:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// DELETE /api/admin/starline/results/:id (Revert/Delete Result)
exports.revertResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { revert_wallet } = req.body || {}; // optional flag to rollback credited wallet points

    const [[resultRow]] = await db.query('SELECT * FROM starline_result_history WHERE id = ?', [id]);
    if (!resultRow) {
      return res.status(404).json({ success: '0', msg: 'Declared result not found' });
    }

    const { game_name, result_date } = resultRow;

    // 1. If revert_wallet is true, deduct winning points from users who won
    if (revert_wallet) {
      const [winningReports] = await db.query(
        'SELECT username, winning_points FROM starline_winning_report WHERE TRIM(game_name) = TRIM(?) AND date = ?',
        [game_name, result_date]
      );
      for (const w of winningReports) {
        const amt = parseFloat(w.winning_points) || 0;
        if (amt > 0) {
          await db.query('UPDATE user_info SET wallet = GREATEST(0, wallet - ?) WHERE phone = ?', [amt, w.username]);
        }
      }
    }

    // 2. Delete from starline_winning_report
    await db.query('DELETE FROM starline_winning_report WHERE TRIM(game_name) = TRIM(?) AND date = ?', [game_name, result_date]);

    // 3. Reset bids status back to 'pending'
    await db.query(
      'UPDATE starline_bid_history SET status = "pending", win_amount = 0 WHERE TRIM(game_name) = TRIM(?) AND date = ?',
      [game_name, result_date]
    );

    // 4. Delete from starline_result_chart
    await db.query('DELETE FROM starline_result_chart WHERE TRIM(game_name) = TRIM(?) AND date = ?', [game_name, result_date]);

    // 5. Delete from starline_result_history
    await db.query('DELETE FROM starline_result_history WHERE id = ?', [id]);

    return res.json({
      success: '1',
      msg: `Result for ${game_name} (${result_date}) successfully reverted and deleted.`
    });
  } catch (err) {
    console.error('Error in starline.revertResult:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 3. USER BET LIST (BID HISTORY CRUD)
// ==========================================

// GET /api/admin/starline/bids
exports.getAdminBidHistory = async (req, res) => {
  try {
    const { game_name, date, username, status, game_type, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let sql = 'SELECT * FROM starline_bid_history WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total, SUM(CAST(points_action AS DECIMAL(10,2))) as total_points, SUM(CAST(win_amount AS DECIMAL(10,2))) as total_win FROM starline_bid_history WHERE 1=1';
    const params = [];
    const countParams = [];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      countSql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
      countParams.push(game_name);
    }
    if (date) {
      sql += ' AND date = ?';
      countSql += ' AND date = ?';
      params.push(date);
      countParams.push(date);
    }
    if (username && username.trim()) {
      sql += ' AND username LIKE ?';
      countSql += ' AND username LIKE ?';
      params.push(`%${username.trim()}%`);
      countParams.push(`%${username.trim()}%`);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }
    if (game_type && game_type !== 'all') {
      sql += ' AND game_type = ?';
      countSql += ' AND game_type = ?';
      params.push(game_type);
      countParams.push(game_type);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await db.query(sql, params);
    const [[summary]] = await db.query(countSql, countParams);

    return res.json({
      success: '1',
      data: rows,
      summary: {
        total_count: summary?.total || 0,
        total_points: summary?.total_points || 0,
        total_win_amount: summary?.total_win || 0
      },
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    console.error('Error in starline.getAdminBidHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/starline/bids (Manual Add Bet by Admin)
exports.addAdminBid = async (req, res) => {
  try {
    const { username, game_name, game_type, digit, pana, points_action, date } = req.body;
    if (!username || !game_name || !points_action) {
      return res.status(400).json({ success: '0', msg: 'Username, game name, and points are required' });
    }

    const nowIST = getISTDate();
    const betDate = date || getFormattedISTDate(nowIST);
    const betTime = nowIST.toTimeString().slice(0, 8);

    const [result] = await db.query(
      `INSERT INTO starline_bid_history 
       (date, username, bid_id, game_name, game_type, digit, pana, points_action, time, status, win_amount) 
       VALUES (?, ?, 0, ?, ?, ?, ?, ?, ?, 'pending', 0)`,
      [
        betDate,
        String(username).trim(),
        String(game_name).trim(),
        String(game_type || 'Single Digit').trim(),
        digit ? String(digit).trim() : '',
        pana ? String(pana).trim() : '',
        String(points_action).trim(),
        betTime
      ]
    );

    return res.json({
      success: '1',
      msg: 'Starline bet added successfully',
      data: { id: result.insertId }
    });
  } catch (err) {
    console.error('Error in starline.addAdminBid:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// PUT /api/admin/starline/bids/:id (Edit Bet)
exports.updateAdminBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { digit, pana, points_action, game_type, status } = req.body;

    const [[existing]] = await db.query('SELECT * FROM starline_bid_history WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: '0', msg: 'Bet record not found' });
    }

    await db.query(
      `UPDATE starline_bid_history 
       SET digit = COALESCE(?, digit), 
           pana = COALESCE(?, pana), 
           points_action = COALESCE(?, points_action), 
           game_type = COALESCE(?, game_type),
           status = COALESCE(?, status)
       WHERE id = ?`,
      [
        digit !== undefined ? String(digit).trim() : null,
        pana !== undefined ? String(pana).trim() : null,
        points_action !== undefined ? String(points_action).trim() : null,
        game_type !== undefined ? String(game_type).trim() : null,
        status !== undefined ? String(status).trim() : null,
        id
      ]
    );

    return res.json({ success: '1', msg: 'Bet updated successfully' });
  } catch (err) {
    console.error('Error in starline.updateAdminBid:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// DELETE /api/admin/starline/bids/:id (Delete Bet with optional refund)
exports.deleteAdminBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { refund } = req.body || {};

    const [[bid]] = await db.query('SELECT * FROM starline_bid_history WHERE id = ?', [id]);
    if (!bid) {
      return res.status(404).json({ success: '0', msg: 'Bet record not found' });
    }

    // Process refund if requested and bet was not already refunded
    if (refund && parseFloat(bid.points_action) > 0) {
      const refundAmt = parseFloat(bid.points_action);
      const phone = bid.username;
      await db.query('UPDATE user_info SET wallet = wallet + ? WHERE phone = ?', [refundAmt, phone]);

      const nowIST = getISTDate();
      try {
        await db.query(
          `INSERT INTO wallet_history 
           (status, date, time, amount, updated_amount, remark, phone_number) 
           VALUES ('1', ?, ?, ?, 0, ?, ?)`,
          [
            getFormattedISTDate(nowIST),
            nowIST.toTimeString().slice(0, 8),
            refundAmt,
            `Starline Bet Refund: ${bid.game_name} (${bid.game_type})`,
            phone
          ]
        );
      } catch (we) {}
    }

    await db.query('DELETE FROM starline_bid_history WHERE id = ?', [id]);
    return res.json({ success: '1', msg: 'Starline bet deleted successfully' });
  } catch (err) {
    console.error('Error in starline.deleteAdminBid:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 4. WINNING HISTORY (WINNERS REPORT)
// ==========================================

// GET /api/admin/starline/wins
exports.getAdminWinHistory = async (req, res) => {
  try {
    const { game_name, date, username, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let sql = 'SELECT * FROM starline_winning_report WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total, SUM(CAST(winning_points AS DECIMAL(10,2))) as total_win FROM starline_winning_report WHERE 1=1';
    const params = [];
    const countParams = [];

    if (game_name && game_name !== 'all') {
      sql += ' AND TRIM(game_name) = TRIM(?)';
      countSql += ' AND TRIM(game_name) = TRIM(?)';
      params.push(game_name);
      countParams.push(game_name);
    }
    if (date) {
      sql += ' AND date = ?';
      countSql += ' AND date = ?';
      params.push(date);
      countParams.push(date);
    }
    if (username && username.trim()) {
      sql += ' AND username LIKE ?';
      countSql += ' AND username LIKE ?';
      params.push(`%${username.trim()}%`);
      countParams.push(`%${username.trim()}%`);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const [rows] = await db.query(sql, params);
    const [[summary]] = await db.query(countSql, countParams);

    return res.json({
      success: '1',
      data: rows,
      summary: {
        total_count: summary?.total || 0,
        total_win_amount: summary?.total_win || 0
      },
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    console.error('Error in starline.getAdminWinHistory:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 5. SELL / RISK REPORT
// ==========================================

// GET /api/admin/starline/sell-report
exports.getAdminSellReport = async (req, res) => {
  try {
    const { game_name, date } = req.query;
    if (!game_name || game_name === 'all') {
      return res.status(400).json({ success: '0', msg: 'Please select a specific Starline game for the risk report' });
    }

    const targetDate = date || getFormattedISTDate();
    const rateMap = await getRatesMultiplierMap();

    // Fetch all bids for this game and date
    const [bids] = await db.query(
      `SELECT * FROM starline_bid_history 
       WHERE TRIM(game_name) = TRIM(?) AND date = ?`,
      [game_name.trim(), targetDate]
    );

    // Grouping by Digit (0-9)
    const digitStats = {};
    for (let i = 0; i <= 9; i++) {
      digitStats[String(i)] = { digit: String(i), bids_count: 0, total_points: 0, liability: 0 };
    }

    // Grouping by Pana
    const panaStats = {};
    let grandTotalPoints = 0;

    bids.forEach((b) => {
      const gType = (b.game_type || '').trim();
      const points = parseFloat(b.points_action || b.points || 0);
      grandTotalPoints += points;

      if (gType.toLowerCase().includes('digit')) {
        const d = String(b.digit || '').trim();
        if (digitStats[d]) {
          digitStats[d].bids_count++;
          digitStats[d].total_points += points;
          digitStats[d].liability += points * (rateMap['Single Digit'] || 10);
        }
      } else {
        const p = String(b.pana || '').trim();
        if (p) {
          if (!panaStats[p]) {
            let mult = 150;
            if (gType.toLowerCase().includes('triple')) mult = rateMap['Triple Pana'] || 1000;
            else if (gType.toLowerCase().includes('double')) mult = rateMap['Double Pana'] || 300;
            panaStats[p] = { pana: p, type: gType, bids_count: 0, total_points: 0, liability: 0, multiplier: mult };
          }
          panaStats[p].bids_count++;
          panaStats[p].total_points += points;
          panaStats[p].liability += points * panaStats[p].multiplier;
        }
      }
    });

    const digitList = Object.values(digitStats);
    const panaList = Object.values(panaStats).sort((a, b) => b.liability - a.liability);

    return res.json({
      success: '1',
      data: {
        game_name,
        date: targetDate,
        total_bids: bids.length,
        total_amount: grandTotalPoints,
        digits: digitList,
        panas: panaList
      }
    });
  } catch (err) {
    console.error('Error in starline.getAdminSellReport:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// ==========================================
// 6. GAME RATES (CRUD)
// ==========================================

// GET /api/admin/starline/rates
exports.getStarlineRates = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM starline_game_rates ORDER BY id ASC');
    return res.json({ success: '1', data: rows });
  } catch (err) {
    console.error('Error in starline.getStarlineRates:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};

// POST /api/admin/starline/rates
exports.updateStarlineRates = async (req, res) => {
  try {
    const { rates } = req.body; // array of { id, type, min_value, max_value, status }
    if (!Array.isArray(rates)) {
      return res.status(400).json({ success: '0', msg: 'Rates array is required' });
    }

    for (const r of rates) {
      if (r.id) {
        await db.query(
          `UPDATE starline_game_rates 
           SET min_value = ?, max_value = ?, status = ? 
           WHERE id = ?`,
          [String(r.min_value || '10'), String(r.max_value || '100'), String(r.status || '1'), r.id]
        );
      }
    }

    return res.json({ success: '1', msg: 'Starline game rates updated successfully' });
  } catch (err) {
    console.error('Error in starline.updateStarlineRates:', err);
    return res.status(500).json({ success: '0', error: err.message });
  }
};
