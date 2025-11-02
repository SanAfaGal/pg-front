import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Dumbbell, Users, Calendar, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  const [imageError, setImageError] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Gestión de Clientes',
      description: 'Administra eficientemente toda la información de tus clientes y sus membresías.',
    },
    {
      icon: Calendar,
      title: 'Control de Asistencias',
      description: 'Sistema de check-in con reconocimiento facial para un control preciso de asistencias.',
    },
    {
      icon: BarChart3,
      title: 'Reportes y Analytics',
      description: 'Visualiza métricas en tiempo real y toma decisiones basadas en datos.',
    },
    {
      icon: CheckCircle2,
      title: 'Gestión de Inventario',
      description: 'Control completo de productos, stock y movimientos de inventario.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.svg" 
                alt="PowerGym AG" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-xl font-bold text-powergym-charcoal">PowerGym AG</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/privacy-policy" 
                className="text-neutral-600 hover:text-primary-500 transition-colors text-sm font-medium"
              >
                Política de Privacidad
              </Link>
              <Link to="/login">
                <Button variant="primary" size="md">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100 w-fit">
                <span className="text-primary-600 font-semibold text-sm">Sistema de Gestión Integral</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-powergym-charcoal leading-tight">
                PowerGym AG
                <span className="text-primary-500 block">Sistema de Gestión</span>
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
                Plataforma de gestión integral para la administración de membresías, asistencias 
                e inventario de nuestro gimnasio en Guayabal, Armero, Tolima.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    Acceder al Sistema
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200">
                <div>
                  <div className="text-3xl font-bold text-primary-500">Seguro</div>
                  <div className="text-sm text-neutral-600 mt-1">Datos protegidos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500">WhatsApp</div>
                  <div className="text-sm text-neutral-600 mt-1">Notificaciones</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-500">14+</div>
                  <div className="text-sm text-neutral-600 mt-1">Años en adelante</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 bg-white">
                  {imageError ? (
                    // Fallback si la imagen no existe
                    <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 min-h-[500px] flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
                        <Dumbbell className="w-24 h-24 text-primary-400 relative z-10" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-bold text-center text-white mb-4">
                        PowerGym AG
                      </h3>
                      <p className="text-neutral-400 text-center">
                        Sistema de gestión integral para nuestro gimnasio
                      </p>
                    </div>
                  ) : (
                    <img 
                      src="/gym-image.jpg" 
                      alt="PowerGym AG - Gimnasio moderno con equipamiento profesional, iluminación de neón y ambiente energético" 
                      className="w-full h-[500px] object-cover"
                      onError={() => setImageError(true)}
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-powergym-charcoal mb-4">
              Funcionalidades del Sistema
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Herramientas diseñadas para la gestión eficiente de nuestro gimnasio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-neutral-50 rounded-3xl border border-neutral-200 hover:border-primary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-7 h-7 text-primary-600" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-powergym-charcoal mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sistema de Gestión PowerGym AG
          </h2>
          <p className="text-xl text-primary-50 mb-8 max-w-2xl mx-auto">
            Accede al sistema de gestión para administrar membresías, asistencias y servicios
          </p>
          <Link to="/login">
            <Button variant="secondary" size="lg" className="shadow-xl">
              Acceder al Sistema
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-powergym-charcoal text-neutral-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="/logo.svg" 
                  alt="PowerGym AG" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-lg font-bold text-white">PowerGym AG</span>
              </div>
              <p className="text-sm text-neutral-400">
                Sistema de gestión integral para gimnasios modernos.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Enlaces</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-primary-400 transition-colors">
                    Iniciar Sesión
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>powergymag5@gmail.com</li>
                <li>Cra. 6 #9-1 9-109 a</li>
                <li>Guayabal, Armero, Tolima</li>
                <li>Colombia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
            <p>&copy; {new Date().getFullYear()} PowerGym AG. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

