import AuthenticatedSidebarLinks from "@/components/authenticated-sidebar-links";
import UnauthenticatedSidebarLinks from "@/components/unauthenticated-sidebar-links";
import { isAuthenticatedRoute } from "@/lib/utils";
import { useRouter } from "next/router";

const SidebarContent = () => {
  const router = useRouter();

  const is_authneticatedRoute = isAuthenticatedRoute(router.asPath);
  return (
    <div className="h-screen overflow-auto p-2.5 lg:h-auto lg:p-0">
      {is_authneticatedRoute ? (
        <AuthenticatedSidebarLinks />
      ) : (
        <UnauthenticatedSidebarLinks />
      )}
    </div>
  );
};

export default SidebarContent;
