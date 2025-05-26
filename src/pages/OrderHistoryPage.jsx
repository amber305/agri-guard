import React from 'react';
import OrderHistory from '../components/OrderHistory';

const OrderHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <OrderHistory />
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage; 