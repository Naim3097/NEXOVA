-- Analytics helper functions

-- Function to get traffic by date (for charts)
CREATE OR REPLACE FUNCTION get_traffic_by_date(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at) as date,
    COUNT(*) as page_views,
    COUNT(DISTINCT session_id) as unique_visitors
  FROM analytics_events
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top referrers
CREATE OR REPLACE FUNCTION get_top_referrers(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  referrer TEXT,
  visitors BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(DISTINCT session_id) as total_visitors
    FROM analytics_events
    WHERE project_id = p_project_id
      AND event_type = 'page_view'
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    COALESCE(metadata->>'referrer', 'direct')::TEXT as referrer,
    COUNT(DISTINCT session_id) as visitors,
    ROUND(
      (COUNT(DISTINCT session_id)::NUMERIC / total.total_visitors * 100),
      1
    ) as percentage
  FROM analytics_events, total
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY metadata->>'referrer', total.total_visitors
  ORDER BY visitors DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get device breakdown
CREATE OR REPLACE FUNCTION get_device_breakdown(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  device TEXT,
  visitors BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(DISTINCT session_id) as total_visitors
    FROM analytics_events
    WHERE project_id = p_project_id
      AND event_type = 'page_view'
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    COALESCE(device_type, 'unknown')::TEXT as device,
    COUNT(DISTINCT session_id) as visitors,
    ROUND(
      (COUNT(DISTINCT session_id)::NUMERIC / total.total_visitors * 100),
      1
    ) as percentage
  FROM analytics_events, total
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY device_type, total.total_visitors
  ORDER BY visitors DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversion funnel data
CREATE OR REPLACE FUNCTION get_conversion_funnel(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  step TEXT,
  sessions BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH funnel_data AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as page_views,
      COUNT(DISTINCT CASE WHEN event_type = 'button_click' THEN session_id END) as button_clicks,
      COUNT(DISTINCT CASE WHEN event_type = 'form_view' THEN session_id END) as form_views,
      COUNT(DISTINCT CASE WHEN event_type = 'form_submit' THEN session_id END) as form_submits
    FROM analytics_events
    WHERE project_id = p_project_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT 'Page View'::TEXT as step, page_views as sessions, 100.0 as percentage FROM funnel_data
  UNION ALL
  SELECT 'Button Click'::TEXT, button_clicks, ROUND((button_clicks::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0
  UNION ALL
  SELECT 'Form View'::TEXT, form_views, ROUND((form_views::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0
  UNION ALL
  SELECT 'Form Submit'::TEXT, form_submits, ROUND((form_submits::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index for better performance on metadata queries
CREATE INDEX IF NOT EXISTS idx_analytics_metadata_referrer ON analytics_events
  USING gin ((metadata->'referrer'));

CREATE INDEX IF NOT EXISTS idx_analytics_metadata_utm ON analytics_events
  USING gin ((metadata->'utmSource'));

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_traffic_by_date(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_referrers(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_device_breakdown(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_funnel(UUID, INTEGER) TO authenticated;
