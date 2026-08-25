import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { provinces } from "../data/provinces";
import "./Dashboard.css";

function getScoreClass(score) {
  if (score >= 70) return "good";
  if (score >= 50) return "medium";
  return "danger";
}

function Dashboard() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState(provinces[0]);

  const selectProvince = (province) => {
    setSelected(province);
  };

  return (
    <main className="dashboard" dir="rtl">
      <div className="dashboard-bg glow-one"></div>
      <div className="dashboard-bg glow-two"></div>

      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">🌱</div>

          <div>
            <h1>
              Eco<span>Iraq</span>
            </h1>
            <p>IRAQI ENVIRONMENTAL PLATFORM</p>
          </div>
        </div>

        <nav>
          <button className="active">الرئيسية</button>
          <button onClick={() => navigate("/province")}>
            المحافظات
          </button>
          <button onClick={() => navigate("/reports")}>
            التقارير
          </button>
          <button onClick={() => navigate("/reporter")}>
            بلاغ بيئي
          </button>
        </nav>
      </header>

      <section className="dashboard-title">
        <div>
          <span className="dashboard-label">
            IRAQ ENVIRONMENTAL MONITOR
          </span>

          <h2>
            اكتشف الوضع البيئي
            <br />
            <strong>لمحافظات العراق</strong>
          </h2>

          <p>
            اختر المحافظة من الخريطة لمعرفة المؤشرات البيئية
            وأهم المشاكل والتحديات التي تواجهها.
          </p>
        </div>

        <div className="live-status">
          <span></span>
          بيانات بيئية مباشرة
        </div>
      </section>

      <section className="dashboard-layout">

        <div className="map-panel">
          <div className="panel-header">
            <div>
              <small>INTERACTIVE MAP</small>
              <h3>خريطة العراق</h3>
            </div>

            <div className="map-hint">
              اختر محافظة
            </div>
          </div>

          <div className="iraq-map">
            <div className="map-outline">
              <div className="map-glow" style={{ pointerEvents: "none" }}></div>

              {provinces.map((province, index) => {
                const positions = [
                  [54, 17], [69, 20], [61, 30], [74, 31], [54, 34], [43, 32],
                  [34, 31], [23, 27], [46, 45], [57, 47], [68, 45], [48, 57],
                  [61, 57], [31, 48], [37, 19], [31, 10], [45, 8], [39, 27],
                ];

                const [left, top] = positions[index] || [50, 50];

                return (
                  <button
                    key={province.id}
                    className={`province-dot ${
                      selected.id === province.id ? "selected" : ""
                    } ${getScoreClass(province.score)}`}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                      position: "absolute",
                      zIndex: 10,
                      cursor: "pointer",
                    }}
                    onClick={() => selectProvince(province)}
                    title={province.name}
                  >
                    <span></span>
                    <b>{province.name}</b>
                  </button>
                );
              })}

              <div className="map-lines line-one" style={{ pointerEvents: "none" }}></div>
              <div className="map-lines line-two" style={{ pointerEvents: "none" }}></div>
              <div className="map-lines line-three" style={{ pointerEvents: "none" }}></div>

              <div className="map-center" style={{ pointerEvents: "none" }}>
                <span>IRAQ</span>
                <strong>العراق</strong>
              </div>
            </div>
          </div>

          <div className="map-legend">
            <span>
              <i className="legend-good"></i>
              جيد
            </span>

            <span>
              <i className="legend-medium"></i>
              متوسط
            </span>

            <span>
              <i className="legend-danger"></i>
              يحتاج تدخل
            </span>
          </div>
        </div>

        <aside className="province-panel">

          <div className="selected-province">
            <div>
              <small>SELECTED PROVINCE</small>
              <h3>{selected.name}</h3>
            </div>

            <div
              className={`score ${
                getScoreClass(selected.score)
              }`}
            >
              <strong>{selected.score}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="score-label">
            Environmental Score
          </div>

          <div className="progress">
            <div
              style={{
                width: `${selected.score}%`,
              }}
            ></div>
          </div>

          <div className="quick-indicators">

            <div className="indicator">
              <span>💧</span>
              <div>
                <small>تلوث المياه</small>
                <strong>{selected.water}%</strong>
              </div>
            </div>

            <div className="indicator">
              <span>🌳</span>
              <div>
                <small>المساحات الخضراء</small>
                <strong>{selected.green}%</strong>
              </div>
            </div>

            <div className="indicator">
              <span>☀️</span>
              <div>
                <small>الطاقة الشمسية</small>
                <strong>{selected.solar}</strong>
              </div>
            </div>

            <div className="indicator">
              <span>🌪️</span>
              <div>
                <small>العواصف الترابية</small>
                <strong>{selected.dust}</strong>
              </div>
            </div>

          </div>

          <div className="main-problem">
            <small>أبرز تحدٍ بيئي</small>

            <h4>
              {selected.water >= 70
                ? "تلوث المياه"
                : selected.desertification.includes("شديد") ||
                  selected.desertification === "مرتفع"
                ? "التصحر"
                : "الضغط البيئي"}
            </h4>

            <p>
              هذه المحافظة تحتاج إلى متابعة مستمرة
              وتحسين الحلول البيئية حسب المؤشرات الحالية.
            </p>
          </div>

          <button
            className="details-button"
            onClick={() =>
              navigate(`/province/${selected.id}`)
            }
          >
            استكشف تفاصيل المحافظة
            <span>←</span>
          </button>

        </aside>
      </section>

      <footer className="dashboard-footer">
        <span>18 محافظة</span>
        <span>•</span>
        <span>8 مؤشرات بيئية</span>
        <span>•</span>
        <span>EcoIraq ©️ 2026</span>
      </footer>
    </main>
  );
}

export default Dashboard;