"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck } from 'lucide-react';

interface ShippingData {
  fullName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  useAsBilling: boolean;
}

interface ShippingInfoProps {
  shippingData: ShippingData;
  onShippingDataChange: (field: keyof ShippingData, value: string | boolean) => void;
}

export default function ShippingInfo({ shippingData, onShippingDataChange }: ShippingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="country">Country</Label>&nbsp;
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="np">Nepal</SelectItem>
              </SelectContent>
            </Select>
          </div>&nbsp;

          <div>
            <Label htmlFor="fullName">Full Name</Label>&nbsp;
            <Input
              id="fullName"
              value={shippingData.fullName}
              onChange={(e) => onShippingDataChange('fullName', e.target.value)}
              placeholder="Alexander Jose"
              required
            />
          </div>&nbsp;

          <div>
            <Label htmlFor="address">Address</Label>&nbsp;
            <Input
              id="address"
              value={shippingData.address}
              onChange={(e) => onShippingDataChange('address', e.target.value)}
              placeholder="Enter your address"
              required
            />
          </div>&nbsp;

          <div>
            <Label htmlFor="apartment">Apartment, Suite, etc (Optional)</Label>&nbsp;
            <Input
              id="apartment"
              value={shippingData.apartment}
              onChange={(e) => onShippingDataChange('apartment', e.target.value)}
              placeholder="Apartment, suite, etc"
            />
          </div>&nbsp;

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>&nbsp;
              <Input
                id="city"
                value={shippingData.city}
                onChange={(e) => onShippingDataChange('city', e.target.value)}
                placeholder="City"
                required
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>&nbsp;
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>&nbsp;
              <Input
                id="zipCode"
                value={shippingData.zipCode}
                onChange={(e) => onShippingDataChange('zipCode', e.target.value)}
                placeholder="ZIP Code"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone No.</Label>&nbsp;
            <Input
              id="phoneNumber"
              type="tel"
              value={shippingData.phoneNumber}
              onChange={(e) => onShippingDataChange('phoneNumber', e.target.value)}
              placeholder="Phone number"
              required
            />
          </div>&nbsp;

          <div className="flex items-center space-x-2">
            <Checkbox
              id="useAsBilling"
              checked={shippingData.useAsBilling}
              onCheckedChange={(checked) => onShippingDataChange('useAsBilling', checked as boolean)}
            />
            <Label htmlFor="useAsBilling">Use as Billing Address</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}