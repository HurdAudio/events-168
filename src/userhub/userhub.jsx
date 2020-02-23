import React, { useState } from 'react';

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
import midi5pin from '../img/midi5pin.svg';

let localStorage = window.localStorage;

const user = {
    avatar: 'https://events-168-hurdaudio.s3.amazonaws.com/avatars/lovecraftAvatar.jpg',
    first_name: 'Devin',
    last_name: 'Hurd'
}

const now = new Date();

let footerText = '';
    
if (now.getFullYear() > 2020) {
    footerText = '2020-' + now.getFullYear() + ' HurdAudio';
} else {
    footerText = now.getFullYear() + ' HurdAudio';
}


function UserHub() {
    
    const [userhubMonth, setUserhubMonth] = useState('_JanuaryA');
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
    const [panicMonth, setPanicMonth] = useState('_JanuaryA');
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
        if (userhubState.tab === 'sliderTabLibrarian') {
            return;
        }
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
    
    
        return(
            <Router>
                <div className={'userHubContainer' + userhubMonth}>
                    <div className={'userHubImageDiv' + userhubMonth}>
                        <img className={'userHubLogoImg' + userhubMonth}
                            src={midi5pin}></img>
                        <div className={'userHubTitleBar' + userhubMonth}>
                            <h2 className={'userHubTitle' + userhubMonth}>168 Events</h2>
                            <div className={'userHubLoggedInAsDiv' + userhubMonth}>
                                <p className={'userHubLoggedInLabel' + userhubMonth}>logged in user: </p>
                                <img className={'userHubLoggedInAvatar' + userhubMonth}
                                    src={user.avatar}></img>
                                <p className={'userHubLoggedInName' + userhubMonth}>{user.first_name} {user.last_name}</p>
                            </div>
                            <NavLink to="/"><button className={'userHubLogoutButton' + userhubMonth}
                                onClick={() => {
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
                                <Home />
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