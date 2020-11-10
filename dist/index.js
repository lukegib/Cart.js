"use strict";

var _mlDatasetIris = _interopRequireDefault(require("ml-dataset-iris"));

var _mlCart = require("ml-cart");

var _mlConfusionMatrix = _interopRequireDefault(require("ml-confusion-matrix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var trainingSet = _mlDatasetIris["default"].getNumbers(); // gets the features


var predictions = _mlDatasetIris["default"].getClasses().map(function (elem) {
  return _mlDatasetIris["default"].getDistinctClasses().indexOf(elem);
});

var options = {
  gainFunction: 'gini',
  maxDepth: 10,
  minNumSamples: 3
};
var classifier = new _mlCart.DecisionTreeClassifier(options);
classifier.train(trainingSet, predictions);
var result = classifier.predict(trainingSet);

var CM2 = _mlConfusionMatrix["default"].fromLabels(predictions, result);

console.log(CM2.getAccuracy());