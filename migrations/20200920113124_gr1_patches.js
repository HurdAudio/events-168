'use strict';
exports.up = function(knex, Promise) {
  return knex.schema.createTable('gr1_patches', function(table) {
    table.uuid('uuid').notNullable().primary();
    table.uuid('user_uuid').notNullable().defaultTo('01c131d5-fc4d-4c4d-a97f-2617ee575bda').references('uuid').inTable('users').onDelete('CASCADE').index();
     table.json('globalParams').notNullable().defaultTo({
         "currentPatch": 0,
         "masterVolume": 101,
         "modulationWheel": 0,
         "name": "default",
         "premixGain": 64,
         "pitchBendRange": 127
     });
     table.json('gr1Parameters').notNullable().defaultTo({
         "patch": [
            {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            },
             {
                "curve": 63,
                "cv1": {
                    "amount": 0,
                    "destination": 0
                },
                "cv2": {
                     "amount": 0,
                     "destination": 0
                 },
                 "envelope": {
                     "attack": 32,
                     "decay": 16,
                     "release": 87,
                     "sustain": 70
                 },
                 "lfo1": {
                     "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                 },
                "lfo2": {
                    "amount": 0,
                     "destination": 0,
                     "frequency": 0,
                     "sync": 0,
                     "waveform": 0
                },
                "params": {
                    "cutoff": 16,
                    "density": 32,
                    "grainsize": 32,
                    "panSpray": 98,
                    "resonance": 24,
                    "scan": 0,
                    "scanSync": 0,
                    "spray": 16,
                    "tune": 64
                },
                "position": 55,
                "resample": 0,
                "sides": 16,
                "tilt": 63,
                "volume": 101
            }
     ]});
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('gr1_patches');
};
