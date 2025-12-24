import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../axios';
import './Auth.css';

function Auth({ setUser, user }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      setUser(response.data);
      if (response.data.role === 'ROLE_STUDENT') {
        navigate('/student');
      } else if (response.data.role === 'ROLE_ADMIN') {
        navigate('/admin');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password, fullname, role: 'STUDENT' };
      await api.post('/register', payload);
      setIsRegister(false); // Switch back to login after successful registration
      setError('');
      setFullname(''); // Clear fullname field
    } catch (err) {
      setError('Registration failed—email may already exist');
    }
  };

  if (user) return <Navigate to={user.role === 'ROLE_STUDENT' ? '/student' : '/admin'} />;

  return (
    <>
      <video autoPlay muted loop id="background-video">
        <source src="/Assests/white.mp4" type="video/mp4" />
        <img src="/Assests/background-fallback.jpg" alt="Fallback Background" />
        Your browser does not support the video tag.
      </video>
    
      <div className={`container ${isRegister ? 'active' : ''}`}>
        {/* Toggle Box */}
        <div className="toggle-box">
          <div className="toggle-panel">
            <h1>{isRegister ? 'Welcome back!' : 'Hello Welcome!'}</h1>
            <p>{isRegister ? 'Already have an account' : "Don't have an account"}</p>
            <button
              className="btn"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </div>
        </div>

        {/* Form Box - Login */}
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>

        {/* Form Box - Register */}
        <div className="form-box register">
          <form onSubmit={handleRegister}>
            <h1>Register</h1>
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <i className="bx bxs-envelope"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className="bx bxs-lock-alt"></i>
            </div>
            <div className="input-box">
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
              <i className="bx bxs-user"></i>
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Auth;