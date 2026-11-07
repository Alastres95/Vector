-- Safe first-time setup for the Clientes module.
-- This script creates public.clientes only when it does not already exist.
-- If the table already exists, it leaves it completely unchanged for review.

DO $clientes_setup$
BEGIN
  IF to_regclass('public.clientes') IS NULL THEN
    EXECUTE $create_table$
      CREATE TABLE public.clientes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id uuid NOT NULL,
        created_by uuid NOT NULL DEFAULT auth.uid(),
        tipo_cliente text NOT NULL CHECK (tipo_cliente IN ('Empresa', 'Particular')),
        nombre text NOT NULL CHECK (length(trim(nombre)) > 0),
        nif_cif text NOT NULL CHECK (length(trim(nif_cif)) BETWEEN 5 AND 20),
        nombre_contacto text NOT NULL DEFAULT '',
        telefono text NOT NULL CHECK (length(trim(telefono)) BETWEEN 6 AND 22),
        email text NOT NULL CHECK (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
        direccion text NOT NULL CHECK (length(trim(direccion)) > 0),
        codigo_postal text NOT NULL DEFAULT '' CHECK (codigo_postal = '' OR codigo_postal ~ '^[0-9]{5}$'),
        provincia text NOT NULL DEFAULT '',
        comercial text NOT NULL CHECK (length(trim(comercial)) > 0),
        estado text NOT NULL DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Pendiente', 'Inactivo')),
        observaciones text NOT NULL DEFAULT '',
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    $create_table$;

    EXECUTE 'ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.clientes FORCE ROW LEVEL SECURITY';

    EXECUTE $select_policy$
      CREATE POLICY clientes_read_same_organization
      ON public.clientes FOR SELECT TO authenticated
      USING (
        organization_id = CASE
          WHEN (auth.jwt() -> 'app_metadata' ->> 'organization_id') ~*
            '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
          ELSE auth.uid()
        END
      )
    $select_policy$;

    EXECUTE $insert_policy$
      CREATE POLICY clientes_create_same_organization
      ON public.clientes FOR INSERT TO authenticated
      WITH CHECK (
        organization_id = CASE
          WHEN (auth.jwt() -> 'app_metadata' ->> 'organization_id') ~*
            '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
          ELSE auth.uid()
        END
        AND auth.uid() = created_by
        AND lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) IN
          ('superadministrador', 'administrador', 'comercial')
      )
    $insert_policy$;

    EXECUTE $update_policy$
      CREATE POLICY clientes_update_same_organization
      ON public.clientes FOR UPDATE TO authenticated
      USING (
        organization_id = CASE
          WHEN (auth.jwt() -> 'app_metadata' ->> 'organization_id') ~*
            '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
          ELSE auth.uid()
        END
        AND lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) IN
          ('superadministrador', 'administrador', 'comercial')
      )
      WITH CHECK (
        organization_id = CASE
          WHEN (auth.jwt() -> 'app_metadata' ->> 'organization_id') ~*
            '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
          THEN (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid
          ELSE auth.uid()
        END
        AND lower(COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '')) IN
          ('superadministrador', 'administrador', 'comercial')
      )
    $update_policy$;

    EXECUTE $search_index$
      CREATE INDEX clientes_org_nombre_idx
      ON public.clientes (organization_id, lower(nombre))
    $search_index$;

    EXECUTE $tax_index$
      CREATE UNIQUE INDEX clientes_org_nif_cif_idx
      ON public.clientes (
        organization_id,
        upper(regexp_replace(nif_cif, '[[:space:]]+', '', 'g'))
      )
    $tax_index$;

    RAISE NOTICE 'Created public.clientes with organization-scoped RLS.';
  ELSE
    RAISE NOTICE 'public.clientes already exists; no schema or data changes were made.';
  END IF;
END
$clientes_setup$;
