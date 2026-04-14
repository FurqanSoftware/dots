import { QUERIES } from "../lib/queries";
import { TableOutput } from "./outputs/TableOutput";
import { KVTableOutput } from "./outputs/KVTableOutput";
import { KVPreOutput } from "./outputs/KVPreOutput";
import { PreOutput } from "./outputs/PreOutput";
import { MapOutput } from "./outputs/MapOutput";

export function ResultSection({ type, records, loading, error }) {
  if (error) {
    return <div role="alert">{error}</div>;
  }

  if (loading) {
    return <div class="loading-indicator" aria-busy="true" />;
  }

  if (!records) return null;

  const query = QUERIES[type];
  if (!query) return null;

  switch (query.output) {
    case "table":
      return <TableOutput records={records} fields={query.fields} />;
    case "kvtable":
      return <KVTableOutput records={records} fields={query.fields} />;
    case "kvpre":
      return (
        <KVPreOutput
          records={records}
          fields={query.fields}
          preField={query.preField}
        />
      );
    case "pre":
      return <PreOutput records={records} />;
    case "map":
      return <MapOutput records={records} />;
    default:
      return null;
  }
}
