import { DecisionTreeClassifier as DTClassifier } from 'ml-cart';
import ConfusionMatrix from 'ml-confusion-matrix';
import { getNumbers, getClasses } from './fileHandling';

// Passes the dataset into the ml-cart algorithm and returns its accuracy and confusion matrix.

function compare({ trainingSet, testSet }, options) {
    const features = getNumbers(trainingSet);
    const classes = getClasses(trainingSet);

    const classifier = new DTClassifier(options);
    classifier.train(features, classes);

    const result = classifier.predict(getNumbers(testSet));
    const CM2 = ConfusionMatrix.fromLabels(getClasses(testSet), result);

    return {
        accuracy: CM2.getAccuracy(),
        confusionMatrix: CM2,
    };
}

export default compare;
