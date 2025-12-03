import { COMMON_DATACENTERS } from '../data/constants';
import { VisitorInfo } from '../utils/types';

const ipifyUrl = 'https://api.ipify.org?format=json';

export const getVisitorInfo = async (): Promise<VisitorInfo> => {
  const ipResponse = await fetch(ipifyUrl);
  const { ip } = await ipResponse.json();

  let geo: any = {};
  try {
    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
    geo = await geoResponse.json();
  } catch (error) {
    console.warn('Geo lookup failed', error);
  }

  const isp = geo.org || geo.org_name || geo.isp;
  const asn = geo.asn || geo.asn_name || geo.asn_org;

  let vpnLikely = false;
  let vpnReason: string | undefined;

  if (geo?.privacy?.vpn || geo?.privacy?.proxy) {
    vpnLikely = true;
    vpnReason = 'Provider flagged connection as VPN/Proxy';
  } else if (isp) {
    const lower = isp.toLowerCase();
    if (COMMON_DATACENTERS.some((dc) => lower.includes(dc))) {
      vpnLikely = true;
      vpnReason = 'ISP/ASN belongs to a known datacenter';
    }
  }

  return {
    ip,
    country: geo.country_name || geo.country,
    city: geo.city,
    region: geo.region,
    isp,
    asn,
    vpnLikely,
    vpnReason,
  };
};
