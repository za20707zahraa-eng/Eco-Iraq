import {
  Map,
  Layers3,
  Leaf,
  Droplets,
  BarChart3,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: Map,
    path: "/",
  },
  {
    label: "Province Details",
    icon: Layers3,
    path: "/provinces",
  },
  {
    label: "Eco Simulator",
    icon: Leaf,
    path: "/simulator",
  },
  {
    label: "Incident Reporter",
    icon: Droplets,
    path: "/reporter",
  },
  {
    label: "Reports & Comparison",
    icon: BarChart3,
    path: "/reports",
  },
];

function Sidebar({ activeItem = "Dashboard", onNavigate }) {
  return (
    <aside
      className="
        fixed
        left-5
        top-5
        bottom-5
        z-40
        hidden
        w-[250px]
        flex-col
        overflow-hidden
        rounded-[28px]
        border
        border-white/[0.10]
        bg-[#071E1D]/60
        shadow-[0_25px_70px_rgba(0,0,0,0.30)]
        backdrop-blur-[24px]
        lg:flex
      "
    >
      {/* Decorative glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-[#2DD4BF]/10
          blur-3xl
        "
      />

      {/* Logo */}
      <div className="relative px-6 pb-7 pt-7">
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-2xl
              border
              border-[#4FE0CF]/20
              bg-[#4FE0CF]/10
              text-[#5EE7D8]
              shadow-[0_0_25px_rgba(45,212,191,0.08)]
            "
          >
            <Leaf size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-[19px] font-bold tracking-tight text-white">
              EcoIraq
            </h1>

            <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.22em] text-white/35">
              Environmental Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/[0.06]" />

      {/* Navigation */}
      <nav className="relative flex-1 px-3 pt-6">
        <p className="mb-3 px-3 text-[8px] font-bold uppercase tracking-[0.22em] text-white/25">
          Navigation
        </p>

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeItem === item.label;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() =>
                  onNavigate?.(item)
                }
                className={`
                  group
                  relative
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-2xl
                  px-3
                  py-3
                  text-left
                  transition-all
                  duration-300
                  ${
                    isActive
                      ? "border border-[#4FE0CF]/15 bg-[#4FE0CF]/10 text-white shadow-[0_8px_30px_rgba(45,212,191,0.06)]"
                      : "border border-transparent text-white/40 hover:border-white/[0.06] hover:bg-white/[0.035] hover:text-white/80"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-6
                      w-[3px]
                      -translate-y-1/2
                      rounded-r-full
                      bg-[#4FE0CF]
                      shadow-[0_0_12px_rgba(79,224,207,0.7)]
                    "
                  />
                )}

                <span
                  className={`
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "bg-[#4FE0CF]/10 text-[#5EE7D8]"
                        : "bg-white/[0.025] text-white/35 group-hover:bg-white/[0.05] group-hover:text-white/70"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="text-[12px] font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom status */}
      <div className="relative p-4">
        <div
          className="
            rounded-2xl
            border
            border-white/[0.07]
            bg-white/[0.025]
            p-4
          "
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34D399]/50" />

              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34D399]" />
            </span>

            <span className="text-[10px] font-medium text-white/55">
              System Online
            </span>
          </div>

          <p className="mt-2 text-[9px] leading-4 text-white/25">
            Iraq environmental monitoring
            system.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;