/**
 * BuildPageHeader - consistent heading for all 3 build steps.
 *
 * Layout:
 *   - Small rotated "Custom Creation" badge (top-left, cyan) — same on all
 *   - Big 2-line headline: verb line + coloured keyword line
 *   - Left orange accent border on the whole block (neo-brutalist)
 *
 * @param {string} verb      - e.g. "PICK YOUR", "CHOOSE", "SAUCE IT UP"
 * @param {string} keyword   - e.g. "BASE", "PROTEIN", "SAUCE"  (shown in primary colour)
 */
const BuildPageHeader = ({ verb, keyword }) => (
  <div className="mb-8 relative pl-4 border-l-[6px] border-primary">
    {/* Playful rotated badge — same every step, keeps the "fun unevenness" */}
    <div className="absolute -top-3 -left-3 bg-secondary text-on-secondary px-3 py-0.5 font-headline font-bold text-[10px] uppercase border-[2px] border-outline -rotate-3 neo-brutal-shadow-sm z-10">
      Custom Build
    </div>

    <h2 className="font-headline font-bold text-4xl uppercase leading-none tracking-tighter text-on-background">
      {verb}
      {keyword && (
        <>
          <br />
          <span className="text-primary italic">{keyword}</span>
        </>
      )}
    </h2>
  </div>
)

export default BuildPageHeader
