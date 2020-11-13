import fs from 'fs'
import data from './iris.txt'

const labelCol = 4
let dataArray = []
let distinctClasses = []

let text = fs.readFileSync('./iris.txt', 'utf-8')
let lines = text.split(/\r?\n/)
let n = lines.length

for(let line in lines){
    let tokens = lines[line].split(",")
    const label = tokens.pop() // could have user specify the label column
    for(let token in tokens){
        tokens[token] = parseFloat(tokens[token])
    }
    tokens.push(label)
    dataArray.push(tokens)
}

console.log(dataArray[1].length)

// now need to split into classes & numbers
function getNumbers() {
    return dataArray.map((d) => d.slice(0, 6))
}

function getClasses() {
    return dataArray.map((d) => d[6])
}

function getDistinctClasses() {
    for(let row in dataArray) {
        if(!distinctClasses.includes(dataArray[row][6])){
            distinctClasses.push(dataArray[row][6])
        }
    }

    return distinctClasses
}

console.log(getNumbers())

console.log(getClasses())

console.log(getDistinctClasses())