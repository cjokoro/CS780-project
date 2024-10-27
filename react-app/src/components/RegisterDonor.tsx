import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterDonor = () =>{
    const [donor, setDonor] = useState({
        organ:'',
        availability_status:'',
        donor: localStorage.getItem('userId'),

      
    })
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState('');

    const handlechange = (event:any) => {

        const { name, value, type, checked} = event.target;
        setDonor((prevData) => {
            if(name === 'date_joined'){
                return {
                    ...prevData,
                    [name]: value,
                    updated_at: value,
                    created_at: value,
                };
            }
          
            return {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value,
            };
        });
    };

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target;
        setSelectedOption(value);
        setDonor((prevData) => ({
            ...prevData,
            availability_status: value,
        }));
    };

    const handleSubmit = async (event:any) => {
        event.preventDefault();

        try { 
            const response = await axios.post('http://127.0.0.1:8000/api/organ-donor/', JSON.stringify(donor),{
                headers:{
                    "Content-Type": "application/json"
                }
            });
            setResponseMessage(`Success: ${response.data.message}`);
            window.alert('You have successfully registered as an organ donor.');
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <form id="registrationform" action="" onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="organ">
                                        Organ
                                    </label>
                                    <input type="text" 
                                        className="form-control"
                                        value={donor.organ}
                                        name="organ"
                                        onChange={handlechange}
                                        required/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="availability_status">
                                        Availability Status
                                    </label>
                                    <select id="options" value={selectedOption} onChange={handleChange} 
                                    name="availability_status"
                                    className="form-control">
                                        <option value="">--Select time for availability--</option>
                                        <option value="Today">Today</option>
                                        <option value="6-12 Months">6-12 Months</option>
                                        <option value="12+ Months">12+ Months</option>
                                    </select>
                                    {/* <input type="text" 
                                        className="form-control"
                                        value={donor.availability_status}
                                        name="availability_status"
                                        onChange={handlechange}
                                        required/> */}
                                </div>
                                {responseMessage && (
                                <div className={`alert ${responseMessage.startsWith('Error') ? 'alert-danger' : 'alert-success'}`}>
                                    {responseMessage}
                                </div>
                            )}
                                <button className="btn btn-outline-secondary btn-small flex-fill mx-1">Finish registration</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

}
  
export default RegisterDonor

