export const getDateRange = (period) => {
    const now = new Date();
    const endDate = new Date(now); // Default: now
    let startDate;

    if (period === "weekly") {
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);

    } else if (period === "monthly") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);

    } else {
        throw new Error("Invalid period: must be 'weekly' or 'monthly'");
    }

    return { startDate, endDate };
};
