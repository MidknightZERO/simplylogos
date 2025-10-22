'use client'

import LogoRotation from '@/components/LogoRotation'
import Link from 'next/link'

export default function SignupConfirmationPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7e7e7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center mb-6">
            <LogoRotation />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We&apos;ve sent you a confirmation link to verify your email address.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Account Created Successfully
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Please check your email and click the confirmation link to activate your account.
                  You can then sign in and start creating amazing logos!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button className="font-medium text-indigo-600 hover:text-indigo-500">
                resend confirmation
              </button>
            </p>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/login"
              className="flex-1 bg-indigo-600 text-white text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-200 text-gray-900 text-center py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
