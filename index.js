// 1. Handle File 
//  A. Is there only 1 file? shuffle and split it
//  B. Get length of a row (no. of features)
//  C. Convert the classes into float values
//  D. Get the distinct classes (both string and float versions)

// 2. Use CART
//  A. Build Tree using the training set
//  B. Print tree to console
//  C. Get predictions for Testing set and print to a file

// 3. Testing of algorithm
//  A. Calculate the classification accuracy
//  B. Repeat x10
//  C. Report on average accuracy
//  D. Repeat steps using ml5.js implementations
//  E. Get Confusion Matrix for two implementations
//  F. Use learning curve/ROC curve to demonstrate

// 4. Make all above easily accessible from terminal