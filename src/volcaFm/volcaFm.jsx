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
import './volcaFm.style.jana.css';
import midi5pin from '../img/midi5pin.svg';

function VolcaFm() {
    
    const keyOnOffset = 20;
    const envelopeGraphTopVal = 220;
    const rateScaler = 0.85;
    const keyOffOnset = 320;
    const envelopeEndGraph = 410;
    const breakpointOffset = 4;
    const scaleScaler = 1.12;

    let midiOutput = null;
    let inputs = null;
    let outputs = null;
    let midiChannel = 0;
    let rootNote = 60;
    let keyEngaged = {
        q: false,
        2: false,
        w: false
    }

    const [volcaFmMonth, setVolcaFmMonth] = useState('_JanuaryA');
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [currentAlgorithm, setCurrentAlgorithm] = useState('_algorithm1');
    const [currentAlgorithmNumerical, setCurrentAlgorithmNumerical] = useState(1);
    const [operatorEditorState, setOperatorEditorState] = useState({
        operator1: {
            state: 'operator1EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator2: {
            state: 'operator2EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator3: {
            state: 'operator3EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator4: {
            state: 'operator4EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        },
        operator5: {
            state: 'operator5EditStateInactive',
            envelopeTab: 'operatorEditorTabActive',
            scalingTab: 'operatorEditorTabInactive',
            tuningTab: 'operatorEditorTabInactive'
        }
    });
    const [envelopeLevelState, setEnvelopeLevelState] = useState({
        operator1: {
            envelopeState: 'operator1EnvelopeStateInactive',
            levelState: 'operator1EnvelopeLevelStateInactive'
        },
        operator2: {
            envelopeState: 'operator2EnvelopeStateInactive',
            levelState: 'operator2EnvelopeLevelStateInactive'
        },
        operator3: {
            envelopeState: 'operator3EnvelopeStateInactive',
            levelState: 'operator3EnvelopeLevelStateInactive'
        },
        operator4: {
            envelopeState: 'operator4EnvelopeStateInactive',
            levelState: 'operator4EnvelopeLevelStateInactive'
        },
        operator5: {
            envelopeState: 'operator5EnvelopeStateInactive',
            levelState: 'operator5EnvelopeLevelStateInactive'
        }
    });
    const [operatorParams, setOperatorParams] = useState({
        operator1: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator2: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator3: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator4: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        },
        operator5: {
            operatorOn: 'On',
            outputLevel: 75,
            envelopeR1: 20,
            envelopeL1: 90,
            envelopeR2: 55,
            envelopeL2: 67,
            envelopeR3: 73,
            envelopeL3: 50,
            envelopeR4: 25,
            envelopeL4: 0,
            levelScaleBreakPoint: 60,
            levelScaleLeftDepth: 50,
            levelScaleLeftCurve: 0,
            levelScaleRightDepth: 50,
            levelScaleRightCurve: 3,
            oscMode: 0,
            freqCoarse: 1,
            freqFine: 0,
            detune: 7,
            oscRateScale: 0,
            amplitudeModSense: 0,
            keyVelocitySense: 4
        }
    });
    
    const updateDisplayPort = (op, purpose) => {
        let op1EnvState = envelopeLevelState.operator1.envelopeState;
        let op1levelState = envelopeLevelState.operator1.levelState;
        let op2EnvState = envelopeLevelState.operator2.envelopeState;
        let op2levelState = envelopeLevelState.operator2.levelState;
        let op3EnvState = envelopeLevelState.operator3.envelopeState;
        let op3levelState = envelopeLevelState.operator3.levelState;
        let op4EnvState = envelopeLevelState.operator4.envelopeState;
        let op4levelState = envelopeLevelState.operator4.levelState;
        let op5EnvState = envelopeLevelState.operator5.envelopeState;
        let op5levelState = envelopeLevelState.operator5.levelState;
        switch(op) {
            case(1):
                switch(purpose) {
                    case('envelope'):
                        op1EnvState = 'operator1EnvelopeStateActive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    case('scaling'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateActive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');
                }
                break;
            case(2):
                switch(purpose) {
                    case('envelope'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateActive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    case('scaling'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateActive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(3):
                switch(purpose) {
                    case('envelope'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateActive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    case('scaling'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateActive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(4):
                switch(purpose) {
                    case('envelope'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateActive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    case('scaling'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateActive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            case(5):
                switch(purpose) {
                    case('envelope'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateActive';
                        op5levelState = 'operator5EnvelopeLevelStateInactive';
                        break;
                    case('scaling'):
                        op1EnvState = 'operator1EnvelopeStateInactive';
                        op1levelState = 'operator1EnvelopeLevelStateInactive';
                        op2EnvState = 'operator2EnvelopeStateInactive';
                        op2levelState = 'operator2EnvelopeLevelStateInactive';
                        op3EnvState = 'operator3EnvelopeStateInactive';
                        op3levelState = 'operator3EnvelopeLevelStateInactive';
                        op4EnvState = 'operator4EnvelopeStateInactive';
                        op4levelState = 'operator4EnvelopeLevelStateInactive';
                        op5EnvState = 'operator5EnvelopeStateInactive';
                        op5levelState = 'operator5EnvelopeLevelStateActive';
                        break;
                    default:
                        console.log('impossible purpose');    
                }
                break;
            default:
                console.log('impossible op');
        }
        setEnvelopeLevelState({
            operator1: {
                envelopeState: op1EnvState,
                levelState: op1levelState
            },
            operator2: {
                envelopeState: op2EnvState,
                levelState: op2levelState
            },
            operator3: {
                envelopeState: op3EnvState,
                levelState: op3levelState
            },
            operator4: {
                envelopeState: op4EnvState,
                levelState: op4levelState
            },
            operator5: {
                envelopeState: op5EnvState,
                levelState: op5levelState
            }
        });
    }
    
    const toggleOscMode = (op) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                if (op1OscMode === 0) {
                    op1OscMode = 1;
                } else {
                    op1OscMode = 0;
                }
                break;
            case(2):
              if (op2OscMode === 0) {
                    op2OscMode = 1;
                } else {
                    op2OscMode = 0;
                }
                break;
            case(3):
              if (op3OscMode === 0) {
                    op3OscMode = 1;
                } else {
                    op3OscMode = 0;
                }
                break;
            case(4):
              if (op4OscMode === 0) {
                    op4OscMode = 1;
                } else {
                    op4OscMode = 0;
                }
                break;
            case(5):
              if (op5OscMode === 0) {
                    op5OscMode = 1;
                } else {
                    op5OscMode = 0;
                }
                break;
            default:
                console.log('impossible Osc Mode value');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }
    
    const operatorTuning = (op, tune, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                switch(tune) {
                    case('coarse'):
                        op1FreqCoarse = val;
                        break;
                    case('fine'):
                        op1FreqFine = val;
                        break;
                    case('detune'):
                        op1Detune = val;
                        break;
                    case('oscRate'):
                        op1OscRateScale = val;
                        break;
                    case('ams'):
                        op1AmplitudeModSense = val;
                        break;
                    case('kvs'):
                        op1KeyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (2):
                switch(tune) {
                    case('coarse'):
                        op2FreqCoarse = val;
                        break;
                    case('fine'):
                        op2FreqFine = val;
                        break;
                    case('detune'):
                        op2Detune = val;
                        break;
                    case('oscRate'):
                        op2OscRateScale = val;
                        break;
                    case('ams'):
                        op2AmplitudeModSense = val;
                        break;
                    case('kvs'):
                        op2KeyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (3):
                switch(tune) {
                    case('coarse'):
                        op3FreqCoarse = val;
                        break;
                    case('fine'):
                        op3FreqFine = val;
                        break;
                    case('detune'):
                        op3Detune = val;
                        break;
                    case('oscRate'):
                        op3OscRateScale = val;
                        break;
                    case('ams'):
                        op3AmplitudeModSense = val;
                        break;
                    case('kvs'):
                        op3KeyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (4):
                switch(tune) {
                    case('coarse'):
                        op4FreqCoarse = val;
                        break;
                    case('fine'):
                        op4FreqFine = val;
                        break;
                    case('detune'):
                        op4Detune = val;
                        break;
                    case('oscRate'):
                        op4OscRateScale = val;
                        break;
                    case('ams'):
                        op4AmplitudeModSense = val;
                        break;
                    case('kvs'):
                        op4KeyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            case (5):
                switch(tune) {
                    case('coarse'):
                        op5FreqCoarse = val;
                        break;
                    case('fine'):
                        op5FreqFine = val;
                        break;
                    case('detune'):
                        op5Detune = val;
                        break;
                    case('oscRate'):
                        op5OscRateScale = val;
                        break;
                    case('ams'):
                        op5AmplitudeModSense = val;
                        break;
                    case('kvs'):
                        op5KeyVelocitySense = val;
                        break;
                    default:
                        console.log('impossible tune');
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const changeCurveDepth = (op, side, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                if (side === 'left') {
                    op1LvlScaleLeftDepth = val;
                } else {
                    op1LvlScaleRightDepth = val;
                }
                break;
            case (2):
                if (side === 'left') {
                    op2LvlScaleLeftDepth = val;
                } else {
                    op2LvlScaleRightDepth = val;
                }
                break;
            case (3):
                if (side === 'left') {
                    op3LvlScaleLeftDepth = val;
                } else {
                    op3LvlScaleRightDepth = val;
                }
                break;
            case (4):
                if (side === 'left') {
                    op4LvlScaleLeftDepth = val;
                } else {
                    op4LvlScaleRightDepth = val;
                }
                break;
            case (5):
                if (side === 'left') {
                    op5LvlScaleLeftDepth = val;
                } else {
                    op5LvlScaleRightDepth = val;
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const setCurveValue = (op, side, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                if (side === 'left') {
                    op1LvlScaleLeftCurve = parseInt(val);
                } else {
                    op1LvlScaleRightCurve = parseInt(val);
                }
                break;
            case (2):
                if (side === 'left') {
                    op2LvlScaleLeftCurve = parseInt(val);
                } else {
                    op2LvlScaleRightCurve = parseInt(val);
                }
                break;
            case (3):
                if (side === 'left') {
                    op3LvlScaleLeftCurve = parseInt(val);
                } else {
                    op3LvlScaleRightCurve = parseInt(val);
                }
                break;
            case (4):
                if (side === 'left') {
                    op4LvlScaleLeftCurve = parseInt(val);
                } else {
                    op4LvlScaleRightCurve = parseInt(val);
                }
                break;
            case (5):
                if (side === 'left') {
                    op5LvlScaleLeftCurve = parseInt(val);
                } else {
                    op5LvlScaleRightCurve = parseInt(val);
                }
                break;
            default:
                console.log('impossible curve value');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
        console.log(operatorParams);
    }

    const changeBreakPoint = (op, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                op1LvlScaleBreak = val;
                break;
            case (2):
                op2LvlScaleBreak = val;
                break;
            case (3):
                op3LvlScaleBreak = val;
                break;
            case (4):
                op4LvlScaleBreak = val;
                break;
            case (5):
                op5LvlScaleBreak = val;
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const handleOperatorLevel = (op, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;

        switch (op) {
            case (1):
                outLvl1 = val;
                break;
            case (2):
                outLvl2 = val;
                break;
            case (3):
                outLvl3 = val;
                break;
            case (4):
                outLvl4 = val;
                break;
            case (5):
                outLvl5 = val;
                break;
            default:
                console.log('impossible condition');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });

    }

    const changeLevel = (op, level, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let opOut1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                switch (level) {
                    case (1):
                        op1EnvL1 = val;
                        break;
                    case (2):
                        op1EnvL2 = val;
                        break;
                    case (3):
                        op1EnvL3 = val;
                        break;
                    case (4):
                        op1EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (2):
                switch (level) {
                    case (1):
                        op2EnvL1 = val;
                        break;
                    case (2):
                        op2EnvL2 = val;
                        break;
                    case (3):
                        op2EnvL3 = val;
                        break;
                    case (4):
                        op2EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (3):
                switch (level) {
                    case (1):
                        op3EnvL1 = val;
                        break;
                    case (2):
                        op3EnvL2 = val;
                        break;
                    case (3):
                        op3EnvL3 = val;
                        break;
                    case (4):
                        op3EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (4):
                switch (level) {
                    case (1):
                        op4EnvL1 = val;
                        break;
                    case (2):
                        op4EnvL2 = val;
                        break;
                    case (3):
                        op4EnvL3 = val;
                        break;
                    case (4):
                        op4EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (5):
                switch (level) {
                    case (1):
                        op5EnvL1 = val;
                        break;
                    case (2):
                        op5EnvL2 = val;
                        break;
                    case (3):
                        op5EnvL3 = val;
                        break;
                    case (4):
                        op5EnvL4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: opOut1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const changeRate = (op, rate, val) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let opOut1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                switch (rate) {
                    case (1):
                        op1EnvR1 = val;
                        break;
                    case (2):
                        op1EnvR2 = val;
                        break;
                    case (3):
                        op1EnvR3 = val;
                        break;
                    case (4):
                        op1EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (2):
                switch (rate) {
                    case (1):
                        op2EnvR1 = val;
                        break;
                    case (2):
                        op2EnvR2 = val;
                        break;
                    case (3):
                        op2EnvR3 = val;
                        break;
                    case (4):
                        op2EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (3):
                switch (rate) {
                    case (1):
                        op3EnvR1 = val;
                        break;
                    case (2):
                        op3EnvR2 = val;
                        break;
                    case (3):
                        op3EnvR3 = val;
                        break;
                    case (4):
                        op3EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (4):
                switch (rate) {
                    case (1):
                        op4EnvR1 = val;
                        break;
                    case (2):
                        op4EnvR2 = val;
                        break;
                    case (3):
                        op4EnvR3 = val;
                        break;
                    case (4):
                        op4EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            case (5):
                switch (rate) {
                    case (1):
                        op5EnvR1 = val;
                        break;
                    case (2):
                        op5EnvR2 = val;
                        break;
                    case (3):
                        op5EnvR3 = val;
                        break;
                    case (4):
                        op5EnvR4 = val;
                        break;
                    default:
                        console.log('impossible rate');
                }
                break;
            default:
                console.log('impossible operator');
        }
        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: opOut1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const handleOpOnOffClick = (op) => {
        let opOn1 = operatorParams.operator1.operatorOn;
        let outLvl1 = operatorParams.operator1.outputLevel;
        let op1EnvR1 = operatorParams.operator1.envelopeR1;
        let op1EnvL1 = operatorParams.operator1.envelopeL1;
        let op1EnvR2 = operatorParams.operator1.envelopeR2;
        let op1EnvL2 = operatorParams.operator1.envelopeL2;
        let op1EnvR3 = operatorParams.operator1.envelopeR3;
        let op1EnvL3 = operatorParams.operator1.envelopeL3;
        let op1EnvR4 = operatorParams.operator1.envelopeR4;
        let op1EnvL4 = operatorParams.operator1.envelopeL4;
        let op1LvlScaleBreak = operatorParams.operator1.levelScaleBreakPoint;
        let op1LvlScaleLeftDepth = operatorParams.operator1.levelScaleLeftDepth;
        let op1LvlScaleLeftCurve = parseInt(operatorParams.operator1.levelScaleLeftCurve);
        let op1LvlScaleRightDepth = operatorParams.operator1.levelScaleRightDepth;
        let op1LvlScaleRightCurve = parseInt(operatorParams.operator1.levelScaleRightCurve);
        let op1OscMode = operatorParams.operator1.oscMode;
        let op1FreqCoarse = operatorParams.operator1.freqCoarse;
        let op1FreqFine = operatorParams.operator1.freqFine;
        let op1Detune = operatorParams.operator1.detune;
        let op1OscRateScale = operatorParams.operator1.oscRateScale;
        let op1AmplitudeModSense = operatorParams.operator1.amplitudeModSense;
        let op1KeyVelocitySense = operatorParams.operator1.keyVelocitySense;
        let opOn2 = operatorParams.operator2.operatorOn;
        let outLvl2 = operatorParams.operator2.outputLevel;
        let op2EnvR1 = operatorParams.operator2.envelopeR1;
        let op2EnvL1 = operatorParams.operator2.envelopeL1;
        let op2EnvR2 = operatorParams.operator2.envelopeR2;
        let op2EnvL2 = operatorParams.operator2.envelopeL2;
        let op2EnvR3 = operatorParams.operator2.envelopeR3;
        let op2EnvL3 = operatorParams.operator2.envelopeL3;
        let op2EnvR4 = operatorParams.operator2.envelopeR4;
        let op2EnvL4 = operatorParams.operator2.envelopeL4;
        let op2LvlScaleBreak = operatorParams.operator2.levelScaleBreakPoint;
        let op2LvlScaleLeftDepth = operatorParams.operator2.levelScaleLeftDepth;
        let op2LvlScaleLeftCurve = parseInt(operatorParams.operator2.levelScaleLeftCurve);
        let op2LvlScaleRightDepth = operatorParams.operator2.levelScaleRightDepth;
        let op2LvlScaleRightCurve = parseInt(operatorParams.operator2.levelScaleRightCurve);
        let op2OscMode = operatorParams.operator2.oscMode;
        let op2FreqCoarse = operatorParams.operator2.freqCoarse;
        let op2FreqFine = operatorParams.operator2.freqFine;
        let op2Detune = operatorParams.operator2.detune;
        let op2OscRateScale = operatorParams.operator2.oscRateScale;
        let op2AmplitudeModSense = operatorParams.operator2.amplitudeModSense;
        let op2KeyVelocitySense = operatorParams.operator2.keyVelocitySense;
        let opOn3 = operatorParams.operator3.operatorOn;
        let outLvl3 = operatorParams.operator3.outputLevel;
        let op3EnvR1 = operatorParams.operator3.envelopeR1;
        let op3EnvL1 = operatorParams.operator3.envelopeL1;
        let op3EnvR2 = operatorParams.operator3.envelopeR2;
        let op3EnvL2 = operatorParams.operator3.envelopeL2;
        let op3EnvR3 = operatorParams.operator3.envelopeR3;
        let op3EnvL3 = operatorParams.operator3.envelopeL3;
        let op3EnvR4 = operatorParams.operator3.envelopeR4;
        let op3EnvL4 = operatorParams.operator3.envelopeL4;
        let op3LvlScaleBreak = operatorParams.operator3.levelScaleBreakPoint;
        let op3LvlScaleLeftDepth = operatorParams.operator3.levelScaleLeftDepth;
        let op3LvlScaleLeftCurve = parseInt(operatorParams.operator3.levelScaleLeftCurve);
        let op3LvlScaleRightDepth = operatorParams.operator3.levelScaleRightDepth;
        let op3LvlScaleRightCurve = parseInt(operatorParams.operator3.levelScaleRightCurve);
        let op3OscMode = operatorParams.operator3.oscMode;
        let op3FreqCoarse = operatorParams.operator3.freqCoarse;
        let op3FreqFine = operatorParams.operator3.freqFine;
        let op3Detune = operatorParams.operator3.detune;
        let op3OscRateScale = operatorParams.operator3.oscRateScale;
        let op3AmplitudeModSense = operatorParams.operator3.amplitudeModSense;
        let op3KeyVelocitySense = operatorParams.operator3.keyVelocitySense;
        let opOn4 = operatorParams.operator4.operatorOn;
        let outLvl4 = operatorParams.operator4.outputLevel;
        let op4EnvR1 = operatorParams.operator4.envelopeR1;
        let op4EnvL1 = operatorParams.operator4.envelopeL1;
        let op4EnvR2 = operatorParams.operator4.envelopeR2;
        let op4EnvL2 = operatorParams.operator4.envelopeL2;
        let op4EnvR3 = operatorParams.operator4.envelopeR3;
        let op4EnvL3 = operatorParams.operator4.envelopeL3;
        let op4EnvR4 = operatorParams.operator4.envelopeR4;
        let op4EnvL4 = operatorParams.operator4.envelopeL4;
        let op4LvlScaleBreak = operatorParams.operator4.levelScaleBreakPoint;
        let op4LvlScaleLeftDepth = operatorParams.operator4.levelScaleLeftDepth;
        let op4LvlScaleLeftCurve = parseInt(operatorParams.operator4.levelScaleLeftCurve);
        let op4LvlScaleRightDepth = operatorParams.operator4.levelScaleRightDepth;
        let op4LvlScaleRightCurve = parseInt(operatorParams.operator4.levelScaleRightCurve);
        let op4OscMode = operatorParams.operator4.oscMode;
        let op4FreqCoarse = operatorParams.operator4.freqCoarse;
        let op4FreqFine = operatorParams.operator4.freqFine;
        let op4Detune = operatorParams.operator4.detune;
        let op4OscRateScale = operatorParams.operator4.oscRateScale;
        let op4AmplitudeModSense = operatorParams.operator4.amplitudeModSense;
        let op4KeyVelocitySense = operatorParams.operator4.keyVelocitySense;
        let opOn5 = operatorParams.operator5.operatorOn;
        let outLvl5 = operatorParams.operator5.outputLevel;
        let op5EnvR1 = operatorParams.operator5.envelopeR1;
        let op5EnvL1 = operatorParams.operator5.envelopeL1;
        let op5EnvR2 = operatorParams.operator5.envelopeR2;
        let op5EnvL2 = operatorParams.operator5.envelopeL2;
        let op5EnvR3 = operatorParams.operator5.envelopeR3;
        let op5EnvL3 = operatorParams.operator5.envelopeL3;
        let op5EnvR4 = operatorParams.operator5.envelopeR4;
        let op5EnvL4 = operatorParams.operator5.envelopeL4;
        let op5LvlScaleBreak = operatorParams.operator5.levelScaleBreakPoint;
        let op5LvlScaleLeftDepth = operatorParams.operator5.levelScaleLeftDepth;
        let op5LvlScaleLeftCurve = parseInt(operatorParams.operator5.levelScaleLeftCurve);
        let op5LvlScaleRightDepth = operatorParams.operator5.levelScaleRightDepth;
        let op5LvlScaleRightCurve = parseInt(operatorParams.operator5.levelScaleRightCurve);
        let op5OscMode = operatorParams.operator5.oscMode;
        let op5FreqCoarse = operatorParams.operator5.freqCoarse;
        let op5FreqFine = operatorParams.operator5.freqFine;
        let op5Detune = operatorParams.operator5.detune;
        let op5OscRateScale = operatorParams.operator5.oscRateScale;
        let op5AmplitudeModSense = operatorParams.operator5.amplitudeModSense;
        let op5KeyVelocitySense = operatorParams.operator5.keyVelocitySense;
        switch (op) {
            case (1):
                if (operatorParams.operator1.operatorOn === 'On') {
                    opOn1 = 'Off';
                } else {
                    opOn1 = 'On';
                }
                break;
            case (2):
                if (operatorParams.operator2.operatorOn === 'On') {
                    opOn2 = 'Off';
                } else {
                    opOn2 = 'On';
                }
                break;
            case (3):
                if (operatorParams.operator3.operatorOn === 'On') {
                    opOn3 = 'Off';
                } else {
                    opOn3 = 'On';
                }
                break;
            case (4):
                if (operatorParams.operator4.operatorOn === 'On') {
                    opOn4 = 'Off';
                } else {
                    opOn4 = 'On';
                }
                break;
            case (5):
                if (operatorParams.operator5.operatorOn === 'On') {
                    opOn5 = 'Off';
                } else {
                    opOn5 = 'On';
                }
                break;
            default:
                console.log('impossible onoff');
        }

        setOperatorParams({
            operator1: {
                operatorOn: opOn1,
                outputLevel: outLvl1,
                envelopeR1: op1EnvR1,
                envelopeL1: op1EnvL1,
                envelopeR2: op1EnvR2,
                envelopeL2: op1EnvL2,
                envelopeR3: op1EnvR3,
                envelopeL3: op1EnvL3,
                envelopeR4: op1EnvR4,
                envelopeL4: op1EnvL4,
                levelScaleBreakPoint: op1LvlScaleBreak,
                levelScaleLeftDepth: op1LvlScaleLeftDepth,
                levelScaleLeftCurve: op1LvlScaleLeftCurve,
                levelScaleRightDepth: op1LvlScaleRightDepth,
                levelScaleRightCurve: op1LvlScaleRightCurve,
                oscMode: op1OscMode,
                freqCoarse: op1FreqCoarse,
                freqFine: op1FreqFine,
                detune: op1Detune,
                oscRateScale: op1OscRateScale,
                amplitudeModSense: op1AmplitudeModSense,
                keyVelocitySense: op1KeyVelocitySense
            },
            operator2: {
                operatorOn: opOn2,
                outputLevel: outLvl2,
                envelopeR1: op2EnvR1,
                envelopeL1: op2EnvL1,
                envelopeR2: op2EnvR2,
                envelopeL2: op2EnvL2,
                envelopeR3: op2EnvR3,
                envelopeL3: op2EnvL3,
                envelopeR4: op2EnvR4,
                envelopeL4: op2EnvL4,
                levelScaleBreakPoint: op2LvlScaleBreak,
                levelScaleLeftDepth: op2LvlScaleLeftDepth,
                levelScaleLeftCurve: op2LvlScaleLeftCurve,
                levelScaleRightDepth: op2LvlScaleRightDepth,
                levelScaleRightCurve: op2LvlScaleRightCurve,
                oscMode: op2OscMode,
                freqCoarse: op2FreqCoarse,
                freqFine: op2FreqFine,
                detune: op2Detune,
                oscRateScale: op2OscRateScale,
                amplitudeModSense: op2AmplitudeModSense,
                keyVelocitySense: op2KeyVelocitySense
            },
            operator3: {
                operatorOn: opOn3,
                outputLevel: outLvl3,
                envelopeR1: op3EnvR1,
                envelopeL1: op3EnvL1,
                envelopeR2: op3EnvR2,
                envelopeL2: op3EnvL2,
                envelopeR3: op3EnvR3,
                envelopeL3: op3EnvL3,
                envelopeR4: op3EnvR4,
                envelopeL4: op3EnvL4,
                levelScaleBreakPoint: op3LvlScaleBreak,
                levelScaleLeftDepth: op3LvlScaleLeftDepth,
                levelScaleLeftCurve: op3LvlScaleLeftCurve,
                levelScaleRightDepth: op3LvlScaleRightDepth,
                levelScaleRightCurve: op3LvlScaleRightCurve,
                oscMode: op3OscMode,
                freqCoarse: op3FreqCoarse,
                freqFine: op3FreqFine,
                detune: op3Detune,
                oscRateScale: op3OscRateScale,
                amplitudeModSense: op3AmplitudeModSense,
                keyVelocitySense: op3KeyVelocitySense
            },
            operator4: {
                operatorOn: opOn4,
                outputLevel: outLvl4,
                envelopeR1: op4EnvR1,
                envelopeL1: op4EnvL1,
                envelopeR2: op4EnvR2,
                envelopeL2: op4EnvL2,
                envelopeR3: op4EnvR3,
                envelopeL3: op4EnvL3,
                envelopeR4: op4EnvR4,
                envelopeL4: op4EnvL4,
                levelScaleBreakPoint: op4LvlScaleBreak,
                levelScaleLeftDepth: op4LvlScaleLeftDepth,
                levelScaleLeftCurve: op4LvlScaleLeftCurve,
                levelScaleRightDepth: op4LvlScaleRightDepth,
                levelScaleRightCurve: op4LvlScaleRightCurve,
                oscMode: op4OscMode,
                freqCoarse: op4FreqCoarse,
                freqFine: op4FreqFine,
                detune: op4Detune,
                oscRateScale: op4OscRateScale,
                amplitudeModSense: op4AmplitudeModSense,
                keyVelocitySense: op4KeyVelocitySense
            },
            operator5: {
                operatorOn: opOn5,
                outputLevel: outLvl5,
                envelopeR1: op5EnvR1,
                envelopeL1: op5EnvL1,
                envelopeR2: op5EnvR2,
                envelopeL2: op5EnvL2,
                envelopeR3: op5EnvR3,
                envelopeL3: op5EnvL3,
                envelopeR4: op5EnvR4,
                envelopeL4: op5EnvL4,
                levelScaleBreakPoint: op5LvlScaleBreak,
                levelScaleLeftDepth: op5LvlScaleLeftDepth,
                levelScaleLeftCurve: op5LvlScaleLeftCurve,
                levelScaleRightDepth: op5LvlScaleRightDepth,
                levelScaleRightCurve: op5LvlScaleRightCurve,
                oscMode: op5OscMode,
                freqCoarse: op5FreqCoarse,
                freqFine: op5FreqFine,
                detune: op5Detune,
                oscRateScale: op5OscRateScale,
                amplitudeModSense: op5AmplitudeModSense,
                keyVelocitySense: op5KeyVelocitySense
            }
        });
    }

    const handleOperatorClick = (op) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        let state2 = operatorEditorState.operator2.state;
        let envelope2 = operatorEditorState.operator2.envelopeTab;
        let scaling2 = operatorEditorState.operator2.scalingTab;
        let tuning2 = operatorEditorState.operator2.tuningTab;
        let state3 = operatorEditorState.operator3.state;
        let envelope3 = operatorEditorState.operator3.envelopeTab;
        let scaling3 = operatorEditorState.operator3.scalingTab;
        let tuning3 = operatorEditorState.operator3.tuningTab;
        let state4 = operatorEditorState.operator4.state;
        let envelope4 = operatorEditorState.operator4.envelopeTab;
        let scaling4 = operatorEditorState.operator4.scalingTab;
        let tuning4 = operatorEditorState.operator4.tuningTab;
        let state5 = operatorEditorState.operator5.state;
        let envelope5 = operatorEditorState.operator5.envelopeTab;
        let scaling5 = operatorEditorState.operator5.scalingTab;
        let tuning5 = operatorEditorState.operator5.tuningTab;
        switch (op) {
            case (1):
                if (operatorEditorState.operator1.state === 'operator1EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                } else {
                    state1 = 'operator1EditStateActive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                }
                break;
            case (2):
                if (operatorEditorState.operator2.state === 'operator2EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateActive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                }
                break;
            case (3):
                if (operatorEditorState.operator3.state === 'operator3EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateActive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                }
                break;
            case (4):
                if (operatorEditorState.operator4.state === 'operator4EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateActive';
                    state5 = 'operator5EditStateInactive';
                }
                break;
            case (5):
                if (operatorEditorState.operator5.state === 'operator4EditStateActive') {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateInactive';
                } else {
                    state1 = 'operator1EditStateInactive';
                    state2 = 'operator2EditStateInactive';
                    state3 = 'operator3EditStateInactive';
                    state4 = 'operator4EditStateInactive';
                    state5 = 'operator5EditStateActive';
                }
                break;
            default:
                console.log('impossible state');
        }

        setOperatorEditorState({
            operator1: {
                state: state1,
                envelopeTab: envelope1,
                scalingTab: scaling1,
                tuningTab: tuning1
            },
            operator2: {
                state: state2,
                envelopeTab: envelope2,
                scalingTab: scaling2,
                tuningTab: tuning2
            },
            operator3: {
                state: state3,
                envelopeTab: envelope3,
                scalingTab: scaling3,
                tuningTab: tuning3
            },
            operator4: {
                state: state4,
                envelopeTab: envelope4,
                scalingTab: scaling4,
                tuningTab: tuning4
            },
            operator5: {
                state: state5,
                envelopeTab: envelope5,
                scalingTab: scaling5,
                tuningTab: tuning5
            }
        });
    }

    const handleOperatorTab = (op, tab) => {
        let state1 = operatorEditorState.operator1.state;
        let envelope1 = operatorEditorState.operator1.envelopeTab;
        let scaling1 = operatorEditorState.operator1.scalingTab;
        let tuning1 = operatorEditorState.operator1.tuningTab;
        let state2 = operatorEditorState.operator2.state;
        let envelope2 = operatorEditorState.operator2.envelopeTab;
        let scaling2 = operatorEditorState.operator2.scalingTab;
        let tuning2 = operatorEditorState.operator2.tuningTab;
        let state3 = operatorEditorState.operator3.state;
        let envelope3 = operatorEditorState.operator3.envelopeTab;
        let scaling3 = operatorEditorState.operator3.scalingTab;
        let tuning3 = operatorEditorState.operator3.tuningTab;
        let state4 = operatorEditorState.operator4.state;
        let envelope4 = operatorEditorState.operator4.envelopeTab;
        let scaling4 = operatorEditorState.operator4.scalingTab;
        let tuning4 = operatorEditorState.operator4.tuningTab;
        let state5 = operatorEditorState.operator5.state;
        let envelope5 = operatorEditorState.operator5.envelopeTab;
        let scaling5 = operatorEditorState.operator5.scalingTab;
        let tuning5 = operatorEditorState.operator5.tuningTab;
        switch (op) {
            case (1):
                switch (tab) {
                    case ('envelope'):
                        envelope1 = 'operatorEditorTabActive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabActive';
                        tuning1 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope1 = 'operatorEditorTabInactive';
                        scaling1 = 'operatorEditorTabInactive';
                        tuning1 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (2):
                switch (tab) {
                    case ('envelope'):
                        envelope2 = 'operatorEditorTabActive';
                        scaling2 = 'operatorEditorTabInactive';
                        tuning2 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope2 = 'operatorEditorTabInactive';
                        scaling2 = 'operatorEditorTabActive';
                        tuning2 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope2 = 'operatorEditorTabInactive';
                        scaling2 = 'operatorEditorTabInactive';
                        tuning2 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (3):
                switch (tab) {
                    case ('envelope'):
                        envelope3 = 'operatorEditorTabActive';
                        scaling3 = 'operatorEditorTabInactive';
                        tuning3 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope3 = 'operatorEditorTabInactive';
                        scaling3 = 'operatorEditorTabActive';
                        tuning3 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope3 = 'operatorEditorTabInactive';
                        scaling3 = 'operatorEditorTabInactive';
                        tuning3 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (4):
                switch (tab) {
                    case ('envelope'):
                        envelope4 = 'operatorEditorTabActive';
                        scaling4 = 'operatorEditorTabInactive';
                        tuning4 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope4 = 'operatorEditorTabInactive';
                        scaling4 = 'operatorEditorTabActive';
                        tuning4 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope4 = 'operatorEditorTabInactive';
                        scaling4 = 'operatorEditorTabInactive';
                        tuning4 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            case (5):
                switch (tab) {
                    case ('envelope'):
                        envelope5 = 'operatorEditorTabActive';
                        scaling5 = 'operatorEditorTabInactive';
                        tuning5 = 'operatorEditorTabInactive';
                        break;
                    case ('scaling'):
                        envelope5 = 'operatorEditorTabInactive';
                        scaling5 = 'operatorEditorTabActive';
                        tuning5 = 'operatorEditorTabInactive';
                        break;
                    case ('tuning'):
                        envelope5 = 'operatorEditorTabInactive';
                        scaling5 = 'operatorEditorTabInactive';
                        tuning5 = 'operatorEditorTabActive';
                        break;
                    default:
                        console.log('impossible tab');
                }
                break;
            default:
                console.log('impossible state');
        }
        setOperatorEditorState({
            operator1: {
                state: state1,
                envelopeTab: envelope1,
                scalingTab: scaling1,
                tuningTab: tuning1
            },
            operator2: {
                state: state2,
                envelopeTab: envelope2,
                scalingTab: scaling2,
                tuningTab: tuning2
            },
            operator3: {
                state: state3,
                envelopeTab: envelope3,
                scalingTab: scaling3,
                tuningTab: tuning3
            },
            operator4: {
                state: state4,
                envelopeTab: envelope4,
                scalingTab: scaling4,
                tuningTab: tuning4
            },
            operator5: {
                state: state5,
                envelopeTab: envelope5,
                scalingTab: scaling5,
                tuningTab: tuning5
            }
        });
    }

    const changeAlgorithm = (val) => {
        setCurrentAlgorithmNumerical(val);
        setCurrentAlgorithm('_algorithm' + val.toString());
    }

    const calculateBreakpointPitch = (val) => {
        let note = '';
        switch (val % 12) {
            case (0):
                note += 'C ';
                break;
            case (1):
                note += 'C# ';
                break;
            case (2):
                note += 'D ';
                break;
            case (3):
                note += 'Eb ';
                break;
            case (4):
                note += 'E ';
                break;
            case (5):
                note += 'F ';
                break;
            case (6):
                note += 'F# ';
                break;
            case (7):
                note += 'G ';
                break;
            case (8):
                note += 'Ab ';
                break;
            case (9):
                note += 'A ';
                break;
            case (10):
                note += 'Bb ';
                break;
            case (11):
                note += 'B ';
                break;
            default:
                console.log('impossible note value');
        }
        if (val < 12) {
            note += '-1';
        } else if (val < 24) {
            note += '0';
        } else if (val < 36) {
            note += '1';
        } else if (val < 48) {
            note += '2';
        } else if (val < 60) {
            note += '3';
        } else if (val < 72) {
            note += '4';
        } else if (val < 84) {
            note += '5';
        } else if (val < 96) {
            note += '6';
        } else {
            note += '7';
        }

        return note;
    }

    const noteOnEvent = (key) => {
        switch (key.toLowerCase()) {
            case ('q'):
                if (!keyEngaged.q) {
                    keyEngaged.q = true;
                    midiOutput.send([0x90 | midiChannel, rootNote, 0x7f]);
                }
                break;
            case ('2'):
                if (!keyEngaged['2']) {
                    keyEngaged['2'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 1, 0x7f]);
                }
                break;
            case ('w'):
                if (!keyEngaged.w) {
                    keyEngaged.w = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 2, 0x7f]);
                }
                break;
            case ('3'):
                if (!keyEngaged['3']) {
                    keyEngaged['3'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 3, 0x7f]);
                }
                break;
            case ('e'):
                if (!keyEngaged.e) {
                    keyEngaged.e = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 4, 0x7f]);
                }
                break;
            case ('r'):
                if (!keyEngaged.r) {
                    keyEngaged.r = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 5, 0x7f]);
                }
                break;
            case ('5'):
                if (!keyEngaged['5']) {
                    keyEngaged['5'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 6, 0x7f]);
                }
                break;
            case ('t'):
                if (!keyEngaged.t) {
                    keyEngaged.t = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 7, 0x7f]);
                }
                break;
            case ('6'):
                if (!keyEngaged['6']) {
                    keyEngaged['6'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 8, 0x7f]);
                }
                break;
            case ('y'):
                if (!keyEngaged.y) {
                    keyEngaged.y = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 9, 0x7f]);
                }
                break;
            case ('7'):
                if (!keyEngaged['7']) {
                    keyEngaged['7'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 10, 0x7f]);
                }
                break;
            case ('u'):
                if (!keyEngaged.u) {
                    keyEngaged.u = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 11, 0x7f]);
                }
                break;
            case ('i'):
                if (!keyEngaged.i) {
                    keyEngaged.i = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 12, 0x7f]);
                }
                break;
            case ('9'):
                if (!keyEngaged['9']) {
                    keyEngaged['9'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 13, 0x7f]);
                }
                break;
            case ('o'):
                if (!keyEngaged.o) {
                    keyEngaged.o = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 14, 0x7f]);
                }
                break;
            case ('0'):
                if (!keyEngaged['0']) {
                    keyEngaged['0'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 15, 0x7f]);
                }
                break;
            case ('p'):
                if (!keyEngaged.p) {
                    keyEngaged.p = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 16, 0x7f]);
                }
                break;
            case ('['):
                if (!keyEngaged['[']) {
                    keyEngaged['['] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 17, 0x7f]);
                }
                break;
            case ('='):
                if (!keyEngaged['=']) {
                    keyEngaged['='] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 18, 0x7f]);
                }
                break;
            case (']'):
                if (!keyEngaged[']']) {
                    keyEngaged[']'] = true;
                    midiOutput.send([0x90 | midiChannel, rootNote + 19, 0x7f]);
                }
                break;
            default:
                console.log('no note');
        }
    }

    const noteOffEvent = (key) => {
        switch (key.toLowerCase()) {
            case ('q'):
                midiOutput.send([0x80 | midiChannel, rootNote, 0x7f]);
                keyEngaged.q = false;
                break;
            case ('2'):
                midiOutput.send([0x80 | midiChannel, rootNote + 1, 0x7f]);
                keyEngaged['2'] = false;
                break;
            case ('w'):
                midiOutput.send([0x80 | midiChannel, rootNote + 2, 0x7f]);
                keyEngaged.w = false;
                break;
            case ('3'):
                midiOutput.send([0x80 | midiChannel, rootNote + 3, 0x7f]);
                keyEngaged['3'] = false;
                break;
            case ('e'):
                midiOutput.send([0x80 | midiChannel, rootNote + 4, 0x7f]);
                keyEngaged.e = false;
                break;
            case ('r'):
                midiOutput.send([0x80 | midiChannel, rootNote + 5, 0x7f]);
                keyEngaged.r = false;
                break;
            case ('5'):
                midiOutput.send([0x80 | midiChannel, rootNote + 6, 0x7f]);
                keyEngaged['5'] = false;
                break;
            case ('t'):
                midiOutput.send([0x80 | midiChannel, rootNote + 7, 0x7f]);
                keyEngaged.t = false;
                break;
            case ('6'):
                midiOutput.send([0x80 | midiChannel, rootNote + 8, 0x7f]);
                keyEngaged['6'] = false;
                break;
            case ('y'):
                midiOutput.send([0x80 | midiChannel, rootNote + 9, 0x7f]);
                keyEngaged.y = false;
                break;
            case ('7'):
                midiOutput.send([0x80 | midiChannel, rootNote + 10, 0x7f]);
                keyEngaged['7'] = false;
                break;
            case ('u'):
                midiOutput.send([0x80 | midiChannel, rootNote + 11, 0x7f]);
                keyEngaged.u = false;
                break;
            case ('i'):
                midiOutput.send([0x80 | midiChannel, rootNote + 12, 0x7f]);
                keyEngaged.i = false;
                break;
            case ('9'):
                midiOutput.send([0x80 | midiChannel, rootNote + 13, 0x7f]);
                keyEngaged['9'] = false;
                break;
            case ('o'):
                midiOutput.send([0x80 | midiChannel, rootNote + 14, 0x7f]);
                keyEngaged.o = false;
                break;
            case ('0'):
                midiOutput.send([0x80 | midiChannel, rootNote + 15, 0x7f]);
                keyEngaged['0'] = false;
                break;
            case ('p'):
                midiOutput.send([0x80 | midiChannel, rootNote + 16, 0x7f]);
                keyEngaged.p = false;
                break;
            case ('['):
                midiOutput.send([0x80 | midiChannel, rootNote + 17, 0x7f]);
                keyEngaged['['] = false;
                break;
            case ('='):
                midiOutput.send([0x80 | midiChannel, rootNote + 18, 0x7f]);
                keyEngaged['='] = false;
                break;
            case (']'):
                midiOutput.send([0x80 | midiChannel, rootNote + 19, 0x7f]);
                keyEngaged[']'] = false;
                break;
            default:
                console.log('no note');
        }
    }

    function onMIDIFailure() {
        alert('No MIDI ports accessible');
    }

    function onMIDISuccess(midiAccess) {
        console.log(midiAccess);

        inputs = Array.from(midiAccess.inputs.values());
        outputs = Array.from(midiAccess.outputs.values());

        //        midiOutput = outputs[0];

        console.log(outputs);
        for (const output of outputs) {
            console.log(output);
            midiOutput = output;
        }
        console.log(midiOutput);

        //        midiOutput.send([0x90 | midiChannel, rootNote, 0x7f]);
        //        setTimeout(() => {
        //           midiOutput.send([0x80 | midiChannel, rootNote, 0x7f]); 
        //        }, 500);

    }

    function initiateMidiAccess() {
        navigator.requestMIDIAccess()
            .then(onMIDISuccess, onMIDIFailure);
    }

    initiateMidiAccess();
    
    function curveY1Value(op) {
        let val = 0;
        switch(op) {
            case(1):
                val = (envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler);
                break;
            default:
                console.log('impossible op');
        }
        
        return val.toString();
        
    }
    
    return ( 
        <div className={'volcaFmEditorContainer' + volcaFmMonth}
            tabIndex="1"
            onKeyDown={(e) => noteOnEvent(e.key)}
            onKeyUp={(e) => noteOffEvent(e.key)}>
            <div className={'volcaFmEditorImageDiv' + volcaFmMonth}>
                <div className={'volcaFmEditorTopBar' + volcaFmMonth}>
                    <NavLink to="/"><img className={'volcaFmNavImage' + volcaFmMonth}
                        src={midiImage}></img></NavLink>
                </div>
                <h3 className={'volcaFmEditorTitle' + volcaFmMonth}>Volca FM Editor</h3>
                <button className={'volcaFmPanicButton' + volcaFmMonth}>panic!</button>
                <div className={'volcaFmSidebarManager' + volcaFmMonth}>
                    <p>sidebar manager</p>
                </div>
                <div className={'volcaFmAlgorithmDisplay' + volcaFmMonth}>
                    <div className={'volcaFmAlgorithmContainer' + volcaFmMonth}>
                        <h2 className={'volcaFmAgorithmLabel' + volcaFmMonth}>Algorithm: </h2>
                        <input className={'volcaFmAlgorithmNumberInput' + volcaFmMonth}
                            max="32"
                            min="1"
                            onChange={(e) => changeAlgorithm(e.target.value)}
                            type="number"
                            value={currentAlgorithmNumerical}
                            ></input>
                        <div className={'volcaFmAlgorithSliderBorderDiv' + volcaFmMonth}><input className={'volcaFmAlgorithmSlider' + volcaFmMonth}
                            max="32"
                            min="1"
                            onChange={(e) => changeAlgorithm(e.target.value)}
                            type="range"
                            value={currentAlgorithmNumerical}></input></div>
                        {(operatorParams.operator1.operatorOn === 'Off') && (
                            <div className={'volcaFmAlgorithmOperator1' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(1)}
                            style={{opacity: '0.2'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>1</p>
                        </div>
                        )}
                        {(operatorParams.operator1.operatorOn === 'On') && (
                            <div className={'volcaFmAlgorithmOperator1' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(1)}
                            style={{ transform: 'scale(' + (0.6 + (operatorParams.operator1.outputLevel / 100)).toString() + ')'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>1</p>
                        </div>
                        )}
                        {(operatorParams.operator2.operatorOn === 'Off') && (
                            <div className={'volcaFmAlgorithmOperator2' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(2)}
                            style={{opacity: '0.2'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>2</p>
                        </div>
                        )}
                        {(operatorParams.operator2.operatorOn === 'On') && (
                            <div className={'volcaFmAlgorithmOperator2' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(2)}
                            style={{ transform: 'scale(' + (0.6 + (operatorParams.operator2.outputLevel / 100)).toString() + ')'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>2</p>
                        </div>
                        )}
                        {(operatorParams.operator3.operatorOn === 'Off') && (
                            <div className={'volcaFmAlgorithmOperator3' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(3)}
                            style={{opacity: '0.2'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>3</p>
                        </div>
                        )}
                        {(operatorParams.operator3.operatorOn === 'On') && (
                            <div className={'volcaFmAlgorithmOperator3' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(3)}
                            style={{ transform: 'scale(' + (0.6 + (operatorParams.operator3.outputLevel / 100)).toString() + ')'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>3</p>
                        </div>
                        )}
                        {(operatorParams.operator4.operatorOn === 'Off') && (
                            <div className={'volcaFmAlgorithmOperator4' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(4)}
                            style={{opacity: '0.2'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>4</p>
                        </div>
                        )}
                        {(operatorParams.operator4.operatorOn === 'On') && (
                            <div className={'volcaFmAlgorithmOperator4' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(4)}
                            style={{ transform: 'scale(' + (0.6 + (operatorParams.operator4.outputLevel / 100)).toString() + ')'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>4</p>
                        </div>
                        )}
                        {(operatorParams.operator5.operatorOn === 'Off') && (
                            <div className={'volcaFmAlgorithmOperator5' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(5)}
                            style={{opacity: '0.2'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>5</p>
                        </div>
                        )}
                        {(operatorParams.operator5.operatorOn === 'On') && (
                            <div className={'volcaFmAlgorithmOperator5' + currentAlgorithm + volcaFmMonth}
                            onClick={() => handleOperatorClick(5)}
                            style={{ transform: 'scale(' + (0.6 + (operatorParams.operator5.outputLevel / 100)).toString() + ')'}}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>5</p>
                        </div>
                        )}
                        
                        <div className={'volcaFmAlgorithmOperator6' + currentAlgorithm + volcaFmMonth}>
                            <p className={'volcaFmOperatorVisualLabel' + volcaFmMonth}>6</p>
                        </div>
                        <div className={'volcaFmAlgorithmConnector1' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector2' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector3' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector4' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector5' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector6' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector7' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector8' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector9' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector10' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector11' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector12' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector13' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector14' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector15' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector16' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector17' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector18' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector19' + currentAlgorithm + volcaFmMonth}></div>
                        <div className={'volcaFmAlgorithmConnector20' + currentAlgorithm + volcaFmMonth}></div>
                    </div>
                </div>
                <div className={'volcaFmOscillatorEditor' + volcaFmMonth}>
                    <div className={operatorEditorState.operator1.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator1.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(1)}>
                                <div className={'opSwitchToggle' + operatorParams.operator1.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator1.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator1.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 1</p>
                            {(operatorParams.operator1.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(1, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator1.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(1, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator1.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator1.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator1.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(1, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator1.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(1, 'envelope')}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(1, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(1, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator1.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(1, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(1, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator1.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator1.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(1, 'scaling')}>
                                <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                    <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeBreakPoint(1, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.levelScaleBreakPoint} />
                                        </div>
                                    <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator1.levelScaleBreakPoint)}</p>
                                    <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                    <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(1, 'left', e.target.value)}
                                        value={operatorParams.operator1.levelScaleLeftCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                    <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(1, 'left', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.levelScaleLeftDepth} />
                                    <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(1, 'left', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.levelScaleLeftDepth} />
                                    </div>
                                    <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                    <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(1, 'right', e.target.value)}
                                        value={operatorParams.operator1.levelScaleRightCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                    <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(1, 'right', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.levelScaleRightDepth} />
                                    <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(1, 'right', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.levelScaleRightDepth} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator1.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                    <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                        onClick={() => toggleOscMode(1)}>
                                        <p>fixed</p>
                                        <p>ratio</p>
                                    </div>
                                    <div className={'operatorOscModeSwitch' + operatorParams.operator1.oscMode + volcaFmMonth}
                                        onClick={() => toggleOscMode(1)}></div>
                                    <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                    <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                        max="31"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'coarse', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.freqCoarse}/>
                                    <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'coarse', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.freqCoarse}/>
                                    </div>
                                    <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                    <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'fine', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.freqFine}/>
                                    <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'fine', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.freqFine}/>
                                    </div>
                                    <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                    <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                        max="14"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'detune', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.detune -7}/>
                                    <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'detune', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.detune}/>
                                    </div>
                                    <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                    <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'oscRate', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.oscRateScale}/>
                                    <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'oscRate', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.oscRateScale}/>
                                    </div>
                                    <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                    <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                        max="3"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'ams', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.amplitudeModSense}/>
                                    <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'ams', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.amplitudeModSense}/>
                                    </div>
                                    <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                    <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(1, 'kvs', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator1.keyVelocitySense}/>
                                    <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(1, 'kvs', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator1.keyVelocitySense}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={operatorEditorState.operator2.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator2.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(2)}>
                                <div className={'opSwitchToggle' + operatorParams.operator2.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator2.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator2.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 2</p>
                            {(operatorParams.operator2.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(2, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator2.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(2, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator2.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(2, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator2.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(2, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator2.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(2, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator2.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(2, 'envelope')}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(2, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(2, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(2, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(2, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(2, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(2, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(2, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(2, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(2, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(2, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(2, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator2.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(2, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(2, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator2.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator2.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(2, 'scaling')}>
                                <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                    <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeBreakPoint(2, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.levelScaleBreakPoint} />
                                        </div>
                                    <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator2.levelScaleBreakPoint)}</p>
                                    <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                    <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(2, 'left', e.target.value)}
                                        value={operatorParams.operator2.levelScaleLeftCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                    <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(2, 'left', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.levelScaleLeftDepth} />
                                    <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(2, 'left', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.levelScaleLeftDepth} />
                                    </div>
                                    <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                    <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(2, 'right', e.target.value)}
                                        value={operatorParams.operator2.levelScaleRightCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                    <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(2, 'right', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.levelScaleRightDepth} />
                                    <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(2, 'right', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.levelScaleRightDepth} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator2.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                    <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                        onClick={() => toggleOscMode(2)}>
                                        <p>fixed</p>
                                        <p>ratio</p>
                                    </div>
                                    <div className={'operatorOscModeSwitch' + operatorParams.operator2.oscMode + volcaFmMonth}
                                        onClick={() => toggleOscMode(2)}></div>
                                    <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                    <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                        max="31"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'coarse', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.freqCoarse}/>
                                    <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'coarse', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.freqCoarse}/>
                                    </div>
                                    <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                    <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'fine', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.freqFine}/>
                                    <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'fine', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.freqFine}/>
                                    </div>
                                    <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                    <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                        max="14"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'detune', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.detune -7}/>
                                    <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'detune', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.detune}/>
                                    </div>
                                    <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                    <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'oscRate', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.oscRateScale}/>
                                    <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'oscRate', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.oscRateScale}/>
                                    </div>
                                    <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                    <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                        max="3"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'ams', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.amplitudeModSense}/>
                                    <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'ams', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.amplitudeModSense}/>
                                    </div>
                                    <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                    <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(2, 'kvs', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator2.keyVelocitySense}/>
                                    <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(2, 'kvs', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator2.keyVelocitySense}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={operatorEditorState.operator3.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator3.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(3)}>
                                <div className={'opSwitchToggle' + operatorParams.operator3.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator3.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator3.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 3</p>
                            {(operatorParams.operator3.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(3, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator3.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(3, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator3.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(3, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator3.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(3, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator3.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(3, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator3.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(3, 'envelope')}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(3, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(3, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(3, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(3, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(3, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(3, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(3, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(3, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(3, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(3, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(3, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator3.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(3, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(3, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator3.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator3.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(3, 'scaling')}>
                                <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                    <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeBreakPoint(3, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.levelScaleBreakPoint} />
                                        </div>
                                    <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator3.levelScaleBreakPoint)}</p>
                                    <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                    <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(3, 'left', e.target.value)}
                                        value={operatorParams.operator3.levelScaleLeftCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                    <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(3, 'left', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.levelScaleLeftDepth} />
                                    <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(3, 'left', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.levelScaleLeftDepth} />
                                    </div>
                                    <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                    <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(3, 'right', e.target.value)}
                                        value={operatorParams.operator3.levelScaleRightCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                    <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(3, 'right', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.levelScaleRightDepth} />
                                    <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(3, 'right', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.levelScaleRightDepth} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator3.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                    <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                        onClick={() => toggleOscMode(3)}>
                                        <p>fixed</p>
                                        <p>ratio</p>
                                    </div>
                                    <div className={'operatorOscModeSwitch' + operatorParams.operator3.oscMode + volcaFmMonth}
                                        onClick={() => toggleOscMode(3)}></div>
                                    <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                    <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                        max="31"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'coarse', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.freqCoarse}/>
                                    <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'coarse', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.freqCoarse}/>
                                    </div>
                                    <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                    <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'fine', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.freqFine}/>
                                    <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'fine', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.freqFine}/>
                                    </div>
                                    <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                    <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                        max="14"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'detune', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.detune -7}/>
                                    <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'detune', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.detune}/>
                                    </div>
                                    <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                    <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'oscRate', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.oscRateScale}/>
                                    <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'oscRate', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.oscRateScale}/>
                                    </div>
                                    <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                    <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                        max="3"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'ams', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.amplitudeModSense}/>
                                    <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'ams', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.amplitudeModSense}/>
                                    </div>
                                    <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                    <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(3, 'kvs', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator3.keyVelocitySense}/>
                                    <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(3, 'kvs', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator3.keyVelocitySense}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={operatorEditorState.operator4.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator4.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(4)}>
                                <div className={'opSwitchToggle' + operatorParams.operator4.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator4.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator4.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 4</p>
                            {(operatorParams.operator4.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(4, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator4.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(4, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator4.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(4, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator4.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(4, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator4.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(4, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator4.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(4, 'envelope')}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(4, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(4, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(4, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(4, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(4, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(4, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(4, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(4, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(4, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(4, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(4, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator4.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(4, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(4, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator4.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator4.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(4, 'scaling')}>
                                <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                    <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeBreakPoint(4, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.levelScaleBreakPoint} />
                                        </div>
                                    <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator4.levelScaleBreakPoint)}</p>
                                    <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                    <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(4, 'left', e.target.value)}
                                        value={operatorParams.operator4.levelScaleLeftCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                    <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(4, 'left', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.levelScaleLeftDepth} />
                                    <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(4, 'left', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.levelScaleLeftDepth} />
                                    </div>
                                    <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                    <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(4, 'right', e.target.value)}
                                        value={operatorParams.operator4.levelScaleRightCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                    <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(4, 'right', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.levelScaleRightDepth} />
                                    <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(4, 'right', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.levelScaleRightDepth} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator4.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                    <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                        onClick={() => toggleOscMode(4)}>
                                        <p>fixed</p>
                                        <p>ratio</p>
                                    </div>
                                    <div className={'operatorOscModeSwitch' + operatorParams.operator4.oscMode + volcaFmMonth}
                                        onClick={() => toggleOscMode(4)}></div>
                                    <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                    <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                        max="31"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'coarse', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.freqCoarse}/>
                                    <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'coarse', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.freqCoarse}/>
                                    </div>
                                    <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                    <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'fine', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.freqFine}/>
                                    <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'fine', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.freqFine}/>
                                    </div>
                                    <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                    <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                        max="14"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'detune', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.detune -7}/>
                                    <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'detune', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.detune}/>
                                    </div>
                                    <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                    <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'oscRate', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.oscRateScale}/>
                                    <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'oscRate', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.oscRateScale}/>
                                    </div>
                                    <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                    <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                        max="3"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'ams', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.amplitudeModSense}/>
                                    <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'ams', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.amplitudeModSense}/>
                                    </div>
                                    <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                    <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(4, 'kvs', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator4.keyVelocitySense}/>
                                    <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(4, 'kvs', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator4.keyVelocitySense}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={operatorEditorState.operator5.state + volcaFmMonth}>
                        <div className={'operatorEditorToolbar' + volcaFmMonth}>
                            <div className={'operatorOnOffBox' + operatorParams.operator5.operatorOn + volcaFmMonth}
                                onClick={() => handleOpOnOffClick(5)}>
                                <div className={'opSwitchToggle' + operatorParams.operator5.operatorOn + volcaFmMonth}></div>
                                {(operatorParams.operator5.operatorOn === 'On') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}>on</p>
                                )}
                                {(operatorParams.operator5.operatorOn === 'Off') && (
                                    <p className={'opEditorOnOffLabel' + volcaFmMonth}
                                        style={{transform: 'translateX(-40px)'}}>off</p>
                                )}
                            </div>
                            <p className={'operatorEditorOperatorLabel' + volcaFmMonth}>Operator 5</p>
                            {(operatorParams.operator5.operatorOn === 'On') && (
                                    <div className={'operatorMasterLevelDiv' + volcaFmMonth}>
                                        <input className={'operatorMasterLevel' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => handleOperatorLevel(5, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.outputLevel}
                                            ></input>
                                    </div>
                            )}
                            {(operatorParams.operator5.operatorOn === 'On') && (
                                <input className={'operatorMasterLevelDisplay' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => handleOperatorLevel(5, e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.outputLevel}></input>)}
                        </div>
                        <div className={'operatorEditorTabsBar' + volcaFmMonth}>
                            <div className={operatorEditorState.operator5.envelopeTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(5, 'envelope')}>
                                <p>envelope</p>
                            </div>
                            <div className={operatorEditorState.operator5.scalingTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(5, 'scaling')}>
                                <p>scaling</p>
                            </div>
                            <div className={operatorEditorState.operator5.tuningTab + volcaFmMonth}
                                onClick={() => handleOperatorTab(5, 'tuning')}>
                                <p>tuning</p>
                            </div>
                        </div>
                        {(operatorEditorState.operator5.envelopeTab === 'operatorEditorTabActive') && (
                            <div className={'operatorEnvelopeContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(5, 'envelope')}>
                                <div className={'operatorEnvelopeControllersDiv' + volcaFmMonth}>
                                    <div className={'operatorEnvelopeLevelRate1Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 1</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 1</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(5, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeR1}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(5, 1, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeL1}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(5, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeR1}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 1, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeL1} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate2Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 2</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 2</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(5, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeR2}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(5, 2, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeL2}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(5, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeR2}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 2, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeL2} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate3Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 3</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 3</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(5, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeR3}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(5, 3, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeL3}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(5, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeR3}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 3, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeL3} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                    <div className={'operatorEnvelopeLevelRate4Div' + volcaFmMonth}>
                                        <div className={'operatorEnvelopeParamsContainer' + volcaFmMonth}>
                                            <p className={'operatorRateLabel' + volcaFmMonth}>rate 4</p>
                                            <p className={'operatorLevelLabel' + volcaFmMonth}>level 4</p>
                                            <input className={'operatorRateNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeRate(5, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeR4}/>
                                            <input className={'operatorLevelNumberInput' + volcaFmMonth}
                                                max="99"
                                                min="0"
                                                onChange={(e) => changeLevel(5, 4, e.target.value)}
                                                type="number"
                                                value={operatorParams.operator5.envelopeL4}/>
                                            <div className={'operatorRateRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorRangeSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeRate(5, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeR4}/>
                                            </div>
                                            <div className={'operatorLevelRangeInputDiv' + volcaFmMonth}>
                                                <input className={'operatorLevelSlider' + volcaFmMonth}
                                                    max="99"
                                                    min="0"
                                                    onChange={(e) => changeLevel(5, 4, e.target.value)}
                                                    type="range"
                                                    value={operatorParams.operator5.envelopeL4} />
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator5.scalingTab === 'operatorEditorTabActive') && (
                            <div className={'operatorScalingContainer' + volcaFmMonth}
                                onMouseDown={() => updateDisplayPort(5, 'scaling')}>
                                <div className={'operatorLevelScalingControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorLevelScaleBreakPointLabel' + volcaFmMonth}>level scale break point:</p>
                                    <div className={'operatorLevelScaleBreakpointRangeInputDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleBreakpointSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeBreakPoint(5, e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.levelScaleBreakPoint} />
                                        </div>
                                    <p className={'operatorLevelScaleCalculatedValue' + volcaFmMonth}>{calculateBreakpointPitch(operatorParams.operator5.levelScaleBreakPoint)}</p>
                                    <p className={'operatorLevelScaleLeftCurveLabel' + volcaFmMonth}>level scale left curve:</p>
                                    <select className={'operatorLevelScaleLeftCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(5, 'left', e.target.value)}
                                        value={operatorParams.operator5.levelScaleLeftCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleLeftDepthLabel' + volcaFmMonth}>level scale left depth:</p>
                                    <input className={'operatorLevelScaleLeftDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(5, 'left', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.levelScaleLeftDepth} />
                                    <div className={'operatorLevelScaleLeftDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(5, 'left', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.levelScaleLeftDepth} />
                                    </div>
                                    <p className={'operatorLevelScaleRightCurveLabel' + volcaFmMonth}>level scale right curve:</p>
                                    <select className={'operatorLevelScaleRightCurve' + volcaFmMonth}
                                        onChange={(e) => setCurveValue(5, 'right', e.target.value)}
                                        value={operatorParams.operator5.levelScaleRightCurve}>
                                        <option key="0" value="0">-linear</option>
                                        <option key="1" value="1">-exponential</option>
                                        <option key="2" value="2">exponential</option>
                                        <option key="3" value="3">linear</option>
                                    </select>
                                    <p className={'operatorLevelScaleRightDepthLabel' + volcaFmMonth}>level scale right depth:</p>
                                    <input className={'operatorLevelScaleRightDepthInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => changeCurveDepth(5, 'right', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.levelScaleRightDepth} />
                                    <div className={'operatorLevelScaleRightDepthSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => changeCurveDepth(5, 'right', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.levelScaleRightDepth} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {(operatorEditorState.operator5.tuningTab === 'operatorEditorTabActive') && (
                            <div className={'operatorTuningContainer' + volcaFmMonth}>
                                <div className={'operatorTuningControllersDiv' + volcaFmMonth}>
                                    <p className={'operatorOSCModeLabel' + volcaFmMonth}>oscillator mode:</p>
                                    <div className={'operatorOscillatorModeSwitchDiv' + volcaFmMonth}
                                        onClick={() => toggleOscMode(5)}>
                                        <p>fixed</p>
                                        <p>ratio</p>
                                    </div>
                                    <div className={'operatorOscModeSwitch' + operatorParams.operator5.oscMode + volcaFmMonth}
                                        onClick={() => toggleOscMode(5)}></div>
                                    <p className={'operatorFreqCoarseLabel' + volcaFmMonth}>frequency coarse:</p>
                                    <input className={'operatorFrequencyCoarseInput' + volcaFmMonth}
                                        max="31"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'coarse', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.freqCoarse}/>
                                    <div className={'operatorFrequencyCoarseSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="31"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'coarse', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.freqCoarse}/>
                                    </div>
                                    <p className={'operatorFreqFineLabel' + volcaFmMonth}>frequency fine:</p>
                                    <input className={'operatorFrequencyFineInput' + volcaFmMonth}
                                        max="99"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'fine', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.freqFine}/>
                                    <div className={'operatorFrequencyFineSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="99"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'fine', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.freqFine}/>
                                    </div>
                                    <p className={'operatorFreqDetuneLabel' + volcaFmMonth}>detune:</p>
                                    <input className={'operatorFrequencyDetuneInput' + volcaFmMonth}
                                        max="14"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'detune', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.detune -7}/>
                                    <div className={'operatorFrequencyDetuneSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'detune', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.detune}/>
                                    </div>
                                    <p className={'operatorOscillatorRateLabel' + volcaFmMonth}>oscillator rate scale:</p>
                                    <input className={'operatorOscillatorRateScaleInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'oscRate', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.oscRateScale}/>
                                    <div className={'operatorOscillatorRateScaleSliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="14"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'oscRate', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.oscRateScale}/>
                                    </div>
                                    <p className={'operatorAmplitudeModulationSensitivityLabel' + volcaFmMonth}>amplitude modulation sensitivity:</p>
                                    <input className={'operatorAmplitudeModulationSensitivityInput' + volcaFmMonth}
                                        max="3"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'ams', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.amplitudeModSense}/>
                                    <div className={'operatorAmplitudeModulationSensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="3"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'ams', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.amplitudeModSense}/>
                                    </div>
                                    <p className={'operatorKeyVelocitySensitivityLabel' + volcaFmMonth}>key velocity sensitivity:</p>
                                    <input className={'operatorKeyVelocitySensitivityInput' + volcaFmMonth}
                                        max="7"
                                        min="0"
                                        onChange={(e) => operatorTuning(5, 'kvs', e.target.value)}
                                        type="number"
                                        value={operatorParams.operator5.keyVelocitySense}/>
                                    <div className={'operatorKeyVelocitySensitivitySliderDiv' + volcaFmMonth}>
                                        <input className={'operatorLevelScaleDepthSlider' + volcaFmMonth}
                                            max="7"
                                            min="0"
                                            onChange={(e) => operatorTuning(5, 'kvs', e.target.value)}
                                            type="range"
                                            value={operatorParams.operator5.keyVelocitySense}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                </div>
                <div className={'volcaFmNonOpEditor' + volcaFmMonth}>
                    <p>non-operator editor</p>
                </div>
                <div className={'volcaEnvelopeLevelDisplay' + volcaFmMonth}>
                    <div className={envelopeLevelState.operator1.envelopeState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                            <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1="0" 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)} 
                                        x2={keyOnOffset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}
                                        x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL1 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL1 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL2 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL2 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler) + (operatorParams.operator1.envelopeR3 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator1.envelopeR1 * rateScaler) + (operatorParams.operator1.envelopeR2 * rateScaler) + (operatorParams.operator1.envelopeR3 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)} 
                                        x2={keyOffOnset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL3 * 2)} 
                                        x2={keyOffOnset + (operatorParams.operator1.envelopeR4 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset + (operatorParams.operator1.envelopeR4 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator1.envelopeL4 * 2)}></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator1.levelState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                            <div className={'scalingDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={0} 
                                        y1={envelopeGraphTopVal / 2} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal / 2}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={(operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)} 
                                        y1={envelopeGraphTopVal} 
                                        x2={(operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)} 
                                        y2={0}></line>
                                    {(operatorParams.operator1.levelScaleLeftCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleLeftCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleLeftCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleLeftCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleRightCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleRightCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleRightCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator1.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator1.levelScaleRightCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator1.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator1.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator2.envelopeState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                            <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1="0" 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)} 
                                        x2={keyOnOffset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}
                                        x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL1 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL1 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL2 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL2 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler) + (operatorParams.operator2.envelopeR3 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator2.envelopeR1 * rateScaler) + (operatorParams.operator2.envelopeR2 * rateScaler) + (operatorParams.operator2.envelopeR3 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)} 
                                        x2={keyOffOnset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL3 * 2)} 
                                        x2={keyOffOnset + (operatorParams.operator2.envelopeR4 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset + (operatorParams.operator2.envelopeR4 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator2.envelopeL4 * 2)}></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator2.levelState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                            <div className={'scalingDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={0} 
                                        y1={envelopeGraphTopVal / 2} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal / 2}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={(operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)} 
                                        y1={envelopeGraphTopVal} 
                                        x2={(operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)} 
                                        y2={0}></line>
                                    {(operatorParams.operator2.levelScaleLeftCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleLeftCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleLeftCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleLeftCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleRightCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleRightCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleRightCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator2.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator2.levelScaleRightCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator2.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator2.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator3.envelopeState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                            <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1="0" 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)} 
                                        x2={keyOnOffset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}
                                        x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL1 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL1 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL2 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL2 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler) + (operatorParams.operator3.envelopeR3 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator3.envelopeR1 * rateScaler) + (operatorParams.operator3.envelopeR2 * rateScaler) + (operatorParams.operator3.envelopeR3 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)} 
                                        x2={keyOffOnset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL3 * 2)} 
                                        x2={keyOffOnset + (operatorParams.operator3.envelopeR4 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset + (operatorParams.operator3.envelopeR4 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator3.envelopeL4 * 2)}></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator3.levelState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                            <div className={'scalingDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={0} 
                                        y1={envelopeGraphTopVal / 2} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal / 2}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={(operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)} 
                                        y1={envelopeGraphTopVal} 
                                        x2={(operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)} 
                                        y2={0}></line>
                                    {(operatorParams.operator3.levelScaleLeftCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleLeftCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleLeftCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleLeftCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleRightCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleRightCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleRightCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator3.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator3.levelScaleRightCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator3.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator3.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator4.envelopeState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                            <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1="0" 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)} 
                                        x2={keyOnOffset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}
                                        x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL1 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL1 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL2 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL2 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler) + (operatorParams.operator4.envelopeR3 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator4.envelopeR1 * rateScaler) + (operatorParams.operator4.envelopeR2 * rateScaler) + (operatorParams.operator4.envelopeR3 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)} 
                                        x2={keyOffOnset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL3 * 2)} 
                                        x2={keyOffOnset + (operatorParams.operator4.envelopeR4 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset + (operatorParams.operator4.envelopeR4 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator4.envelopeL4 * 2)}></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator4.levelState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                            <div className={'scalingDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={0} 
                                        y1={envelopeGraphTopVal / 2} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal / 2}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={(operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)} 
                                        y1={envelopeGraphTopVal} 
                                        x2={(operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)} 
                                        y2={0}></line>
                                    {(operatorParams.operator4.levelScaleLeftCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleLeftCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleLeftCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleLeftCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleRightCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleRightCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleRightCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator4.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator4.levelScaleRightCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator4.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator4.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator5.envelopeState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeLevelLabel' + volcaFmMonth}>level</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>time</p>
                            <div className={'envelopeDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1="0" 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)} 
                                        x2={keyOnOffset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}
                                        x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL1 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL1 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL2 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL2 * 2)} 
                                        x2={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler) + (operatorParams.operator5.envelopeR3 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOnOffset + (operatorParams.operator5.envelopeR1 * rateScaler) + (operatorParams.operator5.envelopeR2 * rateScaler) + (operatorParams.operator5.envelopeR3 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)} 
                                        x2={keyOffOnset} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL3 * 2)} 
                                        x2={keyOffOnset + (operatorParams.operator5.envelopeR4 * rateScaler)} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={keyOffOnset + (operatorParams.operator5.envelopeR4 * rateScaler)} 
                                        y1={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal - (operatorParams.operator5.envelopeL4 * 2)}></line>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={envelopeLevelState.operator5.levelState + volcaFmMonth}>
                        <div className={'envelopeDisplayContainer' + volcaFmMonth}>
                            <p className={'envelopeDepthLabel' + volcaFmMonth}>depth</p>
                            <p className={'envelopeTimeLabel' + volcaFmMonth}>scale</p>
                            <div className={'scalingDisplayZone' + volcaFmMonth}>
                                <svg height="100%"
                                    width="100%">
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={0} 
                                        y1={envelopeGraphTopVal / 2} 
                                        x2={envelopeEndGraph} 
                                        y2={envelopeGraphTopVal / 2}></line>
                                    <line className={'op1KeyOnLine' + volcaFmMonth} 
                                        x1={(operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)} 
                                        y1={envelopeGraphTopVal} 
                                        x2={(operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)} 
                                        y2={0}></line>
                                    {(operatorParams.operator5.levelScaleLeftCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleLeftCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleLeftCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)/4).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5).toString() + ' ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleLeftCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M 0 ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleLeftDepth * scaleScaler)).toString() + ' L ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' + (envelopeGraphTopVal / 2).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleRightCurve === 0) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleRightCurve === 1) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) + (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleRightCurve === 2) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' Q ' + ((operatorParams.operator5.levelScaleBreakPoint * breakpointOffset) + ((envelopeEndGraph - (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset)) * 0.75)).toString() + ' ' + ((envelopeGraphTopVal / 2) - 5) + ' ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    {(operatorParams.operator5.levelScaleRightCurve === 3) && (
                                        <path 
                                        className={'op1KeyOnLine' + volcaFmMonth}
                                        d={'M ' + (operatorParams.operator5.levelScaleBreakPoint * breakpointOffset).toString() + ' ' +  (envelopeGraphTopVal / 2).toString() + ' L ' + (envelopeEndGraph).toString() + ' ' + ((envelopeGraphTopVal / 2) - (operatorParams.operator5.levelScaleRightDepth * scaleScaler)).toString()}></path>
                                    )}
                                    
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}


export default VolcaFm;
