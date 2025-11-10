
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, writeBatch, getDoc, setDoc } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Chrome } from "lucide-react";
import { processImageUrl } from "@/lib/utils";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    if (!auth || !firestore) {
        setError("Authentication or database service is not available.");
        setIsLoading(false);
        return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      await updateProfile(user, { displayName: name });
      
      const userDocRef = doc(firestore, "users", user.uid);
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const userData = {
        id: user.uid,
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        photoURL: user.photoURL,
        role: 'user', // Default role
        isAdmin: false,
        isVerified: false,
        verificationToken: null, 
      };
      // Set user data without batching initially
      await setDoc(userDocRef, userData);

      toast({
        title: "Account Created!",
        description: "A verification email has been sent. Please check your inbox.",
      });
      
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPassword('');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please log in or use a different email.');
      } else {
        setError(error.message);
      }
    } finally {
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
      const user = result.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const [firstName, ...lastNameParts] = user.displayName?.split(' ') || ['', ''];
        const lastName = lastNameParts.join(' ');

        const userData = {
            id: user.uid,
            email: user.email,
            firstName: firstName || '',
            lastName: lastName || '',
            photoURL: user.photoURL,
            role: 'user', // Default role
            isAdmin: false,
            isVerified: true, // Google users are implicitly verified
            verificationToken: null,
        };
        await setDoc(userDocRef, userData);
      }
      
      // After sign-in/sign-up, let the login page handle the redirect and admin check
      toast({
        title: "Sign-In Successful",
        description: `Welcome, ${user.displayName}!`,
      });
      router.push("/");

    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsGoogleLoading(false);
    }
  };


  return (
    <div className="w-full min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-2">
       <div className="hidden lg:block relative">
        <Image
          src={processImageUrl("https://picsum.photos/seed/signupbg/1200/1800")}
          alt="An abstract architectural image"
          fill
          className="object-cover"
          data-ai-hint="abstract architecture"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-transparent" />
      </div>
       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="mx-auto w-full max-w-sm border-0 shadow-none sm:border sm:shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold font-headline">Create an Account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
               <Alert>
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Success!</AlertTitle>
                 <AlertDescription>
                  Please check your email to verify your account.
                 </AlertDescription>
               </Alert>
            ) : (
            <>
               {error && (
                <Alert variant="destructive" className="mb-4">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               <div className="grid gap-4">
                    <Button variant="outline" onClick={handleGoogleSignIn} disabled={isGoogleLoading || isLoading}>
                        <Chrome className="mr-2 h-4 w-4" />
                        {isGoogleLoading ? 'Signing In...' : 'Sign up with Google'}
                    </Button>
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
                </div>
              <form onSubmit={handleSignUp} className="grid gap-4 mt-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your Name" 
                      required 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                    />
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
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                    />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            Already have an account?
            <Button asChild variant="link" size="sm" className="px-2">
                <Link href="/login">
                    Sign in
                </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
