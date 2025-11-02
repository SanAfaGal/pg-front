import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/Tabs';
import { CheckInFacial } from './CheckInFacial';
import { AttendanceHistory } from './AttendanceHistory';
import { PageLayout } from '../../../components/ui/PageLayout';
import { Camera, Clock } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('checkin');

  return (
    <PageLayout
      title="Asistencias"
      subtitle="Gestión de check-in y registros de asistencia"
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
