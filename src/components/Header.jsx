import { useState, useRef, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { isValidAddr } from "../lib/address";
import { FeatherIcon } from "../lib/icons";

export function Header({ addr }) {
  const [value, setValue] = useState(addr || "");
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(addr || "");
  }, [addr]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || !isValidAddr(trimmed)) {
      inputRef.current?.focus();
      return;
    }
    route("/" + trimmed);
  };

  return (
    <header id="head">
      <div class="header-grid">
        <div class="header-brand">
          <a class="logo" href="/">
            <h1>Dots</h1>
          </a>
          <p class="credit">
            By <a href="https://furqansoftware.com">Furqan Software</a>
          </p>
        </div>
        <div class="header-prompt">
          <form onSubmit={handleSubmit}>
            <div class="input-row">
              <input
                ref={inputRef}
                type="text"
                name="addr"
                value={value}
                onInput={(e) => setValue(e.target.value)}
                placeholder="Enter a domain name or IP address, e.g. toph.co or 172.104.40.125"
                spellcheck={false}
                autocomplete="off"
              />
              <button type="submit">
                <FeatherIcon name="chevron-right" size={21} strokeWidth={4} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
