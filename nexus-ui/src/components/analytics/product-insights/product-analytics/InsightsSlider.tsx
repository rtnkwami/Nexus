import { X, Lightbulb, TrendingUp, AlertTriangle, Target, DollarSign, ShoppingCart } from 'lucide-react';

const ProductInsightsSlider = ({ isOpen, onClose, insights, loading, error, onRetry }) => {

  const getStatusColor = (status) => {
    switch (status) {
      case 'positive': return 'text-green-600 bg-green-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMetricIcon = (metric) => {
    const iconClass = "w-5 h-5 text-gray-600";
    if (metric.toLowerCase().includes('revenue')) return <DollarSign className={iconClass} />;
    if (metric.toLowerCase().includes('conversion')) return <Target className={iconClass} />;
    if (metric.toLowerCase().includes('order')) return <ShoppingCart className={iconClass} />;
    return <TrendingUp className={iconClass} />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-30 z-50 flex items-center justify-end pointer-events-none">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
        style={{ pointerEvents: 'auto' }}
      ></div>
      <div className="bg-white h-full w-full max-w-md shadow-xl overflow-hidden flex flex-col relative" style={{ pointerEvents: 'auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Insights</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Analyzing product performance...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
              <button
                onClick={onRetry}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          )}

          {insights && (
            <div className="space-y-6">
              {/* Primary Insight */}
              <div className={`rounded-lg p-4 border ${getStatusColor(insights.primaryInsight.status)}`}>
                <h3 className="font-semibold text-lg mb-2">{insights.primaryInsight.title}</h3>
                <p className="text-sm mb-3">{insights.primaryInsight.message}</p>
                <div className="bg-white bg-opacity-50 rounded p-3">
                  <p className="text-sm font-medium">What to do:</p>
                  <p className="text-sm mt-1">{insights.primaryInsight.actionable}</p>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div>
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Performance Breakdown</h3>
                </div>
                <div className="space-y-4">
                  {insights.performanceBreakdown.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getMetricIcon(item.metric)}
                          <span className="font-medium text-gray-900 ml-2">{item.metric}</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900">{item.value}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.explanation}</p>
                      <p className="text-sm text-gray-800 font-medium">{item.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div>
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Actionable Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {insights.actionableRecommendations.map((rec, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{rec.action}</h4>
                      <p className="text-sm text-gray-600 mb-2">{rec.reasoning}</p>
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Expected Impact:</span> {rec.expectedImpact}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunity Analysis */}
              <div>
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Opportunity Analysis</h3>
                </div>
                
                {insights.opportunityAnalysis.strengths && insights.opportunityAnalysis.strengths.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-green-800 mb-2">Strengths to Leverage</h4>
                    <ul className="space-y-1">
                      {insights.opportunityAnalysis.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-green-700 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.opportunityAnalysis.improvements && insights.opportunityAnalysis.improvements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-orange-800 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {insights.opportunityAnalysis.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-orange-700 flex items-start">
                          <span className="text-orange-500 mr-2">→</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {insights.opportunityAnalysis.potentialRevenue && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Revenue Potential:</span> {insights.opportunityAnalysis.potentialRevenue}
                    </p>
                  </div>
                )}
              </div>

              {/* System Note */}
              {insights.systemNote && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 text-sm">{insights.systemNote.message}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInsightsSlider;