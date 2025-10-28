import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircle, XCircle } from 'lucide-react';

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get parameters from URL
        const { invoiceId, reference, trxref } = router.query;
        
        // Get stored payment info
        const pendingPayment = sessionStorage.getItem('pendingPayment');
        
        if (!pendingPayment) {
          setPaymentStatus('failed');
          setIsLoading(false);
          return;
        }

        const paymentData = JSON.parse(pendingPayment);

        // Verify payment with your backend
        const verifyResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoiceId,
            reference: reference || trxref,
            ...paymentData,
          }),
        });

        if (verifyResponse.ok) {
          setPaymentStatus('success');
          // Clear the stored payment data
          sessionStorage.removeItem('pendingPayment');
        } else {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setPaymentStatus('failed');
      } finally {
        setIsLoading(false);
      }
    };

    if (router.isReady) {
      verifyPayment();
    }
  }, [router.isReady, router.query]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {paymentStatus === 'success' ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/bookings')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                View My Bookings
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t process your payment. Please try again or contact support if the problem persists.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/payment')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
              >
                Back to Home
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;