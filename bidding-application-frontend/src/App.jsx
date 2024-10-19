import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'

function App() {
  const pages = [
    {
      Name: 'Auctions',
      subPages: [
        {
          Name: "New Auction"
        }
      ]
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
      Name: 'About Us'
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
    </>
  )
}

export default App
