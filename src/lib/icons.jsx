import feather from "feather-icons";

export function FeatherIcon({ name, size = 14, strokeWidth = 2 }) {
  return (
    <span
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
