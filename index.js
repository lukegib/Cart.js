import inquirer from 'inquirer';
import chalk from 'chalk';
import {handleFile} from './fileHandling';
import compare from './compare';
import {initiateBuild, printTree, writePredictionsToFile, getStatistics} from './cart';

const log = console.log;

// 1. Using training data or training and test data?
// 2. Input file location of above
// 3. max depth:
// 4. minimum sample size 

const preBuildQuestions = [
    {
        type: 'list',
        name: 'inputType',
        message: 'Do you want to input:',
        choices: ['A Training and Test Dataset', 'Just a Training Set']
    },
    {
        type: 'input',
        name: 'depth',
        message: 'What is the max depth of the tree?',
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
        filter: Number
    },
    {
        type: 'input',
        name: 'minSampleSize',
        message: 'What is the minimum number of samples required?', // what actually is this?
        validate: function (value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
          },
        filter: Number
    }
]

// 1. Print the tree 
// 2. Write the predictions to a file
// 3. Compare accuracy with ml-cart algorithm
// 4. (if using 2 files) Rebuld tree using different training/test split
// 5. Exit

const postBuildQuestions = [
    {
        type: 'list',
        name: 'option',
        message: 'Options',
        choices: ['Print the tree', 'Write predictions to a file', 'Compare with ml-cart algorithm', 'Rebuild using different train-test split', 'Exit']
    },
]

const fileQuestions = [
    {
        type: 'input',
        name: 'training',
        message: 'Input training set location: ',
    },
    {
        type: 'input',
        name: 'est',
        message: 'Input test set location: ',
    },
]

let options = {
    maxDepth: 5,
    minNumSamples: 1
}
let inputTrainingSet = false;


async function setUp(){
    const answers = await inquirer.prompt(preBuildQuestions)

    options.maxDepth = answers.depth;
    options.minNumSamples = answers.minSampleSize;
    inputTrainingSet = answers.inputType.includes('Test');

    if(inputTrainingSet){
        const {training, test} = await inquirer.prompt(fileQuestions);
        // handle files here
        const data = handleFile(training, test);
        return data
    } else {
        const {training} = await inquirer.prompt(fileQuestions[0]);
        // handle file here
        const data = handleFile(training);
        return data
    }
}

async function start(){
    log(chalk.magentaBright.bold('\nWelcome to CART.js\n'))

    const data = await setUp();
    const tree = initiateBuild(data, options);
    log(chalk.green.bold('\nYour tree has been built!\n'));

    let exit = false;

    while(!exit){
        const answer = await inquirer.prompt(postBuildQuestions);

        if(answer.option.includes('Print')){
            printTree(tree)
        }
        else if(answer.option.includes('Write')){
            writePredictionsToFile(data.testSet, tree, data.distinctClasses)
        }
        else if(answer.option.includes('Compare')){

            const stats = getStatistics(data.testSet, tree);

            log(`Matrix: ${stats.confusionMatrix}`)
            log(`Accuracy: ${stats.accuracy}%`)

        }
        else if(answer.option.includes('Rebuild')){
            // new tree creation
            // no need for new distinctClass retireval
        }
        else{
            exit = true;
        }
    }    
}

// TODO: Only 2 predictions for 4 test cases ?!

start();