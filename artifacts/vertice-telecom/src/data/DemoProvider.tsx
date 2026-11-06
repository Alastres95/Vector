import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { seedData, type CollectionKey, type DemoRecord, type DemoStore } from './demo-data';

type DemoRepository = {
  list: <K extends CollectionKey>(collection: K) => DemoStore[K];
  create: (collection: CollectionKey, record: DemoRecord) => void;
  update: (collection: CollectionKey, id: string, patch: Partial<DemoRecord>) => void;
  remove: (collection: CollectionKey, id: string) => void;
  reset: () => void;
};
const DemoContext = createContext<DemoRepository | null>(null);
const STORE_KEY = 'vertice-demo-store-v1';

export function DemoProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      return saved ? { ...seedData, ...JSON.parse(saved) } as DemoStore : seedData;
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
