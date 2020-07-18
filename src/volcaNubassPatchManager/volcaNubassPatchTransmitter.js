import React from 'react';
import VolcaNubassControlChangeMessages from './volcaNubassControlChangeMessages';

function VolcaNubassPatchTransmitter(patch, currentOutput, currentMidiChannel) {
    
    const controlMessages = ['pitch', 'saturation', 'level', 'cutoff', 'peak', 'attack', 'decay', 'egInt', 'accent', 'lfoRate', 'lfoInt', 'vtoWave', 'lfoWave', 'amplitude', 'faceplatePitch', 'faceplateCutoff', 'lfoSync', 'sustain', 'pan', 'portamento', 'portamentoTime'];
    
    for (let i = 0; i < controlMessages.length; i++) {
        currentOutput.send(VolcaNubassControlChangeMessages(patch, currentMidiChannel, controlMessages[i]));
    }
    
}

export default VolcaNubassPatchTransmitter;