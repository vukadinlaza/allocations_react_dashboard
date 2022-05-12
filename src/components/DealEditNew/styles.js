import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dealEditNew: {
    position: 'relative',
  },
  h1h2: {
    fontSize: '1.6rem',
    margin: '10px 0',
  },
  viewDealPageButton: {
    position: 'absolute',
    top: '0%',
    right: '0%',
    background: theme.colors.primary[500],
    color: 'white',
    textTransform: 'none',
    transition: 'all 0.2s ease-in',

    '&:hover': {
      transition: 'all 0.2s ease-out',
      background: theme.colors.primary[700],
    },
  },
  sectionHeader: {
    width: '80%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  tabsContainer: {
    margin: '1.75rem 0',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  tabButton: {
    whiteSpace: 'nowrap',
    outline: 'none',
    border: 'none',
    marginRight: '1.5rem',
    padding: '5px',
    color: theme.colors.primary[500],
    background: 'transparent',
    borderRadius: '0%',
    fontWeight: '700',
    textTransform: 'none',
    fontSize: '1.25rem',
    letterSpacing: '0px',
    transition: 'all 0.25s ease-out',
    borderBottom: '3px solid transparent',
    '&:focus': {
      outline: 'none',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: '1rem',
      textAlign: 'left',
    },
  },

  active: {
    borderBottom: `3px solid ${theme.colors.primary[500]}`,
    transition: 'all 0.25s ease-in',
    [theme.breakpoints.down('md')]: {
      backgroundColor: theme.colors.gray[100],
      transition: 'all 0.25s ease-in',
    },
  },
  saveChanges: {
    marginTop: '0.25rem',
    marginBottom: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },

  continue: {
    textTransform: 'none',
    backgroundColor: theme.colors.black[50],
    color: 'white',
    width: '12rem',
    height: '3rem',
    marginRight: '0.5rem',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      margin: '0',
    },
  },

  saveAndExit: {
    textTransform: 'none',
    backgroundColor: theme.colors.primary[500],
    color: 'white',
    width: '12rem',
    height: '3rem',
    margin: '1rem 0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  deleteDeal: {
    textTransform: 'none',
    backgroundColor: theme.colors.error[500],
    color: 'white',
    width: '12rem',
    height: '3rem',
    margin: '1rem 0',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },

  lastPage: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
}));

export default useStyles;
