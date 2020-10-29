import React, { Component } from 'react';
import Logo from '../icons/marvins.png';
import { Link } from 'react-router-dom';



class RequestReset extends Component {
    render() {
        return (
            <div id="requestReset"  className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-6 text-center">
                        <div style={{margin: "0.25rem", paddingTop: "2.75rem", paddingBottom: "1.55rem"}}>
                        <Link to='/login'>
                                <img src={Logo} width="100" height="100"/>
                            </Link>
                        </div>
                    
                        <h2 className="text-light mb-3">Reset your password</h2>
                        <span className="text-light">Enter your email address that you used to register. We'll send you an email with a link to reset your password!</span>

                        <form className="" style={{margin: "0.25rem", paddingTop: "1.5rem"}}>
                            <div className="form-group col-8 mx-auto text-left">
                                <label className="text-light mt-2 mb-3">What's your email address?</label>
                                <input className="form-control mb-4"  placeholder="Email"/>
                            </div>
                            <Link to='/login'>
                                <button type="button" className="btn btn-light mr-2" click="location.href='/login">Cancel</button>
                            </Link>
                            <button type="button" className="btn btn-primary ml-2">Send</button>
                        </form>
                        <span id="successFailure" className="invisible text-light">Placeholder text</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default RequestReset;