import {
  MDBBtn,
  MDBContainer,
  MDBFooter,
  MDBIcon,
} from 'mdb-react-ui-kit';
import React from 'react';
import { useLocation } from "react-router-dom";
import './Styles.css';


export default function Foot(){
  const location = useLocation();

  // Hide navbar on login page
  if (location.pathname === '/Dashboard') {
    return null;
  }
  else if (location.pathname === '/Register') {
    return null;
  }
 
  else if(location.pathname =="/ProductAdd"){

    return null;
  }
  else if(location.pathname =="/Updateproduct"){

    return null;
  }
  else if(location.pathname =="/DeleteProduct"){

    return null;
  }
  else if(location.pathname =="/Admin"){

    return null;
  }
  else if(location.pathname =="/Adminpannel"){

    return null;
  }
  else if(location.pathname =="/AdminHome"){

    return null;
  }

  return(
    //  <Router>

<div>
<MDBFooter className='text-center' color='white' bgColor='dark'>
      <MDBContainer className='p-4'>
        <section className='mb-4'>
          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='facebook-f' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='twitter' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='google' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='instagram' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='#!' role='button'>
            <MDBIcon fab icon='linkedin-in' />
          </MDBBtn>

          <MDBBtn outline color="light" floating className='m-1' href='https://github.com/DevTech-Nexus' role='button' target='_blank'>
            <MDBIcon fab icon='github' />
          </MDBBtn>
        </section>

        <section className='mb-4'>
          <p>
            This is a mock e-commerce platform designed as a proof of concept for our EAD project. All components are working, including the PayPal API. DO NOT MAKE DIRECT PURCHASES. THIS IS FOR DEMONSTRATION PURPOSES ONLY.
            Made by Poorna, Isuru, Akash, Duleesha, and Devtharu.
          </p>
        </section>

        <section className=''>
 
        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © DevTech-Nexus 2023
        <a className='text-white' href='https://mdbootstrap.com/'>
        </a>
      </div>
    </MDBFooter>
</div>
//  </Router>

  );
}
