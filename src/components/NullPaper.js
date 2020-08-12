import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Hidden from "@material-ui/core/Hidden";

const useStyles = makeStyles(() => ({
  paper: {
    padding: 32
  },
  img: {
    height: 150,
    width: "90%",
    marginBottom: 16,
    paddingRight: 32,
  },
  h5: {
    color: "#707070",
  },
  body: {
    color: "#707070",
  },
  button: {
    textTransform: "capitalize",
    color: "#205DF5",
    fontSize: "1.4rem",
    marginLeft: -10,
    marginTop: 8
  },
}));


export default function NullPaper({title, text, image, button, onClick}) {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Grid container alignItems="center">
        <Hidden only="md">
          <Grid item lg={5}>
            <img src={image} className={classes.img}/>
          </Grid>
        </Hidden>
        <Grid item md={12} lg={7}>
          <Typography variant="h5" className={classes.h5}>
            <strong>{title}</strong>
          </Typography>
          <Typography variant="body2" className={classes.body}>
            {text}
          </Typography>
          <Button onClick={onClick} color="primary" size="large" className={classes.button}
                  endIcon={<ChevronRightIcon/>}>
            {button}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

