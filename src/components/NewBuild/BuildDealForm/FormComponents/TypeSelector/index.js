import React from 'react';
import HelpIcon from '@material-ui/icons/Help';
import { Paper, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
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
import {
  DealName,
  ManagerName,
  ClosingDate,
  PortfolioCompanyName,
  PortfolioCompanySecurities,
  Sectors,
  NumberOfInvestments,
  Representative,
  DealStage,
  FundName,
  GeneralPartnerName,
  RepresentativeGeneralPartnerAndTitle,
  MinimumInvestmentFund,
  NeedGPEntity,
  GPEntityName,
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
  sectionOneComplete,
  sectionComplete,
}) {
  const classes = useStyles();
  const customInputStyles = { style: { height: '23px' } };
  const params = useParams();

  const row1Items = [
    {
      title: 'Startup',
      value: 'Startup',
      description: 'Raise money to invest in a private company',
      icon: RocketIcon,
      height: '56px',
      width: '54px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'Crypto',
      value: 'Crypto',
      description: 'Raise money to invest in a crypto project (token/equity)',
      icon: CryptoIcon,
      height: '34px',
      width: '34px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'Real Estate',
      value: 'Real Estate',
      description: 'Raise money to invest in a real estate project',
      icon: HouseIcon,
      height: '29px',
      width: '36px',
      dealType: ['spv', 'fund'],
    },
    {
      title: 'SPV into a Fund',
      value: 'SPV into a Fund',
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
      value: 'Secondary',
      description: 'Raise money to invest in a secondary of a private company',
      icon: LevelIcon,
      height: '35px',
      width: '28px',
      dealType: ['spv'],
    },
    {
      title: 'SPV into an SPV',
      value: 'SPV into an SPV',
      description: 'Raise money to invest in another SPV',
      icon: NetworkIcon,
      height: '32px',
      width: '20px',
      dealType: ['spv'],
    },
    {
      title: 'Management Co.',
      value: 'Management Company',
      description: `Sell a stake in your fund's management company's future carry`,
      icon: PieIcon,
      height: '30px',
      width: '30px',
      dealType: ['spv'],
    },
    {
      title: 'Custom',
      value: 'Custom',
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
    <Paper
      className={classes.paper}
      style={{ paddingBottom: width >= 650 ? classes.paper.paddingBottom : '82px' }}
    >
      <Grid container className={classes.sectionHeader}>
        <Grid
          item
          className={classes.sectionHeaderNumber}
          style={{ backgroundColor: sectionOneComplete ? '#0461ff' : '#EBEBEB' }}
        >
          1
        </Grid>
        <Typography
          variant="h6"
          gutterBottom
          className={classes.sectionHeaderText}
          style={{ color: sectionOneComplete ? '#2A2B54' : '#8E9394' }}
        >
          Basic Information
        </Typography>
      </Grid>
      <Grid container className={classes.outerSection} style={sectionComplete(sectionOneComplete)}>
        <form noValidate autoComplete="off" className={classes.formContainers}>
          <Typography className={classes.formItemName}>
            Choose your asset type
            <ModalTooltip
              title="Asset Type"
              handleTooltip={handleTooltip}
              tooltipContent={
                params.type === 'fund' ? (
                  <Typography color="inherit">
                    Select the type of deal which reflects the intended structure and the assets
                    which the Fund will purchase
                  </Typography>
                ) : (
                  <Typography color="inherit">
                    Select the type of deal which reflects the intended structure and the assets
                    which the SPV will purchase
                  </Typography>
                )
              }
              openTooltip={openTooltip}
              id="asset_type"
            >
              <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('asset_type')} />
            </ModalTooltip>
          </Typography>
          <Grid container className={classes.assetChoiceGrid}>
            <FormRow rowItems={row1Items} />
            <FormRow rowItems={row2Items} />{' '}
          </Grid>

          <Grid container spacing={4} className={classes.inputGridContainer}>
            {dealType === 'spv' && (
              <>
                <PortfolioCompanyName {...formFieldProps} />
                <PortfolioCompanySecurities {...formFieldProps} />
                <DealName {...formFieldProps} />
                <ClosingDate {...formFieldProps} />
                <ManagerName {...formFieldProps} />
                <Representative {...formFieldProps} />
              </>
            )}
            {dealType === 'fund' && (
              <>
                <FundName {...formFieldProps} />
                <NumberOfInvestments {...formFieldProps} />
                <GeneralPartnerName {...formFieldProps} />
                <RepresentativeGeneralPartnerAndTitle {...formFieldProps} />
                <ClosingDate {...formFieldProps} />
                <MinimumInvestmentFund {...formFieldProps} />
                <NeedGPEntity {...formFieldProps} />
                {buildData.need_gp_entity === 'false' && <GPEntityName {...formFieldProps} />}
              </>
            )}
            <DealStage {...formFieldProps} />
            <Sectors {...formFieldProps} />
          </Grid>
        </form>
      </Grid>
    </Paper>
  );
}
