import { CopyButton } from "../CopyButton";

export function PreOutput({ records }) {
  const text = records.map((r) => r.data).join("");

  return (
    <div style={{ position: "relative" }}>
      <pre id="whois-pre">{text}</pre>
      <CopyButton getText={text} block />
    </div>
  );
}
