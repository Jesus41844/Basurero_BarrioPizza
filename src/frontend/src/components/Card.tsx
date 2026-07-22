import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
  as?: "section" | "article" | "div";
  ariaLabel?: string;
  onClick?: () => void;
  accent?: boolean;
}

export default function Card({ children, dark, className, as: Tag = "div", ariaLabel, onClick, accent = true }: CardProps) {
  return (
    <Tag
      aria-label={ariaLabel}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      className={cn(
        "p-5 relative overflow-hidden",
        dark ? "card-dark text-white" : "card",
        onClick && "cursor-pointer hover:border-[var(--red)] hover:-translate-y-0.5 transition-all duration-150",
        className
      )}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-red" aria-hidden="true" />
      )}
      <div className="relative">
        {children}
      </div>
    </Tag>
  );
}
