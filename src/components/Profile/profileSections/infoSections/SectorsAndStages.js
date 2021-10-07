import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Chip, Grid, FormControl, InputLabel, Select, Typography } from '@material-ui/core';
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
const ADD_STAGES = gql`
  mutation AddStages($email: String!, $stage: String!) {
    addStages(email: $email, stage: $stage) {
      _id
      stages
      email
    }
  }
`;
const DELETE_STAGES = gql`
  mutation DeleteStages($email: String!, $stage: String!) {
    deleteStages(email: $email, stage: $stage) {
      _id
      stages
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

const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+'];

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
    color: 'white',
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
  const [stageData, setStageData] = useState(investor?.stages || []);

  const [updateSectors] = useMutation(ADD_SECTORS);
  const [deleteSectors] = useMutation(DELETE_SECTORS);
  const [updateStages] = useMutation(ADD_STAGES);
  const [deleteStages] = useMutation(DELETE_STAGES);

  const handleDelete = (sectorToDelete) => () => {
    setSectorData((sectors) => sectors.filter((sector) => sector !== sectorToDelete));
    deleteSectors({ variables: { email: investor.email, sector: sectorToDelete } });
  };

  const handleDeleteStage = (stageToDelete) => () => {
    setStageData((stages) => stages.filter((stage) => stage !== stageToDelete));
    deleteStages({ variables: { email: investor.email, stage: stageToDelete } });
  };

  const handleSelectorAdd = (e) => {
    e.persist();
    if (sectorData.length <= 5) {
      setSectorData((prev) => [...prev, e.target.value]);
      updateSectors({ variables: { email: investor.email, sector: e.target.value } });
    }
    return sectorData;
  };
  const handleStageAdd = (e) => {
    e.persist();
    if (stageData.length <= 5) {
      setStageData((prev) => [...prev, e.target.value]);
      updateStages({ variables: { email: investor.email, stage: e.target.value } });
    }
    return stageData;
  };

  const uniqueSectors = [...new Set(sectorData)];
  const uniqueStages = [...new Set(stageData)];

  return (
    <>
      {/* investor sectors choices */}
      <Grid
        container
        spacing={2}
        className={classes.paperMain}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Grid item xs={12} style={{ paddingLeft: '1rem' }}>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
            Sectors
          </Typography>
          <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
            Select max. 6 sectors
          </Typography>
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
              <option aria-label="None" disabled>
                Select max. 6 sectors
              </option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={12} lg={9} style={{ width: '100%' }}>
          <Paper component="ul" className={classes.selectedSectorsPaper}>
            {!investor.sectors || investor.sectors.length < 1 ? (
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                  Select max. 6 sectors
                </Typography>
              </li>
            ) : (
              uniqueSectors.map((sector) => {
                return (
                  <li key={sector}>
                    <Chip
                      label={sector}
                      color="primary"
                      onDelete={handleDelete(sector)}
                      className={classes.chip}
                    />
                  </li>
                );
              })
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* investor Stages choices */}
      <Grid
        container
        spacing={2}
        className={classes.paperMain}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Grid item xs={12} style={{ paddingLeft: '1rem' }}>
          <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
            Deal Stages
          </Typography>
        </Grid>
        <Grid item md={12} lg={3} style={{ display: 'flex', justifyContent: 'center' }}>
          <FormControl variant="outlined" style={{ background: 'white', width: '100%' }}>
            <InputLabel>Stages</InputLabel>
            <Select
              native
              onChange={handleStageAdd}
              label="Sector"
              className={classes.sectorChoices}
            >
              <option aria-label="None" value="" />
              <option aria-label="None" disabled>
                Select stages
              </option>
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={12} lg={9} style={{ width: '100%' }}>
          <Paper component="ul" className={classes.selectedSectorsPaper}>
            {!investor.stages || investor.stages.length < 1 ? (
              <li style={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle2" style={{ fontWeight: 'bold' }}>
                  Select stages
                </Typography>
              </li>
            ) : (
              uniqueStages.map((stage) => {
                return (
                  <li key={stage}>
                    <Chip
                      color="primary"
                      label={stage}
                      onDelete={handleDeleteStage(stage)}
                      className={classes.chip}
                    />
                  </li>
                );
              })
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Sectors;
