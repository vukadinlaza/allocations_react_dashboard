import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  addDoc: {
    display: 'inline-block',
    height: '90px',
    width: '60px',
    margin: '0px 20px',
    borderRadius: '5px',
    verticalAlign: 'top',
    textAlign: 'center',
    backgroundColor: theme.colors.error[400],
    opacity: 0.7,
  },
  doc: {
    border: `1px dotted ${theme.colors.gray[300]}`,
    position: 'relative',
  },
  docs: {
    paddingTop: '15px',
    display: 'flex',
  },
  docWrapper: {
    display: 'inline-block',
    textAlign: 'center',
    marginRight: '10px',
  },
  faFilePdf: {
    color: theme.colors.error[400],
    fontSize: '2em',
    position: 'absolute',
    right: '16px',
    top: '29px',
  },
  faPlus: {
    display: 'inline-block',
    marginTop: '35px',
    cursor: 'pointer',
  },
  faTimesCircle: {
    position: 'absolute',
    right: '-5px',
    top: '-5px',
    cursor: 'pointer',
  },
  faTitleUpload: {
    display: 'inline-block',
    marginTop: '35px',
    cursor: 'pointer',
  },
  filename: {
    textAlign: 'center',
    fontSize: '0.8em',
  },
  investmentEdit: {
    '& input': {
      padding: '10px 14px',
    },
  },
  title: {
    fontSize: '17px',
    margin: '15px 0',
    '&:first-of-type': {
      marginTop: '0px',
    },
  },
}));

export default styles;
