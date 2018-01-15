const sch = require('node-schedule');
const getJPY = require('./parser.jpy.js');
const logger = require('./util/logger');
const mailer = require('./util/mail');
const config = require('./config');

const BuyOverAction = (nwPrice, UpperBound) => {
    const cap = `JPY is High`;
    const msg = `$JPY (${nwPrice} JPY/1NTD) is VERY HIGH! SELL IT! (setting bound: ${UpperBound})`;
    logger.log(msg);
    mailer(cap, msg);
};

const SellOverAction = (nwPrice, LowerBound) => {
    const cap = `JPY is LOW`;
    const msg = `$JPY (${nwPrice} JPY/1NTD) is VERY LOW! BUY IT! (setting bound: ${LowerBound})`;
    logger.log(msg);
    mailer(cap, msg);
};

getJPY(BuyOverAction, SellOverAction);

sch.scheduleJob(config.jpy.schedule, () => {
    getJPY(BuyOverAction, SellOverAction);
});
