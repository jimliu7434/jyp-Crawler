const config = require('./config');
const BuyUpperBound = Number(config.jpy.buyUpperBound) || 0;
const SellLowerBound = Number(config.jpy.sellLowerBound) || 0;
const logger = require('./util/logger');
const sendJPYRequest = require('./util/request.jpy.js');
const chr = require('cheerio');

const findBuyNode = (node) => {
    if (node.attribs && node.attribs["data-table"] === "本行現金買入") {
        return node;
    }
    else if (node.next) {
        return findBuyNode(node.next);
    }
    else {
        return undefined;
    }
};

const findBuyPrice = ($, node) => {
    let priceNode = findBuyNode(node);
    if (priceNode) {
        let text = $(priceNode).text().trim();
        return Number(text);
    }
    else {
        return undefined;
    }
};

const findSellNode = (node) => {
    if (node.attribs && node.attribs["data-table"] === "本行現金賣出") {
        return node;
    }
    else if (node.next) {
        return findSellNode(node.next);
    }
    else {
        return undefined;
    }
};

const findSellPrice = ($, node) => {
    let priceNode = findSellNode(node);
    if (priceNode) {
        let text = $(priceNode).text().trim();
        return Number(text);
    }
    else {
        return undefined;
    }
};

const getJPYPrice = async (buyOverCb, sellOverCb) => {
    let html = await sendJPYRequest();
    if (!html)
        logger.log('html is empty');

    let $ = chr.load(html.data);

    let time = $('.time')[0];
    if (time) {
        logger.log($(time).text());
    }

    let jpy = $('td').filter((idx, node) => {
        return $(node).text().trim().indexOf('JPY') >= 0;
    });
    if (jpy) {
        let buy = findBuyPrice($, jpy[0]);
        let sell = findSellPrice($, jpy[0]);
        if (buy) {
            logger.log(`BUY  Price: ${buy} JPY/1NTD`);
            if(buy >= BuyUpperBound) {
                buyOverCb(buy, BuyUpperBound);
            }
        }
        if (sell) {
            logger.log(`SELL Price: ${sell} JPY/1NTD`);
            if(sell <= SellLowerBound) {
                sellOverCb(sell, SellLowerBound);
            }
        }
    }
};

module.exports = getJPYPrice;