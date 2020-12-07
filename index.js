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
    inputTestSet = answers.inputType.includes('test');

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
    log(chalk.cyan.bold("Let's set up your tree:"));

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
            log('\n');
            tree.printTree();
            log('\n');
        } else if (answer.option.includes('Write')) {
            // eslint-disable-next-line no-await-in-loop
            await tree.writePredictionsToFile();
        } else if (answer.option.includes('Compare')) {
            // Get this trees statistics
            const stats = tree.getStatistics();

            log(chalk.cyan.bold('\nThis tree:\n'));
            log(chalk`{bold Accuracy:} ${stats.accuracy}%\n`);
            log(chalk.bold('Confusion Matrix:\n'));
            log(`Labels: ${data.distinctClasses}\n`);
            log(stats.confusionMatrix);

            const compareStats = compare(data, options);

            log(chalk.cyan.bold('\nml-cart tree:\n'));
            log(chalk`{bold Accuracy:} ${compareStats.accuracy}%\n`);
            log(chalk.bold('Confusion Matrix:\n'));
            log(`Labels: ${compareStats.confusionMatrix.labels}\n`);
            log(compareStats.confusionMatrix.matrix);
            log('\n');
        } else if (answer.option.includes('Rebuild')) {
            // If using a test set then can't rebuild
            if (inputTestSet) {
                log(chalk.red.bold('\nYou can\'t perform this action as a separate test set was entered!\n'));
            } else {
                // Call handleFile to get new training/test split
                data = handleFile(trainingFile);
                // Create a new tree using the new split datasets
                tree = new Cart(data, options);
                log(chalk.green.bold('\nYour new tree has been built!\n'));
            }
        } else {
            // Exit the application
            exit = true;
        }
    }
}

start();
