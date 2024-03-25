import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import { auth, firestore, storage } from '../firebase';
import './Styles.css';

// Function to simplify image upload
const uploadImage = async (imageFile, path) => {
  try {
    const storageRef = ref(storage, path + imageFile.name);
    await uploadBytes(storageRef, imageFile);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error uploading image:', error.message);
    throw error;
  }
};

const AddPage = () => {
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');
  const [Description, setDescription] = useState('');
  const [Province, setProvince] = useState('');
  const [Image1, setImage1] = useState(null);
  const [competitorDetails, setCompetitorDetails] = useState([]);
  const [poolIds, setPoolIds] = useState([]);
  const [editCompetitor, setEditCompetitor] = useState(null);
  const [selectedPoolId, setSelectedPoolId] = useState('');
  const [selectedPoolId1, setSelectedPoolId1] = useState('');
  const user = auth.currentUser;

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage1(file);
  };

  useEffect(() => {
    const fetchPoolIds = async () => {
      try {
        const poolsCollection = collection(firestore, 'Pools');
        const querySnapshot = await getDocs(query(collection(firestore, 'Pools'), where('Adminid', '==', user.uid)));
  
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
  
  
 

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const poolId = selectedPoolId;
      const Image1URL = Image1 ? await uploadImage(Image1, 'sponsor_images/') : null;

      await addDoc(collection(firestore, 'competitors'), {
        Adminid: user.uid,
        Name,
        Age,
        Province,
        poolid: poolId,
        Description,
        Image: Image1URL,
      });

      alert('Register successful!');
    } catch (error) {
      console.error('Register error:', error.message);
      alert(`Register error: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(query(competitorsCollection, where('Adminid', '==', user.uid)));

          if (!querySnapshot.empty) {
            const competitorData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setCompetitorDetails(competitorData);
          }
        }
      } catch (error) {
        console.error('Error fetching competitor details:', error.message);
      }
    };

    fetchCompetitorDetails();
  }, []);

  const handleEditClick = (competitor) => {
    if (competitor && competitor.id) {
      setEditCompetitor({ ...competitor, Image: competitor.Image || null });
    } else {
      console.error('Invalid competitor data for editing.');
    }
  };

  const handleSaveChanges = async () => {
    try {
      if (!editCompetitor) {
        console.error('Invalid competitor data for editing.');
        return;
      }

      const updatedCompetitor = { ...editCompetitor };

      if (updatedCompetitor.Image) {
        const updatedImageURL = await uploadImage(updatedCompetitor.Image, 'sponsor_images/');
        updatedCompetitor.Image = updatedImageURL;
      }

      await updateDoc(doc(firestore, 'competitors', editCompetitor.id), updatedCompetitor);

      setEditCompetitor(null);
    } catch (error) {
      console.error('Error updating competitor details:', error.message);
    }
  };

  const handleImageEdit = (e) => {
    const file = e.target.files[0];
    setEditCompetitor({ ...editCompetitor, Image: file });
  };

  const handleDeleteCompetitor = async (competitor) => {
    try {
      const competitorRef = doc(firestore, 'competitors', competitor.id);
      await deleteDoc(competitorRef);

      // Update the state to reflect the deletion
      const updatedCompetitors = competitorDetails.filter((c) => c.id !== competitor.id);
      setCompetitorDetails(updatedCompetitors);

      alert('Competitor deleted successfully!');
    } catch (error) {
      console.error('Error deleting competitor:', error.message);
      alert(`Error deleting competitor: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchCompetitorDetails = async () => {
      try {
        const user = auth.currentUser;
        if (user && selectedPoolId1) {
          const competitorsCollection = collection(firestore, 'competitors');
          const querySnapshot = await getDocs(
            query(competitorsCollection, where('poolid', '==', selectedPoolId1))
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
  }, [selectedPoolId1]);
  
  return (
    <div className="Align">
           <h4 style={{marginLeft:"-50px"}}>Add Candidates </h4>
      <MDBContainer fluid className="p-3 my-5" style={{marginLeft:"-70px"}}>
 
        <MDBRow>
          <MDBCol col='4' md='6'>
            <form onSubmit={handleRegister}>
            <Form.Select onChange={(e) => setSelectedPoolId(e.target.value)} aria-label="Default select example">
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
        <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
  ))}
     </Form.Select>

              <br></br>

              <MDBInput
                wrapperClass='mb-4'
                label='Name'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Name"
                value={Name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Age'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Age"
                value={Age}
                onChange={(e) => setAge(e.target.value)}
                required
              />


          <Form.Select onChange={(e) => setProvince(e.target.value)} aria-label="Default select example" >
          <option>Select Province</option>
          <option value="Central Province"> Central Province</option>
          <option value="Eastern Province">Eastern Province</option>
          <option value="North Central Province">North Central Province</option>
          <option value="Northern Province"> Northern Province</option>
          <option value="North Western Province">North Western Province</option>
          <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
          <option value="Southern Province">Southern Province</option>
          <option value="Uva Province">Uva Province</option>
          <option value="Western Province">Western Province</option>
         
     
     </Form.Select><br></br>

              <MDBInput
                wrapperClass='mb-4'
                label='Description'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Description"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <input
                type="file"
                onChange={handleImage}
                accept="image/*"
                required
              />

              <br></br><br></br>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Add Competitor
              </Button>

              <br />
              <br />
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {competitorDetails.length > 0 && (
        <Container style={{marginLeft:'-70px'}}>
          <div>
            <h4>All Candidates Details:</h4>
            <Form.Select onChange={(e) => setSelectedPoolId1(e.target.value)} aria-label="Default select example" style={{backgroundColor:'lightblue'}}>
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
        <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
        ))}
     </Form.Select><br></br>
            <Table striped bordered hover style={{border:'2px'}}>
              <thead>
                <tr>
                  <th>Competitor Id</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Province</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {competitorDetails.map((competitor, index) => (
                  <tr key={index}>
                    <td>{competitor.id}</td>
                    <td><img src={competitor.Image} alt="Competitor" style={{ maxWidth: '80px' }} /></td>
                    <td>{competitor.Name}</td>
                    <td>{competitor.Age}</td>
                    <td>{competitor.Province}</td>
                    <td>{competitor.Description}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleEditClick(competitor)}>
                        Update
                      </Button>
                      <Button
                        variant="danger"
                        style={{ marginLeft: '1px' }}
                        onClick={() => handleDeleteCompetitor(competitor)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Container>
      )}

      <Modal show={editCompetitor !== null} onHide={() => setEditCompetitor(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Competitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="editName">Name:</label>
          <input
            type="text"
            className="form-control"
            id="editName"
            value={editCompetitor ? editCompetitor.Name : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Name: e.target.value })}
          />

          <label htmlFor="editAge">Age:</label>
          <input
            type="text"
            className="form-control"
            id="editAge"
            value={editCompetitor ? editCompetitor.Age : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Age: e.target.value })}
          />

         <label htmlFor="editAge">Province:</label>
          <input
            type="text"
            className="form-control"
            id="editprovince"
            value={editCompetitor ? editCompetitor.Province : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Province: e.target.value })}
          />

          <label htmlFor="editDescription">Description:</label>
          <input
            type="text"
            className="form-control"
            id="editDescription"
            value={editCompetitor ? editCompetitor.Description : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, Description: e.target.value })}
          />

          <label htmlFor="editImage">Image:</label>
          <input
            type="file"
            className="form-control"
            id="editImage"
            onChange={handleImageEdit}
            accept="image/*"
          />

          <label htmlFor="editPoolId">Pool ID:</label>
          <Form.Select
            aria-label="Default select example"
            value={editCompetitor ? editCompetitor.poolid : ''}
            onChange={(e) => setEditCompetitor({ ...editCompetitor, poolid: e.target.value })}
          >
           {poolIds.map((pool) => (
          <option key={pool.id} value={pool.id}>
         {`${pool.id} - ${pool.title}`}
        </option>
         ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPage;
