import { Bot, BriefcaseBusiness, Home, LayoutDashboard, LogIn, LogOut, PlusCircle, ReceiptText, Wallet } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const allLinks = [
  { to: "/", label: "Home", icon: Home, roles: ["guest", "investor", "business_owner", "admin"] },
  { to: "/dashboard", label: "Panel", icon: LayoutDashboard, roles: ["investor", "business_owner", "admin"] },
  { to: "/businesses", label: "Businesses", icon: BriefcaseBusiness, roles: ["investor", "admin"] },
  { to: "/wallet", label: "Wallet", icon: Wallet, roles: ["investor"] },
  { to: "/admin", label: "Admin", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/add-business", label: "Add", icon: PlusCircle, roles: ["business_owner", "admin"] },
  { to: "/upload-purchase", label: "Purchase", icon: ReceiptText, roles: ["business_owner", "admin"] },
  { to: "/chatbot", label: "Chatbot", icon: Bot, roles: ["investor", "business_owner", "admin"] }
];

function LinkList({ links, className, itemClassName, activeClassName }) {
  return (
    <nav className={className}>
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `${itemClassName} ${isActive ? activeClassName : ""}`}>
          <Icon size={17} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Shell({ children }) {
  const { isAuthenticated, logout, profile, role } = useAuth();
  const links = allLinks.filter((link) => link.roles.includes(role));

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded bg-leaf text-white">LB</span>
            <span>LocalbizMarket</span>
          </NavLink>
          <div className="hidden items-center gap-2 md:flex">
            <LinkList links={links} className="flex items-center gap-1" itemClassName="nav-link" activeClassName="nav-link-active" />
            {isAuthenticated ? (
              <button className="btn-secondary flex items-center gap-2" type="button" onClick={logout}>
                <LogOut size={17} /> {profile?.name || "Logout"}
              </button>
            ) : (
              <NavLink className="btn-primary flex items-center gap-2" to="/auth">
                <LogIn size={17} /> Sign in
              </NavLink>
            )}
          </div>
        </div>
        <div className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden">
          <LinkList links={links} className="flex gap-1" itemClassName="mobile-link" activeClassName="mobile-link-active" />
          {isAuthenticated ? (
            <button className="mobile-link" type="button" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <NavLink className="mobile-link" to="/auth">
              <LogIn size={16} /> Sign in
            </NavLink>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
