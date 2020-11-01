import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midi5pin from '../img/midi5pin.svg';
import redMIDI from '../img/redMIDI.png';
import vectorMidiPng from '../img/vectorMidiPng.png';
import febaMidi_0 from '../img/febaMidi_0.png';
import midiKeys from '../img/midiKeys.png';
import bleu_midi_icon from '../img/bleu_midi_icon.png';
import midiPortCropped1 from '../img/midiPortCropped1.jpg';
import keyboard2779734960720 from '../img/keyboard2779734960720.png';
import akaiProIcon from '../img/akaiProIcon.png';
import './landing.style.jana.css';
import './landing.style.janb.css';
import './landing.style.janc.css';
import './landing.style.feba.css';
import './landing.style.febb.css';
import './landing.style.febc.css';
import './landing.style.mara.css';
import './landing.style.marb.css';
import './landing.style.marc.css';
import Login from '../login/login';
import SkinsTable from '../skins/skins';
import LandingCols from './landingCols';


function Landing() {
    console.log('landing is lit');
    
    const landingCols = LandingCols();
    console.log(landingCols);
    
    const skins = SkinsTable('landing');
    
    const [landingMonth, setLandingMonth] = useState(skins.landing.skin);
    const [midiImageClass, setMidiImageClass] = useState('midiImage');
    const [midiImage, setMidiImage] = useState(skins.landing.logo);
    
    const now = new Date();
    
    let footerText = '';
    
    if (now.getFullYear() > 2020) {
        footerText = '2020-' + now.getFullYear() + ' HurdAudio';
    } else {
        footerText = now.getFullYear() + ' HurdAudio';
    }
    
    
    
    const adjustImage = (colString, rowString) => {
        setMidiImageClass('midiImage' + colString + rowString);
    }
    
    const checkLogin = () => {
        if (window.localStorage.getItem('userLoggedIn') === 'true') {
            location.reload();
        }
    }
    
    checkLogin();
    
 
        return (
            <Router>
            <div className={'container' + landingMonth}>
                <div className={'imageDiv' + landingMonth}>
                    {landingCols.map(pos => (
                        <div className={'col' + pos.col.toString() + 'row' + pos.row.toString() + landingMonth}
                            key={pos.col.toString() + pos.row.toString()}
                            onMouseOver={() => adjustImage('col' + pos.col.toString(), 'row' + pos.row.toString())}>
                        </div>
                    ))}
                    <div className={'landingTitleDiv' + landingMonth}>
                        <Link to="/"><h1 className={'landingTitle' + landingMonth}>168 Events</h1></Link>
                        <p className={'landingByline' + landingMonth}>MIDI Librarian &amp; Sequencing Tool</p>
                    </div>
                    <Link to="/login">
                        <button className={'userLogin' + landingMonth}>login</button>
                    </Link>
                    <Link to="/about">
                        <button className={'aboutButton' + landingMonth}>about</button>
                    </Link>
                </div>
                <img className={midiImageClass + landingMonth} src={midiImage}></img>
                <div className={'landingFooterDiv' + landingMonth}>
                    <p className={'landingFooter' + landingMonth}>&copy;{footerText}</p>
                </div>
            </div>
            <Switch>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/about">
                    <About />
                </Route>
            </Switch>
        </Router>
    );
                
        
    
}

function About() {
    return(
        <h2>About</h2>
    );
}

function Home() {
    return(
        <div></div>
    );
}

export default Landing;