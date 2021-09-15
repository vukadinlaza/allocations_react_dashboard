import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Chip, Grid, FormControl, InputLabel, Select } from '@material-ui/core';
import { useMutation, gql } from '@apollo/client';

const ADD_SECTORS = gql`
  mutation AddSectors($email: String!, $sector: String!) {
    addSectors(email: $email, sector: $sector) {
      _id
      sectors
      email
    }
  }
`;
const DELETE_SECTORS = gql`
  mutation DeleteSectors($email: String!, $sector: String!) {
    deleteSectors(email: $email, sector: $sector) {
      _id
      sectors
      email
    }
  }
`;

const DISPLAY_USERNAME_STATUS = gql`
  mutation DisplayUsernameStatus($email: String!, $display_username: Boolean) {
    displayUsernameStatus(email: $email, display_username: $display_username) {
      _id
      display_username
      email
    }
  }
`;

const sectors = [
  'AI',
  'Biotech',
  'Clean Technology',
  'Community',
  'Construction',
  'Consumer Products',
  'Crypto',
  'Cyber Security',
  'Deep Tech',
  'Ecommerce',
  'EdTech',
  'Energy',
  'Entertainment',
  'Fintech',
  'Food',
  'Fund',
  'Gaming',
  'Human Resources',
  'Healthcare',
  'Internet of Things',
  'Logistics',
  'Manufacturing',
  'Marketing',
  'Media',
  'Music',
  'Real Estate',
  'Recruiting',
  'Retail',
  'SaaS',
  'SPAC',
  'Space',
  'Sports',
  'Technology',
  'Telecom',
  'Travel',
];

const useStyles = makeStyles((theme) => ({
  selectedSectorsPaper: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
    width: '100%',
    minHeight: '50px',
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
  sectorChoices: {
    height: '50px',
  },
}));

const Sectors = ({ investor }) => {
  const classes = useStyles();
  const [sectorData, setSectorData] = useState(investor?.sectors || []);

  const [updateSectors] = useMutation(ADD_SECTORS);
  const [deleteSectors] = useMutation(DELETE_SECTORS);
  const [displayUsernameStatus] = useMutation(DISPLAY_USERNAME_STATUS);

  const handleDelete = (sectorToDelete) => () => {
    setSectorData((sectors) => sectors.filter((sector) => sector !== sectorToDelete));
    deleteSectors({ variables: { email: investor.email, sector: sectorToDelete } });
  };

  const handleSelectorAdd = (e) => {
    e.persist();
    setSectorData((prev) => [...prev, e.target.value]);
    updateSectors({ variables: { email: investor.email, sector: e.target.value } });
  };

  return (
    <Grid
      container
      spacing={2}
      className={classes.paperMain}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item md={12} lg={9}>
        <Paper component="ul" className={classes.selectedSectorsPaper}>
          {sectorData.map((sector) => {
            return (
              <li key={sector}>
                <Chip label={sector} onDelete={handleDelete(sector)} className={classes.chip} />
              </li>
            );
          })}
        </Paper>
      </Grid>

      <Grid item md={12} lg={3} style={{ display: 'flex', justifyContent: 'center' }}>
        <FormControl variant="outlined" style={{ background: 'white', width: '100%' }}>
          <InputLabel>Sectors</InputLabel>
          <Select
            native
            onChange={handleSelectorAdd}
            label="Sector"
            className={classes.sectorChoices}
          >
            <option aria-label="None" value="" />
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Sectors;
