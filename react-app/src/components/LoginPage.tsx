import React, { useState } from 'react';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';

//'http://localhost:8000/api/schema/swagger-ui/#/token/token_refresh_create'

const LoginPage = () =>{
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();
    const handleSubmit = async (event:any) => {
        event.preventDefault('');
        try{
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });

        }
        catch(error){
            setSuccess(false);
            setError('Invalid user. Please create an account.');
        }
    };

    const createUser = (event:any) => {
        navigate('/createuser');
    }

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
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1">
                                        Log in as doctor
                                    </button>
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1">
                                        Log in as patient
                                    </button>
                                    <button className='btn btn-outline-warning btn-small flex-fill mx-1'
                                            onClick={() => navigate('/createuser')}>
                                        Create new user
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