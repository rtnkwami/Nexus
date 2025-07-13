"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface PaymentMethodProps {
  selectedPayment: string;
  onPaymentChange: (method: string) => void;
}

const paymentMethods = [
  { id: 'cash', label: 'Cash On Delivery' },
  { id: 'esewa', label: 'eSewa' },
  { id: 'khalti', label: 'Khalti' },
  { id: 'ime', label: 'IME Pay' },
  { id: 'ips', label: 'Connect IPS' },
  { id: 'card', label: 'Credit / Debit Card' },
];

export default function PaymentMethod({ selectedPayment, onPaymentChange }: PaymentMethodProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <p className="text-sm text-gray-600">
          All transactions are secure and encrypted.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`text-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPayment === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onPaymentChange(method.id)}
            >
              <div className="text-sm font-medium">{method.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}