"use client";

import type { FC } from "react";
import { Wallet, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../auth/auth-provider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: FC = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <Wallet className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold font-headline text-primary-dark">
          SpendWise
        </h1>
      </div>
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user.photoURL || "https://placehold.co/40x40.png"} alt="User Avatar" data-ai-hint="user avatar"/>
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
