import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import About from './Components/About';
import Adminhome from './Components/AdminHome';
import Cart from './Components/Cart';
import Foot from './Components/Foot';
import Home from './Components/Home';
import Login from './Components/Login';
import Navigationbar from './Components/Navigationbar';
import User from './Components/Orderstatus';
import ProductAddPage from './Components/Productadd';
import Register from './Components/Register';
import Shop from './Components/Shop';
import './Components/Styles.css';
import Update from './Components/Update';

import Sidenav from './Components/AdminPannel';
import ProductDelete from './Components/DeleteProduct';
import ProductTile from './Components/ProductTile';
import ProductUpdatePage from './Components/Updateproduct';
function App() {

  return (


    <div>


      <Router>


        <Navigationbar />
        <Sidenav/>

        <Routes>
          <Route  path='/' element={<Home />}></Route>
          <Route  path='/home' element={<Home />}></Route>
          <Route  path='/shop' element={<Shop />}></Route>
          <Route  path='/about' element={<About />}></Route>
          <Route  path='/login' element={<Login />}></Route>
          <Route  path='/cart' element={<Cart />}></Route>
          <Route  path='/register' element={<Register />}></Route>
          <Route  path='/login' element={<Login />}></Route>
          <Route  path='/orderstatus' element={<User />}></Route>
          <Route  path='/update' element={<Update />}></Route>
          <Route  path='/Productadd' element={<ProductAddPage/>}></Route>
          <Route  path='/Updateproduct' element={<ProductUpdatePage/>}></Route>
          <Route  path='/DeleteProduct' element={<ProductDelete/>}></Route>
          <Route  path='/producttile' element={<ProductTile/>}></Route>
          <Route  path='/AdminHome' element={<Adminhome/>}></Route>
     
     


        </Routes>
        <Foot />

      </Router>
    </div>
  );
}

export default App;
