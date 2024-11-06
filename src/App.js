// src/App.js
import React, { useMemo } from 'react';
import Web3 from 'web3'; // Import Web3
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Layout from './Layout'; 
import UserInfoForm from './pages/UserInfoForm';

const RUN_TO_EARN_ADDRESS = "0x46C922BD5e3fA39804836f9bC980059ff992BfA8";
const RUN_TO_EARN_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_runTokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "distance",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "rewards",
				"type": "uint256"
			}
		],
		"name": "ActivityLogged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "UserRegistered",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "MIN_TIME_BETWEEN_ACTIVITIES",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "REWARDS_PER_KM",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "distance",
				"type": "uint256"
			}
		],
		"name": "calculateRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserStats",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "distance",
				"type": "uint256"
			}
		],
		"name": "logActivity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "registerUser",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "runToken",
		"outputs": [
			{
				"internalType": "contract RunToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "users",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalDistance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRewards",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastActivityTimestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

function App() {
  const web3 = useMemo(() => new Web3(window.ethereum), []);
  
  // Create the runToEarnContract instance
  const runToEarnContract = useMemo(() => {
    return new web3.eth.Contract(RUN_TO_EARN_ABI, RUN_TO_EARN_ADDRESS);
  }, [web3]);


  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout navLinks={[
              { path: "/activity", label: "Activity" },
              { path: "/rewards", label: "Rewards" },
              { path: "/profile", label: "Profile" }
            ]}>
              <HomePage />
            </Layout>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <Layout navLinks={[
              { path: "/", label: "Home" },
              { path: "/activity", label: "Activity" },
              { path: "/rewards", label: "Rewards" }
            ]}>
              <ProfilePage runToEarnContract={runToEarnContract} /> {/* Pass the contract as a prop */}
            </Layout>
          } 
        />
        <Route 
          path="/user-info" 
          element={<UserInfoForm />} 
        />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;