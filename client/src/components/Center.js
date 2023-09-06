import { Grid } from '@mui/material'
import React from 'react'

export default function Center({ children }) {
    return (
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <Grid item xs={1}>
                {children}
            </Grid>
        </Grid>
    )
}
