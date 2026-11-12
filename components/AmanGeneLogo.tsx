import React from "react";

export function AmanGeneLogo({
  size = 36,
  dark = false,
}: {
  size?: number;
  dark?: boolean;
}) {
  const bg = dark ? "#ffffff" : "#001916";
  const accent = dark ? "#0e6b5a" : "#a2f2dc";
  const warm = "#ca8100";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="AmanGene AI Logo"
      className="shrink-0"
    >
      <rect width="40" height="40" rx="10" fill={bg} />
      <path
        d="M20 6L30 10.5V19.5C30 25.8 25.7 31.3 20 33.8C14.3 31.3 10 25.8 10 19.5V10.5L20 6Z"
        stroke={accent}
        strokeWidth="1.8"
      />
      <path
        d="M15.2 14.5C17.2 17 22.8 17 24.8 19.5C26.8 22 22.8 25 20 27.5"
        stroke={accent}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M24.8 14.5C22.8 17 17.2 17 15.2 19.5C13.2 22 17.2 25 20 27.5"
        stroke={warm}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <circle cx="20" cy="19.5" r="2" fill={accent} />
    </svg>
  );
}
