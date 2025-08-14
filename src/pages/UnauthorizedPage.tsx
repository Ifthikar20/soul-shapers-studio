// src/pages/UnauthorizedPage.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldX className="w-24 h-24 text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-xl text-muted-foreground mb-8">
          You don't have permission to access this page.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;