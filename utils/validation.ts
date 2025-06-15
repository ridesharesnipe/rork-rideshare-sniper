// Essential validation utilities only

// Email validation utility
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }
  
  if (email.length < 5) {
    return "Email is too short";
  }
  
  if (email.length > 100) {
    return "Email is too long";
  }
  
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  
  return null;
};

// Password validation utility
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required";
  }
  
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  
  if (password.length > 100) {
    return "Password is too long";
  }
  
  return null;
};

// Name validation utility
export const validateName = (name: string): string | null => {
  if (!name) {
    return "Name is required";
  }
  
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  
  if (name.length > 50) {
    return "Name is too long";
  }
  
  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[A-Za-z\s\-']+$/;
  
  if (!nameRegex.test(name)) {
    return "Name can only contain letters, spaces, hyphens, and apostrophes";
  }
  
  return null;
};