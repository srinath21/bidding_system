import { Box, Grid2 as Grid, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import AuctionList from './Auctions/AuctionList';

const Home = (props) => {
    const [auctions, setAuctions] = React.useState([]);

    return (
        <Box sx={{ flexGrow: 1, my: 2 }}>
            <Grid container spacing={2}>
                <Typography variant='h4' sx={{ mt: 5, mb: 1 }}>
                    Explore Auctions
                </Typography>
                <AuctionList />
            </Grid>
        </Box>
    )
}

export default Home;