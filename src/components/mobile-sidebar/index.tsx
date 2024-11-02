import SidebarContent from "@/components/sidebar-content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useOpenMobileSidebarMenu from "@/hooks/useOpenMobileSidebarMenu";
import { MdOutlineMenu } from "react-icons/md";

const Sidebar = () => {
  const { openMobileSidebarMenu, setOpenMobileSidebarMenu } =
    useOpenMobileSidebarMenu();
  return (
    <div>
      <Sheet
        open={openMobileSidebarMenu}
        onOpenChange={setOpenMobileSidebarMenu}
      >
        <SheetTrigger asChild>
          <MdOutlineMenu className="text-2xl text-black md:text-3xl" />
        </SheetTrigger>
        <SheetContent side={"left"} className="w-[280px] bg-[#13101c] pt-12">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Sidebar;
