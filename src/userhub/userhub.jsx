import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from './Home';
import Library from './Library';
import Sequencer from './Sequencer';
import MidiFX from './MidiFX';
import Social from './Social';
import panic from '../img/panic.svg';
import './userhub.style.jana.css';
import './userhub.style.janb.css';
import './userhub.style.janc.css';
import midi5pin from '../img/midi5pin.svg';
import redMIDI from '../img/redMIDI.png';
import vectorMidiPng from '../img/vectorMidiPng.png';
import VolcaFm from '../volcaFm/volcaFm';
import VolcaNubass from '../volcaNubass/volcaNubass';
import VolcaDrum from '../volcaDrum/volcaDrum';
import MidiManager from '../midiManager/midiManager';
import CheckStatus from '../login/checkLoginStatus';
import SetStatus from '../login/setLoginStatus';
import axios from 'axios';
import midiConnection from '../midiManager/midiConnection';

let localStorage = window.localStorage;

const now = new Date();

let footerText = '';
    
if (now.getFullYear() > 2020) {
    footerText = '2020-' + now.getFullYear() + ' HurdAudio';
} else {
    footerText = now.getFullYear() + ' HurdAudio';
}

let userPop = null;
let switcher = false;
let connections = undefined;

function UserHub() {
    
    const [midiConnections, setMidiConnections] = useState(connections);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [user, setUser] = useState({});
    const [userhubMonth, setUserhubMonth] = useState('_JanuaryC');
    const [userhubState, setUserhubState] = useState({
        home: 'homeContentActive',
        homeDiv: 'homeContentOn',
        librarian: 'librarianContentInactive',
        libraryDiv: 'libraryContentOff',
        midiFX: 'midiFXContentInactive',
        midiFXDiv: 'midiFXOff',
        panic: 'panicContentInactive',
        panicDiv: 'panicOff',
        sequencer: 'sequencerContentInactive',
        sequencerDiv: 'sequencerContentOff',
        social: 'socialContentInactive',
        socialDiv: 'soccialOff',
        tab: 'sliderTabHome'
    });
    const [panicMonth, setPanicMonth] = useState('_JanuaryC');
    const [panicOn, setPanicOn] = useState(false);
    
    const hubStateHome = () => {
        if (userhubState.tab === 'sliderTabHome') {
            return;
        }
        setUserhubState({
            home: 'homeContentActive',
            homeDiv: 'homeContentOn',
            librarian: 'librarianContentInactive',
            libraryDiv: 'libraryContentOff',
            midiFX: 'midiFXContentInactive',
            midiFXDiv: 'midiFXOff',
            panic: 'panicContentInactive',
            panicDiv: 'panicOff',
            sequencer: 'sequencerContentInactive',
            sequencerDiv: 'sequencerContentOff',
            social: 'socialContentInactive',
            socialDiv: 'soccialOff',
            tab: 'sliderTabHome'
        });
    }
    
    const hubStateLibrarian = () => {
        securityClearance();
        if (midiConnections === undefined) {
            navigator.requestMIDIAccess({ sysex: true })
            .then((midiAccess) => {               
                connections = midiConnection(midiAccess);
                setMidiConnections(connections);
            }, () => {
                alert('No MIDI ports accessible');
            });
        }
        
        console.log(midiConnections);
        setUserhubState({
            home: 'homeContentInactive',
            homeDiv: 'homeContentOff',
            librarian: 'librarianContentActive',
            libraryDiv: 'libraryContentOn',
            midiFX: 'midiFXContentInactive',
            midiFXDiv: 'midiFXOff',
            panic: 'panicContentInactive',
            panicDiv: 'panicOff',
            sequencer: 'sequencerContentInactive',
            sequencerDiv: 'sequencerContentOff',
            social: 'socialContentInactive',
            socialDiv: 'soccialOff',
            tab: 'sliderTabLibrarian'
        });

    }
    
    const hubStateSequencer = () => {
        if (userhubState.tab === 'sliderTabSequencer') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            homeDiv: 'homeContentOff',
            librarian: 'librarianContentInactive',
            libraryDiv: 'libraryContentOff',
            midiFX: 'midiFXContentInactive',
            midiFXDiv: 'midiFXOff',
            panic: 'panicContentInactive',
            panicDiv: 'panicOff',
            sequencer: 'sequencerContentActive',
            sequencerDiv: 'sequencerContentOn',
            social: 'socialContentInactive',
            socialDiv: 'soccialOff',
            tab: 'sliderTabSequencer'
        });
    }
    
    const hubStateMidiFX = () => {
        if (userhubState.tab === 'sliderTabMidiFX') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            homeDiv: 'homeContentOff',
            librarian: 'librarianContentInactive',
            libraryDiv: 'libraryContentOff',
            midiFX: 'midiFXContentActive',
            midiFXDiv: 'midiFXOn',
            panic: 'panicContentInactive',
            panicDiv: 'panicOff',
            sequencer: 'sequencerContentInactive',
            sequencerDiv: 'sequencerContentOff',
            social: 'socialContentInactive',
            socialDiv: 'soccialOff',
            tab: 'sliderTabMidiFX'
        });
    }
    
    const hubStateSocial = () => {
        if (userhubState.tab === 'sliderTabSocial') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            homeDiv: 'homeContentOff',
            librarian: 'librarianContentInactive',
            libraryDiv: 'libraryContentOff',
            midiFX: 'midiFXContentInactive',
            midiFXDiv: 'midiFXOff',
            panic: 'panicContentInactive',
            panicDiv: 'panicOff',
            sequencer: 'sequencerContentInactive',
            sequencerDiv: 'sequencerContentOff',
            social: 'socialContentActive',
            socialDiv: 'soccialOn',
            tab: 'sliderTabSocial'
        });
    }
    
    const hubStatePanic = () => {
        if (userhubState.tab === 'sliderTabPanic') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            homeDiv: 'homeContentOff',
            librarian: 'librarianContentInactive',
            libraryDiv: 'libraryContentOff',
            midiFX: 'midiFXContentInactive',
            midiFXDiv: 'midiFXOff',
            panic: 'panicContentActive',
            panicDiv: 'panicOn',
            sequencer: 'sequencerContentInactive',
            sequencerDiv: 'sequencerContentOff',
            social: 'socialContentInactive',
            socialDiv: 'soccialOff',
            tab: 'sliderTabPanic'
        });
        setPanicOn(true);
        setTimeout(() => {
           setPanicOn(false); 
        }, 7000);
    }
    
    const securityClearance = () => {
        if (!CheckStatus(user.security)) {
            SetStatus({ login: 'forbidden' });
        }
    }
    
    if (localStorage.getItem('eventualUser')) {
        if (user.uuid !== localStorage.getItem('eventualUser')) {
            axios.get(`/users/${localStorage.getItem('eventualUser')}`)
            .then(userData => {
                console.log(userData.data);
                setUser(userData.data);
                if (!CheckStatus(user.security)) {
                    SetStatus({ login: 'forbidden' });
                } else {
                    SetStatus(userData.data);
                }
            });
        }
    }

    
        return(
            <Router>
                <Switch>
                    <Route path="/volca-fm-editor">
                        <VolcaFm />
                    </Route>
                    <Route path="/volca-nubass-editor">
                        <VolcaNubass />
                    </Route>
                    <Route path="/volca-drum-editor">
                        <VolcaDrum />
                    </Route>
                    <Route path="/midi-manager">
                        {MidiManager(user, null)}
                    </Route>
                </Switch>
                <div className={'userHubContainer' + userhubMonth}>
                    <div className={'userHubImageDiv' + userhubMonth}>
                        <img className={'userHubLogoImg' + userhubMonth}
                            src={vectorMidiPng}></img>
                        <div className={'userHubTitleBar' + userhubMonth}>
                            <h2 className={'userHubTitle' + userhubMonth}>168 Events</h2>
                            <div className={'userHubLoggedInAsDiv' + userhubMonth}>
                                <p className={'userHubLoggedInLabel' + userhubMonth}>logged in user: </p>
                                <img className={'userHubLoggedInAvatar' + userhubMonth}
                                    src={user.avatar_path}></img>
                                <p className={'userHubLoggedInName' + userhubMonth}>{user.first_name} {user.last_name}</p>
                            </div>
                            <NavLink to="/"><button className={'userHubLogoutButton' + userhubMonth}
                                onClick={() => {
                                    SetStatus({ login: 'forbidden' });
                                    localStorage.setItem('userLoggedIn', 'false');
                                    location.reload();
                                    }}>log out</button></NavLink>

                        </div>
                        <div className={'userHubTabsBar' + userhubMonth}>

                        </div>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubHomeTag' + userhubMonth}
                            onClick={() => hubStateHome()}>home</p>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubLibrarianTag' + userhubMonth}
                            onClick={() => hubStateLibrarian()}>librarian</p>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubSequencerTag' + userhubMonth}
                            onClick={() => hubStateSequencer()}>sequencer</p>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubMidiFXTag' + userhubMonth}
                            onClick={() => hubStateMidiFX()}>midi fx</p>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubSocialTag' + userhubMonth}
                            onClick={() => hubStateSocial()}>social</p>
                        <p className={'userHubTab' + userhubMonth}
                            id={'userhubPanicTag' + userhubMonth}
                            onClick={() => hubStatePanic()}>panic!</p>
                        <span className={userhubState.tab + userhubMonth}></span>
                        <div className={userhubState.home + userhubMonth}>
                            <div className={userhubState.homeDiv + userhubMonth}>
                                {Home(user)}
                            </div>
                        </div>
                        <div className={userhubState.librarian + userhubMonth}>
                            <div className={userhubState.libraryDiv + userhubMonth}>
                                <Library />
                            </div>
                        </div>
                        <div className={userhubState.sequencer + userhubMonth}>
                            <div className={userhubState.sequencerDiv + userhubMonth}>
                                <Sequencer />
                            </div>
                        </div>
                        <div className={userhubState.midiFX + userhubMonth}>
                            <div className={userhubState.midiFXDiv + userhubMonth}>
                                <MidiFX />
                            </div>
                        </div>
                        <div className={userhubState.social + userhubMonth}>
                            <div className={userhubState.socialDiv + userhubMonth}>
                                <Social />
                            </div>
                        </div>
                        <div className={userhubState.panic + userhubMonth}>
                            <div className={userhubState.panicDiv + userhubMonth}>
                                <div className={'homeContainer' + panicMonth}>
                                <img className={'panicIcon' + panicMonth}
                                    src={panic}></img>

                                {panicOn && (<div className={'panicSpinner' + panicMonth}></div>)}
                                {!panicOn && (<div className={'panicComplete' + panicMonth}>
                                        <p className={'panicCompleteMessage' + panicMonth}>all notes off</p></div>)}

                                </div>
                            </div>
                        </div>
                        <p className={'userhubFooter' + userhubMonth}>&copy;{footerText}</p>

                    </div>
                </div>
            </Router>
        );
    
}

export default UserHub;