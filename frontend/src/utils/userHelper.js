/**
 * Helper functions for user management
 */

export const getUserData = () => {
  try {
    const userData = localStorage.getItem("minimalUser");
    if (!userData) return null;
    
    const user = JSON.parse(userData);
    return user;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const isUserAdmin = (user) => {
  if (!user) return false;
  
  // Check role property (case insensitive)
  if (user.role && user.role.toUpperCase() === "ADMIN") {
    return true;
  }
  
  // Also check for isAdmin property
  if (user.isAdmin === true) {
    return true;
  }
  
  return false;
};

export const checkAndFixUserData = async (apiAdapter, userId) => {
  if (!userId) {
    const user = getUserData();
    userId = user?.id;
    if (!userId) return null;
  }
  
  try {
    console.log("Checking admin status for:", userId);
    const result = await apiAdapter.checkAdminStatus(userId);
    console.log("Admin status result:", result);
    
    const userData = getUserData();
    if (!userData) return null;
    
    // Update role in localStorage if needed
    if (result.isAdmin && userData.role !== "ADMIN") {
      const updatedUser = {
        ...userData,
        role: "ADMIN"
      };
      console.log("Updating user in localStorage with ADMIN role:", updatedUser);
      localStorage.setItem("minimalUser", JSON.stringify(updatedUser));
      return updatedUser;
    }
    
    return userData;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return getUserData();
  }
};

export const updateUserRole = (role) => {
  const userData = getUserData();
  if (!userData) return false;
  
  const updatedUser = {
    ...userData,
    role
  };
  
  localStorage.setItem("minimalUser", JSON.stringify(updatedUser));
  console.log("Updated user role in localStorage:", updatedUser);
  return true;
};
