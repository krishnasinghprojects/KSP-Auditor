"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, History, Settings, Moon, Sun, AlertCircle, X, CheckCircle, Clock, Link2, Type, Hash, Image as ImageIcon, PanelLeft, MessageSquare, Send, RefreshCw, Download, Share2, AlignLeft, Code, Palette, HelpCircle, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { analyzeSeo } from '../../lib/scoring';
import { jsPDF } from 'jspdf';

export default function Auditor({ initialSlug }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [scoreData, setScoreData] = useState(null);
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  
  // Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Modals & UI State
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });
  const [settingsModal, setSettingsModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Load local storage data
    const savedHistory = localStorage.getItem('pulseHistory');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedChats = localStorage.getItem('pulseChats');
    if (savedChats) setChatHistories(JSON.parse(savedChats));
    
    const savedTheme = localStorage.getItem('pulseTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // If there's an initial slug, decode it and run audit
    if (initialSlug) {
      try {
        const decodedUrl = atob(initialSlug);
        setUrl(decodedUrl);
        handleAudit(null, decodedUrl);
      } catch (e) {
        console.error("Invalid share link");
      }
    }
  }, [initialSlug]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistories, url, chatOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pulseTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleAudit = async (e, targetUrl = url) => {
    if (e) e.preventDefault();
    if (!targetUrl.trim()) return;

    setLoading(true);
    setReport(null);
    setScoreData(null);

    // Update URL bar
    window.history.pushState(null, '', '/' + btoa(targetUrl));

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl })
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        setErrorModal({ open: true, message: json.error || 'Something went wrong.' });
      } else {
        setUrl(targetUrl); // sync url state if we passed it in manually
        setReport(json.data);
        setScoreData(analyzeSeo(json.data));
        
        const newEntry = { 
          id: Date.now(),
          url: targetUrl, 
          title: json.data.title || targetUrl,
          favicon: json.data.favicon,
          reportData: json.data
        };
        const updatedHistory = [newEntry, ...history.filter(h => h.url !== targetUrl)].slice(0, 15);
        setHistory(updatedHistory);
        localStorage.setItem('pulseHistory', JSON.stringify(updatedHistory));
      }
    } catch (err) {
      setErrorModal({ open: true, message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item) => {
    setUrl(item.url);
    window.history.pushState(null, '', '/' + btoa(item.url));
    if (item.reportData) {
      setReport(item.reportData);
      setScoreData(analyzeSeo(item.reportData));
    } else {
      setReport(null);
      setScoreData(null);
    }
  };

  const clearAudit = () => {
    setUrl('');
    setReport(null);
    setScoreData(null);
    window.history.pushState(null, '', '/');
  };

  const shareReport = async () => {
    try {
      const encodedUrl = btoa(url);
      const shareUrl = `${window.location.origin}/${encodedUrl}`;
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  const exportPdf = () => {
    if (!report) return;
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("KSP Auditor Report", 20, 20);
      
      pdf.setFontSize(14);
      pdf.text(`URL: ${url}`, 20, 30);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
      
      pdf.setFontSize(16);
      pdf.text("SEO Score", 20, 60);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Score: ${scoreData?.score || 'N/A'} / 100`, 20, 70);
      
      let y = 90;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Audit Details", 20, y);
      y += 10;
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      const details = [
        `HTTP Status: ${report.status}`,
        `Response Time: ${report.responseTime} ms`,
        `Page Title: ${report.title || 'N/A'}`,
        `Meta Description: ${report.metaDescription || 'N/A'}`,
        `H1 Count: ${report.h1Count}`,
        `Images missing Alt: ${report.imagesMissingAlt} / ${report.totalImages}`,
        `Word Count: ~${report.wordCount?.toLocaleString()}`,
        `Paragraphs: ${report.paragraphs}`,
        `Internal Links: ${report.internalLinks}`,
        `External Links: ${report.externalLinks}`,
        `Scripts: ${report.scripts}`,
        `Stylesheets: ${report.stylesheets}`
      ];
      
      details.forEach(detail => {
        const lines = pdf.splitTextToSize(detail, 170);
        pdf.text(lines, 20, y);
        y += (lines.length * 7);
        if (y > 280) {
          pdf.addPage();
          y = 20;
        }
      });
      
      if (scoreData?.recommendations?.length > 0) {
        y += 10;
        if (y > 270) { pdf.addPage(); y = 20; }
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Actionable Recommendations", 20, y);
        y += 10;
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        scoreData.recommendations.forEach(rec => {
          const lines = pdf.splitTextToSize(`• ${rec}`, 170);
          pdf.text(lines, 20, y);
          y += (lines.length * 7);
          if (y > 280) {
            pdf.addPage();
            y = 20;
          }
        });
      }
      
      pdf.save(`KSP-Audit-${url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
    } catch (error) {
      alert("Failed to generate PDF");
    }
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    setDeleteModal({ open: true, id });
  };

  const confirmDelete = () => {
    const updatedHistory = history.filter(h => h.id !== deleteModal.id);
    setHistory(updatedHistory);
    localStorage.setItem('pulseHistory', JSON.stringify(updatedHistory));
    
    const deletedItem = history.find(h => h.id === deleteModal.id);
    if (deletedItem && deletedItem.url === url) {
      clearAudit();
    }
    
    setDeleteModal({ open: false, id: null });
  };

  const filteredHistory = history.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeChat = chatHistories[url] || [];

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !url) return;

    const messageText = chatInput.trim();
    setChatInput('');
    setChatLoading(true);

    const updatedChat = [...activeChat, { role: 'user', parts: [{ text: messageText }] }];
    setChatHistories({ ...chatHistories, [url]: updatedChat });

    // Inject recommendations context if available
    let enrichedReport = report;
    if (scoreData && scoreData.recommendations) {
      enrichedReport = { ...report, aiRecommendationsContext: scoreData.recommendations };
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url, 
          auditReport: enrichedReport, 
          history: activeChat,
          message: messageText
        })
      });

      const json = await res.json();
      
      if (res.ok && json.text) {
        const finalChat = [...updatedChat, { role: 'model', parts: [{ text: json.text }] }];
        const newChatsFinal = { ...chatHistories, [url]: finalChat };
        setChatHistories(newChatsFinal);
        localStorage.setItem('pulseChats', JSON.stringify(newChatsFinal));
      } else {
        const errorChat = [...updatedChat, { role: 'model', parts: [{ text: `Error: ${json.error || 'Failed to get response.'}` }] }];
        setChatHistories({ ...chatHistories, [url]: errorChat });
      }
    } catch (err) {
      const errorChat = [...updatedChat, { role: 'model', parts: [{ text: 'Error: Network failure.' }] }];
      setChatHistories({ ...chatHistories, [url]: errorChat });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar Toggle */}
      <button className="floating-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar" style={{ top: '1rem', left: '1rem', height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PanelLeft size={20} />
      </button>

      {/* Desktop Settings Toggle */}
      <button className="floating-btn" onClick={() => setSettingsModal(true)} title="Settings" style={{ top: '1rem', right: '1rem', height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Settings size={20} />
      </button>

      {/* Mobile Top Bar */}
      <div className="mobile-history-bar">
        <button className="btn" style={{ padding: '0.5rem', flexShrink: 0 }} onClick={() => setSettingsModal(true)}>
          <Settings size={20} />
        </button>
        <div className="premium-search-wrapper" style={{ width: '150px', flexShrink: 0, padding: '0.25rem 0.75rem' }}>
          <input type="text" placeholder="Search..." className="premium-search-input" style={{ fontSize: '0.9rem', padding: '0.25rem 0' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        {filteredHistory.map(item => (
          <div key={item.id} onClick={() => loadFromHistory(item)} style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }} title={item.title}>
            {item.favicon ? <img src={item.favicon} alt="" style={{ width: '24px', height: '24px' }} onError={(e) => { e.target.style.display = 'none'; }} /> : <Link2 size={20} color="var(--text-secondary)" />}
          </div>
        ))}
      </div>

      {/* Desktop Sidebar */}
      <aside className={`sidebar ${!isSidebarOpen ? 'collapsed' : ''}`} style={{ paddingBottom: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '42px', paddingLeft: '3.5rem', marginBottom: '1rem' }}> 
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', margin: 0, lineHeight: 1 }}>
            <History size={20} /> History
          </h2>
        </div>
        
        <div style={{ padding: '0 1rem 1rem 1rem' }}>
          <div className="premium-search-wrapper" style={{ padding: '0.25rem 1rem' }}>
            <Search size={16} style={{ color: 'var(--text-secondary)', marginRight: '0.5rem' }} />
            <input type="text" placeholder="Search history..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="premium-search-input" style={{ fontSize: '0.9rem', padding: '0.25rem 0' }} />
          </div>
          {/* New Audit Button in Sidebar */}
          <button className="btn" style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }} onClick={clearAudit}>
          New Audit
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {filteredHistory.map(item => (
            <div key={item.id} onClick={() => loadFromHistory(item)} className="glass-panel" style={{ padding: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', borderRadius: '8px', position: 'relative' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.favicon ? <img src={item.favicon} alt="" style={{ width: '20px', height: '20px' }} onError={(e) => { e.target.style.display = 'none'; }} /> : <Link2 size={16} color="var(--text-secondary)" />}
              </div>
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', flex: 1, paddingRight: '24px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.url}</div>
              </div>
              <button 
                onClick={(e) => handleDelete(item.id, e)} 
                className="btn" 
                style={{ position: 'absolute', right: '0.5rem', padding: '0.25rem', backgroundColor: 'transparent', border: 'none' }}
                title="Delete Audit"
              >
                <Trash2 size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div style={{ padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>KSP Auditor</h1>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
            Audit any URL for SEO metrics and structure in seconds.
          </p>

          <form onSubmit={handleAudit} style={{ marginBottom: '2rem' }}>
            <div className="premium-search-wrapper">
              <input type="text" className="premium-search-input" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
              <button type="submit" className="premium-search-btn" disabled={loading}>
                {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }} /> : <Search size={20} />}
                <span>Audit</span>
              </button>
            </div>
          </form>

          {/* Skeletons */}
          {loading && (
            <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
              <div className="skeleton skeleton-title"></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-card" style={{ gridColumn: '1 / -1' }}></div>
                <div className="skeleton skeleton-card"></div>
                <div className="skeleton skeleton-card"></div>
              </div>
            </div>
          )}

          {/* Actual Report */}
          {report && !loading && (
            <div style={{ background: 'var(--bg-primary)' }}>
              
              {/* Score Panel */}
              {scoreData && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--text-primary)', flexShrink: 0 }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700 }}>{scoreData.score}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ 100</span>
                    
                  </div>
          
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>SEO Score</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {scoreData.metrics.map((m, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          <span>{m.label}</span>
                          <strong style={{ color: m.value >= 0 ? 'inherit' : 'var(--text-primary)' }}>
                            {m.value > 0 ? `+${m.value}` : m.value}
                          </strong>
                        </div>
                      ))}
                    <button className="btn btn-primary" style={{maxWidth:"300px",marginTop:"10px"}} onClick={exportPdf}><Download size={16} /> Export PDF</button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button className="btn" style={{ display: "none" }} onClick={shareReport}><Share2 size={16} />Share Link</button>
                  </div>
                </div>
              )}

              {/* Recommendations Panel */}
              {scoreData && scoreData.recommendations.length > 0 && (
                <div className="glass-panel animate-fade-in" style={{ padding: '2rem', marginBottom: '2rem', border: '4px solid var(--text-primary)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertCircle size={20} /> Actionable Recommendations</h3>
                  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {scoreData.recommendations.map((rec, i) => (
                      <li key={i} style={{ fontSize: '1rem', lineHeight: 1.5 }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="glass-panel animate-fade-in" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                  Audit Details
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                  
                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <CheckCircle size={18} /> 
                      <div className="tooltip-container">
                        HTTP Status
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">The HTTP response code returned by the server. 200 means OK.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.status}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Clock size={18} /> 
                      <div className="tooltip-container">
                        Response Time
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Time taken for the server to respond to the request.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.responseTime} ms</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Type size={18} /> 
                      <div className="tooltip-container">
                        Page Title
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">The main title of the page, crucial for SEO and tab naming.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{report.title || 'N/A'}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem', gridColumn: '1 / -1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Type size={18} /> 
                      <div className="tooltip-container">
                        Meta Description
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">A brief description of the page used by search engines.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>{report.metaDescription || 'N/A'}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Hash size={18} /> 
                      <div className="tooltip-container">
                        H1 Count
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">H1 headings help search engines understand the main topic of your page.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.h1Count}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <ImageIcon size={18} /> 
                      <div className="tooltip-container">
                        Images missing Alt
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Alt text is required for accessibility and helps image SEO.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.imagesMissingAlt} / {report.totalImages}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Type size={18} /> 
                      <div className="tooltip-container">
                        Word Count
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Total number of visible words on the page.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>~{report.wordCount?.toLocaleString()}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <AlignLeft size={18} /> 
                      <div className="tooltip-container">
                        Paragraphs
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Total paragraph tags found on the page.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.paragraphs}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Link2 size={18} /> 
                      <div className="tooltip-container">
                        Internal Links
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Links pointing to pages on the same domain.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.internalLinks}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Link2 size={18} /> 
                      <div className="tooltip-container">
                        External Links
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Links pointing to external domains.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.externalLinks}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Code size={18} /> 
                      <div className="tooltip-container">
                        Scripts
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Total script tags found.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.scripts}</div>
                  </div>

                  <div className="glass-panel" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <Palette size={18} /> 
                      <div className="tooltip-container">
                        Stylesheets
                        <HelpCircle size={14} className="tooltip-icon" />
                        <span className="tooltip-text">Total CSS stylesheets linked.</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{report.stylesheets}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Chat Button */}
      <button className="chat-btn" onClick={() => setChatOpen(!chatOpen)} title="Open AI Assistant">
        {chatOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="glass-panel chat-window animate-fade-in">
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} />
            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 600 }}>SEO Assistant</h3>
          </div>
          
          <div className="chat-messages">
            {!url ? (
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center', margin: 'auto' }}>Please audit a URL to begin chatting.</p>
            ) : activeChat.length === 0 ? (
              <div className="chat-message bot animate-fade-in">
                <p>Hello! I am ready to analyze <strong>{url}</strong>.</p>
                <p>Ask me for SEO recommendations, or how to improve any metrics based on the audit.</p>
              </div>
            ) : (
              activeChat.map((msg, i) => (
                <div key={i} className={`chat-message ${msg.role === 'user' ? 'user' : 'bot'} animate-fade-in`}>
                  {msg.role === 'model' ? <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown> : msg.parts[0].text}
                </div>
              ))
            )}
            
            {chatLoading && (
              <div className="chat-message bot animate-fade-in">
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-wrapper" onSubmit={handleSendMessage}>
            <input type="text" className="chat-input" placeholder={url ? "Ask about this page..." : "Audit a page first..."} value={chatInput} onChange={(e) => setChatInput(e.target.value)} disabled={!url || chatLoading} />
            <button type="submit" className="chat-send-btn" disabled={!chatInput.trim() || !url || chatLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Global Fixed Footer */}
      <footer style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', padding: '1rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)', backgroundColor: 'var(--glass-bg)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', zIndex: 50, fontSize: '0.9rem' }}>
        Built for Digital Heroes Training Task. 
        <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer" style={{ marginLeft: '0.5rem', textDecoration: 'underline', fontWeight: 600 }}>
          digitalheroesco.com
        </a>
      </footer>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Delete Audit?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to delete this audit from your history? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" style={{ flex: 1, padding: '0.75rem' }} onClick={() => setDeleteModal({ open: false, id: null })}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem' }} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--bg-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem' }}>Settings</h2>
              <button className="btn" style={{ padding: '0.5rem' }} onClick={() => setSettingsModal(false)}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '0px solid var(--glass-border)' }}>
              <span style={{ fontSize: '1.1rem' }}>Theme</span>
              <button className="btn" onClick={toggleTheme}>
                {theme === 'light' ? <><Moon size={18} /> Dark Mode</> : <><Sun size={18} /> Light Mode</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '400px', padding: '2rem', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              <AlertCircle size={28} />
              <h2 style={{ fontSize: '1.5rem' }}>Error</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>{errorModal.message}</p>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setErrorModal({ open: false, message: '' })}>Dismiss</button>
          </div>
        </div>
      )}
    </div>
  );
}
