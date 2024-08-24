import axios from 'axios';
import DOMPurify from 'dompurify';
import {
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow
} from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import zxcvbn from 'zxcvbn';
import './Styles.css';



export default function Register() {



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

 

  const handleFormSubmit = async () => {
    try {
      // Validate form fields
      const validationErrors = {};
  
      if (!formData.username) {
        validationErrors.user = 'Username is required';
      } else if (formData.username.length < 3) {
        validationErrors.user = 'Username must be at least 3 characters long';
      }
  
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
  

  const push = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:3001/user/register', {
            email: DOMPurify.sanitize(formData.email), // Sanitize email before sending
            password: DOMPurify.sanitize(password), // Sanitize password before sending
            username: DOMPurify.sanitize(username), // Sanitize username before sending

          
        });

        if (response) {
           if (response.status === 201) {
              console.log('User registered successfully');
              alert('User registered successfully');
              const sessionID = response.data.sessionID;
              sessionStorage.setItem('sessionID', sessionID);
          }
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
              {errors.user && <div className="text-danger">{errors.user}</div>}
              <MDBInput
                wrapperClass='mb-4'
                label='username'
                id='formControlLg'
                type='name'
                size="lg"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />

              {errors.email && <div className="text-danger">{errors.email}</div>}
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
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
                value={formData.password}
                onChange={handlePasswordChange}
              />





              <Button
                variant="primary"
                size="lg"
                type="submit"

                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}

                className="custom-button2"
              // Add type="submit" to the button
              >
                Register
              </Button>

              <br />
              <br />
              <a href='/login'><Button
                variant="primary"
                size="md"

                style={{

                  background:
                    'linear-gradient(to right, rgba(118, 75, 162, 0.7, rgba(101, 126, 234, 0.7)',
                }}

                className="custom-button2"
              // Add type="submit" to the button
              >
                Login instead
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

