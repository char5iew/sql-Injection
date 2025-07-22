import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, ShieldAlert, Code } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elegant">
        <CardHeader className="text-center space-y-6">
          <div className="flex justify-center">
            <Code className="w-16 h-16 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SQL Injection Demo
          </CardTitle>
          <CardDescription className="text-lg">
            Educational demonstration comparing protected vs unprotected database queries
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Protected Route</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Uses parameterized queries and input validation to prevent SQL injection attacks.
              </p>
              <Button 
                className="w-full" 
                onClick={() => navigate("/login?type=protected")}
              >
                Access Protected Login
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-semibold">Unprotected Route</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Vulnerable to SQL injection due to direct string concatenation in queries.
              </p>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => navigate("/login?type=unprotected")}
              >
                Access Vulnerable Login
              </Button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Educational Purpose Only</h4>
            <p className="text-xs text-muted-foreground">
              This demo is for educational purposes to understand SQL injection vulnerabilities and prevention techniques. 
              Always use parameterized queries and proper input validation in production applications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
