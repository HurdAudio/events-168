'use strict';
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('midi_manager_patches').del()
    .then(function () {
      // Inserts seed entries
      return knex('midi_manager_patches').insert([
        {
            uuid: 'e29a5019-4931-46f6-aff9-8c4842d5440c',
            user_preset: {
                "inputs": [
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Korg SV-1",
                        "deviceUuid": "13cb42f1-451f-4906-95ea-a135885a1133",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "SV-1"
                    },
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Espressive I Osmose",
                        "deviceUuid": "7d35e14a-9f36-425a-a8c4-be778de841f3",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Osmose"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Arturia Microfreak",
                        "deviceUuid": "5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Microfreak"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Tubbutec µTune",
                        "deviceUuid": "72e96c46-809c-408d-8c5d-d44e450f3421",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "µTune"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Korg Kaoss Pad 3",
                        "deviceUuid": "88947b9b-9c2a-45c6-944c-05c4cbff494d",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Kaoss Pad 3"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "<--empty-->"
                    }
                ],
                "outputs": [
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "Volca FM 1"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Volca FM 2"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Volca FM 3"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "Volca FM 4"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Nubass",
                        "deviceUuid": "bda73d0e-c18c-472e-add6-1e1a4f123949",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Volca Nubass"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Drum",
                        "deviceUuid": "3abd3875-667e-4098-abdb-12910b43ba2f",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "Volca Drum"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Tasty Chips GR-1",
                        "deviceUuid": "2ce7d861-1f69-4294-9e0b-cf537b950e04",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "GR-1"
                    },
                    {
                        "activeReciever": false,
                        "channel": 0,
                        "device": "Arturia Microfreak",
                        "deviceUuid": "5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "Microfreak"
                    }
                ],
                "name": "default"
            },
            created_at: new Date('2020-06-14 13:05:00.000 UTC'),
            updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        },
          {
            uuid: '9c97ae5d-c3da-4b88-8336-275e2665e768',
            user_preset: {
                "inputs": [
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Korg SV-1",
                        "deviceUuid": "13cb42f1-451f-4906-95ea-a135885a1133",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "SV-1"
                    },
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Espressive I Osmose",
                        "deviceUuid": "7d35e14a-9f36-425a-a8c4-be778de841f3",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Osmose"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Arturia Microfreak",
                        "deviceUuid": "5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Microfreak"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Tubbutec µTune",
                        "deviceUuid": "72e96c46-809c-408d-8c5d-d44e450f3421",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "µTune"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Korg Kaoss Pad 3",
                        "deviceUuid": "88947b9b-9c2a-45c6-944c-05c4cbff494d",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Kaoss Pad 3"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "<--empty-->"
                    }
                ],
                "outputs": [
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "Volca FM 1"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Volca FM 2"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Volca FM 3"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "Volca FM 4"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Nubass",
                        "deviceUuid": "bda73d0e-c18c-472e-add6-1e1a4f123949",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Volca Nubass"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Drum",
                        "deviceUuid": "3abd3875-667e-4098-abdb-12910b43ba2f",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "Volca Drum"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Bastil Thyme",
                        "deviceUuid": "fc30dcf7-aeba-4a66-8630-0ec44622231d",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "Thyme"
                    },
                    {
                        "activeReciever": false,
                        "channel": 0,
                        "device": "Eventide Space",
                        "deviceUuid": "afc43874-1311-471c-871d-ac2243d014c9",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "Space"
                    }
                ],
                "name": "volca setup"
            },
            created_at: new Date('2020-06-14 13:05:00.000 UTC'),
            updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        },
          {
            uuid: 'daf7c45f-10c2-4e4d-b3d3-ed9f7cb15b3b',
            user_preset: {
                "inputs": [
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Korg SV-1",
                        "deviceUuid": "13cb42f1-451f-4906-95ea-a135885a1133",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "SV-1"
                    },
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Espressive I Osmose",
                        "deviceUuid": "7d35e14a-9f36-425a-a8c4-be778de841f3",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Osmose"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Korg Kaoss Pad 3",
                        "deviceUuid": "88947b9b-9c2a-45c6-944c-05c4cbff494d",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Kaoss Pad 3"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "<--empty-->"
                    }
                ],
                "outputs": [
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "Volca FM 1"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca FM",
                        "deviceUuid": "e3bfacf5-499a-4247-b512-2c4bd15861ad",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Volca FM 2"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "M-Audio Venom",
                        "deviceUuid": "c725bfdd-8829-477d-a0dc-d9b95ddc2189",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Venom"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Tubbutec µTune",
                        "deviceUuid": "72e96c46-809c-408d-8c5d-d44e450f3421",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "µTune"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Nubass",
                        "deviceUuid": "bda73d0e-c18c-472e-add6-1e1a4f123949",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Volca Nubass"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Drum",
                        "deviceUuid": "3abd3875-667e-4098-abdb-12910b43ba2f",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "Volca Drum"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Bastil Thyme",
                        "deviceUuid": "fc30dcf7-aeba-4a66-8630-0ec44622231d",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "Thyme"
                    },
                    {
                        "activeReciever": false,
                        "channel": 0,
                        "device": "Eventide Space",
                        "deviceUuid": "afc43874-1311-471c-871d-ac2243d014c9",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "Space"
                    }
                ],
                "name": "live rig"
            },
            created_at: new Date('2020-06-14 13:05:00.000 UTC'),
            updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        },
          {
            uuid: '63f908f1-55cb-449b-ad7a-558d03a2f31f',
            user_preset: {
                "inputs": [
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Korg SV-1",
                        "deviceUuid": "13cb42f1-451f-4906-95ea-a135885a1133",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "SV-1"
                    },
                    {
                        "channel": 0,
                        "controller": true,
                        "device": "Espressive I Osmose",
                        "deviceUuid": "7d35e14a-9f36-425a-a8c4-be778de841f3",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Osmose"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Arturia Microfreak",
                        "deviceUuid": "5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Microfreak"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Tubbutec µTune",
                        "deviceUuid": "72e96c46-809c-408d-8c5d-d44e450f3421",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "µTune"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "Korg Kaoss Pad 3",
                        "deviceUuid": "88947b9b-9c2a-45c6-944c-05c4cbff494d",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "Kaoss Pad 3"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "<--empty-->"
                    },
                    {
                        "channel": 0,
                        "controller": false,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "<--empty-->"
                    }
                ],
                "outputs": [
                    {
                        "activeReciever": false,
                        "channel": 0,
                        "device": "Tasty Chips GR-1",
                        "deviceUuid": "2ce7d861-1f69-4294-9e0b-cf537b950e04",
                        "hardwareIn": "Alyseum U3-88c A Port 1",
                        "label": "GR-1"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Bastil Thyme",
                        "deviceUuid": "fc30dcf7-aeba-4a66-8630-0ec44622231d",
                        "hardwareIn": "Alyseum U3-88c A Port 2",
                        "label": "Thyme"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Eventide Space",
                        "deviceUuid": "afc43874-1311-471c-871d-ac2243d014c9",
                        "hardwareIn": "Alyseum U3-88c A Port 3",
                        "label": "Space"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Arturia Microfreak",
                        "deviceUuid": "5e3a4543-97c4-43eb-b1a0-b90a1ca13ffe",
                        "hardwareIn": "Alyseum U3-88c A Port 4",
                        "label": "Microfreak"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg SV-1",
                        "deviceUuid": "13cb42f1-451f-4906-95ea-a135885a1133",
                        "hardwareIn": "Alyseum U3-88c A Port 5",
                        "label": "SV-1"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "Korg Volca Drum",
                        "deviceUuid": "3abd3875-667e-4098-abdb-12910b43ba2f",
                        "hardwareIn": "Alyseum U3-88c A Port 6",
                        "label": "Volca Drum"
                    },
                    {
                        "activeReciever": true,
                        "channel": 0,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 7",
                        "label": "<--empty-->"
                    },
                    {
                        "activeReciever": false,
                        "channel": 0,
                        "device": "no device",
                        "deviceUuid": "0",
                        "hardwareIn": "Alyseum U3-88c A Port 8",
                        "label": "<--empty-->"
                    }
                ],
                "name": "tasty chips gr-1 centric"
            },
            created_at: new Date('2020-06-14 13:05:00.000 UTC'),
            updated_at: new Date('2020-06-14 13:05:00.000 UTC')
        }
      ]);
    });
};
