// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import heroImage from '../assets/dashb.png';
import { Link, useNavigate } from 'react-router-dom';
import { runToEarn } from '../contracts'; 
import '../styles/styles.css';

function HomePage() {
  const [account, setAccount] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home - FitTrack";
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length) {
        setAccount(accounts[0]);
      }
    }
  };

  const connectMetaMask = async () => {
    if (typeof window.ethereum === 'undefined') {
      setErrorMessage('Install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setErrorMessage(''); 
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  const registerUser = async () => {
    if (!account) {
      setErrorMessage("Please sign in with MetaMask first");
      return;
    }

    try {
      await runToEarn.methods.registerUser().send({ from: account });
      setSuccessMessage("Registration was successful");
      setErrorMessage('');

      navigate('/user-info'); 
    } catch (error) {
      if (error.message.includes("User already registered")) {
        setErrorMessage("User already registered");
      } else {
        console.error("Error registering user:", error);
      }
    }
  };

  const handleSignIn = async () => {
    if (!account) {
      await connectMetaMask();
    } else {
      setSuccessMessage(`You are already logged in with ${account}`);
    }
  };

  return (
    <div className="home-page">
      <header>
        <nav className="navbar">
          <div className="logo">
            <img src={logo} alt="FitTrack Logo" className="logo-image" />
            <span>RunToEarn</span>
          </div>
          <div className="nav-links">
            <Link to="/activity" className="nav-item">Activity</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            <button className="learn-more-btn">Learn more</button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Run to Earn: Your Personal Running Companion</h1>
            <p>
              Track your stats in real-time, claim rewards based on your activity,
              and monitor your progress over time. All in one sleek, modern,
              and user-friendly interface.
            </p>
            <div className="action-buttons">
            {/* Step 1 */}
            <div className="button-container">
              <p className="step-text">Step 1: Connect to your Metamask wallet</p>
              <button id="metamask-connect-btn" className="metamask-btn" onClick={handleSignIn}>
                Connect Metamask
              </button>
              {/* Success and error messages */}
              {successMessage && (
                <p className="success-message">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}
            </div>

              {/* Step 2 */}
              <div className="button-container">
                <p className="step-text">Step 2: If you are new user, please Register</p>
                <button id="register-btn" className="register-btn" onClick={registerUser}>
                  Register
                </button>
              </div>

              {/* Profile link */}
              <div className="profile-link-container">
                <p className="profile-link-text">
                  Already have an account? <a href="/profile" className="profile-link">Go to the profile.</a>
                </p>
              </div>

            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Dashboard" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;