import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from "react";
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { auth, firestore, storage } from '../firebase';
import './Styles.css';

const ProSpan = styled('span')({
  display: 'inline-block',
  height: '1em',
  width: '1em',
  verticalAlign: 'middle',
  marginLeft: '0.3em',
  marginBottom: '0.08em',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(https://mui.com/static/x/pro.svg)',
});

function Label({  isProOnly }) {
 

  if (isProOnly) {
    return (
      <Stack direction="row" spacing={0.5} component="span">
        <Tooltip title="Included on Pro package">
          <a href="https://mui.com/x/introduction/licensing/#pro-plan">
            <ProSpan />
          </a>
        </Tooltip>
       
      </Stack>
    );
  }

 
}


const Createpool = () => {



  const [title, setTitle] = useState();
  const [Description, setDescription] = useState();
  const [stdate, setStdate]=useState();
  const [enddate, setEnddate]=useState();
  const [type, settype]=useState('');
  const [sponsorImage1, setSponsorImage1] = useState(null);
  const [poolImage,setPoolImage] = useState(null);
  const [sponsorImage2, setSponsorImage2] = useState(null);
  const [poolIds, setPoolIds] = useState([]);

  const [editPool, setEditPool] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showsModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState('');
  const [editPoolImage, setEditPoolImage] = useState(null);
  const [pools, setPools] = useState([]);
  const [csvFile, setCsvFile] = useState(null);
  const [editCsvFile, setEditCsvFile] = useState(null);

// Add this handler function

const handleEditCsvFileChange = (e) => {
  const file = e.target.files[0];
  setEditCsvFile(file);
};


  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };


  const handleSponsorImage1Change = (e) => {
    const file = e.target.files[0];
    setSponsorImage1(file);
  };

 
  
  const handleSponsorImage2Change = (e) => {
    const file = e.target.files[0];
    setSponsorImage2(file);
  };

  const handleEditSponsorImage1Change = (e) => {
    const file = e.target.files[0];
    setEditPool({ ...editPool, sponsorImage1: file });
  };
  
  const handleEditSponsorImage2Change = (e) => {
    const file = e.target.files[0];
    setEditPool({ ...editPool, sponsorImage2: file });
  };


  
  const uploadImage = async (imageFile, folderName) => {
    try {
      const storageRef = ref(storage, `${folderName}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }
  };
  


  const handleEditClick = (pool) => {
    setEditPool({ ...pool }); // Set the pool data to be edited
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedPoolData = {
        ...editPool,
        stdate: editPool.stdate.toDate(),
        enddate: editPool.enddate.toDate(),
      };
  
      // Upload new images if they exist
      if (editPool.sponsorImage1) {
        const sponsorImage1URL = await uploadImage(editPool.sponsorImage1);
        updatedPoolData.sponsorImage1 = sponsorImage1URL;
      }
  
      if (editPool.sponsorImage2) {
        const sponsorImage2URL = await uploadImage(editPool.sponsorImage2);
        updatedPoolData.sponsorImage2 = sponsorImage2URL;
      }
  
      // Upload new CSV file if it exists
      if (editCsvFile) {
        const csvFileURL = await uploadImage(editCsvFile);
        updatedPoolData.csvFile = csvFileURL;
      }

   

  
      // Update the pool data in the Firestore document
      const poolRef = doc(firestore, 'Pools', editPool.id);
      await updateDoc(poolRef, updatedPoolData);
  
      // Refresh the pool data in the state
      const updatedPools = pools.map((pool) =>
        pool.id === editPool.id ? { ...pool, ...updatedPoolData } : pool
      );
      setPools(updatedPools);
  
      setShowEditModal(false);
      alert('Pool details updated successfully!');
    } catch (error) {
      console.error('Error updating pool:', error.message);
      alert(`Error updating pool: ${error.message}`);
    }
  };
  
  
  

  const handleDelete = async (pool) => {
    try {
      // Construct a reference to the Firestore document
      const poolRef = doc(firestore, 'Pools', pool.id);

      // Delete the document
      await deleteDoc(poolRef);

      // Update the state to reflect the deletion
      const updatedPools = pools.filter((p) => p.id !== pool.id);
      setPools(updatedPools);

      setShowDeleteModal(false); // Close the delete modal if needed

      alert('Pool deleted successfully!');
    } catch (error) {
      console.error('Error deleting pool:', error.message);
      alert(`Error deleting pool: ${error.message}`);
    }
  };
   
  
 


const handleSelectChange = (e) => {
  settype(e.target.value);
};
  

  const user = auth.currentUser;
  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      // Upload images and get download URLs

      const adminDocRef = doc(firestore, 'Admins', user.uid);
      const adminDocSnapshot = await getDoc(adminDocRef);
      const { Competition_cat, Competition_name, imagelogo } = adminDocSnapshot.data();

  
      const sponsorImage1URL = sponsorImage1 ? await uploadImage(sponsorImage1) : null;
      const sponsorImage2URL = sponsorImage2 ? await uploadImage(sponsorImage2) : null;
  

      const emailsFromCsv = await new Promise((resolve) => {
        if (csvFile) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const csvContent = event.target.result;
            // Process CSV content (parse it to extract email addresses)
            // For simplicity, let's assume that each line of the CSV file is an email address
            const emails = csvContent.split('\n').map((email) => email.trim());
            // Remove empty emails
            const filteredEmails = emails.filter((email) => email !== '');
            resolve(filteredEmails);
          };
          reader.readAsText(csvFile);
        } else {
          resolve([]); // If no CSV file, resolve with an empty array
        }
      });
  
      // Add your pool data to the firestore document
      const poolData = {
        title: title,
        description: Description,
        stdate: stdate instanceof Date ? stdate : new Date(stdate),
        enddate: enddate instanceof Date ? enddate : new Date(enddate),
        Type: type,
        sponsorImage1: sponsorImage1URL,
        sponsorImage2: sponsorImage2URL,
        emails: emailsFromCsv,
        Adminid:user.uid,
        Competition_cat:Competition_cat,
        Competition_name:Competition_name,
        Competition_logo:imagelogo,
        
      
       
      
        // Add any other pool-related data as needed
      };
  
      // Add the pool data to the 'Pools' collection
       await addDoc(collection(firestore, 'Pools'), poolData);
      alert('Pool created successfully!');
      console.log('Pool created successfully!');
    } catch (error) {
      console.error('Error creating pool:', error.message);
      alert(`Error creating pool: ${error.message}`);
    }
  };
  


  const handleDetailsClick = () => {
  setShowDetailsModal(true);

  };

  const handlepool = () => {
    setShowModal(true);
  
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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Make a query to Firestore to get pool data
          const poolsCollection = collection(firestore, "Pools");
          const querySnapshot = await getDocs(query(poolsCollection, where('Adminid', '==', user.uid)));
          const poolsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
    
          // Update the state with fetched pool data
          setPools(poolsData);
        } catch (error) {
          console.error("Error fetching pools:", error.message);
        }
      };
    
      // Call the fetchData function when the component mounts
      fetchData();
    }, [user.uid]);
    

    const handleActive = async (selectedPoolId) => {
      try {
        const poolsCollection = collection(firestore, 'Pools');
    
        // Update the selected pool with poolActive: "Active"
        const selectedPoolRef = doc(poolsCollection, selectedPoolId);
        await updateDoc(selectedPoolRef, { poolActive: 'Active' });
    
        // Fetch all pools related to the current user
        const querySnapshot = await getDocs(query(poolsCollection, where('Adminid', '==', user.uid)));
    
        // Update other pools with poolActive: null
        const updatePromises = querySnapshot.docs.map(async (doc) => {
          const poolId = doc.id;
          if (poolId !== selectedPoolId) {
            const poolRef = doc.ref;
            await updateDoc(poolRef, { poolActive: "Not_Active" });
            console.log(`Updated pool ${poolId} to poolActive: Not_Active"`);
          }
        });
    
        // Wait for all updates to complete
        await Promise.all(updatePromises);
    
        console.log(`Pools updated successfully - ${selectedPoolId} is Active, others are set to Not_Active"`);
      } catch (error) {
        console.error('Error updating Firestore documents:', error.message);
        // Handle the error as needed
      }
    };
    
    

    

  const DetailsModal = () => (
    <Modal show={showsModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Active Pool</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Select onChange={(e) => setSelectedPoolId(e.target.value)} aria-label="Default select example">
          <option>Select Pool ID</option>
          {poolIds.map((pool) => (
            <option key={pool.id} value={pool.id}>
              {`${pool.id} - ${pool.title}`}
            </option>
          ))}
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => handleActive(selectedPoolId)}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
  
  // Step 3: Create the additional details modal content
  const AdditionalDetailsModal = () => (
    <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Additional Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Select aria-label="Default select example"
      
     value={type}
     onChange={handleSelectChange}>
     <option>Open this select Vote type</option>
     <option value="Vote only one competitor">Vote only one competitor</option>
     <option value="Vote many competitors">Vote many competitors</option>
     
    </Form.Select><br></br>
      
      <label htmlFor="editDescription">Sponsor Image 1</label>
      <input
      type="file"
      id="sponsorImage1"
      onChange={handleSponsorImage1Change}
      accept="image/*"
      /><br></br><br></br>

    
      <label htmlFor="editDescription">Sponsor Image 2</label>
      <input
      type="file"
      id="sponsorImage2"
      onChange={handleSponsorImage2Change}
      accept="image/*"
      /><br></br>
      <br></br>
      
      <label htmlFor="csvFile">Upload CSV File:</label>
              <input
                type="file"
                id="csvFile"
                onChange={handleCsvFileChange}
                accept=".csv"
              />

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

 

  return (
    
    <div style={{marginLeft:'300px',marginTop:'100px'}}>
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='4' md='6'>    
           <h4 style={{marginBottom:"20px"}}>Create Voting Pool </h4>
            <form onSubmit={handleRegister}>
              <MDBInput
                wrapperClass='mb-4'
                label='Pool Name'
                id='formControlLg'
                type='Text'
                size="lg"
                name="email"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <MDBInput
                wrapperClass='mb-4'
                label='Description'
                id='formControlLg'
                type='Text'
                size="lg"
                name="Title"
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
               
               
              <h6>Pool start time and Date </h6>
              <div>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div>
             <Label componentName="DateTimePicker" valueType="date time" />
             <DateTimePicker
                value={stdate}
                onChange={(newDate) => setStdate(newDate)}
             />
             </div>
            </LocalizationProvider>
            </div>
            <br></br>
           <div>
            <h6>Pool End time and Date </h6>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div>
             <Label componentName="DateTimePicker1" valueType="date time" />
             <DateTimePicker
              value={enddate}
              onChange={(newDate) => setEnddate(newDate)} />
             </div>
            </LocalizationProvider>
           </div>
       
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
                className="custom-button2">
                Create Pool
              </Button>
             
              <Button
                variant="primary"
                size="lg"
                style={{
                marginRight: '10px',
                background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                onClick={handleDetailsClick}
                className="custom-button2">
               Additional Details
              </Button>


              <Button
                variant="primary"
                size="lg"
                style={{
                  marginRight: '10px',
                  background:
                    'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                onClick={handlepool}
                className="custom-button2">
                Active Pool
              </Button>

              <br />
              <br />
            </form>
          </MDBCol>
        </MDBRow>
       
           

        <table className="table table-bordered" style={{border:'1px'}} >
        <thead>
          <tr>
            <th>Pool ID</th>
            <th>Pool Title</th>
            <th>Description</th>
            <th>Start Date & Time</th>
            <th>End Date & Time</th>
            <th>Vote Type</th>
            <th>Sponsor image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr key={pool.id}>
              <td>{pool.id}</td>
              <td>{pool.title}</td>
              <td>{pool.description}</td>
              <td>{pool.stdate instanceof Date ? pool.stdate.toLocaleString() : pool.stdate.seconds ? new Date(pool.stdate.seconds * 1000).toLocaleString() : pool.stdate}</td>
              <td>{pool.enddate instanceof Date ? pool.enddate.toLocaleString() : pool.enddate.seconds ? new Date(pool.enddate.seconds * 1000).toLocaleString() : pool.enddate}</td>
              <td>{pool.Type}</td>
              <td>
            {pool.sponsorImage1 && (
            <div>
           <img src={pool.sponsorImage1} alt="Sponsor Image 1" style={{ maxWidth: '100px' }} /><br></br>
           <img src={pool.sponsorImage2} alt="Sponsor Image 2" style={{ maxWidth: '100px' }} />
         </div>
           )}
        
        
          </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEditClick(pool)}
                >
                  Edit
                </Button>
                {' '}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(pool)}
                 
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </MDBContainer>
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pool Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add your edit form fields here */}
          {/* Example: */}
          <label htmlFor="editTitle">Title:</label>
          <input
            type="text"
            className="form-control"
            id="editTitle"
            value={editPool.title || ''}
            onChange={(e) => setEditPool({ ...editPool, title: e.target.value })}
          />

          <label htmlFor="editDescription">Description:</label>
          <input
            type="text"
            className="form-control"
            id="editDescription"
            value={editPool.description || ''}
            onChange={(e) => setEditPool({ ...editPool, description: e.target.value })}
          />
         
         <LocalizationProvider dateAdapter={AdapterDayjs}>
  <div>
    <Label componentName="DateTimePicker" valueType="date time" />
    <DateTimePicker
      value={editPool.stdate}
      onChange={(newDate) => setEditPool({ ...editPool, stdate: newDate })}
    />
  </div>
     </LocalizationProvider>

   <LocalizationProvider dateAdapter={AdapterDayjs}>
  <div>
    <Label componentName="DateTimePicker1" valueType="date time" />
    <DateTimePicker
      value={editPool.enddate}
      onChange={(newDate) => setEditPool({ ...editPool, enddate: newDate })}
    />
  </div>
  </LocalizationProvider>
         Vote Type
        
       <Form.Select aria-label="Default select example"
        value={editPool.Type || ''}
        onChange={(e) => setEditPool({ ...editPool, Type: e.target.value })}>
        <option>Open this select menu</option>
        <option value="Vote only one competitor">Vote only one competitor</option>
        <option value="Vote many competitors">Vote many competitors</option>
        </Form.Select>

        <label htmlFor="editDescription">Current Sponsor Image 1:</label>
        {editPool.sponsorImage1 && (
      <img src={editPool.sponsorImage1} alt="Current Sponsor Image 1" style={{ maxWidth: '100px' }} />
       )}


<br></br>
<input
  type="file"
  id="editSponsorImage1"
  onChange={handleEditSponsorImage1Change}
  accept="image/*"
/>

<label htmlFor="editDescription">Current Sponsor Image 2:</label>
{editPool.sponsorImage2 && (
  <img src={editPool.sponsorImage2} alt="Current Sponsor Image 2" style={{ maxWidth: '100px' }} />
)}

<br></br>
<input
  type="file"
  id="editSponsorImage2"
  onChange={handleEditSponsorImage2Change}
  accept="image/*"
/>

<br></br><br></br>
<label htmlFor="editCsvFile">Edit CSV File:</label>
  <input
    type="file"
    id="editCsvFile"
    onChange={handleEditCsvFileChange}
    accept=".csv"
  />
 
              
          {/* Add more fields as needed */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Pool</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this pool?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      

      {AdditionalDetailsModal()}
      {DetailsModal()}
      
    </div>
  );
};

export default Createpool;
