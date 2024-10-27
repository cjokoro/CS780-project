import React, { useState } from 'react';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

//'http://localhost:8000/api/schema/swagger-ui/#/token/token_refresh_create'

const LoginPage = () =>{
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState<'doctor' | 'patient' | null>(null);

    const navigate = useNavigate();
    const handleSubmit = async (event:any) => {
        event.preventDefault('');
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });

            const { access, refresh } = response.data;
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            const decodedToken: any = jwtDecode(access);
            console.log("Decoded Token:", decodedToken);  // Log the token payload

            // Extract user_id from the token
            const userId = decodedToken.user_id;
            localStorage.setItem('userId', userId)
            console.log("User ID:", userId);

            setSuccess(true);
            setError('');

            if (currentPage === 'doctor') {
                navigate('/registerdonor'); // Change to your desired doctor route
            } else if (currentPage === 'patient') {
                navigate('/registerdonor'); // Change to your desired patient route
            }
        }
        catch(error){
            setSuccess(false);
            setError('Invalid user. Please create an account.');
        }

        const refreshAccessToken = async () => {
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available');
    
                const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
                    refresh: refreshToken,
                });
                localStorage.setItem('accessToken', response.data.access);
            } catch (error) {
                console.error('Failed to refresh access token:', error);
                navigate('/');
            }
        };
    };
    return(
        <div>
            <h1 className="text-sucess text-center">Login</h1>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="regristrationForm" action="" onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="username">
                                            Username

                                        </label>
                                        <input type="text" 
                                            className="form-control"
                                            value={username}
                                            id="username"
                                            onChange={(e)=>setUsername(e.target.value)}
                                            placeholder="Username" required/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input type="password"
                                        className="form-control"
                                        value={password}
                                        id="password"
                                        placeholder="Password"
                                        onChange={(e)=>setPassword(e.target.value)}
                                        required />
                                        
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Testing">
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1"
                                    onClick={() => setCurrentPage('doctor')}>
                                        Log in as doctor
                                    </button>
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1"
                                    onClick={() => setCurrentPage('patient')}>
                                        Log in as patient
                                    </button>
                                    <button className='btn btn-outline-warning btn-small flex-fill mx-1'
                                            onClick={() => navigate('/createuser')}>
                                        Create new user
                                    </button>
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1"
                                     onClick={() => navigate('/searchdonor')}>
                                        Search Donor
                                    </button>
                                    </div>
                                    
                                </form>
                                {error && <p style={{color: 'red'}}>{error}</p>}
                                {success && <p style={{color: 'green'}}>Login successful!</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    )

}

export default LoginPage