import { useState } from "react";
import { ShoppingCart, X, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function CartSheet() {
  const { items, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const { session } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add services to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    setIsCheckingOut(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              serviceId: item.service.id,
              serviceName: item.service.name,
              price: item.service.price,
            })),
            successUrl: `${window.location.origin}/payment-success`,
            cancelUrl: `${window.location.origin}/dashboard?payment=cancelled`,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout");
      }

      const { url } = await response.json();
      clearCart();
      setIsOpen(false);
      window.open(url, "_blank");
    } catch (error) {
      toast({
        title: "Checkout Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
        variant: "destructive",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
          <ShoppingCart className="w-5 h-5 text-muted-foreground" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent text-accent-foreground text-xs">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-[calc(100vh-180px)]">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Browse services and add them to your cart
              </p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.service.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.service.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.service.turnaround_days} day turnaround
                      </p>
                      <p className="text-sm font-semibold text-accent mt-2">
                        ${(item.service.price / 100).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.service.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">
                    ${(totalPrice / 100).toFixed(2)}
                  </span>
                </div>

                <Button
                  variant="gold"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Checkout"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={clearCart}
                  disabled={isCheckingOut}
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
