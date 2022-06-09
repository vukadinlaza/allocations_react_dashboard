import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  assocOption: {
    '&:hover': {
      backgroundColor: theme.colors.gray[100],
    },
  },
  noOutline: {
    outline: 'none',
  },
}));

export default styles;
