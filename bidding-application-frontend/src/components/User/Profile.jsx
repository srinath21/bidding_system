import React from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { Grid2 as Grid, Box, TextField, Typography, Checkbox, Button, FormControlLabel, Divider, Stack, CircularProgress } from '@mui/material';
import { ValidateString } from '../../utilities/UtilityFunction';
import axios from 'axios';
import { connect } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';

const Profile = (props) => {
    const [userInfo, setUserInfo] = React.useState({
        firstName: {
            label: 'First Name',
            value: '',
            error: null,
            type: 'text',
            validations: {
                minLength: 1,
                maxLength: 20
            }
        },
        lastName: {
            label: 'Last Name',
            value: '',
            error: null,
            type: 'text',
            validations: {
                minLength: 1,
                maxLength: 20
            }
        },
        email: {
            label: 'Email Address',
            value: '',
            error: null,
            type: 'email',
            validations: {
                expression: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            },
            readOnly: true
        }
    });

    const [emailSubscription, setEmailSubscription] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [enableUpdate, setEnableUpdate] = React.useState(false);
    const [result, setResult] = React.useState(null);
    const navigate = useNavigate();

    React.useEffect(() => {
        try {
            if (!props.userDetails.isAuth) {
                navigate('/');
                return;
            }

            setLoading(true);
            axios.get("http://localhost:3000/api/users/", {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    let user = { ...userInfo };
                    user = {
                        email: {
                            ...user.email,
                            value: response.data.result.EmailID
                        },
                        firstName: {
                            ...user.firstName,
                            value: response.data.result.FirstName
                        },
                        lastName: {
                            ...user.lastName,
                            value: response.data.result.LastName
                        }
                    }

                    setUserInfo(user);
                    setEmailSubscription(response.data.result.EmailSubscription)
                    setEnableUpdate(true);
                }
                else {
                    console.log("Error in user details API: ", error);
                }

                setLoading(false);
            }).catch(error => {
                setLoading(false);
                console.log("Error fetching user details: ", error);
            })
        }
        catch (error) {
            console.log("error in Profile component mount: ", error)
        }
    }, [])

    const handleInputChange = (key, value) => {
        try {
            let newUserInfo = { ...userInfo };
            newUserInfo[key].value = value;
            newUserInfo[key].error = ValidateString(value, newUserInfo[key].validations, null)
            setUserInfo(newUserInfo);
        }
        catch (error) {
            console.log("Error in handleInputChange: ", error);
        }
    }

    const handleSubmitClick = () => {
        try {
            setLoading(true);
            let isValid = true;
            let newUserInfo = { ...userInfo }
            Object.keys(newUserInfo).forEach(key => {
                newUserInfo[key].error = ValidateString(newUserInfo[key].value, newUserInfo[key].validations, null);
                if (newUserInfo[key].error)
                    isValid = false;
            });
            if (isValid) {
                setResult(null);
                axios.patch("http://localhost:3000/api/users/", {
                    FirstName: userInfo.firstName.value,
                    LastName: userInfo.lastName.value,
                    EmailID: userInfo.email.value,
                    EmailSubscription: emailSubscription
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + props.userDetails.token
                    }
                }).then(response => {
                    if (response.data.success) {
                        setResult({
                            message: "Successfully updated!",
                            success: true
                        });
                    }
                    else {
                        setResult({
                            message: response.data.error,
                            success: false
                        });
                    }

                    setEnableUpdate(true);
                    setLoading(false);
                }).catch(error => {
                    setEnableUpdate(true);
                    setLoading(false);
                    console.log("Error updating the user details: ", error);
                    setResult({
                        message: "Something went wrong!",
                        success: false
                    });
                })
            } else {
                setEnableUpdate(true);
                setLoading(false);
                setUserInfo(newUserInfo)
            }
        }
        catch (error) {
            setLoading(false);
            setResult({
                message: "Something went wrong!",
                success: false
            });
            console.log("Error in handleSubmitClick: ", error);
        }
    }

    return (
        <ErrorBoundary>
            {props.userDetails.isAuth ?
                <Box sx={{ flexGrow: 1, my: 10 }}>
                    <Grid container spacing={2}>
                        <>
                            <Grid size={{ xs: 12, md: 6, lg: 4, xl: 3 }}>
                                <ErrorBoundary>
                                    <Typography variant='h5' sx={{ paddingBottom: "10px" }}>
                                        Your Profile
                                    </Typography>
                                    {
                                        Object.keys(userInfo).map(key => (
                                            <Grid key={key} size={12} sx={{ my: 2 }}>
                                                <TextField
                                                    disabled={Boolean(userInfo[key].readOnly)}
                                                    error={userInfo[key].error !== null}
                                                    variant='outlined'
                                                    value={userInfo[key].value}
                                                    label={userInfo[key].label}
                                                    type={userInfo[key].type}
                                                    fullWidth
                                                    helperText={userInfo[key].error}
                                                    onChange={(event) => { handleInputChange(key, event.target.value) }}
                                                />
                                            </Grid>
                                        ))
                                    }
                                    <Grid size={12} sx={{ my: 2 }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={emailSubscription} onClick={(event) => { setEmailSubscription(!emailSubscription) }} />}
                                            label="Receive outbid emails"
                                        />
                                    </Grid>
                                    <Grid size={12} sx={{ my: 2 }}>
                                        <Box sx={{ position: "relative" }}>
                                            <Button variant='contained' fullWidth onClick={handleSubmitClick} disabled={!enableUpdate}>
                                                Update
                                            </Button>
                                            {
                                                loading && (
                                                    <CircularProgress
                                                        size={24}
                                                        sx={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            left: '50%',
                                                            marginTop: '-12px',
                                                            marginLeft: '-12px',
                                                        }}
                                                    />
                                                )
                                            }
                                        </Box>
                                        {
                                            result ? <Typography variant="body2"
                                                sx={{ color: (result.success ? "green" : "red"), width: "100%", textAlign: "center", mt: 1 }} >
                                                {result.message}
                                            </Typography> : null
                                        }
                                    </Grid>
                                </ErrorBoundary>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 8, xl: 9 }}>

                            </Grid>
                        </>
                    </Grid>
                </Box>
                : <Navigate to="/" />
            }
        </ErrorBoundary>
    )
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(Profile);