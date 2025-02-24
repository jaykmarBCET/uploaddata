"use client";

import Link from "next/link";

import useAuthStore from '@/store/user'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold">CodeMember</h1>
      <div className="hidden md:flex gap-4">
        {user?.email ? (
          <>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/add">Add Data</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/video">Videos</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/image">Images</Link>
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="default" asChild>
              <Link href="/register">Register</Link>
            </Button>
          </>
        )}
        <Button variant="ghost" asChild>
          <Link href="/">Home</Link>
        </Button>
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user?.email ? (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/add">Add Data</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/video">Videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/image">Images</Link>
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Register</Link>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/">Home</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
