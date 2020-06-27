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
import VolcaFm from '../volcaFm/volcaFm';
import midi5pin from '../img/midi5pin.svg';
import './volcaFmPatchManager.style.jana.css';
import axios from 'axios';
import uuid4 from 'uuid4';

function VolcaFmPatchManager(user, banks) {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;
    const janaSpinner = '';
    const janbSpinner = '';
    const jancSpinner = '';
    const febaSpinner = '';

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {};

    const [panicState, setPanicState] = useState('panicOff');
    const [volcaFmPatchManagerContainerState, setVolcaFmPatchManagerContainerState] = useState('_Active');
    const [volcaFmPatchManagerMonth, setVolcaFmPatchManagerMonth] = useState('_JanuaryA');
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
                name: 'pads',
                notes: '',
                patches: []
            },
            {
                uuid: 'ce0c3188-a670-4a3e-9b1a-50f9206e7603',
                name: 'leads',
                notes: '',
                patches: []
            },
            {
                uuid: '6a1a66bd-2d20-484a-ae74-9a40c9aafa5e',
                name: 'percussion',
                notes: '',
                patches: []
            }
        ],
        name: 'collection 1'
    });
    const [currentEditBank, setCurrentEditBank] = useState(patchCollection.banks[0].uuid);
    const [collectionAltered, setCollectionAltered] = useState(true);
    
    const saveCollection = () => {
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
    }
    
    const updateSelectedBankPatch = (val) => {
        setSelectedPatchPatch('');
        setSelectedBankPatch(val);
    }
    
    const makePatchPatchCurrent = (val) => {
        setSelectedPatchPatch(val);
        setSelectedBankPatch('');
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
    }
    
    const patchCollectionNameUpdate = (val) => {
        let deepCopy = {...patchCollection};
        
        deepCopy.name = val;
        
        setPatchCollection(deepCopy);
    }
    
    const updateUserPatches = () => {
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
            console.log(userPatches);
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
        setPanicState('panicOn');
//        setVolcaFmContainerState('Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('panicOff');
//            setVolcaFmContainerState('Active');
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
    
    const getCurrentBankName = () => {
        let index = null;
        for (let i = 0; i < patchCollection.banks.length; i++) {
            if (patchCollection.banks[i].uuid === currentEditBank) {
                index = i;
            }
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
                    name = userPatches[i].patch_name;
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
                    <Route path="/volca-fm-editor">
                        {VolcaFm(user, getActivePatch())}
                    </Route>

                </Switch>
            </Router>
            <div>
                <div className={'volcaFmPatchManagerContainer' + volcaFmPatchManagerContainerState + volcaFmPatchManagerMonth}
                    tabIndex="1"
                    onKeyDown={(e) => noteOnEvent(e.key)}
                    onKeyUp={(e) => noteOffEvent(e.key)}>
                    <div className={'volcaFmPatchManagerImageDiv' + volcaFmPatchManagerMonth}>
                        <div className={'volcaFmPatchManagerTopBar' + volcaFmPatchManagerMonth}>
                            <NavLink to="/"><img className={'volcaFmPmNavImage' + volcaFmPatchManagerMonth}
                                src={midiImage}></img></NavLink>
                        </div>
                        <h3 className={'volcaFmPatchManagerTitle' + volcaFmPatchManagerMonth}>Volca FM Patch Manager</h3>
                        <button className={'volcaFmPatchManagerLoadButton' + volcaFmPatchManagerMonth}>load</button>
                        <input className={'volcaFmPatchManagerNameInput' + volcaFmPatchManagerMonth}
                            onChange={(e) => patchCollectionNameUpdate(e.target.value)}
                            type="text"
                            value={patchCollection.name}/>
                        <button className={'volcaFmPatchManagerPanicButton' + volcaFmPatchManagerMonth}
                            onClick={() => panic()}>panic!</button>
                        <div className={'volcaFmPatchManagerSidebarManager' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerSidebarContainer' + volcaFmPatchManagerMonth}>
                                <button className={'volcaFmPatchManagerSaveButton' + collectionAltered + volcaFmPatchManagerMonth}
                                    onClick={() => saveCollection()}>save</button>
                                <button className={'volcaFmPatchManagerSaveAsButton' + volcaFmPatchManagerMonth}>save as...</button>
                                <button className={'volcaFmPatchManagerRevertButton' + collectionAltered + volcaFmPatchManagerMonth}>revert</button>
                                <p className={'volcaFmPatchManagerMidiOutputLabel' + volcaFmPatchManagerMonth}>midi output:</p>
                                <select className={'volcaFmPatchManagerMidiOutputSelect' + volcaFmPatchManagerMonth}
                                    onChange={(e) => updateCurrentOutput(e.target.value)}
                                    value={getVisualOutput(currentOutput)}>
                                    {availableOutputs.map(out => (
                                    <option key={out.id} value={out.id}>{out.name}</option>))}
                                </select>
                                <p className={'volcaFmPatchManagerMidiChannelLabel' + volcaFmPatchManagerMonth}>channel:</p>
                                <input className={'volcaFmPatchManagerMidiChannelInput' + volcaFmPatchManagerMonth}
                                    max="15"
                                    min="0"
                                    onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                    step="1"
                                    type="number"
                                    value={currentMidiChannel}/>
                                <button className={'volcaFmPatchManagerShareButton' + volcaFmPatchManagerMonth}>share</button>
                                <button className={'volcaFmPatchManagerInitButton' + volcaFmPatchManagerMonth}>init</button>
                                <button className={'volcaFmPatchManagerDeleteCollectionButton' + volcaFmPatchManagerMonth}>delete</button>
                                <button className={'volcaFmPatchManagerAboutFmManagement' + volcaFmPatchManagerMonth}>about</button>
                            </div>
                        </div>
                        <div className={'volcaFmPatchManagerUserPatchesListDiv' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerUserPatchesListContainer' + volcaFmPatchManagerMonth}>
                                <div className={'volcaFmPatchManagerUserPatchesList' + volcaFmPatchManagerMonth}></div>
                                {(userPatches.length > 0) && (<div className={'volcaFmPatchManagerUserPatchListRealDiv' + volcaFmPatchManagerMonth}>
                                    {userPatches.map(patch => 
                                        <p className={'volcaFmPatchManagerPatchNameDisplay' + (selectedPatchPatch === patch.uuid) + volcaFmPatchManagerMonth}
                                            draggable={true}
                                            onClick={() => makePatchPatchCurrent(patch.uuid)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDragStart={() => dragDataSet(patch)}
                                            key={patch.uuid}>{patch.patch_name}</p>
                                    )}
                                </div>)}
                                <button className={'volcaFmPatchManagerUpdateButton' + volcaFmPatchManagerMonth}
                                    onClick={() => updateUserPatches()}>update</button>
                            </div>
                        </div>
                        <div className={'volcaFmPatchManagerPatchActionsDiv' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerPatchActionsContainer' + volcaFmPatchManagerMonth}>
                                {((selectedPatchPatch !== '') || (selectedBankPatch !== '')) && (
                                    <Link className={'volcaFmPatchManagerEditLocator' + volcaFmPatchManagerMonth}
                                        to="/volca-fm-editor">
                                        <button className={'volcaFmPatchManagerEditActivePatchButton' + volcaFmPatchManagerMonth}>edit</button>
                                    </Link>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaFmPatchManagerDeleteActivePatchButton' + volcaFmPatchManagerMonth}>delete</button>
                                )}
                                {(selectedPatchPatch !== '') && (
                                    <button className={'volcaFmPatchManagerMoveActivePatchButton' + volcaFmPatchManagerMonth}
                                        onClick={() => addActivePatchToBank()}>&#8594;</button>
                                )}
                            </div>
                        </div>
                        <div className={'volcaFmPatchManagerBanksDiv' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerBanksContainer' + volcaFmPatchManagerMonth}>
                                <div className={'volcaFmPatchManagerBanksBar' + volcaFmPatchManagerMonth}>
                                    <p className={'volcaFmPatchManagerBanksLabel' + volcaFmPatchManagerMonth}>banks:</p>
                                    <select className={'volcaFmPatchManagerBanksSelect' + volcaFmPatchManagerMonth}
                                        onChange={(e) => changeBankEdit(e.target.value)}
                                        value={currentEditBank}>
                                        {patchCollection.banks.map(item => 
                                            <option key={item.uuid} value={item.uuid}>{item.name}</option>
                                        )}
                                    </select>
                                    <button className={'volcaFmPatchManagerAddBankButton' + volcaFmPatchManagerMonth}
                                        onClick={() => addNewBank()}>add</button>
                                    {(patchCollection.banks.length > 1) && (
                                        <button className={'volcaFmPatchManagerAddBankButton' + volcaFmPatchManagerMonth}
                                            onClick={() => deleteCurrentBank()}>delete</button>
                                    )}
                                </div>
                                <div className={'volcaFmPatchManagerBankDisplayContainer' + volcaFmPatchManagerMonth}>
                                    {patchCollection.banks.map(item => 
                                        <div className={'volcaFMPatchManagerBankDisplayer' + (item.uuid === currentEditBank) + volcaFmPatchManagerMonth}
                                            onClick={() => {if (item.uuid !== currentEditBank) changeBankEdit(item.uuid)}}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => { if (item.uuid === currentEditBank) addPatchToBank(item)}}
                                            key={item.uuid}>
                                            {(item.uuid === currentEditBank) && (<div className={'volcaFmPatchManagerBankDisplayReal' + volcaFmPatchManagerMonth}>
                                                {(item.patches.length > 0) && (
                                                    <div>
                                                        {item.patches.map(patch => 
                                                            <div className={'volcaFmPatchManagerBankItemDiv' + volcaFmPatchManagerMonth}
                                                                key={patch.uuid}>
                                                                <p className={'volcaFmPatchManagerBankPatchName' + (patch.uuid === selectedBankPatch) + volcaFmPatchManagerMonth}
                                                                    onClick={() => updateSelectedBankPatch(patch.uuid)}>{patch.patch_name}</p>
                                                                <p className={'volcaFmPatchManakerDeleteChar' + volcaFmPatchManagerMonth}
                                                                    onClick={() => moveBankPatchUp(patch)}>&#8593;</p>
                                                                <p className={'volcaFmPatchManakerDeleteChar' + volcaFmPatchManagerMonth}
                                                                    onClick={() => moveBankPatchDown(patch)}>&#8595;</p>
                                                                <p className={'volcaFmPatchManakerDeleteChar' + volcaFmPatchManagerMonth}
                                                                    onClick={() => removeBankPatch(patch)}>&#127303;</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                                <input className={'volcaFmPatchManagerBankNameInput' + volcaFmPatchManagerMonth}
                                    onChange={(e) => updateBankName(e.target.value)}
                                    type="text"
                                    value={getCurrentBankName()}/>
                            </div>
                        </div>
                        <div className={'volcaFmPatchManagerDeviceDiv' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerDeviceContainer' + volcaFmPatchManagerMonth}>
                                <p className={'volcaFmPatchManagerCurrentPatchDisplay' + volcaFmPatchManagerMonth}>
                                    {currentPatchName()}
                                </p>
                                <img className={'volcaFmPatchManagerDeviceImage' + volcaFmPatchManagerMonth} 
                                    src={'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png'}/>
                            </div>
                        </div>
                        <div className={'volcaFmPatchManagerUserNotesDiv' + volcaFmPatchManagerMonth}>
                            <div className={'volcaFmPatchManagerUserNotesContainer' + volcaFmPatchManagerMonth}>
                                <p className={'volcaFmPatchManagerUserNotesLabel' + volcaFmPatchManagerMonth}>user notes</p>
                                {patchCollection.banks.map(bank => 
                                    <textarea className={'volcaFmPatchManagerUserNotesArea' + (bank.uuid === currentEditBank) + volcaFmPatchManagerMonth}
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
        </div>
        );
}


export default VolcaFmPatchManager;