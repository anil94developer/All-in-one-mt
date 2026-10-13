import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function StarlineAdmin({ activeTab, setActiveTab }) {
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
    games_name: '',
    games_name_hindi: '',
    open_time: '10:00 am',
    close_time: '10:30 am',
    market_status: '1',
    game_status: '1',
  });

  // 2. Declare Result State
  const [declareForm, setDeclareForm] = useState({
    game_name: '',
    result_date: new Date().toISOString().slice(0, 10),
    pana: '',
    digit: '',
  });
  const [declaredResults, setDeclaredResults] = useState([]);
  const [resultsFilter, setResultsFilter] = useState({
    game_name: 'all',
    date: '',
  });
  const [previewData, setPreviewData] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [winnerModalData, setWinnerModalData] = useState(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [declaringLoading, setDeclaringLoading] = useState(false);

  // 3. Bid History State
  const [bids, setBids] = useState([]);
  const [bidSummary, setBidSummary] = useState({ total_count: 0, total_points: 0, total_win_amount: 0 });
  const [bidFilter, setBidFilter] = useState({
    game_name: 'all',
    date: new Date().toISOString().slice(0, 10),
    username: '',
    status: 'all',
    game_type: 'all',
    page: 1,
  });
  const [isAddBidModalOpen, setIsAddBidModalOpen] = useState(false);
  const [isEditBidModalOpen, setIsEditBidModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [bidForm, setBidForm] = useState({
    username: '',
    game_name: '',
    game_type: 'Single Digit',
    digit: '',
    pana: '',
    points_action: '',
    date: new Date().toISOString().slice(0, 10),
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
  const [sellReport, setSellReport] = useState(null);
  const [sellFilter, setSellFilter] = useState({
    game_name: 'all',
    date: new Date().toISOString().slice(0, 10),
  });

  // 6. Rates State
  const [rates, setRates] = useState([]);
  const [savingRates, setSavingRates] = useState(false);

  // Helper: compute digit from pana
  const computePanaSumDigit = (panaVal) => {
    if (!panaVal) return '';
    const clean = String(panaVal).replace(/\D/g, '');
    if (clean.length === 0) return '';
    const sum = clean.split('').reduce((acc, c) => acc + Number(c), 0);
    return String(sum % 10);
  };

  // Fetch games list
  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/starline/games');
      if (res.data?.success === '1') {
        const gameList = res.data.data || [];
        setGames(gameList);
        if (gameList.length > 0 && !declareForm.game_name) {
          setDeclareForm((prev) => ({ ...prev, game_name: gameList[0].games_name }));
        }
        if (gameList.length > 0 && sellFilter.game_name === 'all') {
          setSellFilter((prev) => ({ ...prev, game_name: gameList[0].games_name }));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Starline games');
    } finally {
      setLoading(false);
    }
  };

  // Fetch results list
  const fetchResults = async () => {
    try {
      let url = `/admin/starline/results?game_name=${resultsFilter.game_name}`;
      if (resultsFilter.date) url += `&date=${resultsFilter.date}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setDeclaredResults(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch bid history
  const fetchBids = async () => {
    try {
      setLoading(true);
      let url = `/admin/starline/bids?game_name=${bidFilter.game_name}&date=${bidFilter.date}&status=${bidFilter.status}&game_type=${bidFilter.game_type}&page=${bidFilter.page}&limit=50`;
      if (bidFilter.username) url += `&username=${encodeURIComponent(bidFilter.username)}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setBids(res.data.data || []);
        if (res.data.summary) setBidSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Starline bets');
    } finally {
      setLoading(false);
    }
  };

  // Fetch win history
  const fetchWins = async () => {
    try {
      setLoading(true);
      let url = `/admin/starline/wins?game_name=${winFilter.game_name}&date=${winFilter.date}&page=${winFilter.page}&limit=50`;
      if (winFilter.username) url += `&username=${encodeURIComponent(winFilter.username)}`;
      const res = await api.get(url);
      if (res.data?.success === '1') {
        setWins(res.data.data || []);
        if (res.data.summary) setWinSummary(res.data.summary);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Starline winners');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sell report
  const fetchSellReport = async () => {
    if (!sellFilter.game_name || sellFilter.game_name === 'all') return;
    try {
      setLoading(true);
      const res = await api.get(`/admin/starline/sell-report?game_name=${encodeURIComponent(sellFilter.game_name)}&date=${sellFilter.date}`);
      if (res.data?.success === '1') {
        setSellReport(res.data.data);
      } else {
        setSellReport(null);
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
      const res = await api.get('/admin/starline/rates');
      if (res.data?.success === '1') {
        setRates(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load data based on activeTab
  useEffect(() => {
    setError('');
    setSuccess('');
    fetchGames();

    if (activeTab === 'starline_games') {
      fetchGames();
    } else if (activeTab === 'starline_declare_result') {
      fetchResults();
    } else if (activeTab === 'starline_bid_history') {
      fetchBids();
    } else if (activeTab === 'starline_win_history') {
      fetchWins();
    } else if (activeTab === 'starline_sell_report') {
      fetchSellReport();
    } else if (activeTab === 'starline_rates') {
      fetchRates();
    }
  }, [activeTab]);

  // Handle Game Form Add
  const handleAddGame = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/starline/games', gameForm);
      if (res.data?.success === '1') {
        setSuccess('Starline game added successfully!');
        setIsAddModalOpen(false);
        setGameForm({
          games_name: '',
          games_name_hindi: '',
          open_time: '10:00 am',
          close_time: '10:30 am',
          market_status: '1',
          game_status: '1',
        });
        fetchGames();
      } else {
        setError(res.data?.msg || 'Failed to add game');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding game');
    }
  };

  // Handle Game Form Edit
  const handleEditGame = async (e) => {
    e.preventDefault();
    if (!editingGame) return;
    setError('');
    setSuccess('');
    try {
      const res = await api.put(`/admin/starline/games/${editingGame.id}`, gameForm);
      if (res.data?.success === '1') {
        setSuccess('Starline game updated successfully!');
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

  // Delete Game
  const handleDeleteGame = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Starline game "${name}"?`)) return;
    try {
      const res = await api.delete(`/admin/starline/games/${id}`);
      if (res.data?.success === '1') {
        setSuccess(`Game "${name}" deleted.`);
        fetchGames();
      }
    } catch (err) {
      setError('Failed to delete game');
    }
  };

  // Toggle Game / Market Status
  const handleToggleStatus = async (id, field) => {
    try {
      const res = await api.post('/admin/starline/games/toggle', { id, field });
      if (res.data?.success === '1') {
        setGames((prev) =>
          prev.map((g) => (g.id === id ? { ...g, [field]: res.data[field] } : g))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Preview Winners
  const handlePreviewWinners = async (e) => {
    e.preventDefault();
    if (!declareForm.game_name || !declareForm.pana) {
      alert('Please select game and enter a valid Pana (e.g. 125)');
      return;
    }
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      const res = await api.post('/admin/starline/declare-result/preview', {
        game_name: declareForm.game_name,
        result_date: declareForm.result_date,
        pana: declareForm.pana,
        digit: declareForm.digit || computePanaSumDigit(declareForm.pana),
      });
      if (res.data?.success === '1') {
        setPreviewData(res.data.data);
        setIsPreviewModalOpen(true);
      } else {
        setError(res.data?.msg || 'Preview failed');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to preview winners');
    } finally {
      setLoading(false);
    }
  };

  // Declare Result Submit
  const handleDeclareResult = async () => {
    if (!declareForm.game_name || !declareForm.pana) {
      alert('Please fill in game name and pana');
      return;
    }
    if (!window.confirm(`Confirm declare result: ${declareForm.pana}-${declareForm.digit || computePanaSumDigit(declareForm.pana)} for ${declareForm.game_name}? This will credit winning points to user wallets.`)) {
      return;
    }
    setDeclaringLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/admin/starline/declare-result', {
        game_name: declareForm.game_name,
        result_date: declareForm.result_date,
        pana: declareForm.pana,
        digit: declareForm.digit || computePanaSumDigit(declareForm.pana),
      });
      if (res.data?.success === '1') {
        setSuccess(res.data.msg || 'Result declared successfully!');
        setIsPreviewModalOpen(false);
        setDeclareForm((prev) => ({ ...prev, pana: '', digit: '' }));
        fetchResults();
      } else {
        setError(res.data?.msg || 'Failed to declare result');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error declaring result');
    } finally {
      setDeclaringLoading(false);
    }
  };

  // View Winners for Declared Result
  const handleViewWinners = async (resultRecord) => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/starline/results/${resultRecord.id}/winners`);
      if (res.data?.success === '1') {
        setWinnerModalData(res.data.data);
        setIsWinnerModalOpen(true);
      }
    } catch (err) {
      setError('Failed to fetch winner details');
    } finally {
      setLoading(false);
    }
  };

  // Delete / Revert Result
  const handleRevertResult = async (id, gameName, date) => {
    const revertWallet = window.confirm(
      `Reverting result for ${gameName} on ${date}.\n\nClick OK to also ROLLBACK/DEDUCT credited points from winners' wallets, or CANCEL to only delete the result record.`
    );
    try {
      setLoading(true);
      const res = await api.delete(`/admin/starline/results/${id}`, {
        data: { revert_wallet: revertWallet },
      });
      if (res.data?.success === '1') {
        setSuccess(res.data.msg);
        fetchResults();
      }
    } catch (err) {
      setError('Failed to revert result');
    } finally {
      setLoading(false);
    }
  };

  // Add Manual Bet
  const handleAddBid = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/starline/bids', bidForm);
      if (res.data?.success === '1') {
        setSuccess('Starline bet added successfully!');
        setIsAddBidModalOpen(false);
        setBidForm({
          username: '',
          game_name: games[0]?.games_name || '',
          game_type: 'Single Digit',
          digit: '',
          pana: '',
          points_action: '',
          date: new Date().toISOString().slice(0, 10),
        });
        fetchBids();
      } else {
        setError(res.data?.msg || 'Failed to add bet');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error adding bet');
    }
  };

  // Edit Bet
  const handleEditBid = async (e) => {
    e.preventDefault();
    if (!editingBid) return;
    try {
      const res = await api.put(`/admin/starline/bids/${editingBid.id}`, editingBid);
      if (res.data?.success === '1') {
        setSuccess('Bet updated successfully!');
        setIsEditBidModalOpen(false);
        setEditingBid(null);
        fetchBids();
      } else {
        setError(res.data?.msg || 'Failed to update bet');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Error updating bet');
    }
  };

  // Delete Bet
  const handleDeleteBid = async (id) => {
    const refund = window.confirm('Do you want to REFUND the bet amount to the user wallet?\n\nOK = Refund points & Delete\nCancel = Do not delete');
    if (!refund && !window.confirm('Delete this bet WITHOUT refund?')) return;

    try {
      const res = await api.delete(`/admin/starline/bids/${id}`, {
        data: { refund },
      });
      if (res.data?.success === '1') {
        setSuccess('Bet deleted successfully.');
        fetchBids();
      }
    } catch (err) {
      setError('Failed to delete bet');
    }
  };

  // Save Game Rates
  const handleSaveRates = async (e) => {
    e.preventDefault();
    setSavingRates(true);
    try {
      const res = await api.post('/admin/starline/rates', { rates });
      if (res.data?.success === '1') {
        setSuccess('Starline game rates updated successfully!');
      } else {
        setError(res.data?.msg || 'Failed to update rates');
      }
    } catch (err) {
      setError('Error saving rates');
    } finally {
      setSavingRates(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner / Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', fontWeight: '700', color: '#1a1f36', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⭐</span> StarLine Management
          </h2>
          <p style={{ margin: 0, color: '#697386', fontSize: '0.95rem' }}>
            Configure Starline hourly markets, declare results with winner user lists, and manage user bets & risk reports.
          </p>
        </div>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', backgroundColor: '#f0f3f8', padding: '6px', borderRadius: '10px' }}>
          {[
            { id: 'starline_games', label: '🎮 Game List' },
            { id: 'starline_declare_result', label: '🎯 Declare Result' },
            { id: 'starline_bid_history', label: '📋 User Bet List' },
            { id: 'starline_win_history', label: '🏆 Winning Report' },
            { id: 'starline_sell_report', label: '📊 Sell / Risk Report' },
            { id: 'starline_rates', label: '💰 Game Rates' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.id ? '#556ee6' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : '#495057',
                boxShadow: activeTab === tab.id ? '0 2px 6px rgba(85, 110, 230, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Alerts */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}
      {success && (
        <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: GAME LIST                                                          */}
      {/* ========================================================================= */}
      {activeTab === 'starline_games' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search Starline game..."
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem', width: '240px' }}
              />
              <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>Total Games: {games.length}</span>
            </div>
            <button
              onClick={() => {
                setGameForm({
                  games_name: '',
                  games_name_hindi: '',
                  open_time: '10:00 am',
                  close_time: '10:30 am',
                  market_status: '1',
                  game_status: '1',
                });
                setIsAddModalOpen(true);
              }}
              style={{ backgroundColor: '#556ee6', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>➕</span> Add Starline Game
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                  <th style={{ padding: '12px 14px' }}>#</th>
                  <th style={{ padding: '12px 14px' }}>Game Name</th>
                  <th style={{ padding: '12px 14px' }}>Hindi Name</th>
                  <th style={{ padding: '12px 14px' }}>Open Time</th>
                  <th style={{ padding: '12px 14px' }}>Close Time</th>
                  <th style={{ padding: '12px 14px' }}>Market Status</th>
                  <th style={{ padding: '12px 14px' }}>Game Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games
                  .filter((g) => (g.games_name || '').toLowerCase().includes(gameSearch.toLowerCase()))
                  .map((g, idx) => (
                    <tr key={g.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#6c757d' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#2b3445' }}>{g.games_name}</td>
                      <td style={{ padding: '12px 14px', color: '#495057' }}>{g.games_name_hindi || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#0d6efd', fontWeight: '600' }}>{g.open_time || '-'}</td>
                      <td style={{ padding: '12px 14px', color: '#dc3545', fontWeight: '600' }}>{g.close_time || '-'}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => handleToggleStatus(g.id, 'market_status')}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            backgroundColor: String(g.market_status) === '1' ? '#dcfce7' : '#fee2e2',
                            color: String(g.market_status) === '1' ? '#15803d' : '#b91c1c',
                          }}
                        >
                          {String(g.market_status) === '1' ? '● OPEN' : '○ CLOSED'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={() => handleToggleStatus(g.id, 'game_status')}
                          style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer',
                            backgroundColor: String(g.game_status) === '1' ? '#e0e7ff' : '#f3f4f6',
                            color: String(g.game_status) === '1' ? '#3730a3' : '#6b7280',
                          }}
                        >
                          {String(g.game_status) === '1' ? 'ACTIVE' : 'INACTIVE'}
                        </button>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingGame(g);
                              setGameForm({
                                games_name: g.games_name || '',
                                games_name_hindi: g.games_name_hindi || '',
                                open_time: g.open_time || '',
                                close_time: g.close_time || '',
                                market_status: String(g.market_status ?? '1'),
                                game_status: String(g.game_status ?? '1'),
                              });
                              setIsEditModalOpen(true);
                            }}
                            style={{ backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteGame(g.id, g.games_name)}
                            style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DECLARE RESULT & WINNERS LIST                                      */}
      {/* ========================================================================= */}
      {activeTab === 'starline_declare_result' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Form Card */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '700', color: '#2b3445', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🎯</span> Declare Starline Result
            </h3>

            <form onSubmit={handlePreviewWinners} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>Select Game</label>
                <select
                  value={declareForm.game_name}
                  onChange={(e) => setDeclareForm({ ...declareForm, game_name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                >
                  <option value="">-- Select Game --</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.games_name}>
                      {g.games_name} ({g.open_time || ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>Result Date</label>
                <input
                  type="date"
                  value={declareForm.result_date}
                  onChange={(e) => setDeclareForm({ ...declareForm, result_date: e.target.value })}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                  Pana (3 Digits)
                </label>
                <input
                  type="text"
                  maxLength={3}
                  placeholder="e.g. 125"
                  value={declareForm.pana}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setDeclareForm({
                      ...declareForm,
                      pana: val,
                      digit: computePanaSumDigit(val),
                    });
                  }}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', fontWeight: '700', letterSpacing: '2px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: '600', color: '#495057' }}>
                  Digit (Single 0-9)
                </label>
                <input
                  type="text"
                  maxLength={1}
                  placeholder="Auto (e.g. 8)"
                  value={declareForm.digit}
                  onChange={(e) => setDeclareForm({ ...declareForm, digit: e.target.value.replace(/\D/g, '') })}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '1rem', fontWeight: '700', color: '#0d6efd' }}
                />
              </div>

              {/* Live Result Preview */}
              <div style={{ backgroundColor: '#f8fafc', padding: '10px 16px', borderRadius: '8px', border: '1px dashed #94a3b8', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Preview Result</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>
                  {declareForm.pana ? `${declareForm.pana}-${declareForm.digit || computePanaSumDigit(declareForm.pana)}` : '***-*'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: '#0ea5e9', color: '#ffffff', border: 'none', padding: '12px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span>👁️</span> Preview Winners
                </button>
                <button
                  type="button"
                  onClick={handleDeclareResult}
                  disabled={declaringLoading}
                  style={{ flex: 1.2, backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '12px 14px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span>🚀</span> {declaringLoading ? 'Declaring...' : 'Declare Result'}
                </button>
              </div>
            </form>
          </div>

          {/* Results History Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#2b3445' }}>
                Declared Starline Results History
              </h4>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={resultsFilter.game_name}
                  onChange={(e) => {
                    setResultsFilter({ ...resultsFilter, game_name: e.target.value });
                  }}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                >
                  <option value="all">All Games</option>
                  {games.map((g) => (
                    <option key={g.id} value={g.games_name}>{g.games_name}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={resultsFilter.date}
                  onChange={(e) => setResultsFilter({ ...resultsFilter, date: e.target.value })}
                  style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                />
                <button
                  onClick={fetchResults}
                  style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                >
                  Filter
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                    <th style={{ padding: '12px 14px' }}>Date</th>
                    <th style={{ padding: '12px 14px' }}>Game Name</th>
                    <th style={{ padding: '12px 14px' }}>Pana - Digit</th>
                    <th style={{ padding: '12px 14px' }}>Winners Count</th>
                    <th style={{ padding: '12px 14px' }}>Total Payout (₹)</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {declaredResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>
                        No declared results found.
                      </td>
                    </tr>
                  ) : (
                    declaredResults.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#495057' }}>
                          {r.result_date ? String(r.result_date).slice(0, 10) : '-'}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                          {r.game_name}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 12px', borderRadius: '6px', fontWeight: '800', letterSpacing: '1px', fontSize: '1rem', border: '1px solid #fde68a' }}>
                            {r.declare_result || (r.pana ? `${r.pana}-${r.digit}` : '-')}
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '600', color: '#059669' }}>
                          {r.winners_count || 0} Winners
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#2563eb' }}>
                          ₹{Number(r.total_winning_points || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleViewWinners(r)}
                              style={{ backgroundColor: '#e0f2fe', border: '1px solid #7dd3fc', color: '#0369a1', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                            >
                              👁️ Winner List
                            </button>
                            <button
                              onClick={() => handleRevertResult(r.id, r.game_name, r.result_date)}
                              style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600' }}
                            >
                              🗑️ Delete / Revert
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: USER BET LIST                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'starline_bid_history' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Summary Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '600', textTransform: 'uppercase' }}>Total Bets</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', color: '#14532d', fontWeight: '800' }}>
                {bidSummary.total_count}
              </h3>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase' }}>Total Collection (₹)</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', color: '#1e3a8a', fontWeight: '800' }}>
                ₹{Number(bidSummary.total_points || 0).toLocaleString()}
              </h3>
            </div>
            <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '10px', border: '1px solid #fecaca' }}>
              <span style={{ fontSize: '0.8rem', color: '#991b1b', fontWeight: '600', textTransform: 'uppercase' }}>Total Paid Win (₹)</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', color: '#7f1d1d', fontWeight: '800' }}>
                ₹{Number(bidSummary.total_win_amount || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={bidFilter.game_name}
                onChange={(e) => setBidFilter({ ...bidFilter, game_name: e.target.value, page: 1 })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Starline Games</option>
                {games.map((g) => (
                  <option key={g.id} value={g.games_name}>{g.games_name}</option>
                ))}
              </select>

              <input
                type="date"
                value={bidFilter.date}
                onChange={(e) => setBidFilter({ ...bidFilter, date: e.target.value, page: 1 })}
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              />

              <select
                value={bidFilter.game_type}
                onChange={(e) => setBidFilter({ ...bidFilter, game_type: e.target.value, page: 1 })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Game Types</option>
                <option value="Single Digit">Single Digit</option>
                <option value="Single Pana">Single Pana</option>
                <option value="Double Pana">Double Pana</option>
                <option value="Triple Pana">Triple Pana</option>
              </select>

              <select
                value={bidFilter.status}
                onChange={(e) => setBidFilter({ ...bidFilter, status: e.target.value, page: 1 })}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>

              <input
                type="text"
                placeholder="Search User Phone..."
                value={bidFilter.username}
                onChange={(e) => setBidFilter({ ...bidFilter, username: e.target.value, page: 1 })}
                style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem', width: '160px' }}
              />

              <button
                onClick={fetchBids}
                style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
              >
                Apply Filter
              </button>
            </div>

            <button
              onClick={() => {
                setBidForm({
                  username: '',
                  game_name: games[0]?.games_name || '',
                  game_type: 'Single Digit',
                  digit: '',
                  pana: '',
                  points_action: '',
                  date: new Date().toISOString().slice(0, 10),
                });
                setIsAddBidModalOpen(true);
              }}
              style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '9px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>➕</span> Add Manual Bet
            </button>
          </div>

          {/* Bets Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                  <th style={{ padding: '12px 14px' }}>Bid ID / Time</th>
                  <th style={{ padding: '12px 14px' }}>User Phone</th>
                  <th style={{ padding: '12px 14px' }}>Game Name</th>
                  <th style={{ padding: '12px 14px' }}>Type</th>
                  <th style={{ padding: '12px 14px' }}>Pana / Digit</th>
                  <th style={{ padding: '12px 14px' }}>Points (₹)</th>
                  <th style={{ padding: '12px 14px' }}>Win Amount (₹)</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bids.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>
                      No starline bets found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  bids.map((b) => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: '700', color: '#334155' }}>#{b.id}</div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{b.date} {b.time || ''}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                        {b.username}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1e293b' }}>
                        {b.game_name}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {b.game_type}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#0f172a', padding: '4px 10px', borderRadius: '4px', fontWeight: '700' }}>
                          {b.pana || b.digit || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0284c7' }}>
                        ₹{Number(b.points_action || b.points || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>
                        {b.win_amount ? `₹${Number(b.win_amount).toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor:
                              b.status === 'win' ? '#dcfce7' : b.status === 'loss' ? '#fee2e2' : '#fef9c3',
                            color:
                              b.status === 'win' ? '#15803d' : b.status === 'loss' ? '#b91c1c' : '#a16207',
                          }}
                        >
                          {b.status || 'pending'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setEditingBid(b);
                              setIsEditBidModalOpen(true);
                            }}
                            style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBid(b.id)}
                            style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '5px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing page {bidFilter.page}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                disabled={bidFilter.page <= 1}
                onClick={() => setBidFilter((prev) => ({ ...prev, page: prev.page - 1 }))}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: bidFilter.page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                ◀ Previous
              </button>
              <button
                disabled={bids.length < 50}
                onClick={() => setBidFilter((prev) => ({ ...prev, page: prev.page + 1 }))}
                style={{ padding: '6px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff', cursor: bids.length < 50 ? 'not-allowed' : 'pointer' }}
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: WINNING REPORT                                                     */}
      {/* ========================================================================= */}
      {activeTab === 'starline_win_history' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Summary Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ backgroundColor: '#ecfdf5', padding: '16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
              <span style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: '600', textTransform: 'uppercase' }}>Total Winners Count</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', color: '#047857', fontWeight: '800' }}>
                {winSummary.total_count}
              </h3>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.8rem', color: '#1e40af', fontWeight: '600', textTransform: 'uppercase' }}>Total Win Amount (₹)</span>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '1.6rem', color: '#1d4ed8', fontWeight: '800' }}>
                ₹{Number(winSummary.total_win_amount || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
            <select
              value={winFilter.game_name}
              onChange={(e) => setWinFilter({ ...winFilter, game_name: e.target.value, page: 1 })}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
            >
              <option value="all">All Starline Games</option>
              {games.map((g) => (
                <option key={g.id} value={g.games_name}>{g.games_name}</option>
              ))}
            </select>

            <input
              type="date"
              value={winFilter.date}
              onChange={(e) => setWinFilter({ ...winFilter, date: e.target.value, page: 1 })}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
            />

            <input
              type="text"
              placeholder="Search User Phone..."
              value={winFilter.username}
              onChange={(e) => setWinFilter({ ...winFilter, username: e.target.value, page: 1 })}
              style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem', width: '180px' }}
            />

            <button
              onClick={fetchWins}
              style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}
            >
              Filter Winners
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                  <th style={{ padding: '12px 14px' }}># ID</th>
                  <th style={{ padding: '12px 14px' }}>User Phone</th>
                  <th style={{ padding: '12px 14px' }}>Game Name</th>
                  <th style={{ padding: '12px 14px' }}>Bet Type</th>
                  <th style={{ padding: '12px 14px' }}>Pana / Digit</th>
                  <th style={{ padding: '12px 14px' }}>Bet Points</th>
                  <th style={{ padding: '12px 14px' }}>Won Amount (₹)</th>
                  <th style={{ padding: '12px 14px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {wins.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#6c757d' }}>
                      No starline winners found for the selected filters.
                    </td>
                  </tr>
                ) : (
                  wins.map((w) => (
                    <tr key={w.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#64748b' }}>#{w.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>{w.username}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '600', color: '#1e293b' }}>{w.game_name}</td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{w.game_type}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '4px', fontWeight: '700' }}>
                          {w.pana || w.digit || '-'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#64748b' }}>
                        ₹{Number(w.points_action || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '800', color: '#16a34a' }}>
                        ₹{Number(w.winning_points || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>
                        {w.date}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SELL / RISK REPORT                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'starline_sell_report' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Select Game</label>
              <select
                value={sellFilter.game_name}
                onChange={(e) => setSellFilter({ ...sellFilter, game_name: e.target.value })}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
              >
                {games.map((g) => (
                  <option key={g.id} value={g.games_name}>{g.games_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px', color: '#475569' }}>Select Date</label>
              <input
                type="date"
                value={sellFilter.date}
                onChange={(e) => setSellFilter({ ...sellFilter, date: e.target.value })}
                style={{ padding: '7px 12px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
              />
            </div>

            <button
              onClick={fetchSellReport}
              style={{ marginTop: '22px', backgroundColor: '#556ee6', color: '#ffffff', border: 'none', padding: '9px 18px', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
            >
              Generate Risk Report
            </button>
          </div>

          {sellReport ? (
            <div>
              {/* Report Header Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Game & Date</span>
                  <h4 style={{ margin: '6px 0 0 0', color: '#1e293b' }}>{sellReport.game_name} ({sellReport.date})</h4>
                </div>
                <div style={{ backgroundColor: '#eff6ff', padding: '16px', borderRadius: '10px', border: '1px solid #bfdbfe' }}>
                  <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: '600', textTransform: 'uppercase' }}>Total Bids</span>
                  <h3 style={{ margin: '6px 0 0 0', color: '#1e40af', fontWeight: '800' }}>{sellReport.total_bids}</h3>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '600', textTransform: 'uppercase' }}>Total Collection</span>
                  <h3 style={{ margin: '6px 0 0 0', color: '#166534', fontWeight: '800' }}>₹{Number(sellReport.total_amount || 0).toLocaleString()}</h3>
                </div>
              </div>

              {/* Single Digit Breakdown 0-9 */}
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#1e293b' }}>Single Digit Liability (0 - 9)</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '12px', marginBottom: '32px' }}>
                {sellReport.digits?.map((d) => {
                  const isHighRisk = d.liability > (sellReport.total_amount || 0);
                  return (
                    <div
                      key={d.digit}
                      style={{
                        backgroundColor: isHighRisk ? '#fff1f2' : '#ffffff',
                        border: isHighRisk ? '2px solid #f43f5e' : '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: isHighRisk ? '#e11d48' : '#334155' }}>
                        {d.digit}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                        {d.bids_count} Bets
                      </div>
                      <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0284c7', marginTop: '2px' }}>
                        ₹{d.total_points}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: isHighRisk ? '#dc2626' : '#64748b', marginTop: '4px' }}>
                        Risk: ₹{d.liability}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pana Breakdown */}
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1.1rem', color: '#1e293b' }}>Pana Bets Liability</h4>
              {sellReport.panas?.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No Pana bets recorded for this market session.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                        <th style={{ padding: '10px 14px' }}>Pana</th>
                        <th style={{ padding: '10px 14px' }}>Bet Type</th>
                        <th style={{ padding: '10px 14px' }}>Total Bets</th>
                        <th style={{ padding: '10px 14px' }}>Total Amount (₹)</th>
                        <th style={{ padding: '10px 14px' }}>Potential Payout Liability (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellReport.panas?.map((p) => (
                        <tr key={p.pana} style={{ borderBottom: '1px solid #e9ecef' }}>
                          <td style={{ padding: '10px 14px', fontWeight: '800', color: '#1e293b' }}>{p.pana}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{p.type || 'Pana'}</td>
                          <td style={{ padding: '10px 14px' }}>{p.bids_count}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '700', color: '#0284c7' }}>₹{p.total_points}</td>
                          <td style={{ padding: '10px 14px', fontWeight: '800', color: '#e11d48' }}>₹{p.liability}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
              Select a Starline game and date above to view real-time risk & liabilities.
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GAME RATES                                                         */}
      {/* ========================================================================= */}
      {activeTab === 'starline_rates' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', fontWeight: '700', color: '#2b3445' }}>
            Starline Game Rates Management
          </h3>

          <form onSubmit={handleSaveRates}>
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef', color: '#495057' }}>
                    <th style={{ padding: '12px 14px' }}>Game Type</th>
                    <th style={{ padding: '12px 14px' }}>Min Value (₹)</th>
                    <th style={{ padding: '12px 14px' }}>Winning Ratio / Max Value (₹)</th>
                    <th style={{ padding: '12px 14px' }}>Payout Multiplier</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rates.map((r, idx) => {
                    const min = parseFloat(r.min_value) || 10;
                    const max = parseFloat(r.max_value) || 100;
                    const mult = (max / min).toFixed(1);

                    return (
                      <tr key={r.id || idx} style={{ borderBottom: '1px solid #e9ecef' }}>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>
                          {r.type}
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <input
                            type="number"
                            value={r.min_value}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRates((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, min_value: val } : item))
                              );
                            }}
                            style={{ width: '100px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                          />
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <input
                            type="number"
                            value={r.max_value}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRates((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, max_value: val } : item))
                              );
                            }}
                            style={{ width: '120px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.9rem' }}
                          />
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: '700', color: '#16a34a' }}>
                          {mult}x (₹10 $\rightarrow$ ₹{max})
                        </td>
                        <td style={{ padding: '12px 14px' }}>
                          <select
                            value={String(r.status)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRates((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, status: val } : item))
                              );
                            }}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ced4da', fontSize: '0.85rem' }}
                          >
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button
              type="submit"
              disabled={savingRates}
              style={{ backgroundColor: '#556ee6', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              {savingRates ? 'Saving Rates...' : 'Save Starline Rates'}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD GAME                                                           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Add Starline Game</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddGame} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Game Name (English)</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM or STAR 10:30 AM"
                  value={gameForm.games_name}
                  onChange={(e) => setGameForm({ ...gameForm, games_name: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Game Name (Hindi)</label>
                <input
                  type="text"
                  placeholder="e.g. १०:०० सुबह"
                  value={gameForm.games_name_hindi}
                  onChange={(e) => setGameForm({ ...gameForm, games_name_hindi: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Open Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 am"
                    value={gameForm.open_time}
                    onChange={(e) => setGameForm({ ...gameForm, open_time: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Close Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 am"
                    value={gameForm.close_time}
                    onChange={(e) => setGameForm({ ...gameForm, close_time: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', background: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Add Game</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT GAME                                                          */}
      {/* ========================================================================= */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Edit Starline Game</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEditGame} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Game Name</label>
                <input
                  type="text"
                  value={gameForm.games_name}
                  onChange={(e) => setGameForm({ ...gameForm, games_name: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Hindi Name</label>
                <input
                  type="text"
                  value={gameForm.games_name_hindi}
                  onChange={(e) => setGameForm({ ...gameForm, games_name_hindi: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Open Time</label>
                  <input
                    type="text"
                    value={gameForm.open_time}
                    onChange={(e) => setGameForm({ ...gameForm, open_time: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Close Time</label>
                  <input
                    type="text"
                    value={gameForm.close_time}
                    onChange={(e) => setGameForm({ ...gameForm, close_time: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', background: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Update Game</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PREVIEW WINNERS BEFORE DECLARING                                   */}
      {/* ========================================================================= */}
      {isPreviewModalOpen && previewData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                  Preview Winners: {declareForm.game_name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Result: <strong style={{ color: '#b45309' }}>{previewData.pana}-{previewData.digit}</strong> | Date: {declareForm.result_date}
                </span>
              </div>
              <button onClick={() => setIsPreviewModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>TOTAL BIDS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{previewData.total_bids}</div>
              </div>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#059669' }}>WINNERS COUNT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#047857' }}>{previewData.winners_count}</div>
              </div>
              <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#2563eb' }}>TOTAL WIN PAYOUT</div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1d4ed8' }}>₹{Number(previewData.total_winning_amount).toLocaleString()}</div>
              </div>
            </div>

            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#1e293b' }}>Eligible Winning Users List:</h4>
            {previewData.winners?.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                No users won on this result. (Total Payout: ₹0)
              </p>
            ) : (
              <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                      <th style={{ padding: '8px 10px' }}>User Phone</th>
                      <th style={{ padding: '8px 10px' }}>Bet Type</th>
                      <th style={{ padding: '8px 10px' }}>Pana / Digit</th>
                      <th style={{ padding: '8px 10px' }}>Bet Points</th>
                      <th style={{ padding: '8px 10px' }}>Ratio</th>
                      <th style={{ padding: '8px 10px' }}>Win Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.winners.map((w, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', fontWeight: '700' }}>{w.username}</td>
                        <td style={{ padding: '8px 10px' }}>{w.game_type}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0284c7' }}>{w.pana || w.digit}</td>
                        <td style={{ padding: '8px 10px' }}>₹{w.points}</td>
                        <td style={{ padding: '8px 10px', color: '#16a34a', fontWeight: '600' }}>{w.multiplier}x</td>
                        <td style={{ padding: '8px 10px', fontWeight: '800', color: '#16a34a' }}>₹{Number(w.win_amount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setIsPreviewModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Close Preview</button>
              <button
                onClick={handleDeclareResult}
                disabled={declaringLoading}
                style={{ padding: '8px 20px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', fontWeight: '700', cursor: 'pointer' }}
              >
                {declaringLoading ? 'Declaring...' : 'Confirm & Declare Result'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW WINNERS FOR HISTORICAL DECLARED RESULT                        */}
      {/* ========================================================================= */}
      {isWinnerModalOpen && winnerModalData && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>
                  Winners for {winnerModalData.result?.game_name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Result: <strong style={{ color: '#b45309' }}>{winnerModalData.result?.declare_result}</strong> | Date: {winnerModalData.result?.result_date ? String(winnerModalData.result?.result_date).slice(0, 10) : ''}
                </span>
              </div>
              <button onClick={() => setIsWinnerModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '8px 10px' }}>#</th>
                    <th style={{ padding: '8px 10px' }}>User Phone</th>
                    <th style={{ padding: '8px 10px' }}>Bet Type</th>
                    <th style={{ padding: '8px 10px' }}>Winning Pana/Digit</th>
                    <th style={{ padding: '8px 10px' }}>Bet Points</th>
                    <th style={{ padding: '8px 10px' }}>Won Points (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {winnerModalData.winners?.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                        No winning users recorded for this session.
                      </td>
                    </tr>
                  ) : (
                    winnerModalData.winners?.map((w, idx) => (
                      <tr key={w.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0f172a' }}>{w.username}</td>
                        <td style={{ padding: '8px 10px' }}>{w.game_type}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '800', color: '#0284c7' }}>{w.pana || w.digit}</td>
                        <td style={{ padding: '8px 10px' }}>₹{Number(w.points_action || 0).toLocaleString()}</td>
                        <td style={{ padding: '8px 10px', fontWeight: '800', color: '#16a34a' }}>₹{Number(w.winning_points || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setIsWinnerModalOpen(false)} style={{ padding: '8px 18px', borderRadius: '6px', background: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD MANUAL BET                                                     */}
      {/* ========================================================================= */}
      {isAddBidModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Add Manual Starline Bet</h3>
              <button onClick={() => setIsAddBidModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddBid} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>User Phone / Username</label>
                <input
                  type="text"
                  placeholder="e.g. 9876543210"
                  value={bidForm.username}
                  onChange={(e) => setBidForm({ ...bidForm, username: e.target.value })}
                  required
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Game Name</label>
                  <select
                    value={bidForm.game_name}
                    onChange={(e) => setBidForm({ ...bidForm, game_name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.games_name}>{g.games_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Bet Date</label>
                  <input
                    type="date"
                    value={bidForm.date}
                    onChange={(e) => setBidForm({ ...bidForm, date: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '7px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Game Type</label>
                <select
                  value={bidForm.game_type}
                  onChange={(e) => setBidForm({ ...bidForm, game_type: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Single Digit">Single Digit</option>
                  <option value="Single Pana">Single Pana</option>
                  <option value="Double Pana">Double Pana</option>
                  <option value="Triple Pana">Triple Pana</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>
                    {bidForm.game_type === 'Single Digit' ? 'Digit (0-9)' : 'Pana (3 Digits)'}
                  </label>
                  <input
                    type="text"
                    placeholder={bidForm.game_type === 'Single Digit' ? 'e.g. 5' : 'e.g. 125'}
                    value={bidForm.game_type === 'Single Digit' ? bidForm.digit : bidForm.pana}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (bidForm.game_type === 'Single Digit') {
                        setBidForm({ ...bidForm, digit: val });
                      } else {
                        setBidForm({ ...bidForm, pana: val });
                      }
                    }}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Bet Points (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 100"
                    value={bidForm.points_action}
                    onChange={(e) => setBidForm({ ...bidForm, points_action: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddBidModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Place Bet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT BET                                                           */}
      {/* ========================================================================= */}
      {isEditBidModalOpen && editingBid && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Edit Bet #{editingBid.id}</h3>
              <button onClick={() => setIsEditBidModalOpen(false)} style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleEditBid} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>User Phone</label>
                <input
                  type="text"
                  disabled
                  value={editingBid.username}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Pana</label>
                  <input
                    type="text"
                    value={editingBid.pana || ''}
                    onChange={(e) => setEditingBid({ ...editingBid, pana: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Digit</label>
                  <input
                    type="text"
                    value={editingBid.digit || ''}
                    onChange={(e) => setEditingBid({ ...editingBid, digit: e.target.value })}
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Points (₹)</label>
                  <input
                    type="number"
                    value={editingBid.points_action || ''}
                    onChange={(e) => setEditingBid({ ...editingBid, points_action: e.target.value })}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '4px' }}>Status</label>
                  <select
                    value={editingBid.status || 'pending'}
                    onChange={(e) => setEditingBid({ ...editingBid, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  >
                    <option value="pending">pending</option>
                    <option value="win">win</option>
                    <option value="loss">loss</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditBidModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', background: '#556ee6', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Update Bet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
