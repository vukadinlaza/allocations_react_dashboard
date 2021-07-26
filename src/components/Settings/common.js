import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Paper, Tooltip } from '@material-ui/core';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { nWithCommas } from '../../utils/numbers'


const styles = theme => ({
  dataBloc: {
    minWidth: "250px",
    padding: "12px 12px 0 0"
  },
  dataContainer: {
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
    width: "25%",
    marginBottom: "30px",
    padding: "0 10px"
  },
  docAnchor: {
    width: "49%",
    minWidth: "400px",
    "&:hover": {
      textDecoration: "none"
    }
  },
  docPath: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  documentBox: {
    width: "100%",
    padding: "10px 20px",
    marginBottom: '10px',
    textAlign: "left",
    textTransform: "none",
    minWidth: "400px",
    transition: "0.5s",
    "&:hover": {
      backgroundColor: "rgb(0 64 254 / 5%)"
    },
    "&:hover *": {
      color: "#0040FE"
    },
    "& *": {
      color: "rgb(42,43,84,77%)"
    }
  },
  fieldTitle: {
    fontWeight: "bold",
    color: "rgb(42,43,84,77%)",
    marginBottom: "8px"
  },
  fieldValue: {
    color: "rgb(42,43,84,77%)"
  },
  section: {
    padding: "30px 40px 0px 40px",
    borderBottom: "solid 1px rgba(0, 0, 0, 0.12)"
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "28px",
    color: "rgb(42,43,84,77%)"
  },
  tooltip: {
    fontSize: 14
  }
});


const isValidValue = (value) => (value !== undefined && value !== null);

const formatField = (field, value) => {
  switch (field) {
    case 'admin':
      return (value? 'Yes' : 'No')
    case 'amount':
      return nWithCommas(value)
    case 'users':
      return (value? value.map(user => user.email).reduce((acc, n) => acc + `, ${n}`) : '')
    default:
      if(typeof value === 'object') return `Invalid Data (${typeof value})`
      return value
  }
}

export const GridSection = withStyles(styles)(({ classes, title, fields, item }) => {
  return (
    <Grid container spacing={1} className={classes.section}>
      <Typography className={classes.sectionTitle}>{title}</Typography>
      <Grid container item xs={12} spacing={3}>
        {fields.map((field, index) =>
          <Grid item xs={4} className={classes.dataBlock} key={`field-${index}`}>
            <div className={classes.dataContainer}>
              <Typography className={classes.fieldTitle}>{field.label}</Typography>
              <Typography className={classes.fieldValue}>
                { item?
                  isValidValue(item[field.value]) ? formatField(field.value, item[field.value]) : 'N/A'
                  :
                  'N/A'
                }
              </Typography>
            </div>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
})

export const Section = withStyles(styles)(({ classes, title, children }) => {
  return (
    <Grid container spacing={1} className={classes.section}>
      <Typography className={classes.sectionTitle}>{title}</Typography>
      {children}
    </Grid>
  )
})

export const DocumentBox = withStyles(styles)(({ classes, doc, docPath, index}) => {
  return (
    <a href={`//${doc.link}`} target="_blank" rel="noopener noreferrer" key={`doc-${index}`} className={classes.docAnchor}>
      <Paper className={classes.documentBox} variant="outlined" square>
        <Tooltip
          title={docPath}
          classes={{
            tooltip: classes.tooltip
          }}
          >
          <Typography className={classes.docPath}><InsertDriveFileIcon/> {docPath}</Typography>
        </Tooltip>
      </Paper>
    </a>
  )
})
