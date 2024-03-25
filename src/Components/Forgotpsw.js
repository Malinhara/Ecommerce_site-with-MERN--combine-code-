import { sendPasswordResetEmail } from 'firebase/auth';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { auth } from '../firebase';

export default function Forgotpsw() {
    const [formData, setFormData] = useState({
      email: '',
      newPassword: '',
    });
  
    const [errors, setErrors] = useState({
      email: '',
      newPassword: '',
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const validationErrors = {};
      setErrors(validationErrors);
  
      if (!formData.email) {
        validationErrors.email = 'Email is required';
      }
  
      if (!formData.newPassword) {
        validationErrors.newPassword = 'New password is required';
      }
  
      if (Object.keys(validationErrors).length === 0) {
        try {
          // Send password reset email to the provided email
          await sendPasswordResetEmail(auth, formData.email);
  
          alert('Password reset email sent. Please check your email to update your password.');
        } catch (error) {
          console.error('Password reset error:', error.message);
          alert(`Password reset error: ${error.message}`);
        }
      }
    };
  
    return (
      <div>
       <MDBContainer fluid className="p-3 my-5"><br></br>
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </MDBCol>
          <MDBCol col='4' md='6'>
              <form onSubmit={handleSubmit}>
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
                  

                  <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  style={{
                    marginRight: '10px',
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2"
                >
                  Send Verification Code
                </Button><br></br><br></br>

                 <MDBInput
                  wrapperClass='mb-4'
                  label='Verification Code'
                  id='formControlLg'
                  type='password'
                  size="lg"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
  
                <MDBInput
                  wrapperClass='mb-4'
                  label='New Password'
                  id='formControlLg'
                  type='password'
                  size="lg"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
  
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  style={{
                    marginRight: '10px',
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2"
                >
                  Submit
                </Button>
              </form>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>
    );
  }