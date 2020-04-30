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
import volcaDrumImg1 from '../img/volcaDrumImg1.png';
import midiConnection from '../midiManager/midiConnection';

let connections;

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

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [panicState, setPanicState] = useState('panicOff');
    const [currentSpinner, setCurrentSpinner] = useState(janaSpinner);
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [volcaDrumContainerState, setVolcaDrumContainerState] = useState('Active');
    const [saveAsName, setSaveAsName] = useState('');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('Inactive');
    const [aboutVolcaDrumDivState, setAboutVolcaDrumDivState] = useState('Inactive');
    const [volcaDrumMonth, setVolcaDrumMonth] = useState('_JanuaryA');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [activeLayers, setActiveLayers] = useState([
       true, false, false, false, false, false 
    ]);
    const [globalParams, setGlobalParams] = useState({
        bitReduction: 0,
        name: 'default',
        overdriveGain: 0,
        pan: 64,
        premixGain: 64,
        waveFolder: 0,
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
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 0
        },
        {
            layer1: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 0
        },
        {
            layer1: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 1
        },
        {
            layer1: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 1
        },
        {
            layer1: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 2
        },
        {
            layer1: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer2: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layer12: {
                envelopeGenerator: {
                    attack: 12,
                    release: 27
                },
                level: 100,
                modulation: {
                    amount: 55,
                    rate: 12
                },
                pitch: 55,
                send: 55
            },
            layerSelection: [true, false, false],
            patch: 3
        }
    ]);
    
    
    const openVolcaDrumAboutDiv = () => {
        setVolcaDrumContainerState('Inactive');
        setAboutVolcaDrumDivState('Active');
    }
    
    const closeVolcaDrumAboutDiv = () => {
        setVolcaDrumContainerState('Active');
        setAboutVolcaDrumDivState('Inactive');
    }
    
    const makeRandomPatch = () => {
        let soundSource = Math.floor(Math.random() * 5);
        let pitchModulator = Math.floor(Math.random() * 3);
        let eg = Math.floor(Math.random() * 3);
        let newGlobal = {
            bitReduction: Math.floor(Math.random() * 128),
            name: 'random',
            overdriveGain: Math.floor(Math.random() * 128),
            pan: Math.floor(Math.random() * 128),
            premixGain: Math.floor(Math.random() * 128),
            waveFolder: Math.floor(Math.random() * 128),
            waveGuide: {
                body: Math.floor(Math.random() * 128),
                decay: Math.floor(Math.random() * 128),
                tune: Math.floor(Math.random() * 128)
            },
            waveGuideModel: {
                envelopeGenerators: [true, false, false],
                pitchModulators: [true, false, false],
                soundSource: [true, false, false, false, false]
            }
        }
        for (let i = 0; i < 5; i++) {
            if (i === soundSource) {
                newGlobal.waveGuideModel.soundSource[i] = true;
            } else {
                newGlobal.waveGuideModel.soundSource[i] = false;
            }
        }
        for (let j = 0; j < 3; j++) {
            if (j === pitchModulator) {
                newGlobal.waveGuideModel.pitchModulators[j] = true;
            } else {
                newGlobal.waveGuideModel.pitchModulators[j] = false;
            }
            if (j === eg) {
                newGlobal.waveGuideModel.envelopeGenerators[j] = true;
            } else {
                newGlobal.waveGuideModel.envelopeGenerators[j] = false;
            }
        }
        setGlobalParams(newGlobal);
        let newCurrent = [
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer2: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layer12: {
                    envelopeGenerator: {
                        attack: Math.floor(Math.random() * 128),
                        release: Math.floor(Math.random() * 128)
                    },
                    level: Math.floor(Math.random() * 128),
                    modulation: {
                        amount: Math.floor(Math.random() * 128),
                        rate: Math.floor(Math.random() * 128)
                    },
                    pitch: Math.floor(Math.random() * 128),
                    send: Math.floor(Math.random() * 128)
                },
                layerSelection: [true, false, false],
                patch: 0
            }
        ];
        let layerS;
        for (let k = 0; k < newCurrent.length; k++) {
            layerS = Math.floor(Math.random() * 3);
            for (let l = 0; l < 3; l++) {
                if (l === layerS) {
                    newCurrent[k].layerSelection[l] = true;
                } else {
                    newCurrent[k].layerSelection[l] = false;
                }
            }
        }
        setCurrentPatch(newCurrent);
    }
    
    const initPatch = () => {
        setGlobalParams({
            bitReduction: 0,
            name: 'init',
            overdriveGain: 0,
            pan: 64,
            premixGain: 64,
            waveFolder: 0,
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
        });
        setCurrentPatch([
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 0
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 1
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 1
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 2
            },
            {
                layer1: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer2: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layer12: {
                    envelopeGenerator: {
                        attack: 12,
                        release: 27
                    },
                    level: 100,
                    modulation: {
                        amount: 55,
                        rate: 12
                    },
                    pitch: 55,
                    send: 55
                },
                layerSelection: [true, false, false],
                patch: 3
            }
        ]);
    }
    
    const updatePremixGain = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.premixGain = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateOverdriveGain = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.overdriveGain = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateWaveFolder = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveFolder = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateBitReduction = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.bitReduction = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updatePan = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.pan = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerSend = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.send = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.send = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.send = val;
                break;
            default:
                console.log('impossible envelope generator release attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerEGRelease = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.envelopeGenerator.release = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.envelopeGenerator.release = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.envelopeGenerator.release = val;
                break;
            default:
                console.log('impossible envelope generator release attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerEGAttack = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.envelopeGenerator.attack = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.envelopeGenerator.attack = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.envelopeGenerator.attack = val;
                break;
            default:
                console.log('impossible envelope generator attack attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerModulationRate = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.modulation.rate = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.modulation.rate = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.modulation.rate = val;
                break;
            default:
                console.log('impossible modulation rate attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerModulationAmount = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.modulation.amount = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.modulation.amount = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.modulation.amount = val;
                break;
            default:
                console.log('impossible modulation amount attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerPitch = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.pitch = val;
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.pitch = val;
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.pitch = val;
                break;
            default:
                console.log('impossible pitch attribute');
        }
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
    }
    
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
        setPatchAltered(true);
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
        setPatchAltered(true);
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
        setPatchAltered(true);
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
        setPatchAltered(true);
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
        setPatchAltered(true);
    }
    
    const updateDecay = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.decay = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateBody = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.body = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateTune = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.tune = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updatePatchSetting = (val) => {
        let deepCopy = [...currentPatch];
        
        deepCopy[currentMidiChannel].patch = (val - 1);
        
        setCurrentPatch(deepCopy);
        setPatchAltered(true);
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
       setSaveAsDialogStatus('Inactive'); 
    setVolcaDrumContainerState('Active');
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsDialogStatus('Inactive'); 
        setVolcaDrumContainerState('Active');
    }
    
    const executeSaveAsDialog = () => {
        setSaveAsDialogStatus('Active');
        setVolcaDrumContainerState('Inactive');
        document.getElementById('saveAsInput').focus();
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
        let deepCopy = {...globalParams};
        
        deepCopy.name = val;
        
        setGlobalParams(deepCopy);
    }

    const noteOnEvent = (key) => {
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
            }, () => {
                alert('No MIDI ports accessible');
            });
        }
        console.log(currentOutput);
        let index = 0;
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
        console.log('initing inputs');
        if (inputs.length > 0) {
            setAvailableInputs(inputs);
            setAvailableOutputs(outputs);
            setCurrentOutput(outputs[0]);
            setCurrentMidiChannel(midiOutput);
            console.log(currentOutput);
            console.log(availableOutputs);

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
        if (currentOutput === 1) {
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
                    <input className={'volcaPatchNameInput' + volcaDrumMonth}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'volcaDrumPanicButton' + volcaDrumMonth}
                        onClick={() => panic()}>panic!</button>
                    
                    <div className={'volcaDrumSidebarManager' + volcaDrumMonth}>
                        <div className={'sidebarContainer' + volcaDrumMonth}>
                            <img className={'volcaDrumImage1' + volcaDrumMonth}
                                src={volcaDrumImg1} />
                            <button className={'saveButton' + patchAltered + volcaDrumMonth}
                                onClick={() => savePatch()}>save</button>
                            <button className={'saveAsButton' + volcaDrumMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'revertButton' + patchAltered + volcaDrumMonth}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'midiOutputLabel' + volcaDrumMonth}>midi output:</p>
                            <select className={'midiOutputSelect' + volcaDrumMonth}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <button className={'initButton' + volcaDrumMonth}
                                onClick={() => initPatch()}>init</button>
                            <button className={'randomButton' + volcaDrumMonth}
                                onClick={() => makeRandomPatch()}>random</button>
                            <button className={'aboutVolcaDrumButton' + volcaDrumMonth}
                                onClick={() => openVolcaDrumAboutDiv()}>about</button>
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
                            value={((currentPatch[currentMidiChannel].patch) + 1)}/>
                        <div className={'volcaDrumPatchSliderContainer' + volcaDrumMonth}>
                        <input 
                            className={'volcaDrumPatchSlider' + volcaDrumMonth}
                            max="16"
                            min="1"
                            onChange={(e) => updatePatchSetting(e.target.value)}
                            type="range"
                            value={((currentPatch[currentMidiChannel].patch) + 1)}/></div>
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
                            <p className={'volcaDrumModulationLabel' + volcaDrumMonth}>modulation</p>
                            <p className={'volcaDrumEGLabel' + volcaDrumMonth}>envelope generator</p>
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
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerPitchSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>pitch</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerPitch(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.pitch}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerPitch(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.pitch}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerPitchSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>pitch</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerPitch(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.pitch}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerPitch(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.pitch}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerPitchSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>pitch</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerPitch(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.pitch}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerPitch(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.pitch}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerModulationAmountSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>amount</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationAmount(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.modulation.amount}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationAmount(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.modulation.amount}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerModulationAmountSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>amount</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationAmount(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.modulation.amount}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationAmount(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.modulation.amount}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerModulationAmountSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>amount</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationAmount(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.modulation.amount}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationAmount(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.modulation.amount}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerModulationRateSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>rate</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationRate(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.modulation.rate}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationRate(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.modulation.rate}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerModulationRateSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>rate</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationRate(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.modulation.rate}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationRate(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.modulation.rate}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerModulationRateSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>rate</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerModulationRate(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.modulation.rate}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerModulationRate(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.modulation.rate}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerEGAttackSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>attack</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGAttack(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.envelopeGenerator.attack}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGAttack(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.envelopeGenerator.attack}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerEGAttackSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>attack</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGAttack(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.envelopeGenerator.attack}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGAttack(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.envelopeGenerator.attack}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerEGAttackSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>attack</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGAttack(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.envelopeGenerator.attack}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGAttack(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.envelopeGenerator.attack}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerEGReleaseSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>release</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGRelease(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.envelopeGenerator.release}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGRelease(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.envelopeGenerator.release}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerEGReleaseSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>release</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGRelease(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.envelopeGenerator.release}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGRelease(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.envelopeGenerator.release}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerEGReleaseSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>release</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerEGRelease(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.envelopeGenerator.release}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerEGRelease(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.envelopeGenerator.release}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[0] && (
                                <div className={'volcaDrumLayerSendSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>send</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerSend(0, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer1.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(0, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer1.send}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[1] && (
                                <div className={'volcaDrumLayerSendSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>send</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerSend(1, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer2.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(1, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer2.send}/>
                                    </div>
                                </div>
                            )}
                            {currentPatch[currentMidiChannel].layerSelection[2] && (
                                <div className={'volcaDrumLayerSendSlot' + volcaDrumMonth}>
                                    <p className={'volcaDrumLayerLevelLabel' + volcaDrumMonth}>send</p>
                                    <input 
                                    className={'volcaDrumLayerLevelInput' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateDrumLayerSend(2, e.target.value)}
                                    type="number"
                                    value={currentPatch[currentMidiChannel].layer12.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(2, e.target.value)}
                                            type="range"
                                            value={currentPatch[currentMidiChannel].layer12.send}/>
                                    </div>
                                </div>
                            )}
                            <div className={'volcaDrumVisualSendConnector' + volcaDrumMonth}></div>
                        </div>
                    </div>
                    <div className={'volcaDrumGeneralGlobalParamsDiv' + volcaDrumMonth}>
                        <div className={'volcaDrumGeneralGlobalParamsContainer' + volcaDrumMonth}>
                            <p className={'volcaDrumPanLabel' + volcaDrumMonth}>pan:</p>
                            <div className={'volcaDrumPanSliderContainer' + volcaDrumMonth}>
                                <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePan(e.target.value)}
                                    type="range"
                                    value={globalParams.pan}/>
                            </div>
                            <div className={'globalParamsBitReductionContainer' + volcaDrumMonth}>
                                <div className={'globalParamsBitReductionSliderContainer' + volcaDrumMonth}>
                                    <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateBitReduction(e.target.value)}
                                    type="range"
                                    value={globalParams.bitReduction}/>
                                </div>
                                <p className={'volcaDrumBitReductionLabel' + volcaDrumMonth}>bit reduction</p>
                                <input className={'volcaDrumBitReductionInput' + volcaDrumMonth} 
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateBitReduction(e.target.value)}
                                    type="number"
                                    value={globalParams.bitReduction}/>
                            </div>
                            <div className={'globalParamsWaveFolderContainer' + volcaDrumMonth}>
                                <div className={'globalParamsBitReductionSliderContainer' + volcaDrumMonth}>
                                    <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateWaveFolder(e.target.value)}
                                    type="range"
                                    value={globalParams.waveFolder}/>
                                </div>
                                <p className={'volcaDrumBitReductionLabel' + volcaDrumMonth}>wave folder</p>
                                <input className={'volcaDrumBitReductionInput' + volcaDrumMonth} 
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateWaveFolder(e.target.value)}
                                    type="number"
                                    value={globalParams.waveFolder}/>
                            </div>
                            <div className={'globalParamsOverdriveGainContainer' + volcaDrumMonth}>
                                <div className={'globalParamsBitReductionSliderContainer' + volcaDrumMonth}>
                                    <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateOverdriveGain(e.target.value)}
                                    type="range"
                                    value={globalParams.overdriveGain}/>
                                </div>
                                <p className={'volcaDrumBitReductionLabel' + volcaDrumMonth}>overdrive gain</p>
                                <input className={'volcaDrumBitReductionInput' + volcaDrumMonth} 
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateOverdriveGain(e.target.value)}
                                    type="number"
                                    value={globalParams.overdriveGain}/>
                            </div>
                            <div className={'globalParamsPremixGainContainer' + volcaDrumMonth}>
                                <div className={'globalParamsBitReductionSliderContainer' + volcaDrumMonth}>
                                    <input 
                                    className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePremixGain(e.target.value)}
                                    type="range"
                                    value={globalParams.premixGain}/>
                                </div>
                                <p className={'volcaDrumBitReductionLabel' + volcaDrumMonth}>premix gain</p>
                                <input className={'volcaDrumBitReductionInput' + volcaDrumMonth} 
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePremixGain(e.target.value)}
                                    type="number"
                                    value={globalParams.premixGain}/>
                            </div>
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
            <div className={'saveAsDialogDiv' + saveAsDialogStatus + volcaDrumMonth}>
                <p>save as</p>
                <input className={'saveAsInput' + volcaDrumMonth}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + globalParams.name}
                    value={saveAsName} />
                <div className={'saveAsButtonsDiv' + volcaDrumMonth}>
                    <button className={'saveAsButtons' + volcaDrumMonth}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'saveAsButtons' + volcaDrumMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheKorgVolcaDrumDiv' + aboutVolcaDrumDivState + volcaDrumMonth}>
                <div className={'aboutTheKorgVolcaDrumContent' + volcaDrumMonth}>
                    <img className={'volcaAboutImg' + volcaDrumMonth}
                        src={volcaDrumImg1} />
                    <h2>Korg Volca Drum</h2>
                    <p>The volca series is all about unique sound. Whether it's analog, PCM, or FM, the volca series puts unique sounds into an accessible platform. And now, the series is joined by a new rhythm machine that brings yet another sonic character. It's the volca drum digital percussion synthesizer.</p>
                    <p>Based on a simple trigger waveform, wave folder and overdrive are used to add overtones and distortion, and then a waveguide resonator effect brings the sound to life. The six-part DSP synth engine was designed with a completely different philosophy than conventional drum machines, and generates a wide range of unexpectedly different sounds. And of course, you can play those sounds from the volca-style sequencer.</p>
                    <h2>Digital percussion synth with a 6-part x 2-layer structure</h2>
                    <p>The term "digital" typically brings to mind sounds that are based on PCM-sampled bass drum, snare drum, or cymbal, but the volca drum creates its drum sounds by DSP-powered analog modeling. Oscillator waveforms such as sine wave, sawtooth wave, and noise are provided. By applying various changes to these waveforms, you can create a wide variety of percussion sounds that range from realistic to idiosyncratic, and are not limited only to drums.</p>
                    <p>The six parts each have two layers, and do not impose any rules or restrictions such as specifying which parts must be used for the bass drum or for the cymbal; all parts have the same specifications. You can freely assign your new sounds to these six parts without being limited by the conventions of a drum set. A kit consists of the six parts that you've assigned plus the waveguide resonator effect settings, and 16 such kits can be stored in memory (the factory settings contain 10 preload kits).</p>
                    <h2>Distinctive sound from a newly developed DSP engine</h2>
                    <p>Each part consists of two layers. For each layer, users choose one of five types of oscillator waveform including sine wave, sawtooth wave, and HPF noise, and also choose from three types of pitch modulator and amp EG, each optimized for drum sounds. Layer parameters can be edited either individually or simultaneously, and users can also use the two layers to produce the same sound for additional thickness.</p>
                    <p>You can customize the resulting trigger waveform by applying bit reduction to produce roughness, adjusting the wave folder depth to add complex overtones, and using overdrive to adjust the distortion. In this way, you can generate distinctive sounds from this sound engine that's structured rather differently from a typical drum machine.</p>
                    <p>Once you've specified the sound, you can adjust the balance of the parts by modifying the timing at which steps are heard, the pan, the gain before mixing, and the effect sends.</p>
                    <h2>Waveguide resonator adds rich resonances</h2>
                    <p>The effect section features a waveguide resonator that's based on physical modeling, and which adds sympathetic resonances to the sound. You can choose from two types of waveguide: "tube" which adds the resonance of a cylindrical object such as a drum body or a long pipe, or "strings" which adds the metallic resonance of a string. The three knobs located in the center of the panel let you specify the DECAY (amount of attenuation), BODY (sonic character), and TUNE (pitch). Setting TUNE to a lower value will produce a delay-like behavior. You can take advantage of these knobs not only for sound design but also in your live performances.</p>
                </div>
                <div className={'saveAsButtonsDiv' + volcaDrumMonth}>
                    <button className={'saveAsButtons' + volcaDrumMonth}
                        onClick={() => closeVolcaDrumAboutDiv()}>close</button>
                </div>
            </div>
        </div>
        );
}


export default VolcaDrum;
