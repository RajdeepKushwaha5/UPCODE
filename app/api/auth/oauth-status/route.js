import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const oauthStatus = {
      google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      github: !!(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      configured: false
    };

    // Check if at least one OAuth provider is configured
    oauthStatus.configured = oauthStatus.google || oauthStatus.github;

    return NextResponse.json(oauthStatus);
  } catch (error) {
    console.error('Error checking OAuth status:', error);
    return NextResponse.json(
      { error: 'Failed to check OAuth configuration' },
      { status: 500 }
    );
  }
}
