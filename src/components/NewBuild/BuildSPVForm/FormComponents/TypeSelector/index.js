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

export default function TypeSelector({
  assetType,
  handleChange,
  buildData,
  setBuildData,
  handleTooltip,
  openTooltip,
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
      icon: LevelIcon,
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
      icon: CustomIcon,
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
      multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#DAE8FF',
      }),
      multiValueLabel: (styles) => ({
        ...styles,
        color: '#0461FF',
        height: 37,
        display: 'flex',
        alignItems: 'center',
        fontSize: '96%',
      }),
      multiValueRemove: (styles) => ({
        ...styles,
        color: '#0461FF',
      }),
      control: (styles) => ({
        ...styles,
        minHeight: 60,
        maxWidth: 1208,
        cursor: 'pointer',
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

  const securityTypes = [
    'Series A Preferred Stock',
    'Simple Agreement for Future Equity',
    'Convertible Promissory Note',
    'Other',
  ];

  function SecuritiesSelector() {
    const customStyles = {
      control: (styles) => ({
        ...styles,
        height: 60,
        maxWidth: 568,
        cursor: 'pointer',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children !== 'Select...' ? '#000' : '#999',
      }),
    };

    return (
      <Select
        id="portfolio_company_securities"
        label="Portfolio Company Securities"
        styles={customStyles}
        options={securityTypes.map((security) => ({ value: security, label: security })) || ''}
        defaultValue={buildData.portfolio_company_securities}
        placeholder={buildData.portfolio_company_securities || 'Select...'}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'portfolio_company_securities',
              value: option.value,
            },
          };
          handleChange(newEvent);
        }}
      />
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
        options={dealStages.map((stage) => ({ value: stage, label: stage })) || ''}
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
        }}
      />
    );
  }

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
          {/* FIRST ROW */}
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
                inputProps={customInputStyles}
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
                  id="portfolio_company_securities"
                >
                  <HelpIcon
                    className={classes.helpIcon}
                    onClick={(e) => handleTooltip('portfolio_company_securities')}
                  />
                </ModalTooltip>
              </Typography>

              <SecuritiesSelector />
            </FormControl>
          </Grid>
          {/* SECOND ROW */}

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
                inputProps={customInputStyles}
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
                inputProps={customInputStyles}
              />
            </FormControl>
          </Grid>

          {/* THIRD ROW */}
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
                inputProps={customInputStyles}
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
                inputProps={customInputStyles}
              />
            </FormControl>
          </Grid>

          {/* FOURTH ROW */}
          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Deal Stages
                <ModalTooltip
                  title="Deal Stages"
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

          <Grid className={classes.inputGridItem} item xs={6}>
            <FormControl required disabled variant="outlined" className={classes.formContainers}>
              <Typography className={classes.formItemName}>
                Estimated number of SPVs in the next 12 months?
                <ModalTooltip
                  title="SPV amount in the next 12 months"
                  handleTooltip={handleTooltip}
                  tooltipContent={
                    <Typography color="inherit">
                      Should you select 5 or more SPVs, you will be eligible for a High Volume
                      Partnership benefits (such as, custom name of your Master Series LLC, custom
                      name of your SPVs, and others)
                    </Typography>
                  }
                  openTooltip={openTooltip}
                  id="estimated_spv_quantity"
                >
                  <HelpIcon
                    className={classes.helpIcon}
                    onClick={(e) => handleTooltip('estimated_spv_quantity')}
                  />
                </ModalTooltip>
              </Typography>
              <TextField
                value={buildData.estimated_spv_quantity}
                name="estimated_spv_quantity"
                onChange={handleChange}
                className={classes.inputBox}
                variant="outlined"
                inputProps={customInputStyles}
              />
            </FormControl>
          </Grid>
          {buildData.estimated_spv_quantity >= 5 && (
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
                />
              </FormControl>
            </Grid>
          )}
          <Grid className={classes.inputGridItem} item xs={12}>
            <Typography className={classes.formItemName}>
              Sector(s)
              <ModalTooltip
                title="Sector(s)"
                handleTooltip={handleTooltip}
                tooltipContent={
                  <Typography color="inherit">
                    Indicate the sector where the Portfolio Company is operating in
                  </Typography>
                }
                openTooltip={openTooltip}
                id="sectors"
              >
                <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('sectors')} />
              </ModalTooltip>
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
