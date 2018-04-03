Array.prototype.lasIndex = function (value) {
    let index = -1;
    this.map((item, i) => {
        if(item.indexOf(value) !== -1)
            index = i;
    });
    return index;
};

Array.prototype.index = function (value, start) {
    let index = -1;
    for (let i = start || 0; i < this.length; i++) {
        if (this[i].indexOf(value) !== -1) {
            return i;
        }
    }

    return index;
};