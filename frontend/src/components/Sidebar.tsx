import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Wrench,
  Code2,
  BookOpenCheck,
  Briefcase,
  FileCheck2,
  Settings,
  Users,
  Building2,
  BarChart3,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Skills Management', path: '/skills', icon: Wrench },
    { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
    { name: 'Interview Prep', path: '/interview-prep', icon: BookOpenCheck },
    { name: 'Placement Drives', path: '/opportunities', icon: Briefcase },
    { name: 'My Applications', path: '/applications', icon: FileCheck2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Manage Opportunities', path: '/admin/opportunities', icon: Building2 },
    { name: 'Manage Applications', path: '/admin/applications', icon: FileCheck2 },
    { name: 'Skills Catalog', path: '/admin/skills', icon: Wrench },
    { name: 'Placement Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Placement Drives', path: '/opportunities', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const lecturerLinks = [
    { name: 'Faculty Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Placement Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Skills Catalog', path: '/admin/skills', icon: Wrench },
    { name: 'Placement Drives', path: '/opportunities', icon: Briefcase },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const industryLinks = [
    { name: 'Placement Drives', path: '/opportunities', icon: Briefcase },
    { name: 'Manage Opportunities', path: '/admin/opportunities', icon: Building2 },
    { name: 'Candidate Applications', path: '/admin/applications', icon: FileCheck2 },
    { name: 'Student Talent Pool', path: '/admin/students', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const alumniLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
    { name: 'Interview Prep', path: '/interview-prep', icon: BookOpenCheck },
    { name: 'Placement Drives', path: '/opportunities', icon: Briefcase },
    { name: 'Student Directory', path: '/admin/students', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'lecturer':
        return lecturerLinks;
      case 'industry':
        return industryLinks;
      case 'alumni':
        return alumniLinks;
      default:
        return studentLinks;
    }
  };

  const links = getLinks();

  const getPortalTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Admin Portal';
      case 'lecturer':
        return 'Faculty Portal';
      case 'industry':
        return 'Recruiter Portal';
      case 'alumni':
        return 'Alumni Portal';
      default:
        return 'Student Portal';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      {/* Brand Logo */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white">CareerGraph</span>
            <span className="block text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              {getPortalTitle()}
            </span>
          </div>
        </NavLink>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/admin' || link.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-sm shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-slate-800 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 shrink-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />
          <div className="relative z-10 flex flex-col h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};
