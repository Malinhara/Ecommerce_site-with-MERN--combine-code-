
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import DOMPurify from 'dompurify';
import React, { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Styles.css';

const ProductAddPage = () => {
    
    const [data,setdata]=useState([])
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState({
        productName: '',
        stockQuantity: '',
        category: '',
        price: '',
        imgUrl: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    const [errors, setErrors] = React.useState({
      productName: '',
      stockQuantity: '',
      category: '',
      price: '',
      imgUrl: '',
      description: ''
    });

    const handleSubmit = () => {
        console.log(
            formData.productName,
            formData.stockQuantity,
            formData.category,
            formData.price,
            formData.imgUrl,
            formData.description
        )

        //check for nulls
        if (
            formData.productName.trim() === '' ||
            formData.stockQuantity.trim() === '' ||
            formData.category.trim() === '' ||
            formData.price.trim() === '' ||
            formData.imgUrl.trim() === '' ||
            formData.description.trim() === ''
        ) {
            alert('Please fill in all fields');
        } else {
            sendData();
        }
    }

    const sendData = async () => {

      try {
        const confirmationCode = sessionStorage.getItem('generatedCode');
        const inputconfirmationCode=sessionStorage.getItem('confirmCode');

      

        const sessionID = sessionStorage.getItem('sessionID');
        const savedConfirmationCode = sessionStorage.getItem("confirmationCode");

    
        const response = await axios.post('http://localhost:3001/product/addProduct', {
           
        name:DOMPurify.sanitize(formData.productName),
        quantity:DOMPurify.sanitize(formData.stockQuantity),
        category:DOMPurify.sanitize(formData.category),
        price:DOMPurify.sanitize(formData.price),
        imgUrl:DOMPurify.sanitize(formData.imgUrl),
        description:DOMPurify.sanitize(formData.description)
      }, {
        headers: {
          'Session-ID': sessionID ,// Pass session ID in a custom header
          'confirmationCode':savedConfirmationCode
        }
      });

        if (response) {
           if (response.status === 200) {
              console.log('Product added successfully');
              alert('product add  successfully');
      
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

    }

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




    return (
        <div className="Align">

            <br />
            <br />
            <br />
            <br />
            <br />

            <center> <form onSubmit={handleSubmit}>

                <Box
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="outlined-basic" label="Product Name" variant="outlined" name='productName' required={true}  value={formData.productName} onChange={handleInputChange}/>
                    <TextField id="outlined-basic" label="Stock Quantity" variant="outlined" name='stockQuantity' type='number' required={true} value={formData.stockQuantity} onChange={handleInputChange}/>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label" name="Category" required={true}>category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={formData.category}
                            label="category"
                            name="category"
                            onChange={handleInputChange}
                        >
                            <MenuItem value={'high'}>high-end</MenuItem>
                            <MenuItem value={'medium'}>medium</MenuItem>
                            <MenuItem value={'low'}>low budget</MenuItem>
                        </Select>
                    </FormControl>
                  


                    <TextField id="outlined-basic" label="price" variant="outlined" name='price' type='number' required={true} value={formData.price} onChange={handleInputChange}/>
                  
                    <TextField id="outlined-basic" label="image URL" variant="outlined" name='imgUrl' required={true} value={formData.imgUrl} onChange={handleInputChange}/>

                  
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        multiline
                        rows={4}
                        required={true}
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />

                </Box><br></br>

                <Button variant='primary' type="submit" className='custom-button8' >Add Phone</Button>
            </form></center><br></br><br></br>

            <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Description</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Category</th>
          <th style={{ border: '1px solid black', padding: '8px' }}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {data.map((product, index) => (
          <tr key={index}>
            <td style={{ border: '1px solid black', padding: '8px' }}>{product.name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{product.description}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{product.price}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{product.category}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{product.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
    );
};

export default ProductAddPage;