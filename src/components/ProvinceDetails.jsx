import {
  X,
  Droplets,
  Factory,
  Wind,
  Sprout,
  Waves,
  Thermometer,
  Sun,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

const ARABIC_NAMES = {
  anbar: "الأنبار",
  erbil: "أربيل",
  basra: "البصرة",
  babylon: "بابل",
  baghdad: "بغداد",
  duhok: "دهوك",
  diyala: "ديالى",
  dhiQar: "ذي قار",
  karbala: "كربلاء",
  kirkuk: "كركوك",
  maysan: "ميسان",
  muthanna: "المثنى",
  najaf: "النجف",
  nineveh: "نينوى",
  qadisiyah: "القادسية",
  salahAlDin: "صلاح الدين",
  sulaymaniyah: "السليمانية",
  wasit: "واسط",
};

function getScoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#84cc16";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

function getScoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Critical";
}

function getLevelColor(level) {
  const value = String(level).toLowerCase();

  if (value.includes("شديد جدًا")) {
    return "text-red-400";
  }

  if (value.includes("شديد")) {
    return "text-red-400";
  }

  if (value.includes("مرتفع جدًا")) {
    return "text-orange-400";
  }

  if (value.includes("مرتفع")) {
    return "text-orange-300";
  }

  if (value.includes("متوسط")) {
    return "text-amber-300";
  }

  if (value.includes("منخفض جدًا")) {
    return "text-emerald-300";
  }

  if (value.includes("منخفض")) {
    return "text-emerald-400";
  }

  if (value.includes("عالية جدًا")) {
    return "text-cyan-300";
  }

  if (value.includes("عالية")) {
    return "text-cyan-400";
  }

  return "text-slate-300";
}

function IndicatorCard({
  icon: Icon,
  label,
  value,
  numeric = false,
  danger = false,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-white/[0.035]
        p-4
        transition-all
        duration-300
        hover:border-white/15
        hover:bg-white/[0.06]
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              ${
                danger
                  ? "bg-red-500/10 text-red-400"
                  : "bg-[#36d6c5]/10 text-[#5ee7d8]"
              }
            `}
          >
            <Icon size={17} />
          </div>

          <div>
            <p className="text-xs text-slate-500">
              {label}
            </p>

            <p
              className={`
                mt-1
                text-sm
                font-semibold
                ${
                  numeric
                    ? "text-white"
                    : getLevelColor(value)
                }
              `}
            >
              {value}
            </p>
          </div>
        </div>

        {numeric && (
          <span className="text-xs font-semibold text-slate-400">
            {value}%
          </span>
        )}
      </div>

      {numeric && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(
                Math.max(Number(value), 0),
                100
              )}%`,
              background:
                Number(value) >= 80
                  ? "#ef4444"
                  : Number(value) >= 60
                    ? "#f59e0b"
                    : "#36d6c5",
            }}
          />
        </div>
      )}
    </div>
  );
}

function ProvinceDetails({
  province,
  onClose,
  onViewDetails,
}) {
  if (!province) {
    return null;
  }

  const score = province.environmentalScore;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  const provinceName =
    ARABIC_NAMES[province.id] ||
    province.name;

  return (
    <div
      className="
        absolute
        bottom-4
        left-4
        right-4
        z-30
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-[#081719]/95
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        backdrop-blur-2xl
        animate-[slideUp_0.35s_ease-out]
      "
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-32 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundColor: scoreColor,
        }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                border-white/10
                bg-white/5
              "
            >
              <ShieldAlert
                size={22}
                style={{
                  color: scoreColor,
                }}
              />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Selected Province
              </p>

              <h2 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                {provinceName}
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: scoreColor,
                  }}
                />

                <span
                  className="text-xs font-semibold"
                  style={{
                    color: scoreColor,
                  }}
                >
                  {scoreLabel}
                </span>

                <span className="text-xs text-slate-600">
                  Environmental Status
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close province details"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/5
              text-slate-400
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Main content */}
        <div className="mt-6 grid gap-4 lg:grid-cols-[210px_1fr]">
          {/* Score */}
          <div
            className="
              relative
              flex
              min-h-[190px]
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-white/[0.035]
            "
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at center, ${scoreColor}, transparent 65%)`,
              }}
            />

            <div className="relative">
              <svg
                width="135"
                height="135"
                viewBox="0 0 135 135"
                className="-rotate-90"
              >
                <circle
                  cx="67.5"
                  cy="67.5"
                  r="56"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="9"
                />

                <circle
                  cx="67.5"
                  cy="67.5"
                  r="56"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    (score / 100) * 351.86
                  } 351.86`}
                  className="transition-all duration-1000"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {score}
                </span>

                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  / 100
                </span>
              </div>
            </div>

            <p className="relative mt-1 text-xs text-slate-500">
              Environmental Score
            </p>
          </div>

          {/* Indicators */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <IndicatorCard
              icon={Droplets}
              label="Water Pollution"
              value={province.waterPollution}
              numeric={
                typeof province.waterPollution ===
                "number"
              }
              danger={
                typeof province.waterPollution ===
                  "number" &&
                province.waterPollution >= 70
              }
            />

            <IndicatorCard
              icon={Factory}
              label="Oil Pressure"
              value={province.oilPressure}
              danger={
                String(
                  province.oilPressure
                ).includes("مرتفع") ||
                String(
                  province.oilPressure
                ).includes("شديد")
              }
            />

            <IndicatorCard
              icon={Wind}
              label="Dust Storms"
              value={province.dustStorms}
              danger={
                String(
                  province.dustStorms
                ).includes("مرتفع") ||
                String(
                  province.dustStorms
                ).includes("شديد")
              }
            />

            <IndicatorCard
              icon={Sprout}
              label="Desertification"
              value={province.desertification}
              danger={
                String(
                  province.desertification
                ).includes("مرتفع") ||
                String(
                  province.desertification
                ).includes("شديد")
              }
            />

            <IndicatorCard
              icon={Sprout}
              label="Green Areas"
              value={
                typeof province.greenAreas ===
                "number"
                  ? province.greenAreas
                  : province.greenAreas
              }
              numeric={
                typeof province.greenAreas ===
                "number"
              }
            />

            <IndicatorCard
              icon={Waves}
              label="Water Stress"
              value={province.waterStress}
              danger={
                String(
                  province.waterStress
                ).includes("مرتفع") ||
                String(
                  province.waterStress
                ).includes("شديد")
              }
            />

            <IndicatorCard
              icon={Thermometer}
              label="Temperature"
              value={province.temperature}
            />

            <IndicatorCard
              icon={Sun}
              label="Solar Potential"
              value={province.solarPotential}
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">
            Explore environmental problems, trends
            and recommended solutions for this province.
          </p>

          <button
            type="button"
            onClick={() =>
              onViewDetails?.(province)
            }
            className="
              group
              flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#36d6c5]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-[#041314]
              shadow-[0_0_25px_rgba(54,214,197,0.15)]
              transition
              hover:bg-[#5ee7d8]
              hover:shadow-[0_0_35px_rgba(54,214,197,0.25)]
            "
          >
            View Province Details

            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProvinceDetails;