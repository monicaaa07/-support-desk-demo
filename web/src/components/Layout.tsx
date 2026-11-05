import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <span className={styles.brand}>Support Desk</span>
        <nav aria-label="Main">
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Dashboard
          </NavLink>
          <NavLink to="/tickets" className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Tickets
          </NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
