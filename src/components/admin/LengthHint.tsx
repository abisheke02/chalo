// A small line under a title or description box that says how long the text is and whether that suits search results.
// Green inside the range, amber a little outside it, red far outside. It never blocks saving.
export default function LengthHint({ value, min, max, label }: { value: string; min: number; max: number; label: string }) {
  const n = value.trim().length;
  const empty = n === 0;
  const tone = empty ? 'text-slate-500' : n >= min && n <= max ? 'text-emerald-600' : n < min / 2 || n > max * 1.25 ? 'text-red-600' : 'text-amber-600';
  const advice = empty
    ? `Aim for ${min} to ${max} characters.`
    : n < min
      ? `A little short. Aim for ${min} to ${max}.`
      : n > max
        ? `Too long: search results may cut it off. Aim for ${min} to ${max}.`
        : 'Good length for search results.';
  return (
    <p className={`mt-1 text-xs ${tone}`} aria-live="polite">
      {label}: {n} characters. {advice}
    </p>
  );
}
