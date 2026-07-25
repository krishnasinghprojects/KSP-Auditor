"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Zap, Share2, BarChart2, CheckCircle, XCircle, Moon, Sun } from 'lucide-react';

export default function LandingPage() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('pulseTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('pulseTheme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <header style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-young-serif)' }}>KSP Auditor</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%' }} title="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <Link href="/" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontWeight: 600 }}>
            Launch App
          </Link>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', padding: '6rem 2rem 4rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Deterministic SEO. <br/>
            <span style={{ color: 'var(--text-secondary)' }}>Powered by AI.</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
            Audit any URL instantly. Extract deep structural metrics, generate a deterministic score, and consult a context-aware AI assistant to perfect your SEO strategy.
          </p>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', padding: '1rem 2.5rem' }}>
            Try KSP Auditor <ArrowRight size={20} />
          </Link>
        </section>

        {/* Primary Product Showcase */}
        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto 6rem auto' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '0.5rem', borderRadius: '16px' }}>
            <div style={{ overflow: 'hidden', borderRadius: '12px' }}>
              <img 
                src="/ProductPhotos/Image2-3020x1800.webp" 
                alt="KSP Auditor Interface" 
                style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '3020/1800', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '4rem' }}>Unparalleled Analysis.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <Bot size={32} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Context-Aware AI Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Our Gemini-powered chatbot natively ingests your audit's structural metrics and actionable recommendations, providing hyper-specific advice for the exact URL you are analyzing.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <BarChart2 size={32} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Deterministic Scoring</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Forget arbitrary metrics. KSP Auditor calculates a strict, predictable score out of 100 based on core SEO fundamentals like Title tags, H1 presence, and response times.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <Zap size={32} style={{ marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Deep DOM Extraction</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Utilizing high-performance HTML parsing, KSP Auditor rapidly extracts internal vs external link counts, missing image alts, scripts, stylesheets, and precise paragraph structures.
              </p>
            </div>

          </div>
        </section>

        {/* Comparison Section */}
        <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>Why We Win.</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.1rem' }}>
            A comparison against traditional, legacy SEO auditing tools.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', opacity: 0.7 }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Legacy Analyzers</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><XCircle size={20} color="var(--text-secondary)" /> Cluttered, overwhelming UI</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><XCircle size={20} color="var(--text-secondary)" /> Secret, arbitrary score calculations</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><XCircle size={20} color="var(--text-secondary)" /> Static recommendations</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><XCircle size={20} color="var(--text-secondary)" /> Requires account to share reports</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><XCircle size={20} color="var(--text-secondary)" /> Paywalled PDF exports</li>
              </ul>
            </div>
            
            <div className="glass-panel" style={{ padding: '2.5rem', border: '2px solid var(--text-primary)' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>KSP Auditor</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} /> Pure monochrome glassmorphism</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} /> 100% Deterministic, transparent scoring</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} /> Gemini AI context-aware assistant</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} /> Serverless URL base64 sharing</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={20} /> Free, instant lightweight PDFs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Secondary Product Showcase */}
        <section style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '4rem', alignItems: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '0.5rem', borderRadius: '16px', width: '100%' }}>
            <div style={{ overflow: 'hidden', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
              <img 
                src="/ProductPhotos/Image1-2030x1620.webp" 
                alt="KSP Auditor Detail View" 
                style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '2030/1620', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section style={{ padding: '6rem 2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>Simple Pricing.</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '4rem', fontSize: '1.1rem' }}>
            Choose the plan that scales with your workflow.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Free Forever */}
            <div className="glass-panel" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Free Forever</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>$0<span style={{ fontSize: '1.2rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/mo</span></div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> 50 URL Audits per month</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> 10 AI Chat Consultations / mo</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Serverless Link Sharing</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Standard PDF Exports</li>
              </ul>
              
              <Link href="/" className="btn" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}>
                Start for Free
              </Link>
            </div>

            {/* Enterprise */}
            <div className="glass-panel" style={{ padding: '3rem 2.5rem', border: '2px solid var(--text-primary)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '1.5rem', right: '-2rem', background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '0.25rem 3rem', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: 800 }}>PRO</div>
              
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Enterprise</h3>
              <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '2rem' }}>Custom</div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Unlimited URL Audits</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Unlimited AI Context Syncs</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Custom Domain Share Links</li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}><CheckCircle size={18} /> Priority SLA Support</li>
              </ul>
              
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1.1rem' }}>
                Talk to Sales
              </button>
            </div>
          </div>
        </section>

        {/* Final CTA wrapped in Glass Frame */}
        <section style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto 8rem auto', textAlign: 'center' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '5rem 2rem', borderRadius: '24px', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontFamily: 'var(--font-young-serif)' }}>Ready to Get Started?</h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
              Audit your first URL right now. No credit card required. Experience the power of deterministic SEO analysis.
            </p>
            
            <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
              <Link href="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem', padding: '1.25rem 3rem', borderRadius: '14px' }}>
                Try Our Product <ArrowRight size={24} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Global Fixed Footer */}
      <footer style={{ 
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--glass-border)',
        backgroundColor: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontSize: '0.9rem',
        marginTop: 'auto'
      }}>
        Built for Digital Heroes Training Task. 
        <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer" style={{ marginLeft: '0.5rem', textDecoration: 'underline', fontWeight: 600 }}>
          digitalheroesco.com
        </a>
      </footer>

    </div>
  );
}
