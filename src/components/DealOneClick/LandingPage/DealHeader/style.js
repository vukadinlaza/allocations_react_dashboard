import { makeStyles } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const useStyles = makeStyles({
  dealHeader: {
    width: '100%',
    padding: '58px',
  },

  imageWrapper: {
    justifySelf: 'flex-end',
    width: '50%',
    height: '50%',
    margin: '0',
    padding: '0',
    overflow: 'hidden',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
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

  box: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  gridContainer: {
    padding: '20px',
  },

  cardMedia: {
    height: '100%',
    width: '140',
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
