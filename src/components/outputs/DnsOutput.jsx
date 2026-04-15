import { useState, useEffect } from "preact/hooks";
import { QUERIES, DNS_QUERIES, RDNS_QUERIES } from "../../lib/queries";
import { query as apiQuery } from "../../lib/api";
import { TableOutput } from "./TableOutput";
import { KVTableOutput } from "./KVTableOutput";

export function DnsOutput({ addr, addrKind }) {
  const [results, setResults] = useState({});

  const queryKeys = addrKind === "IP" ? RDNS_QUERIES : DNS_QUERIES;

  useEffect(() => {
    setResults({});
    let cancelled = false;

    queryKeys.forEach((key) => {
      apiQuery(key, addr)
        .then((records) => {
          if (!cancelled) {
            setResults((prev) => ({ ...prev, [key]: { records } }));
          }
        })
        .catch(() => {
          if (!cancelled) {
            setResults((prev) => ({ ...prev, [key]: { records: [] } }));
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [addr, addrKind]);

  return (
    <div class="dns-output">
      {queryKeys.map((key) => {
        const query = QUERIES[key];
        const result = results[key];

        if (!result) {
          return (
            <div key={key} class="loading-indicator" aria-busy="true" />
          );
        }

        if (result.records.length === 0) return null;

        return (
          <details key={key} open>
            <summary>{query.label}</summary>
            {query.output === "kvtable" ? (
              <KVTableOutput records={result.records} fields={query.fields} />
            ) : (
              <TableOutput records={result.records} fields={query.fields} />
            )}
          </details>
        );
      })}
    </div>
  );
}
