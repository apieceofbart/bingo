function Numbers() {
    this.getNumbers = function() {
        var numbers = [];
        var n = 0;
        while (++n <= 90) {
            numbers.push(n);
        }
        return numbers;
    }
}

module.exports = Numbers;
