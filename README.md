# DefiLlama APY Server

## How to list a new protocol

1. Fork this repository
2. Create a new folder within [src/adaptors/](src/adaptors/) with your protocol name (use your project `slug` from `https://api.llama.fi/protocols`)
3. Write an adaptor for your protocol (tutorial below)
4. Test your adaptor by running `node src/adaptors/test.js src/adaptors/YOUR_ADAPTOR/index.js` (remember to install dependencies with `npm i` first!)
5. Submit a PR

### Adaptors

An adaptor is just a javascript file that exports an async function that returns an array of objects that represent pools of a protocol. The pools follow the following schema (all values are just examples):

```js
{
    pool: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae90xb53c1a33016b2dc2ff3653530bff1848a515c8c5", // unique identifier for the pool
    chain: "Ethereum", // chain where the pool is
    project: 'aave', // protocol (using the slug again)
    symbol: "USDT", // symbol of the tokens in pool, can be a single symbol if pool is single-sided or multiple symbols (eg: USDT-ETH) if it's an LP
    tvlUsd: 1000.1, // number representing current USD TVL in pool
    apy: 1.2, // current APY of the pool in %
  };
```

An example of the most basic adaptor is the following for Anchor on terra:

```js
const utils = require('../utils');

const poolsFunction = async () => {
  const apyData = await utils.getData(
    'https://api.anchorprotocol.com/api/v1/market/ust'
  );
  const dataTvl = await utils.getData(
    'https://api.anchorprotocol.com/api/v1/deposit'
  );

  const ustPool = {
    pool: 'terra1hzh9vpxhsk8253se0vv5jj6etdvxu3nv8z07zu',
    chain: utils.formatChain('terra'),
    project: 'anchor',
    symbol: utils.formatSymbol('UST'),
    tvlUsd: Number(dataTvl.total_ust_deposits) / 1e6,
    apy: apyData.deposit_apy * 100,
  };

  return [ustPool]; // Anchor only has a single pool with APY
};

module.exports = {
  timetravel: false,
  apy: poolsFunction,
};
```

You can find examples for a bunch of other protocols in the [src/adaptors/](src/adaptors/) folder, and if you have any questions feel free to ask them on [our discord](https://discord.gg/defillama).

## Running the server

This is not needed if you just want to contribute an a new protocol through an adapter, only needed if you want to fork defillama.

### set api keys in config.env

```
ETHERSCAN=
FANTOMSCAN=
POLYGONSCAN=
SNOWTRACE=
ARBISCAN=
OPTIMISM=
INFURA_CONNECTION=
```
