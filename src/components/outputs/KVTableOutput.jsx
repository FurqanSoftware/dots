import { CopyButton } from "../CopyButton";

export function KVTableOutput({ records, fields }) {
  if (!records.length) return null;
  const record = records[0];

  return (
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
  );
}
