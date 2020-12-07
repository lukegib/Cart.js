import chalk from 'chalk';
import fs from 'fs';

const { log } = console;

export default class Cart {
    constructor({ trainingSet, testSet, distinctClasses }, { maxDepth, minNumSamples }) {
        // initializse everything and build the tree
        this.trainingSet = trainingSet;
        this.testSet = testSet;
        this.distinctClasses = distinctClasses;
        this.maxDepth = maxDepth;
        this.minNumSamples = minNumSamples;
        this.totalFeatures = trainingSet[0].length - 1;

        this.tree = this.initiateBuild();
    }

    initiateBuild() {
        const tree = this.buildTree(this.trainingSet, 1);
        return tree;
    }

    // recursively builds decision tree
    buildTree(dataset, treeDepth) {
        // split data at best point
        let node = this.getBestSplit(dataset);

        // If either set is empty make leaf node
        if (node.left.length === 0 || node.right.length === 0) {
            const data = node.right.concat(node.left);

            node = {
                ...node,
                left: this.createLeaf(data),
                right: this.createLeaf(data),
            };

            return node;
        }

        // Question of the day ... how do i get the depth!

        // if max-depth is reached maike alead node
        if (treeDepth >= this.maxDepth) {
            const leftData = node.left;
            const rightData = node.right;

            // make leaf nodes
            node = {
                ...node,
                left: this.createLeaf(leftData),
                right: this.createLeaf(rightData),
            };
        }

        // if minNumSamples reached, create a leaf node
        if (node.left.length <= this.minNumSamples) {
            node.left = this.createLeaf(node.left);
        } else {
            node.left = this.buildTree(node.left, treeDepth + 1);
        }

        if (node.right.length <= this.minNumSamples) {
            node.right = this.createLeaf(node.right);
        } else {
            node.right = this.buildTree(node.right, treeDepth + 1);
        }

        return node;
    }

    // returns info on best split - split value, left group, right group
    getBestSplit(dataset) {
        const features = dataset.map((d) => d.slice(0, this.totalFeatures));
        let bestGini = 100;
        let left = [];
        let right = [];
        let splitValue = 100;
        let splitIndex = 0;

        // Take a look at this -- should it be i<=totalFeats ?
        for (let i = 0; i < this.totalFeatures; i += 1) {
            for (let j = 0; j < features.length; j += 1) {
                const splitGroup = this.splitDataset(dataset, features[j][i], i);
                const gini = this.getGiniIndex(splitGroup, i);
                if (gini < bestGini) {
                    bestGini = gini;
                    splitValue = features[j][i];
                    splitIndex = i;
                    left = splitGroup.left;
                    right = splitGroup.right;
                }
            }
        }

        return {
            splitIndex,
            splitValue,
            left,
            right,
        };
    }

    // Splits a dataset based on a split value and column number of splitValue
    splitDataset(dataset, splitValue, columnIndex) {
        const left = [];
        const right = [];
        const classes = {
            leftCount: Array.from(Array(this.distinctClasses.length), () => 0),
            rightCount: Array.from(Array(this.distinctClasses.length), () => 0),
        };

        Object.values(dataset).forEach((row) => {
            if (row[columnIndex] < splitValue) {
                left.push(row);
                classes.leftCount[row[this.totalFeatures]] += 1;
            } else {
                right.push(row);
                classes.rightCount[row[this.totalFeatures]] += 1;
            }
        });

        return { left, right, classes };
    }

    // returns the gini index given groups (left, right), the split value
    getGiniIndex(groups) {
        const { left, right } = groups;
        const total = left.length + right.length;
        const { leftCount, rightCount } = groups.classes;
        let score = 0;
        const gini = {
            leftScore: 0,
            rightScore: 0,
        };

        // get left score
        for (let i = 0; i < leftCount.length; i += 1) {
            if (left.length === 0) continue; // avoid dividing by 0
            const x = leftCount[i] / left.length;
            score += x * x;
        }

        gini.leftScore = 1 - score;

        // reset score
        score = 0;

        // get right score
        for (let i = 0; i < rightCount.length; i += 1) {
            if (right.length === 0) continue;
            const x = rightCount[i] / right.length;
            score += x * x;
        }

        gini.rightScore = 1 - score;

        return (left.length / total) * gini.leftScore + (right.length / total) * gini.rightScore;
    }

    // Counts occurence of classes to make prediction
    createLeaf(dataset) {
        const classes = dataset.map((d) => d[this.totalFeatures]);

        const prediction = classes.sort((a, b) => {
            const x = classes.filter((v) => v === a).length;
            const y = classes.filter((v) => v === b).length;
            return x - y;
            // classes.filter(v => v===a).length - classes.filter(v => v===b).length
        }).pop();

        return { prediction };
    }

    printTree(node = this.tree, spacing = '', color = 'green') {
        if ('prediction' in node) {
            log(`${spacing}${color === 'green' ? chalk.green.bold('+- Yes:'): chalk.red.bold('+- No:')}`);
            log(`${spacing}+- Prediction: ${node.prediction}`);
            spacing += '   ';
        } else {
            log(`${spacing}${color === 'green' ? chalk.green.bold('+- Yes:'): chalk.red.bold('+- No:')}`);
            log(`${spacing}+- Is X${node.splitIndex + 1} < ${node.splitValue} ?`);
            spacing += '|  ';
            this.printTree(node.left, spacing, 'green');
            this.printTree(node.right, spacing, 'red');
        }
    }

    getPredictions() {
        const predictions = {
            actual: [],
            predicted: [],
        };

        Object.values(this.testSet).forEach((row) => {
            const actualValue = row[this.totalFeatures];
            const predictedValue = this.predict(row, this.tree);
            predictions.actual.push(actualValue);
            predictions.predicted.push(predictedValue);
        });

        return predictions;
    }

    predict(row, node) {
        // Base case: reached Leaf
        if ('prediction' in node) {
            return node.prediction;
        }

        // Decide whether to go left or right of tree
        if (row[node.splitIndex] < node.splitValue) {
            return this.predict(row, node.left);
        }

        return this.predict(row, node.right);
    }

    async writePredictionsToFile() {
        const { actual, predicted } = this.getPredictions();

        let fileContents = '';

        for (let i = 0; i < actual.length; i += 1) {
            fileContents += `Actual Class: ${this.distinctClasses[actual[i]]} Predicted Class: ${this.distinctClasses[predicted[i]]}\n`;
        }

        fs.writeFile('predictions.txt', fileContents, (err) => {
            if (err) {
                log(err);
            }
            log('Successfully written to file');
        });
    }

    // Returns the accuracy and confusionMatrix
    getStatistics() {
        const { actual, predicted } = this.getPredictions();
        const numClasses = this.distinctClasses.length;
        const confusionMatrix = [...Array(numClasses)].map(() => Array(numClasses).fill(0));
        let accuracy = [];
        let totalPredictions = 0;
        let correctPredictions = 0;

        for (let i = 0; i < actual.length; i += 1) {
            confusionMatrix[actual[i]][predicted[i]] += 1;
            totalPredictions += 1;
            if (actual[i] === predicted[i]) correctPredictions += 1;
        }

        accuracy = (correctPredictions / totalPredictions) * 100;

        return {
            confusionMatrix,
            accuracy,
        };
    }
}
