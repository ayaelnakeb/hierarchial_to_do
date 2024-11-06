import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
    // State for username, password, and error message
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // For navigating to different routes

    // Handle form submission for signup
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission
        setErrorMessage(''); // Clear any existing error message

        try {
            // Send POST request to signup endpoint with username and password
            const response = await fetch('http://127.0.0.1:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),  // Send user data in request body
            });

            if (response.ok) {
                // Redirect to login page if signup is successful
                navigate('/login');
            } else {
                // Handle different error responses from the server
                const result = await response.json();
                if (response.status === 409) {
                    // Error for username already existing
                    setErrorMessage('Username already exists. Please choose another one.');
                } else if (response.status === 400) {
                    // Error for missing username or password
                    setErrorMessage('Please provide both username and password.');
                } else {
                    // General error message for other response statuses
                    setErrorMessage(result.message || 'Signup failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error during signup:', error);  // Log any fetch errors
            // Error message for network issues or other fetch errors
            setErrorMessage('The signup attempt failed. Please try again later.');
        }
    };

    return (
        <div className='Login'>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className='form'>
                {/* Input field for username */}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                {/* Input field for password */}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <button type="submit">Sign Up</button>  {/* Submit button */}
            </form>
            {/* Display error message if it exists */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="signup-prompt">
                <p>Already have an account? <a href="/login">Sign In</a></p>  {/* Link to login page */}
            </div>
        </div>
    );
}

export default Signup;
