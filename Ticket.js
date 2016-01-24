var numbers = require('./numbers');
var shuffle = require('./shuffle');

var columns = [];
for (var c = 0; c < 9; c++) {
    columns[c] = [];
}

selectedNumbers = 0;
emptyColumns = 9;

while (selectedNumbers !== 15) {
    var index = Math.floor(Math.random() * numbers.length);
    var current = numbers[index];
    var column = Math.floor((current - 1) / 10);
    if (emptyColumns !== 0) { //make sure we have at least one number in every column
        if (columns[column].length === 0) {
            addNumberToTicket(column, current, index);
            emptyColumns--;
        }
    } else {
        if (columns[column].length < 3) { //we can have max 3 numbers in column
            addNumberToTicket(column, current, index);
        }
    }
}
//add blanks and permute columns
columns.map(function(column) {
    while (column.length < 3) {
        column.push(null);
    }
    column = shuffle(column);
    //TODO we want sorted results but with blanks
});

function addNumberToTicket(column, number) {
    columns[column].push(number);
    selectedNumbers++;
    numbers.splice(index, 1);
}

function columnsToRows(colums) {
    var rows = [];
    for (var row = 0; row < 3; row++) {
        rows[row] = [];
        for (var col = 0; col < 9; col++) {
            rows[row].push(columns[col][row]);
        }
    }
    return rows;
}

function Ticket() {
    this.rows = columnsToRows(columns);
}

module.exports = Ticket;
