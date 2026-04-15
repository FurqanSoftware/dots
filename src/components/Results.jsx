import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { TabNav } from "./TabNav";
import { ResultSection } from "./ResultSection";
import { getAddrKind } from "../lib/address";
import { TABS } from "../lib/queries";
import { query as apiQuery } from "../lib/api";

const TAB_KEYS = new Set(TABS.map((t) => t.key));

export function Results({ addr, type, lastTypeRef }) {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addrKind = getAddrKind(addr);

  if (!addrKind) {
    return <div role="alert">Invalid address</div>;
  }

  if (!type || !TAB_KEYS.has(type)) {
    const defaultType =
      lastTypeRef.current && TAB_KEYS.has(lastTypeRef.current)
        ? lastTypeRef.current
        : "dns";
    route("/" + addr + "/" + defaultType, true);
    return null;
  }

  useEffect(() => {
    lastTypeRef.current = type;
    document.title = "Dots \u2013 " + addr;

    if (type === "dns") return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setRecords(null);

    apiQuery(type, addr)
      .then((data) => {
        if (!cancelled) setRecords(data);
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.status === 429) {
            setError("Too many requests. Please try again shortly.");
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [addr, type]);

  return (
    <section id="results">
      <TabNav addr={addr} activeType={type} addrKind={addrKind} />
      <ResultSection
        type={type}
        addr={addr}
        addrKind={addrKind}
        records={records}
        loading={loading}
        error={error}
      />
    </section>
  );
}
