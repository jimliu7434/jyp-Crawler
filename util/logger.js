const getNowStr = () => {
    let nw = new Date();
    return `${nw.getFullYear()}-${nw.getMonth() <= 8 ? '0' : ''}${nw.getMonth() + 1}-${nw.getDate() <= 9 ? '0' : ''}${nw.getDate()} ${nw.getHours() <= 9 ? '0' : ''}${nw.getHours()}:${nw.getMinutes() <= 9 ? '0' : ''}${nw.getMinutes()} | `
};

const logger = {
    debug: (...args) => {
        console.debug(getNowStr(), ...args);
    },

    log: (...args) => {
        console.log(getNowStr(), ...args);
    },

    error: (...args) => {
        console.error(getNowStr(), ...args);
    },
};

module.exports = logger;