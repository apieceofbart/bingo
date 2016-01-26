var Numbers = require('./Numbers');
var shuffle = require('./shuffle');

function generateColumns() {

    var numbers = shuffle(Numbers());

    var columns = [];
    for (var c = 0; c < 9; c++) {
        columns[c] = [];
    }

    var selectedNumbers = 0;
    var emptyColumns = 9;
    var index = 0;
    while (selectedNumbers !== 15) {
        var current = numbers.shift();
        var column = Math.floor((current - 1) / 10);
        if (emptyColumns !== 0) { //make sure we have at least one number in every column
            if (columns[column].length === 0) {
                columns[column].push(current);
                selectedNumbers++;
                numbers.splice(index, 1);
                emptyColumns--;
            }
        } else {
            if (columns[column].length < 3) { //we can have max 3 numbers in column
                columns[column].push(current);
                selectedNumbers++;
                numbers.splice(index, 1);
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

    return columns;
}

function columnsToRows(columns) {
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
    this.rows = columnsToRows(generateColumns());
}

module.exports = Ticket;
