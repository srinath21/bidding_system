import React from 'react';
import { Button, Card, CardActions, CardContent, FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, Typography, Chip } from '@mui/material';
import ErrorBoundary from '../ErrorBoundary';
import { ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { getRemainingTime } from '../../utilities/UtilityFunction';
import PropTypes from 'prop-types';
import Image from '../Image';

const AuctionListDetails = (props) => {
    const navigate = useNavigate();

    return (
        <ErrorBoundary>
            <Grid size={{ xs: 0, md: 10 }} sx={{ pb: "2px" }} />
            <Grid size={{ xs: 12, md: 2 }} sx={{ pb: "2px" }}>
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
            {Array.isArray(props.auctions) && props.auctions.length > 0 ?
                props.auctions.map(auction => {
                    let remainingTime = getRemainingTime(auction.CloseTime)
                    let chipColor = (remainingTime !== "Closed" ? "green" : "red")
                    return (
                        <Grid key={auction.Code} size={{ xs: 12, md: 6, lg: 4, xl: 3 }} sx={{ pb: 2 }}>
                            <ErrorBoundary>
                                <Card variant='outlined'>
                                    <CardContent>
                                        <Image
                                            imageUrl={`http://localhost:3000/${auction.ProductImages}`}
                                            imageHeight={300}
                                            imageWidth={100}
                                        />
                                        <Chip
                                            label={remainingTime !== "Closed" ? "Live Auction" : "Closed"}
                                            size='small'
                                            sx={{ my: 1, background: chipColor }} />
                                        <Typography variant='h6'>
                                            {auction.ProductName}
                                        </Typography>
                                        <Typography variant='body1'>
                                            Minimum Bid: $ {auction.MinimumAmount}
                                        </Typography>
                                        <Typography variant='body1'>
                                            Current Bid: $ {auction.CurrentBid}
                                        </Typography>
                                        <Typography variant='body1'>
                                            Ends in: {remainingTime}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button variant='contained' disabled={props.isBiddable && remainingTime === "Closed"} fullWidth onClick={() => navigate(
                                            props.isBiddable ? `/auctions/auction/bid/${auction.Code}` : `/auctions/auction/${auction.Code}`, {
                                            state: {
                                                previousLocationPath: location.pathname
                                            }
                                        })}>
                                            {
                                                props.isBiddable ?
                                                    "Bid Now" :
                                                    <>
                                                        <Typography sx={{ mr: 2 }} variant='caption'>View Details</Typography> <ArrowForwardIos fontSize="24" />
                                                    </>
                                            }
                                        </Button>
                                    </CardActions>
                                </Card>
                            </ErrorBoundary>
                        </Grid>
                    )
                }) : <Typography variant='h6'>No Auctions Found!</Typography>}
        </ErrorBoundary>
    )
}

AuctionListDetails.propTypes = {
    auctions: PropTypes.arrayOf(PropTypes.objectOf({
        Code: PropTypes.number.isRequired,
        ProductName: PropTypes.string.isRequired,
        MinimumAmount: PropTypes.number.isRequired,
        CloseTime: PropTypes.string.isRequired,
        CurrentBid: PropTypes.number
    })),
    isBiddable: PropTypes.bool.isRequired
};

AuctionListDetails.defaultProps = {
    isBiddable: false
}

export default AuctionListDetails;