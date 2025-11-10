import { Card } from '../../../components/ui/Card';

/**
 * DashboardSkeleton - Skeleton loader for dashboard layout
 * 
 * Displays placeholder cards matching the dashboard structure
 * while data is being loaded.
 */
export const DashboardSkeleton = () => {
  const SkeletonCard = () => (
    <Card className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl min-h-[320px] animate-pulse" padding="none">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-8 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </Card>
  );

  const SkeletonActivityCard = () => (
    <Card className="p-6 bg-white border border-gray-200 shadow-md rounded-2xl min-h-[320px] animate-pulse" padding="none">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
          <div>
            <div className="h-5 bg-gray-200 rounded w-32 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="w-12 h-6 bg-gray-200 rounded-lg"></div>
      </div>
      
      {/* Activity Items */}
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Skeleton */}
      <div className="flex-shrink-0 mb-6 sm:mb-8">
        <Card className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl animate-pulse" padding="none">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-10"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Stats Cards */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>

          {/* Right Column - Activities */}
          <div className="col-span-12 lg:col-span-4">
            <SkeletonActivityCard />
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-8 sm:h-12" />
    </div>
  );
};

