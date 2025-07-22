export const getDateRange = (period) => {
  const now = new Date();
  const endDate = new Date(now); // Current moment
  let startDate;
  
  switch (period) {
    case 'daily':
      // Last 24 hours
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
      break;
      
    case 'weekly':
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
      
    case 'monthly':
      // Last 30 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
      
    case 'yearly':
      // Last 365 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 365);
      break;
      
    default:
      throw new Error("Invalid period: must be 'daily', 'weekly', 'monthly', or 'yearly'");
  }
  
  return { startDate, endDate };
};
