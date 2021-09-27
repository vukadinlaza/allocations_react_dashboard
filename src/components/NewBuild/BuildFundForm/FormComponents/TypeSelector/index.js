import React, { useEffect, useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';
import { Button, TextField, Paper, Grid, FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
import useStyles from '../../../BuildStyles';
import TypeItem from './TypeItem/index';
import RocketIcon from '../../../../../assets/buildRocket.svg';
import BankIcon from '../../../../../assets/buildBank.svg';
import CryptoIcon from '../../../../../assets/buildCrypto.svg';
import DistributeIcon from '../../../../../assets/buildDistribute.svg';
import HouseIcon from '../../../../../assets/buildHouse.svg';
import LevelIcon from '../../../../../assets/buildLevel.svg';
import NetworkIcon from '../../../../../assets/buildNetwork.svg';
import PieIcon from '../../../../../assets/buildPie.svg';

export default function TypeSelector({ assetType, handleChange, buildData }) {
  const classes = useStyles();
  const row1Items = [
    {
      title: 'Startup',
      value: 'startup',
      description: 'Raise money to invest in a private company',
      icon: RocketIcon,
      height: '56px',
      width: '54px',
    },
    {
      title: 'Crypto',
      value: 'crypto',
      description: 'Raise money to invest in a crypto project (token/equity)',
      icon: CryptoIcon,
      height: '34px',
      width: '34px',
    },
    {
      title: 'Real Estate',
      value: 'realEstate',
      description: 'Raise money to invest in a real estate project',
      icon: HouseIcon,
      height: '29px',
      width: '36px',
    },
    {
      title: 'Custom',
      value: 'custom',
      description: 'Raise money for X',
      icon: LevelIcon,
      height: '26px',
      width: '26px',
    },
  ];
  function FormRow({ rowItems }) {
    return (
      <>
        {rowItems.map((item) => {
          return (
            <Grid className={classes.assetTypeRowItem}>
              <TypeItem
                item={item}
                assetType={assetType}
                handleChange={handleChange}
                buildData={buildData}
              />
            </Grid>
          );
        })}
      </>
    );
  }
  return (
    <Paper className={classes.paper}>
      <form noValidate autoComplete="off" className={classes.formContainers}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          1. Basic Information
        </Typography>
        <Typography className={classes.formItemName}>
          Choose your asset type <HelpIcon className={classes.helpIcon} />
        </Typography>
        <Grid container className={classes.assetChoiceGrid}>
          <FormRow rowItems={row1Items} />
        </Grid>
        <Grid container spacing={1} className={classes.inputGridContainer}>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Fund Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.fund_name}
                name="fund_name"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Number Of Investments <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.number_of_investments}
                name="number_of_investments"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Manager Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.manager_name}
                name="manager_name"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Closing Date <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.closing_date}
                name="closing_date"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
                type="date"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Do you need a GP Entity?
                <HelpIcon className={classes.helpIcon} />
              </Typography>
              <Grid container className={classes.buttonContainer}>
                <Grid>
                  <Button
                    name="gp_entity_need"
                    value={buildData.gp_entity_need}
                    className={
                      buildData.gp_entity_need ? classes.selectedInputButton : classes.inputButton
                    }
                    onClick={(e) => {
                      const target = {
                        name: e.currentTarget.name,
                        value: true,
                      };
                      e.target = target;
                      handleChange(e);
                    }}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid>
                  <Button
                    value={!buildData.gp_entity_need}
                    name="gp_entity_need"
                    className={
                      !buildData.gp_entity_need ? classes.selectedInputButton : classes.inputButton
                    }
                    onClick={(e) => {
                      const target = {
                        name: e.currentTarget.name,
                        value: false,
                      };
                      e.target = target;
                      handleChange(e);
                    }}
                    // onClick={(e) => console.log(e.currentTarget.name, e.currentTarget.value)}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                GP Entity Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.gp_entity_name}
                name="gp_entity_name"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
