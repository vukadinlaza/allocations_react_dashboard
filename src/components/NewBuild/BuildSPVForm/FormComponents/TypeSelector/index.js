import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import HelpIcon from '@material-ui/icons/Help';
import { TextField, Paper, Grid, FormControl, MenuItem } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
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
import { ModalTooltip } from '../../../../dashboard/FundManagerDashboard/widgets';
import sectors from './sectors';

export default function TypeSelector({
  assetType,
  handleChange,
  buildData,
  setBuildData,
  handleTooltip,
  openTooltip,
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

  function SectorSelector() {
    const suggestions = sectors
      .map((sector) => ({
        value: sector.title,
        label: sector.title,
      }))
      .filter(({ value }) => !buildData.sectors.includes(value));
    const customStyles = {
      multiValue: (styles, { data }) => ({
        ...styles,
        backgroundColor: '#DAE8FF',
      }),
      multiValueLabel: (styles, { data }) => ({
        ...styles,
        color: '#0461FF',
      }),
      multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: '#0461FF',
      }),
    };

    return (
      <>
        <Select
          options={suggestions}
          menuPosition="fixed"
          styles={customStyles}
          onChange={(options) => {
            const sector = options[0].value;

            setBuildData((prev) => {
              const isAtLimit = prev.sectors.length >= 3;
              if (isAtLimit) toast.info('Please limit your sectors to 3 or less');
              return {
                ...prev,
                sectors: isAtLimit ? prev.sectors : [...prev.sectors, sector],
              };
            });
          }}
          isMulti
        />
      </>
    );
  }

  const securities = ['one', 'two', 'three'];

  return (
    <Paper className={classes.paper}>
      <form noValidate autoComplete="off" className={classes.formContainers}>
        <Typography variant="h6" gutterBottom className={classes.sectionHeaderText}>
          1. Basic Information
        </Typography>
        <Typography className={classes.formItemName}>
          Choose your asset type
          <ModalTooltip
            title="Asset Type"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Select the type of deal which reflects the intended structure and the assets which
                the SPV will purchase
              </Typography>
            }
            openTooltip={openTooltip}
            id="asset_type"
          >
            <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('asset_type')} />
          </ModalTooltip>
        </Typography>
        <Grid container className={classes.assetChoiceGrid}>
          <FormRow rowItems={row1Items} />
          <FormRow rowItems={row2Items} />{' '}
        </Grid>

        {/* FIRST ROW */}
        <Grid container spacing={1} className={classes.inputGridContainer}>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Portfolio Company Name
                <ModalTooltip
                  title="Company Name"
                  handleTooltip={handleTooltip}
                  tooltipContent={
                    <Typography color="inherit">
                      Full name of the company in which the SPV will invest in (e.g. Allocations,
                      Inc., a Delaware corporation)
                    </Typography>
                  }
                  openTooltip={openTooltip}
                  id="portfolio_company_name"
                >
                  <HelpIcon
                    className={classes.helpIcon}
                    onClick={(e) => handleTooltip('portfolio_company_name')}
                  />
                </ModalTooltip>
              </Typography>
              <TextField
                value={buildData.portfolio_company_name}
                name="portfolio_company_name"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
                placeholder="SpaceX"
              />
            </FormControl>
          </Grid>
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Portfolio company securities?
                <ModalTooltip
                  title="Company Securities"
                  handleTooltip={handleTooltip}
                  tooltipContent={
                    <Typography color="inherit">
                      Indicate what kind of security the SPV will acquire (e.g., Series A Preferred
                      Stock, Simple Agreement for Future Equity, Convertible Promissory Note or
                      other)
                    </Typography>
                  }
                  openTooltip={openTooltip}
                  // IS THIS ACCURATE?
                  id="portfolio_company_securities"
                >
                  <HelpIcon
                    className={classes.helpIcon}
                    onClick={(e) => handleTooltip('portfolio_company_securities')}
                  />
                </ModalTooltip>
              </Typography>
              <Select
                id="portfolio_company_securities"
                label="Portfolio Company Securities"
                value={securities.map((security) => ({ value: security, name: security })) || ''}
                onChange={handleChange}
                // onChange={(option) => {
                //   const newEvent = {
                //     target: {
                //       name: 'portfolio_company_securities',
                //       value: option.map((security) => security.value),
                //     },
                //   };
                //   handleChange(newEvent);
                // }}
              >
                <MenuItem value="one">Series A Preferred Stock</MenuItem>
                <MenuItem value="two">Simple Agreement for Future Equity</MenuItem>
                <MenuItem value="three">Convertible Promissory Note</MenuItem>
                <MenuItem value="four">Other</MenuItem>
              </Select>
              {/* <TextField
                value={buildData.portfolio_company_securities}
                name="portfolio_company_securities"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
                placeholder="SpaceX"
              /> */}
            </FormControl>
          </Grid>

          {/* SECOND ROW */}
          <Grid container spacing={1} className={classes.inputGridContainer}>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Deal Name
                  <ModalTooltip
                    title="Deal Name"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        A name to identify your deal (name of your series SPV in case you are a HVP)
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="portfolio_deal_name"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('portfolio_deal_name')}
                    />
                  </ModalTooltip>
                </Typography>
                <TextField
                  value={buildData.portfolio_deal_name}
                  name="portfolio_deal_name"
                  onChange={handleChange}
                  className={classes.inputBox}
                  variant="outlined"
                  placeholder="e.x. crypto deal"
                />
              </FormControl>
            </Grid>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Closing Date
                  <ModalTooltip
                    title="Closing Date"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Date on when the SPV needs to make the money transfer
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="closing_date"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('closing_date')}
                    />
                  </ModalTooltip>
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

          {/* THIRD ROW */}
          <Grid container spacing={1} className={classes.inputGridContainer}>
            <Grid className={classes.inputGridItem} item xs={6}>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Manager Name
                  <ModalTooltip
                    title="Manager Name"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">Full name of the manager of your SPV</Typography>
                    }
                    openTooltip={openTooltip}
                    id="manager_name"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('manager_name')}
                    />
                  </ModalTooltip>
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
                  Representative of the manager and its title?
                  <ModalTooltip
                    title="Representative"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Please indicate the name of the representative of the Manager as well as the
                        title of the said person; applicable only if the Manager is a legal entity
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="representative"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('representative')}
                    />
                  </ModalTooltip>
                </Typography>
                <TextField
                  value={buildData.representative}
                  name="representative"
                  onChange={handleChange}
                  className={classes.inputBox}
                  variant="outlined"
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* FOURTH ROW */}
          <Grid className={classes.inputGridItem} item xs={12}>
            <Typography className={classes.formItemName}>
              Sector(s) <HelpIcon className={classes.helpIcon} />
            </Typography>
            <SectorSelector />
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '22px' }}>
              {buildData.sectors.map((sector) => (
                <div className={classes.sectorTag}>
                  <span>{sector}</span>
                  <button
                    className={classes.removeSectorButton}
                    type="button"
                    onClick={() =>
                      setBuildData((prev) => ({
                        ...prev,
                        sectors: buildData.sectors.filter((item) => item !== sector),
                      }))
                    }
                  >
                    &#x2715;
                  </button>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
