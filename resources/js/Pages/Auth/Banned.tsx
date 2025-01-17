import { Ban, ArrowLeft, Mail } from 'lucide-react';
import GuestLayout from "@/Layouts/GuestLayout";
import { Link } from '@inertiajs/react';

interface BannedPageProps {
  banExpiration?: string;
}

export default function Banned({ banExpiration }: BannedPageProps) {
  return (
    <GuestLayout>
      <div className="text-center">
        <Ban
          className="w-12 h-12 mx-auto mb-4 text-red-500"
        />

        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          Account Suspended
        </h2>

        <div className="mb-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          Your account has been temporarily suspended due to a violation of our terms of service.
              {banExpiration && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Suspension ends: {banExpiration}
                </p>
              )}
        </div>

        <div className="mt-6">
          <div className="flex flex-col items-center justify-between gap-4">
            <Link
              href=""
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this is a mistake, please contact our support team for assistance.
            </p>

            <div className="flex justify-center w-full">
              <Link
                href="/"
                className="text-sm font-medium transition-colors duration-200 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
