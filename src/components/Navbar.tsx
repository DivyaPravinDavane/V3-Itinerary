import React, { useState } from 'react';
import { 
  ChevronDown, Heart, Briefcase, User, LogOut, FileText, 
  Menu, X, LogIn, ShieldCheck, Settings, Compass, Home, 
  HelpCircle, Info, Mail, ChevronRight 
} from 'lucide-react';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  currentPage?: 'home' | 'destinations' | 'agent-studio';
  onOpenAuth: (mode?: 'login' | 'signup', role?: 'customer' | 'admin' | 'agent') => void;
  onLogout: () => void;
  onOpenDashboard: (tab: 'trips' | 'saved' | 'orders' | 'profile') => void;
  onOpenAdminDashboard: () => void;
  onOpenAgentDashboard?: () => void;
  onOpenAgentModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  onNavigatePage?: (page: 'home' | 'destinations' | 'agent-studio') => void;
  isAgentPageOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentPage = 'home',
  onOpenAuth,
  onLogout,
  onOpenDashboard,
  onOpenAdminDashboard,
  onOpenAgentDashboard,
  onOpenAgentModal,
  onScrollToSection,
  onNavigatePage,
  isAgentPageOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);

  const isAdmin = user.isLoggedIn && user.role === 'admin';
  const isAgent = user.isLoggedIn && user.role === 'agent';
  const agencyName = user.agentDetails?.agencyName || user.agentDetails?.agency_name || user.fullName || 'Agency Partner';

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Left/Center Group: Logo sitting directly next to Home button */}
        <div className="header-nav-group">
          <div 
            className="brand-logo" 
            onClick={() => {
              if (onNavigatePage) onNavigatePage('home');
              else onScrollToSection('hero');
            }} 
            role="button" 
            tabIndex={0}
          >
            <img 
              src="/v3_logo.png" 
              alt="V3Itinerary.com - Verified • Value • Variety" 
              className="brand-logo-img" 
            />
          </div>

          <nav className="desktop-nav">
            <button 
              className={`nav-item ${currentPage === 'home' && !isAgentPageOpen ? 'active' : ''}`} 
              onClick={() => {
                if (onNavigatePage) onNavigatePage('home');
                else onScrollToSection('hero');
              }}
            >
              Home
            </button>

            <button 
              className={`nav-item ${currentPage === 'destinations' ? 'active' : ''}`} 
              onClick={() => {
                if (onNavigatePage) onNavigatePage('destinations');
                else onScrollToSection('destinations');
              }}
            >
              Destinations
            </button>

            {isAgent && (
              <button 
                className={`nav-item ${currentPage === 'agent-studio' ? 'active' : ''}`} 
                onClick={() => {
                  if (onNavigatePage) onNavigatePage('agent-studio');
                  else if (onOpenAgentDashboard) onOpenAgentDashboard();
                }}
              >
                Agent Studio
              </button>
            )}
            
            <div className="nav-dropdown-wrapper">
              <button 
                className="nav-item has-chevron" 
                onClick={() => setBrowseDropdownOpen(!browseDropdownOpen)}
                onMouseEnter={() => setBrowseDropdownOpen(true)}
              >
                Browse Itineraries
                <ChevronDown className={`chevron-icon ${browseDropdownOpen ? 'rotated' : ''}`} size={16} />
              </button>
              {browseDropdownOpen && (
                <div 
                  className="dropdown-menu shadow-lg"
                  onMouseLeave={() => setBrowseDropdownOpen(false)}
                >
                  <button className="dropdown-item" onClick={() => { 
                    if (onNavigatePage) onNavigatePage('destinations');
                    else onScrollToSection('destinations'); 
                    setBrowseDropdownOpen(false); 
                  }}>
                    🌟 All Destinations & Itineraries
                  </button>
                  <button className="dropdown-item" onClick={() => { 
                    if (onNavigatePage) onNavigatePage('destinations');
                    else onScrollToSection('destinations'); 
                    setBrowseDropdownOpen(false); 
                  }}>
                    🏖️ Beach & Overwater Getaways
                  </button>
                  <button className="dropdown-item" onClick={() => { 
                    if (onNavigatePage) onNavigatePage('destinations');
                    else onScrollToSection('destinations'); 
                    setBrowseDropdownOpen(false); 
                  }}>
                    🏔️ Mountain & Alps Itineraries
                  </button>
                  <button className="dropdown-item" onClick={() => { 
                    if (onNavigatePage) onNavigatePage('destinations');
                    else onScrollToSection('destinations'); 
                    setBrowseDropdownOpen(false); 
                  }}>
                    🕌 Cultural & Heritage Itineraries
                  </button>
                </div>
              )}
            </div>

            <button 
              className={`nav-item ${isAgentPageOpen ? 'active' : ''}`} 
              onClick={onOpenAgentModal}
            >
              For Travel Agents
            </button>
            <button className="nav-item" onClick={() => {
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('how-it-works'), 60);
              } else {
                onScrollToSection('how-it-works');
              }
            }}>
              How It Works
            </button>
            <button className="nav-item" onClick={() => {
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('trust-pillars'), 60);
              } else {
                onScrollToSection('trust-pillars');
              }
            }}>
              About Us
            </button>
            <button className="nav-item" onClick={() => {
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('footer'), 60);
              } else {
                onScrollToSection('footer');
              }
            }}>
              Contact Us
            </button>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="header-actions">
          {/* Saved Wishlist Pill (Always visible) */}
          {!isAdmin && (
            <button 
              className="action-icon-pill" 
              onClick={() => onOpenDashboard('saved')}
              title={user.savedItineraryIds?.length > 0 ? `Saved Wishlist (${user.savedItineraryIds.length} items)` : "Saved Wishlist"}
              aria-label="View Saved Wishlist"
            >
              <Heart size={18} className={user.savedItineraryIds?.length > 0 ? 'heart-active' : ''} />
              {user.savedItineraryIds?.length > 0 && (
                <span className="badge-count">{user.savedItineraryIds.length}</span>
              )}
            </button>
          )}

          {user.isLoggedIn ? (
            <div className="user-action-group">
              {isAdmin ? (
                /* ADMIN LOGGED IN BUTTONS */
                <>
                  <button 
                    className="action-admin-pill"
                    onClick={onOpenAdminDashboard}
                    title="Open V3 Admin Management Console"
                  >
                    <ShieldCheck size={17} />
                    <span className="font-semibold">Admin Console</span>
                  </button>

                  <div className="user-profile-menu">
                    <button 
                      className="avatar-btn admin-avatar-btn" 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      title="V3 Platform Administrator"
                    >
                      <div className="avatar-circle admin-circle">
                        🛡️
                      </div>
                      <span className="user-name-short">Admin</span>
                      <ChevronDown size={14} />
                    </button>

                    {userDropdownOpen && (
                      <div className="dropdown-menu profile-drop shadow-xl" onMouseLeave={() => setUserDropdownOpen(false)}>
                        <div className="profile-header-summary admin-summary">
                          <p className="profile-name">V3 Platform Admin</p>
                          <p className="profile-email">{user.email}</p>
                          <span className="role-tag-admin">Super Admin Console</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={() => { onOpenAdminDashboard(); setUserDropdownOpen(false); }}>
                          <ShieldCheck size={16} /> Admin Operations Hub
                        </button>
                        <button className="dropdown-item" onClick={() => { onOpenAdminDashboard(); setUserDropdownOpen(false); }}>
                          <FileText size={16} /> Manage Itineraries
                        </button>
                        <button className="dropdown-item" onClick={() => { onOpenAdminDashboard(); setUserDropdownOpen(false); }}>
                          <Settings size={16} /> Platform GST & Rules
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item danger" onClick={() => { onLogout(); setUserDropdownOpen(false); }}>
                          <LogOut size={16} /> Sign Out Admin
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : isAgent ? (
                /* TRAVEL AGENT LOGGED IN BUTTONS */
                <>
                  <button 
                    className={`action-agent-pill ${currentPage === 'agent-studio' ? 'active' : ''}`}
                    onClick={() => {
                      if (onNavigatePage) onNavigatePage('agent-studio');
                      else if (onOpenAgentDashboard) onOpenAgentDashboard();
                    }}
                    title="Open Travel Agent Studio (Create & Manage Itineraries)"
                  >
                    <Briefcase size={17} />
                    <span className="font-semibold">Agent Studio</span>
                  </button>

                  <div className="user-profile-menu">
                    <button 
                      className="avatar-btn agent-avatar-btn" 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      title={`Agent: ${agencyName}`}
                    >
                      <div className="avatar-circle agent-circle">
                        💼
                      </div>
                      <span className="user-name-short">{agencyName.split(' ')[0]}</span>
                      <ChevronDown size={14} />
                    </button>

                    {userDropdownOpen && (
                      <div className="dropdown-menu profile-drop shadow-xl" onMouseLeave={() => setUserDropdownOpen(false)}>
                        <div className="profile-header-summary agent-summary">
                          <p className="profile-name">{agencyName}</p>
                          <p className="profile-email">{user.email}</p>
                          <span className="role-tag-agent">Verified Travel Agent</span>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={() => { if (onNavigatePage) onNavigatePage('agent-studio'); else if (onOpenAgentDashboard) onOpenAgentDashboard(); setUserDropdownOpen(false); }}>
                          <FileText size={16} /> Manage Itineraries
                        </button>
                        <button className="dropdown-item" onClick={() => { if (onNavigatePage) onNavigatePage('agent-studio'); else if (onOpenAgentDashboard) onOpenAgentDashboard(); setUserDropdownOpen(false); }}>
                          <Briefcase size={16} /> Traveler Orders & Leads
                        </button>
                        <button className="dropdown-item" onClick={() => { if (onNavigatePage) onNavigatePage('agent-studio'); else if (onOpenAgentDashboard) onOpenAgentDashboard(); setUserDropdownOpen(false); }}>
                          <ShieldCheck size={16} /> Agency KYC & Profile
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item danger" onClick={() => { onLogout(); setUserDropdownOpen(false); }}>
                          <LogOut size={16} /> Sign Out Agent
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* CUSTOMER LOGGED IN BUTTONS */
                <>
                  <button 
                    className="action-trip-pill" 
                    onClick={() => onOpenDashboard('trips')}
                    title="My Purchased Itineraries"
                  >
                    <Briefcase size={17} />
                    <span className="trip-pill-text">My Trips ({user.purchasedOrders?.length || 0})</span>
                  </button>

                  <div className="user-profile-menu">
                    <button 
                      className="avatar-btn" 
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      title={user.fullName}
                    >
                      <div className="avatar-circle">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name-short">{user.fullName.split(' ')[0]}</span>
                      <ChevronDown size={14} />
                    </button>

                    {userDropdownOpen && (
                      <div className="dropdown-menu profile-drop shadow-xl" onMouseLeave={() => setUserDropdownOpen(false)}>
                        <div className="profile-header-summary">
                          <p className="profile-name">{user.fullName}</p>
                          <p className="profile-email">{user.email}</p>
                        </div>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item" onClick={() => { onOpenDashboard('trips'); setUserDropdownOpen(false); }}>
                          <FileText size={16} /> My Trips & PDFs
                        </button>
                        <button className="dropdown-item" onClick={() => { onOpenDashboard('saved'); setUserDropdownOpen(false); }}>
                          <Heart size={16} /> Saved Itineraries
                        </button>
                        <button className="dropdown-item" onClick={() => { onOpenDashboard('orders'); setUserDropdownOpen(false); }}>
                          <Briefcase size={16} /> Orders & Invoices
                        </button>
                        <button className="dropdown-item" onClick={() => { onOpenDashboard('profile'); setUserDropdownOpen(false); }}>
                          <User size={16} /> Profile Preferences
                        </button>
                        <div className="dropdown-divider"></div>
                        <button className="dropdown-item danger" onClick={() => { onLogout(); setUserDropdownOpen(false); }}>
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* NOT LOGGED IN: SINGLE CLEAN LOGIN BUTTON & SIGN UP */
            <div className="auth-buttons">
              <button 
                className="btn-login-ghost" 
                onClick={() => onOpenAuth('login')}
                id="header-login-btn"
                title="Sign In (Customer & Admin Portals)"
              >
                <LogIn size={15} />
                <span>Login</span>
              </button>

              <button 
                className="btn-signup-solid header-signup-btn" 
                onClick={() => onOpenAuth('signup')}
                id="header-signup-btn"
                title="Create an account"
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button 
            className="mobile-hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer shadow-2xl">
          <div className="mobile-drawer-header">
            <span className="mobile-drawer-title">Navigation Menu</span>
            <button 
              type="button" 
              className="mobile-drawer-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mobile-nav-links-list">
            <button 
              className={`mobile-nav-link ${currentPage === 'home' && !isAgentPageOpen ? 'active' : ''}`} 
              onClick={() => { 
                if (onNavigatePage) onNavigatePage('home');
                else onScrollToSection('hero'); 
                setMobileMenuOpen(false); 
              }}
            >
              <div className="mobile-link-left">
                <Home size={17} className="mobile-link-icon" />
                <span>Home</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            <button 
              className={`mobile-nav-link ${currentPage === 'destinations' ? 'active' : ''}`} 
              onClick={() => { 
                if (onNavigatePage) onNavigatePage('destinations');
                else onScrollToSection('destinations'); 
                setMobileMenuOpen(false); 
              }}
            >
              <div className="mobile-link-left">
                <Compass size={17} className="mobile-link-icon" />
                <span>Explore Destinations</span>
              </div>
              <span className="mobile-link-badge">New</span>
            </button>

            <button 
              className="mobile-nav-link" 
              onClick={() => { 
                if (onNavigatePage) onNavigatePage('destinations');
                else onScrollToSection('destinations'); 
                setMobileMenuOpen(false); 
              }}
            >
              <div className="mobile-link-left">
                <FileText size={17} className="mobile-link-icon" />
                <span>Browse Itineraries</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            {isAgent && (
              <button 
                className={`mobile-nav-link ${currentPage === 'agent-studio' ? 'active' : ''}`} 
                onClick={() => { 
                  if (onNavigatePage) onNavigatePage('agent-studio');
                  else if (onOpenAgentDashboard) onOpenAgentDashboard();
                  setMobileMenuOpen(false); 
                }}
              >
                <div className="mobile-link-left">
                  <Briefcase size={17} className="mobile-link-icon text-emerald-600" />
                  <span>Agent Studio</span>
                </div>
                <ChevronRight size={15} className="text-slate-400" />
              </button>
            )}

            <button 
              className={`mobile-nav-link ${isAgentPageOpen ? 'active' : ''}`} 
              onClick={() => { onOpenAgentModal(); setMobileMenuOpen(false); }}
            >
              <div className="mobile-link-left">
                <Briefcase size={17} className="mobile-link-icon text-amber-500" />
                <span>For Travel Agents</span>
              </div>
              <span className="mobile-link-tag">Partner</span>
            </button>

            <button className="mobile-nav-link" onClick={() => { 
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('how-it-works'), 60);
              } else {
                onScrollToSection('how-it-works');
              }
              setMobileMenuOpen(false); 
            }}>
              <div className="mobile-link-left">
                <HelpCircle size={17} className="mobile-link-icon" />
                <span>How It Works</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            <button className="mobile-nav-link" onClick={() => { 
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('trust-pillars'), 60);
              } else {
                onScrollToSection('trust-pillars');
              }
              setMobileMenuOpen(false); 
            }}>
              <div className="mobile-link-left">
                <Info size={17} className="mobile-link-icon" />
                <span>About Us</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>

            <button className="mobile-nav-link" onClick={() => { onOpenDashboard('saved'); setMobileMenuOpen(false); }}>
              <div className="mobile-link-left">
                <Heart size={17} className="mobile-link-icon text-rose-500" />
                <span>Saved Wishlist</span>
              </div>
              <span className="mobile-link-count">{user.savedItineraryIds?.length || 0}</span>
            </button>

            <button className="mobile-nav-link" onClick={() => { 
              if (onNavigatePage && currentPage !== 'home') {
                onNavigatePage('home');
                setTimeout(() => onScrollToSection('footer'), 60);
              } else {
                onScrollToSection('footer');
              }
              setMobileMenuOpen(false); 
            }}>
              <div className="mobile-link-left">
                <Mail size={17} className="mobile-link-icon" />
                <span>Contact Us</span>
              </div>
              <ChevronRight size={15} className="text-slate-400" />
            </button>
          </div>
          
          <div className="mobile-nav-auth">
            {!user.isLoggedIn ? (
              <div className="mobile-auth-row">
                <button 
                  className="btn-login-ghost full-w" 
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                >
                  <LogIn size={16} /> Login
                </button>
                <button 
                  className="btn-signup-solid full-w" 
                  onClick={() => { onOpenAuth('signup'); setMobileMenuOpen(false); }}
                >
                  Sign Up
                </button>
              </div>
            ) : isAdmin ? (
              <div className="mobile-auth-column">
                <button className="btn-admin-solid full-w mb-2" onClick={() => { onOpenAdminDashboard(); setMobileMenuOpen(false); }}>
                  <ShieldCheck size={16} /> Admin Console
                </button>
                <button className="btn-login-ghost full-w" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                  Logout Admin
                </button>
              </div>
            ) : isAgent ? (
              <div className="mobile-auth-column">
                <button className="btn-agent-solid full-w mb-2" onClick={() => { if (onNavigatePage) onNavigatePage('agent-studio'); else if (onOpenAgentDashboard) onOpenAgentDashboard(); setMobileMenuOpen(false); }}>
                  <Briefcase size={16} /> Agent Studio
                </button>
                <button className="btn-login-ghost full-w" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                  Logout Agent
                </button>
              </div>
            ) : (
              <div className="mobile-auth-row">
                <button className="btn-signup-solid full-w" onClick={() => { onOpenDashboard('trips'); setMobileMenuOpen(false); }}>
                  My Trips ({user.purchasedOrders?.length || 0})
                </button>
                <button className="btn-login-ghost full-w" onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
