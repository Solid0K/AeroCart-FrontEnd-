import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Feedback";
import { useCart } from "@/hooks/useCart";
import { checkOut, simulatePayment } from "@/api/orders";
import { formatCurrency } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";

export default function Checkout() {
  const { cart, refresh: refreshCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState("review"); // review | placing | payment | result
  const [checkoutResult, setCheckoutResult] = useState(null); // CheckOutResponse
  const [outcome, setOutcome] = useState(null); // "success" | "failed"
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  async function handlePlaceOrder() {
    setError("");
    setStep("placing");
    try {
      const result = await checkOut();
      setCheckoutResult(result);
      setStep("payment");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't place your order."));
      setStep("review");
    }
  }

  async function handleSimulatePayment(success) {
    setProcessingPayment(true);
    try {
      await simulatePayment(checkoutResult.paymentIntentId, success);
      setOutcome(success ? "success" : "failed");
      setStep("result");
      refreshCart();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't process the simulated payment."));
    } finally {
      setProcessingPayment(false);
    }
  }

  if (step === "review" && cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Nothing to check out"
        description="Add something to your cart first."
        action={
          <Link to="/products">
            <Button size="sm">Browse products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      {step !== "result" && (
        <Link
          to="/cart"
          className="flex w-fit items-center gap-1.5 text-sm text-text-faint hover:text-text-muted"
        >
          <ArrowLeft size={14} /> Back to cart
        </Link>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {(step === "review" || step === "placing") && (
        <Card className="p-6">
          <h1 className="font-display text-xl font-semibold text-text">Review your order</h1>
          <div className="mt-4 flex flex-col gap-2">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  {item.name} <span className="text-text-faint">× {item.quantity}</span>
                </span>
                <span className="font-mono text-text">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-white/10" />
          <div className="flex items-center justify-between">
            <span className="font-medium text-text">Total</span>
            <span className="font-mono text-xl font-semibold text-text">
              {formatCurrency(cart.totalAmount)}
            </span>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={handlePlaceOrder}
            loading={step === "placing"}
          >
            Place order
          </Button>
        </Card>
      )}

      {step === "payment" && checkoutResult && (
        <Card className="p-6">
          <div className="flex items-center gap-2 text-text-muted">
            <CreditCard size={18} />
            <span className="text-sm">Mock payment gateway</span>
          </div>
          <h1 className="mt-2 font-display text-xl font-semibold text-text">
            Confirm payment of {formatCurrency(checkoutResult.order.totalAmount)}
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            No real charge happens here — this simulates what a payment provider
            webhook would report back to the order.
          </p>

          <div className="mt-5 flex flex-col gap-2.5">
            <Button
              onClick={() => handleSimulatePayment(true)}
              loading={processingPayment}
              className="w-full"
            >
              Simulate successful payment
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSimulatePayment(false)}
              disabled={processingPayment}
              className="w-full"
            >
              Simulate failed payment
            </Button>
          </div>
        </Card>
      )}

      {step === "result" && (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          {outcome === "success" ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
                <CheckCircle2 size={28} />
              </div>
              <h1 className="font-display text-xl font-semibold text-text">Order confirmed</h1>
              <p className="text-sm text-text-muted">
                Your payment went through and the order is on its way to being processed.
              </p>
              <Button
                className="mt-3"
                onClick={() => navigate(`/orders/${checkoutResult.order.orderId}`)}
              >
                View order
              </Button>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/15 text-danger">
                <XCircle size={28} />
              </div>
              <h1 className="font-display text-xl font-semibold text-text">Payment failed</h1>
              <p className="text-sm text-text-muted">
                The order was marked as failed. Your cart has already been cleared as
                part of checkout, so you'll need to add items again to retry.
              </p>
              <Link to="/products">
                <Button className="mt-3">Browse products</Button>
              </Link>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
