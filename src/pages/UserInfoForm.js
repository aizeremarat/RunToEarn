import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const UserInfoForm = () => {
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const getWalletAddress = async () => {
            if (window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setWalletAddress(accounts[0]);
                } catch (error) {
                    console.error("Could not retrieve wallet address:", error);
                }
            } else {
                console.warn("MetaMask is not installed.");
            }
        };

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${walletAddress}`); // Adjust API endpoint accordingly
                if (!response.ok) throw new Error('Failed to fetch user data');
                const data = await response.json();
                setName(data.name);
                setDateOfBirth(data.dateOfBirth);
                setGender(data.gender);
                setHeight(data.height);
                setWeight(data.weight);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        getWalletAddress();
        fetchUserData(); // Fetch user data on component mount
    }, [walletAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            name,
            dateOfBirth,
            gender,
            height,
            weight,
            walletAddress,
        };

        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Error registering user');
            }

            const data = await response.json();
            console.log(data.message);

            // Redirect to ProfilePage after successful submission
            navigate('/profile');
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="form-container">
            <h2>User Information</h2>
            <form className="user-info-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-input"
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="form-input"
                />
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="form-select"
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
                <input
                    type="number"
                    placeholder="Height (cm)"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="form-input"
                />
                <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="form-input"
                />
                <button type="submit" className="form-button">Submit</button>
            </form>
        </div>
    );
};

export default UserInfoForm;
