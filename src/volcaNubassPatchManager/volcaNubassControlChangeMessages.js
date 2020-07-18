import React from 'react';

function VolcaNubassControlChangeMessages(patch, currentMidiChannel, message) {
        
    let transmitArray = [];
    
    switch(message) {
        case('pitch'):
            transmitArray = [0xB0 | currentMidiChannel, 0x28, patch.nubass_parameters.pitch];
            break;
        case('saturation'):
            transmitArray = [0xB0 | currentMidiChannel, 0x29, patch.nubass_parameters.saturation];
            break;
        case('level'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2A, patch.nubass_parameters.level];
            break;
        case('cutoff'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2B, patch.nubass_parameters.cutoff];
            break;
        case('peak'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2C, patch.nubass_parameters.peak];
            break;
        case('attack'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2D, patch.nubass_parameters.attack];
            break;
        case('decay'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2E, patch.nubass_parameters.decay];
            break;
        case('egInt'):
            transmitArray = [0xB0 | currentMidiChannel, 0x2F, patch.nubass_parameters.egInt];
            break;
        case('accent'):
            transmitArray = [0xB0 | currentMidiChannel, 0x30, patch.nubass_parameters.accent];
            break;
        case('lfoRate'):
            transmitArray = [0xB0 | currentMidiChannel, 0x31, patch.nubass_parameters.lfoRate];
            break;
        case('lfoInt'):
            transmitArray = [0xB0 | currentMidiChannel, 0x32, patch.nubass_parameters.lfoInt];
            break;
        case('vtoWave'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.vtoWave];
            break;
        case('lfoWave'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.lfoWave];
            break;
        case('amplitude'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.amplitude];
            break;
        case('faceplatePitch'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.pitch];
            break;
        case('faceplateCutoff'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.cutoff];
            break;
        case('lfoSync'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.lfoSync];
            break;
        case('sustain'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, patch.nubass_faceplate_params.sustain];
            break;
        case('pan'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0A, patch.global_params.pan];
            break;
        case('portamento'):
            if (patch.global_params.portamento) {
                transmitArray = [0xB0 | currentMidiChannel, 0x41, 127];
            } else {
                transmitArray = [0xB0 | currentMidiChannel, 0x41, 0];
            }
            break;
        case('portamentoTime'):
            transmitArray = [0xB0 | currentMidiChannel, 0x05, patch.global_params.portamentoTime];
            break;
        default:
            console.log('ERROR: invalid message');
    }
    
    return transmitArray;
}

export default VolcaNubassControlChangeMessages;