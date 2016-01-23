var numbers = [];
var n = 0;
while (++n <= 90) {
    numbers.push(n);
}
var columns = {};
for (var c = 1; c <= 9; c++) {
    columns["col" + c] = [];
}

selectedNumbers = 0;
emptyColumns = 9;

while (selectedNumbers !== 15) {
    var index = Math.floor(Math.random() * numbers.length);
    var current = numbers[index];
    var column = "col" + Math.ceil(current / 10);
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

function addNumberToTicket(column, number) {
    columns[column].push(number);
    selectedNumbers++;
    numbers.splice(index, 1);
}
function Ticket() {
    this.columns = columns;
}

module.exports = Ticket;