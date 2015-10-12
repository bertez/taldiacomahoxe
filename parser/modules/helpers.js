module.exports.sleep = (time) => {
    time = time ||  0;
    return new Promise((r) => {
        setTimeout(r, time * 1000);
    });
};

module.exports.capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};