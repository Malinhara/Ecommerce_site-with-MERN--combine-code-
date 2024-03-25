<<<<<<< HEAD
import axios from 'axios';
import DOMPurify from 'dompurify';
import {
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
=======
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
import Button from 'react-bootstrap/Button';
import { auth, firestore } from '../firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [address, setaddress] = useState('');
  const [nic, setNic] = useState(null);
  const [Name, setName] = useState('');
  const [categorie,setcategorie]=useState('');
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [selectedRole, setSelectedRole] = useState('Normaluser');
  

<<<<<<< HEAD

  const [sessionID, setSessionID] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    username: '',
  });


  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const strength = zxcvbn(formData.password);
    const score = strength.score;
    if (score >= 3) {
      // Password is strong enough, no errors
      setErrors({ ...errors, password: '' });
    } else {
      // Password is weak, show error
      setErrors({
        ...errors,
        password: 'Password is too weak. Add more flare!',
      });
    }

    setFormData({ ...formData, [name]: value });

  }


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({ ...formData, [name]: value });
  };

  const push = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:3001/register', {
        email: DOMPurify.sanitize(formData.email), // Sanitize email before sending
        password: DOMPurify.sanitize(password), // Sanitize password before sending
        username: DOMPurify.sanitize(username), // Sanitize username before sending
      });
  
      if (response.status === 400) {
        // If the email already exists, log the message
        console.log('Email already exists');
      } else if (response.status === 201) {
        // If the registration is successful, log the message
        console.log('User registered successfully');
        const sessionID = response.data.sessionID;
        sessionStorage.setItem('sessionID', sessionID);
        // Assuming backend returns some data
        // Handle response if necessary
      } else {
        // Handle other status codes if needed
        console.log('Registration failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };
  

 // Function to handle form submission
const handleFormSubmit = async () => {
  try {
    // Validate form fields
    const validationErrors = {};

    if (!formData.username) {
      validationErrors.user = 'Username is required';
    } else if (formData.username.length < 3) {
      validationErrors.user = 'Username must be at least 3 characters long';
=======
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };
  const vote="null"
  const validateDisplayName = () => {
    return !/\d/.test(displayName);
  };

  const validatePassword = () => {
    const minLength = 8;
    const containsLetters = /[a-zA-Z]/.test(password);
    const containsNumbers = /\d/.test(password);

    return password.length >= minLength && containsLetters && containsNumbers;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!validateDisplayName()) {
      alert('Display name must contain non-numeric characters.');
      return;
    } else if (!validatePassword()) {
      alert('Password must be at least 8 characters long and contain both letters and numbers.');
      return;
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
    }
  
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Wait for the user creation to be completed before updating Firestore
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Upload image to Firebase Storage
      const storageInstance = getStorage();
      const storageInstance1 = getStorage();
      const imageRef = ref(storageInstance, `Admin-images/${user.uid}`);
      const imageRef1 = ref(storageInstance1, `competition-logo/${user.uid}`);
      await uploadBytes(imageRef, image);
      await uploadBytes(imageRef1, image1);
  
      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(imageRef);
      const imageUrl1 = await getDownloadURL(imageRef1);
      console.log('Email:', email);
      console.log('DisplayName:', displayName);
      console.log('NIC:', nic);
      console.log('Image URL:', imageUrl);
      
      if (selectedRole==='Admin'){
      // Update user profile with email, display name, NIC, and image URL
      await setDoc(doc(firestore, 'Admins',user.uid), {
        email: email,
        displayName: displayName,
        nic: nic,
        Submitdate:serverTimestamp(),
        vote_status:vote,
        Role:selectedRole,
        image:imageUrl,
        imagelogo:imageUrl1,
        address:address,
        Competition_name:Name,
        Competition_cat:categorie,

<<<<<<< HEAD
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else {
      const strength = zxcvbn(formData.password);
      const score = strength.score;
      if (score < 3) {
        // Password is weak, show error
        validationErrors.password = 'Password is too weak. Add more flare!';
      }
    }

    // Set validation errors
    setErrors(validationErrors);

    // If no validation errors, call the push function
    if (Object.keys(validationErrors).length === 0) {
      await push(formData.username, formData.password,formData.email);
    }
  } catch (error) {
    console.error('Error occurred while submitting the form:', error);
    // Handle error if needed
  }
};

// Original handleSubmit function
const handleSubmit = (e) => {
  e.preventDefault();
  // Call handleFormSubmit function
  handleFormSubmit();
};
=======
      });
    }
    else{
      await setDoc(doc(firestore, 'Nusers',user.uid), {
        email: email,
        vote_status:vote,
        Role:selectedRole,
        Submitdate:serverTimestamp(),
        

      });
    }
  
      alert('Signup successful!');
      console.log('Signup successful!');
    } catch (error) {
      console.error('Signup error:', error.message);
      alert(`Signup error: ${error.message}`);
    }
  };
  
  
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

<<<<<<< HEAD
useEffect(() => {
  const storedSessionID = sessionStorage.getItem('sessionID');
  setSessionID(storedSessionID);
}, []);
=======
  const handlelogo = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00

  const handlecategorie =(e)=>{
    setcategorie(e.target.value);
  }

  return (
    <div>
      <br></br>
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone imagefd"
            />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <form onSubmit={handleSignup}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
             
             
                 
        <label htmlFor="Role">Choose Role:</label>
        <select name="Role" id="Role" onChange={handleRoleChange} value={selectedRole}>
        <option value="Normaluser">Normal User</option>
        <option value="Admin">Admin</option>
        </select>
        <br></br>
        {selectedRole === 'Admin' && (
        <div><br></br>
         
       <MDBInput
       wrapperClass='mb-4'
       label='NIC'
       id='formControlLg'
       type='text'
       size="lg"
       name="NIC"
       value={nic}
       onChange={(e) => setNic(e.target.value)}
       
     />

               <MDBInput
                wrapperClass='mb-4'
                label='Display name'
                id='formControlLg'
                type='text'
                size="lg"
                name="DisplayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                
              />

               <MDBInput
                wrapperClass='mb-4'
                label='Address'
                id='formControlLg'
                type='text'
                size="lg"
                name="address"
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                
              />
               <h6>Utility Bill Image</h6>
               <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                required
              /><br></br><br></br>

                <h6>Competition Logo</h6>
                <input
                type="file"
                onChange={handlelogo}
                accept="image/*"
                required
              />
              <br></br><br></br>
              <h6>Competition Categorie</h6>
            <Form.Select aria-label="Default select example"
            value={categorie}
            onChange={handlecategorie}>
            <option>Open this select menu</option>
            <option value="Realityshow">Realityshow</option>
            <option value="Oraganization">Organization</option>
      
            </Form.Select>
           <br></br><br></br> 

            <MDBInput
                wrapperClass='mb-4'
                label='Competition Name'
                id='formControlLg'
                type='text'
                size="lg"
                name="DisplayName"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                
               />
               </div>
      
              )}

            <br></br>  
         {selectedRole === 'Normaluser' && (   
            <button>
             <FontAwesomeIcon icon={faEnvelope} /> Open Gmail
            </button>

            )}
             
            <br></br> 
         
              <Button
                variant="primary"
                size="lg"
                type="submit"
<<<<<<< HEAD
               
=======
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Register
              </Button>
              <br />
              <br />
<<<<<<< HEAD
              <a href='/login'><Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                style={{

                  background:
                    'linear-gradient(to right, rgba(118, 75, 162, 0.7, rgba(101, 126, 234, 0.7)',
                }}

                className="custom-button2"
              // Add type="submit" to the button
              >
                Login instead
              </Button></a>
=======
              <a href='/login'>
                <Button
                  variant="primary"
                  size="md"
                  style={{
                    background:
                      'linear-gradient(to right, rgba(118, 75, 162, 0.7), rgba(101, 126, 234, 0.7)',
                  }}
                  className="custom-button2"
                >
                  Login instead
                </Button>
              </a>
>>>>>>> f78ef88fcfbbcda6c69a983ee0d84b5b71373e00
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
