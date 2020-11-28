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

import VolcaDrum from '../volcaDrum/volcaDrum';
import midi5pin from '../img/midi5pin.svg';
import './volcaDrumPatchManager.style.jana.css';
import './volcaDrumPatchManager.style.janb.css';
import midiConnection from '../midiManager/midiConnection';
import VolcaDrumPatchTransmitter from './volcaDrumPatchTransmitter';
import axios from 'axios';
import uuid4 from 'uuid4';

let connections = null;

function VolcaDrumPatchManager(user, banks) {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaDrumPatchEditor/january/spinner/56172d7059b5a527bce0adca75ff6f18.gif';
    const janbSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/volcaDrumPatchEditor/january/spinner/atomicIce.gif';

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [userMidiPatch, setUserMidiPatch] = useState(null);
    const [panicState, setPanicState] = useState('volcaDrumPatchManagerPanicOff');
    const [patchDeleteGuardrailState, setPatchDeleteGuardrailState] = useState('_Inactive');
    const [saveAsModalState, setSaveAsModalState] = useState('_Inactive');
    const [volcaDrumPatchManagerContainerState, setVolcaDrumPatchManagerContainerState] = useState('_Active');
    const [shareModalState, setShareModalState] = useState('_Inactive');
    const [deleteCollectionModalState, setDeleteCollectionModalState] = useState('_Inactive');
    const [aboutModalState, setAboutModalState] = useState('_Inactive');
    const [collectionLoadModalState, setCollectionLoadModalState] = useState('_Inactive');
    const [volcaDrumPatchManagerMonth, setVolcaDrumPatchManagerMonth] = useState('_JanuaryB');
    const [availableCollections, setAvailableCollections] = useState([]);
    const [currentCollection, setCurrentCollection] = useState('');
    const [selectedCollectionValue, setSelectedCollectionValue] = useState('');
    const [currentPatchUuid, setCurrentPatchUuid] = useState(null);
    const [dragData, setDragData] = useState(null);
    const [loadPatchUuid, setLoadPatchUuid] = useState(null);
    const [userPatches, setUserPatches] = useState([]);
    const [currentSpinner, setCurrentSpinner] = useState(janbSpinner);
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
                uuid: 'e5f17697-d71e-421c-93e0-9f809593c05b',
                name: 'tuned',
                notes: '',
                patches: []
            },
            {
                uuid: '5c7bccdf-a84a-454f-861f-dc791002354b',
                name: 'enharmonic kit',
                notes: '',
                patches: []
            },
            {
                uuid: 'fb7992a0-a318-42ce-aba3-0e8ac2919fc6',
                name: 'plastic kit',
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
        setVolcaDrumPatchManagerContainerState('_Inactive');
//        axios.get(`/volca_fm_banks/byuser/${user.uuid}`)
//        .then(collectionsData => {
//            const collections = collectionsData.data.sort((a, b) => {
//                if (a.name.toLowerCase() > b.name.toLowerCase()) {
//                    return 1;
//                } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
//                    return -1;
//                } else {
//                    return 0;
//                }
//            });
//            setAvailableCollections(collections);
//            setSelectedCollectionValue(collections[0].uuid);
//        });
    }
    
    const closeCollectionLoadModal = () => {
        setCollectionLoadModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
    }
    
    const loadCollection = () => {
        let deepCopy = {...patchCollection};
        if (selectedCollectionValue === '') {
            setCollectionLoadModalState('_Inactive');
            setVolcaDrumPatchManagerContainerState('_Active');
            return;
        }
        const selected = selectedCollectionValue;
        console.log(selected);
//        axios.get(`/volca_fm_banks/collection/${selected}`)
//        .then(loadedCollectionData => {
//            const loadedCollection = loadedCollectionData.data;
//            setCurrentCollection(selected);
//            deepCopy.banks = loadedCollection.banks.banks;
//            deepCopy.name = loadedCollection.name;
//            deepCopy.uuid = loadedCollection.uuid;
//            setPatchCollection(deepCopy);
//            setCollectionLoadModalState('_Inactive');
//            setvolcaDrumPatchManagerContainerState('_Active');
//        });
    }
    
    const openAboutModal = () => {
        setAboutModalState('_Active');
        setVolcaDrumPatchManagerContainerState('_Inactive');
    }
    
    const closeAboutModal = () => {
        setAboutModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
    }
    
    const openDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Active');
        setVolcaDrumPatchManagerContainerState('_Inactive');
    }
    
    const closeDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
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
        setVolcaDrumPatchManagerContainerState('_Inactive');
    }
    
    const closeShareModal = () => {
        setShareModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
    }
    
    const submitShareModal = () => {
        const volcaDrumPatchManagerPublicDescription = document.getElementById('volcaDrumPatchManagerPublicDescription').value;
        setShareModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
//        axios.get(`/volca_fm_shares/byuser/${user.uuid}`)
//        .then(userSharesData => {
//            const userShares = userSharesData.data;
//            const existingShare = userShares.filter(share => {
//                return(share.initial_collection_uuid === currentCollection);
//            });
//            if (existingShare.length === 0) {
//                axios.post(`/volca_fm_shares/shares`, {
//                    initial_collection_uuid: currentCollection,
//                    user_uuid: user.uuid,
//                    banks: {
//                        banks: patchCollection.banks
//                    },
//                    name: patchCollection.name,
//                    public_description: volcaDrumPatchManagerPublicDescription
//                }).then(() => {
//                    setShareModalState('_Inactive');
//                    setvolcaDrumPatchManagerContainerState('_Active');
//                })
//            } else {
//                axios.patch(`/volca_fm_shares/shares/${existingShare[0].uuid}`, {
//                    banks: {
//                        banks: patchCollection.banks
//                    },
//                    name: patchCollection.name,
//                    public_description: volcaDrumPatchManagerPublicDescription
//                }).then(() => {
//                    setShareModalState('_Inactive');
//                    setvolcaDrumPatchManagerContainerState('_Active');
//                });
//            }
//        });
    }
    
    const closeSaveAsModal = () => {
        setSaveAsModalState('_Inactive');
        setVolcaDrumPatchManagerContainerState('_Active');
        document.getElementById('volcaDrumPatchManagerSaveAsInput').value = '';
    }
    
    const openSaveAsModal = () => {
        setSaveAsModalState('_Active');
        setVolcaDrumPatchManagerContainerState('_Inactive');
//        setTimeout(() => {
//            document.getElementById('volcaDrumPatchManagerSaveAsInput').focus();
//        }, 150);
        
    }
    
    const deleteActivePatch = () => {
        let deepCopy = {...patchCollection};
        let deepUserCopy = [...userPatches];
        let index = null;
        setVolcaDrumPatchManagerContainerState('_Active');
        setPatchDeleteGuardrailState('_Inactive');
        
//        axios.delete(`/volca_fm_patches/${selectedPatchPatch}`)
//        .then(removedPatchData => {
//            for (let i = 0; i < deepCopy.banks.length; i++) {
//                index = null;
//                for (let j = 0; j < deepCopy.banks[i].patches.length; j++) {
//                    if (deepCopy.banks[i].patches[j].uuid === selectedPatchPatch) {
//                        index = j;
//                    }
//                }
//                if (index !== null) {
//                    deepCopy.banks[i].patches.splice(index, 1);
//                }
//            }
//            index = null;
//            for (let k = 0; k < deepUserCopy.length; k++) {
//                if (deepUserCopy[k].uuid === selectedPatchPatch) {
//                    index = k;
//                }
//            }
//            if (index !== null) {
//                deepUserCopy.splice(index, 1);
//            }
//            setSelectedPatchPatch('');
//            setPatchCollection(deepCopy);
//            setUserPatches(deepUserCopy);
//            setvolcaDrumPatchManagerContainerState('_Active');
//            setPatchDeleteGuardrailState('_Inactive');
//        });
    }
    
    const cancelPatchDeleteGuardrail = () => {
        setVolcaDrumPatchManagerContainerState('_Active');
        setPatchDeleteGuardrailState('_Inactive');
    }
    
    const deletePatchGuardrail = () => {
        setVolcaDrumPatchManagerContainerState('_Inactive');
        setPatchDeleteGuardrailState('_Active');
    }
    
    const revertCollection = () => {
        const selectedUuid = currentCollection;
//        axios.get(`/volca_fm_banks/collection/${selectedUuid}`)
//        .then(revertBankData => {
//            const revertBank = revertBankData.data;
//            setPatchCollection({
//                banks: revertBank.banks.banks,
//                name: revertBank.name
//            });
//            setCollectionAltered(false);
//        });
        setCollectionAltered(false);
    }
    
    const saveCollection = () => {
        setCollectionAltered(false);
        if (currentCollection === '') {
//            axios.post(`/volca_fm_banks/banks`, {
//                user_uuid: user.uuid,
//                banks: {
//                    banks: patchCollection.banks
//                },
//                name: patchCollection.name
//            }).then(addedData => {
//                setCurrentCollection(addedData.data.uuid);
//                setCollectionAltered(false);
//            });
        } else {
//            const collectionUuid = currentCollection;
//            axios.patch(`/volca_fm_banks/collection/${collectionUuid}`, {
//                banks: {
//                    banks: patchCollection.banks
//                },
//                name: patchCollection.name
//            });
//            setCollectionAltered(false);
        }
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
        VolcaDrumPatchTransmitter(patch, currentOutput);
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
        VolcaDrumPatchTransmitter(patch, currentOutput);
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
        axios.get(`/gr1_patches/byuser/${user.uuid}`)
        .then(patchesData => {
            console.log(patchesData);
            const patches = patchesData.data.sort((a, b) => {
                if (a.globalParams.name.toLowerCase() > b.globalParams.name.toLowerCase()) {
                    return 1;
                } else if (a.globalParams.name.toLowerCase() < b.globalParams.name.toLowerCase()) {
                    return -1;
                } else {
                    return 0;
                }
            });
            setUserPatches(patches);
        });
    }

    const noteOnEvent = (key) => {
//        let index = 0;
//        for (let i = 0; i < outputs.length; i++) {
//            if (outputs[i].id === currentOutput.id) {
//                index = i;
//            }
//        }
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
                if (!user.midi_patch) {
                    setAvailableOutputs(connections.outputs);
                    setAvailableInputs(connections.inputs);
                }
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
                        let volcaDrumsList = midiPatch.filter(entry => {
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
                        setAvailableOutputs(connections.outputs);
                        setAvailableInputs(connections.inputs);
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
    
    const panic = () => {
//        if(availableOutputs[0]) {
            setPanicState('volcaDrumPatchManagerPanicOn');
            setVolcaDrumPatchManagerContainerState('_Inactive');
//            for (let i = 0; i < availableOutputs.length; i++) {
//                for (let channel = 0; channel < 16; channel++) {
//                    for (let note = 0; note < 128; note++) {
//                        availableOutputs[i].send([0x80 | channel, note, 0x7f]);
//                    }
//                }
//            }
//            setTimeout(() => {
//                setPanicState('volcaDrumPatchManagerPanicOff');
//                setvolcaDrumPatchManagerContainerState('_Active');
//            }, availableOutputs.length * 2000);
            setTimeout(() => {
                setPanicState('volcaDrumPatchManagerPanicOff');
                setVolcaDrumPatchManagerContainerState('_Active');
            }, 7000);
//        }
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
                    name = userPatches[i].globalParams.name;
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
    
    const updateSelectedCollectionValue = (val) => {
        setSelectedCollectionValue(val);
    }
    
    const saveCopyOfCollection = () => {
        const volcaDrumPatchManagerSaveAsInput = document.getElementById('volcaDrumPatchManagerSaveAsInput').value;
        if (volcaDrumPatchManagerSaveAsInput === '') {
            return;
        }
        closeCollectionLoadModal();
//        axios.post(`/volca_fm_banks/banks`, {
//            user_uuid: user.uuid,
//            banks: {
//                banks: patchCollection.banks
//            },
//            name: volcaDrumPatchManagerSaveAsInput
//        }).then(copySetData => {
//            console.log(copySetData.data.uuid);
//            setTimeout(() => {
//                setSaveAsModalState('_Inactive');
//            }, 200);
//            
//        });
    }
    
    const deleteCollection = () => {
        const selectedUuid = currentCollection;
        axios.delete(`/volca_fm_banks/${selectedUuid}`)
        .then(() => {
            setCurrentCollection('');
            initializeNewCollection();
            closeDeleteCollectionModal();
            setCollectionAltered(false);
        });
    }
    
    
    
    return ( 
        <div>
            <Router>
                <Switch>
                    <Route path="/volca-drum-editor">
                        {VolcaDrum(user, getActivePatch())}
                    </Route>
                </Switch>
            </Router>
            <div>
                <div className={'volcaDrumPatchManagerContainer' + volcaDrumPatchManagerContainerState + volcaDrumPatchManagerMonth}
                    tabIndex="1"
                    onKeyDown={(e) => noteOnEvent(e.key)}
                    onKeyUp={(e) => noteOffEvent(e.key)}>
                    <div className={'volcaDrumPatchManagerImageDiv' + volcaDrumPatchManagerMonth}>
                        <div className={'volcaDrumPatchManagerTopBar' + volcaDrumPatchManagerMonth}>
                            <NavLink to="/"><img className={'volcaDrumNavImage' + volcaDrumPatchManagerMonth}
                                src={midiImage}></img></NavLink>
                        </div>
                        <h3 className={'volcaDrumPatchManagerTitle' + volcaDrumPatchManagerMonth}>Volca Drum Patch Manager</h3>
                        <button className={'volcaDrumPatchManagerLoadButton' + volcaDrumPatchManagerMonth}
                            onClick={() => openLoadCollectionModal()}>load</button>
                        <input className={'volcaDrumPatchManagerNameInput' + volcaDrumPatchManagerMonth}
                            onChange={(e) => patchCollectionNameUpdate(e.target.value)}
                            type="text"
                            value={patchCollection.name}/>
                        <button className={'volcaDrumPatchManagerPanicButton' + volcaDrumPatchManagerMonth}
                            onClick={() => panic()}>panic!</button>
                        <div className={'volcaDrumPatchManagerSidebarManager' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerSidebarContainer' + volcaDrumPatchManagerMonth}>
                                <button className={'volcaDrumPatchManagerSaveButton' + collectionAltered + volcaDrumPatchManagerMonth}
                                    onClick={() => saveCollection()}>save</button>
                                <button className={'volcaDrumPatchManagerSaveAsButton' + volcaDrumPatchManagerMonth}
                                    onClick={() => openSaveAsModal()}>save as...</button>
                                <button className={'volcaDrumPatchManagerRevertButton' + collectionAltered + volcaDrumPatchManagerMonth}
                                    onClick={() => revertCollection()}>revert</button>
                                <p className={'volcaDrumPatchManagerMidiOutputLabel' + volcaDrumPatchManagerMonth}>midi output:</p>
                                <select className={'volcaDrumPatchManagerMidiOutputSelect' + volcaDrumPatchManagerMonth}
                                    onChange={(e) => updateCurrentOutput(e.target.value)}
                                    value={getVisualOutput(currentOutput)}>
                                    {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.label}</option>))}
                                </select>
                                <p className={'volcaDrumPatchManagerMidiChannelLabel' + volcaDrumPatchManagerMonth}>channel:</p>
                                <input className={'volcaDrumPatchManagerMidiChannelInput' + volcaDrumPatchManagerMonth}
                                    max="15"
                                    min="0"
                                    onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                    step="1"
                                    type="number"
                                    value={currentMidiChannel}/>
                                <button className={'volcaDrumPatchManagerShareButton' + volcaDrumPatchManagerMonth}
                                    onClick={() => openShareModal()}>share</button>
                                <button className={'volcaDrumPatchManagerInitButton' + volcaDrumPatchManagerMonth}
                                    onClick={() => initializeNewCollection()}>init</button>
                                <button className={'volcaDrumPatchManagerDeleteCollectionButton' + volcaDrumPatchManagerMonth}
                                    onClick={() => openDeleteCollectionModal()}>delete</button>
                                <button className={'volcaDrumPatchManagerAboutFmManagement' + volcaDrumPatchManagerMonth}
                                    onClick={() => openAboutModal()}>about</button>
                            </div>
                        </div>
                        <div className={'volcaDrumPatchManagerUserPatchesListDiv' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerUserPatchesListContainer' + volcaDrumPatchManagerMonth}>
                                <div className={'volcaDrumPatchManagerUserPatchesList' + volcaDrumPatchManagerMonth}></div>
                                {(userPatches.length > 0) && (<div className={'volcaDrumPatchManagerUserPatchListRealDiv' + volcaDrumPatchManagerMonth}>
                                    {userPatches.map(patch => 
                                        <p className={'volcaDrumPatchManagerPatchNameDisplay' + (selectedPatchPatch === patch.uuid) + volcaDrumPatchManagerMonth}
                                            draggable={true}
                                            onClick={() => makePatchPatchCurrent(patch.uuid)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragStart={() => dragDataSet(patch)}
                                            key={patch.uuid}>{patch.globalParams.name}</p>
                                    )}
                                </div>)}
                                <button className={'volcaDrumPatchManagerUpdateButton' + volcaDrumPatchManagerMonth}
                                    onClick={() => updateUserPatches()}>update</button>
                            </div>
                        </div>
                        <div className={'volcaDrumPatchManagerPatchActionsDiv' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerPatchActionsContainer' + volcaDrumPatchManagerMonth}>
                                {((selectedPatchPatch !== '') || (selectedBankPatch !== '')) && (
                                    <Link className={'volcaDrumPatchManagerEditLocator' + volcaDrumPatchManagerMonth}
                                        to="/volca-drum-editor">
                                        <button className={'volcaDrumPatchManagerEditActivePatchButton' + volcaDrumPatchManagerMonth}>edit</button>
                                    </Link>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaDrumPatchManagerDeleteActivePatchButton' + volcaDrumPatchManagerMonth}
                                        onClick={() => deletePatchGuardrail()}>delete</button>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaDrumPatchManagerMoveActivePatchButton' + volcaDrumPatchManagerMonth}
                                        onClick={() => addActivePatchToBank()}>&#8594;</button>
                                )}
                            </div>
                        </div>
                        <div className={'volcaDrumPatchManagerBanksDiv' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerBanksContainer' + volcaDrumPatchManagerMonth}>
                                <div className={'volcaDrumPatchManagerBanksBar' + volcaDrumPatchManagerMonth}>
                                    <p className={'volcaDrumPatchManagerBanksLabel' + volcaDrumPatchManagerMonth}>banks:</p>
                                    <select className={'volcaDrumPatchManagerBanksSelect' + volcaDrumPatchManagerMonth}
                                        onChange={(e) => changeBankEdit(e.target.value)}
                                        value={currentEditBank}>
                                        {patchCollection.banks.map(item => 
                                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                                        )}
                                    </select>
                                    <button className={'volcaDrumPatchManagerAddBankButton' + volcaDrumPatchManagerMonth}
                                        onClick={() => addNewBank()}>add</button>
                                    {(patchCollection.banks.length > 1) && (
                                        <button className={'volcaDrumPatchManagerAddBankButton' + volcaDrumPatchManagerMonth}
                                            onClick={() => deleteCurrentBank()}>delete</button>
                                    )}
                                </div>
                                <div className={'volcaDrumPatchManagerBankDisplayContainer' + volcaDrumPatchManagerMonth}>
                                    {patchCollection.banks.map(item => 
                                        <div className={'volcaDrumPatchManagerBankDisplayer' + (item.uuid === currentEditBank) + volcaDrumPatchManagerMonth}
                                            onClick={() => {if (item.uuid !== currentEditBank) changeBankEdit(item.uuid)}}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => { if (item.uuid === currentEditBank) addPatchToBank(item)}}
                                            key={item.uuid}>
                                            {(item.uuid === currentEditBank) && (<div className={'volcaDrumPatchManagerBankDisplayReal' + volcaDrumPatchManagerMonth}>
                                                {(item.patches.length > 0) && (
                                                    <div>
                                                        {item.patches.map(patch => 
                                                            <div className={'volcaDrumPatchManagerBankItemDiv' + volcaDrumPatchManagerMonth}
                                                                key={patch.uuid}>
                                                                <p className={'volcaDrumPatchManagerBankPatchName' + (patch.uuid === selectedBankPatch) + volcaDrumPatchManagerMonth}
                                                                    onClick={() => updateSelectedBankPatch(patch.uuid)}>{patch.globalParams.name}</p>
                                                                <p className={'volcaDrumPatchManakerDeleteChar' + volcaDrumPatchManagerMonth}
                                                                    onClick={() => moveBankPatchUp(patch)}>&#8593;</p>
                                                                <p className={'volcaDrumPatchManakerDeleteChar' + volcaDrumPatchManagerMonth}
                                                                    onClick={() => moveBankPatchDown(patch)}>&#8595;</p>
                                                                <p className={'volcaDrumPatchManakerDeleteChar' + volcaDrumPatchManagerMonth}
                                                                    onClick={() => removeBankPatch(patch)}>&#127303;</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                                <input className={'volcaDrumPatchManagerBankNameInput' + volcaDrumPatchManagerMonth}
                                    onChange={(e) => updateBankName(e.target.value)}
                                    type="text"
                                    value={getCurrentBankName()}/>
                            </div>
                        </div>
                        <div className={'volcaDrumPatchManagerDeviceDiv' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerDeviceContainer' + volcaDrumPatchManagerMonth}>
                                <p className={'volcaDrumPatchManagerCurrentPatchDisplay' + volcaDrumPatchManagerMonth}>
                                    {currentPatchName()}
                                </p>
                                <img className={'volcaDrumPatchManagerDeviceImage' + volcaDrumPatchManagerMonth} 
                                    src={'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/7d9e95d93948da4072dadc31fd718325_pc.png'}/>
                            </div>
                        </div>
                        <div className={'volcaDrumPatchManagerUserNotesDiv' + volcaDrumPatchManagerMonth}>
                            <div className={'volcaDrumPatchManagerUserNotesContainer' + volcaDrumPatchManagerMonth}>
                                <p className={'volcaDrumPatchManagerUserNotesLabel' + volcaDrumPatchManagerMonth}>user notes</p>
                                {patchCollection.banks.map(bank => 
                                    <textarea className={'volcaDrumPatchManagerUserNotesArea' + (bank.uuid === currentEditBank) + volcaDrumPatchManagerMonth}
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
            <div className={'volcaDrumPatchManagerDeletePatchGuardrail' + patchDeleteGuardrailState + volcaDrumPatchManagerMonth}>
                <p className={'volcaDrumPatchManagerDeletePatchGuardrailLabel' + volcaDrumPatchManagerMonth}>Delete patch?</p>
                <p className={'volcaDrumPatchManagerDeletePatchGuardrailFinePrint' + volcaDrumPatchManagerMonth}>This will permanently delete patch and remove it from all banks in all collections.</p>
                <div className={'volcaDrumPatchManagerDeleteGuardrailButtonsDiv' + volcaDrumPatchManagerMonth}>
                    <button onClick={() => deleteActivePatch()}>delete</button>
                    <button onClick={() => cancelPatchDeleteGuardrail()}>cancel</button>
                </div>
            </div>
            <div className={'volcaDrumPatchManagerSaveAsModal' + saveAsModalState + volcaDrumPatchManagerMonth}>
                <p className={'volcaDrumPatchManagerSaveAsLabel' + volcaDrumPatchManagerMonth}>Save collection as:</p>
                <input className={'volcaDrumPatchManagerSaveAsInput' + volcaDrumPatchManagerMonth}
                    id="volcaDrumPatchManagerSaveAsInput"
                    placeholder={'copy of ' + patchCollection.name}
                    type="text" />
                <div className={'volcaDrumPatchManagerDeleteGuardrailButtonsDiv' + volcaDrumPatchManagerMonth}>
                    <button onClick={() => saveCopyOfCollection()}>save</button>
                    <button onClick={() => closeSaveAsModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaDrumPatchManagerShareModal' + shareModalState + volcaDrumPatchManagerMonth}>
                <p className={'volcaDrumPatchManagerShareLabel' + volcaDrumPatchManagerMonth}>Submit collection "{patchCollection.name}" to Volca Drum Marketplace:</p>
                <div className={'volcaDrumPatchManagerShareForm' + volcaDrumPatchManagerMonth}>
                    <p className={'volcaDrumPatchManagerCollectionNameLabel' + volcaDrumPatchManagerMonth}>collection name:</p>
                    <p className={'volcaDrumPatchManagerCollectionName' + volcaDrumPatchManagerMonth}>{patchCollection.name}</p>
                    <p className={'volcaDrumPatchManagerSubmittedByLabel' + volcaDrumPatchManagerMonth}>submitted by:</p>
                    <p className={'volcaDrumPatchManagerSubmittedBy' + volcaDrumPatchManagerMonth}>{user.first_name} {user.last_name}</p>
                    <p className={'volcaDrumPatchManagerPublicDescriptionLabel' + volcaDrumPatchManagerMonth}>public description:</p>
                    <textarea className={'volcaDrumPatchManagerPublicDescription' + volcaDrumPatchManagerMonth}
                        id="volcaDrumPatchManagerPublicDescription"
                        placeholder="Description of this collection"
                        rows="9"></textarea>
                    <button className={'volcaDrumPatchManagerShareSubmitButton' + volcaDrumPatchManagerMonth}
                        onClick={() => submitShareModal()}>submit</button>
                    <button className={'volcaDrumPatchManagerShareCancelButton' + volcaDrumPatchManagerMonth}
                        onClick={() => closeShareModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaDrumPatchManagerDeleteCollectionModal' + deleteCollectionModalState + volcaDrumPatchManagerMonth}>
                <p className={'volcaDrumPatchManagerDeletePatchGuardrailLabel' + volcaDrumPatchManagerMonth}>Delete collection "{patchCollection.name}"?</p>
                <p className={'volcaDrumPatchManagerDeletePatchGuardrailFinePrint' + volcaDrumPatchManagerMonth}>This will permanently remove collection.</p>
                <div className={'volcaDrumPatchManagerDeleteGuardrailButtonsDiv' + volcaDrumPatchManagerMonth}>
                    <button onClick={() => deleteCollection()}>delete</button>
                    <button onClick={() => closeDeleteCollectionModal()}>cancel</button>
                </div>
            </div>
            <div className={'volcaDrumPatchManagerAboutModal' + aboutModalState + volcaDrumPatchManagerMonth}>
                <div className={'volcaDrumPatchManagerAboutContentDiv' + volcaDrumPatchManagerMonth}>
                    <h2>The Korg Volca Drum Patch Manager</h2>
                    <p>This patch manager is a utility for organizing collections of custom patches into banks for exporting into the 168 Events sequencing environment or for sharing with other users of 168 Events.</p>
                    <p>Some useful definitions for understanding the Volca Drum Patch Manager heirarchy:</p>
                    <h3>Patches</h3>
                    <p>A patch is an individual "preset" that one creates in the Volca Drum Editor. Think of it as a single instrument.</p>
                    <h3>Banks</h3>
                    <p>A bank is an organized set of patches. Think of it as an ensemble of instruments. Each bank comes with a scratch pad for storing notes to help you track your bank structure.</p>
                    <h3>Collections</h3>
                    <p>A collection is an organized set of banks. Think of it as an orchestra made up of discreet sections of instrument types. Collections are available for import into sequences and are the standard format for sharing one's patches with other users.</p>
                </div>
                <button className={'volcaDrumPatchManagerAboutCloseButton' + volcaDrumPatchManagerMonth}
                    onClick={() => closeAboutModal()}>close</button>
            </div>
            <div className={'volcaDrumPatchManagerCollectionLoadModal' + collectionLoadModalState + volcaDrumPatchManagerMonth}>
                <div className={'volcaDrumPatchManagerCollectionLoadContainer' + volcaDrumPatchManagerMonth}>
                    <p className={'volcaDrumPatchManagerLoadTitle' + volcaDrumPatchManagerMonth}>Load Volca Drum Collection</p>
                    <select className={'volcaDrumPatchManagerLoadSelector' + volcaDrumPatchManagerMonth}
                        onChange={(e) => updateSelectedCollectionValue(e.target.value)}
                        value={selectedCollectionValue}>
                        {availableCollections.map(collection => (
                            <option key={collection.uuid}
                                value={collection.uuid}>{collection.name}</option>
                        ))}
                    </select>
                    <button className={'volcaDrumPatchManagerLoadLoadButton' + volcaDrumPatchManagerMonth}
                        onClick={() => loadCollection()}>load</button>
                    <button className={'volcaDrumPatchManagerLoadCancelButton' + volcaDrumPatchManagerMonth}
                        onClick={() => closeCollectionLoadModal()}>cancel</button>
                </div>
            </div>
            <div className={panicState + volcaDrumPatchManagerMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
        );
}


export default VolcaDrumPatchManager;