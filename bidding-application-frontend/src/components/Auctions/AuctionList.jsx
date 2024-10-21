import { Backdrop, Box, CircularProgress, Grid2 as Grid, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import AuctionListDetails from './AuctionListDetails';
import { connect } from 'react-redux';
import ErrorBoundary from '../ErrorBoundary';
import { useNavigate, Navigate } from 'react-router';

const AuctionList = (props) => {
    const [auctions, setAuctions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!props.userDetails.isAuth) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true)
            axios.get("http://localhost:3000/api/auctions/", {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            })
                .then(response => {
                    if (response.data.success && Array.isArray(response.data.result)) {
                        let auctionList = []
                        response.data.result.forEach((auction) => {
                            auctionList.push(auction);
                        });

                        setAuctions(auctionList);
                    }
                    else {
                        console.log("Error in fetcing auctions: ", error);
                        setAuctions([]);
                    }
                    setLoading(false)
                })
                .catch(error => {
                    setLoading(false)
                    console.log("Error fetching all the auctions: ", error);
                });
        }
        catch (error) {
            console.log("Error fetching auctions: ", error);
        }
    }, []);

    return (
        (props.userDetails.isAuth ?
            (loading ?
                <ErrorBoundary>
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                </ErrorBoundary>
                :
                <ErrorBoundary>
                    <Box sx={{ flexGrow: 1, my: 2 }}>
                        <Grid container spacing={2}>
                            <Typography variant='h4' sx={{ mt: 5, mb: 1 }}>
                                My Auctions
                            </Typography>
                            <AuctionListDetails auctions={auctions} isBiddable={false} />
                        </Grid>
                    </Box >
                </ErrorBoundary>
            ) :
            <Navigate to="/login" />
        )
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(AuctionList);