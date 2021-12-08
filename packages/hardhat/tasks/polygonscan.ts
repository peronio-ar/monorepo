/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { task } from 'hardhat/config';

task('polygonscan', 'Verify contract on Polyscan').setAction(
  async (_a, { network, deployments, getNamedAccounts, run }) => {
    if (network.name != 'matic') {
      console.warn(
        'You are running the faucet task with Hardhat network, which' +
          'gets automatically created and destroyed every time. Use the Hardhat' +
          " option '--network localhost'"
      );
    }

    const peronioAddress = (await deployments.get('Peronio')).address;
    const factoryAddress = (await deployments.get('Factory')).address;
    const routerAddress = (await deployments.get('Router')).address;
    const { deployer } = await getNamedAccounts();

    console.info('Publishing Peronio to Polygonscan');
    try {
      await run('verify:verify', {
        address: peronioAddress,
        constructorArguments: [
          process.env.TOKEN_NAME,
          process.env.TOKEN_SYMBOL,
          process.env.USDT_ADDRESS,
          process.env.AMUSDT_ADDRESS,
          process.env.LENDING_POOL_ADDRESS,
        ],
      });
    } catch (e) {
      console.error(e.reason);
    }

    console.info('Publishing Uniswap Factory to Polygonscan');
    try {
      await run('verify:verify', {
        address: factoryAddress,
        constructorArguments: [deployer],
      });
    } catch (e) {
      console.error(e.reason);
    }

    console.info('Publishing Uniswap Router to Polygonscan');
    try {
      await run('verify:verify', {
        address: routerAddress,
        constructorArguments: [
          factoryAddress,
          '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
        ],
      });
    } catch (e) {
      console.error(e.reason);
    }
  }
);
