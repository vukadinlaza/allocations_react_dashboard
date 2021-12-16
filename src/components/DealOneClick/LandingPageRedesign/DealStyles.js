import { makeStyles } from '@material-ui/core/styles';

export const DesktopExtraLarge = '1920';
export const DesktopLarge = '1440';
export const DesktopSmall = '1366';

const useStyles = makeStyles((theme) => ({
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },

  avatar: {
    margin: '0 auto',
    marginRight: '15px',
  },

  LandingPage: {
    display: 'flex',
    flexDirection: 'column',
    height: 'max-content',
    width: '1000px',

    [theme.breakpoints.up('xs')]: {
      '@media (max-device-width:780px)': {
        width: '100%',
        backgroundColor: '',
      },
    },
  },

  flexContainer: {
    width: '100%',
    height: 'max-content',
    marginBottom: '20px',
  },

  placeholder: {
    marginBottom: '150px',
  },

  paper: {
    [theme.breakpoints.up('sm')]: {
      width: '900px',
      backgroundColor: 'white',
      marginBottom: '16px',
    },
    [theme.breakpoints.up('md')]: {
      width: '1209px',
      backgroundColor: 'white',
      marginBottom: '16px',
    },
    [theme.breakpoints.up('lg')]: {
      width: '1409px',
      backgroundColor: 'white',
      marginBottom: '16px',
    },
    [theme.breakpoints.up('xl')]: {
      width: '1589px',
      backgroundColor: 'white',
      marginBottom: '16px',
    },
  },

  dealHeader: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: '5px',
    padding: '30px',
    width: '100%',
    marginTop: '16px',
    opacity: 1,

    [theme.breakpoints.up('xs')]: {
      '@media (max-device-width:780px)': {
        width: '100%',
        backgroundColor: '',
        margin: '0 auto',
        marginTop: '16px',
        maxWidth: '100%',
      },
    },
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  companyName: {
    marginTop: '5px',
    fontFamily: 'Roboto',
  },

  boxContent: {
    backgroundColor: '',
    fontSize: '12px',
    fontWeight: 'bold',
    width: '128px',
    marginLeft: '-2px',
    marginTop: '10px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  modalParent: {
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {
      display: 'flex',
      position: 'absolute',
    },
  },

  box: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    width: '90%',
    paddingBottom: '30px',
    marginTop: '20px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },
  boxInvestingDetails: {
    width: '90%',
    backgroundColor: '',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  cardMedia: {
    width: '368px',
    height: '241px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  BorderLinearProgress: {
    height: '12px',
    backgroundColor: '#E7E7E8',
    borderRadius: '5px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  usdButton: {
    marginLeft: '10px',
    backgroundColor: '#12824C',
    color: '#FFFFFF',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  middleGridContainer: {
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  investmentProgress: {
    fontSize: '25px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  investmentNumber: {
    color: '#0561ff',
    fontSize: '25px',
    marginTop: '5%',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  minorText: {
    float: 'right',
    backgroundColor: '',
    width: '100%',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  investButton: {
    backgroundColor: '#EBEEF0',
    width: '100%',
    height: '50px',
    color: '#64748A',
    borderRadius: '6px',
    marginTop: '7%',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  floatRight: {
    float: 'right',
  },

  floatLeft: {
    float: 'left',
  },

  modalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    backgroundColor: '',

    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  coinvestorTagBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '8px 12px',
    margin: '4px 6px 4px 0px',
    position: 'static',
    background: '#ECF3FF',
    borderRadius: '16px',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },

  coinvestorTagText: {
    position: 'static',
    left: '0px',
    top: '0px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '12px',
    color: '#0558E7',
    margin: '0 auto',
    [theme.breakpoints.up('sm')]: {},
    [theme.breakpoints.up('md')]: {},
    [theme.breakpoints.up('lg')]: {},
    [theme.breakpoints.up('xl')]: {},
  },
}));

export default useStyles;
