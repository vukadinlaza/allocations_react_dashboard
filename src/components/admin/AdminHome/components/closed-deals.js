import React from 'react'
import _ from 'lodash'
import {Paper, Table, TableBody, TableCell, TableRow, Button, Grid, Typography, Divider} from '@material-ui/core'
import {useHistory} from "react-router-dom"
import {makeStyles} from "@material-ui/core/styles";
import {nWithCommas, formatDate} from '../../../../utils/numbers'
import Deals from '../../../Deals/index'


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    minWidth: '100%',
    marginBottom: theme.spacing(4),
    minHeight: '100%'
  },
  divider: {
    margin: "16px -16px"
  },
  table: {
    width: "calc(100% + 32px)",
    margin: "16px -16px"
  },
}));
export default ({orgData}) => {
    const classes = useStyles();
    const history = useHistory()
    const {closed } = _.groupBy(orgData.deals, d => d.status === "closed" ? "closed" : "active")
    const { organization } = orgData
    return (
          <Deals showClosed/>
    )
}