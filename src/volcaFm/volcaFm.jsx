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
    const [currentAlgorithm, setCurrentAlgorithm] = useState('_algorithm1');
    const [currentAlgorithmNumerical, setCurrentAlgorithmNumerical] = useState(1);
    const [operatorEditorState, setOperatorEditorState] = useState({
        operator1: {
            state: 'operator1EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        }
    });
    const [operatorParams, setOperatorParams] = useState({
        operator1: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0
        }
    });
    
    const handleOperatorLevel = (op, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        
        switch(op) {
            case(1):
                outLvl1 = val;
                break;
            default:
                console.log('impossible condition');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4
            }
        });
        
    }
    
    const changeLevel = (op, level, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let opOut1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        switch(op) {
            case(1):
                switch(level) {
                    case(1):
                        op1EnvL1 = val;
                        break;
                    case(2):
                        op1EnvL2 = val;
                        break;
                    case(3):
                        op1EnvL3 = val;
                        break;
                    case(4):
                        op1EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: opOut1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4
            }
        });
    }
    
    const changeRate = (op, rate, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let opOut1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        switch(op) {
            case(1):
                switch(rate) {
                    case(1):
                        op1EnvR1 = val;
                        break;
                    case(2):
                        op1EnvR2 = val;
                        break;
                    case(3):
                        op1EnvR3 = val;
                        break;
                    case(4):
                        op1EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: opOut1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4
            }
        });
    }
    
    const handleOpOnOffClick = (op) => {
        let opOn1 = '';
        let outLvl1 = operatorParams.operator1.outputLevel;
        switch(op) {
            case(1):
                if (operatorParams.operator1.operatorOn === 'On') {
                    opOn1 = 'Off';
                } else {
                    opOn1 = 'On';
                }
                break;
            default:
                console.log('impossible onoff');
        }
        
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1
            }
        });
    }
    
    const handleOperatorClick = (op) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        switch(op) {
            case(1):
                if (operatorEditorState.operator1.state === 'operator1EditStateActive') {
                   state1 = 'operator1EditStateInactive'; 
                } else {
                    state1 = 'operator1EditStateActive';
                }
                break;
            default:
                console.log('impossible state');
        }
        
        setOperatorEditorState({
           operator1: {
               state: state1,
               envelopeTab: envelope1,
               scalingTab: scaling1,
               tuningTab: tuning1
           } 
        });
    }
    
    const handleOperatorTab = (op, tab) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        switch(op) {
            case(1):
                switch(tab) {
                    case('envelope'):
                        envelope1 = 'operatorEditorTabActive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case('scaling'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabActive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case('tuning'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            default:
                console.log('impossible state');
        }
        setOperatorEditorState({
           operator1: {
               state: state1,
               envelopeTab: envelope1,
               scalingTab: scaling1,
               tuningTab: tuning1
           } 
        });
    }
    
    const changeAlgorithm = (val) => {
        setCurrentAlgorithmNumerical(val);
        setCurrentAlgorithm('_algorithm' + val.toString());
    }
    
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
                    <div className={'volcaFmAlgorithmContainer' + volcaFmMonth}>
                        <h2 className={'volcaFmAgorithmLabel' + volcaFmMonth}>Algorithm: </h2>
                        <input className={'volcaFmAlgorithmNumberInput' + volcaFmMonth}
                            max="32"
                            min="1"
                            onChange={(e) => changeAlgorithm(e.target.value)}
                            type="number"
                            value={currentAlgorithmNumerical}
                            ></input>
                        <div className={'volcaFmAlgorithSliderBorderDiv' + volcaFmMonth}><input className={'volcaFmAlgorithmSlider' + volcaFmMonth}
                            max="32"
                            min="1"
                            onChange={(e) => changeAlgorithm(e.target.value)}
                            type="range"
                            value={currentAlgorithmNumerical}></input></div>
                        <div className={'volcaFmAlgorithmOperator1' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(1)}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>1</p>
                        </div>
                        <div className={'volcaFmAlgorithmOperator2' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>2</p>
                        </div>
                        <div className={'volcaFmAlgorithmOperator3' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>3</p>
                        </div>
                        <div className={'volcaFmAlgorithmOperator4' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>4</p>
                        </div>
                        <div className={'volcaFmAlgorithmOperator5' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>5</p>
                        </div>
                        <div className={'volcaFmAlgorithmOperator6' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>6</p>
                        </div>
                        <div className={'volcaFmAlgorithmConnector1' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector2' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector3' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector4' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector5' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector6' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector7' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector8' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector9' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector10' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector11' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector12' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector13' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector14' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector15' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector16' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector17' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector18' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector19' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector20' + currentAlgorithm + volcaFmMonth}></div>
                    </div>
                </div>
                <div className={'volcaFmOscillatorEditor' + volcaFmMonth}>
                    <div className={operatorEditorState.operator1.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator1.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(1)}>
                                <div className={'opSwitchToggle' + operatorParams.operator1.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator1.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator1.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 1</p>
                            {(operatorParams.operator1.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(1, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator1.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(1, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator1.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator1.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator1.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator1.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator1.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}>
                                Scaling
                            </div>
                        )}
                        {(operatorEditorState.operator1.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                Tuning
                            </div>
                        )}
                    </div>
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