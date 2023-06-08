import type { IconType } from "react-icons";
import { FiHome, FiSearch, FiSettings, FiUser } from "react-icons/fi";

export const SideMenuLinks = new Map<string, SideMenuElement>([
  [
    "/",
    {
      label: "Home",
      authRequired: false,
      Icon: FiHome,
      regex: /^\/$/g,
    },
  ],
  [
    "/profile",
    {
      label: "Profile",
      authRequired: true,
      Icon: FiUser,
      regex: /^\/profile\?id=[a-zA-Z0-9]+$/,
    },
  ],
  [
    "/search/twats",
    {
      label: "Search",
      authRequired: true,
      Icon: FiSearch,
      regex: /^\/search\/(twats|users|tags)$/,
    },
  ],
  [
    "/settings",
    {
      label: "Settings",
      authRequired: true,
      Icon: FiSettings,
      regex: /^\/settings$/,
    },
  ],
]);

type SideMenuElement = {
  label: string;
  authRequired: boolean;
  Icon: IconType;
  regex: RegExp;
};
