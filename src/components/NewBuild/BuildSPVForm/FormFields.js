import React from 'react';
import { FormControl, Grid, Typography, TextField, Button, ButtonGroup } from '@material-ui/core';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import { phone } from '../../../utils/helpers';
import HelpIcon from '@material-ui/icons/Help';
import Select from 'react-select';
import { toast } from 'react-toastify';
import sectors from './FormComponents/TypeSelector/sectors';
import { convertToPositiveIntOrNull } from '../../../utils/numbers';
import useStyles from '../BuildStyles';
import countries from 'country-region-data';

const phoneSize = window.innerWidth < phone;

const ButtonSelector = ({ currentValue, name, values, onChange, gridCol = '1fr 1fr' }) => {
  const classes = useStyles();

  return (
    <ButtonGroup
      color="primary"
      aria-label="outlined primary button group"
      style={{
        display: 'grid',
        gridTemplateColumns: gridCol,
        width: phoneSize ? '325px' : '90%',
        gridGap: phoneSize ? '6px' : '10px',
      }}
    >
      {values.map(({ label, value }, i) => (
        <Button
          key={i}
          name={name}
          value={value}
          className={`${currentValue === value ? classes.selected : null} ${
            classes.selectorButton
          }`}
          onClick={(e) => {
            const target = {
              name: e.currentTarget.name,
              value: e.currentTarget.value,
            };
            e.target = target;
            onChange(e);
          }}
        >
          {label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

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

export function Sectors({
  buildData,
  setBuildData,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
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

export function Representative({
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
          Manager Full Title
          <ModalTooltip
            title="Manager Full Title"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Please indicate the name of the representative of the Manager as well as the title
                of the said person; applicable only if the Manager is a legal entity
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
  );
}

export function DealStage({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  classes,
  openTooltip,
}) {
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
  return (
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
            <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('deal_stage')} />
          </ModalTooltip>
        </Typography>

        <DealStagesSelector />
      </FormControl>
    </Grid>
  );
}

export function MasterSeries({
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
  );
}

export function ManagementFee({
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
    <Grid className={classes.customInputGridItem} item xs={6}>
      <FormControl
        required
        // disabled
        variant="outlined"
        className={classes.formContainers}
      >
        <Typography className={classes.formItemName}>
          Choose your management fee
          <ModalTooltip
            title="Management Fee"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                A fee which will be charged by the Manager for covering Manager's expenses preparing
                the deal
              </Typography>
            }
            openTooltip={openTooltip}
            id="management_fee_value"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('management_fee_value')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="management_fee_value"
          onChange={handleChange}
          currentValue={buildData.management_fee_value}
          gridCol={phoneSize ? 'repeat(3, 1fr)' : 'repeat(4, 1fr) 1.5fr'}
          values={[
            { label: '0%', value: '0' },
            { label: '1%', value: '1' },
            { label: '2%', value: '2' },
            { label: '3%', value: '3' },
            { label: 'Custom', value: 'Custom' },
          ]}
        />
      </FormControl>
      {buildData.management_fee_value === 'Custom' && (
        <FormControl
          required
          disabled
          variant="outlined"
          className={classes.formContainers}
          style={{ marginTop: '40px' }}
        >
          <Typography className={classes.formItemName}>
            Enter your custom management fee
            <ModalTooltip
              title="Custom Management Fee"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">
                  Please enter your custom management fees according to your deal. i.e "20% for the
                  first year, 10% for any years after"
                </Typography>
              }
              openTooltip={openTooltip}
              id="custom_management_fee"
            >
              <HelpIcon
                className={classes.helpIcon}
                onClick={(e) => handleTooltip('custom_management_fee')}
              />
            </ModalTooltip>
          </Typography>
          <TextField
            value={
              buildData.custom_management_fee === 'false' ? '' : buildData.custom_management_fee
            }
            placeholder="Custom Management Fee"
            name="custom_management_fee"
            onChange={(e) => {
              handleChange(e);
              setUnfilledFields((prev) =>
                prev.filter((field) => field !== 'custom_management_fee'),
              );
            }}
            className={classes.inputBox}
            variant="outlined"
            inputProps={customInputStyles}
            classes={{
              root: `${unfilledFields.includes('custom_management_fee') && classes.unfilledField} ${
                classes.selectInputBox
              }`,
            }}
          />
        </FormControl>
      )}
    </Grid>
  );
}

export function ManagementFeeFrequency({
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
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Choose your fee frequency
          <ModalTooltip
            title="Fee Frequency"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Period for which the Management Fee will be charged (one time or annually)
              </Typography>
            }
            openTooltip={openTooltip}
            id="fee_frequency"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('fee_frequency')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="management_fee_frequency"
          onChange={handleChange}
          currentValue={buildData.management_fee_frequency}
          values={[
            { label: 'One Time', value: 'one time' },
            { label: 'Annual', value: 'annual' },
          ]}
        />
      </FormControl>
    </Grid>
  );
}

export function CarryFee({
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
    <Grid className={classes.customInputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Choose your carry fee
          <ModalTooltip
            title="Carry Fee"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                A fee which the Manager will be entitled to in case the SPV's investment is
                successful/profitable; note that carry fee is charged only from the profit
              </Typography>
            }
            openTooltip={openTooltip}
            id="carry_fee_value"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('carry_fee_value')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="carry_fee_value"
          onChange={handleChange}
          currentValue={buildData.carry_fee_value}
          gridCol={phoneSize ? 'repeat(3, 1fr)' : 'repeat(4, 1fr) 1.5fr'}
          values={[
            { label: '0%', value: '0' },
            { label: '10%', value: '10' },
            { label: '20%', value: '20' },
            { label: '30%', value: '30' },
            { label: 'Custom', value: 'Custom' },
          ]}
        />
      </FormControl>
      {buildData.carry_fee_value === 'Custom' && (
        <FormControl
          required
          disabled
          variant="outlined"
          className={classes.formContainers}
          style={{ marginTop: '40px' }}
        >
          <Typography className={classes.formItemName}>
            Enter your custom carry fee
            <ModalTooltip
              title="Custom Carry Fee"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">
                  Please enter your custom carry fees according to your deal
                </Typography>
              }
              openTooltip={openTooltip}
              id="custom_carry_fee"
            >
              <HelpIcon
                className={classes.helpIcon}
                onClick={(e) => handleTooltip('custom_carry_fee')}
              />
            </ModalTooltip>
          </Typography>
          <TextField
            value={buildData.custom_carry_fee === 'false' ? '' : buildData.custom_carry_fee}
            placeholder="Custom Carry Fee"
            name="custom_carry_fee"
            onChange={(e) => {
              handleChange(e);
              setUnfilledFields((prev) => prev.filter((field) => field !== 'custom_carry_fee'));
            }}
            className={classes.inputBox}
            variant="outlined"
            inputProps={customInputStyles}
            classes={{
              root: `${unfilledFields.includes('custom_carry_fee') && classes.unfilledField} ${
                classes.selectInputBox
              }`,
            }}
          />
        </FormControl>
      )}
    </Grid>
  );
}

export function SideLetters({
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
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Will you charge the same fee for all investors?
          <ModalTooltip
            title="Charge the same fee for all investors?"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                For some investors you might want to provide different fee structure, this is
                possible by concluding side letters
              </Typography>
            }
            openTooltip={openTooltip}
            id="same_investor_fee"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('same_investor_fee')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="side_letters"
          onChange={handleChange}
          currentValue={buildData.side_letters}
          values={[
            { label: 'Yes (Standard)', value: 'false' },
            { label: 'No', value: 'true' },
          ]}
        />
      </FormControl>
    </Grid>
  );
}

export function MinimumInvestment({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          What is the minimum investment?
          <ModalTooltip
            title="What is the minimum investment?"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Please indicate what is the minimum investment for investors to invest into SPV
                (e.g., $10,000)
              </Typography>
            }
            openTooltip={openTooltip}
            id="minimum_investment"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('minimum_investment')}
            />
          </ModalTooltip>
        </Typography>
        <TextField
          type="number"
          value={buildData.minimum_investment}
          name="minimum_investment"
          onChange={(e) => {
            const value = convertToPositiveIntOrNull(e.target.value);

            const newEvent = {
              target: {
                name: 'minimum_investment',
                value,
              },
            };

            handleChange(newEvent);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'minimum_investment'));
          }}
          className={classes.minimumInput}
          variant="outlined"
          inputProps={{ style: { height: '23px' } }}
          classes={{
            root: `${unfilledFields.includes('minimum_investment') && classes.unfilledField} ${
              classes.selectInputBox
            }`,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function ReportingAdviser({
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
    <Grid className={classes.customInputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Choose Allocations as the adviser?
          <ModalTooltip
            title="Reporting Advisor"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                An investment adviser can or will be a regulatory requirement for private funds
                raising capital for a fee. Please consult your legal counsel on whether your deal
                needs an adviser{' '}
              </Typography>
            }
            openTooltip={openTooltip}
            id="reporting_advisor"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('reporting_advisor')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="allocations_reporting_adviser"
          onChange={handleChange}
          currentValue={buildData.allocations_reporting_adviser}
          values={[
            { label: 'Yes (Recommended)', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </FormControl>
      {buildData.allocations_reporting_adviser === 'false' && (
        <FormControl
          required
          disabled
          variant="outlined"
          className={classes.formContainers}
          style={{ marginTop: '40px' }}
        >
          <Typography className={classes.formItemName}>
            Please enter your adviser name
            <ModalTooltip
              title="Adviser Name"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">Please indicate your ERA/RIA name</Typography>
              }
              openTooltip={openTooltip}
              id="custom_reporting_adviser"
            >
              <HelpIcon
                className={classes.helpIcon}
                onClick={(e) => handleTooltip('custom_reporting_adviser')}
              />
            </ModalTooltip>
          </Typography>
          <TextField
            value={buildData.custom_reporting_adviser}
            placeholder="Adviser Name"
            name="custom_reporting_adviser"
            onChange={handleChange}
            className={classes.inputBox}
            variant="outlined"
            inputProps={customInputStyles}
            classes={{ root: classes.selectInputBox }}
          />
        </FormControl>
      )}
    </Grid>
  );
}

export function OfferingType({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          What is your offering type?
          <ModalTooltip
            title="Offering Type"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Depending on the offering type you might be able to ensure self-accreditation for
                investors or even advertise your deal publicly; please consult your legal counsel
              </Typography>
            }
            openTooltip={openTooltip}
            id="offering_type"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('offering_type')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="offering_type"
          onChange={handleChange}
          currentValue={buildData.offering_type}
          values={[
            { label: 'Private (506b)', value: '506b' },
            { label: 'Public (506c)', value: '506c' },
          ]}
        />
      </FormControl>
    </Grid>
  );
}

export function CustomInvestmentAgreement({
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
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={classes.formItemName}>
          Whose fund template documents would you like to use?
          <ModalTooltip
            title="Fund Template Documents"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                As you might have your own SPV documents, you can use them with us as well, this
                would limit the period of time in which the SPV could be closed
              </Typography>
            }
            openTooltip={openTooltip}
            id="fund_template_docs"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('fund_template_docs')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="custom_investment_agreement"
          onChange={handleChange}
          currentValue={buildData.custom_investment_agreement}
          values={[
            { label: 'Allocations', value: 'false' },
            { label: 'Custom', value: 'true' },
          ]}
        />
      </FormControl>
    </Grid>
  );
}

export function InternationalCompanyStatus({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  classes,
  openTooltip,
}) {
  function InternationalCountrySelector() {
    const countryNames = countries.map((c) => c.countryName);
    const placeHolder = 'Please select which countries';
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
        marginTop: 50,
        minHeight: 60,
        width: phoneSize ? '325px' : '90%',
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('international_company_country')
          ? '2px solid red'
          : '1pm solid hsl(0, 0%, 80%)',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children === placeHolder ? '#999' : '#000',
      }),
    };

    return (
      <Select
        id="international_company_country"
        label="International Company by Country"
        menuPosition="fixed"
        styles={customStyles}
        value={buildData.international_company_country || ''}
        options={countryNames.map((country) => ({ value: country, label: country })) || ''}
        placeholder={buildData.international_company_country || placeHolder}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'international_company_country',
              value: option.value,
            },
          };
          handleChange(newEvent);
          setUnfilledFields((prev) =>
            prev.filter((field) => field !== 'international_company_country'),
          );
        }}
      />
    );
  }

  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={`${classes.formItemName} ${classes.customFormItemName}`}>
          Will this deal being investing into an international (Non US) company?
          <ModalTooltip
            title="International Companies"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                If this SPV/Fund will invest into a company located outside the United States,
                please select Yes to this question followed by the applicable country. If you are
                unsure at the moment, please select Unknown.
              </Typography>
            }
            openTooltip={openTooltip}
            id="international_company_status"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('international_company_status')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="international_company_status"
          gridCol="1fr 1fr 1fr"
          onChange={handleChange}
          currentValue={buildData.international_company_status}
          values={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
            { label: 'Unknown', value: 'unknown' },
          ]}
        />
      </FormControl>
      {buildData.international_company_status === 'true' && (
        <FormControl required variant="outlined" className={classes.formContainers}>
          <InternationalCountrySelector />
        </FormControl>
      )}
    </Grid>
  );
}

export function InternationalInvestorsStatus({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
}) {
  function InternationalInvestorsCountriesSelector() {
    const countryNames = countries.map((c) => c.countryName);
    const placeHolder = 'Please select which countries';
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
        marginTop: 50,
        minHeight: 60,
        width: phoneSize ? '325px' : '90%',
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('international_investors_countries')
          ? '2px solid red'
          : '1pm solid hsl(0, 0%, 80%)',
      }),
      placeholder: (styles, data) => ({
        ...styles,
        color: data.children === placeHolder ? '#999' : '#000',
      }),
    };

    return (
      <Select
        id="international_investors_countries"
        label="International Companies by Country"
        menuPosition="fixed"
        styles={customStyles}
        value={
          buildData.international_investors_countries.map((country) => ({
            value: country,
            label: country,
          })) || ''
        }
        options={countryNames.map((country) => ({ value: country, label: country })) || ''}
        placeholder={placeHolder || buildData.international_investors_countries}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'international_investors_countries',
              value: option.map((country) => country.value),
            },
          };
          handleChange(newEvent);
          setUnfilledFields((prev) =>
            prev.filter((field) => field !== 'international_investors_countries'),
          );
        }}
        isMulti
      />
    );
  }

  return (
    <Grid className={classes.inputGridItem} item xs={6} spacing={2}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Typography className={`${classes.formItemName} ${classes.customFormItemName}`}>
          Will you have any international (Non US) investors?
          <ModalTooltip
            title="International Investors"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                If this SPV/Fund will have investors located outside the United States, please
                select Yes to this question followed by the applicable country. If you are unsure at
                the moment, please select Unknown.
              </Typography>
            }
            openTooltip={openTooltip}
            id="international_investors_status"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={(e) => handleTooltip('international_investors_status')}
            />
          </ModalTooltip>
        </Typography>
        <ButtonSelector
          name="international_investors_status"
          gridCol="1fr 1fr 1fr"
          onChange={handleChange}
          currentValue={buildData.international_investors_status}
          values={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
            { label: 'Unknown', value: 'unknown' },
          ]}
        />
      </FormControl>
      {buildData.international_investors_status === 'true' && (
        <FormControl required variant="outlined" className={classes.formContainers}>
          <InternationalInvestorsCountriesSelector />
        </FormControl>
      )}
    </Grid>
  );
}
export function NotesMemo({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <>
      <Typography className={classes.formItemName}>
        Any notes we should know about?
        <ModalTooltip
          title="Extra Notes"
          handleTooltip={handleTooltip}
          tooltipContent={
            <Typography color="inherit">
              Indicate any special provisions which you would like to capture in the deal
            </Typography>
          }
          openTooltip={openTooltip}
          id="extra_notes"
        >
          <HelpIcon className={classes.helpIcon} onClick={(e) => handleTooltip('extra_notes')} />
        </ModalTooltip>
      </Typography>
      <TextField
        multiline
        variant="outlined"
        name="memo"
        value={buildData.memo}
        onChange={handleChange}
        className={classes.finalInputBox}
        inputProps={{
          className: classes.finalInput,
        }}
      />
    </>
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
