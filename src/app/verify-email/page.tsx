"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { applyActionCode } from "firebase/auth";
import { useAuth } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const oobCode = searchParams.get("oobCode");

  const [verificationState, setVerificationState] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (oobCode) {
      handleVerifyEmail(oobCode);
    } else {
      setError("No verification code provided. Please use the link from your email.");
      setVerificationState("error");
    }
  }, [oobCode]);

  const handleVerifyEmail = async (actionCode: string) => {
    try {
      await applyActionCode(auth, actionCode);
      setVerificationState("success");
    } catch (error: any) {
      setError(error.message);
      setVerificationState("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] bg-muted/40">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Email Verification</CardTitle>
        </CardHeader>
        <CardContent>
          {verificationState === "verifying" && (
            <div className="flex flex-col items-center space-y-4">
              <Terminal className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your email...</p>
            </div>
          )}
          {verificationState === "success" && (
            <div className="flex flex-col items-center space-y-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <Alert variant="default" className="bg-green-500/10 border-green-500/50">
                <AlertTitle className="text-green-700 dark:text-green-400">Success!</AlertTitle>
                <AlertDescription className="text-green-600 dark:text-green-300">
                  Your email has been successfully verified.
                </AlertDescription>
              </Alert>
              <Button asChild className="w-full mt-4">
                <Link href="/login">Proceed to Login</Link>
              </Button>
            </div>
          )}
          {verificationState === "error" && (
             <div className="flex flex-col items-center space-y-4 text-center">
                <XCircle className="h-12 w-12 text-destructive" />
                <Alert variant="destructive">
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                    {error || "An unknown error occurred. Please try the link again or request a new verification email."}
                    </AlertDescription>
                </Alert>
                <Button asChild className="w-full mt-4" variant="secondary">
                    <Link href="/signup">Back to Sign Up</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}
