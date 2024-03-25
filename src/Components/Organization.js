import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';

import { auth, firestore } from '../firebase';
import './Styles.css';
// Initialization for ES Users
import { Ripple, initMDB } from "mdb-ui-kit";
// Initialization for ES Users
import { Input } from "mdb-ui-kit";

initMDB({ Input, Ripple });
initMDB({ Dropdown, Ripple });

export default function Oraganization() {


  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [user, setUser] = useState(null);

  
  
  console.log(user)
  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchCompetitorDetails(user);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchCompetitorDetails = async (user) => {
    try {
      const competitorsCollection = collection(firestore, 'competitors');
      const q = query(competitorsCollection, where('Adminid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const competitorData = [];
        querySnapshot.forEach((doc) => {
          competitorData.push({ id: doc.id, ...doc.data() });
        });
        setCompetitorDetails(competitorData);
      }
    } catch (error) {
      console.error('Error fetching competitor details:', error.message);
    }
  };

    return (
      <div style={{backgroundColor:'#111827'}}>

<Container style={{marginTop:'50px' ,backgroundColor:'#111827'}}>
  <br></br><br></br>
      <Row className="justify-content-md-center">
        <Col xs lg="1" >
        <Dropdown align="end" >
              <Dropdown.Toggle variant="secondary" id="user-dropdown" >
                categories
              </Dropdown.Toggle>
              <Dropdown.Menu>
               
                
  
                    <Dropdown.Item href="/Orderstatus">Reality Shows</Dropdown.Item>
                    <Dropdown.Item href="/Update">Oraganization</Dropdown.Item>
                
  
              </Dropdown.Menu>
            </Dropdown>
        </Col>
        <Col md="auto" style={{marginLeft:'20px', color:'white'}}>
        <div class="input-group">
     <div class="form-outline" data-mdb-input-init >
    <input type="search" id="form1" style={{color:'white'}} class="form-control" />
    <label class="form-label" style={{color:'white',borderColor:'white',color:'white'}} for="form1">Search</label>
     </div>
    <button type="button" class="btn btn-primary" data-mdb-ripple-init>
    <i class="fas fa-search"></i>
    </button>
   </div>
        </Col>
        <Col xs lg="2">
      
        </Col>
      </Row><br></br>
      <h2 style={{color:'white'}}>Oraganizations Voting Pools</h2><br></br>

      <section class="text-center">
     <div className="row">
    <div className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
      <img
        src='https://i.ibb.co/wwwS6Kh/download-1.jpg'
        className='img-thumbnail'
        alt='...'
        width={'280px'}
        height={'250px'} 
      />
      <h4 className="fw-normal mb-0" style={{color:'white'}} >SL Railway</h4>
    </div>

    <div className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
      <img
        src='https://i.ibb.co/LQ6V3jz/galle-harbour-port-of-colombo-sri-lanka-ports-authority-port-authority-png-favpng-8-WS3-Cyy-Vdcaf-WH.jpg'
        className='img-thumbnail'
        alt='...'
        width={'330px'}
        height={'210px'} 
      />
      <h4 className="fw-normal mb-0" style={{color:'white'}}>SL Harbour</h4>
    </div>

    <div className="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
      <img
        src='https://i.ibb.co/sR7hpdZ/R-2.jpg'
        className='img-thumbnail'
        alt='...'
        width={'300px'}
       
      />
      <h4 className="fw-normal mb-0"style={{color:'white'}}>BOC</h4>
    </div>

    <div className="col-lg-3 col-md-6 mb-5 mb-md-0 position-relative">

    <img
        src='https://i.ibb.co/Y0n50M0/download-2.jpg'
        className='img-thumbnail'
        alt='...'
        width={'300px'}
       
      />
      <h4 className="fw-normal mb-0" style={{color:'white'}}>SL Cricket</h4>
     
    </div>

    
  </div>
</section><br></br><br></br>


    
    </Container><br></br><br></br>
    
    
      <br></br><br></br>
             
         
      </div>
    );
  }

  