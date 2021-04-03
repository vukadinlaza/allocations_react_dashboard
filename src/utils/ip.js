import publicIp from 'public-ip';

export const getClientIp = async () =>
  publicIp.v4({
    fallbackUrls: ['https://ifconfig.co/ip'],
  });
