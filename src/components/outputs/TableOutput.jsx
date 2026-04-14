import { CopyButton } from "../CopyButton";

function fieldLabel(field) {
  if (field.label) return field.label;
  return field.name.charAt(0).toUpperCase() + field.name.slice(1);
}

export function TableOutput({ records, fields }) {
  return (
    <table>
      <thead>
        <tr>
          {fields.map((f) => (
            <th key={f.name}>{fieldLabel(f)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((record, i) => (
          <tr key={i}>
            {fields.map((field) => {
              const val = record[field.name];
              return (
                <td key={field.name}>
                  {field.type === "addr" ? (
                    <a href={"/" + String(val).toLowerCase()}>{val}</a>
                  ) : (
                    val
                  )}
                  <CopyButton getText={String(val)} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
