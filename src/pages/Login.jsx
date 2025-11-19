import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const { show } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await auth.login({ email, password });
      setAuth(data);
      show('Logged in', 'success');
      navigate('/');
    } catch (err) {
      show(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 10 }}>
          <input required type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="button" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </div>
      </form>
      <p style={{ marginTop: 10 }}>No account? <Link to="/register">Register</Link></p>
    </div>
  );
}
