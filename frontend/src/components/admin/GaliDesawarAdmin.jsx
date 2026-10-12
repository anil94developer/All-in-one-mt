import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function GaliDesawarAdmin({ activeTab, setActiveTab }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Games Management State
  const [games, setGames] = useState([]);
  const [gameSearch, setGameSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [gameForm, setGameForm] = useState({
    game_name: '',
    game_name_hindi: '',
    open_time: '11:15 PM',
    close_time: '11:00 PM',
    status: 1,
    market_status: 1,
  });

  // 2. Declare Result State
  const [declareForm, setDeclareForm] = useState({
    game_name: '',
    result_date: new Date().toISOString().slice(0, 10),
    declare_result: '',
  });
  const [declaredResults, setDeclaredResults] = useState([]);
  const [resultsFilter, setResultsFilter] = useState({
    game_name: 'all',
    date: '',
  });
  const [revertingId, setRevertingId] = useState(null);

  // 3. Bid History State
  const [bids, setBids] = useState([]);
  const [bidSummary, setBidSummary] = useState({ total_count: 0, total_points: 0, total_win_amount: 0 });
  const [bidFilter, setBidFilter] = useState({
    game_name: 'all',
    date: new Date().toISOString().slice(0, 10),
    username: '',
    status: 'all',
    page: 1,
  });

  // 4. Win History State
  const [wins, setWins] = useState([]);
  const [winSummary, setWinSummary] = useState({ total_count: 0, total_win_amount: 0 });
  const [winFilter, setWinFilter] = useState({
    game_name: 'all',
    date: new Date().toISOString().slice(0, 10),
    username: '',
    page: 1,
  });

  // 5. Sell / Risk Report State
  const [sellReport, setSellReport] = useState([]);
  const [sellFilter, setSellFilter] = useState({
    game_name: 'all',
    date: new Date().toISOString().slice(0, 10),
    typeFilter: 'all', // 'all', 'Left Digit', 'Right Digit', 'Jodi Digit'
  });

  // 6. Rates State
  const [rates, setRates] = useState([]);
  const [savingRates, setSavingRates] = useState(false);

  // Fetch games list
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/gali-desawar/games');
      if (res.data?.success === '1') {
        setGames(res.data.data || []);
        if (res.data.data?.length > 0 && !declareForm.game_name) {
          setDeclareForm((prev) => ({ ...prev, game_name: res.data.data[0].game_name }));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Gali Desawar games');
    } finally {
      setLoading(false);
    }
  };

  // Fetch results list
  const fetchResults = async () => {
    try {
      let url = `/admin/gali-desawar/results?game_name=${resultsFilter.game_name}`;
      if (resultsFilter.date) url += `&date=${resultsFilter.date}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setDeclaredResults(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch bids history
  const fetchBids = async () => {
    try {
      setLoading(true);
      let url = `/admin/gali-desawar/bids?game_name=${bidFilter.game_name}&date=${bidFilter.date}&username=${encodeURIComponent(bidFilter.username)}&status=${bidFilter.status}&page=${bidFilter.page}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setBids(res.data.data || []);
        setBidSummary(res.data.summary || { total_count: 0, total_points: 0, total_win_amount: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wins history
  const fetchWins = async () => {
    try {
      setLoading(true);
      let url = `/admin/gali-desawar/wins?game_name=${winFilter.game_name}&date=${winFilter.date}&username=${encodeURIComponent(winFilter.username)}&page=${winFilter.page}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setWins(res.data.data || []);
        setWinSummary(res.data.summary || { total_count: 0, total_win_amount: 0 });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sell report
  const fetchSellReport = async () => {
    try {
      setLoading(true);
      const url = `/admin/gali-desawar/sell-report?game_name=${sellFilter.game_name}&date=${sellFilter.date}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setSellReport(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rates
  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/gali-desawar/rates');
      if (res.data?.success === '1') {
        setRates(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on active tab
  useEffect(() => {
    setError('');
    setSuccess('');
    fetchGames();

    if (activeTab === 'gali_games') {
      fetchGames();
    } else if (activeTab === 'gali_declare_result') {
      fetchResults();
    } else if (activeTab === 'gali_bid_history') {
      fetchBids();
    } else if (activeTab === 'gali_win_history') {
      fetchWins();
    } else if (activeTab === 'gali_sell_report') {
      fetchSellReport();
    } else if (activeTab === 'gali_rates') {
      fetchRates();
    }
  }, [activeTab]);

  // Handle Game Form Submission (Add)
  const handleAddGame = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/gali-desawar/games', gameForm);
      if (res.data?.success === '1') {
        setSuccess('Game added successfully!');
        setIsAddModalOpen(false);
        setGameForm({
          game_name: '',
          game_name_hindi: '',
          open_time: '11:15 PM',
          close_time: '11:00 PM',
          status: 1,
          market_status: 1,
        });
        fetchGames();
      } else {
        setError(res.data?.msg || 'Failed to add game');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding game');
    }
  };

  // Handle Game Form Submission (Edit)
  const handleEditGame = async (e) => {
    e.preventDefault();
    if (!editingGame) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/admin/gali-desawar/games/${editingGame.id}`, gameForm);
      if (res.data?.success === '1') {
        setSuccess('Game updated successfully!');
        setIsEditModalOpen(false);
        setEditingGame(null);
        fetchGames();
      } else {
        setError(res.data?.msg || 'Failed to update game');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating game');
    }
  };

  // Toggle Game Status
  const handleToggleStatus = async (id, field, currentValue) => {
    try {
      const nextValue = currentValue === 1 ? 0 : 1;
      const res = await api.post('/admin/gali-desawar/games/toggle', {
        id,
        field,
        value: nextValue,
      });
      if (res.data?.success === '1') {
        setGames((prev) =>
          prev.map((g) => (g.id === id ? { ...g, [field]: nextValue } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Game
  const handleDeleteGame = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from Gali Desawar?`)) return;
    try {
      const res = await api.delete(`/admin/gali-desawar/games/${id}`);
      if (res.data?.success === '1') {
        setSuccess('Game deleted successfully');
        fetchGames();
      }
    } catch (err) {
      setError('Error deleting game');
    }
  };

  // Handle Result Declaration
  const handleDeclareResult = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!declareForm.game_name || !declareForm.declare_result.trim()) {
      setError('Please select game and enter a valid result');
      return;
    }

    const val = declareForm.declare_result.trim();
    if (val.length < 1 || val.length > 2 || isNaN(val)) {
      setError('Result must be a 1 or 2 digit number (e.g., 05, 73)');
      return;
    }

    if (!window.confirm(`Confirm Result Declaration:\nGame: ${declareForm.game_name}\nDate: ${declareForm.result_date}\nResult: ${val.padStart(2, '0')}\n\nWinners will be automatically credited.`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/admin/gali-desawar/declare-result', {
        ...declareForm,
        declare_result: val.padStart(2, '0'),
      });
      if (res.data?.success === '1') {
        setSuccess(res.data.msg || 'Result declared successfully!');
        setDeclareForm((prev) => ({ ...prev, declare_result: '' }));
        fetchResults();
      } else {
        setError(res.data?.msg || 'Failed to declare result');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error declaring result');
    } finally {
      setLoading(false);
    }
  };

  // Handle Result Revert
  const handleRevertResult = async (id, gameName, date) => {
    if (!window.confirm(`WARNING: Reverting result for "${gameName}" on ${date} will:\n1. Deduct all credited winnings from users' wallets.\n2. Restore bids back to pending status.\n3. Delete winning records.\n\nAre you sure you want to proceed?`)) {
      return;
    }
    try {
      setRevertingId(id);
      const res = await api.delete(`/admin/gali-desawar/results/${id}`);
      if (res.data?.success === '1') {
        setSuccess(res.data.msg || 'Result reverted successfully!');
        fetchResults();
      } else {
        setError(res.data?.msg || 'Failed to revert result');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error reverting result');
    } finally {
      setRevertingId(null);
    }
  };

  // Save Rates
  const handleSaveRates = async () => {
    try {
      setSavingRates(true);
      setError('');
      setSuccess('');
      const res = await api.post('/admin/gali-desawar/rates', { rates });
      if (res.data?.success === '1') {
        setSuccess('Game rates updated successfully!');
      } else {
        setError(res.data?.msg || 'Failed to save rates');
      }
    } catch (err) {
      setError('Error saving rates');
    } finally {
      setSavingRates(false);
    }
  };

  // Filter games list by search
  const filteredGames = games.filter((g) =>
    (g.game_name || '').toLowerCase().includes(gameSearch.toLowerCase()) ||
    (g.game_name_hindi || '').includes(gameSearch)
  );

  return (
    <div style={{ padding: '4px' }}>
      {/* Alert Banners */}
      {error && (
        <div style={{ backgroundColor: '#fde8e8', color: '#e53e3e', border: '1px solid #f8b4b4', padding: '12px 18px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#def7ec', color: '#03543f', border: '1px solid #bcf0da', padding: '12px 18px', borderRadius: '6px', fontSize: '0.88rem', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', color: '#03543f', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 1: GAME MANAGEMENT (gali_games) */}
      {/* ============================================================== */}
      {activeTab === 'gali_games' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
                🎲 Gali Desawar Game Management
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
                Manage Gali & Desawar game markets, timing, and active statuses.
              </p>
            </div>
            <button
              onClick={() => {
                setGameForm({
                  game_name: '',
                  game_name_hindi: '',
                  open_time: '11:15 PM',
                  close_time: '11:00 PM',
                  status: 1,
                  market_status: 1,
                });
                setIsAddModalOpen(true);
              }}
              style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', boxShadow: '0 2px 6px rgba(85,110,230,.3)' }}
            >
              <span>+</span> Add Gali Game
            </button>
          </div>

          {/* Search bar */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '16px 20px', border: '1px solid #eff2f7', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#74788d' }}>🔍</span>
            <input
              type="text"
              placeholder="Search by game name or Hindi title..."
              value={gameSearch}
              onChange={(e) => setGameSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '0.9rem', color: '#495057' }}
            />
          </div>

          {/* Games Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eff2f7', overflow: 'hidden', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eff2f7', color: '#495057', fontWeight: '600' }}>
                    <th style={{ padding: '14px 18px', width: '60px' }}>#</th>
                    <th style={{ padding: '14px 18px' }}>Game Name</th>
                    <th style={{ padding: '14px 18px' }}>Hindi Name</th>
                    <th style={{ padding: '14px 18px' }}>Close Time (Betting Stops)</th>
                    <th style={{ padding: '14px 18px' }}>Result Time</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Market Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Active Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGames.length > 0 ? (
                    filteredGames.map((game, idx) => (
                      <tr key={game.id} style={{ borderBottom: '1px solid #f1f5f7' }}>
                        <td style={{ padding: '14px 18px', color: '#74788d' }}>{idx + 1}</td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#2a3042' }}>
                          {game.game_name}
                        </td>
                        <td style={{ padding: '14px 18px', color: '#495057' }}>
                          {game.game_name_hindi || '—'}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ backgroundColor: '#fff8e6', color: '#b7791f', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700' }}>
                            ⏰ {game.close_time || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{ backgroundColor: '#eef2ff', color: '#4338ca', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: '700' }}>
                            🎯 {game.open_time || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleStatus(game.id, 'market_status', game.market_status)}
                            style={{
                              backgroundColor: game.market_status === 1 ? '#d1fae5' : '#fee2e2',
                              color: game.market_status === 1 ? '#065f46' : '#991b1b',
                              border: 'none',
                              padding: '5px 12px',
                              borderRadius: '14px',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {game.market_status === 1 ? '● RUNNING / OPEN' : '○ CLOSED'}
                          </button>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleToggleStatus(game.id, 'status', game.status)}
                            style={{
                              backgroundColor: game.status === 1 ? '#e0f2fe' : '#f3f4f6',
                              color: game.status === 1 ? '#0369a1' : '#6b7280',
                              border: 'none',
                              padding: '5px 12px',
                              borderRadius: '14px',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                          >
                            {game.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                          </button>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setEditingGame(game);
                                setGameForm({
                                  game_name: game.game_name,
                                  game_name_hindi: game.game_name_hindi || '',
                                  open_time: game.open_time || '',
                                  close_time: game.close_time || '',
                                  status: game.status,
                                  market_status: game.market_status,
                                });
                                setIsEditModalOpen(true);
                              }}
                              style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#334155', fontWeight: '600', fontSize: '0.78rem' }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteGame(game.id, game.game_name)}
                              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', color: '#dc2626', fontWeight: '600', fontSize: '0.78rem' }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#74788d' }}>
                        {loading ? 'Loading games...' : 'No Gali Desawar games found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 2: RESULT DECLARE (gali_declare_result) */}
      {/* ============================================================== */}
      {activeTab === 'gali_declare_result' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
              🎯 Gali Desawar Result Declare & Winner Settlement
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
              Declare 2-digit numbers for Gali Desawar markets. User winnings will be automatically calculated and credited to their wallets.
            </p>
          </div>

          {/* Declare Box */}
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #eff2f7', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)', marginBottom: '28px' }}>
            <h5 style={{ margin: '0 0 16px 0', fontSize: '1rem', color: '#2a3042', fontWeight: '700' }}>
              Declare New Result
            </h5>

            <form onSubmit={handleDeclareResult} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              {/* Game select */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>
                  Select Game Market *
                </label>
                <select
                  value={declareForm.game_name}
                  onChange={(e) => setDeclareForm({ ...declareForm, game_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem', backgroundColor: '#fff', color: '#495057' }}
                  required
                >
                  <option value="">-- Choose Market --</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.game_name}>
                      {g.game_name} ({g.open_time})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>
                  Result Date *
                </label>
                <input
                  type="date"
                  value={declareForm.result_date}
                  onChange={(e) => setDeclareForm({ ...declareForm, result_date: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem', backgroundColor: '#fff', color: '#495057' }}
                  required
                />
              </div>

              {/* 2-Digit Result */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>
                  Winning Result (2 Digits: 00-99) *
                </label>
                <input
                  type="text"
                  maxLength={2}
                  placeholder="e.g. 73 or 05"
                  value={declareForm.declare_result}
                  onChange={(e) => setDeclareForm({ ...declareForm, declare_result: e.target.value.replace(/[^0-9]/g, '') })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '2px solid #556ee6', fontSize: '1.1rem', fontWeight: '800', textAlign: 'center', letterSpacing: '4px', backgroundColor: '#f8faff', color: '#2a3042' }}
                  required
                />
              </div>

              {/* Preview breakdown */}
              <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
                <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Left (अंदर)</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                    {declareForm.declare_result.length >= 1 ? declareForm.declare_result[0] : '—'}
                  </span>
                </div>
                <div style={{ flex: 1, backgroundColor: '#f1f5f9', padding: '6px 10px', borderRadius: '6px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Right (बाहर)</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A' }}>
                    {declareForm.declare_result.length >= 2 ? declareForm.declare_result[1] : '—'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', backgroundColor: '#34c38f', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '6px', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', boxShadow: '0 2px 6px rgba(52,195,143,.3)' }}
                >
                  {loading ? 'Processing...' : '🚀 Declare Result & Pay'}
                </button>
              </div>
            </form>
          </div>

          {/* Section: Old Results History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h5 style={{ margin: 0, fontSize: '1.05rem', color: '#2a3042', fontWeight: '700' }}>
                📋 Declared Results History
              </h5>

              {/* Filter controls */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={resultsFilter.game_name}
                  onChange={(e) => setResultsFilter({ ...resultsFilter, game_name: e.target.value })}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                >
                  <option value="all">All Games</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.game_name}>{g.game_name}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={resultsFilter.date}
                  onChange={(e) => setResultsFilter({ ...resultsFilter, date: e.target.value })}
                  style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                />

                <button
                  onClick={fetchResults}
                  style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
                >
                  Filter
                </button>
                {resultsFilter.date && (
                  <button
                    onClick={() => {
                      setResultsFilter({ game_name: 'all', date: '' });
                      setTimeout(fetchResults, 100);
                    }}
                    style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem' }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eff2f7', overflow: 'hidden', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eff2f7', color: '#495057', fontWeight: '600' }}>
                      <th style={{ padding: '14px 18px', width: '60px' }}>#</th>
                      <th style={{ padding: '14px 18px' }}>Date</th>
                      <th style={{ padding: '14px 18px' }}>Game Name</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Result (Jodi)</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Left Haruf</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Right Haruf</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Declared At</th>
                      <th style={{ padding: '14px 18px', textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {declaredResults.length > 0 ? (
                      declaredResults.map((resItem, idx) => (
                        <tr key={resItem.id} style={{ borderBottom: '1px solid #f1f5f7' }}>
                          <td style={{ padding: '14px 18px', color: '#74788d' }}>{idx + 1}</td>
                          <td style={{ padding: '14px 18px', fontWeight: '600', color: '#2a3042' }}>
                            {resItem.result_date ? String(resItem.result_date).slice(0, 10) : '—'}
                          </td>
                          <td style={{ padding: '14px 18px', fontWeight: '700', color: '#556ee6' }}>
                            {resItem.game_name}
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '8px', fontWeight: '900', fontSize: '1.1rem', letterSpacing: '2px', border: '1px solid #fde68a', display: 'inline-block' }}>
                              {resItem.declare_result}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem' }}>
                              {resItem.left_digit || (resItem.declare_result ? resItem.declare_result[0] : '—')}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '6px', fontWeight: '700', fontSize: '0.85rem' }}>
                              {resItem.right_digit || (resItem.declare_result ? resItem.declare_result[1] : '—')}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center', color: '#74788d', fontSize: '0.8rem' }}>
                            {resItem.created_at ? new Date(resItem.created_at).toLocaleString('en-IN') : '—'}
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleRevertResult(resItem.id, resItem.game_name, resItem.result_date ? String(resItem.result_date).slice(0, 10) : '')}
                              disabled={revertingId === resItem.id}
                              style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '600' }}
                            >
                              {revertingId === resItem.id ? 'Reverting...' : '↺ Revert / Delete'}
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#74788d' }}>
                          No declared results found matching filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 3: BET HISTORY (gali_bid_history) */}
      {/* ============================================================== */}
      {activeTab === 'gali_bid_history' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
              📜 Gali Desawar Users Bid History
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
              Complete record of all bets placed on Gali Desawar markets with live win/loss status.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '18px 22px', borderRadius: '8px', border: '1px solid #eff2f7', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
              <span style={{ fontSize: '0.82rem', color: '#74788d', fontWeight: '600', textTransform: 'uppercase' }}>Total Bids</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', color: '#2a3042', fontWeight: '800' }}>
                {bidSummary.total_count}
              </h3>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '18px 22px', borderRadius: '8px', border: '1px solid #eff2f7', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
              <span style={{ fontSize: '0.82rem', color: '#74788d', fontWeight: '600', textTransform: 'uppercase' }}>Total Points Staked</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', color: '#556ee6', fontWeight: '800' }}>
                ₹{Number(bidSummary.total_points).toLocaleString()}
              </h3>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '18px 22px', borderRadius: '8px', border: '1px solid #eff2f7', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
              <span style={{ fontSize: '0.82rem', color: '#74788d', fontWeight: '600', textTransform: 'uppercase' }}>Total Winnings Paid</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', color: '#34c38f', fontWeight: '800' }}>
                ₹{Number(bidSummary.total_win_amount).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #eff2f7', marginBottom: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Market</label>
              <select
                value={bidFilter.game_name}
                onChange={(e) => setBidFilter({ ...bidFilter, game_name: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Games</option>
                {games.map((g) => (
                  <option key={g.id} value={g.game_name}>{g.game_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={bidFilter.date}
                onChange={(e) => setBidFilter({ ...bidFilter, date: e.target.value })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>User Phone</label>
              <input
                type="text"
                placeholder="Search phone number..."
                value={bidFilter.username}
                onChange={(e) => setBidFilter({ ...bidFilter, username: e.target.value })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Status</label>
              <select
                value={bidFilter.status}
                onChange={(e) => setBidFilter({ ...bidFilter, status: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>

            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={fetchBids}
                style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Bids Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eff2f7', overflow: 'hidden', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eff2f7', color: '#495057', fontWeight: '600' }}>
                    <th style={{ padding: '14px 18px' }}>#</th>
                    <th style={{ padding: '14px 18px' }}>Date</th>
                    <th style={{ padding: '14px 18px' }}>User Phone</th>
                    <th style={{ padding: '14px 18px' }}>Game Market</th>
                    <th style={{ padding: '14px 18px' }}>Game Type</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Digit Bidded</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Points</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Win Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.length > 0 ? (
                    bids.map((b, idx) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f7' }}>
                        <td style={{ padding: '14px 18px', color: '#74788d' }}>{idx + 1}</td>
                        <td style={{ padding: '14px 18px', color: '#495057' }}>
                          {b.date ? String(b.date).slice(0, 10) : '—'}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#2a3042' }}>
                          {b.username}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: '600', color: '#556ee6' }}>
                          {b.game_name}
                        </td>
                        <td style={{ padding: '14px 18px', color: '#495057' }}>
                          {b.game_type}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: '#f3f4f6', color: '#1f2937', padding: '4px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '0.95rem' }}>
                            {b.digit}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: '700', color: '#2a3042' }}>
                          ₹{Number(b.points).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span
                            style={{
                              backgroundColor:
                                b.status === 'win'
                                  ? '#d1fae5'
                                  : b.status === 'loss'
                                  ? '#fee2e2'
                                  : '#fef3c7',
                              color:
                                b.status === 'win'
                                  ? '#065f46'
                                  : b.status === 'loss'
                                  ? '#991b1b'
                                  : '#92400e',
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              textTransform: 'uppercase',
                            }}
                          >
                            {b.status || 'pending'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: '700', color: b.win_amount > 0 ? '#10b981' : '#74788d' }}>
                          {b.win_amount > 0 ? `+₹${Number(b.win_amount).toLocaleString()}` : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" style={{ padding: '36px', textAlign: 'center', color: '#74788d' }}>
                        {loading ? 'Loading bids...' : 'No bids found for selected criteria.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 4: WIN HISTORY (gali_win_history) */}
      {/* ============================================================== */}
      {activeTab === 'gali_win_history' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
              🏆 Gali Desawar Winning Report
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
              Detailed report of all winning payouts generated in Gali Desawar markets.
            </p>
          </div>

          {/* Metric Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: '#fff', padding: '18px 22px', borderRadius: '8px', border: '1px solid #eff2f7', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
              <span style={{ fontSize: '0.82rem', color: '#74788d', fontWeight: '600', textTransform: 'uppercase' }}>Total Winners</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', color: '#2a3042', fontWeight: '800' }}>
                {winSummary.total_count}
              </h3>
            </div>
            <div style={{ backgroundColor: '#fff', padding: '18px 22px', borderRadius: '8px', border: '1px solid #eff2f7', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
              <span style={{ fontSize: '0.82rem', color: '#74788d', fontWeight: '600', textTransform: 'uppercase' }}>Total Payout Credited</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.6rem', color: '#34c38f', fontWeight: '800' }}>
                ₹{Number(winSummary.total_win_amount).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #eff2f7', marginBottom: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Market</label>
              <select
                value={winFilter.game_name}
                onChange={(e) => setWinFilter({ ...winFilter, game_name: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Games</option>
                {games.map((g) => (
                  <option key={g.id} value={g.game_name}>{g.game_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={winFilter.date}
                onChange={(e) => setWinFilter({ ...winFilter, date: e.target.value })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>User Phone</label>
              <input
                type="text"
                placeholder="Search phone number..."
                value={winFilter.username}
                onChange={(e) => setWinFilter({ ...winFilter, username: e.target.value })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={fetchWins}
                style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Wins Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eff2f7', overflow: 'hidden', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eff2f7', color: '#495057', fontWeight: '600' }}>
                    <th style={{ padding: '14px 18px' }}>#</th>
                    <th style={{ padding: '14px 18px' }}>Date</th>
                    <th style={{ padding: '14px 18px' }}>User Phone</th>
                    <th style={{ padding: '14px 18px' }}>Market</th>
                    <th style={{ padding: '14px 18px' }}>Game Type</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Winning Digit</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Winning Payout (₹)</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {wins.length > 0 ? (
                    wins.map((w, idx) => (
                      <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f7' }}>
                        <td style={{ padding: '14px 18px', color: '#74788d' }}>{idx + 1}</td>
                        <td style={{ padding: '14px 18px', color: '#495057' }}>
                          {w.date ? String(w.date).slice(0, 10) : '—'}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: '700', color: '#2a3042' }}>
                          {w.username}
                        </td>
                        <td style={{ padding: '14px 18px', fontWeight: '600', color: '#556ee6' }}>
                          {w.game_name}
                        </td>
                        <td style={{ padding: '14px 18px', color: '#495057' }}>
                          {w.game_type}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 12px', borderRadius: '6px', fontWeight: '800', fontSize: '0.95rem' }}>
                            {w.digit || w.open_digit || w.close_digit || '—'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: '800', color: '#16a34a' }}>
                          +₹{Number(w.winning_points).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', color: '#74788d', fontSize: '0.8rem' }}>
                          {w.created_at ? new Date(w.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ padding: '36px', textAlign: 'center', color: '#74788d' }}>
                        {loading ? 'Loading winning report...' : 'No winning records found.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 5: SELL / RISK REPORT (gali_sell_report) */}
      {/* ============================================================== */}
      {activeTab === 'gali_sell_report' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
              📊 Gali Desawar Sell & Risk Analysis Report
            </h4>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
              Live distribution of total points and bids placed on each number. Analyze exposure before declaring results.
            </p>
          </div>

          {/* Filter Bar */}
          <div style={{ backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #eff2f7', marginBottom: '18px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Market</label>
              <select
                value={sellFilter.game_name}
                onChange={(e) => setSellFilter({ ...sellFilter, game_name: e.target.value })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Games</option>
                {games.map((g) => (
                  <option key={g.id} value={g.game_name}>{g.game_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#74788d', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                value={sellFilter.date}
                onChange={(e) => setSellFilter({ ...sellFilter, date: e.target.value })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ alignSelf: 'flex-end' }}>
              <button
                onClick={fetchSellReport}
                style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Load Sell Report
              </button>
            </div>
          </div>

          {/* Sell Table */}
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #eff2f7', overflow: 'hidden', boxShadow: '0 0.75rem 1.5rem rgba(18,38,63,.03)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #eff2f7', color: '#495057', fontWeight: '600' }}>
                    <th style={{ padding: '14px 18px', width: '60px' }}>#</th>
                    <th style={{ padding: '14px 18px' }}>Game Type</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Digit / Number</th>
                    <th style={{ padding: '14px 18px', textAlign: 'center' }}>Total Bids Placed</th>
                    <th style={{ padding: '14px 18px', textAlign: 'right' }}>Total Points (Exposure)</th>
                  </tr>
                </thead>
                <tbody>
                  {sellReport.length > 0 ? (
                    sellReport.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f7' }}>
                        <td style={{ padding: '14px 18px', color: '#74788d' }}>{idx + 1}</td>
                        <td style={{ padding: '14px 18px', fontWeight: '600', color: '#556ee6' }}>
                          {row.game_type}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                          <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '4px 14px', borderRadius: '6px', fontWeight: '900', fontSize: '1.05rem', letterSpacing: '1px' }}>
                            {row.digit}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'center', fontWeight: '600', color: '#475569' }}>
                          {row.bid_count}
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right', fontWeight: '800', color: '#dc2626' }}>
                          ₹{Number(row.total_points).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: '36px', textAlign: 'center', color: '#74788d' }}>
                        {loading ? 'Analyzing sell data...' : 'No bids placed for this market on selected date.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW 6: GAME RATES (gali_rates) */}
      {/* ============================================================== */}
      {activeTab === 'gali_rates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#495057', fontWeight: '700', textTransform: 'uppercase' }}>
                💰 Gali Desawar Game Rates
              </h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: '#74788d' }}>
                Set winning payout rates for Left Digit, Right Digit, and Jodi Digit.
              </p>
            </div>
            <button
              onClick={handleSaveRates}
              disabled={savingRates}
              style={{ backgroundColor: '#34c38f', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              {savingRates ? 'Saving...' : '💾 Save Rates'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {rates.map((rate, idx) => (
              <div key={rate.id || idx} style={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #eff2f7', padding: '22px', boxShadow: '0 0.5rem 1rem rgba(18,38,63,.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h5 style={{ margin: 0, fontSize: '1.05rem', color: '#2a3042', fontWeight: '700' }}>
                    {rate.game_type}
                  </h5>
                  <span style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '3px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700' }}>
                    Rate {rate.min_value} ka {rate.max_value}
                  </span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#74788d', marginBottom: '4px', fontWeight: '600' }}>
                    Min Bet Points
                  </label>
                  <input
                    type="number"
                    value={rate.min_value}
                    onChange={(e) => {
                      const updated = [...rates];
                      updated[idx].min_value = e.target.value;
                      setRates(updated);
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#74788d', marginBottom: '4px', fontWeight: '600' }}>
                    Winning Payout Points
                  </label>
                  <input
                    type="number"
                    value={rate.max_value}
                    onChange={(e) => {
                      const updated = [...rates];
                      updated[idx].max_value = e.target.value;
                      setRates(updated);
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem', fontWeight: '700', color: '#16a34a' }}
                  />
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748B', backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px' }}>
                  Formula: ₹{rate.min_value} bet pays ₹{rate.max_value} ({rate.min_value > 0 ? (rate.max_value / rate.min_value) : 0}x multiplier)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD GAME */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 1rem 3rem rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h5 style={{ margin: 0, fontSize: '1.15rem', color: '#2a3042', fontWeight: '700' }}>Add New Gali Desawar Game</h5>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#74788d' }}>✕</button>
            </div>

            <form onSubmit={handleAddGame}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Game Name (English) *</label>
                <input
                  type="text"
                  placeholder="e.g. FARIDABAD or GALI"
                  value={gameForm.game_name}
                  onChange={(e) => setGameForm({ ...gameForm, game_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Game Name (Hindi)</label>
                <input
                  type="text"
                  placeholder="e.g. फरीदाबाद or गली"
                  value={gameForm.game_name_hindi}
                  onChange={(e) => setGameForm({ ...gameForm, game_name_hindi: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Close Time (Betting Stops) *</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 PM"
                    value={gameForm.close_time}
                    onChange={(e) => setGameForm({ ...gameForm, close_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Result / Open Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 06:15 PM"
                    value={gameForm.open_time}
                    onChange={(e) => setGameForm({ ...gameForm, open_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Market Status</label>
                  <select
                    value={gameForm.market_status}
                    onChange={(e) => setGameForm({ ...gameForm, market_status: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  >
                    <option value={1}>Running / Open</option>
                    <option value={0}>Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Active Status</label>
                  <select
                    value={gameForm.status}
                    onChange={(e) => setGameForm({ ...gameForm, status: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Save Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT GAME */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 1rem 3rem rgba(0,0,0,0.18)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h5 style={{ margin: 0, fontSize: '1.15rem', color: '#2a3042', fontWeight: '700' }}>Edit Gali Desawar Game</h5>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#74788d' }}>✕</button>
            </div>

            <form onSubmit={handleEditGame}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Game Name (English) *</label>
                <input
                  type="text"
                  value={gameForm.game_name}
                  onChange={(e) => setGameForm({ ...gameForm, game_name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Game Name (Hindi)</label>
                <input
                  type="text"
                  value={gameForm.game_name_hindi}
                  onChange={(e) => setGameForm({ ...gameForm, game_name_hindi: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Close Time (Betting Stops) *</label>
                  <input
                    type="text"
                    value={gameForm.close_time}
                    onChange={(e) => setGameForm({ ...gameForm, close_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Result / Open Time *</label>
                  <input
                    type="text"
                    value={gameForm.open_time}
                    onChange={(e) => setGameForm({ ...gameForm, open_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Market Status</label>
                  <select
                    value={gameForm.market_status}
                    onChange={(e) => setGameForm({ ...gameForm, market_status: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  >
                    <option value={1}>Running / Open</option>
                    <option value={0}>Closed</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '600', color: '#495057', marginBottom: '6px' }}>Active Status</label>
                  <select
                    value={gameForm.status}
                    onChange={(e) => setGameForm({ ...gameForm, status: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  style={{ backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#556ee6', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Update Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
