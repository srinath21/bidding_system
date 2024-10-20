import React from 'react';
import { Box, Button, Card, CardActions, CardContent, FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, Typography, Chip } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary';
import { useNavigate } from 'react-router';

const AuctionList = (props) => {
    const [auctions, setAuctions] = React.useState([]);
    const navigate = useNavigate();

    React.useEffect(() => {
        setAuctions([{
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }, {
            ItemName: "Sony Black Headphones",
            MinimumBid: "$100",
            CurrentBid: "$157",
            CloseTime: "1 day 12 hrs 43 mins"
        }])
    }, [])

    return (
        <ErrorBoundary>
            <Box sx={{ flexGrow: 1, mt: 7 }}>
                <Grid container spacing={2}>
                    <Grid size={{ md: 10 }} sx={{ pb: "2px" }}>
                        <Typography variant='h4'>
                            Welcome {props.FirstName}!
                        </Typography>
                    </Grid>
                    <Grid size={{ md: 2 }} sx={{ pb: "2px" }}>
                        <FormControl fullWidth>
                            <InputLabel id="auctions-filters-label">Filters</InputLabel>
                            <Select
                                labelId='auctions-filters-label'
                                value={0}
                                label="Filters"
                                onChange={(event, child) => { console.log(child) }}
                                size='small'
                            >
                                <MenuItem value={0}>Showing all</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    {Array.isArray(auctions) ?
                        auctions.map(auction => (
                            <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }} sx={{ pb: 2 }}>
                                <ErrorBoundary>
                                    <Card variant='outlined'>
                                        <CardContent>
                                            <img src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" alt='Image' height={300} style={{ width: "100%" }} />
                                            <Chip label="Live Auction" size='small' sx={{ my: 1 }} />
                                            <Typography variant='h6'>
                                                {auction.ItemName}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Minimum Bid: {auction.MinimumBid}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Current Bid: {auction.CurrentBid}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Ends in: {auction.CloseTime}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button variant='contained' fullWidth onClick={() => navigate(`/bid`)}>
                                                Bid now
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </ErrorBoundary>
                            </Grid>
                        )) : null}
                </Grid>
            </Box>
        </ErrorBoundary>
    )
}

export default AuctionList;