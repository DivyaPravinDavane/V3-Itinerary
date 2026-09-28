import React, { useState } from 'react';
import { ChevronDown, Heart, Briefcase, User, LogOut, FileText, Menu, X, LogIn, ShieldCheck, Settings } from 'lucide-react';
import type { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile;
  currentPage?: 'home' | 'destinations';
  onOpenAuth: (mode?: 'login' | 'signup', role?: 'customer' | 'admin') => void;
  onLogout: () => void;
  onOpenDashboard: (tab: 'trips' | 'saved' | 'orders' | 'profile') => void;
  onOpenAdminDashboard: () => void;
  onOpenAgentModal: () => void;
  onScrollToSection: (sectionId: string) => void;
  onNavigatePage?: (page: 'home' | 'destinations') => void;
  isAgentPageOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentPage = 'home',
  onOpenAuth,
  onLogout,
  onOpenDashboard,
  onOpenAdminDashboard,
  onOpenAgentModal,
  onScrollToSection,
  onNavigatePage,
  isAgentPageOpen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);

  const isAdmin = user.isLoggedIn && user.role === 'admin';

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
                    🌟 All Destinations & Blueprints
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
                    🕌 Cultural & Heritage Blueprints
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
              ) : (
                /* CUSTOMER LOGGED IN BUTTONS */
                <>
                  <button 
                    className="action-trip-pill" 
                    onClick={() => onOpenDashboard('trips')}
                    title="My Purchased Blueprints"
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
                className="btn-signup-solid" 
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
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button 
            className={`mobile-nav-link ${currentPage === 'home' ? 'font-bold text-blue-600' : ''}`} 
            onClick={() => { 
              if (onNavigatePage) onNavigatePage('home');
              else onScrollToSection('hero'); 
              setMobileMenuOpen(false); 
            }}
          >
            Home
          </button>
          <button 
            className={`mobile-nav-link ${currentPage === 'destinations' ? 'font-bold text-blue-600' : ''}`} 
            onClick={() => { 
              if (onNavigatePage) onNavigatePage('destinations');
              else onScrollToSection('destinations'); 
              setMobileMenuOpen(false); 
            }}
          >
            Destinations
          </button>
          <button 
            className="mobile-nav-link" 
            onClick={() => { 
              if (onNavigatePage) onNavigatePage('destinations');
              else onScrollToSection('destinations'); 
              setMobileMenuOpen(false); 
            }}
          >
            Browse Itineraries
          </button>
          <button className="mobile-nav-link" onClick={() => { onOpenAgentModal(); setMobileMenuOpen(false); }}>
            For Travel Agents
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
            How It Works
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
            About Us
          </button>
          <button className="mobile-nav-link" onClick={() => { onOpenDashboard('saved'); setMobileMenuOpen(false); }}>
            Saved Wishlist ({user.savedItineraryIds?.length || 0})
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
            Contact Us
          </button>
          
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
