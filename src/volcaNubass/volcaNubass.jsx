import React, {
    useState
} from 'react';

import {
    BrowserRouter as Router,
    NavLink,
    Switch,
    Route,
    Link
} from "react-router-dom";
import './volcaNubass.style.jana.css';
import midi5pin from '../img/midi5pin.svg';

function VolcaNubass() {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [panicState, setPanicState] = useState('panicOff');
    const [currentSpinner, setCurrentSpinner] = useState('https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif');
    const [volcaNubassEditMonth, setVolcaNubassEditMonth] = useState('_JanuaryA');
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [volcaNubassContainerState, setVolcaNubassContainerState] = useState('Active');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [nubassParameters, setNubassParameters] = useState({
        pitch: 64,
        saturation: 0,
        level: 0,
        cutoff: 32,
        peak: 0,
        attack: 13,
        decay: 16,
        egInt: 32,
        accent: 12,
        lfoRate: 8,
        lfoInt: 8
    });
    
    const [nubassFaceplateParams, setNubassFaceplateParams] = useState({
        vtoWave: false,
        lfoWave: false,
        amplitude: false,
        pitch: false,
        cutoff: false,
        lfoSync: false,
        sustain: false
    });
    
    const toggleVtoWave = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.vtoWave = !deepCopy.vtoWave;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const toggleLfoWave = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.lfoWave = !deepCopy.lfoWave;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const toggleAmplitude = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.amplitude = !deepCopy.amplitude;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const togglePitch = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.pitch = !deepCopy.pitch;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const toggleCutoff = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.cutoff = !deepCopy.cutoff;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const toggleLfoSync = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.lfoSync = !deepCopy.lfoSync;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const toggleSustain = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.sustain = !deepCopy.sustain;
        
        setNubassFaceplateParams(deepCopy);
    }
    
    const updatePitchValue = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.pitch = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateSaturation = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.saturation = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateLevelValue = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.level = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateCutoff = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.cutoff = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updatePeak = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.peak = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateAttack = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.attack = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateDecay = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.decay = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateEgInt = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.egInt = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateAccent = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.accent = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateLfoRate = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.lfoRate = val;
        
        setNubassParameters(deepCopy);
    }
    
    const updateLfoInt = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.lfoInt = val;
        
        setNubassParameters(deepCopy);
    }

    const noteOnEvent = (key) => {
        let index = 0;
        for (let i = 0; i < outputs.length; i++) {
            if (outputs[i].id === currentOutput.id) {
                index = i;
            }
        }
        switch (key.toLowerCase()) {
            case ('q'):
                if (!keyEngaged.q) {
                    keyEngaged.q = true;
                    outputs[index].send([0x90 | currentMidiChannel, rootNote, 0x7f]);
                }
                break;
            case ('2'):
                if (!keyEngaged['2']) {
                    keyEngaged['2'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 1, 0x7f]);
                }
                break;
            case ('w'):
                if (!keyEngaged.w) {
                    keyEngaged.w = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 2, 0x7f]);
                }
                break;
            case ('3'):
                if (!keyEngaged['3']) {
                    keyEngaged['3'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 3, 0x7f]);
                }
                break;
            case ('e'):
                if (!keyEngaged.e) {
                    keyEngaged.e = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 4, 0x7f]);
                }
                break;
            case ('r'):
                if (!keyEngaged.r) {
                    keyEngaged.r = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 5, 0x7f]);
                }
                break;
            case ('5'):
                if (!keyEngaged['5']) {
                    keyEngaged['5'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 6, 0x7f]);
                }
                break;
            case ('t'):
                if (!keyEngaged.t) {
                    keyEngaged.t = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 7, 0x7f]);
                }
                break;
            case ('6'):
                if (!keyEngaged['6']) {
                    keyEngaged['6'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 8, 0x7f]);
                }
                break;
            case ('y'):
                if (!keyEngaged.y) {
                    keyEngaged.y = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 9, 0x7f]);
                }
                break;
            case ('7'):
                if (!keyEngaged['7']) {
                    keyEngaged['7'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 10, 0x7f]);
                }
                break;
            case ('u'):
                if (!keyEngaged.u) {
                    keyEngaged.u = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 11, 0x7f]);
                }
                break;
            case ('i'):
                if (!keyEngaged.i) {
                    keyEngaged.i = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 12, 0x7f]);
                }
                break;
            case ('9'):
                if (!keyEngaged['9']) {
                    keyEngaged['9'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 13, 0x7f]);
                }
                break;
            case ('o'):
                if (!keyEngaged.o) {
                    keyEngaged.o = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 14, 0x7f]);
                }
                break;
            case ('0'):
                if (!keyEngaged['0']) {
                    keyEngaged['0'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 15, 0x7f]);
                }
                break;
            case ('p'):
                if (!keyEngaged.p) {
                    keyEngaged.p = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 16, 0x7f]);
                }
                break;
            case ('['):
                if (!keyEngaged['[']) {
                    keyEngaged['['] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 17, 0x7f]);
                }
                break;
            case ('='):
                if (!keyEngaged['=']) {
                    keyEngaged['='] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 18, 0x7f]);
                }
                break;
            case (']'):
                if (!keyEngaged[']']) {
                    keyEngaged[']'] = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote + 19, 0x7f]);
                }
                break;
            default:
                console.log('no note');
        }
    }

    const noteOffEvent = (key) => {
        switch (key.toLowerCase()) {
            case ('q'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote, 0x7f]);
                keyEngaged.q = false;
                break;
            case ('2'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 1, 0x7f]);
                keyEngaged['2'] = false;
                break;
            case ('w'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 2, 0x7f]);
                keyEngaged.w = false;
                break;
            case ('3'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 3, 0x7f]);
                keyEngaged['3'] = false;
                break;
            case ('e'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 4, 0x7f]);
                keyEngaged.e = false;
                break;
            case ('r'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 5, 0x7f]);
                keyEngaged.r = false;
                break;
            case ('5'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 6, 0x7f]);
                keyEngaged['5'] = false;
                break;
            case ('t'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 7, 0x7f]);
                keyEngaged.t = false;
                break;
            case ('6'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 8, 0x7f]);
                keyEngaged['6'] = false;
                break;
            case ('y'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 9, 0x7f]);
                keyEngaged.y = false;
                break;
            case ('7'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 10, 0x7f]);
                keyEngaged['7'] = false;
                break;
            case ('u'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 11, 0x7f]);
                keyEngaged.u = false;
                break;
            case ('i'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 12, 0x7f]);
                keyEngaged.i = false;
                break;
            case ('9'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 13, 0x7f]);
                keyEngaged['9'] = false;
                break;
            case ('o'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 14, 0x7f]);
                keyEngaged.o = false;
                break;
            case ('0'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 15, 0x7f]);
                keyEngaged['0'] = false;
                break;
            case ('p'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 16, 0x7f]);
                keyEngaged.p = false;
                break;
            case ('['):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 17, 0x7f]);
                keyEngaged['['] = false;
                break;
            case ('='):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 18, 0x7f]);
                keyEngaged['='] = false;
                break;
            case (']'):
                currentOutput.send([0x80 | currentMidiChannel, rootNote + 19, 0x7f]);
                keyEngaged[']'] = false;
                break;
            default:
                console.log('no note');
        }
    }
    
    const panic = () => {
        setPanicState('panicOn');
//        setVolcaFmContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('panicOff');
//            setVolcaFmContainerState('Active');
        }, availableOutputs.length * 2000);
    }
    
    function initInputs() {
        if (inputs.length > 0) {
            setAvailableInputs(inputs);
            setAvailableOutputs(outputs);
            setCurrentOutput(availableOutputs[0]);
            setCurrentMidiChannel(midiOutput);

            console.log(outputs);
            for (const output of outputs) {
                console.log(output);
                midiOutput = output;
            }
            midiOutput = 0;
            console.log(midiOutput);
        }
        
    }

    function onMIDIFailure() {
        alert('No MIDI ports accessible');
    }

    function onMIDISuccess(midiAccess) {
        console.log(midiAccess);

        inputs = Array.from(midiAccess.inputs.values());
        outputs = Array.from(midiAccess.outputs.values());
        if (currentOutput === 0) {
            initInputs();
        }

    }

    function initiateMidiAccess() {
        navigator.requestMIDIAccess({ sysex: true })
            .then(onMIDISuccess, onMIDIFailure);
    }

    initiateMidiAccess();
    
    return (
        <div>
            <div className={'volcaNubassEditorContainer' + volcaNubassContainerState + volcaNubassEditMonth}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'volcaNubassEditorImageDiv' + volcaNubassEditMonth}>
                    <div className={'volcaNubassEditorTopBar' + volcaNubassEditMonth}>
                        <NavLink to="/"><img className={'volcaNubassNavImage' + volcaNubassEditMonth}
                            src={midiImage}></img></NavLink>
                    </div>
                    <h3 className={'volcaNubassEditorTitle' + volcaNubassEditMonth}>Volca Nubass Editor</h3>
                    <div className={'volcaNubassSidebarManager' + volcaNubassEditMonth}></div>
                    <div className={'volcaNubassVacuumTubeOscillator' + volcaNubassEditMonth}>
                        <div className={'voclaNubassVacuum' + volcaNubassEditMonth}
                            style={{filter: 'saturate(' + 50 + (nubassParameters.saturation/127) + '%)', opacity: nubassParameters.level/127}}>
                            <div className={'volcaNubassFilament' + volcaNubassEditMonth}
                                style={{filter: 'hue-rotate(' + ((nubassParameters.saturation/127) * 180) + 'deg)'}}></div>
                        </div>
                        <p className={'volcaNubassVacuumTubeOscLabel' + volcaNubassEditMonth}>Vacuum Tube Oscillator</p>
                        <div className={'volcaNubassVacuumTubeOscContainer' + volcaNubassEditMonth}>
                            <p className={'volcaNubassTubeOscPitchLabel' + volcaNubassEditMonth}>pitch</p>
                            <div className={'volcaNubassTubeOscLeverContainerPitch' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePitchValue(e.target.value)}
                                    type="range"
                                    value={nubassParameters.pitch} />
                            </div>
                            <p className={'volcaNubassTubeOscSubOscLabel' + volcaNubassEditMonth}>sub oscillator:</p>
                            <p className={'volcaNubassTubeOscSaturationLabel' + volcaNubassEditMonth}>saturation</p>
                            <div className={'volcaNubassTubeOscLeverContainerSaturation' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateSaturation(e.target.value)}
                                    type="range"
                                    value={nubassParameters.saturation} />
                            </div>
                            <p className={'volcaNubassTubeOscLevelLabel' + volcaNubassEditMonth}>level</p>
                            <div className={'volcaNubassTubeOscLeverContainerLevel' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateLevelValue(e.target.value)}
                                    type="range"
                                    value={nubassParameters.level} />
                            </div>
                        </div>
                    </div>
                    <div className={'volcaNubassFaceplateParamsContainer' + volcaNubassEditMonth}>
                        <div className={'volcaNubassFaceplateParamsGrid' + volcaNubassEditMonth}>
                            <div className={'volcaNubassVTOWaveEdit' + volcaNubassEditMonth}>
                                <div className={'volcaNubassVTOWaveLabelDiv' + volcaNubassEditMonth}>
                                    <p className={'volcaNubassVTOWaveLabel' + volcaNubassEditMonth}>vto wave</p>
                                </div>
                                <div className={'volcaNubassVTOInteractDiv' + volcaNubassEditMonth}
                                    onClick={() => toggleVtoWave()}>
                                    <p>saw</p>
                                    <p>square</p>
                                    <div className={'vtoWaveformSwitch' + nubassFaceplateParams.vtoWave + volcaNubassEditMonth}></div>
                                </div>
                            </div>
                            <div className={'volcaNubassLFOWaveEdit' + volcaNubassEditMonth}>
                                <div className={'volcaNubassVTOWaveLabelDiv' + volcaNubassEditMonth}>
                                    <p className={'volcaNubassVTOWaveLabel' + volcaNubassEditMonth}>lfo wave</p>
                                </div>
                                <div className={'volcaNubassVTOInteractDiv' + volcaNubassEditMonth}
                                    onClick={() => toggleLfoWave()}>
                                    <p>tri-</p>
                                    <p>square</p>
                                    <div className={'lfoWaveformSwitch' + nubassFaceplateParams.lfoWave + volcaNubassEditMonth}></div>
                                </div>
                            </div>
                            <div className={'volcaNubassLFOTarget' + volcaNubassEditMonth}>
                                <div className={'volcaNubassLFOTargetLabelDiv' + volcaNubassEditMonth}>
                                    <p>lfo target:</p>
                                </div>
                                <div className={'lfoTargetDiv' + volcaNubassEditMonth}>
                                    <div className={'lfoTargetLabelDiv' + volcaNubassEditMonth}>
                                        <p>amplitude</p>
                                    </div>
                                    <div className={'lfoTargetInteractiveDiv' + volcaNubassEditMonth}
                                        onClick={() => toggleAmplitude()}>
                                        <p>off</p>
                                        <p>on</p>
                                        <div className={'lfoTargetAmpSwitch' + nubassFaceplateParams.amplitude + volcaNubassEditMonth}></div>
                                    </div>
                                    <div className={'lfoTargetLabelDiv' + volcaNubassEditMonth}>
                                        <p>pitch</p>
                                    </div>
                                    <div className={'lfoTargetInteractiveDiv' + volcaNubassEditMonth}
                                        onClick={() => togglePitch()}>
                                        <p>off</p>
                                        <p>on</p>
                                        <div className={'lfoTargetPitchSwitch' + nubassFaceplateParams.pitch + volcaNubassEditMonth}></div>
                                    </div>
                                    <div className={'lfoTargetLabelDiv' + volcaNubassEditMonth}>
                                        <p>cutoff</p>
                                    </div>
                                    <div className={'lfoTargetInteractiveDiv' + volcaNubassEditMonth}
                                        onClick={() => toggleCutoff()}>
                                        <p>off</p>
                                        <p>on</p>
                                        <div className={'lfoTargetCutoffSwitch' + nubassFaceplateParams.cutoff + volcaNubassEditMonth}></div>
                                    </div>
                                </div>
                            </div>
                            <div className={'volcaNubassLFOSyncEdit' + volcaNubassEditMonth}>
                                <div className={'volcaNubassVTOWaveLabelDiv' + volcaNubassEditMonth}>
                                    <p className={'volcaNubassVTOWaveLabel' + volcaNubassEditMonth}>lfo sync</p>
                                </div>
                                <div className={'volcaNubassVTOInteractDiv' + volcaNubassEditMonth}
                                    onClick={() => toggleLfoSync()}>
                                    <p>off</p>
                                    <p>on</p>
                                    <div className={'lfoSyncformSwitch' + nubassFaceplateParams.lfoSync + volcaNubassEditMonth}></div>
                                </div>
                            </div>
                            <div className={'volcaNubassSustainEdit' + volcaNubassEditMonth}>
                                <div className={'volcaNubassVTOWaveLabelDiv' + volcaNubassEditMonth}>
                                    <p className={'volcaNubassVTOWaveLabel' + volcaNubassEditMonth}>sustain</p>
                                </div>
                                <div className={'volcaNubassVTOInteractDiv' + volcaNubassEditMonth}
                                    onClick={() => toggleSustain()}>
                                    <p>off</p>
                                    <p>on</p>
                                    <div className={'sustainformSwitch' + nubassFaceplateParams.sustain + volcaNubassEditMonth}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'volcaNubassVoltageControlledFilterContainer' + volcaNubassEditMonth}>
                        <p className={'volcaNubassVCALabel' + volcaNubassEditMonth}>Voltage Controlled Filter</p>
                        <div className={'volcaNubassVCFParamsContainer' + volcaNubassEditMonth}>
                            <p className={'volcaNubassVFCCutoffLabel' + volcaNubassEditMonth}>cutoff</p>
                            <div className={'volcaNubassVCFContainerCutoff' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateCutoff(e.target.value)}
                                    type="range"
                                    value={nubassParameters.cutoff} />
                            </div>
                            <p className={'volcaNubassVFCPeakLabel' + volcaNubassEditMonth}>peak</p>
                            <div className={'volcaNubassVCFContainerPeak' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePeak(e.target.value)}
                                    type="range"
                                    value={nubassParameters.peak} />
                            </div>
                            <p className={'volcaNubassVFCAttackLabel' + volcaNubassEditMonth}>attack</p>
                            <div className={'volcaNubassVCFContainerAttack' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateAttack(e.target.value)}
                                    type="range"
                                    value={nubassParameters.attack} />
                            </div>
                            <p className={'volcaNubassVFCDecayLabel' + volcaNubassEditMonth}>decay</p>
                            <div className={'volcaNubassVCFContainerDecay' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDecay(e.target.value)}
                                    type="range"
                                    value={nubassParameters.decay} />
                            </div>
                            <p className={'volcaNubassVFCEgIntLabel' + volcaNubassEditMonth}>eg int</p>
                            <div className={'volcaNubassVCFContainerEgInt' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateEgInt(e.target.value)}
                                    type="range"
                                    value={nubassParameters.egInt} />
                            </div>
                            <p className={'volcaNubassVFCAccentLabel' + volcaNubassEditMonth}>accent</p>
                            <div className={'volcaNubassVCFContainerAccent' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateAccent(e.target.value)}
                                    type="range"
                                    value={nubassParameters.accent} />
                            </div>
                            <p className={'volcaNubassVFCLFORateLabel' + volcaNubassEditMonth}>lfo rate</p>
                            <div className={'volcaNubassVCFContainerLFORate' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateLfoRate(e.target.value)}
                                    type="range"
                                    value={nubassParameters.lfoRate} />
                            </div>
                            <p className={'volcaNubassVFCLFOIntLabel' + volcaNubassEditMonth}>lfo int</p>
                            <div className={'volcaNubassVCFContainerLFOInt' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateLfoInt(e.target.value)}
                                    type="range"
                                    value={nubassParameters.lfoInt} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}


export default VolcaNubass;
