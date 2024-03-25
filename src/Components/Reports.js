import Box from '@mui/material/Box';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import necessary Firebase Firestore functions
import { MDBBadge, MDBCol, MDBContainer, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { auth, firestore } from '../firebase';
import './Styles.css';

function Reports() {
  const [selectedPoolIdReports, setSelectedPoolIdReports] = useState('');
  const [selectedPoolIdReports1, setSelectedPoolIdReports1] = useState('');
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [competitorDetails1, setCompetitorDetails1] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [allCompetitorIds, setAllCompetitorIds] = useState([]);
  const user = auth.currentUser;

  // Fetch pool IDs for the current user
  useEffect(() => {
    const fetchPoolIds = async () => {
      try {
        const poolsCollection = collection(firestore, 'Pools');
        const querySnapshot = await getDocs(query(poolsCollection, where('Adminid', '==', user.uid)));

        if (!querySnapshot.empty) {
          const poolData = querySnapshot.docs.map((doc) => {
            const { title } = doc.data(); // Assuming 'title' is a field in your 'Pools' documents
            return { id: doc.id, title };
          });
          setPoolIds(poolData);
        }
      } catch (error) {
        console.error('Error fetching pool IDs:', error.message);
      }
    };

    fetchPoolIds();
  }, [user.uid]);


  
  useEffect(() => {
    const fetchAllCompetitorIds = async () => {
      try {
        if (user) {
          const competitorsCollection = collection(firestore, 'competitors');
          const competitorQuerySnapshot = await getDocs(
            query(competitorsCollection, where('Adminid', '==', user.uid))
          );
  
          if (!competitorQuerySnapshot.empty) {
            const competitorData = competitorQuerySnapshot.docs.map((doc) => ({
              id: doc.id,
              Name: doc.data().Name,
            }));
            setAllCompetitorIds(competitorData);
          } else {
            setAllCompetitorIds([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor IDs:', error.message);
      }
    };
  
    fetchAllCompetitorIds();
  }, [user]);
  

  // Fetch competitor details based on the selected pool ID
  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        if (user && selectedPoolIdReports) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(
            query(competitorsCollection, where('poolid', '==', selectedPoolIdReports))
          );

          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCompetitorDetails(competitorData);
          } else {
            // Handle case where there are no competitors for the selected pool
            setCompetitorDetails([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };

    fetchCompetitorDetails();
  }, [selectedPoolIdReports]);



  useEffect(() => {
    const fetchCompetitorDetails1 = async () => {
      try {
        if (user && selectedPoolIdReports1) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(
            query(competitorsCollection, where('poolid', '==', selectedPoolIdReports1))
          );

          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCompetitorDetails1(competitorData);
          } else {
            // Handle case where there are no competitors for the selected pool
            setCompetitorDetails1([]);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };

    fetchCompetitorDetails1();
  }, [selectedPoolIdReports1]);


  const handleChange = (event) => {
    setSelectedPoolIdReports(event.target.value);
  };


  const handleChange1 = (event) => {
    setSelectedPoolIdReports1(event.target.value);
  };

  return (
    <div style={{ marginTop: '80px', alignContent: 'center', marginLeft: '300px' }}>
      <MDBContainer fluid className="p-3 my-5">
        <h1>Candidate Result Report</h1>
        <br></br>
        <MDBRow>
          <MDBCol style={{ marginTop: '10px' }}>
            <h6>Select Competitor ID</h6>
            <Box sx={{ minWidth: 120 }}>
            <Form.Select
            aria-label="Default select example"
            onChange={handleChange}
            value={selectedPoolIdReports}
            >
       <option>Select Competitor ID</option>
         {allCompetitorIds.map((competitor) => (
    <option key={competitor.id} value={competitor.id}>
      {`${competitor.id} - ${competitor.Name}`}
    </option>
  ))}
</Form.Select>
            </Box>
          </MDBCol>
          <MDBCol></MDBCol>
          <br></br>
          <br></br>
          <br></br>
          <MDBTable align='middle' borderColor='black'>
            <MDBTableHead>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Pool Id and Name</th>
                <th scope='col'>Start Date - End Date</th>
                <th scope='col'>Vote count</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>John Doe</p>
                <p className='text-muted mb-0'>Age-21</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>HTQZ1GWvCcrwK2dJ0QFy<br></br>Stage Star</p>
           
          </td>
          <td>
           
            01/03/2024 12:00 AM -- 02/03/2024 12:00 AM
           
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            43333
            </MDBBadge>
          </td>
          
        </tr>
        <tr>
        <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>MarkDoe</p>
                <p className='text-muted mb-0'>Age-23</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>HTQZ1GWvCcrwK2dJ0QFy<br></br>Stage Star</p>
           
          </td>
          <td>
           
            01/03/2024 12:00 AM -- 02/03/2024 12:00 AM
           
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            13333
            </MDBBadge>
          </td>
          
        </tr>
        <tr>
        <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>John </p>
                <p className='text-muted mb-0'>Age-24</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>HTQZ1GWvCcrwK2dJ0QFy<br></br>Stage Star</p>
           
          </td>
          <td>
           
            01/03/2024 12:00 AM -- 02/03/2024 12:00 AM
           
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23333
            </MDBBadge>
          </td>
          
        </tr>
        </MDBTableBody>
          </MDBTable>
          <br></br>
          <h1 style={{ marginTop: '30px' }}>Election Result Report</h1>
          <br></br>
          <br></br>
          <MDBCol style={{ marginTop: '20px' }}>
            <Box sx={{ minWidth: 120 }}>
            <h6>Select Pool ID</h6>
            <Form.Select
                aria-label="Default select example"
                onChange={handleChange1}
                value={selectedPoolIdReports1}
              >
                <option>Select Pool ID</option>
                {poolIds.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {`${pool.id} - ${pool.title}`}
                  </option>
                ))}
              </Form.Select>

              
            </Box>
          </MDBCol>
          <MDBCol style={{ marginRight: '380px', marginTop: '45px' }}>
          <Form.Select
                aria-label="Default select example"
                onChange={handleChange1}
                value={selectedPoolIdReports1}>
                <option>Sort By</option>

                <option>Best</option>
                <option>High tO low</option>
    
                <option>Low to High</option>
                  
              </Form.Select>
            <br></br>
            <br></br>
          </MDBCol>
          <MDBTable align='middle' borderColor='black'>
            <MDBTableHead>
              <tr>
                <th scope='col'>Name</th>
                <th scope='col'>Age</th>
                <th scope='col'>Province</th>
                <th scope='col'>Vote count</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://mdbootstrap.com/img/new/avatars/8.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>John Doe</p>
                <p className='text-muted mb-0'>Competitor ID-Egrr44455</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>22</p>
           
          </td>
          <td>
            
              Colombo
           
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23333
            </MDBBadge>
          </td>
          
        </tr>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://mdbootstrap.com/img/new/avatars/6.jpg'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>Alex Ray</p>
                <p className='text-muted mb-0'>Competitor ID-Ecrr44455</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>22</p>
           
          </td>
          <td>
              Southern
         
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23333
            </MDBBadge>
          </td>
          
        </tr>
        <tr>
          <td>
            <div className='d-flex align-items-center'>
              <img
                src='https://firebasestorage.googleapis.com/v0/b/voting-app-9cc9e.appspot.com/o/user-images%2F2le4bgcgstYbPmWoQuP77u74Q5t2?alt=media&token=e20ba535-df07-4c8c-b0d2-6d43a245b671'
                alt=''
                style={{ width: '45px', height: '45px' }}
                className='rounded-circle'
              />
              <div className='ms-3'>
                <p className='fw-bold mb-1'>Kate Hunington</p>
                <p className='text-muted mb-0'>Competitor ID-Rtcrr44455</p>
              </div>
            </div>
          </td>
          <td>
            <p className='fw-normal mb-1'>22</p>
           
          </td>
          <td>
              Western
        
          </td>
          <td>
            <MDBBadge color='success' pill style={{height:'24px',fontSize:'15px'}}>
            23333
            </MDBBadge>
          </td>
          
        </tr>
      </MDBTableBody>
          </MDBTable>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Reports;
