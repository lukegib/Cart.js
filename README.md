# Cart.js
A client application implementing the CART algorithm, built entirely in JavaScript.

#### What is CART?
CART (classification and regression tree) is a machine learning algorithm that build decison trees in order to make predictions on data.

## Set Up
Setting up the application is a straight forward process requiring two simple commands:

##### 1. Install application dependencies with

    npm install

##### 2. Start the application with

    npm start

 ## Building the Tree (Input)
Before building the decison tree the answers to a set of questions must first be determined:

#### 1. What are you inputting?
You can opt for using both a training and test dataset, or just a training set in which case the application will perfrom a train/test split.

#### 2. What is the max depth you want the tree?
This requires an integer which represenst the levels in whcih the decsion tree will grow before forcing to make a prediction. 

This number is data dependeant as too high a number could overfit the data (poor predictions on unseen data due to knowing the training data too well), while a low number could underfit the data (poor predcitions as it should have gotten to know the data better).

#### 3. What is the minimum number of samples required for a node to split?
This also requires an integer as it's input, this time reprsnting the minimum samples before a node will split its self into a left and right branch.

#### 4/5. What is the location of your training/test set?
Enter the file path to your dataset. The dataset should be in a csv format with predictions as the last value on each line.

If you don't have a dataset at hand and want to test out the application you can use the beer.csv file included!

## Post-Build Options
Once your Tree has been built there are a few options that will allow you to explore it a little more.

#### 1. Print the tree to the console
This will display your tree in an easy to read (colour coded) format

#### 2. Write the predictions to a file
If you want to store the predictions for later then you can go ahead and hit this option. A new file named predictions.txt will then appear.

#### 3. Compare with the ml-cart algorithm
Want to test the performance against another JavaScript implenation of Cart? Then look no further as this option will compare the result with the ml-cart algorithm (found here), spitting out both their classification accuracy and confusion matrices.

#### 4. Rebuild using a different train-test split
This is a convenient method if you want to test the algorithm a number of different times. It will simply take your training dataset and reperform the train/test split which will in turn build a new tree.

