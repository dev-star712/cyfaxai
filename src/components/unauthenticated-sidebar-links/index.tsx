import IconDashboard from "@/components/icons/icon-dashboard";
import ReUseSideBar from "@/components/re-use-sidebar";
import routes from "@/constants/routes";
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import useOpenMobileSidebarMenu from "@/hooks/useOpenMobileSidebarMenu";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormattedMessage } from "react-intl";
import vartexImg3 from "../../../public/Beacon - tiles rev a 1.png";
import vartexImg2 from "../../../public/Beacon - tiles rev b 1.png";
import vartexImg1 from "../../../public/Beacon - tiles rev c 1.png";

const UnauthenticatedSidebarLinks = () => {
  const { closeMenu } = useOpenMobileSidebarMenu();
  const { hasAuth } = useAuthUserAccount();
  return (
    <div>
      <Link
        href={hasAuth ? routes.dashboard : routes.login}
        className="mt-[22px] flex h-12 w-full items-center rounded-md bg-[#720072] px-3 font-mulish text-white"
        onClick={closeMenu}
      >
        {hasAuth ? (
          <IconDashboard className="w-6 shrink-0 text-white" />
        ) : (
          <LogIn className="w-6 shrink-0 text-white" />
        )}
        <span className="pl-4 text-base">
          <FormattedMessage id={hasAuth ? "dashboard" : "login"} />
        </span>
      </Link>

      <ReUseSideBar text="sideBarDescriptionText1">
        <Image
          onClick={closeMenu}
          src={vartexImg1}
          className="mx-auto h-[131px] w-[103px] lg:h-[157px] lg:w-[123px]"
          alt="image"
          placeholder="blur"
          height={157}
          width={123}
        ></Image>
      </ReUseSideBar>
      <ReUseSideBar
        href="https://detect.solutions"
        text="sideBarDescriptionText2"
      >
        <Image
          onClick={closeMenu}
          src={vartexImg2}
          className="mx-auto size-[101px] lg:size-[127px]"
          alt="image"
          placeholder="blur"
          height={157}
          width={123}
        ></Image>
      </ReUseSideBar>
      <ReUseSideBar
        href="https://detect.solutions"
        text="sideBarDescriptionText3"
      >
        <Image
          onClick={closeMenu}
          src={vartexImg3}
          className="mx-auto h-[107px] w-[102px] lg:h-[127px] lg:w-[121px]"
          alt="image"
          placeholder="blur"
          height={157}
          width={123}
        ></Image>
      </ReUseSideBar>
    </div>
  );
};

export default UnauthenticatedSidebarLinks;
