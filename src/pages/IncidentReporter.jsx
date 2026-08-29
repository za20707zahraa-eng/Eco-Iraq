import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileWarning,
  MapPin,
  Send,
  ShieldAlert,
  Trash2,
  Waves,
  Wind,
  Factory,
  Trees,
  Droplets,
} from "lucide-react";

const STORAGE_KEY = "ecoiraq_incidents";

const provinces = [
  "بغداد",
  "البصرة",
  "نينوى",
  "الأنبار",
  "ذي قار",
  "ميسان",
  "المثنى",
  "واسط",
  "ديالى",
  "كربلاء",
  "النجف",
  "بابل",
  "القادسية",
  "صلاح الدين",
  "كركوك",
  "أربيل",
  "دهوك",
  "السليمانية",
];

const incidentTypes = [
  {
    value: "water",
    label: "Water Pollution",
    arabicLabel: "تلوث المياه",
    icon: Waves,
  },
  {
    value: "oil",
    label: "Oil Pollution",
    arabicLabel: "التلوث النفطي",
    icon: Factory,
  },
  {
    value: "dust",
    label: "Dust Storms",
    arabicLabel: "العواصف الترابية",
    icon: Wind,
  },
  {
    value: "desertification",
    label: "Desertification",
    arabicLabel: "التصحر",
    icon: Trees,
  },
  {
    value: "water-stress",
    label: "Water Stress",
    arabicLabel: "ضغط المياه",
    icon: Droplets,
  },
  {
    value: "other",
    label: "Other",
    arabicLabel: "مشكلة أخرى",
    icon: FileWarning,
  },
];

const severityOptions = [
  {
    value: "low",
    label: "Low",
    arabicLabel: "منخفض",
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    value: "moderate",
    label: "Moderate",
    arabicLabel: "متوسط",
    color: "text-amber-300",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
  },
  {
    value: "high",
    label: "High",
    arabicLabel: "مرتفع",
    color: "text-orange-300",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
  {
    value: "critical",
    label: "Critical",
    arabicLabel: "حرج",
    color: "text-red-300",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
];

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createInitialForm = () => ({
  type: "",
  province: "",
  severity: "",
  description: "",
  date: getToday(),
});

const getStoredIncidents = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

function IncidentReporter() {
  const [form, setForm] = useState(createInitialForm);
  const [incidents, setIncidents] = useState(getStoredIncidents);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch {
      // Ignore localStorage errors.
    }
  }, [incidents]);

  const selectedType = useMemo(
    () => incidentTypes.find((item) => item.value === form.type),
    [form.type]
  );

  const selectedSeverity = useMemo(
    () => severityOptions.find((item) => item.value === form.severity),
    [form.severity]
  );

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.type ||
      !form.province ||
      !form.severity ||
      !form.description.trim() ||
      !form.date
    ) {
      setSubmitted(true);
      return;
    }

    const newIncident = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: form.type,
      typeLabel: selectedType?.label || "Other",
      typeArabicLabel: selectedType?.arabicLabel || "مشكلة أخرى",
      province: form.province,
      severity: form.severity,
      severityLabel: selectedSeverity?.label || "Moderate",
      severityArabicLabel: selectedSeverity?.arabicLabel || "متوسط",
      description: form.description.trim(),
      date: form.date,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    setIncidents((previous) => [newIncident, ...previous]);

    setForm(createInitialForm());
    setSubmitted(false);
  };

  const handleDelete = (id) => {
    setIncidents((previous) =>
      previous.filter((incident) => incident.id !== id)
    );
  };

  const getSeverityStyle = (severity) => {
    const item = severityOptions.find(
      (option) => option.value === severity
    );

    if (!item) {
      return {
        color: "text-white/60",
        bg: "bg-white/[0.04]",
        border: "border-white/[0.08]",
      };
    }

    return item;
  };

  return (
    <div className="min-h-[calc(100vh-76px)] px-4 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* Page Header */}
        <div className="mb-7 pt-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4FE0CF] shadow-[0_0_12px_rgba(79,224,207,0.8)]" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#4FE0CF]/70">
              Environmental Monitoring
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Incident Reporter
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                Report environmental incidents and help monitor environmental
                conditions across Iraq.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-full border border-[#4FE0CF]/10 bg-[#4FE0CF]/[0.04] px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-[#4FE0CF] shadow-[0_0_10px_rgba(79,224,207,0.8)]" />

              <span className="text-xs text-white/50">
                Monitoring Active
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Report Form */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-6">
            {/* Glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#4FE0CF]/[0.06] blur-3xl" />

            <div className="relative">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4FE0CF]/15 bg-[#4FE0CF]/[0.07] text-[#4FE0CF]">
                  <ShieldAlert size={21} strokeWidth={1.7} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Report Environmental Incident
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-white/35">
                    Provide accurate information about the environmental
                    problem.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Incident Type */}
                <Field label="Incident Type" required>
                  <div className="relative">
                    <select
                      value={form.type}
                      onChange={(event) =>
                        updateField("type", event.target.value)
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#071c1b] px-4 pr-11 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#4FE0CF]/40 focus:bg-[#092321]"
                    >
                      <option value="">Select problem type</option>

                      {incidentTypes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label} — {item.arabicLabel}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                    />
                  </div>
                </Field>

                {/* Province */}
                <Field label="Province" required>
                  <div className="relative">
                    <MapPin
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4FE0CF]/50"
                    />

                    <select
                      value={form.province}
                      onChange={(event) =>
                        updateField("province", event.target.value)
                      }
                      className="h-12 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#071c1b] px-11 pr-11 text-sm text-white outline-none transition focus:border-[#4FE0CF]/40 focus:bg-[#092321]"
                    >
                      <option value="">Select province</option>

                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                    />
                  </div>
                </Field>

                {/* Severity */}
                <Field label="Severity Level" required>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {severityOptions.map((option) => {
                      const active = form.severity === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            updateField("severity", option.value)
                          }
                          className={`
                            rounded-xl border px-3 py-3 text-left transition-all duration-200
                            ${
                              active
                                ? `${option.bg} ${option.border} ${option.color} shadow-[0_0_20px_rgba(79,224,207,0.05)]`
                                : "border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-white/[0.12] hover:bg-white/[0.04]"
                            }
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 rounded-full ${
                                active
                                  ? option.color.replace(
                                      "text-",
                                      "bg-"
                                    )
                                  : "bg-white/20"
                              }`}
                            />

                            <span className="text-xs font-medium">
                              {option.label}
                            </span>
                          </div>

                          <div className="mt-1 text-[10px] text-white/25">
                            {option.arabicLabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                {/* Description */}
                <Field label="Description" required>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Describe the environmental problem, location, impact, or any useful details..."
                    rows={5}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-[#071c1b] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-[#4FE0CF]/40 focus:bg-[#092321]"
                  />

                  <div className="mt-2 flex justify-end text-[10px] text-white/20">
                    {form.description.length}/1000
                  </div>
                </Field>

                {/* Date */}
                <Field label="Incident Date" required>
                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#4FE0CF]/50"
                    />

                    <input
                      type="date"
                      value={form.date}
                      onChange={(event) =>
                        updateField("date", event.target.value)
                      }
                      className="h-12 w-full rounded-xl border border-white/[0.08] bg-[#071c1b] px-11 text-sm text-white outline-none transition focus:border-[#4FE0CF]/40 focus:bg-[#092321]"
                    />
                  </div>
                </Field>

                {/* Validation */}
                {submitted && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-xs text-red-300/80">
                    <AlertTriangle size={15} />
                    <span>
                      Please complete all required fields before submitting.
                    </span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4FE0CF] px-5 text-sm font-semibold text-[#06201d] shadow-[0_0_30px_rgba(79,224,207,0.12)] transition-all duration-200 hover:bg-[#65e7d8] hover:shadow-[0_0_35px_rgba(79,224,207,0.22)] active:scale-[0.99]"
                >
                  <Send
                    size={16}
                    className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  />

                  Submit Incident
                </button>

                <p className="text-center text-[10px] leading-5 text-white/20">
                  Your report will be stored locally on this device.
                </p>
              </form>
            </div>
          </section>

          {/* Active Incidents */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.025] p-5 shadow-[0_25px_80px_rgba(0,0,0,0.18)] backdrop-blur-2xl sm:p-6">
            <div className="pointer-events-none absolute -left-28 top-10 h-64 w-64 rounded-full bg-[#36d7bd]/[0.035] blur-3xl" />

            <div className="relative">
              {/* Header */}
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-400/[0.05] text-orange-300">
                      <AlertTriangle size={19} strokeWidth={1.7} />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-white">
                        Active Incidents
                      </h2>

                      <p className="mt-0.5 text-xs text-white/30">
                        Environmental reports submitted from this device
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2">
                  <span className="text-lg font-semibold text-white">
                    {incidents.length}
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-white/25">
                    Active
                  </span>
                </div>
              </div>

              {/* Empty State */}
              {incidents.length === 0 ? (
                <div className="flex min-h-[430px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.07] bg-black/[0.08] px-6 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4FE0CF]/10 bg-[#4FE0CF]/[0.04] text-[#4FE0CF]/50">
                    <FileWarning size={27} strokeWidth={1.4} />
                  </div>

                  <h3 className="text-sm font-medium text-white/70">
                    No active incidents
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-white/25">
                    Environmental reports submitted through the form will
                    appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="max-h-[680px] space-y-3 overflow-y-auto pr-1">
                  {incidents.map((incident) => {
                    const severityStyle = getSeverityStyle(
                      incident.severity
                    );

                    const TypeIcon =
                      incidentTypes.find(
                        (item) => item.value === incident.type
                      )?.icon || FileWarning;

                    return (
                      <article
                        key={incident.id}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/[0.11] hover:bg-white/[0.035]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#4FE0CF]/10 bg-[#4FE0CF]/[0.04] text-[#4FE0CF]/70">
                              <TypeIcon size={18} strokeWidth={1.6} />
                            </div>

                            <div className="min-w-0">
                              <h3 className="truncate text-sm font-semibold text-white">
                                {incident.typeLabel}
                              </h3>

                              <p className="mt-0.5 text-xs text-[#4FE0CF]/60">
                                {incident.typeArabicLabel}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDelete(incident.id)}
                            aria-label="Delete incident"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/20 opacity-0 transition hover:bg-red-400/[0.07] hover:text-red-300 group-hover:opacity-100"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <div className="rounded-xl border border-white/[0.05] bg-black/[0.08] px-3 py-2.5">
                            <div className="mb-1 text-[9px] uppercase tracking-wider text-white/20">
                              Province
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <MapPin
                                size={12}
                                className="text-[#4FE0CF]/50"
                              />

                              {incident.province}
                            </div>
                          </div>

                          <div className="rounded-xl border border-white/[0.05] bg-black/[0.08] px-3 py-2.5">
                            <div className="mb-1 text-[9px] uppercase tracking-wider text-white/20">
                              Date
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-white/60">
                              <CalendarDays
                                size={12}
                                className="text-[#4FE0CF]/50"
                              />

                              {incident.date}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider ${severityStyle.bg} ${severityStyle.border} ${severityStyle.color}`}
                          >
                            {incident.severityLabel}
                          </span>

                          <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-300/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            Active
                          </span>
                        </div>

                        <div className="mt-3 rounded-xl border border-white/[0.05] bg-black/[0.08] px-3 py-3">
                          <div className="mb-1 text-[9px] uppercase tracking-wider text-[#4FE0CF]/40">
                            Description
                          </div>

                          <p className="line-clamp-3 text-xs leading-5 text-white/40">
                            {incident.description}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              {incidents.length > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.025] px-4 py-3">
                  <CheckCircle2
                    size={15}
                    className="shrink-0 text-emerald-300/60"
                  />

                  <p className="text-[10px] leading-5 text-white/25">
                    Reports are automatically saved to LocalStorage and will
                    remain available after refreshing the page.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}

        {required && (
          <span className="ml-1 text-[#4FE0CF]/60">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

export default IncidentReporter;