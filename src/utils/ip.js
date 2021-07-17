import publicIp from 'public-ip';

export const getClientIp = async () => {
  try {
    const res = await publicIp.v4({
      fallbackUrls: ['https://ifconfig.co/ip'],
    });
    return res;
  } catch {
    return 'Failed to get users IP';
  }
};
