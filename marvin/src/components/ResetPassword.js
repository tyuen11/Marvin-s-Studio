import React, { Component } from 'react';
import Logo from '../icons/marvins.png';
import { Link } from 'react-router-dom';




class ResetPassword extends Component {
    render() {
        return (
            <div id="resetPassword" className="container">
               <div className="row justify-content-center mt-5">
                    <div className="col-6 text-center">
                        <div style={{margin: "0.25rem", paddingTop: "2.75rem", paddingBottom: "1.55rem"}}>
                            <Link to='/login'>
                                <img src={Logo} width="100" height="100"/>
                            </Link>
                        </div>
                        <div className="border border-white" style={{borderRadius:"29px"}}>
                            <h2 className="text-light " style={{margin: "0.25rem", paddingTop: "2.75rem", paddingBottom: "1.55rem"}}>Change password</h2>
                            <form className="" style={{margin: "0.25rem", paddingTop: "1.5rem"}}>
                                <div className="form-group col-8 mx-auto text-left">
                                    <label className="text-light mt-2 mb-3">Enter your new password</label>
                                    <input type="password" className="form-control mb-4"  placeholder="Email"/>
                                </div>
                                <div className="form-group col-8 mx-auto text-left">
                                    <label className="text-light mt-2 mb-3">Confirm new password</label>
                                    <input type="password" className="form-control mb-4"  placeholder="Email"/>
                                </div>
                                <button type="button" className="btn btn-primary my-4">Submit</button>
                            </form>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }
}

export default ResetPassword;
