import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  FileWarning,
  MapPinned,
  Trophy,
  TrendingDown,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { provinces } from "../data/provinces";

const INCIDENT_STORAGE_KEY = "ecoiraq_incidents";

const ISSUE_LABELS = {
  water: "تلوث المياه",
  oil: "التلوث النفطي",
  dust: "العواصف الترابية",
  desertification: "التصحر",
  "water-stress": "ضغط المياه",
  other: "مشكلة أخرى",
};

const SEVERITY_COLORS = {
  critical: "#F06B5D",
  high: "#F3B51B",
  moderate: "#4FE0CF",
  low: "#86D629",
};

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, score));
};

const getProvinceName = (province) => {
  if (typeof province === "string") {
    return province;
  }

  return (
    province?.name ||
    province?.provinceName ||
    province?.arabicName ||
    province?.title ||
    "غير معروف"
  );
};

const getProvinceScore = (province) => {
  return normalizeScore(
    province?.environmentalScore ??
      province?.environmental_score ??
      province?.score
  );
};

const getIncidentTypeLabel = (incident) => {
  return (
    incident?.typeArabicLabel ||
    ISSUE_LABELS[incident?.type] ||
    incident?.typeLabel ||
    "مشكلة بيئية"
  );
};

const getSeverityLabel = (incident) => {
  return (
    incident?.severityLabel ||
    getSeverityArabicLabel(incident?.severity)
  );
};

const getSeverityArabicLabel = (severity) => {
  switch (severity) {
    case "critical":
      return "حرج";

    case "high":
      return "مرتفع";

    case "moderate":
      return "متوسط";

    case "low":
      return "منخفض";

    default:
      return "غير محدد";
  }
};

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  accent,
}) {
  const accents = {
    cyan: {
      icon: "text-[#4FE0CF]",
      background: "bg-[#4FE0CF]/10",
      border: "hover:border-[#4FE0CF]/20",
    },

    green: {
      icon: "text-[#86D629]",
      background: "bg-[#86D629]/10",
      border: "hover:border-[#86D629]/20",
    },

    red: {
      icon: "text-[#F06B5D]",
      background: "bg-[#F06B5D]/10",
      border: "hover:border-[#F06B5D]/20",
    },

    yellow: {
      icon: "text-[#F3B51B]",
      background: "bg-[#F3B51B]/10",
      border: "hover:border-[#F3B51B]/20",
    },
  };

  const colors = accents[accent] || accents.cyan;

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl
        border border-white/[0.07]
        bg-white/[0.035]
        p-5
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-0.5
        ${colors.border}
      `}
    >
      <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/[0.02] blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div dir="rtl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
            {label}
          </p>

          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {value}
          </h3>

          <p className="mt-1 text-[11px] text-white/30">
            {description}
          </p>
        </div>

        <div
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl
            ${colors.background}
          `}
        >
          <Icon size={18} className={colors.icon} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}) {
  return (
    <div dir="rtl" className="mb-5">
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className="text-[#4FE0CF]" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#4FE0CF]/70">
          {eyebrow}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-white">
        {title}
      </h2>

      {description && (
        <p className="mt-1 text-xs text-white/30">
          {description}
        </p>
      )}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      dir="rtl"
      className="
        rounded-xl
        border border-white/[0.08]
        bg-[#071B19]/95
        px-4 py-3
        shadow-2xl
        backdrop-blur-xl
      "
    >
      <p className="mb-1 text-[11px] text-white/40">
        {label}
      </p>

      <p className="text-sm font-semibold text-[#4FE0CF]">
        {payload[0].value}
      </p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div
      dir="rtl"
      className="
        flex min-h-[150px]
        items-center justify-center
        rounded-xl
        border border-dashed border-white/[0.07]
        bg-black/10
        px-5
        text-center
      "
    >
      <p className="max-w-md text-xs leading-6 text-white/25">
        {message}
      </p>
    </div>
  );
}

export default function ReportsComparison() {
  const incidents = useMemo(() => {
    try {
      const stored = localStorage.getItem(
        INCIDENT_STORAGE_KEY
      );

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, []);

  const provinceData = useMemo(() => {
    return (Array.isArray(provinces) ? provinces : [])
      .map((province) => ({
        ...province,
        displayName: getProvinceName(province),
        score: getProvinceScore(province),
      }))
      .sort((a, b) => b.score - a.score);
  }, []);

  const averageScore = useMemo(() => {
    if (!provinceData.length) {
      return 0;
    }

    const total = provinceData.reduce(
      (sum, province) => sum + province.score,
      0
    );

    return Math.round(total / provinceData.length);
  }, [provinceData]);

  const bestProvince = provinceData[0] || null;

  const worstProvince =
    provinceData[provinceData.length - 1] || null;

  const issueStatistics = useMemo(() => {
    const counts = {};

    incidents.forEach((incident) => {
      const key = getIncidentTypeLabel(incident);

      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [incidents]);

  const provinceIncidentStatistics = useMemo(() => {
    const counts = {};

    incidents.forEach((incident) => {
      const province =
        incident?.province || "غير محددة";

      counts[province] = (counts[province] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [incidents]);

  const severityStatistics = useMemo(() => {
    const counts = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
    };

    incidents.forEach((incident) => {
      const severity = incident?.severity;

      if (Object.prototype.hasOwnProperty.call(counts, severity)) {
        counts[severity] += 1;
      }
    });

    return [
      {
        name: "حرج",
        value: counts.critical,
        color: SEVERITY_COLORS.critical,
      },
      {
        name: "مرتفع",
        value: counts.high,
        color: SEVERITY_COLORS.high,
      },
      {
        name: "متوسط",
        value: counts.moderate,
        color: SEVERITY_COLORS.moderate,
      },
      {
        name: "منخفض",
        value: counts.low,
        color: SEVERITY_COLORS.low,
      },
    ];
  }, [incidents]);

  const highRiskCount = incidents.filter(
    (incident) =>
      incident?.severity === "critical" ||
      incident?.severity === "high"
  ).length;

  const mostReportedIssue =
    issueStatistics[0] || null;

  const mostReportedProvince =
    provinceIncidentStatistics[0] || null;

  return (
    <div
      dir="ltr"
      className="
        min-h-[calc(100vh-76px)]
        px-4 pb-10 pt-5
        sm:px-6
        lg:px-8
      "
    >
      {/* Page Header */}
      <div
        dir="rtl"
        className="
          mb-7
          flex flex-col gap-4
          lg:flex-row lg:items-end lg:justify-between
        "
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4FE0CF] shadow-[0_0_12px_rgba(79,224,207,0.8)]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#4FE0CF]/70">
              ECOIRAQ · ANALYTICS
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Reports & Comparison
          </h1>

          <p className="mt-2 max-w-2xl text-xs leading-6 text-white/35">
            مقارنة الأداء البيئي بين المحافظات وتحليل
            البلاغات والمشاكل البيئية الأكثر انتشارًا.
          </p>
        </div>

        <div
          className="
            flex items-center gap-2
            rounded-xl
            border border-white/[0.06]
            bg-white/[0.025]
            px-3 py-2
          "
        >
          <Activity
            size={14}
            className="text-[#4FE0CF]"
          />

          <span className="text-[10px] text-white/35">
            Live Local Data
          </span>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Activity}
          label="Average Score"
          value={`${averageScore}/100`}
          description="المتوسط البيئي للمحافظات"
          accent="cyan"
        />

        <StatCard
          icon={Trophy}
          label="Best Province"
          value={bestProvince?.displayName || "—"}
          description={
            bestProvince
              ? `${bestProvince.score}/100 أعلى تقييم`
              : "لا توجد بيانات"
          }
          accent="green"
        />

        <StatCard
          icon={TrendingDown}
          label="Worst Province"
          value={worstProvince?.displayName || "—"}
          description={
            worstProvince
              ? `${worstProvince.score}/100 أقل تقييم`
              : "لا توجد بيانات"
          }
          accent="red"
        />

        <StatCard
          icon={FileWarning}
          label="Active Incidents"
          value={incidents.length}
          description={`${highRiskCount} عالية الخطورة`}
          accent="yellow"
        />
      </div>

      {/* Best / Worst */}
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div
          dir="rtl"
          className="
            relative overflow-hidden
            rounded-2xl
            border border-[#86D629]/10
            bg-gradient-to-br
            from-[#86D629]/[0.06]
            to-white/[0.02]
            p-5
          "
        >
          <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full bg-[#86D629]/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Trophy
                  size={15}
                  className="text-[#86D629]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#86D629]/70">
                  BEST PROVINCE
                </span>
              </div>

              <h2 className="text-xl font-semibold text-white">
                {bestProvince?.displayName || "—"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/30">
                أعلى Environmental Score ضمن البيانات الحالية.
              </p>
            </div>

            <div className="text-left">
              <span className="text-3xl font-semibold text-[#86D629]">
                {bestProvince?.score || 0}
              </span>

              <span className="ml-1 text-xs text-white/25">
                /100
              </span>
            </div>
          </div>
        </div>

        <div
          dir="rtl"
          className="
            relative overflow-hidden
            rounded-2xl
            border border-[#F06B5D]/10
            bg-gradient-to-br
            from-[#F06B5D]/[0.06]
            to-white/[0.02]
            p-5
          "
        >
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#F06B5D]/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-5">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle
                  size={15}
                  className="text-[#F06B5D]"
                />

                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F06B5D]/70">
                  LOWEST SCORE
                </span>
              </div>

              <h2 className="text-xl font-semibold text-white">
                {worstProvince?.displayName || "—"}
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/30">
                أقل Environmental Score ضمن البيانات الحالية.
              </p>
            </div>

            <div className="text-left">
              <span className="text-3xl font-semibold text-[#F06B5D]">
                {worstProvince?.score || 0}
              </span>

              <span className="ml-1 text-xs text-white/25">
                /100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Province Comparison */}
      <section
        className="
          mt-6
          rounded-2xl
          border border-white/[0.07]
          bg-white/[0.025]
          p-5
          backdrop-blur-xl
          sm:p-6
        "
      >
        <SectionHeader
          icon={BarChart3}
          eyebrow="NATIONAL COMPARISON"
          title="Environmental Score by Province"
          description="مقارنة الدرجة البيئية لجميع المحافظات."
        />

        <div className="h-[430px] w-full">
          {provinceData.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={provinceData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 20,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.05)"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{
                    fill: "rgba(255,255,255,0.28)",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="displayName"
                  width={85}
                  tick={{
                    fill: "rgba(255,255,255,0.55)",
                    fontSize: 10,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(79,224,207,0.04)",
                  }}
                  content={<ChartTooltip />}
                />

                <Bar
                  dataKey="score"
                  barSize={18}
                  radius={[0, 7, 7, 0]}
                >
                  {provinceData.map(
                    (province) => {
                      const isBest =
                        province.displayName ===
                        bestProvince?.displayName;

                      const isWorst =
                        province.displayName ===
                        worstProvince?.displayName;

                      return (
                        <Cell
                          key={province.displayName}
                          fill={
                            isBest
                              ? "#86D629"
                              : isWorst
                              ? "#F06B5D"
                              : "#4FE0CF"
                          }
                          fillOpacity={
                            isBest || isWorst
                              ? 0.95
                              : 0.55
                          }
                        />
                      );
                    }
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="لا توجد بيانات للمحافظات." />
          )}
        </div>
      </section>

      {/* Incident Analytics */}
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {/* Most Common Problems */}
        <section
          className="
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.025]
            p-5
            backdrop-blur-xl
            sm:p-6
          "
        >
          <SectionHeader
            icon={AlertTriangle}
            eyebrow="INCIDENT ANALYTICS"
            title="Most Reported Problems"
            description="المشاكل البيئية الأكثر انتشارًا في البلاغات."
          />

          {issueStatistics.length > 0 ? (
            <div className="space-y-3">
              {issueStatistics
                .slice(0, 6)
                .map((issue, index) => {
                  const percentage = Math.round(
                    (issue.value / incidents.length) *
                      100
                  );

                  return (
                    <div
                      key={issue.name}
                      dir="rtl"
                      className="
                        rounded-xl
                        border border-white/[0.05]
                        bg-black/10
                        p-3
                      "
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="
                              flex h-7 w-7 shrink-0
                              items-center justify-center
                              rounded-lg
                              bg-[#4FE0CF]/10
                              text-[10px]
                              font-semibold
                              text-[#4FE0CF]
                            "
                          >
                            {index + 1}
                          </span>

                          <span className="truncate text-xs font-medium text-white/75">
                            {issue.name}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-[#4FE0CF]">
                          {issue.value}
                        </span>
                      </div>

                      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-[#4FE0CF] transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <EmptyState message="لا توجد بلاغات حتى الآن. عند إضافة البلاغات ستظهر أكثر المشاكل انتشارًا هنا." />
          )}
        </section>

        {/* Severity Distribution */}
        <section
          className="
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.025]
            p-5
            backdrop-blur-xl
            sm:p-6
          "
        >
          <SectionHeader
            icon={FileWarning}
            eyebrow="INCIDENT SEVERITY"
            title="Incident Distribution"
            description="توزيع البلاغات حسب مستوى الخطورة."
          />

          {incidents.length > 0 ? (
            <>
              <div className="h-[260px]">
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <PieChart>
                    <Pie
                      data={severityStatistics}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                    >
                      {severityStatistics.map(
                        (item) => (
                          <Cell
                            key={item.name}
                            fill={item.color}
                          />
                        )
                      )}
                    </Pie>

                    <Tooltip
                      content={<ChartTooltip />}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div
                dir="rtl"
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {severityStatistics.map(
                  (item) => (
                    <div
                      key={item.name}
                      className="
                        rounded-xl
                        border border-white/[0.05]
                        bg-black/10
                        px-3 py-2
                      "
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{
                            backgroundColor:
                              item.color,
                          }}
                        />

                        <span className="text-[10px] text-white/40">
                          {item.name}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <EmptyState message="لا توجد بلاغات لتحليل مستوى الخطورة." />
          )}
        </section>
      </div>

      {/* Incident Highlights */}
      <section
        className="
          mt-6
          rounded-2xl
          border border-white/[0.07]
          bg-gradient-to-br
          from-[#4FE0CF]/[0.035]
          to-white/[0.02]
          p-5
          backdrop-blur-xl
          sm:p-6
        "
      >
        <SectionHeader
          icon={MapPinned}
          eyebrow="REPORTING INSIGHTS"
          title="Incident Highlights"
          description="ملخص سريع عن بيانات البلاغات الحالية."
        />

        <div className="grid gap-4 md:grid-cols-3">
          <HighlightCard
            icon={AlertTriangle}
            label="Most Reported Problem"
            value={
              mostReportedIssue?.name ||
              "لا توجد بيانات"
            }
            description={
              mostReportedIssue
                ? `${mostReportedIssue.value} بلاغ`
                : "بانتظار البلاغات"
            }
            accent="yellow"
          />

          <HighlightCard
            icon={MapPinned}
            label="Most Reported Province"
            value={
              mostReportedProvince?.name ||
              "لا توجد بيانات"
            }
            description={
              mostReportedProvince
                ? `${mostReportedProvince.value} بلاغ`
                : "بانتظار البلاغات"
            }
            accent="cyan"
          />

          <HighlightCard
            icon={AlertTriangle}
            label="High Risk Incidents"
            value={highRiskCount}
            description="بلاغات مرتفعة أو حرجة"
            accent="red"
          />
        </div>
      </section>
    </div>
  );
}

function HighlightCard({
  icon: Icon,
  label,
  value,
  description,
  accent,
}) {
  const styles = {
    cyan: {
      icon: "text-[#4FE0CF]",
      background: "bg-[#4FE0CF]/10",
    },

    yellow: {
      icon: "text-[#F3B51B]",
      background: "bg-[#F3B51B]/10",
    },

    red: {
      icon: "text-[#F06B5D]",
      background: "bg-[#F06B5D]/10",
    },
  };

  const style = styles[accent] || styles.cyan;

  return (
    <div
      dir="rtl"
      className="
        rounded-xl
        border border-white/[0.05]
        bg-black/10
        p-4
        transition-all duration-300
        hover:border-white/[0.1]
        hover:bg-white/[0.03]
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">
            {label}
          </p>

          <h3 className="mt-3 truncate text-lg font-semibold text-white">
            {value}
          </h3>

          <p className="mt-1 text-[11px] text-white/30">
            {description}
          </p>
        </div>

        <div
          className={`
            flex h-9 w-9 shrink-0
            items-center justify-center
            rounded-lg
            ${style.background}
          `}
        >
          <Icon size={16} className={style.icon} />
        </div>
      </div>
    </div>
  );
}