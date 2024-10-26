import React from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router";
import ErrorBoundary from "../ErrorBoundary";
import { Grid2 as Grid, Box, TextField, Typography, Checkbox, Button, FormControlLabel, Divider, Stack, CircularProgress } from '@mui/material';
import { ValidateString } from '../../utilities/UtilityFunction';
import axios from 'axios';
import * as lodash from 'lodash';

const passwordObj = {
    currentPassword: {
        label: 'Current Password',
        value: '',
        error: null,
        type: 'password',
        validations: {
            minLength: 1,
            maxLength: 20,
        }
    },
    newPassword: {
        label: 'New Password',
        value: '',
        error: null,
        type: 'password',
        validations: {
            minLength: 8,
            maxLength: 20,
            expression: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        }
    },
    validateNewPassword: {
        label: 'Re-enter New Password',
        value: '',
        error: null,
        type: 'password',
        validations: {
            minLength: 8,
            maxLength: 20,
            expression: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        }
    }
}

const ChangePassword = (props) => {
    const navigate = useNavigate();
    const [passwordInfo, setPasswordInfo] = React.useState(lodash.cloneDeep(passwordObj));

    const [loading, setLoading] = React.useState(false);
    const [enableUpdate, setEnableUpdate] = React.useState(false);
    const [result, setResult] = React.useState(null);

    React.useEffect(() => {
        if (!props.userDetails.isAuth) {
            navigate('/');
            return;
        }

        setEnableUpdate(true);
    }, []);

    const handleInputChange = (key, value) => {
        try {
            let modPasswordInfo = { ...passwordInfo };
            modPasswordInfo[key].value = value;
            modPasswordInfo[key].error = ValidateString(value, modPasswordInfo[key].validations, "Password must contain atleast one special character, lowercase character, uppercase character and a number")

            if (key === "validateNewPassword" &&
                modPasswordInfo[key].error === null &&
                modPasswordInfo[key].value !== modPasswordInfo.newPassword.value
            ) {
                modPasswordInfo[key].error = "Passwords do not match";
                modPasswordInfo.newPassword.error = "Passwords do not match";
            }

            if (key === "newPassword" &&
                modPasswordInfo[key].error === null &&
                modPasswordInfo[key].value === modPasswordInfo.currentPassword.value
            ) {
                modPasswordInfo[key].error = "New password cannot be the same as old password";
            }

            setPasswordInfo(modPasswordInfo);
        }
        catch (error) {
            console.log("Error in handleInputChange: ", error);
        }
    }

    const handleSubmitClick = () => {
        try {
            let isValid = true;
            let modPasswordInfo = { ...passwordInfo }
            Object.keys(modPasswordInfo).forEach(key => {
                modPasswordInfo[key].error = ValidateString(modPasswordInfo[key].value, modPasswordInfo[key].validations, null);
                if (key === "validateNewPassword" &&
                    modPasswordInfo[key].error === null &&
                    modPasswordInfo[key].value !== modPasswordInfo.newPassword.value
                ) {
                    modPasswordInfo[key].error = "Passwords do not match";
                    modPasswordInfo.newPassword.error = "Passwords do not match";
                }

                if (key === "newPassword" &&
                    modPasswordInfo[key].error === null &&
                    modPasswordInfo[key].value === modPasswordInfo.currentPassword.value
                ) {
                    modPasswordInfo[key].error = "New password cannot be the same as old password";
                }

                if (modPasswordInfo[key].error)
                    isValid = false;
            });
            if (isValid) {
                setLoading(true);
                setResult(null);
                setEnableUpdate(false);
                axios.post("http://localhost:3000/api/users/user/changepassword", {
                    OldPassword: passwordInfo.currentPassword.value,
                    UpdatedPassword: passwordInfo.newPassword.value,
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
                        setPasswordInfo(lodash.cloneDeep(passwordObj))
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
                    setLoading(false);
                    setEnableUpdate(true);
                    console.log("Error changing the password: ", error);
                    setResult({
                        message: "Something went wrong!",
                        success: false
                    });
                })
            } else {
                setPasswordInfo(modPasswordInfo)
            }
        }
        catch (error) {
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
                                        Change Password
                                    </Typography>
                                    {
                                        Object.keys(passwordInfo).map(key => (
                                            <Grid key={key} size={12} sx={{ my: 2 }}>
                                                <TextField
                                                    disabled={Boolean(passwordInfo[key].readOnly)}
                                                    error={passwordInfo[key].error !== null}
                                                    variant='outlined'
                                                    value={passwordInfo[key].value}
                                                    label={passwordInfo[key].label}
                                                    type={passwordInfo[key].type}
                                                    fullWidth
                                                    helperText={passwordInfo[key].error}
                                                    onChange={(event) => { handleInputChange(key, event.target.value) }}
                                                />
                                            </Grid>
                                        ))
                                    }

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

export default connect(mapStateToProps, null)(ChangePassword);