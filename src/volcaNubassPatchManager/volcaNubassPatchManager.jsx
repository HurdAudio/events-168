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
import midi5pin from '../img/midi5pin.svg';
import VolcaNubass from '../volcaNubass/volcaNubass';
import './volcaNubassPatchManager.style.jana.css';
import VolcaNubassPatchTransmitter from './volcaNubassPatchTransmitter';
import axios from 'axios';
import uuid4 from 'uuid4';

function VolcaNubassPatchManager(user, banks) {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaNubassPatchManager/january/spinner/27947ac14af627677a43510cf7ccfe70.gif';
    const janbSpinner = '';
    const jancSpinner = '';
    const febaSpinner = '';

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [panicState, setPanicState] = useState('volcaNubassPatchManagerPanicOff');
    const [patchDeleteGuardrailState, setPatchDeleteGuardrailState] = useState('_Inactive');
    const [saveAsModalState, setSaveAsModalState] = useState('_Inactive');
    const [volcaNubassPatchManagerContainerState, setVolcaNubassPatchManagerContainerState] = useState('_Active');
    const [shareModalState, setShareModalState] = useState('_Inactive');
    const [deleteCollectionModalState, setDeleteCollectionModalState] = useState('_Inactive');
    const [aboutModalState, setAboutModalState] = useState('_Inactive');
    const [collectionLoadModalState, setCollectionLoadModalState] = useState('_Inactive');
    const [volcaNubassPatchManagerMonth, setVolcaNubassPatchManagerMonth] = useState('_JanuaryA');
    const [currentPatchUuid, setCurrentPatchUuid] = useState(null);
    const [dragData, setDragData] = useState(null);
    const [loadPatchUuid, setLoadPatchUuid] = useState(null);
    const [userPatches, setUserPatches] = useState([]);
    const [currentSpinner, setCurrentSpinner] = useState(janaSpinner);
    const [selectedPatchPatch, setSelectedPatchPatch] = useState('');
    const [selectedBankPatch, setSelectedBankPatch] = useState('');
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState(0);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchCollection, setPatchCollection] = useState({
        banks: [
            {
                uuid: '76977154-b571-4937-86ab-12a3d062495e',
                name: 'neutral basses',
                notes: '',
                patches: []
            },
            {
                uuid: 'ce0c3188-a670-4a3e-9b1a-50f9206e7603',
                name: 'subharmonic basses',
                notes: '',
                patches: []
            },
            {
                uuid: '6a1a66bd-2d20-484a-ae74-9a40c9aafa5e',
                name: 'lfo intensive',
                notes: '',
                patches: []
            }
        ],
        name: 'collection 1'
    });
    const [currentEditBank, setCurrentEditBank] = useState(patchCollection.banks[0].uuid);
    const [collectionAltered, setCollectionAltered] = useState(false);
    
    const openLoadCollectionModal = () => {
        setCollectionLoadModalState('_Active');
        setVolcaNubassPatchManagerContainerState('_Inactive');
    }
    
    const closeCollectionLoadModal = () => {
        setCollectionLoadModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const loadCollection = () => {
        setCollectionLoadModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const openAboutModal = () => {
        setAboutModalState('_Active');
        setVolcaNubassPatchManagerContainerState('_Inactive');
    }
    
    const closeAboutModal = () => {
        setAboutModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const openDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Active');
        setVolcaNubassPatchManagerContainerState('_Inactive');
    }
    
    const closeDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const initializeNewCollection = () => {
        const uuid = uuid4();
        setPatchCollection({
        banks: [
            {
                uuid: uuid,
                name: 'bank',
                notes: '',
                patches: []
            }
        ],
        name: 'init'
    });
        setSelectedPatchPatch('');
        setSelectedBankPatch('');
        setCollectionAltered(true);
        setCurrentEditBank(uuid);
    }
    
    const openShareModal = () => {
        setShareModalState('_Active');
        setVolcaNubassPatchManagerContainerState('_Inactive');
    }
    
    const closeShareModal = () => {
        setShareModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const submitShareModal = () => {
        setShareModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
    }
    
    const closeSaveAsModal = () => {
        setSaveAsModalState('_Inactive');
        setVolcaNubassPatchManagerContainerState('_Active');
        document.getElementById('volcaNubassPatchManagerSaveAsInput').value = '';
    }
    
    const openSaveAsModal = () => {
        setSaveAsModalState('_Active');
        setVolcaNubassPatchManagerContainerState('_Inactive');
        setTimeout(() => {
            document.getElementById('volcaNubassPatchManagerSaveAsInput').focus();
        }, 150);
        
    }
    
    const deleteActivePatch = () => {
        let deepCopy = {...patchCollection};
        let deepUserCopy = [...userPatches];
        let index = null;
        
        axios.delete(`/volca_nubass_patches/${selectedPatchPatch}`)
        .then(removedPatchData => {
            for (let i = 0; i < deepCopy.banks.length; i++) {
                index = null;
                for (let j = 0; j < deepCopy.banks[i].patches.length; j++) {
                    if (deepCopy.banks[i].patches[j].uuid === selectedPatchPatch) {
                        index = j;
                    }
                }
                if (index !== null) {
                    deepCopy.banks[i].patches.splice(index, 1);
                }
            }
            index = null;
            for (let k = 0; k < deepUserCopy.length; k++) {
                if (deepUserCopy[k].uuid === selectedPatchPatch) {
                    index = k;
                }
            }
            if (index !== null) {
                deepUserCopy.splice(index, 1);
            }
            setSelectedPatchPatch('');
            setPatchCollection(deepCopy);
            setUserPatches(deepUserCopy);
            setVolcaNubassPatchManagerContainerState('_Active');
            setPatchDeleteGuardrailState('_Inactive');
        });
    }
    
    const cancelPatchDeleteGuardrail = () => {
        setVolcaNubassPatchManagerContainerState('_Active');
        setPatchDeleteGuardrailState('_Inactive');
    }
    
    const deletePatchGuardrail = () => {
        setVolcaNubassPatchManagerContainerState('_Inactive');
        setPatchDeleteGuardrailState('_Active');
    }
    
    const revertCollection = () => {
        setCollectionAltered(false);
        return null;
    }
    
    const saveCollection = () => {
        setCollectionAltered(false);
        return null;
    }
    
    const updateUserNotes = (bankUuid, val) => {
        let deepCopy = {...patchCollection};
        let index = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === bankUuid) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Bank not found');
            return;
        }
        deepCopy.banks[index].notes = val;
        
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const moveBankPatchUp = (patch) => {
        let deepCopy = {...patchCollection};
        let index = null;
        let index2 = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Current bank is invalid');
            return;
        }
        for (let j = 0; j < deepCopy.banks[index].patches.length; j++) {
            if (deepCopy.banks[index].patches[j].uuid === patch.uuid) {
                index2 = j;
            }
        }
        if (index2 === null) {
            alert('ERRLR: Invalid patch');
            return;
        }
        if (index2 !== 0) {
            [deepCopy.banks[index].patches[index2 - 1], deepCopy.banks[index].patches[index2]] = [deepCopy.banks[index].patches[index2], deepCopy.banks[index].patches[index2 - 1]];
        }
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const moveBankPatchDown = (patch) => {
        let deepCopy = {...patchCollection};
        let index = null;
        let index2 = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Current bank is invalid');
            return;
        }
        for (let j = 0; j < deepCopy.banks[index].patches.length; j++) {
            if (deepCopy.banks[index].patches[j].uuid === patch.uuid) {
                index2 = j;
            }
        }
        if (index2 === null) {
            alert('ERRLR: Invalid patch');
            return;
        }
        if (index2 !== (deepCopy.banks[index].patches.length - 1)) {
            [deepCopy.banks[index].patches[index2], deepCopy.banks[index].patches[index2 + 1]] = [deepCopy.banks[index].patches[index2 + 1], deepCopy.banks[index].patches[index2]];
        }
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const removeBankPatch = (patch) => {
        let deepCopy = {...patchCollection};
        let index = null;
        let index2 = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Current bank is invalid');
            return;
        }
        for (let j = 0; j < deepCopy.banks[index].patches.length; j++) {
            if (deepCopy.banks[index].patches[j].uuid === patch.uuid) {
                index2 = j;
            }
        }
        if (index2 === null) {
            alert('ERROR: Invalid patch');
            return;
        }
        deepCopy.banks[index].patches.splice(index2, 1);
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const dragDataSet = (data) => {
        setDragData(data);
    }
    
    const patchAlreadyInBank = (index) => {
        let result = false;
        
        for (let i = 0; i < patchCollection.banks[index].patches.length; i++) {
            if (patchCollection.banks[index].patches[i].uuid === dragData.uuid) {
                result = true;
            }
        }
        return result;
    }
    
    const patchAlreadyInTheBank = (index, patch) => {
        let result = false;
        
        for (let i = 0; i < patchCollection.banks[index].patches.length; i++) {
            if (patchCollection.banks[index].patches[i].uuid === patch) {
                result = true;
            }
        }
        return result;
    }
    
    const addActivePatchToBank = () => {
        let deepCopy = {...patchCollection};
        let index = null;
        let index2 = null;
        
        for (let i = 0; i < userPatches.length; i++) {
            if (userPatches[i].uuid === selectedPatchPatch) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Patch not located');
            return;
        }   
        for (let j = 0; j < deepCopy.banks.length; j++) {
            if (deepCopy.banks[j].uuid === currentEditBank) {
                index2 = j;
            }
        }
        if (index2 === null) {
            alert('ERROR: Active bank invalid');
            return;
        }
        if (deepCopy.banks[index2].patches.length === 0) {
            deepCopy.banks[index2].patches.push(userPatches[index]);
        } else {
            if (!patchAlreadyInTheBank(index2, userPatches[index].uuid)) {
               deepCopy.banks[index2].patches.push(userPatches[index]); 
            }
        }
        
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const addPatchToBank = (bank) => {
        let deepCopy = {...patchCollection};
        let index = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === bank.uuid) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Patch set not found');
            return;
        }
        if (deepCopy.banks[index].patches.length === 0) {
            deepCopy.banks[index].patches.push(dragData);
        } else {
            if (!patchAlreadyInBank(index)) {
                deepCopy.banks[index].patches.push(dragData);
            }
        }
         
        setDragData(null);
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const updateSelectedBankPatch = (val) => {
        let patch;
        
        setSelectedPatchPatch('');
        setSelectedBankPatch(val);
        for (let i = 0; i < userPatches.length; i++) {
            if (userPatches[i].uuid === val) {
                patch = userPatches[i];
            }
        }
        VolcaNubassPatchTransmitter(patch, currentOutput, currentMidiChannel);
    }
    
    const makePatchPatchCurrent = (val) => {
        let patch;
        
        setSelectedPatchPatch(val);
        setSelectedBankPatch('');
        for (let i = 0; i < userPatches.length; i++) {
            if (userPatches[i].uuid === val) {
                patch = userPatches[i];
            }
        }
        VolcaNubassPatchTransmitter(patch, currentOutput, currentMidiChannel);
    }
    
    const changeBankEdit = (val) => {
        setCurrentEditBank(val);
    }
    
    const addNewBank = () => {
        let deepCopy = {...patchCollection};
        const id = uuid4();
        const iteration = deepCopy.banks.length;
        
        deepCopy.banks.push({
            uuid: id,
            name: 'new' + iteration.toString(),
            patches: []
        });
        
        setPatchCollection(deepCopy);
        setCurrentEditBank(id);
        setCollectionAltered(true);
    }
    
    const updateBankName = (val) => {
        let deepCopy = {...patchCollection};
        let index = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Current Bank Set not found');
            return;
        }
        deepCopy.banks[index].name = val;
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const deleteCurrentBank = () => {
        let deepCopy = {...patchCollection};
        let index = null;
        
        for (let i = 0; i < deepCopy.banks.length; i++) {
            if (deepCopy.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            alert('ERROR: Current Bank Set not found');
            return;
        }
        deepCopy.banks.splice(index, 1);
        setCurrentEditBank(deepCopy.banks[0].uuid);
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const patchCollectionNameUpdate = (val) => {
        let deepCopy = {...patchCollection};
        
        deepCopy.name = val;
        
        setPatchCollection(deepCopy);
        setCollectionAltered(true);
    }
    
    const updateUserPatches = () => {
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
        });
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
        setPanicState('volcaNubassPatchManagerPanicOn');
        setVolcaNubassPatchManagerContainerState('_Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('volcaNubassPatchManagerPanicOff');
            setVolcaNubassPatchManagerContainerState('_Active');
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
    
    const getCurrentBankName = () => {
        let index = null;
        for (let i = 0; i < patchCollection.banks.length; i++) {
            if (patchCollection.banks[i].uuid === currentEditBank) {
                index = i;
            }
        }
        if (index === null) {
            return '';
        }
        
        return patchCollection.banks[index].name;
    }
    
    const currentPatchName = () => {
        let uuid = '';
        let name = '';
        
        if (selectedPatchPatch !== '') {
            uuid = selectedPatchPatch;
        } else if (selectedBankPatch !== '') {
            uuid = selectedBankPatch;
        }
        if (uuid !== '') {
            for (let i = 0; i < userPatches.length; i++) {
                if (userPatches[i].uuid === uuid) {
                    name = userPatches[i].global_params.name;
                }
            }
        }
        
        return name;
        
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
    
    const getVisualOutput = (val) => {
        console.log(val);
    }
    
    const updateCurrentMidiChannel = (val) => {
        setCurrentMidiChannel(val);
    }
    
    const getActivePatch = () => {
        if (selectedPatchPatch !== '') {
            return selectedPatchPatch;
        }
        if (selectedBankPatch !== '') {
            return selectedBankPatch;
        }
        return null;
    }
    
    
    
    return ( 
        <div>
            <Router>
                <Switch>
                    <Route path="/volca-nubass-editor">
                        {VolcaNubass(user, getActivePatch())}
                    </Route>

                </Switch>
            </Router>
            <div>
                <div className={'volcaNubassPatchManagerContainer' + volcaNubassPatchManagerContainerState + volcaNubassPatchManagerMonth}
                    tabIndex="1"
                    onKeyDown={(e) => noteOnEvent(e.key)}
                    onKeyUp={(e) => noteOffEvent(e.key)}>
                    <div className={'volcaNubassPatchManagerImageDiv' + volcaNubassPatchManagerMonth}>
                        <div className={'volcaNubassPatchManagerTopBar' + volcaNubassPatchManagerMonth}>
                            <NavLink to="/"><img className={'volcaNubassNavImage' + volcaNubassPatchManagerMonth}
                                src={midiImage}></img></NavLink>
                        </div>
                        <h3 className={'volcaNubassPatchManagerTitle' + volcaNubassPatchManagerMonth}>Volca Nubass Patch Manager</h3>
                        <button className={'volcaNubassPatchManagerLoadButton' + volcaNubassPatchManagerMonth}
                            onClick={() => openLoadCollectionModal()}>load</button>
                        <input className={'volcaNubassPatchManagerNameInput' + volcaNubassPatchManagerMonth}
                            onChange={(e) => patchCollectionNameUpdate(e.target.value)}
                            type="text"
                            value={patchCollection.name}/>
                        <button className={'volcaNubassPatchManagerPanicButton' + volcaNubassPatchManagerMonth}
                            onClick={() => panic()}>panic!</button>
                        <div className={'volcaNubassPatchManagerSidebarManager' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerSidebarContainer' + volcaNubassPatchManagerMonth}>
                                <button className={'volcaNubassPatchManagerSaveButton' + collectionAltered + volcaNubassPatchManagerMonth}
                                    onClick={() => saveCollection()}>save</button>
                                <button className={'volcaNubassPatchManagerSaveAsButton' + volcaNubassPatchManagerMonth}
                                    onClick={() => openSaveAsModal()}>save as...</button>
                                <button className={'volcaNubassPatchManagerRevertButton' + collectionAltered + volcaNubassPatchManagerMonth}
                                    onClick={() => revertCollection()}>revert</button>
                                <p className={'volcaNubassPatchManagerMidiOutputLabel' + volcaNubassPatchManagerMonth}>midi output:</p>
                                <select className={'volcaNubassPatchManagerMidiOutputSelect' + volcaNubassPatchManagerMonth}
                                    onChange={(e) => updateCurrentOutput(e.target.value)}
                                    value={getVisualOutput(currentOutput)}>
                                    {availableOutputs.map(out => (
                                    <option key={out.id} value={out.id}>{out.name}</option>))}
                                </select>
                                <p className={'volcaNubassPatchManagerMidiChannelLabel' + volcaNubassPatchManagerMonth}>channel:</p>
                                <input className={'volcaNubassPatchManagerMidiChannelInput' + volcaNubassPatchManagerMonth}
                                    max="15"
                                    min="0"
                                    onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                    step="1"
                                    type="number"
                                    value={currentMidiChannel}/>
                                <button className={'volcaNubassPatchManagerShareButton' + volcaNubassPatchManagerMonth}
                                    onClick={() => openShareModal()}>share</button>
                                <button className={'volcaNubassPatchManagerInitButton' + volcaNubassPatchManagerMonth}
                                    onClick={() => initializeNewCollection()}>init</button>
                                <button className={'volcaNubassPatchManagerDeleteCollectionButton' + volcaNubassPatchManagerMonth}
                                    onClick={() => openDeleteCollectionModal()}>delete</button>
                                <button className={'volcaNubassPatchManagerAboutNubassManagement' + volcaNubassPatchManagerMonth}
                                    onClick={() => openAboutModal()}>about</button>
                            </div>
                        </div>
                        <div className={'volcaNubassPatchManagerUserPatchesListDiv' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerUserPatchesListContainer' + volcaNubassPatchManagerMonth}>
                                <div className={'volcaNubassPatchManagerUserPatchesList' + volcaNubassPatchManagerMonth}></div>
                                {(userPatches.length > 0) && (<div className={'volcaNubassPatchManagerUserPatchListRealDiv' + volcaNubassPatchManagerMonth}>
                                    {userPatches.map(patch => 
                                        <p className={'volcaNubassPatchManagerPatchNameDisplay' + (selectedPatchPatch === patch.uuid) + volcaNubassPatchManagerMonth}
                                            draggable={true}
                                            onClick={() => makePatchPatchCurrent(patch.uuid)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragStart={() => dragDataSet(patch)}
                                            key={patch.uuid}>{patch.global_params.name}</p>
                                    )}
                                </div>)}
                                <button className={'volcaNubassPatchManagerUpdateButton' + volcaNubassPatchManagerMonth}
                                    onClick={() => updateUserPatches()}>update</button>
                            </div>
                        </div>
                        <div className={'volcaNubassPatchManagerPatchActionsDiv' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerPatchActionsContainer' + volcaNubassPatchManagerMonth}>
                                {((selectedPatchPatch !== '') || (selectedBankPatch !== '')) && (
                                    <Link className={'volcaNubassPatchManagerEditLocator' + volcaNubassPatchManagerMonth}
                                        to="/volca-nubass-editor">
                                        <button className={'volcaNubassPatchManagerEditActivePatchButton' + volcaNubassPatchManagerMonth}>edit</button>
                                    </Link>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaNubassPatchManagerDeleteActivePatchButton' + volcaNubassPatchManagerMonth}
                                        onClick={() => deletePatchGuardrail()}>delete</button>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaNubassPatchManagerMoveActivePatchButton' + volcaNubassPatchManagerMonth}
                                        onClick={() => addActivePatchToBank()}>&#8594;</button>
                                )}
                            </div>
                        </div>
                        <div className={'volcaNubassPatchManagerBanksDiv' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerBanksContainer' + volcaNubassPatchManagerMonth}>
                                <div className={'volcaNubassPatchManagerBanksBar' + volcaNubassPatchManagerMonth}>
                                    <p className={'volcaNubassPatchManagerBanksLabel' + volcaNubassPatchManagerMonth}>banks:</p>
                                    <select className={'volcaNubassPatchManagerBanksSelect' + volcaNubassPatchManagerMonth}
                                        onChange={(e) => changeBankEdit(e.target.value)}
                                        value={currentEditBank}>
                                        {patchCollection.banks.map(item => 
                                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                                        )}
                                    </select>
                                    <button className={'volcaNubassPatchManagerAddBankButton' + volcaNubassPatchManagerMonth}
                                        onClick={() => addNewBank()}>add</button>
                                    {(patchCollection.banks.length > 1) && (
                                        <button className={'volcaNubassPatchManagerAddBankButton' + volcaNubassPatchManagerMonth}
                                            onClick={() => deleteCurrentBank()}>delete</button>
                                    )}
                                </div>
                                <div className={'volcaNubassPatchManagerBankDisplayContainer' + volcaNubassPatchManagerMonth}>
                                    {patchCollection.banks.map(item => 
                                        <div className={'volcaNubassPatchManagerBankDisplayer' + (item.uuid === currentEditBank) + volcaNubassPatchManagerMonth}
                                            onClick={() => {if (item.uuid !== currentEditBank) changeBankEdit(item.uuid)}}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => { if (item.uuid === currentEditBank) addPatchToBank(item)}}
                                            key={item.uuid}>
                                            {(item.uuid === currentEditBank) && (<div className={'volcaNubassPatchManagerBankDisplayReal' + volcaNubassPatchManagerMonth}>
                                                {(item.patches.length > 0) && (
                                                    <div>
                                                        {item.patches.map(patch => 
                                                            <div className={'volcaNubassPatchManagerBankItemDiv' + volcaNubassPatchManagerMonth}
                                                                key={patch.uuid}>
                                                                <p className={'volcaNubassPatchManagerBankPatchName' + (patch.uuid === selectedBankPatch) + volcaNubassPatchManagerMonth}
                                                                    onClick={() => updateSelectedBankPatch(patch.uuid)}>{patch.global_params.name}</p>
                                                                <p className={'volcaNubassPatchManakerDeleteChar' + volcaNubassPatchManagerMonth}
                                                                    onClick={() => moveBankPatchUp(patch)}>&#8593;</p>
                                                                <p className={'volcaNubassPatchManakerDeleteChar' + volcaNubassPatchManagerMonth}
                                                                    onClick={() => moveBankPatchDown(patch)}>&#8595;</p>
                                                                <p className={'volcaNubassPatchManakerDeleteChar' + volcaNubassPatchManagerMonth}
                                                                    onClick={() => removeBankPatch(patch)}>&#127303;</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                                 <input className={'volcaNubassPatchManagerBankNameInput' + volcaNubassPatchManagerMonth}
                                    onChange={(e) => updateBankName(e.target.value)}
                                    type="text"
                                    value={getCurrentBankName()}/>
                            </div>
                        </div>
                        <div className={'volcaNubassPatchManagerDeviceDiv' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerDeviceContainer' + volcaNubassPatchManagerMonth}>
                                <p className={'volcaNubassPatchManagerCurrentPatchDisplay' + volcaNubassPatchManagerMonth}>
                                    {currentPatchName()}
                                </p>
                                <img className={'volcaNubassPatchManagerDeviceImage' + volcaNubassPatchManagerMonth} 
                                    src={'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/07887ab0a1001f02a115e9c90af92da6_sp.png'}/>
                            </div>
                        </div>
                        <div className={'volcaNubassPatchManagerUserNotesDiv' + volcaNubassPatchManagerMonth}>
                            <div className={'volcaNubassPatchManagerUserNotesContainer' + volcaNubassPatchManagerMonth}>
                                <p className={'volcaNubassPatchManagerUserNotesLabel' + volcaNubassPatchManagerMonth}>user notes</p>
                                {patchCollection.banks.map(bank => 
                                    <textarea className={'volcaNubassPatchManagerUserNotesArea' + (bank.uuid === currentEditBank) + volcaNubassPatchManagerMonth}
                                        key={bank.uuid}
                                        onChange={(e) => updateUserNotes(bank.uuid, e.target.value)}
                                        rows={12}
                                        value={bank.notes}></textarea>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'volcaNubassPatchManagerDeletePatchGuardrail' + patchDeleteGuardrailState + volcaNubassPatchManagerMonth}>
                <p className={'volcaNubassPatchManagerDeletePatchGuardrailLabel' + volcaNubassPatchManagerMonth}>Delete patch?</p>
                <p className={'volcaNubassPatchManagerDeletePatchGuardrailFinePrint' + volcaNubassPatchManagerMonth}>This will permanently delete patch and remove it from all banks in all collections.</p>
                <div className={'volcaNubassPatchManagerDeleteGuardrailButtonsDiv' + volcaNubassPatchManagerMonth}>
                    <button onClick={() => deleteActivePatch()}>delete</button>
                    <button onClick={() => cancelPatchDeleteGuardrail()}>cancel</button>
                </div>
            </div>
            <div className={'volcaNubassPatchManagerSaveAsModal' + saveAsModalState + volcaNubassPatchManagerMonth}>
                <p className={'volcaNubassPatchManagerSaveAsLabel' + volcaNubassPatchManagerMonth}>Save collection as:</p>
                <input className={'volcaNubassPatchManagerSaveAsInput' + volcaNubassPatchManagerMonth}
                    id="volcaNubassPatchManagerSaveAsInput"
                    placeholder={'copy of ' + patchCollection.name}
                    type="text" />
                <div className={'volcaNubassPatchManagerDeleteGuardrailButtonsDiv' + volcaNubassPatchManagerMonth}>
                    <button>save</button>
                    <button onClick={() => closeSaveAsModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaNubassPatchManagerShareModal' + shareModalState + volcaNubassPatchManagerMonth}>
                <p className={'volcaNubassPatchManagerShareLabel' + volcaNubassPatchManagerMonth}>Submit collection "{patchCollection.name}" to Volca Nubass Patch Marketplace:</p>
                <div className={'volcaNubassPatchManagerShareForm' + volcaNubassPatchManagerMonth}>
                    <p className={'volcaNubassPatchManagerCollectionNameLabel' + volcaNubassPatchManagerMonth}>collection name:</p>
                    <p className={'volcaNubassPatchManagerCollectionName' + volcaNubassPatchManagerMonth}>{patchCollection.name}</p>
                    <p className={'volcaNubassPatchManagerSubmittedByLabel' + volcaNubassPatchManagerMonth}>submitted by:</p>
                    <p className={'volcaNubassPatchManagerSubmittedBy' + volcaNubassPatchManagerMonth}>{user.first_name} {user.last_name}</p>
                    <p className={'volcaNubassPatchManagerPublicDescriptionLabel' + volcaNubassPatchManagerMonth}>public description:</p>
                    <textarea className={'volcaNubassPatchManagerPublicDescription' + volcaNubassPatchManagerMonth}
                        placeholder="Description of this collection"
                        rows="9"></textarea>
                    <button className={'volcaNubassPatchManagerShareSubmitButton' + volcaNubassPatchManagerMonth}
                        onClick={() => submitShareModal()}>submit</button>
                    <button className={'volcaNubassPatchManagerShareCancelButton' + volcaNubassPatchManagerMonth}
                        onClick={() => closeShareModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaNubassPatchManagerDeleteCollectionModal' + deleteCollectionModalState + volcaNubassPatchManagerMonth}>
                <p className={'volcaNubassPatchManagerDeletePatchGuardrailLabel' + volcaNubassPatchManagerMonth}>Delete collection "{patchCollection.name}"?</p>
                <p className={'volcaNubassPatchManagerDeletePatchGuardrailFinePrint' + volcaNubassPatchManagerMonth}>This will permanently remove collection.</p>
                <div className={'volcaNubassPatchManagerDeleteGuardrailButtonsDiv' + volcaNubassPatchManagerMonth}>
                    <button>delete</button>
                    <button onClick={() => closeDeleteCollectionModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaNubassPatchManagerAboutModal' + aboutModalState + volcaNubassPatchManagerMonth}>
                <div className={'volcaNubassPatchManagerAboutContentDiv' + volcaNubassPatchManagerMonth}>
                    <h2>The Korg Volca Nubass Patch Manager</h2>
                    <p>This patch manager is a utility for organizing collections of custom patches into banks for exporting into the 168 Events sequencing environment or for sharing with other users of 168 Events.</p>
                    <p>Some useful definitions for understanding the Volca Nubass Patch Manager heirarchy:</p>
                    <h3>Patches</h3>
                    <p>A patch is an individual "preset" that one creates in the Volca Nubass Editor. Think of it as a single instrument.</p>
                    <h3>Banks</h3>
                    <p>A bank is an organized set of patches. Think of it as an ensemble of instruments. Each bank comes with a scratch pad for storing notes to help you track your bank structure.</p>
                    <h3>Collections</h3>
                    <p>A collection is an organized set of banks. Think of it as an orchestra made up of discreet sections of instrument types. Collections are available for import into sequences and are the standard format for sharing one's patches with other users.</p>
                </div>
                <button className={'volcaNubassPatchManagerAboutCloseButton' + volcaNubassPatchManagerMonth}
                    onClick={() => closeAboutModal()}>close</button>
            </div>
            <div className={'volcaNubassPatchManagerCollectionLoadModal' + collectionLoadModalState + volcaNubassPatchManagerMonth}>
                <div className={'volcaNubassPatchManagerCollectionLoadContainer' + volcaNubassPatchManagerMonth}>
                    <p className={'volcaNubassPatchManagerLoadTitle' + volcaNubassPatchManagerMonth}>Load Volca Nubass Collection</p>
                    <select className={'volcaNubassPatchManagerLoadSelector' + volcaNubassPatchManagerMonth}>
                        <option>placeholder</option>
                    </select>
                    <button className={'volcaNubassPatchManagerLoadLoadButton' + volcaNubassPatchManagerMonth}
                        onClick={() => loadCollection()}>load</button>
                    <button className={'volcaNubassPatchManagerLoadCancelButton' + volcaNubassPatchManagerMonth}
                        onClick={() => closeCollectionLoadModal()}>cancel</button>
                </div>
            </div>
            <div className={panicState + volcaNubassPatchManagerMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
        );
}


export default VolcaNubassPatchManager;