# Poof.cash interface

## Requirements

```
node v12.22.0
yarn
```

## Running the application

Alfajores

```
yarn start:alfajores
```

Mainnet

```
yarn start
```

## Production build

Alfajores

```
yarn run build:alfajores
```

Mainnet

```
yarn run build
```

Will generate a production build in `build/`

## Deploying on IPFS

After generating a build, add the `build/` directory to any IPFS node

## Listing your relayer

If you would like to be listed in the Poof.cash UI relayer's dropdown option, please do the following per chain (mainnet | alfajores):

1. Setup a [Poof.cash relayer node](https://github.com/poofcash/poof-relayer)
2. Try using your custom relayer in the UI
3. Create a PR updating the `RELAYERS` field in `src/config.ts`
4. In the PR, include:

- your relayer URL
- withdrawal tx hash

Please choose your relayer's fee wisely.

Disclaimer: Please consult with legal and tax advisors regarding the compliance of running a relayer service in your jurisdiction. The authors of this project bear no responsibility.

USE AT YOUR OWN RISK.
