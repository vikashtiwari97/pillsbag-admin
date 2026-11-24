import type { IconProps } from ".";

export function ChemistIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M3 9l1.5-5h15L21 9M3 9a2.5 2.5 0 005 0M8 9a2.5 2.5 0 004 0M12 9a2.5 2.5 0 004 0M16 9a2.5 2.5 0 005 0"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 11.5V20h15v-8.5M12 13.5v4.5M9.75 15.75h4.5"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}