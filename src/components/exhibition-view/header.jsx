import {
  DiscIcon,
  HousePlus,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  UserCog,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import { Label } from "../ui/label";
import { ExhibitionViewHeaderMenuItems } from "@/config";
function MenuItems() {
  const localhost = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams("");
  function handleNavigate(currentItem) {
    sessionStorage.removeItem("filters");
    const currentfilterItem =
      currentItem.id !== "home" &&
      currentItem.id !== "products" &&
      currentItem.id !== "search"
        ? { category: [currentItem.id] }
        : null;
    sessionStorage.setItem("filters", JSON.stringify(currentfilterItem));
    location.pathname.includes("listing") && currentfilterItem !== null
      ? setSearchParams(new URLSearchParams(`?category=${currentItem.id}`))
      : navigate(currentItem.path);
  }
  return (
    <nav className="flex flex-col mb-3 lg:items-center lg:flex-row gap-6">
      {ExhibitionViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          key={menuItem.id}
          className="text-sm font-medium cursor-pointer"
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}
function HeaderRightContent() {
  const [openUserCartSheet, setOpenUserCartSheet] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const username = user?.userName;
  console.log(user, "user")
  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet
        open={openUserCartSheet}
        onOpenChange={() => setOpenUserCartSheet(false)}
      >
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black size-9.5">
            <AvatarFallback className="bg-black text-white font-extrabold justify-items-center ">
              {" "}
              {username ? username.substring(0, 2).toUpperCase() : "GU"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-55">
          <DropdownMenuLabel> Logged in as {username} </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/accounts")}>
            <UserCog className="mr-2 w-6 h-6" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 w-6 h-6" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
function ExhibitionHeader() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  console.log("User Info", user);

  return (
    <header className="sticky top-0  w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={"/shop/home"} className="flex gap-3 items-center ">
          <HousePlus className="h-6 w-6" />
          <span className="font-bold">Exhibition Registration </span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" className="lg:hidden" variant="outlined">
              <Menu className="w-6 h-6" />
              <span className="sr-only">Togglle Header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ExhibitionHeader;
