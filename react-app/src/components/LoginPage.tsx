import React, { useEffect, useState } from 'react';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent, role: string) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
      const { access, refresh } = response.data;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      const decodedToken: any = jwtDecode(access);
      const userId = decodedToken.user_id;

      // Store userId in local storage and cookie
      localStorage.setItem('userId', userId);
      document.cookie = `userId=${userId}; path=/; SameSite=None; Secure`;
      document.cookie = `userRole=${role}; path=/; SameSite=None; Secure`;
    

      setSuccess(true);
      setError('');

      // Redirect to AppB after setting the cookie
      window.location.href = 'http://localhost:3000';
    } catch (error) {
      setSuccess(false);
      setError('Invalid user. Please create an account.');
    }
  };

  return (
    <div>
    <h1 className="text-success text-center">Login</h1>
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <form id="registrationForm" onSubmit={e => handleSubmit(e,'patient')}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    id="username"
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    id="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="btn-group" role="group" aria-label="Login options">
                  <button type="button" className="btn btn-outline-secondary" onClick={e => handleSubmit(e,'doctor')}>
                    Log in as doctor
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={e => handleSubmit(e,'patient')}>
                    Log in as patient
                  </button>
                  <button type="button" className="btn btn-outline-warning" onClick={() => navigate('/createuser')}>
                    Create new user
                  </button>
                </div>
              </form>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {success && <p style={{ color: 'green' }}>Login successful!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  );
};

export default LoginPage;
