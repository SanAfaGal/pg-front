import { LayoutDashboard, Users, X, LogOut, Camera, Package, CreditCard, FileText } from 'lucide-react';
import { useIsAdmin } from '../../features/subscriptions/hooks/useSubscriptionPermissions';

interface User {
  id: string;
  username: string;
  full_name?: string;
  email?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: string;
  onItemClick: (item: string) => void;
  onLogout: () => void;
  user?: User;
}

const baseMenuItems = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'subscriptions', label: 'Suscripciones', icon: CreditCard },
  { id: 'attendances', label: 'Asistencias', icon: Camera },
  { id: 'inventory', label: 'Inventario', icon: Package },
];

const adminMenuItems = [
  { id: 'plans', label: 'Planes', icon: FileText },
];

export const Sidebar = ({ isOpen, onClose, activeItem, onItemClick, onLogout, user }: SidebarProps) => {
  const isAdmin = useIsAdmin();
  
  const menuItems = isAdmin 
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform shadow-soft ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="PowerGym AG" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-powergym-charcoal">PowerGym AG</h2>
              <p className="text-xs text-gray-500">
                {user?.full_name || user?.username || 'Usuario'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onItemClick(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-powergym-red to-powergym-blue-medium text-white shadow-card'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white space-y-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" strokeWidth={2} />
            <span className="font-medium text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
