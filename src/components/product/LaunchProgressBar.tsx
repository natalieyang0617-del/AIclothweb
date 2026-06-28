interface LaunchProgressBarProps {
  currentVotes: number;
  targetVotes: number;
  showHeading?: boolean;
  remainingClassName?: string;
}

function getLaunchProgress(currentVotes: number, targetVotes: number) {
  const progress = Math.min((currentVotes / targetVotes) * 100, 100);
  const isTriggered = currentVotes >= targetVotes;
  const remaining = Math.max(targetVotes - currentVotes, 0);

  return {
    progress,
    statusLabel: isTriggered
      ? "Launch confirmed — in production"
      : `${currentVotes} / ${targetVotes} Pcs to Launch`,
    remainingLabel:
      !isTriggered && remaining > 0 ? `${remaining} remaining` : null,
  };
}

export default function LaunchProgressBar({
  currentVotes,
  targetVotes,
  showHeading = false,
  remainingClassName = "text-[10px] text-neutral-400",
}: LaunchProgressBarProps) {
  const { progress, statusLabel, remainingLabel } = getLaunchProgress(
    currentVotes,
    targetVotes,
  );

  return (
    <div className="space-y-2">
      {showHeading && (
        <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
          Launch Progress
        </p>
      )}
      <div className="h-px w-full bg-neutral-200">
        <div
          className="h-px bg-neutral-900 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-500">
        {statusLabel}
      </p>
      {remainingLabel && (
        <p className={remainingClassName}>
          {remainingLabel}
          {showHeading ? " to trigger production" : ""}
        </p>
      )}
    </div>
  );
}
