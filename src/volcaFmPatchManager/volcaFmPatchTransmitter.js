import React from 'react';
import VolcaFmSysexMessages from './volcaFmSysexMessages';
import VolcaFmControlChangeMessages from './volcaFmControlChangeMessages';

function VolcaFmPatchTransmitter(patch, currentOutput, currentMidiChannel) {
    
    const controlMessages = ['monoPoly', 'pitchBendRange', 'pitchBendStep', 'modulationWheelRange', 'modulationWheelAssign', 'portamentoMode', 'portamentoGliss', 'portamentoTime', 'footControlRange', 'footControlAssign', 'breathControlRange', 'breathControlAssign', 'aftertouchRange', 'aftertouchAssign'];
    
    const sendSysexDump = () => {
        let buffer = VolcaFmSysexMessages(patch, currentMidiChannel);
        let throttleTimer = 300;
        
        setTimeout(() => {
            currentOutput.send(buffer);
        }, throttleTimer);
    }
    
    sendSysexDump();
    for (let i = 0; i < controlMessages.length; i++) {
        currentOutput.send(patch, currentMidiChannel, controlMessages[i])
    }
}

export default VolcaFmPatchTransmitter;