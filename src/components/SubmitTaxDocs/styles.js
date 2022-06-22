import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
  buttonContainer: {
    display: 'flex',
    margin: '2rem 0',
    flexWrap: 'wrap',
    width: '175%',
  },
  buttonContent: {
    height: '7rem',
    width: '90%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
  },
  buttonText: {
    padding: '0',
    margin: '0',
  },
  formSelectButton: {
    borderRadius: '10px',
    height: '8rem',
    minWidth: '10rem',
    width: '47.5%',
    border: '2px solid #2a2b5480',
    textTransform: 'none',
    marginBottom: '1rem',
  },
  optionsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  },
  page: {
    opacity: 0.5,
  },
  sectionHeader: {
    width: '100%',
    height: '7.5rem',
    borderRadius: '15px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxShadow: '0px 3px 6px #00000040 !important',
    border: '1px solid rgb(226, 226, 226)',
  },
  selectForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    boxShadow: '0px 3px 6px #00000040 !important',
    padding: '2rem',
    margin: '2rem 0',
    borderRadius: '15px',
    border: '1px solid rgb(226, 226, 226)',
  },
  text: {
    display: 'flex',
    marginLeft: '2rem',
    '& p': {
      margin: '0 5px',
      fontSize: '22px',
      fontWeight: 500,
    },
  },
});

export default styles;
