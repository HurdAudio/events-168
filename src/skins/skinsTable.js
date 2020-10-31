import React, { useState } from 'react';
import midi5pin from '../img/midi5pin.svg';
import redMIDI from '../img/redMIDI.png';
import vectorMidiPng from '../img/vectorMidiPng.png';
import febaMidi_0 from '../img/febaMidi_0.png';
import midiKeys from '../img/midiKeys.png';
import bleu_midi_icon from '../img/bleu_midi_icon.png';
import midiPortCropped1 from '../img/midiPortCropped1.jpg';
import keyboard2779734960720 from '../img/keyboard2779734960720.png';
import akaiProIcon from '../img/akaiProIcon.png';


function Table(access) {
    
    return({
        nubassEditor: {
            available: [
                {
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif'
                },
                {
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif'
                },
                {
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif'
                },
                {
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif'
                },
                {
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif'
                },
                {
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif'
                }
            ],
            january: [ 31,
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/FrigidBlueGraywolf-small.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                },
                { 
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/loading-animations-preloader-gifs-ui-ux-effects-14.gif' 
                },
                { 
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/bea83775357853.5c4a1808c8a7b.gif' 
                } 
             ],
            february: [ 29,
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                },
                { 
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/sockhead.gif' 
                },
                { 
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/vy7OWPZ.gif' 
                },
                { 
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/february/loadingModelRunway.gif' 
                } 
            ],
            march: [31],
            april: [30],
            may: [31],
            june: [30],
            july: [31],
            august: [31],
            september: [30],
            october: [31],
            november: [30],
            december: [31]
        },
        fmVolcaEditor: {
            available: [
                {
                    skin: '_JanuaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif'
                },
                {
                    skin: '_JanuaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif'
                },
                {
                    skin: '_JanuaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif'
                },
                {
                    skin: '_FebruaryA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif'
                },
                {
                    skin: '_FebruaryB',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif'
                },
                {
                    skin: '_FebruaryC',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif'
                },
                {
                    skin: '_MarchA',
                    spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/march/spinner/heartBeater.gif'
                }
            ],
            january: [ 31,
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif'
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' 
                  },
                  { 
                      skin: '_JanuaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' 
                  } 
            ],
            february: [ 29,
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryC',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryA',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  },
                  { 
                      skin: '_FebruaryB',
                      spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' 
                  } 
            ],
            march: [31],
            april: [30],
            may: [31],
            june: [30],
            july: [31],
            august: [31],
            september: [30],
            october: [31],
            november: [30],
            december: [31]
        },
        landing: {
            available: [
                {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: midiPortCropped1,
                    skin: '_MarchA'          
                },
                        {
                    logo: keyboard2779734960720,
                    skin: '_MarchB'
                },
                        {
                    logo: akaiProIcon,
                    skin: '_MarchC'
                }
                       ],
            january: [ 31,      
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: midi5pin,
                    skin: '_JanuaryA'
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                },
                        {
                    logo: redMIDI,
                    skin: '_JanuaryB'            
                },
                        {
                    logo: vectorMidiPng,
                    skin: '_JanuaryC'           
                }
            ],
            february: [ 29,
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: midiKeys,
                    skin: '_FebruaryB'           
                },
                        {
                    logo: febaMidi_0,
                    skin: '_FebruaryA'           
                },
                        {
                    logo: bleu_midi_icon,
                    skin: '_FebruaryC'          
                }
            ],
            march: [31],
            april: [30],
            may: [31],
            june: [30],
            july: [31],
            august: [31],
            september: [30],
            october: [31],
            november: [30],
            december: [31]
        },
        login: {
            available: [
                {
                    skin: '_JanuaryA'
                },
                        {
                    skin: '_JanuaryB'            
                },
                        {
                    skin: '_JanuaryC'           
                },
                        {
                    skin: '_FebruaryA'           
                },
                        {
                    skin: '_FebruaryB'           
                },
                        {
                    skin: '_FebruaryC'          
                },
                        {
                    skin: '_MarchA'
                },
                        {
                    skin: '_MarchB'
                }
                       ],
            january: [ 31, 
                      { 
                          skin: '_JanuaryC' 
                }, 
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryC' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryA' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { 
                          skin: '_JanuaryB' 
                },
                      { skin: '_JanuaryC' 
                } 
            ],
            february: [ 29,
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryA' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryB' 
                },
                       { 
                           skin: '_FebruaryC' 
                },
                       { 
                           skin: '_FebruaryB' 
                } 
            ],
            march: [31],
            april: [30],
            may: [31],
            june: [30],
            july: [31],
            august: [31],
            september: [30],
            october: [31],
            november: [30],
            december: [31]
        },
        userHub: {
            available: [{ logo: midi5pin, skin: '_JanuaryA' }, { logo: redMIDI, skin: '_JanuaryB' }, { logo: vectorMidiPng, skin: '_JanuaryC' }, { logo: febaMidi_0, skin: '_FebruaryA' }, { logo: midiKeys, skin: '_FebruaryB' }, { logo: bleu_midi_icon, skin: '_FebruaryC' }, { logo: midiPortCropped1, skin: '_MarchA' }],
            january: [ 31,
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: midi5pin, skin: '_JanuaryA' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: redMIDI, skin: '_JanuaryB' },
              { logo: vectorMidiPng, skin: '_JanuaryC' },
              { logo: vectorMidiPng, skin: '_JanuaryC' } 
            ],
            february: [ 29,
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: febaMidi_0, skin: '_FebruaryA' },
              { logo: midiKeys, skin: '_FebruaryB' },
              { logo: bleu_midi_icon, skin: '_FebruaryC' } 
            ],
            march: [31],
            april: [30],
            may: [31],
            june: [30],
            july: [31],
            august: [31],
            september: [30],
            october: [31],
            november: [30],
            december: [31]
        }
    });
}

export default Table;