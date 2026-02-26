import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      {/* Glowing orbs */}
      <div style={{ position:'fixed', top:'10%', left:'10%', width:'300px', height:'300px',
        background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'10%', right:'10%', width:'250px', height:'250px',
        background:'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

      <div className="fade-in" style={{
        background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px',
        padding: '48px', width: '100%', maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{
            width:'60px', height:'60px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius:'16px', margin:'0 auto 16px', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'28px', boxShadow:'0 8px 32px rgba(99,102,241,0.4)'
          }}>⚡</div>
          <h1 style={{ fontSize:'28px', fontWeight:'700', color:'white', marginBottom:'4px' }}>Welcome Back</h1>
          <p style={{ color:'#94a3b8', fontSize:'14px' }}>Sign in to your CRM</p>
        </div>

        {error && (
          <div style={{
            background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
            borderRadius:'12px', padding:'12px 16px', marginBottom:'20px',
            color:'#fca5a5', fontSize:'14px', textAlign:'center'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:'16px' }}>
            <label style={{ display:'block', color:'#94a3b8', fontSize:'13px', marginBottom:'8px', fontWeight:'500' }}>Email</label>
            <input
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              style={{
                width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(99,102,241,0.3)', borderRadius:'12px', color:'white',
                fontSize:'14px', outline:'none', boxSizing:'border-box',
                transition:'border-color 0.2s'
              }}
              onFocus={e => e.target.style.borderColor='#6366f1'}
              onBlur={e => e.target.style.borderColor='rgba(99,102,241,0.3)'}
            />
          </div>

          <div style={{ marginBottom:'24px' }}>
            <label style={{ display:'block', color:'#94a3b8', fontSize:'13px', marginBottom:'8px', fontWeight:'500' }}>Password</label>
            <input
              type="password" placeholder="••••••••"
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} required
              style={{
                width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(99,102,241,0.3)', borderRadius:'12px', color:'white',
                fontSize:'14px', outline:'none', boxSizing:'border-box'
              }}
              onFocus={e => e.target.style.borderColor='#6366f1'}
              onBlur={e => e.target.style.borderColor='rgba(99,102,241,0.3)'}
            />
          </div>

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'14px', borderRadius:'12px', border:'none', cursor:'pointer',
            background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color:'white', fontSize:'15px', fontWeight:'600',
            boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.4)',
            transition:'all 0.2s', transform: loading ? 'none' : 'translateY(0)',
          }}
            onMouseEnter={e => { if(!loading) e.target.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.transform='translateY(0)'; }}
          >
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </button>
        </form>

<p style={{ textAlign:'center', marginTop:'24px', color:'#64748b', fontSize:'14px' }}>
  Don't have an account?{' '}
  <Link to="/signup" style={{ color:'#6366f1', textDecoration:'none', fontWeight:'600' }}>
    Sign up
  </Link>
</p>
      
      </div>
    </div>
  );
}