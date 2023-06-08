import Link from "next/link";
import React from "react";

import { useRouter } from "next/router";
import { FiTwitter, FiUser } from "react-icons/fi";

interface SearchLayoutProps {
  children?: React.ReactNode;
}

const SearchLayout: React.FC<SearchLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className="space-y-2">
      <nav className="inline-flex w-full border-b border-gray-200 dark:border-neutral-600">
        {Links.map((link, index) => {
          const isSelected = router.pathname === link.href;
          return (
            <Link
              href={link.href}
              className="relative inline-flex w-full items-center justify-center gap-x-2 py-4 outline-none"
              key={index}
              replace
            >
              <link.icon />
              <span>{link.label}</span>
              {isSelected && (
                <span className="absolute bottom-0 w-full bg-sky-500 py-1"></span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
};

const Links = [
  { label: "Twats", href: "/search/twats", icon: FiTwitter },
  { label: "Users", href: "/search/users", icon: FiUser },
];

export default SearchLayout;
