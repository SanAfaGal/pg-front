import { User, Phone, MessageCircle, MapPin, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { type Client } from '../../features/clients';
import { clientHelpers } from '../../features/clients';

interface ClientInfoTabProps {
  client: Client;
  onCall: () => void;
  onWhatsApp: () => void;
}

export function ClientInfoTab({ client, onCall, onWhatsApp }: ClientInfoTabProps) {
  const age = clientHelpers.calculateAge(client.birth_date);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-xl font-bold text-powergym-charcoal mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-powergym-red" />
          Datos Personales
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Tipo de Documento</p>
            <p className="font-semibold text-powergym-charcoal">{client.dni_type}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Número de Documento</p>
            <p className="font-semibold text-powergym-charcoal">{client.dni_number}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
            <p className="font-semibold text-powergym-charcoal">
              {new Date(client.birth_date).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Edad</p>
            <p className="font-semibold text-powergym-charcoal">{age} años</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Género</p>
            <p className="font-semibold text-powergym-charcoal capitalize">
              {client.gender === 'male' ? 'Masculino' : client.gender === 'female' ? 'Femenino' : 'Otro'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Fecha de Registro</p>
            <p className="font-semibold text-powergym-charcoal">
              {new Date(client.created_at).toLocaleDateString('es-CO')}
            </p>
          </div>

          {client.updated_at && (
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Última Actualización</p>
              <p className="font-semibold text-powergym-charcoal">
                {new Date(client.updated_at).toLocaleString('es-CO')}
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-powergym-charcoal mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-powergym-red" />
          Información de Contacto
        </h3>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500">Teléfono Principal</p>
              <p className="font-semibold text-powergym-charcoal text-lg">{client.phone}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onCall}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Llamar
              </Button>
              <Button
                onClick={onWhatsApp}
                variant="secondary"
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </Button>
            </div>
          </div>

          {client.alternative_phone && (
            <div>
              <p className="text-sm text-gray-500">Teléfono Alternativo</p>
              <p className="font-semibold text-powergym-charcoal">{client.alternative_phone}</p>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Dirección</p>
                <p className="font-semibold text-powergym-charcoal">{client.address}</p>
              </div>
            </div>
          )}

          {client.meta_info?.email && (
            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-semibold text-powergym-charcoal">{client.meta_info.email}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
