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

import Gr1Editor from '../gr1Editor/gr1Editor';
import midi5pin from '../img/midi5pin.svg';
import './gr1PatchManager.style.jana.css';
import midiConnection from '../midiManager/midiConnection';
import axios from 'axios';
import uuid4 from 'uuid4';

let connections = null;

function Gr1PatchManager(user, banks) {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1PatchManager/january/spinners/1_5IEruphfrMF6TUVd4uVqCQ.gif';

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [midiConnections, setMidiConnections] = useState(undefined);
    const [userMidiPatch, setUserMidiPatch] = useState(null);
    const [panicState, setPanicState] = useState('gr1PatchManagerPanicOff');
    const [patchDeleteGuardrailState, setPatchDeleteGuardrailState] = useState('_Inactive');
    const [saveAsModalState, setSaveAsModalState] = useState('_Inactive');
    const [gr1PatchManagerContainerState, setGr1PatchManagerContainerState] = useState('_Active');
    const [shareModalState, setShareModalState] = useState('_Inactive');
    const [deleteCollectionModalState, setDeleteCollectionModalState] = useState('_Inactive');
    const [aboutModalState, setAboutModalState] = useState('_Inactive');
    const [collectionLoadModalState, setCollectionLoadModalState] = useState('_Inactive');
    const [gr1PatchManagerMonth, setGr1PatchManagerMonth] = useState('_JanuaryA');
    const [availableCollections, setAvailableCollections] = useState([]);
    const [currentCollection, setCurrentCollection] = useState('');
    const [selectedCollectionValue, setSelectedCollectionValue] = useState('');
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
                uuid: '3736a856-eb3c-4e9e-ba08-b3a9f8738acb',
                name: 'wavetable drone',
                notes: '',
                patches: []
            },
            {
                uuid: '9d984b07-4301-4a4c-99f3-10e0ff94212e',
                name: 'semiotic expansions',
                notes: '',
                patches: []
            },
            {
                uuid: 'a0d022c2-7e7b-4801-ad19-1cda04ec020e',
                name: 'pythagorean drone',
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
        setGr1PatchManagerContainerState('_Inactive');
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
        setGr1PatchManagerContainerState('_Active');
    }
    
    const loadCollection = () => {
        let deepCopy = {...patchCollection};
        if (selectedCollectionValue === '') {
            setCollectionLoadModalState('_Inactive');
            setGr1PatchManagerContainerState('_Active');
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
//            setgr1PatchManagerContainerState('_Active');
//        });
    }
    
    const openAboutModal = () => {
        setAboutModalState('_Active');
        setGr1PatchManagerContainerState('_Inactive');
    }
    
    const closeAboutModal = () => {
        setAboutModalState('_Inactive');
        setGr1PatchManagerContainerState('_Active');
    }
    
    const openDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Active');
        setGr1PatchManagerContainerState('_Inactive');
    }
    
    const closeDeleteCollectionModal = () => {
        setDeleteCollectionModalState('_Inactive');
        setGr1PatchManagerContainerState('_Active');
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
        setGr1PatchManagerContainerState('_Inactive');
    }
    
    const closeShareModal = () => {
        setShareModalState('_Inactive');
        setGr1PatchManagerContainerState('_Active');
    }
    
    const submitShareModal = () => {
        const gr1PatchManagerPublicDescription = document.getElementById('gr1PatchManagerPublicDescription').value;
        setShareModalState('_Inactive');
        setGr1PatchManagerContainerState('_Active');
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
//                    public_description: gr1PatchManagerPublicDescription
//                }).then(() => {
//                    setShareModalState('_Inactive');
//                    setGr1PatchManagerContainerState('_Active');
//                })
//            } else {
//                axios.patch(`/volca_fm_shares/shares/${existingShare[0].uuid}`, {
//                    banks: {
//                        banks: patchCollection.banks
//                    },
//                    name: patchCollection.name,
//                    public_description: gr1PatchManagerPublicDescription
//                }).then(() => {
//                    setShareModalState('_Inactive');
//                    setGr1PatchManagerContainerState('_Active');
//                });
//            }
//        });
    }
    
    const closeSaveAsModal = () => {
        setSaveAsModalState('_Inactive');
        setGr1PatchManagerContainerState('_Active');
        document.getElementById('gr1PatchManagerSaveAsInput').value = '';
    }
    
    const openSaveAsModal = () => {
        setSaveAsModalState('_Active');
        setGr1PatchManagerContainerState('_Inactive');
        setTimeout(() => {
            document.getElementById('gr1PatchManagerSaveAsInput').focus();
        }, 150);
        
    }
    
    const deleteActivePatch = () => {
        let deepCopy = {...patchCollection};
        let deepUserCopy = [...userPatches];
        let index = null;
        setGr1PatchManagerContainerState('_Active');
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
//            setGr1PatchManagerContainerState('_Active');
//            setPatchDeleteGuardrailState('_Inactive');
//        });
    }
    
    const cancelPatchDeleteGuardrail = () => {
        setGr1PatchManagerContainerState('_Active');
        setPatchDeleteGuardrailState('_Inactive');
    }
    
    const deletePatchGuardrail = () => {
        setGr1PatchManagerContainerState('_Inactive');
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
//        gr1PatchTransmitter(patch, currentOutput);
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
//        gr1PatchTransmitter(patch, currentOutput);
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
                if (a.patch_name.toLowerCase() > b.patch_name.toLowerCase()) {
                    return 1;
                } else if (a.patch_name.toLowerCase() < b.patch_name.toLowerCase()) {
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
                        let gr1sList = midiPatch.filter(entry => {
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
            setPanicState('gr1PatchManagerPanicOn');
            setGr1PatchManagerContainerState('_Inactive');
//            for (let i = 0; i < availableOutputs.length; i++) {
//                for (let channel = 0; channel < 16; channel++) {
//                    for (let note = 0; note < 128; note++) {
//                        availableOutputs[i].send([0x80 | channel, note, 0x7f]);
//                    }
//                }
//            }
//            setTimeout(() => {
//                setPanicState('gr1PatchManagerPanicOff');
//                setGr1PatchManagerContainerState('_Active');
//            }, availableOutputs.length * 2000);
            setTimeout(() => {
                setPanicState('gr1PatchManagerPanicOff');
                setGr1PatchManagerContainerState('_Active');
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
        const gr1PatchManagerSaveAsInput = document.getElementById('gr1PatchManagerSaveAsInput').value;
        if (gr1PatchManagerSaveAsInput === '') {
            return;
        }
        closeCollectionLoadModal();
//        axios.post(`/volca_fm_banks/banks`, {
//            user_uuid: user.uuid,
//            banks: {
//                banks: patchCollection.banks
//            },
//            name: gr1PatchManagerSaveAsInput
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
        axios.delete(`/gr1_banks/${selectedUuid}`)
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
                    <Route path="/gr1-editor">
                        {Gr1Editor(user, getActivePatch())}
                    </Route>
                </Switch>
            </Router>
            <div>
                <div className={'gr1PatchManagerContainer' + gr1PatchManagerContainerState + gr1PatchManagerMonth}
                    tabIndex="1"
                    onKeyDown={(e) => noteOnEvent(e.key)}
                    onKeyUp={(e) => noteOffEvent(e.key)}>
                    <div className={'gr1PatchManagerImageDiv' + gr1PatchManagerMonth}>
                        <div className={'gr1PatchManagerTopBar' + gr1PatchManagerMonth}>
                            <NavLink to="/"><img className={'gr1NavImage' + gr1PatchManagerMonth}
                                src={midiImage}></img></NavLink>
                        </div>
                        <h3 className={'gr1PatchManagerTitle' + gr1PatchManagerMonth}>GR-1 Patch Manager</h3>
                        <button className={'gr1PatchManagerLoadButton' + gr1PatchManagerMonth}
                            onClick={() => openLoadCollectionModal()}>load</button>
                        <input className={'gr1PatchManagerNameInput' + gr1PatchManagerMonth}
                            onChange={(e) => patchCollectionNameUpdate(e.target.value)}
                            type="text"
                            value={patchCollection.name}/>
                        <button className={'gr1PatchManagerPanicButton' + gr1PatchManagerMonth}
                            onClick={() => panic()}>panic!</button>
                        <div className={'gr1PatchManagerSidebarManager' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerSidebarContainer' + gr1PatchManagerMonth}>
                                <button className={'gr1PatchManagerSaveButton' + collectionAltered + gr1PatchManagerMonth}
                                    onClick={() => saveCollection()}>save</button>
                                <button className={'gr1PatchManagerSaveAsButton' + gr1PatchManagerMonth}
                                    onClick={() => openSaveAsModal()}>save as...</button>
                                <button className={'gr1PatchManagerRevertButton' + collectionAltered + gr1PatchManagerMonth}
                                    onClick={() => revertCollection()}>revert</button>
                                <p className={'gr1PatchManagerMidiOutputLabel' + gr1PatchManagerMonth}>midi output:</p>
                                <select className={'gr1PatchManagerMidiOutputSelect' + gr1PatchManagerMonth}
                                    onChange={(e) => updateCurrentOutput(e.target.value)}
                                    value={getVisualOutput(currentOutput)}>
                                    {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.label}</option>))}
                                </select>
                                <p className={'gr1PatchManagerMidiChannelLabel' + gr1PatchManagerMonth}>channel:</p>
                                <input className={'gr1PatchManagerMidiChannelInput' + gr1PatchManagerMonth}
                                    max="15"
                                    min="0"
                                    onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                    step="1"
                                    type="number"
                                    value={currentMidiChannel}/>
                                <button className={'gr1PatchManagerShareButton' + gr1PatchManagerMonth}
                                    onClick={() => openShareModal()}>share</button>
                                <button className={'gr1PatchManagerInitButton' + gr1PatchManagerMonth}
                                    onClick={() => initializeNewCollection()}>init</button>
                                <button className={'gr1PatchManagerDeleteCollectionButton' + gr1PatchManagerMonth}
                                    onClick={() => openDeleteCollectionModal()}>delete</button>
                                <button className={'gr1PatchManagerAboutFmManagement' + gr1PatchManagerMonth}
                                    onClick={() => openAboutModal()}>about</button>
                            </div>
                        </div>
                        <div className={'gr1PatchManagerUserPatchesListDiv' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerUserPatchesListContainer' + gr1PatchManagerMonth}>
                                <div className={'gr1PatchManagerUserPatchesList' + gr1PatchManagerMonth}></div>
                                {(userPatches.length > 0) && (<div className={'gr1PatchManagerUserPatchListRealDiv' + gr1PatchManagerMonth}>
                                    {userPatches.map(patch => 
                                        <p className={'gr1PatchManagerPatchNameDisplay' + (selectedPatchPatch === patch.uuid) + gr1PatchManagerMonth}
                                            draggable={true}
                                            onClick={() => makePatchPatchCurrent(patch.uuid)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragStart={() => dragDataSet(patch)}
                                            key={patch.uuid}>{patch.globalParams.name}</p>
                                    )}
                                </div>)}
                                <button className={'gr1PatchManagerUpdateButton' + gr1PatchManagerMonth}
                                    onClick={() => updateUserPatches()}>update</button>
                            </div>
                        </div>
                        <div className={'gr1PatchManagerPatchActionsDiv' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerPatchActionsContainer' + gr1PatchManagerMonth}>
                                {((selectedPatchPatch !== '') || (selectedBankPatch !== '')) && (
                                    <Link className={'gr1PatchManagerEditLocator' + gr1PatchManagerMonth}
                                        to="/gr1-editor">
                                        <button className={'gr1PatchManagerEditActivePatchButton' + gr1PatchManagerMonth}>edit</button>
                                    </Link>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'gr1PatchManagerDeleteActivePatchButton' + gr1PatchManagerMonth}
                                        onClick={() => deletePatchGuardrail()}>delete</button>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'gr1PatchManagerMoveActivePatchButton' + gr1PatchManagerMonth}
                                        onClick={() => addActivePatchToBank()}>&#8594;</button>
                                )}
                            </div>
                        </div>
                        <div className={'gr1PatchManagerBanksDiv' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerBanksContainer' + gr1PatchManagerMonth}>
                                <div className={'gr1PatchManagerBanksBar' + gr1PatchManagerMonth}>
                                    <p className={'gr1PatchManagerBanksLabel' + gr1PatchManagerMonth}>banks:</p>
                                    <select className={'gr1PatchManagerBanksSelect' + gr1PatchManagerMonth}
                                        onChange={(e) => changeBankEdit(e.target.value)}
                                        value={currentEditBank}>
                                        {patchCollection.banks.map(item => 
                                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                                        )}
                                    </select>
                                    <button className={'gr1PatchManagerAddBankButton' + gr1PatchManagerMonth}
                                        onClick={() => addNewBank()}>add</button>
                                    {(patchCollection.banks.length > 1) && (
                                        <button className={'gr1PatchManagerAddBankButton' + gr1PatchManagerMonth}
                                            onClick={() => deleteCurrentBank()}>delete</button>
                                    )}
                                </div>
                                <div className={'gr1PatchManagerBankDisplayContainer' + gr1PatchManagerMonth}>
                                    {patchCollection.banks.map(item => 
                                        <div className={'gr1PatchManagerBankDisplayer' + (item.uuid === currentEditBank) + gr1PatchManagerMonth}
                                            onClick={() => {if (item.uuid !== currentEditBank) changeBankEdit(item.uuid)}}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => { if (item.uuid === currentEditBank) addPatchToBank(item)}}
                                            key={item.uuid}>
                                            {(item.uuid === currentEditBank) && (<div className={'gr1PatchManagerBankDisplayReal' + gr1PatchManagerMonth}>
                                                {(item.patches.length > 0) && (
                                                    <div>
                                                        {item.patches.map(patch => 
                                                            <div className={'gr1PatchManagerBankItemDiv' + gr1PatchManagerMonth}
                                                                key={patch.uuid}>
                                                                <p className={'gr1PatchManagerBankPatchName' + (patch.uuid === selectedBankPatch) + gr1PatchManagerMonth}
                                                                    onClick={() => updateSelectedBankPatch(patch.uuid)}>{patch.globalParams.name}</p>
                                                                <p className={'gr1PatchManakerDeleteChar' + gr1PatchManagerMonth}
                                                                    onClick={() => moveBankPatchUp(patch)}>&#8593;</p>
                                                                <p className={'gr1PatchManakerDeleteChar' + gr1PatchManagerMonth}
                                                                    onClick={() => moveBankPatchDown(patch)}>&#8595;</p>
                                                                <p className={'gr1PatchManakerDeleteChar' + gr1PatchManagerMonth}
                                                                    onClick={() => removeBankPatch(patch)}>&#127303;</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                                <input className={'gr1PatchManagerBankNameInput' + gr1PatchManagerMonth}
                                    onChange={(e) => updateBankName(e.target.value)}
                                    type="text"
                                    value={getCurrentBankName()}/>
                            </div>
                        </div>
                        <div className={'gr1PatchManagerDeviceDiv' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerDeviceContainer' + gr1PatchManagerMonth}>
                                <p className={'gr1PatchManagerCurrentPatchDisplay' + gr1PatchManagerMonth}>
                                    {currentPatchName()}
                                </p>
                                <img className={'gr1PatchManagerDeviceImage' + gr1PatchManagerMonth} 
                                    src={'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/tastychipselectronics_gr-1_01.jpg'}/>
                            </div>
                        </div>
                        <div className={'gr1PatchManagerUserNotesDiv' + gr1PatchManagerMonth}>
                            <div className={'gr1PatchManagerUserNotesContainer' + gr1PatchManagerMonth}>
                                <p className={'gr1PatchManagerUserNotesLabel' + gr1PatchManagerMonth}>user notes</p>
                                {patchCollection.banks.map(bank => 
                                    <textarea className={'gr1PatchManagerUserNotesArea' + (bank.uuid === currentEditBank) + gr1PatchManagerMonth}
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
            <div className={'gr1PatchManagerDeletePatchGuardrail' + patchDeleteGuardrailState + gr1PatchManagerMonth}>
                <p className={'gr1PatchManagerDeletePatchGuardrailLabel' + gr1PatchManagerMonth}>Delete patch?</p>
                <p className={'gr1PatchManagerDeletePatchGuardrailFinePrint' + gr1PatchManagerMonth}>This will permanently delete patch and remove it from all banks in all collections.</p>
                <div className={'gr1PatchManagerDeleteGuardrailButtonsDiv' + gr1PatchManagerMonth}>
                    <button onClick={() => deleteActivePatch()}>delete</button>
                    <button onClick={() => cancelPatchDeleteGuardrail()}>cancel</button>
                </div>
            </div>
            <div className={'gr1PatchManagerSaveAsModal' + saveAsModalState + gr1PatchManagerMonth}>
                <p className={'gr1PatchManagerSaveAsLabel' + gr1PatchManagerMonth}>Save collection as:</p>
                <input className={'gr1PatchManagerSaveAsInput' + gr1PatchManagerMonth}
                    id="gr1PatchManagerSaveAsInput"
                    placeholder={'copy of ' + patchCollection.name}
                    type="text" />
                <div className={'gr1PatchManagerDeleteGuardrailButtonsDiv' + gr1PatchManagerMonth}>
                    <button onClick={() => saveCopyOfCollection()}>save</button>
                    <button onClick={() => closeSaveAsModal()}>cancel</button>
                </div>
            </div>
            <div className={'gr1PatchManagerShareModal' + shareModalState + gr1PatchManagerMonth}>
                <p className={'gr1PatchManagerShareLabel' + gr1PatchManagerMonth}>Submit collection "{patchCollection.name}" to GR-1 Patch Marketplace:</p>
                <div className={'gr1PatchManagerShareForm' + gr1PatchManagerMonth}>
                    <p className={'gr1PatchManagerCollectionNameLabel' + gr1PatchManagerMonth}>collection name:</p>
                    <p className={'gr1PatchManagerCollectionName' + gr1PatchManagerMonth}>{patchCollection.name}</p>
                    <p className={'gr1PatchManagerSubmittedByLabel' + gr1PatchManagerMonth}>submitted by:</p>
                    <p className={'gr1PatchManagerSubmittedBy' + gr1PatchManagerMonth}>{user.first_name} {user.last_name}</p>
                    <p className={'gr1PatchManagerPublicDescriptionLabel' + gr1PatchManagerMonth}>public description:</p>
                    <textarea className={'gr1PatchManagerPublicDescription' + gr1PatchManagerMonth}
                        id="gr1PatchManagerPublicDescription"
                        placeholder="Description of this collection"
                        rows="9"></textarea>
                    <button className={'gr1PatchManagerShareSubmitButton' + gr1PatchManagerMonth}
                        onClick={() => submitShareModal()}>submit</button>
                    <button className={'gr1PatchManagerShareCancelButton' + gr1PatchManagerMonth}
                        onClick={() => closeShareModal()}>cancel</button>
                </div>
            </div>
            <div className={'gr1PatchManagerDeleteCollectionModal' + deleteCollectionModalState + gr1PatchManagerMonth}>
                <p className={'gr1PatchManagerDeletePatchGuardrailLabel' + gr1PatchManagerMonth}>Delete collection "{patchCollection.name}"?</p>
                <p className={'gr1PatchManagerDeletePatchGuardrailFinePrint' + gr1PatchManagerMonth}>This will permanently remove collection.</p>
                <div className={'gr1PatchManagerDeleteGuardrailButtonsDiv' + gr1PatchManagerMonth}>
                    <button onClick={() => deleteCollection()}>delete</button>
                    <button onClick={() => closeDeleteCollectionModal()}>cancel</button>
                </div>
            </div>
            <div className={'gr1PatchManagerAboutModal' + aboutModalState + gr1PatchManagerMonth}>
                <div className={'gr1PatchManagerAboutContentDiv' + gr1PatchManagerMonth}>
                    <h2>The Tasty Chips GR-1 Patch Manager</h2>
                    <p>This patch manager is a utility for organizing collections of custom patches into banks for exporting into the 168 Events sequencing environment or for sharing with other users of 168 Events.</p>
                    <p>Some useful definitions for understanding the GR-1 Patch Manager heirarchy:</p>
                    <h3>Patches</h3>
                    <p>A patch is an individual "preset" that one creates in the GR-1 Editor. Think of it as a single instrument.</p>
                    <h3>Banks</h3>
                    <p>A bank is an organized set of patches. Think of it as an ensemble of instruments. Each bank comes with a scratch pad for storing notes to help you track your bank structure.</p>
                    <h3>Collections</h3>
                    <p>A collection is an organized set of banks. Think of it as an orchestra made up of discreet sections of instrument types. Collections are available for import into sequences and are the standard format for sharing one's patches with other users.</p>
                </div>
                <button className={'gr1PatchManagerAboutCloseButton' + gr1PatchManagerMonth}
                    onClick={() => closeAboutModal()}>close</button>
            </div>
            <div className={'gr1PatchManagerCollectionLoadModal' + collectionLoadModalState + gr1PatchManagerMonth}>
                <div className={'gr1PatchManagerCollectionLoadContainer' + gr1PatchManagerMonth}>
                    <p className={'gr1PatchManagerLoadTitle' + gr1PatchManagerMonth}>Load GR-1 Collection</p>
                    <select className={'gr1PatchManagerLoadSelector' + gr1PatchManagerMonth}
                        onChange={(e) => updateSelectedCollectionValue(e.target.value)}
                        value={selectedCollectionValue}>
                        {availableCollections.map(collection => (
                            <option key={collection.uuid}
                                value={collection.uuid}>{collection.name}</option>
                        ))}
                    </select>
                    <button className={'gr1PatchManagerLoadLoadButton' + gr1PatchManagerMonth}
                        onClick={() => loadCollection()}>load</button>
                    <button className={'gr1PatchManagerLoadCancelButton' + gr1PatchManagerMonth}
                        onClick={() => closeCollectionLoadModal()}>cancel</button>
                </div>
            </div>
            <div className={panicState + gr1PatchManagerMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
        );
}


export default Gr1PatchManager;