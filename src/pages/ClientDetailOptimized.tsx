import { useState, useMemo } from 'react';
import { ArrowLeft, Calendar, CreditCard, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { PageLayout } from '../components/ui/PageLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../shared';
import { ClientFormModal } from '../features/clients/components/ClientFormModal';
import { BiometricCaptureModal } from '../features/clients/components/BiometricCaptureModal';
import { useClient, useClientDashboard, clientHelpers } from '../features/clients';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ClientInfoTab } from '../features/clients/components/ClientInfoTab';
import { SubscriptionsTab } from '../features/subscriptions/components/SubscriptionsTab';
import { AttendanceTab } from '../features/clients';
import { useActivePlans } from '../features/plans';
import { Plan } from '../features/subscriptions/api/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ClientDetailProps {
  clientId: string;
  onBack: () => void;
}

export function ClientDetailOptimized({ clientId, onBack }: ClientDetailProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const { showToast } = useToast();

  const { data: client, isLoading: clientLoading } = useClient(clientId);
  const { data: dashboard, isLoading: dashboardLoading, isError } = useClientDashboard(clientId);
  const { data: activePlansData, isLoading: plansLoading } = useActivePlans();

  const isLoading = clientLoading || dashboardLoading;

  // Convert plans from plans module format to subscriptions module format
  const plans: Plan[] = useMemo(() => {
    if (!activePlansData) return [];
    
    return activePlansData.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      duration_days: plan.duration_unit === 'day' ? plan.duration_count :
                    plan.duration_unit === 'week' ? plan.duration_count * 7 :
                    plan.duration_unit === 'month' ? plan.duration_count * 30 :
                    plan.duration_unit === 'year' ? plan.duration_count * 365 : 30,
      is_active: plan.is_active,
      created_at: plan.created_at,
      updated_at: plan.updated_at,
    }));
  }, [activePlansData]);

  // Memoized full name
  const fullName = useMemo(() => {
    if (dashboard) {
      return `${dashboard.client.first_name} ${dashboard.client.last_name}`;
    }
    if (client) {
      return `${client.first_name} ${client.last_name}`;
    }
    return '';
  }, [dashboard, client]);

  // Memoized age
  const age = useMemo(() => {
    return client ? clientHelpers.calculateAge(client.birth_date) : 0;
  }, [client]);

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    showToast({
      type: 'success',
      title: 'Éxito',
      message: 'Cliente actualizado exitosamente'
    });
  };

  const handleBiometricSuccess = () => {
    setIsBiometricModalOpen(false);
    showToast({
      type: 'success',
      title: 'Éxito',
      message: 'Biometría actualizada exitosamente'
    });
  };

  const handleWhatsApp = () => {
    if (client?.phone) {
      const phoneNumber = client.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phoneNumber}`, '_blank');
    }
  };

  const handleCall = () => {
    if (client?.phone) {
      window.location.href = `tel:${client.phone}`;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="xl" text="Cargando información del cliente..." />
        </div>
      </PageLayout>
    );
  }

  if (isError || !client) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cliente no encontrado</h2>
            <p className="text-gray-600 mb-8">No se pudo cargar la información del cliente solicitado.</p>
            <Button onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Volver a Clientes
            </Button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={fullName}
      subtitle={`${age} años • Cliente desde ${new Date(client.created_at).toLocaleDateString('es-CO')}`}
      actions={
        <Button
          variant="ghost"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b border-gray-200 px-6 pt-4">
              <TabsTrigger value="info" activeValue={activeTab} onChange={setActiveTab}>
                <div className="flex items-center justify-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>Información General</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" activeValue={activeTab} onChange={setActiveTab}>
                <div className="flex items-center justify-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Suscripciones</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="attendance" activeValue={activeTab} onChange={setActiveTab}>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Asistencias</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "info" && (
                  <TabsContent key="info" value="info" activeValue={activeTab}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ClientInfoTab
                        client={client}
                        dashboard={dashboard}
                        onCall={handleCall}
                        onWhatsApp={handleWhatsApp}
                        onEdit={() => setIsEditModalOpen(true)}
                        onBiometric={() => setIsBiometricModalOpen(true)}
                      />
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === "subscriptions" && (
                  <TabsContent key="subscriptions" value="subscriptions" activeValue={activeTab}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plansLoading ? (
                        <div className="flex flex-col items-center justify-center p-12">
                          <LoadingSpinner size="lg" />
                          <p className="text-gray-600 mt-4">Cargando planes disponibles...</p>
                        </div>
                      ) : (
                        <SubscriptionsTab
                          clientId={clientId}
                          clientName={fullName}
                          plans={plans}
                        />
                      )}
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === "attendance" && (
                  <TabsContent key="attendance" value="attendance" activeValue={activeTab}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AttendanceTab dashboard={dashboard} />
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </motion.div>

      {/* Modales */}
      <AnimatePresence>
        {isEditModalOpen && client && (
          <ClientFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
            client={client}
          />
        )}

        {isBiometricModalOpen && client && dashboard && (
          <BiometricCaptureModal
            isOpen={isBiometricModalOpen}
            onClose={() => setIsBiometricModalOpen(false)}
            onSuccess={handleBiometricSuccess}
            clientId={client.id}
            clientName={fullName}
            biometric={dashboard.biometric ? {
              id: dashboard.biometric.id || '',
              type: 'face',
              data: '',
              thumbnail: dashboard.biometric.thumbnail,
              has_face_biometric: true,
              created_at: dashboard.biometric.created_at || new Date().toISOString(),
              updated_at: dashboard.biometric.updated_at || new Date().toISOString(),
            } : undefined}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
