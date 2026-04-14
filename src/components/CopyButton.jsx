import { useState, useCallback } from "preact/hooks";
import { FeatherIcon } from "../lib/icons";

export function CopyButton({ getText, block }) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const text = typeof getText === "function" ? getText() : getText;
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    },
    [getText],
  );

  return (
    <button
      class={block ? "btn-copy btn-copy-block" : "btn-copy"}
      title="Copy to clipboard"
      onClick={handleClick}
    >
      <FeatherIcon name={copied ? "check" : "copy"} />
    </button>
  );
}
