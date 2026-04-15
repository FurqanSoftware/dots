import feather from "feather-icons";

export function FeatherIcon({ name, size = 14, strokeWidth = 2 }) {
  return (
    <span
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        position: "relative",
        top: "-5px",
      }}
      dangerouslySetInnerHTML={{
        __html: feather.icons[name].toSvg({
          width: size,
          height: size,
          "stroke-width": strokeWidth,
        }),
      }}
    />
  );
}
