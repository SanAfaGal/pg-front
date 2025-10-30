import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import {
  User,
  FileText,
  Calendar,
  Users,
  Phone,
  MapPin,
  Save,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { type ClientFormData } from '../../features/clients';
import { clientHelpers, clientsApi } from '../../features/clients';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCreateClient, useUpdateClient } from '../../features/clients';
import { useToast } from '../../shared';

const countryCodes = [
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' }
];

const documentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PP', label: 'Pasaporte' }
];

const genderOptions = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' }
];


interface ClientFormProps {
  initialData?: ClientFormData;
  clientId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientFormOptimized = ({ initialData, clientId, onSuccess, onCancel }: ClientFormProps) => {
  const [documentError, setDocumentError] = useState('');
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [phoneCode, setPhoneCode] = useState('+57');
  const [phoneCodeSecondary, setPhoneCodeSecondary] = useState('+57');

  const { showToast } = useToast();
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialData || {},
    mode: 'onBlur', // Validate on blur for better UX
  });

  const birthDate = watch('birth_date');
  const documentNumber = watch('document_number');

  useEffect(() => {
    if (birthDate) {
      const age = clientHelpers.calculateAge(birthDate);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [birthDate]);

  useEffect(() => {
    const checkDocument = async () => {
      if (documentNumber && documentNumber.length >= 5) {
        try {
          const exists = await clientsApi.checkDocumentExists(
            String(documentNumber),
            clientId
          );
          if (exists) {
            setDocumentError('Este número de documento ya está registrado');
          } else {
            setDocumentError('');
          }
        } catch (error) {
          console.error('Error checking document:', error);
        }
      }
    };

    const timeoutId = setTimeout(checkDocument, 500);
    return () => clearTimeout(timeoutId);
  }, [documentNumber, clientId]);

  const onSubmit = async (data: any) => {
    if (documentError) {
      return;
    }

    // Map form data to API format
    const formatPhone = (phone: string, countryCode: string) => {
      if (!phone) return '';
      // Remove spaces and concatenate with country code
      const cleaned = phone.replace(/\s+/g, '');
      return `${countryCode}${cleaned}`;
    };

    const apiData: ClientFormData = {
      dni_type: data.document_type,
      dni_number: data.document_number,
      first_name: data.first_name,
      middle_name: data.second_name || undefined,
      last_name: data.first_surname,
      second_last_name: data.second_surname || undefined,
      phone: formatPhone(data.phone_primary, phoneCode),
      alternative_phone: data.phone_secondary ? formatPhone(data.phone_secondary, phoneCodeSecondary) : undefined,
      birth_date: data.birth_date,
      gender: data.gender,
      address: data.address || undefined,
      is_active: true
    };

    console.log('Sending data to API:', apiData);

    try {
      if (clientId) {
        await updateClientMutation.mutateAsync({ id: clientId, data: apiData } as any);
        showToast({
          type: 'success',
          title: 'Éxito',
          message: 'Cliente actualizado exitosamente'
        });
      } else {
        await createClientMutation.mutateAsync(apiData as any);
        showToast({
          type: 'success',
          title: 'Éxito',
          message: 'Cliente registrado exitosamente'
        });
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al guardar cliente. Por favor, verifica que todos los datos sean correctos.';
      showToast({
        type: 'error',
        title: 'Error',
        message: errorMessage
      });
    }
  };

  const isSubmitting = createClientMutation.isPending || updateClientMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-powergym-blue-medium/20">
          <div className="p-2.5 bg-powergym-blue-medium bg-opacity-10 rounded-xl">
            <User className="w-5 h-5 text-powergym-blue-medium" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de documento *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                {...register('document_type', {
                  required: 'El tipo de documento es obligatorio',
                })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-powergym-blue-medium focus:border-transparent outline-none transition-all hover:border-gray-400 ${
                  errors.document_type ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar</option>
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.document_type && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {String(errors.document_type.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de documento *
            </label>
            <Input
              {...register('document_number', {
                required: 'El número de documento es obligatorio',
                minLength: {
                  value: 5,
                  message: 'El documento debe tener al menos 5 caracteres'
                },
                maxLength: {
                  value: 20,
                  message: 'El documento no puede exceder 20 caracteres'
                },
                pattern: {
                  value: /^\d+$/,
                  message: 'Solo se permiten dígitos'
                }
              })}
              placeholder="Ej: 1234567890"
              error={(errors.document_number?.message as string) || documentError}
            />
            {documentNumber && !errors.document_number && !documentError && documentNumber.length >= 5 && (
              <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                <span>✓</span> Documento válido
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primer nombre *
            </label>
            <Input
              {...register('first_name', {
                required: 'El primer nombre es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder 50 caracteres'
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'Solo se permiten letras y espacios'
                }
              })}
              placeholder="Ej: Juan"
              error={errors.first_name?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segundo nombre
            </label>
            <Input 
              {...register('second_name', {
                minLength: {
                  value: 2,
                  message: 'El nombre debe tener al menos 2 caracteres'
                },
                maxLength: {
                  value: 50,
                  message: 'El nombre no puede exceder 50 caracteres'
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'Solo se permiten letras y espacios'
                }
              })}
              placeholder="Ej: Carlos" 
              error={errors.second_name?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primer apellido *
            </label>
            <Input
              {...register('first_surname', {
                required: 'El primer apellido es obligatorio',
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres'
                },
                maxLength: {
                  value: 50,
                  message: 'El apellido no puede exceder 50 caracteres'
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'Solo se permiten letras y espacios'
                }
              })}
              placeholder="Ej: Pérez"
              error={errors.first_surname?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Segundo apellido
            </label>
            <Input 
              {...register('second_surname', {
                minLength: {
                  value: 2,
                  message: 'El apellido debe tener al menos 2 caracteres'
                },
                maxLength: {
                  value: 50,
                  message: 'El apellido no puede exceder 50 caracteres'
                },
                pattern: {
                  value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                  message: 'Solo se permiten letras y espacios'
                }
              })}
              placeholder="Ej: García" 
              error={errors.second_surname?.message as string}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de nacimiento *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="date"
                {...register('birth_date', {
                  required: 'La fecha de nacimiento es obligatoria',
                  validate: {
                    notFuture: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return selectedDate <= today || 'La fecha no puede ser futura';
                    },
                    minimumAge: (value) => {
                      const age = clientHelpers.calculateAge(value);
                      return age >= 10 || 'La edad mínima es 10 años';
                    },
                    maximumAge: (value) => {
                      const age = clientHelpers.calculateAge(value);
                      return age <= 120 || 'Por favor verifica la fecha de nacimiento';
                    }
                  }
                })}
                className="pl-10"
                max={new Date().toISOString().split('T')[0]}
                error={errors.birth_date?.message as string}
              />
            </div>
            {calculatedAge !== null && !errors.birth_date && (
              <p className="mt-1 text-sm text-powergym-blue-medium font-medium flex items-center gap-1">
                <span>👤</span> Edad: {calculatedAge} años
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Género *
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                {...register('gender', {
                  required: 'El género es obligatorio',
                })}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-powergym-blue-medium focus:border-transparent outline-none transition-all hover:border-gray-400 ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar</option>
                {genderOptions.map((gender) => (
                  <option key={gender.value} value={gender.value}>
                    {gender.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {String(errors.gender.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b-2 border-powergym-blue-medium/20">
          <div className="p-2.5 bg-powergym-blue-medium bg-opacity-10 rounded-xl">
            <Phone className="w-5 h-5 text-powergym-blue-medium" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono principal *
            </label>
            <div className="flex gap-2">
              <select
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                className="w-32 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powergym-blue-medium focus:border-transparent outline-none"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <Input
                type="tel"
                {...register('phone_primary', {
                  required: 'El teléfono principal es obligatorio',
                  validate: {
                    validFormat: (value) => {
                      const phoneNumber = value.replace(/\s/g, '');
                      return /^\d{7,15}$/.test(phoneNumber) || 'El teléfono debe tener entre 7 y 15 dígitos';
                    }
                  }
                })}
                placeholder="300 1234567"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d\s]/g, '');
                  setValue('phone_primary', value, { shouldValidate: true });
                }}
                error={errors.phone_primary?.message as string}
              />
            </div>
            {!errors.phone_primary && watch('phone_primary') && watch('phone_primary').replace(/\s/g, '').length >= 7 && (
              <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                <span>✓</span> Teléfono válido
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono alternativo
            </label>
            <div className="flex gap-2">
              <select
                value={phoneCodeSecondary}
                onChange={(e) => setPhoneCodeSecondary(e.target.value)}
                className="w-32 px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powergym-blue-medium focus:border-transparent outline-none"
              >
                {countryCodes.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <Input
                type="tel"
                {...register('phone_secondary', {
                  validate: {
                    validFormat: (value) => {
                      if (!value) return true; // Optional field
                      const phoneNumber = value.replace(/\s/g, '');
                      return /^\d{7,15}$/.test(phoneNumber) || 'El teléfono debe tener entre 7 y 15 dígitos';
                    }
                  }
                })}
                placeholder="300 1234567"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d\s]/g, '');
                  setValue('phone_secondary', value, { shouldValidate: true });
                }}
                error={errors.phone_secondary?.message as string}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección completa
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                {...register('address', {
                  minLength: {
                    value: 10,
                    message: 'La dirección debe tener al menos 10 caracteres'
                  },
                  maxLength: {
                    value: 200,
                    message: 'La dirección no puede exceder 200 caracteres'
                  }
                })}
                placeholder="Ej: Calle 123 #45-67, Bogotá"
                rows={3}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-powergym-blue-medium focus:border-transparent outline-none transition-all resize-none hover:border-gray-400 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {String(errors.address.message)}
              </p>
            )}
          </div>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-800 mb-2">
                Por favor corrige los siguientes errores:
              </h4>
              <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                {Object.entries(errors).map(([field, error]: [string, any]) => (
                  <li key={field}>
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          <X className="w-5 h-5 mr-2" />
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-powergym-red hover:bg-[#c50202] shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || !!documentError || Object.keys(errors).length > 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {clientId ? 'Actualizar Cliente' : 'Guardar Cliente'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
