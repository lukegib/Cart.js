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

async function setUp() {
    const answers = await inquirer.prompt(preBuildQuestions);

    options.maxDepth = answers.depth;
    options.minNumSamples = answers.minSampleSize;
    inputTestSet = answers.inputType.includes('Test');

    if (inputTestSet) {
        const { training, test } = await inquirer.prompt(fileQuestions);
        const data = handleFile(training, test);
        return data;
    }

    const { training } = await inquirer.prompt(fileQuestions[0]);
    const data = handleFile(training);
    trainingFile = training;

    return data;
}

async function start() {
    log(chalk.magentaBright.bold('\nWelcome to CART.js\n'));

    let data = await setUp();

    let tree = new Cart(data, options);

    log(chalk.green.bold('\nYour tree has been built!\n'));

    let exit = false;

    while (!exit) {
        // eslint-disable-next-line no-await-in-loop
        const answer = await inquirer.prompt(postBuildQuestions);

        if (answer.option.includes('Print')) {
            tree.printTree();
        } else if (answer.option.includes('Write')) {
            tree.writePredictionsToFile();
        } else if (answer.option.includes('Compare')) {
            const stats = tree.getStatistics();

            log(`Matrix: ${stats.confusionMatrix}`);
            log(`Accuracy: ${stats.accuracy}%`);

            // mayb

            const compareStats = compare(data, options);

            log('Matrix: ');
            log(compareStats.confusionMatrix);
            log(`Accuracy: ${compareStats.accuracy}`);
        } else if (answer.option.includes('Rebuild')) {
            if (inputTestSet) {
                log(chalk.red('Sorry, you can\'t perform this action as you have entered a separate test dataset.'));
            } else {
                const newData = handleFile(trainingFile);
                data = newData;
                tree = new Cart(data, options);
                log(chalk.green('A new tree has been successfully built!'));
            }
        } else {
            exit = true;
        }
    }
}

start();
