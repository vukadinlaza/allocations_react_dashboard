import React from 'react';
import { FormControl, Grid, Typography, TextField } from '@material-ui/core';
import { ModalTooltip } from '../../dashboard/FundManagerDashboard/widgets';
import HelpIcon from '@material-ui/icons/Help';

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
