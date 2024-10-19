import axios from "axios";
import React, { useState } from "react"

const CreateUser = () =>{

    const [user, setUser] = useState({
        last_login:'',
        is_superuser: false,
        username:'',
        first_name:'',
        last_name:'',
        is_staff: false,
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

    const handlechange = (event:any) => {
        const { name, value, type, checked} = event.target;
        setUser((prevData) => {
            if(name === 'date_joined'){
                return {
                    ...prevData,
                    [name]: value,
                    updated_at: value,
                    created_at: value,
                    last_login: value
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

        console.log(JSON.stringify(user));

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/patient/`, JSON.stringify(user),{
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setResponseMessage(`Success: ${response.data.message}`);
        }
        catch(error:any){
            if (error.response){
                console.log(`Error:${error.response.status} - ${JSON.stringify(error.response.data)}`)
            } else if (error.request) {
                // Request was made but no response received
                console.log('Error: No response from server');
              } else {
                // Something else caused the error
                console.log(`Error: ${error.message}`);
              }
        }
    }
    
    return(
    <div>
        <div className="text-sucess text-center">
            {/* Radio buttons for page selection */}
            <div className="page-selector">
                <label className="mx-2">
                    <input
                        type="radio"
                        value="patient"
                        checked={currentPage === 'patient'}
                        onChange={handlePageChange}
                    />
                    Create Patient
                </label>
                <label className="mx-2">
                    <input
                        type="radio"
                        value="doctor"
                        checked={currentPage === 'doctor'}
                        onChange={handlePageChange}
                    />
                    Create Doctor
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
                                <button className="btn btn-outline-secondary btn-small flex-fill mx-1">Create new user</button>
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
