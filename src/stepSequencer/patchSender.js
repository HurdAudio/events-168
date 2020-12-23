import React from 'react';
import VolcaFmPatchTransmitter from '../volcaFmPatchManager/volcaFmPatchTransmitter';

function PatchSender({ deviceId, patch, currentOutput, currentMidiChannel, time }) {
        
    switch(deviceId) {
        case('e3bfacf5-499a-4247-b512-2c4bd15861ad'):
            // volcaFM sender
            VolcaFmPatchTransmitter(patch, currentOutput, currentMidiChannel, time);
            break;
        default:
            console.log('ERROR - Unsupported device: no MIDI Device configuration for sending patches');
    }
    
}

export default PatchSender;