import React from "react";
import { Navigate, useParams, useNavigate } from "react-router";
import AuctionEditDetails from "./AuctionEditDetails";
import { connect } from "react-redux";
import axios from "axios";
import { ValidateString } from "../../utilities/UtilityFunction";
import dayjs from "dayjs";
import { Backdrop, CircularProgress } from "@mui/material";
import ErrorBoundary from "../ErrorBoundary";
import { NavLink } from "react-router-dom";
import * as lodash from 'lodash';

const auctionInfoObj = {
    productName: {
        error: null,
        value: '',
        validations: {
            minLength: 1,
            maxLength: 200
        }
    },
    productDescription: {
        error: null,
        value: '',
        validations: {
            minLength: 1,
            maxLength: 500
        }
    },
    minAmount: {
        error: null,
        value: '',
        validations: {
            minVal: 1,
            maxVal: 400000,
            expression: /^[+-]?(\d*\.)?\d+$/
        }
    },
    closeDate: {
        error: null,
        value: null,
    },
    productImages: {
        error: null,
        value: null
    }
}

const Auction = (props) => {
    const navigate = useNavigate();
    const { code } = useParams();
    const [auctionInfo, setAuctionInfo] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [modifiedAuctionInfo, setModifiedAuctionInfo] = React.useState({});
    const [isCreate, setIsCreate] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isFetchingAuctionData, setIsFetchingAuctionData] = React.useState(false);

    React.useEffect(() => {
        try {
            if (!props.userDetails.isAuth) {
                navigate("/login");
                return;
            }

            getAuctionDetails();
        }
        catch (error) {
            console.log("Error in componentDidMount useEffect: ", error);
        }
    }, []);

    const getAuctionDetails = () => {
        if (code) {
            setIsCreate(false);
            setIsFetchingAuctionData(true);
            axios.get(`http://localhost:3000/api/auctions/auction/${code}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                if (response.data.success) {
                    let modAuctionInfo = {
                        productName: {
                            ...auctionInfo.productName,
                            value: response.data.result.ProductName
                        },
                        productDescription: {
                            ...auctionInfo.productDescription,
                            value: response.data.result.ProductDescription,
                        },
                        productImages: {
                            ...auctionInfo.productImages,
                            value: response.data.result.ProductImages
                        },
                        closeDate: {
                            ...auctionInfo.closeDate,
                            value: dayjs(response.data.result.CloseTime)
                        },
                        minAmount: {
                            ...auctionInfo.minAmount,
                            value: response.data.result.MinimumAmount
                        }
                    }
                    setAuctionInfo(modAuctionInfo);
                    setModifiedAuctionInfo(modAuctionInfo);
                }
                else {
                    console.log("Error in Auction details: ", error)
                }
                setIsFetchingAuctionData(false)
            }).catch(error => {
                console.log("Error fetching Auction details: ", error);
            })
        }
        else {
            setIsCreate(true)
            setAuctionInfo(lodash.cloneDeep(auctionInfoObj));
            setModifiedAuctionInfo(lodash.cloneDeep(auctionInfoObj));
        }
    }

    React.useEffect(() => {
        getAuctionDetails();
    }, [code])

    const handleChange = (key, value) => {
        try {
            let modAuctionInfo = { ...modifiedAuctionInfo };
            if (key === "closeDate") {
                modAuctionInfo = {
                    ...modAuctionInfo,
                    [key]: {
                        ...modAuctionInfo[key],
                        value: value
                    }
                }
            }
            else if (key === "productImages") {
                modAuctionInfo = {
                    ...modAuctionInfo,
                    [key]: {
                        ...modAuctionInfo[key],
                        value: value === null ? null : value[0]
                    }
                }
            }
            else {
                modAuctionInfo = {
                    ...modAuctionInfo,
                    [key]: {
                        ...modAuctionInfo[key],
                        value: value,
                        error: ValidateString(value, modAuctionInfo[key].validations, key === "minAmount" ? "Please enter a valid number" : null)
                    }
                }
            }

            setModifiedAuctionInfo(modAuctionInfo);
        }
        catch (error) {
            console.log("Error updating value: ", error);
        }
    }

    const handleCreate = () => {
        try {
            if (validate()) {
                setIsLoading(true)
                let formData = new FormData();
                formData.append("ProductName", modifiedAuctionInfo.productName.value);
                formData.append("ProductDescription", modifiedAuctionInfo.productDescription.value);
                formData.append("ProductImages", modifiedAuctionInfo.productImages.value);
                formData.append("CloseTime", new Date(modifiedAuctionInfo.closeDate.value).toISOString());
                formData.append("MinimumAmount", modifiedAuctionInfo.minAmount.value);

                axios.post("http://localhost:3000/api/auctions", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': 'Bearer ' + props.userDetails.token
                    }
                }).then(response => {
                    if (response.data.success) {
                        let code = response.data.result.Code;
                        navigate(`/auctions/auction/${code}`);
                    }
                    else {
                        setError(response.data.error);
                    }
                    setIsLoading(false);
                }).catch(error => {
                    setError("Something went wrong!");
                    setIsLoading(false);
                    console.log(error)
                })
            }
        }
        catch (error) {
            console.log("Error during creation of auction: ", error);
        }
    }

    const handleUpdate = () => {
        try {
            if (validate()) {
                setIsLoading(true)
                let formData = new FormData();
                formData.append("ProductName", modifiedAuctionInfo.productName.value);
                formData.append("ProductDescription", modifiedAuctionInfo.productDescription.value);
                formData.append("ProductImages", modifiedAuctionInfo.productImages.value);
                formData.append("CloseTime", new Date(modifiedAuctionInfo.closeDate.value).toISOString());
                formData.append("MinimumAmount", modifiedAuctionInfo.minAmount.value);

                axios.patch(`http://localhost:3000/api/auctions/auction/${code}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': 'Bearer ' + props.userDetails.token
                    }
                }).then(response => {
                    if (response.data.success) {
                        let code = response.data.result.Code;
                        navigate(`/auctions/auction/${code}`);
                    }
                    else {
                        setError(response.data.error);
                    }
                    setIsLoading(false);
                }).catch(error => {
                    setError("Something went wrong!");
                    setIsLoading(false);
                    console.log(error)
                })
            }
        }
        catch (error) {
            console.log("Error during creation of auction: ", error);
        }
    }

    const handleDelete = () => {
        try {
            setIsLoading(true);
            axios.delete(`http://localhost:3000/api/auctions/auction/${code}`, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Bearer ' + props.userDetails.token
                }
            }).then(response => {
                setIsLoading(false);
                if (response.data.success) {
                    navigate("/auctions/auction");
                }
                else {
                    setError(response.data.error);
                }
            }).catch(error => {
                console.log("Error deleting the auction: ", error);
                setError("Something went wrong!");
                setIsLoading(false)
            })
        }
        catch (error) {
            console.log("Error deleting an auction: ", error);
        }
    }

    const validate = () => {
        let isValid = true;
        try {
            let modAuctionInfo = { ...modifiedAuctionInfo }
            Object.keys(modAuctionInfo).forEach(key => {
                let error = null;
                if (key === "closeDate") {
                    if (modAuctionInfo[key].value === null || new Date(modAuctionInfo[key].value) === "Invalid Date")
                        error = "Please provide a valid date"
                    else if (new Date(modAuctionInfo[key].value).getTime() < new Date().getTime())
                        error = "Datetime cannot be earlier than now"
                    else
                        error = null
                }
                else if (key === "productImages") {
                    if (modAuctionInfo[key].value === null)
                        error = "Please provide an image file for the item"
                    else if (!['image/jpeg', 'image/png'].includes(modAuctionInfo[key].value.type))
                        error = "Only JPEG or PNG file is allowed";
                    else
                        error = null
                }
                else {
                    error = ValidateString(modAuctionInfo[key].value, modAuctionInfo[key].validations)
                }

                if (modAuctionInfo[key].error !== null)
                    isValid = false

                modAuctionInfo[key] = {
                    ...modAuctionInfo[key],
                    error: error
                }
            });

            setModifiedAuctionInfo(modAuctionInfo);
        }
        catch (error) {
            console.log("Error during validation: ", error);
            isValid = false;
        }

        return isValid;
    }

    return (
        (
            props.userDetails.isAuth ?
                (isFetchingAuctionData ?
                    <Backdrop
                        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                        open={isFetchingAuctionData}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    :
                    <ErrorBoundary>
                        <div style={{ marginTop: "2%" }}>
                            <NavLink to={"/auctions"}>Back to my catalog</NavLink>
                            <AuctionEditDetails
                                auctionInfo={auctionInfo}
                                modAuctionInfo={modifiedAuctionInfo}
                                isCreate={isCreate}
                                handleChange={handleChange}
                                handleCreateClick={handleCreate}
                                handleUpdateClick={handleUpdate}
                                handleDeleteClick={handleDelete}
                                loading={isLoading}
                                error={error}
                            />
                        </div>
                    </ErrorBoundary>
                )
                : <Navigate to={"/login"} />
        )
    );
}

const mapStateToProps = state => {
    return {
        userDetails: state.user
    }
}

export default connect(mapStateToProps, null)(Auction);