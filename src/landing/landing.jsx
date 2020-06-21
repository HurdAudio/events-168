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
import './landing.style.jana.css';
import './landing.style.janb.css';
import './landing.style.janc.css';
import './landing.style.feba.css';
import './landing.style.febb.css';
import './landing.style.febc.css';
import Login from '../login/login';
import volcaFm from '../volcaFm/volcaFm';
import volcaNubass from '../volcaNubass/volcaNubass';
import volcaDrum from '../volcaDrum/volcaDrum';
import MidiManager from '../midiManager/midiManager';
import Gr1Editor from '../gr1Editor/gr1Editor';
import SkinsTable from '../skins/skins';


function Landing() {
    
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
    
 
        return(
            <Router>
            <div className={'container' + landingMonth}>
                <div className={'imageDiv' + landingMonth}>
                    <div className={'col1row1' + landingMonth} onMouseOver={() => adjustImage('col1', 'row1')}></div>
                    <div className={'col2row1' + landingMonth} onMouseOver={() => adjustImage('col2', 'row1')}></div>
                    <div className={'col3row1' + landingMonth} onMouseOver={() => adjustImage('col3', 'row1')}></div>
                    <div className={'col4row1' + landingMonth} onMouseOver={() => adjustImage('col4', 'row1')}></div>
                    <div className={'col5row1' + landingMonth} onMouseOver={() => adjustImage('col5', 'row1')}></div>
                    <div className={'col6row1' + landingMonth} onMouseOver={() => adjustImage('col6', 'row1')}></div>
                    <div className={'col7row1' + landingMonth} onMouseOver={() => adjustImage('col7', 'row1')}></div>
                    <div className={'col8row1' + landingMonth} onMouseOver={() => adjustImage('col8', 'row1')}></div>
                    <div className={'col1row2' + landingMonth} onMouseOver={() => adjustImage('col1', 'row2')}></div>
                    <div className={'col2row2' + landingMonth} onMouseOver={() => adjustImage('col2', 'row2')}></div>
                    <div className={'col3row2' + landingMonth} onMouseOver={() => adjustImage('col3', 'row2')}></div>
                    <div className={'col4row2' + landingMonth} onMouseOver={() => adjustImage('col4', 'row2')}></div>
                    <div className={'col5row2' + landingMonth} onMouseOver={() => adjustImage('col5', 'row2')}></div>
                    <div className={'col6row2' + landingMonth} onMouseOver={() => adjustImage('col6', 'row2')}></div>
                    <div className={'col7row2' + landingMonth} onMouseOver={() => adjustImage('col7', 'row2')}></div>
                    <div className={'col8row2' + landingMonth} onMouseOver={() => adjustImage('col8', 'row2')}></div>
                    <div className={'col1row3' + landingMonth} onMouseOver={() => adjustImage('col1', 'row3')}></div>
                    <div className={'col2row3' + landingMonth} onMouseOver={() => adjustImage('col2', 'row3')}></div>
                    <div className={'col3row3' + landingMonth} onMouseOver={() => adjustImage('col3', 'row3')}></div>
                    <div className={'col4row3' + landingMonth} onMouseOver={() => adjustImage('col4', 'row3')}></div>
                    <div className={'col5row3' + landingMonth} onMouseOver={() => adjustImage('col5', 'row3')}></div>
                    <div className={'col6row3' + landingMonth} onMouseOver={() => adjustImage('col6', 'row3')}></div>
                    <div className={'col7row3' + landingMonth} onMouseOver={() => adjustImage('col7', 'row3')}></div>
                    <div className={'col8row3' + landingMonth} onMouseOver={() => adjustImage('col8', 'row3')}></div>
                    <div className={'col1row4' + landingMonth} onMouseOver={() => adjustImage('col1', 'row4')}></div>
                    <div className={'col2row4' + landingMonth} onMouseOver={() => adjustImage('col2', 'row4')}></div>
                    <div className={'col3row4' + landingMonth} onMouseOver={() => adjustImage('col3', 'row4')}></div>
                    <div className={'col4row4' + landingMonth} onMouseOver={() => adjustImage('col4', 'row4')}></div>
                    <div className={'col5row4' + landingMonth} onMouseOver={() => adjustImage('col5', 'row4')}></div>
                    <div className={'col6row4' + landingMonth} onMouseOver={() => adjustImage('col6', 'row4')}></div>
                    <div className={'col7row4' + landingMonth} onMouseOver={() => adjustImage('col7', 'row4')}></div>
                    <div className={'col8row4' + landingMonth} onMouseOver={() => adjustImage('col8', 'row4')}></div>
                    <div className={'col1row5' + landingMonth} onMouseOver={() => adjustImage('col1', 'row5')}></div>
                    <div className={'col2row5' + landingMonth} onMouseOver={() => adjustImage('col2', 'row5')}></div>
                    <div className={'col3row5' + landingMonth} onMouseOver={() => adjustImage('col3', 'row5')}></div>
                    <div className={'col4row5' + landingMonth} onMouseOver={() => adjustImage('col4', 'row5')}></div>
                    <div className={'col5row5' + landingMonth} onMouseOver={() => adjustImage('col5', 'row5')}></div>
                    <div className={'col6row5' + landingMonth} onMouseOver={() => adjustImage('col6', 'row5')}></div>
                    <div className={'col7row5' + landingMonth} onMouseOver={() => adjustImage('col7', 'row5')}></div>
                    <div className={'col8row5' + landingMonth} onMouseOver={() => adjustImage('col8', 'row5')}></div>
                    <div className={'col1row6' + landingMonth} onMouseOver={() => adjustImage('col1', 'row6')}></div>
                    <div className={'col2row6' + landingMonth} onMouseOver={() => adjustImage('col2', 'row6')}></div>
                    <div className={'col3row6' + landingMonth} onMouseOver={() => adjustImage('col3', 'row6')}></div>
                    <div className={'col4row6' + landingMonth} onMouseOver={() => adjustImage('col4', 'row6')}></div>
                    <div className={'col5row6' + landingMonth} onMouseOver={() => adjustImage('col5', 'row6')}></div>
                    <div className={'col6row6' + landingMonth} onMouseOver={() => adjustImage('col6', 'row6')}></div>
                    <div className={'col7row6' + landingMonth} onMouseOver={() => adjustImage('col7', 'row6')}></div>
                    <div className={'col8row6' + landingMonth} onMouseOver={() => adjustImage('col8', 'row6')}></div>
                    <div className={'col1row7' + landingMonth} onMouseOver={() => adjustImage('col1', 'row7')}></div>
                    <div className={'col2row7' + landingMonth} onMouseOver={() => adjustImage('col2', 'row7')}></div>
                    <div className={'col3row7' + landingMonth} onMouseOver={() => adjustImage('col3', 'row7')}></div>
                    <div className={'col4row7' + landingMonth} onMouseOver={() => adjustImage('col4', 'row7')}></div>
                    <div className={'col5row7' + landingMonth} onMouseOver={() => adjustImage('col5', 'row7')}></div>
                    <div className={'col6row7' + landingMonth} onMouseOver={() => adjustImage('col6', 'row7')}></div>
                    <div className={'col7row7' + landingMonth} onMouseOver={() => adjustImage('col7', 'row7')}></div>
                    <div className={'col8row7' + landingMonth} onMouseOver={() => adjustImage('col8', 'row7')}></div>
                    <div className={'col1row8' + landingMonth} onMouseOver={() => adjustImage('col1', 'row8')}></div>
                    <div className={'col2row8' + landingMonth} onMouseOver={() => adjustImage('col2', 'row8')}></div>
                    <div className={'col3row8' + landingMonth} onMouseOver={() => adjustImage('col3', 'row8')}></div>
                    <div className={'col4row8' + landingMonth} onMouseOver={() => adjustImage('col4', 'row8')}></div>
                    <div className={'col5row8' + landingMonth} onMouseOver={() => adjustImage('col5', 'row8')}></div>
                    <div className={'col6row8' + landingMonth} onMouseOver={() => adjustImage('col6', 'row8')}></div>
                    <div className={'col7row8' + landingMonth} onMouseOver={() => adjustImage('col7', 'row8')}></div>
                    <div className={'col8row8' + landingMonth} onMouseOver={() => adjustImage('col8', 'row8')}></div>
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
                <Route path="/">
                    <Home />
                </Route>
                <Route path="/volca-fm-editor">
                    <volcaFm />
                </Route>
                <Route path="/volca-nubass-editor">
                    {volcaNubass(null, null)}
                </Route>
                <Route path="/volca-drum-editor">
                    {volcaDrum()}
                </Route>
                <Route path="/midi-manager">
                    {MidiManager(null, null)}
                </Route>
                <Route path="/gr1-editor">
                    {Gr1Editor(null, null)}
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