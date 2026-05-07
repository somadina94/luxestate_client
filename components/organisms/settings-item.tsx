import { LucideIcon } from "lucide-react";

interface SettingsItemProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  onClick: () => void;
}

export default function SettingsItem({
  title,
  description,
  Icon,
  onClick,
}: SettingsItemProps) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer flex-row items-center justify-start gap-4 rounded-lg bg-primary/20 p-4 text-left shadow-sm hover:bg-primary/50"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
    >
      <Icon className="h-8 w-8 text-gray-500" />
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
