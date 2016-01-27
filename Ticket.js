var Numbers = require('./Numbers');
var shuffle = require('./shuffle');

function generateTicket() {

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

    //add blanks, so each column has 3 elements
    //additionaly make sure we have exactly 5 elements in each row
    var rows = columnsToRows(columns);



    while (nonNullLength(rows[0]) !== 5 || nonNullLength(rows[1]) !== 5 || nonNullLength(rows[2]) !== 5) {
        columns.map(function(column) {
            while (column.length < 3) {
                column.push(null);
            }
            column = shuffle(column);
        });

        rows = columnsToRows(columns);

    }

    return columnsToRows(sortColumns(columns));
}

function sortColumns(columns) {

    //assuming each column has 3 elements with at least 1 number
    return columns.map(function(col) {
        if (nonNullLength(col) === 3) {
            col = col.sort(function(a, b) {
                return a > b;
            })
        }
        if (nonNullLength(col) === 2) {
            //find null and see if we need to swap numbers
            var nullIndex = col.indexOf(null);
            var indexArr = [0, 1, 2];
            indexArr.splice(nullIndex, 1);
            if (col[indexArr[0]] > col[indexArr[1]]) {
                var temp = col[indexArr[0]];
                col[indexArr[0]] = col[indexArr[1]];
                col[indexArr[1]] = temp;
            }
        }

        return col;
    })
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

function nonNullLength(array) {
    return array.reduce(function(total, curr) {
        return total += (curr !== null)
    }, 0)
}

function Ticket() {
    this.rows = generateTicket();
}

module.exports = Ticket;
