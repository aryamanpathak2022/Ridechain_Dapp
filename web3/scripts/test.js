const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Connect to local Hardhat node
const web3 = new Web3('http://127.0.0.1:8545');

// Path to the RideContract JSON file
const rideContractPath = path.resolve(__dirname, './artifacts/contracts/RideContract.sol/RideContract.json');

// Read the JSON file
const rideContractJson = JSON.parse(fs.readFileSync(rideContractPath, 'utf8'));

// Extract the ABI
const rideContractABI = rideContractJson.abi;

// Replace this with the actual address after deploying your contract
const rideContractAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'; // Example address from your output

// Create a contract instance
const rideContract = new web3.eth.Contract(rideContractABI, rideContractAddress);

async function requestRide(fare) {
  // Get the list of accounts from the local node
  const accounts = await web3.eth.getAccounts();

  // Interact with the contract
  const result = await rideContract.methods.requestRide(fare).send({ from: accounts[0] });
  console.log(result);
}

// Replace 1000 with the fare amount you want to test
requestRide(1000);
