export type Estado = 'Activo' | 'Pendiente' | 'En curso' | 'Completado' | 'Cancelado' | 'Pagada' | 'Pendiente de pago' | 'Resuelta' | 'Abierta' | 'Aprobada';
export type TipoCliente = 'Empresa' | 'Particular';
export type EstadoCliente = 'Activo' | 'Pendiente' | 'Inactivo';
export type Cliente = { id: string; tipo: TipoCliente; nombre: string; identificadorFiscal: string; contacto: string; email: string; telefono: string; direccion: string; codigoPostal: string; provincia: string; observaciones: string; estado: EstadoCliente; comercial: string; fechaAlta: string };
export type Operador = { id: string; nombre: string; servicios: string; estado: string };
export type Tarifa = { id: string; nombre: string; operador: string; servicio: string; precioMensual: number; comision: number; estado: string };
export type Venta = { id: string; cliente: string; servicio: string; operador: string; importe: number; estado: string; fecha: string; comercial: string };
export type Pedido = { id: string; cliente: string; servicio: string; operador: string; estado: string; fecha: string };
export type Linea = { id: string; numero: string; cliente: string; operador: string; tarifa: string; estado: string };
export type Fibra = { id: string; cliente: string; operador: string; velocidad: string; estado: string; direccion: string };
export type Contrato = { id: string; cliente: string; servicio: string; operador: string; fechaInicio: string; estado: string };
export type Factura = { id: string; cliente: string; numero: string; importe: number; fecha: string; estado: string };
export type Incidencia = { id: string; cliente: string; servicio: string; prioridad: string; estado: string; fecha: string };
export type Comision = { id: string; comercial: string; venta: string; importe: number; periodo: string; estado: string };
export type Usuario = { id: string; nombre: string; email: string; rol: string; estado: string };
export type DemoRecord = Cliente | Operador | Tarifa | Venta | Pedido | Linea | Fibra | Contrato | Factura | Incidencia | Comision | Usuario;
export type CollectionKey = 'clientes' | 'operadores' | 'tarifas' | 'ventas' | 'pedidos' | 'lineas' | 'fibra' | 'contratos' | 'facturacion' | 'incidencias' | 'comisiones' | 'usuarios';
export const demoDate = (daysAgo = 0, referenceDate = new Date()) => {
  const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  date.setDate(date.getDate() - daysAgo);
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};
export const demoPeriod = (referenceDate = new Date()) =>
  new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(referenceDate);
export type DemoStore = {
  clientes: Cliente[];
  operadores: Operador[];
  tarifas: Tarifa[];
  ventas: Venta[];
  pedidos: Pedido[];
  lineas: Linea[];
  fibra: Fibra[];
  contratos: Contrato[];
  facturacion: Factura[];
  incidencias: Incidencia[];
  comisiones: Comision[];
  usuarios: Usuario[];
};

export const seedData: DemoStore = {
  clientes: [
    { id: 'CLI-1048', tipo: 'Empresa', nombre: 'Estudio Noroeste, S.L.', identificadorFiscal: 'B-81420576', contacto: 'Lucía Martín', email: 'lucia@estudionoroeste.es', telefono: '+34 611 482 903', direccion: 'C/ Alcalá, 118, Madrid', codigoPostal: '28009', provincia: 'Madrid', observaciones: '', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: demoDate(6) },
    { id: 'CLI-1047', tipo: 'Empresa', nombre: 'Clínica Alameda', identificadorFiscal: 'B-39281406', contacto: 'Javier Ortega', email: 'j.ortega@clinicaalameda.es', telefono: '+34 622 310 784', direccion: 'Av. de la Constitución, 24, Sevilla', codigoPostal: '41001', provincia: 'Sevilla', observaciones: '', estado: 'Activo', comercial: 'Diego León', fechaAlta: demoDate(8) },
    { id: 'CLI-1046', tipo: 'Empresa', nombre: 'Talleres Bruma', identificadorFiscal: 'B-76019482', contacto: 'Inés Rubio', email: 'ines@talleresbruma.es', telefono: '+34 633 095 221', direccion: 'Pol. Ind. La Vega, nave 6, Valladolid', codigoPostal: '47009', provincia: 'Valladolid', observaciones: '', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: demoDate(12) },
    { id: 'CLI-1045', tipo: 'Particular', nombre: 'Pilar Santamaría', identificadorFiscal: '48.326.517-K', contacto: 'Pilar Santamaría', email: 'pilar.santamaria@email.es', telefono: '+34 644 182 561', direccion: 'Pza. del Pilar, 7, Zaragoza', codigoPostal: '50003', provincia: 'Zaragoza', observaciones: '', estado: 'Activo', comercial: 'Álvaro Gil', fechaAlta: demoDate(15) },
    { id: 'CLI-1044', tipo: 'Empresa', nombre: 'Grupo Linde', identificadorFiscal: 'A-05824193', contacto: 'Sergio Vidal', email: 'sergio@grupolinde.es', telefono: '+34 655 974 112', direccion: 'Av. de Europa, 14, Alcobendas', codigoPostal: '28108', provincia: 'Madrid', observaciones: '', estado: 'Pendiente', comercial: 'Diego León', fechaAlta: demoDate(20) },
    { id: 'CLI-1043', tipo: 'Empresa', nombre: 'Casa Mistral', identificadorFiscal: 'B-59370281', contacto: 'Noelia Cano', email: 'noelia@casamistral.es', telefono: '+34 666 784 390', direccion: 'C/ Mayor, 39, Zaragoza', codigoPostal: '50001', provincia: 'Zaragoza', observaciones: '', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: demoDate(24) },
  ],
  operadores: [
    { id: 'OP-01', nombre: 'Movistar Mayorista', servicios: 'Fibra · Móvil', estado: 'Activo' },
    { id: 'OP-02', nombre: 'Vodafone Partners', servicios: 'Fibra · Móvil · Voz', estado: 'Activo' },
    { id: 'OP-03', nombre: 'Orange Empresas', servicios: 'Fibra · Móvil', estado: 'Activo' },
    { id: 'OP-04', nombre: 'MásMóvil Wholesale', servicios: 'Fibra · Móvil', estado: 'Activo' },
  ],
  tarifas: [
    { id: 'TAR-201', nombre: 'Fibra Pro 600', operador: 'Movistar Mayorista', servicio: 'Fibra', precioMensual: 34.9, comision: 42, estado: 'Activo' },
    { id: 'TAR-202', nombre: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', servicio: 'Móvil', precioMensual: 18.5, comision: 26, estado: 'Activo' },
    { id: 'TAR-203', nombre: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', servicio: 'Fibra', precioMensual: 42, comision: 48, estado: 'Activo' },
    { id: 'TAR-204', nombre: 'Convergente Oficina', operador: 'MásMóvil Wholesale', servicio: 'Convergente', precioMensual: 56.9, comision: 64, estado: 'Activo' },
  ],
  ventas: [
    { id: 'VEN-2581', cliente: 'Estudio Noroeste, S.L.', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', importe: 419, estado: 'Cerrada', fecha: demoDate(0), comercial: 'Marta Ruiz' },
    { id: 'VEN-2580', cliente: 'Clínica Alameda', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', importe: 222, estado: 'Cerrada', fecha: demoDate(1), comercial: 'Diego León' },
    { id: 'VEN-2579', cliente: 'Talleres Bruma', servicio: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', importe: 504, estado: 'En curso', fecha: demoDate(1), comercial: 'Marta Ruiz' },
    { id: 'VEN-2578', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', importe: 683, estado: 'Cerrada', fecha: demoDate(3), comercial: 'Álvaro Gil' },
    { id: 'VEN-2577', cliente: 'Grupo Linde', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', importe: 419, estado: 'Pendiente', fecha: demoDate(4), comercial: 'Diego León' },
    { id: 'VEN-2576', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', importe: 222, estado: 'Cerrada', fecha: demoDate(6), comercial: 'Marta Ruiz' },
  ],
  pedidos: [
    { id: 'PED-3381', cliente: 'Talleres Bruma', servicio: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', estado: 'En curso', fecha: demoDate(1) },
    { id: 'PED-3380', cliente: 'Grupo Linde', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', estado: 'Pendiente', fecha: demoDate(4) },
    { id: 'PED-3379', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', estado: 'Completado', fecha: demoDate(5) },
    { id: 'PED-3378', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', estado: 'Completado', fecha: demoDate(6) },
  ],
  lineas: [
    { id: 'LIN-8021', numero: '+34 611 482 903', cliente: 'Estudio Noroeste, S.L.', operador: 'Vodafone Partners', tarifa: 'Móvil Empresa 40 GB', estado: 'Activa' },
    { id: 'LIN-8020', numero: '+34 622 310 784', cliente: 'Clínica Alameda', operador: 'Orange Empresas', tarifa: 'Móvil Empresa 40 GB', estado: 'Activa' },
    { id: 'LIN-8019', numero: '+34 633 095 221', cliente: 'Talleres Bruma', operador: 'Vodafone Partners', tarifa: 'Móvil Empresa 40 GB', estado: 'Activa' },
    { id: 'LIN-8018', numero: '+34 655 974 112', cliente: 'Grupo Linde', operador: 'Movistar Mayorista', tarifa: 'Móvil Empresa 40 GB', estado: 'Pendiente' },
  ],
  fibra: [
    { id: 'FIB-4108', cliente: 'Estudio Noroeste, S.L.', operador: 'Movistar Mayorista', velocidad: '600 Mb', estado: 'Activa', direccion: 'C/ Alcalá 118, Madrid' },
    { id: 'FIB-4107', cliente: 'Clínica Alameda', operador: 'Orange Empresas', velocidad: '1 Gb', estado: 'Activa', direccion: 'Av. de la Constitución 24, Sevilla' },
    { id: 'FIB-4106', cliente: 'Talleres Bruma', operador: 'Orange Empresas', velocidad: '1 Gb', estado: 'En instalación', direccion: 'Pol. Ind. La Vega, nave 6, Valladolid' },
    { id: 'FIB-4105', cliente: 'Casa Mistral', operador: 'Movistar Mayorista', velocidad: '600 Mb', estado: 'Activa', direccion: 'Pza. del Pilar 7, Zaragoza' },
  ],
  contratos: [
    { id: 'CTR-9142', cliente: 'Estudio Noroeste, S.L.', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', fechaInicio: demoDate(0), estado: 'Activo' },
    { id: 'CTR-9141', cliente: 'Clínica Alameda', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', fechaInicio: demoDate(1), estado: 'Activo' },
    { id: 'CTR-9140', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', fechaInicio: demoDate(3), estado: 'Activo' },
    { id: 'CTR-9139', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', fechaInicio: demoDate(6), estado: 'Activo' },
  ],
  facturacion: [
    { id: 'FAC-2025-0218', cliente: 'Estudio Noroeste, S.L.', numero: 'VT-2025-0218', importe: 419, fecha: demoDate(0), estado: 'Pendiente de pago' },
    { id: 'FAC-2025-0217', cliente: 'Clínica Alameda', numero: 'VT-2025-0217', importe: 222, fecha: demoDate(1), estado: 'Pagada' },
    { id: 'FAC-2025-0216', cliente: 'Pilar Santamaría', numero: 'VT-2025-0216', importe: 683, fecha: demoDate(3), estado: 'Pagada' },
    { id: 'FAC-2025-0215', cliente: 'Casa Mistral', numero: 'VT-2025-0215', importe: 222, fecha: demoDate(6), estado: 'Pendiente de pago' },
  ],
  incidencias: [
    { id: 'INC-1042', cliente: 'Talleres Bruma', servicio: 'Fibra 1 Gb', prioridad: 'Alta', estado: 'Abierta', fecha: demoDate(0) },
    { id: 'INC-1041', cliente: 'Grupo Linde', servicio: 'Portabilidad móvil', prioridad: 'Media', estado: 'En curso', fecha: demoDate(1) },
    { id: 'INC-1040', cliente: 'Clínica Alameda', servicio: 'Línea móvil', prioridad: 'Baja', estado: 'Resuelta', fecha: demoDate(4) },
  ],
  comisiones: [
    { id: 'COM-0921', comercial: 'Marta Ruiz', venta: 'VEN-2581 · Estudio Noroeste', importe: 42, periodo: demoPeriod(), estado: 'Pendiente' },
    { id: 'COM-0920', comercial: 'Diego León', venta: 'VEN-2580 · Clínica Alameda', importe: 26, periodo: demoPeriod(), estado: 'Aprobada' },
    { id: 'COM-0919', comercial: 'Álvaro Gil', venta: 'VEN-2578 · Pilar Santamaría', importe: 64, periodo: demoPeriod(), estado: 'Aprobada' },
    { id: 'COM-0918', comercial: 'Marta Ruiz', venta: 'VEN-2576 · Casa Mistral', importe: 26, periodo: demoPeriod(), estado: 'Pendiente' },
  ],
  usuarios: [
    { id: 'USR-01', nombre: 'Marta Ruiz', email: 'marta.ruiz@verticetelecom.es', rol: 'Comercial', estado: 'Activo' },
    { id: 'USR-02', nombre: 'Diego León', email: 'diego.leon@verticetelecom.es', rol: 'Comercial', estado: 'Activo' },
    { id: 'USR-03', nombre: 'Álvaro Gil', email: 'alvaro.gil@verticetelecom.es', rol: 'Administrador', estado: 'Activo' },
    { id: 'USR-04', nombre: 'Sara Moreno', email: 'sara.moreno@verticetelecom.es', rol: 'Operaciones', estado: 'Activo' },
  ],
};

export const moduleMeta: Record<CollectionKey, { title: string; singular: string; subtitle: string; columns: { key: string; label: string }[] }> = {
  clientes: { title: 'Clientes', singular: 'cliente', subtitle: 'Empresas y personas que confían en Vértice.', columns: [{key:'nombre',label:'Cliente'},{key:'identificadorFiscal',label:'NIF / CIF'},{key:'contacto',label:'Contacto'},{key:'telefono',label:'Teléfono'},{key:'comercial',label:'Comercial'},{key:'estado',label:'Estado'}] },
  operadores: { title: 'Operadores mayoristas', singular: 'operador', subtitle: 'Catálogo de operadores de demostración, sin conectividad real.', columns: [{key:'nombre',label:'Operador'},{key:'servicios',label:'Servicios'},{key:'estado',label:'Estado'}] },
  tarifas: { title: 'Tarifas', singular: 'tarifa', subtitle: 'Catálogo comercial de tarifas ficticias disponibles.', columns: [{key:'nombre',label:'Tarifa'},{key:'operador',label:'Operador'},{key:'servicio',label:'Servicio'},{key:'precioMensual',label:'Precio / mes'},{key:'comision',label:'Comisión'},{key:'estado',label:'Estado'}] },
  ventas: { title: 'Ventas', singular: 'venta', subtitle: 'Oportunidades y contrataciones del equipo comercial.', columns: [{key:'id',label:'Referencia'},{key:'cliente',label:'Cliente'},{key:'servicio',label:'Servicio'},{key:'comercial',label:'Comercial'},{key:'importe',label:'Importe'},{key:'estado',label:'Estado'},{key:'fecha',label:'Fecha'}] },
  pedidos: { title: 'Pedidos', singular: 'pedido', subtitle: 'Seguimiento de altas y provisiones en curso.', columns: [{key:'id',label:'Pedido'},{key:'cliente',label:'Cliente'},{key:'servicio',label:'Servicio'},{key:'operador',label:'Operador'},{key:'estado',label:'Estado'},{key:'fecha',label:'Fecha'}] },
  lineas: { title: 'Líneas móviles', singular: 'línea', subtitle: 'Líneas móviles activas y su tarifa asociada.', columns: [{key:'numero',label:'Número'},{key:'cliente',label:'Cliente'},{key:'operador',label:'Operador'},{key:'tarifa',label:'Tarifa'},{key:'estado',label:'Estado'}] },
  fibra: { title: 'Servicios de fibra', singular: 'servicio de fibra', subtitle: 'Conexiones fijas y estado de instalación.', columns: [{key:'id',label:'Referencia'},{key:'cliente',label:'Cliente'},{key:'direccion',label:'Dirección'},{key:'velocidad',label:'Velocidad'},{key:'operador',label:'Operador'},{key:'estado',label:'Estado'}] },
  contratos: { title: 'Contratos', singular: 'contrato', subtitle: 'Contratos vigentes y últimas contrataciones.', columns: [{key:'id',label:'Contrato'},{key:'cliente',label:'Cliente'},{key:'servicio',label:'Servicio'},{key:'operador',label:'Operador'},{key:'fechaInicio',label:'Inicio'},{key:'estado',label:'Estado'}] },
  facturacion: { title: 'Facturación', singular: 'factura', subtitle: 'Facturas de muestra y su estado de cobro.', columns: [{key:'numero',label:'Factura'},{key:'cliente',label:'Cliente'},{key:'fecha',label:'Fecha'},{key:'importe',label:'Importe'},{key:'estado',label:'Estado'}] },
  incidencias: { title: 'Incidencias', singular: 'incidencia', subtitle: 'Seguimiento interno de solicitudes y averías.', columns: [{key:'id',label:'Referencia'},{key:'cliente',label:'Cliente'},{key:'servicio',label:'Servicio'},{key:'prioridad',label:'Prioridad'},{key:'fecha',label:'Fecha'},{key:'estado',label:'Estado'}] },
  comisiones: { title: 'Comisiones', singular: 'comisión', subtitle: 'Liquidaciones de ejemplo asociadas a ventas demo.', columns: [{key:'id',label:'Referencia'},{key:'comercial',label:'Comercial'},{key:'venta',label:'Venta'},{key:'periodo',label:'Periodo'},{key:'importe',label:'Importe'},{key:'estado',label:'Estado'}] },
  usuarios: { title: 'Usuarios', singular: 'usuario', subtitle: 'Equipo de ejemplo con roles y estado de acceso.', columns: [{key:'nombre',label:'Nombre'},{key:'email',label:'Correo'},{key:'rol',label:'Rol'},{key:'estado',label:'Estado'}] },
};
