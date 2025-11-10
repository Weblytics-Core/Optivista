
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, type User } from "firebase/auth";
import { doc, getDoc, writeBatch, setDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Chrome } from "lucide-react";
import { processImageUrl } from "@/lib/utils";

declare global {
    interface Window {
        grecaptcha: any;
    }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkAndAssignAdminRole = async (currentUser: User) => {
    if (!firestore || !currentUser?.email) return;
  
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "").split(',').map(e => e.trim()).filter(e => e);
    const isBootstrapAdmin = adminEmails.includes(currentUser.email);
  
    if (!isBootstrapAdmin) return;
  
    const userDocRef = doc(firestore, "users", currentUser.uid);
    const adminRoleRef = doc(firestore, "roles_admin", currentUser.uid);
  
    try {
      const userDocSnap = await getDoc(userDocRef);
      const adminRoleDocSnap = await getDoc(adminRoleRef);
      
      const userIsAdmin = userDocSnap.exists() && userDocSnap.data()?.isAdmin;
      const roleDocExists = adminRoleDocSnap.exists();

      // If both records are correctly in place, no need to do anything.
      if (userIsAdmin && roleDocExists) {
        return;
      }
      
      console.log(`Syncing admin role for ${currentUser.email}...`);

      // Otherwise, ensure both records are created/updated correctly.
      const batch = writeBatch(firestore);
      
      const userData = { role: 'admin', isAdmin: true };
      if (userDocSnap.exists()) {
        batch.update(userDocRef, userData);
      } else {
        const [firstName, ...lastNameParts] = currentUser.displayName?.split(' ') || ['', ''];
        const lastName = lastNameParts.join(' ');
        batch.set(userDocRef, { 
            ...userData, 
            email: currentUser.email, 
            id: currentUser.uid,
            firstName,
            lastName,
            isVerified: currentUser.emailVerified,
            photoURL: currentUser.photoURL,
        }, { merge: true });
      }

      if (!roleDocExists) {
        // The document for roles_admin just needs to exist. It can be empty.
        batch.set(adminRoleRef, { email: currentUser.email, uid: currentUser.uid });
      }
  
      await batch.commit();
  
      console.log(`Admin role successfully assigned and synced for ${currentUser.email}`);
  
    } catch (e: any) {
      console.error("Failed to check/assign admin role:", e);
      setError("There was an error syncing your admin privileges. Please contact support.");
    }
  };
  
  const handleSuccessfulLogin = async (loggedInUser: User) => {
    if (loggedInUser.emailVerified || loggedInUser.providerData.some(p => p.providerId === 'google.com')) {
      await checkAndAssignAdminRole(loggedInUser);
      toast({
        title: "Sign-In Successful",
        description: "Redirecting...",
      });
      router.push('/');
    } else {
       setError("Please verify your email before logging in.");
       if (auth) {
         signOut(auth);
       }
       setIsLoading(false);
       setIsGoogleLoading(false);
    }
  }

  useEffect(() => {
    if (!isUserLoading && user) {
        handleSuccessfulLogin(user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUserLoading, user]);


  const handleSignIn = async (token?: string) => {
    setIsLoading(true);
    setError(null);

    if (!auth) {
      setError("Authentication service is not available.");
      setIsLoading(false);
      return;
    }

    if(token) {
        console.log("reCAPTCHA token:", token);
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if(error.code === 'auth/user-disabled') {
        setError("This account has been disabled.");
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    }
  };

   const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    if (!auth || !firestore) {
      setError("Authentication service is not available.");
      setIsGoogleLoading(false);
      return;
    }

    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      
      const userDocRef = doc(firestore, "users", googleUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const [firstName, ...lastNameParts] = googleUser.displayName?.split(' ') || ['', ''];
        const lastName = lastNameParts.join(' ');
        
        await setDoc(userDocRef, {
            id: googleUser.uid,
            email: googleUser.email,
            firstName: firstName || '',
            lastName: lastName || '',
            photoURL: googleUser.photoURL,
            role: 'user',
            isAdmin: false,
            isVerified: true,
        }, { merge: true });
      }


    } catch (error: any) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  const triggerRecaptcha = () => {
    setIsLoading(true);
    if (window.grecaptcha && window.grecaptcha.enterprise) {
      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "", { action: 'submit' });
          handleSignIn(token);
        } catch (e) {
          setError("reCAPTCHA execution failed. Please try again.");
          setIsLoading(false);
        }
      });
    } else {
      handleSignIn(); 
    }
  };

  if (isUserLoading || user) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-sm border-0 shadow-none sm:border sm:shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold font-headline">Login</CardTitle>
            <CardDescription>
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {error && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               <div className="grid gap-2">
                <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                    <Chrome className="mr-2 h-4 w-4" />
                    {isGoogleLoading ? 'Signing In...' : 'Sign in with Google'}
                </Button>
               </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                        </span>
                    </div>
                </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              {isClient && (
                <Button 
                    className="w-full"
                    disabled={isLoading || isGoogleLoading || !email || !password}
                    onClick={(e) => {
                        e.preventDefault();
                        triggerRecaptcha();
                    }}
                >
                    {isLoading ? "Signing In..." : "Sign In with Email"}
                </Button>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            Don&apos;t have an account?
            <Button asChild variant="link" size="sm" className="px-2">
              <Link href="/signup">
                Sign up
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="hidden lg:block relative">
        <Image
          src={processImageUrl("https://picsum.photos/seed/loginbg/1200/1800")}
          alt="An abstract image of colorful light trails"
          fill
          className="object-cover"
          data-ai-hint="light trails abstract"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </div>
    </div>
  );
}
