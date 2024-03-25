import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { collection, doc, getDoc } from 'firebase/firestore';
import { MDBBadge, MDBDropdown, MDBDropdownItem, MDBDropdownMenu, MDBDropdownToggle } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { auth, firestore } from '../firebase';
import Sidenav from './AdminPannel';


import './Styles.css';
export default function Adminhome() {


  const [state1, setstate1] = useState({
    barOptions: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    barSeries: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91, 66]
      }
    ],
    pieOptions: {
      labels: ['voted','non voted'],
    },
    pieSeries: [30, 40],
  });

const [state,setstate]=useState ({

  
  options: {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: ['Poorna malinhara', 'malinhara', 'John', 'Mark', 'Poorna malinhara', 'Poorna', 'Mark', 'Watson', 'Poorna malinhara']
    }
  },
  series: [
    {
      name: "series-1",
      data: [21666, 40949, 45332, 52320, 41349, 43630, 75340, 91747, 64516]
    }
  ]
 

});


const [adminDetails, setAdminDetails] = useState({});




useEffect(() => {
  
  const fetchAdminDetails = async () => {
    try {
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        const usersCollection = collection(firestore, 'users');
        
        const userDocRef = doc(usersCollection, user.uid);
        const userDoc = await getDoc(userDocRef);
        setAdminDetails(userDoc.data());
      }
    } catch (error) {
      console.error('Error fetching admin details:', error.message);
    }
  };

  fetchAdminDetails();
}, []);



    return (
     
<div className="Align" style={{backgroundColor:'#f3f6fd'}}>

<Container>
 
      <Row>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Vote given user count</b></h5></center><br>
        </br><h5 style={{marginLeft:'90px',marginTop:"-24px",color:'black'}}> <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23333
            </MDBBadge></h5></div></Col>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Active Pool ID</b></h5></center><br>
        </br><h5 style={{marginLeft:'70px',marginTop:"-24px",color:'black'}}> <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
        XEW34566
            </MDBBadge></h5></div></Col>
        <Col><div className="Frame2" style={{width: 250, height: 80, position: 'relative', background: 'linear-gradient(270deg, #EC5844 0%, #F203F7 100%)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}><center><h5 style={{paddingTop:'10px',color:'whitesmoke'}}><b>Active Competitor Count</b></h5></center><br>
        </br><h5 style={{marginLeft:'100px',marginTop:"-24px",color:'black'}}><MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23
            </MDBBadge></h5></div></Col>
      
   
   
              <Col style={{marginTop:'90px'}}>
              <h5>Best Competitors Vote Count </h5>
              <div  style={{width: 550, height: 340, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
            <Chart
              options={state.options}
              series={state.series}
              type="bar"
              width="500"
            />
            </div>
        </Col>
        <Col style={{marginTop:'90px',marginLeft:'10px'}}>
        <h5>Voted and non voted Precentage</h5>
        <div  style={{width: 420, height: 340, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
          <Chart
            options={state1.pieOptions}
            series={state1.pieSeries}
            type="pie"
            width="380"
            
          />
          </div>
        </Col>

        <Col style={{marginTop:'20px'}}>
        <div  style={{width: 560, height: 330, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
        <h5 style={{marginLeft:'10px',marginTop:'10px'}}>Analysis</h5>
        <div class="d-flex">
        <div class="p-2 flex-fill">
          <MDBDropdown dropright
          name="type">
        <MDBDropdownToggle>Select Pool ID</MDBDropdownToggle>
        <MDBDropdownMenu dark>
          <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
      </MDBDropdown> 
      </div>
      </div>
        <div class="d-flex">
        <div class="p-2 flex-fill">
          <MDBDropdown dropright
          name="type">
        <MDBDropdownToggle>Competitor ID</MDBDropdownToggle>
        <MDBDropdownMenu dark>
          <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
      </MDBDropdown> 
      </div>

        <div class="p-2 flex-fill"><h4>VS</h4></div>
        <div class="p-2 flex-fill">
        <MDBDropdown dropright
          name="type">
        <MDBDropdownToggle>Competitor ID</MDBDropdownToggle>
        <MDBDropdownMenu dark>
        <MDBDropdownItem link value="voteOne">111</MDBDropdownItem>
          <MDBDropdownItem link value="voteMany">345</MDBDropdownItem>
          
        </MDBDropdownMenu>
        </MDBDropdown>
        </div>
        
        </div>
        <div class="d-flex">
        <div class="p-2 flex-fill">

        <img
        src="https://i.ibb.co/9p2QLq3/download-4.jpg"
        class="img-fluid rounded"
        alt="Townhouses and Skyscrapers"
         width={'100px'}
         height={"50px"}
         />


        </div>

        <div class="p-2 flex-fill"  style={{marginLeft:"110px"}}>

        <img
        src="https://i.ibb.co/9p2QLq3/download-4.jpg"
        class="img-fluid rounded"
        alt="Townhouses and Skyscrapers"
        width={'100px'}
        height={"50px"}
       />


        </div>
        
        
        </div>
        <div class="d-flex">
        <div class="p-2 flex-fill" >
         <h6>Vote Count:13322</h6> 
          
          </div>
          
          <div class="p-2 flex-fill" style={{marginLeft:"110px"}}>
          <h6>Vote Count:23232</h6> 
          
          </div>
          </div>
       </div>
        </Col>
        
        <Col style={{marginTop:'20px'}}>
        <div  style={{width: 420, height: 310, position: 'relative', background: 'white', borderRadius: 22, border: '1px rgba(0, 0, 0, 0.10) solid'}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar />
       </LocalizationProvider>
       </div>
        </Col>
        </Row>
        </Container>
         
      <Sidenav adminDetails={adminDetails} /> 

      
    
</div>
    
    );
  }