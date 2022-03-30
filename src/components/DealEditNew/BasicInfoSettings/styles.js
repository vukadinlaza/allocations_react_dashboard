import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  basicInfoSettings: {
    width: '100%',
  },
  buttonOptions: {
    margin: '5px 0',
    display: 'flex',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      justifyContent: 'space-between',
    },
  },
  currencyTextInput: {
    margin: '5px 0',
    '& .MuiTypography-root': {
      color: '#2b2b2b',
      fontWeight: '600',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      padding: '2.5px 10px',
      borderRadius: '2.5px',
    },
  },
  field: {
    width: '48.5%',
    marginBottom: '0.75rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  fieldLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.2rem',
    fontWeight: '500',
  },
  formFields: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: '1.5rem',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  keyHighlights: {
    marginTop: '30px',
    marginBottom: '10px',
    fontSize: '1.5rem',
  },
  fieldButton: {
    marginBottom: 'calc(0.75rem + 5px)',
  },

  optionButton: {
    marginRight: '10px',
    height: '3.5rem',
    width: '10rem',
    fontSize: '1rem',
    textTransform: 'none',
    outline: 'none',
    [theme.breakpoints.down('md')]: {
      marginRight: '0px',
      height: '3.5rem',
      width: '48.5%',
      fontSize: '1rem',
      textTransform: 'none',
    },
  },
  selected: {
    border: '2px solid #0461ff',
  },

  textInput: {
    margin: '5px 0',
    height: '3.5rem',
  },
}));

export default useStyles;
