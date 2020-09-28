import React, { useState } from 'react';

import { NavLink } from 'react-router-dom'
import './login.style.jana.css';
import './login.style.janb.css';
import './login.style.janc.css';
import './login.style.feba.css';
import './login.style.febb.css';
import './login.style.febc.css';
import './login.style.mara.css';
import './login.style.marb.css';
import CheckStatus from './checkLoginStatus';
import EncryptPassword from './encryptPassword';
import SetStatus from './setLoginStatus';
import SkinsTable from '../skins/skins';
import axios from 'axios';


function Login() {
    
    const skins = SkinsTable('login');
    
    const [loginMonth, setLoginMonth] = useState(skins.login.skin);
    const [errorMessage, setErrorMessage] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [submitButtonClass, setSubmitButtonClass] = useState('loginSubmitHide');
    
    let localStorage = window.localStorage;
    
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
    
    const executeLogin = () => {
        axios(`/users/prelogin/${emailValue}`)
        .then(securirtyInfoData => {
            const security = securirtyInfoData.data;
            if (security.key === null) {
                errorMessaging('error: login fail');
                localStorage.setItem('userLoggedIn', false);
            } else {
                const submitPasswordArray = EncryptPassword(passwordValue, security);
                axios.post('/users/login', { email: emailValue, password: submitPasswordArray })
                .then(userResponseData => {
                    const response = userResponseData.data;
                    SetStatus(response);
                    if (response.login === 'forbidden') {
                        errorMessaging('error: login fail');
                    } else {
                        errorMessaging('login success');
                    }
                });
            }
        });
    }
    
    return(
        <div className={'loginContainer' + loginMonth}>
            <div className={'loginImageDiv' + loginMonth}></div>
            <div className={'loginOuterBox' + loginMonth}></div>
            <div className={'loginBoxContainer' + loginMonth}>
                <p className={'loginTitle' + loginMonth}>login</p>
                <p className={'loginErrorMessaging' + loginMonth}>{errorMessage}</p>
                <form>
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
                    <NavLink to="/"><button className={submitButtonClass + loginMonth}
                        onClick={() => executeLogin()}>submit</button>
                        </NavLink>
                </form>
            </div>
        </div>
        );
}

export default Login;