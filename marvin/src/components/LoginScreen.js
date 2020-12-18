import React, { Component } from 'react';
import Logo from '../icons/marvins.png';
import { Link } from 'react-router-dom';


class LoginScreen extends Component {
    render() {
        // validateUser = () => {
        //     var email = document.getElementById("userEmail").value;
        //     var password = document.getElementById("userPass").value;
        // }
        return (
            <div id="login"  className="container">
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

                        <div className="divider">
                            <strong className="divider-title text-light">or</strong>
                        </div>

                        <form action="/login" method="post">
                            <input name="email" type="text" placeholder="Email" className="my-4 w-100"></input>
                            <input name="password" type="password" placeholder="Password" className="mt-1 mb-4 w-100"></input>
                            <button type="submit" className="btn btn-primary btn-sm col-sm-3 mb-2">Log In</button>
                        </form>
                        <div className="divider"/>

                        <div style={{margin: "0.25rem", padding: "2rem"}}>
                            <span className="text-light">Dont have a Marvin's Studio account?</span>
                            <Link to='/register'>
                                <button type="button" className="btn btn-primary btn-sm rounded-pill mt-3">Sign Up</button>
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default LoginScreen;