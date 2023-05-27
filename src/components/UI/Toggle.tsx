import { FC, useState } from "react";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  toggled: boolean;
  onToggle: (value: boolean) => void;
  alt?: string;
}

const Toggle: FC<ToggleProps> = ({ toggled, onToggle, alt }) => {
  return (
    <Switch
      checked={toggled}
      onChange={onToggle}
      className={`${
        toggled ? "bg-sky-600" : "bg-gray-200"
      } relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">{alt}</span>
      <span
        className={`${
          toggled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
};

export default Toggle;
