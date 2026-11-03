import Link from 'next/link';
import { MODULES } from '@/data/module-features';
import { areaForModule } from '@/data/module-areas';
import { moduleDetailHref, moduleHref, moduleIdForFeatureSlug } from '@/lib/module-links';

// Shown at the foot of every module page: which area the module belongs to and
// the modules it works alongside, as plain links. Modules outside the 14
// (Reports & Analytics, the Parent App) say they are included with every plan.
export default function RelatedModules({ slug }: { slug: string }) {
  const id = moduleIdForFeatureSlug(slug);
  const area = areaForModule(id);
  const neighbours = area ? area.modules.filter((m) => m !== id) : [];

  return (
    <section className="border-t border-border bg-surface-2 py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {area ? (
          <>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-subtle">Part of</p>
            <h2 className="mt-1 text-xl font-bold text-heading">{area.title}</h2>
            <p className="mt-1 text-subtle">{area.promise}</p>
            {neighbours.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {neighbours.map((n) => {
                  const m = MODULES.find((x) => x.id === n);
                  return m ? (
                    <li key={n}>
                      <Link href={moduleDetailHref(n) ?? moduleHref(n)} className="inline-flex rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-heading transition-colors hover:border-primary/40 hover:text-primary">
                        Works with {m.title}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </>
        ) : (
          <p className="text-heading"><span className="font-semibold">Included with every plan.</span> <span className="text-subtle">This is part of the platform, not an add-on.</span></p>
        )}
        <p className="mt-5 text-sm"><Link href="/product" className="font-semibold text-primary hover:underline">See all modules</Link></p>
      </div>
    </section>
  );
}
