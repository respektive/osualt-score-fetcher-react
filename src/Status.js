import React, { useEffect, useState, useRef } from "react"
import Grid from '@mui/material/Grid'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

export default function Status() {

    const intervalRef = useRef()

    const [current, setCurrent] = useState([])
    const [fetched, setFetched] = useState([])

    const fetchData = async () => {
        const current = await fetch("https://oaltapi.respektive.pw/current")
        const currentJson = await current.json()
        setCurrent(currentJson)

        const fetched = await fetch("https://oaltapi.respektive.pw/fetched")
        const fetchedJson = await fetched.json()
        let usernames = fetchedJson.map(user => user.username)
        usernames.sort(Intl.Collator().compare)
        setFetched(usernames)
    }

    useEffect(() => {
        fetchData()
        intervalRef.current = setInterval(fetchData, 10000)

        return () => {
            clearInterval(intervalRef.current)
        }
    }, [])

    return (
        <Grid container align="center" justify="center" sx={{ padding: 5}}>
        
            <Grid item xs={6} sx={{ padding: '10px' }}> 
                <Typography variant="h4">List of users currently being fetched:</Typography>
                {current.map(user => (
                    <Paper sx={{ width: '80%', mt: '10px'}}>
                    <Typography variant="h6" key={user.username}>{user.username} | {user.progress}</Typography>
                    <LinearProgress sx={{ width: '80%' }} variant="determinate" value={user.percentage} key={user.percentage}/>
                    </Paper>
                ))}
            </Grid>

            <Grid item xs={6} sx={{ padding: '10px' }}>
                <Typography variant="h4" sx={{ mb: '10px'}}>List of users already done fetching:</Typography>
                <Grid container spacing={1}>
                {fetched.map(user => (
                    <Grid item >
                        <Paper sx={{ padding: '5px' }}>
                        <Typography variant="h6" key={user}>{user}</Typography>
                        </Paper>
                    </Grid>
                ))}
                </Grid>
            </Grid>
            
        </Grid>
    )
}
