import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else { toast.success("Password reset email sent!"); setSent(true); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Check your email for a password reset link.</p>
              <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input id="reset-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
              <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-accent hover:underline w-full justify-center">
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
