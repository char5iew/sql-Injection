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
          <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SQL Injection Demo
          </CardTitle>
          </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary justify-center">
                <Shield className="w-5 h-5" />
                <h3 className="font-semibold">Protected Route</h3>
              </div>
            
              <Button 
                className="w-full" 
                onClick={() => navigate("/ProtectedLogin")}
              >
                Login
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-destructive justify-center">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-semibold">Unprotected Route</h3>
              </div>
          
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => navigate("/UnprotectedLogin")}
              >
                Login
              </Button>
            </div>
          </div>
          
          <div className="mt-8 p-4 flex justify-center">
            <span className="text-xs font-medium text-center">by Intern Jeremy</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
