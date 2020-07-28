import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'
import {makeStyles} from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    backgroundColor: "#f9fbfb",
    minWidth: '100%',
    minHeight: '400px'
  },
  divider: {
    margin: "16px -16px"
  },
  root: {
    flexGrow: 1,
  },
  innerPaper: {
      minWidth: '200px',
      minHeight: '250px'
  }
}));

const boardData = [
    {title: 'Invited', key: 'invited'},
    {title: 'Viewed', key: 'viewed'},
    {title: 'Signed', key: 'signed'},
    {title: 'KYC', key: 'kyc'},
    {title: 'Wired', key: 'wired'},
]


export default ({}) => {
    const classes = useStyles()
    return (
        <Grid container className={classes.root}>
            <Paper className={classes.paper}>
                <Grid item>
                    <Grid container justify="center" spacing={3}>
                    {boardData.map((value) => (
                        <Grid key={value} item >
                            <Typography variant="h6">
                            {value.title}
                            </Typography>
                            <Paper className={classes.innerPaper}>

                            </Paper>
                        </Grid>
                    ))}
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )
}