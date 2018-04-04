/**
 * @description Encontra a última expressão de um valor
 * @param value - Valor a ser encontrado no array
 * **/
Array.prototype.lasIndex = function (value) {
    let index = -1;
    this.map((item, i) => {
        if(item.indexOf(value) !== -1)
            index = i;
    });
    return index;
};

/**
 * @description Encontra a primeira expressão de um valor
 * @param value - Valor a ser encontrado no array
 * @param start - índice que inicia a busca
 * **/
Array.prototype.index = function (value, start) {
    let index = -1;
    for (let i = start || 0; i < this.length; i++) {
        if (this[i].indexOf(value) !== -1) {
            return i;
        }
    }

    return index;
};