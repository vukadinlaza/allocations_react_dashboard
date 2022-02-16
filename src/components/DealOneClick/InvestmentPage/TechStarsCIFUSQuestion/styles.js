import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    marginTop: '15px',
    left: '20px',
    padding: '5px',
    width: '90%',
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '90%',
    left: '20px',
    padding: '5px',
    alignItems: 'flex-start',
  },
  label: {
    marginTop: '10px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  informationNotice: {
    marginTop: '15px',
    left: '20px',
    width: '90%',
    position: 'relative',
    fontSize: '12px',
    color: 'rgb(117, 117, 117)',
  },
  accreditationNotice: {
    marginTop: '15px',
    left: '20px',
    padding: '5px',
    width: '90%',
    position: 'relative',
  },
  radioButton: {
    hover: {
      backgroundColor: 'yellow',
    },
  },
});

export default useStyles;
