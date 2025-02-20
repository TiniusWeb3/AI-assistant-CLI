import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();

  const { data: microsoftAuth } = useQuery<boolean>({
    queryKey: ["/api/auth/microsoft/status"],
  });

  const { data: googleAuth } = useQuery<boolean>({
    queryKey: ["/api/auth/google/status"],
  });

  const handleAuth = async (provider: string) => {
    try {
      const res = await apiRequest("GET", `/api/auth/${provider}/url`);
      const { url } = await res.json();
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to authenticate with ${provider}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 text-blue-500">M</div>
                <div>
                  <h3 className="font-medium">Microsoft To Do</h3>
                  <p className="text-sm text-muted-foreground">
                    {microsoftAuth ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant={microsoftAuth ? "outline" : "default"}
                onClick={() => handleAuth("microsoft")}
              >
                {microsoftAuth ? "Disconnect" : "Connect"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 text-red-500">G</div>
                <div>
                  <h3 className="font-medium">Google Calendar</h3>
                  <p className="text-sm text-muted-foreground">
                    {googleAuth ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <Button
                variant={googleAuth ? "outline" : "default"}
                onClick={() => handleAuth("google")}
              >
                {googleAuth ? "Disconnect" : "Connect"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}