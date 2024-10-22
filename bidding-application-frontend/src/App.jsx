import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Navigate, Route, Routes } from 'react-router';
import About from './components/About/About';
import SignUp from './components/Authorization/SignUp';
import Login from './components/Authorization/Login';
import { Container } from '@mui/material';
import AuctionList from './components/Auctions/AuctionList';
import Home from './components/Home';
import Auction from './components/Auctions/Auction';
import BidDetails from './components/Bidding/BidDetails';
import BidList from './components/Bidding/BidList';
import NotFound from './components/NotFound';
import Profile from './components/User/Profile';
import ChangePassword from './components/User/ChangePassword';
import Notification from './components/Notification/Notification';

function App() {
  const pages = [
    {
      Name: 'Auctions',
      subPages: [
        {
          Name: "New Auction",
          URL: "/auctions/auction"
        },
        {
          Name: "My Auctions",
          URL: "/auctions"
        }
      ],
    },
    {
      Name: 'Bidding',
      subPages: [
        {
          Name: "My Bids",
          URL: "/bids"
        }
      ]
    },
    {
      Name: 'About Us',
      URL: "/about"
    }];
  const settings = {
    profileSettings: [
      { Name: 'View Profile', URL: "/users/profile" }, { Name: 'Change Password', URL: "/users/changepassword" }, { Name: 'My bids', URL: "/bids" }
    ],
    transactionSettings: [
      { Name: 'Credit Cards', URL: "" }, { Name: 'My Auctions', URL: "" }, { Name: 'Invite Colleagues', URL: "" }
    ],
    miscellaneousSettings: [
      { Name: 'Notifications', URL: "" }, { Name: 'Community', URL: "" }, { Name: 'Support', URL: "" }, { Name: 'API', URL: "" }]
  };
  return (
    <>
      <Navbar menu={pages} userMenu={settings} />
      <Container fixed disableGutters={true}>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/about" Component={About} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/login" Component={Login} />
          <Route path="/auctions" Component={AuctionList} />
          <Route path="/auctions/auction/:code?" Component={Auction} />
          <Route path="auctions/auction/bid/:code" Component={BidDetails} />
          <Route path="/bids" Component={BidList} />
          <Route path='/users/profile' Component={Profile} />
          <Route path='/users/changepassword' Component={ChangePassword} />
          <Route path="/notfound" Component={NotFound} />
          <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
        <Notification />
      </Container>
    </>
  )
}

export default App
