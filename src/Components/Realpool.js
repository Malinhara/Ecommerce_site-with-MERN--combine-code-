import Switch from '@mui/material/Switch';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardFooter,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTextArea,
} from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Button, Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
import { auth, firestore } from '../firebase';
import './Styles.css';
// Initialization for ES Users
import { Ripple, initMDB } from 'mdb-ui-kit';
// Initialization for ES Users
import { Input } from 'mdb-ui-kit';
import { Link } from 'react-router-dom';

initMDB({ Input, Ripple });
initMDB({ Dropdown, Ripple });

export default function Realpool() {
  const [poolId, setPoolId] = useState(null);
  const location = useLocation();
  const [competitorDetails, setCompetitorDetails] = useState([]);
   const [PoolDetails, setPoolDetails] = useState([]);
   const [checked, setChecked] = React.useState(new Array(competitorDetails.length).fill(false));
  const [user, setUser] = useState(null);
  const [checkedCompetitorIds, setCheckedCompetitorIds] = useState([]);
  const [voteCount, setVoteCount] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('poolId');
    console.log(id)
    setPoolId(id);
  }, [location.search]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // Trigger the data fetching only if user and poolId are available
      if (user && poolId) {
        fetchCompetitorDetails(user);
      }
    });

    return () => unsubscribe();
  }, [user, poolId]);


  
  const handleSwitchChange = (index, competitorId) => {
    const currentDate = new Date();
  
    // Check if the current date is within the pool voting period
    if (
      PoolDetails.length > 0 &&
      currentDate >= new Date(PoolDetails[0].stdate.toMillis()) &&
      currentDate <= new Date(PoolDetails[0].enddate.toMillis())
    ) {
      // User is allowed to vote
      handleSwitchToggle(index, competitorId);
    } else {
      // Pool is not currently active, display an alert or message to the user
      alert('Voting is not currently active for this pool.');
    }
  
    console.log(`Switch changed for competitor at index ${index} with ID ${competitorId}`);
  };
  
  const handleSwitchToggle = (index, competitorId) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
  
    // Update checked competitor IDs
    if (updatedChecked[index]) {
      setCheckedCompetitorIds((prevIds) => [...prevIds, competitorId]);
      // Increment vote count for the current user
      setVoteCount((prevCounts) => ({ ...prevCounts, [competitorId]: (prevCounts[competitorId] || 0) + 1 }));
    } else {
      setCheckedCompetitorIds((prevIds) => prevIds.filter((id) => id !== competitorId));
      // Decrement vote count for the current user
      setVoteCount((prevCounts) => ({ ...prevCounts, [competitorId]: (prevCounts[competitorId] || 1) - 1 }));
    }
  };
  
  const updateVoteCountInFirestore = async () => {
    // Add the logic to update the vote count in Firestore
    try {
      const userRef = doc(firestore, 'Admins', user.uid);
      const userDoc = await getDoc(userRef);
  
      const userVotedPoolsMap = userDoc.data().votedPools || {};
  
      if (userVotedPoolsMap[poolId]) {
        console.log('User has already voted for this pool.');
        alert('User has already voted for this pool.');
        return;
      }
  
      const batch = writeBatch(firestore);
  
      for (const competitorId of checkedCompetitorIds) {
        const competitorRef = doc(firestore, 'competitors', competitorId);
  
        // Fetch the current voteCount value
        const competitorDoc = await getDoc(competitorRef);
        const currentVoteCount = competitorDoc.data().voteCount || 0;
        const votedPoolsMap = competitorDoc.data().votedPools || {};
  
        // Increment the voteCount manually
        const newVoteCount = currentVoteCount + 1;
        // Replace with your actual pool ID
        votedPoolsMap[poolId] = newVoteCount;
  
        batch.update(competitorRef, {
          votedPool: votedPoolsMap,
          voteCount: newVoteCount,
        });
      }
  
      // Commit the batch only once after all updates
      await batch.commit();
  
      userVotedPoolsMap[poolId] = true;
  
      await updateDoc(userRef, {
        votedPools: userVotedPoolsMap,
      });
  
      console.log('Vote count updated in Firestore');
      alert('Vote count updated in Firestore');
    } catch (error) {
      console.error('Error updating vote count in Firestore:', error.message);
    }
  };
  
  const handleAddVoteClick = () => {
    
    if (checkedCompetitorIds.length === 0) {
      alert('Select at least one competitor before adding your vote.');
      return;
    }
    updateVoteCountInFirestore();
  };
  


  const fetchCompetitorDetails = async (user) => {
    try {
      const competitorsCollection = collection(firestore, 'competitors');
      const q = query(competitorsCollection, where('poolid', '==', poolId));
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


    try {
      const poolsCollection = collection(firestore, 'Pools');
      const activePoolsQuery = query(poolsCollection,  where('poolId', '==', poolId));
      const activePoolsQuerySnapshot = await getDocs(activePoolsQuery);

      if (!activePoolsQuerySnapshot.empty) {
        const activePoolsData = [];
        activePoolsQuerySnapshot.forEach((poolDoc) => {
          activePoolsData.push({ id: poolDoc.id, ...poolDoc.data() });
        });
        setPoolDetails(activePoolsData);
       

      }
    } catch (error) {
      console.error('Error fetching active pools:', error.message);
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
               
                
  
                    <Dropdown.Item href="/Realityshow">Reality Shows</Dropdown.Item>
                    <Dropdown.Item href="/Organizations">Oraganization</Dropdown.Item>
                
  
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
      

    <br></br><br></br>


       {PoolDetails.length > 0 && (
        <div>
        <h1 style={{color:"white"}}>{PoolDetails[0].title}</h1>
          <br />
          <h4 style={{color:"white"}}>
          Voting Start {new Date(PoolDetails[0].stdate.toMillis()).toLocaleString()} - Voting End {new Date(PoolDetails[0].enddate.toMillis()).toLocaleString()}
          </h4>
          <br />
        </div>
      )}
    </Container><br></br><br></br>
    <MDBContainer>
      <MDBRow>
      <MDBCol md='3'>
      <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px'}}/>
      </MDBCol>
      <MDBCol md='6'>
      
      </MDBCol>
      <MDBCol md='3'>
      <Image src="https://i.ibb.co/VWLWZFb/815933137.jpg" rounded  style={{height:'100px',marginLeft:'100px'}}/>
      </MDBCol>
      </MDBRow>

      
    </MDBContainer><br></br>
      
    {competitorDetails.length > 0 && (
        <Container>
          <div>
            
            <Row>
              {competitorDetails.map((competitor, index) => (
                <Col key={index} sm={'auto'} className="mb-4">
                  <Card style={{ width: '18rem' }}>
                 
                    <Card.Img variant="top" src={competitor.Image} />
                    <Card.Body>
                      <Card.Title>Name- {competitor.Name}</Card.Title>
                      <Card.Text>Colombo distric</Card.Text>
                      <Card.Text>Age:21</Card.Text>
                      <Switch
                        checked={checked[index] || false}
                        onChange={() => handleSwitchChange(index, competitor.id)}
                        inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      )}
       <Button
                variant="primary"
                size="lg"
                type="submit"
                onClick={handleAddVoteClick}
                style={{
                  marginLeft: '110px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Add Vote 
              </Button>
             
              <Link to={{
               pathname: "/Results",
               search: `?poolId=${poolId}`
               }}>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                marginLeft: '30px',
                background:'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',}}
                className="custom-button2">
                View Result
              </Button></Link>
              <br></br><br></br>
              <section className="vh-100" style={{ backgroundColor:'#111827',marginLeft:"-440px"}}>
                        <MDBContainer className="py-5">
                          <MDBRow className="justify-content-center">
                            <MDBCol md="12" lg="10" xl="8">
                              <MDBCard style={{backgroundColor:'#111827'}}>
                                <MDBCardBody>
                                  <div className="d-flex flex-start align-items-center">
                                    <MDBCardImage
                                      className="rounded-circle shadow-1-strong me-3"
                                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                                      alt="avatar"
                                      width="60"
                                      height="60"
                                    />
                                    <div>
                                      <h6 className="fw-bold text-primary mb-1">Lily Coleman</h6>
                                      <p className="text-muted small mb-0">
                                        Shared publicly - Jan 2020
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mt-3 mb-4 pb-2" style={{color:'white'}}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip consequat.
                                  </p>

                                  <div className="small d-flex justify-content-start">
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon far icon="thumbs-up me-2" />
                                      <p className="mb-0">Like</p>
                                    </a>
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon far icon="comment-dots me-2" />
                                      <p className="mb-0">Comment</p>
                                    </a>
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon fas icon="share me-2" />
                                      <p className="mb-0">Share</p>
                                    </a>
                                  </div>
                                </MDBCardBody>
                                <MDBCardBody>
                                  <div className="d-flex flex-start align-items-center">
                                    <MDBCardImage
                                      className="rounded-circle shadow-1-strong me-3"
                                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                                      alt="avatar"
                                      width="60"
                                      height="60"
                                    />
                                    <div>
                                      <h6 className="fw-bold text-primary mb-1">Lily Coleman</h6>
                                      <p className="text-muted small mb-0">
                                        Shared publicly - Jan 2020
                                      </p>
                                    </div>
                                  </div>

                                  <p className="mt-3 mb-4 pb-2" style={{color:'white'}}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip consequat.
                                  </p>

                                  <div className="small d-flex justify-content-start">
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon far icon="thumbs-up me-2" />
                                      <p className="mb-0">Like</p>
                                    </a>
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon far icon="comment-dots me-2" />
                                      <p className="mb-0">Comment</p>
                                    </a>
                                    <a href="#!" className="d-flex align-items-center me-3">
                                      <MDBIcon fas icon="share me-2" />
                                      <p className="mb-0">Share</p>
                                    </a>
                                  </div>
                                </MDBCardBody>
                                <MDBCardFooter
                                 className="py-3 border-0"
                                 style={{backgroundColor:'#111827' }}
                                >
                                  <div className="d-flex flex-start w-100">
                                    <MDBCardImage
                                      className="rounded-circle shadow-1-strong me-3"
                                      src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(19).webp"
                                      alt="avatar"
                                      width="40"
                                      height="40"
                                    />
                                    <MDBTextArea label='Message' id='textAreaExample' rows={4} style={{backgroundColor:'#111827',color:'white'}} wrapperClass="w-100" />
                                  </div>
                                  <div className="float-end mt-2 pt-1" style={{color:'white'}}>
                                    <MDBBtn size="sm" className="me-1">Post comment</MDBBtn>
                                    <MDBBtn outline size="sm">Cancel</MDBBtn>
                                  </div>
                                </MDBCardFooter>
                              </MDBCard>

                            </MDBCol>
                          </MDBRow>
                        </MDBContainer>
                      </section>

         
      </div>
    );
  }

  