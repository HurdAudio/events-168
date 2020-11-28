import React from 'react';
import Gr1ControlChangeMessages from './gr1ControlChangeMessages';

function Gr1PatchTransmitter(patch, currentOutput, currentMidiChannel) {
    
    const controlMessages = ['curve', 'cv1Amount', 'cv1Destination', 'cv2Amount', 'cv2Destination', 'envelopeAttack', 'envelopeDecay', 'envelopeSustain', 'envelopeRelease', 'lfo1Amount', 'lfo1Destination', 'lfo1Frequency', 'lfo1Sync', 'lfo1Waveform', 'lfo2Amount', 'lfo2Destination', 'lfo2Frequency', 'lfo2Sync', 'lfo2Waveform', 'cutoff', 'density', 'grainsize', 'panSpray', 'resonance', 'scan', 'scanSync', 'spray', 'tune', 'position', 'resample', 'sides', 'tilt', 'volume'];
    
    const globalParams = ['masterVolume', 'modulationWheel', 'premixGain', 'pitchbendRange', 'currentPatch'];
    
    for (let patchArr = 0; patchArr < 32; patchArr++) {
        currentOutput.send(Gr1ControlChangeMessages(patch, currentMidiChannel, 'currentPatch', patchArr));
        for (let i = 0; i < controlMessages.length; i++) {
            currentOutput.send(Gr1ControlChangeMessages(patch, currentMidiChannel, controlMessages[i], patchArr));
        }
    }
    currentOutput.send(Gr1ControlChangeMessages(patch, currentMidiChannel, 'currentPatch', patch.globalParams.currentPatch));
    
    for (let j = 0; j < globalParams.length; j++) {
        currentOutput.send(Gr1ControlChangeMessages(patch, currentMidiChannel, controlMessages[j], patch.globalParams.currentPatch));
    }
}

export default Gr1PatchTransmitter;