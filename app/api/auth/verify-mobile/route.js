import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { error: "Token is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  // For mobile apps, redirect to a custom scheme or show a success page
  const mobileAppUrl = `cynastore://auth/verify?token=${token}`;
  
  // In development, you might want to redirect to a success page
  if (process.env.NODE_ENV === 'development') {
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Login Verification</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 400px; margin: 0 auto; }
            .token { background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Mobile Login Verification</h2>
            <p>Your verification token:</p>
            <div class="token">${token}</div>
            <p>Copy this token and paste it in your mobile app.</p>
            <script>
              // Try to redirect to mobile app
              setTimeout(() => {
                window.location.href = '${mobileAppUrl}';
              }, 3000);
            </script>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        ...corsHeaders
      }
    });
  }

  // In production, redirect to mobile app
  return redirect(mobileAppUrl);
} 