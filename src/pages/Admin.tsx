import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface IssuerDetails {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
}

interface AdminProps {
  issuerDetails: IssuerDetails;
  onUpdateIssuer: (details: IssuerDetails) => void;
}

const Admin = ({ issuerDetails, onUpdateIssuer }: AdminProps) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onUpdateIssuer({
      ...issuerDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // No-op for now - will implement persistence later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="rounded-full hover:shadow-md transition-all duration-300 hover:scale-105 mb-6 -ml-4">
                ← Back to Invoices
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">Admin Panel</h1>
            <p className="text-muted-foreground text-lg">Manage your company details</p>
          </div>
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50 p-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Company Name"
                    value={issuerDetails.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="456 Business Ave, Suite 100"
                    value={issuerDetails.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City, State, ZIP</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="New York, NY 10001"
                    value={issuerDetails.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+1 (555) 123-4567"
                    value={issuerDetails.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="billing@yourcompany.com"
                    value={issuerDetails.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-6">
                  <Button onClick={handleSave} className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-base font-semibold">
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
