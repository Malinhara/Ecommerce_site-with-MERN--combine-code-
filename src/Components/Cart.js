import axios from "axios";
import Cookies from 'js-cookie';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import './Styles.css';
axios.defaults.withCredentials = true;
export default function CartCheckout() {

  const [products, setProducts] = useState([]);

  useEffect(() => {


    // Function to get the savedProducts from document cookie using js-cookie
    function getSavedProductsFromCookie() {
      const savedProducts = Cookies.get('savedProducts');
      if (savedProducts) {
        try {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts); // Set the products state with the parsed array
        } catch (error) {
          console.error('Error parsing saved products:', error);
        }
      }
    }

    // Call the function to get the savedProducts from document cookie
    getSavedProductsFromCookie();
  }, []);

  const calculateTotal = () => {
    let total = 0;
    products.forEach(product => {
      total += product.price;
    });
    return total;
  };

  const sendData = async () => {
    try {
      const savedProducts = Cookies.get('savedProducts');
      const userEmail = sessionStorage.getItem('userEmail');
      
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        const productIds = parsedProducts.map(product => product._id);
  
        const response = await axios.put('http://localhost:3001/user/buyProduct', {
          productIds: productIds,
          email:userEmail
        }, {
          withCredentials: true // This is important for sending cookies
        });
  
        if (response.status === 200) {
          console.log('Products added to user successfully');
          window.location.href = '/Orderstatus';
          alert('Product Bought successfully');
        }
      } else {
        console.error('No savedProducts found in cookie');
        alert('No savedProducts found in cookie');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          console.error('Unauthorized access:', error.response.data.error);
          alert('Your session has expired or is invalid. Please log in again.');
          window.location.href = '/login'; // Redirect to login page
        } else {
          console.error('Error:', error.response.data.error);
          alert(`Error: ${error.response.data.error}`);
        }
      } else {
        console.error('Error:', error);
        alert('An error occurred while processing your request.');
      }
    }
  };
    return (
      <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="h-100 py-5">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol>
              <MDBCard className="shopping-cart" style={{ borderRadius: "15px" }}>
                <MDBCardBody className="text-black">
                  <MDBRow>
                    <MDBCol lg="7" className="px-5 py-4">
                      <MDBTypography
                        tag="h3"
                        className="mb-5 pt-2 text-center fw-bold text-uppercase"
                      >
                        Your products
                      </MDBTypography>
  
                      {products && products.length > 0 &&
        products.map((product, index) => (
          <Col key={index} auto>
            <div className="flex-grow-1 ms-3">
              <a href="#!" className="float-end text-black">
                <MDBIcon fas icon="times" />
              </a>
              <MDBTypography tag="h5" className="text-primary">
                {product.name}
              </MDBTypography>
              {/* Assuming product object has color and price properties */}
              <MDBTypography tag="h6" style={{ color: "#9e9e9e" }}>
                Color: {product.color}
              </MDBTypography>
              <div className="d-flex align-items-center">
                <p className="fw-bold mb-0 me-5 pe-3">Rs.{product.price}</p>
                <div className="def-number-input number-input safari_only">
                  {/* ... quantity input logic ... */}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <MDBCardImage
                src={product.imageUrl} // Assuming product object has imageUrl property
                fluid
                style={{ width: "150px" }}
                alt={product.name} // Use product name as alt text
              />
            </div>
          </Col>
        ))}
  
                      <hr
                        className="mb-4"
                        style={{
                          height: "2px",
                          backgroundColor: "#1266f1",
                          opacity: 1,
                        }}
                      />
  
                      <div className="d-flex justify-content-between px-x">
                        <p className="fw-bold">Discount:</p>
                        <p className="fw-bold">Rs.1800</p>
                      </div>
                      <div
                        className="d-flex justify-content-between p-2 mb-2"
                        style={{ backgroundColor: "#e1f5fe" }}
                      >
                        <MDBTypography tag="h5" className="fw-bold mb-0">
                          Total:
                        </MDBTypography>
                        <MDBTypography tag="h5" className="fw-bold mb-0">
                         Rs.{calculateTotal()}
                        </MDBTypography>
                      </div>
                    </MDBCol>
                    <MDBCol lg="5" className="px-5 py-4">
                      <MDBTypography
                        tag="h3"
                        className="mb-5 pt-2 text-center fw-bold text-uppercase"
                      >
                        Payment
                      </MDBTypography>
  
                      <form className="mb-5">
                        <MDBInput
                          className="mb-5"
                          label="Card number"
                          type="text"
                          size="lg"
                          defaultValue="1234 5678 9012 3457"
                        />
  
                        <MDBInput
                          className="mb-5"
                          label="Name on card"
                          type="text"
                          size="lg"
                          defaultValue="John Smith"
                        />
  
                        <MDBRow>
                          <MDBCol md="6" className="mb-5">
                            <MDBInput
                              className="mb-4"
                              label="Expiration"
                              type="text"
                              size="lg"
                              minLength="7"
                              maxLength="7"
                              defaultValue="01/22"
                              placeholder="MM/YYYY"
                            />
                          </MDBCol>
                          <MDBCol md="6" className="mb-5">
                            <MDBInput
                              className="mb-4"
                              label="Cvv"
                              type="text"
                              size="lg"
                              minLength="3"
                              maxLength="3"
                              placeholder="&#9679;&#9679;&#9679;"
                              defaultValue="&#9679;&#9679;&#9679;"
                            />
                          </MDBCol>
                        </MDBRow>
  
                        <p className="mb-5">
                          Lorem ipsum dolor sit amet consectetur, adipisicing elit
                          <a href="#!"> obcaecati sapiente</a>.
                        </p>
                        <Button variant="primary" size="lg"  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}  className="custom-button" onClick={sendData}>
                        Buy Now
                        </Button>{' '}<br></br><br></br>
                        <Button variant="primary" size="lg"  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}  className="custom-button">
                         Back to Home
                       </Button>{' '}
                        
                          
                        
                      </form>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    );
  }