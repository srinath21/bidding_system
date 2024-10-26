import { CloudUpload } from '@mui/icons-material';
import { Typography, Grid2 as Grid, TextField, Box, Button, InputAdornment, Chip, CircularProgress, Backdrop } from '@mui/material';
import { styled } from '@mui/material/styles'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import PropTypes from 'prop-types';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const AuctionEditDetails = (props) => {
    const downloadFile = (fileData) => {
        try {
            const link = document.createElement('a');
            link.download = fileData.name;
            link.href = URL.createObjectURL(fileData);

            link.click();
            link.remove();
        }
        catch (error) {
            console.log("Error downloading the file: ", fileData)
        }
    }

    return (
        <ErrorBoundary>
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={props.loading}
            >
                <CircularProgress color='inherit' />
            </Backdrop>
            <Box sx={{ flexGrow: 1, my: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant='h4' sx={{ mb: 2 }}>
                            {props.auctionInfo.productName.value !== "" ? props.auctionInfo.productName.value : "Start a New Auction"}
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <Grid size={{ xs: 12 }} sx={{ my: 3 }}>
                            <TextField
                                error={props.modAuctionInfo.productName.error !== null}
                                variant='outlined'
                                type='text'
                                label='Product Name'
                                placeholder='Product Name'
                                value={props.modAuctionInfo.productName.value}
                                onChange={(e) => props.handleChange('productName', e.target.value)}
                                fullWidth
                                helperText={props.modAuctionInfo.productName.error}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ my: 3 }}>
                            <TextField
                                error={props.modAuctionInfo.productDescription.error !== null}
                                multiline
                                variant='outlined'
                                type='text'
                                label='Product Description'
                                placeholder='Give a brief description about your product'
                                value={props.modAuctionInfo.productDescription.value}
                                onChange={(e) => props.handleChange('productDescription', e.target.value)}
                                fullWidth
                                helperText={props.modAuctionInfo.productDescription.error}
                                rows={3}
                                maxRows={6}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ my: 3 }}>
                            <TextField
                                error={props.modAuctionInfo.minAmount.error !== null}
                                variant='outlined'
                                type='text'
                                label='Minimum Amount'
                                placeholder='Minimum Amount'
                                fullWidth
                                slotProps={{
                                    input: {
                                        startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                                    }
                                }}
                                value={props.modAuctionInfo.minAmount.value}
                                onChange={(e) => props.handleChange('minAmount', e.target.value)}
                                helperText={props.modAuctionInfo.minAmount.error}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ my: 3 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    disablePast={true}
                                    label='Auction Close Date'
                                    fullWidth
                                    value={new Date(props.modAuctionInfo.closeDate.value) === "Invalid Date" ? null : props.modAuctionInfo.closeDate.value}
                                    onChange={(value) => { props.handleChange('closeDate', value) }}
                                    helperText={props.modAuctionInfo.closeDate.error}
                                />
                            </LocalizationProvider>
                            {
                                props.modAuctionInfo.closeDate.error ?
                                    <Grid>
                                        <Typography variant="caption" sx={{ color: "red" }}>{props.modAuctionInfo.closeDate.error}</Typography>
                                    </Grid>
                                    : null
                            }

                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ my: 3 }}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Upload files
                                <VisuallyHiddenInput
                                    type="file"
                                    onChange={(event) => props.handleChange("productImages", event.target.files)}
                                />
                            </Button>
                            {
                                props.modAuctionInfo.productImages.value !== null ?
                                    <Chip
                                        label={props.modAuctionInfo.productImages.value.name}
                                        sx={{ ml: 2 }}
                                        onClick={(e) => downloadFile(props.modAuctionInfo.productImages.value)}
                                        variant="outlined"
                                        onDelete={(e) => props.handleChange("productImages", null)} />
                                    : null
                            }
                            {
                                props.modAuctionInfo.productImages.error ?
                                    <Grid>
                                        <Typography variant="caption" sx={{ color: "red" }}>{props.modAuctionInfo.productImages.error}</Typography>
                                    </Grid>
                                    : null
                            }
                        </Grid>
                    </Grid>
                    <Grid size={{ xs: 12 }} sx={{ my: 2 }}>
                        {props.isCreate ?
                            <Box sx={{ position: "relative" }}>
                                <Button sx={{ float: "right" }} disabled={props.loading} variant='contained' onClick={props.handleCreateClick}>
                                    Create
                                </Button>
                            </Box> :
                            <Box sx={{ display: "flex", float: "right" }}>
                                <Box sx={{ position: "relative", mx: 2 }}>
                                    <Button sx={{ alignItems: "flex-start" }} disabled={props.loading} variant='contained' onClick={props.handleUpdateClick}>
                                        Update
                                    </Button>
                                </Box>
                                <Box sx={{ position: "relative" }}>
                                    <Button sx={{ alignItems: "flex-end" }} disabled={props.loading} variant='contained' onClick={props.handleDeleteClick} color='error'>
                                        Delete
                                    </Button>
                                </Box>
                            </Box>
                        }
                        {
                            props.message ?
                                <Typography variant="body2" sx={{ color: (props.message.isError ? "red" : "green"), width: "100%", textAlign: "center", mt: 1 }} >
                                    {props.message.value}
                                </Typography> :
                                null
                        }
                    </Grid>
                </Grid>
            </Box>
        </ErrorBoundary>
    )
}

AuctionEditDetails.propTypes = {
    error: PropTypes.string,
    loading: PropTypes.bool,
    handleDeleteClick: PropTypes.func,
    handleUpdateClick: PropTypes.func,
    handleCreateClick: PropTypes.func,
    isCreate: PropTypes.bool.isRequired,
    auctionInfo: PropTypes.objectOf({
        productName: PropTypes.object.isRequired,
        productDescription: PropTypes.object.isRequired,
        minAmount: PropTypes.object.isRequired,
        closeDate: PropTypes.object.isRequired,
        productImages: PropTypes.object.isRequired
    }).isRequired,
    modAuctionInfo: PropTypes.objectOf({
        productName: PropTypes.object.isRequired,
        productDescription: PropTypes.object.isRequired,
        minAmount: PropTypes.object.isRequired,
        closeDate: PropTypes.object.isRequired,
        productImages: PropTypes.object.isRequired
    }).isRequired
}

export default AuctionEditDetails;