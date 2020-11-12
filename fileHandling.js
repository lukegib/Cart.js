import fs from 'fs'
import data from './iris.txt'

const labelCol = 4
let dataArray = []
let distinctClasses = []

let text = fs.readFileSync('./iris.txt', 'utf-8');
let lines = text.split(/\r?\n/)
let n = lines.length
console.log(n);

for(let line in lines){
    dataArray.push(lines[line].split(","))
}

console.log(dataArray[1].length)

// TODO: need to convert each number from string into a float

// now need to split into classes & numbers
function getNumbers() {
    return dataArray.map((d) => d.slice(0, 6))
}

function getClasses() {
    return dataArray.map((d) => d[6]);
}

function getDistinctClasses() {
    for(let row in dataArray) {
        if(!distinctClasses.includes(dataArray[row][6])){
            distinctClasses.push(dataArray[row][6])
        }
    }

    return distinctClasses;
}

console.log(getNumbers())

console.log(getClasses())

console.log(getDistinctClasses())