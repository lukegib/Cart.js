import inquirer from 'inquirer';
import chalk from 'chalk';

import { handleFile } from './fileHandling';
import { preBuildQuestions, postBuildQuestions, fileQuestions } from './cartQuestions';
import compare from './compare';
import Cart from './cart';

const { log } = console;
const options = {
    maxDepth: 5,
    minNumSamples: 1,
};
let inputTestSet = false;
let trainingFile = '';

// Gets the info required to create the decision tree - tree options + files
async function setUp() {
    const answers = await inquirer.prompt(preBuildQuestions);

    options.maxDepth = answers.depth;
    options.minNumSamples = answers.minSampleSize;
    inputTestSet = answers.inputType.includes('Test');

    // If using a test set, get both training and test file locations + handle the files
    if (inputTestSet) {
        const { training, test } = await inquirer.prompt(fileQuestions);
        const data = handleFile(training, test);
        return data;
    }

    // Else, just get the training set location and handle the file
    const { training } = await inquirer.prompt(fileQuestions[0]);
    const data = handleFile(training);
    trainingFile = training;

    return data;
}

// Starts the application
async function start() {
    log(chalk.magentaBright.bold('\nWelcome to CART.js\n'));

    // Get CART data
    let data = await setUp();

    // Build a new tree
    let tree = new Cart(data, options);

    log(chalk.green.bold('\nYour tree has been built!\n'));

    let exit = false;

    // While user hasn't exited
    while (!exit) {
        // eslint-disable-next-line no-await-in-loop
        const answer = await inquirer.prompt(postBuildQuestions);

        // User can print, write, compare, rebuild and exit the application
        if (answer.option.includes('Print')) {
            tree.printTree();
        } else if (answer.option.includes('Write')) {
            tree.writePredictionsToFile();
        } else if (answer.option.includes('Compare')) {
            // Get tree stats
            const stats = tree.getStatistics();

            log(`Matrix: ${stats.confusionMatrix}`);
            log(`Accuracy: ${stats.accuracy}%`);

            // get compareStats

            const compareStats = compare(data, options);

            log('Matrix: ');
            log(compareStats.confusionMatrix);
            log(`Accuracy: ${compareStats.accuracy}`);
        } else if (answer.option.includes('Rebuild')) {
            // If using a test set then can't rebuild
            if (inputTestSet) {
                log(chalk.red('Sorry, you can\'t perform this action as you have entered a separate test dataset.'));
            } else {
                // Call handleFile to get new training/test split
                const newData = handleFile(trainingFile);
                data = newData;
                // Create a new tree using the new split datasets
                tree = new Cart(data, options);
                log(chalk.green('A new tree has been successfully built!'));
            }
        } else {
            // Exit the application
            exit = true;
        }
    }
}

start();
