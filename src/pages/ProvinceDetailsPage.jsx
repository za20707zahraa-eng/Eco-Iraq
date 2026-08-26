import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Droplets,
  Factory,
  Wind,
  Sprout,
  Waves,
  Thermometer,
  Sun,
  ShieldAlert,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

import { provinces } from "../data/provinces";

const PROBLEM_CONFIG = {
  waterPollution: {
    label: "تلوث المياه",
    icon: Droplets,
    solution:
      "تحسين معالجة مياه الصرف، مراقبة مصادر التلوث، ودعم مشاريع تنقية المياه.",
    action: "تحسين جودة المياه",
  },
  oilPressure: {
    label: "الضغط النفطي",
    icon: Factory,
    solution:
      "تقليل التسربات النفطية، تحسين أنظمة المراقبة، وتطبيق إجراءات أكثر أمانًا في المناطق النفطية.",
    action: "تقليل الضغط النفطي",
  },
  dustStorms: {
    label: "العواصف الترابية",
    icon: Wind,
    solution:
      "زيادة الأحزمة الخضراء، تثبيت التربة، وزراعة الأشجار المقاومة للجفاف.",
    action: "تقليل العواصف الترابية",
  },
  desertification: {
    label: "التصحر",
    icon: Sprout,
    solution:
      "استعادة الغطاء النباتي، زيادة المساحات الخضراء، وتحسين إدارة الأراضي والمياه.",
    action: "مكافحة التصحر",
  },
  waterStress: {
    label: "ضغط المياه",
    icon: Waves,
    solution:
      "تقليل استهلاك المياه، تحسين شبكات التوزيع، واستخدام تقنيات الري الحديثة.",
    action: "تقليل ضغط المياه",
  },
};

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

function getLevelRank(value) {
  const text = String(value || "");

  if (
    text.includes("شديد جدًا") ||
    text.includes("شديد")
  ) {
    return 5;
  }

  if (text.includes("مرتفع جدًا")) {
    return 4;
  }

  if (text.includes("مرتفع")) {
    return 3;
  }

  if (text.includes("متوسط")) {
    return 2;
  }

  if (
    text.includes("منخفض جدًا") ||
    text.includes("منخفض")
  ) {
    return 1;
  }

  return 0;
}

function getLevelColor(value) {
  const text = String(value || "");

  if (
    text.includes("شديد جدًا") ||
    text.includes("شديد")
  ) {
    return "#ef4444";
  }

  if (text.includes("مرتفع جدًا")) {
    return "#f97316";
  }

  if (text.includes("مرتفع")) {
    return "#fb923c";
  }

  if (text.includes("متوسط")) {
    return "#f59e0b";
  }

  if (text.includes("منخفض جدًا")) {
    return "#34d399";
  }

  if (text.includes("منخفض")) {
    return "#22c55e";
  }

  return "#94a3b8";
}

function getNumericValue(value) {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function getProblemSeverity(province, key) {
  const value = province[key];

  if (typeof value === "number") {
    if (key === "waterPollution") {
      if (value >= 80) return 5;
      if (value >= 60) return 4;
      if (value >= 40) return 3;
      return 1;
    }

    return value <= 20 ? 1 : value <= 40 ? 2 : 3;
  }

  return getLevelRank(value);
}

function ScoreCircle({ score }) {
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const progress =
    circumference * Math.min(Math.max(score, 0), 100) / 100;

  return (
    <div className="relative h-44 w-44">
      <svg
        viewBox="0 0 130 130"
        className="-rotate-90 h-full w-full"
      >
        <circle
          cx="65"
          cy="65"
          r="54"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />

        <circle
          cx="65"
          cy="65"
          r="54"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          className="transition-all duration-1000"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">
          {score}
        </span>

        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/35">
          / 100
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  numeric = false,
}) {
  const color = numeric
    ? getNumericValue(value) >= 70
      ? "#ef4444"
      : getNumericValue(value) >= 50
        ? "#f59e0b"
        : "#4FE0CF"
    : getLevelColor(value);

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-white/[0.045]">
      <div className="flex items-start justify-between gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `${color}12`,
            color,
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/30">
            {title}
          </p>

          <p
            className="mt-2 truncate text-sm font-semibold"
            style={{ color }}
          >
            {numeric
              ? `${value}%`
              : value || "غير متوفر"}
          </p>
        </div>
      </div>

      {numeric && (
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(
                Math.max(getNumericValue(value), 0),
                100
              )}%`,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}55`,
            }}
          />
        </div>
      )}
    </div>
  );
}

function ProblemCard({
  problem,
  province,
  onTrySolution,
}) {
  const config = PROBLEM_CONFIG[problem.key];
  const Icon = config.icon;

  const rawValue = province[problem.key];
  const severity = getProblemSeverity(
    province,
    problem.key
  );

  const severityLabel =
    severity >= 5
      ? "Severe"
      : severity >= 4
        ? "High"
        : severity >= 3
          ? "Moderate"
          : "Low";

  const severityColor =
    severity >= 5
      ? "#ef4444"
      : severity >= 4
        ? "#f97316"
        : severity >= 3
          ? "#f59e0b"
          : "#22c55e";

  return (
    <div className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${severityColor}12`,
              color: severityColor,
            }}
          >
            <Icon size={19} />
          </div>

          <div>
            <h4 className="font-semibold text-white">
              {config.label}
            </h4>

            <p
              className="mt-1 text-xs font-medium"
              style={{ color: severityColor }}
            >
              {typeof rawValue === "number"
                ? `${rawValue}%`
                : rawValue || "غير متوفر"}
            </p>
          </div>
        </div>

        <span
          className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]"
          style={{
            color: severityColor,
            borderColor: `${severityColor}30`,
            backgroundColor: `${severityColor}10`,
          }}
        >
          {severityLabel}
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-white/[0.05] bg-black/10 p-4">
        <div className="flex items-center gap-2">
          <Lightbulb
            size={14}
            className="text-[#5EE7D8]"
          />

          <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5EE7D8]/70">
            Recommended Solution
          </span>
        </div>

        <p className="mt-2 text-xs leading-5 text-white/45">
          {config.solution}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onTrySolution(problem.key)
        }
        className="group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#4FE0CF]/15 bg-[#4FE0CF]/[0.07] px-4 py-2.5 text-xs font-semibold text-[#5EE7D8] transition-all duration-300 hover:border-[#4FE0CF]/30 hover:bg-[#4FE0CF]/[0.12]"
      >
        جرب الحل

        <ArrowRight
          size={14}
          className="transition-transform duration-200 group-hover/btn:translate-x-1"
        />
      </button>
    </div>
  );
}

function ProvinceDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const requestedId = searchParams.get("province");

  const [selectedId, setSelectedId] = useState(
    requestedId || provinces[0]?.id || ""
  );

  const province = useMemo(() => {
    return (
      provinces.find(
        (item) => item.id === selectedId
      ) || provinces[0]
    );
  }, [selectedId]);

  const radarData = useMemo(() => {
    if (!province) return [];

    return [
      {
        subject: "Water",
        value: 100 - getNumericValue(province.waterPollution),
        fullMark: 100,
      },
      {
        subject: "Green Areas",
        value: getNumericValue(province.greenAreas),
        fullMark: 100,
      },
      {
        subject: "Water Stress",
        value:
          100 -
          getLevelRank(province.waterStress) * 20,
        fullMark: 100,
      },
      {
        subject: "Dust",
        value:
          100 -
          getLevelRank(province.dustStorms) * 20,
        fullMark: 100,
      },
      {
        subject: "Desertification",
        value:
          100 -
          getLevelRank(province.desertification) * 20,
        fullMark: 100,
      },
      {
        subject: "Oil",
        value:
          100 -
          getLevelRank(province.oilPressure) * 20,
        fullMark: 100,
      },
    ];
  }, [province]);

  const comparisonData = useMemo(() => {
    if (!province) return [];

    return [...provinces]
      .sort(
        (a, b) =>
          Number(b.environmentalScore) -
          Number(a.environmentalScore)
      )
      .slice(0, 6)
      .map((item) => ({
        name: ARABIC_NAMES[item.id] || item.name,
        score: Number(item.environmentalScore),
        selected: item.id === province.id,
      }));
  }, [province]);

  const problems = useMemo(() => {
    if (!province) return [];

    return [
      "waterPollution",
      "oilPressure",
      "dustStorms",
      "desertification",
      "waterStress",
    ]
      .map((key) => ({
        key,
        severity: getProblemSeverity(
          province,
          key
        ),
      }))
      .sort((a, b) => b.severity - a.severity);
  }, [province]);

  if (!province) {
    return (
      <div className="flex min-h-[calc(100vh-76px)] items-center justify-center">
        <p className="text-white/50">
          No province data available.
        </p>
      </div>
    );
  }

  const score = Number(
    province.environmentalScore || 0
  );

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const provinceName =
    ARABIC_NAMES[province.id] || province.name;

  const handleTrySolution = (problemKey) => {
    navigate(
      `/simulator?province=${province.id}&solution=${problemKey}`
    );
  };

  return (
    <div className="min-h-[calc(100vh-76px)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1450px]">
        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="group mb-4 flex items-center gap-2 text-xs text-white/35 transition hover:text-[#5EE7D8]"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back to Dashboard
            </button>

            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: scoreColor,
                  boxShadow: `0 0 10px ${scoreColor}`,
                }}
              />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#5EE7D8]/70">
                Province Intelligence
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {provinceName}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
              Detailed environmental indicators,
              problems and recommended solutions for
              {` ${provinceName}`}.
            </p>
          </div>

          {/* Province selector */}
          <div className="relative w-full xl:w-[280px]">
            <label className="mb-2 block text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
              Select Province
            </label>

            <div className="relative">
              <select
                value={selectedId}
                onChange={(event) =>
                  setSelectedId(event.target.value)
                }
                className="w-full appearance-none rounded-2xl border border-white/[0.08] bg-[#0A2927]/80 px-4 py-3 text-sm font-medium text-white outline-none transition focus:border-[#4FE0CF]/30"
              >
                {provinces.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                    className="bg-[#071E1D] text-white"
                  >
                    {ARABIC_NAMES[item.id] ||
                      item.name}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/35"
              />
            </div>
          </div>
        </div>

        {/* Hero section */}
        <section className="grid gap-4 xl:grid-cols-[280px_1fr]">
          {/* Score card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-[70px]"
              style={{
                backgroundColor: `${scoreColor}20`,
              }}
            />

            <div className="relative flex h-full flex-col items-center justify-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">
                Environmental Score
              </p>

              <div className="mt-5">
                <ScoreCircle score={score} />
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: scoreColor,
                  }}
                />

                <span
                  className="text-sm font-semibold"
                  style={{
                    color: scoreColor,
                  }}
                >
                  {scoreLabel}
                </span>
              </div>

              <p className="mt-2 text-center text-[10px] leading-5 text-white/25">
                Overall environmental condition
                based on available indicators.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              icon={Droplets}
              title="Water Pollution"
              value={province.waterPollution}
              numeric={
                typeof province.waterPollution ===
                "number"
              }
            />

            <MetricCard
              icon={Factory}
              title="Oil Pressure"
              value={province.oilPressure}
            />

            <MetricCard
              icon={Wind}
              title="Dust Storms"
              value={province.dustStorms}
            />

            <MetricCard
              icon={Sprout}
              title="Desertification"
              value={province.desertification}
            />

            <MetricCard
              icon={Sprout}
              title="Green Areas"
              value={province.greenAreas}
              numeric={
                typeof province.greenAreas ===
                "number"
              }
            />

            <MetricCard
              icon={Waves}
              title="Water Stress"
              value={province.waterStress}
            />

            <MetricCard
              icon={Thermometer}
              title="Temperature"
              value={province.temperature}
            />

            <MetricCard
              icon={Sun}
              title="Solar Potential"
              value={province.solarPotential}
            />
          </div>
        </section>

        {/* Charts */}
        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          {/* Radar */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5EE7D8]/60">
                Environmental Profile
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Indicator Balance
              </h2>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <RadarChart
                  data={radarData}
                  outerRadius="72%"
                >
                  <PolarGrid
                    stroke="rgba(255,255,255,0.07)"
                  />

                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "rgba(255,255,255,0.42)",
                      fontSize: 10,
                    }}
                  />

                  <PolarRadiusAxis
                    domain={[0, 100]}
                    tick={{
                      fill: "rgba(255,255,255,0.2)",
                      fontSize: 8,
                    }}
                    axisLine={false}
                  />

                  <Radar
                    name="Environmental Profile"
                    dataKey="value"
                    stroke="#4FE0CF"
                    fill="#4FE0CF"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#09211F",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison */}
          <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5EE7D8]/60">
                National Comparison
              </p>

              <h2 className="mt-1 text-lg font-semibold text-white">
                Top Environmental Scores
              </h2>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={comparisonData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 10,
                  }}
                >
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={{
                      fill: "rgba(255,255,255,0.25)",
                      fontSize: 8,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={65}
                    tick={{
                      fill: "rgba(255,255,255,0.45)",
                      fontSize: 9,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.025)",
                    }}
                    contentStyle={{
                      background:
                        "#09211F",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: "11px",
                    }}
                  />

                  <Bar
                    dataKey="score"
                    radius={[
                      0,
                      6,
                      6,
                      0,
                    ]}
                  >
                    {comparisonData.map(
                      (item) => (
                        <Cell
                          key={item.name}
                          fill={
                            item.selected
                              ? "#4FE0CF"
                              : "#84CC16"
                          }
                          fillOpacity={
                            item.selected
                              ? 1
                              : 0.55
                          }
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Problems */}
        <section className="mt-4 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#5EE7D8]/60">
                Environmental Risks
              </p>

              <h2 className="mt-1 text-xl font-semibold text-white">
                Key Problems & Solutions
              </h2>
            </div>

            <p className="max-w-md text-xs leading-5 text-white/25 sm:text-right">
              The highest-priority environmental
              challenges are shown first.
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {problems.map((problem) => (
              <ProblemCard
                key={problem.key}
                problem={problem}
                province={province}
                onTrySolution={
                  handleTrySolution
                }
              />
            ))}
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-5 flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3 text-xs font-medium text-white/45 transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/simulator?province=${province.id}`
              )
            }
            className="group flex items-center justify-center gap-2 rounded-xl bg-[#4FE0CF] px-5 py-3 text-xs font-semibold text-[#041314] shadow-[0_0_25px_rgba(79,224,207,0.12)] transition hover:bg-[#5EE7D8] hover:shadow-[0_0_35px_rgba(79,224,207,0.2)]"
          >
            Open Eco Simulator

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProvinceDetailsPage;