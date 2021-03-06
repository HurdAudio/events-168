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
import './volcaNubass.style.janb.css';
import './volcaNubass.style.janc.css';
import './volcaNubass.style.feba.css';
import './volcaNubass.style.febb.css';
import './volcaNubass.style.febc.css';
import './volcaNubass.style.mara.css';
import midi5pin from '../img/midi5pin.svg';
import volcaNubassImg1 from '../img/volcaNubassImg1.png';
import axios from 'axios';
import midiConnection from '../midiManager/midiConnection';
import SkinsTable from '../skins/skins';

let connections = null;

function VolcaNubass(user, patch) {
    
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
    let rootNote = 36;
    let keyEngaged = {};
    const skins = SkinsTable('nubassEditor');

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [userMidiPatch, setUserMidiPatch] = useState(null);
    const [panicState, setPanicState] = useState('volcaNubassPanicOff');
    const [currentPatchUuid, setCurrentPatchUuid] = useState(null);
    const [nubassContainerState, setNubassContainerState] = useState('Active');
    const [volcaNubassLoadModalState, setVolcaNubassLoadModalState] = useState('_Inactive');
    const [userPatches, setUserPatches] = useState([]);
    const [loadPatchUuid, setLoadPatchUuid] = useState(null);
    const [currentSpinner, setCurrentSpinner] = useState(skins.nubassEditor.spinner);
    const [volcaNubassEditMonth, setVolcaNubassEditMonth] = useState(skins.nubassEditor.skin);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
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
    
    const [nubassGlobalParams, setNubassGlobalParams] = useState({
        name: 'default',
        pan: 64,
        portamento: false,
        portamentoTime: 0
    });
    const [patchAltered, setPatchAltered] = useState(false);
    const [saveAsDialog, setSaveAsDialog] = useState('Inactive');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('Inactive');
    const [saveAsName, setSaveAsName] = useState('');
    const [aboutVolcaNubassDivState, setAboutVolcaNubassDivState] = useState('Inactive');
    
    const updateNubassState = () => {
        currentOutput.send([0xB0 | currentMidiChannel, 0x28, nubassParameters.pitch]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x29, nubassParameters.saturation]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2A, nubassParameters.level]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2B, nubassParameters.cutoff]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2C, nubassParameters.peak]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2D, nubassParameters.attack]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2E, nubassParameters.decay]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2F, nubassParameters.egInt]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x30, nubassParameters.accent]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x31, nubassParameters.lfoRate]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x32, nubassParameters.lfoInt]);
//        vtoWave
//        lfoWave
//        amplitude
//        pitch
//        cutoff
//        lfoSync
//        sustain
        currentOutput.send([0xB0 | currentMidiChannel, 0x0A, nubassGlobalParams.pan]);
        if (nubassGlobalParams.portamento) {
            currentOutput.send([0xB0 | currentMidiChannel, 0x41, 127]);
        } else {
            currentOutput.send([0xB0 | currentMidiChannel, 0x41, 0]);
        }
        currentOutput.send([0xB0 | currentMidiChannel, 0x05, nubassGlobalParams.portamentoTime]);
    }
    
    const loadModalOn = () => {
        setVolcaNubassLoadModalState('_Active');
        setNubassContainerState('Inactive');
        axios.get(`/volca_nubass_patches/byuser/${user.uuid}`)
        .then(patchesData => {
            const patches = patchesData.data.sort((a, b) => {
                if (a.global_params.name.toLowerCase() > b.global_params.name.toLowerCase()) {
                    return 1;
                } else if (a.global_params.name.toLowerCase() < b.global_params.name.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            });
            setUserPatches(patches);
            let loadUuid = null;
            if (patchesData.data.length > 0) {
                loadUuid = patchesData.data[0].uuid;
            }
            setLoadPatchUuid(loadUuid);
        });
    }
    
    const resetLoadPatchUuid = (val) => {
        setLoadPatchUuid(val);
    }
    
    const cancelPatchLoad = () => {
        setVolcaNubassLoadModalState('_Inactive');
        setNubassContainerState('Active');
    }
    
    const loadSelectedPatch = () => {
        axios.get(`/volca_nubass_patches/patch/${loadPatchUuid}`)
        .then(patchData => {
            const patch = patchData.data;
            setNubassParameters({
                pitch: patch.nubass_parameters.pitch,
                saturation: patch.nubass_parameters.saturation,
                level: patch.nubass_parameters.level,
                cutoff: patch.nubass_parameters.cutoff,
                peak: patch.nubass_parameters.peak,
                attack: patch.nubass_parameters.attack,
                decay: patch.nubass_parameters.decay,
                egInt: patch.nubass_parameters.egInt,
                accent: patch.nubass_parameters.accent,
                lfoRate: patch.nubass_parameters.lfoRate,
                lfoInt: patch.nubass_parameters.lfoInt
            });
            setNubassFaceplateParams({
                vtoWave: patch.nubass_faceplate_params.vtoWave,
                lfoWave: patch.nubass_faceplate_params.lfoWave,
                amplitude: patch.nubass_faceplate_params.amplitude,
                pitch: patch.nubass_faceplate_params.pitch,
                cutoff: patch.nubass_faceplate_params.cutoff,
                lfoSync: patch.nubass_faceplate_params.lfoSync,
                sustain: patch.nubass_faceplate_params.sustain
            });
            setNubassGlobalParams({
                name: patch.global_params.name,
                pan: patch.global_params.pan,
                portamento: patch.global_params.portamento,
                portamentoTime: patch.global_params.portamentoTime
            });
            updateNubassState();
            setCurrentPatchUuid(loadPatchUuid);
            setPatchAltered(false);
            cancelPatchLoad();
        });
    }
    
    const submitSaveAsDialog = (val) => {
        
        if (val === '') {
            return;
        } else {
            const patch = {
            user_uuid: user.uuid,
            nubass_parameters: nubassParameters,
            nubass_faceplate_params: nubassFaceplateParams,
            global_params: nubassGlobalParams
            }
            patch.global_params.name = val;
            axios.post(`/volca_nubass_patches/patch`, patch)
            .then(() => {
                setSaveAsDialogStatus('Inactive'); 
                setNubassContainerState('Active');
            });
        }
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsDialogStatus('Inactive'); 
        setNubassContainerState('Active');
    }
    
    const updateChangeAsName = (val) => {
        setSaveAsName(val);
    }
    
    const openVolcaNubassAboutDiv = () => {
        setNubassContainerState('Inactive');
        setAboutVolcaNubassDivState('Active');
    }
    
    const closeVolcaNubassAboutDiv = () => {
        setNubassContainerState('Active');
        setAboutVolcaNubassDivState('Inactive');
    }
    
    const initPatch = () => {
        setPatchAltered(true);
        setNubassParameters({
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
        setPatchAltered(true);
        updateNubassState();
    }
    
    const makeRandomPatch = () => {
        setNubassParameters({
            pitch: Math.floor(Math.random() * 128),
            saturation: Math.floor(Math.random() * 128),
            level: Math.floor(Math.random() * 128),
            cutoff: Math.floor(Math.random() * 128),
            peak: Math.floor(Math.random() * 128),
            attack: Math.floor(Math.random() * 128),
            decay: Math.floor(Math.random() * 128),
            egInt: Math.floor(Math.random() * 128),
            accent: Math.floor(Math.random() * 128),
            lfoRate: Math.floor(Math.random() * 128),
            lfoInt: Math.floor(Math.random() * 128) 
        });
        setPatchAltered(true);
        updateNubassState();
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
    
    const revertPatch = () => {
        if (currentPatchUuid !== null) {
            axios.get(`/volca_nubass_patches/patch/${currentPatchUuid}`)
            .then(patchData => {
                const patch = patchData.data;
                setNubassParameters({
                    pitch: patch.nubass_parameters.pitch,
                    saturation: patch.nubass_parameters.saturation,
                    level: patch.nubass_parameters.level,
                    cutoff: patch.nubass_parameters.cutoff,
                    peak: patch.nubass_parameters.peak,
                    attack: patch.nubass_parameters.attack,
                    decay: patch.nubass_parameters.decay,
                    egInt: patch.nubass_parameters.egInt,
                    accent: patch.nubass_parameters.accent,
                    lfoRate: patch.nubass_parameters.lfoRate,
                    lfoInt: patch.nubass_parameters.lfoInt
                });
                setNubassFaceplateParams({
                    vtoWave: patch.nubass_faceplate_params.vtoWave,
                    lfoWave: patch.nubass_faceplate_params.lfoWave,
                    amplitude: patch.nubass_faceplate_params.amplitude,
                    pitch: patch.nubass_faceplate_params.pitch,
                    cutoff: patch.nubass_faceplate_params.cutoff,
                    lfoSync: patch.nubass_faceplate_params.lfoSync,
                    sustain: patch.nubass_faceplate_params.sustain
                });
                setNubassGlobalParams({
                    name: patch.global_params.name,
                    pan: patch.global_params.pan,
                    portamento: patch.global_params.portamento,
                    portamentoTime: patch.global_params.portamentoTime
                });
                updateNubassState();
                setCurrentPatchUuid(loadPatchUuid);
                setPatchAltered(false);
            });
        }
    }
    
    const executeSaveAsDialog = () => {
        setSaveAsDialogStatus('Active');
        setNubassContainerState('Inactive');
        document.getElementById('saveAsInput').focus();
    }
    
    const savePatch = () => {
        const patch = {
            user_uuid: user.uuid,
            nubass_parameters: nubassParameters,
            nubass_faceplate_params: nubassFaceplateParams,
            global_params: nubassGlobalParams
        }
        
        if (currentPatchUuid === null) {
            axios.post(`/volca_nubass_patches/patch`, patch)
            .then(responseData => {
                setCurrentPatchUuid(responseData.data.uuid);
                setPatchAltered(false);
            });
        } else {
            axios.patch(`/volca_nubass_patches/patch/${currentPatchUuid}`, patch)
            .then(() => {
                setPatchAltered(false);
            });
        }
    }
    
    const patchNameUpdate = (val) => {
        let deepCopy = {...nubassGlobalParams};
        
        deepCopy.name = val;
        
        setNubassGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updatePortamentoTime = (val) => {
        let deepCopy = {...nubassGlobalParams};
        
        deepCopy.portamentoTime = val;
        
        setNubassGlobalParams(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x05, val]);
    }
    
    const togglePortamento = () => {
        let deepCopy = {...nubassGlobalParams};
        
        deepCopy.portamento = !deepCopy.portamento;
        
        setNubassGlobalParams(deepCopy);
        setPatchAltered(true);
        if (deepCopy.portamento) {
            currentOutput.send([0xB0 | currentMidiChannel, 0x41, 127]);
        } else {
            currentOutput.send([0xB0 | currentMidiChannel, 0x41, 0]);
        }
    }
    
    const updatePan = (val) => {
        let deepCopy = {...nubassGlobalParams};
        
        deepCopy.pan = val;
        
        setNubassGlobalParams(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0A, val]);
    }
    
    const toggleVtoWave = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.vtoWave = !deepCopy.vtoWave;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const toggleLfoWave = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.lfoWave = !deepCopy.lfoWave;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const toggleAmplitude = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.amplitude = !deepCopy.amplitude;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const togglePitch = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.pitch = !deepCopy.pitch;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const toggleCutoff = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.cutoff = !deepCopy.cutoff;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const toggleLfoSync = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.lfoSync = !deepCopy.lfoSync;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const toggleSustain = () => {
        let deepCopy = {...nubassFaceplateParams};
        
        deepCopy.sustain = !deepCopy.sustain;
        
        setNubassFaceplateParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updatePitchValue = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.pitch = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x28, val]);
    }
    
    const updateSaturation = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.saturation = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x29, val]);
    }
    
    const updateLevelValue = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.level = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2A, val]);
    }
    
    const updateCutoff = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.cutoff = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2B, val]);
    }
    
    const updatePeak = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.peak = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2C, val]);
    }
    
    const updateAttack = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.attack = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2D, val]);
    }
    
    const updateDecay = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.decay = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2E, val]);
    }
    
    const updateEgInt = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.egInt = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x2F, val]);
    }
    
    const updateAccent = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.accent = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x30, val]);
    }
    
    const updateLfoRate = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.lfoRate = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x31, val]);
    }
    
    const updateLfoInt = (val) => {
        let deepCopy = {...nubassParameters};
        
        deepCopy.lfoInt = val;
        
        setNubassParameters(deepCopy);
        setPatchAltered(true);
        currentOutput.send([0xB0 | currentMidiChannel, 0x32, val]);
    }

    const noteOnEvent = (key) => {
//        let index = 0;
//        for (let i = 0; i < outputs.length; i++) {
//            if (outputs[i].id === currentOutput.id) {
//                index = i;
//            }
//        }
        if (connections === null) {
            let indexOut = null;
            if (user.midi_connections) {
                connections = user.midi_connections;
                setMidiConnections(connections);
                setCurrentOutput(connections.currentOutput);
                setCurrentMidiChannel(connections.currentMidiChannel);
                for (let i = 0; i < connections.outputs.length; i++) {
                    connections.outputs[i].label = connections.outputs[i].name;
                }
                setAvailableOutputs(connections.outputs);
                setAvailableInputs(connections.inputs);
                if (user.midi_patch) {
                    axios.get(`/midi_manager_patches/patch/${user.midi_patch}`)
                    .then(midiPatchData => {
                        const midiPatch = midiPatchData.data.user_preset.outputs;
                        let outputsArr = [];
                        for (let i = 0; i < user.midi_connections.outputs.length; i++) {
                            outputsArr[i] = {...midiPatch[i]};
                            connections.outputs[i].label = midiPatch[i].label;
                        }
                        
                        
                        let volcaFmsList = midiPatch.filter(entry => {
                            return(entry.deviceUuid === 'e3bfacf5-499a-4247-b512-2c4bd15861ad')
                        });
                        for (let j = 0; j < midiPatch.lenth; j++) {
                           if (indexOut === null) {
                               if (midiPatch[j].deviceUuid === 'bda73d0e-c18c-472e-add6-1e1a4f123949') {
                                   indexOut = j;
                               }
                           }
                        }
                        if (indexOut === null) {
                            indexOut = 0;
                        }
                        setTimeout(() => {
                            setUserMidiPatch(outputsArr);
                            setAvailableOutputs(connections.outputs);
                            setCurrentOutput(connections.outputs[indexOut]);
                        }, 250);
                    });
                }
            } else {
                navigator.requestMIDIAccess({ sysex: true })
                .then((midiAccess) => {               
                    connections = midiConnection(midiAccess);
                    setMidiConnections(connections);
                    setCurrentOutput(connections.currentOutput);
                    setCurrentMidiChannel(connections.currentMidiChannel);
                    setAvailableOutputs(connections.outputs);
                    setAvailableInputs(connections.inputs);
                    return;
                }, () => {
                    alert('No MIDI ports accessible');
                });
            }
            return;
        }
//        if (midiConnections === undefined) {
//            navigator.requestMIDIAccess({ sysex: true })
//            .then((midiAccess) => {               
//                connections = midiConnection(midiAccess);
//                setMidiConnections(connections);
//                console.log(connections);
//                setCurrentOutput(connections.currentOutput);
//                setCurrentMidiChannel(connections.currentMidiChannel);
//                setAvailableOutputs(connections.outputs);
//                setAvailableInputs(connections.inputs);
//                return;
//            }, () => {
//                alert('No MIDI ports accessible');
//            });
//        }
        switch (key.toLowerCase()) {
            case ('q'):
                if (!keyEngaged.q) {
                    keyEngaged.q = true;
                    currentOutput.send([0x90 | currentMidiChannel, rootNote, 0x7f]);
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
        setPanicState('volcaNubassPanicOn');
        setNubassContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('volcaNubassPanicOff');
            setNubassContainerState('Active');
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

//    initiateMidiAccess();
    
    return (
        <div>
            <div className={'volcaNubassEditorContainer' + nubassContainerState + volcaNubassEditMonth}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'volcaNubassEditorImageDiv' + volcaNubassEditMonth}>
                    <div className={'volcaNubassEditorTopBar' + volcaNubassEditMonth}>
                        <NavLink to="/"><img className={'volcaNubassNavImage' + volcaNubassEditMonth}
                            src={midiImage}></img></NavLink>
                    </div>
                    <h3 className={'volcaNubassEditorTitle' + volcaNubassEditMonth}>Volca Nubass Editor</h3>
                    <button className={'volcaNubassLoadButton' + volcaNubassEditMonth}
                        onClick={() => loadModalOn()}>load</button>
                    <input className={'patchNameInput' + volcaNubassEditMonth}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={nubassGlobalParams.name}/>
                    <button className={'volcaNubassPanicButton' + volcaNubassEditMonth}
                        onClick={() => panic()}>panic!</button>
                    <div className={'volcaNubassSidebarManager' + volcaNubassEditMonth}>
                        <div className={'sidebarContainer' + volcaNubassEditMonth}>
                            <img className={'nubassImage1' + volcaNubassEditMonth}
                                src={volcaNubassImg1} />
                            <button className={'saveVolcaNubassButton' + patchAltered + volcaNubassEditMonth}
                                onClick={() => savePatch()}>save</button>
                            <button className={'saveAsVolcaNubassButton' + volcaNubassEditMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'revertButtonVolcaNubass' + patchAltered + volcaNubassEditMonth}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'midiOutputVolcaNubassLabel' + volcaNubassEditMonth}>midi output:</p>
                            <select className={'midiOutputVolcaNubassSelect' + volcaNubassEditMonth}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.label}</option>))}
                            </select>
                            <p className={'midiChannelVolcaNubassLabel' + volcaNubassEditMonth}>channel:</p>
                            <input className={'midiChannelVolcaNubassInput' + volcaNubassEditMonth}
                                max="15"
                                min="0"
                                onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                step="1"
                                type="number"
                                value={currentMidiChannel}/>
                            
                            <button className={'initVolcaNubassButton' + volcaNubassEditMonth}
                                onClick={() => initPatch()}>init</button>
                            <button className={'randomVolcaNubassButton' + volcaNubassEditMonth}
                                onClick={() => makeRandomPatch()}>random</button>
                            <button className={'aboutNubassButton' + volcaNubassEditMonth}
                                onClick={() => openVolcaNubassAboutDiv()}>about</button>
                        </div>
                    </div>
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
                    <div className={'volcaNubassGlobalsEditFace' + volcaNubassEditMonth}>
                        <div className={'volcaNubassGlobalsContainer' + volcaNubassEditMonth}>
                            <p className={'volcaNubassPanLabel' + volcaNubassEditMonth}>pan</p>
                            <div className={'volcaNubassGlobalsLeverContainer' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever2' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePan(e.target.value)}
                                    type="range"
                                    value={nubassGlobalParams.pan} />
                            </div>
                            <p className={'volcaNubassPortamentoOnOffLabel' + volcaNubassEditMonth}>portamento</p>
                            <div className={'volcaNubassPortamentoOnOffSwitchDiv' + volcaNubassEditMonth}
                                onClick={() => togglePortamento()}>
                                <p>off</p>
                                <p>on</p>
                                <div className={'portamentoSwitch' + nubassGlobalParams.portamento + volcaNubassEditMonth}></div>
                            </div>
                            <p className={'volcaNubassPortomentoTimeLabel' + volcaNubassEditMonth}>portamento time</p>
                            <div className={'volcaNubassGlobalsLeverContainerPort' + volcaNubassEditMonth}>
                                <input 
                                    className={'volcaNubassOscLever2' + volcaNubassEditMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePortamentoTime(e.target.value)}
                                    type="range"
                                    value={nubassGlobalParams.portamentoTime} />
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
            <div className={'saveAsDialogVolcaNubassDiv' + saveAsDialogStatus + volcaNubassEditMonth}>
                <p>save as</p>
                <input className={'saveAsInputVolcaNubass' + volcaNubassEditMonth}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + nubassGlobalParams.name}
                    value={saveAsName} />
                <div className={'saveAsButtonsVolcaNubassDiv' + volcaNubassEditMonth}>
                    <button className={'saveAsButtonsVolcaNubass' + volcaNubassEditMonth}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'saveAsButtonsVolcaNubass' + volcaNubassEditMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheKorgVolcaNubassDiv' + aboutVolcaNubassDivState + volcaNubassEditMonth}>
                <div className={'aboutTheKorgVolcaNubassContent' + volcaNubassEditMonth}>
                    <img className={'volcaAboutVolcaNubassImg' + volcaNubassEditMonth}
                        src={volcaNubassImg1} />
                    <h2>Korg Volca Nubass</h2>
                    <p>The volca nubass is the first analog synth to be equipped with a Nutube new-generation vacuum tube in its oscillator circuit. By incorporating a vacuum tube, nubass produces a warm, thick, and rich sound, unlike any digital or transistor-based synthesizer. The familiar transistor ladder filter along with overdrive, and huge-sounding distortion, gives it the unmistakable character of a classic bass machine. Coupled with an LFO with flexible routing and sync, nubass also provides numerous possibilities for a new generation of music.</p>
                    <h2>A vacuum tube oscillator circuit forms the heart of volca nubass, utilizing groundbreaking Nutube technology</h2>
                    <p>The Nutube is equipped with two vacuum tubes; one is used in the oscillator to generate a sawtooth wave or square wave. The other vacuum tube is used in the drive circuit of the sub oscillator, adding depth and warmth one octave below the oscillator. This oscillator and sub oscillator provide a circuit structure that brings out the harmonic character that only a real vacuum tube could provide.</p>
                    <h2>A transistor ladder low-pass filter that produces a distinctive sound</h2>
                    <p>The low-pass filter defines the sound of this bass machine; it uses a transistor ladder design found on classic analog bass synths. This filter is uniquely dynamic in the way it affects a sound more than just ranging from bright-to-dark. Its wide range of timbral possibilities makes it ideal for a broad variety of dance music; you can use it to create the distinctive modulation that can be heard in acid house, or increase the resonance to bring out a sharp character that's appropriate for techno.</p>
                    <h2>Analog driver circuit</h2>
                    <p>nubass is equipped with overdrive that uses an analog circuit reminiscent of a classic stompbox. Turning the knob toward the right compresses the volume while causing mild distortion, adding thickness to your bass sounds. The tone knob also lets you adjust the crispness of the high-frequency range.</p>
                </div>
                <div className={'saveAsButtonsVolcaNubassDiv' + volcaNubassEditMonth}>
                    <button className={'saveAsButtonsVolcaNubass' + volcaNubassEditMonth}
                        onClick={() => closeVolcaNubassAboutDiv()}>close</button>
                </div>
            </div>
            <div className={panicState + volcaNubassEditMonth}>
                <img src={currentSpinner} />
            </div>
            <div className={'volcaNubassLoadModal' + volcaNubassLoadModalState + volcaNubassEditMonth}>
                <div className={'volcaNubassLoadContainer' + volcaNubassEditMonth}>
                    <p className={'volcaNubassLoadTitle' + volcaNubassEditMonth}>Load Volca Nubass Patch</p>
                    <select className={'volcaNubassLoadSelector' + volcaNubassEditMonth}
                        onChange={(e) => {resetLoadPatchUuid(e.target.value)}}
                        value={loadPatchUuid}>
                        {userPatches.map(patch => (
                                <option key={patch.uuid} value={patch.uuid}>{patch.global_params.name}</option>))}
                    </select>
                    <button className={'volcaNubassLoadLoadButton' + volcaNubassEditMonth}
                        onClick={() => loadSelectedPatch()}>load</button>
                    <button className={'volcaNubassLoadCancelButton' + volcaNubassEditMonth}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
        </div>
        );
}


export default VolcaNubass;
