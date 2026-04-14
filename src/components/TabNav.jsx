import { QUERIES, QUERY_TABS } from "../lib/queries";

export function TabNav({ addr, activeType, addrKind }) {
  return (
    <nav class="tab-nav">
      {QUERY_TABS.filter((tab) => QUERIES[tab.key].types.includes(addrKind)).map(
        (tab) => (
          <a
            key={tab.key}
            href={"/" + addr + "/" + tab.key}
            class={tab.key === activeType ? "active" : ""}
          >
            {tab.label}
          </a>
        ),
      )}
    </nav>
  );
}
