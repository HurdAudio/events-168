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
import sampleImage from '../img/sampleImage.png';
import './gr1Editor.style.jana.css';
import './gr1Editor.style.janb.css';
import './gr1Editor.style.janc.css';
import './gr1Editor.style.feba.css';
import './gr1Editor.style.febb.css';
import './gr1Editor.style.febc.css';
import axios from 'axios';
import midi5pin from '../img/midi5pin.svg';
import midiConnection from '../midiManager/midiConnection';

let connections;

const januaryASpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/unnamed_GR1_spinner.gif';
const januaryBSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/loading51.gif';
const januaryCSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/JVQ25yB.gif';
const februaryASpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/GratefulTornDavidstiger-max-1mb.gif';
const februaryBSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/Material-Loading-Animation__ss.gif';
const februaryCSpinner = 'https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/spinners/ab683e549ce6be7bcded205943e11c76.gif';

function Gr1Editor(user, incomingPatch) {
        
    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 36;
    let keyEngaged = {};
    let defaultSpeed = 500;
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;

    const [gr1ContainerState, setGr1ContainerState] = useState('_Active');
    const [gr1LoadModalState, setGr1LoadModalState] = useState('_Inactive');
    const [loadPatchUuid, setLoadPatchUuid] = useState('');
    const [currentPatchUuid, setCurrentPatchUuid] = useState('');
    const [userPatches, setUserPatches] = useState([]);
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('_Inactive');
    const [aboutGR1DivState, setAboutGR1DivState] = useState('_Inactive');
    const [currentSpinner, setCurrentSpinner] = useState(februaryCSpinner);
    const [saveAsName, setSaveAsName] = useState('');
    const [currentOutput, setCurrentOutput] = useState(null);
    const [midiConnections, setMidiConnections] = useState(undefined);
    const [panicState, setPanicState] = useState('gr1PanicOff');
    const [availableInputs, setAvailableInputs] = useState([]);
    const [availableOutputs, setAvailableOutputs] = useState([]);
    const [currentMidiChannel, setCurrentMidiChannel] = useState(0);
    const [gr1Month, setGr1Month] = useState('_FebruaryC');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [patchAltered, setPatchAltered] = useState(false);
    const [globalParams, setGlobalParams] =  useState({
        currentPatch: 0,
        masterVolume: 101,
        modulationWheel: 0,
        name: 'default',
        pitchBendRange: 127
    });
    const [displayState, setDisplayState] = useState({
        envelope: false,
        grain: false,
        lfo1: false,
        lfo2: false,
        parameters: false
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
    const [envelopeDisplayDimensions, setEnvelopeDisplayDimensions] = useState({
        height: 0,
        width: 0
    });
    const [grainDisplayDimensions, setGrainDisplayDimensions] = useState({
        height: 0,
        width: 0
    });
    const [parametersDisplayDimensions, setParametersDisplayDimensions] = useState({
        height: 0,
        width: 0
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
    
    const openGR1AboutDiv = () => {
        setAboutGR1DivState('_Active');
        setGr1ContainerState('_Inactive');
    }
    
    const closeGR1AboutDiv = () => {
        setAboutGR1DivState('_Inactive');
        setGr1ContainerState('_Active');
    }
    
    const initPatch = () => {
        let patchArr = [];
        
        setGlobalParams({
            currentPatch: 0,
            masterVolume: 101,
            modulationWheel: 0,
            name: 'init',
            pitchBendRange: 127
        });
        for (let i = 0; i < 32; i++) {
            patchArr.push({
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
                    scan: 63,
                    scanSync: 0,
                    spray: 16,
                    tune: 64
                },
                position: 55,
                resample: 0,
                sides: 16,
                tilt: 63,
                volume: 101
            });
        }
        
        setGr1Parameters(patchArr);
        setPatchAltered(true);
        currentOutput.send([0xC0 | currentMidiChannel, globalParams.currentPatch]);
        bulkPatchSend();
        setCurrentPatchUuid('');
    }
    
    const makeRandomPatch = () => {
        let patchArr = [];
        
        setGlobalParams({
            currentPatch: 0,
            masterVolume: Math.floor(Math.random() * 128),
            modulationWheel: Math.floor(Math.random() * 128),
            name: 'random',
            pitchBendRange: Math.floor(Math.random() * 128)
        });
        for (let i = 0; i < 32; i++) {
            patchArr.push({
                curve: Math.floor(Math.random() * 128),
                cv1: {
                    amount: Math.floor(Math.random() * 128),
                    destination: Math.floor(Math.random() * 6)
                },
                cv2: {
                    amount: Math.floor(Math.random() * 128),
                    destination: Math.floor(Math.random() * 6)
                },
                envelope: {
                    attack: Math.floor(Math.random() * 128),
                    decay: Math.floor(Math.random() * 128),
                    release: Math.floor(Math.random() * 128),
                    sustain: Math.floor(Math.random() * 128)
                },
                lfo1: {
                    amount: Math.floor(Math.random() * 128),
                    destination: Math.floor(Math.random() * 6),
                    frequency: Math.floor(Math.random() * 128),
                    sync: Math.floor(Math.random() * 2),
                    waveform: Math.floor(Math.random() * 4)
                },
                lfo2: {
                    amount: Math.floor(Math.random() * 128),
                    destination: Math.floor(Math.random() * 6),
                    frequency: Math.floor(Math.random() * 128),
                    sync: Math.floor(Math.random() * 2),
                    waveform: Math.floor(Math.random() * 4)
                },
                params: {
                    cutoff: Math.floor(Math.random() * 128),
                    density: Math.floor(Math.random() * 128),
                    grainsize: Math.floor(Math.random() * 128),
                    panSpray: Math.floor(Math.random() * 128),
                    resonance: Math.floor(Math.random() * 128),
                    scan: Math.floor(Math.random() * 128),
                    scanSync: Math.floor(Math.random() * 2),
                    spray: Math.floor(Math.random() * 128),
                    tune: Math.floor(Math.random() * 128)
                },
                position: Math.floor(Math.random() * 128),
                resample: Math.floor(Math.random() * 2),
                sides: Math.floor(Math.random() * 128),
                tilt: Math.floor(Math.random() * 128),
                volume: Math.floor(Math.random() * 128)
            });
        }
        
        setGr1Parameters(patchArr);
        setPatchAltered(true);
        currentOutput.send([0xC0 | currentMidiChannel, globalParams.currentPatch]);
        bulkPatchSend();
        setCurrentPatchUuid('');
    }
    
    const getVisualOutput = (val) => {
        console.log(val);
    }
    
    const openSaveAsDialog = () => {
        setGr1ContainerState('_Inactive');
        setSaveAsDialogStatus('_Active');
        document.getElementById('saveAsInput').focus(); 
    }
    
    const updateChangeAsName = (val) => {
       setSaveAsName(val); 
    }
    
    const submitSaveAsDialog = () => {
        if (saveAsName === '') {
            return;
        } else {
            const patch = {
                user_uuid: user.uuid,
                globalParams: globalParams,
                gr1Parameters: {
                    patch: gr1Parameters
                }
            }
            patch.globalParams.name = saveAsName;
            axios.post(`/gr1_patches/patch`, patch)
            .then(() => {
                setSaveAsName('');
                setSaveAsDialogStatus('_Inactive'); 
                setGr1ContainerState('_Active');
            });
        }
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsName('');
        setSaveAsDialogStatus('_Inactive');
        setGr1ContainerState('_Active');   
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
    
    const [currentGrains, setCurrentGrains] = useState([
        {
            key: 1,
            size: Math.ceil(gr1Parameters[0].params.grainsize/20),
            x: -5,
            y: -5
        },
        {
            key: 2,
            size: Math.ceil(gr1Parameters[0].params.grainsize/20),
            x: -5,
            y: -5
        },
        {
            key: 3,
            size: Math.ceil(gr1Parameters[0].params.grainsize/20),
            x: -5,
            y: -5
        },
        {
            key: 4,
            size: Math.ceil(gr1Parameters[0].params.grainsize/20),
            x: -5,
            y: -5
        }
    ]);
    
    const updateCurrentMidiChannel = (val) => {
        setCurrentMidiChannel(val);
    }
    
    const savePatch = () => {
        const patch = {
            user_uuid: user.uuid,
            globalParams: globalParams,
            gr1Parameters: {
                patch: gr1Parameters
            }
        }
        
        if (currentPatchUuid === '') {
            axios.post(`/gr1_patches/patch`, patch)
            .then(responseData => {
                setCurrentPatchUuid(responseData.data[0].uuid);
                setPatchAltered(false);
            });
        } else {
            axios.patch(`/gr1_patches/patch/${currentPatchUuid}`, patch)
            .then(() => {
                setPatchAltered(false);
            });
        }
        
    }
    
    const revertPatch = () => {
        if (currentPatchUuid !== '') {
            axios.get(`/gr1_patches/patch/${currentPatchUuid}`)
            .then(patchData => {
                const patch = patchData.data;
                setGlobalParams(patch.globalParams);
                setGr1Parameters(patch.gr1Parameters.patch);
                if (currentOutput) {
                    currentOutput.send([0xC0 | currentMidiChannel, globalParams.currentPatch]);
                    bulkPatchSend();
                }
                setPatchAltered(false);
            });
        }
        
        setPatchAltered(false);
    }
    
    function bulkPatchSend() {
        currentOutput.send([0xB0 | currentMidiChannel, 0x01, globalParams.modulationWheel]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x02, gr1Parameters[globalParams.currentPatch].position]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x03, gr1Parameters[globalParams.currentPatch].params.density]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x04, gr1Parameters[globalParams.currentPatch].params.grainSize]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x05, gr1Parameters[globalParams.currentPatch].params.spray]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x07, gr1Parameters[globalParams.currentPatch].params.tune]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x08, gr1Parameters[globalParams.currentPatch].params.cutoff]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x09, gr1Parameters[globalParams.currentPatch].params.resonance]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0A, gr1Parameters[globalParams.currentPatch].params.panSpray]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0B, gr1Parameters[globalParams.currentPatch].params.scan]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0C, gr1Parameters[globalParams.currentPatch].sides]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0D, gr1Parameters[globalParams.currentPatch].tilt]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0E, gr1Parameters[globalParams.currentPatch].curve]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0F, gr1Parameters[globalParams.currentPatch].lfo1.waveform]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x10, gr1Parameters[globalParams.currentPatch].lfo2.waveform]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x11, gr1Parameters[globalParams.currentPatch].lfo1.frequency]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x12, gr1Parameters[globalParams.currentPatch].lfo1.amount]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x13, gr1Parameters[globalParams.currentPatch].lfo2.frequency]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x14, gr1Parameters[globalParams.currentPatch].lfo2.amount]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x15, gr1Parameters[globalParams.currentPatch].cv1.amount]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x16, gr1Parameters[globalParams.currentPatch].cv2.amount]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x17, gr1Parameters[globalParams.currentPatch].envelope.attack]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x18, gr1Parameters[globalParams.currentPatch].envelope.decay]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x19, gr1Parameters[globalParams.currentPatch].envelope.sustain]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1A, gr1Parameters[globalParams.currentPatch].envelope.release]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1B, gr1Parameters[globalParams.currentPatch].lfo1.destination]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1C, gr1Parameters[globalParams.currentPatch].lfo2.destination]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1D, gr1Parameters[globalParams.currentPatch].cv1.destination]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1E, gr1Parameters[globalParams.currentPatch].cv2.destination]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1F, gr1Parameters[globalParams.currentPatch].lfo1.sync]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x20, gr1Parameters[globalParams.currentPatch].lfo2.sync]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x21, gr1Parameters[globalParams.currentPatch].params.scanSync]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x24, gr1Parameters[globalParams.currentPatch].volume]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x25, gr1Parameters[globalParams.currentPatch].resample]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x27, globalParams.masterVolume]);
        currentOutput.send([0xB0 | currentMidiChannel, 0x3C, globalParams.pitchBendRange]);
    }
    
    function generateGrains() {
        let grains = [];
        let yDelta;
        const density = Math.floor((gr1Parameters[globalParams.currentPatch].params.density/127) * 1000);
        
        for (let i = 0; i < density; i++) {
            yDelta = Math.floor(Math.random() * Math.floor((gr1Parameters[globalParams.currentPatch].params.panSpray/127) * (parametersDisplayDimensions.height/2)));
            if (Math.floor(Math.random() * 2) === 1) {
               yDelta = yDelta * (-1); 
            }
            grains.push({
                key: i,
                size: Math.ceil(gr1Parameters[globalParams.currentPatch].params.grainsize/20),
                x: Math.floor(Math.random() * (((gr1Parameters[globalParams.currentPatch].params.spray/127) * (parametersDisplayDimensions.width/4)))) + ((((gr1Parameters[globalParams.currentPatch].position/127) * parametersDisplayDimensions.width) - (((gr1Parameters[globalParams.currentPatch].params.spray/127) * (parametersDisplayDimensions.width/4))/2))),
                y: Math.floor(parametersDisplayDimensions.height/2) + yDelta
            });
        }
        
        setCurrentGrains(grains);
    }

    const setEnvelopeDisplay = () => {
        setDisplayState({
            envelope: true,
            grain: false,
            lfo1: false,
            lfo2: false,
            parameters: false
        });
        setTimeout(() => {
            setEnvelopeDisplayDimensions({
                height: document.getElementById('gr1EnvelopeDisplayDiv').offsetHeight,
                width: document.getElementById('gr1EnvelopeDisplayDiv').offsetWidth
            });
            generateGrains();
        }, 100);
    }
    
    const setGrainDisplay = () => {
        setDisplayState({
            envelope: false,
            grain: true,
            lfo1: false,
            lfo2: false,
            parameters: false
        });
        setTimeout(() => {
            setGrainDisplayDimensions({
                height: document.getElementById('gr1GrainDisplayDiv').offsetHeight,
                width: document.getElementById('gr1GrainDisplayDiv').offsetWidth
            })
        }, 100);
        
    }
    
    const setParameterDisplay = () => {
        setDisplayState({
            envelope: false,
            grain: false,
            lfo1: false,
            lfo2: false,
            parameters: true
        });
        setTimeout(() => {
            setParametersDisplayDimensions({
                height: document.getElementById('gr1ParameterDisplayDiv').offsetHeight,
                width: document.getElementById('gr1ParameterDisplayDiv').offsetWidth
            });
        }, 100);
    }
    
    const setLFO1Display = () => {
        setDisplayState({
            envelope: false,
            grain: false,
            lfo1: true,
            lfo2: false,
            parameters: false
        });
    }
    
    const setLFO2Display = () => {
        setDisplayState({
            envelope: false,
            grain: false,
            lfo1: false,
            lfo2: true,
            parameters: false
        });
    }
    
    const clearDisplay = () => {
        setDisplayState({
            envelope: false,
            grain: false,
            lfo1: false,
            lfo2: false,
            parameters: false
        });
    }
    
    const updatePitchbendRange = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.pitchBendRange = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x3C, val]);
        setPatchAltered(true);
    }
    
    const updateModulation = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.modulationWheel = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x01, val]);
        setPatchAltered(true);
    }
    
    const updatePatchVolume = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].volume = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x24, val]);
        setPatchAltered(true);
    }
    
    const updateMasterVolume = (val) => {
        let deepCopy = {...globalParams};
        
        deepCopy.masterVolume = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x27, val]);
        setPatchAltered(true);
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
        currentOutput.send([0xB0 | currentMidiChannel, 0x25, gr1Parameters[globalParams.currentPatch].resample]);
        setPatchAltered(true);
    }
    
    const toggleLFO1KeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].lfo1.sync === 0) {
            deepCopy[globalParams.currentPatch].lfo1.sync = 1;
        } else {
            deepCopy[globalParams.currentPatch].lfo1.sync = 0;
        }
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1F, gr1Parameters[globalParams.currentPatch].lfo1.sync]);
        setPatchAltered(true);
    }
    
    const toggleLFO2KeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].lfo2.sync === 0) {
            deepCopy[globalParams.currentPatch].lfo2.sync = 1;
        } else {
            deepCopy[globalParams.currentPatch].lfo2.sync = 0;
        }
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x20, gr1Parameters[globalParams.currentPatch].lfo2.sync]);
        setPatchAltered(true);
    }
    
    const toggleScanKeySync = () => {
        let deepCopy = [...gr1Parameters];
        
        if (deepCopy[globalParams.currentPatch].params.scanSync === 0) {
            deepCopy[globalParams.currentPatch].params.scanSync = 1;
        } else {
            deepCopy[globalParams.currentPatch].params.scanSync = 0;
        }
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x21, gr1Parameters[globalParams.currentPatch].params.scanSync]);
        setPatchAltered(true);
    }
    
    const updateSamplePosition = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].position = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x02, val]);
        generateGrains();
        setPatchAltered(true);
    }
    
    const updateLFO1Frequency = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.frequency = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x11, val]);
        setPatchAltered(true);
    }
    
    const updateLFO2Frequency = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.frequency = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x13, val]);
        setPatchAltered(true);
    }
    
    const updateLFO1Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.amount = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x12, val]);
        setPatchAltered(true);
    }
    
    const updateLFO2Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.amount = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x14, gr1Parameters[globalParams.currentPatch].lfo2.amount]);
        setPatchAltered(true);
    }
    
    const updateLFO1Waveform = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.waveform = parseInt(val);
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0F, val]);
        setPatchAltered(true);
    }
    
    const updateLFO2Waveform = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.waveform = parseInt(val);
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x10, val]);
        setPatchAltered(true);
    }
    
    const updateLFO1Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo1.destination = parseInt(val);
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1B, val]);
        setPatchAltered(true);
    }
    
    const updateLFO2Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].lfo2.destination = parseInt(val);
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1C, val]);
        setPatchAltered(true);
    }
    
    const updateCV1Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv1.amount = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x15, val]);
        setPatchAltered(true);
    }
    
    const updateCV2Amount = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv2.amount = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x16, val]);
        setPatchAltered(true);
    }
    
    const updateCV1Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv1.destination = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1D, val]);
        setPatchAltered(true);
    }
    
    const updateCV2Destination = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].cv2.destination = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1E, val]);
        setPatchAltered(true);
    }
    
    const updateDensityValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.density = val;
        
        setGr1Parameters(deepCopy);
        generateGrains();
        setPatchAltered(true);
    }
    
    const updateGrainsizeValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.grainsize = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x03, val]);
        generateGrains();
        setPatchAltered(true);
    }
    
    const updateSprayValue = (val) => {
        console.log(currentGrains);
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.spray = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x05, val]);
        generateGrains();
        setPatchAltered(true);
    }
    
    const updateTuneValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.tune = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x07, val]);
        setPatchAltered(true);
    }
    
    const updateCutoffValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.cutoff = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x08, val]);
        setPatchAltered(true);
    }
    
    const updateResonanceValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.resonance = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x09, val]);
        setPatchAltered(true);
    }
    
    const updatePanSprayValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.panSpray = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x05, val]);
        generateGrains();
        setPatchAltered(true);
    }
    
    const updatePanScanValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].params.scan = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0B, val]);
        setPatchAltered(true);
    }
    
    const updateAttackValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.attack = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x17, val]);
        setPatchAltered(true);
    }
    
    const updateDecayValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.decay = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x18, val]);
        setPatchAltered(true);
    }
    
    const updateSustainValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.sustain = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x19, val]);
        setPatchAltered(true);
    }
    
    const updateReleaseValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].envelope.release = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x1A, val]);
        setPatchAltered(true);
    }
    
    const updateSidesValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].sides = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0C, val]);
        setPatchAltered(true);
    }
    
    const updateTiltValue = (val) => {
       let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].tilt = val;
        
        setGr1Parameters(deepCopy); 
        currentOutput.send([0xB0 | currentMidiChannel, 0x0D, val]);
        setPatchAltered(true);
    }
    
    const updateCurveValue = (val) => {
        let deepCopy = [...gr1Parameters];
        
        deepCopy[globalParams.currentPatch].curve = val;
        
        setGr1Parameters(deepCopy);
        currentOutput.send([0xB0 | currentMidiChannel, 0x0E, val]);
        setPatchAltered(true);
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
        let deepCopy = {...globalParams};

        deepCopy.name = val;
        
        setGlobalParams(deepCopy);
        setPatchAltered(true);
    }
    
    const changePatch = (val) => {
        let deepCopy = [...globalParams];
        
        deepCopy.currentPatch = val;
        
        setGlobalParams(deepCopy);
        currentOutput.send([0xC0 | currentMidiChannel, val]);
        setTimeout(() => {
           generateGrains(); 
        }, 450)
        
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
        setGr1ContainerState('_Inactive');
        for (let i = 0; i < availableOutputs.length; i++) {
            for (let channel = 0; channel < 16; channel++) {
                for (let note = 0; note < 128; note++) {
                    availableOutputs[i].send([0x80 | channel, note, 0x7f]);
                }
            }
        }
        setTimeout(() => {
            setPanicState('gr1PanicOff');
            setGr1ContainerState('_Active');
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
    
    function leftSideValue() {

        let leftSide = 0;
        const tilt = (gr1Parameters[globalParams.currentPatch].tilt/127) * grainDisplayDimensions.width;
        const sides = (gr1Parameters[globalParams.currentPatch].sides/127) * (grainDisplayDimensions.width/2);
        if (sides < tilt) {
            leftSide = tilt - sides;
        }
        
        return leftSide;
    }
    
    function curveValue() {
        const curve = grainDisplayDimensions.height - ((gr1Parameters[globalParams.currentPatch].curve/127) * (grainDisplayDimensions.height));
        
        return curve;
    }
    
    function leftSideCurveValue() {
        const left = parseFloat(leftSideValue());
        const curve = parseFloat(curveValue);
        
        if (gr1Parameters[globalParams.currentPatch].curve < 32) {
            return((left*3)/4);
        } else if (gr1Parameters[globalParams.currentPatch].curve < 96) {
            return(left/2);
        } else {
            return(left/4);
        }
    }
    
    function rightSideValue() {
        let rightSide = grainDisplayDimensions.width;
        const tilt = (gr1Parameters[globalParams.currentPatch].tilt/127) * grainDisplayDimensions.width;
        const sides = (gr1Parameters[globalParams.currentPatch].sides/127) * (grainDisplayDimensions.width/2);
        if ((grainDisplayDimensions.width - tilt) > sides) {
            rightSide = tilt + sides;
        }
        
        return rightSide;
    }
    
    function rightSideCurveValue() {
        const right = parseFloat(rightSideValue());
        const curve = parseFloat(curveValue);
        
        if (gr1Parameters[globalParams.currentPatch].curve < 32) {
            return(right + ((grainDisplayDimensions.width - right)/4));
        } else if (gr1Parameters[globalParams.currentPatch].curve < 96) {
            return(right + ((grainDisplayDimensions.width - right)/2));
        } else {
            return(right + (((grainDisplayDimensions.width - right)*3)/4));
        }
    }
    
    function tiltValue() {
        return((gr1Parameters[globalParams.currentPatch].tilt/127) * grainDisplayDimensions.width);
    }
    
    function attackValue() {
        let max = envelopeDisplayDimensions.width / 4;
        
        return((gr1Parameters[globalParams.currentPatch].envelope.attack/127) * max);
    }
    
    function decayValue() {
        let max = envelopeDisplayDimensions.width / 4;
        
        return(((gr1Parameters[globalParams.currentPatch].envelope.decay/127) * max) + attackValue());
    }
    
    function sustainValue() {
        let max = envelopeDisplayDimensions.height - 20;
        
        return((max - (gr1Parameters[globalParams.currentPatch].envelope.sustain/127) * max));
    }
    
    function releaseValue() {
        let max = envelopeDisplayDimensions.width / 3;
        
        return(envelopeDisplayDimensions.width - ((gr1Parameters[globalParams.currentPatch].envelope.release/127) * max));
    }
    
    function getAnimationString() {
        const baseTime = 2;
        let multiplier = 0;
        let anim = '';
        let timer = 0;
//        let anim = 'scanRight 5s infinite';
        if (gr1Parameters[globalParams.currentPatch].params.scan > 63) {
            anim += 'scanRight ';
            multiplier = 1/((gr1Parameters[globalParams.currentPatch].params.scan - 63)/63);
            timer = baseTime * multiplier;
            anim += timer.toString() + 's linear infinite';
        } else if (gr1Parameters[globalParams.currentPatch].params.scan < 63) {
            anim += 'scanLeft ';
            multiplier = ((gr1Parameters[globalParams.currentPatch].params.scan)/63);
            timer = baseTime * multiplier * 10;
            anim += timer.toString() + 's linear infinite';
        } else {
            anim = 'none';
        }
        
        return anim;
    }
    
    const loadModalOn = () => {
        setGr1LoadModalState('_Active');
        setGr1ContainerState('_Inactive');
        axios.get(`/gr1_patches/byuser/${user.uuid}`)
        .then(patchesData => {
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
            let loadUuid = null;
            if (patchesData.data.length > 0) {
                loadUuid = patchesData.data[0].uuid;
            }
            setLoadPatchUuid(loadUuid);
        });
    }
    
    const resetLoadPatchUuid = (val) => {
        setLoadPatchUuid(val);
    }
    
    const cancelPatchLoad = () => {
        setGr1LoadModalState('_Inactive');
        setGr1ContainerState('_Active');
    }
    
    const loadSelectedPatch = () => {
        axios.get(`/gr1_patches/patch/${loadPatchUuid}`)
        .then(patchData => {
            const patch = patchData.data;
            setGlobalParams(patch.globalParams);
            setGr1Parameters(patch.gr1Parameters.patch);
            if (currentOutput) {
                currentOutput.send([0xC0 | currentMidiChannel, globalParams.currentPatch]);
                bulkPatchSend();
            }
            setCurrentPatchUuid(loadPatchUuid);
            setPatchAltered(false);
            cancelPatchLoad();
        });
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
                    <button className={'gr1LoadButton' + gr1Month}
                        onClick={() => loadModalOn()}>load</button>
                    <input className={'gr1PatchNameInput' + gr1Month}
                        onChange={(e) => patchNameUpdate(e.target.value)}
                        type="text"
                        value={globalParams.name}/>
                    <button className={'gr1PanicButton' + gr1Month}
                        onClick={() => panic()}>panic!</button>
                    <div className={'gr1SidebarManager' + gr1Month}>
                        <div className={'gr1SidebarContainer' + gr1Month}>
                            <img className={'gr1Image1' + gr1Month}
                                src={"https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/tastychipselectronics_gr-1_01.jpg"} />
                            <button className={'gr1SaveButton' + patchAltered + gr1Month}
                                onClick={() => savePatch()}>save</button>
                            <button className={'gr1SaveAsButton' + gr1Month}
                                onClick={() => openSaveAsDialog()}>save as...</button>
                            <button className={'gr1RevertButton' + patchAltered + gr1Month}
                                onClick={() => revertPatch()}>revert</button>
                            <p className={'gr1MidiOutputLabel' + gr1Month}>midi output:</p>
                            <select className={'gr1MidiOutputSelect' + gr1Month}
                                onChange={(e) => updateCurrentOutput(e.target.value)}
                                value={getVisualOutput(currentOutput)}>
                                {availableOutputs.map(out => (
                                <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <p className={'gr1MidiChannelLabel' + gr1Month}>channel:</p>
                            <input className={'gr1MidiChannelInput' + gr1Month}
                                max="15"
                                min="0"
                                onChange={(e) => updateCurrentMidiChannel(parseInt(e.target.value))}
                                step="1"
                                type="number"
                                value={currentMidiChannel}/>
                            <button className={'gr1InitButton' + gr1Month}
                                onClick={() => initPatch()}>init</button>
                            <button className={'gr1RandomButton' + gr1Month}
                                onClick={() => makeRandomPatch()}>random</button>
                            <button className={'aboutGR1Button' + gr1Month}
                                onClick={() => openGR1AboutDiv()}>about</button>
                        </div>
                    </div>
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
                    <div className={'gr1DisplayPane' + gr1Month}>
                        {(displayState.grain) && (
                            <div className={'gr1GrainDisplayDiv' + gr1Month}
                                id="gr1GrainDisplayDiv">
                                <svg height="100%"
                                    width="100%">
                                    <line className={'gr1GrainEditDisplayBaseLine' + gr1Month}
                                        x1={0}
                                        y1={grainDisplayDimensions.height}
                                        x2={grainDisplayDimensions.width}
                                        y2={grainDisplayDimensions.height}>
                                    </line> 
                                    
                                    <path className={'gr1GrainEditDisplayPath' + gr1Month}
                                        d={"M 0 " + grainDisplayDimensions.height.toString() + " C 0 " + grainDisplayDimensions.height.toString() + " " + leftSideCurveValue() + " " + curveValue() + " " + leftSideValue() + " 20"}>
                                    </path>
                                    
                                    <line className={'gr1GrainEditDisplayPath' + gr1Month}
                                        x1={leftSideValue()}
                                        y1={20}
                                        x2={rightSideValue()}
                                        y2={20}>
                                    </line>
                                   
                                    <path className={'gr1GrainEditDisplayPath' + gr1Month}
                                        d={"M " + rightSideValue().toString() + " 20 C " + rightSideValue().toString()  + " 20 " + rightSideCurveValue().toString() + " " + curveValue().toString() + " " + grainDisplayDimensions.width.toString() + " " + grainDisplayDimensions.height.toString()}>
                                    </path>
                                </svg>
                            </div>
                        )}
                        {(displayState.envelope) && (
                            <div className={'gr1EnvelopeDisplayDiv' + gr1Month}
                                id="gr1EnvelopeDisplayDiv">
                                <svg height="100%"
                                    width="100%">
                                    <line className={'gr1EnvelopeEditDisplayPath' + gr1Month}
                                        x1={0}
                                        y1={envelopeDisplayDimensions.height}
                                        x2={attackValue()}
                                        y2={20}>
                                    </line>
                                    <path className={'gr1EnvelopeEditDisplayPath' + gr1Month}
                                        d={"M " + attackValue() + " 20 C " + attackValue() + " 20 " + (decayValue() - ((decayValue() - attackValue())/4)*3) + " " + sustainValue() + " " + decayValue() + " " + sustainValue()}>
                                    </path>
                                    <line className={'gr1EnvelopeEditDisplayPath' + gr1Month}
                                        x1={decayValue()}
                                        y1={sustainValue()}
                                        x2={releaseValue()}
                                        y2={sustainValue()}>
                                    </line>
                                    <path className={'gr1EnvelopeEditDisplayPath' + gr1Month}
                                        d={"M " + releaseValue() + " " + sustainValue() + " C " + releaseValue() + " " + sustainValue() + " " + (envelopeDisplayDimensions.width - ((envelopeDisplayDimensions.width - releaseValue())/2)) + " " + envelopeDisplayDimensions.height + " " + envelopeDisplayDimensions.width + " " + envelopeDisplayDimensions.height}>
                                    </path>
                                </svg>
                            </div>
                        )}
                        {(displayState.parameters) && (
                            <div className={'gr1ParameterDisplayDiv' + gr1Month}
                                id="gr1ParameterDisplayDiv">
                                <svg height="100%"
                                    style={{position: "relative" }}
                                    width="100%">
                                    <rect className={'gr1SprayRange' + gr1Month}
                                        height={parametersDisplayDimensions.height + 10}
                                        width={((gr1Parameters[globalParams.currentPatch].params.spray/127) * (parametersDisplayDimensions.width/4))}
                                        x={(((gr1Parameters[globalParams.currentPatch].position/127) * parametersDisplayDimensions.width) - (((gr1Parameters[globalParams.currentPatch].params.spray/127) * (parametersDisplayDimensions.width/4))/2))}
                                        y={-5}>
                                    </rect>
                                    <line className={'gr1PositionLine' + gr1Month}
                                        x1={((gr1Parameters[globalParams.currentPatch].position/127) * parametersDisplayDimensions.width)}
                                        y1={0}
                                        x2={((gr1Parameters[globalParams.currentPatch].position/127) * parametersDisplayDimensions.width)}
                                        y2={parametersDisplayDimensions.height}>
                                    </line>
                                    {currentGrains.map(grain => (
                                        <rect key={grain.key}
                                            height={2}
                                            width={grain.size}
                                            x={grain.x}
                                            y={grain.y}>
                                        </rect>
                                    ))}
                                </svg>
                                <div className={'gr1Scanline' + gr1Month}
                                    style={{ animation: getAnimationString(), animationTimingFunction: 'linear' }}></div>
                                
                            </div>
                        )}
                        {(displayState.lfo1) && (
                            <div className={'gr1DisplayLFO1' + gr1Month}>
                                {(gr1Parameters[globalParams.currentPatch].lfo1.waveform === 0) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/sine.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo1.waveform === 1) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/random.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo1.waveform === 2) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/saw.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo1.waveform === 3) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/square.png"}/>
                                )}
                            </div>
                        )}
                        {(displayState.lfo2) && (
                            <div className={'gr1DisplayLFO1' + gr1Month}>
                                {(gr1Parameters[globalParams.currentPatch].lfo2.waveform === 0) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/sine.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo2.waveform === 1) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/random.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo2.waveform === 2) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/saw.png"}/>
                                )}
                                {(gr1Parameters[globalParams.currentPatch].lfo2.waveform === 3) && (
                                    <img className={'gr1LfoWaveformDisplayImage' + gr1Month}
                                        src={"https://events-168-hurdaudio.s3.amazonaws.com/gr1-editor/square.png"}/>
                                )}
                            </div>
                        )}
                    </div>
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
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.grainEditor + gr1Month}
                                onMouseDown={() => setGrainDisplay()}>
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
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.envelopeEditor + gr1Month}
                                onMouseDown={() => setEnvelopeDisplay()}>
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
                            <div className={'gr1GrainEditorPane' + granularEditorPaneState.parametersEditor + gr1Month}
                                onMouseDown={() => setParameterDisplay()}>
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
                    <div className={'gr1SamplePositionPane' + gr1Month}
                        onMouseDown={() => setParameterDisplay()}>
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
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.lfo1 + gr1Month}
                                onMouseDown={() => setLFO1Display()}>
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
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.lfo2 + gr1Month}
                                onMouseDown={() => setLFO2Display()}>
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
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.vc1 + gr1Month}
                                onMouseDown={() => clearDisplay()}>
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
                            <div className={'gr1LfoVcEditSpace' + lfoVCEditorPaneState.vc2 + gr1Month}
                                onMouseDown={() => clearDisplay()}>
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
            <div className={'gr1SaveAsDialogDiv' + saveAsDialogStatus + gr1Month}>
                <p>save as</p>
                <input className={'gr1SaveAsInput' + gr1Month}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + globalParams.name}
                    value={saveAsName} />
                <div className={'gr1SaveAsButtonsDiv' + gr1Month}>
                    <button className={'gr1SaveAsButtons' + gr1Month}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'gr1SaveAsButtons' + gr1Month}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'aboutTheTastyChipsGR1Div' + aboutGR1DivState + gr1Month}>
                <div className={'aboutTheGR1Content' + gr1Month}>
                    <img className={'gr1AboutImg' + gr1Month}
                        src={"https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/tastychipselectronics_gr-1_01.jpg"} />
                    <h2>Tasty Chips GR-1</h2>
                    <p>The Tasty Chips GR-1 offers perhaps the first truly intuitive, approachable interface for granular synthesis in hardware format. With dedicated controls for all common granular synthesis parameters and a crisp display with clever and clear visual feedback, the GR-1 makes in-depth granular synthesis easy.</p>
                    <p>Offering 16 voices of polyphony with a maximum of 128 grains per voice, the GR-1 is equally at home in context as a source of sonorous ambience, glitched-out gestural textures, cinematic sound design, and far more. Latching "play" buttons for four independent voices as well as MIDI input offer multiple modes of interaction, while built-in LFOs and control voltage inputs allow extensive automation of internal parameters. Dedicated controls for grain position, density, size, pitch, scan rate, window shape, position randomization, and panning randomization make deep granular manipulation easily accessible. A 7" display makes the implications of all controls visible, making the otherwise obtuse methods of granular synthesis far more obvious than any previous hardware.</p>
                    <p>It seems strange to say that granular synthesis can be intuitive—but Tasty Chips Electronics has made it possible. The GR-1 might be the best hardware granular synthesizer to date.</p>
                    <h3>GR-1 Features</h3>
                    <p>16 voice granular synthesizer with max. 128 grains per voice<br />
                        Awesome giant slider for grain position selection<br />
                        Dedicated scan function for timestretching &amp; time compression effects<br />
                        Dedicated controls for all typical granular parameters, including grain playback pitch (speed), window size, density, position<br />
                        Per-grain position randomization (spray) and panning randomization (pan spray)<br />
                        All primary parameters can be modulated via internal variable-shape LFOs or external control voltages<br />
                        Grain envelope shape with tilt, curve, and "sides" control<br />
                        ADSR envelope per voice <br />
                        Standalone and MIDI-capable<br />
                        4 banks of 8 presets (patches) are part of each Performance<br />
                        4GB internal memory for presets and performances<br />
                        4 USB ports for sample transfer, audio interfaces, and more<br />
                        Configuration menus offer extended control beyond front-panel access</p>
                    <h3>Granular Synthesis</h3>
                    <p>Granular synthesis is a basic sound synthesis method that operates on the microsound time scale.</p>
                    <p>It is based on the same principle as sampling. However, the samples are not played back conventionally, but are instead split into small pieces of around 1 to 50 ms. These small pieces are called grains. Multiple grains may be layered on top of each other, and may play at different speeds, phases, volume, and frequency, among other parameters.</p>
                    <p>At low speeds of playback, the result is a kind of soundscape, often described as a cloud, that is manipulatable in a manner unlike that for natural sound sampling or other synthesis techniques. At high speeds, the result is heard as a note or notes of a novel timbre. By varying the waveform, envelope, duration, spatial position, and density of the grains, many different sounds can be produced.</p>
                    <p>Both have been used for musical purposes: as sound effects, raw material for further processing by other synthesis or digital signal processing effects, or as complete musical works in their own right. Conventional effects that can be achieved include amplitude modulation and time stretching. More experimentally, stereo or multichannel scattering, random reordering, disintegration and morphing are possible.</p>
                    <h3>History</h3>
                    <p>Greek composer Iannis Xenakis is known as the inventor of the granular synthesis technique.</p>
                    <p style={{margin: "10px 35px"}}>The composer Iannis Xenakis (1960) was the first to explicate a compositional theory for grains of sound. He began by adopting the following lemma: "All sound, even continuous musical variation, is conceived as an assemblage of a large number of elementary sounds adequately disposed in time. In the attack, body, and decline of a complex sound, thousands of pure sounds appear in a more or less short interval of time Delta t." Xenakis created granular sounds using analog tone generators and tape splicing. These appear in the composition Analogique A-B for string orchestra and tape (1959).</p>
                    <p>Canadian composer Barry Truax was one of the first to implement real-time versions of this synthesis technique. "Granular synthesis has been implemented in different ways, notably by the Canadian composer Barry Truax."</p>
                    
                </div>
                <div className={'gr1SaveAsButtonsDiv' + gr1Month}>
                    <button className={'gr1SaveAsButtons' + gr1Month}
                        onClick={() => closeGR1AboutDiv()}>close</button>
                </div>
            </div>
            <div className={panicState + gr1Month}>
                <img src={currentSpinner} />
            </div>
            <div className={'gr1LoadModal' + gr1LoadModalState + gr1Month}>
                <div className={'gr1LoadContainer' + gr1Month}>
                    <p className={'gr1LoadTitle' + gr1Month}>Load GR-1 Patch</p>
                    <select className={'gr1LoadSelector' + gr1Month}
                        onChange={(e) => resetLoadPatchUuid(e.target.value)}
                        value={loadPatchUuid}>
                        {userPatches.map(patch => (
                            <option key={patch.uuid} value={patch.uuid}>{patch.globalParams.name}</option>))}
                    </select>
                    <button className={'gr1LoadLoadButton' + gr1Month}
                        onClick={() => loadSelectedPatch()}>load</button>
                    <button className={'gr1LoadCancelButton' + gr1Month}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
        </div>
        );
}


export default Gr1Editor;
