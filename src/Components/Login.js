import {
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

import axios from 'axios';
import DOMPurify from 'dompurify';
import './Styles.css';


export default function Login() {


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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate email and password fields
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = 'email is required';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required';
    }


    // Set validation errors if any
    setErrors(validationErrors);

    // If no validation errors, you can proceed with form submission logic
    if (Object.keys(validationErrors).length === 0) {
      // Add your logic here, e.g., send the form data to a server
      alert(formData.email + " " + formData.password)
      push(formData.email, formData.password);
    }
  };

  const push = async (email,password) => {
    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        email: DOMPurify.sanitize(formData.email), // Sanitize email before sending
        password: DOMPurify.sanitize(password) // Sanitize password before sending
         // Sanitize email before sending
      });
  
    if (response.status === 201) {
        // If the registration is successful, log the message
        console.log(response);
        alert('User registered successfully');
        const sessionID = response.data.sessionID;

        sessionStorage.setItem('userEmail',formData.email);
        sessionStorage.setItem('sessionID', sessionID);
        sessionStorage.setItem('generatedCode', response.data.generatedCode);
        window.location.href = response.data.redirectTo;
      } 
      
    } catch (error) {
      if (error.response && error.response.status === 409) {
        const errorMessage = error.response.data.error;
        console.error('Error:', errorMessage);
        alert(`Error: ${errorMessage}`);
    } else {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
    }
      // Handle error
    }
  };
  

  return (


    <div>
      <MDBContainer fluid className="p-3 my-5">

        <MDBRow>

          <MDBCol col='10' md='6'>
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg" class="img-fluid"
              alt="Phone imagefd" />
          </MDBCol>

          <MDBCol col='4' md='6'>


            <form onSubmit={handleSubmit}>
              
            {errors.email && <div className="text-danger">{errors.email}</div>}
              <MDBInput
                wrapperClass='mb-4'
                label='email'
                id='formControlLg'
                type='name'
                size="lg"
                name="email"
                required={true}
                value={formData.email}
                onChange={handleInputChange}
              />
              
              {errors.password && <div className="text-danger">{errors.password}</div>}
              <MDBInput
                wrapperClass='mb-4'
                label='Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="password"
                required={true}
                value={formData.password}
                onChange={handleInputChange}
              />


              <Button
                variant="primary"
                size="lg"

                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}

                className="custom-button2"
                type="submit" // Add type="submit" to the button
              >
                Login
              </Button>


              <br></br>
              <br></br>
              <br></br>
              <p>Don't have an account yet?</p>
              <a href='/register'><Button
                variant="primary"
                size="md"

                style={{
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}

                className="custom-button2"
              >
                Create an account
              </Button></a>
            </form>



            {/* <div className="d-flex justify-content-between mx-4 mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div> */}


          </MDBCol>

        </MDBRow>
        {/* <Routes>
     
      <Route exact path='/Dashboard' element={<Dashboard/>}></Route>
     
     
      </Routes> */}
      </MDBContainer></div>
  );
}

