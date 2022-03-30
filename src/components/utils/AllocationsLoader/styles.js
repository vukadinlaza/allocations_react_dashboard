import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles({
  allocationsLoader: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    paddingBottom: '365px',
    transition: '1s',
    '& svg': {
      overflow: 'visible',
      transform: 'scale(0.6)',
    },
    '& $col1': {
      fill: '#009fe3',
      animation: '$wave 1.5s ease forwards 0s infinite',
    },
    '& $col2': {
      fill: '#009fe3',
      animation: '$wave 1.5s ease forwards 0.2s infinite',
    },
    '& $col3': {
      fill: '#009fe3',
      animation: '$wave 1.5s ease forwards 0.4s infinite',
    },
    '& $col4': {
      fill: '#86d0ee',
      animation: '$wave 1.5s ease forwards 0.6s infinite',
    },
    '& $col5': {
      fill: '#009fe3',
      animation: '$wave 1.5s ease forwards 0.8s infinite',
    },
    '& $col6': {
      fill: '#009fe3',
      animation: '$wave 1.5s ease forwards 1s infinite',
    },
  },
  col1: {},
  col2: {},
  col3: {},
  col4: {},
  col5: {},
  col6: {},
  '@keyframes wave': {
    '0%': { fill: '#009fe3' },
    '25%': { fill: '#009fe3', transform: 'translateY(0)' },
    '50%': { fill: '#87d1ef', transform: 'translateY(-5px)' },
    '75%': { fill: '#009fe3' },
    '100%': { fill: '#009fe3' },
  },
});

export default styles;
