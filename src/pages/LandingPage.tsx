import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { 
  Dumbbell, 
  Users, 
  Calendar, 
  BarChart3, 
  Package, 
  CreditCard,
  ArrowRight,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';

export const LandingPage = () => {
  const [imageError, setImageError] = useState(false);

  const features = [
    {
      icon: Users,
      title: 'Gestión de Miembros',
      description: 'Registra y administra información completa de miembros, gestiona suscripciones activas, historial de membresías y estados de cuenta. Control total sobre la base de datos de clientes.',
    },
    {
      icon: CreditCard,
      title: 'Suscripciones y Pagos',
      description: 'Gestiona planes de membresía, crea y renueva suscripciones automáticamente, registra pagos, genera facturas y mantiene un historial financiero completo y organizado.',
    },
    {
      icon: Calendar,
      title: 'Control de Asistencias',
      description: 'Sistema de check-in mediante reconocimiento facial que registra asistencias en tiempo real, controla el acceso a las instalaciones y genera reportes detallados de frecuencia.',
    },
    {
      icon: Package,
      title: 'Gestión de Inventario',
      description: 'Controla productos, gestiona stock, registra movimientos de entrada y salida, genera alertas de inventario bajo y mantiene un registro completo de todo el inventario.',
    },
    {
      icon: BarChart3,
      title: 'Reportes y Analytics',
      description: 'Dashboard interactivo con métricas en tiempo real, análisis de asistencia, reportes de ingresos, tendencias de membresías y visualizaciones exportables para toma de decisiones.',
    },
    {
      icon: LayoutDashboard,
      title: 'Dashboard Ejecutivo',
      description: 'Vista panorámica del negocio con estadísticas de miembros activos, ingresos mensuales, nuevos registros y métricas clave de rendimiento del gimnasio.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.svg" 
                alt="PowerGym AG" 
                className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-bold text-powergym-charcoal">PowerGym AG</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link 
                to="/privacy-policy" 
                className="text-neutral-600 hover:text-primary-500 transition-colors text-sm font-medium hidden sm:block"
              >
                Política de Privacidad
              </Link>
              <Link to="/login">
                <Button variant="primary" size="md">
                  Acceder al Sistema
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[550px]">
            <div className="space-y-10 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-powergym-charcoal leading-tight">
                Sistema de Gestión
                <span className="text-primary-500 block">PowerGym AG</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed max-w-2xl font-light">
                Plataforma integral diseñada para la administración profesional de miembros, 
                asistencias, suscripciones e inventario del gimnasio.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/login">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                    Acceder al Sistema
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-3xl blur-3xl transform rotate-6"></div>
                <div className="relative rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 bg-white">
                  {imageError ? (
                    <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 min-h-[550px] flex flex-col items-center justify-center">
                      <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl"></div>
                        <Dumbbell className="w-24 h-24 text-primary-400 relative z-10" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-2xl font-bold text-center text-white mb-4">
                        PowerGym AG
                      </h3>
                      <p className="text-neutral-400 text-center">
                        Sistema de gestión integral
                      </p>
                    </div>
                  ) : (
                    <img 
                      src="/gym-image.jpg" 
                      alt="PowerGym AG - Gimnasio moderno con equipamiento profesional" 
                      className="w-full h-[550px] object-cover"
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-powergym-charcoal mb-6">
              Funcionalidades Completas
            </h2>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Todas las herramientas necesarias para operar y administrar el gimnasio 
              de manera eficiente y profesional desde una plataforma centralizada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-gradient-to-br from-white to-neutral-50 rounded-3xl border border-neutral-200 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl flex items-center justify-center mb-6 group-hover:from-primary-200 group-hover:to-primary-100 transition-all shadow-sm group-hover:shadow-md">
                    <Icon className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-colors" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-powergym-charcoal mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-base">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-powergym-charcoal text-neutral-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <img 
                  src="/logo.svg" 
                  alt="PowerGym AG" 
                  className="h-12 w-12 object-contain"
                />
                <span className="text-2xl font-bold text-white">PowerGym AG</span>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                Sistema de gestión integral diseñado específicamente para la administración 
                operativa del gimnasio ubicado en Guayabal, Armero, Tolima, Colombia.
              </p>
            </div>

            {/* Enlaces Rápidos */}
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-white mb-6 text-base">Navegación</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link 
                    to="/" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    Acceder al Sistema
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy-policy" 
                    className="text-neutral-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    Política de Privacidad
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contacto */}
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-white mb-6 text-base">Contacto</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-400 mt-1 flex-shrink-0 text-lg">✉</span>
                  <div>
                    <p className="text-neutral-400 mb-1 text-xs uppercase tracking-wide">Email</p>
                    <a 
                      href="mailto:powergymag5@gmail.com" 
                      className="text-white hover:text-primary-400 transition-colors break-all"
                    >
                      powergymag5@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3 justify-center md:justify-start">
                  <span className="text-primary-400 mt-1 flex-shrink-0 text-lg">📍</span>
                  <div className="text-neutral-400">
                    <p className="mb-1 text-xs uppercase tracking-wide">Ubicación</p>
                    <address className="not-italic leading-relaxed">
                      Cra. 6 #9-1 9-109 a<br />
                      Guayabal, Armero<br />
                      Tolima, Colombia
                    </address>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
