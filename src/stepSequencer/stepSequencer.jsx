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


function StepSequencer(user, seq) {
    
    let beatDigits;
    
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
    
    const [stepSequenceMonth, setStepSequenceMonth] = useState('_JanuaryA');
    const [stepSequencerState, setStepSequencerState] = useState('_Active');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [sequence, setSequence] = useState({
        duration: {
            bar: 25,
            beat: 1,
            ticks: 0
        },
        header: {
            author: user.uuid,
            name: 'seq 1'
        }
    });
    const [currentPosition, setCurrentPosition] = useState({
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
    
    const setInitialTempoBase = (oldBase) => {
        let deepCopy = {...tempoTrack};
        let deepCurrent = {...currentTempo};
        
        switch(oldBase) {
            case('dottedEighthNote'):
                deepCurrent.tempoBase = 'quarter';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'quarter';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCurrent.tempoBase = 'wholeNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'wholeNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'sixtyFourthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixtyFourthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCurrent.tempoBase = 'halfNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'halfNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCurrent.tempoBase = 'eighthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'eighthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCurrent.tempoBase = 'thirtySecondNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'thirtySecondNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCurrent.tempoBase = 'sixteenthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixteenthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCurrent.tempoBase = 'doubleWholeNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'doubleWholeNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCurrent.tempoBase = 'oneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 256);
                deepCopy.tick[0].tempoBase = 'oneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 256);
                break;
            case('eighthNote'):
                deepCurrent.tempoBase = 'dottedEighthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedEighthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 2) /3;
                break;
                break;
            case('halfNote'):
                deepCurrent.tempoBase = 'dottedHalf';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedHalf';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCurrent.tempoBase = 'dottedQuarter';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedQuarter';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCurrent.tempoBase = 'dottedSixteenthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixteenthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCurrent.tempoBase = 'dottedSixtyFourthNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixtyFourthNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCurrent.tempoBase = 'dottedThirtySecondNote';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedThirtySecondNote';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCurrent.tempoBase = 'dottedWhole';
                deepCurrent.tempo = (parseInt(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedWhole';
                deepCopy.tick[0].tempo = (parseInt(deepCopy.tick[0].tempo) / 3) * 2;
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
            elapsedTime += ((60000 / parseInt(cell1.tempo)) * parseInt(cell1.meterNumerator) * bars);
        }
        beats = (parseInt(cell2.beat) - parseInt(cell1.beat));
        elapsedTime += ((60000 / parseInt(cell1.tempo)) * beats);
        ticks = (parseInt(cell2.ticks) - parseInt(cell1.ticks));
        elapsedTime += ((60000 / parseInt(cell1.tempo)) / getTickMax(parseInt(cell1.meterDenominator)));
        
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
    
    const updateBeatPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        
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
                deepCopy.measure.beat = currentMeter.numerator;
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
    
    const updateTickPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        const maxValue = parseInt(getMaxTick());
        
        if (parseInt(val) > maxValue) {
            return;
        }
        
        if (parseInt(val) === maxValue) {
            if (deepCopy.measure.beat === currentMeter.numerator) {
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
                    deepCopy.measure.beat = parseInt(currentMeter.numerator);
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
            if (position.bar > tempoTrack.tick[index].bar) {
                calcTicks += (position.bar - tempoTrack.tick[index].bar) * ((60000 / tempo) * meterNumerator);
            }
            if (position.beat > tempoTrack.tick[index].beat) {
                calcTicks += ((60000 / tempo) * (position.beat - tempoTrack.tick[index].beat));
            }
            calcTicks += (position.ticks - tempoTrack.tick[index].ticks) * (60000 / tempo / getTickMax(meterDenominator));
            cumulative += calcTicks;
            return convertMillisecondsToString(cumulative);
        }
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
                    </div>
                    <div className={'stepSequencerShuttleControls' + stepSequenceMonth}></div>
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
                            <p className={'stepSequencerDisplayCurrentMeterNumerator' + stepSequenceMonth}> = {currentTempo.tempo}</p>
                        </div>
                        <div className={'stepSequencerTempoTrackTracker' + stepSequenceMonth}>
                            {tempoTrack.tick.map(eve => (
                                <div className={'stepSequencerTempoEventLine' + ((eve.bar === currentPosition.measure.bar) && (eve.beat === currentPosition.measure.beat) && (eve.ticks === currentPosition.measure.ticks)) + stepSequenceMonth}
                                    key={eve.cumulativeTime}>
                                    {(eve.cumulativeTime === 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <p className={'stepSequencerTempoTrackDisplayLine' + stepSequenceMonth}>{eve.bar}. {eve.beat}. {eve.ticks}</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth}  
                                                onChange={(e) => setInitialMeterNumerator(e.target.value)}
                                                type="number" 
                                                value={eve.meterNumerator} />
                                            <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
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
                                                value={eve.tempo} />
                                        </div>
                                    )}
                                    {(eve.cumulativeTime !== 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                type="number"
                                                value={eve.bar} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                type="number"
                                                value={eve.beat} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                type="number"
                                                value={eve.ticks} />
                                            {(eve.meterChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth}  
                                                    type="number" 
                                                    value={eve.meterNumerator} />
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                                    <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
                                                    type="number" 
                                                    value={eve.meterDenominator} />
                                                </div>
                                            )}
                                            {(eve.tempoChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    {(eve.tempoBase === 'quarter') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={quarterNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedQuarter') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'halfNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={halfNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedHalf') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'wholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={wholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedWhole') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'doubleWholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={doubleWholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'oneHundredTwentyEighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={oneHundredTwentyEighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixtyFourthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={sixtyfourthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixtyFourthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'thirtySecondNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={thirtySecondNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedThirtySecondNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixteenthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={sixteenthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixteenthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'eighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={eighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                        src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>=</p>
                                                    <input className={'stepSequencerTempoTrackTempoInput' + stepSequenceMonth}
                                                        max="1000.000"
                                                        min="0.001"
                                                        step="0.001"
                                                        type="number" 
                                                        value={eve.tempo} />
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
                    </div>
                    <div className={'stepSequencerTracking' + stepSequenceMonth}></div>
                    <div className={'stepSequencerInputsControl' + stepSequenceMonth}></div>
                    <div className={'stepSequencerPluginsPanel' + stepSequenceMonth}></div>
                </div>
            </div>
            
        </div>
    )
}

export default StepSequencer;