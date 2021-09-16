import React, { useEffect, useState } from 'react';
import HelpIcon from '@material-ui/icons/Help';
import { TextField, Paper, Grid, FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TypeItem from './TypeItem/index';
import RocketIcon from '../../../../assets/buildRocket.svg';
import BankIcon from '../../../../assets/buildBank.svg';
import CryptoIcon from '../../../../assets/buildCrypto.svg';
import DistributeIcon from '../../../../assets/buildDistribute.svg';
import HouseIcon from '../../../../assets/buildHouse.svg';
import LevelIcon from '../../../../assets/buildLevel.svg';
import NetworkIcon from '../../../../assets/buildNetwork.svg';
import PieIcon from '../../../../assets/buildPie.svg';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: '34px',
  },
  inputBox: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #0000000A',
    border: '1px solid #70707040',
    borderRadius: '5px',
    opacity: '0.3',
  },
  input: { color: '#2A2B54', opacity: '1' },
  rowItem: {
    paddingBottom: '16px',
    paddingRight: '24px',
  },
  inputName: {
    color: '#2A2B54',
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '16px',
  },
  helpIcon: { marginLeft: '0.2em', cursor: 'pointer', color: '#205DF5', fontSize: '15px' },
  form: { padding: '42px' },
  bottomGrid: { paddingTop: '32px' },
}));

export default function TypeSelector({
  parentClasses,
  assetType,
  setAssetType,
  portCompName,
  setPortCompName,
  managerName,
  setManagerName,
  closingDate,
  setClosingDate,
}) {
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
            <Grid className={classes.rowItem}>
              <TypeItem item={item} assetType={assetType} setAssetType={setAssetType} />
            </Grid>
          );
        })}
      </>
    );
  }
  return (
    <Paper className={parentClasses.paper}>
      <form noValidate autoComplete="off" className={classes.form}>
        <Typography variant="h6" gutterBottom className={classes.title}>
          1. Basic Information
        </Typography>
        <Typography className={classes.inputName}>
          Choose your asset type <HelpIcon className={classes.helpIcon} />
        </Typography>
        <Grid container spacing={1}>
          <FormRow rowItems={row1Items} />
        </Grid>
        <Grid container spacing={1}>
          <FormRow rowItems={row2Items} />
        </Grid>
        <FormControl
          required
          disabled
          variant="outlined"
          style={{
            paddingTop: '32px',
            width: '100%',
          }}
        >
          <Typography className={classes.inputName}>
            Portfolio Company Name <HelpIcon className={classes.helpIcon} />
          </Typography>
          <TextField
            value={portCompName}
            onChange={(e) => setPortCompName(e.target.value)}
            style={{
              width: '568px',
            }}
            className={classes.inputBox}
            // inputProps={{ className: classes.input }}
            variant="outlined"
          />
        </FormControl>
        <Grid container className={classes.bottomGrid}>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ width: '568px' }}>
              <Typography className={classes.inputName}>
                Manager Name <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                style={{ width: '568px' }}
                className={classes.inputBox}
                // InputProps={{ className: classes.input }}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ paddingLeft: '14px' }}>
              <Typography className={classes.inputName}>
                Closing Date <HelpIcon className={classes.helpIcon} />
              </Typography>
              <TextField
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                style={{ width: '568px' }}
                className={classes.inputBox}
                // InputProps={{ className: classes.input }}
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
