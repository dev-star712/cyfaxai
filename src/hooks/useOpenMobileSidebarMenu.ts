import { atom, useAtom } from "jotai";

const openMobileSidebarMenuAtom = atom(false);
const useOpenMobileSidebarMenu = () => {
  const [openMobileSidebarMenu, setOpenMobileSidebarMenu] = useAtom(
    openMobileSidebarMenuAtom,
  );

  const closeMenu = () => setOpenMobileSidebarMenu(false);

  return { openMobileSidebarMenu, setOpenMobileSidebarMenu, closeMenu };
};

export default useOpenMobileSidebarMenu;
