import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './volcaFm.style.jana.css';
import midi5pin from '../img/midi5pin.svg';

function VolcaFm () {
    
    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {
        q: false,
        2: false,
        w: false
    }
    
    const [volcaFmMonth, setVolcaFmMonth] = useState('_JanuaryA');
    const [midiImage, setMidiImage] = useState(midi5pin);
    
    const noteOnEvent = (key) => {
        switch (key.toLowerCase()) {
            case('q'):
                if (!keyEngaged.q) {
                    keyEngaged.q = true;
                    midiOutput.send([0x90 | midiChannel, rootNote, 0x7f]);
                }
                break;
            case('2'):
                if (!keyEngaged['2']) {
                    keyEngaged['2'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 1, 0x7f]);
                }
                break;
            case('w'):
                if (!keyEngaged.w) {
                    keyEngaged.w = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 2, 0x7f]);
                }
                break;
            case('3'):
                if (!keyEngaged['3']) {
                    keyEngaged['3'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 3, 0x7f]);
                }
                break;
            case('e'):
                if (!keyEngaged.e) {
                    keyEngaged.e = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 4, 0x7f]);
                }
                break;
            case('r'):
                if (!keyEngaged.r) {
                    keyEngaged.r = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 5, 0x7f]);
                }
                break;
            case('5'):
                if (!keyEngaged['5']) {
                    keyEngaged['5'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 6, 0x7f]);
                }
                break;
            case('t'):
                if (!keyEngaged.t) {
                    keyEngaged.t = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 7, 0x7f]);
                }
                break;
            case('6'):
                if (!keyEngaged['6']) {
                    keyEngaged['6'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 8, 0x7f]);
                }
                break;
            case('y'):
                if (!keyEngaged.y) {
                    keyEngaged.y = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 9, 0x7f]);
                }
                break;
            case('7'):
                if (!keyEngaged['7']) {
                    keyEngaged['7'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 10, 0x7f]);
                }
                break;
            case('u'):
                if (!keyEngaged.u) {
                    keyEngaged.u = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 11, 0x7f]);
                }
                break;
            case('i'):
                if (!keyEngaged.i) {
                    keyEngaged.i = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 12, 0x7f]);
                }
                break;
            case('9'):
                if (!keyEngaged['9']) {
                    keyEngaged['9'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 13, 0x7f]);
                }
                break;
            case('o'):
                if (!keyEngaged.o) {
                    keyEngaged.o = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 14, 0x7f]);
                }
                break;
            case('0'):
                if (!keyEngaged['0']) {
                    keyEngaged['0'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 15, 0x7f]);
                }
                break;
            case('p'):
                if (!keyEngaged.p) {
                    keyEngaged.p = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 16, 0x7f]);
                }
                break;
            case('['):
                if (!keyEngaged['[']) {
                    keyEngaged['['] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 17, 0x7f]);
                }
                break;
            case('='):
                if (!keyEngaged['=']) {
                    keyEngaged['='] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 18, 0x7f]);
                }
                break;
            case(']'):
                if (!keyEngaged[']']) {
                    keyEngaged[']'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 19, 0x7f]);
                }
                break;
            default:
                console.log('no note');
        }
    }
    
    const noteOffEvent = (key) => {
        switch (key.toLowerCase()) {
            case('q'):
                midiOutput.send([0x80 | midiChannel, rootNote, 0x7f]);
                keyEngaged.q = false;
                break;
            case('2'):
                midiOutput.send([0x80 | midiChannel, rootNote + 1, 0x7f]);
                keyEngaged['2'] = false;
                break;
            case('w'):
                midiOutput.send([0x80 | midiChannel, rootNote + 2, 0x7f]);
                keyEngaged.w = false;
                break;
            case('3'):
                midiOutput.send([0x80 | midiChannel, rootNote + 3, 0x7f]);
                keyEngaged['3'] = false;
                break;
            case('e'):
                midiOutput.send([0x80 | midiChannel, rootNote + 4, 0x7f]);
                keyEngaged.e = false;
                break;
            case('r'):
                midiOutput.send([0x80 | midiChannel, rootNote + 5, 0x7f]);
                keyEngaged.r = false;
                break;
            case('5'):
                midiOutput.send([0x80 | midiChannel, rootNote + 6, 0x7f]);
                keyEngaged['5'] = false;
                break;
            case('t'):
                midiOutput.send([0x80 | midiChannel, rootNote + 7, 0x7f]);
                keyEngaged.t = false;
                break;
            case('6'):
                midiOutput.send([0x80 | midiChannel, rootNote + 8, 0x7f]);
                keyEngaged['6'] = false;
                break;
            case('y'):
                midiOutput.send([0x80 | midiChannel, rootNote + 9, 0x7f]);
                keyEngaged.y = false;
                break;
            case('7'):
                midiOutput.send([0x80 | midiChannel, rootNote + 10, 0x7f]);
                keyEngaged['7'] = false;
                break;
            case('u'):
                midiOutput.send([0x80 | midiChannel, rootNote + 11, 0x7f]);
                keyEngaged.u = false;
                break;
            case('i'):
                midiOutput.send([0x80 | midiChannel, rootNote + 12, 0x7f]);
                keyEngaged.i = false;
                break;
            case('9'):
                midiOutput.send([0x80 | midiChannel, rootNote + 13, 0x7f]);
                keyEngaged['9'] = false;
                break;
            case('o'):
                midiOutput.send([0x80 | midiChannel, rootNote + 14, 0x7f]);
                keyEngaged.o = false;
                break;
            case('0'):
                midiOutput.send([0x80 | midiChannel, rootNote + 15, 0x7f]);
                keyEngaged['0'] = false;
                break;
            case('p'):
                midiOutput.send([0x80 | midiChannel, rootNote + 16, 0x7f]);
                keyEngaged.p = false;
                break;
            case('['):
                midiOutput.send([0x80 | midiChannel, rootNote + 17, 0x7f]);
                keyEngaged['['] = false;
                break;
            case('='):
                midiOutput.send([0x80 | midiChannel, rootNote + 18, 0x7f]);
                keyEngaged['='] = false;
                break;
            case(']'):
                midiOutput.send([0x80 | midiChannel, rootNote + 19, 0x7f]);
                keyEngaged[']'] = false;
                break;
            default:
                console.log('no note');
        }
    }
    
    function onMIDIFailure() {
        alert('No MIDI ports accessible');
    }
    
    function onMIDISuccess(midiAccess) {
        console.log(midiAccess);

        inputs = Array.from(midiAccess.inputs.values());
        outputs = Array.from(midiAccess.outputs.values());
        
//        midiOutput = outputs[0];
        
        console.log(outputs);
        for(const output of outputs) {
            console.log(output);
            midiOutput = output;
        }
        console.log(midiOutput);
        
//        midiOutput.send([0x90 | midiChannel, rootNote, 0x7f]);
//        setTimeout(() => {
//           midiOutput.send([0x80 | midiChannel, rootNote, 0x7f]); 
//        }, 500);
        
    }
    
    function initiateMidiAccess() {
        navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
    }
    
    initiateMidiAccess();
    
    return(
        <div className={'volcaFmEditorContainer' + volcaFmMonth}
            tabIndex="1"
            onKeyDown={(e) => noteOnEvent(e.key)}
            onKeyUp={(e) => noteOffEvent(e.key)}>
            <div className={'volcaFmEditorImageDiv' + volcaFmMonth}>
                <div className={'volcaFmEditorTopBar' + volcaFmMonth}>
                    <NavLink to="/"><img className={'volcaFmNavImage' + volcaFmMonth}
                        src={midiImage}></img></NavLink>
                </div>
                <h3 className={'volcaFmEditorTitle' + volcaFmMonth}>Volca FM Editor</h3>
                <button className={'volcaFmPanicButton' + volcaFmMonth}>panic!</button>
                <div className={'volcaFmSidebarManager' + volcaFmMonth}>
                    <p>sidebar manager</p>
                </div>
                <div className={'volcaFmAlgorithmDisplay' + volcaFmMonth}>
                    <p>algorithm display</p>
                </div>
                <div className={'volcaFmOscillatorEditor' + volcaFmMonth}>
                    <p>operator editor</p>
                </div>
                <div className={'volcaFmNonOpEditor' + volcaFmMonth}>
                    <p>non-operator editor</p>
                </div>
                <div className={'volcaEnvelopeLevelDisplay' + volcaFmMonth}>
                    <p>envelope/level display</p>
                </div>
            </div>
        </div>
        );
}

export default VolcaFm;