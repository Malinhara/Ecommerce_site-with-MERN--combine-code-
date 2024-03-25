// Login.js

import {
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';


import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Styles.css';
import axios from 'axios';
import DOMPurify from 'dompurify';



export default function Login() {


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

<<<<<<< HEAD

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
=======
  const validateEmail = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
  };

  const validatePassword = () => {
    const minLength = 8;
    return password.length >= minLength;
  };

  let navigate = useNavigate(); // Use useNavigate for programmatic navigation


  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< HEAD

    // Validate email and password fields
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = 'email is required';
=======
  
    if (!validateEmail()) {
      alert('Invalid email address');
      return;
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
    }
  
    if (!validatePassword()) {
      alert('Password must be at least 8 characters long');
      return;
    }
<<<<<<< HEAD


    // Set validation errors if any
    setErrors(validationErrors);

    // If no validation errors, you can proceed with form submission logic
    if (Object.keys(validationErrors).length === 0) {
      // Add your logic here, e.g., send the form data to a server
      alert(formData.email + " " + formData.password)
      checkdetails(formData.email, formData.password);
    }
  };

  const checkdetails = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: DOMPurify.sanitize(formData.email), // Sanitize email before sending
        password: DOMPurify.sanitize(password), // Sanitize password before sending
      });
  
      // Check if the response status code is OK (200)
      if (response.status === 200) {
        // If the login is successful, navigate to the home page
        window.location.href = '/home'; // Change '/home' to the appropriate URL of your home page
      } else {
        // Handle other status codes if needed
        console.log('Login failed:', response.statusText);
      }
    } catch (error) {
      // Handle any errors that occur during the request
      console.error('Error logging in:', error);
=======
  
    try {
      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
      // Get additional user info, assuming user data is stored in Firestore
      const user = userCredential.user;
  
      // Check if the user is an admin or a normal user
      const isAdmin = await checkUserRole('Admins', user.uid);
      const isNormalUser = await checkUserRole('Nusers', user.uid);
  
      if (isAdmin) {
        // Redirect to admin panel
        navigate('/Adminpannel');
      } else if (isNormalUser) {
        // Redirect to the home page for normal users
        navigate('/home');
      } else {
        console.error('User role not found');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      alert(`Login error: ${error.message}`);
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
    }
  };
  
  // Function to check the user role in a specific collection
  const checkUserRole = async (collectionName, userId) => {
    try {
      const userDocRef = doc(collection(firestore, collectionName), userId);
      const userDoc = await getDoc(userDocRef);
  
      return userDoc.exists();
    } catch (error) {
      console.error('Error checking user role:', error.message);
      return false;
    }
  };
  

  return (
    <div>
      <MDBContainer fluid className="p-3 my-5"><br></br>
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" className="img-fluid" alt="Phone image" />
          </MDBCol>

          <MDBCol col='4' md='6'>
<<<<<<< HEAD


            <form onSubmit={handleSubmit}>
              
            {errors.email && <div className="text-danger">{errors.email}</div>}
              <MDBInput
                wrapperClass='mb-4'
                label='email'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                required={true}
                value={formData.email}
                onChange={handleInputChange}
              />
              
              {errors.password && <div className="text-danger">{errors.password}</div>}
=======
            <form onSubmit={handleLogin}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email'
                id='formControlLg'
                type='email'
                size="lg"
                name="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} required />

>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} required />
            

               <button>
             <FontAwesomeIcon icon={faEnvelope} /> Open Gmail
            </button>
            <br></br><br></br>
              <Button
                variant="primary"
                size="lg"
                className="custom-button2"
                type="submit"
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}>
                Login
              </Button>

              <br></br>
              <br></br>
             
              <a href='/Forgotpassword'><p>Forgot Password ?</p></a>
              <p>Don't have an account yet?</p>
              <a href='/register'>
                <Button
                  variant="primary"
                  size="md"
                  style={{
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2">
                  Create an account
                </Button>
              </a>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
