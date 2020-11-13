import React, { Component } from 'react';
import Logo from '../icons/marvins.png';
import { Link } from 'react-router-dom';


export default class RegisterScreen extends Component {
    render() {
        return (
            <div id="register"  className="container">
                <div className="row justify-content-center mt-5">
                    <div className="col-4 text-center">
                        <div style={{margin: "0.25rem", padding: "2.75rem"}}>
                            <Link to='/login'>
                                <img src={Logo} width="100" height="100"  />
                            </Link>
                        </div>

                        <a href="/auth/google">
                            <input type="image"  style={{margin: "0.25rem", paddingBottom: ".75rem"}}
                            src="https://developers.google.com/identity/images/btn_google_signin_dark_normal_web.png">
                            </input>
                        </a>  

                        <div className="divider mb-4">
                            <strong className="divider-title text-light">or</strong>
                        </div>

                        <span className="text-light">Sign up with your email address</span>

                        <form action="/register" method="post" style={{margin: "0.25rem", paddingTop: "1.5rem"}}>
                            <div className="form-group text-left">
                                <label className="text-light mt-2 mb-3">What's your email address?</label>
                                <input name="email" type="email" className="form-control"  placeholder="Email"/>
                            </div>
                            <div className="form-group text-left" >
                                <label className="text-light my-3">Create a password</label>
                                <input name="password" type="password" className="form-control" placeholder="Password"/>
                            </div>
                            <div className="form-group text-left">
                                <label className="text-light my-3">What's your name?</label>
                                <input name="uname" type="text" className="form-control"  placeholder="Enter a name"/>
                            </div>
                            <button type="submit" className="btn btn-primary btn-sm rounded-pill mt-4 mb-2">Sign Up</button>
                        </form>
                        <div style={{margin: "0.25rem", padding: "1rem"}}>
                            <p className="text-light">Have an account? <a href="/login" className="mt-2" >Log in.</a></p> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
