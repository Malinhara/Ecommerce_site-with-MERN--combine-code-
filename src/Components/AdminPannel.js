import { faEdit, faHome, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Link, useLocation } from 'react-router-dom';
import './Styles.css';




const Sidenav = () => {


  const location = useLocation();
  
  const [shouldRedirect, setShouldRedirect] = useState(true);

 


 if(location.pathname==="/home" || location.pathname=="/about" || location.pathname=="/register" || location.pathname=="/login" || location.pathname=="/shop"
 || location.pathname=="/Cart" || location.pathname=="/Orderstatus"){

  return null;
 }

  const handleLinkClick = () => {
    // Stop the redirection by setting shouldRedirect to false
    setShouldRedirect(false);
  };

  
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 sidebar">
          <br></br>
          <Container>
            <Row>
        
            <Col md={4}><img
              className='cart'
              src="https://i.ibb.co/ZShJMsd/R-2.png"
              alt="Shopping Cart"
            /></Col>
            <Col md={{ span: 7, offset: 0 }}><h5 style={{color:'whitesmoke'}}>Tim David</h5></Col>
          </Row></Container><br></br>
          <Link to="AdminHome" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faHome} /> Home
          </Link>
          <Link to="/ProductAdd" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faPlus} /> Add Product
          </Link>
          <Link to="/Updateproduct" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faEdit} /> Update Product
          </Link>
          <Link to="/DeleteProduct" className="sidenav-link" style={{ fontSize: '20px' }} onClick={handleLinkClick}>
            <FontAwesomeIcon icon={faTrash} /> Delete Product
          </Link>
        </div>

        <div className="col-md-9 content">
          {/* The content of the page */}
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
