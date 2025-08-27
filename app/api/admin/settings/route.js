import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/dbConnect";
import { Settings } from "@/models/Settings";
import { checkAdminAccess } from "@/utils/adminCheck";

export async function GET(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    
    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Check admin access (bypass in development)
    if (!isDevelopment && session) {
      const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
      if (!adminUser || !isAdmin) {
        return NextResponse.json({ 
          success: false, 
          message: "Admin access required" 
        }, { status: 403 });
      }
    }

    // Get or create settings document
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings();
      await settings.save();
    }

    console.log('Fetched settings:', settings); // Debug log

    return NextResponse.json({
      success: true,
      settings: settings.toObject()
    });

  } catch (error) {
    console.error("Settings API error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
} 

export async function PUT(request) {
  try {
    await dbConnect();
    
    const session = await getServerSession();
    
    // Development bypass for testing
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!isDevelopment && !session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    // Check admin access (bypass in development)
    if (!isDevelopment && session) {
      const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
      if (!adminUser || !isAdmin) {
        return NextResponse.json({ 
          success: false, 
          message: "Admin access required" 
        }, { status: 403 });
      }
    }

    const { settings } = await request.json();
    
    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid settings data" 
      }, { status: 400 });
    }

    // Get existing settings or create new one
    let existingSettings = await Settings.findOne();
    if (!existingSettings) {
      existingSettings = new Settings();
    }

    // Update settings with provided values
    Object.keys(settings).forEach(key => {
      if (settings[key] !== undefined) {
        existingSettings[key] = settings[key];
      }
    });

    // Set metadata
    existingSettings.lastUpdated = new Date();
    existingSettings.updatedBy = session?.user?.email || 'development';

    // Save to database
    await existingSettings.save();

    console.log('Updated settings:', existingSettings); // Debug log
    
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: existingSettings.toObject()
    });

  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error: " + error.message 
    }, { status: 500 });
  }
}
