'use strict';

function randomizeArray(arr, days) {
    const randomShuffle = Math.floor(Math.random() * 10000) + 4500;
    let index1, index2;
    
    for (let i = 0; i < randomShuffle; i++) {
        index1 = Math.floor(Math.random() * arr.length);
        index2 = Math.floor(Math.random() * arr.length);
        if (index1 !== index2) {
            [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
        }
    }
    if (arr.length !== days) {
        return 'error';
    } else {
        arr.unshift(days);
        return arr;
    }
}


//const days = 31;
//
//let arr = [{ skin: '_JanuaryA'}];
//
//for (let i = 0; i < 10; i++) {
//    arr.push({ skin: '_JanuaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/smile_loader_by_gleb.gif' });
//    arr.push({ skin: '_JanuaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/january/spinner/material-preloader.gif' });
//    arr.push({ skin: '_JanuaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/spinners/january/giphy-janb.gif' });
//}

const days = 29

let arr = [];

for (let i = 0; i < 9; i++) {
    arr.push({ skin: '_FebruaryA', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Snake_04.gif' });
}
for (let i = 0; i < 10; i++) {
    arr.push({ skin: '_FebruaryB', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/Animated-Loading-%C3%97-1.gif' });
    arr.push({ skin: '_FebruaryC', spinner: 'https://events-168-hurdaudio.s3.amazonaws.com/volcaFMEditor/february/spinner/hexwave.gif' });
}

//const days = 31;
//
//let arr = ['_MarchA'];
//
//for (let i = 0; i < 10; i++) {
//    arr.push('_MarchA');
//    arr.push('_MarchB');
//    arr.push('_MarchC');
//}



console.log(randomizeArray(arr, days));