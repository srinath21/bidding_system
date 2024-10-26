import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Backdrop, Box, CircularProgress, Typography, Grid2 as Grid, Card, CardContent, Chip, CardActions, Button } from "@mui/material";
import axios from "axios";
import { Navigate, useNavigate } from "react-router";
import { connect } from "react-redux";
import { ArrowForwardIos } from "@mui/icons-material";
import { getRemainingTime } from "../../utilities/UtilityFunction";
import Image from "../Image";

const BidList = (props) => {
    const navigate = useNavigate();

    const [isFetchingData, setIsFetchingData] = React.useState(false);
    const [bidList, setBidList] = React.useState([])

    React.useEffect(() => {
        try {
            if (!props.userDetails.isAuth) {
                navigate('/');
                return;
            }

            setIsFetchingData(true)
            axios.get("http://localhost:3000/api/bids/all", {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    setBidList(response.data.result);
                }
                else {
                    console.log("Error in Bids API: ", error);
                }

                setIsFetchingData(false);
            }).catch(error => {
                console.log("Error fetching bids: ", error);
                setIsFetchingData(false);
            })
        }
        catch (error) {
            console.log("Error fetching the bids: ", error);
            setIsFetchingData(false);
        }
    }, []);

    return (
        (props.userDetails.isAuth ?
            (isFetchingData ?
                <ErrorBoundary>
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={isFetchingData}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </ErrorBoundary>
                : <ErrorBoundary>
                    <Box sx={{ flexGrow: 1, my: 2 }}>
                        <Typography variant='h4' sx={{ mt: 5, mb: 1 }}>
                            My Bids
                        </Typography>
                    </Box>
                    {
                        bidList.length > 0 ?
                            bidList.map(bid => {
                                let remainingTime = getRemainingTime(bid.Auction.CloseTime)
                                let chipColor = (remainingTime !== "Closed" ? "green" : "red")
                                return (
                                    <Grid size={{ xs: 12 }}>
                                        <ErrorBoundary>
                                            <Card variant='outlined' sx={{ my: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Grid container>
                                                            <Grid size={{ xs: 12, lg: 10 }}>
                                                                <Typography variant="h6">
                                                                    {`You bid $${bid.StraightBidAmount} (Max: $${bid.MaximumBidAmount}) for ${bid.Auction.ProductName}`}
                                                                </Typography>
                                                                <Chip
                                                                    label={remainingTime !== "Closed" ? "Live Auction" : "Closed"}
                                                                    size='small'
                                                                    sx={{ my: 1, background: chipColor }} />
                                                                <Typography variant='body1'>
                                                                    Minimum Bid: ${bid.Auction.MinimumAmount}
                                                                </Typography>
                                                                <Typography variant='body1'>
                                                                    Ends in: {remainingTime}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid size={{ xs: 12, lg: 2 }}>
                                                                <Image imageUrl={`http://localhost:3000/${bid.Auction.ProductImages}`} imageHeight={100} imageWidth={100} />
                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </CardContent>
                                                <CardActions sx={{ float: "right" }}>
                                                    <Button variant='contained' disabled={remainingTime === "Closed"} onClick={() => navigate(
                                                        `/auctions/auction/bid/${bid.Auction.Code}`, {
                                                        state: {
                                                            previousLocationPath: location.pathname
                                                        }
                                                    }
                                                    )}>
                                                        <Typography sx={{ mr: 2 }} variant='caption'>View Auction Details</Typography> <ArrowForwardIos fontSize="24" />
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </ErrorBoundary>
                                    </Grid>
                                );
                            }) :
                            <Typography variant='h6'>No Bids Found!</Typography>
                    }
                </ErrorBoundary>
            )
            : <Navigate to={"/login"} />
        )
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(BidList);