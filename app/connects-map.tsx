"use client";

import { useEffect, useRef } from "react";

// Alex's "How it connects" map. The section stays hidden until this script runs,
// so without JavaScript the page simply skips it.

type Place = {
  id: string;
  name: string;
  full?: string;
  years: string;
  big?: boolean;
  side?: boolean;
  to: string[];
  line: string;
};

type Item = {
  id: string;
  name: string;
  full?: string;
  years?: string;
  big?: boolean;
  side?: boolean;
  kind: "place" | "thread";
  to: string[];
  line: string;
  meta: string;
  label: string;
  x: number;
  y: number;
};

type Link = { a: string; b: string; path: SVGPathElement; len: number };
type Pulse = Link & { rev: boolean; off: number; dot: SVGCircleElement };

const places: Place[] = [
  { id: "sky", name: "Sky", years: "2020 to now", big: true, to: ["product", "ai", "people", "eng"],
    line: "From Technology Graduate to Senior Product Manager, Group AI." },
  { id: "toyota", name: "Toyota (GB)", years: "2018 to 2019", to: ["eng", "people"],
    line: "Systems Analyst on IT for the UK dealer network." },
  { id: "lboro", name: "Loughborough", full: "Loughborough University", years: "2016 to 2020", to: ["eng"],
    line: "Bachelor’s in Computer Science, First Class." },
  { id: "fms", name: "FitMySwing", years: "2025 to now", side: true, to: ["ai", "product"],
    line: "My own project: AI that makes golf club fitting accessible to everyone." },
  { id: "sis", name: "SIS", years: "2021 to now", side: true, to: ["people", "live"],
    line: "Part-time, running live esports streams and the team behind them." },
];
const threads = [
  { id: "product", name: "Product", line: "From the problem to something people use, then proof it was worth building." },
  { id: "ai", name: "AI", line: "Building AI products that earn their place, at work and on the side." },
  { id: "people", name: "People", line: "Keeping stakeholders, engineers and operators pointed the same way, calmly." },
  { id: "eng", name: "Engineering", line: "A computer scientist first. I still write the code, now mostly alongside AI." },
  { id: "live", name: "Live operations", line: "Running live streams, where any mistake goes out on air." },
];
const tour = ["sky", "product", "ai", "people", "toyota", "eng", "lboro", "fms", "sis", "live"];

const and = (names: string[]) => names.join(", ").replace(/, ([^,]*)$/, " and $1");

function items(): Item[] {
  return [
    ...places.map((p) => ({
      ...p,
      kind: "place" as const,
      meta: p.years + (p.side ? " · on the side" : ""),
      label: `${p.full || p.name}, ${p.years}${p.side ? ", on the side" : ""}`,
      x: 0,
      y: 0,
    })),
    ...threads.map((t) => ({
      ...t,
      kind: "thread" as const,
      to: [],
      meta: "At " + and(places.filter((p) => p.to.includes(t.id)).map((p) => p.name)),
      label: t.name,
      x: 0,
      y: 0,
    })),
  ];
}

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | boolean>,
  parent: Element,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return parent.appendChild(e);
}

function fill(root: Element, d: Item) {
  root.querySelector(".mk")!.className = `mk ${d.kind}${d.side ? " side" : ""}`;
  root.querySelector(".cap-name")!.textContent = d.full || d.name;
  root.querySelector(".cap-meta")!.textContent = d.meta;
  root.querySelector(".cap-line")!.textContent = d.line;
}

function mount(section: HTMLElement, svg: SVGSVGElement, wrap: HTMLElement, card: HTMLElement, capText: HTMLElement) {
  const all = items();
  const byId = Object.fromEntries(all.map((n) => [n.id, n]));
  const placeItems = all.filter((n) => n.kind === "place");
  const threadItems = all.filter((n) => n.kind === "thread");
  const wide = matchMedia("(min-width: 45em)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stop = new AbortController();
  const { signal } = stop;

  let width = 0, scale = 1, selected = "sky";
  let nodes: Record<string, SVGGElement> = {}, links: Link[] = [], pulses: Pulse[] = [];
  let pulseLayer: SVGGElement;
  let auto = !reduce, held = false, visible = false, drawn = false, scrolledTo = false;
  let timer: ReturnType<typeof setTimeout> | undefined, raf = 0;

  function build() {
    if (!svg.clientWidth) return;
    width = svg.clientWidth;
    const focused = svg.contains(document.activeElement) && document.activeElement?.getAttribute("data-id");
    // Grow with the reader's text size while the map still fits; shrink it on very narrow screens.
    scale = Math.min(parseFloat(getComputedStyle(document.documentElement).fontSize) / 16, width / 320);
    const W = width / scale, H = 326;
    const L = Math.max(126, W * 0.34), R = W - Math.max(130, W * 0.33);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.setAttribute("height", String(H * scale));
    svg.textContent = "";
    nodes = {};
    links = [];

    const linkLayer = el("g", { "aria-hidden": "true" }, svg);
    pulseLayer = el("g", { class: "pulses", "aria-hidden": "true" }, svg);
    el("text", { class: "group", x: L - 18, y: 196, "text-anchor": "end", "aria-hidden": "true" }, svg).textContent = "On the side";
    [30, 88, 146, 238, 296].forEach((y, i) => Object.assign(placeItems[i], { x: L, y }));
    threadItems.forEach((t, i) => Object.assign(t, { x: R, y: 30 + i * 66.5 }));

    for (const p of placeItems) for (const id of p.to) {
      const t = byId[id], mx = (p.x + t.x) / 2;
      const path = el("path", {
        class: "link", pathLength: 1, style: `--d: ${(links.length * 0.07).toFixed(2)}s`,
        d: `M${p.x} ${p.y}C${mx} ${p.y} ${mx} ${t.y} ${t.x} ${t.y}`,
      }, linkLayer);
      links.push({ a: p.id, b: id, path, len: path.getTotalLength() });
    }

    for (const d of all) {
      const place = d.kind === "place";
      const g = el("g", { class: `node ${d.kind}${d.side ? " side" : ""}`, tabindex: 0, role: "button", "aria-label": d.label, "data-id": d.id }, svg);
      const x = place ? 0 : d.x - 22, w = place ? d.x + 22 : W - x;
      el("rect", { class: "hit", x, y: d.y - 28, width: w, height: 56 }, g);
      el("rect", { class: "ring", x: x + 2, y: d.y - 26, width: w - 4, height: 52, rx: 8 }, g);
      if (place) {
        el("circle", { class: "dot", cx: d.x, cy: d.y, r: d.big ? 8 : 6 }, g);
        el("text", { class: "place-name", x: d.x - 18, y: d.y - 1, "text-anchor": "end" }, g).textContent = d.name;
        el("text", { class: "yrs", x: d.x - 18, y: d.y + 16, "text-anchor": "end" }, g).textContent = d.years!;
      } else {
        el("rect", { class: "dot", x: d.x - 6, y: d.y - 6, width: 12, height: 12, rx: 1.5 }, g);
        el("text", { class: "thread-name", x: d.x + 18, y: d.y + 5 }, g).textContent = d.name;
      }
      nodes[d.id] = g;
    }

    paint();
    fit();
    if (focused) nodes[focused].focus();
  }

  // Light the selected node, its links and its neighbours, fill the caption and restart the pulses.
  function paint() {
    const d = byId[selected], near = new Set([selected]);
    for (const l of links) {
      const on = l.a === selected || l.b === selected;
      l.path.classList.toggle("on", on);
      if (on) near.add(l.a === selected ? l.b : l.a);
    }
    for (const id in nodes) {
      nodes[id].classList.toggle("on", near.has(id));
      nodes[id].classList.toggle("sel", id === selected);
      nodes[id].setAttribute("aria-pressed", String(id === selected));
    }
    fill(capText, d);
    placeCard();

    // Two pulses per lit link, travelling away from the selected node.
    pulseLayer.textContent = "";
    pulses = [];
    if (reduce) return;
    links.filter((l) => l.path.classList.contains("on")).forEach((l, i) => {
      for (const k of [0, 0.5]) pulses.push({ ...l, rev: d.kind === "thread", off: k + i * 0.13, dot: el("circle", { r: 3, opacity: 0 }, pulseLayer) });
    });
  }

  // Below the map, the caption holds the height of the longest one so the page under it never jumps.
  function fit() {
    if (!width) return;
    let tallest = 0;
    if (!wide.matches) {
      const probe = card.appendChild(capText.cloneNode(true) as HTMLElement);
      probe.removeAttribute("aria-live");
      probe.style.cssText = "visibility: hidden";
      for (const d of all) { fill(probe, d); tallest = Math.max(tallest, probe.offsetHeight); }
      probe.remove();
    }
    capText.style.minHeight = tallest ? `${tallest}px` : "";
    placeCard();
  }

  function placeCard() {
    const y = (byId[selected].y - 26) * scale;
    card.style.transform = wide.matches ? `translateY(${Math.max(0, Math.min(y, svg.clientHeight - card.offsetHeight))}px)` : "";
  }

  function select(id: string) {
    selected = id;
    paint();
    if (!reduce) capText.animate([{ opacity: 0, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], { duration: 260, easing: "ease-out" });
  }

  // A click, tap, Enter or keyboard focus stops the tour for good and lets screen readers hear the caption.
  function choose(id: string) {
    auto = false;
    play();
    capText.setAttribute("aria-live", "polite");
    if (id === selected) fill(capText, byId[id]);
    else select(id);
  }

  // The map tours itself while it's on screen until someone uses it. Pointing at it holds the tour.
  function play() {
    clearTimeout(timer);
    if (auto && visible && drawn && !held) timer = setTimeout(() => {
      select(tour[(tour.indexOf(selected) + 1) % tour.length]);
      play();
    }, 3800);
  }

  function frame(now: number) {
    for (const p of pulses) {
      const t = (now / 1700 + p.off) % 1;
      const pt = p.path.getPointAtLength((p.rev ? 1 - t : t) * p.len);
      p.dot.setAttribute("cx", String(pt.x));
      p.dot.setAttribute("cy", String(pt.y));
      p.dot.setAttribute("opacity", Math.sin(t * Math.PI).toFixed(2));
    }
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

  const nodeOf = (e: Event) => (e.target as Element).closest(".node")?.getAttribute("data-id");
  svg.addEventListener("click", (e) => { const id = nodeOf(e); if (id) choose(id); }, { signal });
  svg.addEventListener("focusin", (e) => { const id = nodeOf(e); if (id) choose(id); }, { signal });
  svg.addEventListener("keydown", (e) => {
    const id = nodeOf(e);
    if (id && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); choose(id); }
  }, { signal });
  svg.addEventListener("pointerover", (e) => {
    const id = nodeOf(e);
    if (id && id !== selected && e.pointerType === "mouse" && !scrolledTo) select(id);
  }, { signal });
  // After a Career heading scrolls the page under a still mouse, wait for the mouse to move
  // before hovering picks something else.
  document.addEventListener("pointermove", (e) => {
    if (!scrolledTo || (!e.movementX && !e.movementY)) return;
    scrolledTo = false;
    const id = nodeOf(e);
    if (id && id !== selected) select(id);
  }, { signal });
  wrap.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") { held = true; play(); } }, { signal });
  wrap.addEventListener("pointerleave", () => { held = false; play(); }, { signal });

  // The Career and On the side entries point at the map too (data-place in page.tsx). Pointing
  // at one lights it up; clicking its heading picks it and brings the map into view.
  for (const org of document.querySelectorAll<HTMLElement>("[data-place]")) {
    const id = org.dataset.place!;
    org.addEventListener("pointerenter", (e) => {
      if (e.pointerType !== "mouse" || scrolledTo) return;
      held = true;
      play();
      if (id !== selected) select(id);
    }, { signal });
    org.addEventListener("pointerleave", () => { held = false; play(); }, { signal });
    org.querySelector(".org-head")!.addEventListener("click", (e) => {
      if ((e.target as Element).closest("a") || getSelection()?.toString()) return;
      choose(id);
      const box = svg.getBoundingClientRect();
      if (box.top >= 0 && box.bottom <= innerHeight) return;
      scrolledTo = true;
      section.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }, { signal });
  }
  document.body.classList.add("map-on");

  section.hidden = false;
  build();

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!drawn && width && e.intersectionRatio >= 0.3) {
      drawn = true;
      requestAnimationFrame(() => svg.classList.add("drawn"));
    }
    if (visible && drawn && !raf && !reduce) raf = requestAnimationFrame(frame);
    play();
  }, { threshold: [0, 0.3] });
  io.observe(svg);
  const ro = new ResizeObserver(() => { if (svg.clientWidth !== width) build(); });
  ro.observe(svg);
  document.fonts?.addEventListener("loadingdone", fit, { signal });

  return () => {
    stop.abort();
    io.disconnect();
    ro.disconnect();
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    svg.classList.remove("drawn");
    document.body.classList.remove("map-on");
  };
}

export function ConnectsMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const capTextRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => mount(sectionRef.current!, svgRef.current!, wrapRef.current!, cardRef.current!, capTextRef.current!),
    [],
  );

  return (
    <section id="map" aria-labelledby="connects" hidden ref={sectionRef}>
      <h2 id="connects">How it connects</h2>
      <p className="note">
        Where I’ve worked, and what each place has in common. Point at or tap any name.
      </p>
      <div className="net-wrap" ref={wrapRef}>
        {/* tabIndex -1: the names inside are the tab stops, not the drawing around them. */}
        <svg id="net" role="group" aria-label="Places and what they have in common" tabIndex={-1} ref={svgRef} />
        <div className="caption" ref={cardRef}>
          <div className="cap-text" aria-live="off" ref={capTextRef}>
            <p className="cap-title">
              <span className="mk" aria-hidden="true" />
              <span className="cap-name" />
            </p>
            <p className="cap-meta" />
            <p className="cap-line" />
          </div>
        </div>
      </div>
    </section>
  );
}
