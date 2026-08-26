import "./welcome.css";
export default function Welcome() { return ( <div className="welcome-page">
  <div className="ambient ambient-one"></div>
  <div className="ambient ambient-two"></div>

  <div className="particles">
    <span>✦</span>
    <span>✦</span>
    <span>•</span>
    <span>✦</span>
    <span>•</span>
  </div>

  <header className="navbar">

    <div className="brand">
      <div className="brand-icon">
        <span>◒</span>
      </div>

      <div>
        <h2>
          Eco<span>Iraq</span>
        </h2>
        <p>IRAQI ENVIRONMENTAL PLATFORM</p>
      </div>
    </div>

    <nav>
      <a className="active" href="/">الرئيسية</a>
      <a href="#about">عن المشروع</a>
      <a href="#contact">تواصل معنا</a>
    </nav>

    <button className="menu-button">
      <span></span>
      <span></span>
      <span></span>
    </button>

  </header>

  <main className="hero">

    <section className="hero-content">

      <div className="eyebrow">
        <span></span>
        اكتشف بيئة العراق بطريقة مختلفة
      </div>

      <h1>
        مرحباً بك في
        <strong>
          Eco<span>Iraq</span>
        </strong>
      </h1>

      <p className="hero-title">
        لأن مستقبلنا يبدأ من بيئتنا.
      </p>

      <p className="hero-description">
        منصة تفاعلية تساعدك على فهم الواقع البيئي
        في محافظات العراق، اكتشاف أهم التحديات،
        ومشاهدة الحلول وتأثيرها قبل تطبيقها.
      </p>

      <div className="actions">

        <button
          className="primary-action"
          onClick={() => {
            window.location.href = "/dashboard";
          }}
        >
          <span>استكشف المحافظات</span>
          <b>←</b>
        </button>


      </div>

      <div className="mini-info">

        <div>
          <strong>18</strong>
          <span>محافظة عراقية</span>
        </div>

        <div className="divider"></div>

        <div>
          <strong>8+</strong>
          <span>مؤشرات بيئية</span>
        </div>

        <div className="divider"></div>

        <div>
          <strong>∞</strong>
          <span>إمكانيات للحل</span>
        </div>

      </div>

    </section>

    <section className="hero-art">

      <div className="orbit orbit-one"></div>
      <div className="orbit orbit-two"></div>
      <div className="orbit orbit-three"></div>

      <div className="glowing-core">

        <div className="core-inner">
          <div className="leaf-symbol">🌱</div>
          <div className="core-text">ECO</div>
        </div>

      </div>

      <div className="floating-card card-top">
        <span className="card-icon">🌿</span>
        <div>
          <small>GREEN FUTURE</small>
          <strong>عراق أخضر</strong>
        </div>
      </div>

      <div className="floating-card card-bottom">
        <div className="score-circle">
          <span>82</span>
        </div>

        <div>
          <small>ENVIRONMENTAL</small>
          <strong>Score</strong>
        </div>
      </div>

      <div className="floating-dot dot-one"></div>
      <div className="floating-dot dot-two"></div>
      <div className="floating-dot dot-three"></div>

    </section>

  </main>

  <footer className="bottom-section">

    <div className="bottom-line"></div>

    <div className="bottom-content">

      <p>
        <span>01</span>
        افهم
      </p>

      <p>
        <span>02</span>
        قارن
      </p>

      <p>
        <span>03</span>
        جرّب
      </p>

      <p>
        <span>04</span>
        ساهم
      </p>

    </div>

    <div className="scroll">
      <span>↓</span>
      SCROLL TO EXPLORE
    </div>

  </footer>

</div>
); }