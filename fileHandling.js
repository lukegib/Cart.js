/* eslint-disable no-param-reassign */
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

        // Error check to make sure empty line isn't added to array
        if (!(tokens.length === 0 || tokens === undefined)) {
            tokens = Object.values(tokens).map((token) => parseFloat(token));

            tokens.push(label.trim());
            dataArray.push(tokens);
        }
    });

    return dataArray;
}

// Converts a set of classes (['a', 'b', 'c']) into numbers ([1, 2, 3])
function numberClasses(dataset) {
    Object.values(dataset).forEach((row) => {
        const rowClass = row.pop();
        row.push(distinctClasses.indexOf(rowClass));
    });
}

// Shuffles an array using the Fisher-Yates algorithm
function shuffleRows(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While elements remain to be shuffled
    while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Swap it with the current element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Randomly divides a dataset (66/33 split) to obtain a training and test set
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

// Gets the features of the dataset (required for ml-cart)
function getNumbers(dataArray) {
    const totalCols = dataArray[0].length;
    return dataArray.map((d) => d.slice(0, totalCols - 1));
}

// Gets the classes of the dataset (required for ml-cart)
function getClasses(dataArray) {
    const totalCols = dataArray[0].length;
    return dataArray.map((d) => d[totalCols - 1]);
}

// Returns the set of unique classes in the dataset
function getDistinctClasses(dataset) {
    Object.values(dataset).forEach((row) => {
        if (!distinctClasses.includes(row[totalColumns - 1])) {
            distinctClasses.push(row[totalColumns - 1]);
        }
    });

    return distinctClasses;
}

// Converts file(s) to allow them to be used in a Cart class
function handleFile(training, test = null) {
    let trainingSet;
    let testSet;
    let classes;

    // If not using a separate test set...
    if (test === null) {
        const dataArray = convertFileIntoArray(training);
        totalColumns = dataArray[0].length;
        classes = getDistinctClasses(dataArray);
        numberClasses(dataArray);

        // ... split it into a training and test set
        const datasets = splitDataset(dataArray);
        trainingSet = datasets.trainingSet;
        testSet = datasets.testSet;
    } else {
        trainingSet = convertFileIntoArray(training);
        testSet = convertFileIntoArray(test);
        totalColumns = trainingSet[0].length;
        classes = getDistinctClasses(trainingSet.concat(testSet));
        numberClasses(trainingSet);
        numberClasses(testSet);
    }

    return {
        trainingSet,
        testSet,
        distinctClasses: classes,
    };
}

module.exports = {
    handleFile,
    getNumbers,
    getClasses,
};
