import { makeStyles } from '@material-ui/core/styles';

export const DesktopExtraLarge = '1920';
export const DesktopLarge = '1440';
export const DesktopSmall = '1366';

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: '0 auto',
    marginRight: '15px',
  },

  dealHeaderPaper: {
    width: '1589px',
    backgroundColor: 'white',
    marginBottom: '16px',
  },

  dealHeader: {
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    boxShadow: '0px 3px 6px #00000029',
    border: '1px solid #7070703B',
    marginBottom: '16px',
    borderRadius: '5px',
    padding: '42px',
    width: '100%',
    maxWidth: '1259px',
    marginRight: '112px',
    marginLeft: '123px',
    opacity: 1,
    [theme.breakpoints.down(DesktopLarge)]: {
      maxWidth: '944px',
      marginRight: '120px',
      marginLeft: '128px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
    [theme.breakpoints.down(DesktopSmall)]: {
      maxWidth: '1366px',
      marginBottom: '24px',
      padding: '16px',
      paddingBottom: '30px',
    },
  },

  boxContent: {
    backgroundColor: '',
    fontSize: '12px',
    width: '128px',
    marginLeft: '-2px',
    marginTop: '10px',
  },

  box: {
    display: 'flex',
    // justifyContent: 'space-between',
    margin: '0 auto',
    width: '90%',
    paddingBottom: '30px',
  },
  boxInvestingDetails: {
    width: '90%',
    backgroundColor: '',
    margin: '0 auto',
  },

  cardMedia: {
    width: '491px',
    height: '321px',
    // '@media only screen and (min-width: 768px) and (max-width: 2300px)': {
    //   backgroundSize: 'contain',
    //   backgroundPosition: 'center',
    //   backgroundRepeat: 'no-repeat',
    //   display: 'block',
    //   maxWidth: '80%',
    //   maxHeight: '90%',
    //   width: 'auto',
    //   height: 'auto',
    // },
    // '@media (minDeviceWidth: 768px) and (maxDeviceWidth: 1023px)': {
    //   width: '50%',
    //   height: '50%',
    // },
  },

  BorderLinearProgress: {
    height: '12px',
    backgroundColor: '#E7E7E8',
  },

  usdButton: {
    marginLeft: '10px',
    backgroundColor: '#12824C',
    color: '#FFFFFF',
  },

  middleGridContainer: {
    // backgroundColor: '#8FBC8F',
    width: '90%',
    margin: '0 auto',
  },

  investmentNumber: {
    color: '#0561ff',
    fontSize: '30px',
    marginTop: '5%',
  },

  minorText: {
    float: 'right',
    backgroundColor: '',
    width: '100%',
  },

  investButton: {
    backgroundColor: '#EBEEF0',
    width: '100%',
    height: '50px',
    color: '#64748A',
    borderRadius: '6px',
    marginTop: '7%',
  },

  floatRight: {
    float: 'right',
  },

  floatLeft: {
    float: 'left',
  },

  modalContainer: {
    backgroundColor: '',
    display: 'flex',
    padding: '10px',
    justifyContent: 'center',
  },

  coinvestorTagBubble: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '8px 12px',
    position: 'static',
    background: '#ECF3FF',
    borderRadius: '16px',
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
