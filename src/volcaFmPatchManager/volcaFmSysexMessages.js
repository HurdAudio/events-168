import React from 'react';


function VolcaFmSysexMessages(patch, currentMidiChannel) {
    
    let checksum = 0;
    let nameArray = [];
    let onOff = 64;

    for (let i = 0; i < 10; i++) {
        if ((i > patch.patch_name.length) || (i === patch.patch_name.length)) {
            nameArray[i] = 32;
        } else {
            nameArray[i] = patch.patch_name.charCodeAt(i);
        }
    }

    if (patch.operatorParams.operator1.operatorOn === 'On') {
        onOff += 1;
    }
    if (patch.operatorParams.operator2.operatorOn === 'On') {
        onOff += 2;
    }
    if (patch.operatorParams.operator3.operatorOn === 'On') {
        onOff += 4;
    }
    if (patch.operatorParams.operator4.operatorOn === 'On') {
        onOff += 8;
    }
    if (patch.operatorParams.operator5.operatorOn === 'On') {
        onOff += 16;
    }
    if (patch.operatorParams.operator6.operatorOn === 'On') {
        onOff += 32;
    }

    let buffer = [
        0xF0,                                           // status - start Sysex
        0x43,                                           // id - yamaha (67)
        0x00 | currentMidiChannel,                      // current midi channel
        0x00,                                           // format number (0 = 1 voice)
        0x01,                                           // 0b0bbbbbbb data byte count msb
        0x1b,                                           // 0b0bbbbbbb data byte count lsb
        patch.operatorParams.operator6.envelopeR1,            // voice data start - OP6 EG rate 1
        patch.operatorParams.operator6.envelopeR2,            // OP6 EG rate2
        patch.operatorParams.operator6.envelopeR3,            // OP6 EG rate3
        patch.operatorParams.operator6.envelopeR4,            // OP6 EG rate4
        patch.operatorParams.operator6.envelopeL1,            // OP6 EG level1
        patch.operatorParams.operator6.envelopeL2,            // OP6 EG level2
        patch.operatorParams.operator6.envelopeL3,            // OP6 EG level3
        patch.operatorParams.operator6.envelopeL4,            // OP6 EG level4
        patch.operatorParams.operator6.levelScaleBreakPoint,  // OP6 level scale break point
        patch.operatorParams.operator6.levelScaleLeftDepth,   // OP6 left scale depth
        patch.operatorParams.operator6.levelScaleRightDepth,  // OP6 right scale depth
        patch.operatorParams.operator6.levelScaleLeftCurve,   // OP6 left scale curve
        patch.operatorParams.operator6.levelScaleRightCurve,  // OP6 right scale curve
        patch.operatorParams.operator6.oscRateScale,          // OP6 oscillator rate scaling
        patch.operatorParams.operator6.amplitudeModSense,     // OP6 amplitude modulation sensitivity
        patch.operatorParams.operator6.keyVelocitySense,      // OP6 key velocity sensitivity
        patch.operatorParams.operator6.outputLevel,           // OP6 output level
        patch.operatorParams.operator6.oscMode,               // OP6 Oscillator Mode
        patch.operatorParams.operator6.freqCoarse,            // OP6 Frequency Coarse
        patch.operatorParams.operator6.freqFine,              // OP6 Frequency Fine
        patch.operatorParams.operator6.detune,                // OP6 Detune
        patch.operatorParams.operator5.envelopeR1,            // OP5 EG rate 1
        patch.operatorParams.operator5.envelopeR2,            // OP5 EG rate2
        patch.operatorParams.operator5.envelopeR3,            // OP5 EG rate3
        patch.operatorParams.operator5.envelopeR4,            // OP5 EG rate4
        patch.operatorParams.operator5.envelopeL1,            // OP5 EG level1
        patch.operatorParams.operator5.envelopeL2,            // OP5 EG level2
        patch.operatorParams.operator5.envelopeL3,            // OP5 EG level3
        patch.operatorParams.operator5.envelopeL4,            // OP5 EG level4
        patch.operatorParams.operator5.levelScaleBreakPoint,  // OP5 level scale break point
        patch.operatorParams.operator5.levelScaleLeftDepth,   // OP5 left scale depth
        patch.operatorParams.operator5.levelScaleRightDepth,  // OP5 right scale depth
        patch.operatorParams.operator5.levelScaleLeftCurve,   // OP5 left scale curve
        patch.operatorParams.operator5.levelScaleRightCurve,  // OP5 right scale curve
        patch.operatorParams.operator5.oscRateScale,          // OP5 oscillator rate scaling
        patch.operatorParams.operator5.amplitudeModSense,     // OP5 amplitude modulation sensitivity
        patch.operatorParams.operator5.keyVelocitySense,      // OP5 key velocity sensitivity
        patch.operatorParams.operator5.outputLevel,           // OP5 output level
        patch.operatorParams.operator5.oscMode,               // OP5 Oscillator Mode
        patch.operatorParams.operator5.freqCoarse,            // OP5 Frequency Coarse
        patch.operatorParams.operator5.freqFine,              // OP5 Frequency Fine
        patch.operatorParams.operator5.detune,                // OP5 Detune
        patch.operatorParams.operator4.envelopeR1,            // OP4 EG rate 1
        patch.operatorParams.operator4.envelopeR2,            // OP4 EG rate2
        patch.operatorParams.operator4.envelopeR3,            // OP4 EG rate3
        patch.operatorParams.operator4.envelopeR4,            // OP4 EG rate4
        patch.operatorParams.operator4.envelopeL1,            // OP4 EG level1
        patch.operatorParams.operator4.envelopeL2,            // OP4 EG level2
        patch.operatorParams.operator4.envelopeL3,            // OP4 EG level3
        patch.operatorParams.operator4.envelopeL4,            // OP4 EG level4
        patch.operatorParams.operator4.levelScaleBreakPoint,  // OP4 level scale break point
        patch.operatorParams.operator4.levelScaleLeftDepth,   // OP4 left scale depth
        patch.operatorParams.operator4.levelScaleRightDepth,  // OP4 right scale depth
        patch.operatorParams.operator4.levelScaleLeftCurve,   // OP4 left scale curve
        patch.operatorParams.operator4.levelScaleRightCurve,  // OP4 right scale curve
        patch.operatorParams.operator4.oscRateScale,          // OP4 oscillator rate scaling
        patch.operatorParams.operator4.amplitudeModSense,     // OP4 amplitude modulation sensitivity
        patch.operatorParams.operator4.keyVelocitySense,      // OP4 key velocity sensitivity
        patch.operatorParams.operator4.outputLevel,           // OP4 output level
        patch.operatorParams.operator4.oscMode,               // OP4 Oscillator Mode
        patch.operatorParams.operator4.freqCoarse,            // OP4 Frequency Coarse
        patch.operatorParams.operator4.freqFine,              // OP4 Frequency Fine
        patch.operatorParams.operator4.detune,                // OP4 Detune
        patch.operatorParams.operator3.envelopeR1,            // OP3 EG rate 1
        patch.operatorParams.operator3.envelopeR2,            // OP3 EG rate2
        patch.operatorParams.operator3.envelopeR3,            // OP3 EG rate3
        patch.operatorParams.operator3.envelopeR4,            // OP3 EG rate4
        patch.operatorParams.operator3.envelopeL1,            // OP3 EG level1
        patch.operatorParams.operator3.envelopeL2,            // OP3 EG level2
        patch.operatorParams.operator3.envelopeL3,            // OP3 EG level3
        patch.operatorParams.operator3.envelopeL4,            // OP3 EG level4
        patch.operatorParams.operator3.levelScaleBreakPoint,  // OP3 level scale break point
        patch.operatorParams.operator3.levelScaleLeftDepth,   // OP3 left scale depth
        patch.operatorParams.operator3.levelScaleRightDepth,  // OP3 right scale depth
        patch.operatorParams.operator3.levelScaleLeftCurve,   // OP3 left scale curve
        patch.operatorParams.operator3.levelScaleRightCurve,  // OP3 right scale curve
        patch.operatorParams.operator3.oscRateScale,          // OP3 oscillator rate scaling
        patch.operatorParams.operator3.amplitudeModSense,     // OP3 amplitude modulation sensitivity
        patch.operatorParams.operator3.keyVelocitySense,      // OP3 key velocity sensitivity
        patch.operatorParams.operator3.outputLevel,           // OP3 output level
        patch.operatorParams.operator3.oscMode,               // OP3 Oscillator Mode
        patch.operatorParams.operator3.freqCoarse,            // OP3 Frequency Coarse
        patch.operatorParams.operator3.freqFine,              // OP3 Frequency Fine
        patch.operatorParams.operator3.detune,                // OP3 Detune
        patch.operatorParams.operator2.envelopeR1,            // OP2 EG rate 1
        patch.operatorParams.operator2.envelopeR2,            // OP2 EG rate2
        patch.operatorParams.operator2.envelopeR3,            // OP2 EG rate3
        patch.operatorParams.operator2.envelopeR4,            // OP2 EG rate4
        patch.operatorParams.operator2.envelopeL1,            // OP2 EG level1
        patch.operatorParams.operator2.envelopeL2,            // OP2 EG level2
        patch.operatorParams.operator2.envelopeL3,            // OP2 EG level3
        patch.operatorParams.operator2.envelopeL4,            // OP2 EG level4
        patch.operatorParams.operator2.levelScaleBreakPoint,  // OP2 level scale break point
        patch.operatorParams.operator2.levelScaleLeftDepth,   // OP2 left scale depth
        patch.operatorParams.operator2.levelScaleRightDepth,  // OP2 right scale depth
        patch.operatorParams.operator2.levelScaleLeftCurve,   // OP2 left scale curve
        patch.operatorParams.operator2.levelScaleRightCurve,  // OP2 right scale curve
        patch.operatorParams.operator2.oscRateScale,          // OP2 oscillator rate scaling
        patch.operatorParams.operator2.amplitudeModSense,     // OP2 amplitude modulation sensitivity
        patch.operatorParams.operator2.keyVelocitySense,      // OP2 key velocity sensitivity
        patch.operatorParams.operator2.outputLevel,           // OP2 output level
        patch.operatorParams.operator2.oscMode,               // OP2 Oscillator Mode
        patch.operatorParams.operator2.freqCoarse,            // OP2 Frequency Coarse
        patch.operatorParams.operator2.freqFine,              // OP2 Frequency Fine
        patch.operatorParams.operator2.detune,                // OP2 Detune
        patch.operatorParams.operator1.envelopeR1,            // OP1 EG rate 1
        patch.operatorParams.operator1.envelopeR2,            // OP1 EG rate2
        patch.operatorParams.operator1.envelopeR3,            // OP1 EG rate3
        patch.operatorParams.operator1.envelopeR4,            // OP1 EG rate4
        patch.operatorParams.operator1.envelopeL1,            // OP1 EG level1
        patch.operatorParams.operator1.envelopeL2,            // OP1 EG level2
        patch.operatorParams.operator1.envelopeL3,            // OP1 EG level3
        patch.operatorParams.operator1.envelopeL4,            // OP1 EG level4
        patch.operatorParams.operator1.levelScaleBreakPoint,  // OP1 level scale break point
        patch.operatorParams.operator1.levelScaleLeftDepth,   // OP1 left scale depth
        patch.operatorParams.operator1.levelScaleRightDepth,  // OP1 right scale depth
        patch.operatorParams.operator1.levelScaleLeftCurve,   // OP1 left scale curve
        patch.operatorParams.operator1.levelScaleRightCurve,  // OP1 right scale curve
        patch.operatorParams.operator1.oscRateScale,          // OP1 oscillator rate scaling
        patch.operatorParams.operator1.amplitudeModSense,     // OP1 amplitude modulation sensitivity
        patch.operatorParams.operator1.keyVelocitySense,      // OP1 key velocity sensitivity
        patch.operatorParams.operator1.outputLevel,           // OP1 output level
        patch.operatorParams.operator1.oscMode,               // OP1 Oscillator Mode
        patch.operatorParams.operator1.freqCoarse,            // OP1 Frequency Coarse
        patch.operatorParams.operator1.freqFine,              // OP1 Frequency Fine
        patch.operatorParams.operator1.detune,                // OP1 Detune
        patch.pitch_envelope.rate1,               // pitch EG rate 1
        patch.pitch_envelope.rate2,               // pitch EG rate 2
        patch.pitch_envelope.rate3,               // pitch EG rate 3
        patch.pitch_envelope.rate4,               // pitch EG rate 4
        patch.pitch_envelope.level1,              // pitch EG level 1
        patch.pitch_envelope.level2,              // pitch EG level 2
        patch.pitch_envelope.level3,              // pitch EG level 3
        patch.pitch_envelope.level4,              // pitch EG level 4
        (patch.algorithm - 1),                          // algorithm #
        patch.settings.feedback,                 // feedback
        patch.settings.oscKeySync,               // oscillator key sync
        patch.lfo.speed,                         // lfo speed
        patch.lfo.delay,                         // lfo delay
        patch.lfo.pitchModulationDepth,          // lfo pitch modulation depth
        patch.lfo.amplitudeModulationDepth,      // lfo amplitude modulation depth
        patch.lfo.sync,                          // lfo sync
        patch.lfo.lfoWaveform,                   // lfo waveform
        patch.lfo.pitchModulationSensitivity,    // lfo pitch modulation sensitivity
        patch.settings.transpose,                // transpose
        nameArray[0],                                   // Name Character 1
        nameArray[1],                                   // Name Character 2
        nameArray[2],                                   // Name Character 3
        nameArray[3],                                   // Name Character 4
        nameArray[4],                                   // Name Character 5
        nameArray[5],                                   // Name Character 6
        nameArray[6],                                   // Name Character 7
        nameArray[7],                                   // Name Character 8
        nameArray[8],                                   // Name Character 9
        nameArray[9],                                   // Name Character 10
        onOff                                           // voice data end - OP on/off
        //checksum,                                     // checksum
        //0xf7                                          // 0b1111_0111 ; EOX
    ];

    for (let i = 6; i < buffer.length; i++) {
        checksum += buffer[i];
    }
    checksum &= 0xff;
    checksum = (~checksum) + 1;
    checksum &= 0x7f;
    buffer.push(checksum);
    buffer.push(0xf7);

    return buffer;
}

export default VolcaFmSysexMessages;