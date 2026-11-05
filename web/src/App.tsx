import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketsPage } from './pages/TicketsPage';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/:id" element={<TicketDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
