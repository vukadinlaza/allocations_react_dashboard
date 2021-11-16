import React from 'react';
import Select from 'react-select';
import HelpIcon from '@material-ui/icons/Help';
import { TextField, Paper, Grid, FormControl } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { toast } from 'react-toastify';
import useStyles from '../../../BuildStyles';
import TypeItem from './TypeItem/index';
import RocketIcon from '../../../../../assets/buildRocket.svg';
import BankIcon from '../../../../../assets/buildBank.svg';
import CryptoIcon from '../../../../../assets/buildCrypto.svg';
import LevelIcon from '../../../../../assets/buildLevel.svg';
import HouseIcon from '../../../../../assets/buildHouse.svg';
import CustomIcon from '../../../../../assets/buildCustom.svg';
import NetworkIcon from '../../../../../assets/buildNetwork.svg';
import PieIcon from '../../../../../assets/buildPie.svg';
import { ModalTooltip } from '../../../../dashboard/FundManagerDashboard/widgets';
import sectors from './sectors';
import { convertToPositiveIntOrNull } from '../../../../../utils/numbers';
import {
  DealName,
  EstimatedSPVQuantity,
  ManagerName,
  ClosingDate,
  PortfolioCompanyName,
  PortfolioCompanySecurities,
  Sectors,
  NumberOfInvestments,
} from '../../FormFields';

export default function TypeSelector({
  dealType,
  assetType,
  handleChange,
  buildData,
  setBuildData,
  handleTooltip,
  openTooltip,
  unfilledFields,
  setUnfilledFields,
}) {
  const classes = useStyles();
  const customInputStyles = { style: { height: '23px' } };

  const row1Items = [
    {
      title: 'Startup',
      value: 'startup',
      description: 'Raise money to invest in a private company',
      icon: RocketIcon,
      height: '56px',
      width: '54px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'Crypto',
      value: 'crypto',
      description: 'Raise money to invest in a crypto project (token/equity)',
      icon: CryptoIcon,
      height: '34px',
      width: '34px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'Real Estate',
      value: 'realEstate',
      description: 'Raise money to invest in a real estate project',
      icon: HouseIcon,
      height: '29px',
      width: '36px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'SPV into a Fund',
      value: 'spvToFund',
      description: 'Raise money to invest into a fund',
      icon: BankIcon,
      height: '30px',
      width: '30px',
      dealType: ['spv'],
    },
  ];

  const row2Items = [
    {
      title: 'Secondary',
      value: 'secondary',
      description: 'Raise money to invest in a secondary of a private company',
      icon: LevelIcon,
      height: '35px',
      width: '28px',
      dealType: ['spv'],
    },
    {
      title: 'SPV into an SPV',
      value: 'spvToSpv',
      description: 'Raise money to invest in another SPV',
      icon: NetworkIcon,
      height: '32px',
      width: '20px',
      dealType: ['spv'],
    },
    {
      title: 'Management Co.',
      value: 'managementStake',
      description: `Sell a stake in your fund's management company's future carry`,
      icon: PieIcon,
      height: '30px',
      width: '30px',
      dealType: ['spv'],
    },
    {
      title: 'Custom',
      value: 'custom',
      description: 'Raise money for X',
      icon: CustomIcon,
      height: '26px',
      width: '26px',
      dealType: ['spv', 'fund'],
    },
  ];

  function FormRow({ rowItems }) {
    return (
      <>
        {rowItems
          .filter((item) => item.dealType.includes(dealType))
          .map((item) => {
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

  function DealStagesSelector() {
    const dealStages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Series D+'];
    const customStyles = {
      control: (styles) => ({
        ...styles,
        height: 60,
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('deal_stage')
          ? '2px solid red'
          : '1pm solid hsl(0, 0%, 80%)',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children !== 'Select...' ? '#000' : '#999',
      }),
    };

    return (
      <Select
        id="deal_stage"
        menuPosition="fixed"
        label="Deal Stage"
        styles={customStyles}
        options={dealStages.map((stage) => ({ value: stage, label: stage, key: stage })) || ''}
        defaultValue={buildData.deal_stage}
        placeholder={buildData.deal_stage}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'deal_stage',
              value: option.value,
            },
          };
          handleChange(newEvent);
          setUnfilledFields((prev) => prev.filter((field) => field !== 'deal_stage'));
        }}
      />
    );
  }

  const formFieldProps = {
    buildData,
    setBuildData,
    handleChange,
    handleTooltip,
    setUnfilledFields,
    unfilledFields,
    customInputStyles,
    classes,
    openTooltip,
  };

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

        <Grid container spacing={4} className={classes.inputGridContainer}>
          <PortfolioCompanyName {...formFieldProps} />

          {dealType === 'spv' && <PortfolioCompanySecurities {...formFieldProps} />}

          {dealType === 'fund' && <NumberOfInvestments {...formFieldProps} />}

          {dealType === 'spv' && <DealName {...formFieldProps} />}

          <ClosingDate {...formFieldProps} />

          <ManagerName {...formFieldProps} />

          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Manager Full Title
                <ModalTooltip
                  title="Manager Full Title"
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
                inputProps={customInputStyles}
                onClick={() =>
                  setUnfilledFields((prev) => prev.filter((field) => field !== 'representative'))
                }
                classes={{
                  root: unfilledFields.includes('representative') && classes.unfilledField,
                }}
              />
            </FormControl>
          </Grid>

          {/* FOURTH ROW */}
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Deal Stage
                <ModalTooltip
                  title="Deal Stage"
                  handleTooltip={handleTooltip}
                  tooltipContent={
                    <Typography color="inherit">
                      These are the different stages of funding for your SPV/Fund
                    </Typography>
                  }
                  openTooltip={openTooltip}
                  id="deal_stage"
                >
                  <HelpIcon
                    className={classes.helpIcon}
                    onClick={(e) => handleTooltip('deal_stage')}
                  />
                </ModalTooltip>
              </Typography>

              <DealStagesSelector />
            </FormControl>
          </Grid>

          {!buildData.high_volume_partner && <EstimatedSPVQuantity {...formFieldProps} />}

          {!buildData.high_volume_partner && buildData.estimated_spv_quantity >= 5 && (
            <Grid className={classes.inputGridItem} item xs={12}>
              <FormControl required disabled variant="outlined" className={classes.formContainers}>
                <Typography className={classes.formItemName}>
                  Master Series Name
                  <ModalTooltip
                    title="Master Series Name"
                    handleTooltip={handleTooltip}
                    tooltipContent={
                      <Typography color="inherit">
                        Please indicate the name of your SPV (applicable if you are a HVP)
                      </Typography>
                    }
                    openTooltip={openTooltip}
                    id="master_series"
                  >
                    <HelpIcon
                      className={classes.helpIcon}
                      onClick={(e) => handleTooltip('master_series')}
                    />
                  </ModalTooltip>
                </Typography>
                <TextField
                  value={buildData.master_series}
                  name="master_series"
                  onChange={handleChange}
                  className={`${classes.inputBox} ${classes.wideInputBox}`}
                  variant="outlined"
                  inputProps={customInputStyles}
                  onClick={() =>
                    setUnfilledFields((prev) => prev.filter((field) => field !== 'master_series'))
                  }
                  classes={{
                    root: unfilledFields.includes('master_series') && classes.unfilledField,
                  }}
                />
              </FormControl>
            </Grid>
          )}

          <Sectors {...formFieldProps} />
        </Grid>
      </form>
    </Paper>
  );
}
