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
import './volcaFm.style.jana.css';
import './volcaFm.style.janb.css';
import './volcaFm.style.janc.css';
import './volcaFm.style.feba.css';
import './volcaFm.style.febb.css';
import './volcaFm.style.febc.css';
import midi5pin from '../img/midi5pin.svg';
import volcaFmImg1 from '../img/volcaFmImg1.png';
import axios from 'axios';
import midiConnection from '../midiManager/midiConnection';

let connections;

function VolcaFm(user, patch) {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif';
    const janbSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif';
    const jancSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif';
    const febaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif';
    const febbSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif';
    const febcSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif';

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [panicState, setPanicState] = useState('panicOff');
    const [currentPatchUuid, setCurrentPatchUuid] = useState(null);
    const [loadPatchUuid, setLoadPatchUuid] = useState(null);
    const [userPatches, setUserPatches] = useState([]);
    const [volcaFmLoadModalState, setVolcaFmLoadModalState] = useState('_Inactive');
    const [currentSpinner, setCurrentSpinner] = useState(febcSpinner);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [aboutVolcaFmDivState, setAboutVolcaFmDivState] = useState('Inactive');
    const [copyOpDialogStatus, setCopyOpDialogStatus] = useState('Inactive');
    const [copyFrom, setCopyFrom] = useState(1);
    const [copyTo, setCopyTo] = useState(2);
    const [volcaFmContainerState, setVolcaFmContainerState] = useState('Active');
    const [saveAsName, setSaveAsName] = useState('');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('Inactive');
    const [volcaFmMonth, setVolcaFmMonth] = useState('_FebruaryC');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [currentAlgorithm, setCurrentAlgorithm] = useState('_algorithm1');
    const [currentAlgorithmNumerical, setCurrentAlgorithmNumerical] = useState(1);
    const [globalParams, setGlobalParams] = useState({
        name: 'Patch Name',
        settings: {
            feedback: 0,
            oscKeySync: 0,
            transpose: 12
        },
        lfo: {
            speed: 0,
            delay: 0,
            pitchModulationDepth: 0,
            amplitudeModulationDepth: 0,
            sync: 0,
            lfoWaveform: 0,
            pitchModulationSensitivity: 0
        },
        pitchEnvelope: {
            rate1: 0,
            rate2: 0,
            rate3: 0,
            rate4: 0,
            level1: 50,
            level2: 50,
            level3: 50, 
            level4: 50
        },
        global: {
            monoPoly: 0,
            pitchBendRange: 2,
            pitchBendStep: 0,
            modulationWheelRange: 99,
            modulationWheelAssign: 1
        },
        performance: {
            portamentoMode: 0,
            portamentoGliss: 0,
            portamentoTime: 0,
            footControlRange: 0,
            footControlAssign: 0,
            breathControlRange: 0,
            breathControlAssign: 0,
            aftertouchRange: 0,
            aftertouchAssign: 0
        }
    });
    const [globalPatchState, setGlobalPatchState] = useState({
        settings: 'globalSettingsTabActive',
        lfo: 'globalSettingsTabInactive',
        pitch: 'globalSettingsTabInactive',
        global: 'globalSettingsTabInactive',
        performance: 'globalSettingsTabInactive'
    });
    const [operatorEditorState, setOperatorEditorState] = useState({
        operator1: {
            state: 'operator1EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator2: {
            state: 'operator2EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator3: {
            state: 'operator3EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator4: {
            state: 'operator4EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator5: {
            state: 'operator5EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator6: {
            state: 'operator6EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        }
    });
    const [envelopeLevelState, setEnvelopeLevelState] = useState({
        operator1: {
            envelopeState: 'operator1EnvelopeStateInactive',
            levelState: 'operator1EnvelopeLevelStateInactive'
        },
        operator2: {
            envelopeState: 'operator2EnvelopeStateInactive',
            levelState: 'operator2EnvelopeLevelStateInactive'
        },
        operator3: {
            envelopeState: 'operator3EnvelopeStateInactive',
            levelState: 'operator3EnvelopeLevelStateInactive'
        },
        operator4: {
            envelopeState: 'operator4EnvelopeStateInactive',
            levelState: 'operator4EnvelopeLevelStateInactive'
        },
        operator5: {
            envelopeState: 'operator5EnvelopeStateInactive',
            levelState: 'operator5EnvelopeLevelStateInactive'
        },
        operator6: {
            envelopeState: 'operator6EnvelopeStateInactive',
            levelState: 'operator6EnvelopeLevelStateInactive'
        },
        pitch: {
            envelope: 'pitchEnvelopeStateInactive'
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
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator2: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator3: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator4: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator5: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator6: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        }
    });
    
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
    
    const closeVolcaFmAboutDiv = () => {
        setAboutVolcaFmDivState('Inactive');
    }
    
    const openVolcaFmAboutDiv = () => {
        setAboutVolcaFmDivState('Active');
    }
    
    const makeRandomPatch = () => {
        const algorithm = Math.floor(Math.random() * 31) + 1;
        const onState = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
        const onOff = ['On', 'Off'];
        const onOffState = [];
        for (let i = 0; i < 6; i++) {
            onOffState[i] = onOff[onState[i]];
        }
        
        setPatchAltered(true);
        setCurrentAlgorithm('_algorithm' + algorithm.toString());
        setCurrentAlgorithmNumerical(algorithm);
        setGlobalParams({
            name: 'Random',
            settings: {
                feedback: Math.floor(Math.random() * 8),
                oscKeySync: Math.floor(Math.random() * 2),
                transpose: 12
            },
            lfo: {
                speed: Math.floor(Math.random() * 100),
                delay: Math.floor(Math.random() * 100),
                pitchModulationDepth: Math.floor(Math.random() * 100),
                amplitudeModulationDepth: Math.floor(Math.random() * 100),
                sync: Math.floor(Math.random() * 2),
                lfoWaveform: Math.floor(Math.random() * 6),
                pitchModulationSensitivity: Math.floor(Math.random() * 8)
            },
            pitchEnvelope: {
                rate1: Math.floor(Math.random() * 100),
                rate2: Math.floor(Math.random() * 100),
                rate3: Math.floor(Math.random() * 100),
                rate4: Math.floor(Math.random() * 100),
                level1: Math.floor(Math.random() * 100),
                level2: Math.floor(Math.random() * 100),
                level3: Math.floor(Math.random() * 100), 
                level4: Math.floor(Math.random() * 100)
            },
            global: {
                monoPoly: Math.floor(Math.random() * 2),
                pitchBendRange: Math.floor(Math.random() * 13),
                pitchBendStep: Math.floor(Math.random() * 13),
                modulationWheelRange: Math.floor(Math.random() * 100),
                modulationWheelAssign: Math.floor(Math.random() * 3)
            },
            performance: {
                portamentoMode: Math.floor(Math.random() * 2),
                portamentoGliss: Math.floor(Math.random() * 2),
                portamentoTime: Math.floor(Math.random() * 100),
                footControlRange: Math.floor(Math.random() * 100),
                footControlAssign: Math.floor(Math.random() * 3),
                breathControlRange: Math.floor(Math.random() * 100),
                breathControlAssign: Math.floor(Math.random() * 3),
                aftertouchRange: Math.floor(Math.random() * 100),
                aftertouchAssign: Math.floor(Math.random() * 3)
            }
        });
        setOperatorParams({
            operator1: {
                operatorOn: onOffState[0],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            },
            operator2: {
                operatorOn: onOffState[1],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            },
            operator3: {
                operatorOn: onOffState[2],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            },
            operator4: {
                operatorOn: onOffState[3],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            },
            operator5: {
                operatorOn: onOffState[4],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            },
            operator6: {
                operatorOn: onOffState[5],
                outputLevel: Math.floor(Math.random() * 100),
                envelopeR1: Math.floor(Math.random() * 100),
                envelopeL1: Math.floor(Math.random() * 100),
                envelopeR2: Math.floor(Math.random() * 100),
                envelopeL2: Math.floor(Math.random() * 100),
                envelopeR3: Math.floor(Math.random() * 100),
                envelopeL3: Math.floor(Math.random() * 100),
                envelopeR4: Math.floor(Math.random() * 100),
                envelopeL4: Math.floor(Math.random() * 100),
                levelScaleBreakPoint: Math.floor(Math.random() * 100),
                levelScaleLeftDepth: Math.floor(Math.random() * 100),
                levelScaleLeftCurve: Math.floor(Math.random() * 4),
                levelScaleRightDepth: Math.floor(Math.random() * 100),
                levelScaleRightCurve: Math.floor(Math.random() * 4),
                oscMode: Math.floor(Math.random() * 2),
                freqCoarse: Math.floor(Math.random() * 32),
                freqFine: Math.floor(Math.random() * 100),
                detune: Math.floor(Math.random() * 14),
                oscRateScale: Math.floor(Math.random() * 15),
                amplitudeModSense: Math.floor(Math.random() * 4),
                keyVelocitySense: Math.floor(Math.random() * 8)
            }
        });
        sendSysexDump();
        setCurrentPatchUuid(null);
    }
    
    const sysexMessage = () => {
        let message = [
            0xF0,                                           // status - start Sysex
            0x43,                                           // id - yamaha (67)
            0x01,                                           // sub-status
            0x02,                                           // parameter group
            globalParams.global.monoPoly,                   // begin message - mono/poly
            globalParams.global.pitchBendRange,             // pitch bend range
            globalParams.global.pitchBendStep,              // pitch bend step
            globalParams.performance.portamentoMode,        // portamento mode
            globalParams.performance.portamentoGliss,       // portamento gliss
            globalParams.performance.portamentoTime,        // portamento time
            globalParams.global.modulationWheelRange,       // modulation wheel range
            globalParams.global.modulationWheelAssign,      // modulation wheel assign
            globalParams.performance.footControlRange,      // foot control range
            globalParams.performance.footControlAssign,     // foot control assign
            globalParams.performance.breathControlRange,    // breath control range
            globalParams.performance.breathControlAssign,   // breath control assign
            globalParams.performance.aftertouchRange,       // aftertouch range
            globalParams.performance.aftertouchAssign,      // aftertouch assign
            0xf7                                            // 0b1111_0111 ; EOX
        ];
        
        return message;
    }
    
    const sysexBuffer = () => {
        let checksum = 0;
        let nameArray = [];
        let onOff = 64;
        
        for (let i = 0; i < 10; i++) {
            if ((i > globalParams.name.length) || (i === globalParams.name.length)) {
                nameArray[i] = 32;
            } else {
                nameArray[i] = globalParams.name.charCodeAt(i);
            }
        }
        
        if (operatorParams.operator1.operatorOn === 'On') {
            onOff += 1;
        }
        if (operatorParams.operator2.operatorOn === 'On') {
            onOff += 2;
        }
        if (operatorParams.operator3.operatorOn === 'On') {
            onOff += 4;
        }
        if (operatorParams.operator4.operatorOn === 'On') {
            onOff += 8;
        }
        if (operatorParams.operator5.operatorOn === 'On') {
            onOff += 16;
        }
        if (operatorParams.operator6.operatorOn === 'On') {
            onOff += 32;
        }
        
        let buffer = [
            0xF0,                                           // status - start Sysex
            0x43,                                           // id - yamaha (67)
            0x00 | currentMidiChannel,                      // current midi channel
            0x00,                                           // format number (0 = 1 voice)
            0x01,                                           // 0b0bbbbbbb data byte count msb
            0x1b,                                           // 0b0bbbbbbb data byte count lsb
            operatorParams.operator6.envelopeR1,            // voice data start - OP6 EG rate 1
            operatorParams.operator6.envelopeR2,            // OP6 EG rate2
            operatorParams.operator6.envelopeR3,            // OP6 EG rate3
            operatorParams.operator6.envelopeR4,            // OP6 EG rate4
            operatorParams.operator6.envelopeL1,            // OP6 EG level1
            operatorParams.operator6.envelopeL2,            // OP6 EG level2
            operatorParams.operator6.envelopeL3,            // OP6 EG level3
            operatorParams.operator6.envelopeL4,            // OP6 EG level4
            operatorParams.operator6.levelScaleBreakPoint,  // OP6 level scale break point
            operatorParams.operator6.levelScaleLeftDepth,   // OP6 left scale depth
            operatorParams.operator6.levelScaleRightDepth,  // OP6 right scale depth
            operatorParams.operator6.levelScaleLeftCurve,   // OP6 left scale curve
            operatorParams.operator6.levelScaleRightCurve,  // OP6 right scale curve
            operatorParams.operator6.oscRateScale,          // OP6 oscillator rate scaling
            operatorParams.operator6.amplitudeModSense,     // OP6 amplitude modulation sensitivity
            operatorParams.operator6.keyVelocitySense,      // OP6 key velocity sensitivity
            operatorParams.operator6.outputLevel,           // OP6 output level
            operatorParams.operator6.oscMode,               // OP6 Oscillator Mode
            operatorParams.operator6.freqCoarse,            // OP6 Frequency Coarse
            operatorParams.operator6.freqFine,              // OP6 Frequency Fine
            operatorParams.operator6.detune,                // OP6 Detune
            operatorParams.operator5.envelopeR1,            // OP5 EG rate 1
            operatorParams.operator5.envelopeR2,            // OP5 EG rate2
            operatorParams.operator5.envelopeR3,            // OP5 EG rate3
            operatorParams.operator5.envelopeR4,            // OP5 EG rate4
            operatorParams.operator5.envelopeL1,            // OP5 EG level1
            operatorParams.operator5.envelopeL2,            // OP5 EG level2
            operatorParams.operator5.envelopeL3,            // OP5 EG level3
            operatorParams.operator5.envelopeL4,            // OP5 EG level4
            operatorParams.operator5.levelScaleBreakPoint,  // OP5 level scale break point
            operatorParams.operator5.levelScaleLeftDepth,   // OP5 left scale depth
            operatorParams.operator5.levelScaleRightDepth,  // OP5 right scale depth
            operatorParams.operator5.levelScaleLeftCurve,   // OP5 left scale curve
            operatorParams.operator5.levelScaleRightCurve,  // OP5 right scale curve
            operatorParams.operator5.oscRateScale,          // OP5 oscillator rate scaling
            operatorParams.operator5.amplitudeModSense,     // OP5 amplitude modulation sensitivity
            operatorParams.operator5.keyVelocitySense,      // OP5 key velocity sensitivity
            operatorParams.operator5.outputLevel,           // OP5 output level
            operatorParams.operator5.oscMode,               // OP5 Oscillator Mode
            operatorParams.operator5.freqCoarse,            // OP5 Frequency Coarse
            operatorParams.operator5.freqFine,              // OP5 Frequency Fine
            operatorParams.operator5.detune,                // OP5 Detune
            operatorParams.operator4.envelopeR1,            // OP4 EG rate 1
            operatorParams.operator4.envelopeR2,            // OP4 EG rate2
            operatorParams.operator4.envelopeR3,            // OP4 EG rate3
            operatorParams.operator4.envelopeR4,            // OP4 EG rate4
            operatorParams.operator4.envelopeL1,            // OP4 EG level1
            operatorParams.operator4.envelopeL2,            // OP4 EG level2
            operatorParams.operator4.envelopeL3,            // OP4 EG level3
            operatorParams.operator4.envelopeL4,            // OP4 EG level4
            operatorParams.operator4.levelScaleBreakPoint,  // OP4 level scale break point
            operatorParams.operator4.levelScaleLeftDepth,   // OP4 left scale depth
            operatorParams.operator4.levelScaleRightDepth,  // OP4 right scale depth
            operatorParams.operator4.levelScaleLeftCurve,   // OP4 left scale curve
            operatorParams.operator4.levelScaleRightCurve,  // OP4 right scale curve
            operatorParams.operator4.oscRateScale,          // OP4 oscillator rate scaling
            operatorParams.operator4.amplitudeModSense,     // OP4 amplitude modulation sensitivity
            operatorParams.operator4.keyVelocitySense,      // OP4 key velocity sensitivity
            operatorParams.operator4.outputLevel,           // OP4 output level
            operatorParams.operator4.oscMode,               // OP4 Oscillator Mode
            operatorParams.operator4.freqCoarse,            // OP4 Frequency Coarse
            operatorParams.operator4.freqFine,              // OP4 Frequency Fine
            operatorParams.operator4.detune,                // OP4 Detune
            operatorParams.operator3.envelopeR1,            // OP3 EG rate 1
            operatorParams.operator3.envelopeR2,            // OP3 EG rate2
            operatorParams.operator3.envelopeR3,            // OP3 EG rate3
            operatorParams.operator3.envelopeR4,            // OP3 EG rate4
            operatorParams.operator3.envelopeL1,            // OP3 EG level1
            operatorParams.operator3.envelopeL2,            // OP3 EG level2
            operatorParams.operator3.envelopeL3,            // OP3 EG level3
            operatorParams.operator3.envelopeL4,            // OP3 EG level4
            operatorParams.operator3.levelScaleBreakPoint,  // OP3 level scale break point
            operatorParams.operator3.levelScaleLeftDepth,   // OP3 left scale depth
            operatorParams.operator3.levelScaleRightDepth,  // OP3 right scale depth
            operatorParams.operator3.levelScaleLeftCurve,   // OP3 left scale curve
            operatorParams.operator3.levelScaleRightCurve,  // OP3 right scale curve
            operatorParams.operator3.oscRateScale,          // OP3 oscillator rate scaling
            operatorParams.operator3.amplitudeModSense,     // OP3 amplitude modulation sensitivity
            operatorParams.operator3.keyVelocitySense,      // OP3 key velocity sensitivity
            operatorParams.operator3.outputLevel,           // OP3 output level
            operatorParams.operator3.oscMode,               // OP3 Oscillator Mode
            operatorParams.operator3.freqCoarse,            // OP3 Frequency Coarse
            operatorParams.operator3.freqFine,              // OP3 Frequency Fine
            operatorParams.operator3.detune,                // OP3 Detune
            operatorParams.operator2.envelopeR1,            // OP2 EG rate 1
            operatorParams.operator2.envelopeR2,            // OP2 EG rate2
            operatorParams.operator2.envelopeR3,            // OP2 EG rate3
            operatorParams.operator2.envelopeR4,            // OP2 EG rate4
            operatorParams.operator2.envelopeL1,            // OP2 EG level1
            operatorParams.operator2.envelopeL2,            // OP2 EG level2
            operatorParams.operator2.envelopeL3,            // OP2 EG level3
            operatorParams.operator2.envelopeL4,            // OP2 EG level4
            operatorParams.operator2.levelScaleBreakPoint,  // OP2 level scale break point
            operatorParams.operator2.levelScaleLeftDepth,   // OP2 left scale depth
            operatorParams.operator2.levelScaleRightDepth,  // OP2 right scale depth
            operatorParams.operator2.levelScaleLeftCurve,   // OP2 left scale curve
            operatorParams.operator2.levelScaleRightCurve,  // OP2 right scale curve
            operatorParams.operator2.oscRateScale,          // OP2 oscillator rate scaling
            operatorParams.operator2.amplitudeModSense,     // OP2 amplitude modulation sensitivity
            operatorParams.operator2.keyVelocitySense,      // OP2 key velocity sensitivity
            operatorParams.operator2.outputLevel,           // OP2 output level
            operatorParams.operator2.oscMode,               // OP2 Oscillator Mode
            operatorParams.operator2.freqCoarse,            // OP2 Frequency Coarse
            operatorParams.operator2.freqFine,              // OP2 Frequency Fine
            operatorParams.operator2.detune,                // OP2 Detune
            operatorParams.operator1.envelopeR1,            // OP1 EG rate 1
            operatorParams.operator1.envelopeR2,            // OP1 EG rate2
            operatorParams.operator1.envelopeR3,            // OP1 EG rate3
            operatorParams.operator1.envelopeR4,            // OP1 EG rate4
            operatorParams.operator1.envelopeL1,            // OP1 EG level1
            operatorParams.operator1.envelopeL2,            // OP1 EG level2
            operatorParams.operator1.envelopeL3,            // OP1 EG level3
            operatorParams.operator1.envelopeL4,            // OP1 EG level4
            operatorParams.operator1.levelScaleBreakPoint,  // OP1 level scale break point
            operatorParams.operator1.levelScaleLeftDepth,   // OP1 left scale depth
            operatorParams.operator1.levelScaleRightDepth,  // OP1 right scale depth
            operatorParams.operator1.levelScaleLeftCurve,   // OP1 left scale curve
            operatorParams.operator1.levelScaleRightCurve,  // OP1 right scale curve
            operatorParams.operator1.oscRateScale,          // OP1 oscillator rate scaling
            operatorParams.operator1.amplitudeModSense,     // OP1 amplitude modulation sensitivity
            operatorParams.operator1.keyVelocitySense,      // OP1 key velocity sensitivity
            operatorParams.operator1.outputLevel,           // OP1 output level
            operatorParams.operator1.oscMode,               // OP1 Oscillator Mode
            operatorParams.operator1.freqCoarse,            // OP1 Frequency Coarse
            operatorParams.operator1.freqFine,              // OP1 Frequency Fine
            operatorParams.operator1.detune,                // OP1 Detune
            globalParams.pitchEnvelope.rate1,               // pitch EG rate 1
            globalParams.pitchEnvelope.rate2,               // pitch EG rate 2
            globalParams.pitchEnvelope.rate3,               // pitch EG rate 3
            globalParams.pitchEnvelope.rate4,               // pitch EG rate 4
            globalParams.pitchEnvelope.level1,              // pitch EG level 1
            globalParams.pitchEnvelope.level2,              // pitch EG level 2
            globalParams.pitchEnvelope.level3,              // pitch EG level 3
            globalParams.pitchEnvelope.level4,              // pitch EG level 4
            currentAlgorithmNumerical - 1,                  // algorithm #
            globalParams.settings.feedback,                 // feedback
            globalParams.settings.oscKeySync,               // oscillator key sync
            globalParams.lfo.speed,                         // lfo speed
            globalParams.lfo.delay,                         // lfo delay
            globalParams.lfo.pitchModulationDepth,          // lfo pitch modulation depth
            globalParams.lfo.amplitudeModulationDepth,      // lfo amplitude modulation depth
            globalParams.lfo.sync,                          // lfo sync
            globalParams.lfo.lfoWaveform,                   // lfo waveform
            globalParams.lfo.pitchModulationSensitivity,    // lfo pitch modulation sensitivity
            globalParams.settings.transpose,                // transpose
            nameArray[0],                                   // Name Character 1
            nameArray[1],                                   // Name Character 2
            nameArray[2],                                   // Name Character 3
            nameArray[3],                                   // Name Character 4
            nameArray[4],                                   // Name Character 5
            nameArray[5],                                   // Name Character 6
            nameArray[6],                                   // Name Character 7
            nameArray[7],                                   // Name Character 8
            nameArray[8],                                   // Name Character 9
            nameArray[9],                                   // Name Character 10
            onOff                                           // voice data end - OP on/off
            //checksum,                                     // checksum
            //0xf7                                          // 0b1111_0111 ; EOX
        ];
        
        for (let i = 6; i < buffer.length; i++) {
            checksum += buffer[i];
        }
        checksum &= 0xff;
        checksum = (~checksum) + 1;
        checksum &= 0x7f;
        buffer.push(checksum);
        buffer.push(0xf7);
        
        return buffer;
    }
    
    const sendSysexMessage = () => {
        let message = sysexMessage();
        let throttleTimer = 300;
        
        setTimeout(() => {
            currentOutput.send(message);
        }, throttleTimer);
    }
    
    const sendSysexDump = () => {
        let buffer = sysexBuffer();
        let throttleTimer = 300;
        
        setTimeout(() => {
            currentOutput.send(buffer);
        }, throttleTimer);
    }
    
    const initPatch = () => {
        setPatchAltered(true);
        setCurrentAlgorithm('_algorithm1');
        setCurrentAlgorithmNumerical(1);
        setGlobalParams({
            name: 'Init',
            settings: {
                feedback: 0,
                oscKeySync: 0,
                transpose: 12
            },
            lfo: {
                speed: 0,
                delay: 0,
                pitchModulationDepth: 0,
                amplitudeModulationDepth: 0,
                sync: 0,
                lfoWaveform: 0,
                pitchModulationSensitivity: 0
            },
            pitchEnvelope: {
                rate1: 0,
                rate2: 0,
                rate3: 0,
                rate4: 0,
                level1: 50,
                level2: 50,
                level3: 50, 
                level4: 50
            },
            global: {
                monoPoly: 0,
                pitchBendRange: 12,
                pitchBendStep: 0,
                modulationWheelRange: 99,
                modulationWheelAssign: 1
            },
            performance: {
                portamentoMode: 0,
                portamentoGliss: 0,
                portamentoTime: 0,
                footControlRange: 0,
                footControlAssign: 0,
                breathControlRange: 0,
                breathControlAssign: 0,
                aftertouchRange: 0,
                aftertouchAssign: 0
            }
        });
        setOperatorParams({
            operator1: {
                operatorOn: 'On',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            },
            operator2: {
                operatorOn: 'Off',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            },
            operator3: {
                operatorOn: 'Off',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            },
            operator4: {
                operatorOn: 'Off',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            },
            operator5: {
                operatorOn: 'Off',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            },
            operator6: {
                operatorOn: 'Off',
                outputLevel: 99,
                envelopeR1: 0,
                envelopeL1: 99,
                envelopeR2: 0,
                envelopeL2: 99,
                envelopeR3: 0,
                envelopeL3: 99,
                envelopeR4: 0,
                envelopeL4: 0,
                levelScaleBreakPoint: 60,
                levelScaleLeftDepth: 50,
                levelScaleLeftCurve: 0,
                levelScaleRightDepth: 50,
                levelScaleRightCurve: 3,
                oscMode: 0,
                freqCoarse: 1,
                freqFine: 0,
                detune: 7,
                oscRateScale: 0,
                amplitudeModSense: 0,
                keyVelocitySense: 0
            }
        });
        sendSysexDump();
        setCurrentPatchUuid(null);
    }
    
    const copyOpSubmit = () => {
        let deepCopy = {...operatorParams};
        
        for (const key in deepCopy['operator' + copyTo]) {
            deepCopy['operator' + copyTo][key] = deepCopy['operator' + copyFrom][key];
        }
        
        setOperatorParams(deepCopy);
        setCopyOpDialogStatus('Inactive');
        setVolcaFmContainerState('Active');
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const cancelCopyOpDialog = () => {
        setCopyOpDialogStatus('Inactive');
        setVolcaFmContainerState('Active');
    }
    
    const displayCopyOpDialog = () => {
        setCopyOpDialogStatus('Active');
        setVolcaFmContainerState('Inactive');
    }
    
    const updateCopyFrom = (val) => {
        setCopyFrom(val);
    }
    
    const updateCopyTo = (val) => {
        setCopyTo(val);
    }
    
    const submitSaveAsDialog = (val) => {
        
        if (val === '') {
            return;
        } else {
            const patch = {
                user_uuid: user.uuid,
                patch_name: val,
                algorithm: currentAlgorithmNumerical,
                settings: globalParams.settings,
                lfo: globalParams.lfo,
                pitch_envelope: globalParams.pitchEnvelope,
                global: globalParams.global,
                performance: globalParams.performance,
                operatorParams: operatorParams
            }
            axios.post(`/volca_fm_patches/patch`, patch)
            .then(() => {
                setSaveAsDialogStatus('Inactive'); 
                setVolcaFmContainerState('Active');
            });
        }
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsDialogStatus('Inactive'); 
        setVolcaFmContainerState('Active');
    }
    
    const executeSaveAsDialog = () => {
        setSaveAsDialogStatus('Active');
        setVolcaFmContainerState('Inactive');
        document.getElementById('saveAsInput').focus();
    }
    
    const updateChangeAsName = (val) => {
        setSaveAsName(val);
        sendSysexDump();
    }
    
    const savePatch = () => {
        const patch = {
            user_uuid: user.uuid,
            patch_name: globalParams.name,
            algorithm: currentAlgorithmNumerical,
            settings: globalParams.settings,
            lfo: globalParams.lfo,
            pitch_envelope: globalParams.pitchEnvelope,
            global: globalParams.global,
            performance: globalParams.performance,
            operatorParams: operatorParams
        }
        
        if (currentPatchUuid === null) {
            axios.post(`/volca_fm_patches/patch`, patch)
            .then(responseData => {
                setCurrentPatchUuid(responseData.data.uuid);
                setPatchAltered(false);
            });
        } else {
            axios.patch(`/volca_fm_patches/patch/${currentPatchUuid}`, patch)
            .then(() => {
                setPatchAltered(false);
            });
        }
        
    }
    
    const revertPatch = () => {
        if (currentPatchUuid !== null) {
            axios.get(`/volca_fm_patches/patch/${currentPatchUuid}`)
            .then(patchData => {
                const patch = patchData.data;
                setCurrentAlgorithmNumerical(patch.algorithm);
                setCurrentAlgorithm('_algorithm' + patch.algorithm.toString());
                setGlobalParams({
                    name: patch.patch_name,
                    settings: patch.settings,
                    lfo: patch.lfo,
                    pitchEnvelope: patch.pitch_envelope,
                    global: patch.global,
                    performance: patch.performance
                });
                setOperatorParams(patch.operatorParams);
                sendSysexDump();
                sendSysexMessage();
                setPatchAltered(false);
            });
        }
    }
    
    const patchNameUpdate = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.name = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updateFeedbackValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.settings.feedback = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const toggleOscKeySync = () => {
        let deepCopy = {...globalParams};
        
        if (deepCopy.settings.oscKeySync === 0) {
            deepCopy.settings.oscKeySync = 1;
        } else {
            deepCopy.settings.oscKeySync = 0;
        }
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updateTransposeValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.settings.transpose = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updateAmplitudeModulationDepthValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.amplitudeModulationDepth = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updatePitchDepthValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.pitchModulationDepth = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updateModulationSpeedValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.speed = val;
        
        setGlobalParams(deepCopy);
        sendSysexDump();
    }
    
    const updateModulationDelayValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.delay = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updatePitchModulationSensitivityValue = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.pitchModulationSensitivity = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const setLfoWaveform = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.lfo.lfoWaveform = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const toggleLfoKeySync = () => {
        let deepCopy = {...globalParams};
        
        if (deepCopy.lfo.sync === 0) {
            deepCopy.lfo.sync = 1;
        } else {
            deepCopy.lfo.sync = 0;
        }
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updatepitchEnvelope = (param, val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.pitchEnvelope[param] = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const updateModulationRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.global.modulationWheelRange = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const assignModulationWheel = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.global.modulationWheelAssign = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const toggleMonoPoly = () => {
        let deepCopy = {...globalParams};
        
        if (deepCopy.global.monoPoly === 0) {
            deepCopy.global.monoPoly = 1;
        } else {
            deepCopy.global.monoPoly = 0;
        }
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updatePitchBendRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.global.pitchBendRange = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updatePitchBendStep = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.global.pitchBendStep = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const toggleGlissando = () => {
        let deepCopy = {...globalParams};
        
        if (deepCopy.performance.portamentoGliss === 0) {
            deepCopy.performance.portamentoGliss = 1;
        } else {
            deepCopy.performance.portamentoGliss = 0;
        }
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const toggleGlissandoMode = () => {
        let deepCopy = {...globalParams};
        
        if (deepCopy.performance.portamentoMode === 0) {
            deepCopy.performance.portamentoMode = 1;
        } else {
            deepCopy.performance.portamentoMode = 0;
        }
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updateGlissandoDepth = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.portamentoTime = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updateFootControlRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.footControlRange = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const setFootControlAssign = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.footControlAssign = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const setAftertouchAssign = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.aftertouchAssign = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const setBreathControlAssign = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.breathControlAssign = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updateAftertouchRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.aftertouchRange = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const updateBreathControlRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.performance.breathControlRange = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
        sendSysexMessage();
    }
    
    const translateTransposeValue = (val) => {
        let letter = '';
        
        switch(val % 12) {
            case(0):
                letter += 'C ';
                break;
            case(1):
                letter += 'C# ';
                break;
            case(2):
                letter += 'D ';
                break;
            case(3):
                letter += 'Eb ';
                break;
            case(4):
                letter += 'E ';
                break;
            case(5):
                letter += 'F ';
                break;
            case(6):
                letter += 'F# ';
                break;
            case(7):
                letter += 'G ';
                break;
            case(8):
                letter += 'Ab ';
                break;
            case(9):
                letter += 'A ';
                break;
            case(10):
                letter += 'Bb ';
                break;
            case(11):
                letter += 'B ';
                break;
            default:
                console.log('impossible transpose value');
        }
        if (val < 12) {
            letter += '1';
        } else if (val < 24) {
            letter += '2';
        } else if (val < 36) {
            letter += '3';
        } else if (val < 48) {
            letter += '4';
        } else {
            letter += '5';
        }
        
        return letter;
    }
    
    const assignGlobalPatchTabs = (tab) => {
        let settings, lfo, pitch, global, performance;
        switch(tab) {
            case('settings'):
                settings = 'globalSettingsTabActive';
                lfo = 'globalSettingsTabInactive';
                pitch = 'globalSettingsTabInactive';
                global = 'globalSettingsTabInactive';
                performance = 'globalSettingsTabInactive';
                break;
            case('lfo'):
                settings = 'globalSettingsTabInactive';
                lfo = 'globalSettingsTabActive';
                pitch = 'globalSettingsTabInactive';
                global = 'globalSettingsTabInactive';
                performance = 'globalSettingsTabInactive';
                break;
            case('pitch'):
                settings = 'globalSettingsTabInactive';
                lfo = 'globalSettingsTabInactive';
                pitch = 'globalSettingsTabActive';
                global = 'globalSettingsTabInactive';
                performance = 'globalSettingsTabInactive';
                break;
            case('global'):
                settings = 'globalSettingsTabInactive';
                lfo = 'globalSettingsTabInactive';
                pitch = 'globalSettingsTabInactive';
                global = 'globalSettingsTabActive';
                performance = 'globalSettingsTabInactive';
                break;
            case('performance'):
                settings = 'globalSettingsTabInactive';
                lfo = 'globalSettingsTabInactive';
                pitch = 'globalSettingsTabInactive';
                global = 'globalSettingsTabInactive';
                performance = 'globalSettingsTabActive';
                break;
            default:
                console.log('impossible tab');
        }
        
        setGlobalPatchState({
            settings: settings,
            lfo: lfo,
            pitch: pitch,
            global: global,
            performance: performance
        });
    }
    
    const updateDisplayPort = (op, purpose) => {
        let deepCopy = {...envelopeLevelState}
    
        switch(op) {
            case('pitch'):
                deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                deepCopy.pitch.envelope = 'pitchEnvelopeStateActive';
                break;
            case(0):
                deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                break;
            case(1):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateActive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateActive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');
                }
                break;
            case(2):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateActive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateActive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(3):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateActive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateActive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(4):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateActive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateActive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(5):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateActive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateActive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(6):
                switch(purpose) {
                    case('envelope'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateActive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateInactive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    case('scaling'):
                        deepCopy.operator1.envelopeState = 'operator1EnvelopeStateInactive';
                        deepCopy.operator1.levelState = 'operator1EnvelopeLevelStateInactive';
                        deepCopy.operator2.envelopeState = 'operator2EnvelopeStateInactive';
                        deepCopy.operator2.levelState = 'operator2EnvelopeLevelStateInactive';
                        deepCopy.operator3.envelopeState = 'operator3EnvelopeStateInactive';
                        deepCopy.operator3.levelState = 'operator3EnvelopeLevelStateInactive';
                        deepCopy.operator4.envelopeState = 'operator4EnvelopeStateInactive';
                        deepCopy.operator4.levelState = 'operator4EnvelopeLevelStateInactive';
                        deepCopy.operator5.envelopeState = 'operator5EnvelopeStateInactive';
                        deepCopy.operator5.levelState = 'operator5EnvelopeLevelStateInactive';
                        deepCopy.operator6.envelopeState = 'operator6EnvelopeStateInactive';
                        deepCopy.operator6.levelState = 'operator6EnvelopeLevelStateActive';
                        deepCopy.pitch.envelope = 'pitchEnvelopeStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            default:
                console.log('impossible op');
        }
        setEnvelopeLevelState(deepCopy);
    }
    
    const toggleOscMode = (op) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                if (deepCopy.operator1.oscMode === 0) {
                   deepCopy.operator1.oscMode = 1; 
                } else {
                    deepCopy.operator1.oscMode = 0;
                }
                break;
            case(2):
              if (deepCopy.operator2.oscMode === 0) {
                   deepCopy.operator2.oscMode = 1; 
                } else {
                    deepCopy.operator2.oscMode = 0;
                }
                break;
            case(3):
              if (deepCopy.operator3.oscMode === 0) {
                   deepCopy.operator3.oscMode = 1; 
                } else {
                    deepCopy.operator3.oscMode = 0;
                }
                break;
            case(4):
              if (deepCopy.operator4.oscMode === 0) {
                   deepCopy.operator4.oscMode = 1; 
                } else {
                    deepCopy.operator4.oscMode = 0;
                }
                break;
            case(5):
              if (deepCopy.operator5.oscMode === 0) {
                   deepCopy.operator5.oscMode = 1; 
                } else {
                    deepCopy.operator5.oscMode = 0;
                }
                break;
            case(6):
              if (deepCopy.operator6.oscMode === 0) {
                   deepCopy.operator6.oscMode = 1; 
                } else {
                    deepCopy.operator6.oscMode = 0;
                }
                break;
            default:
                console.log('impossible Osc Mode value');
        }
        
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }
    
    const operatorTuning = (op, tune, val) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator1.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator1.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator1.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator1.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator1.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator1.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (2):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator2.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator2.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator2.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator2.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator2.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator2.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (3):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator3.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator3.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator3.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator3.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator3.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator3.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (4):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator4.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator4.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator4.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator4.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator4.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator4.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (5):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator5.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator5.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator5.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator5.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator5.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator5.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (6):
                switch(tune) {
                    case('coarse'):
                        deepCopy.operator6.freqCoarse = val;
                        break;
                    case('fine'):
                        deepCopy.operator6.freqFine = val;
                        break;
                    case('detune'):
                        deepCopy.operator6.detune = val;
                        break;
                    case('oscRate'):
                        deepCopy.operator6.oscRateScale = val;
                        break;
                    case('ams'):
                        deepCopy.operator6.amplitudeModSense = val;
                        break;
                    case('kvs'):
                        deepCopy.operator6.keyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const changeCurveDepth = (op, side, val) => {
        let deepCopy = {...operatorParams};
    
        switch (op) {
            case (1):
                if (side === 'left') {
                    deepCopy.operator1.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator1.levelScaleRightDepth = val;
                }
                break;
            case (2):
                if (side === 'left') {
                    deepCopy.operator2.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator2.levelScaleRightDepth = val;
                }
                break;
            case (3):
                if (side === 'left') {
                    deepCopy.operator3.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator3.levelScaleRightDepth = val;
                }
                break;
            case (4):
                if (side === 'left') {
                    deepCopy.operator4.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator4.levelScaleRightDepth = val;
                }
                break;
            case (5):
                if (side === 'left') {
                    deepCopy.operator5.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator5.levelScaleRightDepth = val;
                }
                break;
            case (6):
                if (side === 'left') {
                    deepCopy.operator6.levelScaleLeftDepth = val;
                } else {
                    deepCopy.operator6.levelScaleRightDepth = val;
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const setCurveValue = (op, side, val) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                if (side === 'left') {
                    deepCopy.operator1.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator1.levelScaleRightCurve = parseInt(val);
                }
                break;
            case (2):
                if (side === 'left') {
                    deepCopy.operator2.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator2.levelScaleRightCurve = parseInt(val);
                }
                break;
            case (3):
                if (side === 'left') {
                    deepCopy.operator3.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator3.levelScaleRightCurve = parseInt(val);
                }
                break;
            case (4):
                if (side === 'left') {
                    deepCopy.operator4.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator4.levelScaleRightCurve = parseInt(val);
                }
                break;
            case (5):
                if (side === 'left') {
                    deepCopy.operator5.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator5.levelScaleRightCurve = parseInt(val);
                }
                break;
            case (6):
                if (side === 'left') {
                    deepCopy.operator6.levelScaleLeftCurve = parseInt(val);
                } else {
                    deepCopy.operator6.levelScaleRightCurve = parseInt(val);
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const changeBreakPoint = (op, val) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                deepCopy.operator1.levelScaleBreakPoint = val;
                break;
            case (2):
                deepCopy.operator2.levelScaleBreakPoint = val;
                break;
            case (3):
                deepCopy.operator3.levelScaleBreakPoint = val;
                break;
            case (4):
                deepCopy.operator4.levelScaleBreakPoint = val;
                break;
            case (5):
                deepCopy.operator5.levelScaleBreakPoint = val;
                break;
            case (6):
                deepCopy.operator6.levelScaleBreakPoint = val;
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const handleOperatorLevel = (op, val) => {
        let deepCopy = {...operatorParams};

        switch (op) {
            case (1):
                deepCopy.operator1.outputLevel = val;
                break;
            case (2):
                deepCopy.operator2.outputLevel = val;
                break;
            case (3):
                deepCopy.operator3.outputLevel = val;
                break;
            case (4):
                deepCopy.operator4.outputLevel = val;
                break;
            case (5):
                deepCopy.operator5.outputLevel = val;
                break;
            case (6):
                deepCopy.operator6.outputLevel = val;
                break;
            default:
                console.log('impossible condition');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();

    }

    const changeLevel = (op, level, val) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                switch (level) {
                    case (1):
                        deepCopy.operator1.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator1.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator1.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator1.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (2):
                switch (level) {
                    case (1):
                        deepCopy.operator2.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator2.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator2.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator2.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (3):
                switch (level) {
                    case (1):
                        deepCopy.operator3.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator3.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator3.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator3.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (4):
                switch (level) {
                    case (1):
                        deepCopy.operator4.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator4.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator4.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator4.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (5):
                switch (level) {
                    case (1):
                        deepCopy.operator5.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator5.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator5.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator5.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (6):
                switch (level) {
                    case (1):
                        deepCopy.operator6.envelopeL1 = val;
                        break;
                    case (2):
                        deepCopy.operator6.envelopeL2 = val;
                        break;
                    case (3):
                        deepCopy.operator6.envelopeL3 = val;
                        break;
                    case (4):
                        deepCopy.operator6.envelopeL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const changeRate = (op, rate, val) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                switch (rate) {
                    case (1):
                        deepCopy.operator1.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator1.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator1.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator1.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (2):
                switch (rate) {
                    case (1):
                        deepCopy.operator2.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator2.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator2.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator2.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (3):
                switch (rate) {
                    case (1):
                        deepCopy.operator3.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator3.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator3.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator3.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (4):
                switch (rate) {
                    case (1):
                        deepCopy.operator4.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator4.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator4.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator4.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (5):
                switch (rate) {
                    case (1):
                        deepCopy.operator5.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator5.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator5.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator5.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (6):
                switch (rate) {
                    case (1):
                        deepCopy.operator6.envelopeR1 = val;
                        break;
                    case (2):
                        deepCopy.operator6.envelopeR2 = val;
                        break;
                    case (3):
                        deepCopy.operator6.envelopeR3 = val;
                        break;
                    case (4):
                        deepCopy.operator6.envelopeR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const handleOpOnOffClick = (op) => {
        let deepCopy = {...operatorParams};
        
        switch (op) {
            case (1):
                if (deepCopy.operator1.operatorOn === 'On') {
                    deepCopy.operator1.operatorOn = 'Off';
                } else {
                    deepCopy.operator1.operatorOn = 'On';
                }
                break;
            case (2):
                if (deepCopy.operator2.operatorOn === 'On') {
                    deepCopy.operator2.operatorOn = 'Off';
                } else {
                    deepCopy.operator2.operatorOn = 'On';
                }
                break;
            case (3):
                if (deepCopy.operator3.operatorOn === 'On') {
                    deepCopy.operator3.operatorOn = 'Off';
                } else {
                    deepCopy.operator3.operatorOn = 'On';
                }
                break;
            case (4):
                if (deepCopy.operator4.operatorOn === 'On') {
                    deepCopy.operator4.operatorOn = 'Off';
                } else {
                    deepCopy.operator4.operatorOn = 'On';
                }
                break;
            case (5):
                if (deepCopy.operator5.operatorOn === 'On') {
                    deepCopy.operator5.operatorOn = 'Off';
                } else {
                    deepCopy.operator5.operatorOn = 'On';
                }
                break;
            case (6):
                if (deepCopy.operator6.operatorOn === 'On') {
                    deepCopy.operator6.operatorOn = 'Off';
                } else {
                    deepCopy.operator6.operatorOn = 'On';
                }
                break;
            default:
                console.log('impossible onoff');
        }

        setOperatorParams(deepCopy);
        setPatchAltered(true);
        sendSysexDump();
    }

    const handleOperatorClick = (op) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        let state2 = operatorEditorState.operator2.state;
        let envelope2 = operatorEditorState.operator2.envelopeTab;
        let scaling2 = operatorEditorState.operator2.scalingTab;
        let tuning2 = operatorEditorState.operator2.tuningTab;
        let state3 = operatorEditorState.operator3.state;
        let envelope3 = operatorEditorState.operator3.envelopeTab;
        let scaling3 = operatorEditorState.operator3.scalingTab;
        let tuning3 = operatorEditorState.operator3.tuningTab;
        let state4 = operatorEditorState.operator4.state;
        let envelope4 = operatorEditorState.operator4.envelopeTab;
        let scaling4 = operatorEditorState.operator4.scalingTab;
        let tuning4 = operatorEditorState.operator4.tuningTab;
        let state5 = operatorEditorState.operator5.state;
        let envelope5 = operatorEditorState.operator5.envelopeTab;
        let scaling5 = operatorEditorState.operator5.scalingTab;
        let tuning5 = operatorEditorState.operator5.tuningTab;
        let state6 = operatorEditorState.operator6.state;
        let envelope6 = operatorEditorState.operator6.envelopeTab;
        let scaling6 = operatorEditorState.operator6.scalingTab;
        let tuning6 = operatorEditorState.operator6.tuningTab;
        switch (op) {
            case (1):
                if (operatorEditorState.operator1.state === 'operator1EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateActive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                }
                break;
            case (2):
                if (operatorEditorState.operator2.state === 'operator2EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateActive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                }
                break;
            case (3):
                if (operatorEditorState.operator3.state === 'operator3EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateActive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                }
                break;
            case (4):
                if (operatorEditorState.operator4.state === 'operator4EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateActive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                }
                break;
            case (5):
                if (operatorEditorState.operator5.state === 'operator5EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateActive';
                    state6 = 'operator6EditStateInactive';
                }
                break;
            case (6):
                if (operatorEditorState.operator6.state === 'operator6EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                    state6 = 'operator6EditStateActive';
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
            },
            operator2: {
                state: state2,
                envelopeTab: envelope2,
                scalingTab: scaling2,
                tuningTab: tuning2
            },
            operator3: {
                state: state3,
                envelopeTab: envelope3,
                scalingTab: scaling3,
                tuningTab: tuning3
            },
            operator4: {
                state: state4,
                envelopeTab: envelope4,
                scalingTab: scaling4,
                tuningTab: tuning4
            },
            operator5: {
                state: state5,
                envelopeTab: envelope5,
                scalingTab: scaling5,
                tuningTab: tuning5
            },
            operator6: {
                state: state6,
                envelopeTab: envelope6,
                scalingTab: scaling6,
                tuningTab: tuning6
            }
        });
    }

    const handleOperatorTab = (op, tab) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        let state2 = operatorEditorState.operator2.state;
        let envelope2 = operatorEditorState.operator2.envelopeTab;
        let scaling2 = operatorEditorState.operator2.scalingTab;
        let tuning2 = operatorEditorState.operator2.tuningTab;
        let state3 = operatorEditorState.operator3.state;
        let envelope3 = operatorEditorState.operator3.envelopeTab;
        let scaling3 = operatorEditorState.operator3.scalingTab;
        let tuning3 = operatorEditorState.operator3.tuningTab;
        let state4 = operatorEditorState.operator4.state;
        let envelope4 = operatorEditorState.operator4.envelopeTab;
        let scaling4 = operatorEditorState.operator4.scalingTab;
        let tuning4 = operatorEditorState.operator4.tuningTab;
        let state5 = operatorEditorState.operator5.state;
        let envelope5 = operatorEditorState.operator5.envelopeTab;
        let scaling5 = operatorEditorState.operator5.scalingTab;
        let tuning5 = operatorEditorState.operator5.tuningTab;
        let state6 = operatorEditorState.operator6.state;
        let envelope6 = operatorEditorState.operator6.envelopeTab;
        let scaling6 = operatorEditorState.operator6.scalingTab;
        let tuning6 = operatorEditorState.operator6.tuningTab;
        switch (op) {
            case (1):
                switch (tab) {
                    case ('envelope'):
                        envelope1 = 'operatorEditorTabActive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabActive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (2):
                switch (tab) {
                    case ('envelope'):
                        envelope2 = 'operatorEditorTabActive';
                        scaling2 = 'operatorEditorTabInactive';
                        tuning2 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope2 = 'operatorEditorTabInactive';
                        scaling2 = 'operatorEditorTabActive';
                        tuning2 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope2 = 'operatorEditorTabInactive';
                        scaling2 = 'operatorEditorTabInactive';
                        tuning2 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (3):
                switch (tab) {
                    case ('envelope'):
                        envelope3 = 'operatorEditorTabActive';
                        scaling3 = 'operatorEditorTabInactive';
                        tuning3 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope3 = 'operatorEditorTabInactive';
                        scaling3 = 'operatorEditorTabActive';
                        tuning3 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope3 = 'operatorEditorTabInactive';
                        scaling3 = 'operatorEditorTabInactive';
                        tuning3 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (4):
                switch (tab) {
                    case ('envelope'):
                        envelope4 = 'operatorEditorTabActive';
                        scaling4 = 'operatorEditorTabInactive';
                        tuning4 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope4 = 'operatorEditorTabInactive';
                        scaling4 = 'operatorEditorTabActive';
                        tuning4 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope4 = 'operatorEditorTabInactive';
                        scaling4 = 'operatorEditorTabInactive';
                        tuning4 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (5):
                switch (tab) {
                    case ('envelope'):
                        envelope5 = 'operatorEditorTabActive';
                        scaling5 = 'operatorEditorTabInactive';
                        tuning5 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope5 = 'operatorEditorTabInactive';
                        scaling5 = 'operatorEditorTabActive';
                        tuning5 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope5 = 'operatorEditorTabInactive';
                        scaling5 = 'operatorEditorTabInactive';
                        tuning5 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (6):
                switch (tab) {
                    case ('envelope'):
                        envelope6 = 'operatorEditorTabActive';
                        scaling6 = 'operatorEditorTabInactive';
                        tuning6 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope6 = 'operatorEditorTabInactive';
                        scaling6 = 'operatorEditorTabActive';
                        tuning6 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope6 = 'operatorEditorTabInactive';
                        scaling6 = 'operatorEditorTabInactive';
                        tuning6 = 'operatorEditorTabActive';
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
            },
            operator2: {
                state: state2,
                envelopeTab: envelope2,
                scalingTab: scaling2,
                tuningTab: tuning2
            },
            operator3: {
                state: state3,
                envelopeTab: envelope3,
                scalingTab: scaling3,
                tuningTab: tuning3
            },
            operator4: {
                state: state4,
                envelopeTab: envelope4,
                scalingTab: scaling4,
                tuningTab: tuning4
            },
            operator5: {
                state: state5,
                envelopeTab: envelope5,
                scalingTab: scaling5,
                tuningTab: tuning5
            },
            operator6: {
                state: state6,
                envelopeTab: envelope6,
                scalingTab: scaling6,
                tuningTab: tuning6
            }
        });
    }

    const changeAlgorithm = (val) => {
        setCurrentAlgorithmNumerical(val);
        setCurrentAlgorithm('_algorithm' + val.toString());
        setPatchAltered(true);
        sendSysexDump();
    }

    const calculateBreakpointPitch = (val) => {
        let note = '';
        switch (val % 12) {
            case (0):
                note += 'A ';
                break;
            case (1):
                note += 'Bb ';
                break;
            case (2):
                note += 'B ';
                break;
            case (3):
                note += 'C ';
                break;
            case (4):
                note += 'C# ';
                break;
            case (5):
                note += 'D ';
                break;
            case (6):
                note += 'Eb ';
                break;
            case (7):
                note += 'E ';
                break;
            case (8):
                note += 'F ';
                break;
            case (9):
                note += 'F# ';
                break;
            case (10):
                note += 'G ';
                break;
            case (11):
                note += 'Ab ';
                break;
            default:
                console.log('impossible note value');
        }
        if (val < 3) {
            note += '-1';
        } else if (val < 15) {
            note += '0';
        } else if (val < 27) {
            note += '1';
        } else if (val < 39) {
            note += '2';
        } else if (val < 51) {
            note += '3';
        } else if (val < 63) {
            note += '4';
        } else if (val < 75) {
            note += '5';
        } else if (val < 87) {
            note += '6';
        } else if (val < 99) {
            note += '7';
        } else {
            note += '8';
        }

        return note;
    }

    const noteOnEvent = (key) => {
//        let index = 0;
//        for (let i = 0; i < outputs.length; i++) {
//            if (outputs[i].id === currentOutput.id) {
//                index = i;
//            }
//        }
        if (midiConnections === undefined) {
            navigator.requestMIDIAccess({ sysex: true })
            .then((midiAccess) => {               
                connections = midiConnection(midiAccess);
                setMidiConnections(connections);
                console.log(connections);
                setCurrentOutput(connections.currentOutput);
                setCurrentMidiChannel(connections.currentMidiChannel);
                setAvailableOutputs(connections.outputs);
                setAvailableInputs(connections.inputs);
                return;
            }, () => {
                alert('No MIDI ports accessible');
            });
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
    
    const panic = () => {
        setPanicState('panicOn');
        setVolcaFmContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('panicOff');
            setVolcaFmContainerState('Active');
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

//    initiateMidiAccess();
    
    function curveY1Value(op) {
        let val = 0;
        switch(op) {
            case(1):
                val = (envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler);
                break;
            default:
                console.log('impossible op');
        }
        
        return val.toString();
        
    }
    
    const loadModalOn = () => {
        setVolcaFmLoadModalState('_Active');
        setVolcaFmContainerState('Inactive');
        axios.get(`/volca_fm_patches/byuser/${user.uuid}`)
        .then(patchesData => {
            const patches = patchesData.data.sort((a, b) => {
                if (a.patch_name.toLowerCase() > b.patch_name.toLowerCase()) {
                    return 1;
                } else if (a.patch_name.toLowerCase() < b.patch_name.toLowerCase()) {
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
    
    const cancelPatchLoad = () => {
        setVolcaFmLoadModalState('_Inactive');
        setVolcaFmContainerState('Active');
    }
    
    const resetLoadPatchUuid = (val) => {
        setLoadPatchUuid(val);
    }
    
    const loadSelectedPatch = () => {
        axios.get(`/volca_fm_patches/patch/${loadPatchUuid}`)
        .then(patchData => {
            const patch = patchData.data;
            setCurrentAlgorithmNumerical(patch.algorithm);
            setCurrentAlgorithm('_algorithm' + patch.algorithm.toString());
            setGlobalParams({
                name: patch.patch_name,
                settings: patch.settings,
                lfo: patch.lfo,
                pitchEnvelope: patch.pitch_envelope,
                global: patch.global,
                performance: patch.performance
            });
            setOperatorParams(patch.operatorParams);
            setCurrentPatchUuid(loadPatchUuid);
            sendSysexDump();
            sendSysexMessage();
            setPatchAltered(false);
            cancelPatchLoad();
        });
    }
    
    return ( 
        <div>
            <div className={'volcaFmEditorContainer' + volcaFmContainerState + volcaFmMonth}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'volcaFmEditorImageDiv' + volcaFmMonth}>
                    <div className={'volcaFmEditorTopBar' + volcaFmMonth}>
                        <NavLink to="/"><img className={'volcaFmNavImage' + volcaFmMonth}
                            src={midiImage}></img></NavLink>
                    </div>
                    <h3 className={'volcaFmEditorTitle' + volcaFmMonth}>Volca FM Editor</h3>
                    <button className={'volcaFmLoadButton' + volcaFmMonth}
                        onClick={() => loadModalOn()}>load</button>
                    <input className={'volcaFmPatchNameInput' + volcaFmMonth}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'volcaFmPanicButton' + volcaFmMonth}
                        onClick={() => panic()}>panic!</button>
                    <div className={'volcaFmSidebarManager' + volcaFmMonth}>
                        <div className={'sidebarContainer' + volcaFmMonth}>
                            <img className={'volcaImage1' + volcaFmMonth}
                                src={volcaFmImg1} />
                            <button className={'saveButton' + patchAltered + volcaFmMonth}
                                onClick={() => savePatch()}>save</button>
                            <button className={'saveAsButton' + volcaFmMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'revertButton' + patchAltered + volcaFmMonth}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'midiOutputLabel' + volcaFmMonth}>midi output:</p>
                            <select className={'midiOutputSelect' + volcaFmMonth}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <p className={'midiChannelLabel' + volcaFmMonth}>channel:</p>
                            <input className={'midiChannelInput' + volcaFmMonth}
                                max="15"
                                min="0"
                                onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                step="1"
                                type="number"
                                value={currentMidiChannel}/>
                            <button className={'copyOpButton' + volcaFmMonth}
                                onClick={() => displayCopyOpDialog()}>copy op...</button>
                            <button className={'initButton' + volcaFmMonth}
                                onClick={() => initPatch()}>init</button>
                            <button className={'randomButton' + volcaFmMonth}
                                onClick={() => makeRandomPatch()}>random</button>
                            <button className={'aboutFMButton' + volcaFmMonth}
                                onClick={() => openVolcaFmAboutDiv()}>about</button>
                        </div>
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
                            {(operatorParams.operator1.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator1' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(1)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>1</p>
                            </div>
                            )}
                            {(operatorParams.operator1.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator1' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(1)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator1.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>1</p>
                            </div>
                            )}
                            {(operatorParams.operator2.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator2' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(2)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>2</p>
                            </div>
                            )}
                            {(operatorParams.operator2.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator2' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(2)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator2.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>2</p>
                            </div>
                            )}
                            {(operatorParams.operator3.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator3' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(3)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>3</p>
                            </div>
                            )}
                            {(operatorParams.operator3.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator3' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(3)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator3.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>3</p>
                            </div>
                            )}
                            {(operatorParams.operator4.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator4' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(4)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>4</p>
                            </div>
                            )}
                            {(operatorParams.operator4.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator4' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(4)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator4.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>4</p>
                            </div>
                            )}
                            {(operatorParams.operator5.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator5' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(5)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>5</p>
                            </div>
                            )}
                            {(operatorParams.operator5.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator5' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(5)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator5.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>5</p>
                            </div>
                            )}
                            {(operatorParams.operator6.operatorOn === 'Off') && (
                                <div className={'volcaFmAlgorithmOperator6' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(6)}
                                style={{opacity: '0.2'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>6</p>
                            </div>
                            )}
                            {(operatorParams.operator6.operatorOn === 'On') && (
                                <div className={'volcaFmAlgorithmOperator6' + currentAlgorithm + volcaFmMonth}
                                onClick={() => handleOperatorClick(6)}
                                style={{ transform: 'scale(' + (0.6 + (operatorParams.operator6.outputLevel / 100)).toString() + ')'}}>
                                <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>6</p>
                            </div>
                            )}
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
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(1, 'envelope')}>
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
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(1, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(1, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator1.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(1, 'left', e.target.value)}
                                            value={operatorParams.operator1.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(1, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(1, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(1, 'right', e.target.value)}
                                            value={operatorParams.operator1.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(1, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(1, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator1.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(1)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator1.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(1)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator1.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(1, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator1.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={operatorEditorState.operator2.state + volcaFmMonth}>
                            <div className={'operatorEditorToolbar' + volcaFmMonth}>
                                <div className={'operatorOnOffBox' + operatorParams.operator2.operatorOn + volcaFmMonth}
                                    onClick={() => handleOpOnOffClick(2)}>
                                    <div className={'opSwitchToggle' + operatorParams.operator2.operatorOn + volcaFmMonth}></div>
                                    {(operatorParams.operator2.operatorOn === 'On') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                    )}
                                    {(operatorParams.operator2.operatorOn === 'Off') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                            style={{transform: 'translateX(-40px)'}}>off</p>
                                    )}
                                </div>
                                <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 2</p>
                                {(operatorParams.operator2.operatorOn === 'On') && (
                                        <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'operatorMasterLevel' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => handleOperatorLevel(2, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.outputLevel}
                                                ></input>
                                        </div>
                                )}
                                {(operatorParams.operator2.operatorOn === 'On') && (
                                    <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(2, e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.outputLevel}></input>)}
                            </div>
                            <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                                <div className={operatorEditorState.operator2.envelopeTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(2, 'envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={operatorEditorState.operator2.scalingTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(2, 'scaling')}>
                                    <p>scaling</p>
                                </div>
                                <div className={operatorEditorState.operator2.tuningTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(2, 'tuning')}>
                                    <p>tuning</p>
                                </div>
                            </div>
                            {(operatorEditorState.operator2.envelopeTab === 'operatorEditorTabActive') && (
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(2, 'envelope')}>
                                    <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                            <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                                <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                                <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                                <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(2, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeR1}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeL1}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(2, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeR1}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(2, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeL1} />
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
                                                    onChange={(e) => changeRate(2, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeR2}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeL2}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(2, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeR2}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(2, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeL2} />
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
                                                    onChange={(e) => changeRate(2, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeR3}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeL3}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(2, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeR3}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(2, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeL3} />
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
                                                    onChange={(e) => changeRate(2, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeR4}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator2.envelopeL4}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(2, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeR4}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(2, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator2.envelopeL4} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator2.scalingTab === 'operatorEditorTabActive') && (
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(2, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(2, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator2.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(2, 'left', e.target.value)}
                                            value={operatorParams.operator2.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(2, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(2, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(2, 'right', e.target.value)}
                                            value={operatorParams.operator2.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(2, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(2, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator2.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(2)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator2.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(2)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator2.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(2, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator2.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={operatorEditorState.operator3.state + volcaFmMonth}>
                            <div className={'operatorEditorToolbar' + volcaFmMonth}>
                                <div className={'operatorOnOffBox' + operatorParams.operator3.operatorOn + volcaFmMonth}
                                    onClick={() => handleOpOnOffClick(3)}>
                                    <div className={'opSwitchToggle' + operatorParams.operator3.operatorOn + volcaFmMonth}></div>
                                    {(operatorParams.operator3.operatorOn === 'On') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                    )}
                                    {(operatorParams.operator3.operatorOn === 'Off') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                            style={{transform: 'translateX(-40px)'}}>off</p>
                                    )}
                                </div>
                                <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 3</p>
                                {(operatorParams.operator3.operatorOn === 'On') && (
                                        <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'operatorMasterLevel' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => handleOperatorLevel(3, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.outputLevel}
                                                ></input>
                                        </div>
                                )}
                                {(operatorParams.operator3.operatorOn === 'On') && (
                                    <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(3, e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.outputLevel}></input>)}
                            </div>
                            <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                                <div className={operatorEditorState.operator3.envelopeTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(3, 'envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={operatorEditorState.operator3.scalingTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(3, 'scaling')}>
                                    <p>scaling</p>
                                </div>
                                <div className={operatorEditorState.operator3.tuningTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(3, 'tuning')}>
                                    <p>tuning</p>
                                </div>
                            </div>
                            {(operatorEditorState.operator3.envelopeTab === 'operatorEditorTabActive') && (
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(3, 'envelope')}>
                                    <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                            <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                                <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                                <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                                <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(3, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeR1}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeL1}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(3, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeR1}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(3, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeL1} />
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
                                                    onChange={(e) => changeRate(3, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeR2}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeL2}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(3, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeR2}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(3, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeL2} />
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
                                                    onChange={(e) => changeRate(3, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeR3}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeL3}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(3, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeR3}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(3, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeL3} />
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
                                                    onChange={(e) => changeRate(3, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeR4}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator3.envelopeL4}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(3, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeR4}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(3, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator3.envelopeL4} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator3.scalingTab === 'operatorEditorTabActive') && (
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(3, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(3, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator3.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(3, 'left', e.target.value)}
                                            value={operatorParams.operator3.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(3, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(3, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(3, 'right', e.target.value)}
                                            value={operatorParams.operator3.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(3, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(3, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator3.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(3)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator3.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(3)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator3.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(3, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator3.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={operatorEditorState.operator4.state + volcaFmMonth}>
                            <div className={'operatorEditorToolbar' + volcaFmMonth}>
                                <div className={'operatorOnOffBox' + operatorParams.operator4.operatorOn + volcaFmMonth}
                                    onClick={() => handleOpOnOffClick(4)}>
                                    <div className={'opSwitchToggle' + operatorParams.operator4.operatorOn + volcaFmMonth}></div>
                                    {(operatorParams.operator4.operatorOn === 'On') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                    )}
                                    {(operatorParams.operator4.operatorOn === 'Off') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                            style={{transform: 'translateX(-40px)'}}>off</p>
                                    )}
                                </div>
                                <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 4</p>
                                {(operatorParams.operator4.operatorOn === 'On') && (
                                        <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'operatorMasterLevel' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => handleOperatorLevel(4, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.outputLevel}
                                                ></input>
                                        </div>
                                )}
                                {(operatorParams.operator4.operatorOn === 'On') && (
                                    <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(4, e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.outputLevel}></input>)}
                            </div>
                            <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                                <div className={operatorEditorState.operator4.envelopeTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(4, 'envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={operatorEditorState.operator4.scalingTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(4, 'scaling')}>
                                    <p>scaling</p>
                                </div>
                                <div className={operatorEditorState.operator4.tuningTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(4, 'tuning')}>
                                    <p>tuning</p>
                                </div>
                            </div>
                            {(operatorEditorState.operator4.envelopeTab === 'operatorEditorTabActive') && (
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(4, 'envelope')}>
                                    <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                            <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                                <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                                <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                                <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(4, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeR1}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeL1}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(4, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeR1}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(4, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeL1} />
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
                                                    onChange={(e) => changeRate(4, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeR2}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeL2}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(4, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeR2}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(4, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeL2} />
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
                                                    onChange={(e) => changeRate(4, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeR3}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeL3}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(4, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeR3}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(4, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeL3} />
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
                                                    onChange={(e) => changeRate(4, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeR4}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator4.envelopeL4}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(4, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeR4}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(4, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator4.envelopeL4} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator4.scalingTab === 'operatorEditorTabActive') && (
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(4, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(4, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator4.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(4, 'left', e.target.value)}
                                            value={operatorParams.operator4.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(4, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(4, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(4, 'right', e.target.value)}
                                            value={operatorParams.operator4.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(4, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(4, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator4.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(4)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator4.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(4)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator4.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(4, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator4.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={operatorEditorState.operator5.state + volcaFmMonth}>
                            <div className={'operatorEditorToolbar' + volcaFmMonth}>
                                <div className={'operatorOnOffBox' + operatorParams.operator5.operatorOn + volcaFmMonth}
                                    onClick={() => handleOpOnOffClick(5)}>
                                    <div className={'opSwitchToggle' + operatorParams.operator5.operatorOn + volcaFmMonth}></div>
                                    {(operatorParams.operator5.operatorOn === 'On') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                    )}
                                    {(operatorParams.operator5.operatorOn === 'Off') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                            style={{transform: 'translateX(-40px)'}}>off</p>
                                    )}
                                </div>
                                <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 5</p>
                                {(operatorParams.operator5.operatorOn === 'On') && (
                                        <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'operatorMasterLevel' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => handleOperatorLevel(5, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.outputLevel}
                                                ></input>
                                        </div>
                                )}
                                {(operatorParams.operator5.operatorOn === 'On') && (
                                    <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(5, e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.outputLevel}></input>)}
                            </div>
                            <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                                <div className={operatorEditorState.operator5.envelopeTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(5, 'envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={operatorEditorState.operator5.scalingTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(5, 'scaling')}>
                                    <p>scaling</p>
                                </div>
                                <div className={operatorEditorState.operator5.tuningTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(5, 'tuning')}>
                                    <p>tuning</p>
                                </div>
                            </div>
                            {(operatorEditorState.operator5.envelopeTab === 'operatorEditorTabActive') && (
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(5, 'envelope')}>
                                    <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                            <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                                <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                                <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                                <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(5, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeR1}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeL1}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(5, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeR1}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(5, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeL1} />
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
                                                    onChange={(e) => changeRate(5, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeR2}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeL2}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(5, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeR2}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(5, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeL2} />
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
                                                    onChange={(e) => changeRate(5, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeR3}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeL3}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(5, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeR3}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(5, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeL3} />
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
                                                    onChange={(e) => changeRate(5, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeR4}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator5.envelopeL4}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(5, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeR4}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(5, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator5.envelopeL4} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator5.scalingTab === 'operatorEditorTabActive') && (
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(5, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(5, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator5.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(5, 'left', e.target.value)}
                                            value={operatorParams.operator5.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(5, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(5, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(5, 'right', e.target.value)}
                                            value={operatorParams.operator5.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(5, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(5, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator5.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(5)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator5.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(5)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator5.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(5, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator5.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={operatorEditorState.operator6.state + volcaFmMonth}>
                            <div className={'operatorEditorToolbar' + volcaFmMonth}>
                                <div className={'operatorOnOffBox' + operatorParams.operator6.operatorOn + volcaFmMonth}
                                    onClick={() => handleOpOnOffClick(6)}>
                                    <div className={'opSwitchToggle' + operatorParams.operator6.operatorOn + volcaFmMonth}></div>
                                    {(operatorParams.operator6.operatorOn === 'On') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                    )}
                                    {(operatorParams.operator6.operatorOn === 'Off') && (
                                        <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                            style={{transform: 'translateX(-40px)'}}>off</p>
                                    )}
                                </div>
                                <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 6</p>
                                {(operatorParams.operator6.operatorOn === 'On') && (
                                        <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'operatorMasterLevel' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => handleOperatorLevel(6, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.outputLevel}
                                                ></input>
                                        </div>
                                )}
                                {(operatorParams.operator6.operatorOn === 'On') && (
                                    <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(6, e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.outputLevel}></input>)}
                            </div>
                            <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                                <div className={operatorEditorState.operator6.envelopeTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(6, 'envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={operatorEditorState.operator6.scalingTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(6, 'scaling')}>
                                    <p>scaling</p>
                                </div>
                                <div className={operatorEditorState.operator6.tuningTab + volcaFmMonth}
                                    onClick={() => handleOperatorTab(6, 'tuning')}>
                                    <p>tuning</p>
                                </div>
                            </div>
                            {(operatorEditorState.operator6.envelopeTab === 'operatorEditorTabActive') && (
                                <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(6, 'envelope')}>
                                    <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                            <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                                <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                                <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                                <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(6, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeR1}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(6, 1, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeL1}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(6, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeR1}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(6, 1, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeL1} />
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
                                                    onChange={(e) => changeRate(6, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeR2}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(6, 2, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeL2}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(6, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeR2}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(6, 2, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeL2} />
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
                                                    onChange={(e) => changeRate(6, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeR3}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(6, 3, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeL3}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(6, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeR3}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(6, 3, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeL3} />
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
                                                    onChange={(e) => changeRate(6, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeR4}/>
                                                <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(6, 4, e.target.value)}
                                                    type="number"
                                                    value={operatorParams.operator6.envelopeL4}/>
                                                <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorRangeSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeRate(6, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeR4}/>
                                                </div>
                                                <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                    <input className={'operatorLevelSlider' + volcaFmMonth}
                                                        max="99"
                                                        min="0"
                                                        onChange={(e) => changeLevel(6, 4, e.target.value)}
                                                        type="range"
                                                        value={operatorParams.operator6.envelopeL4} />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator6.scalingTab === 'operatorEditorTabActive') && (
                                <div className={'operatorScalingContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(6, 'scaling')}>
                                    <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                        <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeBreakPoint(6, e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.levelScaleBreakPoint} />
                                            </div>
                                        <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator6.levelScaleBreakPoint)}</p>
                                        <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                        <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(6, 'left', e.target.value)}
                                            value={operatorParams.operator6.levelScaleLeftCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                        <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(6, 'left', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.levelScaleLeftDepth} />
                                        <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(6, 'left', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.levelScaleLeftDepth} />
                                        </div>
                                        <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                        <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                            onChange={(e) => setCurveValue(6, 'right', e.target.value)}
                                            value={operatorParams.operator6.levelScaleRightCurve}>
                                            <option key="0" value="0">-linear</option>
                                            <option key="1" value="1">-exponential</option>
                                            <option key="2" value="2">exponential</option>
                                            <option key="3" value="3">linear</option>
                                        </select>
                                        <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                        <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(6, 'right', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.levelScaleRightDepth} />
                                        <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeCurveDepth(6, 'right', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.levelScaleRightDepth} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(operatorEditorState.operator6.tuningTab === 'operatorEditorTabActive') && (
                                <div className={'operatorTuningContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                        <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                        <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscMode(6)}>
                                            <p>fixed</p>
                                            <p>ratio</p>
                                        </div>
                                        <div className={'operatorOscModeSwitch' + operatorParams.operator6.oscMode + volcaFmMonth}
                                            onClick={() => toggleOscMode(6)}></div>
                                        <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                        <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'coarse', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.freqCoarse}/>
                                        <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="31"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'coarse', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.freqCoarse}/>
                                        </div>
                                        <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                        <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'fine', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.freqFine}/>
                                        <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'fine', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.freqFine}/>
                                        </div>
                                        <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                        <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'detune', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.detune -7}/>
                                        <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'detune', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.detune}/>
                                        </div>
                                        <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                        <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'oscRate', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.oscRateScale}/>
                                        <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="14"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'oscRate', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.oscRateScale}/>
                                        </div>
                                        <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                        <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'ams', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.amplitudeModSense}/>
                                        <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="3"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'ams', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.amplitudeModSense}/>
                                        </div>
                                        <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                        <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(6, 'kvs', e.target.value)}
                                            type="number"
                                            value={operatorParams.operator6.keyVelocitySense}/>
                                        <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                            <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => operatorTuning(6, 'kvs', e.target.value)}
                                                type="range"
                                                value={operatorParams.operator6.keyVelocitySense}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'volcaFmNonOpEditor' + volcaFmMonth}>
                        <div className={'volcaFmGlobalParametersContainer' + volcaFmMonth}>
                            <div className={'volcaFmGlobalParametersTabsBar' + volcaFmMonth}>
                                <div className={globalPatchState.settings + volcaFmMonth}
                                    onClick={() => assignGlobalPatchTabs('settings')}>
                                    <p>settings</p>
                                </div>
                                <div className={globalPatchState.lfo + volcaFmMonth}
                                    onClick={() => assignGlobalPatchTabs('lfo')}>
                                    <p>lfo</p>
                                </div>
                                <div className={globalPatchState.pitch + volcaFmMonth}
                                    onClick={() => assignGlobalPatchTabs('pitch')}>
                                    <p>pitch</p>
                                </div>
                                <div className={globalPatchState.global + volcaFmMonth}
                                    onClick={() => assignGlobalPatchTabs('global')}>
                                    <p>global</p>
                                </div>
                                <div className={globalPatchState.performance + volcaFmMonth}
                                    onClick={() => assignGlobalPatchTabs('performance')}>
                                    <p>performance</p>
                                </div>
                            </div>
                            {(globalPatchState.settings === 'globalSettingsTabActive') && (
                                <div className={'settingsContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'globalSettingsFeedbackContainer' + volcaFmMonth}>
                                        <p className={'feedbackLabel' + volcaFmMonth}>feedback:</p>
                                        <div className={'feedbackMasterLevelDiv' + volcaFmMonth}>
                                            <input className={'feedbackMasterLevel' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => updateFeedbackValue(e.target.value)}
                                                type="range"
                                                value={globalParams.settings.feedback} />
                                        </div>
                                        <input className={'feedbackInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => updateFeedbackValue(e.target.value)}
                                            type="number"
                                            value={globalParams.settings.feedback} />
                                    </div>
                                    <div className={'globalSettingsOscillatorKeySyncContainer' + volcaFmMonth}>
                                        <p className={'oscKeySyncLabel' + volcaFmMonth}>oscillator key sync:</p>
                                        <div className={'oscKeySyncSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleOscKeySync()}>
                                            <div className={'oscKeySwitch' + globalParams.settings.oscKeySync + volcaFmMonth}></div>
                                            <p>on</p>
                                            <p>off</p>
                                        </div>
                                    </div>
                                    <div className={'globalSettingsTransposeContainer' + volcaFmMonth}>
                                        <p className={'globalTransposeLabel' + volcaFmMonth}>transpose:</p>
                                        <div className={'transposeLevelDiv' + volcaFmMonth}>
                                            <input className={'transposeMasterLevel' + volcaFmMonth}
                                                max="48"
                                                min="0"
                                                onChange={(e) => updateTransposeValue(e.target.value)}
                                                type="range"
                                                value={globalParams.settings.transpose} />
                                        </div>
                                        <p className={'transposeInput' + volcaFmMonth}>{translateTransposeValue(globalParams.settings.transpose)}</p>
                                    </div>
                                </div>
                            )}
                            {(globalPatchState.lfo === 'globalSettingsTabActive') && (
                                <div className={'lfoContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>amplitude modulation depth:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateAmplitudeModulationDepthValue(e.target.value)}
                                            type="number"
                                            value={globalParams.lfo.amplitudeModulationDepth}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateAmplitudeModulationDepthValue(e.target.value)}
                                                type="range"
                                                value={globalParams.lfo.amplitudeModulationDepth}/>
                                        </div>
                                    </div>
                                    <div className={'pitchModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>pitch modulation depth:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatePitchDepthValue(e.target.value)}
                                            type="number"
                                            value={globalParams.lfo.pitchModulationDepth}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatePitchDepthValue(e.target.value)}
                                                type="range"
                                                value={globalParams.lfo.pitchModulationDepth}/>
                                        </div>
                                    </div>
                                    <div className={'modulationSpeedDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>modulation speed:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateModulationSpeedValue(e.target.value)}
                                            type="number"
                                            value={globalParams.lfo.speed}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateModulationSpeedValue(e.target.value)}
                                                type="range"
                                                value={globalParams.lfo.speed}/>
                                        </div>
                                    </div>
                                    <div className={'modulationDelayDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>modulation delay:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateModulationDelayValue(e.target.value)}
                                            type="number"
                                            value={globalParams.lfo.delay}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateModulationDelayValue(e.target.value)}
                                                type="range"
                                                value={globalParams.lfo.delay}/>
                                        </div>
                                    </div>
                                    <div className={'pitchModulationSensitivityDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>pitch modulation sensitivity:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => updatePitchModulationSensitivityValue(e.target.value)}
                                            type="number"
                                            value={globalParams.lfo.pitchModulationSensitivity}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="7"
                                                min="0"
                                                onChange={(e) => updatePitchModulationSensitivityValue(e.target.value)}
                                                type="range"
                                                value={globalParams.lfo.pitchModulationSensitivity}/>
                                        </div>
                                    </div>
                                    <div className={'modulationWaveformKeySyncDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>modulation waveform:</p>
                                        <select className={'lfoWaveformSelect' + volcaFmMonth}
                                            onChange={(e) => setLfoWaveform(e.target.value)}
                                            value={globalParams.lfo.lfoWaveform}>
                                            <option key="0" value="0">triangle</option>
                                            <option key="1" value="1">saw down</option>
                                            <option key="2" value="2">saw up</option>
                                            <option key="3" value="3">square</option>
                                            <option key="3" value="4">sine</option>
                                            <option key="3" value="5">sample-hold</option>
                                        </select>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>lfo key sync:</p>
                                        <div className={'oscKeySyncSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleLfoKeySync()}>
                                            <div className={'oscKeySwitch' + globalParams.lfo.sync + volcaFmMonth}></div>
                                            <p>on</p>
                                            <p>off</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(globalPatchState.pitch === 'globalSettingsTabActive') && (
                                <div className={'pitchContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort('pitch', '')}>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>rate 1:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('rate1', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.rate1}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('rate1', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.rate1}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>level 1:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('level1', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.level1}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('level1', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.level1}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>rate 2:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('rate2', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.rate2}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('rate2', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.rate2}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>level 2:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('level2', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.level2}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('level2', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.level2}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>rate 3:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('rate3', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.rate3}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('rate3', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.rate3}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>level 3:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('level3', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.level3}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('level3', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.level3}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>rate 4:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('rate4', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.rate4}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('rate4', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.rate4}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>level 4:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updatepitchEnvelope('level4', e.target.value)}
                                            type="number"
                                            value={globalParams.pitchEnvelope.level4}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updatepitchEnvelope('level4', e.target.value)}
                                                type="range"
                                                value={globalParams.pitchEnvelope.level4}/>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(globalPatchState.global === 'globalSettingsTabActive') && (
                                <div className={'globalPatchContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>modulation wheel range:</p>
                                            <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateModulationRange(e.target.value)}
                                                type="number"
                                                value={globalParams.global.modulationWheelRange}/>
                                            <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => updateModulationRange(e.target.value)}
                                                    type="range"
                                                    value={globalParams.global.modulationWheelRange}/>
                                            </div>
                                    </div>
                                    <div className={'modulationWaveformKeySyncDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>modulation wheel assign:</p>
                                        <select className={'lfoWaveformSelect' + volcaFmMonth}
                                            onChange={(e) => assignModulationWheel(e.target.value)}
                                            value={globalParams.global.modulationWheelAssign}>
                                            <option key="0" value="0">pitch</option>
                                            <option key="1" value="1">amplitude</option>
                                            <option key="2" value="2">eg bias</option>
                                        </select>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>mono/poly:</p>
                                        <div className={'polyMonoKeySyncSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleMonoPoly()}>
                                            <div className={'polyMonoKeySwitch' + globalParams.global.monoPoly + volcaFmMonth}></div>
                                            <p>mono</p>
                                            <p>poly</p>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>pitch bend range:</p>
                                            <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                                max="12"
                                                min="0"
                                                onChange={(e) => updatePitchBendRange(e.target.value)}
                                                type="number"
                                                value={globalParams.global.pitchBendRange}/>
                                            <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="12"
                                                    min="0"
                                                    onChange={(e) => updatePitchBendRange(e.target.value)}
                                                    type="range"
                                                    value={globalParams.global.pitchBendRange}/>
                                            </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>pitch bend step:</p>
                                            <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                                max="12"
                                                min="0"
                                                onChange={(e) => updatePitchBendStep(e.target.value)}
                                                type="number"
                                                value={globalParams.global.pitchBendStep}/>
                                            <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="12"
                                                    min="0"
                                                    onChange={(e) => updatePitchBendStep(e.target.value)}
                                                    type="range"
                                                    value={globalParams.global.pitchBendStep}/>
                                            </div>
                                    </div>
                                </div>
                            )}
                            {(globalPatchState.performance === 'globalSettingsTabActive') && (
                                <div className={'globalPerformanceContainer' + volcaFmMonth}
                                    onMouseDown={() => updateDisplayPort(0, '')}>
                                    <div className={'glissandoDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>glissando:</p>
                                        <div className={'glissandoSwitchDiv' + volcaFmMonth}
                                            onClick={() => toggleGlissando()}>
                                            <div className={'glissandoSwitch' + globalParams.performance.portamentoGliss + volcaFmMonth}></div>
                                            <p>on</p>
                                            <p>off</p>
                                        </div>
                                        {(globalParams.global.monoPoly === 0) && (
                                            <div>
                                                <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>mode:</p>
                                                <div className={'glissandoModeSwitchDiv' + volcaFmMonth}
                                                    onClick={() => toggleGlissandoMode()}>
                                                    <div className={'glissandoModeSwitch' + globalParams.performance.portamentoMode + volcaFmMonth}></div>
                                                    <p>follow</p>
                                                    <p>retain</p>
                                                </div>
                                            </div>
                                        )}
                                        {(globalParams.global.monoPoly === 1) && (
                                            <div>
                                                <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>mono:</p>
                                                <div className={'glissandoModeSwitchDiv' + volcaFmMonth}
                                                    onClick={() => toggleGlissandoMode()}>
                                                    <div className={'glissandoModeSwitch' + globalParams.performance.portamentoMode + volcaFmMonth}></div>
                                                    <p>finger</p>
                                                    <p>full</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>glissando depth:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateGlissandoDepth(e.target.value)}
                                            type="number"
                                            value={globalParams.performance.portamentoTime}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateGlissandoDepth(e.target.value)}
                                                type="range"
                                                value={globalParams.performance.portamentoTime}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>foot control range:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateFootControlRange(e.target.value)}
                                            type="number"
                                            value={globalParams.performance.footControlRange}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateFootControlRange(e.target.value)}
                                                type="range"
                                                value={globalParams.performance.footControlRange}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>aftertouch range:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateAftertouchRange(e.target.value)}
                                            type="number"
                                            value={globalParams.performance.aftertouchRange}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateAftertouchRange(e.target.value)}
                                                type="range"
                                                value={globalParams.performance.aftertouchRange}/>
                                        </div>
                                    </div>
                                    <div className={'amplitudeModulationDepthDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>breath controller range:</p>
                                        <input className={'amplitudeModulationDepthInput' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => updateBreathControlRange(e.target.value)}
                                            type="number"
                                            value={globalParams.performance.breathControlRange}/>
                                        <div className={'lfoRangeInputDiv' + volcaFmMonth}>
                                            <input className={'operatorRangeSlider' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => updateBreathControlRange(e.target.value)}
                                                type="range"
                                                value={globalParams.performance.breathControlRange}/>
                                        </div>
                                    </div>
                                    <div className={'glissandoDiv' + volcaFmMonth}>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>foot control assign:</p>
                                        <select className={'performanceSelect' + volcaFmMonth}
                                            onChange={(e) => setFootControlAssign(e.target.value)}
                                            value={globalParams.performance.footControlAssign}>
                                            <option key="0" value="0">pitch</option>
                                            <option key="1" value="1">amplitude</option>
                                            <option key="2" value="2">eg bias</option>
                                        </select>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>aftertouch assign:</p>
                                        <select className={'performanceSelect' + volcaFmMonth}
                                            onChange={(e) => setAftertouchAssign(e.target.value)}
                                            value={globalParams.performance.aftertouchAssign}>
                                            <option key="0" value="0">pitch</option>
                                            <option key="1" value="1">amplitude</option>
                                            <option key="2" value="2">eg bias</option>
                                        </select>
                                        <p className={'amplitudeModulationDepthLabel' + volcaFmMonth}>breath controller assign:</p>
                                        <select className={'performanceSelect' + volcaFmMonth}
                                            onChange={(e) => setBreathControlAssign(e.target.value)}
                                            value={globalParams.performance.breathControlAssign}>
                                            <option key="0" value="0">pitch</option>
                                            <option key="1" value="1">amplitude</option>
                                            <option key="2" value="2">eg bias</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'volcaEnvelopeLevelDisplay' + volcaFmMonth}>
                        <div className={envelopeLevelState.operator1.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler) + (operatorParams.operator1.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler) + (operatorParams.operator1.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator1.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator1.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator1.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator1.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator1.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator2.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler) + (operatorParams.operator2.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler) + (operatorParams.operator2.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator2.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator2.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator2.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator2.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator2.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator3.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler) + (operatorParams.operator3.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler) + (operatorParams.operator3.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator3.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator3.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator3.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator3.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator3.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator4.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler) + (operatorParams.operator4.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler) + (operatorParams.operator4.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator4.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator4.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator4.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator4.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator4.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator5.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler) + (operatorParams.operator5.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler) + (operatorParams.operator5.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator5.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator5.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator5.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator5.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator5.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator6.envelopeState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)}
                                            x2={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL1 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler) + (operatorParams.operator6.envelopeR2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler) + (operatorParams.operator6.envelopeR2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL2 * 2)} 
                                            x2={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler) + (operatorParams.operator6.envelopeR2 * rateScaler) + (operatorParams.operator6.envelopeR3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (operatorParams.operator6.envelopeR1 * rateScaler) + (operatorParams.operator6.envelopeR2 * rateScaler) + (operatorParams.operator6.envelopeR3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL3 * 2)} 
                                            x2={keyOffOnset + (operatorParams.operator6.envelopeR4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (operatorParams.operator6.envelopeR4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (operatorParams.operator6.envelopeL4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.operator6.levelState + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                                <div className={'scalingDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={0} 
                                            y1={envelopeGraphTopVal / 2} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal / 2}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={(operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)} 
                                            y1={envelopeGraphTopVal} 
                                            x2={(operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)} 
                                            y2={0}></line>
                                        {(operatorParams.operator6.levelScaleLeftCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator6.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleLeftCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator6.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleLeftCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator6.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleLeftCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator6.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleRightCurve === 0) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator6.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleRightCurve === 1) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator6.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleRightCurve === 2) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator6.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator6.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}
                                        {(operatorParams.operator6.levelScaleRightCurve === 3) && (
                                            <path 
                                            className={'op1KeyOnLine' + volcaFmMonth}
                                            d={'M ' + (operatorParams.operator6.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator6.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                        )}

                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className={envelopeLevelState.pitch.envelope + volcaFmMonth}>
                            <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                                <p className={'envelopeLevelLabel' + volcaFmMonth}>pitch</p>
                                <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                                <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                    <svg height="100%"
                                        width="100%">
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1="0" 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)} 
                                            x2={keyOnOffset} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)}
                                            x2={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level1 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level1 * 2)} 
                                            x2={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler) + (globalParams.pitchEnvelope.rate2 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level2 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler) + (globalParams.pitchEnvelope.rate2 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level2 * 2)} 
                                            x2={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler) + (globalParams.pitchEnvelope.rate2 * rateScaler) + (globalParams.pitchEnvelope.rate3 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOnOffset + (globalParams.pitchEnvelope.rate1 * rateScaler) + (globalParams.pitchEnvelope.rate2 * rateScaler) + (globalParams.pitchEnvelope.rate3 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level3 * 2)} 
                                            x2={keyOffOnset} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level3 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level3 * 2)} 
                                            x2={keyOffOnset + (globalParams.pitchEnvelope.rate4 * rateScaler)} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)}></line>
                                        <line className={'op1KeyOnLine' + volcaFmMonth} 
                                            x1={keyOffOnset + (globalParams.pitchEnvelope.rate4 * rateScaler)} 
                                            y1={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)} 
                                            x2={envelopeEndGraph} 
                                            y2={envelopeGraphTopVal - (globalParams.pitchEnvelope.level4 * 2)}></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'saveAsDialogDiv' + saveAsDialogStatus + volcaFmMonth}>
                <p>save as</p>
                <input className={'saveAsInput' + volcaFmMonth}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + globalParams.name}
                    value={saveAsName} />
                <div className={'saveAsButtonsDiv' + volcaFmMonth}>
                    <button className={'saveAsButtons' + volcaFmMonth}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'saveAsButtons' + volcaFmMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'copyOpDialogDiv' + copyOpDialogStatus + volcaFmMonth}>
                <p>copy operator</p>
                <div className={'copyOpInputsDiv' + volcaFmMonth}>
                    <div className={'copyInputs' + volcaFmMonth}>
                        <p>copy from:</p>
                        <input className={'copyOpNumberInput' + volcaFmMonth}
                            max="6"
                            min="1"
                            onChange={(e) => updateCopyFrom(e.target.value)}
                            type="number"
                            value={copyFrom}/>
                        <div className={'volcaFmOpCopierDiv' + volcaFmMonth}><input className={'volcaFmAlgorithmSlider' + volcaFmMonth}
                                max="6"
                                min="1"
                                onChange={(e) => updateCopyFrom(e.target.value)}
                                type="range"
                                value={copyFrom}></input></div>
                    </div>
                    <div className={'copyInputs' + volcaFmMonth}>
                        <p>copy to:</p>
                        <input className={'copyOpNumberInput' + volcaFmMonth} 
                            max="6"
                            min="1"
                            onChange={(e) => updateCopyTo(e.target.value)}
                            type="number"
                            value={copyTo}/>
                        <div className={'volcaFmOpCopierDiv' + volcaFmMonth}><input className={'volcaFmAlgorithmSlider' + volcaFmMonth}
                                max="6"
                                min="1"
                                onChange={(e) => updateCopyTo(e.target.value)}
                                type="range"
                                value={copyTo}></input></div>
                    </div>
                </div>
                <div className={'saveAsButtonsDiv' + volcaFmMonth}>
                    <button className={'saveAsButtons' + volcaFmMonth}
                        onClick={() => copyOpSubmit()}>submit</button>
                    <button className={'saveAsButtons' + volcaFmMonth}
                        onClick={() => cancelCopyOpDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheKorgVolcaFMDiv' + aboutVolcaFmDivState + volcaFmMonth}>
                <div className={'aboutTheKorgVolcaFMContent' + volcaFmMonth}>
                    <img className={'volcaAboutImg' + volcaFmMonth}
                        src={volcaFmImg1} />
                    <h2>Korg Volca FM</h2>
                    <p>The volca fm is a three-voice digital FM synthesizer that completely reproduces the sound engine of a classic FM synthesizer, and provides compatibility with it as well.</p>
                    <h2>Frequency Modulation Synthesis</h2>
                    <p>Frequency modulation synthesis (or FM synthesis) is a form of sound synthesis whereby the frequency of a waveform is changed by modulating its frequency with a modulator. The frequency of an oscillator is altered "in accordance with the amplitude of a modulating signal".</p>
                    <p>FM synthesis can create both harmonic and inharmonic sounds. To synthesize harmonic sounds, the modulating signal must have a harmonic relationship to the original carrier signal. As the amount of frequency modulation increases, the sound grows progressively complex. Through the use of modulators with frequencies that are non-integer multiples of the carrier signal (i.e. inharmonic), inharmonic bell-like and percussive spectra can be created.</p>
                    <p>FM synthesis using analog oscillators may result in pitch instability. However, FM synthesis can also be implemented digitally, which is more stable and became standard practice. Digital FM synthesis (implemented as phase modulation) was the basis of several musical instruments beginning as early as 1974. Yamaha built the first prototype digital synthesizer in 1974, based on FM synthesis, before commercially releasing the Yamaha GS-1 in 1980. The Synclavier I, manufactured by New England Digital Corporation beginning in 1978, included a digital FM synthesizer, using an FM synthesis algorithm licensed from Yamaha. Yamaha's groundbreaking DX7 synthesizer, released in 1983, brought FM to the forefront of synthesis in the mid-1980s.</p>
                    <p>FM synthesis had also become the usual setting for games and software until the mid-nineties. Through sound cards like the AdLib and Sound Blaster, IBM PCs popularized Yamaha chips like OPL2 and OPL3. OPNB was used as main basic sound generator board in SNK Neo Geo operated arcades (MVS) and home console (AES). The related OPN2 was used in the Fujitsu FM Towns Marty and Sega Genesis as one of its sound generator chips. Similarly, Sharp X68000 and MSX (Yamaha computer unit) also use FM-based soundchip, OPM.</p>
                    <h3>History</h3>
                    <p>The technique of the digital implementation of frequency modulation was developed by John Chowning (Chowning 1973, cited in Dodge &amp; Jerse 1997, p. 115) at Stanford University in 1967–68 and patented in 1975. Prior to that, the FM synthesis algorithm was licensed to Japanese company Yamaha in 1973. It was initially designed for radios to transmit voice by modulating one waveform's frequency with another's. This is why FM radio is called FM (frequency modulation).</p>
                    <p>The implementation commercialized by Yamaha (US Patent 4018121 Apr 1977 or U.S. Patent 4,018,121) is actually based on phase modulation, but the results end up being equivalent mathematically as both are essentially a special case of QAM.</p>
                    <p>Yamaha's engineers began adapting Chowning's algorithm for use in a commercial digital synthesizer, adding improvements such as the "key scaling" method to avoid the introduction of distortion that normally occurred in analog systems during frequency modulation, though it would take several years before Yamaha released their FM digital synthesizers. In the 1970s, Yamaha were granted a number of patents, under the company's former name "Nippon Gakki Seizo Kabushiki Kaisha", evolving Chowning's work. Yamaha built the first prototype FM digital synthesizer in 1974. Yamaha eventually commercialized FM synthesis technology with the Yamaha GS-1, the first FM digital synthesizer, released in 1980.</p>
                    <p>FM synthesis was the basis of some of the early generations of digital synthesizers, most notably those from Yamaha, as well as New England Digital Corporation under license from Yamaha. Yamaha's popular DX7 synthesizer, released in 1983, was ubiquitous throughout the 1980s. Several other models by Yamaha provided variations and evolutions of FM synthesis during that decade.</p>
                    <p>Yamaha had patented its hardware implementation of FM in the 1970s, allowing it to nearly monopolize the market for FM technology until the mid-1990s. Casio developed a related form of synthesis called phase distortion synthesis, used in its CZ range of synthesizers. It had a similar (but slightly differently derived) sound quality to the DX series. Don Buchla implemented FM on his instruments in the mid-1960s, prior to Yamaha's patent. His 158, 258 and 259 dual oscillator modules had a specific FM control voltage input, and the model 208 (Music Easel) had a modulation oscillator hard-wired to allow FM as well as AM of the primary oscillator. These early applications used analog oscillators, and this capability was also followed by other modular synthesizers and portable synthesizers including Minimoog and ARP Odyssey.</p>
                    <p>With the expiration of the Stanford University FM patent in 1995, digital FM synthesis can now be implemented freely by other manufacturers. The FM synthesis patent brought Stanford $20 million before it expired, making it (in 1994) "the second most lucrative licensing agreement in Stanford's history". FM today is mostly found in software-based synths such as FM8 by Native Instruments or Sytrus by Image-Line, but it has also been incorporated into the synthesis repertoire of some modern digital synthesizers, usually coexisting as an option alongside other methods of synthesis such as subtractive, sample-based synthesis, additive synthesis, and other techniques. The degree of complexity of the FM in such hardware synths may vary from simple 2-operator FM, to the highly flexible 6-operator engines of the Korg Kronos and Alesis Fusion, to creation of FM in extensively modular engines such as those in the latest synthesisers by Kurzweil Music Systems.</p>
                    <p>New hardware synths specifically marketed for their FM capabilities disappeared from the market after the release of the Yamaha SY99 and FS1R, and even those marketed their highly powerful FM abilities as counterparts to sample-based synthesis and formant synthesis respectively. However, well-developed FM synthesis options are a feature of Nord Lead synths manufactured by Clavia, the Alesis Fusion range, the Korg Oasys and Kronos and the Modor NF-1. Various other synthesizers offer limited FM abilities to supplement their main engines.</p>
                    <p>Most recently, in 2016, Korg released the Korg Volca FM, a, 3-voice, 6 operators FM iteration of the Korg Volca series of compact, affordable desktop modules, and Yamaha released the Montage, which combines a 128-voice sample-based engine with a 128-voice FM engine. This iteration of FM is called FM-X, and features 8 operators; each operator has a choice of several basic wave forms, but each wave form has several parameters to adjust its spectrum. The Yamaha Montage was followed by the more affordable Yamaha MODX in 2018, with 64-voice, 8 operators FM-X architecture in addition to a 128-voice sample-based engine. Elektron in 2018 launched the Digitone, an 8-voice, 4 operators FM synth featuring Elektron's renowned sequence engine.</p>
                    <p>FM-X synthesis was introduced with the Yamaha Montage synthesizers in 2016. FM-X uses 8 operators. Each FM-X operator has a set of multi-spectral wave forms to choose from, which means each FM-X operator can be equivalent to a stack of 3 or 4 DX7 FM operators. The list of selectable wave forms includes sine waves, the All1 and All2 wave forms, the Odd1 and Odd2 wave forms, and the Res1 and Res2 wave forms. The sine wave selection works the same as the DX7 wave forms. The All1 and All2 wave forms are a saw-tooth wave form. The Odd1 and Odd2 wave forms are pulse or square waves. These two types of wave forms can be used to model the basic harmonic peaks in the bottom of the harmonic spectrum of most instruments. The Res1 and Res2 wave forms move the spectral peak to a specific harmonic and can be used to model either triangular or rounded groups of harmonics further up in the spectrum of an instrument. Combining an All1 or Odd1 wave form with multiple Res1 (or Res2) wave forms (and adjusting their amplitudes) can model the harmonic spectrum of an instrument or sound.</p>
                    <p>Combining sets of 8 FM operators with multi-spectral wave forms began in 1999 by Yamaha in the FS1R. The FS1R had 16 operators, 8 standard FM operators and 8 additional operators that used a noise source rather than an oscillator as its sound source. By adding in tuneable noise sources the FS1R could model the sounds produced in the human voice and in a wind instrument, along with making percussion instrument sounds. The FS1R also contained an additional wave form called the Formant wave form. Formants can be used to model resonating body instrument sounds like the cello, violin, acoustic guitar, bassoon, English horn, or human voice. Formants can even be found in the harmonic spectrum of several brass instruments.</p>
                </div>
                <div className={'saveAsButtonsDiv' + volcaFmMonth}>
                    <button className={'saveAsButtons' + volcaFmMonth}
                        onClick={() => closeVolcaFmAboutDiv()}>close</button>
                </div>
            </div>
            <div className={panicState + volcaFmMonth}>
                <img src={currentSpinner} />
            </div>
            <div className={'volcaFmLoadModal' + volcaFmLoadModalState + volcaFmMonth}>
                <div className={'volcaFmLoadContainer' + volcaFmMonth}>
                    <p className={'volcaFmLoadTitle' + volcaFmMonth}>Load Volca FM Patch</p>
                    <select className={'volcaFmLoadSelector' + volcaFmMonth}
                        onChange={(e) => {resetLoadPatchUuid(e.target.value)}}
                        value={loadPatchUuid}>
                        {userPatches.map(patch => (
                                <option key={patch.uuid} value={patch.uuid}>{patch.patch_name}</option>))}
                    </select>
                    <button className={'volcaFmLoadLoadButton' + volcaFmMonth}
                        onClick={() => loadSelectedPatch()}>load</button>
                    <button className={'volcaFmLoadCancelButton' + volcaFmMonth}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
        </div>
        );
}


export default VolcaFm;
