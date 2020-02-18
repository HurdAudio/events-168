import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './userhub.style.jana.css';
import midi5pin from '../img/midi5pin.svg';

const user = {
    avatar: 'https://events-168-hurdaudio.s3.amazonaws.com/avatars/lovecraftAvatar.jpg',
    first_name: 'Devin',
    last_name: 'Hurd'
}


function UserHub() {
    
    const [userhubMonth, setUserhubMonth] = useState('_JanuaryA');
    const [userhubState, setUserhubState] = useState({
        home: 'homeContentActive',
        librarian: 'librarianContentInactive',
        midiFX: 'midiFXContentInactive',
        panic: 'panicContentInactive',
        sequencer: 'sequencerContentInactive',
        social: 'socialContentInactive',
        tab: 'sliderTabHome'
    });
    
    const hubStateHome = () => {
        if (userhubState.tab === 'sliderTabHome') {
            return;
        }
        setUserhubState({
            home: 'homeContentActive',
            librarian: 'librarianContentInactive',
            midiFX: 'midiFXContentInactive',
            panic: 'panicContentInactive',
            sequencer: 'sequencerContentInactive',
            social: 'socialContentInactive',
            tab: 'sliderTabHome'
        });
    }
    
    const hubStateLibrarian = () => {
        if (userhubState.tab === 'sliderTabLibrarian') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            librarian: 'librarianContentActive',
            midiFX: 'midiFXContentInactive',
            panic: 'panicContentInactive',
            sequencer: 'sequencerContentInactive',
            social: 'socialContentInactive',
            tab: 'sliderTabLibrarian'
        });
    }
    
    const hubStateSequencer = () => {
        if (userhubState.tab === 'sliderTabSequencer') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            librarian: 'librarianContentInactive',
            midiFX: 'midiFXContentInactive',
            panic: 'panicContentInactive',
            sequencer: 'sequencerContentActive',
            social: 'socialContentInactive',
            tab: 'sliderTabSequencer'
        });
    }
    
    const hubStateMidiFX = () => {
        if (userhubState.tab === 'sliderTabMidiFX') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            librarian: 'librarianContentInactive',
            midiFX: 'midiFXContentActive',
            panic: 'panicContentInactive',
            sequencer: 'sequencerContentInactive',
            social: 'socialContentInactive',
            tab: 'sliderTabMidiFX'
        });
    }
    
    const hubStateSocial = () => {
        if (userhubState.tab === 'sliderTabSocial') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            librarian: 'librarianContentInactive',
            midiFX: 'midiFXContentInactive',
            panic: 'panicContentInactive',
            sequencer: 'sequencerContentInactive',
            social: 'socialContentActive',
            tab: 'sliderTabSocial'
        });
    }
    
    const hubStatePanic = () => {
        if (userhubState.tab === 'sliderTabPanic') {
            return;
        }
        setUserhubState({
            home: 'homeContentInactive',
            librarian: 'librarianContentInactive',
            midiFX: 'midiFXContentInactive',
            panic: 'panicContentActive',
            sequencer: 'sequencerContentInactive',
            social: 'socialContentInactive',
            tab: 'sliderTabPanic'
        });
    }
    
    
        return(
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
                        <button className={'userHubLogoutButton' + userhubMonth}>log out</button>
                        
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
                    <span class={userhubState.tab + userhubMonth}></span>
                    <div class={userhubState.home + userhubMonth}></div>
                    <div class={userhubState.librarian + userhubMonth}></div>
                    <div class={userhubState.sequencer + userhubMonth}></div>
                    <div class={userhubState.midiFX + userhubMonth}></div>
                    <div class={userhubState.social + userhubMonth}></div>
                    <div class={userhubState.panic + userhubMonth}></div>
                    
                </div>
            </div>
        );
    
}

export default UserHub;