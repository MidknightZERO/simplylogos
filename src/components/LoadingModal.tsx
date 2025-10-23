'use client'

interface LoadingModalProps {
  isOpen: boolean
  message: string
}

export default function LoadingModal({ isOpen, message }: LoadingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-6"></div>
          
          {/* Message with animated dots */}
          <p className="text-xl font-semibold text-gray-900 text-center">
            {message}
            <span className="inline-block animate-dots">
              <span className="dot-1">.</span>
              <span className="dot-2">.</span>
              <span className="dot-3">.</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

