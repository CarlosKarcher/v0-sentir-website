-- Tabla para registrar talleres cerrados manualmente por el admin
CREATE TABLE IF NOT EXISTS public.talleres_cerrados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  taller_slug TEXT NOT NULL,
  sede TEXT NOT NULL DEFAULT '',
  fecha_inicio TEXT NOT NULL,
  cerrado_en TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(taller_slug, sede, fecha_inicio)
);

-- RPC: listar talleres cerrados
CREATE OR REPLACE FUNCTION listar_talleres_cerrados(
  p_admin_caracteristica text,
  p_admin_numero text
) RETURNS TABLE(taller_slug text, sede text, fecha_inicio text)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.miembros
    WHERE celular_caracteristica = p_admin_caracteristica
      AND celular_numero = p_admin_numero
      AND es_admin = true
  ) THEN
    RETURN;
  END IF;
  RETURN QUERY
    SELECT tc.taller_slug, tc.sede, tc.fecha_inicio
    FROM public.talleres_cerrados tc;
END;
$$;

-- RPC: cerrar un taller (mover a históricos/morosos)
CREATE OR REPLACE FUNCTION cerrar_taller(
  p_admin_caracteristica text,
  p_admin_numero text,
  p_taller_slug text,
  p_sede text,
  p_fecha_inicio text
) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.miembros
    WHERE celular_caracteristica = p_admin_caracteristica
      AND celular_numero = p_admin_numero
      AND es_admin = true
  ) THEN
    RETURN json_build_object('error', 'No autorizado');
  END IF;

  INSERT INTO public.talleres_cerrados (taller_slug, sede, fecha_inicio)
  VALUES (p_taller_slug, p_sede, p_fecha_inicio)
  ON CONFLICT (taller_slug, sede, fecha_inicio) DO NOTHING;

  RETURN json_build_object('ok', true);
END;
$$;
