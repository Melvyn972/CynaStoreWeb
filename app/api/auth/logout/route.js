import { NextResponse } from "next/server";

// Enable CORS for mobile app
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(request) {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export async function POST(request) {
  // For JWT-based auth, logout is handled client-side by removing the token
  // We could implement token blacklisting here if needed
  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200, headers: corsHeaders }
  );
} 