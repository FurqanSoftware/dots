import { CopyButton } from "../CopyButton";

export function KVPreOutput({ records, fields, preField }) {
  if (!records.length) return null;
  const record = records[0];
  const preText = record[preField] || "";

  return (
    <>
      <table>
        <tbody>
          {fields.map((field) => {
            const val = record[field.name];
            return (
              <tr key={field.name}>
                <th>{field.label}</th>
                <td>
                  {val}
                  <CopyButton getText={String(val)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ position: "relative" }}>
        <pre>{preText}</pre>
        <CopyButton getText={preText} block />
      </div>
    </>
  );
}
