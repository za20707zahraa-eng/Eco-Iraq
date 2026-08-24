import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({
  children,
  activeItem = "Dashboard",
  onNavigate,
  title = "Dashboard",
  subtitle = "Environmental Intelligence",
}) {
  return (
    <div
      dir="ltr"
      className="
        min-h-screen
        overflow-x-hidden
        bg-[#061B1A]
        text-white
      "
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#14B8A6]/10
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -right-40
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#22C55E]/10
            blur-[130px]
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[450px]
            w-[450px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#0EA5E9]/[0.025]
            blur-[140px]
          "
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        activeItem={activeItem}
        onNavigate={onNavigate}
      />

      {/* Main content */}
      <div
        className="
          relative
          min-h-screen
          lg:pl-[290px]
        "
      >
        <Header
          title={title}
          subtitle={subtitle}
        />

        <main className="relative min-h-[calc(100vh-76px)]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;