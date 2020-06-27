import React from 'react';


function VolcaFmControlChangeMessages(patch, currentMidiChannel, message) {
    
    let transmitArray = [];
    
    switch(message) {
        case('monoPoly'):
            if (patch.global.monoPoly === 0) {
                transmitArray = [0xB0 | currentMidiChannel, 0x7E, 1];
            } else {
                transmitArray = [0xB0 | currentMidiChannel, 0x7F, 1];
            }
            break;
        case('pitchBendRange'):
            transmitArray = [0XB0 | currentMidiChannel, 0x0E, patch.global.pitchBendRange];
            break;
        case('pitchBendStep'):
            transmitArray = [0XB0 | currentMidiChannel, 0x0F, patch.global.pitchBendRange];
            break;
        case('modulationWheelRange'):
            transmitArray = [0XB0 | currentMidiChannel, 0x01, patch.global.modulationWheelRange];
            break;
        case('modulationWheelAssign'):
            transmitArray = [0XB0 | currentMidiChannel, 0x01, patch.global.modulationWheelAssign];
            break;
        case('portamentoMode'):
            transmitArray = [0XB0 | currentMidiChannel, 0x41, patch.performance.portamentoMode];
            break;
        case('portamentoGliss'):
            transmitArray = [0XB0 | currentMidiChannel, 0x42, patch.performance.portamentoGliss];
            break;
        case('portamentoTime'):
            transmitArray = [0XB0 | currentMidiChannel, 0x05, patch.performance.portamentoTime];
            break;
        case('footControlRange'):
            transmitArray = [0XB0 | currentMidiChannel, 0x04, patch.performance.footControlRange];
            break;
        case('footControlAssign'):
            transmitArray = [0XB0 | currentMidiChannel, 0x24, patch.performance.footControlAssign];
            break;
        case('breathControlRange'):
            transmitArray = [0XB0 | currentMidiChannel, 0x02, patch.performance.breathControlRange];
            break;
        case('breathControlAssign'):
            transmitArray = [0XB0 | currentMidiChannel, 0x22, patch.performance.breathControlRange];
            break;
        case('aftertouchRange'):
            transmitArray = [0XB0 | currentMidiChannel, 0x23, patch.performance.aftertouchRange];
            break;
        case('aftertouchAssign'):
            transmitArray = [0XB0 | currentMidiChannel, 0x03, patch.performance.aftertouchAssign];
            break;
        default:
            console.log('no message');
    }
    
    return transmitArray;
}

export default VolcaFmControlChangeMessages;