
"use client";

import Link from "next/link";
import { Camera, GalleryVertical, Mail, Menu, User, LogOut, ShieldCheck, UserCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useUser, useAuth, useDoc, useMemoFirebase, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/gallery", label: "Gallery", icon: GalleryVertical },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, "users", user.uid);
  }, [user, firestore]);

  const { data: userData } = useDoc<{ role: string, firstName: string, lastName: string, email: string, photoURL?: string }>(userDocRef);

  const handleSignOut = async () => {
    try {
      if(auth) {
        await signOut(auth);
        toast({
          title: "Signed Out",
          description: "You have successfully signed out.",
        });
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Error Signing Out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isAdmin = userData?.role === 'admin';
  const userInitial = userData?.firstName?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Camera className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg tracking-wide">Optivista</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
           {isAdmin && (
             <Link
                href="/admin"
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname.startsWith('/admin') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Admin
              </Link>
           )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />

          {!isUserLoading && (
            user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? userData?.photoURL} alt={user.displayName || "User"} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData?.firstName} {userData?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userData?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/profile">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                  </DropdownMenuItem>
                   {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
               <Button asChild variant="ghost" size="icon" className="hidden md:inline-flex">
                <Link href="/login">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Link>
              </Button>
            )
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                <Camera className="h-6 w-6 text-primary" />
                <span className="font-bold font-headline text-lg tracking-wide">Optivista</span>
              </Link>
              <nav className="flex flex-col space-y-4">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center space-x-2 transition-colors hover:text-primary",
                      pathname === href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                ))}
                 {user && (
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center space-x-2 transition-colors hover:text-primary",
                      pathname.startsWith('/profile') ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                     <UserCircle className="h-5 w-5" />
                    <span>My Profile</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center space-x-2 transition-colors hover:text-primary",
                      pathname.startsWith('/admin') ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                     <ShieldCheck className="h-5 w-5" />
                    <span>Admin</span>
                  </Link>
                )}
                 {!user ? (<Link
                  href="/login"
                  className={cn(
                    "flex items-center space-x-2 transition-colors hover:text-primary",
                    pathname === '/login' ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Link>) : (<Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="flex items-center space-x-2 transition-colors hover:text-primary justify-start p-0 text-muted-foreground"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Button>)}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
