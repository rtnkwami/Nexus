export const getDateRange = (period) => {
  const now = new Date();
  const endDate = new Date(now); // Current moment
  let startDate;
  
  switch (period) {
    case 'daily':
      // Last 24 hours
      startDate = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      break;
      
    case 'weekly':
      // Last 7 days
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
      
    case 'monthly':
      // Last 30 days
      startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      break;
      
    case 'yearly':
      // Last 365 days
      startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
      break;
      
    default:
      throw new Error("Invalid period: must be 'daily', 'weekly', 'monthly', or 'yearly'");
  }
  
  return { startDate, endDate };
};

export const getPreviousDateRange = (period) => {
    const { startDate, endDate } = getDateRange(period);
    const duration = endDate.getTime() - startDate.getTime();

    return {
      startDate: new Date(startDate.getTime() - duration),
      endDate: startDate
    };
};