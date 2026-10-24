import { useRef, type KeyboardEvent } from "react";
import { tabs, type PortfolioTab } from "../data/portfolio";
import { wrap } from "../lib/timeline";

export function PortfolioTabs({ selected, onSelect }: {
  selected: PortfolioTab;
  onSelect: (tab: PortfolioTab) => void;
}) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function onKeyDown(event: KeyboardEvent, index: number) {
    const next = event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : event.key === "ArrowRight" ? wrap(index + 1, tabs.length)
      : event.key === "ArrowLeft" ? wrap(index - 1, tabs.length)
      : null;
    if (next === null) return;
    event.preventDefault();
    onSelect(tabs[next].id);
    buttons.current[next]?.focus();
  }
  return (
    <div className="tabs" role="tablist" aria-label="Portfolio sections">
      {tabs.map((tab, index) => (
        <button
          type="button"
          key={tab.id}
          ref={(element) => { buttons.current[index] = element; }}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={selected === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={selected === tab.id ? 0 : -1}
          onClick={() => onSelect(tab.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span className="tab-number" aria-hidden="true">0{index + 1}</span>
          {tab.label}
          {tab.id === "hello" && <span className="tab-arrow" aria-hidden="true">↗</span>}
        </button>
      ))}
    </div>
  );
}
