"use client";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

interface ContactInfoProps {
  email: string;
  onEmailChange: (email: string) => void;
}

export default function ContactInfo({ email, onEmailChange }: ContactInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Contact Information</CardTitle>
        <p className="text-sm text-gray-600">
          You are currently checking out as a guest. Please enter your email address below so that we can send you confirmation of your order. If you are already a member, please{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
          .
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>&nbsp;
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}