import { useState } from 'react';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/Components/ui/input-otp";
import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {Head} from '@inertiajs/react';

interface VerifyOTPProps {
  status?: string;
}

export default function VerifyOTP({ status }: VerifyOTPProps) {
  const [otp, setOtp] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    router.post(route('verifyOTP'), {
        "code" : otp
    },
    {
        preserveScroll: true,
        onSuccess: () => {
                toast.success('Phone number verified.', {
                    description : 'Your phone number has been verified successfully.',
                });
                setTimeout(() => {
                    router.get(route('user.profile'));
                }, 1000);
        },
        onError: (errors) => {
                toast.error("Failed to verify phone number", {
                     description: "An error occurred : " + Object.values(errors)[0],
                });
        }
    });
        setProcessing(false);
    };

  const handleResend = async () => {
    router.get(route("sendOTP"));
  };

  return (
    <GuestLayout>
        <Head title="Verify Phone" />
      <div className="text-center">
        <ShieldCheck
          className="w-12 h-12 mx-auto mb-4"
          style={{color: 'var(--app-color)'}}
        />

        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          Verify Your Phone Number
        </h2>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          We've sent a verification code to your phone number.
          Please enter the 6-digit code below to verify your account.
        </div>

        {status === 'verification-code-sent' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">
              A new verification code has been sent to your phone number.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col items-center justify-between gap-4">
            <div className="w-full max-w-xs mx-auto mb-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup className="gap-2 flex justify-center">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="w-12 h-12 text-lg border-2"

                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <button
              type="submit"
              disabled={processing || otp.length !== 6}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--app-color)'
              }}
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Verify Phone Number
                </>
              )}
            </button>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Didn't receive the code?{" "}
              <button
                type="button"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--app-color)' }}
                onClick={handleResend}
                disabled={processing}
              >
                Resend
              </button>
            </p>

            <div className="flex justify-between w-full">
              <Link
                href={route('logout')}
                method="post"
                as="button"
                className="text-sm font-medium transition-colors duration-200 rounded-lg px-4 py-2 flex items-center gap-2"
                style={{
                  color: 'var(--app-color)'
                }}
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Link>

              <Link
                href={route("user.profile")}
                className="text-sm font-medium transition-colors duration-200 rounded-lg px-4 py-2 flex items-center gap-2"
                style={{
                  color: 'var(--app-color)'
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}
