import type { ReactNode } from "react";

type LegalPageProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-xl uppercase tracking-wide text-black md:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return (
    <p className="font-serif text-sm leading-relaxed text-black/80 md:text-base">
      {children}
    </p>
  );
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 font-serif text-sm leading-relaxed text-black/80 md:text-base">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: LegalPageProps) {
  return (
    <main className="w-full">
      <section className="bg-white px-4 pt-32 pb-20 text-black md:px-8 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-serif text-4xl uppercase leading-[1.12] md:text-6xl">
            {title}
          </h1>
          {lastUpdated ? (
            <p className="mt-6 text-xs uppercase tracking-wide text-black/50">
              Dernière mise à jour : {lastUpdated}
            </p>
          ) : null}
          <div className="mt-12 space-y-10">{children}</div>
        </div>
      </section>
    </main>
  );
}
