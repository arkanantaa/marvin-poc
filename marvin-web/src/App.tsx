import { useRef } from "react";
import { EntranceJourney } from "./components/EntranceJourney";
import "./styles/site.css";
export default function App() {
  const home = useRef<HTMLAnchorElement>(null);
  return (
    <>
      <header className="site-header">
        <a
          className="wordmark"
          href="#home"
          ref={home}
          aria-label="Marvin Studio home"
        >
          marvin <span>STUDIO</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">
            Our work <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main>
        <h1 className="sr-only">Marvin Studio photobooth portfolio</h1>
        <EntranceJourney homeRef={home} />
      </main>
    </>
  );
}
