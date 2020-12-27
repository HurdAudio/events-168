import React from 'react';
import VolcaFmSysexMessages from './volcaFmSysexMessages';
import VolcaFmControlChangeMessages from './volcaFmControlChangeMessages';

function VolcaFmPatchTransmitter(patch, currentOutput, currentMidiChannel, time) {
    
    const controlMessages = ['monoPoly', 'pitchBendRange', 'pitchBendStep', 'modulationWheelRange', 'modulationWheelAssign', 'portamentoMode', 'portamentoGliss', 'portamentoTime', 'footControlRange', 'footControlAssign', 'breathControlRange', 'breathControlAssign', 'aftertouchRange', 'aftertouchAssign'];
    
    const sendSysexDump = () => {
        let buffer = VolcaFmSysexMessages(patch, currentMidiChannel);
        let throttleTimer = 300;
        
        setTimeout(() => {
            if (time) {
                currentOutput.send(buffer, time);
            } else {
                currentOutput.send(buffer);
            }
        }, throttleTimer);
    }
    
    sendSysexDump();
    for (let i = 0; i < controlMessages.length; i++) {
        if (time) {
            currentOutput.send(VolcaFmControlChangeMessages(patch, currentMidiChannel, controlMessages[i]), time);
        } else {
            currentOutput.send(VolcaFmControlChangeMessages(patch, currentMidiChannel, controlMessages[i]))
        }
        
    }
}

export default VolcaFmPatchTransmitter;