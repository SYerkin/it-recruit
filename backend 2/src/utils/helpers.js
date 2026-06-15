// Helper function to generate slug from name
export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function to convert JSON array string to array (for SQLite)
export const parseJsonArray = (jsonString) => {
  if (!jsonString) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
};

// Helper function to convert array to JSON string (for SQLite)
export const stringifyJsonArray = (array) => {
  if (!array || !Array.isArray) return null;
  return JSON.stringify(array);
};

// Helper function to format user response (exclude password)
export const formatUserResponse = (user) => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

