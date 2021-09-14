import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Paper, Chip, Grid, FormControl, InputBase, NativeSelect } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    width: '90%',
  },
  chip: {
    margin: theme.spacing(0.5),
    backgroundColor: '#DBE6FE',
    color: '#205DF5',
    fontWeight: 'bold',
  },
  paperMain: {
    background: '#f1f4fb',
    padding: '.5rem',
    paddingBottom: '1.5rem',
    paddingRight: '1rem',
    borderTop: '1px solid #8493A640 !important',
  },
}));

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const Sectors = ({ investor }) => {
  const classes = useStyles();
  const [sectorData, setSectorData] = useState(investor?.sectors || []);

  const handleDelete = (sectorToDelete) => () => {
    setSectorData((sectors) => sectors.filter((sector) => sector !== sectorToDelete));
  };

  const handleSelectorAdd = (e) => {
    e.persist();
    setSectorData((prev) => [...prev, e.target.value]);
  };

  return (
    <Grid
      container
      spacing={2}
      className={classes.paperMain}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item xs={10}>
        <Paper component="ul" className={classes.root}>
          {sectorData.map((sector) => {
            return (
              <li key={sector}>
                <Chip label={sector} onDelete={handleDelete(sector)} className={classes.chip} />
              </li>
            );
          })}
        </Paper>
      </Grid>

      <Grid item xs={2}>
        <FormControl className={classes.margin}>
          <NativeSelect
            id="demo-customized-select-native"
            onChange={handleSelectorAdd}
            input={<BootstrapInput />}
          >
            <option aria-label="None" value="" />
            <option value="Space">Space</option>
            <option value="Crypto">Crypto</option>
            <option value="Real Estate">Real Estate</option>
          </NativeSelect>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Sectors;
