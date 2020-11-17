const test_feats = [[4, 8, 12],
                    [4.3, 10, 12],
                    [5, 11, 11],
                    [6.1, 9, 13],
                    [4.2, 10.3, 11],
                    [4.5, 9, 11]];


const test_labels = [0, 0, 1, 1, 2, 2]

// Gini Index - determines where to split
function giniIndex(splitValue, colIndex, feats, labels){

    let row, group;
    const total = feats.length
    let split = [[], []]
    let gini = [];
    let classCount = [[0, 0, 0], [0, 0, 0]]

    // need to initialise classCount ^^^

    // split data into 2 arrays - >=val && < val
    for(row in feats){
        const associated_label = labels[row]

        if(feats[row][colIndex] < splitValue){
            split[0].push(feats[row][colIndex])
            classCount[0][associated_label] += 1

        } else {
            split[1].push(feats[row][colIndex])
            classCount[1][associated_label] += 1
        }
    }

    // gini += value * value ... where value is class count / total in group 
    for(group in split){
        let score = 0

        for(let value in classCount[group]){
            if(split[group].length === 0) continue // avoids multi x 0 error
            const x = classCount[group][value] / split[group].length;
            score += x * x;
        }

        gini[group] = 1 - score;  
    }

    const giniIndex = (split[0].length/total) * gini[0] + (split[1].length/total) * gini[1];
    
    return giniIndex;
}

//iniIndex(5, 0, test_feats, test_labels)

// finds best place to split data
function split(features, labels){
    let row, feature, i, bestSplit;
    let bestGini = 1

    const num_of_feats = features[0].length

    // for each feature - 0, 1, 2
    for(i = 0; i < num_of_feats; i++){
        // for each row - 0, 1, 2, 3, 4, 5
        for(row in features){
            const GI = giniIndex(features[row][i], i, test_feats, test_labels)
            console.log(`X${i+1} < ${features[row][i]} Gini = ${GI}`)
            if(GI < bestGini) bestGini = GI; 
        }
    }

    console.log(bestGini);

    // loop through every feature in dataset
    // calculate gini index for each features
    // return the best split point
}

// for each feature value e.g 2, 3, 4
// calculate the gini index of it e.g x < 2, x < 3, etc.
// need to calculate gini index of every single value
// e.g speal_len, speal_wid, etc. etc. can then compare the best split';///////////


split(test_feats, test_labels);
// Create Split.
// Build a Tree.
// Make a Prediction.
