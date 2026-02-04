// Helper function to extract email from text
export const extractEmail = (text) => {
  if (!text || typeof text !== "string") return null;
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
};

// Helper function to extract company name (looks for common patterns)
export const extractCompany = (text) => {
  if (!text || typeof text !== "string") return null;
  
  // Look for patterns like "Company:", "Organization:", "Employer:", etc.
  const companyPatterns = [
    /(?:company|organization|employer|corporation|firm)[\s:]+([A-Z][A-Za-z\s&]+?)(?:\n|\.|,|$)/i,
    /(?:at|from|with)\s+([A-Z][A-Za-z\s&]+?)(?:\s+(?:Inc|LLC|Ltd|Corp|Corporation))?/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
};

