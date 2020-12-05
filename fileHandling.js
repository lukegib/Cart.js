import fs from 'fs';

let distinctClasses = [];
let totalColumns = 0;
let classColumn = 0; 

function convertFileIntoArray(file){
    const text = fs.readFileSync(file, 'utf-8')
    const lines = text.split(/\r?\n/)

    let dataArray = [];

    for(let line in lines){
        let tokens = lines[line].split(",")
        const label = tokens.pop() // assuming label is last
        for(let token in tokens){
            tokens[token] = parseFloat(tokens[token]) // error check this
        }
        tokens.push(label.trim())
        dataArray.push(tokens)
    }

    return dataArray;
}

function numberClasses(dataset) {
    // loop through entire dataset last values
    for(let row in dataset){
        const rowClass = dataset[row].pop()
        dataset[row].push(distinctClasses.indexOf(rowClass))
    }

    return;
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
function splitDataset(dataset) {
    // get length of dataset
    let noTrainingRows = Math.round(dataset.length * 2/3);
    let noTestRows = dataset.length - noTrainingRows;

    dataset = shuffleRows(dataset);

    const testSet = dataset.splice(0, noTestRows);

    return {
        trainingSet: dataset,
        testSet  
    }
}

// now need to split into classes & numbers
function getNumbers() {
    return dataArray.map((d) => d.slice(0, totalColumns-1))
}

function getClasses() {
    return dataArray.map((d) => d[totalColumns-1])
}

function getDistinctClasses(dataset) {
    for(let row in dataset) {
        if(!distinctClasses.includes(dataset[row][totalColumns-1])){
            distinctClasses.push(dataset[row][totalColumns-1])
        }
    }

    return distinctClasses
}

function handleFile(training, test = null){
    let trainingSet, testSet;
    let distinctClasses;

    if(test === null){
        let dataArray = convertFileIntoArray(training);
        totalColumns = dataArray[0].length;
        distinctClasses = getDistinctClasses(dataArray)
        numberClasses(dataArray);

        const datasets = splitDataset(dataArray);
        trainingSet = datasets.trainingSet;
        testSet = datasets.testSet;
    } else {
        trainingSet = convertFileIntoArray(training);
        testSet = convertFileIntoArray(test);
        totalColumns = dataArray[0].length;
        distinctClasses = getDistinctClasses(trainingSet.concat(testSet));
        numberClasses(trainingSet);
        numberClasses(testSet);
    }

    return {
        trainingSet,
        testSet,
        distinctClasses,
    }
}

module.exports = {
    handleFile,
    getNumbers,
    getClasses
}

