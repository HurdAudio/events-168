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
import axis from '../img/axis.svg';

const midiDelays = [
    {
        uuid: '7ecb1790-8e31-4837-a397-96e9442525e8',
        name: 'create new'
    },
    {
        uuid: 'a4ee6a60-05a5-412a-bd30-804aacd287b7',
        name: 'hard quantize verb'
    },
    {
        uuid: '0a8aac6f-7296-4dd6-96cf-d73a65c9b7e3',
        name: 'feedback delay'
    },
    {
        uuid: 'fe8704dd-d407-49f0-90ab-449de342e953',
        name: 'reverse delay 1'
    }
];

const midiSmears = [
    {
        uuid: 'ab030e04-05f9-4f05-9d1e-572c2b9f584c',
        name: 'create new'
    },
    {
        uuid: '2fded14f-3a6d-4d33-a52b-412798bd50c3',
        name: 'linear smear'
    },
    {
        uuid: '833b6b75-b4e9-426d-beaf-2ab0a97a988f',
        name: 'exponential smear'
    }
];

const midiGlissandos = [
    {
        uuid: 'bac75a89-535a-43cf-8b33-98f642280991',
        name: 'create new'
    },
    {
        uuid: 'd48e552c-a9ba-4ee5-9ddc-ec2bdfb3b9d5',
        name: '5-limit gliss'
    },
    {
        uuid: 'eaa5d5e0-4529-49cf-93e9-ea6d9912f581',
        name: '7-limit gliss'
    },
    {
        uuid: '84b5b47c-3789-40a4-b991-c0ce92c8f83e',
        name: 'undertone gliss'
    }
];

const midiGlitches = [
    {
        uuid: 'dc73bfe0-1411-40c0-a7f9-6a09c82cea80',
        name: 'create new'
    },
    {
        uuid: 'c8b5d66c-696a-48fa-b24b-02f87973aaaf',
        name: 'broken music box'
    }
];

function MidiFX() {
    
    const [midiFXMonth, setMidiFXMonth] = useState('_JanuaryC');
    
        return(
            <div className={'homeContainer' + midiFXMonth}>
                <img className={'midiFXIcon' + midiFXMonth}
                    src={axis}></img>
                <div className={'homeBulletList' + midiFXMonth}>
                    <img className={'homeMidiBullet' + midiFXMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + midiFXMonth}>midi delay:</p>
                    <select className={'homeDropdown' + midiFXMonth}>
                        {midiDelays.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + midiFXMonth}>edit</button>
                </div>
                <div className={'homeBulletList' + midiFXMonth}>
                    <img className={'homeMidiBullet' + midiFXMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + midiFXMonth}>midi smear:</p>
                    <select className={'homeDropdown' + midiFXMonth}>
                        {midiSmears.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + midiFXMonth}>edit</button>
                </div>
                <div className={'homeBulletList' + midiFXMonth}>
                    <img className={'homeMidiBullet' + midiFXMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + midiFXMonth}>midi glissando:</p>
                    <select className={'homeDropdown' + midiFXMonth}>
                        {midiGlissandos.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + midiFXMonth}>edit</button>
                </div>
                <div className={'homeBulletList' + midiFXMonth}>
                    <img className={'homeMidiBullet' + midiFXMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + midiFXMonth}>midi glitch:</p>
                    <select className={'homeDropdown' + midiFXMonth}>
                        {midiGlitches.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + midiFXMonth}>edit</button>
                </div>
                <div className={'homeBulletList' + midiFXMonth}>
                    <img className={'homeMidiBullet' + midiFXMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + midiFXMonth}>shared fx:</p>
                    
                    <button className={'homeButtons' + midiFXMonth}>fx market</button>
                </div>
                
                
                
                
            </div>
        );
    
}

export default MidiFX;