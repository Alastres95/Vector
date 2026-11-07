# Conexión segura de Clientes con Supabase

La aplicación no encontró una conexión Supabase configurada. Por tanto, no se consultó ni modificó ninguna base de datos. El archivo `clientes.sql` está preparado, pero no se ha ejecutado.

## Configuración necesaria

1. Configurar `VITE_SUPABASE_URL` con la URL del proyecto Supabase.
2. Configurar `VITE_SUPABASE_ANON_KEY` con la clave pública `anon`/publishable del proyecto. La clave service role no debe añadirse al frontend ni compartirse.
3. Habilitar Supabase Auth y crear o invitar a los usuarios del CRM. La aplicación solo ofrece inicio de sesión; no permite el registro público de usuarios.
4. Asignar el `organization_id` y el `role` mediante `app_metadata` administrado de forma confiable. La aplicación usa el UUID de usuario como espacio privado si no hay `organization_id`. Nunca toma el identificador de organización desde un campo editable del formulario.
5. Antes de ejecutar `clientes.sql`, comprobar en el SQL Editor si existe `public.clientes` y revisar sus columnas y políticas RLS. El script solo crea la tabla si no existe; si ya existe, no la altera ni borra datos. Si existe con otro esquema, adaptar el mapeo después de revisarlo.

La política preparada permite leer registros solo dentro de la organización autorizada. Crear y modificar requiere además el rol `superadministrador`, `administrador` o `comercial`. No hay política de borrado físico: los clientes reales se archivan cambiando su estado a `Inactivo`.

## Consultar la tabla antes de aplicar SQL

```sql
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'clientes'
order by ordinal_position;
```

```sql
select policyname, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'clientes'
order by policyname;
```

Este proyecto no incluye las tablas de organizaciones, perfiles o comerciales. Hasta revisar el esquema real, la política usa el `organization_id` de `app_metadata` y no crea relaciones ni tablas duplicadas.
