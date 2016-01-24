function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
    return arr;
}

module.exports = shuffle;
