
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface AdminResetFormProps {
  resetCode: string;
  onResetCodeChange: (code: string) => void;
  onResetSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const AdminResetForm: React.FC<AdminResetFormProps> = ({
  resetCode,
  onResetCodeChange,
  onResetSubmit,
  onCancel
}) => {
  return (
    <div className="mb-8 bg-red-50 border-2 border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        Admin Reset - Today's Bookings
      </h3>
      <form onSubmit={onResetSubmit} className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="reset-code" className="block text-sm font-medium text-red-700 mb-2">
            Enter Admin Reset Code:
          </label>
          <input
            id="reset-code"
            type="password"
            value={resetCode}
            onChange={(e) => onResetCodeChange(e.target.value)}
            className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Admin reset code"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Reset All
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Cancel
        </button>
      </form>
      <p className="text-xs text-red-600 mt-2">
        This will delete all seat bookings for today ({new Date().toLocaleDateString()})
      </p>
    </div>
  );
};

export default AdminResetForm;
