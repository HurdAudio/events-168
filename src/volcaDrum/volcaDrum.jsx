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
import './volcaDrum.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import volcaFmImg1 from '../img/volcaFmImg1.png';

function VolcaDrum() {
    
    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 36;
    let keyEngaged = {};
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif';

    const [panicState, setPanicState] = useState('panicOff');
    const [currentSpinner, setCurrentSpinner] = useState(janaSpinner);
    const [availableInputs, setAvailableInputs] = useState(inputs);
    const [availableOutputs, setAvailableOutputs] = useState(outputs);
    const [currentOutput, setCurrentOutput] = useState(256);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [volcaDrumContainerState, setVolcaDrumContainerState] = useState('Active');
    const [saveAsName, setSaveAsName] = useState('');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('Inactive');
    const [volcaDrumMonth, setVolcaDrumMonth] = useState('_JanuaryA');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [activeLayers, setActiveLayers] = useState([
       true, false, false, false, false, false 
    ]);
    const [globalParams, setGlobalParams] = useState({
        name: 'default',
        waveGuide: {
            body: 0,
            decay: 0,
            tune:0
        },
        waveGuideModel: {
            envelopeGenerators: [true, false, false],
            pitchModulators: [true, false, false],
            soundSource: [true, false, false, false, false]
        }
    })
    const [currentPatch, setCurrentPatch] = useState([
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 0
        },
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 0
        },
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 1
        },
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 1
        },
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 2
        },
        {
            layer1: {
                level: 100
            },
            layer2: {
                level: 100
            },
            layer12: {
                level: 100
            },
            layerSelection: [true, false, false],
            patch: 3
        }
    ]);
    
    const updateDrumLayerLevel = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.level = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.level = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.level = val;
                break;
            default:
                console.log('impossible layer attribute');
        }
        
        setCurrentPatch(deepCopy);
    }
    
    const updateLayerSelection = (index) => {
        let deepCopy = [...currentPatch];
        
        for (let i = 0; i < deepCopy[currentMidiChannel].layerSelection.length; i++) {
            if (i === index) {
                deepCopy[currentMidiChannel].layerSelection[i] = true;
            } else {
                deepCopy[currentMidiChannel].layerSelection[i] = false;
            }
        }
        
        setCurrentPatch(deepCopy);
    }
    
    const updateWaveguideModelEnvelopeGenerator = (index) => {
        let deepCopy = {...globalParams};
        
        for (let i = 0; i < deepCopy.waveGuideModel.envelopeGenerators.length; i++) {
            if (i === index) {
                deepCopy.waveGuideModel.envelopeGenerators[i] = true;
            } else {
                deepCopy.waveGuideModel.envelopeGenerators[i] = false;
            }
        }
        setGlobalParams(deepCopy);
    }
    
    const updateWaveguideModelPitchModulator = (index) => {
        let deepCopy = {...globalParams};
        
        for (let i = 0; i < deepCopy.waveGuideModel.pitchModulators.length; i++) {
            if (i === index) {
                deepCopy.waveGuideModel.pitchModulators[i] = true;
            } else {
                deepCopy.waveGuideModel.pitchModulators[i] = false;
            }
        }
        setGlobalParams(deepCopy);
    }
    
    const updateWaveguideModelSoundSource = (index) => {
        let deepCopy = {...globalParams};
        
        for (let i = 0; i < deepCopy.waveGuideModel.soundSource.length; i++) {
            if (i === index) {
                deepCopy.waveGuideModel.soundSource[i] = true;
            } else {
                deepCopy.waveGuideModel.soundSource[i] = false;
            }
        }
        setGlobalParams(deepCopy);
    }
    
    const updateDecay = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.decay = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updateBody = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.body = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updateTune = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.tune = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updatePatchSetting = (val) => {
        let deepCopy = [...currentPatch];
        
        deepCopy[currentMidiChannel].patch = (val - 1);
        
        setCurrentPatch(deepCopy);
    }
    
    const updatePart = (val) => {
        let deepCopy = [...activeLayers];
        
        for (let i = 0; i < deepCopy.length; i++) {
            if ((val - 1) === i) {
                deepCopy[i] = true;
            } else {
                deepCopy[i] = false;
            }
        }
        
        setActiveLayers(deepCopy);
        setCurrentMidiChannel(val - 1);
    }
    
    const updateCurrentMidiChannel = (val) => {
        setCurrentMidiChannel(val);
    }
    
    const getVisualOutput = (val) => {
        console.log(val);
    }
    
    const updateCurrentOutput = (val) => {
        let index = 0;
        for (let i = 0; i < availableOutputs.length; i++) {
            if (availableOutputs[i].id === val) {
                index = i;
            }
        }
        setCurrentOutput(availableOutputs[index]);
    }
        
    const submitSaveAsDialog = (val) => {
       
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsDialogStatus('Inactive'); 
        setVolcaDrumContainerState('Active');
    }
    
    const executeSaveAsDialog = () => {
        setSaveAsDialogStatus('Active');
        setVolcaDrumContainerState('Inactive');
//        document.getElementById('saveAsInput').focus();
    }
    
    const updateChangeAsName = (val) => {
        setSaveAsName(val);
    }
    
    const savePatch = () => {
        setPatchAltered(false);
    }
    
    const revertPatch = () => {
        setPatchAltered(false);
    }
    
    const patchNameUpdate = (val) => {
        
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
        setVolcaDrumContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('panicOff');
            setVolcaDrumContainerState('Active');
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
            <div className={'volcaDrumEditorContainer' + volcaDrumContainerState + volcaDrumMonth}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'volcaDrumEditorImageDiv' + volcaDrumMonth}>
                    <div className={'volcaDrumEditorTopBar' + volcaDrumMonth}>
                        <NavLink to="/"><img className={'volcaDrumNavImage' + volcaDrumMonth}
                            src={midiImage}></img></NavLink>
                        
                    </div>
                    <h3 className={'volcaDrumEditorTitle' + volcaDrumMonth}>Volca Drum Editor</h3>
                    
                    <div className={'volcaDrumSidebarManager' + volcaDrumMonth}>
                        <div className={'sidebarContainer' + volcaDrumMonth}>
                            
                        </div>
                    </div>
                    
                    <div className={'volcaDrumLayerSelectorDiv' + volcaDrumMonth}>
                        <p className={'volcaDrumLayerSelectorLabel' + volcaDrumMonth}>Part:</p>
                        <button className={'volcaDrumLayerButton' + activeLayers[0] + volcaDrumMonth}
                            onClick={() => updatePart(1)}>1</button>
                        <button className={'volcaDrumLayerButton' + activeLayers[1] + volcaDrumMonth}
                            onClick={() => updatePart(2)}>2</button>
                        <button className={'volcaDrumLayerButton' + activeLayers[2] + volcaDrumMonth}
                            onClick={() => updatePart(3)}>3</button>
                        <button className={'volcaDrumLayerButton' + activeLayers[3] + volcaDrumMonth}
                            onClick={() => updatePart(4)}>4</button>
                        <button className={'volcaDrumLayerButton' + activeLayers[4] + volcaDrumMonth}
                            onClick={() => updatePart(5)}>5</button>
                        <button className={'volcaDrumLayerButton' + activeLayers[5] + volcaDrumMonth}
                            onClick={() => updatePart(6)}>6</button>
                    </div>
                    <div className={'volcaDrumPatchSelectorDiv' + volcaDrumMonth}>
                        <p className={'volcaDrumLayerSelectorLabel' + volcaDrumMonth}>Patch:</p>
                        <input 
                            className={'volcaDrumPatchInput' + volcaDrumMonth}
                            max="16"
                            min="1"
                            onChange={(e) => updatePatchSetting(e.target.value)}
                            type="number"
                            value={((currentPatch[currentMidiChannel].patch) + 1) | 1}/>
                        <div className={'volcaDrumPatchSliderContainer' + volcaDrumMonth}>
                        <input 
                            className={'volcaDrumPatchSlider' + volcaDrumMonth}
                            max="16"
                            min="1"
                            onChange={(e) => updatePatchSetting(e.target.value)}
                            type="range"
                            value={((currentPatch[currentMidiChannel].patch) + 1) | 1}/></div>
                    </div>
                    
                    <div className={'volcaDrumPartParamsDiv' + volcaDrumMonth}>
                        <div className={'volcaDrumPartParamsContainer' + volcaDrumMonth}>
                            <div className={'volcaDrumPartLayerTabStrip' + volcaDrumMonth}>
                                <div className={'volcaDrumpartLayerTab' + currentPatch[currentMidiChannel].layerSelection[0] + volcaDrumMonth}
                                    onClick={() => updateLayerSelection(0)}>
                                    <p>layer 1</p>
                                </div>
                                <div className={'volcaDrumpartLayerTab' + currentPatch[currentMidiChannel].layerSelection[1] + volcaDrumMonth}
                                    onClick={() => updateLayerSelection(1)}>
                                    <p>layer 2</p>
                                </div>
                                <div className={'volcaDrumpartLayerTab' + currentPatch[currentMidiChannel].layerSelection[2] + volcaDrumMonth}
                                    onClick={() => updateLayerSelection(2)}>
                                    <p>layer 1 &amp; 2</p>
                                </div>
                            </div>
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerLevelSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>level</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerLevel(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.level}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerLevel(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.level}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerLevelSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>level</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerLevel(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.level}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerLevel(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.level}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerLevelSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>level</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerLevel(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.level}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerLevel(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.level}/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className={'volcaDrumWaveguideModel' + volcaDrumMonth}>
                        <div className={'volcaDrumWaveguideContainer' + volcaDrumMonth}>
                            <p className={'volcaDrumWaveguideModelLabel' + volcaDrumMonth}>waveguide model</p>
                            <p className={'volcaDrumSoundSourceLabel' + volcaDrumMonth}>sound source</p>
                            <div className={'volcaDrumSoundSourceTabStrip' + volcaDrumMonth}>
                                <div className={'volcaDrumSoundSorceTab' + globalParams.waveGuideModel.soundSource[0] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelSoundSource(0)}>
                                    <p>sine wave</p>
                                </div>
                                <div className={'volcaDrumSoundSorceTab' + globalParams.waveGuideModel.soundSource[1] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelSoundSource(1)}>
                                    <p>sawtooth</p>
                                </div>
                                <div className={'volcaDrumSoundSorceTab' + globalParams.waveGuideModel.soundSource[2] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelSoundSource(2)}>
                                    <p>hpf noise</p>
                                </div>
                                <div className={'volcaDrumSoundSorceTab' + globalParams.waveGuideModel.soundSource[3] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelSoundSource(3)}>
                                    <p>lpf noise</p>
                                </div>
                                <div className={'volcaDrumSoundSorceTab' + globalParams.waveGuideModel.soundSource[4] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelSoundSource(4)}>
                                    <p>bpf noise</p>
                                </div>
                            </div>
                            <p className={'volcaDrumPitchModulatorsLabel' + volcaDrumMonth}>pitch modulators</p>
                            <div className={'volcaDrumPitchModulatorTabStrip' + volcaDrumMonth}>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.pitchModulators[0] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelPitchModulator(0)}>
                                    <p>rise-fall</p>
                                </div>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.pitchModulators[1] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelPitchModulator(1)}>
                                    <p>oscillate</p>
                                </div>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.pitchModulators[2] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelPitchModulator(2)}>
                                    <p>random</p>
                                </div>
                            </div>
                            <p className={'volcaDrumEnvelopeGeneratorsLabel' + volcaDrumMonth}>envelope generators</p>
                            <div className={'volcaDrumEnevelopeGeneratorTabStrip' + volcaDrumMonth}>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.envelopeGenerators[0] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelEnvelopeGenerator(0)}>
                                    <p>linear</p>
                                </div>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.envelopeGenerators[1] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelEnvelopeGenerator(1)}>
                                    <p>exponential</p>
                                </div>
                                <div className={'volcaDrumPitchModulatorTab' + globalParams.waveGuideModel.envelopeGenerators[2] + volcaDrumMonth}
                                    onClick={() => updateWaveguideModelEnvelopeGenerator(2)}>
                                    <p>multi-peak</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={'volcaDrumWaveGuideParams' + volcaDrumMonth}>
                        <div className={'volcaDrumWaveguideParamsContainer' + volcaDrumMonth}>
                            <p className={'volcaDrumWaveGuideLabel' + volcaDrumMonth}>wave guide</p>
                            <p className={'volcaDrumDecayLabel' + volcaDrumMonth}>decay</p>
                            <div className={'volcaDrumDecayInputContainer' + volcaDrumMonth}>
                                <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDecay(e.target.value)}
                                    type="range"
                                    value={globalParams.waveGuide.decay}/>
                            </div>
                            <p className={'volcaDrumBodyLabel' + volcaDrumMonth}>body</p>
                            <div className={'volcaDrumBodyInputContainer' + volcaDrumMonth}>
                                <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateBody(e.target.value)}
                                    type="range"
                                    value={globalParams.waveGuide.body}/>
                            </div>
                            <p className={'volcaDrumTuneLabel' + volcaDrumMonth}>tune</p>
                            <div className={'volcaDrumTuneInputContainer' + volcaDrumMonth}>
                                <input 
                                    className={'volcaDrumWaveGuideTuningSlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateTune(e.target.value)}
                                    type="range"
                                    value={globalParams.waveGuide.tune}/>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        );
}


export default VolcaDrum;
