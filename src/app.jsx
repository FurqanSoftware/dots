import { useState, useRef, useCallback } from "preact/hooks";
import Router from "preact-router";
import { Header } from "./components/Header";
import { Results } from "./components/Results";

function Home() {
  return <section id="home" />;
}

export function App() {
  const [currentAddr, setCurrentAddr] = useState("");
  const lastTypeRef = useRef(null);

  const handleRoute = useCallback((e) => {
    const matches = e.current?.props;
    setCurrentAddr(matches?.addr || "");

    try {
      if (typeof GoSquared !== "undefined") {
        GoSquared.DefaultTracker.TrackView();
      }
    } catch {}
  }, []);

  return (
    <div class="container">
      <Header addr={currentAddr} />
      <main id="main">
        <Router onChange={handleRoute}>
          <Home path="/" />
          <Results path="/:addr/:type" lastTypeRef={lastTypeRef} />
          <Results path="/:addr" lastTypeRef={lastTypeRef} />
        </Router>
      </main>
    </div>
  );
}
