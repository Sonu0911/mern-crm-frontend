import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';

const statusConfig = {
  Lead:     { color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  icon:'🎯' },
  Prospect: { color:'#6366f1', bg:'rgba(99,102,241,0.1)',  icon:'👀' },
  Customer: { color:'#10b981', bg:'rgba(16,185,129,0.1)',  icon:'⭐' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page:1, totalPages:1, total:0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', status:'Lead', notes:'' });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchContacts = async (page = 1) => {
    try {
      const params = { page, limit:10 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/contacts', { params });
      setContacts(data.contacts);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
  };
  const [activities, setActivities] = useState([]);

const fetchActivities = async () => {
  try {
    const { data } = await api.get('/activities');
    setActivities(data);
  } catch (err) { console.error(err); }
};

useEffect(() => { fetchContacts(); fetchActivities(); }, [search, statusFilter]);

  useEffect(() => { fetchContacts(); }, [search, statusFilter]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editContact) await api.put(`/contacts/${editContact._id}`, form);
      else await api.post('/contacts', form);
      setShowForm(false);
      setEditContact(null);
      setForm({ name:'', email:'', phone:'', company:'', status:'Lead', notes:'' });
      fetchContacts();
      fetchActivities(); // ← YEH ADD KARO
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleEdit = (c) => {
    setEditContact(c);
    setForm({ name:c.name, email:c.email, phone:c.phone||'', company:c.company||'', status:c.status, notes:c.notes||'' });
    setShowForm(true);
  };

 const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return;
    setDeleteLoading(id);
    await api.delete(`/contacts/${id}`);
    setDeleteLoading(null);
    fetchContacts();
    fetchActivities(); // ← YEH ADD KARO
  };
  const inputStyle = {
    width:'100%', padding:'11px 14px', background:'rgba(255,255,255,0.05)',
    border:'1px solid rgba(99,102,241,0.3)', borderRadius:'10px', color:'white',
    fontSize:'14px', outline:'none', boxSizing:'border-box', marginBottom:'12px'
  };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)' }}>

      {/* Navbar */}
      <nav style={{
        background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
        borderBottom:'1px solid rgba(99,102,241,0.2)', padding:'16px 32px',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        position:'sticky', top:0, zIndex:100
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          <div style={{
            width:'36px', height:'36px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'
          }}>⚡</div>
          <span style={{ color:'white', fontWeight:'700', fontSize:'18px' }}>CRM Pro</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <div style={{
            display:'flex', alignItems:'center', gap:'8px',
            background:'rgba(255,255,255,0.05)', padding:'8px 16px', borderRadius:'20px'
          }}>
            <div style={{
              width:'28px', height:'28px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'12px', fontWeight:'700', color:'white'
            }}>{user?.name?.[0]?.toUpperCase()}</div>
            <span style={{ color:'#e2e8f0', fontSize:'14px' }}>{user?.name}</span>
          </div>
          <button onClick={logout} style={{
            padding:'8px 20px', background:'rgba(239,68,68,0.1)', color:'#fca5a5',
            border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', cursor:'pointer',
            fontSize:'13px', fontWeight:'500'
          }}
            onMouseEnter={e => e.target.style.background='rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.target.style.background='rgba(239,68,68,0.1)'}
          >Logout</button>
        </div>
      </nav>

      <div style={{ padding:'32px', maxWidth:'1400px', margin:'0 auto' }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'16px', marginBottom:'32px' }}>
          {[
            { label:'Total Contacts', value: pagination.total,                                    icon:'👥', color:'#6366f1' },
            { label:'Leads',          value: contacts.filter(c=>c.status==='Lead').length,         icon:'🎯', color:'#f59e0b' },
            { label:'Prospects',      value: contacts.filter(c=>c.status==='Prospect').length,     icon:'👀', color:'#8b5cf6' },
            { label:'Customers',      value: contacts.filter(c=>c.status==='Customer').length,     icon:'⭐', color:'#10b981' },
          ].map((stat, i) => (
            <div key={i} className="fade-in" style={{
              background:'rgba(255,255,255,0.03)', border:`1px solid ${stat.color}33`,
              borderRadius:'16px', padding:'20px', animationDelay:`${i*0.1}s`
            }}>
              <div style={{ fontSize:'24px', marginBottom:'8px' }}>{stat.icon}</div>
              <div style={{ fontSize:'28px', fontWeight:'700', color:'white' }}>{stat.value}</div>
              <div style={{ fontSize:'13px', color:'#64748b', marginTop:'4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(99,102,241,0.2)',
          borderRadius:'16px', padding:'20px', marginBottom:'24px',
          display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center'
        }}>
          <input
            placeholder="🔍 Search by name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              flex:1, minWidth:'200px', padding:'11px 16px',
              background:'rgba(255,255,255,0.05)', border:'1px solid rgba(99,102,241,0.3)',
              borderRadius:'10px', color:'white', fontSize:'14px', outline:'none'
            }}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding:'11px 16px', background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(99,102,241,0.3)', borderRadius:'10px',
              color:'white', fontSize:'14px', outline:'none', cursor:'pointer'
            }}>
            <option value="" style={{background:'#1a1a2e'}}>All Status</option>
            <option value="Lead" style={{background:'#1a1a2e'}}>🎯 Lead</option>
            <option value="Prospect" style={{background:'#1a1a2e'}}>👀 Prospect</option>
            <option value="Customer" style={{background:'#1a1a2e'}}>⭐ Customer</option>
          </select>
          <button onClick={() => { setShowForm(true); setEditContact(null); setForm({ name:'', email:'', phone:'', company:'', status:'Lead', notes:'' }); }}
            style={{
              padding:'11px 24px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color:'white', border:'none', borderRadius:'10px', cursor:'pointer',
              fontSize:'14px', fontWeight:'600', boxShadow:'0 4px 15px rgba(99,102,241,0.4)',
              transition:'all 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform='translateY(0)'}
          >+ Add Contact</button>
        </div>

        {/* Contact Grid */}
        {contacts.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'#475569' }}>
            <div style={{ fontSize:'64px', marginBottom:'16px' }}>📭</div>
            <p style={{ fontSize:'18px' }}>No contacts found</p>
            <p style={{ fontSize:'14px', marginTop:'8px' }}>Click + Add Contact to get started</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'16px' }}>
            {contacts.map((c, i) => (
              <div key={c._id} className="fade-in" style={{
                background:'rgba(255,255,255,0.03)', backdropFilter:'blur(10px)',
                border:'1px solid rgba(99,102,241,0.15)', borderRadius:'16px', padding:'24px',
                transition:'all 0.3s', animationDelay:`${i*0.05}s`
              }}
                onMouseEnter={e => { e.currentTarget.style.border='1px solid rgba(99,102,241,0.4)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.border='1px solid rgba(99,102,241,0.15)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
              >
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{
                      width:'44px', height:'44px', borderRadius:'12px',
                      background:`linear-gradient(135deg, ${statusConfig[c.status].color}33, ${statusConfig[c.status].color}66)`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'18px', fontWeight:'700', color:statusConfig[c.status].color
                    }}>{c.name[0].toUpperCase()}</div>
                    <div>
                      <h3 style={{ color:'white', fontWeight:'600', fontSize:'16px' }}>{c.name}</h3>
                      {c.company && <p style={{ color:'#64748b', fontSize:'12px', marginTop:'2px' }}>🏢 {c.company}</p>}
                    </div>
                  </div>
                  <span style={{
                    background: statusConfig[c.status].bg, color: statusConfig[c.status].color,
                    padding:'4px 12px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                    border:`1px solid ${statusConfig[c.status].color}44`
                  }}>{statusConfig[c.status].icon} {c.status}</span>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'16px' }}>
                  <p style={{ color:'#94a3b8', fontSize:'13px' }}>📧 {c.email}</p>
                  {c.phone && <p style={{ color:'#94a3b8', fontSize:'13px' }}>📞 {c.phone}</p>}
                  {c.notes && <p style={{ color:'#475569', fontSize:'12px', fontStyle:'italic', marginTop:'4px', borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:'8px' }}>"{c.notes}"</p>}
                </div>

                <div style={{ display:'flex', gap:'8px' }}>
                  <button onClick={() => handleEdit(c)} style={{
                    flex:1, padding:'9px', background:'rgba(99,102,241,0.1)',
                    color:'#818cf8', border:'1px solid rgba(99,102,241,0.3)',
                    borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:'500',
                    transition:'all 0.2s'
                  }}
                    onMouseEnter={e => e.target.style.background='rgba(99,102,241,0.2)'}
                    onMouseLeave={e => e.target.style.background='rgba(99,102,241,0.1)'}
                  >✏️ Edit</button>
                  <button onClick={() => handleDelete(c._id)} disabled={deleteLoading === c._id} style={{
                    flex:1, padding:'9px', background:'rgba(239,68,68,0.1)',
                    color:'#fca5a5', border:'1px solid rgba(239,68,68,0.3)',
                    borderRadius:'10px', cursor:'pointer', fontSize:'13px', fontWeight:'500',
                    transition:'all 0.2s'
                  }}
                    onMouseEnter={e => e.target.style.background='rgba(239,68,68,0.2)'}
                    onMouseLeave={e => e.target.style.background='rgba(239,68,68,0.1)'}
                  >{deleteLoading === c._id ? '⏳' : '🗑️ Delete'}</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'32px' }}>
            <button disabled={pagination.page === 1} onClick={() => fetchContacts(pagination.page - 1)}
              style={{
                padding:'8px 20px', background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(99,102,241,0.3)', borderRadius:'10px',
                color:'#94a3b8', cursor:'pointer', fontSize:'14px',
                opacity: pagination.page === 1 ? 0.4 : 1
              }}>← Prev</button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i+1).map(p => (
              <button key={p} onClick={() => fetchContacts(p)} style={{
                padding:'8px 16px', borderRadius:'10px', border:'none', cursor:'pointer', fontSize:'14px',
                background: p === pagination.page ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                color: p === pagination.page ? 'white' : '#94a3b8',
                boxShadow: p === pagination.page ? '0 4px 15px rgba(99,102,241,0.4)' : 'none'
              }}>{p}</button>
            ))}
            <button disabled={pagination.page === pagination.totalPages} onClick={() => fetchContacts(pagination.page + 1)}
              style={{
                padding:'8px 20px', background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(99,102,241,0.3)', borderRadius:'10px',
                color:'#94a3b8', cursor:'pointer', fontSize:'14px',
                opacity: pagination.page === pagination.totalPages ? 0.4 : 1
              }}>Next →</button>
          </div>
        )}
      </div>
      {/* Activity Log */}
{activities.length > 0 && (
  <div style={{
    marginTop:'40px', background:'rgba(255,255,255,0.03)',
    border:'1px solid rgba(99,102,241,0.2)', borderRadius:'16px', padding:'24px'
  }}>
    <h3 style={{ color:'white', fontSize:'18px', fontWeight:'700', marginBottom:'20px' }}>
      📋 Activity Log
    </h3>
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {activities.map((a, i) => (
        <div key={i} style={{
          display:'flex', alignItems:'center', gap:'16px',
          padding:'12px 16px', background:'rgba(255,255,255,0.03)',
          borderRadius:'10px', border:'1px solid rgba(255,255,255,0.05)'
        }}>
          <span style={{ fontSize:'20px' }}>
            {a.action === 'ADD' ? '➕' : a.action === 'EDIT' ? '✏️' : '🗑️'}
          </span>
          <div style={{ flex:1 }}>
            <p style={{ color:'#e2e8f0', fontSize:'14px' }}>{a.details}</p>
            <p style={{ color:'#475569', fontSize:'12px', marginTop:'2px' }}>
              {new Date(a.timestamp).toLocaleString()}
            </p>
          </div>
          <span style={{
            padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'600',
            background: a.action==='ADD' ? 'rgba(16,185,129,0.1)' : a.action==='EDIT' ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.1)',
            color: a.action==='ADD' ? '#10b981' : a.action==='EDIT' ? '#818cf8' : '#fca5a5',
          }}>{a.action}</span>
        </div>
      ))}
    </div>
  </div>
)}

      {/* Modal */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000
        }}>
          <div className="fade-in" style={{
            background:'#1a1a2e', border:'1px solid rgba(99,102,241,0.3)',
            borderRadius:'20px', padding:'32px', width:'100%', maxWidth:'460px',
            maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
              <h3 style={{ color:'white', fontSize:'20px', fontWeight:'700' }}>
                {editContact ? '✏️ Edit Contact' : '➕ New Contact'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditContact(null); }} style={{
                background:'rgba(255,255,255,0.05)', border:'none', color:'#94a3b8',
                width:'32px', height:'32px', borderRadius:'8px', cursor:'pointer', fontSize:'16px'
              }}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              {[
                { key:'name',    type:'text',  placeholder:'Full Name *' },
                { key:'email',   type:'email', placeholder:'Email Address *' },
                { key:'phone',   type:'text',  placeholder:'Phone Number' },
                { key:'company', type:'text',  placeholder:'Company Name' },
              ].map(({ key, type, placeholder }) => (
                <input key={key} type={type} placeholder={placeholder}
                  value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                  required={key==='name'||key==='email'} style={inputStyle}
                  onFocus={e => e.target.style.borderColor='#6366f1'}
                  onBlur={e => e.target.style.borderColor='rgba(99,102,241,0.3)'}
                />
              ))}

              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                style={{...inputStyle, cursor:'pointer'}}>
                <option value="Lead" style={{background:'#1a1a2e'}}>🎯 Lead</option>
                <option value="Prospect" style={{background:'#1a1a2e'}}>👀 Prospect</option>
                <option value="Customer" style={{background:'#1a1a2e'}}>⭐ Customer</option>
              </select>

              <textarea placeholder="Notes (optional)" value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                style={{...inputStyle, height:'80px', resize:'vertical'}} />

              <div style={{ display:'flex', gap:'10px', marginTop:'8px' }}>
                <button type="submit" disabled={loading} style={{
                  flex:1, padding:'13px', borderRadius:'12px', border:'none', cursor:'pointer',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color:'white', fontSize:'15px', fontWeight:'600',
                  boxShadow: loading ? 'none' : '0 8px 32px rgba(99,102,241,0.4)'
                }}>
                  {loading ? '⏳ Saving...' : (editContact ? 'Update ✓' : 'Add Contact +')}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditContact(null); }} style={{
                  flex:1, padding:'13px', borderRadius:'12px', cursor:'pointer',
                  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
                  color:'#94a3b8', fontSize:'15px'
                }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}