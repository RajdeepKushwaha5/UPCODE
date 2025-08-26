import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";
import { checkAdminAccess } from "@/utils/adminCheck";

// Mock settings model - in a real app, you'd have a Settings collection
const defaultSettings = {
  siteName: "UPCODE",
  maintenanceMode: false,
  registrationEnabled: true,
  emailNotifications: true,
  maxSubmissionsPerDay: 100,
  contestRegistrationEnabled: true,
  premiumFeaturesEnabled: true,
  communityFeaturesEnabled: true
};

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
    
    if (!adminUser || !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    // In a real application, you would fetch settings from a Settings collection
    // For now, we'll return default settings
    return NextResponse.json({
      success: true,
      settings: defaultSettings
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
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
      }, { status: 401 });
    }

    await dbConnect();
    const { isAdmin, user: adminUser } = await checkAdminAccess(session.user.email);
    
    if (!adminUser || !isAdmin) {
      return NextResponse.json({ 
        success: false, 
        message: "Admin access required" 
      }, { status: 403 });
    }

    const { settings } = await request.json();
    
    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid settings data" 
      }, { status: 400 });
    }

    // In a real application, you would update the settings in the database
    // For now, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      settings: { ...defaultSettings, ...settings }
    });

  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}
