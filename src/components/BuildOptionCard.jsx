/**
 * BuildOptionCard - consistent selection card for build steps.
 *
 * States:
 *   selected  → cyan (secondary) background, translated, shadow-none
 *   default   → cream (surface-bright), hoverable with shadow shift
 *
 * The `tilt` prop keeps the "fun unevenness" — each card can have a
 * slight different rotation (e.g. "-rotate-1", "rotate-1", "rotate-0").
 *
 * @param {string}   img        image URL
 * @param {string}   alt        image alt text
 * @param {string}   name       option name
 * @param {string}   desc       short description
 * @param {boolean}  selected   is this the chosen option?
 * @param {string}   tilt       tailwind rotate class e.g. "-rotate-1"
 * @param {node}     badge      optional badge node (e.g. POPULAR, SPICY!)
 * @param {function} onClick
 */
const BuildOptionCard = ({
  img, alt, name, desc,
  selected = false,
  tilt = '',
  badge = null,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`
      group relative flex items-center border-[3px] border-outline p-1 transition-all cursor-pointer
      ${tilt}
      ${selected
        ? 'bg-secondary translate-x-[3px] translate-y-[3px] shadow-none'
        : 'bg-surface-bright neo-brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
      }
    `}
  >
    {/* Image thumbnail — same size on all pages */}
    <div className="w-24 h-24 shrink-0 border-r-[3px] border-outline overflow-hidden">
      <img
        src={img}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Text */}
    <div className="flex-1 px-4 py-2">
      <h3 className="font-headline font-bold text-xl uppercase italic text-on-background leading-tight mb-0.5">
        {name}
      </h3>
      <p className="text-xs font-body text-on-surface-variant leading-snug">{desc}</p>
    </div>

    {/* Selection indicator */}
    <div className="pr-3">
      <div className={`w-8 h-8 rounded-full border-[3px] border-outline flex items-center justify-center transition-colors ${
        selected ? 'bg-outline' : 'bg-surface-container-low group-hover:bg-secondary/40'
      }`}>
        {selected && (
          <span className="material-symbols-outlined text-surface text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            check
          </span>
        )}
      </div>
    </div>

    {/* Optional floating badge (POPULAR, SPICY!, etc.) */}
    {badge}
  </div>
)

export default BuildOptionCard
