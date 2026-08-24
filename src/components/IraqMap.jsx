import { useMemo, useState } from "react";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import { provinces } from "../data/provinces";

import iraqGeoJsonRaw from "../data/iraq.geojson?raw";

const iraqGeoJson = JSON.parse(iraqGeoJsonRaw);

// ربط IDs الموجودة في ملف GeoJSON ببيانات المحافظات داخل provinces.js
const GEO_ID_TO_PROVINCE_ID = {
  IQAN: "anbar",
  IQAR: "erbil",
  IQBA: "basra",
  IQBB: "babylon",
  IQBG: "baghdad",
  IQDA: "duhok",
  IQDI: "diyala",
  IQDQ: "dhiQar",
  IQKA: "karbala",
  IQKI: "kirkuk",
  IQMA: "maysan",
  IQMU: "muthanna",
  IQNA: "najaf",
  IQNI: "nineveh",
  IQQA: "qadisiyah",
  IQSD: "salahAlDin",
  IQSU: "sulaymaniyah",
  IQWA: "wasit",
};

// أسماء المحافظات بالعربي
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

// لون المحافظة حسب Environmental Score
function getScoreColor(score) {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#84cc16";
  if (score >= 40) return "#f59e0b";
  if (score >= 20) return "#f97316";
  return "#ef4444";
}

// الحالة النصية للـScore
function getScoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Critical";
}

function IraqMap({ onProvinceSelect, selectedProvince }) {
  const [hoveredProvince, setHoveredProvince] = useState(null);

  const width = 900;
  const height = 650;

  // تجهيز إسقاط الخريطة
  const projection = useMemo(() => {
    return geoMercator().fitExtent(
      [
        [90, 35],
        [810, 610],
      ],
      iraqGeoJson
    );
  }, []);

  // مولد مسارات المحافظات
  const pathGenerator = useMemo(() => {
    return geoPath().projection(projection);
  }, [projection]);

  const features = iraqGeoJson.features || [];

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full max-h-[650px] w-full overflow-visible"
        role="img"
        aria-label="Interactive environmental map of Iraq"
      >
        <defs>
          {/* خلفية الخريطة */}
          <linearGradient
            id="mapBackground"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#0b2426" />
            <stop offset="100%" stopColor="#071619" />
          </linearGradient>

          {/* Glow للمحافظة */}
          <filter
            id="mapGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur
              stdDeviation="5"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Glow أقوى للمحافظة المحددة */}
          <filter
            id="selectedGlow"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur
              stdDeviation="8"
              result="blur"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ظل للنص */}
          <filter
            id="textShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2"
              floodColor="#000000"
              floodOpacity="0.9"
            />
          </filter>
        </defs>

        {/* خلفية خفيفة داخل مساحة الخريطة */}
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          rx="30"
          fill="url(#mapBackground)"
          opacity="0.28"
        />

        {/* إضاءة خلف الخريطة */}
        <circle
          cx="450"
          cy="325"
          r="210"
          fill="#36d6c5"
          opacity="0.035"
          filter="url(#mapGlow)"
        />

        {/* المحافظات */}
        {features.map((feature, index) => {
          const geoId = String(
            feature.properties?.id ||
              feature.id ||
              ""
          ).toUpperCase();

          const provinceId =
            GEO_ID_TO_PROVINCE_ID[geoId];

          const province = provinces.find(
            (item) => item.id === provinceId
          );

          // إذا المحافظة غير موجودة في بيانات المشروع
          // لا نرسمها حتى لا تظهر محافظة بدون بيانات
          if (!province) {
            return null;
          }

          const isSelected =
            selectedProvince?.id === province.id;

          const isHovered =
            hoveredProvince?.id === province.id;

          const color = getScoreColor(
            province.environmentalScore
          );

          /*
           * حساب مركز المحافظة حتى نضع اسمها تلقائيًا
           * في المكان المناسب.
           */
          const center = geoCentroid(feature);

          const projectedCenter =
            projection(center);

          if (!projectedCenter) {
            return null;
          }

          const [labelX, labelY] =
            projectedCenter;

          const arabicName =
            ARABIC_NAMES[province.id] ||
            province.name;

          const score =
            province.environmentalScore;

          return (
            <g
              key={`${geoId}-${index}`}
              className="select-none"
            >
              {/* Glow خلف المحافظة المحددة */}
              {isSelected && (
                <path
                  d={pathGenerator(feature)}
                  fill={color}
                  opacity="0.35"
                  filter="url(#selectedGlow)"
                />
              )}

              {/* المحافظة */}
              <path
                d={pathGenerator(feature)}
                fill={color}
                fillOpacity={
                  isSelected
                    ? 0.95
                    : isHovered
                      ? 0.9
                      : 0.62
                }
                stroke={
                  isSelected
                    ? "#ffffff"
                    : "#173f42"
                }
                strokeWidth={
                  isSelected
                    ? 2.5
                    : isHovered
                      ? 2
                      : 1.3
                }
                strokeLinejoin="round"
                strokeLinecap="round"
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered
                    ? "brightness(1.2)"
                    : "none",
                  transformOrigin: "center",
                }}
                onMouseEnter={() =>
                  setHoveredProvince(province)
                }
                onMouseLeave={() =>
                  setHoveredProvince(null)
                }
                onClick={() =>
                  onProvinceSelect(province)
                }
              />

              {/* اسم المحافظة */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#ffffff"
                fontSize={
                  isSelected
                    ? "15"
                    : isHovered
                      ? "14"
                      : "11"
                }
                fontWeight={
                  isSelected
                    ? "700"
                    : "600"
                }
                opacity={
                  isSelected
                    ? "1"
                    : isHovered
                      ? "1"
                      : "0.86"
                }
                filter="url(#textShadow)"
                className="pointer-events-none select-none"
                style={{
                  fontFamily:
                    "Arial, Tahoma, sans-serif",
                  transition:
                    "all 200ms ease",
                }}
              >
                {arabicName}
              </text>

              {/* رقم الـScore يظهر عند Hover أو Selection */}
              {(isHovered || isSelected) && (
                <g className="pointer-events-none">
                  <circle
                    cx={labelX}
                    cy={labelY - 18}
                    r="11"
                    fill="#071416"
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.95"
                  />

                  <text
                    x={labelX}
                    y={labelY - 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize="8"
                    fontWeight="700"
                  >
                    {score}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* معلومات المحافظة عند Hover */}
      {hoveredProvince && (
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-5
            z-20
            -translate-x-1/2
            rounded-2xl
            border
            border-white/10
            bg-[#091719]/95
            px-5
            py-3
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-3">
            {/* لون الحالة */}
            <span
              className="h-3 w-3 rounded-full shadow-lg"
              style={{
                backgroundColor:
                  getScoreColor(
                    hoveredProvince.environmentalScore
                  ),
              }}
            />

            <div>
              <p className="text-sm font-semibold text-white">
                {ARABIC_NAMES[
                  hoveredProvince.id
                ] || hoveredProvince.name}
              </p>

              <div className="mt-0.5 flex items-center gap-2 text-xs">
                <span className="text-slate-400">
                  Environmental Score
                </span>

                <span className="font-bold text-white">
                  {
                    hoveredProvince.environmentalScore
                  }
                  /100
                </span>

                <span
                  style={{
                    color: getScoreColor(
                      hoveredProvince.environmentalScore
                    ),
                  }}
                >
                  {getScoreLabel(
                    hoveredProvince.environmentalScore
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* تعليمات أسفل الخريطة */}
      {!selectedProvince &&
        !hoveredProvince && (
          <div
            className="
              pointer-events-none
              absolute
              bottom-6
              left-1/2
              -translate-x-1/2
              whitespace-nowrap
              rounded-full
              border
              border-white/10
              bg-black/30
              px-5
              py-2.5
              text-xs
              text-slate-400
              shadow-xl
              backdrop-blur-xl
            "
          >
            Click a province to explore its environmental data
          </div>
        )}
    </div>
  );
}

export default IraqMap;