"use client";

import type { FC } from "react";
import { Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header: FC = () => {
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
      <Avatar>
        <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar"/>
        <AvatarFallback>UW</AvatarFallback>
      </Avatar>
    </header>
  );
};

export default Header;
