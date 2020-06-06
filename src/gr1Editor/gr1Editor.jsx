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
import './gr1Editor.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import midiConnection from '../midiManager/midiConnection';

let connections;

function Gr1Editor(user, patch) {
        
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

    const [gr1ContainerState, setGr1ContainerState] = useState('_Active');
    const [midiConnections, setMidiConnections] = useState(undefined);
    const [panicState, setPanicState] = useState('volcaDrumPanicOff');
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentOutput, setCurrentOutput] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [gr1Month, setGr1Month] = useState('_JanuaryA');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [globalParams, setGlobalParams] =  useState({
        currentPatch: 0,
        masterVolume: 101,
        modulationWheel: 0,
        name: 'default',
        pitchBendRange: 127
    });
    const [granularEditorPaneState, setGranularEditorPaneState] = useState({
        grainEditor: true,
        envelopeEditor: false,
        parametersEditor: false
    });
    const [lfoVCEditorPaneState, setLfoVCEditorPaneState] = useState({
        lfo1: true,
        lfo2: false,
        vc1: false,
        vc2: false
    });
    const [gr1Parameters, setGr1Parameters] = useState([
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        },
        {
            curve: 63,
            cv1: {
                amount: 0,
                destination: 0
            },
            cv2: {
                amount: 0,
                destination: 0
            },
            envelope: {
                attack: 32,
                decay: 16,
                release: 87,
                sustain: 70
            },
            lfo1: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0
            },
            lfo2: {
                amount: 0,
                destination: 0,
                frequency: 0,
                sync: 0,
                waveform: 0 
            },
            params: {
                cutoff: 16,
                density: 32,
                grainsize: 32,
                panSpray: 98,
                resonance: 24,
                scan: 0,
                scanSync: 0,
                spray: 16,
                tune: 64
            },
            position: 55,
            resample: 0,
            sides: 16,
            tilt: 63,
            volume: 101
        }
    ]);
    
    const updatePitchbendRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.pitchBendRange = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updateModulation = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.modulationWheel = val;
        
        setGlobalParams(deepCopy);
    }
    
    const updatePatchVolume = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].volume = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateMasterVolume = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.masterVolume = val;
        
        setGlobalParams(deepCopy);
    }
    
    const lfoVcState = (val) => {
        let deepCopy = {...lfoVCEditorPaneState};
        
        switch(val) {
            case('lfo1'):
                deepCopy.lfo1 = true;
                deepCopy.lfo2 = false;
                deepCopy.vc1 = false;
                deepCopy.vc2 = false;
                break;
            case('lfo2'):
                deepCopy.lfo1 = false;
                deepCopy.lfo2 = true;
                deepCopy.vc1 = false;
                deepCopy.vc2 = false;
                break;
            case('vc1'):
                deepCopy.lfo1 = false;
                deepCopy.lfo2 = false;
                deepCopy.vc1 = true;
                deepCopy.vc2 = false;
                break;
            case('vc2'):
                deepCopy.lfo1 = false;
                deepCopy.lfo2 = false;
                deepCopy.vc1 = false;
                deepCopy.vc2 = true;
                break;
            default:
                console.log('ERROR: Invalid LFO/VC editor state');
                alert('ERROR: Invalid LFO/VC editor state');
        }
        
        setLfoVCEditorPaneState(deepCopy);
    }
    
    const toggleResample = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].resample === 0) {
            deepCopy[globalParams.currentPatch].resample = 1;
        } else {
            deepCopy[globalParams.currentPatch].resample = 0;
        }
        
        setGr1Parameters(deepCopy);
    }
    
    const toggleLFO1KeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].lfo1.sync === 0) {
            deepCopy[globalParams.currentPatch].lfo1.sync = 1;
        } else {
            deepCopy[globalParams.currentPatch].lfo1.sync = 0;
        }
        
        setGr1Parameters(deepCopy);
    }
    
    const toggleLFO2KeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].lfo2.sync === 0) {
            deepCopy[globalParams.currentPatch].lfo2.sync = 1;
        } else {
            deepCopy[globalParams.currentPatch].lfo2.sync = 0;
        }
        
        setGr1Parameters(deepCopy);
    }
    
    const toggleScanKeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].params.scanSync === 0) {
            deepCopy[globalParams.currentPatch].params.scanSync = 1;
        } else {
            deepCopy[globalParams.currentPatch].params.scanSync = 0;
        }
        
        setGr1Parameters(deepCopy);
    }
    
    const updateSamplePosition = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].position = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO1Frequency = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.frequency = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO2Frequency = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.frequency = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO1Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.amount = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO2Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.amount = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO1Waveform = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.waveform = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO2Waveform = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.waveform = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO1Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.destination = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateLFO2Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.destination = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateCV1Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv1.amount = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateCV2Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv2.amount = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateCV1Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv1.destination = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateCV2Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv2.destination = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateDensityValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.density = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateGrainsizeValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.grainsize = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateSprayValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.spray = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateTuneValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.tune = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateCutoffValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.cutoff = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateResonanceValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.resonance = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updatePanSprayValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.panSpray = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updatePanScanValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.scan = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateAttackValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.attack = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateDecayValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.decay = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateSustainValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.sustain = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateReleaseValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.release = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateSidesValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].sides = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const updateTiltValue = (val) => {
       let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].tilt = val;
        
        setGr1Parameters(deepCopy); 
    }
    
    const updateCurveValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].curve = val;
        
        setGr1Parameters(deepCopy);
    }
    
    const setGranularEditorTab = (val) => {
        let deepCopy = {...granularEditorPaneState};
        
        switch(val) {
            case('grain'):
                deepCopy.grainEditor = true;
                deepCopy.envelopeEditor = false;
                deepCopy.parametersEditor = false;
                break;
            case('envelope'):
                deepCopy.grainEditor = false;
                deepCopy.envelopeEditor = true;
                deepCopy.parametersEditor = false;
                break;
            case('params'):
                deepCopy.grainEditor = false;
                deepCopy.envelopeEditor = false;
                deepCopy.parametersEditor = true;
                break;
            default:
                console.log('ERROR: Unsupported granular editor pane state');
                alert('ERROR: Unsupported granular editor pane state');
        }
        
        setGranularEditorPaneState(deepCopy);
    } 
    
    const patchNameUpdate = (val) => {
        let deepCopy = [...globalParams];
        
        deepCopy.name = val;
        
        setGlobalParams(deepCopy);
    }
    
    const changePatch = (val) => {
        let deepCopy = [...globalParams];
        
        deepCopy.currentPatch = val;
        
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
        setPanicState('gr1PanicOn');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('gr1PanicOff');
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
            <div className={'gr1EditorContainer' + gr1ContainerState + gr1Month}
                tabIndex="1"
                onKeyDown={(e) => noteOnEvent(e.key)}
                onKeyUp={(e) => noteOffEvent(e.key)}>
                <div className={'gr1EditorImageDiv' + gr1Month}>
                    <div className={'gr1EditorTopBar' + gr1Month}>
                        <NavLink to="/"><img className={'gr1NavImage' + gr1Month}
                            src={midiImage}></img></NavLink>
                    </div>
                    <h3 className={'gr1EditorTitle' + gr1Month}>GR-1 Editor</h3>
                    <input className={'gr1PatchNameInput' + gr1Month}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'gr1PanicButton' + gr1Month}
                        onClick={() => panic()}>panic!</button>
                    <div className={'gr1SidebarManager' + gr1Month}></div>
                    <div className={'gr1PatchSelectorDiv' + gr1Month}>
                        <div className={'gr1PatchSelectorContainer' + gr1Month}>
                            <p className={'gr1PatchSelectorLabel' + gr1Month}>patch:</p>
                            <div className={'gr1PatchSelectPatch1' + (globalParams.currentPatch === 0) + gr1Month}
                                onClick={() => changePatch(0)}>
                                <p className={'gr1PatchPatch' + gr1Month}>1</p>
                            </div>
                            <div className={'gr1PatchSelectPatch2' + (globalParams.currentPatch === 1) + gr1Month}
                                onClick={() => changePatch(1)}>
                                <p className={'gr1PatchPatch' + gr1Month}>2</p>
                            </div>
                            <div className={'gr1PatchSelectPatch3' + (globalParams.currentPatch === 2) + gr1Month}
                                onClick={() => changePatch(2)}>
                                <p className={'gr1PatchPatch' + gr1Month}>3</p>
                            </div>
                            <div className={'gr1PatchSelectPatch4' + (globalParams.currentPatch === 3) + gr1Month}
                                onClick={() => changePatch(3)}>
                                <p className={'gr1PatchPatch' + gr1Month}>4</p>
                            </div>
                            <div className={'gr1PatchSelectPatch5' + (globalParams.currentPatch === 4) + gr1Month}
                                onClick={() => changePatch(4)}>
                                <p className={'gr1PatchPatch' + gr1Month}>5</p>
                            </div>
                            <div className={'gr1PatchSelectPatch6' + (globalParams.currentPatch === 5) + gr1Month}
                                onClick={() => changePatch(5)}>
                                <p className={'gr1PatchPatch' + gr1Month}>6</p>
                            </div>
                            <div className={'gr1PatchSelectPatch7' + (globalParams.currentPatch === 6) + gr1Month}
                                onClick={() => changePatch(6)}>
                                <p className={'gr1PatchPatch' + gr1Month}>7</p>
                            </div>
                            <div className={'gr1PatchSelectPatch8' + (globalParams.currentPatch === 7) + gr1Month}
                                onClick={() => changePatch(7)}>
                                <p className={'gr1PatchPatch' + gr1Month}>8</p>
                            </div>
                            <div className={'gr1PatchSelectPatch9' + (globalParams.currentPatch === 8) + gr1Month}
                                onClick={() => changePatch(8)}>
                                <p className={'gr1PatchPatch' + gr1Month}>9</p>
                            </div>
                            <div className={'gr1PatchSelectPatch10' + (globalParams.currentPatch === 9) + gr1Month}
                                onClick={() => changePatch(9)}>
                                <p className={'gr1PatchPatch' + gr1Month}>10</p>
                            </div>
                            <div className={'gr1PatchSelectPatch11' + (globalParams.currentPatch === 10) + gr1Month}
                                onClick={() => changePatch(10)}>
                                <p className={'gr1PatchPatch' + gr1Month}>11</p>
                            </div>
                            <div className={'gr1PatchSelectPatch12' + (globalParams.currentPatch === 11) + gr1Month}
                                onClick={() => changePatch(11)}>
                                <p className={'gr1PatchPatch' + gr1Month}>12</p>
                            </div>
                            <div className={'gr1PatchSelectPatch13' + (globalParams.currentPatch === 12) + gr1Month}
                                onClick={() => changePatch(12)}>
                                <p className={'gr1PatchPatch' + gr1Month}>13</p>
                            </div>
                            <div className={'gr1PatchSelectPatch14' + (globalParams.currentPatch === 13) + gr1Month}
                                onClick={() => changePatch(13)}>
                                <p className={'gr1PatchPatch' + gr1Month}>14</p>
                            </div>
                            <div className={'gr1PatchSelectPatch15' + (globalParams.currentPatch === 14) + gr1Month}
                                onClick={() => changePatch(14)}>
                                <p className={'gr1PatchPatch' + gr1Month}>15</p>
                            </div>
                            <div className={'gr1PatchSelectPatch16' + (globalParams.currentPatch === 15) + gr1Month}
                                onClick={() => changePatch(15)}>
                                <p className={'gr1PatchPatch' + gr1Month}>16</p>
                            </div>
                            <div className={'gr1PatchSelectPatch17' + (globalParams.currentPatch === 16) + gr1Month}
                                onClick={() => changePatch(16)}>
                                <p className={'gr1PatchPatch' + gr1Month}>17</p>
                            </div>
                            <div className={'gr1PatchSelectPatch18' + (globalParams.currentPatch === 17) + gr1Month}
                                onClick={() => changePatch(17)}>
                                <p className={'gr1PatchPatch' + gr1Month}>18</p>
                            </div>
                            <div className={'gr1PatchSelectPatch19' + (globalParams.currentPatch === 18) + gr1Month}
                                onClick={() => changePatch(18)}>
                                <p className={'gr1PatchPatch' + gr1Month}>19</p>
                            </div>
                            <div className={'gr1PatchSelectPatch20' + (globalParams.currentPatch === 19) + gr1Month}
                                onClick={() => changePatch(19)}>
                                <p className={'gr1PatchPatch' + gr1Month}>20</p>
                            </div>
                            <div className={'gr1PatchSelectPatch21' + (globalParams.currentPatch === 20) + gr1Month}
                                onClick={() => changePatch(20)}>
                                <p className={'gr1PatchPatch' + gr1Month}>21</p>
                            </div>
                            <div className={'gr1PatchSelectPatch22' + (globalParams.currentPatch === 21) + gr1Month}
                                onClick={() => changePatch(21)}>
                                <p className={'gr1PatchPatch' + gr1Month}>22</p>
                            </div>
                            <div className={'gr1PatchSelectPatch23' + (globalParams.currentPatch === 22) + gr1Month}
                                onClick={() => changePatch(22)}>
                                <p className={'gr1PatchPatch' + gr1Month}>23</p>
                            </div>
                            <div className={'gr1PatchSelectPatch24' + (globalParams.currentPatch === 23) + gr1Month}
                                onClick={() => changePatch(23)}>
                                <p className={'gr1PatchPatch' + gr1Month}>24</p>
                            </div>
                            <div className={'gr1PatchSelectPatch25' + (globalParams.currentPatch === 24) + gr1Month}
                                onClick={() => changePatch(24)}>
                                <p className={'gr1PatchPatch' + gr1Month}>25</p>
                            </div>
                            <div className={'gr1PatchSelectPatch26' + (globalParams.currentPatch === 25) + gr1Month}
                                onClick={() => changePatch(25)}>
                                <p className={'gr1PatchPatch' + gr1Month}>26</p>
                            </div>
                            <div className={'gr1PatchSelectPatch27' + (globalParams.currentPatch === 26) + gr1Month}
                                onClick={() => changePatch(26)}>
                                <p className={'gr1PatchPatch' + gr1Month}>27</p>
                            </div>
                            <div className={'gr1PatchSelectPatch28' + (globalParams.currentPatch === 27) + gr1Month}
                                onClick={() => changePatch(27)}>
                                <p className={'gr1PatchPatch' + gr1Month}>28</p>
                            </div>
                            <div className={'gr1PatchSelectPatch29' + (globalParams.currentPatch === 28) + gr1Month}
                                onClick={() => changePatch(28)}>
                                <p className={'gr1PatchPatch' + gr1Month}>29</p>
                            </div>
                            <div className={'gr1PatchSelectPatch30' + (globalParams.currentPatch === 29) + gr1Month}
                                onClick={() => changePatch(29)}>
                                <p className={'gr1PatchPatch' + gr1Month}>30</p>
                            </div>
                            <div className={'gr1PatchSelectPatch31' + (globalParams.currentPatch === 30) + gr1Month}
                                onClick={() => changePatch(30)}>
                                <p className={'gr1PatchPatch' + gr1Month}>31</p>
                            </div>
                            <div className={'gr1PatchSelectPatch32' + (globalParams.currentPatch === 31) + gr1Month}
                                onClick={() => changePatch(31)}>
                                <p className={'gr1PatchPatch' + gr1Month}>32</p>
                            </div>
                        </div>
                    </div>
                    <div className={'gr1DisplayPane' + gr1Month}></div>
                    <div className={'gr1GranularEditorPane' + gr1Month}>
                        <div className={'gr1GranularEditorPaneContainer' + gr1Month}>
                            <div className={'gr1GranularEditorTabsBar' + gr1Month}>
                                <div className={'gr1GranularEditorTab' + granularEditorPaneState.grainEditor + gr1Month}
                                    onClick={() => setGranularEditorTab('grain')}>
                                    <p>grain</p>
                                </div>
                                <div className={'gr1GranularEditorTab' + granularEditorPaneState.envelopeEditor + gr1Month}
                                    onClick={() => setGranularEditorTab('envelope')}>
                                    <p>envelope</p>
                                </div>
                                <div className={'gr1GranularEditorTab' + granularEditorPaneState.parametersEditor + gr1Month}
                                    onClick={() => setGranularEditorTab('params')}>
                                    <p>parameters</p>
                                </div>
                            </div>
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.grainEditor + gr1Month}>
                                <div className={'gr1GrainEditorContainer' + gr1Month}>
                                    <p className={'gr1GrainSidesLabel' + gr1Month}>sides:</p>
                                    <input className={'gr1GrainSidesNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateSidesValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].sides} />
                                    <div className={'gr1SidesSliderContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateSidesValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].sides}/>
                                    </div>
                                    <p className={'gr1GrainTiltLabel' + gr1Month}>tilt:</p>
                                    <input className={'gr1GrainTiltNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateTiltValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].tilt} />
                                    <div className={'gr1SidesTiltContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateTiltValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].tilt}/>
                                    </div>
                                    <p className={'gr1GrainCurveLabel' + gr1Month}>curve:</p>
                                    <input className={'gr1GrainCurveNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCurveValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].curve} />
                                    <div className={'gr1SidesCurveContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateCurveValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].curve}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.envelopeEditor + gr1Month}>
                                <div className={'gr1EnvelopeEditorContainer' + gr1Month}>
                                    <p className={'gr1EnvelopeAttackLabel' + gr1Month}>A</p>
                                    <input className={'gr1EnvelopeAttackNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateAttackValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].envelope.attack} />
                                    <div className={'gr1EnvelopeAttackContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateAttackValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].envelope.attack}/>
                                    </div>
                                    <p className={'gr1EnvelopeDecayLabel' + gr1Month}>D</p>
                                    <input className={'gr1EnvelopeDecayNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateDecayValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].envelope.decay} />
                                     <div className={'gr1EnvelopeDecayContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDecayValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].envelope.decay}/>
                                    </div>
                                    <p className={'gr1EnvelopeSustainLabel' + gr1Month}>S</p>
                                    <input className={'gr1EnvelopeSustainNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateSustainValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].envelope.sustain} />
                                    <div className={'gr1EnvelopeSustainContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateSustainValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].envelope.sustain}/>
                                    </div>
                                    <p className={'gr1EnvelopeReleaseLabel' + gr1Month}>R</p>
                                    <input className={'gr1EnvelopeReleaseNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateReleaseValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].envelope.release} />
                                    <div className={'gr1EnvelopeReleaseContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateReleaseValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].envelope.release}/>
                                    </div>
                                </div>
                            </div>
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.parametersEditor + gr1Month}>
                                <div className={'gr1ParametersEditorContainer' + gr1Month}>
                                    <p className={'gr1ParameterDensityLabel' + gr1Month}>density</p>
                                    <input className={'gr1ParametersDensityNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateDensityValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.density} />
                                    <div className={'gr1ParametersDensityContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateDensityValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.density}/>
                                    </div>
                                    <p className={'gr1ParameterGrainsizeLabel' + gr1Month}>grainsize</p>
                                    <input className={'gr1ParametersGrainsizeNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateGrainsizeValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.grainsize} />
                                    <div className={'gr1ParametersGrainsizeContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateGrainsizeValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.grainsize}/>
                                    </div>
                                    <p className={'gr1ParameterSprayLabel' + gr1Month}>spray</p>
                                    <input className={'gr1ParametersSprayNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateSprayValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.spray} />
                                    <div className={'gr1ParametersSprayContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateSprayValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.spray}/>
                                    </div>
                                    <p className={'gr1ParameterTuneLabel' + gr1Month}>tune</p>
                                    <input className={'gr1ParametersTuneNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateTuneValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.tune} />
                                    <div className={'gr1ParametersTuneContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateTuneValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.tune}/>
                                    </div>
                                    <p className={'gr1ParameterCutoffLabel' + gr1Month}>cutoff</p>
                                    <input className={'gr1ParametersCutoffNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCutoffValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.cutoff} />
                                    <div className={'gr1ParametersCutoffContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateCutoffValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.cutoff}/>
                                    </div>
                                    <p className={'gr1ParameterResonanceLabel' + gr1Month}>resonance</p>
                                    <input className={'gr1ParametersResonanceNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateResonanceValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.resonance} />
                                    <div className={'gr1ParametersResonanceContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateResonanceValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.resonance}/>
                                    </div>
                                    <p className={'gr1ParameterPanSprayLabel' + gr1Month}>pan spray</p>
                                    <input className={'gr1ParametersPanSprayNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updatePanSprayValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.panSpray} />
                                     <div className={'gr1ParametersPanSprayContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updatePanSprayValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.panSpray}/>
                                    </div>
                                    <p className={'gr1ParameterScanLabel' + gr1Month}>scan</p>
                                    <input className={'gr1ParametersScanNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updatePanScanValue(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].params.scan} />
                                    <div className={'gr1ParametersScanContainer' + gr1Month}>
                                        <input className={'gr1SlidesSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updatePanScanValue(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].params.scan}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'gr1SamplePositionPane' + gr1Month}>
                        <div className={'gr1SamplePositionContainer' + gr1Month}>
                            <p className={'gr1SamplePositionLabel' + gr1Month}>position</p>
                            <div className={'gr1SamplePositionSliderContainer' + gr1Month}>
                                <input className={'gr1PositionSlider' + gr1Month}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateSamplePosition(e.target.value)}
                                    type="range"
                                    value={gr1Parameters[globalParams.currentPatch].position}/>
                            </div>
                        </div>
                    </div>
                    <div className={'gr1LfoCvPane' + gr1Month}>
                        <div className={'gr1LfoCvContainer' + gr1Month}>
                            <div className={'gr1LfoCvTabsBar' + gr1Month}>
                                <div className={'gr1GranularEditorTab' + lfoVCEditorPaneState.lfo1 + gr1Month}
                                    onClick={() => lfoVcState('lfo1')}>
                                    <p>lfo 1</p>
                                </div>
                                <div className={'gr1GranularEditorTab' + lfoVCEditorPaneState.lfo2 + gr1Month}
                                    onClick={() => lfoVcState('lfo2')}>
                                    <p>lfo 2</p>
                                </div>
                                <div className={'gr1GranularEditorTab' + lfoVCEditorPaneState.vc1 + gr1Month}
                                    onClick={() => lfoVcState('vc1')}>
                                    <p>cv 1</p>
                                </div>
                                <div className={'gr1GranularEditorTab' + lfoVCEditorPaneState.vc2 + gr1Month}
                                    onClick={() => lfoVcState('vc2')}>
                                    <p>cv 2</p>
                                </div>
                            </div>
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.lfo1 + gr1Month}>
                                <div className={'gr1LfoVcEditSpaceContainer' + gr1Month}>
                                    <p className={'gr1LFOFrequencyLabel' + gr1Month}>frequency</p>
                                    <input className={'gr1LfoFrequencyNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateLFO1Frequency(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].lfo1.frequency} />
                                    <div className={'gr1LFOSliderContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateLFO1Frequency(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].lfo1.frequency}/>
                                    </div>
                                    <p className={'gr1LFOAmountLabel' + gr1Month}>amount</p>
                                    <input className={'gr1LfoAmountNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateLFO1Amount(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].lfo1.amount} />
                                    <div className={'gr1LFOSliderAmountContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateLFO1Amount(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].lfo1.amount}/>
                                    </div>
                                    <p className={'gr1LFOWaveformLabel' + gr1Month}>waveform</p>
                                    <select className={'gr1LFOWaveFormSelect' + gr1Month}
                                        onChange={(e) => updateLFO1Waveform(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].lfo1.waveform}>
                                        <option value="0">sine</option>
                                        <option value="1">random</option>
                                        <option value="2">saw</option>
                                        <option value="3">square</option>
                                    </select>
                                    <p className={'gr1LFODestinationLabel' + gr1Month}>destination</p>
                                    <select className={'gr1LFODestinationSelect' + gr1Month}
                                        onChange={(e) => updateLFO1Destination(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].lfo1.destination}>
                                        <option value="0">tune</option>
                                        <option value="1">position</option>
                                        <option value="2">spray</option>
                                        <option value="3">size</option>
                                        <option value="4">density</option>
                                        <option value="5">cutoff</option>
                                    </select>
                                </div>
                            </div>
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.lfo2 + gr1Month}>
                                <div className={'gr1LfoVcEditSpaceContainer' + gr1Month}>
                                    <p className={'gr1LFOFrequencyLabel' + gr1Month}>frequency</p>
                                    <input className={'gr1LfoFrequencyNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateLFO2Frequency(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].lfo2.frequency} />
                                    <div className={'gr1LFOSliderContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateLFO2Frequency(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].lfo2.frequency}/>
                                    </div>
                                    <p className={'gr1LFOAmountLabel' + gr1Month}>amount</p>
                                    <input className={'gr1LfoAmountNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateLFO2Amount(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].lfo2.amount} />
                                    <div className={'gr1LFOSliderAmountContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateLFO2Amount(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].lfo2.amount}/>
                                    </div>
                                    <p className={'gr1LFOWaveformLabel' + gr1Month}>waveform</p>
                                    <select className={'gr1LFOWaveFormSelect' + gr1Month}
                                        onChange={(e) => updateLFO2Waveform(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].lfo2.waveform}>
                                        <option value="0">sine</option>
                                        <option value="1">random</option>
                                        <option value="2">saw</option>
                                        <option value="3">square</option>
                                    </select>
                                    <p className={'gr1LFODestinationLabel' + gr1Month}>destination</p>
                                    <select className={'gr1LFODestinationSelect' + gr1Month}
                                        onChange={(e) => updateLFO2Destination(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].lfo2.destination}>
                                        <option value="0">tune</option>
                                        <option value="1">position</option>
                                        <option value="2">spray</option>
                                        <option value="3">size</option>
                                        <option value="4">density</option>
                                        <option value="5">cutoff</option>
                                    </select>
                                </div>
                            </div>
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.vc1 + gr1Month}>
                                <div className={'gr1LfoVcEditSpaceContainer' + gr1Month}>
                                    <p className={'gr1CVAmountLabel' + gr1Month}>amount</p>
                                    <input className={'gr1CVAmountNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCV1Amount(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].cv1.amount} />
                                    <div className={'gr1VCSliderAmountContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateCV1Amount(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].cv1.amount}/>
                                    </div>
                                    <p className={'gr1CVDestinationLabel' + gr1Month}>destination</p>
                                    <select className={'gr1CVDestinationSelect' + gr1Month}
                                        onChange={(e) => updateCV1Destination(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].cv1.destination}>
                                        <option value="0">tune</option>
                                        <option value="1">position</option>
                                        <option value="2">spray</option>
                                        <option value="3">size</option>
                                        <option value="4">density</option>
                                        <option value="5">cutoff</option>
                                    </select>
                                </div>
                            </div>
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.vc2 + gr1Month}>
                                <div className={'gr1LfoVcEditSpaceContainer' + gr1Month}>
                                    <p className={'gr1CVAmountLabel' + gr1Month}>amount</p>
                                    <input className={'gr1CVAmountNumberInput' + gr1Month}
                                        max="127"
                                        min="0"
                                        onChange={(e) => updateCV2Amount(e.target.value)}
                                        type="number"
                                        value={gr1Parameters[globalParams.currentPatch].cv2.amount} />
                                    <div className={'gr1VCSliderAmountContainer' + gr1Month}>
                                        <input className={'gr1LfoSlidersSlider' + gr1Month}
                                            max="127"
                                            min="0"
                                            onChange={(e) => updateCV2Amount(e.target.value)}
                                            type="range"
                                            value={gr1Parameters[globalParams.currentPatch].cv2.amount}/>
                                    </div>
                                    <p className={'gr1CVDestinationLabel' + gr1Month}>destination</p>
                                    <select className={'gr1CVDestinationSelect' + gr1Month}
                                        onChange={(e) => updateCV2Destination(e.target.value)}
                                        value={gr1Parameters[globalParams.currentPatch].cv2.destination}>
                                        <option value="0">tune</option>
                                        <option value="1">position</option>
                                        <option value="2">spray</option>
                                        <option value="3">size</option>
                                        <option value="4">density</option>
                                        <option value="5">cutoff</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'gr1GeneralSettings' + gr1Month}>
                        <div className={'gr1GeneralSettingsContainer' + gr1Month}>
                            <p className={'gr1LFO1KeySyncLabel' + gr1Month}>lfo 1 key sync</p>
                            <div className={'gr1LFOKeySyncSwitchContainer' + gr1Month}
                                onClick={() => toggleLFO1KeySync()}>
                                <p>off</p>
                                <p>on</p>
                            </div>
                            <div className={'gr1LFO1KeySyncSwitch' + gr1Parameters[globalParams.currentPatch].lfo1.sync + gr1Month}
                                onClick={() => toggleLFO1KeySync()}></div>
                            <p className={'gr1LFO2KeySyncLabel' + gr1Month}>lfo 2 key sync</p>
                            <div className={'gr1LFO2KeySyncSwitchContainer' + gr1Month}
                                onClick={() => toggleLFO2KeySync()}>
                                <p>off</p>
                                <p>on</p>
                            </div>
                            <div className={'gr1LFO2KeySyncSwitch' + gr1Parameters[globalParams.currentPatch].lfo2.sync + gr1Month}
                                onClick={() => toggleLFO2KeySync()}></div>
                            <p className={'gr1ScanKeySyncLabel' + gr1Month}>scan key sync</p>
                            <div className={'gr1ScanKeySyncSwitchContainer' + gr1Month}
                                onClick={() => toggleScanKeySync()}>
                                <p>off</p>
                                <p>on</p>
                            </div>
                            <div className={'gr1ScanKeySyncSwitch' + gr1Parameters[globalParams.currentPatch].params.scanSync + gr1Month}
                                onClick={() => toggleScanKeySync()}></div>
                            <p className={'gr1ResampleLabel' + gr1Month}>resample</p>
                            <div className={'gr1ResampleSwitchContainer' + gr1Month}
                                onClick={() => toggleResample()}>
                                <p>off</p>
                                <p>on</p>
                            </div>
                            <div className={'gr1ResampleSwitch' + gr1Parameters[globalParams.currentPatch].resample + gr1Month}
                                onClick={() => toggleResample()}></div>
                            <p className={'gr1PitchbendRangeLabel' + gr1Month}>pitchbend range</p>
                            <input className={'gr1PitchbendRangeNumberInput' + gr1Month}
                                max="127"
                                min="0"
                                onChange={(e) => updatePitchbendRange(e.target.value)}
                                type="number"
                                value={globalParams.pitchBendRange} />
                            <div className={'gr1PitchbendSliderContainer' + gr1Month}>
                                <input className={'gr1GlobalsSlidersSlider' + gr1Month}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePitchbendRange(e.target.value)}
                                    type="range"
                                    value={globalParams.pitchBendRange}/>
                            </div>
                            <p className={'gr1ModulationLabel' + gr1Month}>modulation</p>
                            <input className={'gr1ModulationNumberInput' + gr1Month}
                                max="127"
                                min="0"
                                onChange={(e) => updateModulation(e.target.value)}
                                type="number"
                                value={globalParams.modulationWheel} />
                            <div className={'gr1ModulationWheelSliderContainer' + gr1Month}>
                                <input className={'gr1GlobalsSlidersSlider' + gr1Month}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateModulation(e.target.value)}
                                    type="range"
                                    value={globalParams.modulationWheel}/>
                            </div>
                            <p className={'gr1PatchVolumeLabel' + gr1Month}>patch volume</p>
                            <input className={'gr1PatchVolumeNumberInput' + gr1Month}
                                max="127"
                                min="0"
                                onChange={(e) => updatePatchVolume(e.target.value)}
                                type="number"
                                value={gr1Parameters[globalParams.currentPatch].volume} />
                            <div className={'gr1PatchVolumeSliderContainer' + gr1Month}>
                                <input className={'gr1GlobalsSlidersSlider' + gr1Month}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updatePatchVolume(e.target.value)}
                                    type="range"
                                    value={gr1Parameters[globalParams.currentPatch].volume}/>
                            </div>
                            <p className={'gr1MasterVolumeLabel' + gr1Month}>master volume</p>
                            <input className={'gr1MasterVolumeNumberInput' + gr1Month}
                                max="127"
                                min="0"
                                onChange={(e) => updateMasterVolume(e.target.value)}
                                type="number"
                                value={globalParams.masterVolume} />
                            <div className={'gr1MasterVolumeSliderContainer' + gr1Month}>
                                <input className={'gr1GlobalsSlidersSlider' + gr1Month}
                                    max="127"
                                    min="0"
                                    onChange={(e) => updateMasterVolume(e.target.value)}
                                    type="range"
                                    value={globalParams.masterVolume}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}


export default Gr1Editor;
