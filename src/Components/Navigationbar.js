import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useLocation } from "react-router-dom";

import axios from 'axios';
import './Styles.css';

export default function Navigationbar() {
  const location = useLocation();

  // Hide navbar on the login page and Login page
 

  const logout = async () => {
    
  
    try {
      const response =await axios.post('http://localhost:3001/logout');
      // Redirect to login page or perform any other action after logout
      sessionStorage.removeItem('sessionID');
      window.location.href = '/home'; 
      // Change '/login' to the actual URL of your login page
      
      console.log(response.data.sessionID)

      alert("Log out")
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error if necessary
    }
  };


  return (
    <div>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" fixed="top">
        <Container fluid>
          <Navbar.Brand style={{ color: '#FFFFFF' }} href="#" className='logo'>Expert Mobile</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link className='Links' style={{ color: '#FFFFFF' }} href="/home">Home</Nav.Link>
              <Nav.Link className='Links' style={{ color: '#FFFFFF' }} href="/shop">Shop</Nav.Link>
              <Nav.Link className='Links' style={{ color: '#FFFFFF' }} href="/about">About</Nav.Link>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>

            {/* Add user dropdown menu with custom CSS */}
            <Dropdown align="end" style={{ marginLeft: '10px' }}>
              <Dropdown.Toggle variant="secondary" id="user-dropdown">
                User
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
                <Dropdown.Item href="/register">Register</Dropdown.Item>
                <Dropdown.Item href="/logout">Log out</Dropdown.Item>
                <Dropdown.Item href="/Orderstatus">Order Status</Dropdown.Item>
                <Dropdown.Item href="/Update">Edit Profile</Dropdown.Item>
                <Button variant="link" onClick={logout}>Log out</Button>
              </Dropdown.Menu>
            </Dropdown>

            <a href='/Cart'>
              <img
                className='cart'
                src="https://th.bing.com/th/id/R.22a468f2a23252fe251834f6fa559645?rik=NMt%2fVFuJ%2fdJV2A&riu=http%3a%2f%2fwww.newdesignfile.com%2fpostpic%2f2010%2f06%2fshopping-cart-icon-white_235863.png&ehk=iOQPHRjP2Yr4csqVdX6Bs7D8GFTrr2r9icBq9odkO7I%3d&risl=&pid=ImgRaw&r=0"
                alt="Shopping Cart"
              />
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
