import React, { useState } from 'react'
import {makeStyles} from "@material-ui/core/styles";
import {Grid, Typography, Paper} from "@material-ui/core";
import PosIcon from '../../../../assets/undraw-pos.svg'
import POSModal from './pos-modal'
const data = [
        {
            title: 'Provision Of Services',
            subTitle: 'One click signing for your POS',
            callToAction: 'Get Started',
            icon: PosIcon
        },
        {
            title: 'Statement Of Work',
            subTitle: 'Space X SPV',
            callToAction: 'Get Started'
        }
    ]

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
  },
  img: {
    margin: 'auto',
    display: 'inline',
    maxWidth: '60px',
  },
}));

const OrgCards = ({organization}) => {
    const classes = useStyles();
    const [modal, setModal] = useState()

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        {data.map(card => {
                            return (
                                <Grid item xs={12} sm={6} key={card.title}>
                                    <Paper className={classes.paper}>
                                        <Grid item> 
                                            <img src={PosIcon} className={classes.img}/>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h6">
                                                {card.title}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                {card.subTitle}
                                            </Typography>
                                            <Typography variant="subtitle2" onClick={() => setModal(true)}>
                                                {card.callToAction}
                                            </Typography>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Paper>
                </Grid>
            </Grid>
           <POSModal modal={modal} setModal={setModal} organization={organization}/>
        </>
    )
}

export default OrgCards


