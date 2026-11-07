import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { AppShell } from './components/AppShell';
import { DemoProvider } from './data/DemoProvider';
import { Dashboard } from './pages/Dashboard';
import { ModulePage, ReportsPage, SettingsPage } from './pages/Modules';
import { ClientsWorkspace } from './pages/ClientsWorkspace';

const queryClient = new QueryClient();

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return <AppShell>
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/clientes/:id"><ClientsWorkspace /></Route>
        <Route path="/clientes"><ClientsWorkspace /></Route>
        <Route path="/operadores"><ModulePage collection="operadores" /></Route>
        <Route path="/tarifas"><ModulePage collection="tarifas" /></Route>
        <Route path="/ventas"><ModulePage collection="ventas" /></Route>
        <Route path="/pedidos"><ModulePage collection="pedidos" /></Route>
        <Route path="/lineas"><ModulePage collection="lineas" /></Route>
        <Route path="/fibra"><ModulePage collection="fibra" /></Route>
        <Route path="/contratos"><ModulePage collection="contratos" /></Route>
        <Route path="/facturacion"><ModulePage collection="facturacion" /></Route>
        <Route path="/incidencias"><ModulePage collection="incidencias" /></Route>
        <Route path="/comisiones"><ModulePage collection="comisiones" /></Route>
        <Route path="/informes" component={ReportsPage} />
        <Route path="/usuarios"><ModulePage collection="usuarios" /></Route>
        <Route path="/configuracion" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  </AppShell>;
}

function App() {
  return <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DemoProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </DemoProvider>
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>;
}

export default App;
