import { useLocation } from "react-router-dom";

const STAGING_PREFIX = "/staging";

export function useThemedPath() {
  const { pathname } = useLocation();
  const isStaging =
    pathname === STAGING_PREFIX || pathname.startsWith(`${STAGING_PREFIX}/`);

  const themed = (path: string) => {
    if (!isStaging) return path;
    if (path === "/") return STAGING_PREFIX;
    return `${STAGING_PREFIX}${path}`;
  };

  return { isStaging, themed };
}
