import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { useToast } from "@/hooks/use-toast";
import { api } from "../../convex/_generated/api";

export interface IssuerDetails {
  name: string;
  address: string;
  phone: string;
  email: string;
}

const Admin = () => {
  const { toast } = useToast();
  const company = useQuery(api.company.get);
  const saveCompany = useMutation(api.company.save);

  const [details, setDetails] = useState<IssuerDetails>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (company) {
      setDetails({
        name: company.name,
        address: company.address,
        phone: company.phone,
        email: company.email,
      });
    }
  }, [company]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await saveCompany(details);
      toast({ title: "Success", description: "Company details saved successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save company details", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="hover:shadow-md transition-all duration-300 hover:scale-105 mb-6 -ml-4">
                ← Back to Invoices
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Admin Panel</h1>
            <p className="text-muted-foreground text-lg">Manage your company details</p>
          </div>
          <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-10 w-10 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" name="name" value={details.name} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" name="address" value={details.address} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={details.phone} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={details.email} onChange={handleChange} />
                </div>
                <div className="pt-6">
                  <Button
                    type="button"
                    onClick={handleSave}
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-base font-semibold"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
