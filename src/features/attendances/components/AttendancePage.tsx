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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
          <TabsList className="w-full border-b border-gray-200 px-6 pt-4">
            <TabsTrigger 
              value="checkin" 
              activeValue={activeTab} 
              onChange={setActiveTab}
            >
              <div className="flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                <span>Check-in</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              activeValue={activeTab} 
              onChange={setActiveTab}
            >
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Historial</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className={activeTab === 'checkin' ? 'p-0' : 'p-6'}>
            <TabsContent value="checkin" activeValue={activeTab}>
              <div className="px-4 sm:px-6 lg:px-8 py-6">
                <CheckInFacial />
              </div>
            </TabsContent>

            <TabsContent value="history" activeValue={activeTab}>
              <AttendanceHistory />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageLayout>
  );
};
