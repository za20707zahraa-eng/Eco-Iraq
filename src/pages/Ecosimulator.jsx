import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { provinces } from "../data/provinces";
import "./EcoSimulator.css";

function getScoreClass(score) {
  if (score >= 70) return "good";
  if (score >= 50) return "medium";
  return "danger";
}

function EcoSimulator() {
  const { id } = useParams();

  const initialProvince =
    provinces.find(
      (p) => String(p.id).toLowerCase() === String(id).toLowerCase()
    ) || provinces[0];

  const [selectedId, setSelectedId] = useState(initialProvince.id);
  const [greenIncrease, setGreenIncrease] = useState(0);
  const [waterReduction, setWaterReduction] = useState(0);
  const [dustReduction, setDustReduction] = useState(0);
  const [desertificationReduction, setDesertificationReduction] = useState(0);
  const [solarIncrease, setSolarIncrease] = useState(0);
  const [activeTheme, setActiveTheme] = useState("default");

  useEffect(() => {
    if (id) {
      const found = provinces.find(
        (p) => String(p.id).toLowerCase() === String(id).toLowerCase()
      );

      if (found) {
        setSelectedId(found.id);
      }
    }
  }, [id]);

  const selectedProvince =
    provinces.find((province) => province.id === selectedId) || provinces[0];

  const newScore = Math.min(
    100,
    Math.round(
      selectedProvince.score +
        greenIncrease * 0.4 +
        waterReduction * 0.3 +
        dustReduction * 0.2 +
        desertificationReduction * 0.2 +
        solarIncrease * 0.2
    )
  );

  return (
    <main className={`eco-simulator ${activeTheme}`} dir="rtl">
      <header className="simulator-header">
        <small>ECO IRAQ</small>

        <h1>Eco Simulator</h1>

        <p>
          جرّب الحلول البيئية وشوف شلون ممكن تتغير حالة المحافظة.
        </p>
      </header>

      <section className="simulator-container">

        <div className="simulator-card">
          <h2>اختر المحافظة</h2>

          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setActiveTheme("default");
            }}
          >
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.name}
              </option>
            ))}
          </select>

          <div className="province-info">
            <h3>{selectedProvince.name}</h3>

            <p>
              التقييم الحالي:
              <strong className={getScoreClass(selectedProvince.score)}>
                {" "}
                {selectedProvince.score}/100
              </strong>
            </p>

            <p>
              تلوث المياه:
              <strong>{selectedProvince.water}%</strong>
            </p>

            <p>
              المساحات الخضراء:
              <strong>{selectedProvince.green}%</strong>
            </p>

            <p>
              الطاقة الشمسية:
              <strong>{selectedProvince.solar}</strong>
            </p>

            <p>
              العواصف الترابية:
              <strong>{selectedProvince.dust}</strong>
            </p>

            <p>
              التصحر:
              <strong>{selectedProvince.desertification}</strong>
            </p>

            <p>
              النفط:
              <strong>{selectedProvince.oil}</strong>
            </p>

            <p>
              إجهاد المياه:
              <strong>{selectedProvince.waterStress}</strong>
            </p>

            <p>
              درجة الحرارة:
              <strong>
                {selectedProvince.temperature !== null
                  ? `${selectedProvince.temperature}°C`
                  : "غير متوفرة"}
              </strong>
            </p>
          </div>
        </div>

        <div className="simulator-card">
          <h2>جرّب الحلول 🌱</h2>

          <label>
            زيادة المساحات الخضراء
            <strong>+{greenIncrease}%</strong>
          </label>

          <input
            type="range"
            min="0"
            max="50"
            value={greenIncrease}
            onChange={(e) => {
              setGreenIncrease(Number(e.target.value));
              setActiveTheme("green-theme");
            }}
          />

          <label>
            تقليل تلوث المياه
            <strong>-{waterReduction}%</strong>
          </label>

          <input
            type="range"
            min="0"
            max="50"
            value={waterReduction}
            onChange={(e) => {
              setWaterReduction(Number(e.target.value));
              setActiveTheme("water-theme");
            }}
          />

          <label>
            تقليل العواصف الترابية
            <strong>-{dustReduction}%</strong>
          </label>

          <input
            type="range"
            min="0"
            max="50"
            value={dustReduction}
            onChange={(e) => {
              setDustReduction(Number(e.target.value));
              setActiveTheme("dust-theme");
            }}
          />

          <label>
            مكافحة التصحر
            <strong>+{desertificationReduction}%</strong>
          </label>

          <input
            type="range"
            min="0"
            max="50"
            value={desertificationReduction}
            onChange={(e) => {
              setDesertificationReduction(Number(e.target.value));
              setActiveTheme("desert-theme");
            }}
          />

          <label>
            زيادة الطاقة الشمسية
            <strong>+{solarIncrease}%</strong>
          </label>

          <input
            type="range"
            min="0"
            max="50"
            value={solarIncrease}
            onChange={(e) => {
              setSolarIncrease(Number(e.target.value));
              setActiveTheme("solar-theme");
            }}
          />
        </div>

        <div className="simulator-result">
          <small>EXPECTED ENVIRONMENTAL SCORE</small>

          <div className={`result-score ${getScoreClass(newScore)}`}>
            {newScore}
            <span>/100</span>
          </div>

          <p>
            التقييم الحالي:
            <strong>{selectedProvince.score}/100</strong>
          </p>

          <p>
            التقييم المتوقع بعد تطبيق الحلول:
          </p>

          <h3>{newScore}/100</h3>

          {newScore >= 70 ? (
            <div className="result-message">
              🌿 حالة بيئية جيدة جدًا
            </div>
          ) : newScore >= 50 ? (
            <div className="result-message">
              🌱 تحسن جيد، لكن ما زالت هناك حاجة للمزيد من الحلول
            </div>
          ) : (
            <div className="result-message">
              ⚠️ المحافظة ما زالت تحتاج إلى تدخلات بيئية أكبر
            </div>
          )}
        </div>

      </section>
    </main>
  );
}

export default EcoSimulator;