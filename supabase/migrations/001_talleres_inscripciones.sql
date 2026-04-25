-- FASE 1: Talleres e Inscripciones
-- Ejecutado el 2026-04-25 via Supabase MCP

-- Tabla TALLERES
create table talleres (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nombre text not null,
  descripcion text,
  descripcion_corta text,
  precio numeric(10,2) not null default 0,
  moneda text default 'ARS',
  duracion text,
  modalidad text,
  fecha_inicio timestamptz,
  cupo_maximo integer default 20,
  imagen_url text,
  activo boolean default true,
  orden integer default 0,
  creado_en timestamptz default now()
);

-- Tabla INSCRIPCIONES
create table inscripciones (
  id uuid primary key default gen_random_uuid(),
  taller_id uuid references talleres(id) on delete restrict,
  nombre text not null,
  apellido text not null,
  email text not null,
  telefono text not null,
  dni text,
  ciudad text,
  comprobante_url text,
  metodo_pago text default 'transferencia',
  estado text default 'pendiente',
  monto_pagado numeric(10,2),
  notas_admin text,
  mensaje_inscripto text,
  creado_en timestamptz default now(),
  confirmado_en timestamptz,
  check (estado in ('pendiente','confirmado','cancelado'))
);

create index idx_inscripciones_taller on inscripciones(taller_id);
create index idx_inscripciones_estado on inscripciones(estado);
create index idx_inscripciones_email on inscripciones(email);

-- 7 talleres iniciales
insert into talleres (slug, nombre, orden) values
  ('autoconocimiento',        'Autoconocimiento',          1),
  ('transformacion',          'Transformación',            2),
  ('metas-y-logros',          'Metas & Logros',            3),
  ('camino-del-guerrero',     'El Camino del Guerrero',    4),
  ('biodecodificacion',       'Biodecodificación',         5),
  ('sanando-mi-nino-interior','Sanando mi Niño Interior',  6),
  ('constelaciones-grupales', 'Constelaciones Grupales',   7);

-- Storage bucket para comprobantes (privado, upload opcional)
insert into storage.buckets (id, name, public)
values ('comprobantes', 'comprobantes', false)
on conflict (id) do nothing;

-- RLS
alter table talleres enable row level security;
alter table inscripciones enable row level security;

create policy "talleres_select_activos"
  on talleres for select using (activo = true);

create policy "inscripciones_insert_publico"
  on inscripciones for insert with check (true);

create policy "comprobantes_upload"
  on storage.objects for insert
  with check (bucket_id = 'comprobantes');

-- RPC: listar inscripciones (solo admins)
create or replace function listar_inscripciones(
  p_admin_caracteristica text,
  p_admin_numero text
) returns json language plpgsql security definer as $$
begin
  if not exists (
    select 1 from public.miembros
    where celular_caracteristica = p_admin_caracteristica
      and celular_numero = p_admin_numero
      and es_admin = true
  ) then
    return json_build_object('error', 'No autorizado');
  end if;
  return (
    select json_agg(i order by i.creado_en desc)
    from (
      select ins.id, ins.taller_id, ins.nombre, ins.apellido, ins.email,
             ins.telefono, ins.dni, ins.ciudad, ins.comprobante_url,
             ins.metodo_pago, ins.estado, ins.monto_pagado,
             ins.notas_admin, ins.mensaje_inscripto,
             ins.creado_en, ins.confirmado_en,
             t.nombre as taller_nombre, t.slug as taller_slug
      from public.inscripciones ins
      join public.talleres t on t.id = ins.taller_id
    ) i
  );
end;
$$;

-- RPC: aprobar inscripción (solo admins)
create or replace function aprobar_inscripcion(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_inscripcion_id uuid
) returns json language plpgsql security definer as $$
declare
  v_email text;
  v_nombre text;
begin
  if not exists (
    select 1 from public.miembros
    where celular_caracteristica = p_admin_caracteristica
      and celular_numero = p_admin_numero
      and es_admin = true
  ) then
    return json_build_object('error', 'No autorizado');
  end if;
  update public.inscripciones
  set estado = 'confirmado', confirmado_en = now()
  where id = p_inscripcion_id
  returning email, nombre into v_email, v_nombre;
  return json_build_object('ok', true, 'email', v_email, 'nombre', v_nombre);
end;
$$;
