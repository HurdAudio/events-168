import React, { useState } from 'react';


function midiConnection(midiAccess) {
    
    let outputs, inputs, currentOutput, currentMidiChannel;
    let midiConnections = {};
    console.log(midiAccess);
    
    let inputArray = [];
    let outputArray = [];

    inputs = Array.from(midiAccess.inputs.values());
    outputs = Array.from(midiAccess.outputs.values());

    for (const output of outputs) {
        outputArray.push(output);
    }
    for (const input of inputs) {
        inputArray.push(input);
    }

    console.log(outputArray);

    currentMidiChannel = 0;
    currentOutput = outputArray[0];
    return({
        inputs: inputArray,
        outputs: outputArray,
        currentMidiChannel: currentMidiChannel,
        currentOutput: currentOutput
    });
    
}

export default midiConnection;