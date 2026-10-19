const link =
  "underline underline-offset-4 hover:no-underline focus-visible:no-underline";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col justify-between gap-16 px-(--gutter) pb-8 pt-8 font-sans [--gutter:1.25rem] sm:[--gutter:2rem]">
      <div className="flex max-w-xl flex-col gap-4 text-lg leading-relaxed">
        <p>
          Product manager in London, working on AI and streaming platforms.
        </p>
        <p>
          A new site is on the way. Until then, email me at{" "}
          <a className={link} href="mailto:jordan@fitmyswing.com">
            jordan@fitmyswing.com
          </a>{" "}
          or find me on{" "}
          <a className={link} href="https://www.linkedin.com/in/jordan-c-hughes">
            LinkedIn
          </a>
          .
        </p>
      </div>
      {/* Sized so the name spans the full width between the gutters. */}
      <h1 className="whitespace-nowrap text-[calc((100vw-2*var(--gutter))/6.75)] font-semibold leading-[0.9] tracking-[-0.04em]">
        Jordan Hughes
      </h1>
    </main>
  );
}
