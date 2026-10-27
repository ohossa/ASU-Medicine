import React, { useState, useEffect } from 'react';
import { CloudOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCloudSyncStatus } from '../hooks/useCloudSync';

interface Props {
  children?: React.ReactNode;
  className?: string;
  showText?: boolean;
}

export function UserSyncPill({ children, className = '', showText = false }: Props) {
  const { status, lastSyncedAt, error, syncNow } = useCloudSyncStatus();
  const [timeAgo, setTimeAgo] = useState<string>('Just now');
  const [isSyncingManual, setIsSyncingManual] = useState(false);

  useEffect(() => {
    if (!lastSyncedAt) return;
    const update = () => {
      const diffSec = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000);
      if (diffSec < 60) setTimeAgo('Just now');
      else if (diffSec < 3600) setTimeAgo(`${Math.floor(diffSec / 60)}m ago`);
      else setTimeAgo(`${Math.floor(diffSec / 3600)}h ago`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [lastSyncedAt]);

  const handleManualSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === 'syncing' || isSyncingManual) return;
    setIsSyncingManual(true);
    try {
      await syncNow();
    } finally {
      setIsSyncingManual(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'syncing':
        return {
          color: 'bg-amber-400 dark:bg-amber-400',
          ring: 'ring-amber-400/30',
          pulse: 'animate-pulse',
          title: 'Syncing with cloud…',
          icon: RefreshCw,
          iconClass: 'animate-spin text-amber-500',
        };
      case 'offline':
        return {
          color: 'bg-slate-400 dark:bg-slate-500',
          ring: 'ring-slate-400/20',
          pulse: '',
          title: 'Offline — saved locally on device',
          icon: CloudOff,
          iconClass: 'text-slate-400',
        };
      case 'error':
        return {
          color: 'bg-rose-500 dark:bg-rose-500',
          ring: 'ring-rose-500/30',
          pulse: '',
          title: error ? `Sync error: ${error}` : 'Sync error — click to retry',
          icon: AlertCircle,
          iconClass: 'text-rose-500',
        };
      case 'synced':
      default:
        return {
          color: 'bg-emerald-500 dark:bg-emerald-400',
          ring: 'ring-emerald-400/30',
          pulse: '',
          title: `Synced with cloud · ${timeAgo}`,
          icon: CheckCircle2,
          iconClass: 'text-emerald-500',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <div
      className={`group relative inline-flex items-center gap-1.5 rounded-full p-0.5 transition-all focus-within:ring-2 focus-within:ring-primary/40 ${className}`}
      title={badge.title}
    >
      <div className="relative flex items-center">
        {children}

        {/* Apple-style status indicator pip */}
        <button
          type="button"
          onClick={handleManualSync}
          disabled={status === 'syncing' || isSyncingManual}
          aria-label={badge.title}
          className={`absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-card ring-2 ring-background transition-transform active:scale-90 ${badge.ring}`}
          title={status === 'error' ? 'Click to retry sync' : `Cloud status: ${badge.title}`}
        >
          <span
            className={`block h-2 w-2 rounded-full transition-colors ${badge.color} ${badge.pulse}`}
          />
        </button>
      </div>

      {showText && (
        <button
          type="button"
          onClick={handleManualSync}
          className="hidden items-center gap-1.5 px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          <span className="font-medium text-foreground">
            {status === 'synced' ? 'Synced' : status === 'syncing' ? 'Syncing…' : status === 'offline' ? 'Offline' : 'Error'}
          </span>
          {lastSyncedAt && status === 'synced' && (
            <span className="text-[10px] text-muted-foreground/80">({timeAgo})</span>
          )}
        </button>
      )}
    </div>
  );
}
export default UserSyncPill;
