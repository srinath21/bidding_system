import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import { Box, Grid2 as Grid, List, ListItem, ListItemText, Chip, Typography, Button } from "@mui/material";

const Bid = (props) => {
    return (
        <ErrorBoundary>
            <Box sx={{ flexGrow: 1, mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ lg: 2 }}>
                        <img src="https://images.unsplash.com/photo-1551963831-b3b1ca40c98e" alt='Image' height={250} style={{ width: "100%" }} />
                        <Chip label="Live Auction" size='small' sx={{ my: 1 }} />
                        <Typography variant='h6'>
                            ItemName
                        </Typography>
                        <Typography variant='body1'>
                            Minimum Bid:
                        </Typography>
                        <Typography variant='body1'>
                            Current Bid:
                        </Typography>
                        <Typography variant='body1'>
                            Ends in:
                        </Typography>
                    </Grid>
                    <Grid size={{ lg: 8 }}>
                        <Typography variant="h6">
                            Description
                        </Typography>
                        <Typography variant="body2">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                        </Typography>
                    </Grid>
                    <Grid size={{ lg: 2 }}>
                        <List dense={true} sx={{ width: "100%", mb: 3 }}>
                            <ListItem>
                                <ListItemText>The Floor bids $123</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>The Floor bids $123</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>The Floor bids $123</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemText>The Floor bids $123</ListItemText>
                            </ListItem>
                        </List>
                        <Button variant='contained' fullWidth>
                            Bid now
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </ErrorBoundary>
    )
}

export default Bid;