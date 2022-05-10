const utils = require('../utils');

const baseUrl = 'https://vjeieiw4tf.execute-api.us-east-1.amazonaws.com';

const urls = {
  ethereum: `${baseUrl}/apy`,
  binance: `${baseUrl}/apy?chainId=56`,
  fantom: `${baseUrl}/apy?chainId=250`,
  polygon: `${baseUrl}/apy?chainId=137`,
  avalanche: `${baseUrl}/apy?chainId=43114`
};

const buildPool = (entry, chainString) => {
  const newObj = {
    pool: entry.vault_address,
    chain: utils.formatChain(chainString),
    project: 'mushrooms-finance',
    symbol: utils.formatSymbol(entry.token_name),
    tvlUsd: entry.liquidity_locked,
    apy: entry.apy * 100,
  };
  return newObj;
};

const topLvl = async (chainString) => {
  // pull data
  let data = (await utils.getData(urls[chainString])).result.vaults;

  // build pool objects
  data = data.map((el) => buildPool(el, chainString));

  return data;
};

const main = async () => {
  const data = await Promise.all([
    topLvl('ethereum'),
    topLvl('binance'),
    topLvl('fantom'),
    topLvl('polygon'),
    topLvl('avalanche')
  ]);

  return data.flat();
};

module.exports = {
  timetravel: false,
  apy: main,
};
