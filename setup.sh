#!/bin/bash

echo "🚀 SimplyLogos Setup Script"
echo "=========================="

# Create .env.local file
echo "📝 Creating .env.local file..."

cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here

# Stripe Configuration (TEST KEYS PROVIDED)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
EOF

echo "✅ .env.local file created!"
echo ""
echo "🔧 Next Steps:"
echo "1. Set up your Supabase project and update the Supabase keys in .env.local"
echo "2. Set up Stripe webhook endpoint and update STRIPE_WEBHOOK_SECRET"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For detailed setup instructions, see README.md"
