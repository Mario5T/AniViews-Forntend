import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../services/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();
  const { show } = useToast();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await auth.register({ username, email, password });
      setAuth(data);
      show('Account created', 'success');
      navigate('/');
    } catch (err) {
      show(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ display: 'grid', gap: 10 }}>
          <input required placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
          <input required type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="button" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
        </div>
      </form>
      <p style={{ marginTop: 10 }}>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}
