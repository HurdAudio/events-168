import React from 'react';

function Gr1ControlChangeMessages(patch, currentMidiChannel, message, targetPatch) {
    
    let transmitArray = [];
    
    
    switch(message) {
        case('curve'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0E, patch.gr1Parameters.patch[targetPatch].curve];
            break;
        case('cv1Amount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x15, patch.gr1Parameters.patch[targetPatch].cv1.amount];
            break;
        case('cv1Destination'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1D, patch.gr1Parameters.patch[targetPatch].cv1.destination];
            break;
        case('cv2Amount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x16, patch.gr1Parameters.patch[targetPatch].cv2.amount];
            break;
        case('cv2Destination'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1E, patch.gr1Parameters.patch[targetPatch].cv2.destination];
            break;
        case('envelopeAttack'):
            transmitArray = [0xB0 | currentMidiChannel, 0x17, patch.gr1Parameters.patch[targetPatch].envelope.attack];
            break;
        case('envelopeDecay'):
            transmitArray = [0xB0 | currentMidiChannel, 0x18, patch.gr1Parameters.patch[targetPatch].envelope.decay];
            break;
        case('envelopeSustain'):
            transmitArray = [0xB0 | currentMidiChannel, 0x19, patch.gr1Parameters.patch[targetPatch].envelope.sustain];
            break;
        case('envelopeRelease'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1A, patch.gr1Parameters.patch[targetPatch].envelope.release];
            break;
        case('lfo1Amount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x12, patch.gr1Parameters.patch[targetPatch].lfo1.amount];
            break;
        case('lfo1Destination'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1B, patch.gr1Parameters.patch[targetPatch].lfo1.destination];
            break;
        case('lfo1Frequency'):
            transmitArray = [0xB0 | currentMidiChannel, 0x11, patch.gr1Parameters.patch[targetPatch].lfo1.frequency];
            break;
        case('lfo1Sync'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1F, patch.gr1Parameters.patch[targetPatch].lfo1.sync];
            break;
        case('lfo1Waveform'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0F, patch.gr1Parameters.patch[targetPatch].lfo1.waveform];
            break;
        case('lfo2Amount'):
            transmitArray = [0xB0 | currentMidiChannel, 0x14, patch.gr1Parameters.patch[targetPatch].lfo2.amount];
            break;
        case('lfo2Destination'):
            transmitArray = [0xB0 | currentMidiChannel, 0x1C, patch.gr1Parameters.patch[targetPatch].lfo2.destination];
            break;
        case('lfo2Frequency'):
            transmitArray = [0xB0 | currentMidiChannel, 0x13, patch.gr1Parameters.patch[targetPatch].lfo2.frequency];
            break;
        case('lfo2Sync'):
            transmitArray = [0xB0 | currentMidiChannel, 0x20, patch.gr1Parameters.patch[targetPatch].lfo2.sync];
            break;
        case('lfo2Waveform'):
            transmitArray = [0xB0 | currentMidiChannel, 0x10, patch.gr1Parameters.patch[targetPatch].lfo2.waveform];
            break;
        case('cutoff'):
            transmitArray = [0xB0 | currentMidiChannel, 0x08, patch.gr1Parameters.patch[targetPatch].params.cutoff];
            break;
        case('density'):
            transmitArray = [0xB0 | currentMidiChannel, 0x03, patch.gr1Parameters.patch[targetPatch].params.density];
            break;
        case('grainsize'):
            transmitArray = [0xB0 | currentMidiChannel, 0x04, patch.gr1Parameters.patch[targetPatch].params.grainSize];
            break;
        case('panSpray'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0A, patch.gr1Parameters.patch[targetPatch].params.panSpray];
            break;
        case('resonance'):
            transmitArray = [0xB0 | currentMidiChannel, 0x09, patch.gr1Parameters.patch[targetPatch].params.resonance];
            break;
        case('scan'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0B, patch.gr1Parameters.patch[targetPatch].params.scan];
            break;
        case('scanSync'):
            transmitArray = [0xB0 | currentMidiChannel, 0x21, patch.gr1Parameters.patch[targetPatch].params.scanSync];
            break;
        case('spray'):
            transmitArray = [0xB0 | currentMidiChannel, 0x05, patch.gr1Parameters.patch[targetPatch].params.spray];
            break;
        case('tune'):
            transmitArray = [0xB0 | currentMidiChannel, 0x07, patch.gr1Parameters.patch[targetPatch].params.tune];
            break;
        case('position'):
            transmitArray = [0xB0 | currentMidiChannel, 0x02, patch.gr1Parameters.patch[targetPatch].position];
            break;
        case('resample'):
            transmitArray = [0xB0 | currentMidiChannel, 0x25, patch.gr1Parameters.patch[targetPatch].resample];
            break;
        case('sides'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0C, patch.gr1Parameters.patch[targetPatch].sides];
            break;
        case('tilt'):
            transmitArray = [0xB0 | currentMidiChannel, 0x0D, patch.gr1Parameters.patch[targetPatch].tilt];
            break;
        case('volume'):
            transmitArray = [0xB0 | currentMidiChannel, 0x24, patch.gr1Parameters.patch[targetPatch].volume];
            break;
        case('masterVolume'):
            transmitArray = [0xB0 | currentMidiChannel, 0x27, patch.gr1Parameters.globalParams.masterVolume];
            break;
        case('modulationWheel'):
            transmitArray = [0xB0 | currentMidiChannel, 0x01, patch.gr1Parameters.globalParams.modulationWheel];
            break;
        case('premixGain'):
            transmitArray = [];
            break;
        case('pitchbendRange'):
            transmitArray = [0xB0 | currentMidiChannel, 0x3C, patch.gr1Parameters.globalParams.pitchbendRange];
            break;
        case('pitchbendRange'):
            transmitArray = [0xB0 | currentMidiChannel, 0x00, targetPatch];
            break;
        default:
            console.log('no message');
    }
    
    return transmitArray;
    
}

export default Gr1ControlChangeMessages;