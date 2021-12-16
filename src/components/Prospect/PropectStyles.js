import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    padding: '2rem',
    [theme.breakpoints.down('sm')]: {
      padding: '.5rem',
    },
  },
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    position: 'absolute',
    left: '0',
    top: '0',
    background: 'white',
  },
  mainTitle: {
    fontWeight: '500',
    padding: '20px 0px',
  },
  mainTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 40px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      fontSize: '.5rem',
    },
  },
  paper: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '15px',
    padding: '42px',
    width: '100%',
    maxWidth: '1352px',
    opacity: 1,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },
  selectedTab: {
    fontWeight: 'bold !important',
    '& $tabWrapper': {
      backgroundColor: 'rgb(32 93 245 / 16%)',
      borderRadius: '10px',
    },
  },
  tab: {
    textTransform: 'none',
    minWidth: 0,
    fontWeight: '400',
    '&:focus': {
      outline: 'none',
    },
  },
  tabs: {
    width: '100%',
    border: 'none',
    height: '50px',
    padding: '0 28px',
    '& *': {
      height: '100%',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '0 12px',
    },
  },
  tabsContainer: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
      overflow: 'auto',
      display: 'block',
    },
  },
  tabsIndicator: {
    display: 'none',
  },
  tabWrapper: {
    padding: '0 20px',
  },
}));

export default useStyles;
