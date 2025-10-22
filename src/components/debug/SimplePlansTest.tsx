import React from 'react';
import { fetchActivePlans } from '../../features/plans/api/planApi';

export const SimplePlansTest: React.FC = () => {
  const [plans, setPlans] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const testFetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing fetchActivePlans directly...');
      const result = await fetchActivePlans();
      console.log('Direct fetch result:', result);
      setPlans(result);
    } catch (err) {
      console.error('Direct fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Simple Plans Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testFetch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Fetch Plans'}
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Status:</h2>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>Plans count: {plans.length}</p>
        </div>

        {plans.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Plans:</h2>
            <div className="space-y-2">
              {plans.map((plan, index) => (
                <div key={index} className="p-3 border rounded">
                  <p><strong>ID:</strong> {plan.id}</p>
                  <p><strong>Name:</strong> {plan.name}</p>
                  <p><strong>Price:</strong> {plan.price}</p>
                  <p><strong>Active:</strong> {plan.is_active ? 'Yes' : 'No'}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
