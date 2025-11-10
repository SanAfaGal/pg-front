import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { CheckInFacial } from './CheckInFacial';
import { AttendanceHistory } from './AttendanceHistory';
import { PageLayout } from '../../../components/ui/PageLayout';
import { RefreshButton } from '../../../components/ui/RefreshButton';
import { useToast } from '../../../shared';
import { useAttendanceHistory } from '../hooks/useAttendances';
import { Camera, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('checkin');
  const { showToast } = useToast();
  const { refetch, isLoading, isRefetching } = useAttendanceHistory();
  const isRefreshing = isLoading || isRefetching;

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
      showToast({
        type: 'success',
        title: 'Actualizado',
        message: 'Los datos de asistencias se han actualizado correctamente',
      });
    } catch {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'No se pudo actualizar los datos de asistencias',
      });
    }
  }, [refetch, showToast]);

  return (
    <PageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Asistencias
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Gestión de check-in y registros de asistencia
            </p>
          </div>
          <RefreshButton
            onClick={handleRefresh}
            isRefetching={isRefreshing}
            variant="secondary"
          />
        </div>

        <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
          <div className="flex justify-center w-full">
            <TabsList className="inline-flex max-w-full">
              <TabsTrigger 
                value="checkin" 
                activeValue={activeTab} 
                onChange={setActiveTab}
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Check-in</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                activeValue={activeTab} 
                onChange={setActiveTab}
              >
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Historial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6">
            <TabsContent value="checkin" activeValue={activeTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CheckInFacial />
              </motion.div>
            </TabsContent>

            <TabsContent value="history" activeValue={activeTab} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AttendanceHistory />
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};
