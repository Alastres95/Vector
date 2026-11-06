import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { demoDate, demoPeriod, seedData, type CollectionKey, type DemoRecord, type DemoStore } from './demo-data';

type DemoRepository = {
  list: <K extends CollectionKey>(collection: K) => DemoStore[K];
  create: (collection: CollectionKey, record: DemoRecord) => void;
  update: (collection: CollectionKey, id: string, patch: Partial<DemoRecord>) => void;
  remove: (collection: CollectionKey, id: string) => void;
  reset: () => void;
};
const DemoContext = createContext<DemoRepository | null>(null);
const STORE_KEY = 'vertice-demo-store-v1';
const legacyDateOffsets: Record<string, number> = {
  '18/02/2025': 0,
  '17/02/2025': 1,
  '15/02/2025': 3,
  '14/02/2025': 4,
  '13/02/2025': 5,
  '12/02/2025': 6,
  '10/02/2025': 8,
  '06/02/2025': 12,
  '03/02/2025': 15,
  '29/01/2025': 20,
  '25/01/2025': 24,
};

const refreshLegacyDate = (value: string) =>
  value in legacyDateOffsets ? demoDate(legacyDateOffsets[value]) : value;

function migrateStoredDemoData(saved: Partial<DemoStore>): DemoStore {
  const merged = { ...seedData, ...saved } as DemoStore;
  const seedClients = new Map(seedData.clientes.map(row => [row.id, row]));
  return {
    ...merged,
    clientes: merged.clientes.map(row => {
      const seed = seedClients.get(row.id);
      const tipo = row.tipo ?? seed?.tipo ?? (/^[ABCFGJNPQRSUVW]/i.test(row.identificadorFiscal) ? 'Empresa' : 'Particular');
      return {
        ...seed,
        ...row,
        tipo,
        direccion: row.direccion ?? seed?.direccion ?? '',
        fechaAlta: refreshLegacyDate(row.fechaAlta),
      };
    }),
    ventas: merged.ventas.map(row => ({ ...row, fecha: refreshLegacyDate(row.fecha) })),
    pedidos: merged.pedidos.map(row => ({ ...row, fecha: refreshLegacyDate(row.fecha) })),
    contratos: merged.contratos.map(row => ({ ...row, fechaInicio: refreshLegacyDate(row.fechaInicio) })),
    facturacion: merged.facturacion.map(row => ({ ...row, fecha: refreshLegacyDate(row.fecha) })),
    incidencias: merged.incidencias.map(row => ({ ...row, fecha: refreshLegacyDate(row.fecha) })),
    comisiones: merged.comisiones.map(row => ({
      ...row,
      periodo: row.periodo === 'Febrero 2025' ? demoPeriod() : row.periodo,
    })),
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      return saved ? migrateStoredDemoData(JSON.parse(saved) as Partial<DemoStore>) : seedData;
    } catch {
      return seedData;
    }
  });
  useEffect(() => { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }, [store]);
  const value = useMemo<DemoRepository>(() => ({
    list: <K extends CollectionKey>(key: K) => store[key],
    create: (key, record) => setStore((old) => ({ ...old, [key]: [record, ...old[key]] })),
    update: (key, id, patch) => setStore((old) => ({ ...old, [key]: old[key].map((item) => item.id === id ? { ...item, ...patch } as DemoRecord : item) })),
    remove: (key, id) => setStore((old) => ({ ...old, [key]: old[key].filter((item) => item.id !== id) })),
    reset: () => setStore(seedData),
  }), [store]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoData() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemoData debe usarse dentro de DemoProvider');
  return context;
}
