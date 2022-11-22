import { publicIpv4 } from 'public-ip';

export const getClientIp = async () => {
  try {
    const res = await publicIpv4({
      fallbackUrls: ['https://ifconfig.co/ip'],
    });
    return res;
  } catch {
    return 'Failed to get users IP';
  }
};
