/**
 * BuildNextButton - consistent "next step" CTA button for the build flow.
 *
 * @param {string}   label    e.g. "NEXT: PROTEIN"
 * @param {string}   price    optional price pill (used on final step)
 * @param {function} onClick
 */
const BuildNextButton = ({ label, price, onClick }) => (
  <div className="fixed bottom-20 left-0 w-full px-6 pb-4 z-40">
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onClick}
        className="w-full bg-primary text-on-primary py-5 px-6 border-[3px] border-outline neo-brutal-shadow font-headline font-bold text-2xl uppercase tracking-tighter flex justify-between items-center transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-[0.98] group"
      >
        <span>{label}</span>
        {price
          ? <span className="bg-outline text-surface px-3 py-1 text-lg font-bold">{price}</span>
          : <span className="material-symbols-outlined text-3xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
        }
      </button>
    </div>
  </div>
)

export default BuildNextButton
