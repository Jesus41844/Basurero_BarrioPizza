export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Barrio Pizza"
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="23" fill="var(--red)" />

      {/* Pizza slice - triangle with crust */}
      <path
        d="M24 10L34 34H14L24 10Z"
        fill="var(--white)"
      />
      {/* Crust arc */}
      <path
        d="M14 34C14 34 18 38 24 38C30 38 34 34 34 34"
        stroke="var(--white)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Pepperoni */}
      <circle cx="22" cy="26" r="2" fill="var(--red)" />
      <circle cx="27" cy="29" r="1.5" fill="var(--red)" />
      <circle cx="24" cy="22" r="1.5" fill="var(--red)" />

      {/* Recycling arrow overlay - subtle */}
      <path
        d="M24 8C24 8 30 8 33 12"
        stroke="var(--white)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M33 12L35 9M33 12L35 15"
        stroke="var(--white)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  );
}
