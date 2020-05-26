'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('volca_fm_patches', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('01c131d5-fc4d-4c4d-a97f-2617ee575bda').references('uuid').inTable('users').onDelete('CASCADE').index();
    table.string('patch_name').notNullable().defaultTo('patch name');
    table.integer('algorithm').notNullable().defaultTo(1);
     table.json('settings').notNullable().defaultTo({
         "feedback": 0,
         "oscKeySync": 0,
         "transpose": 12
     });
     table.json('lfo').notNullable().defaultTo({
         "speed": 0,
         "delay": 0,
         "pitchModulationDepth": 0,
         "amplitudeModulationDepth": 0,
         "sync": 0,
         "lfoWaveform": 0,
         "pitchModulationSensitivity": 0
     });
     table.json('pitch_envelope').notNullable().defaultTo({
         "rate1": 0,
         "rate2": 0,
         "rate3": 0,
         "rate4": 0,
         "level1": 50,
         "level2": 50,
         "level3": 50,
         "level4": 50
     });
     table.json('global').notNullable().defaultTo({
         "monoPoly": 0,
         "pitchBendRange": 2,
         "pitchBendStep": 0,
         "modulationWheelRange": 99,
         "modulationWheelAssign": 1
     });
     table.json('performance').notNullable().defaultTo({
         "portamentoMode": 0,
         "portamentoGliss": 0,
         "portamentoTime": 0,
         "footControlRange": 0,
         "footControlAssign": 0,
         "breathControlRange": 0,
         "breathControlAssign": 0,
         "aftertouchRange": 0,
         "aftertouchAssign": 0
     });
     table.json('operatorParams').notNullable().defaultTo({
         "operator1": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
         "operator2": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
         "operator3": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
         "operator4": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
         "operator5": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
         "operator6": {
             "operatorOn": "On",
             "outputLevel": 75,
             "envelopeR1": 20,
             "envelopeL1": 90,
             "envelopeR2": 55,
             "envelopeL2": 67,
             "envelopeR3": 73,
             "envelopeL3": 50,
             "envelopeR4": 25,
             "envelopeL4": 0,
             "levelScaleBreakPoint": 60,
             "levelScaleLeftDepth": 50,
             "levelScaleLeftCurve": 0,
             "levelScaleRightDepth": 50,
             "levelScaleRightCurve": 3,
             "oscMode": 0,
             "freqCoarse": 1,
             "freqFine": 0,
             "detune": 7,
             "oscRateScale": 0,
             "amplitudeModSense": 0,
             "keyVelocitySense": 4
         },
     });
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('volca_fm_patches');
};
