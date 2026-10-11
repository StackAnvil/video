import { brand } from "../brand";

export function BrandMark({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="StackAnvil">
      <path fill={brand.mint} d="M7 9h50v10H7zm5 14h45v10H12zm5 14h40v10H17z" />
      <path fill={brand.rust} d="M7 51h50v7H7z" />
    </svg>
  );
}
