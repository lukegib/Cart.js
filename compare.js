import irisDataset from 'ml-dataset-iris';
import { DecisionTreeClassifier as DTClassifier } from 'ml-cart';
import ConfusionMatrix from 'ml-confusion-matrix';

const trainingSet = irisDataset.getNumbers(); // gets the features
const predictions = irisDataset
  .getClasses()
  .map((elem) => irisDataset.getDistinctClasses().indexOf(elem)); //labels

const options = {
  gainFunction: 'gini',
  maxDepth: 10,
  minNumSamples: 3,
};

const classifier = new DTClassifier(options);
classifier.train(trainingSet, predictions);
const result = classifier.predict(trainingSet);

const CM2 = ConfusionMatrix.fromLabels(predictions, result)

console.log(CM2.getAccuracy());

console.log(trainingSet);

console.log(predictions);

console.log(irisDataset.getDataset());