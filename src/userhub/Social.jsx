import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './userhub.style.jana.css';
import './userhub.style.janb.css';
import './userhub.style.janc.css';
import midi5pin from '../img/midi5pin.svg';
import usersgroup from '../img/usersgroup.svg';
import gitHub from '../img/gitHub.svg';
import facebook from '../img/facebook.svg';
import instagram from '../img/instagram.svg';
import reddit from '../img/reddit.svg';
import soundcloud from '../img/soundcloud.svg';
import bandcamp from '../img/bandcamp.svg';

function Social() {
    
    const [socialMonth, setSocialMonth] = useState('_JanuaryC');
    const [socialIcons, setSocialIcons] = useState({
        gitHub: 'socialGitHub',
        facebook: 'socialFacebook',
        instagram: 'socialInstagram'
    })
    
        return(
            <div className={'homeContainer' + socialMonth}>
                <img className={'socialIcon' + socialMonth}
                    src={usersgroup}></img>
                <div className={'homeBulletList' + socialMonth}>
                    <img className={'homeMidiBullet' + socialMonth} 
                        src={midi5pin}></img>                    
                    <button className={'homeButtons' + socialMonth}>messages</button>
                </div>
                <div className={'homeBulletList' + socialMonth}>
                    <img className={'homeMidiBullet' + socialMonth} 
                        src={midi5pin}></img>                    
                    <button className={'homeButtons' + socialMonth}>user forums</button>
                </div>
                <div className={'homeBulletList' + socialMonth}>
                    <img className={'homeMidiBullet' + socialMonth} 
                        src={midi5pin}></img>                    
                    <button className={'homeButtons' + socialMonth}>friends</button>
                </div>
                <div className={'homeBulletList' + socialMonth}>
                    <img className={'homeMidiBullet' + socialMonth} 
                        src={midi5pin}></img>                    
                    <button className={'homeButtons' + socialMonth}>blog</button>
                </div>
                <div className={'homeBulletList' + socialMonth}>
                    <img className={'homeMidiBullet' + socialMonth} 
                        src={midi5pin} />                    
                    <img className={socialIcons.gitHub + socialMonth} src={gitHub} />
                    <img className={socialIcons.facebook + socialMonth} src={facebook} />
                    <img className={socialIcons.instagram + socialMonth} src={instagram} />
                    <img className={socialIcons.gitHub + socialMonth} src={reddit} />
                    <img className={socialIcons.facebook + socialMonth} src={soundcloud} />
                    <img className={socialIcons.instagram + socialMonth} src={bandcamp} />
                    
                    
                    
                </div>
                
                
            </div>
        );
    
}

export default Social;