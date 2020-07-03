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
import './volcaDrum.style.janb.css';
import './volcaDrum.style.janc.css';
import midi5pin from '../img/midi5pin.svg';
import volcaDrumImg1 from '../img/volcaDrumImg1.png';
import midiConnection from '../midiManager/midiConnection';
import axios from 'axios';

let connections;

function VolcaDrum(user, patch) {
        
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
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaDrumEditor/january/spinner/cloe-ferrara-loader1-0.gif';
    const janbSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaDrumEditor/january/spinner/CleanGiantFlea-small.gif';
    const jancSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaDrumEditor/january/spinner/jancdrums.gif';

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [panicState, setPanicState] = useState('volcaDrumPanicOff');
    const [currentSpinner, setCurrentSpinner] = useState(jancSpinner);
    const [volcaDrumLoadModalState, setVolcaDrumLoadModalState] = useState('_Inactive');
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [volcaDrumContainerState, setVolcaDrumContainerState] = useState('Active');
    const [saveAsName, setSaveAsName] = useState('');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('Inactive');
    const [aboutVolcaDrumDivState, setAboutVolcaDrumDivState] = useState('Inactive');
    const [volcaDrumMonth, setVolcaDrumMonth] = useState('_JanuaryC');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [loadPatchUuid, setLoadPatchUuid] = useState('');
    const [userPatches, setUserPatches] = useState([]);
    const [activeLayers, setActiveLayers] = useState([
       true, false, false, false, false, false 
    ]);
    const [globalParams, setGlobalParams] = useState({
        bitReduction: 0,
        name: 'default',
        overdriveGain: 0,
        pan: 64,
        premixGain: 64,
        send: 55,
        waveFolder: 0,
        waveGuide: {
            body: 0,
            decay: 0,
            tune: 0
        }
    });
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
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
                waveGuideModel: {
                    envelopeGenerators: [true, false, false],
                    pitchModulators: [true, false, false],
                    soundSource: [true, false, false, false, false]
                }
            },
            layerSelection: [true, false, false],
            patch: 0
        }
    ]);
    const [currentPatchUuid, setCurrentPatchUuid] = useState('');
    
    const cancelPatchLoad = () => {
        setVolcaDrumLoadModalState('_Inactive');
        setVolcaDrumContainerState('Active');
    } 
    
    const loadSelectedPatch = () => {
        axios.get(`/volca_drum_patches/patch/${loadPatchUuid}`)
        .then(patchData => {
            const loadPatch = patchData.data;
            setGlobalParams(loadPatch.globalParams);
            setCurrentPatch(loadPatch.patch.patch);
            setCurrentPatchUuid(loadPatchUuid);
            setPatchAltered(false);
            if (currentOutput.send) {
                sendVolcaDrumPatch();
            }
            cancelPatchLoad();
        });
    }
    
    const resetLoadPatchUuid = (val) => {
        setLoadPatchUuid(val);
    }
    
    const loadModalOn = () => {
        setVolcaDrumLoadModalState('_Active');
        setVolcaDrumContainerState('Inactive');
        axios.get(`/volca_drum_patches/byuser/${user.uuid}`)
        .then(patchesData => {
            const loadPatches = patchesData.data.sort((a, b) => {
                if (a.globalParams.name.toLowerCase() > b.globalParams.name.toLowerCase()) {
                    return 1;
                } else if (a.globalParams.name.toLowerCase() < b.globalParams.name.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            });
            setUserPatches(loadPatches);
            let loadUuid = null;
            if (patchesData.data.length > 0) {
                loadUuid = patchesData.data[0].uuid;
            }
            setLoadPatchUuid(loadUuid);
        });
    }
    
    const openVolcaDrumAboutDiv = () => {
        setVolcaDrumContainerState('Inactive');
        setAboutVolcaDrumDivState('Active');
    }
    
    const closeVolcaDrumAboutDiv = () => {
        setVolcaDrumContainerState('Active');
        setAboutVolcaDrumDivState('Inactive');
    }
    
    const waveGuideValue = (waveGuideSet) => {
        let value = 0;
        
        if (waveGuideSet.soundSource[0]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 0;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 3;
                } else {
                    value = 6;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 9;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 12;
                } else {
                    value = 15;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 18;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 20;
                } else {
                    value = 23;
                }
            }
        } else if (waveGuideSet.soundSource[1]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 26;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 29
                } else {
                    value = 32;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 35;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 37;
                } else {
                    value = 40;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 43;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 46;
                } else {
                    value = 49;
                }
            }
        } else if (waveGuideSet.soundSource[2]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 52;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 55;
                } else {
                    value = 57;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 60;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 63;
                } else {
                    value = 66;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 69;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 72;
                } else {
                    value = 74;
                }
            }
        } else if (waveGuideSet.soundSource[3]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 77;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 80;
                } else {
                    value = 83;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 86;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 89;
                } else {
                    value = 92;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 94;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 97;
                } else {
                    value = 100;
                }
            }
        } else {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 103;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 106;
                } else {
                    value = 109;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 111;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 114;
                } else {
                    value = 117;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 120;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 123;
                } else {
                    value = 126;
                }
            }
        }
        
        return value;
    }
    
    const sendVolcaDrumPatch = () => {
        
        currentOutput.send([0xB0 | currentMidiChannel, 0x31, globalParams.bitReduction]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x33, globalParams.overdriveGain]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0A, globalParams.pan]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x34, globalParams.premixGain]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x32, globalParams.waveFolder]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x76, globalParams.waveGuide.body]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x75, globalParams.waveGuide.decay]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x77, globalParams.waveGuide.tune]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x67, globalParams.send]);
        for (let channel = 0; channel < 6; channel++) {
            currentOutput.send([0xB0 | channel, 0x14, currentPatch[channel].layer1.envelopeGenerator.attack]);
            currentOutput.send([0xB0 | channel, 0x17, currentPatch[channel].layer1.envelopeGenerator.release]);
            currentOutput.send([0xB0 | channel, 0x11, currentPatch[channel].layer1.level]);
            currentOutput.send([0xB0 | channel, 0x1D, currentPatch[channel].layer1.modulation.amount]);
            currentOutput.send([0xB0 | channel, 0x2E, currentPatch[channel].layer1.modulation.rate]);
            currentOutput.send([0xB0 | channel, 0x1A, currentPatch[channel].layer1.pitch]);
            currentOutput.send([0xB0 | channel, 0x0E, waveGuideValue(currentPatch[channel].layer1.waveGuideModel)]);
            
            currentOutput.send([0xB0 | channel, 0x15, currentPatch[channel].layer2.envelopeGenerator.attack]);
            currentOutput.send([0xB0 | channel, 0x18, currentPatch[channel].layer2.envelopeGenerator.release]);
            currentOutput.send([0xB0 | channel, 0x12, currentPatch[channel].layer2.level]);
            currentOutput.send([0xB0 | channel, 0x1E, currentPatch[channel].layer2.modulation.amount]);
            currentOutput.send([0xB0 | channel, 0x2F, currentPatch[channel].layer2.modulation.rate]);
            currentOutput.send([0xB0 | channel, 0x1B, currentPatch[channel].layer2.pitch]);
            currentOutput.send([0xB0 | channel, 0x0F, waveGuideValue(currentPatch[channel].layer2.waveGuideModel)]);
            
            currentOutput.send([0xB0 | channel, 0x16, currentPatch[channel].layer12.envelopeGenerator.attack]);
            currentOutput.send([0xB0 | channel, 0x19, currentPatch[channel].layer12.envelopeGenerator.release]);
            currentOutput.send([0xB0 | channel, 0x13, currentPatch[channel].layer12.level]);
            currentOutput.send([0xB0 | channel, 0x1F, currentPatch[channel].layer12.modulation.amount]);
            currentOutput.send([0xB0 | channel, 0x30, currentPatch[channel].layer12.modulation.rate]);
            currentOutput.send([0xB0 | channel, 0x1C, currentPatch[channel].layer12.pitch]);
            currentOutput.send([0xB0 | channel, 0x10, waveGuideValue(currentPatch[channel].layer12.waveGuideModel)]);
        }
        
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
            send: Math.floor(Math.random() * 128),
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
        let egs, pms, ss;
        for (let part = 0; part < 6; part++) {
            egs = Math.floor(Math.random() * 3);
            pms = Math.floor(Math.random() * 3);
            ss = Math.floor(Math.random() * 5);
            for (let index = 0; index < 5; index++) {
                if (index === egs) {
                    newCurrent[part].layer1.waveGuideModel.envelopeGenerators[index] = true;
                } else {
                    if (index < 4) {
                        newCurrent[part].layer1.waveGuideModel.envelopeGenerators[index] = false;
                    }
                }
                if (index === pms) {
                    newCurrent[part].layer1.waveGuideModel.pitchModulators[index] = true;
                } else {
                    if (index < 4) {
                        newCurrent[part].layer1.waveGuideModel.pitchModulators[index] = false;
                    }
                }
                if (index === ss) {
                    newCurrent[part].layer1.waveGuideModel.soundSource[index] = true;
                } else {
                    newCurrent[part].layer1.waveGuideModel.soundSource[index] = false;
                }
            }
            egs = Math.floor(Math.random() * 3);
            pms = Math.floor(Math.random() * 3);
            ss = Math.floor(Math.random() * 5);
            for (let index2 = 0; index2 < 5; index2++) {
                if (index2 === egs) {
                    newCurrent[part].layer2.waveGuideModel.envelopeGenerators[index2] = true;
                } else {
                    if (index2 < 4) {
                        newCurrent[part].layer2.waveGuideModel.envelopeGenerators[index2] = false;
                    }
                }
                if (index2 === pms) {
                    newCurrent[part].layer2.waveGuideModel.pitchModulators[index2] = true;
                } else {
                    if (index2 < 4) {
                        newCurrent[part].layer2.waveGuideModel.pitchModulators[index2] = false;
                    }
                }
                if (index2 === ss) {
                    newCurrent[part].layer2.waveGuideModel.soundSource[index2] = true;
                } else {
                    newCurrent[part].layer2.waveGuideModel.soundSource[index2] = false;
                }
            }
            egs = Math.floor(Math.random() * 3);
            pms = Math.floor(Math.random() * 3);
            ss = Math.floor(Math.random() * 5);
            for (let index3 = 0; index3 < 5; index3++) {
                if (index3 === egs) {
                    newCurrent[part].layer12.waveGuideModel.envelopeGenerators[index3] = true;
                } else {
                    if (index3 < 4) {
                        newCurrent[part].layer12.waveGuideModel.envelopeGenerators[index3] = false;
                    }
                }
                if (index3 === pms) {
                    newCurrent[part].layer12.waveGuideModel.pitchModulators[index3] = true;
                } else {
                    if (index3 < 4) {
                        newCurrent[part].layer12.waveGuideModel.pitchModulators[index3] = false;
                    }
                }
                if (index3 === ss) {
                    newCurrent[part].layer12.waveGuideModel.soundSource[index3] = true;
                } else {
                    newCurrent[part].layer12.waveGuideModel.soundSource[index3] = false;
                }
            }
        }
        setCurrentPatch(newCurrent);
        if (currentOutput.send) {
            sendVolcaDrumPatch();
        }
        setPatchAltered(true);
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
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
                    waveGuideModel: {
                        envelopeGenerators: [true, false, false],
                        pitchModulators: [true, false, false],
                        soundSource: [true, false, false, false, false]
                    }
                },
                layerSelection: [true, false, false],
                patch: 3
            }
        ]);
        if (currentOutput.send) {
            sendVolcaDrumPatch();
        }
        setPatchAltered(true);
    }
    
    const updatePremixGain = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.premixGain = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x34, val]);
        setPatchAltered(true);
    }
    
    const updateOverdriveGain = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.overdriveGain = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x33, val]);
        setPatchAltered(true);
    }
    
    const updateWaveFolder = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveFolder = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x32, val]);
        setPatchAltered(true);
    }
    
    const updateBitReduction = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.bitReduction = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x31, val]);
        setPatchAltered(true);
    }
    
    const updatePan = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.pan = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0A, val]);
        setPatchAltered(true);
    }
    
    const updateDrumLayerSend = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.send = val;
        currentOutput.send([0xB0 | currentMidiChannel, 0x67, val]);
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const updateDrumLayerEGRelease = (layer, val) => {
        let deepCopy = [...currentPatch];
        
        switch(layer) {
            case(0):
                deepCopy[currentMidiChannel].layer1.envelopeGenerator.release = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x17, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.envelopeGenerator.release = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x18, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.envelopeGenerator.release = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x19, val]);
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
                currentOutput.send([0xB0 | currentMidiChannel, 0x15, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.envelopeGenerator.attack = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x16, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.envelopeGenerator.attack = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x17, val]);
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
                currentOutput.send([0xB0 | currentMidiChannel, 0x2E, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.modulation.rate = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x2F, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.modulation.rate = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x30, val]);
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
                currentOutput.send([0xB0 | currentMidiChannel, 0x1D, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.modulation.amount = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x1E, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.modulation.amount = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x1F, val]);
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
                currentOutput.send([0xB0 | currentMidiChannel, 0x1A, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.pitch = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x1B, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.pitch = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x1C, val]);
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
                currentOutput.send([0xB0 | currentMidiChannel, 0x11, val]);
                break;
            case(1):
                deepCopy[currentMidiChannel].layer2.level = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x12, val]);
                break;
            case(2):
                deepCopy[currentMidiChannel].layer12.level = val;
                currentOutput.send([0xB0 | currentMidiChannel, 0x13, val]);
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
    
    const updateWaveguideCCValue = (layer) => {
        if (layer === 0) {
            if (currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[0]) {
                if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 0]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 3]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 6]);
                   }
                } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 9]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 12]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 15]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 18]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 20]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 23]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[1]) {
                if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 26]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 29]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 32]);
                   }
                } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 35]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 37]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 40]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 43]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 46]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 49]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[2]) {
                if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 52]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 55]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 57]);
                   }
                } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 60]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 63]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 66]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 69]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 72]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 74]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[3]) {
                if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 77]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 80]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 83]);
                   }
                } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 86]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 89]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 92]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 94]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 97]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 100]);
                   }
                }
            } else {
                if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 103]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 106]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 109]);
                   }
                } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 111]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 114]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 117]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 120]);
                   } else if (currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 123]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0E, 126]);
                   }
                }
            }
        } else if (layer === 1) {
            if (currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[0]) {
                if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 0]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 3]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 6]);
                   }
                } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 9]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 12]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 15]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 18]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 20]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 23]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[1]) {
                if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 26]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 29]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 32]);
                   }
                } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 35]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 37]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 40]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 43]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 46]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 49]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[2]) {
                if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 52]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 55]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 57]);
                   }
                } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 60]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 63]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 66]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 69]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 72]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 74]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[3]) {
                if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 77]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 80]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 83]);
                   }
                } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 86]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 89]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 92]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 94]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 97]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 100]);
                   }
                }
            } else {
                if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 103]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 106]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 109]);
                   }
                } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 111]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 114]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 117]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 120]);
                   } else if (currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 123]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x0F, 126]);
                   }
                }
            } 
        } else {
           if (currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[0]) {
                if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 0]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 3]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 6]);
                   }
                } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 9]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 12]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 15]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 18]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 20]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 23]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[1]) {
                if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 26]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 29]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 32]);
                   }
                } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 35]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 37]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 40]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 43]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 46]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 49]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[2]) {
                if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 52]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 55]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 57]);
                   }
                } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 60]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 63]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 66]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 69]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 72]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 74]);
                   }
                }
            } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[3]) {
                if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 77]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 80]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 83]);
                   }
                } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 86]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 89]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 92]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 94]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 97]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 100]);
                   }
                }
            } else {
                if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0]) {
                   if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 103]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 106]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 109]);
                   }
                } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1]) {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 111]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 114]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 117]);
                   }
                } else {
                    if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 120]);
                   } else if (currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1]) {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 123]);
                   } else {
                       currentOutput.send([0xB0 | currentMidiChannel, 0x10, 126]);
                   }
                }
            } 
        }        
    }
    
    const updateWaveguideModelEnvelopeGenerator = (layer, index) => {
        let deepCopy = [...currentPatch];
        
        if (layer === 0) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[i] = false;
                }
            }
        } else if (layer === 1) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[i] = false;
                }
            }
        } else {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[i] = false;
                }
            }
        }

        setCurrentPatch(deepCopy);
        updateWaveguideCCValue(layer);
        setPatchAltered(true);
    }
    
    const updateWaveguideModelPitchModulator = (layer, index) => {
        let deepCopy = [...currentPatch];
        
        if (layer === 0) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer1.waveGuideModel.pitchModulators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.pitchModulators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.pitchModulators[i] = false;
                }
            }
        } else if (layer === 1) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer2.waveGuideModel.pitchModulators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.pitchModulators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.pitchModulators[i] = false;
                }
            }
        } else {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer12.waveGuideModel.pitchModulators.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.pitchModulators[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.pitchModulators[i] = false;
                }
            }
        }

        setCurrentPatch(deepCopy);
        updateWaveguideCCValue(layer);
        setPatchAltered(true);
    }
    
    const updateWaveguideModelSoundSource = (layer, index) => {
        let deepCopy = [...currentPatch];
        
        if (layer === 0) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer1.waveGuideModel.soundSource.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.soundSource[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer1.waveGuideModel.soundSource[i] = false;
                }
            }
        } else if (layer === 1) {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer2.waveGuideModel.soundSource.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.soundSource[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer2.waveGuideModel.soundSource[i] = false;
                }
            }
        } else {
            for (let i = 0; i < deepCopy[currentMidiChannel].layer12.waveGuideModel.soundSource.length; i++) {
                if (i === index) {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.soundSource[i] = true;
                } else {
                    deepCopy[currentMidiChannel].layer12.waveGuideModel.soundSource[i] = false;
                }
            }
        }

        setCurrentPatch(deepCopy);
        updateWaveguideCCValue(layer);
        setPatchAltered(true);
    }
    
    const updateDecay = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.decay = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x75, val]);
        setPatchAltered(true);
    }
    
    const updateBody = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.body = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x76, val]);
        setPatchAltered(true);
    }
    
    const updateTune = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.waveGuide.tune = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x77, val]);
        setPatchAltered(true);
    }
    
    const updatePatchSetting = (val) => {
        let deepCopy = [...currentPatch];
        
        deepCopy[currentMidiChannel].patch = (val - 1);
        
        setCurrentPatch(deepCopy);
        currentOutput.send([0xC0 | currentMidiChannel, val]);
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
//        console.log(val);
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
        if (val === '') {
            return;
        } else {
            const saveAsPatch = {
                user_uuid: user.uuid,
                globalParams: globalParams,
                patch: {
                    patch: currentPatch
                }
            }
            saveAsPatch.globalParams.name = val;
            axios.post(`/volca_drum_patches/patch`, saveAsPatch)
            .then(() => {
                cancelSaveAsDialog();
            });
        }
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
        const patchObj = {
            user_uuid: user.uuid,
            globalParams: globalParams,
            patch: {
                patch: currentPatch
            }
        };
        if (currentPatchUuid === '') {
            axios.post(`/volca_drum_patches/patch`, patchObj)
            .then(responseData => {
                setCurrentPatchUuid(responseData.data.uuid);
                setPatchAltered(false);
            });
        } else {
            axios.patch(`/volca_drum_patches/patch/${currentPatchUuid}`, patchObj)
            .then(() => {
                setPatchAltered(false);
            });
        }
    }
    
    const revertPatch = () => {
        if (currentPatchUuid !== '') {
            axios.get(`/volca_drum_patches/patch/${currentPatchUuid}`)
            .then(patchData => {
                console.log(patchData.data);
                const patchRevert = patchData.data;
                setGlobalParams(patchRevert.globalParams);
                setCurrentPatch(patchRevert.patch.patch);
                setPatchAltered(false);
                if (currentOutput.send) {
                    sendVolcaDrumPatch();
                }
            });
        }        
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
                return;
            }, () => {
                alert('No MIDI ports accessible');
            });
        }
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
        setPanicState('volcaDrumPanicOn');
        setVolcaDrumContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('volcaDrumPanicOff');
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
                    <button className={'volcaDrumLoadButton' + volcaDrumMonth}
                        onClick={() => loadModalOn()}>load</button>
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
                            <button className={'saveButtonVolcaDrum' + patchAltered + volcaDrumMonth}
                                onClick={() => savePatch()}>save</button>
                            <button className={'saveAsButtonVolcaDrum' + volcaDrumMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'revertButtonVolcaDrum' + patchAltered + volcaDrumMonth}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'midiOutputVolcaDrumLabel' + volcaDrumMonth}>midi output:</p>
                            <select className={'midiOutputVolcaDrumSelect' + volcaDrumMonth}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <button className={'initVolcaDrumButton' + volcaDrumMonth}
                                onClick={() => initPatch()}>init</button>
                            <button className={'randomVolcaDrumButton' + volcaDrumMonth}
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
                                    onChange={(e) => updateDrumLayerSend(e.target.value)}
                                    type="number"
                                    value={globalParams.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(e.target.value)}
                                            type="range"
                                            value={globalParams.send}/>
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
                                    onChange={(e) => updateDrumLayerSend(e.target.value)}
                                    type="number"
                                    value={globalParams.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(e.target.value)}
                                            type="range"
                                            value={globalParams.send}/>
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
                                    onChange={(e) => updateDrumLayerSend(e.target.value)}
                                    type="number"
                                    value={globalParams.send}/>
                                    <div className={'volcaDrumLayerParamSliderContainer' + volcaDrumMonth}>
                                        <input 
                                            className={'volcaDrumWaveGuideDecaySlider' + volcaDrumMonth}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDrumLayerSend(e.target.value)}
                                            type="range"
                                            value={globalParams.send}/>
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
                        {currentPatch[currentMidiChannel].layerSelection[0] && (
                           <div className={'volcaDrumWaveguideContainer' + volcaDrumMonth}>
                                <p className={'volcaDrumWaveguideModelLabel' + volcaDrumMonth}>waveguide model</p>
                                <p className={'volcaDrumSoundSourceLabel' + volcaDrumMonth}>sound source</p>
                                <div className={'volcaDrumSoundSourceTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(0, 0)}>
                                        <p>sine wave</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(0, 1)}>
                                        <p>sawtooth</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(0, 2)}>
                                        <p>hpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[3] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(0, 3)}>
                                        <p>lpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.soundSource[4] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(0, 4)}>
                                        <p>bpf noise</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumPitchModulatorsLabel' + volcaDrumMonth}>pitch modulators</p>
                                <div className={'volcaDrumPitchModulatorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(0, 0)}>
                                        <p>rise-fall</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(0, 1)}>
                                        <p>oscillate</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.pitchModulators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(0, 2)}>
                                        <p>random</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumEnvelopeGeneratorsLabel' + volcaDrumMonth}>envelope generators</p>
                                <div className={'volcaDrumEnevelopeGeneratorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(0, 0)}>
                                        <p>linear</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(0, 1)}>
                                        <p>exponential</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer1.waveGuideModel.envelopeGenerators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(0, 2)}>
                                        <p>multi-peak</p>
                                    </div>
                                </div>
                            </div>     
                        )}
                        {currentPatch[currentMidiChannel].layerSelection[1] && (
                           <div className={'volcaDrumWaveguideContainer' + volcaDrumMonth}>
                                <p className={'volcaDrumWaveguideModelLabel' + volcaDrumMonth}>waveguide model</p>
                                <p className={'volcaDrumSoundSourceLabel' + volcaDrumMonth}>sound source</p>
                                <div className={'volcaDrumSoundSourceTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(1, 0)}>
                                        <p>sine wave</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(1, 1)}>
                                        <p>sawtooth</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(1, 2)}>
                                        <p>hpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[3] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(1, 3)}>
                                        <p>lpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.soundSource[4] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(1, 4)}>
                                        <p>bpf noise</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumPitchModulatorsLabel' + volcaDrumMonth}>pitch modulators</p>
                                <div className={'volcaDrumPitchModulatorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(1, 0)}>
                                        <p>rise-fall</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(1, 1)}>
                                        <p>oscillate</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.pitchModulators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(1, 2)}>
                                        <p>random</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumEnvelopeGeneratorsLabel' + volcaDrumMonth}>envelope generators</p>
                                <div className={'volcaDrumEnevelopeGeneratorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(1, 0)}>
                                        <p>linear</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(1, 1)}>
                                        <p>exponential</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer2.waveGuideModel.envelopeGenerators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(1, 2)}>
                                        <p>multi-peak</p>
                                    </div>
                                </div>
                            </div>     
                        )}
                        {currentPatch[currentMidiChannel].layerSelection[2] && (
                           <div className={'volcaDrumWaveguideContainer' + volcaDrumMonth}>
                                <p className={'volcaDrumWaveguideModelLabel' + volcaDrumMonth}>waveguide model</p>
                                <p className={'volcaDrumSoundSourceLabel' + volcaDrumMonth}>sound source</p>
                                <div className={'volcaDrumSoundSourceTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(2, 0)}>
                                        <p>sine wave</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(2, 1)}>
                                        <p>sawtooth</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(2, 2)}>
                                        <p>hpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[3] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(2, 3)}>
                                        <p>lpf noise</p>
                                    </div>
                                    <div className={'volcaDrumSoundSorceTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.soundSource[4] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelSoundSource(2, 4)}>
                                        <p>bpf noise</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumPitchModulatorsLabel' + volcaDrumMonth}>pitch modulators</p>
                                <div className={'volcaDrumPitchModulatorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(2, 0)}>
                                        <p>rise-fall</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(2, 1)}>
                                        <p>oscillate</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.pitchModulators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelPitchModulator(2, 2)}>
                                        <p>random</p>
                                    </div>
                                </div>
                                <p className={'volcaDrumEnvelopeGeneratorsLabel' + volcaDrumMonth}>envelope generators</p>
                                <div className={'volcaDrumEnevelopeGeneratorTabStrip' + volcaDrumMonth}>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[0] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(2, 0)}>
                                        <p>linear</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[1] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(2, 1)}>
                                        <p>exponential</p>
                                    </div>
                                    <div className={'volcaDrumPitchModulatorTab' + currentPatch[currentMidiChannel].layer12.waveGuideModel.envelopeGenerators[2] + volcaDrumMonth}
                                        onClick={() => updateWaveguideModelEnvelopeGenerator(2, 2)}>
                                        <p>multi-peak</p>
                                    </div>
                                </div>
                            </div>     
                        )}
                        
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
            <div className={'saveAsDialogVolcaDrumDiv' + saveAsDialogStatus + volcaDrumMonth}>
                <p>save as</p>
                <input className={'saveAsInputVolcaDrum' + volcaDrumMonth}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + globalParams.name}
                    value={saveAsName} />
                <div className={'saveAsButtonsVolcaDrumDiv' + volcaDrumMonth}>
                    <button className={'saveAsButtonsVolcaDrum' + volcaDrumMonth}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'saveAsButtonsVolcaDrum' + volcaDrumMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheKorgVolcaDrumDiv' + aboutVolcaDrumDivState + volcaDrumMonth}>
                <div className={'aboutTheKorgVolcaDrumContent' + volcaDrumMonth}>
                    <img className={'volcaDrumAboutImg' + volcaDrumMonth}
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
            <div className={panicState + volcaDrumMonth}>
                <img src={currentSpinner} />
            </div>
            <div className={'volcaDrumLoadModal' + volcaDrumLoadModalState + volcaDrumMonth}>
                <div className={'volcaDrumLoadContainer' + volcaDrumMonth}>
                    <p className={'volcaDrumLoadTitle' + volcaDrumMonth}>Load Volca Drum Patch</p>
                    <select className={'volcaDrumLoadSelector' + volcaDrumMonth}
                        onChange={(e) => {resetLoadPatchUuid(e.target.value)}}
                        value={loadPatchUuid}>
                        {userPatches.map(patch => (
                                <option key={patch.uuid} value={patch.uuid}>{patch.globalParams.name}</option>))}
                    </select>
                    <button className={'volcaDrumLoadLoadButton' + volcaDrumMonth}
                        onClick={() => loadSelectedPatch()}>load</button>
                    <button className={'volcaDrumLoadCancelButton' + volcaDrumMonth}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
        </div>
        );
}


export default VolcaDrum;
