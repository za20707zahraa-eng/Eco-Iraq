import { useState } from "react";
import {
  Map,
  BarChart3,
  Leaf,
  Sun,
} from "lucide-react";

import { provinces } from "../data/provinces";
import IraqMap from "../components/IraqMap";
import ProvinceDetails from "../components/ProvinceDetails";

function Dashboard() {
  const [selectedProvince, setSelectedProvince] =
    useState(null);

  const averageScore =
    provinces.length > 0
      ? Math.round(
          provinces.reduce(
            (sum, province) =>
              sum +
              Number(
                province.environmentalScore || 0
              ),
            0
          ) / provinces.length
        )
      : 0;

  const bestScore =
    provinces.length > 0
      ? Math.max(
          ...provinces.map(
            (province) =>
              Number(
                province.environmentalScore || 0
              )
          )
        )
      : 0;

  const bestProvince =
    provinces.find(
      (province) =>
        Number(
          province.environmentalScore || 0
        ) === bestScore
    ) || null;

  return (
    <div className="min-h-[calc(100vh-76px)]">
      {/* ================= STATS ================= */}
      <section
        className="
          grid
          grid-cols-2
          gap-3
          border-b
          border-white/[0.06]
          bg-white/[0.015]
          p-4
          sm:grid-cols-4
          sm:px-6
          lg:px-8
        "
      >
        <StatCard
          label="Provinces"
          value={provinces.length}
          subtitle="Iraq governorates"
          icon={Map}
          color="teal"
        />

        <StatCard
          label="Average Score"
          value={averageScore}
          suffix="/100"
          subtitle="National average"
          icon={BarChart3}
          color="amber"
        />

        <StatCard
          label="Best Province"
          value={
            bestProvince
              ? bestProvince.name
              : "—"
          }
          subtitle={`Score ${bestScore}/100`}
          icon={Leaf}
          color="green"
        />

        <StatCard
          label="Solar Potential"
          value="High"
          subtitle="Renewable energy"
          icon={Sun}
          color="yellow"
        />
      </section>

      {/* ================= MAP AREA ================= */}
      <section
        className="
          relative
          min-h-[680px]
          overflow-hidden
          bg-[#071E1D]
        "
      >
        {/* Background glow */}
        <div
          className="
            pointer-events-none
            absolute
            left-[20%]
            top-[15%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#14B8A6]/[0.06]
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-150px]
            right-[15%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-[#22C55E]/[0.045]
            blur-[130px]
          "
        />

        {/* Map heading */}
        <div
          className="
            pointer-events-none
            absolute
            left-5
            top-5
            z-10
            sm:left-7
            sm:top-7
            lg:left-9
            lg:top-8
          "
        >
          <div className="flex items-center gap-2">
            <span
              className="
                h-1.5
                w-1.5
                rounded-full
                bg-[#4FE0CF]
                shadow-[0_0_10px_rgba(79,224,207,0.8)]
              "
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-[#5EE7D8]/70
              "
            >
              Iraq
            </span>
          </div>

          <h3
            className="
              mt-2
              text-xl
              font-semibold
              tracking-tight
              text-white
              sm:text-2xl
            "
          >
            Environmental Map
          </h3>

          <p
            className="
              mt-1
              max-w-xs
              text-[10px]
              leading-5
              text-white/30
            "
          >
            Select a province to explore its
            environmental score and key
            indicators.
          </p>
        </div>

        {/* Map glass container */}
        <div
          className="
            absolute
            inset-x-4
            bottom-4
            top-24
            rounded-[30px]
            border
            border-white/[0.07]
            bg-white/[0.018]
            shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]
            backdrop-blur-[8px]
            sm:inset-x-6
            sm:bottom-6
            sm:top-28
            lg:inset-x-8
            lg:bottom-8
            lg:top-28
          "
        />

        {/* Map */}
        <div
          className="
            relative
            z-[2]
            flex
            min-h-[620px]
            w-full
            items-center
            justify-center
            px-5
            pb-24
            pt-28
            sm:px-8
            lg:px-12
          "
        >
          <div
            className="
              h-full
              w-full
              max-w-[1050px]
            "
          >
            <IraqMap
              selectedProvince={
                selectedProvince
              }
              onProvinceSelect={
                setSelectedProvince
              }
            />
          </div>
        </div>

        {/* Legend */}
        <div
          className="
            absolute
            bottom-7
            left-7
            z-10
            hidden
            rounded-2xl
            border
            border-white/[0.08]
            bg-[#0A2927]/65
            p-4
            shadow-[0_15px_40px_rgba(0,0,0,0.20)]
            backdrop-blur-[18px]
            sm:block
            lg:left-10
          "
        >
          <p
            className="
              mb-3
              text-[8px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-white/30
            "
          >
            Environmental Score
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <LegendItem
              color="bg-red-500"
              label="Critical"
            />

            <LegendItem
              color="bg-orange-500"
              label="Poor"
            />

            <LegendItem
              color="bg-amber-400"
              label="Moderate"
            />

            <LegendItem
              color="bg-lime-500"
              label="Good"
            />

            <LegendItem
              color="bg-green-500"
              label="Excellent"
            />
          </div>
        </div>

        {/* Selected province glass indicator */}
        {selectedProvince && (
          <div
            className="
              absolute
              bottom-7
              right-7
              z-20
              w-[250px]
              rounded-2xl
              border
              border-[#4FE0CF]/15
              bg-[#082725]/75
              p-4
              shadow-[0_20px_50px_rgba(0,0,0,0.25)]
              backdrop-blur-[22px]
              lg:right-10
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#5EE7D8]/60">
                  Selected Province
                </p>

                <h4 className="mt-1 text-[15px] font-semibold text-white">
                  {selectedProvince.name}
                </h4>
              </div>

              <div
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#4FE0CF]/15
                  bg-[#4FE0CF]/[0.08]
                "
              >
                <span className="text-sm font-bold text-[#5EE7D8]">
                  {selectedProvince.environmentalScore}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Province details */}
        {selectedProvince && (
          <ProvinceDetails
            province={selectedProvince}
            onClose={() =>
              setSelectedProvince(null)
            }
            onViewDetails={(province) => {
              setSelectedProvince(province);
            }}
          />
        )}
      </section>
    </div>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  label,
  value,
  suffix,
  subtitle,
  icon: Icon,
  color,
}) {
  const colors = {
    teal: {
      bg: "bg-[#4FE0CF]/[0.08]",
      border: "border-[#4FE0CF]/10",
      text: "text-[#5EE7D8]",
    },

    amber: {
      bg: "bg-[#FBBF24]/[0.08]",
      border: "border-[#FBBF24]/10",
      text: "text-[#FCD34D]",
    },

    green: {
      bg: "bg-[#4ADE80]/[0.08]",
      border: "border-[#4ADE80]/10",
      text: "text-[#86EFAC]",
    },

    yellow: {
      bg: "bg-[#FACC15]/[0.08]",
      border: "border-[#FACC15]/10",
      text: "text-[#FDE047]",
    },
  };

  const current = colors[color];

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
        shadow-[0_10px_35px_rgba(0,0,0,0.10)]
        backdrop-blur-[16px]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:bg-white/[0.04]
        ${current.border}
      `}
    >
      {/* Hover glow */}
      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-24
          w-24
          rounded-full
          blur-3xl
          ${current.bg}
        `}
      />

      <div className="relative flex items-center justify-between">
        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-white/30">
          {label}
        </p>

        <span
          className={`
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.05]
            ${current.bg}
            ${current.text}
          `}
        >
          <Icon size={14} strokeWidth={1.8} />
        </span>
      </div>

      <div className="relative mt-3">
        <p className="truncate text-xl font-semibold tracking-tight text-white">
          {value}

          {suffix && (
            <span className="ml-1 text-[9px] font-medium text-white/25">
              {suffix}
            </span>
          )}
        </p>

        <p className="mt-1 text-[9px] text-white/25">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ================= LEGEND ================= */

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${color}
        `}
      />

      <span className="text-[8px] font-medium text-white/40">
        {label}
      </span>
    </div>
  );
}

export default Dashboard;