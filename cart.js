const full = [[4, 8, 12, 0],
              [4.3, 10, 12, 0],
              [5, 11, 11, 1],
              [6.1, 9, 13, 1],
              [4.2, 10.3, 11, 2],
              [4.5, 9, 11, 2]];

const totalFeatures = full[0].length - 1;
const distinctClasses = [0, 1, 2];

import fs from 'fs';



// returns the gini index given groups (left, right), the split value
function getGiniIndex(groups){

    const {left, right} = groups;
    const total = left.length + right.length;
    const {leftCount, rightCount} = groups.classes;
    let score = 0;
    let gini = {
        leftScore: 0,
        rightScore: 0
    }
 
    // get left score
    for(let count in leftCount){
        if(left.length === 0) continue; // avoid dividing by 0
        const x = leftCount[count] / left.length;
        score += x * x
    }

    gini.leftScore = 1 - score;

    // reset score
    score = 0;

    // get right score
    for(let count in rightCount){
        if(right.length === 0) continue;
        const x = rightCount[count] / right.length;
        score += x * x;
    }

    gini.rightScore = 1 - score;

    return (left.length/total) * gini.leftScore + (right.length/total) * gini.rightScore;
}

// Splits a dataset based on a split value and column number of splitValue
function splitDataset(dataset, splitValue, columnIndex){

    let left = [];
    let right = [];
    let classes = {
        leftCount: Array.from(Array(distinctClasses.length), () => 0),
        rightCount: Array.from(Array(distinctClasses.length), () => 0)
    }

    for(let row in dataset){
        if(dataset[row][columnIndex] < splitValue){
            left.push(dataset[row]);
            classes.leftCount[dataset[row][totalFeatures]] += 1;
        } else {
            right.push(dataset[row]);
            classes.rightCount[dataset[row][totalFeatures]] += 1;
        }
    }

    return {left, right, classes}
}

// returns info on best split - split value, left group, right group
function getBestSplit(dataset){
    const features = dataset.map((d) => d.slice(0, totalFeatures));
    let bestGini = 100;
    let left = [];
    let right = [];
    let splitValue = 100;
    let splitIndex = 0;

    for(let i=0; i< totalFeatures; i++){
        for(let row in features){
            const splitGroup = splitDataset(dataset, features[row][i], i);
            const gini = getGiniIndex(splitGroup, i);
            if(gini < bestGini){
                bestGini = gini;
                splitValue = features[row][i];
                splitIndex = i;
                left = splitGroup.left;
                right = splitGroup.right;
            }
        }
    }

    return {splitIndex, splitValue, left, right};
}

// Counts occurence of classes to make prediction
function createLeaf(dataset) {
    const classes = dataset.map((d) => d[totalFeatures]);
    let prediction;
    
    // understand this
    prediction = classes.sort((a, b) => {
        classes.filter(v => v===a).length - classes.filter(v => v===b).length
    }).pop();

    return {prediction}
}

const maxDepth = 5;
const minNumSamples = 1;

// recursively builds decision tree
function buildTree(dataset, treeDepth) {

    // split data at best point
    let node = getBestSplit(dataset);

    // If either set is empty make leaf node
    if(node.left.length === 0 || node.right.length === 0){
        const data = node.right.concat(node.left);

        node = {
            ...node,
            left: createLeaf(data),
            right: createLeaf(data)
        }

        return node;
    }

    // Question of the day ... how do i get the depth!

    //if max-depth is reached maike alead node
    if(treeDepth >= maxDepth){
        const leftData = node.left;
        const rightData = node.right;

        // make leaf nodes
        node = {
            ...node,
            left: createLeaf(leftData),
            right: createLeaf(rightData)
        }
    }

    // if minNumSamples reached, create a leaf node
    if(node.left.length <= minNumSamples){
        node.left = createLeaf(node.left);
    } else {
        node.left = buildTree(node.left, treeDepth + 1)
    }

    if(node.right.length <= minNumSamples){
        node.right = createLeaf(node.right)
    } else {
        node.right = buildTree(node.right, treeDepth + 1)
    }

    return node;
}

function inititateBuild(dataset){
    let root = buildTree(dataset, 1); // recursive function
    console.log(JSON.stringify(root, null, 4))
    return root;
}

function stringifyTree(node, spacing){

    if('prediction' in node){
        console.log(`${spacing}+- Prediction: ${node.prediction}`)
        spacing += "   ";
    } else {
        console.log(`${spacing}+- X${node.splitIndex+1} < ${node.splitValue} ?`);
        spacing += "|  ";
        stringifyTree(node.left, spacing)
        stringifyTree(node.right, spacing)
    }

    return;
}

function predict(row, node){
    // Base case: reached Leaf
    if('prediction' in node){
        return node.prediction
    }

    // Decide whether to go left or right of tree
    if(row[node.splitIndex] < node.splitValue){
        return predict(row, node.left)
    } else {
        return predict(row, node.right)
    }
}

function writePredictionsToFile() {
    let predictions = ""

    for(let row in full){
        predictions += `Actual Class: ${full[row][totalFeatures]} Predicted Class: ${predict(full[row], tree)}\n`
    }

    fs.writeFile('predictions.txt', predictions, (err) => {
        if(err){
            console.log(err)
        }
        console.log("Successfully written to file")
    });
}

const tree = inititateBuild(full)

stringifyTree(tree, "")

writePredictionsToFile()


