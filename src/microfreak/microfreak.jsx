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
import './microfreak.style.janb.css';
import midi5pin from '../img/midi5pin.svg';
import axios from 'axios';
import midiConnection from '../midiManager/midiConnection';
import SkinsTable from '../skins/skins';

let connections = null;

const microImage = 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/microfreak-image.png';
const janASpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/microfreak/spinner/january/iceDrink.gif';
const janBSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/microfreak/spinner/january/cbd888bcfac514eccceb6fe4c61c4a6c.gif';

const assignments = [
    {
        uuid: '18679427-628f-4f5d-9301-7d8574a5acdb',
        name: 'glide'
    },
    {
        uuid: '6932b1eb-2b74-4fba-b3b3-56fef4e54a93',
        name: 'oscillator type'
    },
    {
        uuid: '0e1258ba-91b8-4696-9023-9490a18555ef',
        name: 'oscillator wave'
    },
    {
        uuid: 'f5ff6c36-e697-4979-a831-5ec1f604cf09',
        name: 'oscillator timbre'
    },
    {
        uuid: '20a4990b-bd04-4db5-a7e6-5b5a82bd5c36',
        name: 'oscillator shape'
    },
    {
        uuid: '94b48ca2-9f06-46fb-b5ff-d48540374025',
        name: 'filter cutoff'
    },
    {
        uuid: '7612309a-3513-409b-abb3-a5017e2e937e',
        name: 'filter resonance'
    },
    {
        uuid: 'b6baa583-0f97-4eda-ac27-4d85713605bf',
        name: 'envelope attack'
    },
    {
        uuid: 'fe6aeb2f-c534-46f1-9a64-63c87e375e96',
        name: 'envelope decay'
    },
    {
        uuid: '9a932b4f-526f-4771-bc22-60b0ab3f4c7c',
        name: 'envelope sustain'
    },
    {
        uuid: 'f926f66c-a6e6-4aef-84e1-36efba593c2d',
        name: 'envelope filter amount'
    },
    {
        uuid: 'c95daaf0-a6be-406a-a5bc-d320bce53b65',
        name: 'lfo rate'
    },
    {
        uuid: 'ac633511-3a1f-4744-8fdd-6c00ca0000d0',
        name: 'arpeggio rate'
    },
    {
        uuid: '292137de-9e41-446b-9d00-207836a1b84b',
        name: 'cycling envelope rise'
    },
    {
        uuid: '8bb89ccd-0824-44fc-9eba-28a58e9f362c',
        name: 'cycling envelope fall'
    },
    {
        uuid: '147679e0-79c6-42eb-971d-99c2bac46912',
        name: 'cycling envelope hold'
    },
    {
        uuid: 'c551d09c-0dba-4f52-881c-ca34e147e809',
        name: 'cycling envelope amount'
    },
    {
        uuid: '4355749d-178d-47d4-b68b-d678437ba44e',
        name: 'matrix modulation amount'
    }
];

function Microfreak(user, patch) {
    
    let keyEngaged = {};
    let rootNote = 60;
    let currentModulateModulate = '';
    
    const [microfreakContainerState, setMicrofreakContainerState] = useState('_Active');
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('_Inactive');
    const [aboutMicrofreakDivState, setAboutMicrofreakDivState] = useState('_Inactive');
    const [microfreakLoadModalState, setMicrofreakLoadModalState] = useState('_Inactive');
    const [microfreakMatrixState, setMicrofreakMatrixState] = useState('_Inactive');
    const [subModulateModalState, setSubModulateModalState] = useState('_Inactive');
    const [modulationModulation, setModulationModulation] = useState('');
    const [loadPatchUuid, setLoadPatchUuid] = useState('');
    const [currentSpinner, setCurrentSpinner] = useState(janBSpinner);
    const [userPatches, setUserPatches] = useState([]);
    const [microfreakMonth, setMicrofreakMonth] = useState('_JanuaryB');
    const [panicState, setPanicState] = useState('_Inactive');
    const [saveAsName, setSaveAsName] = useState('');
    const [patchAltered, setPatchAltered] = useState(false);
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
    const [envelopeTabs, setEnvelopeTabs] = useState({
        cyclingEnvelope: false,
        envelopeGenerator: true
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
            rateFree: 0,
            rateSync: 0,
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
            rateFree: 0,
            rateSync: 0,
            shape: 'sine',
            sync: false
        },
        paraphonic: false,
        spice: {
            dice: false,
            spice: true
        }
    });
    const [modulationMatrix, setModulationMatrix] = useState({
        assign1: '18679427-628f-4f5d-9301-7d8574a5acdb',
        assign2: '6932b1eb-2b74-4fba-b3b3-56fef4e54a93',
        assign3: '0e1258ba-91b8-4696-9023-9490a18555ef',
        assign1MatrixModulationTarget: null,
        assign2MatrixModulationTarget: null,
        assign3MatrixModulationTarget: null,
        currentDisplay: '',
        cycEnvAssign1: false,
        cycEnvAssign1Amount: 64,
        cycEnvAssign2: false,
        cycEnvAssign2Amount: 64,
        cycEnvAssign3: false,
        cycEnvAssign3Amount: 64,
        cycEnvCutoff: false,
        cycEnvCutoffAmount: 64,
        cycEnvPitch: false,
        cycEnvPitchAmount: 64,
        cycEnvTimbre: false,
        cycEnvTimbreAmount: 64,
        cycEnvWave: false,
        cycEnvWaveAmount: 64,
        envAssign1: false,
        envAssign1Amount: 64,
        envAssign2: false,
        envAssign2Amount: 64,
        envAssign3: false,
        envAssign3Amount: 64,
        envCutoff: false,
        envCutoffAmount: 64,
        envPitch: false,
        envPitchAmount: 64,
        envTimbre: false,
        envTimbreAmount: 64,
        envWave: false,
        envWaveAmount: 64,
        keyarpAssign1: false,
        keyarpAssign1Amount: 64,
        keyarpAssign2: false,
        keyarpAssign2Amount: 64,
        keyarpAssign3: false,
        keyarpAssign3Amount: 64,
        keyarpCutoff: false,
        keyarpCutoffAmount: 64,
        keyarpPitch: false,
        keyarpPitchAmount: 64,
        keyarpTimbre: false,
        keyarpTimbreAmount: 64,
        keyarpWave: false,
        keyarpWaveAmount: 64,
        lfoAssign1: false,
        lfoAssign1Amount: 64,
        lfoAssign2: false,
        lfoAssign2Amount: 64,
        lfoAssign3: false,
        lfoAssign3Amount: 64,
        lfoCutoff: false,
        lfoCutoffAmount: 64,
        lfoPitch: false,
        lfoPitchAmount: 64,
        lfoTimbre: false,
        lfoTimbreAmount: 64,
        lfoWave: false,
        lfoWaveAmount: 64,
        pressureAssign1: false,
        pressureAssign1Amount: 64,
        pressureAssign2: false,
        pressureAssign2Amount: 64,
        pressureAssign3: false,
        pressureAssign3Amount: 64,
        pressureCutoff: false,
        pressureCutoffAmount: 64,
        pressurePitch: false,
        pressurePitchAmount: 64,
        pressureTimbre: false,
        pressureTimbreAmount: 64,
        pressureWave: false,
        pressureWaveAmount: 64
    });
    
    const updateModulationMessage = (val) => {
        let message = '';
        let assign;
        
        switch(val) {
            case(''):
                break;
            case('cycEnvPitch'):
                message = 'modulating: cycling envelope → pitch';
                break;
            case('cycEnvWave'):
                message = 'modulating: cycling envelope → wave';
                break;
            case('cycEnvTimbre'):
                message = 'modulating: cycling envelope → timbre';
                break;
            case('cycEnvCutoff'):
                message = 'modulating: cycling envelope → cutoff';
                break;
            case('cycEnvAssign1'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                message = 'modulating: cycling envelope → assign1: ' + assign[0].name;
                break;
            case('cycEnvAssign2'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                message = 'modulating: cycling envelope → assign2: ' + assign[0].name;
                break;
            case('cycEnvAssign3'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                message = 'modulating: cycling envelope → assign3: ' + assign[0].name;
                break;
            case('envPitch'):
                message = 'modulating: envelope → pitch';
                break;
            case('envWave'):
                message = 'modulating: envelope → wave';
                break;
            case('envTimbre'):
                message = 'modulating: envelope → timbre';
                break;
            case('envCutoff'):
                message = 'modulating: envelope → cutoff';
                break;
            case('envAssign1'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                message = 'modulating: envelope → assign1: ' + assign[0].name;
                break;
            case('envAssign2'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                message = 'modulating: envelope → assign2: ' + assign[0].name;
                break;
            case('envAssign3'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                message = 'modulating: envelope → assign3: ' + assign[0].name;
                break;
            case('lfoPitch'):
                message = 'modulating: lfo → pitch';
                break;
            case('lfoWave'):
                message = 'modulating: lfo → wave';
                break;
            case('lfoTimbre'):
                message = 'modulating: lfo → timbre';
                break;
            case('lfoCutoff'):
                message = 'modulating: lfo → cutoff';
                break;
            case('lfoAssign1'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                message = 'modulating: lfo → assign1: ' + assign[0].name;
                break;
            case('lfoAssign2'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                message = 'modulating: lfo → assign2: ' + assign[0].name;
                break;
            case('lfoAssign3'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                message = 'modulating: lfo → assign3: ' + assign[0].name;
                break;
            case('pressurePitch'):
                message = 'modulating: pressure → pitch';
                break;
            case('pressureWave'):
                message = 'modulating: pressure → wave';
                break;
            case('pressureTimbre'):
                message = 'modulating: pressure → timbre';
                break;
            case('pressureCutoff'):
                message = 'modulating: pressure → cutoff';
                break;
            case('pressureAssign1'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                message = 'modulating: pressure → assign1: ' + assign[0].name;
                break;
            case('pressureAssign2'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                message = 'modulating: pressure → assign2: ' + assign[0].name;
                break;
            case('pressureAssign3'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                message = 'modulating: pressure → assign3: ' + assign[0].name;
                break;
            case('keyArpPitch'):
                message = 'modulating: key/arp → pitch';
                break;
            case('keyArpWave'):
                message = 'modulating: key/arp → wave';
                break;
            case('keyArpTimbre'):
                message = 'modulating: key/arp → timbre';
                break;
            case('keyArpCutoff'):
                message = 'modulating: key/arp → cutoff';
                break;
            case('keyArpAssign1'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                message = 'modulating: key/arp → assign1: ' + assign[0].name;
                break;
            case('keyArpAssign2'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                message = 'modulating: key/arp → assign2: ' + assign[0].name;
                break;
            case('keyArpAssign3'):
                assign = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                message = 'modulating: key/arp → assign3: ' + assign[0].name;
                break;
            default:
                console.log('ERROR - Unsupported modulator message');
        }
        setModulationModulation(message);
    }
    
    const calculateCurrentModulationDisplay = (val) => {
        let filteredOut;
        
        switch(val) {
            case(''):
                return '';
                break;
            case('cycEnvAssign1'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                return 'cycling envelope → ' + filteredOut[0].name;
                break;
            case('cycEnvAssign2'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                return 'cycling envelope → ' + filteredOut[0].name;
                break;
            case('cycEnvAssign3'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                return 'cycling envelope → ' + filteredOut[0].name;
                break;
            case('cycEnvCutoff'):
                return 'cycling envelope → analog filter cutoff';
                break;
            case('cycEnvPitch'):
                return 'cycling envelope → pitch';
                break;
            case('cycEnvTimbre'):
                return 'cycling envelope → timbre';
                break;
            case('cycEnvWave'):
                return 'cycling envelope → wave';
                break;
            case('envAssign1'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                return 'envelope → ' + filteredOut[0].name;
                break;
            case('envAssign2'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                return 'envelope → ' + filteredOut[0].name;
                break;
            case('envAssign3'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                return 'envelope → ' + filteredOut[0].name;
                break;
            case('envCutoff'):
                return 'envelope → analog filter cutoff';
                break;
            case('envPitch'):
                return 'envelope → pitch';
                break;
            case('envTimbre'):
                return 'envelope → timbre';
                break;
            case('envWave'):
                return 'envelope → wave';
                break;
            case('keyarpAssign1'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                return 'key arpeggiator → ' + filteredOut[0].name;
                break;
            case('keyarpAssign2'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                return 'key arpeggiator → ' + filteredOut[0].name;
                break;
            case('keyarpAssign3'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                return 'key arpegiator → ' + filteredOut[0].name;
                break;
            case('keyarpCutoff'):
                return 'key arpeggiator → analog filter cutoff';
                break;
            case('keyarpPitch'):
                return 'key arpeggiator → pitch';
                break;
            case('keyarpTimbre'):
                return 'key arpeggiator → timbre';
                break;
            case('keyarpWave'):
                return 'key arpeggiator → wave';
                break;
            case('lfoAssign1'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                return 'lfo → ' + filteredOut[0].name;
                break;
            case('lfoAssign2'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                return 'lfo → ' + filteredOut[0].name;
                break;
            case('lfoAssign3'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                return 'lfo → ' + filteredOut[0].name;
                break;
            case('lfoCutoff'):
                return 'lfo → analog filter cutoff';
                break;
            case('lfoPitch'):
                return 'lfo → pitch';
                break;
            case('lfoTimbre'):
                return 'lfo → timbre';
                break;
            case('lfoWave'):
                return 'lfo → wave';
                break;
            case('pressureAssign1'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign1);
                });
                return 'pressure → ' + filteredOut[0].name;
                break;
            case('pressureAssign2'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign2);
                });
                return 'pressure → ' + filteredOut[0].name;
                break;
            case('pressureAssign3'):
                filteredOut = assignments.filter(entry => {
                    return(entry.uuid === modulationMatrix.assign3);
                });
                return 'pressure → ' + filteredOut[0].name;
                break;
            case('pressureCutoff'):
                return 'pressure → analog filter cutoff';
                break;
            case('pressurePitch'):
                return 'pressure → pitch';
                break;
            case('pressureTimbre'):
                return 'pressure → timbre';
                break;
            case('pressureWave'):
                return 'pressure → wave';
                break;
            default:
                console.log('ERROR: Unsupported modulation configuration')
        }
    }
    
    const calculateModulationAmountDisplay = (val) => {
        return ((Math.round((2000/127) * val) - 1000) / 10).toFixed(1).toString();
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
    
    const updateChangeAsName = (val) => {
        setSaveAsName(val);
    }
    
    const microfreakSubmitSaveAsDialog = (val) => {
        if (val === '') {
            return;
        } 
//        else {
//            const patch = {
//                user_uuid: user.uuid,
//                patch_name: val,
//                algorithm: currentAlgorithmNumerical,
//                settings: globalParams.settings,
//                lfo: globalParams.lfo,
//                pitch_envelope: globalParams.pitchEnvelope,
//                global: globalParams.global,
//                performance: globalParams.performance,
//                operatorParams: operatorParams
//            }
//            axios.post(`/volca_fm_patches/patch`, patch)
//            .then(() => {
//                setSaveAsDialogStatus('Inactive'); 
//                setVolcaFmContainerState('Active');
//            });
//        }
    }
    
    const displayMatrix = () => {
        setMicrofreakContainerState('_Inactive');
        setMicrofreakMatrixState('_Active');
    }
    
    const closeModulationMatrix = () => {
        setMicrofreakContainerState('_Active');
        setMicrofreakMatrixState('_Inactive');
    }
    
    const openMicrofreakAboutDiv = () => {
        setMicrofreakContainerState('_Inactive');
        setAboutMicrofreakDivState('_Active');
    }
    
    const closeMicrofreakAboutDiv = () => {
        setMicrofreakContainerState('_Active');
        setAboutMicrofreakDivState('_Inactive');
    }
    
    const updateCurrentMidiChannel = (val) => {
        setCurrentMidiChannel(val);
    } 
    
    const cancelSaveAsDialog = () => {
        setMicrofreakContainerState('_Active');
        setSaveAsDialogStatus('_Inactive');
    }
    
    const executeSaveAsDialog = () => {
        setMicrofreakContainerState('_Inactive');
        setSaveAsDialogStatus('_Active');
        document.getElementById('microfreakSaveAsInput').focus();
    }
    
    const savePatch = () => {
        setPatchAltered(false);
        console.log('save patch');
    }
    
    const revertPatch = () => {
        setPatchAltered(false);
        console.log('revert patch');
    }
    
    const resetLoadPatchUuid = (val) => {
        setLoadPatchUuid(val);
    }
    
    const cancelPatchLoad = () => {
        setMicrofreakContainerState('_Active');
        setMicrofreakLoadModalState('_Inactive');
    }
    
    const openLoadModal = () => {
        setMicrofreakContainerState('_Inactive');
        setMicrofreakLoadModalState('_Active');
    }
    
    const loadSelectedPatch = () => {
//        axios.get(`/volca_fm_patches/patch/${loadPatchUuid}`)
//        .then(patchData => {
//            const patch = patchData.data;
//            setCurrentAlgorithmNumerical(patch.algorithm);
//            setCurrentAlgorithm('_algorithm' + patch.algorithm.toString());
//            setGlobalParams({
//                name: patch.patch_name,
//                settings: patch.settings,
//                lfo: patch.lfo,
//                pitchEnvelope: patch.pitch_envelope,
//                global: patch.global,
//                performance: patch.performance
//            });
//            setOperatorParams(patch.operatorParams);
//            setCurrentPatchUuid(loadPatchUuid);
//            sendSysexDump();
//            sendSysexMessage();
//            setPatchAltered(false);
//            cancelPatchLoad();
//        });
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
    
    const calculateLFORateDisplay = () => {
        let val;
        
        if (patchParams.lfo.sync) {
            val = patchParams.lfo.rateSync;
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
            val = patchParams.lfo.rateFree;
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
    
    const calculateARPRateDisplay = () => {
        let val;
        
        if (patchParams.arpeggiator.sync) {
            val = patchParams.arpeggiator.rateSync;
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
            val = patchParams.arpeggiator.rateFree;
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
        
        setPatchAltered(true);
        if (!currentOutput) {
            return;
        }
                
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
            case('filterType'):
                if (val === 'lpf') {
                    currentOutput.send([0xF0 | currentMidiChannel, 0x00, 0x20, 0x6B, 0x07, 0x01, 0x00, 0x07, 0x40, 0x02, 0x10, 0x01, 0x00, 0x00, 0xF7 ]);
                } else if (val === 'bpf') {
                    currentOutput.send([0xF0 | currentMidiChannel, 0x00, 0x20, 0x6B, 0x07, 0x01, 0x00, 0x07, 0x40, 0x02, 0x10, 0x01, 0xFF, 0x00, 0xF7 ]);
                } else {
                    currentOutput.send([0xF0 | currentMidiChannel, 0x00, 0x20, 0x6B, 0x07, 0x01, 0x00, 0x07, 0x40, 0x02, 0x10, 0x01, 0xFF, 0xFF, 0xF7 ]);
                }
                break;
            case('cutoff'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x17, val]);
                break;
            case('resonance'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x53, val]);
                break;
            case('amplitudeModulation'):
                if (val) {
                    // Switch amplitude modulation on
                } else {
                    // Switch amplitude modulation off
                }
                break;
            case('attack'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x69, val]);
                break;
            case('decayRelease'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x6A, val]);
                break;
            case('sustain'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x1D, val]);
                break;
            case('filterAmount'):
                // NRPN for envelope filter amount
//                currentOutput.send([0xB0 | currentMidiChannel, 0x1D, val]);
                break;
            case('cyclingEnvelopeMode'):
                if (val === 'env') {
                    // NRPN for cycling envelope set to env
                } else if (val === 'run') {
                    // NRPN for cycling envelope set to run
                } else {
                    // NRPN for cycling envelope set to loop
                }
                break;
            case('cycleRise'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x66, val]);
                break;
            case('riseShape'):
                // NRPN for cycling envelope rise shape
                break;
            case('fall'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x67, val]);
                break;
            case('fallShape'):
                // NRPN for cycling envelope fall shape
                break;
            case('holdSustain'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x1C, val]);
                break;
            case('cyclingAmount'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x18, val]);
                break;
            case('lfoShape'):
                if (val === 'sine') {
                    // NRPN for lfo shape set to sine
                } else if (val === 'triangle') {
                    // NRPN for lfo shape set to triangle
                } else if (val === 'sawtooth') {
                    // NRPN for lfo shape set to sawtooth
                } else if (val === 'square') {
                    // NRPN for lfo shape set to square
                } else if (val === 'sample&hold') {
                    // NRPN for lfo shape set to sample&hold
                } else {
                    // NRPN for lfo shape set to gliding
                }
                break;
            case('lfoSync'):
                if (val) {
                    // NRPN for lfo sync on
                } else {
                    // NRPN for lfo sync off
                }
                break;
            case('lfoRateFree'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x5D, val]);
                break;
            case('lfoRateSync'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x5E, val]);
                break;
            case('lfoRate'):
                if (patchParams.lfo.sync) {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x5E, val]);
                } else {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x5D, val]);
                }
                break;
            case('apreggiatorSwitch'):
                if (val) {
                    // NRPN for Arpeggiate ON
                } else {
                    // NRPN for Arpeggiate OFF
                }
                break;
            case('arpeggiatorSync'):
                if (val) {
                    // NRPN for Arpeggiate Sync ON
                } else {
                    // NRPN for Arpeggiate Sync OFF
                }
                break;
            case('arpeggiatorOctave'):
                if (val === 1) {
                    // NRPN for Arpeggiate Octave 1
                } else if (val === 2) {
                    // NRPN for Arpeggiate Octave 2
                } else if (val === 3) {
                    // NRPN for Arpeggiate Octave 3
                } else {
                    // NRPN for Arpeggiate Octave 4
                }
                break;
            case('arpRateFree'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x5B, val]);
                break;
            case('arpRateFixed'):
                currentOutput.send([0xB0 | currentMidiChannel, 0x5C, val]);
                break;
            case('arpRate'):
                if (patchParams.arpeggiator.sync) {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x5C, val]);
                } else {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x5B, val]);
                }
                break;
            case('arpPattern'):
                if (val === 'up') {
                    // NRPN for Arpeggiate up
                } else if (val === 'order') {
                    // NRPN for Arpeggiate order
                } else if (val === 'random') {
                    // NRPN for Arpeggiate random
                } else {
                    // NRPN for Arpeggiate pattern
                }
                break;
            case('keyHold'):
                if (val) {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x40, 127]);
                } else {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x40, 0]);
                }
                break;
            case('spiceState'):
                if (val) {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x02, 127]);
                    // NRPN to set dice state to false
                } else {
                    currentOutput.send([0xB0 | currentMidiChannel, 0x02, 0]);
                }
                break;
            case ('diceState'):
                if (val) {
                    // NRPB to set dice state to true
                    currentOutput.send([0xB0 | currentMidiChannel, 0x02, 0]);
                } else {
                    // NRPN to set dice state to false
                }
                break;
            case('paraphonicState'):
                if (val) {
                    // NRPN to set paraphonic to true 
                } else {
                    // NRPN to set paraphonic to false
                }
                break;
            case('cycEnvPitch'):
                if (val) {
                    // NRPN to set cycEnvPitch modulation ON
                } else {
                    // NRPN to set cycEnvPitch modulation OFF
                }
                break;
            case('cycEnvWave'):
                if (val) {
                    // NRPN to set cycEnvWave modulation ON
                } else {
                    // NRPN to set cycEnvWave modulation OFF
                }
                break;
            case('cycEnvTimbre'):
                if (val) {
                    // NRPN to set cycEnvTimbre modulation ON
                } else {
                    // NRPN to set cycEnvTimbre modulation OFF
                }
                break;
            case('cycEnvCutoff'):
                if (val) {
                    // NRPN to set cycEnvCutoff modulation ON
                } else {
                    // NRPN to set cycEnvCutoff modulation OFF
                }
                break;
            case('cycEnvAssign1'):
                if (val) {
                    // NRPN to set cycEnvAssign1 modulation ON
                } else {
                    // NRPN to set cycEnvAssign1 modulation OFF
                }
                break;
            case('cycEnvAssign2'):
                if (val) {
                    // NRPN to set cycEnvAssign2 modulation ON
                } else {
                    // NRPN to set cycEnvAssign2 modulation OFF
                }
                break;
            case('cycEnvAssign3'):
                if (val) {
                    // NRPN to set cycEnvAssign3 modulation ON
                } else {
                    // NRPN to set cycEnvAssign3 modulation OFF
                }
                break;
            case('envPitch'):
                if (val) {
                    // NRPN to set envPitch modulation ON
                } else {
                    // NRPN to set envPitch modulation OFF
                }
                break;
            case('envWave'):
                if (val) {
                    // NRPN to set envWave modulation ON
                } else {
                    // NRPN to set envWave modulation OFF
                }
                break;
            case('envTimbre'):
                if (val) {
                    // NRPN to set envTimbre modulation ON
                } else {
                    // NRPN to set envTimbre modulation OFF
                }
                break;
            case('envCutoff'):
                if (val) {
                    // NRPN to set envCutoff modulation ON
                } else {
                    // NRPN to set envCutoff modulation OFF
                }
                break;
            case('envAssign1'):
                if (val) {
                    // NRPN to set envAssign1 modulation ON
                } else {
                    // NRPN to set envAssign1 modulation OFF
                }
                break;
            case('envAssign2'):
                if (val) {
                    // NRPN to set envAssign2 modulation ON
                } else {
                    // NRPN to set envAssign2 modulation OFF
                }
                break;
            case('envAssign3'):
                if (val) {
                    // NRPN to set envAssign3 modulation ON
                } else {
                    // NRPN to set envAssign3 modulation OFF
                }
                break;
            case('lfoPitch'):
                if (val) {
                    // NRPN to set lfoPitch modulation ON
                } else {
                    // NRPN to set lfoPitch modulation OFF
                }
                break;
            case('lfoWave'):
                if (val) {
                    // NRPN to set lfoWave modulation ON
                } else {
                    // NRPN to set lfoWave modulation OFF
                }
                break;
            case('lfoTimbre'):
                if (val) {
                    // NRPN to set lfoTimbre modulation ON
                } else {
                    // NRPN to set lfoTimbre modulation OFF
                }
                break;
            case('lfoCutoff'):
                if (val) {
                    // NRPN to set lfoCutoff modulation ON
                } else {
                    // NRPN to set lfoCutoff modulation OFF
                }
                break;
            case('lfoAssign1'):
                if (val) {
                    // NRPN to set lfoAssign1 modulation ON
                } else {
                    // NRPN to set lfoAssign1 modulation OFF
                }
                break;
            case('lfoAssign2'):
                if (val) {
                    // NRPN to set lfoAssign2 modulation ON
                } else {
                    // NRPN to set lfoAssign2 modulation OFF
                }
                break;
            case('lfoAssign3'):
                if (val) {
                    // NRPN to set lfoAssign3 modulation ON
                } else {
                    // NRPN to set lfoAssign3 modulation OFF
                }
                break;
            case('pressurePitch'):
                if (val) {
                    // NRPN to set pressurePitch modulation ON
                } else {
                    // NRPN to set pressurePitch modulation OFF
                }
                break;
            case('pressureWave'):
                if (val) {
                    // NRPN to set pressureWave modulation ON
                } else {
                    // NRPN to set pressureWave modulation OFF
                }
                break;
            case('pressureTimbre'):
                if (val) {
                    // NRPN to set pressureTimbre modulation ON
                } else {
                    // NRPN to set pressureTimbre modulation OFF
                }
                break;
            case('pressureCutoff'):
                if (val) {
                    // NRPN to set pressureCutoff modulation ON
                } else {
                    // NRPN to set pressureCutoff modulation OFF
                }
                break;
            case('pressureAssign1'):
                if (val) {
                    // NRPN to set pressureAssign1 modulation ON
                } else {
                    // NRPN to set pressureAssign1 modulation OFF
                }
                break;
            case('pressureAssign2'):
                if (val) {
                    // NRPN to set pressureAssign2 modulation ON
                } else {
                    // NRPN to set pressureAssign2 modulation OFF
                }
                break;
            case('pressureAssign3'):
                if (val) {
                    // NRPN to set pressureAssign3 modulation ON
                } else {
                    // NRPN to set pressureAssign3 modulation OFF
                }
                break;
            case('keyarpPitch'):
                if (val) {
                    // NRPN to set keyarpPitch modulation ON
                } else {
                    // NRPN to set keyarpPitch modulation OFF
                }
                break;
            case('keyarpWave'):
                if (val) {
                    // NRPN to set keyarpWave modulation ON
                } else {
                    // NRPN to set keyarpWave modulation OFF
                }
                break;
            case('keyarpTimbre'):
                if (val) {
                    // NRPN to set keyarpTimbre modulation ON
                } else {
                    // NRPN to set keyarpTimbre modulation OFF
                }
                break;
            case('keyarpCutoff'):
                if (val) {
                    // NRPN to set keyarpCutoff modulation ON
                } else {
                    // NRPN to set keyarpCutoff modulation OFF
                }
                break;
            case('keyarpAssign1'):
                if (val) {
                    // NRPN to set keyarpAssign1 modulation ON
                } else {
                    // NRPN to set keyarpAssign1 modulation OFF
                }
                break;
            case('keyarpAssign2'):
                if (val) {
                    // NRPN to set keyarpAssign2 modulation ON
                } else {
                    // NRPN to set keyarpAssign2 modulation OFF
                }
                break;
            case('keyarpAssign3'):
                if (val) {
                    // NRPN to set keyarpAssign3 modulation ON
                } else {
                    // NRPN to set keyarpAssign3 modulation OFF
                }
                break;
            case('cycEnvPitchAmount'):
                // NRPN for setting cycEnvPitch Modulation Amount to val
                break;
            case('cycEnvWaveAmount'):
                // NRPN for setting cycEnvWave Modulation Amount to val
                break;
            case('cycEnvTimbreAmount'):
                // NRPN for setting cycEnvTimbre Modulation Amount to val
                break;
            case('cycEnvCutoffAmount'):
                // NRPN for setting cycEnvCutoff Modulation Amount to val
                break;
            case('cycEnvAssign1Amount'):
                // NRPN for setting cycEnvAssign1 Modulation Amount to val
                break;
            case('cycEnvAssign2Amount'):
                // NRPN for setting cycEnvAssign2 Modulation Amount to val
                break;
            case('cycEnvAssign3Amount'):
                // NRPN for setting cycEnvAssign3 Modulation Amount to val
                break;
            case('envPitchAmount'):
                // NRPN for setting envPitch Modulation Amount to val
                break;
            case('envWaveAmount'):
                // NRPN for setting envWave Modulation Amount to val
                break;
            case('envTimbreAmount'):
                // NRPN for setting envTimbre Modulation Amount to val
                break;
            case('envCutoffAmount'):
                // NRPN for setting envCutoff Modulation Amount to val
                break;
            case('envAssign1Amount'):
                // NRPN for setting envAssign1 Modulation Amount to val
                break;
            case('envAssign2Amount'):
                // NRPN for setting envAssign2 Modulation Amount to val
                break;
            case('envAssign3Amount'):
                // NRPN for setting envAssign3 Modulation Amount to val
                break;
            case('lfoPitchAmount'):
                // NRPN for setting lfoPitch Modulation Amount to val
                break;
            case('lfoWaveAmount'):
                // NRPN for setting lfoWave Modulation Amount to val
                break;
            case('lfoTimbreAmount'):
                // NRPN for setting lfoTimbre Modulation Amount to val
                break;
            case('lfoCutoffAmount'):
                // NRPN for setting lfoCutoff Modulation Amount to val
                break;
            case('lfoAssign1Amount'):
                // NRPN for setting lfoAssign1 Modulation Amount to val
                break;
            case('lfoAssign2Amount'):
                // NRPN for setting lfoAssign2 Modulation Amount to val
                break;
            case('lfoAssign3Amount'):
                // NRPN for setting lfoAssign3 Modulation Amount to val
                break;
            case('pressurePitchAmount'):
                // NRPN for setting pressurePitch Modulation Amount to val
                break;
            case('pressureWaveAmount'):
                // NRPN for setting pressureWave Modulation Amount to val
                break;
            case('pressureTimbreAmount'):
                // NRPN for setting pressureTimbre Modulation Amount to val
                break;
            case('pressureCutoffAmount'):
                // NRPN for setting pressureCutoff Modulation Amount to val
                break;
            case('pressureAssign1Amount'):
                // NRPN for setting pressureAssign1 Modulation Amount to val
                break;
            case('pressureAssign2Amount'):
                // NRPN for setting pressureAssign2 Modulation Amount to val
                break;
            case('pressureAssign3Amount'):
                // NRPN for setting pressureAssign3 Modulation Amount to val
                break;
            case('keyarpPitchAmount'):
                // NRPN for setting keyarpPitch Modulation Amount to val
                break;
            case('keyarpWaveAmount'):
                // NRPN for setting keyarpWave Modulation Amount to val
                break;
            case('keyarpTimbreAmount'):
                // NRPN for setting keyarpTimbre Modulation Amount to val
                break;
            case('keyarpCutoffAmount'):
                // NRPN for setting keyarpCutoff Modulation Amount to val
                break;
            case('keyarpAssign1Amount'):
                // NRPN for setting keyarpAssign1 Modulation Amount to val
                break;
            case('keyarpAssign2Amount'):
                // NRPN for setting keyarpAssign2 Modulation Amount to val
                break;
            case('keyarpAssign3Amount'):
                // NRPN for setting keyarpAssign3 Modulation Amount to val
                break;
            case('assign1'):
                switch(val) {
                    case('18679427-628f-4f5d-9301-7d8574a5acdb'):
                        // NRPN to set Assign1 to glide
                        break;
                    case('6932b1eb-2b74-4fba-b3b3-56fef4e54a93'):
                        // NRPN to set Assign1 to oscillator type
                        break;
                    case('0e1258ba-91b8-4696-9023-9490a18555ef'):
                        // NRPN to set Assign1 to oscillator wave
                        break;
                    case('f5ff6c36-e697-4979-a831-5ec1f604cf09'):
                        // NRPN to set Assign1 to oscillator timbre
                        break;
                    case('20a4990b-bd04-4db5-a7e6-5b5a82bd5c36'):
                        // NRPN to set Assign1 to oscillator shape
                        break;
                    case('94b48ca2-9f06-46fb-b5ff-d48540374025'):
                        // NRPN to set Assign1 to filter cutoff
                        break;
                    case('7612309a-3513-409b-abb3-a5017e2e937e'):
                        // NRPN to set Assign1 to filter resonance
                        break;
                    case('b6baa583-0f97-4eda-ac27-4d85713605bf'):
                        // NRPN to set Assign1 to envelope attack
                        break;
                    case('fe6aeb2f-c534-46f1-9a64-63c87e375e96'):
                        // NRPN to set Assign1 to envelope decay
                        break;
                    case('9a932b4f-526f-4771-bc22-60b0ab3f4c7c'):
                        // NRPN to set Assign1 to envelope sustain
                        break;
                    case('f926f66c-a6e6-4aef-84e1-36efba593c2d'):
                        // NRPN to set Assign1 to envelope filter amount
                        break;
                    case('c95daaf0-a6be-406a-a5bc-d320bce53b65'):
                        // NRPN to set Assign1 to lfo rate
                        break;
                    case('ac633511-3a1f-4744-8fdd-6c00ca0000d0'):
                        // NRPN to set Assign1 to arpeggio rate
                        break;
                    case('292137de-9e41-446b-9d00-207836a1b84b'):
                        // NRPN to set Assign1 to cycling envelope rise
                        break;
                    case('8bb89ccd-0824-44fc-9eba-28a58e9f362c'):
                        // NRPN to set Assign1 to cycling envelope fall
                        break;
                    case('147679e0-79c6-42eb-971d-99c2bac46912'):
                        // NRPN to set Assign1 to cycling envelope hold
                        break;
                    case('c551d09c-0dba-4f52-881c-ca34e147e809'):
                        // NRPN to set Assign1 to cycling envelope amount
                        break;
                    case('4355749d-178d-47d4-b68b-d678437ba44e'):
                        // NRPN to set Assign1 to matrix modulation amount
                        break;
                    default: 
                        console.log('error - unsupported assignment');
                }
                break;
            case('assign2'):
                switch(val) {
                    case('18679427-628f-4f5d-9301-7d8574a5acdb'):
                        // NRPN to set Assign2 to glide
                        break;
                    case('6932b1eb-2b74-4fba-b3b3-56fef4e54a93'):
                        // NRPN to set Assign2 to oscillator type
                        break;
                    case('0e1258ba-91b8-4696-9023-9490a18555ef'):
                        // NRPN to set Assign2 to oscillator wave
                        break;
                    case('f5ff6c36-e697-4979-a831-5ec1f604cf09'):
                        // NRPN to set Assign2 to oscillator timbre
                        break;
                    case('20a4990b-bd04-4db5-a7e6-5b5a82bd5c36'):
                        // NRPN to set Assign2 to oscillator shape
                        break;
                    case('94b48ca2-9f06-46fb-b5ff-d48540374025'):
                        // NRPN to set Assign2 to filter cutoff
                        break;
                    case('7612309a-3513-409b-abb3-a5017e2e937e'):
                        // NRPN to set Assign2 to filter resonance
                        break;
                    case('b6baa583-0f97-4eda-ac27-4d85713605bf'):
                        // NRPN to set Assign2 to envelope attack
                        break;
                    case('fe6aeb2f-c534-46f1-9a64-63c87e375e96'):
                        // NRPN to set Assign2 to envelope decay
                        break;
                    case('9a932b4f-526f-4771-bc22-60b0ab3f4c7c'):
                        // NRPN to set Assign2 to envelope sustain
                        break;
                    case('f926f66c-a6e6-4aef-84e1-36efba593c2d'):
                        // NRPN to set Assign2 to envelope filter amount
                        break;
                    case('c95daaf0-a6be-406a-a5bc-d320bce53b65'):
                        // NRPN to set Assign2 to lfo rate
                        break;
                    case('ac633511-3a1f-4744-8fdd-6c00ca0000d0'):
                        // NRPN to set Assign2 to arpeggio rate
                        break;
                    case('292137de-9e41-446b-9d00-207836a1b84b'):
                        // NRPN to set Assign2 to cycling envelope rise
                        break;
                    case('8bb89ccd-0824-44fc-9eba-28a58e9f362c'):
                        // NRPN to set Assign2 to cycling envelope fall
                        break;
                    case('147679e0-79c6-42eb-971d-99c2bac46912'):
                        // NRPN to set Assign2 to cycling envelope hold
                        break;
                    case('c551d09c-0dba-4f52-881c-ca34e147e809'):
                        // NRPN to set Assign2 to cycling envelope amount
                        break;
                    case('4355749d-178d-47d4-b68b-d678437ba44e'):
                        // NRPN to set Assign2 to matrix modulation amount
                        break;
                    default: 
                        console.log('error - unsupported assignment');
                }
                break;
            case('assign3'):
                switch(val) {
                    case('18679427-628f-4f5d-9301-7d8574a5acdb'):
                        // NRPN to set Assign3 to glide
                        break;
                    case('6932b1eb-2b74-4fba-b3b3-56fef4e54a93'):
                        // NRPN to set Assign3 to oscillator type
                        break;
                    case('0e1258ba-91b8-4696-9023-9490a18555ef'):
                        // NRPN to set Assign3 to oscillator wave
                        break;
                    case('f5ff6c36-e697-4979-a831-5ec1f604cf09'):
                        // NRPN to set Assign3 to oscillator timbre
                        break;
                    case('20a4990b-bd04-4db5-a7e6-5b5a82bd5c36'):
                        // NRPN to set Assign3 to oscillator shape
                        break;
                    case('94b48ca2-9f06-46fb-b5ff-d48540374025'):
                        // NRPN to set Assign3 to filter cutoff
                        break;
                    case('7612309a-3513-409b-abb3-a5017e2e937e'):
                        // NRPN to set Assign3 to filter resonance
                        break;
                    case('b6baa583-0f97-4eda-ac27-4d85713605bf'):
                        // NRPN to set Assign3 to envelope attack
                        break;
                    case('fe6aeb2f-c534-46f1-9a64-63c87e375e96'):
                        // NRPN to set Assign3 to envelope decay
                        break;
                    case('9a932b4f-526f-4771-bc22-60b0ab3f4c7c'):
                        // NRPN to set Assign3 to envelope sustain
                        break;
                    case('f926f66c-a6e6-4aef-84e1-36efba593c2d'):
                        // NRPN to set Assign3 to envelope filter amount
                        break;
                    case('c95daaf0-a6be-406a-a5bc-d320bce53b65'):
                        // NRPN to set Assign3 to lfo rate
                        break;
                    case('ac633511-3a1f-4744-8fdd-6c00ca0000d0'):
                        // NRPN to set Assign3 to arpeggio rate
                        break;
                    case('292137de-9e41-446b-9d00-207836a1b84b'):
                        // NRPN to set Assign3 to cycling envelope rise
                        break;
                    case('8bb89ccd-0824-44fc-9eba-28a58e9f362c'):
                        // NRPN to set Assign3 to cycling envelope fall
                        break;
                    case('147679e0-79c6-42eb-971d-99c2bac46912'):
                        // NRPN to set Assign3 to cycling envelope hold
                        break;
                    case('c551d09c-0dba-4f52-881c-ca34e147e809'):
                        // NRPN to set Assign3 to cycling envelope amount
                        break;
                    case('4355749d-178d-47d4-b68b-d678437ba44e'):
                        // NRPN to set Assign3 to matrix modulation amount
                        break;
                    default: 
                        console.log('error - unsupported assignment');
                }
                break;
            case('modulateModulate1'):
                switch(val) {
                    case(null):
                        break;
                    case(''):
                        null;
                        break;
                    case('cycEnvPitch'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope pitch
                        break;
                    case('cycEnvWave'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope wave
                        break;
                    case('cycEnvTimbre'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope timbre
                        break;
                    case('cycEnvCutoff'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope cutoff
                        break;
                    case('cycEnvAssign1'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope assign1
                        break;
                    case('cycEnvAssign2'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope assign2
                        break;
                    case('cycEnvAssign3'):
                        // NRPN to set Assign1 matrix modulation value to cycle envelope assign3
                        break;
                    case('envPitch'):
                        // NRPN to set Assign1 matrix modulation value to envelope pitch
                        break;
                    case('envWave'):
                        // NRPN to set Assign1 matrix modulation value to envelope wave
                        break;
                    case('envTimbre'):
                        // NRPN to set Assign1 matrix modulation value to envelope timbre
                        break;
                    case('envCutoff'):
                        // NRPN to set Assign1 matrix modulation value to envelope cutoff
                        break;
                    case('envAssign1'):
                        // NRPN to set Assign1 matrix modulation value to envelope assign1
                        break;
                    case('envAssign2'):
                        // NRPN to set Assign1 matrix modulation value to envelope assign2
                        break;
                    case('envAssign3'):
                        // NRPN to set Assign1 matrix modulation value to envelope assign3
                        break;
                    case('lfoPitch'):
                        // NRPN to set Assign1 matrix modulation value to lfo pitch
                        break;
                    case('lfoWave'):
                        // NRPN to set Assign1 matrix modulation value to lfo wave
                        break;
                    case('lfoTimbre'):
                        // NRPN to set Assign1 matrix modulation value to lfo timbre
                        break;
                    case('lfoCutoff'):
                        // NRPN to set Assign1 matrix modulation value to lfo cutoff
                        break;
                    case('lfoAssign1'):
                        // NRPN to set Assign1 matrix modulation value to lfo assign1
                        break;
                    case('lfoAssign2'):
                        // NRPN to set Assign1 matrix modulation value to lfo assign2
                        break;
                    case('lfoAssign3'):
                        // NRPN to set Assign1 matrix modulation value to lfo assign3
                        break;
                    case('pressurePitch'):
                        // NRPN to set Assign1 matrix modulation value to pressure pitch
                        break;
                    case('pressureWave'):
                        // NRPN to set Assign1 matrix modulation value to pressure wave
                        break;
                    case('pressureTimbre'):
                        // NRPN to set Assign1 matrix modulation value to pressure timbre
                        break;
                    case('pressureCutoff'):
                        // NRPN to set Assign1 matrix modulation value to pressure cutoff
                        break;
                    case('pressureAssign1'):
                        // NRPN to set Assign1 matrix modulation value to pressure assign1
                        break;
                    case('pressureAssign2'):
                        // NRPN to set Assign1 matrix modulation value to pressure assign2
                        break;
                    case('pressureAssign3'):
                        // NRPN to set Assign1 matrix modulation value to pressure assign3
                        break;
                    case('keyArpPitch'):
                        // NRPN to set Assign1 matrix modulation value to key/arp pitch
                        break;
                    case('keyArpWave'):
                        // NRPN to set Assign1 matrix modulation value to key/arp wave
                        break;
                    case('keyArpTimbre'):
                        // NRPN to set Assign1 matrix modulation value to key/arp timbre
                        break;
                    case('keyArpCutoff'):
                        // NRPN to set Assign1 matrix modulation value to key/arp cutoff
                        break;
                    case('keyArpAssign1'):
                        // NRPN to set Assign1 matrix modulation value to key/arp assign1
                        break;
                    case('keyArpAssign2'):
                        // NRPN to set Assign1 matrix modulation value to key/arp assign2
                        break;
                    case('keyArpAssign3'):
                        // NRPN to set Assign1 matrix modulation value to key/arp assign3
                        break;
                    default:
                        console.log('ERROR - unsupported modulation modulator');
                }
                break;
            case('modulateModulate2'):
                switch(val) {
                    case(null):
                        break;
                    case(''):
                        null;
                        break;
                    case('cycEnvPitch'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope pitch
                        break;
                    case('cycEnvWave'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope wave
                        break;
                    case('cycEnvTimbre'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope timbre
                        break;
                    case('cycEnvCutoff'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope cutoff
                        break;
                    case('cycEnvAssign1'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope assign1
                        break;
                    case('cycEnvAssign2'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope assign2
                        break;
                    case('cycEnvAssign3'):
                        // NRPN to set Assign2 matrix modulation value to cycle envelope assign3
                        break;
                    case('envPitch'):
                        // NRPN to set Assign2 matrix modulation value to envelope pitch
                        break;
                    case('envWave'):
                        // NRPN to set Assign2 matrix modulation value to envelope wave
                        break;
                    case('envTimbre'):
                        // NRPN to set Assign2 matrix modulation value to envelope timbre
                        break;
                    case('envCutoff'):
                        // NRPN to set Assign2 matrix modulation value to envelope cutoff
                        break;
                    case('envAssign1'):
                        // NRPN to set Assign2 matrix modulation value to envelope assign1
                        break;
                    case('envAssign2'):
                        // NRPN to set Assign2 matrix modulation value to envelope assign2
                        break;
                    case('envAssign3'):
                        // NRPN to set Assign2 matrix modulation value to envelope assign3
                        break;
                    case('lfoPitch'):
                        // NRPN to set Assign2 matrix modulation value to lfo pitch
                        break;
                    case('lfoWave'):
                        // NRPN to set Assign2 matrix modulation value to lfo wave
                        break;
                    case('lfoTimbre'):
                        // NRPN to set Assign2 matrix modulation value to lfo timbre
                        break;
                    case('lfoCutoff'):
                        // NRPN to set Assign2 matrix modulation value to lfo cutoff
                        break;
                    case('lfoAssign1'):
                        // NRPN to set Assign2 matrix modulation value to lfo assign1
                        break;
                    case('lfoAssign2'):
                        // NRPN to set Assign2 matrix modulation value to lfo assign2
                        break;
                    case('lfoAssign3'):
                        // NRPN to set Assign2 matrix modulation value to lfo assign3
                        break;
                    case('pressurePitch'):
                        // NRPN to set Assign2 matrix modulation value to pressure pitch
                        break;
                    case('pressureWave'):
                        // NRPN to set Assign2 matrix modulation value to pressure wave
                        break;
                    case('pressureTimbre'):
                        // NRPN to set Assign2 matrix modulation value to pressure timbre
                        break;
                    case('pressureCutoff'):
                        // NRPN to set Assign2 matrix modulation value to pressure cutoff
                        break;
                    case('pressureAssign1'):
                        // NRPN to set Assign2 matrix modulation value to pressure assign1
                        break;
                    case('pressureAssign2'):
                        // NRPN to set Assign2 matrix modulation value to pressure assign2
                        break;
                    case('pressureAssign3'):
                        // NRPN to set Assign2 matrix modulation value to pressure assign3
                        break;
                    case('keyArpPitch'):
                        // NRPN to set Assign2 matrix modulation value to key/arp pitch
                        break;
                    case('keyArpWave'):
                        // NRPN to set Assign2 matrix modulation value to key/arp wave
                        break;
                    case('keyArpTimbre'):
                        // NRPN to set Assign2 matrix modulation value to key/arp timbre
                        break;
                    case('keyArpCutoff'):
                        // NRPN to set Assign2 matrix modulation value to key/arp cutoff
                        break;
                    case('keyArpAssign1'):
                        // NRPN to set Assign2 matrix modulation value to key/arp assign1
                        break;
                    case('keyArpAssign2'):
                        // NRPN to set Assign2 matrix modulation value to key/arp assign2
                        break;
                    case('keyArpAssign3'):
                        // NRPN to set Assign2 matrix modulation value to key/arp assign3
                        break;
                    default:
                        console.log('ERROR - unsupported modulation modulator');
                }
                break;
            case('modulateModulate3'):
                switch(val) {
                    case(null):
                        break;
                    case(''):
                        null;
                        break;
                    case('cycEnvPitch'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope pitch
                        break;
                    case('cycEnvWave'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope wave
                        break;
                    case('cycEnvTimbre'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope timbre
                        break;
                    case('cycEnvCutoff'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope cutoff
                        break;
                    case('cycEnvAssign1'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope assign1
                        break;
                    case('cycEnvAssign2'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope assign2
                        break;
                    case('cycEnvAssign3'):
                        // NRPN to set Assign3 matrix modulation value to cycle envelope assign3
                        break;
                    case('envPitch'):
                        // NRPN to set Assign3 matrix modulation value to envelope pitch
                        break;
                    case('envWave'):
                        // NRPN to set Assign3 matrix modulation value to envelope wave
                        break;
                    case('envTimbre'):
                        // NRPN to set Assign3 matrix modulation value to envelope timbre
                        break;
                    case('envCutoff'):
                        // NRPN to set Assign3 matrix modulation value to envelope cutoff
                        break;
                    case('envAssign1'):
                        // NRPN to set Assign3 matrix modulation value to envelope assign1
                        break;
                    case('envAssign2'):
                        // NRPN to set Assign3 matrix modulation value to envelope assign2
                        break;
                    case('envAssign3'):
                        // NRPN to set Assign3 matrix modulation value to envelope assign3
                        break;
                    case('lfoPitch'):
                        // NRPN to set Assign3 matrix modulation value to lfo pitch
                        break;
                    case('lfoWave'):
                        // NRPN to set Assign3 matrix modulation value to lfo wave
                        break;
                    case('lfoTimbre'):
                        // NRPN to set Assign3 matrix modulation value to lfo timbre
                        break;
                    case('lfoCutoff'):
                        // NRPN to set Assign3 matrix modulation value to lfo cutoff
                        break;
                    case('lfoAssign1'):
                        // NRPN to set Assign3 matrix modulation value to lfo assign1
                        break;
                    case('lfoAssign2'):
                        // NRPN to set Assign3 matrix modulation value to lfo assign2
                        break;
                    case('lfoAssign3'):
                        // NRPN to set Assign3 matrix modulation value to lfo assign3
                        break;
                    case('pressurePitch'):
                        // NRPN to set Assign3 matrix modulation value to pressure pitch
                        break;
                    case('pressureWave'):
                        // NRPN to set Assign3 matrix modulation value to pressure wave
                        break;
                    case('pressureTimbre'):
                        // NRPN to set Assign3 matrix modulation value to pressure timbre
                        break;
                    case('pressureCutoff'):
                        // NRPN to set Assign3 matrix modulation value to pressure cutoff
                        break;
                    case('pressureAssign1'):
                        // NRPN to set Assign3 matrix modulation value to pressure assign1
                        break;
                    case('pressureAssign2'):
                        // NRPN to set Assign3 matrix modulation value to pressure assign2
                        break;
                    case('pressureAssign3'):
                        // NRPN to set Assign3 matrix modulation value to pressure assign3
                        break;
                    case('keyArpPitch'):
                        // NRPN to set Assign3 matrix modulation value to key/arp pitch
                        break;
                    case('keyArpWave'):
                        // NRPN to set Assign3 matrix modulation value to key/arp wave
                        break;
                    case('keyArpTimbre'):
                        // NRPN to set Assign3 matrix modulation value to key/arp timbre
                        break;
                    case('keyArpCutoff'):
                        // NRPN to set Assign3 matrix modulation value to key/arp cutoff
                        break;
                    case('keyArpAssign1'):
                        // NRPN to set Assign3 matrix modulation value to key/arp assign1
                        break;
                    case('keyArpAssign2'):
                        // NRPN to set Assign3 matrix modulation value to key/arp assign2
                        break;
                    case('keyArpAssign3'):
                        // NRPN to set Assign3 matrix modulation value to key/arp assign3
                        break;
                    default:
                        console.log('ERROR - unsupported modulation modulator');
                }
                break;
            default:
                console.log('error - unsupported parameter');
        }
        
    }
    
    const sendFullPatch = () => {
        const patchArr = [
            [ 'cutoff', patchParams.analogFilter.cutoff ],
            [ 'filterType', patchParams.analogFilter.filterType ],
            [ 'resonance', patchParams.analogFilter.resonance ],
            [ 'keyHold', patchParams.arpeggiator.hold ],
            [ 'arpeggiatorOctave', patchParams.arpeggiator.oct ],
            [ 'apreggiatorSwitch', patchParams.arpeggiator.on ],
            [ 'arpPattern', patchParams.arpeggiator.pattern ],
            [ 'arpRateFixed', patchParams.arpeggiator.rateSync ],
            [ 'arpRateFree', patchParams.arpeggiator.rateFree ],
            [ 'arpeggiatorSync', patchParams.arpeggiator.sync ],
            [ 'cyclingAmount', patchParams.cyclingEnvelope.amount ],
            [ 'fall', patchParams.cyclingEnvelope.fall ],
            [ 'fallShape', patchParams.cyclingEnvelope.fallShape ],
            [ 'holdSustain', patchParams.cyclingEnvelope.holdSustain ],
            [ 'cyclingEnvelopeMode', patchParams.cyclingEnvelope.mode ],
            [ 'cycleRise', patchParams.cyclingEnvelope.rise ],
            [ 'riseShape', patchParams.cyclingEnvelope.riseShape ],
            [ 'shape', patchParams.digitalOscillator.shape ],
            [ 'timbre', patchParams.digitalOscillator.timbre ],
            [ 'oscType', patchParams.digitalOscillator.type ],
            [ 'wave', patchParams.digitalOscillator.wave ],
            [ 'amplitudeModulation', patchParams.envelopeGenerator.ampMod ],
            [ 'attack', patchParams.envelopeGenerator.attack ],
            [ 'decayRelease', patchParams.envelopeGenerator.decayRelease ],
            [ 'filterAmount', patchParams.envelopeGenerator.filterAmount ],
            [ 'sustain', patchParams.envelopeGenerator.sustain ],
            [ 'glide', patchParams.glide.glide ],
            [ 'lfoRateFree', patchParams.lfo.rateFree ],
            [ 'rateSync', patchParams.lfo.rateSync ],
            [ 'lfoShape', patchParams.lfo.shape ],
            [ 'lfoSync', patchParams.lfo.sync ],
            [ 'paraphonicState', patchParams.paraphonic],
            [ 'diceState', patchParams.spice.dice ],
            [ 'spiceState', patchParams.spice.spice ],
            [ 'assign1', modulationMatrix.assign1 ],
            [ 'assign2', modulationMatrix.assign2 ],
            [ 'assign3', modulationMatrix.assign3 ],
            [ 'modulateModulate1', modulationMatrix.assign1MatrixModulationTarget ],
            [ 'modulateModulate2', modulationMatrix.assign2MatrixModulationTarget ],
            [ 'modulateModulate3', modulationMatrix.assign3MatrixModulationTarget ],
            [ 'cycEnvAssign1', modulationMatrix.cycEnvAssign1 ],
            [ 'cycEnvAssign1Amount', modulationMatrix.cycEnvAssign1Amount ],
            [ 'cycEnvAssign2', modulationMatrix.cycEnvAssign2 ],
            [ 'cycEnvAssign2Amount', modulationMatrix.cycEnvAssign2Amount ],
            [ 'cycEnvAssign3', modulationMatrix.cycEnvAssign3 ],
            [ 'cycEnvAssign3Amount', modulationMatrix.cycEnvAssign3Amount ],
            [ 'cycEnvCutoff', modulationMatrix.cycEnvCutoff ],
            [ 'cycEnvCutoffAmount', modulationMatrix.cycEnvCutoffAmount ],
            [ 'cycEnvPitch', modulationMatrix.cycEnvPitch ],
            [ 'cycEnvPitchAmount', modulationMatrix.cycEnvPitchAmount ],
            [ 'cycEnvTimbre', modulationMatrix.cycEnvTimbre ],
            [ 'cycEnvTimbreAmount', modulationMatrix.cycEnvTimbreAmount ],
            [ 'cycEnvWave', modulationMatrix.cycEnvWave ],
            [ 'cycEnvWaveAmount', modulationMatrix.cycEnvWaveAmount ],
            [ 'envAssign1', modulationMatrix.envAssign1 ],
            [ 'envAssign1Amount', modulationMatrix.envAssign1Amount ],
            [ 'envAssign2', modulationMatrix.envAssign2 ],
            [ 'envAssign2Amount', modulationMatrix.envAssign2Amount ],
            [ 'envAssign3', modulationMatrix.envAssign3 ],
            [ 'envAssign3Amount', modulationMatrix.envAssign3Amount ],
            [ 'envCutoff', modulationMatrix.envCutoff ],
            [ 'envCutoffAmount', modulationMatrix.envCutoffAmount ],
            [ 'envPitch', modulationMatrix.envPitch ],
            [ 'envPitchAmount', modulationMatrix.envPitchAmount ],
            [ 'envTimbre', modulationMatrix.envTimbre ],
            [ 'envTimbreAmount', modulationMatrix.envTimbreAmount ],
            [ 'envWave', modulationMatrix.envWave ],
            [ 'envWaveAmount', modulationMatrix.envWaveAmount ],
            [ 'keyarpAssign1', modulationMatrix.keyarpAssign1 ],
            [ 'keyarpAssign1Amount', modulationMatrix.keyarpAssign1Amount ],
            [ 'keyarpAssign2', modulationMatrix.keyarpAssign2 ],
            [ 'keyarpAssign2Amount', modulationMatrix.keyarpAssign2Amount ],
            [ 'keyarpAssign3', modulationMatrix.keyarpAssign3 ],
            [ 'keyarpAssign3Amount', modulationMatrix.keyarpAssign3Amount ],
            [ 'keyarpCutoff', modulationMatrix.keyarpCutoff ],
            [ 'keyarpCutoffAmount', modulationMatrix.keyarpCutoffAmount ],
            [ 'keyarpPitch', modulationMatrix.keyarpPitch ],
            [ 'keyarpPitchAmount', modulationMatrix.keyarpPitchAmount ],
            [ 'keyarpTimbre', modulationMatrix.keyarpTimbre ],
            [ 'keyarpTimbreAmount', modulationMatrix.keyarpTimbreAmount ],
            [ 'keyarpWave', modulationMatrix.keyarpWave ],
            [ 'keyarpWaveAmount', modulationMatrix.keyarpWaveAmount ],
            [ 'lfoAssign1', modulationMatrix.lfoAssign1 ],
            [ 'lfoAssign1Amount', modulationMatrix.lfoAssign1Amount ],
            [ 'lfoAssign2', modulationMatrix.lfoAssign2 ],
            [ 'lfoAssign2Amount', modulationMatrix.lfoAssign2Amount ],
            [ 'lfoAssign3', modulationMatrix.lfoAssign3 ],
            [ 'lfoAssign3Amount', modulationMatrix.lfoAssign3Amount ],
            [ 'lfoCutoff', modulationMatrix.lfoCutoff ],
            [ 'lfoCutoffAmount', modulationMatrix.lfoCutoffAmount ],
            [ 'lfoPitch', modulationMatrix.lfoPitch ],
            [ 'lfoPitchAmount', modulationMatrix.lfoPitchAmount ],
            [ 'lfoTimbre', modulationMatrix.lfoTimbre ],
            [ 'lfoTimbreAmount', modulationMatrix.lfoTimbreAmount ],
            [ 'lfoWave', modulationMatrix.lfoWave ],
            [ 'lfoWaveAmount', modulationMatrix.lfoWaveAmount ],
            [ 'pressureAssign1', modulationMatrix.pressureAssign1 ],
            [ 'pressureAssign1Amount', modulationMatrix.pressureAssign1Amount ],
            [ 'pressureAssign2', modulationMatrix.pressureAssign2 ],
            [ 'pressureAssign2Amount', modulationMatrix.pressureAssign2Amount ],
            [ 'pressureAssign3', modulationMatrix.pressureAssign3 ],
            [ 'pressureAssign3Amount', modulationMatrix.pressureAssign3Amount ],
            [ 'pressureCutoff', modulationMatrix.pressureCutoff ],
            [ 'pressureCutoffAmount', modulationMatrix.pressureCutoffAmount ],
            [ 'pressurePitch', modulationMatrix.pressurePitch ],
            [ 'pressurePitchAmount', modulationMatrix.pressurePitchAmount ],
            [ 'pressureTimbre', modulationMatrix.pressureTimbre ],
            [ 'pressureTimbreAmount', modulationMatrix.pressureTimbreAmount ],
            [ 'pressureWave', modulationMatrix.pressureWave ],
            [ 'pressureWaveAmount', modulationMatrix.pressureWaveAmount ]
        ];
        
        patchArr.forEach(parameter => {
            updatePatch(parameter[0], parameter[1]);
        });
    }
    
    const initPatch = () => {
        setGlobalParams({
            name: 'init'
        });
        setPatchParams({
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
                rateFree: 0,
                rateSync: 0,
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
                rateFree: 0,
                rateSync: 0,
                shape: 'sine',
                sync: false
            },
            paraphonic: false,
            spice: {
                dice: false,
                spice: true
            }
        });
        setModulationMatrix({
            assign1: '18679427-628f-4f5d-9301-7d8574a5acdb',
            assign2: '6932b1eb-2b74-4fba-b3b3-56fef4e54a93',
            assign3: '0e1258ba-91b8-4696-9023-9490a18555ef',
            assign1MatrixModulationTarget: null,
            assign2MatrixModulationTarget: null,
            assign3MatrixModulationTarget: null,
            currentDisplay: '',
            cycEnvAssign1: false,
            cycEnvAssign1Amount: 64,
            cycEnvAssign2: false,
            cycEnvAssign2Amount: 64,
            cycEnvAssign3: false,
            cycEnvAssign3Amount: 64,
            cycEnvCutoff: false,
            cycEnvCutoffAmount: 64,
            cycEnvPitch: false,
            cycEnvPitchAmount: 64,
            cycEnvTimbre: false,
            cycEnvTimbreAmount: 64,
            cycEnvWave: false,
            cycEnvWaveAmount: 64,
            envAssign1: false,
            envAssign1Amount: 64,
            envAssign2: false,
            envAssign2Amount: 64,
            envAssign3: false,
            envAssign3Amount: 64,
            envCutoff: false,
            envCutoffAmount: 64,
            envPitch: false,
            envPitchAmount: 64,
            envTimbre: false,
            envTimbreAmount: 64,
            envWave: false,
            envWaveAmount: 64,
            keyarpAssign1: false,
            keyarpAssign1Amount: 64,
            keyarpAssign2: false,
            keyarpAssign2Amount: 64,
            keyarpAssign3: false,
            keyarpAssign3Amount: 64,
            keyarpCutoff: false,
            keyarpCutoffAmount: 64,
            keyarpPitch: false,
            keyarpPitchAmount: 64,
            keyarpTimbre: false,
            keyarpTimbreAmount: 64,
            keyarpWave: false,
            keyarpWaveAmount: 64,
            lfoAssign1: false,
            lfoAssign1Amount: 64,
            lfoAssign2: false,
            lfoAssign2Amount: 64,
            lfoAssign3: false,
            lfoAssign3Amount: 64,
            lfoCutoff: false,
            lfoCutoffAmount: 64,
            lfoPitch: false,
            lfoPitchAmount: 64,
            lfoTimbre: false,
            lfoTimbreAmount: 64,
            lfoWave: false,
            lfoWaveAmount: 64,
            pressureAssign1: false,
            pressureAssign1Amount: 64,
            pressureAssign2: false,
            pressureAssign2Amount: 64,
            pressureAssign3: false,
            pressureAssign3Amount: 64,
            pressureCutoff: false,
            pressureCutoffAmount: 64,
            pressurePitch: false,
            pressurePitchAmount: 64,
            pressureTimbre: false,
            pressureTimbreAmount: 64,
            pressureWave: false,
            pressureWaveAmount: 64
        });
        setTimeout(() => {
            sendFullPatch();
        }, 2000);
    }
    
    const coinToss = () => {
        const rand = Math.floor(Math.random() * 2);
        
        if (rand === 1) {
            return true;
        } else {
            return false;
        }
    }
    
    const makeRandomPatch = () => {
        const filterTypes = [ 'lpf', 'bpf', 'hpf' ];
        const octs = [ 1, 2, 3, 4 ];
        const patterns = [ 'up', 'order', 'random', 'pattern' ];
        const cyclingModes = [ 'env', 'run', 'loop' ];
        const lfoShapes = [ 'sine', 'triangle', 'sawtooth', 'square', 'sample&hold', 'gliding' ];
        const matrixModulationTargets = [ null, 'cycEnvPitch', 'cycEnvWave', 'cycEnvTimbre', 'cycEnvCutoff', 'cycEnvAssign1', 'cycEnvAssign2', 'cycEnvAssign3', 'envPitch', 'envWave', 'envTimre', 'envCutoff', 'envAssign1', 'envAssign2', 'envAssign3', 'lfoPitch', 'lfoWave', 'lfoTimbre', 'lfoCutoff', 'lfoAssign1', 'lfoAssign2', 'lfoAssign3', 'pressurePitch', 'pressureWave', 'pressureTimbre', 'pressureCutoff', 'pressureAssign1', 'pressureAssign2', 'pressureAssign3', 'keyArpPitch', 'keyArpWave', 'keyArpTimbre', 'keyArpCutoff', 'keyArpAssign1', 'keyArpAssign2', 'keyArpAssign3' ];
        const type = Math.floor(Math.random() * 128);
        const spice = coinToss();
        let dice = coinToss();
        if (spice) {
            dice = false;
        }
        let shapeName, timbreName, typeName, waveName;
        if (type < 16) {
            typeName = 'basic waves';
            waveName = 'morph';
            timbreName = 'sym';
            shapeName = 'sub';
        } else if (type < 27) {
            typeName = 'super wave';
            waveName = 'wave';
            timbreName = 'detune';
            shapeName = 'volume';
        } else if (type < 38) {
            typeName = 'wave table';
            waveName = 'table';
            timbreName = 'position';
            shapeName = 'chorus';
        } else if (type < 48) {
            typeName = 'harmonic osc';
            waveName = 'content';
            timbreName = 'sculpting';
            shapeName = 'chorus';
        } else if (type < 59) {
            typeName = 'karplus-strong';
            waveName = 'bow';
            timbreName = 'position';
            shapeName = 'decay';
        } else if (type < 69) {
            typeName = 'virtual analog';
            waveName = 'detune';
            timbreName = 'shape';
            shapeName = 'wave';
        } else if (type < 80) {
            typeName = 'waveshaper';
            waveName = 'wave';
            timbreName = 'amount';
            shapeName = 'asym';
        } else if (type < 90) {
            typeName = 'two-operator FM';
            waveName = 'ratio';
            timbreName = 'amount';
            shapeName = 'feedback';
        } else if (type < 101) {
            typeName = 'formant';
            waveName = 'interval';
            timbreName = 'formant';
            shapeName = 'shape';
        } else if (type < 112) {
            typeName = 'chords';
            waveName = 'type';
            timbreName = 'inv/transp';
            shapeName = 'waveform';
        } else if (type < 122) {
            typeName = 'speech';
            waveName = 'type';
            timbreName = 'timbre';
            shapeName = 'word';
        } else {
            typeName = 'modal';
            waveName = 'inharm';
            timbreName = 'timbre';
            shapeName = 'decay';
        }
        
        setGlobalParams({
            name: 'random'
        });
        setPatchParams({
            analogFilter: {
                cutoff: Math.floor(Math.random() * 128),
                filterType: filterTypes[Math.floor(Math.random() * 3)],
                resonance: Math.floor(Math.random() * 128)
            },
            arpeggiator: {
                hold: coinToss(),
                oct: octs[Math.floor(Math.random() * 4)],
                on: coinToss(),
                pattern: patterns[Math.floor(Math.random() * 4)],
                rateFree:  Math.floor(Math.random() * 128),
                rateSync:  Math.floor(Math.random() * 128),
                sync: coinToss(),
            },
            cyclingEnvelope: {
                amount: Math.floor(Math.random() * 128),
                fall: Math.floor(Math.random() * 128),
                fallShape: Math.floor(Math.random() * 128),
                holdSustain: Math.floor(Math.random() * 128),
                mode: cyclingModes[Math.floor(Math.random() * 3)],
                rise: Math.floor(Math.random() * 128),
                riseShape: Math.floor(Math.random() * 128)
            },
            digitalOscillator: {
                shape: Math.floor(Math.random() * 128),
                shapeName: shapeName,
                timbre: Math.floor(Math.random() * 128),
                timbreName: timbreName,
                type: type,
                typeName: typeName,
                wave: Math.floor(Math.random() * 128),
                waveName: waveName
            },
            envelopeGenerator: {
                ampMod: coinToss(),
                attack: Math.floor(Math.random() * 128),
                decayRelease: Math.floor(Math.random() * 128),
                filterAmount: Math.floor(Math.random() * 128),
                sustain: Math.floor(Math.random() * 128)
            },
            glide: {
                glide: Math.floor(Math.random() * 128)
            },
            lfo: {
                rateFree: Math.floor(Math.random() * 128),
                rateSync: Math.floor(Math.random() * 128),
                shape: lfoShapes[Math.floor(Math.random() * 6)],
                sync: coinToss()
            },
            paraphonic: coinToss(),
            spice: {
                dice: dice,
                spice: spice
            }
        });
        setModulationMatrix({
            assign1: assignments[Math.floor(Math.random() * assignments.length)].uuid,
            assign2: assignments[Math.floor(Math.random() * assignments.length)].uuid,
            assign3: assignments[Math.floor(Math.random() * assignments.length)].uuid,
            assign1MatrixModulationTarget: matrixModulationTargets[Math.floor(Math.random() * matrixModulationTargets.length)],
            assign2MatrixModulationTarget: matrixModulationTargets[Math.floor(Math.random() * matrixModulationTargets.length)],
            assign3MatrixModulationTarget: matrixModulationTargets[Math.floor(Math.random() * matrixModulationTargets.length)],
            currentDisplay: 'cycEnvAssign1',
            cycEnvAssign1: coinToss(),
            cycEnvAssign1Amount: Math.floor(Math.random() * 128),
            cycEnvAssign2: coinToss(),
            cycEnvAssign2Amount: Math.floor(Math.random() * 128),
            cycEnvAssign3: coinToss(),
            cycEnvAssign3Amount: Math.floor(Math.random() * 128),
            cycEnvCutoff: coinToss(),
            cycEnvCutoffAmount: Math.floor(Math.random() * 128),
            cycEnvPitch: coinToss(),
            cycEnvPitchAmount: Math.floor(Math.random() * 128),
            cycEnvTimbre: coinToss(),
            cycEnvTimbreAmount: Math.floor(Math.random() * 128),
            cycEnvWave: coinToss(),
            cycEnvWaveAmount: Math.floor(Math.random() * 128),
            envAssign1: coinToss(),
            envAssign1Amount: Math.floor(Math.random() * 128),
            envAssign2: coinToss(),
            envAssign2Amount: Math.floor(Math.random() * 128),
            envAssign3: coinToss(),
            envAssign3Amount: Math.floor(Math.random() * 128),
            envCutoff: coinToss(),
            envCutoffAmount: Math.floor(Math.random() * 128),
            envPitch: coinToss(),
            envPitchAmount: Math.floor(Math.random() * 128),
            envTimbre: coinToss(),
            envTimbreAmount: Math.floor(Math.random() * 128),
            envWave: coinToss(),
            envWaveAmount: Math.floor(Math.random() * 128),
            keyarpAssign1: coinToss(),
            keyarpAssign1Amount: Math.floor(Math.random() * 128),
            keyarpAssign2: coinToss(),
            keyarpAssign2Amount: Math.floor(Math.random() * 128),
            keyarpAssign3: coinToss(),
            keyarpAssign3Amount: Math.floor(Math.random() * 128),
            keyarpCutoff: coinToss(),
            keyarpCutoffAmount: Math.floor(Math.random() * 128),
            keyarpPitch: coinToss(),
            keyarpPitchAmount: Math.floor(Math.random() * 128),
            keyarpTimbre: coinToss(),
            keyarpTimbreAmount: Math.floor(Math.random() * 128),
            keyarpWave: coinToss(),
            keyarpWaveAmount: Math.floor(Math.random() * 128),
            lfoAssign1: coinToss(),
            lfoAssign1Amount: Math.floor(Math.random() * 128),
            lfoAssign2: coinToss(),
            lfoAssign2Amount: Math.floor(Math.random() * 128),
            lfoAssign3: coinToss(),
            lfoAssign3Amount: Math.floor(Math.random() * 128),
            lfoCutoff: coinToss(),
            lfoCutoffAmount: Math.floor(Math.random() * 128),
            lfoPitch: coinToss(),
            lfoPitchAmount: Math.floor(Math.random() * 128),
            lfoTimbre: coinToss(),
            lfoTimbreAmount: Math.floor(Math.random() * 128),
            lfoWave: coinToss(),
            lfoWaveAmount: Math.floor(Math.random() * 128),
            pressureAssign1: coinToss(),
            pressureAssign1Amount: Math.floor(Math.random() * 128),
            pressureAssign2: coinToss(),
            pressureAssign2Amount: Math.floor(Math.random() * 128),
            pressureAssign3: coinToss(),
            pressureAssign3Amount: Math.floor(Math.random() * 128),
            pressureCutoff: coinToss(),
            pressureCutoffAmount: Math.floor(Math.random() * 128),
            pressurePitch: coinToss(),
            pressurePitchAmount: Math.floor(Math.random() * 128),
            pressureTimbre: coinToss(),
            pressureTimbreAmount: Math.floor(Math.random() * 128),
            pressureWave: coinToss(),
            pressureWaveAmount: Math.floor(Math.random() * 128)
        });
        setTimeout(() => {
            sendFullPatch();
        }, 2000);
    }
    
    const selectSubModulator = (val) => {
        let deepCopy = {...modulationMatrix};
        
        if (currentModulateModulate === 'assign1') {
            deepCopy.assign1MatrixModulationTarget = val;
            updatePatch('modulateModulate1', val);
        } else if (currentModulateModulate === 'assign2') {
            deepCopy.assign2MatrixModulationTarget = val;
            updatePatch('modulateModulate2', val);
        } else {
            deepCopy.assign3MatrixModulationTarget = val;
            updatePatch('modulateModulate3', val);
        }
        
        setModulationMatrix(deepCopy);
        setSubModulateModalState('_Inactive');
        setMicrofreakMatrixState('_Active');
        currentModulateModulate = '';
    }
    
    const updateModulationModulatorSelection = (assign) => {
        setSubModulateModalState('_Active');
        setMicrofreakMatrixState('_Inactive');
        currentModulateModulate = assign;
    }
    
    const updateAssign1 = (val) => {
        let deepCopy = {...modulationMatrix};
        
        deepCopy.assign1 = val;
        
        if (val=== '4355749d-178d-47d4-b68b-d678437ba44e') {
            updateModulationModulatorSelection('assign1');
        } else {
           deepCopy.assign1MatrixModulationTarget = null; 
        }
        setModulationMatrix(deepCopy);
        updatePatch('assign1', val);
    }
    
    const updateAssign2 = (val) => {
        let deepCopy = {...modulationMatrix};
        
        deepCopy.assign2 = val;
        
        if (val=== '4355749d-178d-47d4-b68b-d678437ba44e') {
            updateModulationModulatorSelection('assign2');
        } else {
            deepCopy.assign2MatrixModulationTarget = null;
        }
        setModulationMatrix(deepCopy);
        updatePatch('assign2', val);
    }
    
    const updateAssign3 = (val) => {
        let deepCopy = {...modulationMatrix};
        
        deepCopy.assign3 = val;
        
        if (val=== '4355749d-178d-47d4-b68b-d678437ba44e') {
            updateModulationModulatorSelection('assign3');
        } else {
            deepCopy.assign3MatrixModulationTarget = null;
        }
        setModulationMatrix(deepCopy);
        updatePatch('assign3', val);
    }
    
    const updateCurrentModulationDisplayValue = (val) => {
        let deepCopy = {...modulationMatrix};
        
        deepCopy[deepCopy.currentDisplay + 'Amount'] = val;
        
        setModulationMatrix(deepCopy);
        updatePatch(deepCopy.currentDisplay + 'Amount', val);
    }
    
    const updateMatrix = (val) => {
        let deepCopy = {...modulationMatrix};
        
        deepCopy[val] = !deepCopy[val];
        if (deepCopy[val]) {
            deepCopy.currentDisplay = val;
            if (val.toLowerCase().indexOf('assign1') !== -1) {
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (val.toLowerCase().indexOf('assign2') !== -1) {
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (val.toLowerCase().indexOf('assign3') !== -1) {
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else {
               updateModulationMessage(''); 
            }
        } else {
            if (deepCopy.cycEnvPitch) {
                deepCopy.currentDisplay = 'cycEnvPitch';
                updateModulationMessage('');
            } else if (deepCopy.cycEnvWave) {
                deepCopy.currentDisplay = 'cycEnvWave';
                updateModulationMessage('');
            } else if (deepCopy.cycEnvTimbre) {
                deepCopy.currentDisplay = 'cycEnvTimbre';
                updateModulationMessage('');
            } else if (deepCopy.cycEnvCutoff) {
                deepCopy.currentDisplay = 'cycEnvCutoff';
                updateModulationMessage('');
            } else if (deepCopy.cycEnvAssign1) {
                deepCopy.currentDisplay = 'cycEnvAssign1';
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (deepCopy.cycEnvAssign2) {
                deepCopy.currentDisplay = 'cycEnvAssign2';
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (deepCopy.cycEnvAssign3) {
                deepCopy.currentDisplay = 'cycEnvAssign3';
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else if (deepCopy.envPitch) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'envPitch';
            } else if (deepCopy.envWave) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'envWave';
            } else if (deepCopy.envTimbre) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'envTimbre';
            } else if (deepCopy.envCutoff) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'envCutoff';
            } else if (deepCopy.envAssign1) {
                deepCopy.currentDisplay = 'envAssign1';
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (deepCopy.envAssign2) {
                deepCopy.currentDisplay = 'envAssign2';
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (deepCopy.envAssign3) {
                deepCopy.currentDisplay = 'envAssign3';
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else if (deepCopy.lfoPitch) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'lfoPitch';
            } else if (deepCopy.lfoWave) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'lfoWave';
            } else if (deepCopy.lfoTimbre) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'lfoTimbre';
            } else if (deepCopy.lfoCutoff) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'lfoCutoff';
            } else if (deepCopy.lfoAssign1) {
                deepCopy.currentDisplay = 'lfoAssign1';
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (deepCopy.lfoAssign2) {
                deepCopy.currentDisplay = 'lfoAssign2';
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (deepCopy.lfoAssign3) {
                deepCopy.currentDisplay = 'lfoAssign3';
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else if (deepCopy.pressurePitch) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'pressurePitch';
            } else if (deepCopy.pressureWave) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'pressureWave';
            } else if (deepCopy.pressureTimbre) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'pressureTimbre';
            } else if (deepCopy.pressureCutoff) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'pressureCutoff';
            } else if (deepCopy.pressureAssign1) {
                deepCopy.currentDisplay = 'pressureAssign1';
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (deepCopy.pressureAssign2) {
                deepCopy.currentDisplay = 'pressureAssign2';
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (deepCopy.pressureAssign3) {
                deepCopy.currentDisplay = 'pressureAssign3';
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else if (deepCopy.keyarpPitch) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'keyarpPitch';
            } else if (deepCopy.keyarpWave) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'keyarpWave';
                updateModulationMessage('');
            } else if (deepCopy.keyarpTimbre) {
                updateModulationMessage('');
                deepCopy.currentDisplay = 'keyarpTimbre';
            } else if (deepCopy.keyarpCutoff) {
                updateModulationMessage(''); 
                deepCopy.currentDisplay = 'keyarpCutoff';
            } else if (deepCopy.keyarpAssign1) {
                deepCopy.currentDisplay = 'keyarpAssign1';
                if ((deepCopy.assign1MatrixModulationTarget === null) || (deepCopy.assign1MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign1MatrixModulationTarget);
                }
            } else if (deepCopy.keyarpAssign2) {
                deepCopy.currentDisplay = 'keyarpAssign2';
                if ((deepCopy.assign2MatrixModulationTarget === null) || (deepCopy.assign2MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign2MatrixModulationTarget);
                }
            } else if (deepCopy.keyarpAssign3) {
                deepCopy.currentDisplay = 'keyarpAssign3';
                if ((deepCopy.assign3MatrixModulationTarget === null) || (deepCopy.assign3MatrixModulationTarget === '')) {
                   updateModulationMessage(''); 
                } else {
                   updateModulationMessage(deepCopy.assign3MatrixModulationTarget);
                }
            } else {
                updateModulationMessage('');
                deepCopy.currentDisplay = '';
            }
        }
        
        setModulationMatrix(deepCopy);
        updatePatch(val, deepCopy[val]);
    }
    
    const updateParaphonicState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.paraphonic = !deepCopy.paraphonic;
        
        setPatchParams(deepCopy);
        updatePatch('paraphonicState', deepCopy.paraphonic);
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
        updatePatch('diceState', deepCopy.spice.dice);
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
        updatePatch('spiceState', deepCopy.spice.spice);
    }
    
    const updateArpeggiateHoldState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.hold = !deepCopy.arpeggiator.hold;
        
        setPatchParams(deepCopy);
        updatePatch('keyHold', deepCopy.arpeggiator.hold);
    }
    
    const updateArpeggiatorPattern = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.pattern = val;
        
        setPatchParams(deepCopy);
        updatePatch('arpPattern', val);
    }
    
    const updateARPRateValue = (val) => {
        let deepCopy = {...patchParams};
        
        if (deepCopy.arpeggiator.sync) {
            deepCopy.arpeggiator.rateSync = val;
        } else {
            deepCopy.arpeggiator.rateFree = val;
        }
        
        setPatchParams(deepCopy);
        updatePatch('arpRate', val);
    }
    
    const updateArpeggiateOct = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.oct = val;
        
        setPatchParams(deepCopy);
        updatePatch('arpeggiatorOctave', val);
    }
    
    const updateArpeggiateSyncState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.sync = !deepCopy.arpeggiator.sync;
        
        setPatchParams(deepCopy);
        updatePatch('arpeggiatorSync', deepCopy.arpeggiator.sync);
    }
    
    const updateArpeggiateOnState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.arpeggiator.on = !deepCopy.arpeggiator.on;
        
        setPatchParams(deepCopy);
        updatePatch('apreggiatorSwitch', deepCopy.arpeggiator.on);
    }
    
    const updateLFORateValue = (val) => {
        let deepCopy = {...patchParams};
        
        if (deepCopy.lfo.sync) {
            deepCopy.lfo.rateSync = val;
        } else {
            deepCopy.lfo.rateFree = val;
        }
        
        setPatchParams(deepCopy);
        updatePatch('lfoRate', val);
    }
    
    const updateLFOSyncState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.lfo.sync = !deepCopy.lfo.sync;
        
        setPatchParams(deepCopy);
        updatePatch('lfoSync', deepCopy.lfo.sync);
    }
    
    const updateLFOShapeState = (val) => {
        if (patchParams.lfo.shape === val) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.lfo.shape = val;
        
        setPatchParams(deepCopy);
        updatePatch('lfoShape', val);
    }
    
    const updateCyclingEnvelopeAmountValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.amount = val;
        
        setPatchParams(deepCopy);
        updatePatch('cyclingAmount', val);
    }
    
    const updateCyclingEnvelopeHoldSustainValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.holdSustain = val;
        
        setPatchParams(deepCopy);
        updatePatch('holdSustain', val);
    }
    
    const updateCyclingEnvelopeFallShapeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.fallShape = val;
        
        setPatchParams(deepCopy);
        updatePatch('fallShape', val);
    }
    
    const updateCyclingEnvelopeFallValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.fall = val;
        
        setPatchParams(deepCopy);
        updatePatch('fall', val);
    }
    
    const updateCyclingEnvelopeRiseShapeValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.riseShape = val;
        
        setPatchParams(deepCopy);
        updatePatch('riseShape', val);
    }
    
    const updateCyclingEnvelopeRiseValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.rise = val;
        
        setPatchParams(deepCopy);
        updatePatch('cycleRise', val);
    }
    
    const updateCyclingEnvelopeModeState = (val) => {
        if (patchParams.cyclingEnvelope.mode === val) {
            return;
        }
        let deepCopy = {...patchParams};
        
        deepCopy.cyclingEnvelope.mode = val;
        
        setPatchParams(deepCopy);
        updatePatch('cyclingEnvelopeMode', val);
    }
    
    const updateEnvelopeGeneratorFilterAmountValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.filterAmount = val;
        
        setPatchParams(deepCopy);
        updatePatch('filterAmount', val);
    }
    
    const updateEnvelopeGeneratorSustainValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.sustain = val;
        
        setPatchParams(deepCopy);
        updatePatch('sustain', val);
    }
    
    const updateEnvelopeGeneratorDecayReleaseValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.decayRelease = val;
        
        setPatchParams(deepCopy);
        updatePatch('decayRelease', val);
    }
    
    const updateEnvelopeGeneratorAttackValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.attack = val;
        
        setPatchParams(deepCopy);
        updatePatch('attack', val);
    }
    
     const updateAmplitudeModulationState = () => {
        let deepCopy = {...patchParams};
        
        deepCopy.envelopeGenerator.ampMod = !deepCopy.envelopeGenerator.ampMod;
        
        setPatchParams(deepCopy);
        updatePatch('amplitudeModulation', deepCopy.envelopeGenerator.ampMod);
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
            deepCopy.digitalOscillator.shapeName = 'feedback';
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
        updatePatch('filterType', type);
        
    }
    
    const updateAnalogFilterCutoffValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.analogFilter.cutoff = val;
        
        setPatchParams(deepCopy);
        updatePatch('cutoff', val);
    }
    
    const updateAnalogFilterResonanceValue = (val) => {
        let deepCopy = {...patchParams};
        
        deepCopy.analogFilter.resonance = val;
        
        setPatchParams(deepCopy);
        updatePatch('resonance', val);
    }
    
    const calculateCutoffDisplay = (val) => {
        return((Math.floor(((109/127) * val) + 160)/10).toFixed(1).toString() + 'Hz');
    }
    
    const panic = () => {
        setPanicState('_Active');
        setMicrofreakContainerState('_Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('_Inactive');
            setMicrofreakContainerState('_Active');
        }, availableOutputs.length * 2000);
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
                    <button className={'microfreakLoadButton' + microfreakMonth}
                        onClick={() => openLoadModal()}>load</button>
                    <input className={'microfreakPatchNameInput' + microfreakMonth}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'microfreakPanicButton' + microfreakMonth}
                        onClick={() => panic()}>panic!</button>
                    <div className={'microfreakSidebarManager' + microfreakMonth}>
                        <div className={'microfreakSidebarContainer' + microfreakMonth}>
                            <img className={'microfreakImage1' + microfreakMonth}
                                src={microImage} />
                            <button className={'microfreakSaveButton' + patchAltered + microfreakMonth}
                                onClick={() => savePatch()}>save</button>
                            <button className={'microfreakSaveAsButton' + microfreakMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'microfreakRevertButton' + patchAltered + microfreakMonth}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'microfreakMidiOutputLabel' + microfreakMonth}>midi output:</p>
                            <select className={'microfreakMidiOutputSelect' + microfreakMonth}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <p className={'microfreakMidiChannelLabel' + microfreakMonth}>channel:</p>
                            <input className={'microfreakMidiChannelInput' + microfreakMonth}
                                max="15"
                                min="0"
                                onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                step="1"
                                type="number"
                                value={currentMidiChannel}/>
                            <button className={'microfreakInitButton' + microfreakMonth}
                                onClick={() => initPatch()}>init</button>
                            <button className={'microfreakRandomButton' + microfreakMonth}
                                onClick={() => makeRandomPatch()}>random</button>
                            <button className={'aboutMicrofreakButton' + microfreakMonth}
                                onClick={() => openMicrofreakAboutDiv()}>about</button>
                        </div>
                    </div>
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
                        <div className={'microfreakLFOTriangleLight' + (patchParams.lfo.shape === 'triangle') + microfreakMonth}
                            onClick={() => updateLFOShapeState('triangle')}></div>
                        <p className={'microfreakLFOTriangleLabel' + (patchParams.lfo.shape === 'triangle') + microfreakMonth}
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
                        <p className={'microfreakLFORateDisplay' + microfreakMonth}>{calculateLFORateDisplay()}</p>
                        {(patchParams.lfo.sync) && (
                            <div className={'microfreakLFORateInputContainer' + microfreakMonth}>
                                <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateLFORateValue(e.target.value)}
                                    type="range"
                                    value={patchParams.lfo.rateSync} />
                            </div>
                        )}
                        {(!patchParams.lfo.sync) && (
                            <div className={'microfreakLFORateInputContainer' + microfreakMonth}>
                                <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateLFORateValue(e.target.value)}
                                    type="range"
                                    value={patchParams.lfo.rateFree} />
                            </div>
                        )}
                        
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
                        {(patchParams.arpeggiator.sync) && (
                            <div className={'microfreakARPRateInputContainer' + microfreakMonth}>
                                <input className={'microfreakArpRangeInput' + microfreakMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateARPRateValue(e.target.value)}
                                    type="range"
                                    value={patchParams.arpeggiator.rateSync} />
                            </div>
                        )}
                        {(!patchParams.arpeggiator.sync) && (
                            <div className={'microfreakARPRateInputContainer' + microfreakMonth}>
                                <input className={'microfreakArpRangeInput' + microfreakMonth}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateARPRateValue(e.target.value)}
                                    type="range"
                                    value={patchParams.arpeggiator.rateFree} />
                            </div>
                        )}
                        <p className={'microfreakARPRateDisplay' + microfreakMonth}>{calculateARPRateDisplay()}</p>
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
                        <button className={'microfreakMatrixButton' + microfreakMonth}
                            onClick={() => displayMatrix()}>matrix</button>
                    </div>
                </div>
            </div>
            <div className={'microfreakSaveAsDialogDiv' + saveAsDialogStatus + microfreakMonth}>
                <p>save as</p>
                <input className={'microfreakSaveAsInput' + microfreakMonth}
                    id="microfreakSaveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + globalParams.name}
                    value={saveAsName} />
                <div className={'microfreakSaveAsButtonsDiv' + microfreakMonth}>
                    <button className={'microfreakSaveAsButtons' + microfreakMonth}
                        onClick={() => microfreakSubmitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'microfreakSaveAsButtons' + microfreakMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheArturiaMicrofreakDiv' + aboutMicrofreakDivState + microfreakMonth}>
                <div className={'aboutArturiaMicrofreakContent' + microfreakMonth}>
                    <img className={'microfreakAboutImg' + microfreakMonth}
                        src={microImage} />
                    <h2>Arturia Microfreak</h2>
                    <h3>EXPERIMENTAL HYBRID SYNTH</h3>
                    <p>A synthesizer like no other, MicroFreak is a peculiar, exceptional instrument that rewards the curious musician. It blends wavetable and digital oscillators with analog filters. It features a unique poly-aftertouch flat keyboard. It adds controlled randomness to sequences. This isn’t a revolution, it’s a mutiny.</p>
                    <h2>Here's How it Works</h2>
                    <p>MicroFreak is a four-voice paraphonic synth – when the Paraphonic button is engaged, you can play up to four voices at once, but all share the same filter, envelope and under-the-hood VCA settings.</p>
                    <p>Sound generation is handled by the single Digital Oscillator, several variations of which implement Mutable Instruments’ open-source designs. 12 modes are available: choose one with the Type knob, and the OLED screen is populated by three parameters, unique for each mode, adjusted with Wave, Timbre and Shape knobs and seen onscreen with little ‘test tube’ meters. Funky. </p>
                    <p>The 12 modes cover a huge range of analogue-emulating and digital types, giving massive tonal potential. The Basic Waves and Virtual Analog oscillators serve up continuously variable waveforms for classic VA sound design, while the Superwave mode delivers detuned fatness for more modern basses, leads and pads. </p>
                    <p>For more complex wave scanning, there’s a Wavetable oscillator; the Harmonic oscillator, complete with Chorus, is useful for dialling in additive, bell-like timbres; the Karplus-Strong mode is a physical-modelling oscillator that facilitates the creation of bow- and string-like sounds; and the Modal Resonator replicates the tuned ringing of real instruments and drums.</p>
                    <p>Unsurprisingly for a digital synth, there’s a two-sine-operator FM (frequency modulation) oscillator, which features Ratio, FM amount and Feedback controls. The Waveshaper mode, meanwhile, uses a combo of waveshaping and wavefolding, and can spit out biting basses and resonant harmonic tones with ease.</p>
                    <p>Aside from these well-known synthesis types, MicroFreak also features several experimentally-minded oscillator modes. The Speak-and-Spell-style Speech mode outputs synthetic vowels and consonants that can be scanned through, while the Granular Formant oscillator breaks a waveform into ‘particles’ and allows you to recombine formants in various ways.</p>
                    <p>For us, though, the USP is the Chords oscillator, which outputs a four-voice chord. The Wave knob is used to choose one of 11 chords, the Timbre knob switches the current inversion, and Shape scans through a host of waveform shapes.</p>
                    <p>As you can tell, MicroFreak often feels like multiple synths in one. If you’re stuck for ideas when dialling in a patch, quickly flipping over to a different oscillator mode can instantly inspire something new out of thin air.</p>
                    <p>On the downside, being a digital synth, a lot of these oscillator types can sound a little… well, digital. However, this isn’t necessarily a bad thing – when you need a brash, harmonically complex sound that can slice through a mix, MicroFreak can do it in so many different ways. </p>
                    <h3>Filter fun</h3>
                    <p>While the oscillator is unashamedly digital, the filter it feeds into is fully analogue, albeit digitally controlled. Inspired by the classic Oberheim SEM design, this state-variable, two-pole tone-shaper can be switched between low-, high- and band-pass modes with the Type button, and is flanked by Cutoff and Resonance knobs.</p>
                    <p>In use, it sounds smooth across a wide range of settings, and high Resonance settings result in meaty boosts up to a satisfying ‘howl’. The 12dB/oct design is obviously a little smoother and less intrusive than 24dB/oct designs, and we’d have loved another mode for deeper filtering tasks, but that may be too much to ask for at this price point.   </p>
                    <p>MicroFreak’s oscillator and filter parameters are obvious candidates for modulation, and the synth’s 5x7 “switchboard” Matrix makes setting this a breeze. The seven horizontal rows represent mod destinations – the first four are hardwired to Pitch, Wave, Timbre and Cutoff, while the Assign 1, 2 and 3 slots can be freely assigned by clicking a top button and twisting the desired parameter on the synth. The five vertical columns equate to the five available mod sources: Cycling Envelope, Envelope, LFO, keyboard Pressure and Key/Arp. </p>
                    <p>To hook up modulation, spin the Matrix encoder to select a specific crossing point between source and destination, indent it to activate, then turn the knob left or right to apply negative or positive modulation. It’s a fast, intuitive workflow that encourages you to try out multiple mod assignments on the fly. </p>
                    <p>Speaking of modulation sources, MicroFreak offers three main modulators: two envelopes and an LFO. The regular Envelope (Attack, Decay/Release and Sustain) is hardwired to the filter, with cutoff mod depth applied with the bipolar Filter Amt knob. This envelope can also govern amplitude when the Amp Mod toggle button is engaged.</p>
                    <p>The Cycling Envelope can operate in either a regular one-shot Envelope mode; a Run mode, which acts as a free-running LFO of sorts; or be set to Loop, analogous to a retriggering LFO. Its influence can be tempered by pulling back the Amount knob, while tweaking Rise, Fall and Hold/Sustain amounts lets you create and merge complex mod signals. You can even bend the Rise and Fall curves between linear, logarithmic and exponential shapes by Shift-turning the knobs. In practical terms, this Cycling Envelope can create everything from slow, repeating rises/falls and gurgles right up to audio-rate weirdness, while OLED visual feedback shows what’s going on.</p>
                    <p>MicroFreak’s single low-frequency oscillator is fairly basic, but gets the job done. Select one of six shapes with the Shape button, while speed is set with the Rate encoder (click this in to switch between unclocked and tempo-synced modes). It can also be set to retrigger, envelope-style.</p>
                    <p>Eight icons sit above the keyboard. The first allows you to Hold notes for extended playing. The next four (Up, Order, Random and Pattern) are used to operate either the Arpeggiator or Sequencer depending on which is selected – random options for the former, and note entry and transport controls for the latter. The next two icons, abstractly named Spice and Dice, are used together in conjunction with Touch Strip presses to effectively shorten, lengthen and pause Arpeggiator or Sequencer notes for on-the-fly performance changes.</p>
                    <h3>Uniquely freaky</h3>
                    <p>With so many synthesis features packed into such a small box, it’s hard not to fall in love with Arturia’s latest hardware offering. The multiple oscillator modes cover a near-endless range of timbres; the filter is smooth and versatile; the Matrix invites exploratory modulation; and the performance and sequencing tools are the icing on the creative cake.</p>
                    <p>However, the real magic lies in the combo of all these together, making this odd little beast far more than the sum of its parts. MicroFreak should be top of your ‘must try’ list.</p>
                </div>
                <div className={'microfreakSaveAsButtonsDiv' + microfreakMonth}>
                    <button className={'microfreakSaveAsButtons' + microfreakMonth}
                        onClick={() => closeMicrofreakAboutDiv()}>close</button>
                </div>
            </div>
            <div className={'microfreakLoadModal' + microfreakLoadModalState + microfreakMonth}>
                <div className={'microfreakLoadContainer' + microfreakMonth}>
                    <p className={'microfreakLoadTitle' + microfreakMonth}>Load Microfreak Patch</p>
                    <select className={'microfreakLoadSelector' + microfreakMonth}
                        onChange={(e) => {resetLoadPatchUuid(e.target.value)}}
                        value={loadPatchUuid}>
                        {userPatches.map(patch => (
                                <option key={patch.uuid} value={patch.uuid}>{patch.patch_name}</option>))}
                    </select>
                    <button className={'microfreakLoadLoadButton' + microfreakMonth}
                        onClick={() => loadSelectedPatch()}>load</button>
                    <button className={'microfreakLoadCancelButton' + microfreakMonth}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
            <div className={'microfreakMatrixDiv' + microfreakMatrixState + microfreakMonth}>
                <div className={'microfreakMatrixContainer' + microfreakMonth}>
                    <p className={'microfreakMatrixPitchDestinationLabel' + microfreakMonth}>pitch</p>
                    <p className={'microfreakMatrixWaveDestinationLabel' + microfreakMonth}>wave</p>
                    <p className={'microfreakMatrixTimbreDestinationLabel' + microfreakMonth}>timbre</p>
                    <p className={'microfreakMatrixCutoffDestinationLabel' + microfreakMonth}>cutoff</p>
                    <select className={'microfreakMatrixAssign1Select' + microfreakMonth}
                        onChange={(e) => updateAssign1(e.target.value)}
                        value={modulationMatrix.assign1}>
                        {assignments.map(parameter => (
                            <option key={parameter.uuid} value={parameter.uuid}>{parameter.name}</option>
                        ))}
                        </select>
                    <select className={'microfreakMatrixAssign2Select' + microfreakMonth}
                        onChange={(e) => updateAssign2(e.target.value)}
                        value={modulationMatrix.assign2}>
                        {assignments.map(parameter => (
                            <option key={parameter.uuid} value={parameter.uuid}>{parameter.name}</option>
                        ))}
                        </select>
                    <select className={'microfreakMatrixAssign3Select' + microfreakMonth}
                        onChange={(e) => updateAssign3(e.target.value)}
                        value={modulationMatrix.assign3}>
                        {assignments.map(parameter => (
                            <option key={parameter.uuid} value={parameter.uuid}>{parameter.name}</option>
                        ))}
                        </select>
                    <p className={'microfreakMatrixCycleEnvelopeSourceLabel' + microfreakMonth}>CycEnv</p>
                    <div className={'microfreakCycEnvPitch' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvPitch) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvPitch')}></div>
                    </div>
                    <div className={'microfreakCycEnvWave' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvWave) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvWave')}></div>
                    </div>
                    <div className={'microfreakCycEnvTimbre' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvTimbre) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvTimbre')}></div>
                    </div>
                    <div className={'microfreakCycEnvCutoff' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvCutoff) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvCutoff')}></div>
                    </div>
                    <div className={'microfreakCycEnvAssign1' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvAssign1) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvAssign1')}></div>
                    </div>
                    <div className={'microfreakCycEnvAssign2' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvAssign2) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvAssign2')}></div>
                    </div>
                    <div className={'microfreakCycEnvAssign3' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.cycEnvAssign3) + microfreakMonth}
                            onClick={() => updateMatrix('cycEnvAssign3')}></div>
                    </div>
                    <p className={'microfreakMatrixEnvelopeSourceLabel' + microfreakMonth}>ENV</p>
                    <div className={'microfreakEnvPitch' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envPitch) + microfreakMonth}
                            onClick={() => updateMatrix('envPitch')}></div>
                    </div>
                    <div className={'microfreakEnvWave' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envWave) + microfreakMonth}
                            onClick={() => updateMatrix('envWave')}></div>
                    </div>
                    <div className={'microfreakEnvTimbre' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envTimbre) + microfreakMonth}
                            onClick={() => updateMatrix('envTimbre')}></div>
                    </div>
                    <div className={'microfreakEnvCutoff' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envCutoff) + microfreakMonth}
                            onClick={() => updateMatrix('envCutoff')}></div>
                    </div>
                    <div className={'microfreakEnvAssign1' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envAssign1) + microfreakMonth}
                            onClick={() => updateMatrix('envAssign1')}></div>
                    </div>
                    <div className={'microfreakEnvAssign2' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envAssign2) + microfreakMonth}
                            onClick={() => updateMatrix('envAssign2')}></div>
                    </div>
                    <div className={'microfreakEnvAssign3' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.envAssign3) + microfreakMonth}
                            onClick={() => updateMatrix('envAssign3')}></div>
                    </div>
                    <p className={'microfreakMatrixLFOSourceLabel' + microfreakMonth}>LFO</p>
                    <div className={'microfreakLFOPitch' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoPitch) + microfreakMonth}
                            onClick={() => updateMatrix('lfoPitch')}></div>
                    </div>
                    <div className={'microfreakLFOWave' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoWave) + microfreakMonth}
                            onClick={() => updateMatrix('lfoWave')}></div>
                    </div>
                    <div className={'microfreakLFOTimbre' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoTimbre) + microfreakMonth}
                            onClick={() => updateMatrix('lfoTimbre')}></div>
                    </div>
                    <div className={'microfreakLFOCutoff' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoCutoff) + microfreakMonth}
                            onClick={() => updateMatrix('lfoCutoff')}></div>
                    </div>
                    <div className={'microfreakLFOAssign1' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoAssign1) + microfreakMonth}
                            onClick={() => updateMatrix('lfoAssign1')}></div>
                    </div>
                    <div className={'microfreakLFOAssign2' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoAssign2) + microfreakMonth}
                            onClick={() => updateMatrix('lfoAssign2')}></div>
                    </div>
                    <div className={'microfreakLFOAssign3' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.lfoAssign3) + microfreakMonth}
                            onClick={() => updateMatrix('lfoAssign3')}></div>
                    </div>
                    <p className={'microfreakMatrixPressureSourceLabel' + microfreakMonth}>Pressure</p>
                    <div className={'microfreakPressurePitch' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressurePitch) + microfreakMonth}
                            onClick={() => updateMatrix('pressurePitch')}></div>
                    </div>
                    <div className={'microfreakPressureWave' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureWave) + microfreakMonth}
                            onClick={() => updateMatrix('pressureWave')}></div>
                    </div>
                    <div className={'microfreakPressureTimbre' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureTimbre) + microfreakMonth}
                            onClick={() => updateMatrix('pressureTimbre')}></div>
                    </div>
                    <div className={'microfreakPressureCutoff' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureCutoff) + microfreakMonth}
                            onClick={() => updateMatrix('pressureCutoff')}></div>
                    </div>
                    <div className={'microfreakPressureAssign1' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureAssign1) + microfreakMonth}
                            onClick={() => updateMatrix('pressureAssign1')}></div>
                    </div>
                    <div className={'microfreakPressureAssign2' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureAssign2) + microfreakMonth}
                            onClick={() => updateMatrix('pressureAssign2')}></div>
                    </div>
                    <div className={'microfreakPressureAssign3' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.pressureAssign3) + microfreakMonth}
                            onClick={() => updateMatrix('pressureAssign3')}></div>
                    </div>
                    <p className={'microfreakMatrixKeyArpSourceLabel' + microfreakMonth}>Key/Arp</p>
                    <div className={'microfreakKeyarpPitch' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpPitch) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpPitch')}></div>
                    </div>
                    <div className={'microfreakKeyarpWave' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpWave) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpWave')}></div>
                    </div>
                    <div className={'microfreakKeyarpTimbre' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpTimbre) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpTimbre')}></div>
                    </div>
                    <div className={'microfreakKeyarpCutoff' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpCutoff) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpCutoff')}></div>
                    </div>
                    <div className={'microfreakKeyarpAssign1' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpAssign1) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpAssign1')}></div>
                    </div>
                    <div className={'microfreakKeyarpAssign2' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpAssign2) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpAssign2')}></div>
                    </div>
                    <div className={'microfreakKeyarpAssign3' + microfreakMonth}>
                        <div className={'microfreakMatrixLight' + (modulationMatrix.keyarpAssign3) + microfreakMonth}
                            onClick={() => updateMatrix('keyarpAssign3')}></div>
                    </div>
                    {((modulationMatrix.cycEnvPitch) || (modulationMatrix.cycEnvWave) || (modulationMatrix.cycEnvTimbre) || (modulationMatrix.cycEnvCutoff) || (modulationMatrix.cycEnvAssign1) || (modulationMatrix.cycEnvAssign2) || (modulationMatrix.cycEnvAssign3) || (modulationMatrix.envPitch) || (modulationMatrix.envWave) || (modulationMatrix.envTimbre) || (modulationMatrix.envCutoff) || (modulationMatrix.envAssign1) || (modulationMatrix.envAssign2) || (modulationMatrix.envAssign3) || (modulationMatrix.lfoPitch) || (modulationMatrix.lfoWave) || (modulationMatrix.lfoTimbre) || (modulationMatrix.lfoCutoff) || (modulationMatrix.lfoAssign1) || (modulationMatrix.lfoAssign2) || (modulationMatrix.lfoAssign3) || (modulationMatrix.pressurePitch) || (modulationMatrix.pressureWave) || (modulationMatrix.pressureTimbre) || (modulationMatrix.pressureCutoff) || (modulationMatrix.pressureAssign1) || (modulationMatrix.pressureAssign2) || (modulationMatrix.pressureAssign3) || (modulationMatrix.keyarpPitch) || (modulationMatrix.keyarpWave) || (modulationMatrix.keyarpTimbre) || (modulationMatrix.keyarpCutoff) || (modulationMatrix.keyarpAssign1) || (modulationMatrix.keyarpAssign2) || (modulationMatrix.keyarpAssign3)) && (
                        <p className={'microfreakModulationMatrixAmountLabel' + microfreakMonth}>
                            modulation amount</p>
                    )}
                    {((modulationMatrix.cycEnvPitch) || (modulationMatrix.cycEnvWave) || (modulationMatrix.cycEnvTimbre) || (modulationMatrix.cycEnvCutoff) || (modulationMatrix.cycEnvAssign1) || (modulationMatrix.cycEnvAssign2) || (modulationMatrix.cycEnvAssign3) || (modulationMatrix.envPitch) || (modulationMatrix.envWave) || (modulationMatrix.envTimbre) || (modulationMatrix.envCutoff) || (modulationMatrix.envAssign1) || (modulationMatrix.envAssign2) || (modulationMatrix.envAssign3) || (modulationMatrix.lfoPitch) || (modulationMatrix.lfoWave) || (modulationMatrix.lfoTimbre) || (modulationMatrix.lfoCutoff) || (modulationMatrix.lfoAssign1) || (modulationMatrix.lfoAssign2) || (modulationMatrix.lfoAssign3) || (modulationMatrix.pressurePitch) || (modulationMatrix.pressureWave) || (modulationMatrix.pressureTimbre) || (modulationMatrix.pressureCutoff) || (modulationMatrix.pressureAssign1) || (modulationMatrix.pressureAssign2) || (modulationMatrix.pressureAssign3) || (modulationMatrix.keyarpPitch) || (modulationMatrix.keyarpWave) || (modulationMatrix.keyarpTimbre) || (modulationMatrix.keyarpCutoff) || (modulationMatrix.keyarpAssign1) || (modulationMatrix.keyarpAssign2) || (modulationMatrix.keyarpAssign3)) && (
                        <p className={'microfreakModulationMatrixAmountDisplay' + microfreakMonth}>{calculateModulationAmountDisplay(modulationMatrix[modulationMatrix.currentDisplay + 'Amount'])}</p>
                    )}
                    {((modulationMatrix.cycEnvPitch) || (modulationMatrix.cycEnvWave) || (modulationMatrix.cycEnvTimbre) || (modulationMatrix.cycEnvCutoff) || (modulationMatrix.cycEnvAssign1) || (modulationMatrix.cycEnvAssign2) || (modulationMatrix.cycEnvAssign3) || (modulationMatrix.envPitch) || (modulationMatrix.envWave) || (modulationMatrix.envTimbre) || (modulationMatrix.envCutoff) || (modulationMatrix.envAssign1) || (modulationMatrix.envAssign2) || (modulationMatrix.envAssign3) || (modulationMatrix.lfoPitch) || (modulationMatrix.lfoWave) || (modulationMatrix.lfoTimbre) || (modulationMatrix.lfoCutoff) || (modulationMatrix.lfoAssign1) || (modulationMatrix.lfoAssign2) || (modulationMatrix.lfoAssign3) || (modulationMatrix.pressurePitch) || (modulationMatrix.pressureWave) || (modulationMatrix.pressureTimbre) || (modulationMatrix.pressureCutoff) || (modulationMatrix.pressureAssign1) || (modulationMatrix.pressureAssign2) || (modulationMatrix.pressureAssign3) || (modulationMatrix.keyarpPitch) || (modulationMatrix.keyarpWave) || (modulationMatrix.keyarpTimbre) || (modulationMatrix.keyarpCutoff) || (modulationMatrix.keyarpAssign1) || (modulationMatrix.keyarpAssign2) || (modulationMatrix.keyarpAssign3)) && (
                        <div className={'microfreakMatrixModulatorInputContainer' + microfreakMonth}>
                            <input className={'microfreakGlideRangeInput' + microfreakMonth}
                                max="127"
                                min="0"
                                onChange={(e) => updateCurrentModulationDisplayValue(e.target.value)}
                                type="range"
                                value={modulationMatrix[modulationMatrix.currentDisplay + 'Amount']} />
                        </div>
                    )}
                    <p className={'microfreakModulationThroughputDisplay' + microfreakMonth}>{calculateCurrentModulationDisplay(modulationMatrix.currentDisplay)}</p>
                    <p className={'microfreakModulationModulationMessage' + microfreakMonth}>{modulationModulation}</p>
                    <button className={'microfreakCloseMatrixButton' + microfreakMonth}
                        onClick={() => closeModulationMatrix()}>close</button>
                    
                </div>
            </div>
            <div className={'microfreakModulateModulationSubModal' + subModulateModalState + microfreakMonth}>
                <div className={'microfreakModulationSubModalContainer' + microfreakMonth}>
                    <p className={'microfreamModulateModulationtitle' + microfreakMonth}>select target modulation source</p>
                    <p className={'microfreakSubTargetPitch' + microfreakMonth}>pitch</p>
                    <p className={'microfreakSubTargetWave' + microfreakMonth}>wave</p>
                    <p className={'microfreakSubTargetTimbre' + microfreakMonth}>timbre</p>
                    <p className={'microfreakSubTargetCutoff' + microfreakMonth}>cutoff</p>
                    <p className={'microfreakSubTargetAssign1' + microfreakMonth}>assign1</p>
                    <p className={'microfreakSubTargetAssign2' + microfreakMonth}>assign2</p>
                    <p className={'microfreakSubTargetAssign3' + microfreakMonth}>assign3</p>
                    <p className={'microfreakSubSourceCycEnv' + microfreakMonth}>CycEnv</p>
                    <div className={'microfreakSubCycEnvPitchBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvPitch')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvWaveBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvWave')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvTimbreBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvTimbre')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvCutoffBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvCutoff')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvAssign1Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvAssign1')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvAssign2Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvAssign2')}></button>
                    </div>
                    <div className={'microfreakSubCycEnvAssign3Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('cycEnvAssign3')}></button>
                    </div>
                    <p className={'microfreakSubSourceEnv' + microfreakMonth}>ENV</p>
                    <div className={'microfreakSubEnvPitchBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envPitch')}></button>
                    </div>
                    <div className={'microfreakSubEnvWaveBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envWave')}></button>
                    </div>
                    <div className={'microfreakSubEnvTimbreBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envTimbre')}></button>
                    </div>
                    <div className={'microfreakSubEnvCutoffBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envCutoff')}></button>
                    </div>
                    <div className={'microfreakSubEnvAssign1Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envAssign1')}></button>
                    </div>
                    <div className={'microfreakSubEnvAssign2Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envAssign2')}></button>
                    </div>
                    <div className={'microfreakSubEnvAssign3Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('envAssign3')}></button>
                    </div>
                    <p className={'microfreakSubSourceLfo' + microfreakMonth}>LFO</p>
                    <div className={'microfreakSubLfoPitchBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoPitch')}></button>
                    </div>
                    <div className={'microfreakSubLfoWaveBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoWave')}></button>
                    </div>
                    <div className={'microfreakSubLfoTimbreBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoTimbre')}></button>
                    </div>
                    <div className={'microfreakSubLfoCutoffBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoCutoff')}></button>
                    </div>
                    <div className={'microfreakSubLfoAssign1Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoAssign1')}></button>
                    </div>
                    <div className={'microfreakSubLfoAssign2Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoAssign2')}></button>
                    </div>
                    <div className={'microfreakSubLfoAssign3Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('lfoAssign3')}></button>
                    </div>
                    <p className={'microfreakSubSourcePressure' + microfreakMonth}>Pressure</p>
                    <div className={'microfreakSubPressurePitchBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressurePitch')}></button>
                    </div>
                    <div className={'microfreakSubPressureWaveBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureWave')}></button>
                    </div>
                    <div className={'microfreakSubPressureTimbreBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureTimbre')}></button>
                    </div>
                    <div className={'microfreakSubPressureCutoffBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureCutoff')}></button>
                    </div>
                    <div className={'microfreakSubPressureAssign1Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureAssign1')}></button>
                    </div>
                    <div className={'microfreakSubPressureAssign2Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureAssign2')}></button>
                    </div>
                    <div className={'microfreakSubPressureAssign3Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('pressureAssign3')}></button>
                    </div>
                    <p className={'microfreakSubSourceKeyArp' + microfreakMonth}>Key/Arp</p>
                    <div className={'microfreakSubKeyArpPitchBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpPitch')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpWaveBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpWave')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpTimbreBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpTimbre')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpCutoffBox' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpCutoff')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpAssign1Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpAssign1')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpAssign2Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpAssign2')}></button>
                    </div>
                    <div className={'microfreakSubKeyArpAssign3Box' + microfreakMonth}>
                        <button className={'microfreakSubModulateSelectButton' + microfreakMonth}
                            onClick={() => selectSubModulator('keyArpAssign3')}></button>
                    </div>
                </div>
            </div>
            <div className={'microfreakPanic' + panicState + microfreakMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
    );
}


export default Microfreak;
