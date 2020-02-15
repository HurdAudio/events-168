import React, { useState } from 'react';

import './login.style.jana.css';

function Login() {
    
//    const [loginMonth, setLoginMonth] = useState('_JanuaryA');
    const loginMonth = '_JanuaryA';
    const [errorMessage, setErrorMessage] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [submitButtonClass, setSubmitButtonClass] = useState('loginSubmitHide');
    
    function showSubmit() {
        setSubmitButtonClass('loginSubmitShow');
    }
    
    function hideSubmit() {
        setSubmitButtonClass('loginSubmitHide');
    }
    
    function errorMessaging(err) {
        setErrorMessage(err);
    }
    
    const updateEmailValue = (email) => {
        setEmailValue(email);
        if ((emailValue.length > 0) && (passwordValue.length > 0)) {
            showSubmit();
        } else {
            hideSubmit();
        }
    }
    
    const updatePasswordValue = (password) => {
        setPasswordValue(password);
        if ((emailValue.length > 0) && (passwordValue.length > 0)) {
            showSubmit();
        } else {
            hideSubmit();
        }
    }
    
    return(
        <div className={'loginContainer' + loginMonth}>
            <div className={'loginImageDiv' + loginMonth}></div>
            <div className={'loginOuterBox' + loginMonth}></div>
            <div className={'loginBoxContainer' + loginMonth}>
                <p className={'loginTitle' + loginMonth}>login</p>
                <p className={'loginErrorMessaging' + loginMonth}>{errorMessage}</p>
                <input
                    autoFocus
                    onKeyUp={(e) => updateEmailValue(e.target.value)}
                    placeholder="email"
                    type="email"
                    >
                </input>
                <input 
                    onKeyUp={(e) => updatePasswordValue(e.target.value)}
                    placeholder="password"
                    type="password"></input>
                <button className={submitButtonClass + loginMonth}
                    onClick={() => {
                        if ((emailValue.trim().toLowerCase() === 'devin@devinhurd.com') && (passwordValue === 'password')) {
                            errorMessaging('login success')
                        } else {
                            errorMessaging('error: login fail')
                        }}}>submit</button>
            </div>
        </div>
        );
}

export default Login;