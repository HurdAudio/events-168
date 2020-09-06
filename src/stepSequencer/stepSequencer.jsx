import React, { useState } from 'react';

import {
  BrowserRouter as Router,
  NavLink,
  Switch,
  Route,
  Link
} from "react-router-dom";
import midiConnection from '../midiManager/midiConnection';
import './stepSequencer.style.jana.css';
import midi5pin from '../img/midi5pin.svg';
import quarterNote from '../img/quarterNote.png';
import dottedQuarter from '../img/dottedQuarter.png';
import halfNote from '../img/halfNote.png';
import dottedHalfNote from '../img/dottedHalfNote.png';
import wholeNote from '../img/wholeNote.png';
import dottedWholeNote from '../img/dottedWholeNote.png';
import doubleWholeNote from '../img/doubleWholeNote.png';
import oneHundredTwentyEighthNote from '../img/oneHundredTwentyEighthNote.png';
import sixtyfourthNote from '../img/sixtyfourthNote.png';
import thirtySecondNote from '../img/thirtySecondNote.png';
import sixteenthNote from '../img/sixteenthNote.png';
import eighthNote from '../img/eighthNote.png';
import home from '../img/home.svg';
import playButton from '../img/playButton.png';
import pauseButton from '../img/pauseButton.png';
import backward from '../img/backward.png';
import forward from '../img/forward.png';
import axios from 'axios';
import AvailableDevices from '../midiManager/availableDevices';

const sequencePlaying = false;
const svgHeight = 260;
const svgWidth = 350;


function StepSequencer(user, seq) {
    
    let beatDigits;
    let userOutputs;
    
    const beatResolution = parseInt(user.clock_resolution);
    if (beatResolution > 99999) {
        beatDigits = 6;
    } else if (beatResolution > 9999) {
        beatDigits = 5;
    } else if (beatResolution > 999) {
        beatDigits = 4;
    } else if (beatResolution > 99) {
        beatDigits = 3;
    } else if (beatResolution > 9) {
        beatDigits = 2;
    } else {
        beatDigits = 1;
    }
    console.log(user.midi_connections);
    if (user.midi_connections) {
        userOutputs = user.midi_connections.outputs;
    } else {
        userOutputs = [];
    }
    
    const [availableDevices, setAvailableDevices] = useState(AvailableDevices());
    const [stepSequenceMonth, setStepSequenceMonth] = useState('_JanuaryA');
    const [stepSequencerState, setStepSequencerState] = useState('_Active');
    const [stepSequencerLoadModalState, setStepSequencerLoadModalState] = useState('_Inactive');
    const [trackGuardrailState, setTrackGuardrailState] = useState('_Inactive');
    const [repeatModalState, setRepeatModalState] = useState('_Inactive');
    const [addFxModalState, setAddFxModalState] = useState('_Inactive');
    const [ritAccelModalState, setRitAccelModalState] = useState('_Inactive');
    const [rudeSolo, setRudeSolo] = useState(false);
    const [midiOutputs, setMidiOutputs] = useState(userOutputs);
    const [saveAsName, setSaveAsName] = useState('');
    const [midiEvents, setMidiEvents] = useState([
        {
            name: 'initial patch',
            uuid: '9f4db083-23fa-4c1c-b7a5-ee3f57288aa7'
        },
        {
            name: 'note event',
            uuid: '439da322-bd74-4dc5-8e4b-b4ca664657a9'
        },
        {
            name: 'pitch bend',
            uuid: 'd1595e03-bcd9-4ca7-9247-4d54723c5a05'
        },
        {
            name: 'program change',
            uuid: '2fdb9151-68ad-46f7-b11e-adbb15d12a09'
        },
        {
            name: 'aftertouch poly',
            uuid: '9a141aff-eea8-46c4-8650-679d9218fb08'
        },
        {
            name: 'aftertouch channel',
            uuid: 'd1c6b635-d413-40aa-97dd-7d795230d5f4'
        },
        {
            name: 'controller change',
            uuid: '884e57d3-f5a5-4192-b640-78891802867b'
        },
        {
            name: 'bank select',
            uuid: '042b257f-f1de-488d-900b-6d7c49361748'
        },
        {   
            name: 'modulation wheel',
            uuid: '89265cc9-9ce5-4219-bfb6-371b18ed42b1'
        },
        {
            name: 'breath controller',
            uuid: '4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e'
        },
        {
            name: 'foot controller',
            uuid: '2a3b9983-d175-4bde-aca9-63b70944ec7e'
        },
        {
            name: 'portamento time',
            uuid: '96a94fa3-cf34-4ab5-8cb4-586b25e8b40c'
        },
        {
            name: 'data entry msb',
            uuid: 'babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb'
        },
        {
            name: 'channel volume',
            uuid: '5138de25-1d5c-473e-8a68-ddbeadc32bd4'
        },
        {
            name: 'balance',
            uuid: '598a5aaa-346c-4e2c-80ce-08cbcb1e7c24'
        },
        {
            name: 'pan',
            uuid: 'ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb'
        },
        {
            name: 'expression controller',
            uuid: '15a9c413-3dbe-4890-bd52-287c2a48f615'
        },
        {
            name: 'effect control 1',
            uuid: '9434ea7e-6a63-423c-9be5-77584bd587e4'
        },
        {
            name: 'effect control 2',
            uuid: 'a97eee86-2a5e-47db-99b1-74b61bc994c1'
        },
        {
            name: 'general purpose controller 1',
            uuid: '6eaceab3-35bb-49e2-ad82-5bd4c3a32679'
        },
        {
            name: 'general purpose controller 2',
            uuid: 'cdd20c5c-f942-4f8f-a15f-a750ecfd957c'
        },
        {
            name: 'general purpose controller 3',
            uuid: '3474f1bf-5aae-434e-ba95-102114de0dd2'
        },
        {
            name: 'general purpose controller 4',
            uuid: '221e9b45-0ec8-421e-adb6-cfaf19b69610'
        },
        {
            name: 'damper pedal on/off',
            uuid: 'a889cf3f-3986-46ef-9bb3-d4b42fc41fb0'
        },
        {
            name: 'portamento on/off',
            uuid: 'c3543d3c-ccc5-45e2-ac42-c62c8b364690'
        },
        {
            name: 'sostenuto on/off',
            uuid: '26a0ab85-b2cc-4442-84c0-bd30fb239869'
        },
        {
            name: 'soft pedal on/off',
            uuid: '890d5a31-859b-4958-8eca-dd0b52f1fbec'
        },
        {
            name: 'legato footswitch',
            uuid: 'f31779f1-2599-487b-8e96-5b0abd35394e'
        },
        {
            name: 'hold 2',
            uuid: '75cf0bca-6196-4219-9eef-54272e8020a8'
        },
        {
            name: 'sound variation',
            uuid: 'eaf504e8-217f-4e76-b6cc-ba78ff99aba3'
        },
        {
            name: 'timbre/harmonic intensity',
            uuid: '5531a226-bc2c-4c60-9505-9b8da30b86c2'
        },
        {
            name: 'release time',
            uuid: 'cb30f654-a1c1-4e76-b479-d41821ede969'
        },
        {
            name: 'attack time',
            uuid: '9390dbb8-efe9-4b41-adf3-47c6531f7aa1'
        },
        {
            name: 'brightness',
            uuid: 'f61546fe-fd2a-4c89-813c-44dde15e6aa2'
        },
        {
            name: 'decay time',
            uuid: '79d3c79f-6d9b-4eb1-ae78-51dd9362e21b'
        },
        {
            name: 'vibrato rate',
            uuid: '752a2e67-911e-45b5-801d-0841c38cf8c2'
        },
        {
            name: 'vibrato depth',
            uuid: '97fb8e80-b937-464d-8830-212dcac90675'
        },
        {
            name: 'vibrato delay',
            uuid: '5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c'
        },
        {
            name: 'undefined',
            uuid: '1ab83a91-21b1-4d56-b333-3a59c4ade431'
        },
        {
            name: 'general purpose controller 5',
            uuid: 'b64c45f7-cf57-4864-a07f-e8f82dbf63b1'
        },
        {
            name: 'general purpose controller 6',
            uuid: 'faf99fca-87c1-4e8e-81f5-b0f14251db08'
        },
        {
            name: 'general purpose controller 7',
            uuid: '4c64d103-e813-4c4a-80b5-01cd8186635c'
        },
        {
            name: 'general purpose controller 8',
            uuid: 'e181eaf9-1b61-4e5b-8982-833fb9594529'
        },
        {
            name: 'portamento control',
            uuid: '246e9232-3d6a-4352-8957-d0ff9c1c834e'
        },
        {
            name: 'high resolution velocity prefix',
            uuid: '80e77d4b-c523-4393-a279-6d7b15e65d8a'
        },
        {
            name: 'effects 1 depth',
            uuid: 'c3b8b079-4994-480e-9b0a-8cbce11fba46'
        },
        {
            name: 'effects 2 depth',
            uuid: '206ff86e-6894-4b56-9f5b-f5387d18f2ea'
        },
        {
            name: 'effects 3 depth',
            uuid: '2517d341-7ae3-4dae-b866-49bd2fc9b21c'
        },
        {
            name: 'effects 4 depth',
            uuid: '269524b5-a240-42e5-abfe-bf074ab7cb11'
        },
        {
            name: 'effects 5 depth',
            uuid: 'e1568b69-6246-469f-9654-a398a1606ef9'
        },
        {
            name: 'mono mode',
            uuid: '44feabcb-b735-4980-a3fc-1e229b4bd115'
        },
        {
            name: 'poly mode',
            uuid: '40fc271b-2b22-40ff-a43d-90404ff07c69'
        }
    ]);
    const [repeaterSettings, setRepeaterSettings] = useState({
        from: {
            bar: 1,
            beat: 1,
            ticks: 0
        },
        numberOfTimes: 1,
        start: {
            bar: 3,
            beat: 1,
            ticks: 0
        },
        to: {
            bar: 2,
            beat: 1,
            ticks: 0
        }
    });
    const [currentMidiEvent, setCurrentMidiEvent] = useState('439da322-bd74-4dc5-8e4b-b4ca664657a9');
    const [stepInterval, setStepInterval] = useState({
        intervalTicks: 960,
        note: 'quarter'
    });
    const [ritAccelParams, setRitAccelParams] = useState({
        curve: [0, 0],
        from: {
            note: 'quarter',
            tempo: 120,
            time: {
                bar: 1,
                beat: 1,
                ticks: 0
            }
        },
        to: {
            note: 'quarter',
            tempo: 190,
            time: {
                bar: 2,
                beat: 1, 
                ticks: 0
            }
        }
    });
    const [currentPitchInput, setCurrentPitchInput] = useState(60);
    const [currentMidiChannelInput, setCurrentMidiChannelInput] = useState(0);
    const [currentVelocityInput, setCurrentVelocityInput] = useState(64);
    const [midiImage, setMidiImage] = useState(midi5pin);
    const [playState, setPlayState] = useState(false);
    const [saveAsDialogStatus, setSaveAsDialogStatus] = useState('_Inactive');
    const [sequence, setSequence] = useState({
        duration: {
            bar: 25,
            beat: 1,
            ticks: 0
        },
        header: {
            author: user.uuid,
            name: 'seq 1'
        },
        tracks: [
            {
                active: true,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [
                    {
                        id: 0,
                        event: '9f4db083-23fa-4c1c-b7a5-ee3f57288aa7',
                        midiChannel: 0,
                        name: 'initial patch',
                        patch: 'fake patch',
                        time: {
                            bar: 0,
                            beat: 1,
                            ticks: 0
                        }
                    },
                    {
                        id: 1,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 1,
                                ticks: 0
                            },
                            velocity: 64
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 1,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 2,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 2,
                                ticks: 0
                            },
                            velocity: 64
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 2,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 3,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 3,
                                ticks: 0
                            },
                            velocity: 75
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 3,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 4,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 4,
                                ticks: 0
                            },
                            velocity: 75
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 1,
                                beat: 4,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 5,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 2,
                                beat: 1,
                                ticks: 0
                            },
                            velocity: 90
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 2,
                                beat: 1,
                                ticks: 400
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 6,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 69,
                            time: {
                                bar: 2,
                                beat: 1,
                                ticks: 480
                            },
                            velocity: 85
                        },
                        noteOff: {
                            note: 69,
                            time: {
                                bar: 2,
                                beat: 1,
                                ticks: 920
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 7,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 68,
                            time: {
                                bar: 2,
                                beat: 2,
                                ticks: 0
                            },
                            velocity: 90
                        },
                        noteOff: {
                            note: 68,
                            time: {
                                bar: 2,
                                beat: 2,
                                ticks: 400
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 8,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 69,
                            time: {
                                bar: 2,
                                beat: 2,
                                ticks: 480
                            },
                            velocity: 99
                        },
                        noteOff: {
                            note: 69,
                            time: {
                                bar: 2,
                                beat: 4,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 9,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 1,
                                ticks: 0
                            },
                            velocity: 84
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 1,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 10,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 2,
                                ticks: 0
                            },
                            velocity: 85
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 2,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 11,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 3,
                                ticks: 0
                            },
                            velocity: 97
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 3,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 12,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 4,
                                ticks: 0
                            },
                            velocity: 100
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 3,
                                beat: 4,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 13,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 73,
                            time: {
                                bar: 4,
                                beat: 1,
                                ticks: 0
                            },
                            velocity: 120
                        },
                        noteOff: {
                            note: 73,
                            time: {
                                bar: 4,
                                beat: 1,
                                ticks: 400
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 14,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 4,
                                beat: 1,
                                ticks: 480
                            },
                            velocity: 99
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 4,
                                beat: 1,
                                ticks: 920
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 15,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 69,
                            time: {
                                bar: 4,
                                beat: 2,
                                ticks: 0
                            },
                            velocity: 104
                        },
                        noteOff: {
                            note: 69,
                            time: {
                                bar: 4,
                                beat: 2,
                                ticks: 400
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 16,
                        event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                        midiChannel: 0,
                        name: 'note',
                        noteOn: {
                            note: 71,
                            time: {
                                bar: 4,
                                beat: 2,
                                ticks: 480
                            },
                            velocity: 101
                        },
                        noteOff: {
                            note: 71,
                            time: {
                                bar: 4,
                                beat: 4,
                                ticks: 900
                            },
                            velocity: 0
                        }
                    },
                    {
                        id: 17,
                        bend: 16383,
                        event: 'd1595e03-bcd9-4ca7-9247-4d54723c5a05',
                        midiChannel: 0,
                        name: 'pitch bend',
                        time: {
                            bar: 5,
                            beat: 1,
                            ticks: 0
                        }
                    },
                    {
                        id: 18,
                        event: '2fdb9151-68ad-46f7-b11e-adbb15d12a09',
                        midiChannel: 0,
                        name: 'pr change',
                        program: 7,
                        time: {
                            bar: 5,
                            beat: 1,
                            ticks: 120
                        }
                    },
                    {
                        id: 19,
                        event: '9a141aff-eea8-46c4-8650-679d9218fb08',
                        midiChannel: 0,
                        name: 'after(poly)',
                        note: 60,
                        pressure: 55,
                        time: {
                            bar: 5,
                            beat: 2,
                            ticks: 0
                        }
                    },
                    {
                        id: 20,
                        event: 'd1c6b635-d413-40aa-97dd-7d795230d5f4',
                        midiChannel: 0,
                        name: 'after(chan)',
                        note: 60,
                        pressure: 55,
                        time: {
                            bar: 6,
                            beat: 1,
                            ticks: 0
                        }
                    },
                    {
                        id: 21,
                        controller: 0,
                        event: '884e57d3-f5a5-4192-b640-78891802867b',
                        midiChannel: 0,
                        name: 'controller',
                        time: {
                            bar: 6,
                            beat: 2,
                            ticks: 0
                        },
                        value: 0
                    },
                    {
                        id: 22,
                        event: '042b257f-f1de-488d-900b-6d7c49361748',
                        midiChannel: 0,
                        name: 'bank',
                        time: {
                            bar: 7,
                            beat: 1,
                            ticks: 0
                        },
                        value: 0
                    },
                    {
                        id: 23,
                        event: 'a889cf3f-3986-46ef-9bb3-d4b42fc41fb0',
                        midiChannel: 0,
                        name: 'damper',
                        time: {
                            bar: 8,
                            beat: 1,
                            ticks: 0
                        },
                        value: 64
                    }
                ],
                id: 0,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track01',
                output: '-977315806',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            },
            {
                active: false,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [],
                id: 1,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track02',
                output: '43172242',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            },
            {
                active: false,
                collection: null,
                device: 'e3bfacf5-499a-4247-b512-2c4bd15861ad',
                events: [],
                id: 2,
                image: 'https://events-168-hurdaudio.s3.amazonaws.com/midi-manager/devices/b3773bb133b4062103d9807e45bb300c_sp.png',
                mute: false,
                name: 'track03',
                output: '-1706185039',
                initialPatch: null,
                instrument: {
                    collection: null,
                    bank: null,
                    patch: null
                },
                solo: false
            }
        ]
    });
    const [activeTrack, setActiveTrack] = useState(sequence.tracks[0].id);
    const [currentPosition, setCurrentPosition] = useState({
        measure: {
            bar: parseInt(1),
            beat: parseInt(1),
            ticks: parseInt(0)
        }
    });
    const [homePosition, setHomePosition] = useState({
        measure: {
            bar: parseInt(1),
            beat: parseInt(1),
            ticks: parseInt(0)
        }
    });
    const [tempoTrack, setTempoTrack] = useState({
        tick: [
            {
                bar: 1,
                beat: 1,
                cumulativeTime: 0,
                index: 0,
                ticks: 0,
                meterNumerator: 4,
                meterDenominator: 4,
                tempo: 120,
                tempoBase: 'quarter'
            },
            {
                bar: 9,
                beat: 1,
                cumulativeTime: 16000,
                index: 1,
                ticks: 0,
                meterChange: true,
                meterNumerator: 3,
                meterDenominator: 4,
                tempo: 120,
                tempoBase: 'quarter',
                tempoChange: false
            },
            {
                bar: 15,
                beat: 1,
                cumulativeTime: 28000,
                index: 2,
                ticks: 0,
                meterChange: false,
                meterNumerator: 3,
                meterDenominator: 4,
                tempo: 60,
                tempoBase: 'quarter',
                tempoChange: true
            },
            {
                bar: 25,
                beat: 1,
                cumulativeTime: 58000,
                index: 3,
                ticks: 0,
                meterChange: false,
                meterNumerator: 1,
                meterDenominator: 1,
                tempo: null,
                tempoBase: null,
                tempoChange: false
            }
        ]
    });
    const [currentMeter, setCurrentMeter] = useState({
        numerator: parseInt(4),
        denominator: parseInt(4)
    });
    const [currentTempo, setCurrentTempo] = useState({
        tempo: 120,
        tempoBase: 'quarter'
    });
    const [currentClockPosition, setCurrentClockPosition] = useState('0:00.000');
    
    const cancelRepeaterModal = () => {
        setRepeatModalState('_Inactive');
        setStepSequencerState('_Active');
    }
    
    const openRepeatEventsModal = () => {
        setRepeatModalState('_Active');
        setStepSequencerState('_Inactive');
    }
    
    const cancelPatchLoad = () => {
        setStepSequencerLoadModalState('_Inactive');
        setStepSequencerState('_Active');
    }
    
    const loadModalOn = () => {
        setStepSequencerLoadModalState('_Active');
        setStepSequencerState('_Inactive');
    }
    
    const updateChangeAsName = (val) => {
        setSaveAsName(val);
    }
    
    const submitSaveAsDialog = (name) => {
        console.log(name);
    }
    
    const cancelSaveAsDialog = () => {
        setSaveAsDialogStatus('_Inactive'); 
        setStepSequencerState('_Active');
    }
    
    const executeSaveAsDialog = () => {
        setSaveAsDialogStatus('_Active');
        setStepSequencerState('_Inactive');
        document.getElementById('saveAsInput').focus();
    }
    
    const timePosition = (position) => {
        let index = 0;
        let cumulative = 0;
        let exitCondition = false;
        let meterNumerator = tempoTrack.tick[0].meterNumerator;
        let meterDenominator = tempoTrack.tick[0].meterDenominator;
        let tempo = tempoTrack.tick[0].tempo;
        let tempoBase = tempoTrack.tick[0].tempoBase;
        let calcTicks = 0;
        
        while(!exitCondition) {
            if (index > 0) {
                if (tempoTrack.tick[index].meterChange) {
                    meterNumerator = tempoTrack.tick[index].meterNumerator;
                    meterDenominator = tempoTrack.tick[index].meterDenominator
                }
                if (tempoTrack.tick[index].tempoChange) {
                    tempo = tempoTrack.tick[index].tempo;
                    tempoBase = tempoTrack.tick[index].tempoBase;
                }
            }
            if (tempoTrack.tick.length === index) {
                exitCondition = true;
                cumulative = tempoTrack.tick[index - 1].cumulativeTime;
            } else {
                if (positionEqualTo(position, tempoTrack.tick[index])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else if (positionGreaterThan(position, tempoTrack.tick[index + 1])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else {
                    ++index;
                }
            }
        }
        if (positionEqualTo(position, tempoTrack.tick[index])) {
            return cumulative;
        } else {
            calcTicks = convertDurationToMilliseconds(position, tempoTrack.tick[index]);
            cumulative += calcTicks;
            return cumulative;
        }
    }
    
    const indexPositionPreToPoint = (position, toPoint) => {
        if (position === undefined) {
            return true;
        }

        if (position.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') {
            if (position.noteOn.time.bar < toPoint.bar) {
                return true;
            } else if (position.noteOn.time.bar === toPoint.bar) {
                if (position.noteOn.time.beat < toPoint.beat) {
                    return true;
                } else if (position.noteOn.time.beat === toPoint.beat) {
                    if (position.noteOn.time.ticks < toPoint.ticks) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (position.time.bar < toPoint.bar) {
                return true;
            } else if (position.time.bar === toPoint.bar) {
                if (position.time.beat < toPoint.beat) {
                    return true;
                } else if (position.time.beat === toPoint.beat) {
                    if (position.time.ticks < toPoint.ticks) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    
    const playTrackEvents = (track, timeStart) => {
        console.log(user.midi_connections.outputs);
        let output = 0;
        for (let o = 0; o < user.midi_connections.outputs.length; o++) {
            if (user.midi_connections.outputs[o].id === track.output) {
                output = o;
            }
        }
        
        function holdForContinue(index, toPoint) {
            let pause;
            let aTime, bTime;
            if ((track.events[index] === undefined) || (track.events.length === 0)) {
                return;
            }
            if (toPoint.bar === 1) {
                aTime = 0;
            } else {
                aTime = timePosition({ bar: (toPoint.bar - 1), beat: 0, ticks: 0});
            }
            bTime = timePosition({ bar: toPoint.bar, beat: toPoint.beat, ticks: toPoint.ticks});
            pause = (bTime - aTime) * 0.7;
            setTimeout(() => {
                trackPlayer(index, { bar: (toPoint.bar + 1), beat: 1, ticks: 0});
            }, pause);
        }
        
        function trackPlayer(playPosition, toPoint) {
            let index = playPosition;
            if (track.events.length === 0) {
                return;
            }
            if (index === track.events.length) {
                return;
            }
            if (parseInt(toPoint.bar) === parseInt(sequence.duration.bar)) {
                return;
            }
            if (sequencePlaying && (track.events.length > 0) && (index < track.events.length)) {
                if (!track.mute || (rudeSolo && track.solo && !track.mute)) {
                    while(indexPositionPreToPoint((track.events[index]), toPoint) && (index < track.events.length)) {
                        switch(track.events[index].event) {
                            case('439da322-bd74-4dc5-8e4b-b4ca664657a9'):
                                // NOTE event
                                // outputs[index].send([0x90 | currentMidiChannel, rootNote, 0x7f]);
                                user.midi_connections.outputs[output].send([0x90 | track.events[index].midiChannel, track.events[index].noteOn.note, track.events[index].noteOn.velocity], timeStart + timePosition({ bar: track.events[index].noteOn.time.bar, beat: track.events[index].noteOn.time.beat, ticks: track.events[index].noteOn.time.ticks}));
                                user.midi_connections.outputs[output].send([0x80 | track.events[index].midiChannel, track.events[index].noteOff.note, track.events[index].noteOff.velocity], timeStart + timePosition({ bar: track.events[index].noteOff.time.bar, beat: track.events[index].noteOff.time.beat, ticks: track.events[index].noteOff.time.ticks}));
                                console.log(track.events[index].noteOn.note);
                                break;
                            case('d1595e03-bcd9-4ca7-9247-4d54723c5a05'):
                                // PITCH BEND event
                                // outputs[index].send([0xE0 | currentMidiChannel, mostSignificantByte, leastSignificantByte]);
                                let msb = parseInt(track.events[index].bend) << 1;
                                let lsb = msb >> 1;
                                user.midi_connections.outputs[output].send([0xE0 | track.events[index].midiChannel, msb, lsb], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('2fdb9151-68ad-46f7-b11e-adbb15d12a09'):
                                // PROGRAM CHANGE event
                                // outputs[index].send([0xC0 | currentMidiChannel, patchNumber]);
                                user.midi_connections.outputs[output].send([0xC0 | track.events[index].midiChannel, track.events[index].program], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('9a141aff-eea8-46c4-8650-679d9218fb08'):
                                // AFTERTOUCH POLY event
                                // outputs[index].send([0xA0 | currentMidiChannel, note, pressure]);
                                user.midi_connections.outputs[output].send([0xA0 | track.events[index].midiChannel, track.events[index].note, track.events[index].pressure], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('d1c6b635-d413-40aa-97dd-7d795230d5f4'):
                                // AFTERTOUCH CHANNEL event
                                // outputs[index].send([0xD0 | currentMidiChannel, note, pressure]);
                                user.midi_connections.outputs[output].send([0xD0 | track.events[index].midiChannel, track.events[index].note, track.events[index].pressure], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('884e57d3-f5a5-4192-b640-78891802867b'):
                                // CONTROLLER CHANGE event
                                // outputs[index].send([0xB0 | currentMidiChannel, controller, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, track.events[index].controller, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('042b257f-f1de-488d-900b-6d7c49361748'):
                                // BANK SELECT event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x00, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x00, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('89265cc9-9ce5-4219-bfb6-371b18ed42b1'):
                                // MODULATION WHEEL event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x01, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x01, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e'):
                                // BREATH CONTROLLER event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x02, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x02, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('2a3b9983-d175-4bde-aca9-63b70944ec7e'):
                                // FOOT CONTROLLER event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x04, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x04, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('96a94fa3-cf34-4ab5-8cb4-586b25e8b40c'):
                                // PORTAMENTO TIME event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x05, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x05, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb'):
                                // DATA ENTRY MSB event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x06, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x06, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('5138de25-1d5c-473e-8a68-ddbeadc32bd4'):
                                // CHANNEL VOLUME event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x07, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x07, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('598a5aaa-346c-4e2c-80ce-08cbcb1e7c24'):
                                // BALANCE event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x08, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x08, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb'):
                                // PAN event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x0A, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x0A, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('15a9c413-3dbe-4890-bd52-287c2a48f615'):
                                // EXPRESSION CONTROLLER event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x0B, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x0B, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('9434ea7e-6a63-423c-9be5-77584bd587e4'):
                                // EFFECT CONTROL 1 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x0C, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x0C, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('a97eee86-2a5e-47db-99b1-74b61bc994c1'):
                                // EFFECT CONTROL 2 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x0D, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x0D, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('6eaceab3-35bb-49e2-ad82-5bd4c3a32679'):
                                // GENERAL PURPOSE CONTROLLER 1 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x10, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x10, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('cdd20c5c-f942-4f8f-a15f-a750ecfd957c'):
                                // GENERAL PURPOSE CONTROLLER 2 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x11, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x11, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('3474f1bf-5aae-434e-ba95-102114de0dd2'):
                                // GENERAL PURPOSE CONTROLLER 3 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x12, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x12, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('221e9b45-0ec8-421e-adb6-cfaf19b69610'):
                                // GENERAL PURPOSE CONTROLLER 4 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x13, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x13, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('a889cf3f-3986-46ef-9bb3-d4b42fc41fb0'):
                                // DAMPER PEDAL event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x40, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x40, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('c3543d3c-ccc5-45e2-ac42-c62c8b364690'):
                                // PORTAMENTO ON/OFF event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x41, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x41, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('26a0ab85-b2cc-4442-84c0-bd30fb239869'):
                                // SOSTENUTO ON/OFF event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x42, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x42, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('890d5a31-859b-4958-8eca-dd0b52f1fbec'):
                                // SOFT PEDAL ON/OFF event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x43, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x43, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('f31779f1-2599-487b-8e96-5b0abd35394e'):
                                // LEGATO FOOTSWITCH ON/OFF event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x44, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x44, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('75cf0bca-6196-4219-9eef-54272e8020a8'):
                                // HOLD 2 ON/OFF event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x45, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x45, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('eaf504e8-217f-4e76-b6cc-ba78ff99aba3'):
                                // SOUND VARIATION event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x46, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x46, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('5531a226-bc2c-4c60-9505-9b8da30b86c2'):
                                // TIMBRE/HARMONIC INTENSITY event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x47, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x47, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('cb30f654-a1c1-4e76-b479-d41821ede969'):
                                // RELEASE TIME event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x48, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x48, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('9390dbb8-efe9-4b41-adf3-47c6531f7aa1'):
                                // ATTACK TIME event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x49, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x49, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('f61546fe-fd2a-4c89-813c-44dde15e6aa2'):
                                // BRIGHTNESS event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4A, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4A, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('79d3c79f-6d9b-4eb1-ae78-51dd9362e21b'):
                                // DECAY TIME event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4B, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4B, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('752a2e67-911e-45b5-801d-0841c38cf8c2'):
                                // VIBRATO RATE event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4C, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4C, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('97fb8e80-b937-464d-8830-212dcac90675'):
                                // VIBRATO DEPTH event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4D, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4D, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c'):
                                // VIBRATO DELAY event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4E, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4E, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('1ab83a91-21b1-4d56-b333-3a59c4ade431'):
                                // UNDEFINED event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x4F, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x4F, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('b64c45f7-cf57-4864-a07f-e8f82dbf63b1'):
                                // GENERAL PURPOSE CONTROLLER 5 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x50, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x50, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('faf99fca-87c1-4e8e-81f5-b0f14251db08'):
                                // GENERAL PURPOSE CONTROLLER 6 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x51, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x51, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('4c64d103-e813-4c4a-80b5-01cd8186635c'):
                                // GENERAL PURPOSE CONTROLLER 7 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x52, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x52, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('e181eaf9-1b61-4e5b-8982-833fb9594529'):
                                // GENERAL PURPOSE CONTROLLER 8 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x53, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x53, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('246e9232-3d6a-4352-8957-d0ff9c1c834e'):
                                // PORTAMENTO CONTROL event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x54, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x54, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('80e77d4b-c523-4393-a279-6d7b15e65d8a'):
                                // HIGH RESOLUTION VELOCITY PREFIX event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x58, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x58, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('c3b8b079-4994-480e-9b0a-8cbce11fba46'):
                                // EFFECTS DEPTH 1 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x5B, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x5B, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('206ff86e-6894-4b56-9f5b-f5387d18f2ea'):
                                // EFFECTS DEPTH 2 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x5C, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x5C, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('2517d341-7ae3-4dae-b866-49bd2fc9b21c'):
                                // EFFECTS DEPTH 3 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x5D, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x5D, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('269524b5-a240-42e5-abfe-bf074ab7cb11'):
                                // EFFECTS DEPTH 4 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x5E, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x5E, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('e1568b69-6246-469f-9654-a398a1606ef9'):
                                // EFFECTS DEPTH 5 event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x5F, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x5F, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('44feabcb-b735-4980-a3fc-1e229b4bd115'):
                                // MONO MODE event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x7E, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x7E, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            case('40fc271b-2b22-40ff-a43d-90404ff07c69'):
                                // POLY MODE event
                                // outputs[index].send([0xB0 | currentMidiChannel, 0x7F, value]);
                                user.midi_connections.outputs[output].send([0xB0 | track.events[index].midiChannel, 0x7F, track.events[index].value], timeStart + timePosition({ bar: track.events[index].time.bar, beat: track.events[index].time.beat, ticks: track.events[index].time.ticks }));
                                break;
                            default:
                                console.log('unsupported event');
                        }
                        ++index;
                    }
                    holdForContinue(index, toPoint);
                }
            } 
        }
        
        trackPlayer(0, { bar: 2, beat: 1, ticks: 0});
        
        
    }
    
    const visualTracker = (timeStart) => {
        console.log(timeStart);
        updateTickPosition(1);
//        let now = new Date();
//        if (!sequencePlaying || (parseInt(currentPosition.measure.bar) === parseInt(sequence.duration.bar))) {
//            return;
//        }
//        while (timePosition(currentPosition.measure) < ((now.getTime()) - timeStart)) {
//            updateTickPosition(parseInt(currentPosition.measure.ticks) + 10);
//        }
//        setTimeout(() => {
//            visualTracker(timeStart);
//        }, 100);
    }
    
    const playSequence = () => {
        if ((midiOutputs.length === 0) && (user.midi_connections)) {
            setMidiOutputs(user.midi_connections.outputs);
        }
        setPlayState(true);
        sequencePlaying = true;
        let timeStart = window.performance.now() + 900.0;
        for (let i = 0; i < sequence.tracks.length; i++) {
            playTrackEvents(sequence.tracks[i], timeStart);
        }
        setTimeout(() => {
            let now = new Date();
            if (sequencePlaying) {
                visualTracker(now.getTime());
            }
        }, 900);
    }
    
    const stopSequence = () => {
        let connections
        setPlayState(false);
        sequencePlaying = false;
//        for (let i = 0; i < user.midi_connections.outputs; i++) {
//            user.midi_connections.outputs[i].clear();
//        } // .clear() not yet supported in current browsers.
        
    }
    
    const sendToHomePosition = () => {
        let deepCopy = {...homePosition};
        let deepCurrent = {...currentPosition};
        let index = 0;
        let exitCondition = false;
        
        while(!exitCondition){
            if (positionEqualTo(deepCopy.measure, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], deepCopy.measure)) && (positionGreaterThan(deepCopy.measure, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        
        deepCurrent = {
            measure: {
                bar: deepCopy.measure.bar,
                beat: deepCopy.measure.beat,
                ticks: deepCopy.measure.ticks
            }
        };
        setCurrentPosition(deepCurrent);
        setCurrentTempo({
            tempo: tempoTrack.tick[index].tempo,
            tempoBase: tempoTrack.tick[index].tempoBase
        });
        setCurrentMeter({
            numerator: tempoTrack.tick[index].meterNumerator,
            denominator: tempoTrack.tick[index].meterDenominator
        });
        setCurrentClockPosition(calculateTimeString({bar: deepCopy.measure.bar, beat: deepCopy.measure.beat, ticks: deepCopy.measure.ticks}));
    }
    
    const sortTempoTrack = () => {
        let deepCopy = {...tempoTrack};
        
        deepCopy.tick = deepCopy.tick.sort((a, b) => {
            if (a.bar < b.bar) {
                return -1;
            } else if (a.bar > b.bar) {
                return 1;
            } else {
                if (a.beat < b.beat) {
                    return -1;
                } else if (a.beat > b.beat) {
                    return 1;
                } else {
                    if (a.ticks < b.ticks) {
                        return -1;
                    } else if (a.ticks > b.ticks) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            }
        });
        
        for (let i = 1; i < deepCopy.tick.length; i++) {
            deepCopy.tick[i].index = i;
            if (deepCopy.tick[i].meterChange) {
                deepCopy.tick[i].tempo = deepCopy.tick[i - 1].tempo;
                deepCopy.tick[i].tempoBase = deepCopy.tick[i - 1].tempoBase;
            }
            if (deepCopy.tick[i].tempoChange) {
                deepCopy.tick[i].meterNumerator = deepCopy.tick[i - 1].meterNumerator;
                deepCopy.tick[i].meterDenominator = deepCopy.tick[i - 1].meterDenominator;
            }
        }
        
        setTempoTrack(deepCopy);
    }
    
    const meterAtPosition = (position) => {
        let index = 0;
        let meter = {};
        let exitCondition = false;
        
        if ((parseInt(position.bar) === 1) || (parseInt(position.bar) === 0)) {
            return {
                meterNumerator: tempoTrack.tick[0].meterNumerator,
                meterDenominator: tempoTrack.tick[0].meterDenominator
            };
        }
        
        while(!exitCondition){
            if (positionEqualTo(position, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], position)) && (positionGreaterThan(position, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        meter.meterNumerator = tempoTrack.tick[index].meterNumerator;
        meter.meterDenominator = tempoTrack.tick[index].meterDenominator;
        
        return meter;
    }
    
    const getTotalTicks = (denominator) => {
        let total = parseInt(user.clock_resolution);
        
        switch(denominator) {
            case(1):
                total = total * 4;
                break;
            case(2):
                total = total * 2;
                break;
            case(4):
                total = total;
                break;
            case(8):
                total = total / 2;
                break;
            case(16):
                total = total / 4;
                break;
            case(32):
                total = total / 8;
                break;
            case(64):
                total = total / 16;
                break;
            case(128):
                total = total / 32;
                break;
            default:
                alert('ERROR: Faulty meter denominator');
        }
        
        return total;
    }
    
    const updateTempoEventTempoBase = (currentBase, index) => {
        let deepCopy = {...tempoTrack};
        
        switch(currentBase) {
            case('dottedEighthNote'):
                deepCopy.tick[index].tempoBase = 'quarter';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCopy.tick[index].tempoBase = 'wholeNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.tick[index].tempoBase = 'sixtyFourthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCopy.tick[index].tempoBase = 'halfNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCopy.tick[index].tempoBase = 'eighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.tick[index].tempoBase = 'thirtySecondNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCopy.tick[index].tempoBase = 'sixteenthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCopy.tick[index].tempoBase = 'doubleWholeNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCopy.tick[index].tempoBase = 'oneHundredTwentyEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 256);
                break;
            case('eighthNote'):
                deepCopy.tick[index].tempoBase = 'dottedEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCopy.tick[index].tempoBase = 'dottedHalf';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.tick[index].tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCopy.tick[index].tempoBase = 'dottedQuarter';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCopy.tick[index].tempoBase = 'dottedSixteenthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCopy.tick[index].tempoBase = 'dottedSixtyFourthNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCopy.tick[index].tempoBase = 'dottedThirtySecondNote';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCopy.tick[index].tempoBase = 'dottedWhole';
                deepCopy.tick[index].tempo = (parseFloat(deepCopy.tick[index].tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setTempoTrack(deepCopy);
    }
    
    const addTempoChangeEvent = () => {
        let deepCopy = {...tempoTrack};
        let deepPosition = {...currentPosition};
        let check;
        
        if ((parseInt(deepPosition.measure.bar) === 1) && (parseInt(deepPosition.measure.beat === 1)) && (parseInt(deepPosition.measure.ticks === 0))) {
            deepPosition.measure.ticks = 1;
            
        } else if (parseInt(deepPosition.measure.bar) === parseInt(sequence.duration.bar)) {
            deepPosition.measure.bar = parseInt(sequence.duration.bar) - 1;
            
        }
        deepCopy.tick.push({
            bar: parseInt(deepPosition.measure.bar),
            beat: parseInt(deepPosition.measure.beat),
            cumulativeTime: 0,
            ticks: parseInt(deepPosition.measure.ticks),
            meterChange: false,
            meterNumerator: currentMeter.numerator,
            meterDenominator: currentMeter.denominator,
            tempo: parseFloat(currentTempo.tempo),
            tempoBase: currentTempo.tempoBase,
            tempoChange: true
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();
        recalculateTempoTrack();
        setCurrentPosition(deepPosition);
        setCurrentClockPosition(calculateTimeString({bar: deepPosition.measure.bar, beat: deepPosition.measure.beat, ticks: deepPosition.measure.ticks}));
    }
    
    const addMeterEvent = () => {
        let deepCopy = {...tempoTrack};
        let deepPosition = {...currentPosition};
        let check;
        
        if (parseInt(deepPosition.measure.bar) === 1) {
            deepPosition.measure.bar = 2;
            
        } else if (parseInt(deepPosition.measure.bar) === parseInt(sequence.duration.bar)) {
            deepPosition.measure.bar = parseInt(sequence.duration.bar) - 1;
            
        }
        deepCopy.tick.push({
            bar: parseInt(deepPosition.measure.bar),
            beat: 1,
            cumulativeTime: 0,
            ticks: 0,
            meterChange: true,
            meterNumerator: currentMeter.numerator,
            meterDenominator: currentMeter.denominator,
            tempo: parseFloat(currentTempo.tempo),
            tempoBase: currentTempo.tempoBase,
            tempoChange: false
        });
        deepPosition.measure.beat = 1;
        deepPosition.measure.ticks = 0;
        setTempoTrack(deepCopy);
        sortTempoTrack();
        recalculateTempoTrack();
        setCurrentPosition(deepPosition);
        setCurrentClockPosition(calculateTimeString({bar: deepPosition.measure.bar, beat: 1, ticks: 0}));
    }
    
    const removeTempoTrackEvent = (index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick.splice(index, 1);
        bar = 1;
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition('0:00.000');
    }
    
    const updateTempoEventTempo = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick[index].tempo = val;
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventMeterDenominator = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        if (parseInt(val) < parseInt(deepCopy.tick[index].meterDenominator)) {
            if (parseInt(deepCopy.tick[index].meterDenominator) === 1) {
                return;
            }
            deepCopy.tick[index].meterDenominator = parseInt(deepCopy.tick[index].meterDenominator) / 2;
        } else {
            if (parseInt(deepCopy.tick[index].meterDenominator) === 128) {
                return;
            }
            deepCopy.tick[index].meterDenominator = parseInt(deepCopy.tick[index].meterDenominator) * 2;
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventMeterNumerator = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        
        deepCopy.tick[index].meterNumerator = parseInt(val);
        bar = parseInt(deepCopy.tick[index].bar);
        beat = 1;
        ticks = 0;
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventTicks = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        let meter = meterAtPosition(tempoTrack.tick[index]);
        let meter2 = meterAtPosition({bar: parseInt(tempoTrack.tick[index].bar - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.tick[index].beat) === 1) {
                if (parseInt(deepCopy.tick[index].bar) === 2) {
                    return;
                }
                deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) - 1;
                deepCopy.tick[index].beat = parseInt(meter2.meterNumerator);
                deepCopy.tick[index].ticks = parseInt(getTotalTicks(meter2.meterDenominator) - 1);
            } else {
                deepCopy.tick[index].beat = parseInt(deepCopy.tick[index].beat) - 1;
                deepCopy.tick[index].ticks = parseInt(getTotalTicks(meter2.meterDenominator) - 1);
            }
        } else if (parseInt(val) > (getTotalTicks(meter.meterDenominator) - 1)) {
            if (parseInt(deepCopy.tick[index].beat) === parseInt(meter.numerator)) {
                if (parseInt(deepCopy.tick[index].bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) + 1;
                deepCopy.tick[index].beat = 1;
                deepCopy.tick[index].ticks = 0;
            } else {
                deepCopy.tick[index].beat = parseInt(deepCopy.tick[index].beat) + 1;
                deepCopy.tick[index].ticks = 0;
            }
        } else {
            deepCopy.tick[index].ticks = parseInt(val);
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventBeat = (val, index) => {
        let deepCopy = {...tempoTrack};
        let bar, beat, ticks;
        let meter = meterAtPosition(tempoTrack.tick[index]);
        let meter2 = meterAtPosition({bar: parseInt(tempoTrack.tick[index].bar - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) === 0) {
            if (parseInt(deepCopy.tick[index].bar) === 1) {
                return;
            }
            deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) - 1;
            deepCopy.tick[index].beat = parseInt(meter2.meterNumerator);
            deepCopy.tick[index].ticks = 0;
        } else if (parseInt(val) === 1){
            if (parseInt(deepCopy.tick[index].bar) === 1) {
                return;
            }
            deepCopy.tick[index].beat = 1;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.tick[index].bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.tick[index].bar = parseInt(deepCopy.tick[index].bar) + 1;
            deepCopy.tick[index].beat = 1;
            deepCopy.tick[index].ticks = 0;
        } else {
            deepCopy.tick[index].beat = parseInt(val);
        }
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        setTempoTrack(deepCopy);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
    }
    
    const updateTempoEventBar = (val, index) => {
        let deepCopy = {...tempoTrack};
        let deepSequence = {...sequence};
        let bar, beat, ticks;
        
        if ((parseInt(val) === 1) || (parseInt(val) === parseInt(sequence.duration.bar))) {
            return;
        }
        if (parseInt(index) === (deepCopy.tick.length - 1)) {
            if (parseInt(val) < (parseInt(deepCopy.tick[index - 1].bar) + 1)) {
                return;
            }
            deepSequence.duration.bar = val;
        } else {
            if (val > deepSequence.duration.bar) {
                return;
            }
        }
        deepCopy.tick[index].bar = parseInt(val);
        bar = parseInt(deepCopy.tick[index].bar);
        beat = parseInt(deepCopy.tick[index].beat);
        ticks = parseInt(deepCopy.tick[index].ticks);
        setCurrentPosition({
            measure: {
                bar,
                beat,
                ticks 
            }
        });
        setCurrentTempo({
            tempo: deepCopy.tick[index].tempo,
            tempoBase: deepCopy.tick[index].tempoBase
        });
        
        setTempoTrack(deepCopy);
        setSequence(deepSequence);
        sortTempoTrack();        
        recalculateTempoTrack();
        setCurrentClockPosition(calculateTimeString({bar, beat, ticks}));
        
    }
    
    const tempoBeatValue = (tempoObj) => {
        let tempo = parseFloat(tempoObj.tempo);
        
        switch(tempoObj.tempoBase) {
             case('dottedEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = ((tempo * 3) / 16);
                        break;
                    case(2):
                        tempo = ((tempo * 3) / 8);
                        break;
                    case(4):
                        tempo = ((tempo * 3) / 4);
                        break;
                    case(8):
                        tempo = ((tempo * 3) / 2);
                        break;
                    case(16):
                        tempo = (tempo * 3);
                        break;
                    case(32):
                        tempo = (tempo * 6);
                        break;
                    case(64):
                        tempo = (tempo * 12);
                        break;
                    case(128):
                        tempo = (tempo * 24);
                        break;
                    default:
                        alert('ERROR: dotted eighth note conversion');
                }
                break;
            case('dottedHalf'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(4):
                        tempo = (tempo * 3);
                        break;
                    case(8):
                        tempo = (tempo * 6);
                        break;
                    case(16):
                        tempo = (tempo * 12);
                        break;
                    case(32):
                        tempo = (tempo * 24);
                        break;
                    case(64):
                        tempo = (tempo * 48);
                        break;
                    case(128):
                        tempo = (tempo * 96);
                        break;
                    default:
                       alert('ERROR: dotted half note conversion'); 
                }
                break;
            case('dottedOneHundredTwentyEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 256;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 128;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(64):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(128):
                        tempo = (tempo * 3) / 2;
                        break;
                    default:
                       alert('ERROR: dotted one hundred twenty-eighth note conversion'); 
                }
                break;
            case('dottedQuarter'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(8):
                        tempo = (tempo * 3);
                        break;
                    case(16):
                        tempo = (tempo * 6);
                        break;
                    case(32):
                        tempo = (tempo * 12);
                        break;
                    case(64):
                        tempo = (tempo * 24);
                        break;
                    case(128):
                        tempo = (tempo * 48);
                        break;
                    default:
                       alert('ERROR: dotted quarter note conversion'); 
                }
                break;
            case('dottedSixteenthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(32):
                        tempo = (tempo * 3);
                        break;
                    case(64):
                        tempo = (tempo * 6);
                        break;
                    case(128):
                        tempo = (tempo * 12);
                        break;
                    default:
                       alert('ERROR: dotted sixteenth note conversion'); 
                }
                break;
            case('dottedSixtyFourthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 128;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(64):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(128):
                        tempo = (tempo * 3);
                        break;
                    default:
                       alert('ERROR: dotted sixty-fourth note conversion'); 
                }
                break;
            case('dottedThirtySecondNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 64;
                        break;
                    case(2):
                        tempo = (tempo * 3) / 32;
                        break;
                    case(4):
                        tempo = (tempo * 3) / 16;
                        break;
                    case(8):
                        tempo = (tempo * 3) / 8;
                        break;
                    case(16):
                        tempo = (tempo * 3) / 4;
                        break;
                    case(32):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(64):
                        tempo = (tempo * 3);
                        break;
                    case(128):
                        tempo = (tempo * 6);
                        break;
                    default:
                       alert('ERROR: dotted thirty-second note conversion'); 
                }
                break;
            case('dottedWhole'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 3) / 2;
                        break;
                    case(2):
                        tempo = (tempo * 3);
                        break;
                    case(4):
                        tempo = (tempo * 6);
                        break;
                    case(8):
                        tempo = (tempo * 12);
                        break;
                    case(16):
                        tempo = (tempo * 24);
                        break;
                    case(32):
                        tempo = (tempo * 48);
                        break;
                    case(64):
                        tempo = (tempo * 96);
                        break;
                    case(128):
                        tempo = (tempo * 192);
                        break;
                    default:
                       alert('ERROR: dotted whole note conversion'); 
                }
                break;
            case('doubleWholeNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo * 2);
                        break;
                    case(2):
                        tempo = (tempo * 4);
                        break;
                    case(4):
                        tempo = (tempo * 8);
                        break;
                    case(8):
                        tempo = (tempo * 16);
                        break;
                    case(16):
                        tempo = (tempo * 32);
                        break;
                    case(32):
                        tempo = (tempo * 64);
                        break;
                    case(64):
                        tempo = (tempo * 128);
                        break;
                    case(128):
                        tempo = (tempo * 256);
                        break;
                    default:
                       alert('ERROR: double whole note conversion'); 
                }
                break;
            case('eighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 8);
                        break;
                    case(2):
                        tempo = (tempo / 4);
                        break;
                    case(4):
                        tempo = (tempo / 2);
                        break;
                    case(8):
                        tempo = tempo;
                        break;
                    case(16):
                        tempo = (tempo * 2);
                        break;
                    case(32):
                        tempo = (tempo * 4);
                        break;
                    case(64):
                        tempo = (tempo * 8);
                        break;
                    case(128):
                        tempo = (tempo * 16);
                        break;
                    default:
                       alert('ERROR: eighth note conversion'); 
                }
                break;
            case('halfNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 2);
                        break;
                    case(2):
                        tempo = tempo;
                        break;
                    case(4):
                        tempo = (tempo * 2);
                        break;
                    case(8):
                        tempo = (tempo * 4);
                        break;
                    case(16):
                        tempo = (tempo * 8);
                        break;
                    case(32):
                        tempo = (tempo * 16);
                        break;
                    case(64):
                        tempo = (tempo * 32);
                        break;
                    case(128):
                        tempo = (tempo * 64);
                        break;
                    default:
                       alert('ERROR: half note conversion'); 
                }
                break;
            case('oneHundredTwentyEighthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 128);
                        break;
                    case(2):
                        tempo = (tempo / 64);
                        break;
                    case(4):
                        tempo = (tempo / 32);
                        break;
                    case(8):
                        tempo = (tempo / 16);
                        break;
                    case(16):
                        tempo = (tempo / 8);
                        break;
                    case(32):
                        tempo = (tempo / 4);
                        break;
                    case(64):
                        tempo = (tempo / 2);
                        break;
                    case(128):
                        tempo = tempo;
                        break;
                    default:
                       alert('ERROR: one hundred twenty-eighth note conversion'); 
                }
                break;
            case('quarter'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 4);
                        break;
                    case(2):
                        tempo = (tempo / 2);
                        break;
                    case(4):
                        tempo = tempo;
                        break;
                    case(8):
                        tempo = (tempo * 2);
                        break;
                    case(16):
                        tempo = (tempo * 4);
                        break;
                    case(32):
                        tempo = (tempo * 8);
                        break;
                    case(64):
                        tempo = (tempo * 16);
                        break;
                    case(128):
                        tempo = (tempo * 32);
                        break;
                    default:
                       alert('ERROR: quarter note conversion'); 
                }
                break;
            case('sixteenthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 16);
                        break;
                    case(2):
                        tempo = (tempo / 8);
                        break;
                    case(4):
                        tempo = (tempo / 4);
                        break;
                    case(8):
                        tempo = (tempo / 2);
                        break;
                    case(16):
                        tempo = tempo;
                        break;
                    case(32):
                        tempo = (tempo * 2);
                        break;
                    case(64):
                        tempo = (tempo * 4);
                        break;
                    case(128):
                        tempo = (tempo * 8);
                        break;
                    default:
                       alert('ERROR: sixteenth note conversion'); 
                }
                break;
            case('sixtyFourthNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 64);
                        break;
                    case(2):
                        tempo = (tempo / 32);
                        break;
                    case(4):
                        tempo = (tempo / 16);
                        break;
                    case(8):
                        tempo = (tempo / 8);
                        break;
                    case(16):
                        tempo = (tempo / 4);
                        break;
                    case(32):
                        tempo = (tempo / 2);
                        break;
                    case(64):
                        tempo = tempo;
                        break;
                    case(128):
                        tempo = (tempo * 2);
                        break;
                    default:
                       alert('ERROR: sixty-fourth note conversion'); 
                }
                break;
            case('thirtySecondNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = (tempo / 32);
                        break;
                    case(2):
                        tempo = (tempo / 16);
                        break;
                    case(4):
                        tempo = (tempo / 8);
                        break;
                    case(8):
                        tempo = (tempo / 4);
                        break;
                    case(16):
                        tempo = (tempo / 2);
                        break;
                    case(32):
                        tempo = tempo;
                        break;
                    case(64):
                        tempo = (tempo * 2);
                        break;
                    case(128):
                        tempo = (tempo * 4);
                        break;
                    default:
                       alert('ERROR: thirty-second note conversion'); 
                }
                break;
            case('wholeNote'):
                switch(parseInt(tempoObj.meterDenominator)) {
                    case(1):
                        tempo = tempo;
                        break;
                    case(2):
                        tempo = (tempo * 2);
                        break;
                    case(4):
                        tempo = (tempo * 4);
                        break;
                    case(8):
                        tempo = (tempo * 8);
                        break;
                    case(16):
                        tempo = (tempo * 16);
                        break;
                    case(32):
                        tempo = (tempo * 32);
                        break;
                    case(64):
                        tempo = (tempo * 64);
                        break;
                    case(128):
                        tempo = (tempo * 128);
                        break;
                    default:
                       alert('ERROR: whole note conversion'); 
                }
                break;
            default:
                alert('unsupported tempo base');   
        }
        
        return tempo; 
    }
    
    const setInitialTempoBase = (oldBase) => {
        let deepCopy = {...tempoTrack};
        let deepCurrent = {...currentTempo};
        
        switch(oldBase) {
            case('dottedEighthNote'):
                deepCurrent.tempoBase = 'quarter';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'quarter';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCurrent.tempoBase = 'wholeNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'wholeNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'sixtyFourthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixtyFourthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCurrent.tempoBase = 'halfNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'halfNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCurrent.tempoBase = 'eighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'eighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCurrent.tempoBase = 'thirtySecondNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'thirtySecondNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCurrent.tempoBase = 'sixteenthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'sixteenthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCurrent.tempoBase = 'doubleWholeNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 4) * 3;
                deepCopy.tick[0].tempoBase = 'doubleWholeNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCurrent.tempoBase = 'oneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 256);
                deepCopy.tick[0].tempoBase = 'oneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 256);
                break;
            case('eighthNote'):
                deepCurrent.tempoBase = 'dottedEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCurrent.tempoBase = 'dottedHalf';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedHalf';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCurrent.tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedOneHundredTwentyEighthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCurrent.tempoBase = 'dottedQuarter';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedQuarter';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCurrent.tempoBase = 'dottedSixteenthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixteenthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCurrent.tempoBase = 'dottedSixtyFourthNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedSixtyFourthNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCurrent.tempoBase = 'dottedThirtySecondNote';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) * 2) / 3;
                deepCopy.tick[0].tempoBase = 'dottedThirtySecondNote';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCurrent.tempoBase = 'dottedWhole';
                deepCurrent.tempo = (parseFloat(deepCurrent.tempo) / 3) * 2;
                deepCopy.tick[0].tempoBase = 'dottedWhole';
                deepCopy.tick[0].tempo = (parseFloat(deepCopy.tick[0].tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setTempoTrack(deepCopy);
        setCurrentTempo(deepCurrent);
    }
    
    const cellDuration = (cell1, cell2) => {
        let elapsedTime = cell1.cumulativeTime;
        let bars = 0;
        let beats = 0;
        let ticks = 0;
        
        if (parseInt(cell2.bar) > parseInt(cell1.bar)) {
            bars = parseInt(cell2.bar) - parseInt(cell1.bar);
            elapsedTime += ((60000 / tempoBeatValue(cell1)) * parseInt(cell1.meterNumerator) * bars);
        }
        beats = (parseInt(cell2.beat) - parseInt(cell1.beat));
        elapsedTime += ((60000 / tempoBeatValue(cell1)) * beats);
        ticks = (parseInt(cell2.ticks) - parseInt(cell1.ticks));
        elapsedTime += ((60000 / tempoBeatValue(cell1)) / getTickMax(parseInt(cell1.meterDenominator)));
        
        return elapsedTime;
    }
    
    const recalculateTempoTrack = () => {
        let deepCopy = {...tempoTrack};
        
        for (let i = 0; i < deepCopy.tick.length; i++) {
            if (i === 0) {
                deepCopy.tick[i].cumulativeTime = 0;
            } else {
                if (deepCopy.tick[i].meterChange) {
                    if (deepCopy.tick[i].tempo !== null) {
                        deepCopy.tick[i].tempo = deepCopy.tick[i - 1].tempo;
                        deepCopy.tick[i].tempoBase = deepCopy.tick[i - 1].tempoBase;
                    }
                }
                if (deepCopy.tick[i].tempoChange) {
                    deepCopy.tick[i].meterNumerator = deepCopy.tick[i - 1].meterNumerator;
                    deepCopy.tick[i].meterDenominator = deepCopy.tick[i - 1].meterDenominator;
                }
                deepCopy.tick[i].cumulativeTime = cellDuration(deepCopy.tick[i - 1], deepCopy.tick[i]);
            }
        }
        
        setTempoTrack(deepCopy);
    }
    
    const setInitialTempo = (val) => {
        let deepCopy = {...tempoTrack};
        let deepTempo = {...currentTempo};
        
        deepCopy.tick[0].tempo = val;
        deepTempo.tempo = val;
        
        setTempoTrack(deepCopy);
        setCurrentTempo(deepTempo);
        setCurrentPosition({
            measure: {
                bar: parseInt(1),
                beat: parseInt(1),
                ticks: parseInt(0) 
            }
        });
        setCurrentClockPosition('0:00.000');
        recalculateTempoTrack();
    }
    
    const setInitialMeterNumerator = (val) => {
        if (val > 0) {
            let deepCopy = {...tempoTrack};
            let deepMeter = {...currentMeter};

            deepCopy.tick[0].meterNumerator = val;
            deepMeter.numerator = val;
            setTempoTrack(deepCopy);
            setCurrentMeter(deepMeter);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            recalculateTempoTrack();
        }
    }
    
    const setInitialMeterDenominator = (val) => {
        if (val > 0) {
            let deepCopy = {...tempoTrack};
            let deepMeter = {...currentMeter};
            
            if (val > parseInt(deepCopy.tick[0].meterDenominator)) {
                if (parseInt(deepCopy.tick[0].meterDenominator) === 128) {
                    return;
                }
                deepCopy.tick[0].meterDenominator = (parseInt(deepCopy.tick[0].meterDenominator) * 2);
                deepMeter.denominator = deepCopy.tick[0].meterDenominator;
            } else {
                deepCopy.tick[0].meterDenominator = (parseInt(deepCopy.tick[0].meterDenominator) / 2);
                deepMeter.denominator = deepCopy.tick[0].meterDenominator;
            }
            setTempoTrack(deepCopy);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            setCurrentMeter(deepMeter);
            setCurrentPosition({
                measure: {
                    bar: parseInt(1),
                    beat: parseInt(1),
                    ticks: parseInt(0) 
                }
            });
            setCurrentClockPosition('0:00.000');
            recalculateTempoTrack();
        }
    }
    
    const seqNameUpdate = (val) => {
        let deepCopy = {...sequence};
        
        deepCopy.header.name = val;
        
        setSequence(deepCopy);
    }
    
    const updateCurrentPositionValues = () => {
        let index = 0;
        let exitCondition = false;
        
        while(!exitCondition) {
            if (positionEqualTo(currentPosition.measure, tempoTrack.tick[index])) {
                exitCondition = true;
            } else {
                if ((positionGreaterThan(tempoTrack.tick[index], currentPosition.measure)) && (positionGreaterThan(currentPosition.measure, tempoTrack.tick[index + 1]))) {
                    exitCondition = true;
                } else {
                    ++index;
                }
            }
        }
        if (parseInt(index) === parseInt(tempoTrack.tick.length - 1)) {
            return;
        }
        setCurrentMeter({
            numerator: parseInt(tempoTrack.tick[index].meterNumerator),
            denominator: parseInt(tempoTrack.tick[index].meterDenominator)
        });
        setCurrentTempo({
            tempo: tempoTrack.tick[index].tempo,
            tempoBase: tempoTrack.tick[index].tempoBase
        });
        
    }
    
    const updateHomeBarPosition = (val) => {
        let deepCopy = {...homePosition};
        
        if (val > 0) {
            if (parseInt(val) < (parseInt(sequence.duration.bar) + 1)) {
                deepCopy.measure.bar = parseInt(val);
                deepCopy.measure.beat = 1;
                deepCopy.measure.ticks = 0;
            }
        }
        setHomePosition(deepCopy);
        
    }
    
    const updateBarPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        
        if (val > 0) {
            deepCopy.measure.bar = parseInt(val);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        }
        setCurrentPosition(deepCopy);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
        
    }
    
    const updateHomeBeatPosition = (val) => {
        let deepCopy = {...homePosition};
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) === 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
            if (val > 1) {
                return;
            }
        }
        
        if (val > meter.meterNumerator) {
            if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
                return;
            }
            deepCopy.measure.bar = parseInt(deepCopy.measure.bar + 1);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        } else if (val < 1) {
            if (deepCopy.measure.bar > 1) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                deepCopy.measure.beat = meter2.meterNumerator;
                deepCopy.measure.ticks = 0;
            } else {
                return;
            }
        } else {
            deepCopy.measure.beat = val;
            deepCopy.measure.ticks = 0;
        }
        setHomePosition(deepCopy);
        
    }
    
    const updateBeatPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        let meter2;
        if (parseInt(val) < 1) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
            if (val > 1) {
                return;
            }
        }
        
        if (val > currentMeter.numerator) {
            if (parseInt(deepCopy.measure.bar) === parseInt(deepSequence.duration.bar)) {
                return;
            }
            deepCopy.measure.bar = parseInt(deepCopy.measure.bar + 1);
            deepCopy.measure.beat = 1;
            deepCopy.measure.ticks = 0;
        } else if (val < 1) {
            if (deepCopy.measure.bar > 1) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                deepCopy.measure.beat = meter2.meterNumerator;
                deepCopy.measure.ticks = 0;
            } else {
                return;
            }
        } else {
            deepCopy.measure.beat = val;
            deepCopy.measure.ticks = 0;
        }
        setCurrentPosition(deepCopy);
        if (deepCopy.measure.bar > deepSequence.duration.bar) {
            deepSequence.duration.bar = deepCopy.measure.bar;
        }
        setSequence(deepSequence);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
    }
    
    function getTickMax(denominator) {
        let max = 0;
        
        switch (denominator) {
            case(1):
                max = (beatResolution * 4);
                break;
            case(2):
                max = (beatResolution * 2);
                break;
            case(4):
                max = beatResolution;
                break;
            case(8):
                max = Math.floor(beatResolution/2);
                break;
            case(16):
                max = Math.floor(beatResolution/4);
                break;
            case(32):
                max = Math.floor(beatResolution/8);
                break;
            case(64):
                max = Math.floor(beatResolution/16);
                break;
            case(128):
                max = Math.floor(beatResolution/32);
                break;
            case(256):
                max = Math.floor(beatResolution/64);
                break;
            case(512):
                max = Math.floor(beatResolution/128);
                break;
            case(1024):
                max = Math.floor(beatResolution/256);
                break;
            default:
                alert('CLICK RESOLUTION ERROR - TICK UNACCOUNTED FOR');
        }
        
        return max;
    }
    
    function getMaxTick() {
        let max = 0;
        
        switch (currentMeter.denominator) {
            case(1):
                max = (beatResolution * 4);
                break;
            case(2):
                max = (beatResolution * 2);
                break;
            case(4):
                max = beatResolution;
                break;
            case(8):
                max = Math.floor(beatResolution/2);
                break;
            case(16):
                max = Math.floor(beatResolution/4);
                break;
            case(32):
                max = Math.floor(beatResolution/8);
                break;
            case(64):
                max = Math.floor(beatResolution/16);
                break;
            case(128):
                max = Math.floor(beatResolution/32);
                break;
            case(256):
                max = Math.floor(beatResolution/64);
                break;
            case(512):
                max = Math.floor(beatResolution/128);
                break;
            case(1024):
                max = Math.floor(beatResolution/256);
                break;
            default:
                alert('CLICK RESOLUTION ERROR - TICK UNACCOUNTED FOR');
        }
        
        return max;
    }
    
    const updateHomeTickPosition = (val) => {
        let deepCopy = {...homePosition};
        const maxValue = parseInt(getMaxTick());
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) < 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(val) > maxValue) {
            return;
        }
        
        if (parseInt(val) === maxValue) {
            if (deepCopy.measure.beat === meter.meterNumerator) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar) + 1;
                deepCopy.measure.beat = parseInt(1);
                deepCopy.measure.ticks = parseInt(0);
            } else {
                deepCopy.measure.beat = parseInt(deepCopy.measure.beat) + 1;
                deepCopy.measure.ticks = parseInt(0);
            }
        } else if (parseInt(val) < 0) {
            if (deepCopy.measure.beat === 1) {
                if (deepCopy.measure.bar === 1) {
                    return;
                } else {
                    deepCopy.measure.bar = parseInt(deepCopy.measure.bar - 1);
                    deepCopy.measure.beat = parseInt(meter2.meterNumerator);
                    deepCopy.measure.ticks = parseInt(maxValue - 1);
                }
            } else {
                deepCopy.measure.beat -= 1;
                deepCopy.measure.ticks = parseInt(maxValue - 1);
            }
        } else {
            if (deepCopy.measure.bar !== sequence.duration.bar) {
                deepCopy.measure.ticks = parseInt(val);
            }
        }
        
        setHomePosition(deepCopy);
    }
    
    const updateTickPosition = (val) => {
        let deepCopy = {...currentPosition};
        let deepSequence = {...sequence};
        const maxValue = parseInt(getMaxTick());
        let meter = meterAtPosition(deepCopy.measure);
        let meter2;
        if (parseInt(val) < 0) {
            meter2 = meterAtPosition({bar: (parseInt(deepCopy.measure.bar) - 1), beat: 1, ticks: 0})
        } else {
            meter2 = meterAtPosition({bar: parseInt(deepCopy.measure.bar), beat: 1, ticks: 0});
        }
        
        if (parseInt(val) > maxValue) {
            return;
        }
        
        if (parseInt(val) === maxValue) {
            if (deepCopy.measure.beat === meter.meterNumerator) {
                deepCopy.measure.bar = parseInt(deepCopy.measure.bar) + 1;
                deepCopy.measure.beat = parseInt(1);
                deepCopy.measure.ticks = parseInt(0);
            } else {
                deepCopy.measure.beat = parseInt(deepCopy.measure.beat) + 1;
                deepCopy.measure.ticks = parseInt(0);
            }
        } else if (parseInt(val) < 0) {
            if (deepCopy.measure.beat === 1) {
                if (deepCopy.measure.bar === 1) {
                    return;
                } else {
                    deepCopy.measure.bar = parseInt(deepCopy.measure.bar) - 1;
                    deepCopy.measure.beat = parseInt(meter2.meterNumerator);
                    deepCopy.measure.ticks = parseInt(maxValue - 1);
                }
            } else {
                deepCopy.measure.beat -= 1;
                deepCopy.measure.ticks = parseInt(maxValue - 1);
            }
        } else {
            if (deepCopy.measure.bar !== sequence.duration.bar) {
                deepCopy.measure.ticks = parseInt(val);
            }
        }
        
        setCurrentPosition(deepCopy);
        if (deepCopy.measure.bar > deepSequence.duration.bar) {
            deepSequence.duration.bar = deepCopy.measure.bar;
        }
        setSequence(deepSequence);
        updateCurrentPositionValues();
        setCurrentClockPosition(calculateTimeString(deepCopy.measure));
    }
    
    const convertMillisecondsToString = (milli) => {
        let base = milli;
        let minute = 0;
        let second = 0
        let milliseconds = 0;
        let time = '';
        
        if (base < 60000) {
            minute = 0;
        } else {
            minute = Math.floor(base/60000);
            base -= (base/60000);
        }
        time = minute.toString() + ':';
        if (base < 1000) {
            second = 0;
        } else {
            second = Math.floor(base/1000);
            base = base % 1000;
            if (second > 59) {
                while(second > 59) {
                    second -= 60;
                }
            }
        }
        if (second < 10) {
            time += '0' + second.toString() + '.';
        } else {
            time += second.toString() + '.';
        }
        if (base < 10) {
            time += '00' + Math.floor(base).toString();
        } else if (base < 100) {
            time += '0' + Math.floor(base).toString();
        } else {
            time += Math.floor(base).toString();
        }
        
        return time;
        
    }
    
    function positionEqualTo(position, check) {
        return ((parseInt(position.bar) === parseInt(check.bar)) && (parseInt(position.beat) === parseInt(check.beat)) && (parseInt(position.ticks) === parseInt(check.ticks)));
    }
    
    function positionGreaterThan(position, check) {
        if (check.bar > position.bar) {
            return true;
        } else if (check.bar < position.bar) {
            return false;
        } else {
            if (check.beat > position.beat) {
                return true;
            } else if (check.beat < position.beat) {
                return false;
            } else {
                if (check.ticks > position.ticks) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
    
    const convertDurationToMilliseconds = (position, tempoReference) => {
        let milliseconds = 0;
        let bars = 0;
        let beats = 0;
        let ticks = 0;
        
        if (parseInt(position.bar) > parseInt(tempoReference.bar)) {
            bars = (parseInt(position.bar) - parseInt(tempoReference.bar));
            milliseconds += ((parseInt(bars) * parseInt(tempoReference.meterNumerator)) * (60000 / tempoBeatValue(tempoReference)));
            if (parseInt(position.beat) !== parseInt(tempoReference.beat)) {
                beats = parseInt(position.beat) - parseInt(tempoReference.beat);
                milliseconds += (parseInt(beats) * (60000 / tempoBeatValue(tempoReference)));
            }
            if (parseInt(position.ticks) !== parseInt(tempoReference.ticks)) {
                ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
                milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
            }
        } else if (parseInt(position.beat) > parseInt(tempoReference.beat)) {
            beats = parseInt(position.beat) - parseInt(tempoReference.beat);
            milliseconds += (parseInt(beats) * (60000 / tempoBeatValue(tempoReference)));
            if (parseInt(position.ticks) !== parseInt(tempoReference.ticks)) {
                ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
                milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
            }
        } else if (parseInt(position.ticks) > parseInt(tempoReference.ticks)) {
            ticks = parseInt(position.ticks) - parseInt(tempoReference.ticks);
            milliseconds += (parseInt(ticks) * ((60000 / tempoBeatValue(tempoReference)) / getTickMax(tempoReference.meterDenominator)));
        }
        
        return milliseconds;
    }
    
    const calculateTimeString = (position) => {
        let timeStamp = '';
        let index = 0;
        let cumulative = 0;
        let exitCondition = false;
        let meterNumerator = tempoTrack.tick[0].meterNumerator;
        let meterDenominator = tempoTrack.tick[0].meterDenominator;
        let tempo = tempoTrack.tick[0].tempo;
        let tempoBase = tempoTrack.tick[0].tempoBase;
        let calcTicks = 0;
        
        while(!exitCondition) {
            if (index > 0) {
                if (tempoTrack.tick[index].meterChange) {
                    meterNumerator = tempoTrack.tick[index].meterNumerator;
                    meterDenominator = tempoTrack.tick[index].meterDenominator
                }
                if (tempoTrack.tick[index].tempoChange) {
                    tempo = tempoTrack.tick[index].tempo;
                    tempoBase = tempoTrack.tick[index].tempoBase;
                }
            }
            if (tempoTrack.tick.length === index) {
                exitCondition = true;
                cumulative = tempoTrack.tick[index - 1].cumulativeTime;
            } else {
                if (positionEqualTo(position, tempoTrack.tick[index])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else if (positionGreaterThan(position, tempoTrack.tick[index + 1])) {
                    exitCondition = true;
                    cumulative = tempoTrack.tick[index].cumulativeTime;
                } else {
                    ++index;
                }
            }
        }
        if (positionEqualTo(position, tempoTrack.tick[index])) {
            return convertMillisecondsToString(cumulative);
        } else {
            calcTicks = convertDurationToMilliseconds(position, tempoTrack.tick[index]);
            cumulative += calcTicks;
            return convertMillisecondsToString(cumulative);
        }
    }
    
    const updateStepTick = (val) => {
        let deepCopy = {...stepInterval};
        
        deepCopy.intervalTicks = parseInt(val);
        setStepInterval(deepCopy);
    }
    
    const updateStepNoteInterval = (currentNote) => {
        const resolution = parseInt(user.clock_resolution);
        let deepCopy = {...stepInterval};
        
        switch(currentNote) {
            case('dottedEighthNote'):
                deepCopy.note = 'quarter';
                deepCopy.intervalTicks = resolution;
                break;
            case('dottedHalf'):
                deepCopy.note = 'wholeNote';
                deepCopy.intervalTicks = resolution * 4;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.note = 'sixtyFourthNote';
                deepCopy.intervalTicks = parseInt(resolution / 16);
                break;
            case('dottedQuarter'):
                deepCopy.note = 'halfNote';
                deepCopy.intervalTicks = resolution * 2;
                break;
            case('dottedSixteenthNote'):
                deepCopy.note = 'eighthNote';
                deepCopy.intervalTicks = parseInt(resolution / 2);
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.note = 'thirtySecondNote';
                deepCopy.intervalTicks = parseInt(resolution / 8);
                break;
            case('dottedThirtySecondNote'):
                deepCopy.note = 'sixteenthNote';
                deepCopy.intervalTicks = parseInt(resolution / 4);
                break;
            case('dottedWhole'):
                deepCopy.note = 'doubleWholeNote';
                deepCopy.intervalTicks = resolution * 8;
                break;
            case('doubleWholeNote'):
                deepCopy.note = 'oneHundredTwentyEighthNote';
                deepCopy.intervalTicks = parseInt(resolution / 32);
                break;
            case('eighthNote'):
                deepCopy.note = 'dottedEighthNote';
                deepCopy.intervalTicks = parseInt((resolution / 4) * 3);
                break;
            case('halfNote'):
                deepCopy.note = 'dottedHalf';
                deepCopy.intervalTicks = resolution * 3;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.note = 'dottedOneHundredTwentyEighthNote';
                deepCopy.intervalTicks = parseInt((resolution / 64) * 3);
                break;
            case('quarter'):
                deepCopy.note = 'dottedQuarter';
                deepCopy.intervalTicks = parseInt((resolution / 2) * 3);
                break;
            case('sixteenthNote'):
                deepCopy.note = 'dottedSixteenthNote';
                deepCopy.intervalTicks = parseInt((resolution / 8) * 3);
                break;
            case('sixtyFourthNote'):
                deepCopy.note = 'dottedSixtyFourthNote';
                deepCopy.intervalTicks = parseInt((resolution / 32) * 3);
                break;
            case('thirtySecondNote'):
                deepCopy.note = 'dottedThirtySecondNote';
                deepCopy.intervalTicks = parseInt((resolution / 16) * 3);
                break;
            case('wholeNote'):
                deepCopy.note = 'dottedWhole';
                deepCopy.intervalTicks = resolution * 6;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setStepInterval(deepCopy);
    }
    
    const forwardByInterval = () => {
        for (let i = 0; i < stepInterval.intervalTicks; i++) {
            updateTickPosition(currentPosition.measure.ticks + 1);
        }
    }
    
    const backwardByInterval = () => {
        for (let i = 0; i < stepInterval.intervalTicks; i++) {
            updateTickPosition(currentPosition.measure.ticks - 1);
        }
    }
    
    const updateSelectedTrack = (val) => {
        let deepSequence = {...sequence};
        
        for (let i = 0; i < sequence.tracks.length; i++) {
            if (i === parseInt(val)) {
                sequence.tracks[i].active = true;
            } else {
                sequence.tracks[i].active = false;
            }
        }
        setActiveTrack(val);
        setSequence(deepSequence);
    }
    
    const rudeSoloStatus = () => {
        let status = false;
        
        for (let i = 0; i < sequence.tracks.length; i++) {
            if (sequence.tracks[i].solo) {
                status = true;
            }
        }
        
        return status;
    }
    
    const toggleTrackMute = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].mute = !deepSequence.tracks[activeTrack].mute;
        setSequence(deepSequence);
    }
    
    const toggleTrackSolo = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].solo = !deepSequence.tracks[activeTrack].solo;
        setSequence(deepSequence);
        setRudeSolo(rudeSoloStatus());
    }
    
    const updateOutputObject = (arr) => {
        setMidiOutputs(arr);
    }
    
    const checkCurrentOutputs = () => {
        if (midiOutputs.length === 0) {
            if (user.midi_connections && user.midi_patch) {
                axios.get(`/midi_manager_patches/patch/${user.midi_patch}`)
                .then(midiPatchData => {
                    const midiPatch = midiPatchData.data.user_preset.outputs;
                    let outputsArr = [];
                    for (let i = 0; i < user.midi_connections.outputs.length; i++) {
                        outputsArr[i] = {
                            activeReciever: midiPatch[i].activeReciever,
                            channel: midiPatch[i].channel,
                            connection: user.midi_connections.outputs[i].connection,
                            device: midiPatch[i].device,
                            hardwareIn: midiPatch[i].hardwareIn,
                            id: user.midi_connections.outputs[i].id,
                            label: midiPatch[i].label,
                            manufacturer: user.midi_connections.outputs[i].manufacturer,
                            name: midiPatch[i].label,
                            state: user.midi_connections.outputs[i].state,
                            type: user.midi_connections.outputs[i].type
                        }
                    }
                    updateOutputObject(outputsArr);
                });
            } else if (user.midi_connections) {
                updateOutputObject(user.midi_connections.outputs);
            }
        }
    }
    
    const updateActiveTrackOutput = (val) => {
        let deepSequence = {...sequence};
        
        sequence.tracks[activeTrack].output = val;
        
        setSequence(deepSequence);
    }
    
    const addNewTrack = () => {
        let deepSequence = {...sequence};
        let trackName = 'track';
        if (sequence.tracks.length < 9) {
            trackName += '0';
        }
        trackName += (sequence.tracks.length + 1).toString();
        
        deepSequence.tracks.push({
            active: true,
            collection: null,
            device: '0',
            events: [],
            image: availableDevices[0].imagePath,
            mute: false,
            name: trackName,
            output: '',
            initialPatch: null,
            instrument: {
                collection: null,
                bank: null,
                patch: null
            },
            solo: false
        });
        for (let i = 0; i < deepSequence.tracks.length; i++) {
            deepSequence.tracks[i].id = i;
            deepSequence.tracks[i].active = false;
        }
        deepSequence.tracks[deepSequence.tracks.length - 1].active = true;
        
        setSequence(deepSequence);
        setActiveTrack(deepSequence.tracks.length - 1);
    }
    
    const cancelTrackDelete = () => {
         setTrackGuardrailState('_Inactive');
        setStepSequencerState('_Active');
    }
    
    const postGuardrailTrackDelete = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks.splice(activeTrack, 1);
        
        setSequence(deepSequence);
        setActiveTrack(0);
        cancelTrackDelete();
    }
    
    const deleteTrack = () => {
        let deepSequence = {...sequence};
        
        if (sequence.tracks[activeTrack].events.length === 0) {
            deepSequence.tracks.splice(activeTrack, 1);
        } else {
            // TODO guardrail for delete
            setTrackGuardrailState('_Active');
            setStepSequencerState('_Inactive');
        }
        
        for (let i = 0; i < deepSequence.tracks.length; i++) {
            deepSequence.tracks[i].active = false;
            deepSequence.tracks[i].id = i;
        }
        deepSequence.tracks[0].active = true;
        
        setSequence(deepSequence);
        setActiveTrack(0);
    }
    
    const updateTrackDevice = (val) => {
        let deepSequence = {...sequence};
        let imgSrce = availableDevices.filter(dev => {
            return(dev.uuid === val);
        });
        
        deepSequence.tracks[activeTrack].device = val;
        deepSequence.tracks[activeTrack].image = imgSrce[0].imagePath;
        
        setSequence(deepSequence);
    }
    
    const updateCurrentMidiEvent = (val) => {
        setCurrentMidiEvent(val);
    }
    
    const convertPitchValue = (val) => {
        let letter = '';
        
        switch(val % 12) {
            case(0):
                letter += 'C♮ ';
                break;
            case(1):
                letter += 'C♯ ';
                break;
            case(2):
                letter += 'D♮ ';
                break;
            case(3):
                letter += 'E♭ ';
                break;
            case(4):
                letter += 'E♮ ';
                break;
            case(5):
                letter += 'F♮ ';
                break;
            case(6):
                letter += 'F♯ ';
                break;
            case(7):
                letter += 'G♮ ';
                break;
            case(8):
                letter += 'A♭ ';
                break;
            case(9):
                letter += 'A♮ ';
                break;
            case(10):
                letter += 'B♭ ';
                break;
            case(11):
                letter += 'B♮ ';
                break;
            default:
                console.log('impossible transpose value');
        }
        if (val < 12) {
            letter += '-1';
        } else if (val < 24) {
            letter += '0';
        } else if (val < 36) {
            letter += '1';
        } else if (val < 48) {
            letter += '2';
        } else if (val < 60) {
            letter += '3';
        } else if (val < 72) {
            letter += '4';
        } else if (val < 84) {
            letter += '5';
        } else if (val < 96) {
            letter += '6';
        } else if (val < 108) {
            letter += '7';
        } else if (val < 120) {
            letter += '8';
        } else {
            letter += '9';
        }
        
        return letter;
    }
    
    const updateTrackName = (val) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].name = val;
        
        setSequence(deepSequence);
    }
    
    const updateTrackEventMIDIChannel = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].midiChannel = val;
        
        setCurrentMidiChannelInput(parseInt(val));
        setSequence(deepSequence);
    }
    
    const updateEventNoteOnNote = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].noteOn.note = val;
        deepSequence.tracks[activeTrack].events[index].noteOff.note = val;
        
        setSequence(deepSequence);
        setCurrentPitchInput(parseInt(val));
    }
    
    const updateEventNoteVelocity = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].noteOn.velocity = val;
        deepSequence.tracks[activeTrack].events[index].noteOff.velocity = val;
        
        setCurrentVelocityInput(parseInt(val));
        setSequence(deepSequence);
    }
    
    const reOrderEvents = () => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events = deepSequence.tracks[activeTrack].events.sort((a, b) => {
            if ((a.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') && (b.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9')) {
                if (parseInt(a.noteOn.time.bar) < parseInt(b.noteOn.time.bar)) {
                    return -1;
                } else if (parseInt(a.noteOn.time.bar) > parseInt(b.noteOn.time.bar)) {
                    return 1;
                } else {
                    if (parseInt(a.noteOn.time.beat) < parseInt(b.noteOn.time.beat)) {
                        return -1;
                    } else if (parseInt(a.noteOn.time.beat) > parseInt(b.noteOn.time.beat)) {
                        return 1;
                    } else {
                        if (parseInt(a.noteOn.time.ticks) < parseInt(b.noteOn.time.ticks)) {
                            return -1;
                        } else if (parseInt(a.noteOn.time.ticks) > parseInt(b.noteOn.time.ticks)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else if ((a.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') && (b.event !== '439da322-bd74-4dc5-8e4b-b4ca664657a9')) {
                if (parseInt(a.noteOn.time.bar) < parseInt(b.time.bar)) {
                    return -1;
                } else if (parseInt(a.noteOn.time.bar) > parseInt(b.time.bar)) {
                    return 1;
                } else {
                    if (parseInt(a.noteOn.time.beat) < parseInt(b.time.beat)) {
                        return -1;
                    } else if (parseInt(a.noteOn.time.beat) > parseInt(b.time.beat)) {
                        return 1;
                    } else {
                        if (parseInt(a.noteOn.time.ticks) < parseInt(b.time.ticks)) {
                            return -1;
                        } else if (parseInt(a.noteOn.time.ticks) < parseInt(b.time.ticks)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else if ((a.event !== '439da322-bd74-4dc5-8e4b-b4ca664657a9') && (b.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9')) {
                if (parseInt(a.time.bar) < parseInt(b.noteOn.time.bar)) {
                    return -1;
                } else if (parseInt(a.time.bar) > parseInt(b.noteOn.time.bar)) {
                    return 1;
                } else {
                    if (parseInt(a.time.beat) < parseInt(b.noteOn.time.beat)) {
                        return -1;
                    } else if (parseInt(a.time.beat) > parseInt(b.noteOn.time.beat)) {
                        return 1;
                    } else {
                        if (parseInt(a.time.ticks) < parseInt(b.noteOn.time.ticks)) {
                            return -1;
                        } if (parseInt(a.time.ticks) > parseInt(b.noteOn.time.ticks)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            } else {
                if (parseInt(a.time.bar) < parseInt(b.time.bar)) {
                    return -1;
                } else if (parseInt(a.time.bar) > parseInt(b.time.bar)) {
                    return 1;
                } else {
                    if (parseInt(a.time.beat) < parseInt(b.time.beat)) {
                        return -1;
                    } else if (parseInt(a.time.beat) > parseInt(b.time.beat)) {
                        return 1;
                    } else {
                        if (parseInt(a.time.ticks) < parseInt(b.time.ticks)) {
                            return -1;
                        } else if (parseInt(a.time.ticks) > parseInt(b.time.ticks)) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        });
        
        for (let i = 0; i < deepSequence.tracks[activeTrack].events.length; i++) {
            deepSequence.tracks[activeTrack].events[i].id = i;
        }
        
        setSequence(deepSequence);
    }
    
    const updateNoteEventBarOnset = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].noteOn.time.bar = val;
        deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = 1;
        deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
        
        if (deepSequence.tracks[activeTrack].events[index].noteOff.time.bar < val) {
            deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = val;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = 1;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
        }
        
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar,
                beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat,
                ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar, 
            beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat, 
            ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
        }));
    }
    
    const updateNoteEventBeatOnset = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].noteOn.time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1), beat: 1, ticks: 0});
        
        if (val < 1) {
            deepSequence.tracks[activeTrack].events[index].noteOn.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1;
            deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = meter2.meterNumerator;
            deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepSequence.tracks[activeTrack].events[index].noteOn.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) + 1;
            deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = 1;
            deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
        } else {
            deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = val;
            deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
        }
        if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
            deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = deepSequence.tracks[activeTrack].events[index].noteOn.time.bar;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = 1;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
        } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = deepSequence.tracks[activeTrack].events[index].noteOn.time.beat;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
            } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                   deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks; 
                }
            }
        }
        
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar,
                beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat,
                ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar, 
            beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat, 
            ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
        }));
    }
    
    const updateNoteEventTickOnset = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].noteOn.time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat) === 1) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) === 1) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].noteOn.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1;
                deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = parseInt(meter2.meterNumerator);
                deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = parseInt(getTickMax(meter.meterDenominator)) - 1;
            } else {
                deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat) - 1;
                deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = parseInt(getTickMax(meter.meterDenominator)) - 1;
            }
            
        } else if (parseInt(val) > (parseInt(getTickMax(meter.meterDenominator)) - 1)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].noteOn.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) + 1;
                deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = 1;
                deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
                
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = deepSequence.tracks[activeTrack].events[index].noteOn.time.bar;
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = deepSequence.tracks[activeTrack].events[index].noteOn.time.beat;
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = deepSequence.tracks[activeTrack].events[index].noteOn.time.beat;
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                    } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                        if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                        }
                    }
                }
            } else {
                deepSequence.tracks[activeTrack].events[index].noteOn.time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat) + 1;
                deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = 0;
                
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = deepSequence.tracks[activeTrack].events[index].noteOn.time.bar;
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = deepSequence.tracks[activeTrack].events[index].noteOn.time.beat;
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = deepSequence.tracks[activeTrack].events[index].noteOn.time.beat;
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                    } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                        if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks;
                        }
                    }
                }
            }
        } else {
            deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks = parseInt(val);
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(val);
                    }
                }
            }
        }
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar,
                beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat,
                ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: deepSequence.tracks[activeTrack].events[index].noteOn.time.bar, 
            beat: deepSequence.tracks[activeTrack].events[index].noteOn.time.beat, 
            ticks: deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks
        }));
    }
    
    const updateEventNoteOffBar = (val, index) => {
        let deepSequence = {...sequence};
        
        if (parseInt(val) > (parseInt(deepSequence.duration.bar) - 1)) {
            return;
        }
        deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = parseInt(val);
        if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].event[index].noteOn.time.beat)) {
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(deepSequence.tracks[activeTrack].event[index].noteOn.time.beat);
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(deepSequence.tracks[activeTrack].event[index].noteOn.time.ticks);
            } else if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].event[index].noteOn.time.beat)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks);
                }
            }
        }
        
        setSequence(deepSequence);
    }
    
    const updateEventNoteOffBeat = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].noteOn.time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1), beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar)), beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === 1) {
                return;
            }
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                return;
            }
            deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) - 1;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(meter2.meterNumerator);
            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                        deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks);
                    }
                }
            }
        } else if (parseInt(val) > parseInt(meter3.meterNumerator)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) > (parseInt(deepSequence.duration.bar) - 1)) {
                return;
            }
            deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) + 1;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = 1;
            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
        } else {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(val);
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    return;
                }
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks);
                }
            } else {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) < parseInt(deepSequence.duration.bar)) {
                    deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(val);
                }
            }
        }
        
        setSequence(deepSequence);
    }
    
    const updateEventNoteOffTicks = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].noteOn.time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar) - 1), beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar)), beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === 1) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === 1) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) - 1;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(meter2.meterNumerator);
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(getTickMax(meter2.meterDenominator)) - 1;
            } else {
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) - 1;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(getTickMax(meter2.meterDenominator)) - 1;
            }
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                return;
            }
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    return;
                }
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                        return;
                    }
                }
            }
            
        } else if (parseInt(val) > (parseInt(getTickMax(meter3.meterDenominator)) - 1)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(meter3.meterNumerator)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.duration.bar)) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].noteOff.time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) + 1;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = 1;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
            } else {
                deepSequence.tracks[activeTrack].events[index].noteOff.time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) + 1;
                deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = 0;
            }
        } else {
            deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks = parseInt(val);
            if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.bar) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.bar)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.beat) === parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.beat)) {
                    if (parseInt(deepSequence.tracks[activeTrack].events[index].noteOff.time.ticks) < parseInt(deepSequence.tracks[activeTrack].events[index].noteOn.time.ticks)) {
                        return;
                    }
                }
            }
        }
        
        setSequence(deepSequence);
    }
    
    const deleteEventAt = (index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events.splice(index, 1);
        
        setSequence(deepSequence);
        reOrderEvents();
    }
    
    const addSelectedEvent = () => {
        let deepSequence = {...sequence};
        
        switch(currentMidiEvent) {
            case('9f4db083-23fa-4c1c-b7a5-ee3f57288aa7'):
                if (deepSequence.tracks[activeTrack].events[0].event !== '9f4db083-23fa-4c1c-b7a5-ee3f57288aa7') {
                    deepSequence.tracks[activeTrack].events.unshift({
                        event: '9f4db083-23fa-4c1c-b7a5-ee3f57288aa7',
                        midiChannel: currentMidiChannelInput,
                        name: 'initial patch',
                        patch: 'fake patch',
                        time: {
                            bar: 0,
                            beat: 1,
                            ticks: 0
                        }
                    });
                }
                break;
            case('439da322-bd74-4dc5-8e4b-b4ca664657a9'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '439da322-bd74-4dc5-8e4b-b4ca664657a9',
                    midiChannel: currentMidiChannelInput,
                    name: 'note',
                    noteOn: {
                        note: currentPitchInput,
                        time: {
                            bar: currentPosition.measure.bar,
                            beat: currentPosition.measure.beat,
                            ticks: currentPosition.measure.ticks
                        },
                        velocity: currentVelocityInput
                    },
                    noteOff: {
                        note: currentPitchInput,
                        time: {
                            bar: currentPosition.measure.bar,
                            beat: currentPosition.measure.beat,
                            ticks: currentPosition.measure.ticks
                        },
                        velocity: currentVelocityInput
                    }
                });
                break;
            case('d1595e03-bcd9-4ca7-9247-4d54723c5a05'):
                deepSequence.tracks[activeTrack].events.push({
                    bend: 8192,
                    event: 'd1595e03-bcd9-4ca7-9247-4d54723c5a05',
                    midiChannel: currentMidiChannelInput,
                    name: 'pitch bend',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    }
                });
                break;
            case('2fdb9151-68ad-46f7-b11e-adbb15d12a09'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '2fdb9151-68ad-46f7-b11e-adbb15d12a09',
                    midiChannel: currentMidiChannelInput,
                    name: 'pr change',
                    program: 0,
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    }
                });
                break;
            case('9a141aff-eea8-46c4-8650-679d9218fb08'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '9a141aff-eea8-46c4-8650-679d9218fb08',
                    midiChannel: currentMidiChannelInput,
                    name: 'after(poly)',
                    note: currentPitchInput,
                    pressure: 64,
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    }
                });
                break;
            case('d1c6b635-d413-40aa-97dd-7d795230d5f4'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'd1c6b635-d413-40aa-97dd-7d795230d5f4',
                    midiChannel: currentMidiChannelInput,
                    name: 'after(chan)',
                    note: currentPitchInput,
                    pressure: 64,
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    }
                });
                break;
            case('884e57d3-f5a5-4192-b640-78891802867b'):
                deepSequence.tracks[activeTrack].events.push({
                    controller: 0,
                    event: '884e57d3-f5a5-4192-b640-78891802867b',
                    midiChannel: currentMidiChannelInput,
                    name: 'controller',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('042b257f-f1de-488d-900b-6d7c49361748'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '042b257f-f1de-488d-900b-6d7c49361748',
                    midiChannel: currentMidiChannelInput,
                    name: 'bank',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('89265cc9-9ce5-4219-bfb6-371b18ed42b1'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '89265cc9-9ce5-4219-bfb6-371b18ed42b1',
                    midiChannel: currentMidiChannelInput,
                    name: 'mod. wheel',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e',
                    midiChannel: currentMidiChannelInput,
                    name: 'breath',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('2a3b9983-d175-4bde-aca9-63b70944ec7e'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '2a3b9983-d175-4bde-aca9-63b70944ec7e',
                    midiChannel: currentMidiChannelInput,
                    name: 'foot',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('96a94fa3-cf34-4ab5-8cb4-586b25e8b40c'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '96a94fa3-cf34-4ab5-8cb4-586b25e8b40c',
                    midiChannel: currentMidiChannelInput,
                    name: 'port. time',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb',
                    midiChannel: currentMidiChannelInput,
                    name: 'data: msb',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('5138de25-1d5c-473e-8a68-ddbeadc32bd4'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '5138de25-1d5c-473e-8a68-ddbeadc32bd4',
                    midiChannel: currentMidiChannelInput,
                    name: 'volume',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('598a5aaa-346c-4e2c-80ce-08cbcb1e7c24'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '598a5aaa-346c-4e2c-80ce-08cbcb1e7c24',
                    midiChannel: currentMidiChannelInput,
                    name: 'balance',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb',
                    midiChannel: currentMidiChannelInput,
                    name: 'pan',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('15a9c413-3dbe-4890-bd52-287c2a48f615'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '15a9c413-3dbe-4890-bd52-287c2a48f615',
                    midiChannel: currentMidiChannelInput,
                    name: 'expression',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('9434ea7e-6a63-423c-9be5-77584bd587e4'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '9434ea7e-6a63-423c-9be5-77584bd587e4',
                    midiChannel: currentMidiChannelInput,
                    name: 'effect 1',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('a97eee86-2a5e-47db-99b1-74b61bc994c1'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'a97eee86-2a5e-47db-99b1-74b61bc994c1',
                    midiChannel: currentMidiChannelInput,
                    name: 'effect 2',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('6eaceab3-35bb-49e2-ad82-5bd4c3a32679'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '6eaceab3-35bb-49e2-ad82-5bd4c3a32679',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 1',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('cdd20c5c-f942-4f8f-a15f-a750ecfd957c'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'cdd20c5c-f942-4f8f-a15f-a750ecfd957c',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 2',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('3474f1bf-5aae-434e-ba95-102114de0dd2'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '3474f1bf-5aae-434e-ba95-102114de0dd2',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 3',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('221e9b45-0ec8-421e-adb6-cfaf19b69610'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '221e9b45-0ec8-421e-adb6-cfaf19b69610',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 4',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 0
                });
                break;
            case('a889cf3f-3986-46ef-9bb3-d4b42fc41fb0'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'a889cf3f-3986-46ef-9bb3-d4b42fc41fb0',
                    midiChannel: currentMidiChannelInput,
                    name: 'damper',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('26a0ab85-b2cc-4442-84c0-bd30fb239869'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '26a0ab85-b2cc-4442-84c0-bd30fb239869',
                    midiChannel: currentMidiChannelInput,
                    name: 'sostenuto',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('890d5a31-859b-4958-8eca-dd0b52f1fbec'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '890d5a31-859b-4958-8eca-dd0b52f1fbec',
                    midiChannel: currentMidiChannelInput,
                    name: 'soft pedal',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('f31779f1-2599-487b-8e96-5b0abd35394e'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'f31779f1-2599-487b-8e96-5b0abd35394e',
                    midiChannel: currentMidiChannelInput,
                    name: 'legato switch',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('75cf0bca-6196-4219-9eef-54272e8020a8'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '75cf0bca-6196-4219-9eef-54272e8020a8',
                    midiChannel: currentMidiChannelInput,
                    name: 'hold 2',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('eaf504e8-217f-4e76-b6cc-ba78ff99aba3'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'eaf504e8-217f-4e76-b6cc-ba78ff99aba3',
                    midiChannel: currentMidiChannelInput,
                    name: 'variation',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('5531a226-bc2c-4c60-9505-9b8da30b86c2'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '5531a226-bc2c-4c60-9505-9b8da30b86c2',
                    midiChannel: currentMidiChannelInput,
                    name: 'timbre',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('cb30f654-a1c1-4e76-b479-d41821ede969'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'cb30f654-a1c1-4e76-b479-d41821ede969',
                    midiChannel: currentMidiChannelInput,
                    name: 'release time',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('9390dbb8-efe9-4b41-adf3-47c6531f7aa1'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '9390dbb8-efe9-4b41-adf3-47c6531f7aa1',
                    midiChannel: currentMidiChannelInput,
                    name: 'attack time',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('f61546fe-fd2a-4c89-813c-44dde15e6aa2'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'f61546fe-fd2a-4c89-813c-44dde15e6aa2',
                    midiChannel: currentMidiChannelInput,
                    name: 'brightness',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('79d3c79f-6d9b-4eb1-ae78-51dd9362e21b'):
               deepSequence.tracks[activeTrack].events.push({
                    event: '79d3c79f-6d9b-4eb1-ae78-51dd9362e21b',
                    midiChannel: currentMidiChannelInput,
                    name: 'decay time',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('752a2e67-911e-45b5-801d-0841c38cf8c2'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '752a2e67-911e-45b5-801d-0841c38cf8c2',
                    midiChannel: currentMidiChannelInput,
                    name: 'vibrato rate',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('97fb8e80-b937-464d-8830-212dcac90675'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '97fb8e80-b937-464d-8830-212dcac90675',
                    midiChannel: currentMidiChannelInput,
                    name: 'vibrato depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c',
                    midiChannel: currentMidiChannelInput,
                    name: 'vibrato delay',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('1ab83a91-21b1-4d56-b333-3a59c4ade431'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '1ab83a91-21b1-4d56-b333-3a59c4ade431',
                    midiChannel: currentMidiChannelInput,
                    name: 'undefined',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('b64c45f7-cf57-4864-a07f-e8f82dbf63b1'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'b64c45f7-cf57-4864-a07f-e8f82dbf63b1',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 5',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('faf99fca-87c1-4e8e-81f5-b0f14251db08'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'faf99fca-87c1-4e8e-81f5-b0f14251db08',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 6',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('4c64d103-e813-4c4a-80b5-01cd8186635c'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '4c64d103-e813-4c4a-80b5-01cd8186635c',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 7',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('e181eaf9-1b61-4e5b-8982-833fb9594529'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'e181eaf9-1b61-4e5b-8982-833fb9594529',
                    midiChannel: currentMidiChannelInput,
                    name: 'general 8',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('246e9232-3d6a-4352-8957-d0ff9c1c834e'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '246e9232-3d6a-4352-8957-d0ff9c1c834e',
                    midiChannel: currentMidiChannelInput,
                    name: 'portamento',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('80e77d4b-c523-4393-a279-6d7b15e65d8a'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '80e77d4b-c523-4393-a279-6d7b15e65d8a',
                    midiChannel: currentMidiChannelInput,
                    name: 'hrvp',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('c3b8b079-4994-480e-9b0a-8cbce11fba46'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'c3b8b079-4994-480e-9b0a-8cbce11fba46',
                    midiChannel: currentMidiChannelInput,
                    name: 'fx 1 depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('206ff86e-6894-4b56-9f5b-f5387d18f2ea'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '206ff86e-6894-4b56-9f5b-f5387d18f2ea',
                    midiChannel: currentMidiChannelInput,
                    name: 'fx 2 depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('2517d341-7ae3-4dae-b866-49bd2fc9b21c'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '2517d341-7ae3-4dae-b866-49bd2fc9b21c',
                    midiChannel: currentMidiChannelInput,
                    name: 'fx 3 depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('269524b5-a240-42e5-abfe-bf074ab7cb11'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '269524b5-a240-42e5-abfe-bf074ab7cb11',
                    midiChannel: currentMidiChannelInput,
                    name: 'fx 4 depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('e1568b69-6246-469f-9654-a398a1606ef9'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'e1568b69-6246-469f-9654-a398a1606ef9',
                    midiChannel: currentMidiChannelInput,
                    name: 'fx 5 depth',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('44feabcb-b735-4980-a3fc-1e229b4bd115'):
               deepSequence.tracks[activeTrack].events.push({
                    event: '44feabcb-b735-4980-a3fc-1e229b4bd115',
                    midiChannel: currentMidiChannelInput,
                    name: 'mono mode',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break; 
            case('40fc271b-2b22-40ff-a43d-90404ff07c69'):
                deepSequence.tracks[activeTrack].events.push({
                    event: '40fc271b-2b22-40ff-a43d-90404ff07c69',
                    midiChannel: currentMidiChannelInput,
                    name: 'poly mode',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            case('c3543d3c-ccc5-45e2-ac42-c62c8b364690'):
                deepSequence.tracks[activeTrack].events.push({
                    event: 'c3543d3c-ccc5-45e2-ac42-c62c8b364690',
                    midiChannel: currentMidiChannelInput,
                    name: 'portamento',
                    time: {
                        bar: currentPosition.measure.bar,
                        beat: currentPosition.measure.beat,
                        ticks: currentPosition.measure.ticks
                    },
                    value: 64
                });
                break;
            default:
                console.log('Unsupported MIDI event');
        }
        
        setSequence(deepSequence);
        reOrderEvents();
    }
    
    const noteEditCurrentPosition = (index) => {
        
        setCurrentPosition({
            measure: {
                bar: sequence.tracks[activeTrack].events[index].noteOn.time.bar,
                beat: sequence.tracks[activeTrack].events[index].noteOn.time.beat,
                ticks: sequence.tracks[activeTrack].events[index].noteOn.time.ticks
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: sequence.tracks[activeTrack].events[index].noteOn.time.bar, 
            beat: sequence.tracks[activeTrack].events[index].noteOn.time.beat, 
            ticks: sequence.tracks[activeTrack].events[index].noteOn.time.ticks
        }));
    }
    
    const noteEditEventCurrentPosition = (index) => {
        setCurrentPosition({
            measure: {
                bar: sequence.tracks[activeTrack].events[index].time.bar,
                beat: sequence.tracks[activeTrack].events[index].time.beat,
                ticks: sequence.tracks[activeTrack].events[index].time.ticks
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: sequence.tracks[activeTrack].events[index].time.bar, 
            beat: sequence.tracks[activeTrack].events[index].time.beat, 
            ticks: sequence.tracks[activeTrack].events[index].time.ticks
        }));
    }
    
    const updateEventBarPosition = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].time.bar = parseInt(val);
        deepSequence.tracks[activeTrack].events[index].time.beat = 1;
        deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
        
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: parseInt(val),
                beat: 1,
                ticks: 1
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: parseInt(val),
            beat: 1,
            ticks: 1
        }));
    }
    
    const updateEventBeatPosition = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) === 1) {
                return;
            }
            deepSequence.tracks[activeTrack].events[index].time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) - 1;
            deepSequence.tracks[activeTrack].events[index].time.beat = parseInt(meter2.meterNumerator);
            deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) === (parseInt(deepSequence.duration.bar) - 1)) {
                return;
            }
            deepSequence.tracks[activeTrack].events[index].time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) + 1;
            deepSequence.tracks[activeTrack].events[index].time.beat = 1;
            deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
        } else {
            deepSequence.tracks[activeTrack].events[index].time.beat = parseInt(val);
            deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
        }
        
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: parseInt(deepSequence.tracks[activeTrack].events[index].time.bar),
                beat: parseInt(deepSequence.tracks[activeTrack].events[index].time.beat),
                ticks: parseInt(deepSequence.tracks[activeTrack].events[index].time.ticks)
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: parseInt(deepSequence.tracks[activeTrack].events[index].time.bar),
            beat: parseInt(deepSequence.tracks[activeTrack].events[index].time.beat),
            ticks: parseInt(deepSequence.tracks[activeTrack].events[index].time.ticks)
        }));
    }
    
    const updateEventTicksPosition = (val, index) => {
        let deepSequence = {...sequence};
        let meter = meterAtPosition(deepSequence.tracks[activeTrack].events[index].time);
        let meter2 = meterAtPosition({bar: (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) - 1), beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].time.beat) === 1) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) === 1) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) - 1;
                deepSequence.tracks[activeTrack].events[index].time.beat = parseInt(meter2.meterNumerator);
                deepSequence.tracks[activeTrack].events[index].time.ticks = parseInt(getTickMax(meter2.meterDenominator)) - 1;
            } else {
                deepSequence.tracks[activeTrack].events[index].time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].time.beat) -1;
                deepSequence.tracks[activeTrack].events[index].time.ticks = parseInt(getTickMax(meter2.meterDenominator)) - 1;
            }
            
        } else if (parseInt(val) > (parseInt(getTickMax(meter.meterDenominator)) - 1)) {
            if (parseInt(deepSequence.tracks[activeTrack].events[index].time.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) === (parseInt(deepSequence.duration.bar) - 1)) {
                    return;
                }
                deepSequence.tracks[activeTrack].events[index].time.bar = parseInt(deepSequence.tracks[activeTrack].events[index].time.bar) + 1;
                deepSequence.tracks[activeTrack].events[index].time.beat = 1;
                deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
            } else {
                deepSequence.tracks[activeTrack].events[index].time.beat = parseInt(deepSequence.tracks[activeTrack].events[index].time.beat) + 1;
                deepSequence.tracks[activeTrack].events[index].time.ticks = 0;
            }
        } else {
            deepSequence.tracks[activeTrack].events[index].time.ticks = parseInt(val);
        }
        
        setSequence(deepSequence);
        reOrderEvents();
        
        setCurrentPosition({
            measure: {
                bar: parseInt(deepSequence.tracks[activeTrack].events[index].time.bar),
                beat: parseInt(deepSequence.tracks[activeTrack].events[index].time.beat),
                ticks: parseInt(deepSequence.tracks[activeTrack].events[index].time.ticks)
            }
        });
        setCurrentClockPosition(calculateTimeString({
            bar: parseInt(deepSequence.tracks[activeTrack].events[index].time.bar),
            beat: parseInt(deepSequence.tracks[activeTrack].events[index].time.beat),
            ticks: parseInt(deepSequence.tracks[activeTrack].events[index].time.ticks)
        }));
    }
    
    const updatePitchbendValue = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].bend = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const updateEventProgramChange = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].program = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const updateEventNoteNote = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].note = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const updateEventNotePressure = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].pressure = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const updateController = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].controller = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const updateEventValue = (val, index) => {
        let deepSequence = {...sequence};
        
        deepSequence.tracks[activeTrack].events[index].value = parseInt(val);
        
        setSequence(deepSequence);
    }
    
    const toggleEventSwitch = (index) => {
        let deepSequence = {...sequence};
        if (parseInt(deepSequence.tracks[activeTrack].events[index].value) > 63) {
            deepSequence.tracks[activeTrack].events[index].value = 0;
        } else {
            deepSequence.tracks[activeTrack].events[index].value = 64;
        }
        
        setSequence(deepSequence);
    }
    
    const updateRepeaterFromBar = (val) => {
        let deepCopy = {...repeaterSettings};
        
        deepCopy.from.bar = parseInt(val);
        if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.from.beat = 1;
            }
            if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = 0;
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterToBar = (val) => {
        let deepCopy = {...repeaterSettings};
        
        deepCopy.to.bar = parseInt(val);
        if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.from.beat = 1;
            }
            if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = 0;
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateStartingAtBar = (val) => {
        let deepCopy = {...repeaterSettings};
        
        deepCopy.start.bar = parseInt(val);
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterNumberOfTimes = (val) => {
        let deepCopy = {...repeaterSettings};
        
        deepCopy.numberOfTimes = parseInt(val);
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterFromBeat = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepCopy.from.bar) === 1) {
                return;
            }
            deepCopy.from.bar = parseInt(deepCopy.from.bar) - 1;
            deepCopy.from.beat = parseInt(meter2.meterNumerator);
            deepCopy.from.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.from.bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.from.bar = parseInt(deepCopy.from.bar) + 1;
            deepCopy.from.beat = 1;
            deepCopy.from.ticks = 0;
        } else {
            deepCopy.from.beat = parseInt(val);
            deepCopy.from.ticks = 0;
        }
        if (parseInt(deepCopy.from.bar) > parseInt(deepCopy.to.bar)) {
            deepCopy.to.bar = deepCopy.from.bar;
            deepCopy.to.beat = 1;
            deepCopy.to.ticks = 0;
        } else if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.to.beat = deepCopy.from.beat;
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = deepCopy.from.ticks;
                }
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = deepCopy.from.ticks;
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterToBeat = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.to.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.to.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.to.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepCopy.to.beat) === 1) {
                if (parseInt(deepCopy.to.bar) === 1) {
                    return;
                }
                deepCopy.to.bar = parseInt(deepCopy.to.bar) - 1;
                deepCopy.to.beat = parseInt(meter2.meterNumerator);
                deepCopy.to.ticks = 0;
            } else {
                deepCopy.to.beat = parseInt(deepCopy.to.beat) - 1;
                deepCopy.to.ticks = parseInt(meter.meterDenominator);
            }
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.to.bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.to.bar = parseInt(deepCopy.to.bar) + 1;
            deepCopy.to.beat = 1;
            deepCopy.to.ticks = 0;
        } else {
            deepCopy.to.beat = parseInt(val);
        }
        if (parseInt(deepCopy.from.bar) > parseInt(deepCopy.to.bar)) {
            deepCopy.from.bar = deepCopy.to.bar;
            deepCopy.from.beat = 1;
            deepCopy.from.ticks = 0;
        } else if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.from.beat = deepCopy.to.beat;
                deepCopy.from.ticks = 0;
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = deepCopy.to.ticks;
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateStartingAtBeat = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.start.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.start.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.start.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepCopy.start.bar) === 1) {
                return;
            }
            deepCopy.start.bar = parseInt(deepCopy.start.bar) - 1;
            deepCopy.start.beat = parseInt(meter2.meterNumerator);
            deepCopy.start.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.start.bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.start.bar = parseInt(deepCopy.start.bar) + 1;
            deepCopy.start.beat = 1;
            deepCopy.start.ticks = 0;
        } else {
            deepCopy.start.beat = parseInt(val);
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterFromTicks = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.from.beat) === 1) {
                if (parseInt(deepCopy.from.bar) === 1) {
                    return;
                }
                deepCopy.from.bar = parseInt(deepCopy.from.bar) - 1;
                deepCopy.from.beat = parseInt(meter2.meterNumerator);
                deepCopy.from.ticks = parseInt(getTickMax(parseInt(meter2.meterDenominator))) - 1;
            } else {
                deepCopy.from.beat = parseInt(deepCopy.from.beat) - 1;
                deepCopy.from.ticks = parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1;
            }
        } else if (parseInt(val) > (parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1)) {
            if (parseInt(deepCopy.from.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepCopy.from.bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.from.bar = parseInt(deepCopy.from.bar) + 1;
                deepCopy.from.beat = 1;
                deepCopy.from.ticks = 0;
            } else {
                deepCopy.from.beat = parseInt(deepCopy.from.beat) + 1;
                deepCopy.from.ticks = 0;
            }
        } else {
            deepCopy.from.ticks = parseInt(val);
        }
        if (parseInt(deepCopy.from.bar) > parseInt(deepCopy.to.bar)) {
            deepCopy.to.bar = parseInt(deepCopy.from.bar);
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.to.beat = parseInt(deepCopy.from.beat);
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = parseInt(deepCopy.from.ticks);
                }
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = parseInt(deepCopy.from.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.to.beat = parseInt(deepCopy.from.beat);
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = parseInt(deepCopy.from.ticks);
                }
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.to.ticks = parseInt(deepCopy.from.ticks);
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateRepeaterToTicks = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.to.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.to.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.to.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.to.beat) === 1) {
                if (parseInt(deepCopy.to.bar) === 1) {
                    return;
                }
                deepCopy.to.bar = parseInt(deepCopy.to.bar) - 1;
                deepCopy.to.beat = parseInt(meter2.meterNumerator);
                deepCopy.to.ticks = parseInt(getTickMax(parseInt(meter2.meterDenominator))) - 1;
            } else {
                deepCopy.to.beat = parseInt(deepCopy.to.beat) - 1;
                deepCopy.to.ticks = parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1;
            }
        } else if (parseInt(val) > (parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1)) {
            if (parseInt(deepCopy.to.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepCopy.to.bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.to.bar = parseInt(deepCopy.to.bar) + 1;
                deepCopy.to.beat = 1;
                deepCopy.to.ticks = 0;
            } else {
                deepCopy.to.beat = parseInt(deepCopy.to.beat) + 1;
                deepCopy.to.ticks = 0;
            }
        } else {
            deepCopy.to.ticks = parseInt(val);
        }
        if (parseInt(deepCopy.from.bar) > parseInt(deepCopy.to.bar)) {
            deepCopy.from.bar = parseInt(deepCopy.to.bar);
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.from.beat = parseInt(deepCopy.to.beat);
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = parseInt(deepCopy.to.ticks);
                }
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = parseInt(deepCopy.to.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.bar) === parseInt(deepCopy.to.bar)) {
            if (parseInt(deepCopy.from.beat) > parseInt(deepCopy.to.beat)) {
                deepCopy.from.beat = parseInt(deepCopy.to.beat);
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = parseInt(deepCopy.to.ticks);
                }
            } else if (parseInt(deepCopy.from.beat) === parseInt(deepCopy.to.beat)) {
                if (parseInt(deepCopy.from.ticks) > parseInt(deepCopy.to.ticks)) {
                    deepCopy.from.ticks = parseInt(deepCopy.to.ticks);
                }
            }
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const updateStartAtTicks = (val) => {
        let deepCopy = {...repeaterSettings};
        let meter = meterAtPosition({bar: parseInt(deepCopy.start.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.start.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.start.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.start.beat) === 1) {
                if (parseInt(deepCopy.start.bar) === 1) {
                    return;
                }
                deepCopy.start.bar = parseInt(deepCopy.start.bar) - 1;
                deepCopy.start.beat = parseInt(meter2.meterNumerator);
                deepCopy.start.ticks = parseInt(getTickMax(parseInt(meter2.meterDenominator))) - 1;
            } else {
                deepCopy.start.beat = parseInt(deepCopy.start.beat) - 1;
                deepCopy.start.ticks = parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1;
            }
        } else if (parseInt(val) > (parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1)) {
            if (parseInt(deepCopy.start.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepCopy.start.bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.start.bar = parseInt(deepCopy.start.bar) + 1;
                deepCopy.start.beat = 1;
                deepCopy.start.ticks = 0;
            } else {
                deepCopy.start.beat = parseInt(deepCopy.start.beat) + 1;
                deepCopy.start.ticks = 0;
            }
        } else {
            deepCopy.start.ticks = parseInt(val);
        }
        
        setRepeaterSettings(deepCopy);
    }
    
    const extractFragment = () => {
        let arr = [];
        
        for (let i = 0; i < sequence.tracks[activeTrack].events.length; i++) {
            if (sequence.tracks[activeTrack].events[i].event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') {
                if (positionEqualTo(repeaterSettings.from, sequence.tracks[activeTrack].events[i].noteOn.time) || positionGreaterThan(repeaterSettings.from, sequence.tracks[activeTrack].events[i].noteOn.time)) {
                    if (positionGreaterThan(sequence.tracks[activeTrack].events[i].noteOn.time, repeaterSettings.to)) {
                        arr.push(sequence.tracks[activeTrack].events[i]);
                    }
                }
            } else {
                if (positionEqualTo(repeaterSettings.from, sequence.tracks[activeTrack].events[i].time) || positionGreaterThan(repeaterSettings.from, sequence.tracks[activeTrack].events[i].time)) {
                    if (positionGreaterThan(sequence.tracks[activeTrack].events[i].time, repeaterSettings.to)) {
                        arr.push(sequence.tracks[activeTrack].events[i]);
                    }
                }
            }
        }
        return arr;
    }
    
    const addTick = (position) => {
        let meter = meterAtPosition({bar: parseInt(position.bar), beat: 1, ticks: 0});
        let temp = {
            bar: parseInt(position.bar),
            beat: parseInt(position.beat),
            ticks: parseInt(position.ticks)
        };
        
        temp.ticks = temp.ticks + 1;
        if (parseInt(temp.ticks) === parseInt(getTickMax(parseInt(meter.meterDenominator)))) {
            if (parseInt(temp.beat) === parseInt(meter.meterNumerator)) {
                temp.bar = temp.bar + 1;
                temp.beat = 1;
                temp.ticks = 0;
            } else {
                temp.beat = temp.beat + 1;
                temp.ticks = 0;
            }
        }
        
        return temp;
    }
    
    const calculateDurationInTicks = (from, to) => {
        let total = 0;
        let position = {
            bar: from.bar,
            beat: from.beat,
            ticks: from.ticks
        }
        
        while ((!positionEqualTo(position, to)) && (positionGreaterThan(position, to))) {
            position = addTick(position);
            ++total;
        }
        
        return total;
    }
    
    const calculateStartingPoints = () => {
        let arr = [];
        let repeatDuration = 0;
        
        arr.push({
            bar: repeaterSettings.start.bar,
            beat: repeaterSettings.start.beat,
            ticks: repeaterSettings.start.ticks
        });
        
        if (parseInt(repeaterSettings.numberOfTimes) > 1) {
            repeatDuration = calculateDurationInTicks(repeaterSettings.from, repeaterSettings.to);
            let track = {
                bar: repeaterSettings.start.bar,
                beat: repeaterSettings.start.beat,
                ticks: repeaterSettings.start.ticks
            };
            for (let i = 1; i < parseInt(repeaterSettings.numberOfTimes); i++) {
                for (let j = 0; j < repeatDuration; j++) {
                    track = addTick(track);
                }
                arr.push({
                    bar: track.bar,
                    beat: track.beat,
                    ticks: track.ticks
                });
            }
        }
        console.log(arr);
        
        return arr;
    }
    
    const copySelectionTo = () => {
        let deepCopy = {...sequence};
        const selectedFragment = extractFragment();
        const startingPoints = calculateStartingPoints();
        let placePosition, eventAdd;
        let time1, time2, time3, time4;
        
        for (let i = 0; i < startingPoints.length; i++) {
            for (let j = 0; j < selectedFragment.length; j++) {
                if (selectedFragment[j].event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') {
                    time1 = calculateDurationInTicks(repeaterSettings.from, selectedFragment[j].noteOn.time);
                    time2 = startingPoints[i];
                    for (let k = 0; k < time1; k++) {
                        time2 = addTick(time2);
                    }
                    time3 = calculateDurationInTicks(repeaterSettings.from, selectedFragment[j].noteOff.time);
                    time4 = startingPoints[i];
                    for (let l = 0; l < time3; l++) {
                        time4 = addTick(time4);
                    }
                    eventAdd = {
                        event: selectedFragment[j].event,
                        midiChannel: selectedFragment[j].midiChannel,
                        name: selectedFragment[j].name,
                        noteOn: {
                            note: selectedFragment[j].noteOn.note,
                            time: {
                                bar: time2.bar,
                                beat: time2.beat,
                                ticks: time2.ticks
                            },
                            velocity: selectedFragment[j].noteOn.velocity
                        },
                        noteOff: {
                            note: selectedFragment[j].noteOff.note,
                            time: {
                                bar: time4.bar,
                                beat: time4.beat,
                                ticks: time4.ticks
                            },
                            velocity: selectedFragment[j].noteOff.velocity
                        }
                    };
                    if (parseInt(time4.bar) > parseInt(deepCopy.duration.bar)) {
                        deepCopy.duration.bar = parseInt(time4.bar) + 1;
                    }
                } else {
                    time1 = calculateDurationInTicks(repeaterSettings.from, selectedFragment[j].time);
                    time2 = startingPoints[i];
                    for (let m = 0; m < time1; m++) {
                        time2 = addTick(time2);
                    }
                    switch(selectedFragment[j].event) {
                        case('d1595e03-bcd9-4ca7-9247-4d54723c5a05'):
                            eventAdd = {
                                bend: selectedFragment[j].bend,
                                event: selectedFragment[j].event,
                                midiChannel: selectedFragment[j].midiChannel,
                                name: selectedFragment[j].name,
                                time: {
                                    bar: time2.bar,
                                    beat: time2.beat,
                                    ticks: time2.ticks
                                }
                            }
                            break;
                        case('2fdb9151-68ad-46f7-b11e-adbb15d12a09'):
                            eventAdd = {
                                event: selectedFragment[j].event,
                                midiChannel: selectedFragment[j].midiChannel,
                                name: selectedFragment[j].name,
                                program: selectedFragment[j].program,
                                time: {
                                    bar: time2.bar,
                                    beat: time2.beat,
                                    ticks: time2.ticks
                                }
                            }
                            break;
                        case('9a141aff-eea8-46c4-8650-679d9218fb08' || 'd1c6b635-d413-40aa-97dd-7d795230d5f4'):
                            eventAdd = {
                                event: selectedFragment[j].event,
                                midiChannel: selectedFragment[j].midiChannel,
                                name: selectedFragment[j].name,
                                note: selectedFragment[j].note,
                                pressure: selectedFragment[j].pressure,
                                time: {
                                    bar: time2.bar,
                                    beat: time2.beat,
                                    ticks: time2.ticks
                                }
                            }
                            break;
                        case('884e57d3-f5a5-4192-b640-78891802867b'):
                            eventAdd = {
                                controller: selectedFragment[j].controller,
                                event: selectedFragment[j].event,
                                midiChannel: selectedFragment[j].midiChannel,
                                name: selectedFragment[j].name,
                                time: {
                                    bar: time2.bar,
                                    beat: time2.beat,
                                    ticks: time2.ticks
                                },
                                value: selectedFragment[j].value
                            }
                            break;
                        case('042b257f-f1de-488d-900b-6d7c49361748' || '89265cc9-9ce5-4219-bfb6-371b18ed42b1' || '4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e' || '2a3b9983-d175-4bde-aca9-63b70944ec7e' || '96a94fa3-cf34-4ab5-8cb4-586b25e8b40c' || 'babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb' || '5138de25-1d5c-473e-8a68-ddbeadc32bd4' || '598a5aaa-346c-4e2c-80ce-08cbcb1e7c24' || 'ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb' || '15a9c413-3dbe-4890-bd52-287c2a48f615' || '9434ea7e-6a63-423c-9be5-77584bd587e4' || 'a97eee86-2a5e-47db-99b1-74b61bc994c1' || '6eaceab3-35bb-49e2-ad82-5bd4c3a32679' || 'cdd20c5c-f942-4f8f-a15f-a750ecfd957c' || '3474f1bf-5aae-434e-ba95-102114de0dd2' || '221e9b45-0ec8-421e-adb6-cfaf19b69610' || 'a889cf3f-3986-46ef-9bb3-d4b42fc41fb0' || 'c3543d3c-ccc5-45e2-ac42-c62c8b364690' || '26a0ab85-b2cc-4442-84c0-bd30fb239869' || '890d5a31-859b-4958-8eca-dd0b52f1fbec' || 'f31779f1-2599-487b-8e96-5b0abd35394e' || '75cf0bca-6196-4219-9eef-54272e8020a8' || 'eaf504e8-217f-4e76-b6cc-ba78ff99aba3' || '5531a226-bc2c-4c60-9505-9b8da30b86c2' || 'cb30f654-a1c1-4e76-b479-d41821ede969' || '9390dbb8-efe9-4b41-adf3-47c6531f7aa1' || 'f61546fe-fd2a-4c89-813c-44dde15e6aa2' || '79d3c79f-6d9b-4eb1-ae78-51dd9362e21b' || '752a2e67-911e-45b5-801d-0841c38cf8c2' || '97fb8e80-b937-464d-8830-212dcac90675' || '5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c' || '1ab83a91-21b1-4d56-b333-3a59c4ade431' || 'b64c45f7-cf57-4864-a07f-e8f82dbf63b1' || 'faf99fca-87c1-4e8e-81f5-b0f14251db08' || '4c64d103-e813-4c4a-80b5-01cd8186635c' || 'e181eaf9-1b61-4e5b-8982-833fb9594529' || '246e9232-3d6a-4352-8957-d0ff9c1c834e' || '80e77d4b-c523-4393-a279-6d7b15e65d8a' || 'c3b8b079-4994-480e-9b0a-8cbce11fba46' || '206ff86e-6894-4b56-9f5b-f5387d18f2ea' || '2517d341-7ae3-4dae-b866-49bd2fc9b21c' || '269524b5-a240-42e5-abfe-bf074ab7cb11' || 'e1568b69-6246-469f-9654-a398a1606ef9' || '44feabcb-b735-4980-a3fc-1e229b4bd115' || '40fc271b-2b22-40ff-a43d-90404ff07c69'):
                            eventAdd = {
                                event: selectedFragment[j].event,
                                midiChannel: selectedFragment[j].midiChannel,
                                name: selectedFragment[j].name,
                                time: {
                                    bar: time2.bar,
                                    beat: time2.beat,
                                    ticks: time2.ticks
                                },
                                value: selectedFragment[j].value
                            }
                            break;
                        default:
                            console.log('unsupported');
                    }   
                    if (parseInt(time2.bar) > parseInt(deepCopy.duration.bar)) {
                        deepCopy.duration.bar = parseInt(time2.bar) + 1;
                    }
                }
                deepCopy.tracks[activeTrack].events.push(eventAdd);
            }
        }
        setSequence(deepCopy);
        
        reOrderEvents();
        cancelRepeaterModal();
    }
    
    const openMIDIFxModal = () => {
        setAddFxModalState('_Active');
        setStepSequencerState('_Inactive');
    }
    
    const cancelMidiFXModal = () => {
        setAddFxModalState('_Inactive');
        setStepSequencerState('_Active');
    }
    
    const openRitAccelModal = () => {
        setRitAccelModalState('_Active');
        setStepSequencerState('_Inactive');
    }
    
    const cancelRitAccelModal = () => {
        setRitAccelModalState('_Inactive');
        setStepSequencerState('_Active');
    }
    
    const cycleRitAccelNoteheadFrom = (val) => {
        let deepCopy = {...ritAccelParams};
        
        switch(val) {
            case('dottedEighthNote'):
                deepCopy.from.note = 'quarter';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCopy.from.note = 'wholeNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.from.note = 'sixtyFourthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCopy.from.note = 'halfNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCopy.from.note = 'eighthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.from.note = 'thirtySecondNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCopy.from.note = 'sixteenthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCopy.from.note = 'doubleWholeNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCopy.from.note = 'oneHundredTwentyEighthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 256);
                break;
            case('eighthNote'):
                deepCopy.from.note = 'dottedEighthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCopy.from.note = 'dottedHalf';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.from.note = 'dottedOneHundredTwentyEighthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCopy.from.note = 'dottedQuarter';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCopy.from.note = 'dottedSixteenthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCopy.from.note = 'dottedSixtyFourthNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCopy.from.note = 'dottedThirtySecondNote';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCopy.from.note = 'dottedWhole';
                deepCopy.from.tempo = (parseFloat(deepCopy.from.tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelTempoFrom = (val) => {
        let deepCopy = {...ritAccelParams};
        
        deepCopy.from.tempo = val;
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelTempoTo = (val) => {
        let deepCopy = {...ritAccelParams};
        
        deepCopy.to.tempo = val;
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelFromBar = (val) => {
        let deepCopy = {...ritAccelParams};
        
        deepCopy.from.time.bar = parseInt(val);
        
        if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.to.time.beat = parseInt(deepCopy.from.time.beat);
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelFromBeat = (val) => {
        let deepCopy = {...ritAccelParams};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.time.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepCopy.from.time.bar) === 1) {
                return;
            }
            deepCopy.from.time.bar = parseInt(deepCopy.from.time.bar) - 1;
            deepCopy.from.time.beat = parseInt(meter2.meterNumerator);
            deepCopy.from.time.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.from.time.bar) === (parseInt(sequence.duration.bar) - 1)) {
                return;
            }
            deepCopy.from.time.bar = parseInt(deepCopy.from.time.bar) + 1;
            deepCopy.from.time.beat = 1;
            deepCopy.from.time.ticks = 0;
        } else {
            deepCopy.from.time.beat = parseInt(val);
        }
        if (parseInt(deepCopy.from.time.bar) > parseInt(deepCopy.to.time.bar)) {
            deepCopy.to.time.bar = parseInt(deepCopy.from.time.bar);
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.to.time.beat = parseInt(deepCopy.from.time.beat);
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.to.time.beat = parseInt(deepCopy.from.time.beat);
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelFromTicks = (val) => {
        let deepCopy = {...ritAccelParams};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.time.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.from.time.beat) === 1) {
                if (parseInt(deepCopy.from.time.bar) === 1) {
                    return;
                }
                deepCopy.from.time.bar = parseInt(deepCopy.from.time.bar) - 1;
                deepCopy.from.time.beat = parseInt(meter2.meterNumerator);
                deepCopy.from.time.ticks = parseInt(getTickMax(parseInt(meter2.meterDenominator))) - 1;
            } else {
                deepCopy.from.time.beat = parseInt(deepCopy.from.time.beat) - 1;
                deepCopy.from.time.ticks = parseInt(getTickMax(parseInt(meter2.meterDenominator))) - 1;
            }
        } else if (parseInt(val) > (parseInt(getTickMax(parseInt(meter.meterDenominator))) - 1)) {
            if (parseInt(deepCopy.from.time.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepCopy.from.time.bar) === (parseInt(sequence.duration.bar) - 1)) {
                    return;
                }
                deepCopy.from.time.bar = parseInt(deepCopy.from.time.bar) + 1;
                deepCopy.from.time.beat = 1;
                deepCopy.from.time.ticks = 0;
            } else {
                deepCopy.from.time.beat = parseInt(deepCopy.from.time.beat) + 1;
                deepCopy.from.time.ticks = 0;
            }
        } else {
            deepCopy.from.time.ticks = parseInt(val);
        }
        if (parseInt(deepCopy.from.time.bar) > parseInt(deepCopy.to.time.bar)) {
            deepCopy.to.time.bar = parseInt(deepCopy.from.time.bar);
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.to.time.beat = parseInt(deepCopy.from.time.beat);
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.to.time.beat = parseInt(deepCopy.from.time.beat);
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks) > parseInt(deepCopy.to.time.ticks)) {
                    deepCopy.to.time.ticks = parseInt(deepCopy.from.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const cycleRitAccelNoteheadTo = (val) => {
        let deepCopy = {...ritAccelParams};
        
        switch(val) {
            case('dottedEighthNote'):
                deepCopy.to.note = 'quarter';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedHalf'):
                deepCopy.to.note = 'wholeNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                deepCopy.to.note = 'sixtyFourthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedQuarter'):
                deepCopy.to.note = 'halfNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedSixteenthNote'):
                deepCopy.to.note = 'eighthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedSixtyFourthNote'):
                deepCopy.to.note = 'thirtySecondNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedThirtySecondNote'):
                deepCopy.to.note = 'sixteenthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('dottedWhole'):
                deepCopy.to.note = 'doubleWholeNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 4) * 3;
                break;
            case('doubleWholeNote'):
                deepCopy.to.note = 'oneHundredTwentyEighthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 256);
                break;
            case('eighthNote'):
                deepCopy.to.note = 'dottedEighthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 2) /3;
                break;
            case('halfNote'):
                deepCopy.to.note = 'dottedHalf';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 3) * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                deepCopy.to.note = 'dottedOneHundredTwentyEighthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 3) * 2;
                break;
            case('quarter'):
                deepCopy.to.note = 'dottedQuarter';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 2) /3;
                break;
            case('sixteenthNote'):
                deepCopy.to.note = 'dottedSixteenthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 2) /3;
                break;
            case('sixtyFourthNote'):
                deepCopy.to.note = 'dottedSixtyFourthNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 2) /3;
                break;
            case('thirtySecondNote'):
                deepCopy.to.note = 'dottedThirtySecondNote';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) * 2) /3;
                break;
            case('wholeNote'):
                deepCopy.to.note = 'dottedWhole';
                deepCopy.to.tempo = (parseFloat(deepCopy.to.tempo) / 3) * 2;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelToBar = (val) => {
        let deepCopy = {...ritAccelParams};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.time.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) + 1, beat: 1, ticks: 0});
        
        deepCopy.to.time.bar = parseInt(val);
        if (parseInt(deepCopy.from.time.bar) > parseInt(deepCopy.to.time.bar)) {
            deepCopy.from.time.bar = parseInt(deepCopy.to.time.bar);
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelToBeat = (val) => {
        let deepCopy = {...ritAccelParams};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.time.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 1) {
            if (parseInt(deepCopy.to.time.bar) === 1) {
                return;
            }
            deepCopy.to.time.bar = parseInt(deepCopy.to.time.bar) - 1;
            deepCopy.to.time.beat = parseInt(meter2.meterNumerator);
            deepCopy.to.time.ticks = 0;
        } else if (parseInt(val) > parseInt(meter.meterNumerator)) {
            if (parseInt(deepCopy.to.time.bar) === parseInt(sequence.duration.bar)) {
                return;
            }
            deepCopy.to.time.bar = parseInt(deepCopy.to.time.bar) + 1;
            deepCopy.to.time.beat = 1;
            deepCopy.to.time.ticks = 0;
        } else {
            deepCopy.to.time.beat = parseInt(val);
        }
        if (parseInt(deepCopy.from.time.bar) > parseInt(deepCopy.to.time.bar)) {
            deepCopy.from.time.bar = parseInt(deepCopy.to.time.bar);
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelToTicks = (val) => {
        let deepCopy = {...ritAccelParams};
        let meter = meterAtPosition({bar: parseInt(deepCopy.from.time.bar), beat: 1, ticks: 0});
        let meter2 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) - 1, beat: 1, ticks: 0});
        let meter3 = meterAtPosition({bar: parseInt(deepCopy.from.time.bar) + 1, beat: 1, ticks: 0});
        
        if (parseInt(val) < 0) {
            if (parseInt(deepCopy.to.time.beat) === 1) {
                if (parseInt(deepCopy.to.time.bar) === 1) {
                    return;
                }
                deepCopy.to.time.bar = parseInt(deepCopy.to.time.bar) - 1;
                deepCopy.to.time.beat = parseInt(meter2.meterNumerator);
                deepCopy.to.time.ticks = parseInt(getMaxTick(parseInt(meter2.meterDenominator))) - 1;
            } else {
                deepCopy.to.time.beat = parseInt(deepCopy.to.time.beat) - 1;
                deepCopy.to.time.ticks = parseInt(getMaxTick(parseInt(meter.meterDenominator))) - 1;
            }
        } else if (parseInt(val) > (parseInt(getMaxTick(parseInt(meter.meterDenominator))) - 1)) {
            if (parseInt(deepCopy.to.time.beat) === parseInt(meter.meterNumerator)) {
                if (parseInt(deepCopy.to.time.bar) === parseInt(sequence.duration.bar)) {
                    return;
                }
                deepCopy.to.time.bar = parseInt(deepCopy.to.time.bar) + 1;
                deepCopy.to.time.beat = 1;
                deepCopy.to.time.ticks = 0;
            } else {
                deepCopy.to.time.beat = parseInt(deepCopy.to.time.beat) + 1;
                deepCopy.to.time.ticks = 0;
            }
        } else {
            deepCopy.to.time.ticks = parseInt(val);
        }
        if (parseInt(deepCopy.from.time.bar) > parseInt(deepCopy.to.time.bar)) {
            deepCopy.from.time.bar = parseInt(deepCopy.to.time.bar);
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        } else if (parseInt(deepCopy.from.time.bar) === parseInt(deepCopy.to.time.bar)) {
            if (parseInt(deepCopy.from.time.beat) > parseInt(deepCopy.to.time.beat)) {
                deepCopy.from.time.beat = parseInt(deepCopy.to.time.beat);
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            } else if (parseInt(deepCopy.from.time.beat) === parseInt(deepCopy.to.time.beat)) {
                if (parseInt(deepCopy.from.time.ticks > parseInt(deepCopy.to.time.ticks))) {
                    deepCopy.from.time.ticks = parseInt(deepCopy.to.time.ticks);
                }
            }
        }
        
        setRitAccelParams(deepCopy);
    }
    
    const absoluteTempoPosition = (note, tempo) => {
        let val = 0;
        let absoluteTempo = tempo;
        
        switch(note) {
            case('dottedEighthNote'):
                absoluteTempo = (tempo * 3) / 4;
                break;
            case('dottedHalf'):
                absoluteTempo = tempo * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                absoluteTempo = (tempo * 3) / 64;
                break;
            case('dottedQuarter'):
                absoluteTempo = (tempo * 3) / 2;
                break;
            case('dottedSixteenthNote'):
                absoluteTempo = (tempo * 3) / 8;
                break;
            case('dottedSixtyFourthNote'):
                absoluteTempo = (tempo * 3) / 32;
                break;
            case('dottedThirtySecondNote'):
                absoluteTempo = (tempo * 3) / 16;
                break;
            case('dottedWhole'):
                absoluteTempo = tempo * 6;
                break;
            case('doubleWholeNote'):
                absoluteTempo = tempo * 8;
                break;
            case('eighthNote'):
                absoluteTempo = tempo / 2;
                break;
            case('halfNote'):
                absoluteTempo = tempo * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                absoluteTempo = tempo / 32;
                break;
            case('quarter'):
                absoluteTempo = tempo;
                break;
            case('sixteenthNote'):
                absoluteTempo = tempo / 4;
                break;
            case('sixtyFourthNote'):
                absoluteTempo = tempo / 16;
                break;
            case('thirtySecondNote'):
                absoluteTempo = tempo / 8;
                break;
            case('wholeNote'):
                absoluteTempo = tempo * 4;
                break;
            default:
                alert('unsupported tempo base');
        }
        
        val = Math.floor(svgHeight - (svgHeight * (absoluteTempo/1000)));
        
        return val.toString();
    }
    
    const updateRitAccelCurveX = (val) => {
        let deepCopy = {...ritAccelParams};
        
        deepCopy.curve[0] = val;
        
        setRitAccelParams(deepCopy);
    }
    
    const updateRitAccelCurveY = (val) => {
        let deepCopy = {...ritAccelParams};
        
        deepCopy.curve[1] = val;
        
        setRitAccelParams(deepCopy);
    }
    
    const curveX1Position = (val) => {
        let position = (svgWidth / 3);
        let diff = (svgWidth / 3);
        
        if (val < 0) {
            diff = 10 * (diff * ((val * -1)/100));
            position = position - diff;
        } else if (val > 0) {
            diff = 10 * (diff * (val/100));
            position = position + diff;
        }
        
        if (position < 0) {
            position = 0;
        } else if (position > svgWidth) {
            position = svgWidth;
        }
        
        return Math.floor(position).toString();
    }
    
    const curveX2Position = (val) => {
        let position = ((svgWidth * 2) / 3);
        let diff = (svgWidth / 3);
        
        if (val < 0) {
            diff = 10 * (diff * ((val * -1)/100));
            position = position + diff;
        } else if (val > 0) {
            diff = 10 * (diff * (val/100));
            position = position - diff;
        }
        
        if (position > (svgWidth * 2)) {
            position = svgWidth * 2;
        } else if (position < (-1 * svgWidth)) {
            position = (-1 * svgWidth);
        }
        
        return Math.floor(position).toString();
    }
    
    const curveY1Position = (val) => {
        let position = 0;
        let tempo1 = parseInt(absoluteTempoPosition(ritAccelParams.from.note, ritAccelParams.from.tempo));
        let tempo2 = parseInt(absoluteTempoPosition(ritAccelParams.to.note, ritAccelParams.to.tempo));
        let diff = 0;
        let offset = 0;
        
        if (tempo1 < tempo2) {
            diff = tempo2 - tempo1;
            position = tempo1 + (diff/3);
        } else {
            diff = tempo1 - tempo2;
            position = tempo2 + ((diff / 3) * 2);
        }
        
        if (val < 0) {
            offset = ((val * -1)/diff);
            position = position - (16 * (diff * offset));
        } else if (val > 0) {
            offset = (val/diff);
            position = position + (16 * (diff * offset));
        }
        
        if (tempo1 < tempo2) {
            if (position < (tempo1)) {
                position = tempo1;
            } else if (position > tempo2) {
                position = tempo2;
            }
        } else {
            if (position < (tempo2)) {
                position = tempo2;
            } else if (position > (tempo1)) {
                position = tempo1;
            }
        }
        
        return Math.floor(position).toString();
    }
    
    const curveY2Position = (val) => {
        let position = 0;
        let tempo1 = parseInt(absoluteTempoPosition(ritAccelParams.from.note, ritAccelParams.from.tempo));
        let tempo2 = parseInt(absoluteTempoPosition(ritAccelParams.to.note, ritAccelParams.to.tempo));
        let diff = 0;
        let offset = 0;
        
        if (tempo1 < tempo2) {
            diff = tempo2 - tempo1;
            position = tempo1 + ((diff / 3) * 2);
        } else {
            diff = tempo1 - tempo2;
            position = tempo2 + (diff / 3);
        }
        
        if (val < 0) {
            offset = ((val * -1)/diff);
            position = position + (16 * (diff * offset));
        } else if (val > 0) {
            offset = (val/diff);
            position = position - (16 * (diff * offset));
        }
        
        if (tempo1 < tempo2) {
            if (position < (tempo1)) {
                position = tempo1;
            } else if (position > tempo2) {
                position = tempo2;
            }
        } else {
            if (position < (tempo2)) {
                position = tempo2;
            } else if (position > (tempo1)) {
                position = tempo1;
            }
        }
        
        return Math.floor(position).toString();
    }
    
    const convertToQuarter = (time) => {
        let copyTime = {...time};
        copyTime.tempoBase = 'quarter';
        
        switch(time.tempoBase) {
            case('dottedEighthNote'):
                copyTime.tempo = (copyTime.tempo * 3) / 4;
                break;
            case('dottedHalf'):
                copyTime.tempo = copyTime * 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                copyTime.tempo = (copyTime.tempo * 3) / 64;
                break;
            case('dottedQuarter'):
                copyTime.tempo = (copyTime.tempo * 3) / 2;
                break;
            case('dottedSixteenthNote'):
                copyTime.tempo = (copyTime.tempo * 3) / 8;
                break;
            case('dottedSixtyFourthNote'):
                copyTime.tempo = (copyTime.tempo * 3) / 32;
                break;
            case('dottedThirtySecondNote'):
                copyTime.tempo = (copyTime.tempo * 3) / 64;
                break;
            case('dottedWhole'):
                copyTime.tempo = copyTime.tempo * 6;
                break;
            case('doubleWholeNote'):
                copyTime.tempo = copyTime.tempo * 8;
                break;
            case('eighthNote'):
                copyTime.tempo = copyTime.tempo / 2;
                break;
            case('halfNote'):
                copyTime.tempo = copyTime.tempo * 2;
                break;
            case('oneHundredTwentyEighthNote'):
                copyTime.tempo = copyTime.tempo / 32;
                break;
            case('quarter'):
                copyTime.tempo = copyTime.tempo;
                break;
            case('sixteenthNote'):
                copyTime.tempo = copyTime.tempo / 4;
                break;
            case('sixtyFourthNote'):
                copyTime.tempo = copyTime.tempo / 16;
                break;
            case('thirtySecondNote'):
                copyTime.tempo = copyTime.tempo / 8;
                break;
            case('wholeNote'):
                copyTime.tempo = copyTime.tempo * 4;
                break;
            default:
                alert('ERROR');
                console.log('error');
        }
        return copyTime;
    }
    
    const syncTempoBase = (start, end) => {
        let startTempo = convertToQuarter(start);
        switch(end.tempoBase) {
            case('dottedEighthNote'):
                startTempo.tempoBase = 'dottedEighthNote';
                startTempo.tempo = (startTempo.tempo * 4) / 3;
                break;
            case('dottedHalf'):
                startTempo.tempoBase = 'dottedHalf';
                startTempo.tempo = startTempo.tempo / 3;
                break;
            case('dottedOneHundredTwentyEighthNote'):
                startTempo.tempoBase = 'dottedOneHundredTwentyEighthNote';
                startTempo.tempo = (startTempo.tempo * 64) / 3;
                break;
            case('dottedQuarter'):
                startTempo.tempoBase = 'dottedQuarter';
                startTempo.tempo = (startTempo.tempo * 2) / 3;
                break;
            case('dottedSixteenthNote'):
                startTempo.tempoBase = 'dottedSixteenthNote';
                startTempo.tempo = (startTempo.tempo * 8) / 3;
                break;
            case('dottedSixtyFourthNote'):
                startTempo.tempoBase = 'dottedSixtyFourthNote';
                startTempo.tempo = (startTempo.tempo * 32) / 3;
                break;
            case('dottedThirtySecondNote'):
                startTempo.tempoBase = 'dottedThirtySecondNote';
                startTempo.tempo = (startTempo.tempo * 16) / 3;
                break;
            case('dottedWhole'):
                startTempo.tempoBase = 'dottedWhole';
                startTempo.tempo = startTempo.tempo / 6;
                break;
            case('doubleWholeNote'):
                startTempo.tempoBase = 'doubleWholeNote';
                startTempo.tempo = startTempo.tempo / 8;
                break;
            case('eighthNote'):
                startTempo.tempoBase = 'eighthNote';
                startTempo.tempo = startTempo.tempo * 2;
                break;
            case('halfNote'):
                startTempo.tempoBase = 'halfNote';
                startTempo.tempo = startTempo.tempo / 2;
                break;
            case('oneHundredTwentyEighthNote'):
                startTempo.tempoBase = 'oneHundredTwentyEighthNote';
                startTempo.tempo = startTempo.tempo * 32;
                break;
            case('quarter'):
                startTempo.tempoBase = 'quarter';
                startTempo.tempo = startTempo.tempo;
                break;
            case('sixteenthNote'):
                startTempo.tempoBase = 'sixteenthNote';
                startTempo.tempo = startTempo.tempo * 4;
                break;
            case('sixtyFourthNote'):
                startTempo.tempoBase = 'sixtyFourthNote';
                startTempo.tempo = startTempo.tempo * 16;
                break;
            case('thirtySecondNote'):
                startTempo.tempoBase = 'thirtySecondNote';
                startTempo.tempo = startTempo.tempo * 32;
                break;
            case('wholeNote'):
                startTempo.tempoBase = 'wholeNote';
                startTempo.tempo = startTempo.tempo / 4;
                break;
            default:
                alert('ERROR');
                console.log('error');
        }
        return startTempo;
    }
    
    const calculateMidpoint1 = (start, end, accel) => {
        let ticksDuration = calculateDurationInTicks(start, end);
        let position = {
            bar: start.bar,
            beat: start.beat,
            ticks: start.ticks
        };
        let neutralTicks = Math.floor(ticksDuration/3);
        let delta = 0;
        let tempoDelta;
        let neutralTempo;
        let tempoVariance;
        
        if (ritAccelParams.curve[0] === 0) {
            delta = neutralTicks;
        } else if (ritAccelParams.curve[0] < 0) {
            delta = neutralTicks - (neutralTicks * ((-1 * ritAccelParams.curve[0])/11));
        } else {
            delta = neutralTicks + (neutralTicks * (ritAccelParams.curve[0]/11));
        }
        for (let i = 0; i < delta; i++) {
            position = addTick(position);
        }
        if (accel) {
            tempoVariance = end.tempo - start.tempo;
            neutralTempo = (tempoVariance/3) * 2;
            if (ritAccelParams.curve[1] === 0) {
                tempoDelta = neutralTempo;
            } else if (ritAccelParams.curve[1] < 0) {
                tempoDelta = neutralTempo - (neutralTempo * ((-1 * ritAccelParams.curve[1])/11));
            } else {
                tempoDelta = neutralTempo + (neutralTempo * (ritAccelParams.curve[1]/11));
            }
            position.tempo = start.tempo + tempoDelta;
        } else {
            tempoVariance = start.tempo - end.tempo;
            neutralTempo = (tempoVariance/3);
            if (ritAccelParams.curve[1] === 0) {
                tempoDelta = neutralTempo;
            } else if (ritAccelParams.curve[1] < 0) {
                tempoDelta = neutralTempo + ((neutralTempo/2) * ((-1 * ritAccelParams.curve[1])/11));
            } else {
                tempoDelta = neutralTempo - ((neutralTempo/2) * (ritAccelParams.curve[1]/11));
            }
            position.tempo = start.tempo - tempoDelta;
        }
        position.meterChange = false;
        position.tempoBase = start.tempoBase;
        position.tempoChange = true;
        
        return position;
    }
    
    const calculateMidpoint2 = (start, end, accel) => {
        let ticksDuration = calculateDurationInTicks(start, end);
        let position = {
            bar: start.bar,
            beat: start.beat,
            ticks: start.ticks
        };
        let neutralTicks = Math.floor(ticksDuration/3) * 2;
        let delta = 0;
        let tempoDelta;
        let neutralTempo;
        let tempoVariance;
        
        if (ritAccelParams.curve[0] === 0) {
            delta = neutralTicks;
        } else if (ritAccelParams.curve[0] < 0) {
            delta = neutralTicks + ((neutralTicks/2) * ((-1 * ritAccelParams.curve[0])/11));
        } else {
            delta = neutralTicks - ((neutralTicks/2) * (ritAccelParams.curve[0]/11));
        }
        for (let i = 0; i < delta; i++) {
            position = addTick(position);
        }
        if (accel) {
            tempoVariance = end.tempo - start.tempo;
            neutralTempo = (tempoVariance/3);
            if (ritAccelParams.curve[1] === 0) {
                tempoDelta = neutralTempo;
            } else if (ritAccelParams.curve[1] < 0) {
                tempoDelta = neutralTempo - (neutralTempo * ((-1 * ritAccelParams.curve[1])/11));
            } else {
                tempoDelta = neutralTempo + (neutralTempo * (ritAccelParams.curve[1]/11));
            }
            position.tempo = start.tempo + tempoDelta;
        } else {
            tempoVariance = start.tempo - end.tempo;
            neutralTempo = (tempoVariance/3) * 2;
            if (ritAccelParams.curve[1] === 0) {
                tempoDelta = neutralTempo;
            } else if (ritAccelParams.curve[1] < 0) {
                tempoDelta = neutralTempo + ((neutralTempo/2) * ((-1 * ritAccelParams.curve[1])/11));
            } else {
                tempoDelta = neutralTempo - ((neutralTempo/2) * (ritAccelParams.curve[1]/11));
            }
            position.tempo = start.tempo - tempoDelta;
        }
        position.meterChange = false;
        position.tempoBase = start.tempoBase;
        position.tempoChange = true;
        
        return position;
    }
    
    const calculateTempoChanges = (start, end, accel) => {
        let totalTicks = calculateDurationInTicks(start, end);
        let totalTempoChange = 0;
        let totalSteps = 0;
        let stepSize;
        let tempoSize;
        let position = {
            bar: start.bar,
            beat: start.beat,
            ticks: start.ticks
        };
        let tempoMark = start.tempo;
        let arr = [];
        if (!accel) {
            totalTempoChange = end.tempo - start.tempo;
        } else {
            totalTempoChange = start.tempo - end.tempo;
        }
        if (totalTicks < totalTempoChange) {
            totalSteps = Math.floor(totalTicks);
        } else {
            totalSteps = Math.floor(totalTempoChange);
        }
        stepSize = Math.floor(totalTicks/totalSteps);
        tempoSize = totalTempoChange/totalSteps;
        for (let i = 0; i < totalSteps; i++) {
            arr.push({
                bar: position.bar,
                beat: position.beat,
                ticks: position.ticks,
                tempo: tempoMark,
                tempoBase: start.tempoBase,
                tempoChange: true,
                meterChange: false
            });
            for (let j = 0; j < stepSize; j++) {
                position = addTick(position);
            }
            if (!accel) {
                tempoMark = tempoMark + tempoSize;
            } else {
                tempoMark = tempoMark - tempoSize;
            }
        }
        return arr;
    }
    
    const executeTempoRitAccel = () => {
        let deepCopy = {...tempoTrack};
        let accel = (absoluteTempoPosition(ritAccelParams.from.note, ritAccelParams.from.tempo) < absoluteTempoPosition(ritAccelParams.to.note, ritAccelParams.to.tempo));
        let startTempo = {
            bar: ritAccelParams.from.time.bar,
            beat: ritAccelParams.from.time.beat,
            meterChange: false,
            ticks: ritAccelParams.from.time.ticks,
            tempo: ritAccelParams.from.tempo,
            tempoBase: ritAccelParams.from.note,
            tempoChange: true
            
        };
        let endTempo = {
            bar: ritAccelParams.to.time.bar,
            beat: ritAccelParams.to.time.beat,
            meterChange: false,
            ticks: ritAccelParams.to.time.ticks,
            tempo: ritAccelParams.to.tempo,
            tempoBase: ritAccelParams.to.note,
            tempoChange: true
        };
        if (startTempo.tempoBase !== endTempo.tempoBase) {
            startTempo = syncTempoBase(startTempo, endTempo);
        }
        let midpoint1 = calculateMidpoint1(startTempo, endTempo, accel);
        let midpoint2 = calculateMidpoint2(startTempo, endTempo, accel);        
        let segment1 = calculateTempoChanges(startTempo, midpoint1, accel);
        let segment2 = calculateTempoChanges(midpoint1, midpoint2, accel);
        let segment3 = calculateTempoChanges(midpoint2, endTempo, accel);
        for (let i = 0; i < segment1.length; i++) {
            deepCopy.tick.push(segment1[i]);
        }
        for (let j = 0; j < segment2.length; j++) {
            deepCopy.tick.push(segment2[j]);
        }
        for (let k = 0; k < segment3.length; k++) {
            deepCopy.tick.push(segment3[k]);
        };
        deepCopy.tick.push(endTempo);
        setTempoTrack(deepCopy);
        sortTempoTrack();
        recalculateTempoTrack();
        cancelRitAccelModal();
    }
    
    return(
        <div>
            <div className={'stepSequencerContainer' + stepSequencerState + stepSequenceMonth}
                tabIndex="1">
                <div className={'stepSequencerImageDiv' + stepSequenceMonth}>
                    <div className={'stepSequencerEditorTopBar' + stepSequenceMonth}>
                        <NavLink to="/"><img className={'stepSeqNavImage' + stepSequenceMonth}
                            src={midiImage}></img>
                        </NavLink>
                    </div>
                    <h3 className={'stepSequencerTitle' + stepSequenceMonth}>Step Sequencer</h3>
                    <button className={'stepSequencerLoadButton' + stepSequenceMonth}
                        onClick={() => loadModalOn()}>load</button>
                    <input className={'stepSequencerNameInput' + stepSequenceMonth}
                        onChange={(e) => seqNameUpdate(e.target.value)}
                        type="text"
                        value={sequence.header.name}/>
                    <button className={'stepSequencerPanicButton' + stepSequenceMonth}>panic!</button>
                    <div className={'stepSequencerSidebarManager' + stepSequenceMonth}>
                        <div className={'stepSequencerSidebarContainer' + stepSequenceMonth}>
                            <button className={'stepSequencerSaveButton' + stepSequenceMonth}>save</button>
                            <button className={'stepSequencerSaveAsButton' + stepSequenceMonth}
                                onClick={() => executeSaveAsDialog()}>save as...</button>
                            <button className={'stepSequencerRevertButton' + stepSequenceMonth}>revert</button>
                        </div>
                    </div>
                    <div className={'stepSequencerPositionDisplay' + stepSequenceMonth}>
                        <input className={'stepSequencerPositionBarInput' + stepSequenceMonth} 
                            max={sequence.duration.bar}
                            min="1"
                            onChange={(e) => updateBarPosition(e.target.value)}
                            type="number"
                            value={currentPosition.measure.bar} />
                        <p className={'stepSequencerPositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerPositionBarInput' + stepSequenceMonth}
                            onChange={(e) => updateBeatPosition(e.target.value)}
                            type="number"
                            value={currentPosition.measure.beat}/>
                        <p className={'stepSequencerPositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerPositionTicker' + stepSequenceMonth}
                            onChange={(e) => updateTickPosition(e.target.value)}
                            style={{width: (2.5 * beatDigits).toString() + '%'}}
                            type="number"
                            value={currentPosition.measure.ticks} />
                        <p className={'stepSequencerCurrentClockPositionDisplay' + stepSequenceMonth}>{currentClockPosition}</p>
                        <div className={'stepSequencerRudeSoloLabelDiv' + rudeSolo + stepSequenceMonth}>
                            <p className={'stepSequencerRudeSoloLabel' + stepSequenceMonth}>rude solo</p>
                        </div>
                    </div>
                    <div className={'stepSequencerShuttleControls' + stepSequenceMonth}>
                        <img className={'stepSequencerShuttleHome' + stepSequenceMonth}
                            onClick={() => sendToHomePosition()}
                            src={home} />
                        <input className={'stepSequencerHomePositionBarInput' + stepSequenceMonth} 
                            max={sequence.duration.bar}
                            min="1"
                            onChange={(e) => updateHomeBarPosition(e.target.value)}
                            type="number"
                            value={homePosition.measure.bar} />
                        <p className={'stepSequencerHomePositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerHomePositionBarInput' + stepSequenceMonth}
                            onChange={(e) => updateHomeBeatPosition(e.target.value)}
                            type="number"
                            value={homePosition.measure.beat}/>
                        <p className={'stepSequencerHomePositionSeparator' + stepSequenceMonth}>.</p>
                        <input className={'stepSequencerHomePositionTicker' + stepSequenceMonth}
                            onChange={(e) => updateHomeTickPosition(e.target.value)}
                            style={{width: (2.5 * beatDigits).toString() + '%'}}
                            type="number"
                            value={homePosition.measure.ticks} />
                        {(!playState) && (
                            <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => playSequence()}
                                src={playButton} />
                        )}
                        {(playState) && (
                            <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => stopSequence()}
                                src={pauseButton} />
                        )}
                        {(stepInterval.note === 'quarter') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('quarter')}
                                    src={quarterNote} />
                        )}
                        {(stepInterval.note === 'dottedQuarter') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedQuarter')}
                                    src={quarterNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'halfNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('halfNote')}
                                    src={halfNote} />
                        )}
                        {(stepInterval.note === 'dottedHalf') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedHalf')}
                                    src={halfNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'wholeNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('wholeNote')}
                                    src={wholeNote} />
                        )}
                        {(stepInterval.note === 'dottedWhole') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedWhole')}
                                    src={wholeNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'doubleWholeNote') && (
                            <img className={'stepSequencerStepNoteWhole' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('doubleWholeNote')}
                                    src={doubleWholeNote} />
                        )}
                        {(stepInterval.note === 'oneHundredTwentyEighthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('oneHundredTwentyEighthNote')}
                                    src={oneHundredTwentyEighthNote} />
                        )}
                        {(stepInterval.note === 'dottedOneHundredTwentyEighthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedOneHundredTwentyEighthNote')}
                                    src={oneHundredTwentyEighthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'sixtyFourthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('sixtyFourthNote')}
                                    src={sixtyfourthNote} />
                        )}
                        {(stepInterval.note === 'dottedSixtyFourthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedSixtyFourthNote')}
                                    src={sixtyfourthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'thirtySecondNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('thirtySecondNote')}
                                    src={thirtySecondNote} />
                        )}
                        {(stepInterval.note === 'dottedThirtySecondNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedThirtySecondNote')}
                                    src={thirtySecondNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'sixteenthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('sixteenthNote')}
                                    src={sixteenthNote} />
                        )}
                        {(stepInterval.note === 'dottedSixteenthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedSixteenthNote')}
                                    src={sixteenthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        {(stepInterval.note === 'eighthNote') && (
                            <img className={'stepSequencerStepNote' + stepSequenceMonth}
                                    onClick={() => updateStepNoteInterval('eighthNote')}
                                    src={eighthNote} />
                        )}
                        {(stepInterval.note === 'dottedEighthNote') && (
                            <div><img className={'stepSequencerStepNote' + stepSequenceMonth}
                                     onClick={() => updateStepNoteInterval('dottedEighthNote')}
                                    src={eighthNote} /><p style={{color: '#000', float: 'right', marginTop: '25px', marginRight: '-5px', transform: 'translateX(-15px)'}}>.</p></div>
                        )}
                        <input className={'stepSequencerStepTicksInput' + stepSequenceMonth}
                            min="1"
                            onChange={(e) => updateStepTick(e.target.value)}
                            type="number"
                            value={stepInterval.intervalTicks} />
                        <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => backwardByInterval()}
                                src={backward} />
                        <div className={'stepSequencerShuttleSpacer' + stepSequenceMonth}></div>
                        <img className={'stepSequencerShuttlePlayButton' + stepSequenceMonth}
                                onClick={() => forwardByInterval()}
                                src={forward} />
                    </div>
                    <div className={'stepSequencerTempoTracking' + stepSequenceMonth}>
                        <div className={'stepSequencerDisplayCurrentMeterAndTempo' + stepSequenceMonth }>
                            <p className={'stepSequencerDisplayCurrentMeterNumerator' + stepSequenceMonth}>{currentMeter.numerator}/{currentMeter.denominator}</p>
                            {(currentTempo.tempoBase === 'quarter') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={quarterNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedQuarter') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'halfNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={halfNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedHalf') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'wholeNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={wholeNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedWhole') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'doubleWholeNote') && (
                                <img className={'stepSequencerTempoNoteWhole' + stepSequenceMonth}
                                    src={doubleWholeNote} />
                            )}
                            {(currentTempo.tempoBase === 'oneHundredTwentyEighthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={oneHundredTwentyEighthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'sixtyFourthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixtyfourthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedSixtyFourthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'thirtySecondNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={thirtySecondNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedThirtySecondNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'sixteenthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixteenthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedSixteenthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            {(currentTempo.tempoBase === 'eighthNote') && (
                                <img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={eighthNote} />
                            )}
                            {(currentTempo.tempoBase === 'dottedEighthNote') && (
                                <div><img className={'stepSequencerTempoNote' + stepSequenceMonth}
                                    src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '15px'}}>.</p></div>
                            )}
                            <p className={'stepSequencerDisplayCurrentMeterNumerator' + stepSequenceMonth}> = {(Math.round(currentTempo.tempo * 1000) / 1000)}</p>
                        </div>
                        <div className={'stepSequencerTempoTrackTracker' + stepSequenceMonth}>
                            {tempoTrack.tick.map(eve => (
                                <div className={'stepSequencerTempoEventLine' + ((eve.bar === currentPosition.measure.bar) && (eve.beat === currentPosition.measure.beat) && (eve.ticks === currentPosition.measure.ticks)) + stepSequenceMonth}
                                    key={eve.index}>
                                    {(eve.index === 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <p className={'stepSequencerTempoTrackDisplayLine' + stepSequenceMonth}>{eve.bar}. {eve.beat}. {eve.ticks}</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth}  
                                                onChange={(e) => setInitialMeterNumerator(e.target.value)}
                                                type="number" 
                                                value={eve.meterNumerator} />
                                            <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                            <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
                                                max="128"
                                                onChange={(e) => setInitialMeterDenominator(e.target.value)}
                                                type="number" 
                                                value={eve.meterDenominator} />
                                            {(eve.tempoBase === 'quarter') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('quarter')}
                                                    src={quarterNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedQuarter') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedQuarter')}
                                                    src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'halfNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('halfNote')}
                                                    src={halfNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedHalf') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedHalf')}
                                                    src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'wholeNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('wholeNote')}
                                                    src={wholeNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedWhole') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedWhole')}
                                                    src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'doubleWholeNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImgWhole' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('doubleWholeNote')}
                                                    src={doubleWholeNote} />
                                            )}
                                            {(eve.tempoBase === 'oneHundredTwentyEighthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('oneHundredTwentyEighthNote')}
                                                    src={oneHundredTwentyEighthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedOneHundredTwentyEighthNote')}
                                                    src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'sixtyFourthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('sixtyFourthNote')}
                                                    src={sixtyfourthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedSixtyFourthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedSixtyFourthNote')}
                                                    src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'thirtySecondNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('thirtySecondNote')}
                                                    src={thirtySecondNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedThirtySecondNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedThirtySecondNote')}
                                                    src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'sixteenthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('sixteenthNote')}
                                                    src={sixteenthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedSixteenthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedSixteenthNote')}
                                                    src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            {(eve.tempoBase === 'eighthNote') && (
                                                <img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('eighthNote')}
                                                    src={eighthNote} />
                                            )}
                                            {(eve.tempoBase === 'dottedEighthNote') && (
                                                <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg' + stepSequenceMonth} 
                                                    onClick={() => setInitialTempoBase('dottedEighthNote')}
                                                    src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                            )}
                                            <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>=</p>
                                            <input className={'stepSequencerTempoTrackTempoInput' + stepSequenceMonth}
                                                max="1000.000"
                                                min="0.001"
                                                onChange={(e) => setInitialTempo(e.target.value)}
                                                step="0.001"
                                                type="number" 
                                                value={(Math.round(eve.tempo * 1000) / 1000)} />
                                        </div>
                                    )}
                                    {(eve.cumulativeTime !== 0) && (
                                        <div className={'stepSequencerTempoEventLine' + ((parseInt(eve.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(eve.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(eve.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}>
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                onChange={(e) => updateTempoEventBar(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.bar} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                disabled={((eve.meterChange) || (!eve.meterChange && !eve.tempoChange))}
                                                onChange={(e) => updateTempoEventBeat(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.beat} />.
                                            <input className={'stepSequencerTrackingBarInput' + stepSequenceMonth}
                                                disabled={((eve.meterChange) || (!eve.meterChange && !eve.tempoChange))}
                                                onChange={(e) => updateTempoEventTicks(e.target.value, eve.index)}
                                                type="number"
                                                value={eve.ticks} />
                                            {(eve.meterChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    <input className={'stepSequencerTempoTrackNumericalInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateTempoEventMeterNumerator(e.target.value, eve.index)}
                                                        min="1"
                                                        type="number" 
                                                        value={eve.meterNumerator} />
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>/</p>
                                                    <input className={'stepSequencerTempoTrackNumericalInput2' + stepSequenceMonth}
                                                        onChange={(e) => updateTempoEventMeterDenominator(e.target.value, eve.index)}
                                                        max="128"
                                                        min="1"
                                                        type="number" 
                                                        value={eve.meterDenominator} />
                                                    <p className={'stepSequencerTempoTrackEventDeleteX' + stepSequenceMonth}
                                                        onClick={() => removeTempoTrackEvent(eve.index)}
                                                        >&#127303;</p>
                                                </div>
                                            )}
                                            {(eve.tempoChange) && (
                                                <div className={'stepSequencerTrackingMeterChangeInputsDiv' + stepSequenceMonth}>
                                                    {(eve.tempoBase === 'quarter') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('quarter', eve.index)}
                                                            src={quarterNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedQuarter') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedQuarter', eve.index)}
                                                            src={quarterNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'halfNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('halfNote', eve.index)}
                                                            src={halfNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedHalf') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedHalf', eve.index)}
                                                            src={halfNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'wholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('wholeNote', eve.index)}
                                                            src={wholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedWhole') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedWhole', eve.index)}
                                                            src={wholeNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'doubleWholeNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2Whole' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('doubleWholeNote', eve.index)}
                                                            src={doubleWholeNote} />
                                                    )}
                                                    {(eve.tempoBase === 'oneHundredTwentyEighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('oneHundredTwentyEighthNote', eve.index)}
                                                            src={oneHundredTwentyEighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedOneHundredTwentyEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedOneHundredTwentyEighthNote', eve.index)}
                                                            src={oneHundredTwentyEighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixtyFourthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('sixtyFourthNote', eve.index)}
                                                            src={sixtyfourthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixtyFourthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedSixtyFourthNote', eve.index)}
                                                            src={sixtyfourthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'thirtySecondNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('thirtySecondNote', eve.index)}
                                                            src={thirtySecondNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedThirtySecondNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedThirtySecondNote', eve.index)}
                                                            src={thirtySecondNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'sixteenthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('sixteenthNote', eve.index)}
                                                            src={sixteenthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedSixteenthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedSixteenthNote', eve.index)}
                                                            src={sixteenthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    {(eve.tempoBase === 'eighthNote') && (
                                                        <img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('eighthNote', eve.index)}
                                                            src={eighthNote} />
                                                    )}
                                                    {(eve.tempoBase === 'dottedEighthNote') && (
                                                        <div style={{display: 'flex'}}><img className={'stepSequencerTempoTrackerNoteImg2' + stepSequenceMonth} 
                                                            onClick={() => updateTempoEventTempoBase('dottedEighthNote', eve.index)}
                                                            src={eighthNote} /><p style={{color: 'white', float: 'right', marginTop: '1px'}}>.</p></div>
                                                    )}
                                                    <p className={'stepSequencerTempoTrackDisplayLine2' + stepSequenceMonth}>=</p>
                                                    <input className={'stepSequencerTempoTrackTempoInput' + stepSequenceMonth}
                                                        max="1000.000"
                                                        min="0.001"
                                                        onChange={(e) => updateTempoEventTempo(e.target.value, eve.index)}
                                                        step="0.001"
                                                        type="number" 
                                                        value={(Math.round(eve.tempo * 1000) / 1000)} />
                                                    <p className={'stepSequencerTempoTrackEventDeleteX' + stepSequenceMonth}
                                                        onClick={() => removeTempoTrackEvent(eve.index)}
                                                        >&#127303;</p>
                                                </div>
                                            )}
                                            {(!eve.meterChange && !eve.tempoChange) && (
                                                <p className={'stepSequencerTempoTrackEndMarker' + stepSequenceMonth}>end</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p className={'stepSequencerTempoTrackAddLabel' + stepSequenceMonth}>add:</p>
                        <button className={'stepSequencerTempoTrackAddMeterButton' + stepSequenceMonth}
                            onClick={() => addMeterEvent()}
                            >meter</button>
                        <button className={'stepSequencerTempoTrackAddTempoButton' + stepSequenceMonth}
                            onClick={() => addTempoChangeEvent()}
                            >tempo</button>
                        <button className={'stepSequencerTempoTrackRitAccelButton' + stepSequenceMonth}
                            onClick={() => openRitAccelModal()}>rit/accel</button>
                    </div>
                    <div className={'stepSequencerTracking' + stepSequenceMonth}>
                        <div className={'stepSequencerDisplaySequenceTrackDatas' + stepSequenceMonth }>
                            <button className={'stepSequencerTrackMuteButton' + sequence.tracks[activeTrack].mute + stepSequenceMonth}
                                onClick={() => toggleTrackMute()}>mute</button>
                            <button className={'stepSequencerTrackSoloButton' + sequence.tracks[activeTrack].solo + sequence.tracks[activeTrack].mute + stepSequenceMonth}
                                onClick={() => toggleTrackSolo()}>solo</button>
                            <select className={'stepSequencerTrackSelector' + stepSequenceMonth}
                                onChange={(e) => updateSelectedTrack(e.target.value)}
                                value={activeTrack}>
                                {sequence.tracks.map(track => (
                                    <option key={track.id} value={track.id}>{track.name}</option>))}
                            </select>
                            <select className={'stepSequencerTrackSelector' + stepSequenceMonth}
                                onChange={(e) => updateActiveTrackOutput(e.target.value)}
                                onClick={() => checkCurrentOutputs()}
                                value={sequence.tracks[activeTrack].output} >
                                {midiOutputs.map(out => (
                                    <option key={out.id} value={out.id}>{out.name}</option>))}
                            </select>
                            <button className={'stepSequencerAddDeleteTrackButton' + stepSequenceMonth}
                                onClick={() => addNewTrack()}>add</button>
                            <button className={'stepSequencerAddDeleteTrackButton' + stepSequenceMonth}
                                onClick={() => deleteTrack()}
                                >delete</button>
                        </div>
                        <div className={'stepSequencerTracksContainer' + stepSequenceMonth}>
                            {sequence.tracks.map(track => (
                                <div className={'stepSequencerIndividualTrack' + track.active + stepSequenceMonth}
                                    onClick={() => updateSelectedTrack(track.id)}>
                                    {track.events.map(event => (
                                        <div key={event.id}
                                            style={{width: '100%'}}>
                                            {(event.event === '9f4db083-23fa-4c1c-b7a5-ee3f57288aa7') && (
                                                <div className={'stepSequencerEventContainer' + track.active + 'false' + stepSequenceMonth}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                     <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <select className={'stepSequencerInitialPatchSelect' + stepSequenceMonth}
                                                        value={event.patch}>
                                                        <option value="fake patch">fake patch</option>
                                                        <option value="other fake patch">other fake patch</option>
                                                    </select>
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {(event.event === '439da322-bd74-4dc5-8e4b-b4ca664657a9') && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.noteOn.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.noteOn.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.noteOn.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateNoteEventBarOnset(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.noteOn.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateNoteEventBeatOnset(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.noteOn.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateNoteEventTickOnset(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.noteOn.time.ticks}/>
                                                    <p className={'stepSequencerEventValue' + stepSequenceMonth}>{convertPitchValue(event.noteOn.note)}</p>
                                                    <input className={'stepSequencerEventNoteInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventNoteOnNote(e.target.value, event.id)}
                                                        type="number" 
                                                        value={event.noteOn.note} />
                                                    <input className={'stepSequencerEventNoteVelocityInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventNoteVelocity(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.noteOn.velocity} />
                                                    <input className={'stepSequencerEventNoteOffBarInput' + stepSequenceMonth}
                                                        min={event.noteOn.time.bar}
                                                        onChange={(e) => updateEventNoteOffBar(e.target.value, event.id)}
                                                        type="number" 
                                                        value={event.noteOff.time.bar} />
                                                    <p className={'stepSequencerNoteOffBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventNoteOffBeatInput' + stepSequenceMonth}
                                                        onChange={(e) => updateEventNoteOffBeat(e.target.value, event.id)}
                                                        type="number" 
                                                        value={event.noteOff.time.beat} />
                                                    <p className={'stepSequencerNoteOffBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventNoteOffTicksInput' + stepSequenceMonth}
                                                        onChange={(e) => updateEventNoteOffTicks(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.noteOff.time.ticks} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {(event.event === 'd1595e03-bcd9-4ca7-9247-4d54723c5a05') && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <input className={'stepSequencerPitchBendValueInput' + stepSequenceMonth}
                                                        max="16383"
                                                        min="0"
                                                        onChange={(e) => updatePitchbendValue(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.bend} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {(event.event === '2fdb9151-68ad-46f7-b11e-adbb15d12a09') && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <input className={'stepSequencerPitchBendValueInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventProgramChange(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.program} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {((event.event === '9a141aff-eea8-46c4-8650-679d9218fb08') || (event.event === 'd1c6b635-d413-40aa-97dd-7d795230d5f4')) && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <p className={'stepSequencerEventValue' + stepSequenceMonth}>{convertPitchValue(event.note)}</p>
                                                    <input className={'stepSequencerEventNoteInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventNoteNote(e.target.value, event.id)}
                                                        type="number" 
                                                        value={event.note} />
                                                    <input className={'stepSequencerEventNoteParameterValue' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventNotePressure(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.pressure} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {(event.event === '884e57d3-f5a5-4192-b640-78891802867b') && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <input className={'stepSequencerEventControllerInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateController(e.target.value, event.id)}
                                                        type="number" 
                                                        value={event.controller} />
                                                    <input className={'stepSequencerEventNoteParameterValue' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventValue(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.value} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {((event.event === '042b257f-f1de-488d-900b-6d7c49361748') || (event.event === '89265cc9-9ce5-4219-bfb6-371b18ed42b1') || (event.event === '4d7dd3e6-7ef9-4e0f-8e26-0b39bdbac59e') || (event.event === '2a3b9983-d175-4bde-aca9-63b70944ec7e') || (event.event === '96a94fa3-cf34-4ab5-8cb4-586b25e8b40c') || (event.event === 'babe6a4b-8e25-4fd2-acf5-2e7f9c52e4eb') || (event.event === '5138de25-1d5c-473e-8a68-ddbeadc32bd4') || (event.event === '598a5aaa-346c-4e2c-80ce-08cbcb1e7c24') || (event.event === 'ebb8da3b-fcf4-4747-809b-e3fd5c9e26fb') || (event.event === '15a9c413-3dbe-4890-bd52-287c2a48f615') || (event.event == '9434ea7e-6a63-423c-9be5-77584bd587e4') || (event.event === 'a97eee86-2a5e-47db-99b1-74b61bc994c1') || (event.event === '6eaceab3-35bb-49e2-ad82-5bd4c3a32679') || (event.event === 'cdd20c5c-f942-4f8f-a15f-a750ecfd957c') || (event.event === '3474f1bf-5aae-434e-ba95-102114de0dd2') || (event.event === '221e9b45-0ec8-421e-adb6-cfaf19b69610') || (event.event === 'eaf504e8-217f-4e76-b6cc-ba78ff99aba3') || (event.event === '5531a226-bc2c-4c60-9505-9b8da30b86c2') || (event.event === 'cb30f654-a1c1-4e76-b479-d41821ede969') || (event.event === '9390dbb8-efe9-4b41-adf3-47c6531f7aa1') || (event.event === 'f61546fe-fd2a-4c89-813c-44dde15e6aa2') || (event.event === '79d3c79f-6d9b-4eb1-ae78-51dd9362e21b') || (event.event === '752a2e67-911e-45b5-801d-0841c38cf8c2') || (event.event === '97fb8e80-b937-464d-8830-212dcac90675') || (event.event === '5ee455bb-dea9-4a3d-a6ee-c2a7866d8b8c') || (event.event === '1ab83a91-21b1-4d56-b333-3a59c4ade431') || (event.event === 'b64c45f7-cf57-4864-a07f-e8f82dbf63b1') || (event.event === 'faf99fca-87c1-4e8e-81f5-b0f14251db08') || (event.event === '4c64d103-e813-4c4a-80b5-01cd8186635c') || (event.event === 'e181eaf9-1b61-4e5b-8982-833fb9594529') || (event.event === '246e9232-3d6a-4352-8957-d0ff9c1c834e') || (event.event === '80e77d4b-c523-4393-a279-6d7b15e65d8a') || (event.event === 'c3b8b079-4994-480e-9b0a-8cbce11fba46') || (event.event === '206ff86e-6894-4b56-9f5b-f5387d18f2ea') || (event.event === '2517d341-7ae3-4dae-b866-49bd2fc9b21c') || (event.event === '269524b5-a240-42e5-abfe-bf074ab7cb11') || (event.event === 'e1568b69-6246-469f-9654-a398a1606ef9')) && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <input className={'stepSequencerPitchBendValueInput' + stepSequenceMonth}
                                                        max="127"
                                                        min="0"
                                                        onChange={(e) => updateEventValue(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.value} />
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                            {((event.event === 'a889cf3f-3986-46ef-9bb3-d4b42fc41fb0') || (event.event === '26a0ab85-b2cc-4442-84c0-bd30fb239869') || (event.event === '890d5a31-859b-4958-8eca-dd0b52f1fbec') || (event.event === 'f31779f1-2599-487b-8e96-5b0abd35394e') || (event.event === '75cf0bca-6196-4219-9eef-54272e8020a8') || (event.event === '44feabcb-b735-4980-a3fc-1e229b4bd115') || (event.event === '40fc271b-2b22-40ff-a43d-90404ff07c69') || (event.event === 'c3543d3c-ccc5-45e2-ac42-c62c8b364690')) && (
                                                <div className={'stepSequencerEventContainer' + track.active + ((parseInt(event.time.bar) === parseInt(currentPosition.measure.bar)) && (parseInt(event.time.beat) === parseInt(currentPosition.measure.beat)) && (parseInt(event.time.ticks) === parseInt(currentPosition.measure.ticks))) + stepSequenceMonth}
                                                    onClick={() => noteEditEventCurrentPosition(event.id)}>
                                                    <p className={'stepSequencerEventName' + stepSequenceMonth}>{event.name}</p>
                                                    <input className={'stepSequencerEventMidiChannelInput' + stepSequenceMonth} 
                                                        max="15"
                                                        min="0"
                                                        onChange={(e) => {updateTrackEventMIDIChannel(e.target.value, event.id)}}
                                                        type="number"
                                                        value={event.midiChannel}/>
                                                    <input className={'stepSequencerEventBarInput' + stepSequenceMonth}
                                                        max={sequence.duration.bar - 1}
                                                        min="1"
                                                        onChange={(e) => updateEventBarPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.bar}/>
                                                    <p className={'stepSequencerBarDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventBeatInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventBeatPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.beat}/>
                                                    <p className={'stepSequencerBeatDivider' + stepSequenceMonth}>.</p>
                                                    <input className={'stepSequencerEventTicksInput' + stepSequenceMonth} 
                                                        onChange={(e) => updateEventTicksPosition(e.target.value, event.id)}
                                                        type="number"
                                                        value={event.time.ticks}/>
                                                    <div className={'stepSequencerEventSwitch' + (event.value > 63) + stepSequenceMonth}
                                                        onClick={() => toggleEventSwitch(event.id)}>
                                                        {(event.value > 63) && (
                                                            <p>on</p>
                                                        )}
                                                        {(event.value < 63) && (
                                                            <p>off</p>
                                                        )}
                                                    </div>
                                                    <p className={'stepSequencerEventDeleteEvent' + stepSequenceMonth}
                                                        onClick={() => deleteEventAt(event.id)} >&#127303;</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className={'stepSequencerTracksNameAndControlledChangesStrip' + stepSequenceMonth}>
                            <input className={'stepSequencerTrackNameInput' + stepSequenceMonth}
                                onChange={(e) => updateTrackName(e.target.value)}
                                type="text"
                                value={sequence.tracks[activeTrack].name} />
                            <button className={'stepSequencerTrackOperatorsButton' + stepSequenceMonth}>continuous</button>
                            <button className={'stepSequencerTrackOperatorsButton' + stepSequenceMonth}>duplicate</button>
                            <button className={'stepSequencerTrackOperatorsButton' + stepSequenceMonth}>filter</button>
                            <button className={'stepSequencerTrackOperatorsButton' + stepSequenceMonth}>quantize</button>
                        </div>
                    </div>
                    <div className={'stepSequencerInputsControl' + stepSequenceMonth}>
                        <img className={'stepSequencerDeviceImage' + stepSequenceMonth}
                            src={sequence.tracks[activeTrack].image} />
                        <p className={'stepSequencerDeviceSelectLabel' + stepSequenceMonth}>device:</p>
                        <select className={'stepSequencerDeviceSelector' + stepSequenceMonth}
                            onChange={(e) => updateTrackDevice(e.target.value)}
                            value={sequence.tracks[activeTrack].device}>
                            {availableDevices.map(device => (
                                <option key={device.uuid} value={device.uuid}>{device.device}</option>
                            ))}
                        </select>
                        <p className={'stepSequencerCollectionSelectLabel' + stepSequenceMonth}>collection:</p>
                        <select className={'stepSequencerCollectionSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerBankSelectLabel' + stepSequenceMonth}>bank:</p>
                        <select className={'stepSequencerBankSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerPatchSelectLabel' + stepSequenceMonth}>patch:</p>
                        <select className={'stepSequencerPatchSelector' + stepSequenceMonth}></select>
                        <p className={'stepSequencerEventSelectLabel' + stepSequenceMonth}>event:</p>
                        <select className={'stepSequencerEventSelector' + stepSequenceMonth}
                            onChange={(e) => updateCurrentMidiEvent(e.target.value)}
                            value={currentMidiEvent}>
                            {midiEvents.map(event => (
                                <option key={event.uuid} value={event.uuid}>{event.name}</option>
                            ))}
                        </select>
                        <button className={'stepSequencerAddEventButton' + stepSequenceMonth}
                            onClick={() => addSelectedEvent()}>add</button>
                        <button className={'stepSequencerRepeatButton' + stepSequenceMonth}
                            onClick={() => openRepeatEventsModal()}>repeat</button>
                    </div>
                    <div className={'stepSequencerPluginsPanel' + stepSequenceMonth}>
                        <p className={'stepSequencerMidiFXPanelLabel' + stepSequenceMonth}>MIDI FX</p>
                        <p className={'stepSequencerMidiFXSelectorLabel' + stepSequenceMonth}>fx:</p>
                        <select className={'stepSequencerMidiFXSelector' + stepSequenceMonth}>
                            <option>midi delay</option>
                            <option>midi smear</option>
                            <option>midi gliss</option>
                            <option>midi glitch</option>
                        </select>
                        <p className={'stepSequencerMidiFXPresetSelectorLabel' + stepSequenceMonth}>preset:</p>
                        <select className={'stepSequencerMidiFXPresetSelector' + stepSequenceMonth}>
                            <option>hard quantize verb</option>
                            <option>feedback delay</option>
                            <option>reverse delay</option>
                        </select>
                        <button className={'stepSequencerMidiFXAddButton' + stepSequenceMonth}
                            onClick={() => openMIDIFxModal()}>add</button>
                    </div>
                </div>
            </div>
           <div className={'stepSequencerSaveAsDialogDiv' + saveAsDialogStatus + stepSequenceMonth}>
                <p>save as</p>
                <input className={'stepSequencerSaveAsInput' + stepSequenceMonth}
                    id="saveAsInput"
                    onChange={(e) => updateChangeAsName(e.target.value)}
                    placeholder={'copy of ' + sequence.header.name}
                    value={saveAsName} />
                <div className={'stepSequencerSaveAsButtonsDiv' + stepSequenceMonth}>
                    <button className={'stepSequencerSaveAsButtons' + stepSequenceMonth}
                        onClick={() => submitSaveAsDialog(saveAsName)}>submit</button>
                    <button className={'stepSequencerSaveAsButtons' + stepSequenceMonth}
                        onClick={() => cancelSaveAsDialog()}>cancel</button>
                </div>
            </div>
            <div className={'stepSequencerLoadModal' + stepSequencerLoadModalState + stepSequenceMonth}>
                <div className={'stepSequencerLoadContainer' + stepSequenceMonth}>
                    <p className={'stepSequencerLoadTitle' + stepSequenceMonth}>Load Sequence</p>
                    <select className={'stepSequencerLoadSelector' + stepSequenceMonth}>
                    </select>
                    <button className={'stepSequencerLoadLoadButton' + stepSequenceMonth}>load</button>
                    <button className={'stepSequencerLoadCancelButton' + stepSequenceMonth}
                        onClick={() => cancelPatchLoad()}>cancel</button>
                </div>
            </div>
            <div className={'stepSequencerSaveAsDialogDiv' + trackGuardrailState + stepSequenceMonth}>
                <p>permanently delete track: {sequence.tracks[activeTrack].name}?</p>
                <br></br>
                <br></br>
                <div className={'stepSequencerSaveAsButtonsDiv' + stepSequenceMonth}>
                    <button className={'stepSequencerSaveAsButtons' + stepSequenceMonth}
                        onClick={() => postGuardrailTrackDelete()}>delete</button>
                    <button className={'stepSequencerSaveAsButtons' + stepSequenceMonth}
                        onClick={() => cancelTrackDelete()}>cancel</button>
                </div>
            </div>
            <div className={'stepSequencerEventRepeatModal' + repeatModalState + stepSequenceMonth}>
                <p className={'stepSequencerEventRepeaterTrackLabel' + stepSequenceMonth}>Copy Events - track: {sequence.tracks[activeTrack].name}</p>
                <p className={'stepSequencerEventRepeaterFromLabel' + stepSequenceMonth}>from</p>
                <input className={'stepSequencerEventRepeaterFromBarInput' + stepSequenceMonth}
                    max={repeaterSettings.to.bar}
                    min="1"
                    onChange={(e) => updateRepeaterFromBar(e.target.value)}
                    type="number"
                    value={repeaterSettings.from.bar} />
                <p className={'stepSequencerEventRepeaterBarDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterFromBeatInput' + stepSequenceMonth}
                    onChange={(e) => updateRepeaterFromBeat(e.target.value)}
                    type="number"
                    value={repeaterSettings.from.beat} />
                <p className={'stepSequencerEventRepeaterBeatDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterFromTicksInput' + stepSequenceMonth}
                    onChange={(e) => updateRepeaterFromTicks(e.target.value)}
                    type="number"
                    value={repeaterSettings.from.ticks} />
                <p className={'stepSequencerEventRepeaterToLabel' + stepSequenceMonth}>to</p>
                <input className={'stepSequencerEventRepeaterToBarInput' + stepSequenceMonth}
                    max={sequence.duration.bar}
                    min={repeaterSettings.from.bar}
                    onChange={(e) => updateRepeaterToBar(e.target.value)}
                    type="number"
                    value={repeaterSettings.to.bar} />
                <p className={'stepSequencerEventRepeaterToBarDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterToBeatInput' + stepSequenceMonth}
                    onChange={(e) => updateRepeaterToBeat(e.target.value)}
                    type="number"
                    value={repeaterSettings.to.beat} />
                <p className={'stepSequencerEventRepeaterToBeatDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterToTicksInput' + stepSequenceMonth}
                    onChange={(e) => updateRepeaterToTicks(e.target.value)}
                    type="number"
                    value={repeaterSettings.to.ticks} />
                <p className={'stepSequencerEventRepeaterStartingAtLabel' + stepSequenceMonth}>starting at</p>
                <input className={'stepSequencerEventRepeaterStartBarInput' + stepSequenceMonth}
                    max={(sequence.duration.bar - 1)}
                    min="1"
                    onChange={(e) => updateStartingAtBar(e.target.value)}
                    type="number"
                    value={repeaterSettings.start.bar} />
                <p className={'stepSequencerEventRepeaterStartBarDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterStartBeatInput' + stepSequenceMonth}
                    onChange={(e) => updateStartingAtBeat(e.target.value)}
                    type="number"
                    value={repeaterSettings.start.beat} />
                <p className={'stepSequencerEventRepeaterStartBeatDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerEventRepeaterStartTicksInput' + stepSequenceMonth}
                    onChange={(e) => updateStartAtTicks(e.target.value)}
                    type="number"
                    value={repeaterSettings.start.ticks} />
                <p className={'stepSequencerEventRepeaterNumberOfLabel' + stepSequenceMonth}>number of times</p>
                <input className={'stepSequencerEventRepeaterNumberOfInput' + stepSequenceMonth}
                    min="1"
                    onChange={(e) => updateRepeaterNumberOfTimes(e.target.value)}
                    type="number"
                    value={repeaterSettings.numberOfTimes} />
                <p className={'stepSequencerEventRepeaterNumberOfTimeTimes' + stepSequenceMonth}>x</p>
                <button className={'stepSequencerRepeaterSubmitButton' + stepSequenceMonth}
                    onClick={() => copySelectionTo()}>submit</button>
                <button className={'stepSequencerRepeaterCancelButton' + stepSequenceMonth}
                    onClick={() => cancelRepeaterModal()}>cancel</button>
            </div>
            <div className={'stepSequencerAddMIDIFxModal' + addFxModalState + stepSequenceMonth}>
                <p className={'stepSequencerAddMIDIFXModalTitle' + stepSequenceMonth}>Add MIDI FX Track for {sequence.tracks[activeTrack].name}</p>
                <p className={'stepSequencerAddMIDIFXTypeIdentifier' + stepSequenceMonth}>MIDI FX: MIDI Delay</p>
                <p className={'stepSequencerAddMIDIFXPresetIdentifier' + stepSequenceMonth}>Preset: hard quantize verb</p>
                <p className={'stepSequencerFXTrackNameLabel' + stepSequenceMonth}>Auto-generated FX track:</p>
                <input className={'stepSequencerFXTrackNameInput' + stepSequenceMonth}
                    placeholder={sequence.tracks[activeTrack].name + ' hard quantize verb'}
                    type="text" />
                <button className={'stepSequencerRepeaterSubmitButton' + stepSequenceMonth}>submit</button>
                <button className={'stepSequencerRepeaterCancelButton' + stepSequenceMonth}
                    onClick={() => cancelMidiFXModal()}>cancel</button>
            </div>
            <div className={'stepSequencerRitAccelModal' + ritAccelModalState + stepSequenceMonth}>
                <p className={'stepSequencerRitAccelTitle' + stepSequenceMonth}>tempo rit./accel.</p>
                <p className={'stepSequencerRitAccelStartingTempoLabel' + stepSequenceMonth}>starting tempo:</p>
                {(ritAccelParams.from.note === 'quarter') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        onClick={() => cycleRitAccelNoteheadFrom('quarter')}
                                    src={quarterNote} />
                )}
                {(ritAccelParams.from.note === 'dottedQuarter') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        style={{display: "flex"}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                            onClick={() => cycleRitAccelNoteheadFrom('dottedQuarter')} 
                            src={quarterNote} />
                            <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'halfNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        onClick={() => cycleRitAccelNoteheadFrom('halfNote')}
                        src={halfNote} />
                )}
                {(ritAccelParams.from.note === 'dottedHalf') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedHalf')}
                            src={halfNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'wholeNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('wholeNote')}
                        src={wholeNote} />
                )}
                {(ritAccelParams.from.note === 'dottedWhole') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedWhole')}
                            src={wholeNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'doubleWholeNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom2' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('doubleWholeNote')}
                        src={doubleWholeNote} />
                )}
                {(ritAccelParams.from.note === 'oneHundredTwentyEighthNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('oneHundredTwentyEighthNote')}
                        src={oneHundredTwentyEighthNote} />
                )}
                {(ritAccelParams.from.note === 'dottedOneHundredTwentyEighthNote') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedOneHundredTwentyEighthNote')}
                            src={oneHundredTwentyEighthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'sixtyFourthNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('sixtyFourthNote')}
                        src={sixtyfourthNote} />
                )}
                {(ritAccelParams.from.note === 'dottedSixtyFourthNote') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedSixtyFourthNote')}
                            src={sixtyfourthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'thirtySecondNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('thirtySecondNote')}
                        src={thirtySecondNote} />
                )}
                {(ritAccelParams.from.note === 'dottedThirtySecondNote') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedThirtySecondNote')}
                            src={thirtySecondNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'sixteenthNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('sixteenthNote')}
                        src={sixteenthNote} />
                )}
                {(ritAccelParams.from.note === 'dottedSixteenthNote') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedSixteenthNote')}
                            src={sixteenthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.from.note === 'eighthNote') && (
                    <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadFrom('eighthNote')}
                        src={eighthNote} />
                )}
                {(ritAccelParams.from.note === 'dottedEighthNote') && (
                    <div className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteFrom' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadFrom('dottedEighthNote')}
                            src={eighthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                <p className={'stepSequencerTempoEqualsFrom' + stepSequenceMonth}>=</p>
                <input className={'stepSequencerTempoFromInput' + stepSequenceMonth} 
                    max="1000.000"
                    min="0.001"
                    onChange={(e) => updateRitAccelTempoFrom(e.target.value)}
                    step="0.001"
                    type="number"
                    value={(Math.round(ritAccelParams.from.tempo * 1000) / 1000)}
                    />
                <input className={'stepSequencerRitAccelFromBarInput' + stepSequenceMonth}
                    max={ritAccelParams.to.time.bar}
                    min="1"
                    onChange={(e) => updateRitAccelFromBar(e.target.value)}
                    type="number"
                    value={ritAccelParams.from.time.bar} />
                <p className={'stepSequencerRitAccelFromBarDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerRitAccelFromBeatInput' + stepSequenceMonth}
                    onChange={(e) => updateRitAccelFromBeat(e.target.value)}
                    type="number"
                    value={ritAccelParams.from.time.beat} />
                <p className={'stepSequencerRitAccelFromBeatDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerRitAccelFromTicksInput' + stepSequenceMonth}
                    onChange={(e) => updateRitAccelFromTicks(e.target.value)}
                    type="number"
                    value={ritAccelParams.from.time.ticks} />
                <p className={'stepSequencerRitAccelEndingingTempoLabel' + stepSequenceMonth}>ending tempo:</p>
                {(ritAccelParams.to.note === 'quarter') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        onClick={() => cycleRitAccelNoteheadTo('quarter')}
                                    src={quarterNote} />
                )}
                {(ritAccelParams.to.note === 'dottedQuarter') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        style={{display: "flex"}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                            onClick={() => cycleRitAccelNoteheadTo('dottedQuarter')} 
                            src={quarterNote} />
                            <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'halfNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        onClick={() => cycleRitAccelNoteheadTo('halfNote')}
                        src={halfNote} />
                )}
                {(ritAccelParams.to.note === 'dottedHalf') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedHalf')}
                            src={halfNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'wholeNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('wholeNote')}
                        src={wholeNote} />
                )}
                {(ritAccelParams.to.note === 'dottedWhole') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedWhole')}
                            src={wholeNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'doubleWholeNote') && (
                    <img className={'stepSequencerRitAccelNoteTo2' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('doubleWholeNote')}
                        src={doubleWholeNote} />
                )}
                {(ritAccelParams.to.note === 'oneHundredTwentyEighthNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('oneHundredTwentyEighthNote')}
                        src={oneHundredTwentyEighthNote} />
                )}
                {(ritAccelParams.to.note === 'dottedOneHundredTwentyEighthNote') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedOneHundredTwentyEighthNote')}
                            src={oneHundredTwentyEighthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'sixtyFourthNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('sixtyFourthNote')}
                        src={sixtyfourthNote} />
                )}
                {(ritAccelParams.to.note === 'dottedSixtyFourthNote') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedSixtyFourthNote')}
                            src={sixtyfourthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'thirtySecondNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('thirtySecondNote')}
                        src={thirtySecondNote} />
                )}
                {(ritAccelParams.to.note === 'dottedThirtySecondNote') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedThirtySecondNote')}
                            src={thirtySecondNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'sixteenthNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('sixteenthNote')}
                        src={sixteenthNote} />
                )}
                {(ritAccelParams.to.note === 'dottedSixteenthNote') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedSixteenthNote')}
                            src={sixteenthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                {(ritAccelParams.to.note === 'eighthNote') && (
                    <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                        onClick={() => cycleRitAccelNoteheadTo('eighthNote')}
                        src={eighthNote} />
                )}
                {(ritAccelParams.to.note === 'dottedEighthNote') && (
                    <div className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth}
                        style={{display: 'flex'}}>
                        <img className={'stepSequencerRitAccelNoteTo' + stepSequenceMonth} 
                            onClick={() => cycleRitAccelNoteheadTo('dottedEighthNote')}
                            src={eighthNote} />
                        <p style={{color: '#000', fontSize: '48px', transform: 'translateX(-35px) translateY(40px)'}}>.</p>
                    </div>
                )}
                <p className={'stepSequencerTempoEqualsTo' + stepSequenceMonth}>=</p>
                <input className={'stepSequencerTempoToInput' + stepSequenceMonth} 
                    max="1000.000"
                    min="0.001"
                    onChange={(e) => updateRitAccelTempoTo(e.target.value)}
                    step="0.001"
                    type="number"
                    value={(Math.round(ritAccelParams.to.tempo * 1000) / 1000)}
                    />
                <input className={'stepSequencerRitAccelToBarInput' + stepSequenceMonth}
                    max={sequence.duration.bar}
                    min="1"
                    onChange={(e) => updateRitAccelToBar(e.target.value)}
                    type="number"
                    value={ritAccelParams.to.time.bar} />
                <p className={'stepSequencerRitAccelToBarDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerRitAccelToBeatInput' + stepSequenceMonth}
                    onChange={(e) => updateRitAccelToBeat(e.target.value)}
                    type="number"
                    value={ritAccelParams.to.time.beat} />
                <p className={'stepSequencerRitAccelToBeatDivider' + stepSequenceMonth}>.</p>
                <input className={'stepSequencerRitAccelToTicksInput' + stepSequenceMonth}
                    onChange={(e) => updateRitAccelToTicks(e.target.value)}
                    type="number"
                    value={ritAccelParams.to.time.ticks} />
                <div className={'stepSequencerRitAccelCurveDisplayDiv' + stepSequenceMonth}>
                    <svg height="100%"
                        width="100%">
                        <path className={'stepSequencerTempoCurvePath' + stepSequenceMonth}
                            d={"M 0 " + absoluteTempoPosition(ritAccelParams.from.note, ritAccelParams.from.tempo) + "  C " + curveX1Position(ritAccelParams.curve[0]) + " " + curveY1Position(ritAccelParams.curve[1]) + " " + curveX2Position(ritAccelParams.curve[0]) + " " + curveY2Position(ritAccelParams.curve[1]) + " 350 " + absoluteTempoPosition(ritAccelParams.to.note, ritAccelParams.to.tempo)}>
                        </path>
                    </svg>
                </div>
                <p className={'stepSequencerRitAccelXValLabel' + stepSequenceMonth}>X:</p>
                <input className={'stepSequencerRitAccelCurveXInput' + stepSequenceMonth}
                    max="10"
                    min="-10"
                    onChange={(e) => updateRitAccelCurveX(e.target.value)}
                    step="0.1"
                    type="number"
                    value={ritAccelParams.curve[0]}/>
                <p className={'stepSequencerRitAccelYValLabel' + stepSequenceMonth}>Y:</p>
                <input className={'stepSequencerRitAccelCurveYInput' + stepSequenceMonth}
                    max="10"
                    min="-10"
                    onChange={(e) => updateRitAccelCurveY(e.target.value)}
                    step="0.1"
                    type="number"
                    value={ritAccelParams.curve[1]}/>
                <button className={'stepSequencerRepeaterSubmitButton' + stepSequenceMonth}
                    onClick={() => executeTempoRitAccel()}>submit</button>
                <button className={'stepSequencerRepeaterCancelButton' + stepSequenceMonth}
                    onClick={() => cancelRitAccelModal()}>cancel</button>
            </div>
        </div>
    )
}

export default StepSequencer;