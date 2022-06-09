import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  portfolioCompanySettings: {
    width: '90%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  h2Style: {
    marginBottom: '1rem',
  },
  formFields: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    fontWeight: '500',
  },

  field: {
    width: '48.5%',
    marginBottom: '1rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  wideField: {
    width: '100%',
    marginBottom: '1rem',
  },
  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem',
  },

  textInput: {
    margin: '5px 0',
    height: '3.5rem',
  },

  managementFee: {
    margin: '5px 0',
    display: 'flex',
    justifyContent: 'space-between',
  },

  feeInput: {
    width: '55%',
  },

  percentage: {
    width: '20%',
    outline: 'none',
  },
  fixed: {
    width: '20%',
    outline: 'none',
  },

  selected: {
    border: `2px solid ${theme.colors.primary[600]}`,
  },
  buttonOptions: {
    margin: '5px 0',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'space-between',
    },
  },

  optionButton: {
    marginRight: '10px',
    height: '3.5rem',
    width: '10rem',
    fontSize: '1rem',
    textTransform: 'none',
    [theme.breakpoints.down('md')]: {
      margin: '0px',
      width: '48.5%',
    },
  },
}));

export default useStyles;
