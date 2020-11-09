import React from 'react';

const controlMessages = ['bitReduction', 'overdriveGain', 'pan', 'premixGain', 'send', 'waveFolder', 'waveguideBody', 'waveguideDecay', 'waveguideTune', 'layer1EGAttack', 'layer1EGRelease', 'layer1Level', 'layer1ModulationAmount', 'layer1ModulationRate', 'layer1Pitch', 'layer1WaveguideModel', 'layer2EGAttack', 'layer2EGRelease', 'layer2Level', 'layer2ModulationAmount', 'layer2ModulationRate', 'layer2Pitch', 'layer2WaveguideModel', 'layer12EGAttack', 'layer12EGRelease', 'layer12Level', 'layer12ModulationAmount', 'layer12ModulationRate', 'layer12Pitch', 'layer12WaveguideModel'];


function VolcaDrumControlChangeMessages(patch, currentMidiChannel, message) {
    
    let transmitArray = [];
    
    const waveGuideValue = (waveGuideSet) => {
        let value = 0;
        
        if (waveGuideSet.soundSource[0]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 0;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 3;
                } else {
                    value = 6;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 9;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 12;
                } else {
                    value = 15;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 18;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 20;
                } else {
                    value = 23;
                }
            }
        } else if (waveGuideSet.soundSource[1]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 26;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 29
                } else {
                    value = 32;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 35;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 37;
                } else {
                    value = 40;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 43;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 46;
                } else {
                    value = 49;
                }
            }
        } else if (waveGuideSet.soundSource[2]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 52;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 55;
                } else {
                    value = 57;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 60;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 63;
                } else {
                    value = 66;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 69;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 72;
                } else {
                    value = 74;
                }
            }
        } else if (waveGuideSet.soundSource[3]) {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 77;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 80;
                } else {
                    value = 83;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 86;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 89;
                } else {
                    value = 92;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 94;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 97;
                } else {
                    value = 100;
                }
            }
        } else {
            if (waveGuideSet.pitchModulators[0]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 103;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 106;
                } else {
                    value = 109;
                }
            } else if (waveGuideSet.pitchModulators[1]) {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 111;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 114;
                } else {
                    value = 117;
                }
            } else {
                if (waveGuideSet.envelopeGenerators[0]) {
                    value = 120;
                } else if (waveGuideSet.envelopeGenerators[1]) {
                    value = 123;
                } else {
                    value = 126;
                }
            }
        }
        
        return value;
    }
    
    switch(message) {
        case('bitReduction'):
            transmitArray = [0xB0 | currentMidiChannel, 0x31, patch.globalParams.bitReduction];
            break;
        case('overdriveGain'):
            transmitArray = [0xB0 | currentMidiChannel, 0x33, patch.globalParams.overdriveGain];
            break;
        case('pan'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0A, patch.globalParams.pan];
            break;
        case('premixGain'):
            transmitArray = [0xB0 | currentMidiChannel, 0x34, patch.globalParams.premixGain];
            break;
        case('send'):
            transmitArray = [0xB0 | currentMidiChannel, 0x67, patch.globalParams.send];
            break;
        case('waveFolder'):
            transmitArray = [0xB0 | currentMidiChannel, 0x32, patch.globalParams.waveFolder];
            break;
        case('waveguideBody'):
            transmitArray = [0xB0 | currentMidiChannel, 0x76, patch.globalParams.waveGuide.body];
            break;
        case('waveguideDecay'):
            transmitArray = [0xB0 | currentMidiChannel, 0x75, patch.globalParams.waveGuide.decay];
            break;
        case('waveguideTune'):
            transmitArray = [0xB0 | currentMidiChannel, 0x77, patch.globalParams.waveGuide.tune];
            break;
        case('layer1EGAttack'):
            transmitArray = [0xB0 | currentMidiChannel, 0x14, patch.patch[currentMidiChannel].layer1.envelopeGenerator.attack];
            break;
        case('layer1EGRelease'):
            transmitArray = [0xB0 | currentMidiChannel, 0x17, patch.patch[currentMidiChannel].layer1.envelopeGenerator.release];
            break;
        case('layer1Level'):
            transmitArray = [0xB0 | currentMidiChannel, 0x11, patch.patch[currentMidiChannel].layer1.level];
            break;
        case('layer1ModulationAmount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1D, patch.patch[currentMidiChannel].layer1.modulation.amount];
            break;
        case('layer1ModulationRate'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2E, patch.patch[currentMidiChannel].layer1.modulation.rate];
            break;
        case('layer1Pitch'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1A, patch.patch[currentMidiChannel].layer1.pitch];
            break;
        case('layer1WaveguideModel'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0E, waveGuideValue(patch.patch[currentMidiChannel].layer1.waveGuideModel)];
            break;
        case('layer2EGAttack'):
            transmitArray = [0xB0 | currentMidiChannel, 0x15, patch.patch[currentMidiChannel].layer2.envelopeGenerator.attack];
            break;
        case('layer2EGRelease'):
            transmitArray = [0xB0 | currentMidiChannel, 0x18, patch.patch[currentMidiChannel].layer2.envelopeGenerator.release];
            break;
        case('layer2Level'):
            transmitArray = [0xB0 | currentMidiChannel, 0x12, patch.patch[currentMidiChannel].layer2.level];
            break;
        case('layer2ModulationAmount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1E, patch.patch[currentMidiChannel].layer2.modulation.amount];
            break;
        case('layer2ModulationRate'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2F, patch.patch[currentMidiChannel].layer2.modulation.rate];
            break;
        case('layer2Pitch'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1B, patch.patch[currentMidiChannel].layer2.pitch];
            break;
        case('layer2WaveguideModel'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0F, waveGuideValue(patch.patch[currentMidiChannel].layer2.waveGuideModel)];
            break;
        case('layer12EGAttack'):
            transmitArray = [0xB0 | currentMidiChannel, 0x16, patch.patch[currentMidiChannel].layer12.envelopeGenerator.attack];
            break;
        case('layer12EGRelease'):
            transmitArray = [0xB0 | currentMidiChannel, 0x19, patch.patch[currentMidiChannel].layer12.envelopeGenerator.release];
            break;
        case('layer12Level'):
            transmitArray = [0xB0 | currentMidiChannel, 0x13, patch.patch[currentMidiChannel].layer12.level];
            break;
        case('layer12ModulationAmount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1F, patch.patch[currentMidiChannel].layer12.modulation.amount];
            break;
        case('layer12ModulationRate'):
            transmitArray = [0xB0 | currentMidiChannel, 0x30, patch.patch[currentMidiChannel].layer12.modulation.rate];
            break;
        case('layer12Pitch'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1C, patch.patch[currentMidiChannel].layer12.pitch];
            break;
        case('layer12WaveguideModel'):
            transmitArray = [0xB0 | currentMidiChannel, 0x10, waveGuideValue(patch.patch[currentMidiChannel].layer12.waveGuideModel)];
            break;
        default:
            console.log('no message');
    }
    
}

export default VolcaDrumControlChangeMessages;