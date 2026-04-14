import { useState, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { TabNav } from "./TabNav";
import { ResultSection } from "./ResultSection";
import { getAddrKind } from "../lib/address";
import { QUERIES } from "../lib/queries";
import { query as apiQuery } from "../lib/api";

export function Results({ addr, type, lastTypeRef }) {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addrKind = getAddrKind(addr);

  if (!addrKind) {
    return <div role="alert">Invalid address</div>;
  }

  if (!type) {
    const defaultType =
      lastTypeRef.current &&
      QUERIES[lastTypeRef.current] &&
      QUERIES[lastTypeRef.current].types.includes(addrKind)
        ? lastTypeRef.current
        : addrKind === "IP"
          ? "rdns"
          : "a";
    route("/" + addr + "/" + defaultType, true);
    return null;
  }

  useEffect(() => {
    lastTypeRef.current = type;
    document.title = "Dots \u2013 " + addr;

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
        records={records}
        loading={loading}
        error={error}
      />
    </section>
  );
}
