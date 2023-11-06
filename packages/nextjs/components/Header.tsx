import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChatBubbleLeftIcon, HomeIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-secondary shadow-md" : ""
      } hover:bg-secondary hover:shadow-md focus:bg-secondary py-1.5 px-3 text-sm rounded-full gap-2`}
    >
      {children}
    </Link>
  );
};

const bottomNavMap: Record<string, number> = {
  "/": 0,
  "/chat": 1,
  "/map": 2,
};

const BottomNavigation = () => {
  const { pathname } = useRouter();

  const activeIndex = bottomNavMap[pathname];

  return (
    <div className="btm-nav bg-base-200">
      <Link href="/" className={activeIndex === 0 ? "active bg-secondary" : ""}>
        <HomeIcon className="h-5 w-5" />
        <span className="btm-nav-label">Home</span>
      </Link>
      <Link href="/chat" className={activeIndex === 1 ? "active bg-secondary" : ""}>
        <ChatBubbleLeftIcon className="h-5 w-5" />
        <span className="btm-nav-label">Chat</span>
      </Link>
      <Link href="/map" className={activeIndex === 2 ? "active bg-secondary" : ""}>
        <MapPinIcon className="h-5 w-5" />
        <span className="btm-nav-label">Map</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;

/**
 * Site header
 */
export const Header = () => {
  // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const burgerMenuRef = useRef<HTMLDivElement>(null);
  // useOutsideClick(
  //   burgerMenuRef,
  //   useCallback(() => setIsDrawerOpen(false), []),
  // );

  const navLinks = (
    <>
      <li>
        <NavLink href="/">Home</NavLink>
      </li>
      <li>
        <NavLink href="/chat">
          <ChatBubbleLeftIcon className="h-4 w-4" />
          Chat
        </NavLink>
      </li>
      <li>
        <NavLink href="/blockexplorer">
          <MapPinIcon className="h-4 w-4" />
          Map
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-base-200 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        {/* <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div> */}
        <div className="md:hidden block">
          <BottomNavigation />
        </div>
        <Link href="/" passHref className="hidden md:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="Grape Vine" className="cursor-pointer" fill src="/grape.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Grape Vine</span>
          </div>
        </Link>
        <ul className="hidden md:flex md:flex-nowrap menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
