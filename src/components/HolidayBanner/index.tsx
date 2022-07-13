import { customTheme } from '@allocations/design-system';
import { Box, makeStyles } from '@material-ui/core';
import { useFlags } from 'launchdarkly-react-client-sdk';
import React from 'react';
import ReactDOM from 'react-dom';

const useStyles = makeStyles({
  banner: {
    backgroundColor: '#0144e4',
    width: '100%',
    padding: '.5rem',
    color: 'white',
    textAlign: 'center',
    marginBottom: '.25rem',
  },
  link: {
    textDecoration: 'underline',
    color: customTheme.colors.white['100'],
    fontFamily: 'Roboto, sans-serif',
  },
});

export default function HolidayBanner() {
  const styles = useStyles();
  const { holidayBannerContent } = useFlags();

  return ReactDOM.createPortal(
    <div style={{ maxHeight: '30%' }}>
      <Box className={styles.banner}>
        {holidayBannerContent}
        Banks in the United States will be closed. Please contact{' '}
        <a href="https://www.allocations.com/contact-us" className={styles.link}>
          support
        </a>{' '}
        for any assistance.
      </Box>
    </div>,
    document.querySelector('#holiday-banner')!,
  );
}
