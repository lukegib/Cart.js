import fs from 'fs';

let totalColumns = 0;
const distinctClasses = [];

function convertFileIntoArray(file) {
    const text = fs.readFileSync(file, 'utf-8');
    const lines = text.split(/\r?\n/);

    const dataArray = [];

    Object.values(lines).forEach((line) => {
        let tokens = line.split(',');
        const label = tokens.pop();

        tokens = Object.values(tokens).map((token) => parseFloat(token));

        tokens.push(label.trim());
        dataArray.push(tokens);
    });

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
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // while elements remain to be shuffled
    while (currentIndex !== 0) {
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
    const noTrainingRows = Math.round(dataset.length * (2 / 3));
    const noTestRows = dataset.length - noTrainingRows;

    dataset = shuffleRows(dataset);

    const testSet = dataset.splice(0, noTestRows);

    return {
        trainingSet: dataset,
        testSet,
    };
}

// now need to split into classes & numbers
function getNumbers(dataArray) {
    const totalCols = dataArray[0].length;
    return dataArray.map((d) => d.slice(0, totalCols - 1));
}

function getClasses(dataArray) {
    const totalCols = dataArray[0].length;
    return dataArray.map((d) => d[totalCols - 1]);
}

function getDistinctClasses(dataset) {
    for(let row in dataset) {
        if(!distinctClasses.includes(dataset[row][totalColumns-1])){
            distinctClasses.push(dataset[row][totalColumns-1])
        }
    }

    return distinctClasses;
}

function handleFile(training, test = null) {
    let trainingSet;
    let testSet;
    let distinctClasses;

    if (test === null) {
        const dataArray = convertFileIntoArray(training);
        totalColumns = dataArray[0].length;
        distinctClasses = getDistinctClasses(dataArray);
        numberClasses(dataArray);

        const datasets = splitDataset(dataArray);
        trainingSet = datasets.trainingSet;
        testSet = datasets.testSet;
    } else {
        trainingSet = convertFileIntoArray(training);
        testSet = convertFileIntoArray(test);
        totalColumns = trainingSet[0].length;
        distinctClasses = getDistinctClasses(trainingSet.concat(testSet));
        numberClasses(trainingSet);
        numberClasses(testSet);
    }

    return {
        trainingSet,
        testSet,
        distinctClasses,
    };
}

module.exports = {
    handleFile,
    getNumbers,
    getClasses,
};
