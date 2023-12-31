import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  accreditedInvestorStatus: {
    marginTop: '15px',
    left: '20px',
    padding: '5px',
    width: '90%',
  },
  fileUploader: {
    '> span': {
      marginRight: '5px',
    },
  },
  paper: {
    '& div[class*="MuiMenu-paper"]': {
      maxWidth: '45%',
    },
  },
});

export default useStyles;
