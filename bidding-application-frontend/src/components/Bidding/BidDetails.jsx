import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Box, Grid2 as Grid, List, ListItem, ListItemText, Chip, Typography, Button, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, TextField, InputAdornment, Divider, DialogActions, IconButton } from "@mui/material";
import { Link, useParams, useNavigate, Navigate, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { Close } from "@mui/icons-material";
import { getRemainingTime, ValidateString } from "../../utilities/UtilityFunction";
import dayjs from "dayjs";
import Image from "../Image";

const bidInfoObj = {
    straightBid: {
        value: null,
        error: null,
        validations: {
            minVal: 1,
            maxVal: 400000,
            expression: /^[+-]?(\d*\.)?\d+$/
        }
    },
    maximumBid: {
        value: null,
        error: null,
        validations: {
            minVal: 1,
            maxVal: 400000,
            expression: /^[+-]?(\d*\.)?\d+$/
        }
    }
}

const BidDetails = (props) => {
    const { code } = useParams()
    const navigate = useNavigate();

    const previousLocationPath = useLocation().state ? useLocation().state.previousLocationPath : "/";

    const [auctionInfo, setAuctionInfo] = React.useState(null);
    const [bids, setBids] = React.useState([]);

    const [fetchingAuctionData, setFetchingAuctionData] = React.useState(true);
    const [openBidDialog, setOpenBidDialog] = React.useState(false);

    const [bidInfo, setBidInfo] = React.useState({ ...bidInfoObj });
    const [isSubmittingBid, setIsSubmittingBid] = React.useState(false);
    const [bidSubmitError, setBidSubmitError] = React.useState(null);

    React.useEffect(() => {
        if (!props.userDetails.isAuth) {
            navigate("/login");
            return;
        }

        try {
            setFetchingAuctionData(true);
            axios.get(`http://localhost:3000/api/auctions/auction/${code}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    console.log(response.data.result)
                    setAuctionInfo(response.data.result);
                    fetchAllBidsForAuction();
                }
                else {
                    console.log("Error in Auction details: ", response.data.error)
                }
                setFetchingAuctionData(false)
            }).catch(error => {
                setFetchingAuctionData(false)
                console.log("Error fetching Auction details: ", error);
            })
        }
        catch (error) {
            setFetchingAuctionData(false)
            console.log("Error in componentDidMount useEffect: ", error);
        }
    }, []);

    const fetchAllBidsForAuction = () => {
        try {
            axios.get(`http://localhost:3000/api/bids/auction/${code}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    setBids(response.data.result);
                }
                else {
                    console.log("Error fetching bids: ", response.data.error);
                }
            }).catch(error => {
                console.log("Error fetching the bids: ", error);
            })
        }
        catch (error) {
            console.log("Error in fetching all bids for the auction: ", error);
        }
    }

    const handleChange = (key, value) => {
        try {
            setBidInfo({
                ...bidInfo,
                [key]: {
                    ...bidInfo[key],
                    value: value,
                    error: ValidateString(value, bidInfo[key].validations, "Please enter a valid number")
                }
            })
        }
        catch (error) {
            console.log("Error in handleChange: ", error);
        }
    }

    const handleBidSubmit = () => {
        try {
            let modBidInfo = { ...bidInfo };
            let isValid = true;
            Object.keys(bidInfo).forEach(key => {
                modBidInfo = {
                    ...modBidInfo,
                    [key]: {
                        ...modBidInfo[key],
                        error: ValidateString(modBidInfo[key].value, modBidInfo[key].validations, "Please enter a valid number")
                    }
                }

                if (modBidInfo[key].error !== null) {
                    isValid = false
                }
            });

            if (isValid) {
                setIsSubmittingBid(true);
                axios.post("http://localhost:3000/api/bids", {
                    AuctionCode: code,
                    StraightBidAmount: parseFloat(bidInfo.straightBid.value),
                    MaximumBidAmount: parseFloat(bidInfo.maximumBid.value)
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + props.userDetails.token
                    }
                }).then(response => {
                    setIsSubmittingBid(false);
                    if (response.data.success) {
                        setOpenBidDialog(false)
                        resetBidAmount();
                        fetchAllBidsForAuction();
                    }
                    else {
                        setBidSubmitError(response.data.error);
                        console.log("Error submitting bid: ", response.data.error);
                    }

                }).catch(error => {
                    setIsSubmittingBid(false);
                    setBidSubmitError("Something went wrong!");
                    console.log(error)
                })
            }
            else {
                setBidInfo(modBidInfo);
            }
        }
        catch (error) {
            console.log("Error in handleBidSubmit: ", error);
        }
    }

    const resetBidAmount = () => {
        try {
            setBidInfo({ ...bidInfoObj })
        }
        catch (error) {
            console.log("Error resetting bid amount: ", error)
        }
    }

    return (
        (props.userDetails.isAuth ?
            <ErrorBoundary>
                {fetchingAuctionData ?
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={fetchingAuctionData}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop> :
                    (
                        <Box sx={{ flexGrow: 1, mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12 }}>
                                    <Link to={previousLocationPath}>Back to catalog</Link>
                                </Grid>
                                {auctionInfo ?
                                    <>
                                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                                            <Image imageUrl={`http://localhost:3000/${auctionInfo.ProductImages}`} imageHeight={250} imageWidth={100} />
                                            <Chip label="Live Auction" size='small' sx={{ my: 1, background: getRemainingTime(auctionInfo.CloseTime) !== "Closed" ? "green" : "red" }} />
                                            <Typography variant='h6'>
                                                {auctionInfo.ProductName}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Minimum Bid: {auctionInfo.MinimumAmount}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Current Bid: {auctionInfo.CurrentBid}
                                            </Typography>
                                            <Typography variant='body1'>
                                                Ends in: {getRemainingTime(auctionInfo.CloseTime)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4, lg: 7 }}>
                                            <Typography variant="h6">
                                                Description
                                            </Typography>
                                            <Typography variant="body2">
                                                {auctionInfo.ProductDescription}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 4, lg: 2 }}>
                                            {
                                                bids.length > 0 ?
                                                    <List dense={true} sx={{ width: "100%", mb: 3 }}>
                                                        {bids.map(bid => {
                                                            return (
                                                                <ListItem>
                                                                    <ListItemText>{
                                                                        bid.User.IsCurrentUser ? `You bid $${bid.StraightBidAmount}` :
                                                                            `${bid.User.FirstName}  ${bid.User.LastName} bids $${bid.StraightBidAmount}`}</ListItemText>
                                                                </ListItem>
                                                            )
                                                        })}
                                                    </List> : null
                                            }
                                            <Button variant='contained' fullWidth onClick={() => setOpenBidDialog(true)}>
                                                Bid now
                                            </Button>
                                        </Grid>
                                    </>
                                    : <Typography sx={{ my: 2 }} variant="h3">Auction Not Found</Typography>
                                }
                            </Grid>
                        </Box>
                    )
                }
                {
                    openBidDialog ?
                        <Dialog
                            fullWidth
                            maxWidth="xs"
                            open={true}
                            onClose={() => {
                                resetBidAmount();
                                setOpenBidDialog(false)
                            }}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                Submit Bid | {auctionInfo.ProductName}
                                {/* Submit Bid */}
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => {
                                    resetBidAmount();
                                    setOpenBidDialog(false)
                                }}
                                sx={(theme) => ({
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: theme.palette.grey[500],
                                })}
                            >
                                <Close />
                            </IconButton>
                            <Divider sx={{ py: 0 }} />
                            <DialogContent id="alert-dialog-description">
                                {bidSubmitError ?
                                    <Grid size={12} sx={{ my: 2 }}>
                                        <Typography variant="body2" sx={{ color: 'red' }}>{bidSubmitError}</Typography>
                                    </Grid>
                                    : null
                                }
                                <Grid size={12} sx={{ my: 2 }}>
                                    <TextField
                                        size="small"
                                        error={bidInfo.straightBid.error !== null}
                                        variant='outlined'
                                        type='text'
                                        label='Straight Bid'
                                        placeholder='Straight Bid'
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                                            }
                                        }}
                                        value={bidInfo.straightBid.value}
                                        onChange={(e) => handleChange('straightBid', e.target.value)}
                                        helperText={bidInfo.straightBid.error}
                                    />
                                </Grid>
                                <Grid size={12} sx={{ my: 2 }}>
                                    <TextField
                                        size="small"
                                        error={bidInfo.maximumBid.error !== null}
                                        variant='outlined'
                                        type='text'
                                        label='Maximum Bid'
                                        placeholder='Maximum Bid'
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                                            }
                                        }}
                                        value={bidInfo.maximumBid.value}
                                        onChange={(e) => handleChange('maximumBid', e.target.value)}
                                        helperText={bidInfo.maximumBid.error}
                                    />
                                </Grid>
                                <Grid size={12} sx={{ my: 2 }}>
                                    <Typography variant="body2">
                                        Minimum Bid: ${auctionInfo.MinimumAmount}
                                    </Typography>
                                </Grid>
                                <Grid size={12} sx={{ my: 2 }}>
                                    <Typography variant="body2">
                                        Current Bid: ${auctionInfo.CurrentBid}
                                    </Typography>
                                </Grid>
                                <Grid size={12} sx={{ my: 2 }}>
                                    <Typography variant="body2">
                                        Ends in: {getRemainingTime(auctionInfo.CloseTime)}
                                    </Typography>
                                </Grid>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" disabled={isSubmittingBid} onClick={handleBidSubmit}>
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog> : null
                }
            </ErrorBoundary> :
            <Navigate to="/login" />
        )
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(BidDetails);