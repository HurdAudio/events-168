import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midiConnection from '../midiManager/midiConnection';
import './stepSequencer.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import quarterNote from '../img/quarterNote.png';
import dottedQuarter from '../img/dottedQuarter.png';
import halfNote from '../img/halfNote.png';
import dottedHalfNote from '../img/dottedHalfNote.png';
import wholeNote from '../img/wholeNote.png';
import dottedWholeNote from '../img/dottedWholeNote.png';
import doubleWholeNote from '../img/doubleWholeNote.png';
import oneHundredTwentyEighthNote from '../img/oneHundredTwentyEighthNote.png';
import sixtyfourthNote from '../img/sixtyfourthNote.png';
import thirtySecondNote from '../img/thirtySecondNote.png';
import sixteenthNote from '../img/sixteenthNote.png';
import eighthNote from '../img/eighthNote.png';
import home from '../img/home.svg';
import playButton from '../img/playButton.png';
import pauseButton from '../img/pauseButton.png';
import backward from '../img/backward.png';
import forward from '../img/forward.png';
import axios from 'axios';
import AvailableDevices from '../midiManager/availableDevices';


function StepSequencer(user, seq) {
    
    let beatDigits;
    let userOutputs;
    
    const beatResolution = parseInt(user.clock_resolution);
    if (beatResolution > 99999) {
        beatDigits = 6;
    } else if (beatResolution > 9999) {
        beatDigits = 5;
    } else if (beatResolution > 999) {
        beatDigits = 4;
    } else if (beatResolution > 99) {
        beatDigits = 3;
    } else if (beatResolution > 9) {
        beatDigits = 2;
    } else {
        beatDigits = 1;
    }
    console.log(user.midi_connections);
    if (user.midi_connections) {
        userOutputs = user.midi_connections.outputs;
    } else {
        userOutputs = [];
    }
    
    const [availableDevices, setAvailableDevices] = useState(AvailableDevices());
    const [stepSequenceMonth, setStepSequenceMonth] = useState('_JanuaryA');
    const [stepSequencerState, setStepSequencerState] = useState('_Active');
    const [rudeSolo, setRudeSolo] = useState(false);
    const [midiOutputs, setMidiOutputs] = useState(userOutputs);
    const [stepInterval, setStepInterval] = useState({
        intervalTicks: 960,
        note: 'quarter'
    });
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [playState, setPlayState] = useState(false);
    const [sequence, setSequence] = useState({
        duration: {
            bar: 25,
            beat: 1,
            ticks: 0
        },
        header: {
            author: user.uuid,
            name: 'seq 1'
        },
        tracks: [
            {
                active: true,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [],
                id: 0,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track01',
                output: '-977315806',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            },
            {
                active: false,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [],
                id: 1,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track02',
                output: '43172242',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            },
            {
                active: false,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [],
                id: 2,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track03',
                output: '-1706185039',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            }
        ]
    });
    const [activeTrack, setActiveTrack] = useState(sequence.tracks[0].id);
    const [currentPosition, setCurrentPosition] = useState({
        measure: {
            bar: parseInt(1),
            beat: parseInt(1),
            ticks: parseInt(0)
        }
    });
    const [homePosition, setHomePosition] = useState({
        measure: {
            bar: parseInt(1),
            beat: parseInt(1),
            ticks: parseInt(0)
        }
    });
    const [tempoTrack, setTempoTrack] = useState({
        tick: [
            {
                bar: 1,
                beat: 1,
                cumulativeTime: 0,
                index: 0,
                ticks: 0,
                meterNumerator: 4,
                meterDenominator: 4,
                tempo: 120,
                tempoBase: 'quarter'
            },
            {
                bar: 9,
                beat: 1,
                cumulativeTime: 16000,
                index: 1,
                ticks: 0,
                meterChange: true,
                meterNumerator: 3,
                meterDenominator: 4,
                tempo: 120,
                tempoBase: 'quarter',
                tempoChange: false
            },
            {
                bar: 15,
                beat: 1,
                cumulativeTime: 28000,
                index: 2,
                ticks: 0,
                meterChange: false,
                meterNumerator: 3,
                meterDenominator: 4,
                tempo: 60,
                tempoBase: 'quarter',
                tempoChange: true
            },
            {
                bar: 25,
                beat: 1,
                cumulativeTime: 58000,
                index: 3,
                ticks: 0,
                meterChange: false,
                meterNumerator: 1,
                meterDenominator: 1,
                tempo: null,
                tempoBase: null,
                tempoChange: false
            }
        ]
    });
    const [currentMeter, setCurrentMeter] = useState({
        numerator: parseInt(4),
        denominator: parseInt(4)
    });
    const [currentTempo, setCurrentTempo] = useState({
        tempo: 120,
        tempoBase: 'quarter'
    });
    const [currentClockPosition, setCurrentClockPosition] = useState('0:00.000');
    
    const playSequence = () => {
        setPlayState(true);
    }
    
    const stopSequence = () => {
        setPlayState(false);
    }
    
    const sendToHomePosition = () => {
        let deepCopy = {...homePosition};
        let deepCurrent = {...currentPosition};
        let index = 0;
        let exitCondition = false;
        
        while(!exitCondition){
            if (positionEqualTo(deepCopy.measure, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], deepCopy.measure)) && (positionGreaterThan(deepCopy.measure, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        
        deepCurrent = {
            measure: {
                bar: deepCopy.measure.bar,
                beat: deepCopy.measure.beat,
                ticks: deepCopy.measure.ticks
            }
        };
        setCurrentPosition(deepCurrent);
        setCurrentTempo({
            tempo: tempoTrack.tick[index].tempo,
            tempoBase: tempoTrack.tick[index].tempoBase
        });
        setCurrentMeter({
            numerator: tempoTrack.tick[index].meterNumerator,
            denominator: tempoTrack.tick[index].meterDenominator
        });
        setCurrentClockPosition(calculateTimeString({bar: deepCopy.measure.bar, beat: deepCopy.measure.beat, ticks: deepCopy.measure.ticks}));
    }
    
    const sortTempoTrack = () => {
        let deepCopy = {...tempoTrack};
        
        deepCopy.tick = deepCopy.tick.sort((a, b) => {
            if (a.bar < b.bar) {
                return -1;
            } else if (a.bar > b.bar) {
                return 1;
            } else {
                if (a.beat < b.beat) {
                    return -1;
                } else if (a.beat > b.beat) {
                    return 1;
                } else {
                    if (a.ticks < b.ticks) {
                        return -1;
                    } else if (a.ticks > b.ticks) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });
        
        for (let i = 1; i < deepCopy.tick.length; i++) {
            deepCopy.tick[i].index = i;
            if (deepCopy.tick[i].meterChange) {
                deepCopy.tick[i].tempo = deepCopy.tick[i - 1].tempo;
                deepCopy.tick[i].tempoBase = deepCopy.tick[i - 1].tempoBase;
            }
            if (deepCopy.tick[i].tempoChange) {
                deepCopy.tick[i].meterNumerator = deepCopy.tick[i - 1].meterNumerator;
                deepCopy.tick[i].meterDenominator = deepCopy.tick[i - 1].meterDenominator;
            }
        }
        
        setTempoTrack(deepCopy);
    }
    
    const meterAtPosition = (position) => {
        let index = 0;
        let meter = {};
        let exitCondition = false;
        
        if ((parseInt(position.bar) === 1) || (parseInt(position.bar) === 0)) {
            return {
                meterNumerator: tempoTrack.tick[0].meterNumerator,
                meterDenominator: tempoTrack.tick[0].meterDenominator
            };
        }
        
        while(!exitCondition){
            if (positionEqualTo(position, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], position)) && (positionGreaterThan(position, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        meter.meterNumerator = tempoTrack.tick[index].meterNumerator;
        meter.meterDenominator = tempoTrack.tick[index].meterDenominator;
        
        return meter;
    }
    
    const getTotalTicks = (denominator) => {
        let total = parseInt(user.clock_resolution);
        
        switch(denominator) {
            case(1):
                total = total * 4;
                break;
            case(2):
                total = total * 2;
                break;
            case(4):
                total = total;
                break;
            case(8):
                total = total / 2;
                break;
            case(16):
                total = total / 4;
                break;
            case(32):
                total = total / 8;
                break;
            case(64):
                total = total / 16;
                break;
            case(128):
                total = total / 32;
                break;
            default:
                alert('ERROR: Faulty meter denominator');
        }
        
        return total;
    }
    
    const updateTempoEventTempoBase = (currentBase, index) => {
        let deepCopy = {...tempoTrack};
        
        switch(currentBase) {
            case('dottedEighthNote'):
                deepCopy.tick[index].tempoBase = 'quarter';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCopy.tick[index].tempoBase = 'wholeNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.tick[index].tempoBase = 'sixtyFourthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCopy.tick[index].tempoBase = 'halfNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCopy.tick[index].tempoBase = 'eighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.tick[index].tempoBase = 'thirtySecondNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCopy.tick[index].tempoBase = 'sixteenthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCopy.tick[index].tempoBase = 'doubleWholeNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCopy.tick[index].tempoBase = 'oneHundredTwentyEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 256);
                break;
            case('eighthNote'):
                deepCopy.tick[index].tempoBase = 'dottedEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCopy.tick[index].tempoBase = 'dottedHalf';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.tick[index].tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCopy.tick[index].tempoBase = 'dottedQuarter';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCopy.tick[index].tempoBase = 'dottedSixteenthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCopy.tick[index].tempoBase = 'dottedSixtyFourthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCopy.tick[index].tempoBase = 'dottedThirtySecondNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCopy.tick[index].tempoBase = 'dottedWhole';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setTempoTrack(deepCopy);
    }
    
    const addTempoChangeEvent = () => {
        let deepCopy = {...tempoTrack};
        let deepPosition = {...currentPosition};
        let check;
        
        if ((parseInt(deepPosition.measure.bar) === 1) && (parseInt(deepPosition.measure.beat === 1)) && (parseInt(deepPosition.measure.ticks === 0))) {
            deepPosition.measure.ticks = 1;
            
        } else if (parseInt(deepPosition.measure.bar) === parseInt(sequence.duration.bar)) {
            deepPosition.measure.bar = parseInt(sequence.duration.bar) - 1;
            
        }
        deepCopy.tick.push({
            bar: parseInt(deepPosition.measure.bar),
            beat: parseInt(deepPosition.measure.beat),
            cumulativeTime: 0,
            ticks: parseInt(deepPosition.measure.ticks),
            meterChange: false,
            meterNumerator: currentMeter.numerator,
            meterDenominator: currentMeter.denominator,
            tempo: parseFloat(currentTempo.tempo),
            tempoBase: currentTempo.tempoBase,
            tempoChange: true
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();
        recalculateTempoTrack();
        setCurrentPosition(deepPosition);
        setCurrentClockPosition(calculateTimeString({bar: deepPosition.measure.bar, beat: deepPosition.measure.beat, ticks: deepPosition.measure.ticks}));
    }
    
    const addMeterEvent = () => {
        let deepCopy = {...tempoTrack};
        let deepPosition = {...currentPosition};
        let check;
        
        if (parseInt(deepPosition.measure.bar) === 1) {
            deepPosition.measure.bar = 2;
            
        } else if (parseInt(deepPosition.measure.bar) === parseInt(sequence.duration.bar)) {
            deepPosition.measure.bar = parseInt(sequence.duration.bar) - 1;
            
        }
        deepCopy.tick.push({
            bar: parseInt(deepPosition.measure.bar),
            beat: 1,
            cumulativeTime: 0,
            ticks: 0,
            meterChange: true,
            meterNumerator: currentMeter.numerator,
            meterDenominator: currentMeter.denominator,
            tempo: parseFloat(currentTempo.tempo),
            tempoBase: currentTempo.tempoBase,
            tempoChange: false
        });
        deepPosition.measure.beat = 1;
        deepPosition.measure.ticks = 0;
        setTempoTrack(deepCopy);
        sortTempoTrack();
        recalculateTempoTrack();
        setCurrentPosition(deepPosition);
        setCurrentClockPosition(calculateTimeString({bar: deepPosition.measure.bar, beat: 1, ticks: 0}));
    }
    
    const removeTempoTrackEvent = (index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick.splice(index, 1);
        bar = 1;
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition('0:00.000');
    }
    
    const updateTempoEventTempo = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick[index].tempo = val;
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventMeterDenominator = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        if (parseInt(val) < parseInt(deepCopy.tick[index].meterDenominator)) {
            if (parseInt(deepCopy.tick[index].meterDenominator) === 1) {
                return;
            }
            deepCopy.tick[index].meterDenominator = parseInt(deepCopy.tick[index].meterDenominator) / 2;
        } else {
            if (parseInt(deepCopy.tick[index].meterDenominator) === 128) {
                return;
            }
            deepCopy.tick[index].meterDenominator = parseInt(deepCopy.tick[index].meterDenominator) * 2;
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventMeterNumerator = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick[index].meterNumerator = parseInt(val);
        bar = parseInt(deepCopy.tick[index].bar);
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventTicks = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        let meter = meterAtPosition(tempoTrack.tick[index]);
        let meter2 = meterAtPosition({bar: parseInt(tempoTrack.tick[index].bar - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.tick[index].beat) === 1) {
                if (parseInt(deepCopy.tick[index].bar) === 2) {
                    return;
                }
                deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) - 1;
                deepCopy.tick[index].beat = parseInt(meter2.meterNumerator);
                deepCopy.tick[index].ticks = parseInt(getTotalTicks(meter2.meterDenominator) - 1);
            } else {
                deepCopy.tick[index].beat = parseInt(deepCopy.tick[index].beat) - 1;
                deepCopy.tick[index].ticks = parseInt(getTotalTicks(meter2.meterDenominator) - 1);
            }
        } else if (parseInt(val) > (getTotalTicks(meter.meterDenominator) - 1)) {
            if (parseInt(deepCopy.tick[index].beat) === parseInt(meter.numerator)) {
                if (parseInt(deepCopy.tick[index].bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) + 1;
                deepCopy.tick[index].beat = 1;
                deepCopy.tick[index].ticks = 0;
            } else {
                deepCopy.tick[index].beat = parseInt(deepCopy.tick[index].beat) + 1;
                deepCopy.tick[index].ticks = 0;
            }
        } else {
            deepCopy.tick[index].ticks = parseInt(val);
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventBeat = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        let meter = meterAtPosition(tempoTrack.tick[index]);
        let meter2 = meterAtPosition({bar: parseInt(tempoTrack.tick[index].bar - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) === 0) {
            if (parseInt(deepCopy.tick[index].bar) === 1) {
                return;
            }
            deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) - 1;
            deepCopy.tick[index].beat = parseInt(meter2.meterNumerator);
            deepCopy.tick[index].ticks = 0;
        } else if (parseInt(val) === 1){
            if (parseInt(deepCopy.tick[index].bar) === 1) {
                return;
            }
            deepCopy.tick[index].beat = 1;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.tick[index].bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) + 1;
            deepCopy.tick[index].beat = 1;
            deepCopy.tick[index].ticks = 0;
        } else {
            deepCopy.tick[index].beat = parseInt(val);
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventBar = (val, index) => {
        let deepCopy = {...tempoTrack};
        let deepSequence = {...sequence};
        let bar, beat, ticks;
        
        if ((parseInt(val) === 1) || (parseInt(val) === parseInt(sequence.duration.bar))) {
            return;
        }
        if (parseInt(index) === (deepCopy.tick.length - 1)) {
            if (parseInt(val) < (parseInt(deepCopy.tick[index - 1].bar) + 1)) {
                return;
            }
            deepSequence.duration.bar = val;
        } else {
            if (val > deepSequence.duration.bar) {
                return;
            }
        }
        deepCopy.tick[index].bar = parseInt(val);
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        
        setTempoTrack(deepCopy);
        setSequence(deepSequence);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
        
    }
    
    const tempoBeatValue = (tempoObj) => {
        let tempo = parseFloat(tempoObj.tempo);
        
        switch(tempoObj.tempoBase) {
             case('dottedEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = ((tempo * 3) / 16);
                        break;
                    case(2):
                        tempo = ((tempo * 3) / 8);
                        break;
                    case(4):
                        tempo = ((tempo * 3) / 4);
                        break;
                    case(8):
                        tempo = ((tempo * 3) / 2);
                        break;
                    case(16):
                        tempo = (tempo * 3);
                        break;
                    case(32):
                        tempo = (tempo * 6);
                        break;
                    case(64):
                        tempo = (tempo * 12);
                        break;
                    case(128):
                        tempo = (tempo * 24);
                        break;
                    default:
                        alert('ERROR: dotted eighth note conversion');
                }
                break;
            case('dottedHalf'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(4):
                        tempo = (tempo * 3);
                        break;
                    case(8):
                        tempo = (tempo * 6);
                        break;
                    case(16):
                        tempo = (tempo * 12);
                        break;
                    case(32):
                        tempo = (tempo * 24);
                        break;
                    case(64):
                        tempo = (tempo * 48);
                        break;
                    case(128):
                        tempo = (tempo * 96);
                        break;
                    default:
                       alert('ERROR: dotted half note conversion'); 
                }
                break;
            case('dottedOneHundredTwentyEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 256;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 128;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(64):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(128):
                        tempo = (tempo * 3) / 2;
                        break;
                    default:
                       alert('ERROR: dotted one hundred twenty-eighth note conversion'); 
                }
                break;
            case('dottedQuarter'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(8):
                        tempo = (tempo * 3);
                        break;
                    case(16):
                        tempo = (tempo * 6);
                        break;
                    case(32):
                        tempo = (tempo * 12);
                        break;
                    case(64):
                        tempo = (tempo * 24);
                        break;
                    case(128):
                        tempo = (tempo * 48);
                        break;
                    default:
                       alert('ERROR: dotted quarter note conversion'); 
                }
                break;
            case('dottedSixteenthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(32):
                        tempo = (tempo * 3);
                        break;
                    case(64):
                        tempo = (tempo * 6);
                        break;
                    case(128):
                        tempo = (tempo * 12);
                        break;
                    default:
                       alert('ERROR: dotted sixteenth note conversion'); 
                }
                break;
            case('dottedSixtyFourthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 128;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(64):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(128):
                        tempo = (tempo * 3);
                        break;
                    default:
                       alert('ERROR: dotted sixty-fourth note conversion'); 
                }
                break;
            case('dottedThirtySecondNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(64):
                        tempo = (tempo * 3);
                        break;
                    case(128):
                        tempo = (tempo * 6);
                        break;
                    default:
                       alert('ERROR: dotted thirty-second note conversion'); 
                }
                break;
            case('dottedWhole'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(2):
                        tempo = (tempo * 3);
                        break;
                    case(4):
                        tempo = (tempo * 6);
                        break;
                    case(8):
                        tempo = (tempo * 12);
                        break;
                    case(16):
                        tempo = (tempo * 24);
                        break;
                    case(32):
                        tempo = (tempo * 48);
                        break;
                    case(64):
                        tempo = (tempo * 96);
                        break;
                    case(128):
                        tempo = (tempo * 192);
                        break;
                    default:
                       alert('ERROR: dotted whole note conversion'); 
                }
                break;
            case('doubleWholeNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 2);
                        break;
                    case(2):
                        tempo = (tempo * 4);
                        break;
                    case(4):
                        tempo = (tempo * 8);
                        break;
                    case(8):
                        tempo = (tempo * 16);
                        break;
                    case(16):
                        tempo = (tempo * 32);
                        break;
                    case(32):
                        tempo = (tempo * 64);
                        break;
                    case(64):
                        tempo = (tempo * 128);
                        break;
                    case(128):
                        tempo = (tempo * 256);
                        break;
                    default:
                       alert('ERROR: double whole note conversion'); 
                }
                break;
            case('eighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 8);
                        break;
                    case(2):
                        tempo = (tempo / 4);
                        break;
                    case(4):
                        tempo = (tempo / 2);
                        break;
                    case(8):
                        tempo = tempo;
                        break;
                    case(16):
                        tempo = (tempo * 2);
                        break;
                    case(32):
                        tempo = (tempo * 4);
                        break;
                    case(64):
                        tempo = (tempo * 8);
                        break;
                    case(128):
                        tempo = (tempo * 16);
                        break;
                    default:
                       alert('ERROR: eighth note conversion'); 
                }
                break;
            case('halfNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 2);
                        break;
                    case(2):
                        tempo = tempo;
                        break;
                    case(4):
                        tempo = (tempo * 2);
                        break;
                    case(8):
                        tempo = (tempo * 4);
                        break;
                    case(16):
                        tempo = (tempo * 8);
                        break;
                    case(32):
                        tempo = (tempo * 16);
                        break;
                    case(64):
                        tempo = (tempo * 32);
                        break;
                    case(128):
                        tempo = (tempo * 64);
                        break;
                    default:
                       alert('ERROR: half note conversion'); 
                }
                break;
            case('oneHundredTwentyEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 128);
                        break;
                    case(2):
                        tempo = (tempo / 64);
                        break;
                    case(4):
                        tempo = (tempo / 32);
                        break;
                    case(8):
                        tempo = (tempo / 16);
                        break;
                    case(16):
                        tempo = (tempo / 8);
                        break;
                    case(32):
                        tempo = (tempo / 4);
                        break;
                    case(64):
                        tempo = (tempo / 2);
                        break;
                    case(128):
                        tempo = tempo;
                        break;
                    default:
                       alert('ERROR: one hundred twenty-eighth note conversion'); 
                }
                break;
            case('quarter'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 4);
                        break;
                    case(2):
                        tempo = (tempo / 2);
                        break;
                    case(4):
                        tempo = tempo;
                        break;
                    case(8):
                        tempo = (tempo * 2);
                        break;
                    case(16):
                        tempo = (tempo * 4);
                        break;
                    case(32):
                        tempo = (tempo * 8);
                        break;
                    case(64):
                        tempo = (tempo * 16);
                        break;
                    case(128):
                        tempo = (tempo * 32);
                        break;
                    default:
                       alert('ERROR: quarter note conversion'); 
                }
                break;
            case('sixteenthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 16);
                        break;
                    case(2):
                        tempo = (tempo / 8);
                        break;
                    case(4):
                        tempo = (tempo / 4);
                        break;
                    case(8):
                        tempo = (tempo / 2);
                        break;
                    case(16):
                        tempo = tempo;
                        break;
                    case(32):
                        tempo = (tempo * 2);
                        break;
                    case(64):
                        tempo = (tempo * 4);
                        break;
                    case(128):
                        tempo = (tempo * 8);
                        break;
                    default:
                       alert('ERROR: sixteenth note conversion'); 
                }
                break;
            case('sixtyFourthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 64);
                        break;
                    case(2):
                        tempo = (tempo / 32);
                        break;
                    case(4):
                        tempo = (tempo / 16);
                        break;
                    case(8):
                        tempo = (tempo / 8);
                        break;
                    case(16):
                        tempo = (tempo / 4);
                        break;
                    case(32):
                        tempo = (tempo / 2);
                        break;
                    case(64):
                        tempo = tempo;
                        break;
                    case(128):
                        tempo = (tempo * 2);
                        break;
                    default:
                       alert('ERROR: sixty-fourth note conversion'); 
                }
                break;
            case('thirtySecondNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 32);
                        break;
                    case(2):
                        tempo = (tempo / 16);
                        break;
                    case(4):
                        tempo = (tempo / 8);
                        break;
                    case(8):
                        tempo = (tempo / 4);
                        break;
                    case(16):
                        tempo = (tempo / 2);
                        break;
                    case(32):
                        tempo = tempo;
                        break;
                    case(64):
                        tempo = (tempo * 2);
                        break;
                    case(128):
                        tempo = (tempo * 4);
                        break;
                    default:
                       alert('ERROR: thirty-second note conversion'); 
                }
                break;
            case('wholeNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = tempo;
                        break;
                    case(2):
                        tempo = (tempo * 2);
                        break;
                    case(4):
                        tempo = (tempo * 4);
                        break;
                    case(8):
                        tempo = (tempo * 8);
                        break;
                    case(16):
                        tempo = (tempo * 16);
                        break;
                    case(32):
                        tempo = (tempo * 32);
                        break;
                    case(64):
                        tempo = (tempo * 64);
                        break;
                    case(128):
                        tempo = (tempo * 128);
                        break;
                    default:
                       alert('ERROR: whole note conversion'); 
                }
                break;
            default:
                alert('unsupported tempo base');   
        }
        
        return tempo; 
    }
    
    const setInitialTempoBase = (oldBase) => {
        let deepCopy = {...tempoTrack};
        let deepCurrent = {...currentTempo};
        
        switch(oldBase) {
            case('dottedEighthNote'):
                deepCurrent.tempoBase = 'quarter';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'quarter';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCurrent.tempoBase = 'wholeNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'wholeNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'sixtyFourthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixtyFourthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCurrent.tempoBase = 'halfNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'halfNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCurrent.tempoBase = 'eighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'eighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCurrent.tempoBase = 'thirtySecondNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'thirtySecondNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCurrent.tempoBase = 'sixteenthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixteenthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCurrent.tempoBase = 'doubleWholeNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'doubleWholeNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCurrent.tempoBase = 'oneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 256);
                deepCopy.tick[0].tempoBase = 'oneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 256);
                break;
            case('eighthNote'):
                deepCurrent.tempoBase = 'dottedEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCurrent.tempoBase = 'dottedHalf';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedHalf';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCurrent.tempoBase = 'dottedQuarter';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedQuarter';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCurrent.tempoBase = 'dottedSixteenthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixteenthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCurrent.tempoBase = 'dottedSixtyFourthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixtyFourthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCurrent.tempoBase = 'dottedThirtySecondNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedThirtySecondNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCurrent.tempoBase = 'dottedWhole';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedWhole';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setTempoTrack(deepCopy);
        setCurrentTempo(deepCurrent);
    }
    
    const cellDuration = (cell1, cell2) => {
        let elapsedTime = cell1.cumulativeTime;
        let bars = 0;
        let beats = 0;
        let ticks = 0;
        
        if (parseInt(cell2.bar) > parseInt(cell1.bar)) {
            bars = parseInt(cell2.bar) - parseInt(cell1.bar);
            elapsedTime += ((60000 / tempoBeatValue(cell1)) * parseInt(cell1.meterNumerator) * bars);
        }
        beats = (parseInt(cell2.beat) - parseInt(cell1.beat));
        elapsedTime += ((60000 / tempoBeatValue(cell1)) * beats);
        ticks = (parseInt(cell2.ticks) - parseInt(cell1.ticks));
        elapsedTime += ((60000 / tempoBeatValue(cell1)) / getTickMax(parseInt(cell1.meterDenominator)));
        
        return elapsedTime;
    }
    
    const recalculateTempoTrack = () => {
        let deepCopy = {...tempoTrack};
        
        for (let i = 0; i < deepCopy.tick.length; i++) {
            if (i === 0) {
                deepCopy.tick[i].cumulativeTime = 0;
            } else {
                if (deepCopy.tick[i].meterChange) {
                    if (deepCopy.tick[i].tempo !== null) {
                        deepCopy.tick[i].tempo = deepCopy.tick[i - 1].tempo;
                        deepCopy.tick[i].tempoBase = deepCopy.tick[i - 1].tempoBase;
                    }
                }
                if (deepCopy.tick[i].tempoChange) {
                    deepCopy.tick[i].meterNumerator = deepCopy.tick[i - 1].meterNumerator;
                    deepCopy.tick[i].meterDenominator = deepCopy.tick[i - 1].meterDenominator;
                }
                deepCopy.tick[i].cumulativeTime = cellDuration(deepCopy.tick[i - 1], deepCopy.tick[i]);
            }
        }
        
        setTempoTrack(deepCopy);
    }
    
    const setInitialTempo = (val) => {
        let deepCopy = {...tempoTrack};
        let deepTempo = {...currentTempo};
        
        deepCopy.tick[0].tempo = val;
        deepTempo.tempo = val;
        
        setTempoTrack(deepCopy);
        setCurrentTempo(deepTempo);
        setCurrentPosition({
            measure: {
                bar: parseInt(1),
                beat: parseInt(1),
                ticks: parseInt(0) 
            }
        });
        setCurrentClockPosition('0:00.000');
        recalculateTempoTrack();
    }
    
    const setInitialMeterNumerator = (val) => {
        if (val > 0) {
            let deepCopy = {...tempoTrack};
            let deepMeter = {...currentMeter};

            deepCopy.tick[0].meterNumerator = val;
            deepMeter.numerator = val;
            setTempoTrack(deepCopy);
            setCurrentMeter(deepMeter);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            recalculateTempoTrack();
        }
    }
    
    const setInitialMeterDenominator = (val) => {
        if (val > 0) {
            let deepCopy = {...tempoTrack};
            let deepMeter = {...currentMeter};
            
            if (val > parseInt(deepCopy.tick[0].meterDenominator)) {
                if (parseInt(deepCopy.tick[0].meterDenominator) === 128) {
                    return;
                }
                deepCopy.tick[0].meterDenominator = (parseInt(deepCopy.tick[0].meterDenominator) * 2);
                deepMeter.denominator = deepCopy.tick[0].meterDenominator;
            } else {
                deepCopy.tick[0].meterDenominator = (parseInt(deepCopy.tick[0].meterDenominator) / 2);
                deepMeter.denominator = deepCopy.tick[0].meterDenominator;
            }
            setTempoTrack(deepCopy);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            setCurrentMeter(deepMeter);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            recalculateTempoTrack();
        }
    }
    
    const seqNameUpdate = (val) => {
        let deepCopy = {...sequence};
        
        deepCopy.header.name = val;
        
        setSequence(deepCopy);
    }
    
    const updateCurrentPositionValues = () => {
        let index = 0;
        let exitCondition = false;
        
        while(!exitCondition) {
            if (positionEqualTo(currentPosition.measure, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], currentPosition.measure)) && (positionGreaterThan(currentPosition.measure, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        if (parseInt(index) === parseInt(tempoTrack.tick.length - 1)) {
            return;
        }
        setCurrentMeter({
            numerator: parseInt(tempoTrack.tick[index].meterNumerator),
            denominator: parseInt(tempoTrack.tick[index].meterDenominator)
        });
        setCurrentTempo({
            tempo: tempoTrack.tick[index].tempo,
            tempoBase: tempoTrack.tick[index].tempoBase
        });
        
    }
    
    const updateHomeBarPosition = (val) => {
        let deepCopy = {...homePosition};
        
        if (val > 0) {
            if (parseInt(val) < (parseInt(sequence.duration.bar) + 1)) {
                deepCopy.measure.bar = parseInt(val);
                deepCopy.measure.beat = 1;
                deepCopy.measure.ticks = 0;
            }
        }
        setHomePosition(deepCopy);
        
    }
    
    const updateBarPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        
        if (val > 0) {
            deepCopy.measure.bar = parseInt(val);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        }
        setCurrentPosition(deepCopy);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
        
    }
    
    const updateHomeBeatPosition = (val) => {
        let deepCopy = {...homePosition};
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) === 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
            if (val > 1) {
                return;
            }
        }
        
        if (val > meter.meterNumerator) {
            if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
                return;
            }
            deepCopy.measure.bar = parseInt(deepCopy.measure.bar + 1);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        } else if (val < 1) {
            if (deepCopy.measure.bar > 1) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                deepCopy.measure.beat = meter2.meterNumerator;
                deepCopy.measure.ticks = 0;
            } else {
                return;
            }
        } else {
            deepCopy.measure.beat = val;
            deepCopy.measure.ticks = 0;
        }
        setHomePosition(deepCopy);
        
    }
    
    const updateBeatPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        let meter2;
        if (parseInt(val) < 1) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
            if (val > 1) {
                return;
            }
        }
        
        if (val > currentMeter.numerator) {
            if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
                return;
            }
            deepCopy.measure.bar = parseInt(deepCopy.measure.bar + 1);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        } else if (val < 1) {
            if (deepCopy.measure.bar > 1) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                deepCopy.measure.beat = meter2.meterNumerator;
                deepCopy.measure.ticks = 0;
            } else {
                return;
            }
        } else {
            deepCopy.measure.beat = val;
            deepCopy.measure.ticks = 0;
        }
        setCurrentPosition(deepCopy);
        if (deepCopy.measure.bar > deepSequence.duration.bar) {
            deepSequence.duration.bar = deepCopy.measure.bar;
        }
        setSequence(deepSequence);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
    }
    
    function getTickMax(denominator) {
        let max = 0;
        
        switch (denominator) {
            case(1):
                max = (beatResolution * 4);
                break;
            case(2):
                max = (beatResolution * 2);
                break;
            case(4):
                max = beatResolution;
                break;
            case(8):
                max = Math.floor(beatResolution/2);
                break;
            case(16):
                max = Math.floor(beatResolution/4);
                break;
            case(32):
                max = Math.floor(beatResolution/8);
                break;
            case(64):
                max = Math.floor(beatResolution/16);
                break;
            case(128):
                max = Math.floor(beatResolution/32);
                break;
            case(256):
                max = Math.floor(beatResolution/64);
                break;
            case(512):
                max = Math.floor(beatResolution/128);
                break;
            case(1024):
                max = Math.floor(beatResolution/256);
                break;
            default:
                alert('CLICK RESOLUTION ERROR - TICK UNACCOUNTED FOR');
        }
        
        return max;
    }
    
    function getMaxTick() {
        let max = 0;
        
        switch (currentMeter.denominator) {
            case(1):
                max = (beatResolution * 4);
                break;
            case(2):
                max = (beatResolution * 2);
                break;
            case(4):
                max = beatResolution;
                break;
            case(8):
                max = Math.floor(beatResolution/2);
                break;
            case(16):
                max = Math.floor(beatResolution/4);
                break;
            case(32):
                max = Math.floor(beatResolution/8);
                break;
            case(64):
                max = Math.floor(beatResolution/16);
                break;
            case(128):
                max = Math.floor(beatResolution/32);
                break;
            case(256):
                max = Math.floor(beatResolution/64);
                break;
            case(512):
                max = Math.floor(beatResolution/128);
                break;
            case(1024):
                max = Math.floor(beatResolution/256);
                break;
            default:
                alert('CLICK RESOLUTION ERROR - TICK UNACCOUNTED FOR');
        }
        
        return max;
    }
    
    const updateHomeTickPosition = (val) => {
        let deepCopy = {...homePosition};
        const maxValue = parseInt(getMaxTick());
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) < 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(val) > maxValue) {
            return;
        }
        
        if (parseInt(val) === maxValue) {
            if (deepCopy.measure.beat === meter.meterNumerator) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar) + 1;
                deepCopy.measure.beat = parseInt(1);
                deepCopy.measure.ticks = parseInt(0);
            } else {
                deepCopy.measure.beat = parseInt(deepCopy.measure.beat) + 1;
                deepCopy.measure.ticks = parseInt(0);
            }
        } else if (parseInt(val) < 0) {
            if (deepCopy.measure.beat === 1) {
                if (deepCopy.measure.bar === 1) {
                    return;
                } else {
                    deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                    deepCopy.measure.beat = parseInt(meter2.meterNumerator);
                    deepCopy.measure.ticks = parseInt(maxValue - 1);
                }
            } else {
                deepCopy.measure.beat -= 1;
                deepCopy.measure.ticks = parseInt(maxValue - 1);
            }
        } else {
            if (deepCopy.measure.bar !== sequence.duration.bar) {
                deepCopy.measure.ticks = parseInt(val);
            }
        }
        
        setHomePosition(deepCopy);
    }
    
    const updateTickPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        const maxValue = parseInt(getMaxTick());
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) < 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(val) > maxValue) {
            return;
        }
        
        if (parseInt(val) === maxValue) {
            if (deepCopy.measure.beat === meter.meterNumerator) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar) + 1;
                deepCopy.measure.beat = parseInt(1);
                deepCopy.measure.ticks = parseInt(0);
            } else {
                deepCopy.measure.beat = parseInt(deepCopy.measure.beat) + 1;
                deepCopy.measure.ticks = parseInt(0);
            }
        } else if (parseInt(val) < 0) {
            if (deepCopy.measure.beat === 1) {
                if (deepCopy.measure.bar === 1) {
                    return;
                } else {
                    deepCopy.measure.bar = parseInt(deepCopy.measure.bar) - 1;
                    deepCopy.measure.beat = parseInt(meter2.meterNumerator);
                    deepCopy.measure.ticks = parseInt(maxValue - 1);
                }
            } else {
                deepCopy.measure.beat -= 1;
                deepCopy.measure.ticks = parseInt(maxValue - 1);
            }
        } else {
            if (deepCopy.measure.bar !== sequence.duration.bar) {
                deepCopy.measure.ticks = parseInt(val);
            }
        }
        
        setCurrentPosition(deepCopy);
        if (deepCopy.measure.bar > deepSequence.duration.bar) {
            deepSequence.duration.bar = deepCopy.measure.bar;
        }
        setSequence(deepSequence);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
    }
    
    const convertMillisecondsToString = (milli) => {
        let base = milli;
        let minute = 0;
        let second = 0
        let milliseconds = 0;
        let time = '';
        
        if (base < 60000) {
            minute = 0;
        } else {
            minute = Math.floor(base/60000);
            base -= (base/60000);
        }
        time = minute.toString() + ':';
        if (base < 1000) {
            second = 0;
        } else {
            second = Math.floor(base/1000);
            base = base % 1000;
            if (second > 59) {
                while(second > 59) {
                    second -= 60;
                }
            }
        }
        if (second < 10) {
            time += '0' + second.toString() + '.';
        } else {
            time += second.toString() + '.';
        }
        if (base < 10) {
            time += '00' + Math.floor(base).toString();
        } else if (base < 100) {
            time += '0' + Math.floor(base).toString();
        } else {
            time += Math.floor(base).toString();
        }
        
        return time;
        
    }
    
    function positionEqualTo(position, check) {
        return ((parseInt(position.bar) === parseInt(check.bar)) && (parseInt(position.beat) === parseInt(check.beat)) && (parseInt(position.ticks) === parseInt(check.ticks)));
    }
    
    function positionGreaterThan(position, check) {
        if (check.bar > position.bar) {
            return true;
        } else if (check.bar < position.bar) {
            return false;
        } else {
            if (check.beat > position.beat) {
                return true;
            } else if (check.beat < position.beat) {
                return false;
            } else {
                if (check.ticks > position.ticks) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    
    const convertDurationToMilliseconds = (position, tempoReference) => {
        let milliseconds = 0;
        let bars = 0;
        let beats = 0;
        let ticks = 0;
        
        if (parseInt(position.bar) > parseInt(tempoReference.bar)) {
            bars = (parseInt(position.bar) - parseInt(tempoReference.bar));
            milliseconds += ((parseInt(bars) * parseInt(tempoReference.meterNumerator)) * (60000 / tempoBeatValue(tempoReference)));
            if (parseInt(position.beat) !== parseInt(tempoReference.beat)) {
                beats = parseInt(position.beat) - parseInt(tempoReference.beat);
                milliseconds += (parseInt(beats) * (60000 / tempoBeatValue(tempoReference)));
            }
            if (parseInt(position.ticks) !== parseInt(tempoReference.ticks)) {
                ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
                milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
            }
        } else if (parseInt(position.beat) > parseInt(tempoReference.beat)) {
            beats = parseInt(position.beat) - parseInt(tempoReference.beat);
            milliseconds += (parseInt(beats) * (60000 / tempoBeatValue(tempoReference)));
            if (parseInt(position.ticks) !== parseInt(tempoReference.ticks)) {
                ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
                milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
            }
        } else if (parseInt(position.ticks) > parseInt(tempoReference.ticks)) {
            ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
            milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
        }
        
        return milliseconds;
    }
    
    const calculateTimeString = (position) => {
        let timeStamp = '';
        let index = 0;
        let cumulative = 0;
        let exitCondition = false;
        let meterNumerator = tempoTrack.tick[0].meterNumerator;
        let meterDenominator = tempoTrack.tick[0].meterDenominator;
        let tempo = tempoTrack.tick[0].tempo;
        let tempoBase = tempoTrack.tick[0].tempoBase;
        let calcTicks = 0;
        
        while(!exitCondition) {
            if (index > 0) {
                if (tempoTrack.tick[index].meterChange) {
                    meterNumerator = tempoTrack.tick[index].meterNumerator;
                    meterDenominator = tempoTrack.tick[index].meterDenominator
                }
                if (tempoTrack.tick[index].tempoChange) {
                    tempo = tempoTrack.tick[index].tempo;
                    tempoBase = tempoTrack.tick[index].tempoBase;
                }
            }
            if (tempoTrack.tick.length === index) {
                exitCondition = true;
                cumulative = tempoTrack.tick[index - 1].cumulativeTime;
            } else {
                if (positionEqualTo(position, tempoTrack.tick[index])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else if (positionGreaterThan(position, tempoTrack.tick[index + 1])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else {
                    ++index;
                }
            }
        }
        if (positionEqualTo(position, tempoTrack.tick[index])) {
            return convertMillisecondsToString(cumulative);
        } else {
            calcTicks = convertDurationToMilliseconds(position, tempoTrack.tick[index]);
            cumulative += calcTicks;
            return convertMillisecondsToString(cumulative);
        }
    }
    
    const updateStepTick = (val) => {
        let deepCopy = {...stepInterval};
        
        deepCopy.intervalTicks = parseInt(val);
        setStepInterval(deepCopy);
    }
    
    const updateStepNoteInterval = (currentNote) => {
        const resolution = parseInt(user.clock_resolution);
        let deepCopy = {...stepInterval};
        
        switch(currentNote) {
            case('dottedEighthNote'):
                deepCopy.note = 'quarter';
                deepCopy.intervalTicks = resolution;
                break;
            case('dottedHalf'):
                deepCopy.note = 'wholeNote';
                deepCopy.intervalTicks = resolution * 4;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.note = 'sixtyFourthNote';
                deepCopy.intervalTicks = parseInt(resolution / 16);
                break;
            case('dottedQuarter'):
                deepCopy.note = 'halfNote';
                deepCopy.intervalTicks = resolution * 2;
                break;
            case('dottedSixteenthNote'):
                deepCopy.note = 'eighthNote';
                deepCopy.intervalTicks = parseInt(resolution / 2);
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.note = 'thirtySecondNote';
                deepCopy.intervalTicks = parseInt(resolution / 8);
                break;
            case('dottedThirtySecondNote'):
                deepCopy.note = 'sixteenthNote';
                deepCopy.intervalTicks = parseInt(resolution / 4);
                break;
            case('dottedWhole'):
                deepCopy.note = 'doubleWholeNote';
                deepCopy.intervalTicks = resolution * 8;
                break;
            case('doubleWholeNote'):
                deepCopy.note = 'oneHundredTwentyEighthNote';
                deepCopy.intervalTicks = parseInt(resolution / 32);
                break;
            case('eighthNote'):
                deepCopy.note = 'dottedEighthNote';
                deepCopy.intervalTicks = parseInt((resolution / 4) * 3);
                break;
            case('halfNote'):
                deepCopy.note = 'dottedHalf';
                deepCopy.intervalTicks = resolution * 3;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.note = 'dottedOneHundredTwentyEighthNote';
                deepCopy.intervalTicks = parseInt((resolution / 64) * 3);
                break;
            case('quarter'):
                deepCopy.note = 'dottedQuarter';
                deepCopy.intervalTicks = parseInt((resolution / 2) * 3);
                break;
            case('sixteenthNote'):
                deepCopy.note = 'dottedSixteenthNote';
                deepCopy.intervalTicks = parseInt((resolution / 8) * 3);
                break;
            case('sixtyFourthNote'):
                deepCopy.note = 'dottedSixtyFourthNote';
                deepCopy.intervalTicks = parseInt((resolution / 32) * 3);
                break;
            case('thirtySecondNote'):
                deepCopy.note = 'dottedThirtySecondNote';
                deepCopy.intervalTicks = parseInt((resolution / 16) * 3);
                break;
            case('wholeNote'):
                deepCopy.note = 'dottedWhole';
                deepCopy.intervalTicks = resolution * 6;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setStepInterval(deepCopy);
    }
    
    const forwardByInterval = () => {
        for (let i = 0; i < stepInterval.intervalTicks; i++) {
            updateTickPosition(currentPosition.measure.ticks + 1);
        }
    }
    
    const backwardByInterval = () => {
        for (let i = 0; i < stepInterval.intervalTicks; i++) {
            updateTickPosition(currentPosition.measure.ticks - 1);
        }
    }
    
    const updateSelectedTrack = (val) => {
        let deepSequence = {...sequence};
        
        for (let i = 0; i < sequence.tracks.length; i++) {
            if (i === parseInt(val)) {
                sequence.tracks[i].active = true;
            } else {
                sequence.tracks[i].active = false;
            }
        }
        setActiveTrack(val);
        setSequence(deepSequence);
    }
    
    const rudeSoloStatus = () => {
        let status = false;
        
        for (let i = 0; i < sequence.tracks.length; i++) {
            if (sequence.tracks[i].solo) {
                status = true;
            }
        }
        
        return status;
    }
    
    const toggleTrackMute = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].mute = !deepSequence.tracks[activeTrack].mute;
        setSequence(deepSequence);
    }
    
    const toggleTrackSolo = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].solo = !deepSequence.tracks[activeTrack].solo;
        setSequence(deepSequence);
        setRudeSolo(rudeSoloStatus());
    }
    
    const updateOutputObject = (arr) => {
        setMidiOutputs(arr);
    }
    
    const checkCurrentOutputs = () => {
        if (midiOutputs.length === 0) {
            if (user.midi_connections && user.midi_patch) {
                axios.get(`/midi_manager_patches/patch/${user.midi_patch}`)
                .then(midiPatchData => {
                    const midiPatch = midiPatchData.data.user_preset.outputs;
                    let outputsArr = [];
                    for (let i = 0; i < user.midi_connections.outputs.length; i++) {
                        outputsArr[i] = {
                            activeReciever: midiPatch[i].activeReciever,
                            channel: midiPatch[i].channel,
                            connection: user.midi_connections.outputs[i].connection,
                            device: midiPatch[i].device,
                            hardwareIn: midiPatch[i].hardwareIn,
                            id: user.midi_connections.outputs[i].id,
                            label: midiPatch[i].label,
                            manufacturer: user.midi_connections.outputs[i].manufacturer,
                            name: midiPatch[i].label,
                            state: user.midi_connections.outputs[i].state,
                            type: user.midi_connections.outputs[i].type
                        }
                    }
                    updateOutputObject(outputsArr);
                });
            } else if (user.midi_connections) {
                updateOutputObject(user.midi_connections.outputs);
            }
        }
    }
    
    const updateActiveTrackOutput = (val) => {
        let deepSequence = {...sequence};
        
        sequence.tracks[activeTrack].output = val;
        
        setSequence(deepSequence);
    }
    
    const addNewTrack = () => {
        let deepSequence = {...sequence};
        let trackName = 'track';
        if (sequence.tracks.length < 9) {
            trackName += '0';
        }
        trackName += (sequence.tracks.length + 1).toString();
        
        deepSequence.tracks.push({
            active: true,
            collection: null,
            device: '0',
            events: [],
            image: availableDevices[0].imagePath,
            mute: false,
            name: trackName,
            output: '',
            initialPatch: null,
            instrument: {
                collection: null,
                bank: null,
                patch: null
            },
            solo: false
        });
        for (let i = 0; i < deepSequence.tracks.length; i++) {
            deepSequence.tracks[i].id = i;
            deepSequence.tracks[i].active = false;
        }
        deepSequence.tracks[deepSequence.tracks.length - 1].active = true;
        
        setSequence(deepSequence);
        setActiveTrack(deepSequence.tracks.length - 1);
    }
    
    const deleteTrack = () => {
        let deepSequence = {...sequence};
        
        if (sequence.tracks[activeTrack].events.length === 0) {
            deepSequence.tracks.splice(activeTrack, 1);
        } else {
            // TODO guardrail for delete
        }
        
        for (let i = 0; i < deepSequence.tracks.length; i++) {
            deepSequence.tracks[i].active = false;
            deepSequence.tracks[i].id = i;
        }
        deepSequence.tracks[0].active = true;
        
        setSequence(deepSequence);
        setActiveTrack(0);
    }
    
    const updateTrackDevice = (val) => {
        let deepSequence = {...sequence};
        let imgSrce = availableDevices.filter(dev => {
            return(dev.uuid === val);
        });
        
        deepSequence.tracks[activeTrack].device = val;
        deepSequence.tracks[activeTrack].image = imgSrce[0].imagePath;
        
        setSequence(deepSequence);
    }
    
    return(
        <div>
            <div className={'stepSequencerContainer' + stepSequencerState + stepSequenceMonth}
                tabIndex="1">
                <div className={'stepSequencerImageDiv' + stepSequenceMonth}>
                    <div className={'stepSequencerEditorTopBar' + stepSequenceMonth}>
                        <NavLink to="/"><img className={'stepSeqNavImage' + stepSequenceMonth}
                            src={midiImage}></img>
                        </NavLink>
                    </div>
                    <h3 className={'stepSequencerTitle' + stepSequenceMonth}>Step Sequencer</h3>
                    <button className={'stepSequencerLoadButton' + stepSequenceMonth}>load</button>
                    <input className={'stepSequencerNameInput' + stepSequenceMonth}
                        onChange={(e) => seqNameUpdate(e.target.value)}
                        type="text"
                        value={sequence.header.name}/>
                    <button className={'stepSequencerPanicButton' + stepSequenceMonth}>panic!</button>
                    <div className={'stepSequencerSidebarManager' + stepSequenceMonth}></div>
                    <div className={'stepSequencerPositionDisplay' + stepSequenceMonth}>
                        <input className={'stepSequencerPositionBarInput' + stepSequenceMonth} 
                            max={sequence.duration.bar}
                            min="1"
                            onChange={(e) => updateBarPosition(e.target.value)}
                            type="number"
                            value={currentPosition.measure.bar} />
                        <p className={'stepSequencerPositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerPositionBarInput' + stepSequenceMonth}
                            onChange={(e) => updateBeatPosition(e.target.value)}
                            type="number"
                            value={currentPosition.measure.beat}/>
                        <p className={'stepSequencerPositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerPositionTicker' + stepSequenceMonth}
                            onChange={(e) => updateTickPosition(e.target.value)}
                            style={{width: (2.5 * beatDigits).toString() + '%'}}
                            type="number"
                            value={currentPosition.measure.ticks} />
                        <p className={'stepSequencerCurrentClockPositionDisplay' + stepSequenceMonth}>{currentClockPosition}</p>
                        <div className={'stepSequencerRudeSoloLabelDiv' + rudeSolo + stepSequenceMonth}>
                            <p className={'stepSequencerRudeSoloLabel' + stepSequenceMonth}>rude solo</p>
                        </div>
                    </div>
                    <div className={'stepSequencerShuttleControls' + stepSequenceMonth}>
                        <img className={'stepSequencerShuttleHome' + stepSequenceMonth}
                            onClick={() => sendToHomePosition()}
                            src={home} />
                        <input className={'stepSequencerHomePositionBarInput' + stepSequenceMonth} 
                            max={sequence.duration.bar}
                            min="1"
                            onChange={(e) => updateHomeBarPosition(e.target.value)}
                            type="number"
                            value={homePosition.measure.bar} />
                        <p className={'stepSequencerHomePositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerHomePositionBarInput' + stepSequenceMonth}
                            onChange={(e) => updateHomeBeatPosition(e.target.value)}
                            type="number"
                            value={homePosition.measure.beat}/>
                        <p className={'stepSequencerHomePositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerHomePositionTicker' + stepSequenceMonth}
                            onChange={(e) => updateHomeTickPosition(e.target.value)}
                            style={{width: (2.5 * beatDigits).toString() + '%'}}
                            type="number"
                            value={homePosition.measure.ticks} />
                        {(!playState) && (
                            <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => playSequence()}
                                src={playButton} />
                        )}
                        {(playState) && (
                            <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => stopSequence()}
                                src={pauseButton} />
                        )}
                        {(stepInterval.note === 'quarter') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('quarter')}
                                    src={quarterNote} />
                        )}
                        {(stepInterval.note === 'dottedQuarter') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedQuarter')}
                                    src={quarterNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'halfNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('halfNote')}
                                    src={halfNote} />
                        )}
                        {(stepInterval.note === 'dottedHalf') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedHalf')}
                                    src={halfNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'wholeNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('wholeNote')}
                                    src={wholeNote} />
                        )}
                        {(stepInterval.note === 'dottedWhole') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedWhole')}
                                    src={wholeNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'doubleWholeNote') && (
                            <img className={'stepSequencerStepNoteWhole' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('doubleWholeNote')}
                                    src={doubleWholeNote} />
                        )}
                        {(stepInterval.note === 'oneHundredTwentyEighthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('oneHundredTwentyEighthNote')}
                                    src={oneHundredTwentyEighthNote} />
                        )}
                        {(stepInterval.note === 'dottedOneHundredTwentyEighthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedOneHundredTwentyEighthNote')}
                                    src={oneHundredTwentyEighthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'sixtyFourthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('sixtyFourthNote')}
                                    src={sixtyfourthNote} />
                        )}
                        {(stepInterval.note === 'dottedSixtyFourthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedSixtyFourthNote')}
                                    src={sixtyfourthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'thirtySecondNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('thirtySecondNote')}
                                    src={thirtySecondNote} />
                        )}
                        {(stepInterval.note === 'dottedThirtySecondNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedThirtySecondNote')}
                                    src={thirtySecondNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'sixteenthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('sixteenthNote')}
                                    src={sixteenthNote} />
                        )}
                        {(stepInterval.note === 'dottedSixteenthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedSixteenthNote')}
                                    src={sixteenthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'eighthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('eighthNote')}
                                    src={eighthNote} />
                        )}
                        {(stepInterval.note === 'dottedEighthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedEighthNote')}
                                    src={eighthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        <input className={'stepSequencerStepTicksInput' + stepSequenceMonth}
                            min="1"
                            onChange={(e) => updateStepTick(e.target.value)}
                            type="number"
                            value={stepInterval.intervalTicks} />
                        <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => backwardByInterval()}
                                src={backward} />
                        <div className={'stepSequencerShuttleSpacer' + stepSequenceMonth}></div>
                        <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => forwardByInterval()}
                                src={forward} />
                    </div>
                    <div className={'stepSequencerTempoTracking' + stepSequenceMonth}>
                        <div className={'stepSequencerDisplayCurrentMeterAndTempo' + stepSequenceMonth }>
                            <p className={'stepSequencerDisplayCurrentMeterNumerator' + stepSequenceMonth}>{currentMeter.numerator}/{currentMeter.denominator}</p>
                            {(currentTempo.tempoBase === 'quarter') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={quarterNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedQuarter') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'halfNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={halfNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedHalf') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'wholeNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={wholeNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedWhole') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'doubleWholeNote') && (
                                <img className={'stepSequencerTempoNoteWhole' + stepSequenceMonth}
                                    src={doubleWholeNote} />
                            )}
                            {(currentTempo.tempoBase === 'oneHundredTwentyEighthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={oneHundredTwentyEighthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'sixtyFourthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixtyfourthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedSixtyFourthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'thirtySecondNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={thirtySecondNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedThirtySecondNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'sixteenthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixteenthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedSixteenthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'eighthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={eighthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedEighthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            <p className={'stepSequencerDisplayCurrentMeterNumerator' + stepSequenceMonth}> = {(Math.round(currentTempo.tempo * 1000) / 1000)}</p>
                        </div>
                        <div className={'stepSequencerTempoTrackTracker' + stepSequenceMonth}>
                            {tempoTrack.tick.map(eve => (
                                <div className={'stepSequencerTempoEventLine' + ((eve.bar === currentPosition.measure.bar) && (eve.beat === currentPosition.measure.beat) && (eve.ticks === currentPosition.measure.ticks)) + stepSequenceMonth}
                                    key={eve.index}>
                                    {(eve.index === 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <p className={'stepSequencerTempoTrackDisplayLine' + stepSequenceMonth}>{eve.bar}. {eve.beat}. {eve.ticks}</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth}  
                                                onChange={(e) => setInitialMeterNumerator(e.target.value)}
                                                type="number" 
                                                value={eve.meterNumerator} />
                                            <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
                                                max="128"
                                                onChange={(e) => setInitialMeterDenominator(e.target.value)}
                                                type="number" 
                                                value={eve.meterDenominator} />
                                            {(eve.tempoBase === 'quarter') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('quarter')}
                                                    src={quarterNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedQuarter') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedQuarter')}
                                                    src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'halfNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('halfNote')}
                                                    src={halfNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedHalf') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedHalf')}
                                                    src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'wholeNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('wholeNote')}
                                                    src={wholeNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedWhole') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedWhole')}
                                                    src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'doubleWholeNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImgWhole' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('doubleWholeNote')}
                                                    src={doubleWholeNote} />
                                            )}
                                            {(eve.tempoBase === 'oneHundredTwentyEighthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('oneHundredTwentyEighthNote')}
                                                    src={oneHundredTwentyEighthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedOneHundredTwentyEighthNote')}
                                                    src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'sixtyFourthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('sixtyFourthNote')}
                                                    src={sixtyfourthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedSixtyFourthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedSixtyFourthNote')}
                                                    src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'thirtySecondNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('thirtySecondNote')}
                                                    src={thirtySecondNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedThirtySecondNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedThirtySecondNote')}
                                                    src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'sixteenthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('sixteenthNote')}
                                                    src={sixteenthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedSixteenthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedSixteenthNote')}
                                                    src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'eighthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('eighthNote')}
                                                    src={eighthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedEighthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedEighthNote')}
                                                    src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>=</p>
                                            <input className={'stepSequencerTempoTrackTempoInput' + stepSequenceMonth}
                                                max="1000.000"
                                                min="0.001"
                                                onChange={(e) => setInitialTempo(e.target.value)}
                                                step="0.001"
                                                type="number" 
                                                value={(Math.round(eve.tempo * 1000) / 1000)} />
                                        </div>
                                    )}
                                    {(eve.cumulativeTime !== 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                onChange={(e) => updateTempoEventBar(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.bar} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                disabled={((eve.meterChange) || (!eve.meterChange && !eve.tempoChange))}
                                                onChange={(e) => updateTempoEventBeat(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.beat} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                disabled={((eve.meterChange) || (!eve.meterChange && !eve.tempoChange))}
                                                onChange={(e) => updateTempoEventTicks(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.ticks} />
                                            {(eve.meterChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateTempoEventMeterNumerator(e.target.value, eve.index)}
                                                        min="1"
                                                        type="number" 
                                                        value={eve.meterNumerator} />
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                                    <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
                                                        onChange={(e) => updateTempoEventMeterDenominator(e.target.value, eve.index)}
                                                        max="128"
                                                        min="1"
                                                        type="number" 
                                                        value={eve.meterDenominator} />
                                                    <p className={'stepSequencerTempoTrackEventDeleteX' + stepSequenceMonth}
                                                        onClick={() => removeTempoTrackEvent(eve.index)}
                                                        >&#127303;</p>
                                                </div>
                                            )}
                                            {(eve.tempoChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    {(eve.tempoBase === 'quarter') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('quarter', eve.index)}
                                                            src={quarterNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedQuarter') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedQuarter', eve.index)}
                                                            src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'halfNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('halfNote', eve.index)}
                                                            src={halfNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedHalf') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedHalf', eve.index)}
                                                            src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'wholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('wholeNote', eve.index)}
                                                            src={wholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedWhole') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedWhole', eve.index)}
                                                            src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'doubleWholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2Whole' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('doubleWholeNote', eve.index)}
                                                            src={doubleWholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'oneHundredTwentyEighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('oneHundredTwentyEighthNote', eve.index)}
                                                            src={oneHundredTwentyEighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedOneHundredTwentyEighthNote', eve.index)}
                                                            src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixtyFourthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('sixtyFourthNote', eve.index)}
                                                            src={sixtyfourthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixtyFourthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedSixtyFourthNote', eve.index)}
                                                            src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'thirtySecondNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('thirtySecondNote', eve.index)}
                                                            src={thirtySecondNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedThirtySecondNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedThirtySecondNote', eve.index)}
                                                            src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixteenthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('sixteenthNote', eve.index)}
                                                            src={sixteenthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixteenthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedSixteenthNote', eve.index)}
                                                            src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'eighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('eighthNote', eve.index)}
                                                            src={eighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedEighthNote', eve.index)}
                                                            src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>=</p>
                                                    <input className={'stepSequencerTempoTrackTempoInput' + stepSequenceMonth}
                                                        max="1000.000"
                                                        min="0.001"
                                                        onChange={(e) => updateTempoEventTempo(e.target.value, eve.index)}
                                                        step="0.001"
                                                        type="number" 
                                                        value={(Math.round(eve.tempo * 1000) / 1000)} />
                                                    <p className={'stepSequencerTempoTrackEventDeleteX' + stepSequenceMonth}
                                                        onClick={() => removeTempoTrackEvent(eve.index)}
                                                        >&#127303;</p>
                                                </div>
                                            )}
                                            {(!eve.meterChange && !eve.tempoChange) && (
                                                <p className={'stepSequencerTempoTrackEndMarker' + stepSequenceMonth}>end</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className={'stepSequencerTempoTrackAddLabel' + stepSequenceMonth}>add:</p>
                        <button className={'stepSequencerTempoTrackAddMeterButton' + stepSequenceMonth}
                            onClick={() => addMeterEvent()}
                            >meter</button>
                        <button className={'stepSequencerTempoTrackAddTempoButton' + stepSequenceMonth}
                            onClick={() => addTempoChangeEvent()}
                            >tempo</button>
                        <button className={'stepSequencerTempoTrackRitAccelButton' + stepSequenceMonth}>rit/accel</button>
                    </div>
                    <div className={'stepSequencerTracking' + stepSequenceMonth}>
                        <div className={'stepSequencerDisplaySequenceTrackDatas' + stepSequenceMonth }>
                            <button className={'stepSequencerTrackMuteButton' + sequence.tracks[activeTrack].mute + stepSequenceMonth}
                                onClick={() => toggleTrackMute()}>mute</button>
                            <button className={'stepSequencerTrackSoloButton' + sequence.tracks[activeTrack].solo + sequence.tracks[activeTrack].mute + stepSequenceMonth}
                                onClick={() => toggleTrackSolo()}>solo</button>
                            <select className={'stepSequencerTrackSelector' + stepSequenceMonth}
                                onChange={(e) => updateSelectedTrack(e.target.value)}
                                value={activeTrack}>
                                {sequence.tracks.map(track => (
                                    <option key={track.id} value={track.id}>{track.name}</option>))}
                            </select>
                            <select className={'stepSequencerTrackSelector' + stepSequenceMonth}
                                onChange={(e) => updateActiveTrackOutput(e.target.value)}
                                onClick={() => checkCurrentOutputs()}
                                value={sequence.tracks[activeTrack].output} >
                                {midiOutputs.map(out => (
                                    <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <button className={'stepSequencerAddDeleteTrackButton' + stepSequenceMonth}
                                onClick={() => addNewTrack()}>add</button>
                            <button className={'stepSequencerAddDeleteTrackButton' + stepSequenceMonth}
                                onClick={() => deleteTrack()}
                                >delete</button>
                        </div>
                        <div className={'stepSequencerTracksContainer' + stepSequenceMonth}>
                            {sequence.tracks.map(track => (
                                <div className={'stepSequencerIndividualTrack' + track.active + stepSequenceMonth}
                                    onClick={() => updateSelectedTrack(track.id)}></div>
                            ))}
                        </div>
                    </div>
                    <div className={'stepSequencerInputsControl' + stepSequenceMonth}>
                        <img className={'stepSequencerDeviceImage' + stepSequenceMonth}
                            src={sequence.tracks[activeTrack].image} />
                        <p className={'stepSequencerDeviceSelectLabel' + stepSequenceMonth}>device:</p>
                        <select className={'stepSequencerDeviceSelector' + stepSequenceMonth}
                            onChange={(e) => updateTrackDevice(e.target.value)}
                            value={sequence.tracks[activeTrack].device}>
                            {availableDevices.map(device => (
                                <option key={device.uuid} value={device.uuid}>{device.device}</option>
                            ))}
                        </select>
                        <p className={'stepSequencerCollectionSelectLabel' + stepSequenceMonth}>collection:</p>
                        <select className={'stepSequencerCollectionSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerBankSelectLabel' + stepSequenceMonth}>bank:</p>
                        <select className={'stepSequencerBankSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerPatchSelectLabel' + stepSequenceMonth}>patch:</p>
                        <select className={'stepSequencerPatchSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerEventSelectLabel' + stepSequenceMonth}>event:</p>
                        <select className={'stepSequencerEventSelector' + stepSequenceMonth}></select>
                        <button className={'stepSequencerAddEventButton' + stepSequenceMonth}>add</button>
                        <button className={'stepSequencerRepeatButton' + stepSequenceMonth}>repeat</button>
                    </div>
                    <div className={'stepSequencerPluginsPanel' + stepSequenceMonth}
                        onClick={() => console.log(user)}></div>
                </div>
            </div>
            
        </div>
    )
}

export default StepSequencer;