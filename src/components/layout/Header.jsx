import {
  Bell,
  ChevronRight,
  Leaf,
} from "lucide-react";

function Header({
  title = "Dashboard",
  subtitle = "Environmental Intelligence",
}) {
  return (
    <header
      className="
        relative
        z-30
        flex
        h-[76px]
        items-center
        justify-between
        border-b
        border-white/[0.07]
        bg-[#071D1C]/35
        px-5
        backdrop-blur-[22px]
        sm:px-7
        lg:px-9
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Small brand icon */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-[#4FE0CF]/15
            bg-[#4FE0CF]/[0.07]
            text-[#5EE7D8]
            lg:hidden
          "
        >
          <Leaf size={17} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/25">
              EcoIraq
            </span>

            <ChevronRight
              size={10}
              className="text-white/15"
            />

            <span className="text-[9px] font-medium text-[#5EE7D8]/65">
              {subtitle}
            </span>
          </div>

          <h2 className="mt-1 text-[17px] font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Status */}
        <div
          className="
            hidden
            items-center
            gap-2
            rounded-full
            border
            border-white/[0.07]
            bg-white/[0.035]
            px-3
            py-2
            sm:flex
          "
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/50" />

            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[9px] font-medium text-white/40">
            Monitoring Active
          </span>
        </div>

        {/* Notification */}
        <button
          type="button"
          className="
            relative
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.07]
            bg-white/[0.035]
            text-white/40
            transition-all
            duration-200
            hover:border-[#4FE0CF]/15
            hover:bg-[#4FE0CF]/[0.07]
            hover:text-[#5EE7D8]
          "
          aria-label="Notifications"
        >
          <Bell size={15} />

          <span
            className="
              absolute
              right-2
              top-2
              h-1.5
              w-1.5
              rounded-full
              bg-[#4FE0CF]
              shadow-[0_0_8px_rgba(79,224,207,0.7)]
            "
          />
        </button>

        {/* Profile */}
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-[#4FE0CF]/15
            bg-gradient-to-br
            from-[#4FE0CF]/15
            to-[#22C55E]/10
            text-[10px]
            font-bold
            text-[#5EE7D8]
          "
        >
          IQ
        </div>
      </div>
    </header>
  );
}

export default Header;