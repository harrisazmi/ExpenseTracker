import { Switch } from "../ui/Switch";

interface HeaderSwitchProps {
  isVisible: any;
  setIsVisible: any;
  title: string;
}

export default function HeaderSwitch({
  isVisible,
  setIsVisible,
  title,
}: HeaderSwitchProps) {
  return (
    <div className="p-4 bg-gray-50 border font-semibold text-gray-800 justify-between items-center flex">
      {title}
      <div className="flex">
        <span className="pl-4 w-[120px]">Show Details</span>
        <div className="pl-2 flex items-center justify-center">
          <Switch checked={isVisible} onCheckedChange={setIsVisible} />
        </div>
      </div>
    </div>
  );
}
