import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import LoginPage from "./LoginPage";

const CreateUser = () =>{

    const [user, setUser] = useState({
        last_login:'',
        is_superuser: false,
        username:'',
        first_name:'',
        last_name:'',
        is_staff:false,
        is_active: true,
        date_joined:'',
        id:'',
        email:'',
        password:'',
        address:'',
        phone:'',
        created_at:'',
        updated_at:'',
        specialization:'',
        blood_type:''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [currentPage, setCurrentPage] = useState('patient');

    const navigate = useNavigate();
    const handlechange = (event:any) => {
        const { name, value, type, checked} = event.target;
        setUser((prevData) => {
            if(name === 'date_joined'){
                return {
                    ...prevData,
                    [name]: value,
                    updated_at: value,
                    created_at: value,
                    last_login: value,
                    is_staff: currentPage === 'doctor' ? true : false,
                };
            }
            return {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            };
        });
    };

    const handlePageChange = (event:any) => {
        setCurrentPage(event.target.value);
    };

    const handleSubmit = async (event:any) => {
        event.preventDefault();

        const endpoint = currentPage === 'doctor' 
            ? 'http://127.0.0.1:8000/api/doctor/' 
            : 'http://127.0.0.1:8000/api/patient/';

        try {
            const response = await axios.post(endpoint, JSON.stringify(user),{
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setResponseMessage(`Success: ${response.data.message}`);
            window.alert('User was created successfully! Please log back in.');
            navigate('/');
        }
        catch(error:any){
            if (error.response){
                setResponseMessage(`Error:${error.response.status} - ${JSON.stringify(error.response.data)}`)
            } else if (error.request) {
                // Request was made but no response received
                setResponseMessage('Error: No response from server');
              } else {
                // Something else caused the error
                setResponseMessage(`Error: ${error.message}`);
              }
        }
    }
    
    return(
    <div>
        <div className="text-sucess text-center">
            <div className="page-selector">
                <label className="mx-2">
                    <input
                        type="radio"
                        value="patient"
                        checked={currentPage === 'patient'}
                        onChange={handlePageChange}
                    />
                    <span className="ps-1">Create new user as patient</span>
                </label>
                <label className="mx-2">
                    <input
                        type="radio"
                        value="doctor"
                        checked={currentPage === 'doctor'}
                        onChange={handlePageChange}
                    />
                     <span className="ps-1">Create new user as doctor</span>
                </label>
            </div>
        </div>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <form id="registrationform" action="" onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="email">
                                        Email
                                    </label>
                                    <input type="email" 
                                        className="form-control"
                                        value={user.email}
                                        name="email"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="firstname">
                                        First Name
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={user.first_name}
                                        name="first_name"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="lastname">
                                        Last Name
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={user.last_name}
                                        name="last_name"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">
                                        Username
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={user.username}
                                        name="username"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">
                                        Password
                                    </label>
                                    <input type="password" 
                                        className="form-control"
                                        value={user.password}
                                        name="password"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="address">
                                        Address
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={user.address}
                                        name="address"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="phone">
                                        Phone
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={user.phone}
                                        name="phone"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                {currentPage === 'doctor' && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="specialization">
                                            Specialization
                                        </label>
                                        <input type="text" 
                                            className="form-control"
                                            value={user.specialization}
                                            name="specialization"
                                            onChange={handlechange}
                                            required/>
                                    </div>
                                )}{currentPage === 'patient' && (
                                    <div className="form-group mb-3">
                                        <label htmlFor="blood_type">
                                            Blood Type
                                        </label>
                                        <input type="text" 
                                            className="form-control"
                                            value={user.blood_type}
                                            name="blood_type"
                                            onChange={handlechange}
                                            required/>
                                    </div>
                                )}
                                <div className="form-group mb-3">
                                    <label htmlFor="datetime">
                                        Date
                                    </label>
                                    <input type="datetime-local" 
                                        className="form-control"
                                        value={user.date_joined}
                                        name="date_joined"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                {responseMessage && (
                                <div className={`alert ${responseMessage.startsWith('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {responseMessage}
                                </div>
                            )}
                                <button className="btn btn-outline-secondary btn-small flex-fill mx-1">Create new user</button>
                                <button className="btn btn-outline-secondary btn-small flex-fill mx-1"
                                onClick={() => navigate('/')}>
                                Already have an account?</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default CreateUser
