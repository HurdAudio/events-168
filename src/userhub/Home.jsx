import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midiConnection from '../midiManager/midiConnection';
import './userhub.style.jana.css';
import './userhub.style.janb.css';
import './userhub.style.janc.css';
import './userhub.style.feba.css';
import './userhub.style.febb.css';
import './userhub.style.febc.css';
import midi5pin from '../img/midi5pin.svg';
import home from '../img/home.svg';
import axios from 'axios';

let localStorage = window.localStorage;
let connections;

function Home(user, skin) {
    
    const [homeMonth, setHomeMonth] = useState(skin);
    const [userClockResolution, setUserClockResolution] = useState(user.clock_resolution);
    const [midiConfigurations, setMidiConfigurations] = useState([]);
    const [midiPatchValue, setMidiPatchValue] = useState('');
    const [midiConnections, setMidiConnections] = useState(undefined);
    const [currentOutput, setCurrentOutput] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    
    const clockResolutionChange = (val) => {
        user.clock_resolution = val;
        setUserClockResolution(val);
        axios.patch(`/users/${user.uuid}`, { clock_resolution: val });
    }
    
    const checkConfiguration = () => {
        let patchValue = null;
        
        axios.get(`/midi_manager_patches/byuser/${user.uuid}`)
        .then(patchesData => {
            setMidiConfigurations(patchesData.data);
            if (user.midi_patch !== null) {
                patchValue = user.midi_patch;
            } else if (midiConfigurations.length > 0) {
                patchValue = midiConfigurations[0].uuid;
            }
            setMidiPatchValue(patchValue);
            if (midiConnections === undefined) {
                navigator.requestMIDIAccess({ sysex: true })
                .then((midiAccess) => {               
                    connections = midiConnection(midiAccess);
                    setMidiConnections(connections);
                    setCurrentOutput(connections.currentOutput);
                    setCurrentMidiChannel(connections.currentMidiChannel);
                    setAvailableOutputs(connections.outputs);
                    setAvailableInputs(connections.inputs);
                    user.midi_connections = connections;
                    return;
                }, () => {
                    alert('No MIDI ports accessible');
                });
            }
        });
    }
    
    const changeMidiPatch = (val) => {
        setMidiPatchValue(val);
        axios.patch(`/users/${user.uuid}`, { midi_patch: val });
        if (midiConnections === undefined) {
            navigator.requestMIDIAccess({ sysex: true })
            .then((midiAccess) => {               
                connections = midiConnection(midiAccess);
                setMidiConnections(connections);
                setCurrentOutput(connections.currentOutput);
                setCurrentMidiChannel(connections.currentMidiChannel);
                setAvailableOutputs(connections.outputs);
                setAvailableInputs(connections.inputs);
                user.midi_connections = connections;
                return;
            }, () => {
                alert('No MIDI ports accessible');
            });
        }
    }
    
    if (isNaN(userClockResolution)) {
        axios.get(`/users/${localStorage.getItem('eventualUser')}`)
        .then(userData => {
            setUserClockResolution(userData.data.clock_resolution);
        });
    }
    
        return(
            <div className={'homeContainer' + homeMonth}>
                <img className={'homeIcon' + homeMonth}
                    src={home}></img>

                <div className={'homeBulletList' + homeMonth}>
                    <img className={'homeMidiBullet' + homeMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + homeMonth}>MIDI manager:</p>
                    <select className={'homeDropdown' + homeMonth}
                        onChange={(e) => changeMidiPatch(e.target.value)}
                        value={midiPatchValue}>
                        {midiConfigurations.map(item => 
                            <option key={item.uuid} value={item.uuid}>{item.user_preset.name}</option>
                        )}
                    </select>
                    <button className={'homeButtons' + homeMonth}
                        onClick={() => checkConfiguration()}>load</button>
                    <Link to="/midi-manager">
                        <button className={'homeButtons' + homeMonth}>edit</button>
                    </Link>
                </div>
                <div className={'homeBulletList' + homeMonth}>
                    <img className={'homeMidiBullet' + homeMonth} 
                        src={midi5pin}></img>
                    <p className={'homeDropdownLabel' + homeMonth}>clock resolution:</p>
                    <input className={'homeDropdown' + homeMonth}
                        max={'510510'}
                        min={'1'}
                        onChange={(e) => clockResolutionChange(e.target.value)}
                        type='number' 
                        value={userClockResolution}></input>
                </div>
            </div>
        );
    
}

export default Home;