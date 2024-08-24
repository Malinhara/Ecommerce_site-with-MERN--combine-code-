
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



const ProductUpdatePage = () => {

  const [proid, setProid] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    productid: '',
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
  productid: '',
  productName: '',
  stockQuantity: '',
  category: '',
  price: '',
  imgUrl: '',
  description: ''
});

const handleSubmit = () => {
    
          sendData();
     
     
}

const sendData = async () => {

  try {

    const sessionID = sessionStorage.getItem('sessionID');
    const confirmationCode = sessionStorage.getItem('generatedCode');
    const inputconfirmationCode=sessionStorage.getItem('confirmCode');
    if (inputconfirmationCode === confirmationCode) {

    } else {
      navigate('/home');
      alert("Error");
    }

    const response = await axios.put(`http://localhost:3001/product/update/${formData.productid}`, {
       
    name:DOMPurify.sanitize(formData.productName),
    quantity:DOMPurify.sanitize(formData.stockQuantity),
    category:DOMPurify.sanitize(formData.category),
    price:DOMPurify.sanitize(formData.price),
    imgUrl:DOMPurify.sanitize(formData.imgUrl),
    description:DOMPurify.sanitize(formData.description)
    }, {
        headers: {
          'Session-ID': sessionID // Pass session ID in a custom header
        }
      });


    if (response) {
       if (response.status === 201) {
          console.log('Product updated successfully');
          alert('Product updated successfully');

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
      const productIds = response.data.products.map(product => product._id);
      setProid(productIds);
    } catch (error) {
      console.error('Error fetching product IDs:', error);
    }
  };

  fetchData();
}, []);


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/product/getproduct/${formData.productid}`);
      const productData = response.data.product; // Assuming the response contains a single product object
      setFormData({
        ...formData,
        productName: productData.name,
        stockQuantity: productData.quantity,
        category: productData.category,
        price: productData.price,
        imgUrl: productData.imageUrl,
        description: productData.description
      });
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  // Fetch data only if formData.productid is not empty
  if (formData.productid !== '') {
    fetchData();
  }
}, [formData.productid]);



  
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
        ><select
        id="productid"
        name="productid"
        required={true}
        value={formData.productid}
        onChange={handleInputChange}
      >
        <option value="">Select Product ID</option>
        {proid.map(id => (
          <option key={id} value={id}>
            {id}
          </option>
        ))}
      </select>
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
          
            <TextField id="outlined-basic" label="imageURL" variant="outlined" name='imgUrl' required={true} value={formData.imgUrl} onChange={handleInputChange}/>

          
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

        <Button variant='primary' type="submit" className='custom-button8' >Update Product</Button>
    </form></center><br></br>

   
</div>
  );
};

export default ProductUpdatePage;
