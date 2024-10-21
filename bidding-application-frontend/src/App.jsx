import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router';
import About from './components/About/About';
import SignUp from './components/Authorization/SignUp';
import Login from './components/Authorization/Login';
import { Container } from '@mui/material';
import AuctionList from './components/Auctions/AuctionList';
import Home from './components/Home';
import Auction from './components/Auctions/Auction';
import BidDetails from './components/Bidding/BidDetails';

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
          Name: "Active Bids"
        }
      ]
    },
    {
      Name: 'About Us',
      URL: "/about"
    }];
  const settings = {
    profileSettings: [
      'View Profile', 'Settings', 'My bids'],
    transactionSettings: ['Credit Cards', 'My Auctions', 'Invite Colleagues'],
    miscellaneousSettings: ['Notifications', 'Community', 'Support', 'API']
  };
  return (
    <>
      <Navbar menu={pages} userMenu={settings} />
      <Container sx={{ maxWidth: "none" }} fixed>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/about" Component={About} />
          <Route path="/signup" Component={SignUp} />
          <Route path="/login" Component={Login} />
          <Route path="/auctions" Component={AuctionList} />
          <Route path="/auctions/auction/:code?" Component={Auction} />
          <Route path="/bid/:code" Component={BidDetails} />
        </Routes>
      </Container>
    </>
  )
}

export default App
