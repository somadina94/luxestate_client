import { Loader2, type LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  title: string;
  onClick?: () => void;
  isLoading?: boolean;
  Icon: LucideIcon;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "destructive" | "secondary" | "outline" | "default";
  className?: string;
}

export default function IconButton({
  Icon,
  isLoading,
  onClick,
  title,
  disabled,
  type,
  variant = "default",
  className,
}: IconButtonProps) {
  return (
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      variant={variant}
      className={cn("gap-2", className)}
    >
      {isLoading ? (
        <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
      ) : (
        <Icon className="size-4 shrink-0" aria-hidden />
      )}
      <span>{title}</span>
    </Button>
  );
}
