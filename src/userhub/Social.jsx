import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './userhub.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import usersgroup from '../img/usersgroup.svg';

function Social() {
    
    const [socialMonth, setSocialMonth] = useState('_JanuaryA');
    
        return(
            <div className={'homeContainer' + socialMonth}>
                <img className={'socialIcon' + socialMonth}
                    src={usersgroup}></img>
                
                
            </div>
        );
    
}

export default Social;