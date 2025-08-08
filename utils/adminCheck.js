// Utility function for consistent admin checks across all admin APIs
import { User } from "@/models/User";

export const checkAdminAccess = async (email) => {
  if (!email) return false;
  
  const user = await User.findOne({ email });
  if (!user) return false;
  
  // Check multiple admin indicators: isAdmin flag, role field, or specific admin emails
  const adminEmails = ["admin@upcode.com", "sarah@upcode.com", "rajdeepsingh10789@gmail.com"];
  const isAdmin = user.isAdmin || user.role === "admin" || adminEmails.includes(user.email);
  
  return { isAdmin, user };
};
