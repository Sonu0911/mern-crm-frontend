import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');

    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'12px 16px', background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(99,102,241,0.3)', borderRadius:'12px', color:'white',
    fontSize:'14px', outline:'none', boxSizing:'border-box'
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <div style={{ position:'fixed', top:'20%', right:'15%', width:'200px', height:'200px',
        background:'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

      <div className="fade-in" style={{
        background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
        border:'1px solid rgba(99,102,241,0.2)', borderRadius:'24px',
        padding:'48px', width:'100%', maxWidth:'420px',
        boxShadow:'0 25px 50px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{
            width:'60px', height:'60px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius:'16px', margin:'0 auto 16px', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:'28px', boxShadow:'0 8px 32px rgba(99,102,241,0.4)'
          }}>🚀</div>
          <h1 style={{ fontSize:'28px', fontWeight:'700', color:'white', marginBottom:'4px' }}>Create Account</h1>
          <p style={{ color:'#94a3b8', fontSize:'14px' }}>Join your CRM platform</p>
        </div>

        {error && (
          <div style={{
            background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
            borderRadius:'12px', padding:'12px 16px', marginBottom:'20px',
            color:'#fca5a5', fontSize:'14px', textAlign:'center'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {[
            { key:'name', type:'text', label:'Full Name', placeholder:'Rushikesh Galchelwar' },
            { key:'email', type:'email', label:'Email', placeholder:'you@example.com' },
            { key:'password', type:'password', label:'Password', placeholder:'Min 8 characters' },
          ].map(({ key, type, label, placeholder }) => (
            <div key={key} style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:'13px', marginBottom:'8px', fontWeight:'500' }}>{label}</label>
              <input type={type} placeholder={placeholder}
                value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                required style={inputStyle}
                onFocus={e => e.target.style.borderColor='#6366f1'}
                onBlur={e => e.target.style.borderColor='rgba(99,102,241,0.3)'}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{
            width:'100%', padding:'14px', borderRadius:'12px', border:'none', cursor:'pointer',
            background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color:'white', fontSize:'15px', fontWeight:'600', marginTop:'8px',
            boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.4)',
            transition:'all 0.2s'
          }}
            onMouseEnter={e => { if(!loading) e.target.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.target.style.transform='translateY(0)'; }}
          >
            {loading ? '⏳ Creating...' : 'Create Account →'}
          </button>
        </form>

    <p style={{ textAlign:'center', marginTop:'24px', color:'#64748b', fontSize:'14px' }}>
  Already have an account?{' '}
  <Link to="/login" style={{ color:'#6366f1', textDecoration:'none', fontWeight:'600' }}>Login</Link>
</p>
      </div>
    </div>
  );
}   