import MetricCard from "./MetricCard";

function ProductKPIs({ revenue, unitsSold, orders, conversion }) {

  // Helper function for conversion rate color
  function getConversionRateColor(rate: number) {
    if (rate < 1) return "text-red-700";
    if (rate >= 1 && rate < 1.5) return "text-orange-600";
    if (rate >= 1.5 && rate < 3) return "text-yellow-500";
    return "text-green-600";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      <MetricCard
        title="Total Revenue"
        value={revenue}
        formatValue={(val) => `₵${parseFloat(val.toString()).toLocaleString()}`}
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        valueColor="text-black"
      />
      
      <MetricCard
        title="Units Sold"
        value={unitsSold}
        formatValue={(val) => parseInt(val.toString()).toLocaleString()}
        iconBgColor="bg-blue-100 dark:bg-blue-900/30"
        valueColor="text-black"
      />
      
      <MetricCard
        title="Orders with Product"
        value={orders}
        formatValue={(val) => parseInt(val.toString()).toLocaleString()}
        iconBgColor="bg-purple-100 dark:bg-purple-900/30"
        valueColor="text-black"
      />
      
      <MetricCard
        title="Conversion Rate"
        value={conversion}
        formatValue={(val) => `${parseFloat(val.toString()).toFixed(2)}%`}
        iconBgColor="bg-green-100 dark:bg-green-900/30"
        valueColor={getConversionRateColor(parseFloat(conversion))}
      />
    </div>
  );
}

export { ProductKPIs };