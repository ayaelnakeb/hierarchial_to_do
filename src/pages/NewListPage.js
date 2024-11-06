import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewListPage = () => {
  // State to hold the new list's name and any error messages
  const [listName, setListName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Navigation hook for route changes

  // Handle form submission for creating a new list
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log('Submitting list:', listName);

    // Retrieve token from local storage for authentication
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found. Please log in again.');
        setErrorMessage('You are not logged in. Please log in and try again.');
        // Optional: Uncomment the line below to automatically redirect to login
        // navigate('/login');
        return;
    }

    try {
        // Send POST request to create a new list on the server
        const response = await fetch('http://127.0.0.1:5000/create-list', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Attach token in headers for authorization
                'Content-Type': 'application/json', // Specify JSON content type
            },
            body: JSON.stringify({ name: listName }), // Send list name in request body
        });

        if (!response.ok) {
            const result = await response.json(); // Parse JSON response for error message
            throw new Error(result.message || 'Failed to create list.'); // Handle server error
        }

        // If request is successful, navigate to the home page
        navigate('/');
    } catch (error) {
        console.error('Failed to create the list:', error);
        setErrorMessage(error.message); // Display error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit} className='Login'>
      {/* Input field for entering the new list's name */}
      <input
        type="text"
        id="listName"
        required
        placeholder='Enter a new list name'
        value={listName}
        onChange={(e) => setListName(e.target.value)} // Update listName state on input change
      />
      <br />
      {/* Button to submit the form and create the list */}
      <button type="submit">Create List</button>
      {/* Display error message if there is one */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </form>
  );
};

export default NewListPage;
