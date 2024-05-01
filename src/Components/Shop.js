import {
  MDBCarousel,
  MDBCarouselItem,
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import './Styles.css';


import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import axios from 'axios';

export default function Shop (){


  const [age, setAge] = React.useState('');
  const [data,setdata]=useState([])


  const handleChange = (event) => {
    setAge(event.target.value);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/product/productIds');
        setdata( response.data.products);
      } catch (error) {
        console.error('Error fetching product IDs:', error);
      }
    };
  
    fetchData();
  }, []);


  const saveProductInCookie = (product) => {
    // 1. Get existing products from cookie (or initialize empty array)
    let existingProducts = [];
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key.trim() === 'savedProducts') {
        try {
          existingProducts = JSON.parse(value);
        } catch (error) {
          console.error('Error parsing saved products cookie:', error);
        }
        break;
      }
    }
  
    // 2. Add the new product to the array
    existingProducts.push(product);
  
    // 3. Stringify the updated product array
    const serializedProducts = JSON.stringify(existingProducts);
  
    // 4. Set the cookie with the updated product data and expiry time
    document.cookie = `savedProducts=${serializedProducts}; expires=; path=/`;
  }
  
  


return(
<div><br></br><br></br>
<center>


<MDBCarousel className='sizechanges' showIndicators showControls fade>
  
      <MDBCarouselItem
        className='w-100 d-block'
        itemId={1}
        src='https://images.samsung.com/is/image/samsung/assets/in/2307/pcd/Galaxy-Z_Curation-KV_PCD_1440x640_pc.jpg?$1440_640_JPG$'
        alt='...'
      >
        <h2 className='responsive-text4' >Galaxy Z Fold5</h2>
        <Button variant="primary" size="lg"  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}  className="custom-button6">
          Buy Now
        </Button>{' '}
      </MDBCarouselItem>

      <MDBCarouselItem
        className='w-100 d-block'
        itemId={2}
        src='//images.samsung.com/is/image/samsung/assets/in/2302/pcd/smartphones/PCD_Galaxy-S_Curation-KV_1440x640_pc.jpg?$1440_640_JPG$'
        alt='...'
      >
        <h2 className='responsive-text5' >Galaxy S23 Ultra</h2>
        <Button variant="primary" size="lg"  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}  className="custom-button6">
          Buy Now
        </Button>{' '}
      </MDBCarouselItem>

      <MDBCarouselItem
        className='w-100 d-block'
        itemId={3}
        src='https://images.samsung.com/is/image/samsung/assets/in/lime1440x640.jpg?imwidth=2560'
        alt='...'>
        <h2 className='responsive-text3' >Galaxy S23 in Lime</h2>
        <Button variant="primary" size="lg"  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}  className="custom-button5">
          Buy Now
        </Button>{' '}
        
      </MDBCarouselItem>
    </MDBCarousel></center>

    <center><Image src="https://i.postimg.cc/QNqVvnYW/Screenshot-2023-10-09-102810.png" fluid />;</center><br></br>
    <h3 className='srcalign'>Serach results: </h3><h3 className='output'>"Samsung A2"</h3><br></br><br></br>
   <span className='srcalign2'><h6>Sort By</h6></span> 
   <span className='align2'>
      <Box sx={{ minWidth: 120 }} >
      <FormControl  className='size'>
        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Best match</MenuItem>
          <MenuItem value={20}>Low to High</MenuItem>
          <MenuItem value={30}>High to Low</MenuItem>
        </Select>
      </FormControl>
    </Box></span><br></br><br></br>
    <Container><center>
      <Row>
        {data.map((product, index) => (
          <Col key={index} auto>
            <Card style={{ width: '15rem' }}>
              <Card.Img variant="top" src={product.imageUrl} height={'320rem'} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Rs {product.price}</Card.Text>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))' }}
                  className="custom-button"
                  onClick={() => saveProductInCookie(product)} >
                 Add to cart
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </center></Container>

</div>

    );
}
