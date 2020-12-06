// import irisDataset, { getClasses } from 'ml-dataset-iris';
import { DecisionTreeClassifier as DTClassifier } from 'ml-cart';
import ConfusionMatrix from 'ml-confusion-matrix';
import {getNumbers, getClasses} from './fileHandling';


export default function({trainingSet, testSet}, options) {
  const features = getNumbers(trainingSet);
  const classes = getClasses(trainingSet);

  const classifier = new DTClassifier(options);
  classifier.train(features, classes);

  const result = classifier.predict(getNumbers(testSet))
  const CM2 = ConfusionMatrix.fromLabels(getClasses(testSet), result)

  return {
    accuracy: CM2.getAccuracy(),
    confusionMatrix: CM2
  }
}

/*
const options = {
  gainFunction: 'gini',
  maxDepth: 5,
  minNumSamples: 1
}*/

/*
const trainingSet = irisDataset.getNumbers(); // gets the features
const predictions = irisDataset
  .getClasses()
  .map((elem) => irisDataset.getDistinctClasses().indexOf(elem)); //labels

const classifier = new DTClassifier(options);
classifier.train(trainingSet, predictions);
const result = classifier.predict(trainingSet);

const CM2 = ConfusionMatrix.fromLabels(predictions, result)

// the accuracy
//console.log(CM2.getAccuracy());

// the confuison matrix
//console.log(CM2);

// All of the numbers ... no classes
console.log(trainingSet);

// [This is the actaul training classes]
//console.log(predictions);

// All the predictions [0, 0, 0, 1, 1, 1, etc]
//console.log(result);

// full set - has everything inc strings
//console.log(irisDataset.getDataset());
*/