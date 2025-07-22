import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ShieldAlert } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isProtected = searchParams.get("type") === "protected";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            {isProtected ? (
              <Shield className="w-12 h-12 text-primary" />
            ) : (
              <ShieldAlert className="w-12 h-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isProtected ? "Protected Login" : "Unprotected Login"}
          </CardTitle>
          <CardDescription>
            {isProtected 
              ? "This route uses parameterized queries to prevent SQL injection"
              : "This route is vulnerable to SQL injection attacks"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              type="text" 
              placeholder="Enter your username"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password"
              className="w-full"
            />
          </div>
          <Button 
            className="w-full"
            variant={isProtected ? "default" : "destructive"}
          >
            Sign In
          </Button>
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Back to Demo
            </Button>
          </div>
          {!isProtected && (
            <div className="text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md border border-destructive/20">
              <strong>Demo Note:</strong> Try entering <code>' OR '1'='1</code> as the username to simulate a SQL injection attack.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;