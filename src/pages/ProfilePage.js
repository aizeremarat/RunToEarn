// src/pages/ProfilePage.js
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import profilePic from '../assets/McLovin.jpg';
import Web3 from 'web3';
import { Link } from 'react-router-dom';
import CoordinateGenerator from '../utils/CoordinateGenerator';
import '../styles/styles.css';

const ProfilePage = ({ runToEarnContract }) => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
  });

  const [totalDistance, setTotalDistance] = useState('Loading...');
  const [totalRewards, setTotalRewards] = useState('Loading...');
  const [formattedLastActivityTimestamp, setFormattedLastActivityTimestamp] = useState('');
  const [distanceInput, setDistanceInput] = useState('');
  const [account, setAccount] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [destinationCoordinates, setDestinationCoordinates] = useState(null);
  const [startCoordinates, setStartCoordinates] = useState(null);
  const [currentCoordinates, setCurrentCoordinates] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  

  const web3 = useMemo(() => new Web3(window.ethereum), []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${account}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUserInfo({
          name: data.user.name,
          dateOfBirth: new Date(data.user.dateOfBirth).toLocaleDateString(),
          gender: data.user.gender,
          height: data.user.height,
          weight: data.user.weight,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    

    if (account) {
      fetchUserInfo();
    }
  }, [account]);

  const fetchStats = useCallback(async () => {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    setAccount(userAddress);

    try {
      const stats = await runToEarnContract.methods.getUserStats(userAddress).call();
      setTotalDistance(stats[0].toString());
      setTotalRewards(stats[1].toString());

      // Format the timestamp
      const lastActivity = parseInt(stats[2].toString());
      const formattedTimestamp = new Date(lastActivity * 1000).toLocaleString();
      setFormattedLastActivityTimestamp(formattedTimestamp);
    } catch (error) {
      console.error("Error fetching stats: ", error);
    }
  }, [web3, runToEarnContract]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const navigate = useNavigate(); // Initialize navigate

    const handleEditProfile = () => {
        navigate('/user-info'); // Redirect to UserInfoForm page
    };


const logActivity = async () => {
  if (!distanceInput || !destinationCoordinates) {
    return alert("Please enter a distance and select a destination.");
  }

  try {
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    const { latitude, longitude } = destinationCoordinates;

    await runToEarnContract.methods.logActivity(distanceInput, latitude, longitude).send({ from: userAddress });

    await fetch("http://localhost:5000/api/run-history/log-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAddress,
        distance: distanceInput,
        latitude,
        longitude,
      }),
    });

    const newTotalDistance = parseInt(totalDistance) + parseInt(distanceInput);
    const newRewards = newTotalDistance * 10;

    setTotalDistance(newTotalDistance.toString());
    setTotalRewards(newRewards.toString());

    alert(`Logged ${distanceInput} km at (${latitude}, ${longitude})! You earned ${newRewards} RunToken.`);
  } catch (error) {
    console.error("Error logging activity:", error);
    alert("Failed to log activity.");
  }

  setDistanceInput('');
  setIsRunning(false);
  setDestinationCoordinates(null);
};


  useEffect(() => {
    document.title = "Profile - FitTrack";
  }, []);

  
  // Constants for step and calorie calculations per kilometer
const STEPS_PER_KM = 1429;
const CALORIES_PER_KM = 35;
const AVERAGE_HEIGHT_CM = 170; // default height if user height is not available
const AVERAGE_WEIGHT_KG = 70;  // default weight if user weight is not available

const height = userInfo.height || AVERAGE_HEIGHT_CM; 
const weight = userInfo.weight || AVERAGE_WEIGHT_KG; 

// Number of Steps
const numberOfSteps = totalDistance > 0 ? Math.round(totalDistance * STEPS_PER_KM) : 0;

// Calories Burned
const caloriesBurned = totalDistance > 0 ? Math.round(totalDistance * CALORIES_PER_KM) : 0;

// BMI Calculation
const heightInMeters = height / 100; 
const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

 // Function to get the current location of the user
 const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCoordinates({ latitude, longitude });
      },
      (error) => {
        console.error("Error getting location: ", error);
        setCurrentCoordinates({ latitude: 0, longitude: 0 }); 
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};

const startRun = () => {
  navigator.geolocation.getCurrentPosition(position => {
      const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
      };
      setStartCoordinates(currentLocation);
      setCurrentCoordinates(currentLocation);
      setIsRunning(true);

      const id = setInterval(() => {
          const newCoordinates = CoordinateGenerator.generateCoordinates(0.5, currentLocation); // 50m radius
          setCurrentCoordinates(newCoordinates);
      }, 15000); // 15 seconds
      setIntervalId(id);
  });
};

const stopRun = () => {
  clearInterval(intervalId);
  setIntervalId(null);
  setIsRunning(false);

  // Calculate the distance between start and current (end) coordinates
  if (startCoordinates && currentCoordinates) {
      const distance = CoordinateGenerator.calculateDistance(startCoordinates, currentCoordinates);
      setDistanceTraveled(distance);
      console.log(`Total distance traveled: ${distance.toFixed(2)} km`);
  }
};

useEffect(() => {
  // Cleanup interval if component unmounts
  return () => {
      if (intervalId) clearInterval(intervalId);
  };
}, [intervalId]);

return (
  <div className="profile-page">
    {/* Navbar */}
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="FitTrack Logo" className="logo-image" />
        <span>RunToEarn</span>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/activity" className="nav-item">Activity</Link>
        <button className="learn-more-btn">Learn more</button>
      </div>
    </nav>

    {/* Profile Section */}
    <section className="profile-section">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Track and update your personal fitness goals, progress, and account details here.</p>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <img src={profilePic} alt="Profile" className="profile-picture" />
          <h2>{userInfo.name || "User"}</h2>
          <p className="user-email">MetaMask address: {account}</p>
          <div className="profile-details">
            <p>Date of Birth: <span>{userInfo.dateOfBirth}</span></p>
            <p>Gender: <span>{userInfo.gender}</span></p>
            <p>Height: <span>{userInfo.height} cm</span></p>
            <p>Weight: <span>{userInfo.weight} kg</span></p>
          </div>
          <button onClick={handleEditProfile} className="edit-profile-btn">Edit Profile</button>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <h3>Fitness Stats</h3>
          <div className="stats-cards">
            <div className="stat-card">
              <h4>Total Distance</h4>
              <p>{totalDistance}</p>
            </div>
            <div className="stat-card">
              <h4>Total Rewards</h4>
              <p>{totalRewards}</p>
            </div>
            <div className="stat-card">
              <h4>Last Activity Timestamp</h4>
              <p>{formattedLastActivityTimestamp}</p>
            </div>
            <div className="stat-card">
              <h4>Number of Steps</h4>
              <p>{numberOfSteps}</p>
            </div>
            <div className="stat-card">
              <h4>Calories Burned</h4>
              <p>{caloriesBurned}</p>
            </div>
            <div className="stat-card">
              <h4>BMI</h4>
              <p>{bmi}</p>
            </div>
          </div>
          <button onClick={fetchStats} id="get-stats-button" className="edit-profile-btn">Get Stats</button>
        </div>
      </div>

       {/* Starting Run Section */}
       <div className="running-section">
        <div className="run-card">
          <h3>Starting Run</h3>
          {/* Display the current coordinates */}
          <p>Current Coordinates: {currentCoordinates ? JSON.stringify(currentCoordinates) : 'Fetching coordinates...'}</p>
          <button
            onClick={() => {
              if (isRunning) {
                stopRun();
              } else {
                startRun();
              }
            }}
            className="run-button"
          >
            {isRunning ? 'Stop Run' : 'Start Run'}
          </button>
          <p>Distance Traveled: {distanceTraveled.toFixed(2)} km</p>
        </div>
      </div>
    </section>
  </div>
);

};

export default ProfilePage;