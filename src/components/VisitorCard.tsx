import { PinIcon, ShieldIcon } from './Icons';
import { VisitorInfo } from '../utils/types';

const VisitorCard = ({ info }: { info?: VisitorInfo }) => (
  <div className="glass-panel p-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold">Your connection</h3>
      <div className="text-emerald-400">
        <ShieldIcon />
      </div>
    </div>
    {!info && <p className="text-sm text-slate-400">Detecting…</p>}
    {info && (
      <div className="space-y-1 text-sm">
        <p className="font-mono text-base">IP: {info.ip}</p>
        <p className="flex items-center gap-2 text-slate-300 light:text-slate-600">
          <PinIcon />
          <span>
            {[info.city, info.region, info.country].filter(Boolean).join(', ') || 'Unknown location'}
          </span>
        </p>
        <p className="text-slate-300 light:text-slate-600">ISP/ASN: {info.isp || 'Unknown'} {info.asn ? `(${info.asn})` : ''}</p>
        <p className="text-sm font-semibold">
          VPN/Proxy: {info.vpnLikely ? 'Likely' : 'Unlikely'}
          {info.vpnReason && <span className="text-slate-400"> — {info.vpnReason}</span>}
        </p>
      </div>
    )}
  </div>
);

export default VisitorCard;
