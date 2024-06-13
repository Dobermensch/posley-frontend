# Posley Swap Frontend

## Getting started

1. Have contracts from backend repo running and deployed to Hardhat node
2. Clone this repo
3. `cd` into this repo & run `npm i` (have node installed)
4. Change contract addresses to hardhat deployed addresses in `Contracts` variable in `/src/app/constants.ts`
5. Run `npm run dev`
6. Head to `http://localhost:3000`
7. Hire me

### Things to note

The Pyth Price feed IDs are current mock IDs. When deploying on mainnet, those will need to change in `src/app/constants.ts`. Having said that, I've removed support for ETH mainnet as this project is for demonstration purposes only but it can easily be added back.
