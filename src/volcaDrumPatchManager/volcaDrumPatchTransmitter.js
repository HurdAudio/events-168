import React from 'react';
import VolcaDrumControlChangeMessages from './volcaDrumControlChangeMessages';

function VolcaDrumPatchTransmitter(patch, currentOutput) {
    
    const controlMessages = ['bitReduction', 'overdriveGain', 'pan', 'premixGain', 'send', 'waveFolder', 'waveguideBody', 'waveguideDecay', 'waveguideTune', 'layer1EGAttack', 'layer1EGRelease', 'layer1Level', 'layer1ModulationAmount', 'layer1ModulationRate', 'layer1Pitch', 'layer1WaveguideModel', 'layer2EGAttack', 'layer2EGRelease', 'layer2Level', 'layer2ModulationAmount', 'layer2ModulationRate', 'layer2Pitch', 'layer2WaveguideModel', 'layer12EGAttack', 'layer12EGRelease', 'layer12Level', 'layer12ModulationAmount', 'layer12ModulationRate', 'layer12Pitch', 'layer12WaveguideModel'];
    
    for (let i = 0; i < controlMessages.length; i++) {
        for (let midiChannel = 0; midiChannel < 6; midiChannel++) {
            currentOutput.send(VolcaDrumControlChangeMessages(patch, midiChannel, controlMessages[i]));
        }
    }
}

export default VolcaDrumPatchTransmitter;