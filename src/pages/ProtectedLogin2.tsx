import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Code } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProtectedLogin2 = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams({ username, password });
      const res = await fetch(`/api/protected-login2?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        navigate("/protected2-success", { state: { result: data.result } });
      } else {
        toast.error("Login failed", {
          description: data.error || "No user found or invalid credentials.",
        });
      }
    } catch (err) {
      toast.error("Error", { description: String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Code className="w-12 h-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Sanitzied Input Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button
              className="w-full bg-green-500 text-white hover:bg-green-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
            <div className="pt-4 border-t">
              <Button
                className="w-full bg-green-500 text-white hover:bg-green-600"
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Back to Demo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtectedLogin2; 