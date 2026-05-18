-- FASE 2: RPCs de administración para talleres e inscripciones
-- Ejecutar en Supabase SQL Editor

-- ─── listar_talleres_admin ────────────────────────────────────────────────────
create or replace function listar_talleres_admin(
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
    select coalesce(json_agg(t order by t.fecha_inicio asc nulls last), '[]'::json)
    from public.talleres t
    where t.activo = true
  );
end;
$$;

-- ─── insertar_taller_admin ────────────────────────────────────────────────────
create or replace function insertar_taller_admin(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_slug text,
  p_nombre text,
  p_sede text,
  p_precio numeric,
  p_descuento_tipo text,
  p_descuento_valor numeric,
  p_fecha_inicio date
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
  insert into public.talleres (slug, nombre, sede, precio, descuento_tipo, descuento_valor, fecha_inicio, activo)
  values (
    p_slug,
    p_nombre,
    p_sede,
    coalesce(p_precio, 0),
    nullif(p_descuento_tipo, ''),
    p_descuento_valor,
    p_fecha_inicio,
    true
  );
  return json_build_object('ok', true);
end;
$$;

-- ─── actualizar_precio_taller ─────────────────────────────────────────────────
create or replace function actualizar_precio_taller(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_taller_id uuid,
  p_precio numeric,
  p_descuento_tipo text,
  p_descuento_valor numeric,
  p_sede text,
  p_acepta_transferencia boolean,
  p_acepta_tarjeta boolean,
  p_acepta_sena boolean,
  p_fecha_inicio date
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
  update public.talleres set
    precio              = coalesce(p_precio, 0),
    descuento_tipo      = nullif(p_descuento_tipo, ''),
    descuento_valor     = p_descuento_valor,
    sede                = p_sede,
    acepta_transferencia = p_acepta_transferencia,
    acepta_tarjeta      = p_acepta_tarjeta,
    acepta_sena         = p_acepta_sena,
    fecha_inicio        = p_fecha_inicio
  where id = p_taller_id;
  return json_build_object('ok', true);
end;
$$;

-- ─── eliminar_taller_admin ────────────────────────────────────────────────────
create or replace function eliminar_taller_admin(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_taller_id uuid
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
  if exists (select 1 from public.inscripciones where taller_id = p_taller_id) then
    return json_build_object('error', 'El taller tiene inscripciones vinculadas');
  end if;
  delete from public.talleres where id = p_taller_id;
  return json_build_object('ok', true);
end;
$$;

-- ─── cancelar_inscripcion ─────────────────────────────────────────────────────
create or replace function cancelar_inscripcion(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_inscripcion_id uuid
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
  update public.inscripciones
  set estado = 'cancelado'
  where id = p_inscripcion_id;
  return json_build_object('ok', true);
end;
$$;

-- ─── eliminar_inscripcion ─────────────────────────────────────────────────────
create or replace function eliminar_inscripcion(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_inscripcion_id uuid
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
  delete from public.inscripciones where id = p_inscripcion_id;
  return json_build_object('ok', true);
end;
$$;

-- ─── actualizar_monto_pagado ──────────────────────────────────────────────────
create or replace function actualizar_monto_pagado(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_inscripcion_id uuid,
  p_monto_pagado numeric
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
  update public.inscripciones
  set monto_pagado = p_monto_pagado
  where id = p_inscripcion_id;
  return json_build_object('ok', true);
end;
$$;

-- ─── actualizar_precio_inscripto ──────────────────────────────────────────────
create or replace function actualizar_precio_inscripto(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_inscripcion_id uuid,
  p_precio_inscripto numeric
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
  update public.inscripciones
  set precio_inscripto = p_precio_inscripto
  where id = p_inscripcion_id;
  return json_build_object('ok', true);
end;
$$;
