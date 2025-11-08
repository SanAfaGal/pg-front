import React, { useState, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { CheckInFacial } from './CheckInFacial';
import { AttendanceHistory } from './AttendanceHistory';
import { PageLayout } from '../../../components/ui/PageLayout';
import { Button } from '../../../components/ui/Button';
import { useToast } from '../../../shared';
import { useAttendanceHistory } from '../hooks/useAttendances';
import { Camera, Clock, RefreshCw } from 'lucide-react';

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
    <PageLayout
      title="Asistencias"
      subtitle="Gestión de check-in y registros de asistencia"
      actions={
        <Button
          variant="secondary"
          size="md"
          onClick={handleRefresh}
          disabled={isRefreshing}
          leftIcon={
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          }
          className="whitespace-nowrap"
        >
          {isRefreshing ? 'Actualizando...' : 'Actualizar'}
        </Button>
      }
    >
      <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
        <TabsList className="w-full border-b border-gray-200">
          <TabsTrigger 
            value="checkin" 
            activeValue={activeTab} 
            onChange={setActiveTab}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Check-in</span>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            activeValue={activeTab} 
            onChange={setActiveTab}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Historial</span>
            </div>
          </TabsTrigger>
        </TabsList>

        <div className="p-3 sm:p-4 lg:p-6">
          <TabsContent value="checkin" activeValue={activeTab}>
            <CheckInFacial />
          </TabsContent>

          <TabsContent value="history" activeValue={activeTab}>
            <AttendanceHistory />
          </TabsContent>
        </div>
      </Tabs>
    </PageLayout>
  );
};
