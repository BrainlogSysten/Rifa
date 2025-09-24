import React from 'react';
import { BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <BarChart3 className="w-16 h-16 text-gray-600 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Análise e Relatórios</h2>
      <p className="text-gray-400">Página em desenvolvimento</p>
    </div>
  );
};

export default Analytics;