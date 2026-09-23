export default function PizzaLogo({ className = "h-9 w-9" }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="12" fill="#161311" />
      <path
        d="M15 13 L24 6 L33 13"
        fill="none"
        stroke="#C9A227"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="28" r="13" fill="#C9A227" />
      <circle cx="24" cy="28" r="10.4" fill="#B33A2B" />
      <circle cx="24" cy="28" r="7.6" fill="#E8C46A" />
      <path d="M24 28 L24 17.6 A10.4 10.4 0 0 1 33 32.8 Z" fill="#161311" opacity=".16" />
      <circle cx="20.8" cy="25.2" r="1.15" fill="#B33A2B" />
      <circle cx="27.2" cy="24.6" r="1" fill="#B33A2B" />
      <circle cx="25.4" cy="30.6" r="1.1" fill="#B33A2B" />
      <circle cx="21.4" cy="31" r=".9" fill="#2F7A3E" />
    </svg>
  );
}
