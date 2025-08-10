"use client";
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import ContactInfo from '@/components/checkout/ContactInfo';
import ShippingInfo from '@/components/checkout/ShippingInfo';
import PaymentMethod from '@/components/checkout/PaymentMethod';
import OrderSummary from '@/components/checkout/OrderSummary';
import CheckoutBreadcrumb from '@/components/checkout/CheckoutBreadcrumb';

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

export default function CheckoutPage() {
  const { cart, cartTotal, isLoading } = useCart();
  const [email, setEmail] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  const [shippingData, setShippingData] = useState<ShippingData>({
    fullName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: '',
    useAsBilling: true,
  });

  const handleShippingDataChange = (field: keyof ShippingData, value: string | boolean) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmOrder = async () => {
    const orderData = {
      email,
      shipping: shippingData,
      payment: selectedPayment,
      cart,
      total: cartTotal
    };
    
    console.log('Order confirmed:', orderData);
    // Handle order submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CheckoutBreadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Billing Information */}
          <div className="lg:col-span-2 space-y-8">
            <ContactInfo
              email={email}
              onEmailChange={setEmail}
            />

            <ShippingInfo
              shippingData={shippingData}
              onShippingDataChange={handleShippingDataChange}
            />

            <PaymentMethod
              selectedPayment={selectedPayment}
              onPaymentChange={setSelectedPayment}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cart={cart}
              cartTotal={cartTotal}
              isLoading={isLoading}
              onConfirmOrder={handleConfirmOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
}