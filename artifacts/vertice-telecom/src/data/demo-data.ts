export type Estado = 'Activo' | 'Pendiente' | 'En curso' | 'Completado' | 'Cancelado' | 'Pagada' | 'Pendiente de pago' | 'Resuelta' | 'Abierta' | 'Aprobada';
export type Cliente = { id: string; nombre: string; identificadorFiscal: string; contacto: string; email: string; telefono: string; estado: string; comercial: string; fechaAlta: string };
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
    { id: 'CLI-1048', nombre: 'Estudio Noroeste, S.L.', identificadorFiscal: 'B-81420576', contacto: 'Lucía Martín', email: 'lucia@estudionoroeste.es', telefono: '+34 611 482 903', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: '12/02/2025' },
    { id: 'CLI-1047', nombre: 'Clínica Alameda', identificadorFiscal: 'B-39281406', contacto: 'Javier Ortega', email: 'j.ortega@clinicaalameda.es', telefono: '+34 622 310 784', estado: 'Activo', comercial: 'Diego León', fechaAlta: '10/02/2025' },
    { id: 'CLI-1046', nombre: 'Talleres Bruma', identificadorFiscal: 'B-76019482', contacto: 'Inés Rubio', email: 'ines@talleresbruma.es', telefono: '+34 633 095 221', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: '06/02/2025' },
    { id: 'CLI-1045', nombre: 'Pilar Santamaría', identificadorFiscal: '48.326.517-K', contacto: 'Pilar Santamaría', email: 'pilar.santamaria@email.es', telefono: '+34 644 182 561', estado: 'Activo', comercial: 'Álvaro Gil', fechaAlta: '03/02/2025' },
    { id: 'CLI-1044', nombre: 'Grupo Linde', identificadorFiscal: 'A-05824193', contacto: 'Sergio Vidal', email: 'sergio@grupolinde.es', telefono: '+34 655 974 112', estado: 'Pendiente', comercial: 'Diego León', fechaAlta: '29/01/2025' },
    { id: 'CLI-1043', nombre: 'Casa Mistral', identificadorFiscal: 'B-59370281', contacto: 'Noelia Cano', email: 'noelia@casamistral.es', telefono: '+34 666 784 390', estado: 'Activo', comercial: 'Marta Ruiz', fechaAlta: '25/01/2025' },
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
    { id: 'VEN-2581', cliente: 'Estudio Noroeste, S.L.', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', importe: 419, estado: 'Cerrada', fecha: '18/02/2025', comercial: 'Marta Ruiz' },
    { id: 'VEN-2580', cliente: 'Clínica Alameda', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', importe: 222, estado: 'Cerrada', fecha: '17/02/2025', comercial: 'Diego León' },
    { id: 'VEN-2579', cliente: 'Talleres Bruma', servicio: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', importe: 504, estado: 'En curso', fecha: '17/02/2025', comercial: 'Marta Ruiz' },
    { id: 'VEN-2578', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', importe: 683, estado: 'Cerrada', fecha: '15/02/2025', comercial: 'Álvaro Gil' },
    { id: 'VEN-2577', cliente: 'Grupo Linde', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', importe: 419, estado: 'Pendiente', fecha: '14/02/2025', comercial: 'Diego León' },
    { id: 'VEN-2576', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', importe: 222, estado: 'Cerrada', fecha: '12/02/2025', comercial: 'Marta Ruiz' },
  ],
  pedidos: [
    { id: 'PED-3381', cliente: 'Talleres Bruma', servicio: 'Fibra Simétrica 1 Gb', operador: 'Orange Empresas', estado: 'En curso', fecha: '17/02/2025' },
    { id: 'PED-3380', cliente: 'Grupo Linde', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', estado: 'Pendiente', fecha: '14/02/2025' },
    { id: 'PED-3379', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', estado: 'Completado', fecha: '13/02/2025' },
    { id: 'PED-3378', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', estado: 'Completado', fecha: '12/02/2025' },
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
    { id: 'CTR-9142', cliente: 'Estudio Noroeste, S.L.', servicio: 'Fibra Pro 600', operador: 'Movistar Mayorista', fechaInicio: '18/02/2025', estado: 'Activo' },
    { id: 'CTR-9141', cliente: 'Clínica Alameda', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', fechaInicio: '17/02/2025', estado: 'Activo' },
    { id: 'CTR-9140', cliente: 'Pilar Santamaría', servicio: 'Convergente Oficina', operador: 'MásMóvil Wholesale', fechaInicio: '15/02/2025', estado: 'Activo' },
    { id: 'CTR-9139', cliente: 'Casa Mistral', servicio: 'Móvil Empresa 40 GB', operador: 'Vodafone Partners', fechaInicio: '12/02/2025', estado: 'Activo' },
  ],
  facturacion: [
    { id: 'FAC-2025-0218', cliente: 'Estudio Noroeste, S.L.', numero: 'VT-2025-0218', importe: 419, fecha: '18/02/2025', estado: 'Pendiente de pago' },
    { id: 'FAC-2025-0217', cliente: 'Clínica Alameda', numero: 'VT-2025-0217', importe: 222, fecha: '17/02/2025', estado: 'Pagada' },
    { id: 'FAC-2025-0216', cliente: 'Pilar Santamaría', numero: 'VT-2025-0216', importe: 683, fecha: '15/02/2025', estado: 'Pagada' },
    { id: 'FAC-2025-0215', cliente: 'Casa Mistral', numero: 'VT-2025-0215', importe: 222, fecha: '12/02/2025', estado: 'Pendiente de pago' },
  ],
  incidencias: [
    { id: 'INC-1042', cliente: 'Talleres Bruma', servicio: 'Fibra 1 Gb', prioridad: 'Alta', estado: 'Abierta', fecha: '18/02/2025' },
    { id: 'INC-1041', cliente: 'Grupo Linde', servicio: 'Portabilidad móvil', prioridad: 'Media', estado: 'En curso', fecha: '17/02/2025' },
    { id: 'INC-1040', cliente: 'Clínica Alameda', servicio: 'Línea móvil', prioridad: 'Baja', estado: 'Resuelta', fecha: '14/02/2025' },
  ],
  comisiones: [
    { id: 'COM-0921', comercial: 'Marta Ruiz', venta: 'VEN-2581 · Estudio Noroeste', importe: 42, periodo: 'Febrero 2025', estado: 'Pendiente' },
    { id: 'COM-0920', comercial: 'Diego León', venta: 'VEN-2580 · Clínica Alameda', importe: 26, periodo: 'Febrero 2025', estado: 'Aprobada' },
    { id: 'COM-0919', comercial: 'Álvaro Gil', venta: 'VEN-2578 · Pilar Santamaría', importe: 64, periodo: 'Febrero 2025', estado: 'Aprobada' },
    { id: 'COM-0918', comercial: 'Marta Ruiz', venta: 'VEN-2576 · Casa Mistral', importe: 26, periodo: 'Febrero 2025', estado: 'Pendiente' },
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
