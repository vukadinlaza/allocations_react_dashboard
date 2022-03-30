import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  deadlineSettings: {
    width: '90%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
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
  h2Style: {
    marginBottom: '1rem',
  },

  textInput: {
    margin: '5px 0',
    height: '3.5rem',
  },
}));

export default useStyles;
