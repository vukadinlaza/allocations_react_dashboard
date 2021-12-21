import React from 'react';
import {
  FormControl,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import countries from 'country-region-data';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import { phone } from '../../../utils/helpers';
import sectors from './FormComponents/TypeSelector/sectors';
import { convertToPositiveIntOrNull } from '../../../utils/numbers';
import {
  ButtonSelector,
  DealStagesSelector,
  InternationalCountrySelector,
  InternationalInvestorsCountriesSelector,
  SecuritiesSelector,
} from '../common/selectors';

const phoneSize = window.innerWidth < phone;

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
    <Grid className={classes.basicInformationInputItem} item xs={6} style={{ maxHeight: '125px' }}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Portfolio Company Name</Typography>
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
              onClick={() => handleTooltip('portfolio_company_name')}
            />
          </ModalTooltip>
        </Grid>
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

export function FundName({
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Fund Name</Typography>
          <ModalTooltip
            title="Fund Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                A name to identify your deal (name of your series LP)
              </Typography>
            }
            openTooltip={openTooltip}
            id="name"
          >
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('name')} />
          </ModalTooltip>
        </Grid>
        <TextField
          value={buildData.name}
          name="name"
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'name'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder="e.x. crypto deal"
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('name') && classes.unfilledField,
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
  return (
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Portfolio Company Securities?</Typography>
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
              onClick={() => handleTooltip('portfolio_company_securities')}
            />
          </ModalTooltip>
        </Grid>

        <SecuritiesSelector
          buildData={buildData}
          handleChange={handleChange}
          setUnfilledFields={setUnfilledFields}
          unfilledFields={unfilledFields}
        />
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Fund Manager Full Name</Typography>
          <ModalTooltip
            title="Fund Manager Full Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">Full name of the manager of your SPV</Typography>
            }
            openTooltip={openTooltip}
            id="manager_name"
          >
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('manager_name')} />
          </ModalTooltip>
        </Grid>
        <TextField
          value={buildData.manager_name}
          name="manager_name"
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'manager_name'));
          }}
          className={classes.inputBox}
          variant="outlined"
          inputProps={customInputStyles}
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Deal Name</Typography>
          <ModalTooltip
            title="Deal Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                A name to identify your deal (name of your series SPV in case you are a HVP)
              </Typography>
            }
            openTooltip={openTooltip}
            id="name"
          >
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('name')} />
          </ModalTooltip>
        </Grid>
        <TextField
          value={buildData.name}
          name="name"
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'name'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder="e.x. crypto deal"
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('name') && classes.unfilledField,
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Number Of Investments</Typography>
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
              onClick={() => handleTooltip('number_of_investments')}
            />
          </ModalTooltip>
        </Grid>
        <TextField
          type="number"
          value={buildData.number_of_investments}
          name="number_of_investments"
          onChange={(e) => {
            const value = convertToPositiveIntOrNull(e.target.value);

            const newEvent = {
              target: {
                name: 'number_of_investments',
                value,
              },
            };
            handleChange(newEvent);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'number_of_investments'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder=""
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('number_of_investments') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function GeneralPartnerName({
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>General Partner Name</Typography>
          <ModalTooltip
            title="General Partner Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Full name of the manager of your Fund; general partner is responsible for managing
                the Fund
              </Typography>
            }
            openTooltip={openTooltip}
            id="manager_name"
          >
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('manager_name')} />
          </ModalTooltip>
        </Grid>
        <TextField
          value={buildData.manager_name}
          name="manager_name"
          onChange={handleChange}
          className={classes.inputBox}
          variant="outlined"
          placeholder=""
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

export function RepresentativeGeneralPartnerAndTitle({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
  width,
}) {
  return (
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={classes.formItemName}>
            Representative of the General Partner and its Title
            <ModalTooltip
              title="Representative of the General Partner and it's Title"
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
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('representative')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
        <TextField
          value={buildData.representative}
          name="representative"
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'representative'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder=""
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('representative') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function MinimumInvestmentFund({
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Minimum Investment Amount</Typography>
          <ModalTooltip
            title="Minimum Investment Amount"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Please indicate what is the minimum investment for investors to invest into Fund
                (e.g., $10,000)
              </Typography>
            }
            openTooltip={openTooltip}
            id="minimum_investment"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={() => handleTooltip('minimum_investment')}
            />
          </ModalTooltip>
        </Grid>
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
          className={classes.inputBox}
          variant="outlined"
          placeholder=""
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('minimum_investment') && classes.unfilledField,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function TargetRaiseGoal({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  customInputStyles,
  classes,
  openTooltip,
  width,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={classes.formItemName}>
            What is the Target Raise Goal for this deal?
            <ModalTooltip
              title="Target Raise Goal"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">
                  What is the amount you would like to raise for this deal?
                </Typography>
              }
              openTooltip={openTooltip}
              id="target_raise_goal"
            >
              <HelpIcon
                className={classes.helpIcon}
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('target_raise_goal')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
        <TextField
          type="number"
          value={buildData.target_raise_goal}
          name="target_raise_goal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          onChange={(e) => {
            const value = convertToPositiveIntOrNull(e.target.value);

            const newEvent = {
              target: {
                name: 'target_raise_goal',
                value,
              },
            };
            handleChange(newEvent);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'target_raise_goal'));
          }}
          className={classes.inputBox}
          variant="outlined"
          classes={{
            root: `${unfilledFields.includes('target_raise_goal') && classes.unfilledField} ${
              classes.selectInputBox
            }`,
          }}
        />
      </FormControl>
    </Grid>
  );
}

export function NeedGPEntity({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Do you need a GP Entity?</Typography>
          <ModalTooltip
            title="Need GP Entity"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">
                Please let us know whether you want us to form a Delaware GP entity for you
              </Typography>
            }
            openTooltip={openTooltip}
            id="need_gp_entity"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={() => handleTooltip('need_gp_entity')}
            />
          </ModalTooltip>
        </Grid>
        <ButtonSelector
          name="need_gp_entity"
          onChange={handleChange}
          currentValue={buildData.need_gp_entity}
          values={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </FormControl>
    </Grid>
  );
}

export function GPEntityName({
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>GP Entity Name</Typography>
          <ModalTooltip
            title="GP Entity Name"
            handleTooltip={handleTooltip}
            tooltipContent={
              <Typography color="inherit">Indicate your desired name of the GP entity</Typography>
            }
            openTooltip={openTooltip}
            id="gp_entity_name"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={() => handleTooltip('gp_entity_name')}
            />
          </ModalTooltip>
        </Grid>
        <TextField
          value={buildData.gp_entity_name}
          name="gp_entity_name"
          onChange={(e) => {
            handleChange(e);
            setUnfilledFields((prev) => prev.filter((field) => field !== 'gp_entity_name'));
          }}
          className={classes.inputBox}
          variant="outlined"
          placeholder=""
          inputProps={customInputStyles}
          classes={{
            root: unfilledFields.includes('gp_entity_name') && classes.unfilledField,
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
  const params = useParams();
  return (
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Closing Date</Typography>
          <ModalTooltip
            title="Closing Date"
            handleTooltip={handleTooltip}
            tooltipContent={
              params.type === 'fund' ? (
                <Typography color="inherit">
                  Date on when the Fund needs to make the first investment. Please note that
                  Allocations requires at least 24 notice for processing a wire
                </Typography>
              ) : (
                <Typography color="inherit">
                  Date on when the SPV needs to make the money transfer
                </Typography>
              )
            }
            openTooltip={openTooltip}
            id="closing_date"
          >
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('closing_date')} />
          </ModalTooltip>
        </Grid>
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
  const params = useParams();

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
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('sectors') ? '2px solid red' : '1pm solid hsl(0, 0%, 80%)',
      }),
    };

    return (
      <>
        <Select
          options={suggestions}
          menuPosition="absolute"
          menuPlacement="top"
          captureMenuScroll
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <Grid className={classes.inputLabelWithTooltip} item xs={12}>
        <Typography className={classes.formItemName}>Sector(s)</Typography>
        <ModalTooltip
          title="Sector(s)"
          handleTooltip={handleTooltip}
          tooltipContent={
            params.type === 'fund' ? (
              <Typography color="inherit">
                Indicate the sectors where the investments will be operating in
              </Typography>
            ) : (
              <Typography color="inherit">
                Indicate the sector where the Portfolio Company is operating in
              </Typography>
            )
          }
          openTooltip={openTooltip}
          id="sectors"
        >
          <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('sectors')} />
        </ModalTooltip>
      </Grid>
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
    <Grid className={classes.basicInformationInputItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Manager Full Title</Typography>
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
              onClick={() => handleTooltip('representative')}
            />
          </ModalTooltip>
        </Grid>
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
  return (
    <Grid className={classes.basicInformationInputItem} item xs={6} style={{ height: '100%' }}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Deal Stage</Typography>
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
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('deal_stage')} />
          </ModalTooltip>
        </Grid>

        <DealStagesSelector
          buildData={buildData}
          handleChange={handleChange}
          setUnfilledFields={setUnfilledFields}
          unfilledFields={unfilledFields}
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
  width,
}) {
  const params = useParams();
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Choose your management fee</Typography>
          <ModalTooltip
            title="Management Fee"
            handleTooltip={handleTooltip}
            tooltipContent={
              params.type === 'fund' ? (
                <Typography color="inherit">
                  A fee which will be charged by the General Partner for covering its expenses
                  preparing the deal
                </Typography>
              ) : (
                <Typography color="inherit">
                  A fee which will be charged by the Manager for covering Manager's expenses
                  preparing the deal
                </Typography>
              )
            }
            openTooltip={openTooltip}
            id="management_fee_value"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={() => handleTooltip('management_fee_value')}
            />
          </ModalTooltip>
        </Grid>
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
          <Grid className={classes.inputLabelWithTooltip} item xs={12}>
            <Typography className={classes.formItemName}>
              Enter your custom management fee
            </Typography>
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
                onClick={() => handleTooltip('custom_management_fee')}
              />
            </ModalTooltip>
          </Grid>
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
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Choose your fee frequency</Typography>
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
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('fee_frequency')} />
          </ModalTooltip>
        </Grid>
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
  const params = useParams();
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>Choose your carry fee</Typography>
          <ModalTooltip
            title="Carry Fee"
            handleTooltip={handleTooltip}
            tooltipContent={
              params.type === 'fund' ? (
                <Typography color="inherit">
                  A fee which the General Partner will be entitled to in case the Fund's investment
                  is successful/profitable; note that generally carry fee is charged only from the
                  profit
                </Typography>
              ) : (
                <Typography color="inherit">
                  A fee which the Manager will be entitled to in case the SPV's investment is
                  successful/profitable; note that carry fee is charged only from the profit
                </Typography>
              )
            }
            openTooltip={openTooltip}
            id="carry_fee_value"
          >
            <HelpIcon
              className={classes.helpIcon}
              onClick={() => handleTooltip('carry_fee_value')}
            />
          </ModalTooltip>
        </Grid>
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
          <Grid className={classes.inputLabelWithTooltip} item xs={12}>
            <Typography className={classes.formItemName}>Enter your custom carry fee</Typography>
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
                onClick={() => handleTooltip('custom_carry_fee')}
              />
            </ModalTooltip>
          </Grid>
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
  classes,
  openTooltip,
  width,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={classes.formItemName}>
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
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                fontSize="medium"
                onClick={() => handleTooltip('same_investor_fee')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
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
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>What is the minimum investment?</Typography>
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
              onClick={() => handleTooltip('minimum_investment')}
            />
          </ModalTooltip>
        </Grid>
        <TextField
          type="number"
          value={buildData.minimum_investment}
          name="minimum_investment"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
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

export function AcceptedInvestorTypes({
  buildData,
  handleChange,
  handleTooltip,
  setUnfilledFields,
  unfilledFields,
  classes,
  openTooltip,
  width,
}) {
  const params = useParams();
  function InvestorTypeSelector() {
    const investorTypes = ['Accredited Investors (3(c)(1))', 'Qualified Purchasers (3(c)(7))'];
    const customStyles = {
      control: (styles) => ({
        ...styles,
        height: 60,
        maxWidth: 568,
        cursor: 'pointer',
        border: unfilledFields.includes('type_of_investors')
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
        id="type_of_investors"
        menuPosition="fixed"
        label="What type of Investors are you accepting?"
        styles={customStyles}
        options={investorTypes.map((type) => ({ value: type, label: type, key: type })) || ''}
        defaultValue={buildData.type_of_investors}
        placeholder={buildData.type_of_investors}
        onChange={(option) => {
          const newEvent = {
            target: {
              name: 'type_of_investors',
              value: option.value,
            },
          };
          handleChange(newEvent);
          setUnfilledFields((prev) => prev.filter((field) => field !== 'type_of_investors'));
        }}
      />
    );
  }
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required disabled variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={classes.formItemName}>
            What type of investors are you accepting?
            <ModalTooltip
              title="Deal Stage"
              handleTooltip={handleTooltip}
              tooltipContent={
                params.type === 'fund' ? (
                  <Typography color="inherit">
                    As per Investment Company Act there are some restrictions and thresholds for
                    Fund accepting "accredited investors" or "qualified purchasers"; please consult
                    your legal counsel for more insight on this
                  </Typography>
                ) : (
                  <Typography color="inherit">
                    As per Investment Company Act there are some restrictions and thresholds for
                    SPVs accepting "accredited investors" or "qualified purchasers"; please consult
                    your legal counsel for more insight on this
                  </Typography>
                )
              }
              openTooltip={openTooltip}
              id="type_of_investors"
            >
              <HelpIcon
                className={classes.helpIcon}
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('type_of_investors')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>

        <InvestorTypeSelector />
      </FormControl>
    </Grid>
  );
}

export function ReportingAdviser({
  buildData,
  handleChange,
  handleTooltip,
  customInputStyles,
  classes,
  openTooltip,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>
            Choose Allocations as the adviser?
          </Typography>
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
              onClick={() => handleTooltip('reporting_advisor')}
            />
          </ModalTooltip>
        </Grid>
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
        <Grid className={classes.inputGridItem} item xs={12}>
          <FormControl
            required
            disabled
            variant="outlined"
            className={classes.formContainers}
            style={{ marginTop: '40px' }}
          >
            <Grid className={classes.inputLabelWithTooltip} item xs={12}>
              <Typography className={classes.formItemName}>
                Please enter your adviser name
              </Typography>
              <ModalTooltip
                title="Adviser Name"
                handleTooltip={handleTooltip}
                tooltipContent={
                  <Typography color="inherit">Please indicate your ERA/RIA name</Typography>
                }
                openTooltip={openTooltip}
                id="reporting_adviser"
              >
                <HelpIcon
                  className={classes.helpIcon}
                  onClick={() => handleTooltip('reporting_adviser')}
                />
              </ModalTooltip>
            </Grid>
            <TextField
              value={buildData.reporting_adviser}
              placeholder="Adviser Name"
              name="reporting_adviser"
              onChange={handleChange}
              className={classes.inputBox}
              variant="outlined"
              inputProps={customInputStyles}
              classes={{ root: classes.selectInputBox }}
            />
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}

export function OfferingType({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Typography className={classes.formItemName}>What is your offering type?</Typography>
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
            <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('offering_type')} />
          </ModalTooltip>
        </Grid>
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

export function AcceptCrypto({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.cryptoFormContainer}>
        <Grid container className={classes.cryptoFieldset}>
          <Grid item className={classes.cryptoLabel}>
            Will you allow investments with crypto?
            <ModalTooltip
              title="Crypto"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">
                  Would you like to allow investments into this deal with Crypto along with
                  currency?
                </Typography>
              }
              openTooltip={openTooltip}
              id="accept_crypto"
            >
              <HelpIcon
                className={classes.helpIcon}
                onClick={() => handleTooltip('accept_crypto')}
              />
            </ModalTooltip>
          </Grid>
          <div className={classes.cryptoSelector}>
            <ButtonSelector
              name="accept_crypto"
              onChange={handleChange}
              currentValue={buildData.accept_crypto}
              values={[
                { label: 'Yes', value: 'true' },
                { label: 'No', value: 'false' },
              ]}
            />
          </div>
        </Grid>
      </FormControl>
    </Grid>
  );
}

export function CustomInvestmentAgreement({
  buildData,
  handleChange,
  handleTooltip,
  classes,
  openTooltip,
  width,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={classes.formItemName}>
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
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('fund_template_docs')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
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
  width,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={`${classes.formItemName} ${classes.customFormItemName}`}>
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
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('international_company_status')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
        <ButtonSelector
          name="international_company_status"
          onChange={handleChange}
          currentValue={buildData.international_company_status}
          values={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </FormControl>
      {buildData.international_company_status === 'true' && (
        <Grid className={classes.inputGridItem} item xs={12}>
          <FormControl required variant="outlined" className={classes.formContainers}>
            <InternationalCountrySelector
              handleChange={handleChange}
              setUnfilledFields={setUnfilledFields}
              unfilledFields={unfilledFields}
              buildData={buildData}
            />
          </FormControl>
        </Grid>
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
  classes,
  openTooltip,
  width,
}) {
  return (
    <Grid className={classes.inputGridItem} item xs={6}>
      <FormControl required variant="outlined" className={classes.formContainers}>
        <Grid className={classes.inputLabelWithTooltip} item xs={12}>
          <Grid item className={`${classes.formItemName} ${classes.customFormItemName}`}>
            Will you have any international (Non US) investors?
            <ModalTooltip
              title="International Investors"
              handleTooltip={handleTooltip}
              tooltipContent={
                <Typography color="inherit">
                  If this SPV/Fund will have investors located outside the United States, please
                  select Yes to this question followed by the applicable country. If you are unsure
                  at the moment, please select Unknown.
                </Typography>
              }
              openTooltip={openTooltip}
              id="international_investors_status"
            >
              <HelpIcon
                className={classes.helpIcon}
                style={{ margin: width >= 650 ? '.2em' : '0px 5px' }}
                onClick={() => handleTooltip('international_investors_status')}
              />
            </ModalTooltip>
          </Grid>
        </Grid>
        <ButtonSelector
          name="international_investors_status"
          onChange={handleChange}
          currentValue={buildData.international_investors_status}
          values={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </FormControl>
      {buildData.international_investors_status === 'true' && (
        <Grid className={classes.inputGridItem} item xs={12}>
          <FormControl required variant="outlined" className={classes.formContainers}>
            <InternationalInvestorsCountriesSelector
              buildData={buildData}
              unfilledFields={unfilledFields}
              setUnfilledFields={setUnfilledFields}
              countries={countries}
              handleChange={handleChange}
            />
          </FormControl>
        </Grid>
      )}
    </Grid>
  );
}
export function NotesMemo({ buildData, handleChange, handleTooltip, classes, openTooltip }) {
  return (
    <>
      <Grid className={classes.inputLabelWithTooltip} item xs={12}>
        <Typography className={classes.formItemName}>Any notes we should know about?</Typography>
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
          <HelpIcon className={classes.helpIcon} onClick={() => handleTooltip('extra_notes')} />
        </ModalTooltip>
      </Grid>

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

export function PitchDeckCheckBox({ buildData, setBuildData, classes }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
      <Checkbox
        color="default"
        size="medium"
        name="public_pitch_deck"
        checked={buildData.public_pitch_deck}
        classes={{
          root: classes.pitchDeckCheckbox,
          checked: classes.pitchDeckColorSecondary,
        }}
        onChange={() => {
          setBuildData((prev) => {
            const newBuildData = {
              ...prev,
              public_pitch_deck: !prev.public_pitch_deck,
            };
            localStorage.setItem('buildData', JSON.stringify(newBuildData));
            return newBuildData;
          });
        }}
      />
      <Typography style={{ fontWeight: 'bold' }}>
        Allow the Pitch Deck to be shown publicly on the Deal Page?
      </Typography>
    </div>
  );
}
