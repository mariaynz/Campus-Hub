import { navItems } from '../data/mock.js';
import ProfileMenu from './ProfileMenu.jsx';
import './Topbar.css';

export default function Topbar({ route = '/', profile, onResetData, onSignOut }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="logo" href="#/">
          <span className="logo__mark">C</span>
          <span className="logo__name">Campus Hub</span>
        </a>
        <nav className="tabs" aria-label="Principal">
          {navItems.map(({ label, to }) => {
            const active = to === route;
            return (
              <a
                key={label}
                className={'tab' + (active ? ' tab--active' : '')}
                href={to ? `#${to}` : '#'}
                onClick={to ? undefined : (e) => e.preventDefault()}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </a>
            );
          })}
        </nav>
        <ProfileMenu profile={profile} onResetData={onResetData} onSignOut={onSignOut} />
      </div>
    </header>
  );
}
