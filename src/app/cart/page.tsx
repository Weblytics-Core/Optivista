
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Loader2, QrCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo } from 'react';
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, serverTimestamp } from 'firebase/firestore';
import type { UserProfileData } from '@/lib/types';


export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData } = useDoc<UserProfileData>(userDocRef);

  const upiId = process.env.NEXT_PUBLIC_UPI_ID;
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME;

  const upiUrl = useMemo(() => {
    if (!upiId || !upiName) return '';
    const total = getCartTotal().toFixed(2);
    // Construct the UPI deeplink URL
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${total}&cu=INR&tn=Payment for Optivista Order`;
  }, [upiId, upiName, getCartTotal]);

  const handleCheckout = () => {
     if (isUserLoading) return;
     if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please log in to proceed to checkout.",
            variant: "destructive",
        });
        return;
     }

    if (!upiId || !upiName || upiId === "YOUR_UPI_ID_HERE") {
        toast({
            title: "UPI Not Configured",
            description: "Please ask the site administrator to configure the UPI payment details.",
            variant: "destructive",
        });
        return;
    }
    setIsCheckoutOpen(true);
  }

  const handlePaymentSuccess = async () => {
    if (!user || !userData || !firestore) {
      toast({ title: "Error", description: "User data or Firestore not available.", variant: "destructive" });
      return;
    }
  
    setIsProcessingOrder(true);
    setIsCheckoutOpen(false); 
    toast({
      title: "Processing Order...",
      description: "Your order is being recorded. This may take a moment.",
    });

    const ordersCollectionRef = collection(firestore, 'orders');
    const newOrderRef = doc(ordersCollectionRef);
    
    const orderData = {
      id: newOrderRef.id,
      userId: user.uid,
      customerName: `${userData.firstName} ${userData.lastName}`,
      customerEmail: userData.email,
      items: cartItems.map(item => ({...item})), // Store a plain copy of items
      totalAmount: getCartTotal(),
      orderDate: serverTimestamp(),
      status: 'pending' as const,
      imageIds: cartItems.map(item => item.id),
    };

    try {
      // Use the non-blocking set which handles errors via the global emitter
      addDocumentNonBlocking(ordersCollectionRef, orderData)
      
      toast({
        title: "Order Placed!",
        description: `Your order #${orderData.id.substring(0,7)} has been recorded.`,
      });
      clearCart();

    } catch (error: any) {
        console.error("Order creation failed:", error);
        toast({
            title: "Order Failed",
            description: error.message || "Could not place your order. Please contact support.",
            variant: "destructive",
        });
    } finally {
        setIsProcessingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-24 w-24 text-muted-foreground mb-4" />
        <h1 className="text-3xl font-headline font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any photos to your cart yet.</p>
        <Button asChild>
          <Link href="/gallery">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-8 text-center">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center p-4 sm:p-6">
                      <Image
                        src={item.url}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="rounded-md object-cover w-20 h-20 sm:w-32 sm:h-32"
                        data-ai-hint={item.aiHint}
                      />
                      <div className="ml-4 sm:ml-6 flex-1">
                        <h2 className="font-semibold text-lg">{item.name}</h2>
                        <p className="text-muted-foreground text-sm">₹{item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input type="number" value={item.quantity} readOnly className="h-8 w-14 text-center mx-2" />
                          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-4 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <span>Calculated at checkout</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{getCartTotal().toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full group" onClick={handleCheckout} disabled={isUserLoading || isProcessingOrder}>
                  {isUserLoading ? 'Loading...' : isProcessingOrder ? 'Processing...' : 'Proceed to Checkout'}
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Pay with UPI</DialogTitle>
            <DialogDescription>
              Scan the QR code or use the button to pay with your UPI app.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-lg border">
              {upiUrl && <QRCode value={upiUrl} size={200} />}
            </div>
            <div className="text-center">
              <p className="font-semibold">Amount to Pay: ₹{getCartTotal().toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Payable to: {upiName}</p>
            </div>

            {upiUrl && (
                <Button asChild className="w-full md:hidden">
                    <a href={upiUrl}>Pay with UPI App</a>
                </Button>
            )}

            <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Important!</AlertTitle>
                <AlertDescription>
                    After payment, please click the &quot;I have paid&quot; button below. Payment verification is manual. After payment verification, image access will be sent through mail.
                </AlertDescription>
            </Alert>
            <Button onClick={handlePaymentSuccess} className="w-full" disabled={isProcessingOrder}>
                {isProcessingOrder ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : 'I have paid'
                }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
