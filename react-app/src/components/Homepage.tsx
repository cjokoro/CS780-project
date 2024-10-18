
function Homepage(){
    return(
        <div>
            <h1 className="text-sucess text-center">Login</h1>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <form id="regristrationForm" action="">
                                    <div className="form-group mb-3">
                                        <label htmlFor="email">
                                            Email

                                        </label>
                                        <input type="email" 
                                            className="form-control"
                                            id="email"
                                            placeholder="Email" required/>
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password">
                                            Password
                                        </label>
                                        <input type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Password"
                                        required />
                                        
                                    </div>
                                    <div className="btn-group" role="group" aria-label="Testing">
                                    <button className="btn btn-outline-secondary btn-small flex-fill mx-1">
                                        Log in as doctor
                                    </button>
                                    <button className="btn btn-outline-warning btn-small flex-fill mx-1">
                                        Log in as patient
                                    </button>
                                    </div>
                                    
                                </form>
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    )

}

export default Homepage