import { makeStyles } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const useStyles = makeStyles({
  dealHeader: {
    width: '90%',
    padding: '58px',
    backgroundColor: 'lightblue',
    margin: '0 auto',
  },

  avatar: {
    margin: '0 auto',
  },

  box: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'pink',
    width: '90%',
    margin: '0 auto',
    paddingBottom: '20px',
  },

  // cardMedia: {
  // backgroundSize: 'contain',
  // backgroundPosition: 'center',
  // backgroundRepeat: 'no-repeat',
  // display: 'block',
  // maxWidth: '80%',
  // maxHeight: '90%',
  // width: 'auto',
  // height: 'auto',
  // },

  cardMedia: {
    width: '720px',
    height: '405px',
    '@media only screen and (min-width: 768px) and (max-width: 2300px)': {
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'block',
      maxWidth: '80%',
      maxHeight: '90%',
      width: 'auto',
      height: 'auto',
    },
    '@media (minDeviceWidth: 768px) and (maxDeviceWidth: 1023px)': {
      width: '50%',
      height: '50%',
    },
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
    backgroundColor: '#8FBC8F',
    width: '90%',
    margin: '0 auto',
  },

  investmentNumber: {
    color: '#0561ff',
  },

  minorText: {
    float: 'right',
    backgroundColor: '',
    width: '100%',
  },

  investButton: {
    float: 'right',
    backgroundColor: '#0561ff',
    width: '100%',
    color: 'white',
  },

  divInvestContainer: {
    float: 'right',
    backgroundColor: '',
    width: '100%',
    marginTop: '10px',
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
});
