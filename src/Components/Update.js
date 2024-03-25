import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { auth, firestore, storage } from '../firebase';

export default function Update() {
  const [formData, setFormData] = useState({


    email: '',
    displayName: '',
    address: '',
    nic: '',
    name: '',
    categorie: '',
    Submitdate:'',
    password: '',
    currentPassword: '',
    image: null,
    imagelogo: null,
    
  });

  const [errors, setErrors] = useState({
    email: '',
    displayName: '',
    password: '',
    currentPassword: '',
  });

  const [isAdmin, setIsAdmin] = useState(false); // Add state to track user role

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const adminDocRef = doc(firestore, 'Admins', user.uid);
          const nuserDocRef = doc(firestore, 'Nusers', user.uid);

          const isAdminUser = (await getDoc(adminDocRef)).exists();
          const isNuserUser = (await getDoc(nuserDocRef)).exists();

          setIsAdmin(isAdminUser);

          const userDocRef = isAdminUser ? adminDocRef : nuserDocRef;
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            console.log('Fetched User Data:', userData);

            setFormData({
              email: userData.email || '',
              displayName: userData.displayName || '',
              address: userData.address || '',
              nic: userData.nic || '',
              name: userData.Competition_name || '',
              categorie: userData.Competition_cat || '',
              password: '',
              Submitdate:serverTimestamp(),
              image: userData.image || null,
              imagelogo: userData.imagelogo || null,
            });
          } else {
            console.error('User document not found.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, imagelogo: file });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = {};
  setErrors(validationErrors);

  if (!formData.currentPassword) {
    validationErrors.currentPassword = 'Current password is required';
  }

  if (!isAdmin && !formData.password) {
    validationErrors.password = 'Password is required for Nusers';
  }

  if (Object.keys(validationErrors).length === 0) {
    try {
      const user = auth.currentUser;

      if (user) {
        const authInstance = auth; // Retrieve the auth instance

        // Reauthenticate the user before changing the password
        const credentials = EmailAuthProvider.credential(user.email, formData.currentPassword);
        await reauthenticateWithCredential(user, credentials);

        const userRef = isAdmin ? doc(firestore, 'Admins', user.uid) : doc(firestore, 'Nusers', user.uid);

        // Only include the necessary fields in the updateData object
        const updateData = {
          email: formData.email,
          password: formData.password,  // Include password field for Nusers
          currentPassword: formData.currentPassword,
          Submitdate:serverTimestamp(),
        };

        if (isAdmin) {
          // Include additional fields for admins
          if (formData.displayName) updateData.displayName = formData.displayName;
          if (formData.address) updateData.address = formData.address;
          if (formData.nic) updateData.nic = formData.nic;
          if (formData.name) updateData.Competition_name = formData.name;
          if (formData.categorie) updateData.Competition_cat = formData.categorie;

          if (formData.image) {
            const imageRef = ref(storage, `userImages/${user.uid}_${formData.image.name}`);
            await uploadBytes(imageRef, formData.image);
            const imageUrl = await getDownloadURL(imageRef);
            updateData.image = imageUrl;
          }

          if (formData.imagelogo) {
            const logoRef = ref(storage, `userLogos/${user.uid}_${formData.imagelogo.name}`);
            await uploadBytes(logoRef, formData.imagelogo);
            const logoUrl = await getDownloadURL(logoRef);
            updateData.imagelogo = logoUrl;
          }
        }

        await updateDoc(userRef, updateData);

        // Update the password
        if (isAdmin) {
          // Only update password for admins
          await updatePassword(user, formData.password);
        }

        alert('Update successful!');
      } else {
        alert('User not found. Please make sure you are logged in.');
      }
    } catch (error) {
      console.error('Update error:', error.message);
      alert(`Update error: ${error.message}`);
    }
  }
};
  return (
    <div><br></br>
      <MDBContainer fluid className="p-3 my-5">
        <MDBRow>
          <MDBCol col='10' md='6'>
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone image"
            />
          </MDBCol>
          <MDBCol col='4' md='6'>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass='mb-4'
                label='Email address'
                id='formControlLg'
                type='email'
                size="lg"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />

              {isAdmin && ( // Show these fields only if the user is an admin
                <>
                  <MDBInput
                    wrapperClass='mb-4'
                    label='Display Name'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                  />

                  <MDBInput
                    wrapperClass='mb-4'
                    label='Address'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />

                  <MDBInput
                    wrapperClass='mb-4'
                    label='NIC'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="nic"
                    value={formData.nic}
                    onChange={handleInputChange}
                  />

                  <h6>Competition Name</h6>
                  <MDBInput
                    wrapperClass='mb-4'
                    id='formControlLg'
                    type='text'
                    size="lg"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />

                  <h6>Competition Category</h6>
                  <select
                    name="categorie"
                    onChange={handleInputChange}
                    value={formData.categorie}
                    className="form-select mb-4"
                  >
                    <option value="">Select category</option>
                    <option value="Realityshow">Realityshow</option>
                    <option value="Organization">Organization</option>
                  </select>
                </>
              )}

              <MDBInput
                wrapperClass='mb-4'
                label='Current Password'
                id='formControlLg'
                type='password'
                size="lg"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
              />

             
                  <MDBInput
                    wrapperClass='mb-4'
                    label='New Password'
                    id='formControlLg'
                    type='password'
                    size="lg"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
           {isAdmin && (
                <>
                  <h6>Utility Bill Image</h6>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    required
                  />
                  <br/><br/>

                  <h6>Competition Logo</h6>
                  <input
                    type="file"
                    onChange={handleLogoChange}
                    accept="image/*"
                    required
                  />
                </>
              )}

              <br/><br/>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                style={{
                  marginRight: '10px',
                  background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                }}
                className="custom-button2"
              >
                Update
              </Button>

              <a href='/Login'>
                <Button
                  variant="primary"
                  size="lg"
                  style={{
                    background: 'linear-gradient(to right, rgba(101, 126, 234, 0.9), rgba(118, 75, 162, 0.9))',
                  }}
                  className="custom-button2"
                >
                  Back to login
                </Button>
              </a>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
