import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { Box, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";

const Image = (props) => {
    const [loading, setLoading] = React.useState(true);
    return (
        <ErrorBoundary>
            <Box sx={{
                height: props.imageHeight,
                width: `${props.imageWidth}%`,
                display: loading ? "flex" : "none", my: "auto",
                justifyContent: "center"
            }}>
                <CircularProgress sx={{ my: "auto" }} />
            </Box>
            <img
                src={props.imageUrl}
                style={{ display: !loading ? "block" : "none", width: `${props.imageWidth}%` }}
                alt="Product Image"
                onLoad={() => setLoading(false)}
                height={props.imageHeight} />
        </ErrorBoundary>
    )
}

Image.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    imageWidth: PropTypes.number.isRequired,
    imageHeight: PropTypes.number.isRequired
}

export default Image;