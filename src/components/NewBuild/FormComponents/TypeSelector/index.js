import React, { useEffect, useState } from 'react';
import { get, pick } from 'lodash';
import { toast } from 'react-toastify';
import { useMutation, gql } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CloudDone } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';

import {
  Button,
  TextField,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import countries from 'country-region-data';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
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
  // const [assetType, setAssetType] = useState('');
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
            <Grid item style={{ paddingBottom: '16px', paddingRight: '24px' }}>
              <TypeItem item={item} assetType={assetType} setAssetType={setAssetType} />
            </Grid>
          );
        })}
      </>
    );
  }
  return (
    <Paper className={parentClasses.paper}>
      <form noValidate autoComplete="off" style={{ padding: '42px' }}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '34px' }}>
          1. Basic Information
        </Typography>
        <Typography
          style={{ color: '#2A2B54', fontWeight: 'bold', fontSize: '18px', marginBottom: '28px' }}
        >
          Choose your asset type{' '}
          <HelpIcon
            style={{
              marginLeft: '0.2em',
              cursor: 'pointer',
              color: '#205DF5',
              fontSize: '12px',
              width: '12px',
              height: '12px',
            }}
          />
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
          style={{ paddingTop: '32px', width: '100%' }}
        >
          <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
            Portfolio Company Name{' '}
            <HelpIcon
              style={{
                marginLeft: '0.2em',
                cursor: 'pointer',
                color: '#205DF5',
                fontSize: '15px',
              }}
            />
          </Typography>
          <TextField
            value={portCompName}
            onChange={(e) => setPortCompName(e.target.value)}
            style={{ width: '1148px', paddingTop: '16px' }}
            variant="outlined"
          />
        </FormControl>
        <Grid container style={{ paddingTop: '32px' }}>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ width: '568px' }}>
              <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
                Manager Name{' '}
                <HelpIcon
                  style={{
                    marginLeft: '0.2em',
                    cursor: 'pointer',
                    color: '#205DF5',
                    fontSize: '15px',
                  }}
                />
              </Typography>
              <TextField
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                style={{ width: '568px', paddingTop: '16px' }}
                variant="outlined"
              />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl required disabled variant="outlined" style={{ paddingLeft: '14px' }}>
              <Typography style={{ color: '#2A2B54', font: 'normal normal bold 18px/21px Roboto' }}>
                Closing Date{' '}
                <HelpIcon
                  style={{
                    marginLeft: '0.2em',
                    cursor: 'pointer',
                    color: '#205DF5',
                    fontSize: '15px',
                  }}
                />
              </Typography>
              <TextField
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                style={{ width: '568px', paddingTop: '16px' }}
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
