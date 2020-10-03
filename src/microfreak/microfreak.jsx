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
import './microfreak.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import axios from 'axios';
import midiConnection from '../midiManager/midiConnection';
import SkinsTable from '../skins/skins';

let connections = null;

function Microfreak(user, patch) {
    
    let keyEngaged = {};
    let rootNote = 60;
    
    const [microfreakContainerState, setMicrofreakContainerState] = useState('_Active');
    const [microfreakMonth, setMicrofreakMonth] = useState('_JanuaryA');
    const [midiConnections, setMidiConnections] = useState(undefined);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [userMidiPatch, setUserMidiPatch] = useState(null);
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [globalParams, setGlobalParams] = useState({
        name: 'default'
    });
    const [patchParams, setPatchParams] = useState({
        analogFilter: {
            cutoff: 0,
            filterType: 'lpf',
            resonance: 0
        },
        arpeggiator: {
            hold: false,
            oct: 1,
            on: false,
            pattern: 'up',
            rate: 0,
            sync: false,
        },
        cyclingEnvelope: {
            amount: 0,
            fall: 0,
            fallShape: 0,
            holdSustain: 0,
            mode: 'env',
            rise: 0,
            riseShape: 0
        },
        digitalOscillator: {
            shape: 0,
            shapeName: 'sub',
            timbre: 0,
            timbreName: 'sym',
            type: 0,
            typeName: 'basic waves',
            wave: 0,
            waveName: 'morph'
        },
        envelopeGenerator: {
            ampMod: false,
            attack: 0,
            decayRelease: 0,
            filterAmount: 0,
            sustain: 0
        },
        glide: {
            glide: 0
        },
        lfo: {
            rate: 0,
            shape: 'sine',
            sync: false
        },
        paraphonic: false,
        spice: {
            dice: false,
            spice: true
        }
    });
    
    const [envelopeTabs, setEnvelopeTabs] = useState({
        cyclingEnvelope: false,
        envelopeGenerator: true
    });
    
    const updateParaphonicState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.paraphonic = !deepCopy.paraphonic;
        
        setPatchParams(deepCopy);
    }
    
    const updateSpiceDiceState = () => {
        if (!patchParams.arpeggiator.on) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.spice.dice = !deepCopy.spice.dice;
        if (deepCopy.spice.dice) {
            deepCopy.spice.spice = false;
        }
        
        setPatchParams(deepCopy);
    }
    
    const updateSpiceSpiceState = () => {
        if (!patchParams.arpeggiator.on) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.spice.spice = !deepCopy.spice.spice;
        if (deepCopy.spice.spice) {
            deepCopy.spice.dice = false;
        }
        
        setPatchParams(deepCopy);
    }
    
    const updateArpeggiatorPattern = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.pattern = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateArpeggiateOct = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.oct = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateLFORateValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.lfo.rate = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateArpeggiateSyncState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.sync = !deepCopy.arpeggiator.sync;
        
        setPatchParams(deepCopy);
    }
    
    const updateArpeggiateOnState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.on = !deepCopy.arpeggiator.on;
        
        setPatchParams(deepCopy);
    }
    
    const updateArpeggiateHoldState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.hold = !deepCopy.arpeggiator.hold;
        
        setPatchParams(deepCopy);
    }
    
    const updateLFOSyncState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.lfo.sync = !deepCopy.lfo.sync;
        
        setPatchParams(deepCopy);
    }
    
    const updateARPRateValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.rate = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeAmountValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.amount = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeHoldSustainValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.holdSustain = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeFallShapeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.fallShape = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeFallValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.fall = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeRiseShapeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.riseShape = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeRiseValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.rise = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateLFOShapeState = (val) => {
        if (patchParams.lfo.shape === val) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.lfo.shape = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateCyclingEnvelopeModeState = (val) => {
        if (patchParams.cyclingEnvelope.mode === val) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.mode = val;
        
        setPatchParams(deepCopy);
    }
    
    const calculateCycingEnvelopeHoldSustainDisplay = (val) => {
        const milliseconds = ((10000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    const calculateCycingEnvelopeFallDisplay = (val) => {
        const milliseconds = ((10000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    const calculateEGAttackDisplay = (val) => {
        const milliseconds = ((10000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    const calculateLFORateDisplay = (val) => {
        if (patchParams.lfo.sync) {
            if (val < 10) {
                return '8/1';
            } else if (val < 20) {
                return '4/1';
            } else if (val < 29) {
                return '2/1';
            } else if (val < 39) {
                return '1/1';
            } else if (val < 49) {
                return '1/2';
            } else if (val < 59) {
                return '1/2T';
            } else if (val < 68) {
                return '1/4';
            } else if (val < 78) {
                return '1/4T';
            } else if (val < 88) {
                return '1/8';
            } else if (val < 98) {
                return '1/8T';
            } else if (val < 107) {
                return '1/16';
            } else if (val < 117) {
                return '1/16T';
            } else {
                return '1/32';
            }
        } else {
            return((Math.round((val/127) * 994) + 6) / 10).toFixed(2).toString() + 'Hz';
        }
    }
    
    const calculateEGDecayReleaseDisplay = (val) => {
        const milliseconds = ((25000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    const calculateARPRateDisplay = (val) => {
        if (patchParams.arpeggiator.sync) {
            if (val < 12) {
                return '1/1';
            } else if (val < 23) {
                return '1/2';
            } else if (val < 35) {
                return '1/2T';
            } else if (val < 46) {
                return '1/4';
            } else if (val < 58) {
                return '1/4T';
            } else if (val < 69) {
                return '1/8';
            } else if (val < 81) {
                return '1/8T';
            } else if (val < 92) {
                return '1/16';
            } else if (val < 104) {
                return '1/16T';
            } else if (val < 115) {
                return '1/32';
            } else {
                return '1/32T';
            }
        } else {
            return((Math.round(val/127 * 2100) + 300) / 10).toFixed(1).toString() + ' bpm';
        }
    }
    
    const calculateCycingEnvelopeAmountDisplay = (val) => {
        return (Math.round((val/127) * 100).toString() + '%');
    }
    
    const calculateCycingEnvelopeFallShapeDisplay = (val) => {
        return (Math.round((val/127) * 100).toString() + '%');
    }
    
    const calculateCycingEnvelopeRiseShapeDisplay = (val) => {
        return (Math.round((val/127) * 100).toString() + '%');
    }
    
    const calculateEGSustainDisplay = (val) => {
        return (Math.round((val/127) * 100).toString() + '%');
    }
    
    const calculateEGFilterAmountDisplay = (val) => {
        return (Math.round((val/127) * 200) - 100).toString();
    }
    
    const updateEnvelopeGeneratorAttackValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.attack = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateEnvelopeGeneratorDecayReleaseValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.decayRelease = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateEnvelopeGeneratorSustainValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.sustain = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateEnvelopeGeneratorFilterAmountValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.filterAmount = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateAmplitudeModulationState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.ampMod = !deepCopy.envelopeGenerator.ampMod;
        
        setPatchParams(deepCopy);
    }
    
    const envelopeTabUpdate = (val) => {
        if ((val === 'eg') && envelopeTabs.envelopeGenerator) {
            return;
        }
        if ((val === 'ce') && envelopeTabs.cyclingEnvelope) {
            return;
        }
        let deepCopy = {...envelopeTabs};
        
        if (val === 'eg') {
            deepCopy.cyclingEnvelope = false;
            deepCopy.envelopeGenerator = true;
        } else {
            deepCopy.cyclingEnvelope = true;
            deepCopy.envelopeGenerator = false;
        }
        
        setEnvelopeTabs(deepCopy);
    }
    
    const updatePatch = (parameter, val) => { 
                
        switch(parameter) {
            case('glide'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x05, val]);
                break;
            case('oscType'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x09, val]);
                break;
            case('wave'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x0A, val]);
                break;
            case('timbre'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x0C, val]);
                break;
            case('shape'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x0D, val]);
                break;
            default:
                console.log('error - unsupported parameter');
        }
    }
    
    const patchNameUpdate = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.name = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updateGlideValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.glide.glide = val;
        
        setPatchParams(deepCopy);
        updatePatch('glide', val);
    }
    
    const updateDigitalOscillatorTypeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.digitalOscillator.type = val;
        if (val < 16) {
            deepCopy.digitalOscillator.typeName = 'basic waves';
            deepCopy.digitalOscillator.waveName = 'morph';
            deepCopy.digitalOscillator.timbreName = 'sym';
            deepCopy.digitalOscillator.shapeName = 'sub';
        } else if (val < 27) {
            deepCopy.digitalOscillator.typeName = 'super wave';
            deepCopy.digitalOscillator.waveName = 'wave';
            deepCopy.digitalOscillator.timbreName = 'detune';
            deepCopy.digitalOscillator.shapeName = 'volume';
        } else if (val < 38) {
            deepCopy.digitalOscillator.typeName = 'wave table';
            deepCopy.digitalOscillator.waveName = 'table';
            deepCopy.digitalOscillator.timbreName = 'position';
            deepCopy.digitalOscillator.shapeName = 'chorus';
        } else if (val < 48) {
            deepCopy.digitalOscillator.typeName = 'harmonic osc';
            deepCopy.digitalOscillator.waveName = 'content';
            deepCopy.digitalOscillator.timbreName = 'sculpting';
            deepCopy.digitalOscillator.shapeName = 'chorus';
        } else if (val < 59) {
            deepCopy.digitalOscillator.typeName = 'karplus-strong';
            deepCopy.digitalOscillator.waveName = 'bow';
            deepCopy.digitalOscillator.timbreName = 'position';
            deepCopy.digitalOscillator.shapeName = 'decay';
        } else if (val < 69) {
            deepCopy.digitalOscillator.typeName = 'virtual analog';
            deepCopy.digitalOscillator.waveName = 'detune';
            deepCopy.digitalOscillator.timbreName = 'shape';
            deepCopy.digitalOscillator.shapeName = 'wave';
        } else if (val < 80) {
            deepCopy.digitalOscillator.typeName = 'waveshaper';
            deepCopy.digitalOscillator.waveName = 'wave';
            deepCopy.digitalOscillator.timbreName = 'amount';
            deepCopy.digitalOscillator.shapeName = 'asym';
        } else if (val < 90) {
            deepCopy.digitalOscillator.typeName = 'two-operator FM';
            deepCopy.digitalOscillator.waveName = 'ratio';
            deepCopy.digitalOscillator.timbreName = 'amount';
            deepCopy.digitalOscillator.shapeName = 'shape';
        } else if (val < 101) {
            deepCopy.digitalOscillator.typeName = 'formant';
            deepCopy.digitalOscillator.waveName = 'interval';
            deepCopy.digitalOscillator.timbreName = 'formant';
            deepCopy.digitalOscillator.shapeName = 'shape';
        } else if (val < 112) {
            deepCopy.digitalOscillator.typeName = 'chords';
            deepCopy.digitalOscillator.waveName = 'type';
            deepCopy.digitalOscillator.timbreName = 'inv/transp';
            deepCopy.digitalOscillator.shapeName = 'waveform';
        } else if (val < 122) {
            deepCopy.digitalOscillator.typeName = 'speech';
            deepCopy.digitalOscillator.waveName = 'type';
            deepCopy.digitalOscillator.timbreName = 'timbre';
            deepCopy.digitalOscillator.shapeName = 'word';
        } else {
            deepCopy.digitalOscillator.typeName = 'modal';
            deepCopy.digitalOscillator.waveName = 'inharm';
            deepCopy.digitalOscillator.timbreName = 'timbre';
            deepCopy.digitalOscillator.shapeName = 'decay';
        }
        
        setPatchParams(deepCopy);
        updatePatch('oscType', val);
    }
    
    const updateDigitalOscillatorWaveValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.digitalOscillator.wave = val;
        
        setPatchParams(deepCopy);
        updatePatch('wave', val);
    }
    
    const calculateDOWaveDisplay = (val) => {
        if (patchParams.digitalOscillator.type < 16) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 27) {
            if (val < 32) {
                return 'saw';
            } else if (val < 64) {
                return 'square';
            } else if (val < 96) {
                return 'triangle';
            } else {
                return 'sinus';
            }
        } else if (patchParams.digitalOscillator.type < 38) {
            return (Math.floor(val/8) + 1).toString();
        } else if (patchParams.digitalOscillator.type < 48) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 59) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 69) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 80) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 90) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 101) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else if (patchParams.digitalOscillator.type < 112) {
            if (val < 10) {
                return 'oct';
            } else if (val < 22) {
                return '5';
            } else if (val < 35) {
                return 'sus4';
            } else if (val < 47) {
                return 'm';
            } else if (val < 60) {
                return 'm7';
            } else if (val < 72) {
                return 'm9';
            } else if (val < 85) {
                return 'm11';
            } else if (val < 97) {
                return '69';
            } else if (val < 109) {
                return 'M9';
            } else if (val < 122) {
                return 'M7';
            } else {
                return 'M';
            }
        } else if (patchParams.digitalOscillator.type < 122) {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        } else {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        }
        
        return '';
    }
    
    const updateDigitalOscillatorTimbreValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.digitalOscillator.timbre = val;
        
        setPatchParams(deepCopy);
        updatePatch('timbre', val);
    }
    
    const calculateDOShapeDisplay = (val) => {
        return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
    }
    
    const calculateResonanceDisplay = (val) => {
        return (Math.round((val/127) * 100).toString() + '%');
    }
    
    const calculateDOTimbreDisplay = (val) => {
        if (patchParams.digitalOscillator.type < 16) {
            return(Math.floor((46/128) * val) + 50).toString();
        } else {
            return((Math.round((val/127) * 1000) / 10).toFixed(1).toString());
        }
        
        return '';
    }
    
    const updateDigitalOscillatorShapeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.digitalOscillator.shape = val;
        
        setPatchParams(deepCopy);
        updatePatch('shape', val);
    }
    
    const setFilterType = (type) => {
        if (patchParams.analogFilter.filterType === type) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.analogFilter.filterType = type;
        setPatchParams(deepCopy);
        
    }
    
    const updateAnalogFilterCutoffValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.analogFilter.cutoff = val;
        
        setPatchParams(deepCopy);
    }
    
    const updateAnalogFilterResonanceValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.analogFilter.resonance = val;
        
        setPatchParams(deepCopy);
    }
    
    const calculateCutoffDisplay = (val) => {
        return((Math.floor(((109/127) * val) + 160)/10).toFixed(1).toString() + 'Hz');
    }
    
    const panic = () => {
        console.log('panic');
    }
    
    const noteOnEvent = (key) => {
        console.log(user);
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
                        setUserMidiPatch(outputsArr);
                        setAvailableOutputs(connections.outputs);
                        let volcaFmsList = midiPatch.filter(entry => {
                            return(entry.deviceUuid === 'e3bfacf5-499a-4247-b512-2c4bd15861ad')
                        });
                        for (let j = 0; j < midiPatch.lenth; j++) {
                           if (indexOut === null) {
                               if (midiPatch[j].deviceUuid === 'e3bfacf5-499a-4247-b512-2c4bd15861ad') {
                                   indexOut = j;
                               }
                           }
                        }
                        if (indexOut === null) {
                            indexOut = 0;
                        }
                        setCurrentOutput(connections.outputs[indexOut]);
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
    
    const calculateGlideTime = (val) => {
        const milliseconds = ((10000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    const calculateCycingEnvelopeRiseDisplay = (val) => {
        const milliseconds = ((10000/127) * val);
        
        if (milliseconds < 1000) {
            return(Math.round(milliseconds).toString() + 'ms');
        } else {
            return((milliseconds/1000).toFixed(2).toString() + 's');
        }
    }
    
    return ( 
        <div>
            <div className={'microfreakEditorContainer' + microfreakContainerState + microfreakMonth}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'microfreakEditorImageDiv' + microfreakMonth}>
                    <div className={'microfreakEditorTopBar' + microfreakMonth}>
                        <NavLink to="/"><img className={'microfreakNavImage' + microfreakMonth}
                            src={midiImage}></img></NavLink>
                    </div>
                    <h3 className={'microfreakEditorTitle' + microfreakMonth}>Microfreak Editor</h3>
                    <button className={'microfreakLoadButton' + microfreakMonth}>load</button>
                    <input className={'microfreakPatchNameInput' + microfreakMonth}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'microfreakPanicButton' + microfreakMonth}
                        onClick={() => panic()}>panic!</button>
                    <div className={'microfreakSidebarManager' + microfreakMonth}></div>
                    <div className={'microfreakGlideControl' + microfreakMonth}>
                        <p className={'microfreakGlideLabel' + microfreakMonth}>glide</p>
                        <p className={'microfreakGlideDisplayInput' + microfreakMonth}>{calculateGlideTime(patchParams.glide.glide)}</p>
                        <input className={'microfreakGlideRangeInput' + microfreakMonth} 
                            max="127"
                            min="0"
                            onChange={(e) => updateGlideValue(e.target.value)}
                            type="range"
                            value={patchParams.glide.glide}/>
                    </div>
                    <div className={'microfreakDigitalOscillatorDiv' + microfreakMonth}>
                        <p className={'microfreakDigitalOscillatorLabel' + microfreakMonth}>digital oscillator</p>
                        <p className={'microfreakDigitalOscilatorTypeLabel' + microfreakMonth}>type</p>
                        <p className={'microfreakWaveTypeDisplay' + microfreakMonth}> 
                            {patchParams.digitalOscillator.typeName}</p>
                        <div className={'microfreakOscillatorTypeInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                            max="127"
                            min="0"
                            onChange={(e) => updateDigitalOscillatorTypeValue(e.target.value)}
                            type="range"
                            value={patchParams.digitalOscillator.type} />
                        </div>
                        <p className={'microfreakDigitalOscilatorWaveLabel' + microfreakMonth}>
                            {patchParams.digitalOscillator.waveName}</p>
                        <p className={'microfreakWaveWaveDisplay' + microfreakMonth}>{calculateDOWaveDisplay(patchParams.digitalOscillator.wave)}</p>
                        <div className={'microfreakOscillatorWaveInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                            max="127"
                            min="0"
                            onChange={(e) => updateDigitalOscillatorWaveValue(e.target.value)}
                            type="range"
                            value={patchParams.digitalOscillator.wave} />
                        </div>
                        <p className={'microfreakDigitalOscilatorTimbreLabel' + microfreakMonth}>
                            {patchParams.digitalOscillator.timbreName}</p>
                        <p className={'microfreakWaveTimbreDisplay' + microfreakMonth}>{calculateDOTimbreDisplay(patchParams.digitalOscillator.timbre)}</p>
                        <div className={'microfreakOscillatorTimbreInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                            max="127"
                            min="0"
                            onChange={(e) => updateDigitalOscillatorTimbreValue(e.target.value)}
                            type="range"
                            value={patchParams.digitalOscillator.timbre} />
                        </div>
                        <p className={'microfreakDigitalOscilatorShapeLabel' + microfreakMonth}>
                            {patchParams.digitalOscillator.shapeName}</p>
                        <p className={'microfreakWaveShapeDisplay' + microfreakMonth}>{calculateDOShapeDisplay(patchParams.digitalOscillator.shape)}</p>
                        <div className={'microfreakOscillatorShapeInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                            max="127"
                            min="0"
                            onChange={(e) => updateDigitalOscillatorShapeValue(e.target.value)}
                            type="range"
                            value={patchParams.digitalOscillator.shape} />
                        </div>
                    </div>
                    <div className={'microfreakAnalogFilterDiv' + microfreakMonth}>
                        <p className={'microfreakAnalogFilterLabel' + microfreakMonth}>analog filter</p>
                        <div className={'microfreakAnalogFilterTypeLPFLight' + (patchParams.analogFilter.filterType === 'lpf') + microfreakMonth}
                            onClick={() => setFilterType('lpf')}></div>
                        <p className={'microfreakLPFLabel' + (patchParams.analogFilter.filterType === 'lpf') + microfreakMonth}
                            onClick={() => setFilterType('lpf')}>low pass filter</p>
                        <div className={'microfreakAnalogFilterTypebPFLight' + (patchParams.analogFilter.filterType === 'bpf') + microfreakMonth}
                            onClick={() => setFilterType('bpf')}></div>
                        <p className={'microfreakBPFLabel' + (patchParams.analogFilter.filterType === 'bpf') + microfreakMonth}
                            onClick={() => setFilterType('bpf')}>band pass filter</p>
                        <div className={'microfreakAnalogFilterTypehPFLight' + (patchParams.analogFilter.filterType === 'hpf') + microfreakMonth}
                            onClick={() => setFilterType('hpf')}></div>
                        <p className={'microfreakHPFLabel' + (patchParams.analogFilter.filterType === 'hpf') + microfreakMonth}
                            onClick={() => setFilterType('hpf')}>high pass filter</p>
                        <p className={'microfreakAnalogFilterCutoffLabel' + microfreakMonth}>
                            cutoff</p>
                        <p className={'microfreakFilterCutoffDisplay' + microfreakMonth}>{calculateCutoffDisplay(patchParams.analogFilter.cutoff)}</p>
                        <div className={'microfreakAnalogFilterCutoffInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                            max="127"
                            min="0"
                            onChange={(e) => updateAnalogFilterCutoffValue(e.target.value)}
                            type="range"
                            value={patchParams.analogFilter.cutoff} />
                        </div>
                        <p className={'microfreakAnalogFilterResonanceLabel' + microfreakMonth}>
                            resonance</p>
                        <p className={'microfreakFilterResonanceDisplay' + microfreakMonth}>{calculateResonanceDisplay(patchParams.analogFilter.resonance)}</p>
                        <div className={'microfreakAnalogFilterResonanceInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                max="127"
                                min="0"
                                onChange={(e) => updateAnalogFilterResonanceValue(e.target.value)}
                                type="range"
                                value={patchParams.analogFilter.resonance} />
                        </div>
                    </div>
                    <div className={'microfreakEnvelopesDiv' + microfreakMonth}>
                        <div className={'microfreakEnvelopesTabStrip' + microfreakMonth}>
                            <div className={'microfreakEnvelopeGeneratorTab' + envelopeTabs.envelopeGenerator + microfreakMonth}
                                onClick={() => envelopeTabUpdate('eg')}>
                                <p>envelope generator</p>
                            </div>
                            <div className={'microfreakEnvelopeGeneratorTab' + envelopeTabs.cyclingEnvelope + microfreakMonth}
                                onClick={() => envelopeTabUpdate('ce')}>
                                <p>cycling envelope</p>
                            </div>
                        </div>
                        {(envelopeTabs.envelopeGenerator) && (
                            <div className={'microfreakEnvelopeContainer' + microfreakMonth}>
                                <div className={'microfreakAmplitudeModulationLight' + patchParams.envelopeGenerator.ampMod + microfreakMonth}
                                    onClick={() => updateAmplitudeModulationState()}></div>
                                <p className={'microfreakAmplitudeModulationLabel' + patchParams.envelopeGenerator.ampMod + microfreakMonth}
                                    onClick={() => updateAmplitudeModulationState()}>amplitude modulation</p>
                                <p className={'microfreakEnvelopeGeneratorAttackLabel' + microfreakMonth}>
                                attack</p>
                                <p className={'microfreakEnvelopeGeneratorAttackDisplay' + microfreakMonth}>{calculateEGAttackDisplay(patchParams.envelopeGenerator.attack)}</p>
                                <div className={'microfreakEnvelopeGeneratorAttackInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateEnvelopeGeneratorAttackValue(e.target.value)}
                                        type="range"
                                        value={patchParams.envelopeGenerator.attack} />
                                </div>
                                <p className={'microfreakEnvelopeGeneratorDecayReleaseLabel' + microfreakMonth}>
                                decay/release</p>
                                <p className={'microfreakEnvelopeGeneratorDecayReleaseDisplay' + microfreakMonth}>{calculateEGDecayReleaseDisplay(patchParams.envelopeGenerator.decayRelease)}</p>
                                <div className={'microfreakEnvelopeGeneratorDecayReleaseInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateEnvelopeGeneratorDecayReleaseValue(e.target.value)}
                                        type="range"
                                        value={patchParams.envelopeGenerator.decayRelease} />
                                </div>
                                <p className={'microfreakEnvelopeGeneratorSustainLabel' + microfreakMonth}>
                                sustain</p>
                                <p className={'microfreakEnvelopeGeneratorSustainDisplay' + microfreakMonth}>{calculateEGSustainDisplay(patchParams.envelopeGenerator.sustain)}</p>
                                <div className={'microfreakEnvelopeGeneratorSustainInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateEnvelopeGeneratorSustainValue(e.target.value)}
                                        type="range"
                                        value={patchParams.envelopeGenerator.sustain} />
                                </div>
                                <p className={'microfreakEnvelopeGeneratorFilterAmountLabel' + microfreakMonth}>
                                filter amount</p>
                                <p className={'microfreakEnvelopeGeneratorFilterAmountDisplay' + microfreakMonth}>{calculateEGFilterAmountDisplay(patchParams.envelopeGenerator.filterAmount)}</p>
                                <div className={'microfreakEnvelopeGeneratorFilterAmountInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateEnvelopeGeneratorFilterAmountValue(e.target.value)}
                                        type="range"
                                        value={patchParams.envelopeGenerator.filterAmount} />
                                </div>
                            </div>
                        )}
                        {(envelopeTabs.cyclingEnvelope) && (
                            <div className={'microfreakEnvelopeContainer' + microfreakMonth}>
                                <p className={'microfreakCyclingEnvelopeModeSettingLabel' + microfreakMonth}>mode</p>
                                <div className={'microfreakCyclingEnvelopeModeLight' + (patchParams.cyclingEnvelope.mode === 'env') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('env')}></div>
                                <p className={'microfreakCyclingEnvelopeModeEnvelopeLabel' + (patchParams.cyclingEnvelope.mode === 'env') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('env')}>env</p>
                                <div className={'microfreakCyclingRunModeLight' + (patchParams.cyclingEnvelope.mode === 'run') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('run')}></div>
                                <p className={'microfreakCyclingEnvelopeModeRunLabel' + (patchParams.cyclingEnvelope.mode === 'run') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('run')}>run</p>
                                <div className={'microfreakCyclingLoopModeLight' + (patchParams.cyclingEnvelope.mode === 'loop') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('loop')}></div>
                                <p className={'microfreakCyclingEnvelopeModeLoopLabel' + (patchParams.cyclingEnvelope.mode === 'loop') + microfreakMonth}
                                    onClick={() => updateCyclingEnvelopeModeState('loop')}>loop</p>
                                <p className={'microfreakCyclingEnvelopeRiseLabel' + microfreakMonth}>
                                rise</p>
                                <p className={'microfreakCyclingEnvelopeRiseDisplay' + microfreakMonth}>{calculateCycingEnvelopeRiseDisplay(patchParams.cyclingEnvelope.rise)}</p>
                                <div className={'microfreakCyclingEnvelopeRiseInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeRiseValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.rise} />
                                </div>
                                <p className={'microfreakCyclingEnvelopeRiseShapeLabel' + microfreakMonth}>
                                rise shape</p>
                                <p className={'microfreakCyclingEnvelopeRiseShapeDisplay' + microfreakMonth}>{calculateCycingEnvelopeRiseShapeDisplay(patchParams.cyclingEnvelope.riseShape)}</p>
                                <div className={'microfreakCyclingEnvelopeRiseShapeInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeRiseShapeValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.riseShape} />
                                </div>
                                <p className={'microfreakCyclingEnvelopeFallLabel' + microfreakMonth}>
                                fall</p>
                                <p className={'microfreakCyclingEnvelopeFallDisplay' + microfreakMonth}>{calculateCycingEnvelopeFallDisplay(patchParams.cyclingEnvelope.fall)}</p>
                                <div className={'microfreakCyclingEnvelopeFallInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeFallValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.fall} />
                                </div>
                                <p className={'microfreakCyclingEnvelopeFallShapeLabel' + microfreakMonth}>
                                fall shape</p>
                                <p className={'microfreakCyclingEnvelopeFallShapeDisplay' + microfreakMonth}>{calculateCycingEnvelopeFallShapeDisplay(patchParams.cyclingEnvelope.fallShape)}</p>
                                <div className={'microfreakCyclingEnvelopeFallShapeInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeFallShapeValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.fallShape} />
                                </div>
                                <p className={'microfreakCyclingEnvelopeHoldSustainLabel' + microfreakMonth}>
                                hold/ sustain</p>
                                <p className={'microfreakCyclingEnvelopeHoldSustainDisplay' + microfreakMonth}>{calculateCycingEnvelopeHoldSustainDisplay(patchParams.cyclingEnvelope.holdSustain)}</p>
                                <div className={'microfreakCyclingEnvelopeHoldSustainInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeHoldSustainValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.holdSustain} />
                                </div>
                                <p className={'microfreakCyclingEnvelopeAmountLabel' + microfreakMonth}>
                                amount</p>
                                <p className={'microfreakCyclingEnvelopeAmountDisplay' + microfreakMonth}>{calculateCycingEnvelopeAmountDisplay(patchParams.cyclingEnvelope.amount)}</p>
                                <div className={'microfreakCyclingEnvelopeAmountInputContainer' + microfreakMonth}>
                                    <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCyclingEnvelopeAmountValue(e.target.value)}
                                        type="range"
                                        value={patchParams.cyclingEnvelope.amount} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={'microfreakLFODiv' + microfreakMonth}>
                        <p className={'microfreakLFOLabel' + microfreakMonth}>lfo</p>
                        <p className={'microfreakLFOShapeLabel' + microfreakMonth}>shape</p>
                        <div className={'microfreakLFOSineLight' + (patchParams.lfo.shape === 'sine') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sine')}></div>
                        <p className={'microfreakLFOSineLabel' + (patchParams.lfo.shape === 'sine') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sine')}>sine</p>
                        <div className={'microfreakLFOTriangleLight' + (patchParams.lfo.shape === 'trianlge') + microfreakMonth}
                            onClick={() => updateLFOShapeState('trianlge')}></div>
                        <p className={'microfreakLFOTriangleLabel' + (patchParams.lfo.shape === 'trianlge') + microfreakMonth}
                            onClick={() => updateLFOShapeState('trianlge')}>triangle</p>
                        <div className={'microfreakLFOSawtoothLight' + (patchParams.lfo.shape === 'sawtooth') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sawtooth')}></div>
                        <p className={'microfreakLFOSawtoothLabel' + (patchParams.lfo.shape === 'sawtooth') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sawtooth')}>sawtooth</p>
                        <div className={'microfreakLFOSquareLight' + (patchParams.lfo.shape === 'square') + microfreakMonth}
                            onClick={() => updateLFOShapeState('square')}></div>
                        <p className={'microfreakLFOSquareLabel' + (patchParams.lfo.shape === 'square') + microfreakMonth}
                            onClick={() => updateLFOShapeState('square')}>square</p>
                        <div className={'microfreakLFOSampleHoldLight' + (patchParams.lfo.shape === 'sample&hold') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sample&hold')}></div>
                        <p className={'microfreakLFOSampleHoldLabel' + (patchParams.lfo.shape === 'sample&hold') + microfreakMonth}
                            onClick={() => updateLFOShapeState('sample&hold')}>sample & hold</p>
                        <div className={'microfreakLFOGlidingLight' + (patchParams.lfo.shape === 'gliding') + microfreakMonth}
                            onClick={() => updateLFOShapeState('gliding')}></div>
                        <p className={'microfreakLFOGlidingLabel' + (patchParams.lfo.shape === 'gliding') + microfreakMonth}
                            onClick={() => updateLFOShapeState('gliding')}>gliding</p>
                        <p className={'microfreakLFOSyncLabel' + microfreakMonth}>sync</p>
                        <div className={'microfreakLFOSyncLight' + patchParams.lfo.sync + microfreakMonth}
                            onClick={() => updateLFOSyncState()}></div>
                        {(patchParams.lfo.sync) && (
                            <p className={'microfreakLFOSyncOnLabel' + microfreakMonth}
                                onClick={() => updateLFOSyncState()}>on</p>
                        )}
                        {(!patchParams.lfo.sync) && (
                            <p className={'microfreakLFOSyncOffLabel' + microfreakMonth}
                                onClick={() => updateLFOSyncState()}>off</p>
                        )}
                        <p className={'microfreakLFORateLabel' + microfreakMonth}>
                            rate</p>
                        <p className={'microfreakLFORateDisplay' + microfreakMonth}>{calculateLFORateDisplay(patchParams.lfo.rate)}</p>
                        <div className={'microfreakLFORateInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                max="127"
                                min="0"
                                onChange={(e) => updateLFORateValue(e.target.value)}
                                type="range"
                                value={patchParams.lfo.rate} />
                        </div>
                    </div>
                    <div className={'microfreakArpeggiatorDiv' + microfreakMonth}>
                        <div className={'microfreakArpeggiateLight' + (patchParams.arpeggiator.on) + microfreakMonth}
                            onClick={() => updateArpeggiateOnState()}></div>
                        <p className={'microfreakArpeggieateOnLabel' + (patchParams.arpeggiator.on) + microfreakMonth}
                                    onClick={() => updateArpeggiateOnState()}>arp</p>
                        <div className={'microfreakArpeggiateSyncLight' + (patchParams.arpeggiator.sync) + microfreakMonth}
                            onClick={() => updateArpeggiateSyncState()}></div>
                        <p className={'microfreakArpeggieateSyncLabel' + (patchParams.arpeggiator.sync) + microfreakMonth}
                                    onClick={() => updateArpeggiateSyncState()}>sync</p>
                        <p className={'microfreakArpeggiateOctModeLabel' + microfreakMonth}>oct</p>
                        <select className={'microfreakArpeggiateOctModeSelect' + microfreakMonth}
                            onChange={(e) => updateArpeggiateOct(e.target.value)}
                            value={patchParams.arpeggiator.oct}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        <p className={'microfreakArpeggiateRateLabel' + microfreakMonth}>rate</p>
                        <div className={'microfreakARPRateInputContainer' + microfreakMonth}>
                            <input className={'microfreakArpRangeInput' + microfreakMonth}
                                max="127"
                                min="0"
                                onChange={(e) => updateARPRateValue(e.target.value)}
                                type="range"
                                value={patchParams.arpeggiator.rate} />
                        </div>
                        <p className={'microfreakARPRateDisplay' + microfreakMonth}>{calculateARPRateDisplay(patchParams.arpeggiator.rate)}</p>
                        <p className={'microfreakArpeggiatePatternLabel' + microfreakMonth}>pattern</p>
                        <select className={'microfreakArpeggieatePatternSelect' + microfreakMonth}
                            onChange={(e) => updateArpeggiatorPattern(e.target.value)}
                            value={patchParams.arpeggiator.pattern}>
                            <option value="up">up</option>
                            <option value="order">order</option>
                            <option value="random">random</option>
                            <option value="pattern">pattern</option>
                        </select>
                        <div className={'microfreakArpHoldLight' + (patchParams.arpeggiator.hold) + microfreakMonth}
                            onClick={() => updateArpeggiateHoldState()}></div>
                        <p className={'microfreakArpeggieateHoldLabel' + (patchParams.arpeggiator.hold) + microfreakMonth}
                            onClick={() => updateArpeggiateHoldState()}>hold</p>
                    </div>
                    <div className={'microfreakSpiceDiv' + microfreakMonth}>
                        <div className={'microfreakArpSpiceLight' + (patchParams.arpeggiator.on) + (patchParams.spice.spice) + microfreakMonth}
                            onClick={() => updateSpiceSpiceState()}></div>
                        <p className={'microfreakArpSpiceLabel' + (patchParams.spice.spice) + microfreakMonth}
                            onClick={() => updateSpiceSpiceState()}>spice</p>
                        <div className={'microfreakArpDiceLight' + (patchParams.arpeggiator.on) + (patchParams.spice.dice) + microfreakMonth}
                            onClick={() => updateSpiceDiceState()}></div>
                        <p className={'microfreakArpDiceLabel' + (patchParams.spice.dice) + microfreakMonth}
                            onClick={() => updateSpiceDiceState()}>dice</p>
                    </div>
                    <div className={'microfreakParaphonicDiv' + microfreakMonth}>
                        <div className={'microfreakParaphonicLight' + (patchParams.paraphonic) + microfreakMonth}
                            onClick={() => updateParaphonicState()}></div>
                        <p className={'microfreakParaphonicLabel' + (patchParams.paraphonic) + microfreakMonth}
                            onClick={() => updateParaphonicState()}>paraphonic</p>
                    </div>
                    <div className={'microfreakMatrixButtonDiv' + microfreakMonth}>
                        <button className={'microfreakMatrixButton' + microfreakMonth}>matrix</button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Microfreak;
