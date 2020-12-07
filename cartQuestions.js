const preBuildQuestions = [
    {
        type: 'list',
        name: 'inputType',
        message: 'What are you inputting?',
        choices: ['Just a training set', 'Both training and test sets'],
    },
    {
        type: 'input',
        name: 'depth',
        message: 'What is the max depth you want the tree to be?',
        validate(value) {
            const valid = !Number.isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number,
    },
    {
        type: 'input',
        name: 'minSampleSize',
        message: 'What is the min number of samples that should be available before splitting a node?', // what actually is this?
        validate(value) {
            const valid = !Number.isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number,
    },
];

const postBuildQuestions = [
    {
        type: 'list',
        name: 'option',
        message: 'Would you like to:',
        choices: ['Print the tree to the console', 'Write predictions to a file', 'Compare with the ml-cart algorithm', 'Rebuild using a different train-test split', 'Exit'],
    },
];

const fileQuestions = [
    {
        type: 'input',
        name: 'training',
        message: 'What is the location of your training set?',
    },
    {
        type: 'input',
        name: 'test',
        message: 'And your test set location?',
    },
];

module.exports = {
    preBuildQuestions,
    postBuildQuestions,
    fileQuestions,
};
