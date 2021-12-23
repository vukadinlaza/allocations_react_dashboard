import { phone, tablet } from '../../../utils/helpers';

const styles: any = (theme: any) => ({
  backButton: {
    paddingLeft: '12.5%',
    paddingBottom: '24px',
    color: '#64748B',
    fontWeight: 500,
    cursor: 'pointer',
  },
  boxTitle: {
    fontWeight: 500,
    fontSize: '16px',
    color: '#64748B',
  },
  boxValue: {
    fontWeight: 700,
    fontSize: '20px',
    color: '#2A2B54',
  },
  largeBox: {
    height: '500px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
  },
  pageTitle: {
    fontSize: '40px',
    fontWeight: 'bold',
    marginBottom: '32px',
  },
  placeholderItem: {
    boxShadow: 'none !important',
    position: 'relative',
    background: 'rgb(229 229 229 / 50%)',
    overflow: 'hidden',
    '&::before': {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: '-150px',
      top: '0',
      height: '100%',
      width: '150px',
      background: 'linear-gradient(to right, transparent 0%, #f3f3f3 50%, transparent 100%)',
      animation: '$load 1s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
    },
  },
  smallBox: {
    height: '88px',
    width: '100%',
    borderRadius: '8px',
    boxShadow: 'none !important',
    padding: '16px 24px',
  },
  tabsContainer: {
    [theme.breakpoints.down(phone)]: {
      overflowX: 'scroll',
      display: 'block',
    },
  },
  '@keyframes load': {
    from: { left: '-150px' },
    to: { left: '100%' },
  },
});

export default styles;
