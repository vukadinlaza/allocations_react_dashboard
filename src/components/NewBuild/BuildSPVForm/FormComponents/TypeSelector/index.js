import React, { useEffect, useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';
import { TextField, Paper, Grid, FormControl } from '@material-ui/core';
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
      title: 'SPV into a Fund',
      value: 'spvToFund',
      description: 'Raise money to invest into a fund',
      icon: BankIcon,
      height: '30px',
      width: '30px',
    },
  ];
  const row2Items = [
    {
      title: 'Secondary',
      value: 'secondary',
      description: 'Raise money to invest in a secondary of a private company',
      icon: DistributeIcon,
      height: '35px',
      width: '28px',
    },
    {
      title: 'SPV into an SPV',
      value: 'spvToSpv',
      description: 'Raise money to invest in another SPV',
      icon: NetworkIcon,
      height: '32px',
      width: '20px',
    },
    {
      title: 'Management Co.',
      value: 'managementStake',
      description: `Sell a stake in your fund's management company's future carry`,
      icon: PieIcon,
      height: '30px',
      width: '30px',
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
            <Grid key={item.value} className={classes.assetTypeRowItem}>
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
          <FormRow rowItems={row2Items} />{' '}
        </Grid>
        <Grid container spacing={1} className={classes.inputGridContainer}>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Deal Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.name}
                name="name"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
              />
            </FormControl>
          </Grid>{' '}
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Portfolio Company Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={buildData.portfolio_company_name}
                name="portfolio_company_name"
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
        </Grid>
      </form>
    </Paper>
  );
}
