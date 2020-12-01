const full = [[4, 8, 12, 0],
              [4.3, 10, 12, 0],
              [5, 11, 11, 1],
              [6.1, 9, 13, 1],
              [4.2, 10.3, 11, 2],
              [4.5, 9, 11, 2]];

const totalFeatures = full[0].length - 1;
const distinctClasses = [0, 1, 2];

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

    for(let i=0; i< totalFeatures; i++){
        for(let row in features){
            const splitGroup = splitDataset(dataset, features[row][i], i);
            const gini = getGiniIndex(splitGroup, i);
            if(gini < bestGini){
                bestGini = gini;
                splitValue = features[row][i];
                left = splitGroup.left;
                right = splitGroup.right;
            }
        }
    }

    return {splitValue, left, right};
}

// Counts occurence of classes to make prediction
function createLeaf() {
    let prediction = "TO BE CALCULATED"

    // count up occurences for the classes

    return {prediction}
}

// recursively builds decision tree
function buildTree(dataset) {

    // split data at best point
    let node = getBestSplit(dataset);

    // If either set is empty make leaf node
    if(node.left.length === 0 || node.right.length === 0){
        node = {
            ...node,
            left: createLeaf(),
            right: createLeaf()
        }

        return node;
    }

    node.left = buildTree(node.left)
    node.right = buildTree(node.right)

    return node;
    
    // base case
    // 1. Check if left/true or right/false side is empty!
    // if so create a leaf node with the groups
    /*
    if(node.left === [] || node.right === []){
        // combine groups
        // get the prediction by calling leaf
        // set it as both left and right nodes.
        node = {
            left: "I'm a leaf!",
            right: "I'm a leaf!",
        }
        return
    }

    // process left child
    node.left = buildTree(node.left)

    // process right child
    node.right = buildTree(node.right) // recursive call 
    */
}

function leaf(set){
    // count occurence of each class and return class
    // with highest count!
}

function inititateBuild(dataset){
    let root = buildTree(dataset); // recursive function
    console.log(root)
}

inititateBuild(full)
