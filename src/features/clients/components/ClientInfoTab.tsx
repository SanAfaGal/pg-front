import React, { memo } from 'react';
import { User, Phone, MessageCircle, MapPin, Mail, Edit } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { BiometricStatus } from '../../../components/biometrics/BiometricStatus';
import { type Client, clientHelpers } from '../..';
import { type ClientDashboardResponse } from '../..';

interface ClientInfoTabProps {
  client: Client;
  dashboard?: ClientDashboardResponse;
  onCall: () => void;
  onWhatsApp: () => void;
  onEdit: () => void;
  onBiometric: () => void;
}

export const ClientInfoTab: React.FC<ClientInfoTabProps> = memo(({ 
  client, 
  dashboard,
  onCall, 
  onWhatsApp,
  onEdit,
  onBiometric,
}) => {
  const age = clientHelpers.calculateAge(client.birth_date);
  const fullName = dashboard ? `${dashboard.client.first_name} ${dashboard.client.last_name}` : 
                   `${client.first_name} ${client.last_name}`;

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Sidebar con información del cliente */}
      <div className="w-full xl:w-80 space-y-6 flex-shrink-0">
        <Card className="p-6" variant="elevated">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Avatar y nombre */}
            <div className="relative w-full">
              <div className="flex justify-center mb-4">
                <Avatar
                  name={fullName}
                  src={dashboard?.biometric?.thumbnail || client?.meta_info?.photo_url}
                  size="2xl"
                  className="ring-4 ring-white shadow-xl"
                />
              </div>
              <div className="flex justify-center mb-4">
                <Badge 
                  variant={dashboard?.client.is_active ? 'success' : 'error'} 
                  size="sm"
                  animated
                >
                  {dashboard?.client.is_active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{fullName}</h2>
              <p className="text-sm text-gray-600">
                {age} años • Cliente desde {new Date(client.created_at).toLocaleDateString('es-CO')}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="w-full space-y-3 pt-4 border-t border-gray-200">
              <Button
                onClick={onEdit}
                fullWidth
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Editar Información
              </Button>

              <Button
                onClick={onBiometric}
                variant="secondary"
                fullWidth
                leftIcon={<Edit className="w-4 h-4" />}
              >
                Gestionar Biometría
              </Button>
            </div>

            {/* Estado de autenticación */}
            <div className="w-full pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                Autenticación
              </h3>
              <BiometricStatus 
                biometric={dashboard?.biometric ? {
                  id: dashboard.biometric.id || '',
                  type: 'face',
                  data: '',
                  thumbnail: dashboard.biometric.thumbnail,
                  has_face_biometric: true,
                  created_at: dashboard.biometric.created_at || new Date().toISOString(),
                  updated_at: dashboard.biometric.updated_at || new Date().toISOString(),
                } : undefined} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 space-y-6">
        {/* Datos Personales */}
      <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
          Datos Personales
        </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Tipo de Documento</p>
              <p className="text-lg font-semibold text-gray-900">{client.dni_type}</p>
          </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Número de Documento</p>
              <p className="text-lg font-semibold text-gray-900 font-mono">{client.dni_number}</p>
          </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fecha de Nacimiento</p>
              <p className="text-lg font-semibold text-gray-900">
              {new Date(client.birth_date).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Edad</p>
              <p className="text-lg font-semibold text-gray-900">{age} años</p>
          </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Género</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">
              {client.gender === 'male' ? 'Masculino' : client.gender === 'female' ? 'Femenino' : 'Otro'}
            </p>
          </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Fecha de Registro</p>
              <p className="text-lg font-semibold text-gray-900">
              {new Date(client.created_at).toLocaleDateString('es-CO')}
            </p>
          </div>

          {client.updated_at && (
              <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">Última Actualización</p>
                <p className="text-base font-semibold text-blue-900">
                  {new Date(client.updated_at).toLocaleString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
              </p>
            </div>
          )}
        </div>
      </Card>

        {/* Información de Contacto */}
      <Card className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-600" />
          Información de Contacto
        </h3>

        <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Teléfono Principal</p>
                  <p className="text-xl font-bold text-gray-900">{client.phone}</p>
            </div>
                <div className="flex gap-2 ml-4">
              <Button
                onClick={onCall}
                variant="secondary"
                size="sm"
                    leftIcon={<Phone className="w-4 h-4" />}
              >
                Llamar
              </Button>
              <Button
                onClick={onWhatsApp}
                variant="secondary"
                size="sm"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
              >
                WhatsApp
              </Button>
            </div>
          </div>
            </div>

            {client.alternative_phone && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Teléfono Alternativo</p>
                <p className="text-lg font-semibold text-gray-900">{client.alternative_phone}</p>
            </div>
          )}

          {client.address && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Dirección</p>
                    <p className="text-base font-semibold text-gray-900">{client.address}</p>
                  </div>
                </div>
            </div>
          )}

          {client.meta_info?.email && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Email</p>
                    <p className="text-base font-semibold text-gray-900">{client.meta_info.email}</p>
                  </div>
                </div>
            </div>
          )}
        </div>
      </Card>
      </div>
    </div>
  );
});

ClientInfoTab.displayName = 'ClientInfoTab';
