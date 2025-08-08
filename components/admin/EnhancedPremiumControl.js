"use client";
import { useState, useEffect } from "react";
import {
  StarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  CreditCardIcon,
  ArrowTrendingUpIcon,
  CalendarDaysIcon,
  GiftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

export default function EnhancedPremiumControl() {
  const [premiumStats, setPremiumStats] = useState({
    totalSubscribers: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    churnRate: 0,
    averageSessionLength: 0,
    lifetimeValue: 0
  });
  
  const [pricingPlans, setPricingPlans] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: "",
    price: 0,
    duration: "monthly",
    features: [],
    isActive: true,
    isPopular: false,
    discount: 0
  });

  const durations = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "lifetime", label: "Lifetime" }
  ];

  const defaultFeatures = [
    "Access to all premium problems",
    "Advanced analytics dashboard",
    "Priority customer support",
    "Video solutions",
    "Interview preparation",
    "Company-specific problem sets",
    "Ad-free experience",
    "Unlimited submissions",
    "Progress tracking",
    "Custom study plans"
  ];

  useEffect(() => {
    fetchPremiumData();
  }, []);

  const fetchPremiumData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      setTimeout(() => {
        setPremiumStats({
          totalSubscribers: 2847,
          monthlyRevenue: 42705,
          conversionRate: 12.3,
          churnRate: 3.8,
          averageSessionLength: 45.2,
          lifetimeValue: 180.50
        });

        setPricingPlans([
          {
            _id: "1",
            name: "Basic Premium",
            price: 9.99,
            duration: "monthly",
            features: [
              "Access to all premium problems",
              "Basic analytics",
              "Email support",
              "Video solutions"
            ],
            isActive: true,
            isPopular: false,
            subscribers: 1245,
            discount: 0,
            createdAt: new Date("2023-01-01")
          },
          {
            _id: "2",
            name: "Pro Premium",
            price: 19.99,
            duration: "monthly",
            features: [
              "All Basic features",
              "Advanced analytics dashboard",
              "Priority support",
              "Interview preparation",
              "Company-specific problems",
              "Custom study plans"
            ],
            isActive: true,
            isPopular: true,
            subscribers: 1402,
            discount: 0,
            createdAt: new Date("2023-01-01")
          },
          {
            _id: "3",
            name: "Annual Pro",
            price: 199.99,
            duration: "yearly",
            features: [
              "All Pro features",
              "2 months free",
              "Exclusive content",
              "1-on-1 mentorship sessions",
              "Certificate programs"
            ],
            isActive: true,
            isPopular: false,
            subscribers: 200,
            discount: 20,
            createdAt: new Date("2023-01-01")
          }
        ]);

        setSubscribers([
          {
            _id: "1",
            username: "john_coder",
            email: "john@example.com",
            plan: "Pro Premium",
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-02-01"),
            status: "active",
            paymentMethod: "Credit Card",
            totalPaid: 59.97,
            renewalDate: new Date("2024-02-01")
          },
          {
            _id: "2",
            username: "sarah_dev",
            email: "sarah@example.com", 
            plan: "Annual Pro",
            startDate: new Date("2023-12-01"),
            endDate: new Date("2024-12-01"),
            status: "active",
            paymentMethod: "PayPal",
            totalPaid: 199.99,
            renewalDate: new Date("2024-12-01")
          },
          {
            _id: "3",
            username: "mike_student",
            email: "mike@example.com",
            plan: "Basic Premium", 
            startDate: new Date("2024-01-15"),
            endDate: new Date("2024-01-20"),
            status: "expired",
            paymentMethod: "Credit Card",
            totalPaid: 9.99,
            renewalDate: null
          }
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching premium data:", error);
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating pricing plan:", planFormData);
      // Simulate API call
      setTimeout(() => {
        setShowPlanModal(false);
        resetPlanForm();
        fetchPremiumData();
      }, 1000);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating pricing plan:", editingPlan._id, planFormData);
      // Simulate API call
      setTimeout(() => {
        setShowPlanModal(false);
        setEditingPlan(null);
        resetPlanForm();
        fetchPremiumData();
      }, 1000);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  const handleTogglePlanStatus = async (planId, isActive) => {
    try {
      console.log(`${isActive ? 'Deactivating' : 'Activating'} plan ${planId}`);
      // Simulate API call
      setTimeout(() => {
        fetchPremiumData();
      }, 500);
    } catch (error) {
      console.error("Error toggling plan status:", error);
    }
  };

  const resetPlanForm = () => {
    setPlanFormData({
      name: "",
      price: 0,
      duration: "monthly",
      features: [],
      isActive: true,
      isPopular: false,
      discount: 0
    });
  };

  const openEditPlanModal = (plan) => {
    setEditingPlan(plan);
    setPlanFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features,
      isActive: plan.isActive,
      isPopular: plan.isPopular,
      discount: plan.discount || 0
    });
    setShowPlanModal(true);
  };

  const toggleFeature = (feature) => {
    setPlanFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400";
      case "expired": return "bg-red-500/20 text-red-400";
      case "cancelled": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-white">Loading premium data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Premium Management</h2>
          <p className="text-gray-400">Manage premium subscriptions, pricing, and features</p>
        </div>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Subscribers</p>
              <p className="text-2xl font-bold text-white">{premiumStats.totalSubscribers.toLocaleString()}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white">${premiumStats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white">{premiumStats.conversionRate}%</p>
            </div>
            <ArrowTrendingUpIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Churn Rate</p>
              <p className="text-2xl font-bold text-white">{premiumStats.churnRate}%</p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Session</p>
              <p className="text-2xl font-bold text-white">{premiumStats.averageSessionLength}m</p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Lifetime Value</p>
              <p className="text-2xl font-bold text-white">${premiumStats.lifetimeValue}</p>
            </div>
            <StarIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Pricing Plans Management */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Pricing Plans</h3>
          <button
            onClick={() => setShowPlanModal(true)}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Plan</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-slate-700/50 rounded-lg p-6 border-2 ${
                plan.isPopular ? "border-purple-500" : "border-slate-600/50"
              } relative`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h4 className="text-white font-semibold text-lg">{plan.name}</h4>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/{plan.duration}</span>
                </div>
                {plan.discount > 0 && (
                  <div className="mt-1">
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-sm">
                      {plan.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <div className="text-gray-400 text-xs">
                    +{plan.features.length - 4} more features
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-gray-400">Subscribers:</span>
                <span className="text-white font-medium">{plan.subscribers}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openEditPlanModal(plan)}
                  className="flex-1 text-blue-400 hover:text-blue-300 p-2 rounded transition-colors text-sm"
                  title="Edit Plan"
                >
                  <PencilIcon className="w-4 h-4 mx-auto" />
                </button>
                
                <button
                  onClick={() => handleTogglePlanStatus(plan._id, plan.isActive)}
                  className={`flex-1 p-2 rounded transition-colors text-sm ${
                    plan.isActive 
                      ? "text-red-400 hover:text-red-300" 
                      : "text-green-400 hover:text-green-300"
                  }`}
                  title={plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                >
                  {plan.isActive ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Subscribers */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Premium Subscribers</h3>
          <div className="text-sm text-gray-400">
            {subscribers.filter(s => s.status === 'active').length} active subscribers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">User</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Plan</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Started</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Expires</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Total Paid</th>
                <th className="text-left px-4 py-3 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600/50">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white font-medium">{subscriber.username}</p>
                      <p className="text-gray-400 text-sm">{subscriber.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white">{subscriber.plan}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(subscriber.status)}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white">{formatDate(subscriber.startDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-white">{formatDate(subscriber.endDate)}</span>
                      {subscriber.status === 'active' && (
                        <p className="text-gray-400 text-xs">
                          {calculateDaysLeft(subscriber.endDate)} days left
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">${subscriber.totalPaid}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedSubscriber(subscriber);
                        setShowSubscriberModal(true);
                      }}
                      className="text-blue-400 hover:text-blue-300 p-1 rounded transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Creation/Edit Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">
                {editingPlan ? "Edit Pricing Plan" : "Create New Plan"}
              </h3>
            </div>
            
            <form onSubmit={editingPlan ? handleEditPlan : handleCreatePlan} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={planFormData.name}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={planFormData.price}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration *
                  </label>
                  <select
                    value={planFormData.duration}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {durations.map(duration => (
                      <option key={duration.value} value={duration.value}>{duration.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={planFormData.discount}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, discount: parseInt(e.target.value) }))}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Features
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {defaultFeatures.map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={planFormData.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="rounded border-slate-500"
                      />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={planFormData.isActive}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Active Plan</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={planFormData.isPopular}
                    onChange={(e) => setPlanFormData(prev => ({ ...prev, isPopular: e.target.checked }))}
                    className="rounded border-slate-500"
                  />
                  <span className="text-gray-300">Mark as Popular</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanModal(false);
                    setEditingPlan(null);
                    resetPlanForm();
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  {editingPlan ? "Update Plan" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscriber Details Modal */}
      {showSubscriberModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Subscriber Details</h3>
              <button
                onClick={() => setShowSubscriberModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Username</p>
                <p className="text-white font-medium">{selectedSubscriber.username}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white">{selectedSubscriber.email}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Current Plan</p>
                <p className="text-white font-medium">{selectedSubscriber.plan}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedSubscriber.status)}`}>
                  {selectedSubscriber.status}
                </span>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Subscription Period</p>
                <p className="text-white">
                  {formatDate(selectedSubscriber.startDate)} - {formatDate(selectedSubscriber.endDate)}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Payment Method</p>
                <p className="text-white">{selectedSubscriber.paymentMethod}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm">Total Paid</p>
                <p className="text-white font-medium">${selectedSubscriber.totalPaid}</p>
              </div>

              {selectedSubscriber.renewalDate && (
                <div>
                  <p className="text-gray-400 text-sm">Next Renewal</p>
                  <p className="text-white">{formatDate(selectedSubscriber.renewalDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
