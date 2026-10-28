import { navItems } from '../data/mock.js';
import './Topbar.css';

export default function Topbar({ active = 'Inicio' }) {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="logo" href="#">
          <span className="logo__mark">C</span>
          <span className="logo__name">Campus Hub</span>
        </a>
        <nav className="tabs" aria-label="Principal">
          {navItems.map((item) => (
            <a
              key={item}
              className={'tab' + (item === active ? ' tab--active' : '')}
              href="#"
              aria-current={item === active ? 'page' : undefined}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="avatar" aria-label="Perfil de Ana">AN</div>
      </div>
    </header>
  );
}
