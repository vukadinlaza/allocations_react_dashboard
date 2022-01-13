import { makeStyles } from '@material-ui/core/styles';
import { phone, tablet } from '../../../utils/helpers';

const useStyles = makeStyles((theme) => ({
  dealHeader: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    borderRadius: '5px',
    padding: '30px',
    width: '100%',
    marginTop: '16px',
    opacity: 1,
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      margin: '0 auto',
      marginTop: '16px',
      maxWidth: '100%',
      padding: '0px',
    },
    [theme.breakpoints.down(tablet)]: {
      width: '90%',
      margin: '0 auto',
      marginTop: '16px',
      maxWidth: '100%',
      padding: '0px',
    },
  },

  box: {
    display: 'flex',
    color: '#2A2B54',
    alignItems: 'center',
    margin: '0 auto',
    width: '90%',
    paddingBottom: '15px',
    marginTop: '10px',
    [theme.breakpoints.down(phone)]: {
      width: '98%',
      fontSize: '14px',
    },
    [theme.breakpoints.down(tablet)]: {},
  },

  avatar: {
    margin: '0 auto',
    marginRight: '15px',
  },

  companyName: {
    marginTop: '5px',
    fontFamily: 'Roboto',
    fontSize: '24px',
    color: '#2A2B54',
    [theme.breakpoints.down(phone)]: {
      fontSize: '20px',
    },
  },

  middleGridContainer: {
    width: '90%',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '0px',
      width: '97%',
    },
    [theme.breakpoints.down(tablet)]: {
      marginBottom: '0px',
      width: '97%',
    },
    [theme.breakpoints.down(tablet)]: {},
  },

  cardMedia: {
    width: '368px',
    height: '241px',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      backgroundSize: 'contain',
      backgroundPosition: 'initial',
      backgroundRepeat: 'no-repeat',
      padding: '5px',
    },
    [theme.breakpoints.down(tablet)]: {
      backgroundSize: 'contain',
      backgroundPosition: 'initial',
      backgroundRepeat: 'no-repeat',
      padding: '5px',
    },
  },

  middleGridItem: {
    width: '50%',
    [theme.breakpoints.down(phone)]: {
      width: '100%',
      marginTop: '10px',
    },
    [theme.breakpoints.down(tablet)]: {
      width: '100%',
      marginTop: '10px',
    },
  },

  investmentProgress: {
    fontSize: '25px',
    color: '#2A2B54',
    [theme.breakpoints.down(phone)]: {
      fontSize: '16px',
    },
  },

  investmentNumber: {
    color: '#0561ff',
    fontSize: '25px',
    marginTop: '5%',
    [theme.breakpoints.down(phone)]: {
      fontSize: '20px',
    },
  },

  BorderLinearProgress: {
    height: '12px',
    backgroundColor: '#E7E7E8',
    borderRadius: '5px',
  },

  minorText: {
    float: 'right',
    width: '100%',
    color: '#2A2B54',
  },

  floatRight: {
    float: 'right',
    color: '#2A2B54',
    fontSize: '14px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '12px',
    },
  },

  totalRaiseAmount: {
    fontWeight: 'bold',
    fontSize: '12px',
  },

  investButton: {
    backgroundColor: '#CBD5E1',
    width: '100%',
    height: '50px',
    color: '#64748A',
    borderRadius: '6px',
    marginTop: '7%',
    [theme.breakpoints.down(phone)]: {
      fontSize: '14px',
      height: '40px',
    },
  },

  gridContainer: {
    marginTop: '15px',
    justifyContent: 'space-between',
    [theme.breakpoints.down(phone)]: {
      marginTop: '10px',
    },
  },

  investItem: {
    color: '#64748B',
    fontSize: '14px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '12px',
    },
  },

  minimumInvestItem: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px',
  },

  minimumInvestText: {
    color: '#64748B',
    fontSize: '14px',
    [theme.breakpoints.down(phone)]: {
      fontSize: '12px',
    },
  },

  minimumInvestNumber: {
    fontWeight: 'bold',
    fontSize: '12px',
    color: '#2A2B54',
  },

  LandingPage: {
    display: 'flex',
    flexDirection: 'column',
    height: 'max-content',
    width: '1000px',
    [theme.breakpoints.down(phone)]: {
      minWidth: '0 !important',
      maxWidth: 'none !important',
      width: '100%',
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

  boxContent: {
    fontSize: '12px',
    fontWeight: 'bold',
    width: '180px',
    marginLeft: '-2px',
    marginTop: '10px',
    [theme.breakpoints.down(phone)]: {
      width: '120px',
      paddingTop: '0px',
      marginLeft: '0px',
      marginTop: '4px',
    },
  },

  boxInvestingDetails: {
    width: '90%',
    margin: '0 auto',
  },

  usdButton: {
    marginLeft: '10px',
    backgroundColor: '#12824C',
    color: '#FFFFFF',
  },

  floatLeft: {
    float: 'left',
    color: '#2A2B54',
  },

  modalContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    [theme.breakpoints.down(phone)]: {
      marginBottom: '20px',
    },
  },

  typography: {
    fontSize: '14px',
    fontWeight: 'bold',
    [theme.breakpoints.down(phone)]: {
      fontSize: '12px',
    },
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
    [theme.breakpoints.down(phone)]: {
      padding: '4px 6px',
      margin: '4px 6px 4px 0px',
    },
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
  },
}));

export default useStyles;