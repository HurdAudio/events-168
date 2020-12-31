import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midi5pin from '../img/midi5pin.svg';
import './midiManager.style.jana.css';
import './midiManager.style.janb.css';
import './midiManager.style.janc.css';
import './midiManager.style.feba.css';
import './midiManager.style.febb.css';
import './midiManager.style.febc.css';
import midiConnection from './midiConnection';
import AvailableDevices from './availableDevices';
import SkinsTable from '../skins/skins';
import UUID from 'uuidjs';
import axios from 'axios';

let connections = {
    inputs: [],
    outputs:[]
};

const availableDevices = AvailableDevices();
const skin = SkinsTable('midiManager');

function MidiManager(user, config) {
    
    const [midiConnections, setMidiConnections] = useState(connections);
    const [midiManagerContainerState, setMidiManagerContainerState] = useState('_Active');
    const [midiManagerMonth, setMidiManagerMonth] = useState(skin.midiManager.skin);
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [configAltered, setConfigAltered] = useState(false);
    const [userPresets, setUserPresets] = useState([
        {
            inputs: [
                {
                    channel: 0,
                    controller: true,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Port 1',
                    label: '<--empty-->'
                }
            ],
            name: 'default',
            outputs: [
                {
                    activeReciever: false,
                    channel: 0,
                    device: 'no device',
                    deviceUuid: '0',
                    hardwareIn: 'Port 1',
                    label: '<--empty-->'
                }
            ],
            uuid: '0'
        }
    ]);
    const [currentPreset, setCurrentPreset] = useState(userPresets[0]);
    const [currentPresetUuid, setCurrentPresetUuid] = useState(userPresets[0].uuid);
    const [currentInputDetail, setCurrentInputDetail] = useState(null);
    const [currentOutputDetail, setCurrentOutputDetail] = useState(null);
    const [currentDeviceImage, setCurrentDeviceImage] = useState(null);
    const [newPatchModalState, setNewPatchModalState] = useState('_Inactive');
    const [deleteGuardrailState, setDeleteGuardrailState] = useState('_Inactive');
    const [saveAsModalState, setSaveAsModalState] = useState('_Inactive');
    const [currentSpinner, setCurrentSpinner] = useState(skin.midiManager.spinner);
    const [panicState, setPanicState] = useState('midiManagerPanicOff');
    
    const changePreset = (uuid) => {
        let index = 0;
        for (let i = 0; i < userPresets.length; i++) {
            if (userPresets[i].uuid === uuid) {
                index = i;
            }
        }
        setCurrentPreset(userPresets[index]);
        setCurrentPresetUuid(userPresets[index].uuid);
        setConfigAltered(false);
        setCurrentInputDetail(null);
        setCurrentOutputDetail(null);
        setCurrentDeviceImage(null);
    }
    
    const onMIDIMessage = (message) => {
        if (message.data[0] !== 255) { console.log(message); }
        for (let i = 0; i < currentPreset.outputs.length; i++) {
            if (currentPreset.outputs[i].activeReciever && message.data[0] !== 255) {
                midiConnections.outputs[i].send(message.data);
            }
        }
    }
    
    const setMIDIListeners = () => {
        for (let mInput = 0; mInput < midiConnections.inputs.length; mInput++) {
            if (currentPreset.inputs[mInput].controller) {
                midiConnections.inputs[mInput].onmidimessage = onMIDIMessage;
            } else {
                midiConnections.inputs[mInput].onmidimessage = null;
            }
            
        }
    }
    
    const checkMidiConnections = () => {
        if ((userPresets.length === 1) && (userPresets[0].uuid === '0')) {
            axios.get(`/midi_manager_patches/byuser/${user.uuid}`)
            .then(userConnectionsData => {
                let aStr, bStr;
                const userConnections = userConnectionsData.data.sort((a, b) => {
                    if (a.user_preset.name.toLowerCase().slice[0, 4] === 'the ') {
                        aStr = a.user_preset.name.toLowerCase().slice[4];
                    } else if (a.user_preset.name.toLowerCase().slice[0, 2] === 'a ') {
                        aStr = a.user_preset.name.toLowerCase().slice[2];
                    } else {
                        aStr = a.user_preset.name.toLowerCase();
                    }
                    if (b.user_preset.name.toLowerCase().slice[0, 4] === 'the ') {
                        bStr = b.user_preset.name.toLowerCase().slice[4];
                    } else if (b.user_preset.name.toLowerCase().slice[0, 2] === 'a ') {
                        bStr = b.user_preset.name.toLowerCase().slice[2];
                    } else {
                        bStr = b.user_preset.name.toLowerCase();
                    }
                    if (aStr < bStr) {
                        return -1;
                    } else if (aStr > bStr) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                if (userConnections.length === 0) {
                    navigator.requestMIDIAccess({ sysex: true })
                    .then((midiAccess) => {               
                        connections = midiConnection(midiAccess);
                        setMidiConnections(connections);
                        console.log(midiConnections);
                        
                        let inputs = [];
                        let outputs = [];
                        let deepCopy = [];
                        const uuid = UUID.generate();
                        for (let i = 0; i < midiConnections.inputs.length; i++) {
                            inputs[i] = {
                                channel: 0,
                                controller: false,
                                device: 'no device',
                                deviceUuid: '0',
                                hardwareIn: midiConnections.inputs[i].name,
                                label: '<--empty-->'
                            };
                        }
                        for (let o = 0; o < midiConnections.outputs.length; o++) {
                            outputs[o] = {
                                activeReciever: false,
                                channel: 0,
                                device: 'no device',
                                deviceUuid: '0',
                                hardwareIn: midiConnections.outputs[o].name,
                                label: '<--empty-->'
                            }
                        }
                        axios.post(`/midi_manager_patches/patch`, {
                            user_uuid: user.uuid,
                            user_preset: {
                                inputs: inputs,
                                name: 'default',
                                outputs: outputs``
                            }
                        })
                        .then(postedData => {
                            const posted = postedData.data[0];
                            deepCopy.push({
                                uuid: posted.uuid,
                                inputs: inputs,
                                name: 'default',
                                outputs: outputs
                                });
                            setUserPresets(deepCopy);
                            setMIDIListeners();
                        });
                    }, () => {
                        alert('No MIDI ports accessible');
                    });                    
                } else {
                    let presets = [];
                    console.log(userConnections);
                    for (let i = 0; i < userConnections.length; i++) {
                        presets.push({
                            inputs: userConnections[i].user_preset.inputs,
                            name: userConnections[i].user_preset.name,
                            outputs: userConnections[i].user_preset.outputs,
                            uuid: userConnections[i].uuid
                        });
                    }
                    setUserPresets(presets);
                    navigator.requestMIDIAccess({ sysex: true })
                    .then((midiAccess) => {               
                        connections = midiConnection(midiAccess);
                        setMidiConnections(connections);
                        console.log(midiConnections);
                        setMIDIListeners();
                    }, () => {
                        alert('No MIDI ports accessible');
                    });
                }
            });
        } else {
            navigator.requestMIDIAccess({ sysex: true })
            .then((midiAccess) => {               
                connections = midiConnection(midiAccess);
                setMidiConnections(connections);
                console.log(midiConnections);
                setMIDIListeners();
            }, () => {
                alert('No MIDI ports accessible');
            });
        }
        
        
        
    }
    
    const toggleController = (inputDevice) => {
        let setting;
        let deepCopy = {...currentPreset};
        let deepCopy2 = [...userPresets];
        for (let i = 0; i < deepCopy.inputs.length; i++) {
            if (deepCopy.inputs[i].hardwareIn === inputDevice.hardwareIn) {
                deepCopy.inputs[i].controller = !deepCopy.inputs[i].controller;
                setting = deepCopy.inputs[i].controller;
            }       
        }
        
        for (let j = 0; j < deepCopy2.length; j++) {
            if (deepCopy2[j].uuid === currentPresetUuid) {
                for (let k = 0; k < deepCopy2[j].inputs.length; k++) {
                    if (deepCopy2[j].inputs[k].hardwareIn === inputDevice.hardwareIn) {
                        deepCopy2[j].inputs[k].controller = setting;
                    }
                }
            }
        }
        setUserPresets(deepCopy2);
        setCurrentPreset(deepCopy);
        setCurrentPresetUuid(deepCopy.uuid);
        setConfigAltered(true);
        setMIDIListeners();
    }
    
    const toggleReceiver = (inputDevice) => {
        let setting;
        let deepCopy = {...currentPreset};
        let deepCopy2 = [...userPresets];
        for (let i = 0; i < deepCopy.outputs.length; i++) {
            if (deepCopy.outputs[i].hardwareIn === inputDevice.hardwareIn) {
                deepCopy.outputs[i].activeReciever = !deepCopy.outputs[i].activeReciever;
                setting = deepCopy.outputs[i].activeReciever;
            }       
        }
        for (let j = 0; j < deepCopy2.length; j++) {
            if (deepCopy2[j].uuid === currentPresetUuid) {
               for (let k = 0; k < deepCopy2[j].outputs.length; k++) {
                   if (deepCopy2[j].outputs[k].hardwareIn === inputDevice.hardwareIn) {
                      deepCopy2[j].outputs[k].activeReciever = setting; 
                   }
                } 
            }
            
        }
        console.log(deepCopy);
        setUserPresets(deepCopy2);
        setCurrentPreset(deepCopy);
        setCurrentPresetUuid(deepCopy.uuid);
        setConfigAltered(true);
    }
    
    const inputDetailAssign = (inputter) => {
        setCurrentInputDetail(inputter);
        setImage(inputter.deviceUuid);
    }
    
    const outputDetailAssign = (outputter) => {
        setCurrentOutputDetail(outputter);
        setImage(outputter.deviceUuid);
    }
    
    const updateOutputLabel = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        deepCopy.label = val;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].label = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].label = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setCurrentPresetUuid(deepPatch.uuid);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const updateLabel = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        deepCopy.label = val;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].label = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].label = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setCurrentPresetUuid(deepPatch.uuid);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeOutDevice = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        let device = availableDevices.filter(vice => {
            return(vice.uuid === val);
        })[0];
        
        deepCopy.deviceUuid = val;
        deepCopy.device = device.device;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].deviceUuid = val;
                deepPatch.outputs[i].device = device.device;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].deviceUuid = val;
                        masterDepth[j].outputs[k].device = device.device;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeDevice = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        let device = availableDevices.filter(vice => {
            return(vice.uuid === val);
        })[0];
        
        deepCopy.deviceUuid = val;
        deepCopy.device = device.device;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].deviceUuid = val;
                deepPatch.inputs[i].device = device.device;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].deviceUuid = val;
                        masterDepth[j].inputs[k].device = device.device;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setCurrentPresetUuid(deepPatch.uuid);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeOutMidiChannel = (val) => {
        let deepCopy = {...currentOutputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        
        deepCopy.channel = val;
        
        for (let i = 0; i < deepPatch.outputs.length; i++) {
            if (deepPatch.outputs[i].hardwareIn === currentOutputDetail.hardwareIn) {
                deepPatch.outputs[i].channel = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].outputs.length; k++) {
                    if (masterDepth[j].outputs[k].hardwareIn === currentOutputDetail.hardwareIn) {
                        masterDepth[j].outputs[k].channel = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentOutputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setCurrentPresetUuid(deepPatch.uuid);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const changeMidiChannel = (val) => {
        let deepCopy = {...currentInputDetail};
        let deepPatch = {...currentPreset};
        let masterDepth = [...userPresets];
        
        deepCopy.channel = val;
        
        for (let i = 0; i < deepPatch.inputs.length; i++) {
            if (deepPatch.inputs[i].hardwareIn === currentInputDetail.hardwareIn) {
                deepPatch.inputs[i].channel = val;
            }
        }
        
        for (let j = 0; j < masterDepth.length; j++) {
            if (masterDepth[j].uuid === currentPresetUuid) {
                for (let k = 0; k < masterDepth[j].inputs.length; k++) {
                    if (masterDepth[j].inputs[k].hardwareIn === currentInputDetail.hardwareIn) {
                        masterDepth[j].inputs[k].channel = val;
                    }
                }
            }
        }
        
        setImage(deepCopy.deviceUuid);
        setCurrentInputDetail(deepCopy);
        setCurrentPreset(deepPatch);
        setCurrentPresetUuid(deepPatch.uuid);
        setUserPresets(masterDepth);
        setConfigAltered(true);
    }
    
    const setImage = (uuid) => {
        let device = availableDevices.filter(vice => {
            return(vice.uuid === uuid);
        })[0];
        
        setCurrentDeviceImage(device.imagePath);
    }
    
    const newPatchModalOpen = () => {
        setNewPatchModalState('_Active');
        document.getElementById('midiManagerNewPresetNameInput').focus();
        setMidiManagerContainerState('_Inactive');
    }
    
    const closeNewPatchModal = () => {
        setNewPatchModalState('_Inactive');
        document.getElementById('midiManagerNewPresetNameInput').value = '';
        setMidiManagerContainerState('_Active');
    }
    
    const submitNewPatchName = () => {
        if (document.getElementById('midiManagerNewPresetNameInput').value !== '') {
            createNewPatch(document.getElementById('midiManagerNewPresetNameInput').value);
        }
    }
    
    const createNewPatch = (name) => {
        let deepCopy = [...userPresets];
        const inputs = [];
        const outputs = [];
        
        for (let i = 0; i < midiConnections.inputs.length; i++) {
            inputs[i] = {
                channel: 0,
                controller: false,
                device: 'no device',
                deviceUuid: '0',
                hardwareIn: midiConnections.inputs[i].name,
                label: '<--empty-->'
            };
        }
        
        for (let o = 0; o < midiConnections.outputs.length; o++) {
            outputs[o] = {
                activeReciever: false,
                channel: 0,
                device: 'no device',
                deviceUuid: '0',
                hardwareIn: midiConnections.outputs[o].name,
                label: '<--empty-->'
            }
        }
        axios.post(`/midi_manager_patches/patch`, {
            user_uuid: user.uuid,
            user_preset: {
                inputs: inputs,
                output: outputs,
                name: name
            }
        })
        .then(postedData => {
            const posted = postedData.data[0];
            deepCopy.push(
                {
                    inputs: inputs,
                    name: name,
                    outputs: outputs,
                    uuid: posted.uuid
                }
            );

            setUserPresets(deepCopy);
            setCurrentPreset(deepCopy[deepCopy.length - 1]);
            setCurrentPresetUuid(posted.uuid);
            setConfigAltered(false);
            setCurrentInputDetail(null);
            setCurrentOutputDetail(null);
            setCurrentDeviceImage(null);
            setNewPatchModalState('_Inactive');
            document.getElementById('midiManagerNewPresetNameInput').value = '';
            setMidiManagerContainerState('_Active');
        });
        
    }
    
    const deletePatchGuardrail = () => {
        setDeleteGuardrailState('_Active');
        setMidiManagerContainerState('_Inactive');
    }
    
    const closeDeleteGuardrail = () => {
        setDeleteGuardrailState('_Inactive');
        setMidiManagerContainerState('_Active');
    }
    
    const deletePatch = () => {
        let index = null;
        let newCurrent = null;
        let newCurrentUUID = null;
        let deepCopy = [...userPresets];
        for (let i = 0; i < deepCopy.length; i++) {
            if (deepCopy[i].uuid === currentPreset.uuid) {
                index = i;
            }
        }
        axios.delete(`/midi_manager_patches/${deepCopy[index].uuid}`)
        .then(() => {
            deepCopy.splice(index, 1);
            setUserPresets(deepCopy);
            if (deepCopy.length !== 0) {
                newCurrent = deepCopy[0];
                newCurrentUUID = deepCopy[0].uuid;
            } else {
                newCurrent = null;
                newCurrentUUID = null;
            }
            setCurrentPreset(newCurrent);
            setCurrentPresetUuid(newCurrentUUID);
        });
        
    }
    
    const deleteGuardrailCleared = () => {
        deletePatch();
        closeDeleteGuardrail();
    }
    
    const revertToSavedCopy = () => {
        let index = null;
        let deepCopyPatches = [...userPresets];
        axios.get(`/midi_manager_patches/patch/${currentPreset.uuid}`)
        .then(savedPatchData => {
            const savedPatch = savedPatchData.data;
            for (let i = 0; i < deepCopyPatches.length; i++) {
                if (deepCopyPatches[i].uuid === savedPatch.uuid) {
                    index = i;
                    deepCopyPatches[i].inputs = savedPatch.user_preset.inputs;
                    deepCopyPatches[i].outputs = savedPatch.user_preset.outputs;
                    deepCopyPatches[i].name = savedPatch.user_preset.name;
                }
            }
            setUserPresets(deepCopyPatches);
            setCurrentPreset(deepCopyPatches[index]);
            setCurrentPresetUuid(deepCopyPatches[index].uuid);
            setConfigAltered(false);
        });
        
    }
    
    const openSaveAsModal = () => {
        setSaveAsModalState('_Active');
        setMidiManagerContainerState('_Inactive');
        document.getElementById('midiManagerSaveAsNameInput').focus();
    }
    
    const closeSaveAsModal = () => {
        setSaveAsModalState('_Inactive');
        setMidiManagerContainerState('_Active');
        document.getElementById('midiManagerSaveAsNameInput').value = '';
    }
    
    const saveAsSubmit = () => {
        if (document.getElementById('midiManagerSaveAsNameInput').value !== '') {
            const deepCopy = {...currentPreset};
            const deepPatch = [...userPresets];
            deepCopy.name = document.getElementById('midiManagerSaveAsNameInput').value;
            axios.post(`/midi_manager_patches/patch`, {
                user_uuid: user.uuid,
                user_preset: {
                    inputs: deepCopy.inputs,
                    outputs: deepCopy.outputs,
                    name: deepCopy.name
                }
            })
            .then(postedData => {
                const posted = postedData.data[0];
                deepCopy.uuid = posted.uuid;
                deepPatch.push(deepCopy);
                setUserPresets(deepPatch);
                setCurrentPreset(deepCopy);
                setCurrentPresetUuid(deepCopy.uuid);
                closeSaveAsModal();
            });            
        }
    }
    
    const saveCurrentPreset = () => {
        axios.patch(`/midi_manager_patches/patch/${currentPreset.uuid}`, {
            user_preset: {
                inputs: currentPreset.inputs,
                outputs: currentPreset.outputs,
                name: currentPreset.name
            }
        })
        .then(() => {
            setConfigAltered(false);
        });
    }
    
    const panic = () => {
        setPanicState('midiManagerPanicOn');
        setMidiManagerContainerState('_Inactive');
        for (let i = 0; i < midiConnections.outputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    midiConnections.outputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('midiManagerPanicOff');
            setMidiManagerContainerState('_Active');
        }, midiConnections.outputs.length * 2000);
    }
    
    return(
        <div>
            <div className={'midiManagerContainer' + midiManagerContainerState + midiManagerMonth}>
                <div className={'midiManagerImageDiv' + midiManagerMonth}>
                    <div className={'midiManagerTopBar' + midiManagerMonth}>
                        <NavLink to="/">
                            <img className={'midiManagerNavImage' + midiManagerMonth}
                            src={midiImage}>
                            </img>
                        </NavLink>  
                    </div>
                    <h3 className={'midiManagerTitle' + midiManagerMonth}>MIDI Manager</h3>
                    <button className={'midiManagerPanicButton' + midiManagerMonth}
                        onClick={() => panic()}>Panic!
                    </button>
                    <div className={'midiManagerSidebarManager' + midiManagerMonth}>
                        <div className={'midiManagerSidebarContainer' + midiManagerMonth}>
                            <button className={'midiManagerCheckConnections' + midiManagerMonth}
                                onClick={() => checkMidiConnections()}>
                                check</button>
                            <button className={'midiManagerSaveConfiguration' + configAltered + midiManagerMonth}
                                onClick={() => saveCurrentPreset()}>
                                save</button>
                            <button className={'midiManagerSaveAsConfiguration' + midiManagerMonth}
                                onClick={() => openSaveAsModal()}>
                                save as...</button>
                            <button className={'midiManagerRevertConfiguration' + configAltered + midiManagerMonth}
                                onClick={() => revertToSavedCopy()}>
                                revert</button>
                            <p className={'midiManagerPresetsLabel' + midiManagerMonth}>presets:</p>
                            <div className={'midiManagerPresetsList' + midiManagerMonth}>
                                {userPresets.map(config => (
                                    <div className={'midiManagerPresetNameContainer' + (config.uuid === currentPreset.uuid) + midiManagerMonth}
                                        key={config.uuid}
                                        onClick={() => changePreset(config.uuid)}>
                                        <p className={'midiManagerPresetName' + (config.uuid === currentPreset.uuid) + midiManagerMonth} 
                                        value={config.id}>
                                            {config.name}
                                        </p>
                                    </div>
                                ))}        
                            </div>
                            <button className={'midiManagerLoadConfiguration' + midiManagerMonth}
                                onClick={() => newPatchModalOpen()}>
                                new</button>
                            <button className={'midiManagerDeleteConfiguration' + midiManagerMonth}
                                onClick={() => deletePatchGuardrail()}>delete</button>
                        </div>
                    </div>
                    <div className={'midiManagerInputsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputsContainer' + midiManagerMonth}>
                            <h3 className={'midiManagerInputsPaneLabel' + midiManagerMonth}>Inputs</h3>
                            {(midiConnections.inputs.length === currentPreset.inputs.length) && (
                                <div className={'midiManagerInputsTable' + midiManagerMonth}>
                                    {currentPreset.inputs.map(p => (
                                        <div key={p.hardwareIn}
                                                onClick={() => inputDetailAssign(p)}>
                                            <p className={'midiManagerHardwareInputLabel' + midiManagerMonth}>{p.hardwareIn}</p>
                                            <div className={'midiManagerInputEntryDiv' + midiManagerMonth}
                                                    >
                                                <div className={'midiManagerInputControlSwitchDiv' + midiManagerMonth}
                                                    onClick={() => toggleController(p)}>
                                                    <div className={'midiManagerInputControlSwitch' + p.controller + midiManagerMonth}></div>
                                                </div>
                                                    <p className={'midiManagerInputLabel' + midiManagerMonth}>{p.label}</p>
                                                
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerOutputsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputsContainer' + midiManagerMonth}>
                            <h3 className={'midiManagerInputsPaneLabel' + midiManagerMonth}>Outputs</h3>
                            {(midiConnections.outputs.length === currentPreset.outputs.length) && (
                                <div className={'midiManagerInputsTable' + midiManagerMonth}>
                                    {currentPreset.outputs.map(p => (
                                        <div key={p.hardwareIn}
                                            onClick={() => outputDetailAssign(p)}>
                                            <p className={'midiManagerHardwareInputLabel' + midiManagerMonth}>{p.hardwareIn}</p>
                                            <div className={'midiManagerInputEntryDiv' + midiManagerMonth}>
                                                <div className={'midiManagerInputControlSwitchDiv' + midiManagerMonth}
                                                    onClick={() => toggleReceiver(p)}>
                                                    <div className={'midiManagerInputControlSwitch' + p.activeReciever + midiManagerMonth}></div>
                                                </div>
                                                    <p className={'midiManagerInputLabel' + midiManagerMonth}>{p.label}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerInputDetailsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputDetailContainer' + midiManagerMonth}>
                            <p className={'midiManagerInputDetailLabel' + midiManagerMonth}>input details</p>
                            {(currentInputDetail !== null) && (
                                <div className={'midiManagerInputDetailBox' + midiManagerMonth}>
                                    <p className={'midiManagerMidiInLabelAndPort' + midiManagerMonth}>midi in: {currentInputDetail.hardwareIn}</p>
                                    <p className={'midiManagerMidiInLabelLabel' + midiManagerMonth}>label:</p>
                                    <input
                                        className={'midiManagerInInputForLabel' + midiManagerMonth}
                                        onChange={(e) => updateLabel(e.target.value)}
                                        type="text"
                                        value={currentInputDetail.label}/>
                                    <div className={'midiManagerSelectMidiChannelDiv' + midiManagerMonth}>
                                        <div className={'midiManagerSubDivSelect' + midiManagerMonth}>
                                            <p className={'midiManagerMidiInDeviceLabel' + midiManagerMonth}>device:</p>
                                            <select 
                                                className={'midiManagerDeviceSelect' + midiManagerMonth}
                                                onChange={(e) => changeDevice(e.target.value)}
                                                value={currentInputDetail.deviceUuid}>
                                                {availableDevices.map(device => (
                                                    <option 
                                                        key={device.uuid}
                                                        value={device.uuid}>{device.device}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={'midiManagerMidiChannelOnlyDiv' + midiManagerMonth}>
                                            <p className={'midiManagerInputMidiChannelLabel' + midiManagerMonth}>midi channel:</p>
                                            <input 
                                                className={'midiManagerMidiChannelInputInput' + midiManagerMonth}
                                                max="15"
                                                min="0"
                                                onChange={(e) => changeMidiChannel(e.target.value)}
                                                type="number"
                                                value={currentInputDetail.channel}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerOutputDetailsPane' + midiManagerMonth}>
                        <div className={'midiManagerInputDetailContainer' + midiManagerMonth}>
                            <p className={'midiManagerOutputDetailLabel' + midiManagerMonth}>output details</p>
                            {(currentOutputDetail !== null) && (
                                <div className={'midiManagerInputDetailBox' + midiManagerMonth}>
                                    <p className={'midiManagerMidiOutLabelAndPort' + midiManagerMonth}>midi out: {currentOutputDetail.hardwareIn}</p>
                                    <p className={'midiManagerMidiOutLabelLabel' + midiManagerMonth}>label:</p>
                                    <input
                                        className={'midiManagerInInputForLabel' + midiManagerMonth}
                                        onChange={(e) => updateOutputLabel(e.target.value)}
                                        type="text"
                                        value={currentOutputDetail.label}/>
                                    <div className={'midiManagerSelectMidiChannelDiv' + midiManagerMonth}>
                                        <div className={'midiManagerSubDivSelect' + midiManagerMonth}>
                                            <p className={'midiManagerMidiOutDeviceLabel' + midiManagerMonth}>device:</p>
                                            <select 
                                                className={'midiManagerDeviceSelect' + midiManagerMonth}
                                                onChange={(e) => changeOutDevice(e.target.value)}
                                                value={currentOutputDetail.deviceUuid}>
                                                {availableDevices.map(device => (
                                                    <option 
                                                        key={device.uuid}
                                                        value={device.uuid}>{device.device}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={'midiManagerMidiChannelOnlyDiv' + midiManagerMonth}>
                                            <p className={'midiManagerOutputMidiChannelLabel' + midiManagerMonth}>midi channel:</p>
                                            <input 
                                                className={'midiManagerMidiChannelInputInput' + midiManagerMonth}
                                                max="15"
                                                min="0"
                                                onChange={(e) => changeOutMidiChannel(e.target.value)}
                                                type="number"
                                                value={currentOutputDetail.channel}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={'midiManagerDeviceDetailsPane' + midiManagerMonth}>
                        {(currentDeviceImage !== null) && (
                            <div>
                                <img className={'midiManagerDeviceImage' + midiManagerMonth}
                                    src={currentDeviceImage}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + newPatchModalState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>new preset name:</p>
                <input className={'midiManagerNewPresetNameInput' + midiManagerMonth}
                    id="midiManagerNewPresetNameInput"
                    placeholder="new preset"
                    type="text"/>
                <div className={'midiManagerNewPresetNameModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => submitNewPatchName()}>submit</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeNewPatchModal()}>cancel</button>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + deleteGuardrailState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>Are you sure you wish to delete this preset?</p>
                <div className={'midiManagerGuardrailModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => deleteGuardrailCleared()}>yes</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeDeleteGuardrail()}>no</button>
                </div>
            </div>
            <div className={'midiManagerNameNewPatchModal' + saveAsModalState + midiManagerMonth}>
                <p className={'midiManagerNewPresetNameLabel' + midiManagerMonth}>Save copy of preset as:</p>
                <input className={'midiManagerNewPresetNameInput' + midiManagerMonth}
                    id="midiManagerSaveAsNameInput"
                    placeholder="copy of preset"
                    type="text"/>
                <div className={'midiManagerNewPresetNameModalButtons' + midiManagerMonth}>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => saveAsSubmit()}>submit</button>
                    <button className={'midiManagerModalButton' + midiManagerMonth}
                        onClick={() => closeSaveAsModal()}>cancel</button>
                </div>
            </div>
            <div className={panicState + midiManagerMonth}>
                <img src={currentSpinner} />
            </div>
        </div>
    )
    
}

export default MidiManager;