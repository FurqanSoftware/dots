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

        return (
          <div key={key} class="dns-record-section">
            <h3>{query.label}</h3>
            {!result ? (
              <div class="loading-indicator" aria-busy="true" />
            ) : result.records.length === 0 ? (
              <p class="no-records">No records found</p>
            ) : query.output === "kvtable" ? (
              <KVTableOutput records={result.records} fields={query.fields} />
            ) : (
              <TableOutput records={result.records} fields={query.fields} />
            )}
          </div>
        );
      })}
    </div>
  );
}
