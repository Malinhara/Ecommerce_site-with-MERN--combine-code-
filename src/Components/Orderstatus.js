import axios from 'axios';
import { MDBCardImage } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';




export default function User(){
 


  const [products, setProducts] = useState([]);



 useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionID = sessionStorage.getItem('sessionID');
        const userEmail = sessionStorage.getItem('userEmail');

        const response = await axios.post('http://localhost:3001/user/findproduct', {
          email: userEmail
        }, {
          headers: {
            'Session-ID': sessionID // Pass session ID in a custom header
          }
        });

        if (response && response.status === 200) {
          console.log('User data and products fetched successfully:', response.data);
          // Update the products state with the fetched product data
          setProducts(response.data.products);
        } else {
          console.error('Failed to fetch  products');
          // Handle error
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    products.forEach(product => {
      totalPrice += product.price;
    });
    return totalPrice;
  };


  return( 
   

<div>
 
<section class="h-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-lg-10 col-xl-8">
        <div class="card" style={{
                    borderRadius: '10px',
                }}>
          <div class="card-header px-4 py-5">
            <h5 class="text-muted mb-0">Thanks for your Order, <span style={{color: '#a8729a',}}>Anna</span>!</h5>
          </div>
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <p class="lead fw-normal mb-0" style={{color: '#a8729a',}}>Receipt</p>
              <p class="small text-muted mb-0">Receipt Voucher : 1KAU9-84UIL</p>
            </div>
            <div class="card shadow-0 border mb-4">
            {products.map(product => (
        <div key={product._id} className="card-body">
          <div className="row">
            <div className="col-md-2">
            <MDBCardImage
                src={product.imageUrl} // Assuming product object has imageUrl property
                fluid
                style={{ width: "100px" }}
                alt={product.name} // Use product name as alt text
              />
            </div>
            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
              <p className="text-muted mb-0">{product.name}</p>
            </div>
            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
              <p className="text-muted mb-0 small">{product.color}</p>
            </div>
            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
              <p className="text-muted mb-0 small">Capacity: {product.capacity}</p>
            </div>
            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
              
            </div>
            <div className="col-md-2 text-center d-flex justify-content-center align-items-center">
              <p className="text-muted mb-0 small">Rs{product.price}</p>
            </div>
          </div>
          <hr className="mb-4" style={{ backgroundColor: '#e0e0e0', opacity: '1' }}></hr>
          <div className="row d-flex align-items-center">
            <div className="col-md-2">
              <p className="text-muted mb-0 small">Track Order</p>
            </div>
            <div className="col-md-10">
              <div className="progress" style={{ height: '6px', borderRadius: '16px' }}>
                <div className="progress-bar" role="progressbar"
                  style={{ width: '65%', borderRadius: '16px', backgroundColor: '#a8729a' }} aria-valuenow="65"
                  aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <div className="d-flex justify-content-around mb-1">
                <p className="text-muted mt-1 mb-0 small ms-xl-5">Out for delivery</p>
                <p className="text-muted mt-1 mb-0 small ms-xl-5">Delivered</p>
              </div>
            </div>
          </div>
        </div>
      ))}

            </div>
            <div class="card shadow-0 border mb-4">
              <div class="card-body">
                
                <hr class="mb-4" style={{backgroundcolor: '#e0e0e0', opacity: '1',}}></hr>
                <div class="row d-flex align-items-center">
                  <div class="col-md-2">
                    <p class="text-muted mb-0 small">Track Order</p>
                  </div>
                  <div class="col-md-10">
                    <div class="progress" style={{height: '6px', borderradius: '16px'}}>
                      <div class="progress-bar" role="progressbar"
                        style={{width: '20%', borderRadius: '16px', backgroundColor:' #a8729a', }}aria-valuenow="20"
                        aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div class="d-flex justify-content-around mb-1">
                      <p class="text-muted mt-1 mb-0 small ms-xl-5">Out for delivary</p>
                      <p class="text-muted mt-1 mb-0 small ms-xl-5">Delivered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between pt-2">
              <p class="fw-bold mb-0">Order Details</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">Total</span> Rs86984.00</p>
            </div>

            <div class="d-flex justify-content-between pt-2">
              <p class="text-muted mb-0">Invoice Number : 788152</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">Discount</span> rs1999.00</p>
            </div>

            <div class="d-flex justify-content-between">
              <p class="text-muted mb-0">Invoice Date : 22 Dec,2024</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">GST 18%</span> 123</p>
            </div>

            <div class="d-flex justify-content-between mb-5">
              <p class="text-muted mb-0">Recepits Voucher : 18KU-62IIK</p>
              <p class="text-muted mb-0"><span class="fw-bold me-4">Delivery Charges</span> Free</p>
            </div>
          </div>
          <div className="card-footer border-0 px-4 py-5" style={{ backgroundColor: '#a8729a', borderBottomLeftRadius: '10px', borderTopRightRadius: '10px' }}>
                    <h5 className="d-flex align-items-center justify-content-end text-white text-uppercase mb-0">
                      Total paid: <span className="h2 mb-0 ms-2">Rs {calculateTotalPrice()}</span>
                    </h5>
                  </div>
        </div>
      </div>
    </div>
  </div>
</section>


</div>


  );
}
