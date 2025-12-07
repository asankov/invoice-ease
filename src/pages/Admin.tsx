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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your company details</p>
          </div>
          <Link to="/">
            <Button variant="outline">Back to Invoices</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Company Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
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

                <div className="pt-4">
                  <Button onClick={handleSave} className="w-full">
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
