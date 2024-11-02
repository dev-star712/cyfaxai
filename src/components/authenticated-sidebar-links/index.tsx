import IconAlert from "@/components/icons/icon-alert";
import IconDanger from "@/components/icons/icon-danger";
import IconLogout from "@/components/icons/icon-logout";
import IconProfile from "@/components/icons/icon-profile";
import routes from "@/constants/routes";
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import useOpenMobileSidebarMenu from "@/hooks/useOpenMobileSidebarMenu";
import { cn, isPathEqual } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FormattedMessage } from "react-intl";

export type SidebarNavigationMenuItem = {
  icon?: JSX.Element;
  label: string;
  url: string;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  disabled?: boolean;
  isAdmin?: boolean;
  submenuItems?: SidebarNavigationMenuItem[];
};

const defaultNavLinks: SidebarNavigationMenuItem[] = [
  {
    icon: <IconDanger className="w-6 shrink-0 text-white" />,
    label: "currentRisk",
    url: routes.dashboard,
    submenuItems: [
      {
        label: "leakedCredentials",
        url: `${routes.currentRisk}/leaked-credentials`,
        disabled: true,
      },
      {
        label: "companyExposedPortsServices",
        url: `${routes.currentRisk}/company-exposed-ports`,
        disabled: true,
      },
      {
        label: "subDomainAnalysis",
        url: `${routes.currentRisk}/sub-domain-exploitable-services`,
        disabled: true,
      },
      {
        label: "domainVariations",
        url: `${routes.currentRisk}/domain-name-variations`,
        disabled: true,
      },
      {
        label: "emailProtection",
        url: `${routes.currentRisk}/email-weaknesses`,
        disabled: true,
      },
      {
        label: "stealerLogsForSale",
        url: `${routes.currentRisk}/stealer-logs-for-sale`,
        disabled: true,
      },
      {
        label: "logsInfectedMachine",
        url: `${routes.currentRisk}/logs-infected-machine`,
        disabled: true,
      },
      {
        label: "darkWebMentions",
        url: `${routes.currentRisk}/dark-web-mentions`,
        disabled: true,
      },
      {
        label: "hackerChannelMention",
        url: `${routes.currentRisk}/hacker-channel-mention`,
        disabled: true,
      },
    ],
  },
  {
    icon: <IconProfile className="w-6 shrink-0 text-white" />,
    label: "management",
    url: routes.management,
    isAdmin: false,
    submenuItems: [
      {
        label: "orgManagement",
        url: `${routes.management}/org-management`,
        disabled: true,
      },
      {
        label: "userManagementTitle",
        url: `${routes.management}/user-management`,
        disabled: true,
      },
      {
        label: "vipManagement",
        url: `${routes.management}/vip-management`,
        disabled: true,
      },
    ],
  },
  {
    icon: <IconAlert className="w-6 shrink-0 text-white" />,
    label: "alertManagement",
    url: routes.alertManagement,
    isAdmin: true,
  },
];

const AuthenticatedSidebarLinks = () => {  
  const { logout, logoutMutation, data } = useAuthUserAccount();  
  const {roleNameToIdMap} = useDetailReport()
  const roleString = data?.role ? roleNameToIdMap[data.role] : undefined;
  const navLinks = useMemo(() => {  
    let filteredNavLinks = [...defaultNavLinks].map(link => ({  
      ...link,  
      submenuItems: link.submenuItems ? [...link.submenuItems] : undefined,  
    }));  
  
    switch (roleString) {  
      case 'super_admin':  
      case 'partner_admin':  
        break;  
      case 'client_admin':  
        filteredNavLinks = filteredNavLinks.map(link => {  
          if (link.label === 'management' && link.submenuItems) {  
            return {  
              ...link,  
              submenuItems: link.submenuItems.filter(subItem => subItem.label === 'userManagementTitle' || subItem.label === 'vipManagement'),  
            };  
          }  
          return link;  
        });  
        break;  
      case 'client_user':  
      case 'partner_user':  
        filteredNavLinks = filteredNavLinks.filter(link => link.label !== 'management' && link.label !== 'alertManagement');  
        break;  
      default:  
        break;  
    }  
  
    filteredNavLinks.push({  
      icon: <IconLogout className="w-6 shrink-0 text-white" />,  
      label: logoutMutation.isPending ? 'loggingOut' : 'logOut',  
      url: '#',  
      onClick(e) {  
        e.preventDefault();  
        logout();  
      },  
      submenuItems: undefined, 
    });
  
    return filteredNavLinks;  
  }, [logout, logoutMutation.isPending, roleString]);

  return (  
    <div className="space-y-5">  
      {navLinks.map((item) => {  
        return <MenuItem menuItem={item} key={item.url} />;  
      })}  
    </div>  
  ); 
};

export default AuthenticatedSidebarLinks;

const MenuItem = ({ menuItem }: { menuItem: SidebarNavigationMenuItem }) => {
  const router = useRouter();
  const { closeMenu } = useOpenMobileSidebarMenu();

  const hasSubMenu = menuItem.submenuItems && menuItem.submenuItems?.length > 0;

  const isActiveMenu = isPathEqual(router.asPath, menuItem.url);

  const [isSubmenuOpen, setIsSubmenuOpen] = useState(isActiveMenu);

  useEffect(() => {
    setIsSubmenuOpen(isActiveMenu);
  }, [isActiveMenu]);

  const isCurrentRouteInSubmenu = useMemo(() => menuItem.submenuItems?.some(submenuItem => router.asPath.includes(submenuItem.url)), [menuItem.submenuItems, router.asPath]);  

  useEffect(() => {  
    if (isCurrentRouteInSubmenu) {  
      setIsSubmenuOpen(true);  
    }  
  }, [isCurrentRouteInSubmenu]); 

  return (
    <div className="mt-[22px]">
      <Link
        onClick={(e) => {
          menuItem.onClick && menuItem.onClick(e);
          closeMenu();
        }}
        href={menuItem.url}
        className={cn(
          "py-3 w-full items-center rounded-md px-3 hover:bg-[#720072] font-mulish gap-4 duration-300 flex text-white relative",
          isActiveMenu && "bg-[#720072]",
          hasSubMenu && "pr-12",
        )}
      >
        {menuItem.icon}
        <span className="inline-block truncate">
          <FormattedMessage id={menuItem.label} />
        </span>

        {hasSubMenu && (
          <div className="absolute right-0 top-0 z-10 aspect-square h-full p-0.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSubmenuOpen((prev) => !prev);
              }}
              className={cn(
                "size-full duration-200 max-lg:bg-foreground/5 flex justify-center items-center",
                isSubmenuOpen && "rotate-180",
              )}
            >
              <ChevronDown className="size-5" />
            </button>
          </div>
        )}
      </Link>

      {hasSubMenu && isSubmenuOpen && (
        <div className="my-2 ml-[18px] space-y-1 border-l-2 border-white/35 pl-5">
          {menuItem.submenuItems?.map((submenuItem) => {
          
            const isActiveSubMenu = router.asPath.startsWith(submenuItem.url);  

            return (
              <Link
                title={submenuItem.label}
                onClick={(e) => {
                  submenuItem.onClick && submenuItem.onClick(e);
                  closeMenu();
                }}
                className="relative flex w-full items-center gap-3 rounded-lg px-3 py-1.5 transition-all hover:bg-white/5 hover:text-white [&>svg]:size-[18px] [&>svg]:shrink-0 md:[&>svg]:size-3.5"  
                key={submenuItem.url}
                href={submenuItem.url}
              >
                <span className="pointer-events-none absolute right-[calc(100%+8px)] top-1/2 block h-0.5 w-3 -translate-y-1/2 bg-white/35" />
                {submenuItem.icon}

                <span  
                  className={`inline-block ${isActiveSubMenu ? '': 'text-white/80'}`}  
                  style={{ color: isActiveSubMenu ? '#FF0DFF' : '' }}  
                >  
                  <FormattedMessage id={submenuItem.label} />  
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
