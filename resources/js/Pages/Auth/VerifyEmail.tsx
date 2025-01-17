import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, LogOut, AlertCircle, ArrowLeft } from 'lucide-react';

export default function VerifyEmail({ status }: { status?: string }) {
   const { post, processing } = useForm({});

   const submit: FormEventHandler = (e) => {
       e.preventDefault();
       post(route('verification.send'));
   };

   return (
       <GuestLayout>
           <Head title="Email Verification" />

           <div className="text-center">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--app-color)'}} />

               <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
                   Verify Your Email
               </h2>

               <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                   Thanks for signing up! Before getting started, could you verify
                   your email address by clicking on the link we just emailed to
                   you? If you didn't receive the email, we will gladly send you
                   another.
               </div>

               {status === 'verification-link-sent' && (
                   <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                       <p className="text-sm font-medium text-green-600 dark:text-green-400">
                           A new verification link has been sent to the email address
                           you provided during registration.
                       </p>
                   </div>
               )}

               <form onSubmit={submit} className="mt-6">
                   <div className="flex flex-col items-center justify-between gap-4">
                       <button
                           type="submit"
                           disabled={processing}
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
                                   Processing...
                               </>
                           ) : (
                               <>
                                   <Mail className="w-5 h-5" />
                                   Resend Verification Email
                               </>
                           )}
                       </button>

                       <div className='flex justify-between w-full'>

                       <Link
                           href={route('logout')}
                           method="post"
                           as="button"
                           className="text-sm font-medium transition-colors duration-200 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                           style={{
                               color: 'var(--app-color)'
                           }}
                       >
                           <LogOut className="w-4 h-4" />
                           Log Out
                       </Link>

                    <Link
                        href="/"
                        className="text-sm font-medium transition-colors duration-200 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
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
