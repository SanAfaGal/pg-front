import { useState } from 'react';
import { Edit, ArrowLeft, Calendar, CreditCard, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { PageLayout } from '../components/ui/PageLayout';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useToast } from '../shared';
import { ClientFormModal } from '../components/clients/ClientFormModal';
import { BiometricCaptureModal } from '../components/clients/BiometricCaptureModal';
import { BiometricStatus } from '../components/biometrics/BiometricStatus';
import { useClient, useClientDashboard, clientHelpers, type ClientDashboardResponse } from '../features/clients';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { ClientInfoTab } from '../components/clients/ClientInfoTab';
import { SubscriptionsTab } from '../components/clients/SubscriptionsTabNew';
import { AttendanceTab } from '../components/clients/AttendanceTab';
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

  const isLoading = clientLoading || dashboardLoading;

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
            <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cliente no encontrado</h2>
            <p className="text-neutral-600 mb-8">No se pudo cargar la información del cliente solicitado.</p>
            <Button onClick={onBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Volver a Clientes
            </Button>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  const fullName = dashboard ? `${dashboard.client.first_name} ${dashboard.client.last_name}` : '';
  const age = client ? clientHelpers.calculateAge(client.birth_date) : 0;

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
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Sidebar con información del cliente */}
        <div className="w-full xl:w-80 space-y-6 flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8" variant="elevated">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Avatar y nombre */}
                <div className="relative">
                  <Avatar
                    name={fullName}
                    src={dashboard?.biometric?.thumbnail || client?.meta_info?.photo_url}
                    size="2xl"
                    className="ring-4 ring-white shadow-xl"
                  />
                  <Badge 
                    variant={dashboard?.client.is_active ? 'success' : 'error'} 
                    size="sm"
                    animated
                    className="absolute -bottom-2 -right-2"
                  >
                    {dashboard?.client.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>


                {/* Botones de acción */}
                <div className="w-full space-y-3">
                  <Button
                    onClick={() => setIsEditModalOpen(true)}
                    fullWidth
                    leftIcon={<Edit className="w-4 h-4" />}
                  >
                    Editar Información
                  </Button>

                  <Button
                    onClick={() => setIsBiometricModalOpen(true)}
                    variant="secondary"
                    fullWidth
                    leftIcon={<Edit className="w-4 h-4" />}
                  >
                    Gestionar biometría
                  </Button>

                </div>

                {/* Estado de autenticación */}
                <div className="w-full pt-6 border-t border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                    Autenticación
                  </h3>
                  <BiometricStatus 
                    biometric={dashboard?.biometric ? {
                      has_face_biometric: true,
                      is_active: true,
                      thumbnail: dashboard.biometric.thumbnail,
                      registered_at: dashboard.biometric.updated_at
                    } : undefined} 
                  />
                </div>

              </div>
            </Card>
          </motion.div>
        </div>

        {/* Contenido principal con tabs */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card variant="elevated" padding="lg">
              <Tabs value={activeTab} onChange={setActiveTab} className="w-full">
                <TabsList className="w-full mb-8">
                  <TabsTrigger value="info" activeValue={activeTab} onChange={setActiveTab}>
                    <Activity className="w-4 h-4 mr-2" />
                    Información General
                  </TabsTrigger>
                  <TabsTrigger value="subscriptions" activeValue={activeTab} onChange={setActiveTab}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Suscripciones
                  </TabsTrigger>
                  <TabsTrigger value="attendance" activeValue={activeTab} onChange={setActiveTab}>
                    <Calendar className="w-4 h-4 mr-2" />
                    Asistencias
                  </TabsTrigger>
                </TabsList>

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
                          onCall={handleCall}
                          onWhatsApp={handleWhatsApp}
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
                        <SubscriptionsTab
                          dashboard={dashboard}
                          clientId={clientId}
                          clientName={fullName}
                        />
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
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>

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
              has_face_biometric: true,
              is_active: true,
              thumbnail: dashboard.biometric.thumbnail,
              registered_at: dashboard.biometric.updated_at
            } : undefined}
          />
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
