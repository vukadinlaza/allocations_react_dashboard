import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Chip, Grid, FormControl, InputLabel, Select, Typography } from '@material-ui/core';
import { colors } from '@allocations/design-system';

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
    color: theme.colors.white[100],
    fontWeight: 'bold',
  },
  paperMain: {
    background: theme.colors.gray[100],
    padding: '.5rem',
    paddingBottom: '1.5rem',
    paddingRight: '1rem',
    borderTop: `1px solid ${theme.colors.gray[400]}40 !important`,
  },
  sectorChoices: {
    height: '50px',
  },
}));

const Sectors = ({ investor, handleChange }) => {
  const classes = useStyles();
  const [sectorData, setSectorData] = useState(investor?.sectors || []);
  const [stageData, setStageData] = useState(investor?.stages || []);

  const handleDelete = (sectorToDelete) => () => {
    const updatedSectors = sectorData.filter((sector) => sector !== sectorToDelete);
    setSectorData(updatedSectors);
    handleChange('sectors')({ target: { value: updatedSectors } });
  };

  const handleDeleteStage = (stageToDelete) => () => {
    const updatedStages = stageData.filter((stage) => stage !== stageToDelete);
    setStageData(updatedStages);
    handleChange('stages')({ target: { value: updatedStages } });
  };

  const handleSelectorAdd = (e) => {
    if (sectorData.length <= 5) {
      const updatedSectors = [...sectorData, e.target.value];
      setSectorData(updatedSectors);
      handleChange('sectors')({ target: { value: updatedSectors } });
    }
  };
  const handleStageAdd = (e) => {
    if (stageData.length <= 5) {
      const updatedStages = [...stageData, e.target.value];
      setStageData(updatedStages);
      handleChange('stages')({ target: { value: updatedStages } });
    }
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
          <FormControl variant="outlined" style={{ background: colors.white[100], width: '100%' }}>
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
          <FormControl variant="outlined" style={{ background: colors.white[100], width: '100%' }}>
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
