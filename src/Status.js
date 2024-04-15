import React, { useEffect, useState, useRef } from "react"
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Footer from './Footer'
import { Tooltip } from "@mui/material"

export default function Status() {

    const intervalRef = useRef()

    const [current, setCurrent] = useState([])
    const [fetched, setFetched] = useState([])

    const fetchData = async () => {
        const current = await fetch("/api/current")
        const currentJson = await current.json()
        setCurrent(currentJson)

        const fetched = await fetch("/api/fetched")
        const fetchedJson = await fetched.json()
        fetchedJson.sort((a,b) => Intl.Collator().compare(a.username, b.username))
        setFetched(fetchedJson)
    }

    useEffect(() => {
        fetchData()
        intervalRef.current = setInterval(fetchData, 10000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <>
        <Grid container align="center" justify="center" sx={{ padding: 5}}>
        
            <Grid item xs={6} sx={{ padding: '10px' }}> 
                <Typography variant="h4">List of users currently being fetched:</Typography>
                {current.map(user => (
                    <Paper sx={{ width: '80%', mt: '10px'}}>
                    <Typography variant="h6" key={user.username}>{user.username} | {user.progress} | {user.percentage ? user.percentage.toFixed(2) : "0.0"}%</Typography>
                    <LinearProgress sx={{ width: '80%' }} variant="determinate" value={user.percentage} key={user.percentage}/>
                    </Paper>
                ))}
            </Grid>

            <Grid item xs={6} sx={{ padding: '10px' }}>
                <Typography variant="h4" sx={{ mb: '10px'}}>List of users already done fetching:</Typography>
                <Grid container spacing={1}>
                {fetched.map(user => (
                    <Grid item >
                        <Tooltip title={ user.updated_at ? `Last fetched: ${user.updated_at.split("T")[0]}` : ""}>
                        <Paper sx={{ padding: '5px' }}>
                        <Typography variant="h6" key={user.user_id}>{user.username}</Typography>
                        </Paper>
                        </Tooltip>
                    </Grid>
                ))}
                </Grid>
            </Grid>
            
        </Grid>
        <Footer />
        </>
    )
}
