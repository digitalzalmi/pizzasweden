import { useInView } from "../hooks/useInView";

export default function SectionReveal({
  as: Tag = "section",
  className = "",
  variant = "up",
  delay = 0,
  children,
  ...props
}) {
  const { ref, visible } = useInView();

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}
