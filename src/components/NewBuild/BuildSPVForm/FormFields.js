import React from 'react';
import { FormControl, Grid, Typography, TextField } from '@material-ui/core';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import HelpIcon from '@material-ui/icons/Help';
import Select from 'react-select';
import { toast } from 'react-toastify';
import sectors from './FormComponents/TypeSelector/sectors';
import { convertToPositiveIntOrNull } from '../../../utils/numbers';

export function PortfolioCompanyName({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Portfolio Company Name
          <ModalTooltip
            title="Company Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Full name of the company in which the SPV will invest in (e.g. Allocations, Inc., a
                Delaware corporation)
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
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'portfolio_company_name'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder="SpaceX"
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('portfolio_company_name') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function PortfolioCompanySecurities({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  classes,
  openTooltip,
}) {
  function SecuritiesSelector() {
    const securityTypes = [
      'Series A Preferred Stock',
      'Simple Agreement for Future Equity',
      'Convertible Promissory Note',
      'Other',
    ];
    const customStyles = {
      control: (styles) => ({
        ...styles,
        height: 60,
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('portfolio_company_securities')
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
          setUnfilledFields((prev) =>
            prev.filter((field) => field !== 'portfolio_company_securities'),
          );
        }}
      />
    );
  }
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Portfolio Company Securities?
          <ModalTooltip
            title="Company Securities"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Indicate what kind of security the SPV will acquire (e.g., Series A Preferred Stock,
                Simple Agreement for Future Equity, Convertible Promissory Note or other)
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
  );
}

export function ManagerName({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Fund Manager Full Name
          <ModalTooltip
            title="Fund Manager Full Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">Full name of the manager of your SPV</Typography>
            }
            openTooltip={openTooltip}
            id="manager_name"
          >
            <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('manager_name')} />
          </ModalTooltip>
        </Typography>
        <TextField
          value={buildData.manager_name}
          name="manager_name"
          onChange={handleChange}
          className={classes.inputBox}
          variant="outlined"
          inputProps={customInputStyles}
          onClick={() =>
            setUnfilledFields((prev) => prev.filter((field) => field !== 'manager_name'))
          }
          classes={{
            root: unfilledFields.includes('manager_name') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function DealName({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
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
          onClick={() =>
            setUnfilledFields((prev) => prev.filter((field) => field !== 'portfolio_deal_name'))
          }
          classes={{
            root: unfilledFields.includes('portfolio_deal_name') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function NumberOfInvestments({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Number Of Investments
          <ModalTooltip
            title="Number Of Investments"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Indicate the amount of investments the Fund will make during the Investment Period
              </Typography>
            }
            openTooltip={openTooltip}
            id="number_of_investments"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('number_of_investments')}
            />
          </ModalTooltip>
        </Typography>
        <TextField
          value={buildData.number_of_investments}
          name="number_of_investments"
          onChange={handleChange}
          className={classes.inputBox}
          variant="outlined"
          placeholder="e.x. crypto deal"
          inputProps={customInputStyles}
          onClick={() =>
            setUnfilledFields((prev) => prev.filter((field) => field !== 'number_of_investments'))
          }
          classes={{
            root: unfilledFields.includes('number_of_investments') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function EstimatedSPVQuantity({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Estimated number of SPVs in the next 12 months?
          <ModalTooltip
            title="SPV amount in the next 12 months"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Should you select 5 or more SPVs, you will be eligible for a High Volume Partnership
                benefits (such as, custom name of your Master Series LLC, custom name of your SPVs,
                and others)
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
          type="number"
          value={buildData.estimated_spv_quantity}
          name="estimated_spv_quantity"
          onChange={(e) => {
            const value = convertToPositiveIntOrNull(e.target.value);

            const newEvent = {
              target: {
                name: 'estimated_spv_quantity',
                value,
              },
            };

            handleChange(newEvent);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'estimated_spv_quantity'));
          }}
          className={classes.inputBox}
          variant="outlined"
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('estimated_spv_quantity') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function ClosingDate({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
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
            <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('closing_date')} />
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
          onClick={() =>
            setUnfilledFields((prev) => prev.filter((field) => field !== 'closing_date'))
          }
          classes={{
            root: unfilledFields.includes('closing_date') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

// export function name({
//     buildData,
//     handleChange,
//     handleTooltip,
//     setUnfilledFields,
//     unfilledFields,
//     customInputStyles,
//     classes,
//     openTooltip,
// }) {
//     return (
//     )
// }

// export function name({
//     buildData,
//     handleChange,
//     handleTooltip,
//     setUnfilledFields,
//     unfilledFields,
//     customInputStyles,
//     classes,
//     openTooltip,
// }) {
//     return (
//     )
// }

// export function name({
//     buildData,
//     handleChange,
//     handleTooltip,
//     setUnfilledFields,
//     unfilledFields,
//     customInputStyles,
//     classes,
//     openTooltip,
// }) {
//     return (
//     )
// }

export function Sectors({
  buildData,
  setBuildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
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
        border: unfilledFields.includes('sectors') ? '2px solid red' : '1pm solid hsl(0, 0%, 80%)',
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
              const newBuildObject = {
                ...prev,
                sectors: isAtLimit ? prev.sectors : [...prev.sectors, sector],
              };
              localStorage.setItem('buildData', JSON.stringify(newBuildObject));
              return newBuildObject;
            });

            setUnfilledFields((prev) => prev.filter((field) => field !== 'sectors'));
          }}
          isMulti
        />
      </>
    );
  }

  return (
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
  );
}
