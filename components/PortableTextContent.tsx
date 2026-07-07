import type { PortableTextBlock } from "@portabletext/types";
import { PortableText, type PortableTextComponents } from "next-sanity";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-10 font-serif text-2xl leading-snug md:mt-12 md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 font-serif text-xl leading-snug md:text-2xl">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 font-serif text-base leading-relaxed text-black/80 md:text-lg">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l border-black/20 pl-4 font-serif text-base italic leading-relaxed text-black/70 md:text-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className="underline underline-offset-4 transition-opacity hover:opacity-60"
          {...(isExternal ? { rel: "noreferrer noopener", target: "_blank" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-4 list-disc space-y-2 pl-5 font-serif text-base leading-relaxed text-black/80 md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2 pl-5 font-serif text-base leading-relaxed text-black/80 md:text-lg">
        {children}
      </ol>
    ),
  },
};

type PortableTextContentProps = {
  value: PortableTextBlock[];
};

export default function PortableTextContent({ value }: PortableTextContentProps) {
  return <PortableText value={value} components={components} />;
}
