import fs from 'fs'
import data from './iris.txt'

const labelCol = 4
let dataArray = []
let testDataArray = []
let distinctClasses = []

let text = fs.readFileSync('./iris.txt', 'utf-8')
let lines = text.split(/\r?\n/)
let n = lines.length

for(let line in lines){
    let tokens = lines[line].split(",")
    const label = tokens.pop() // could have user specify the label column
    for(let token in tokens){
        tokens[token] = parseFloat(tokens[token])
    }
    tokens.push(label)
    dataArray.push(tokens)
}

function shuffleRows(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // while elements remain to be shuffled
    while( 0 !== currentIndex){
        // Pick remaining element ...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap with current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// randomnly divides a file into test and train data (33/66 split) 
function splitDataset() {
    // get length of dataset
    let noTrainingRows = Math.round(dataArray.length * 2/3);
    let noTestRows = dataArray.length - noTrainingRows;

    dataArray = shuffleRows(dataArray);

    const testData = dataArray.splice(0, noTestRows);

    console.log("New dataarray")
    console.log(dataArray)

    console.log("New test set")
    console.log(testData)
}

// now need to split into classes & numbers
function getNumbers() {
    return dataArray.map((d) => d.slice(0, 6))
}

function getClasses() {
    return dataArray.map((d) => d[6])
}

function getDistinctClasses() {
    for(let row in dataArray) {
        if(!distinctClasses.includes(dataArray[row][6])){
            distinctClasses.push(dataArray[row][6])
        }
    }

    return distinctClasses
}

console.log(getNumbers())

console.log(getClasses())

console.log(getDistinctClasses())

splitDataset()