// Questions to ask user - tree options, input files, options after tree is built

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
        validate(value) {
            const valid = !Number.isNaN(parseFloat(value));
            return valid || 'Please enter a number';
        },
        filter: Number,
    },
    {
        type: 'input',
        name: 'minSampleSize',
        message: 'What is the minimum number of samples required?', // what actually is this?
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
        message: 'Options',
        choices: ['Print the tree', 'Write predictions to a file', 'Compare with ml-cart algorithm', 'Rebuild using different train-test split', 'Exit']
    },
];

const fileQuestions = [
    {
        type: 'input',
        name: 'training',
        message: 'Input training set location: ',
    },
    {
        type: 'input',
        name: 'test',
        message: 'Input test set location: ',
    },
];

module.exports = {
    preBuildQuestions,
    postBuildQuestions,
    fileQuestions,
};
