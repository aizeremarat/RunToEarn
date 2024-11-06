// src/contracts.js
import web3 from './web3';
import RunToken from './artifacts/RunToken.json'; 
import RunToEarn from './artifacts/RunToEarn.json'; 

const runTokenAddress = "0x0CcF6220914064E521e0575341d83dcD4968a106";
const runToEarnAddress = "0x46C922BD5e3fA39804836f9bC980059ff992BfA8";

const runToken = new web3.eth.Contract(RunToken.abi, runTokenAddress);
const runToEarn = new web3.eth.Contract(RunToEarn.abi, runToEarnAddress);

export { runToken, runToEarn };