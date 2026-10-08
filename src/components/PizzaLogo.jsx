export default function PizzaLogo({ className = "h-9 w-9" }) {
  return (
    <img
      src="/images/logo.jpg"
      alt="Slice of Prima"
      className={`rounded-full object-cover ${className}`}
      width={48}
      height={48}
      decoding="async"
    />
  );
}
