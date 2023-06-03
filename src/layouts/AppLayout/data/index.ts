import type { IconType } from "react-icons";
import { FiHome, FiSearch, FiSettings, FiUser } from "react-icons/fi";

export const SideMenuLinks = new Map<string, SideMenuElement>([
  [
    "/",
    {
      label: "Home",
      authRequired: false,
      Icon: FiHome,
    },
  ],
  [
    "/profile",
    {
      label: "Profile",
      authRequired: true,
      Icon: FiUser,
    },
  ],
  [
    "/search",
    {
      label: "Search",
      authRequired: true,
      Icon: FiSearch,
    },
  ],
  [
    "/settings",
    {
      label: "Settings",
      authRequired: true,
      Icon: FiSettings,
    },
  ],
]);

type SideMenuElement = {
  label: string;
  authRequired: boolean;
  Icon: IconType;
};
