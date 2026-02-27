#!/bin/bash
PAT="sbp_8cd91c47a0453caefe302ec901a451ddb352e236"
PROJECT_REF="cuinyjpiifcslzexrunc"

exec_sql() {
  curl -s -X POST \
    "https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query" \
    -H "Authorization: Bearer ${PAT}" \
    -H "Content-Type: application/json" \
    -d "{\"query\": \"$1\"}"
}

echo "Creating tables..."

exec_sql "CREATE TABLE IF NOT EXISTS places (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, name TEXT NOT NULL, slug TEXT UNIQUE NOT NULL, category_primary TEXT NOT NULL DEFAULT '飲食店', ward TEXT NOT NULL DEFAULT '杉並区', nearest_station TEXT NOT NULL, address TEXT NOT NULL, lat DOUBLE PRECISION, lng DOUBLE PRECISION, phone TEXT, website_url TEXT, google_place_id TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())"
echo "places OK"

exec_sql "CREATE TABLE IF NOT EXISTS parking_infos (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL, parking_type TEXT NOT NULL DEFAULT 'unknown', has_parking BOOLEAN DEFAULT false, spaces_count INT, height_limit_cm INT, is_free BOOLEAN, fee_text TEXT, usage_conditions TEXT, confidence_score INT DEFAULT 0, verification_status TEXT NOT NULL DEFAULT 'ai_extracted', last_verified_on DATE NOT NULL DEFAULT CURRENT_DATE, next_review_on DATE, UNIQUE(place_id))"
echo "parking_infos OK"

exec_sql "CREATE TABLE IF NOT EXISTS evidence_sources (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL, evidence_type TEXT NOT NULL, url TEXT, quote TEXT, reliability_score INT DEFAULT 50, captured_at TIMESTAMPTZ DEFAULT now())"
echo "evidence_sources OK"

exec_sql "CREATE TABLE IF NOT EXISTS reviews_pages (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL, ward TEXT NOT NULL DEFAULT '杉並区', station TEXT, theme TEXT, content_md TEXT NOT NULL, published BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now())"
echo "reviews_pages OK"

exec_sql "CREATE TABLE IF NOT EXISTS place_page_links (id UUID DEFAULT gen_random_uuid() PRIMARY KEY, page_id UUID REFERENCES reviews_pages(id) ON DELETE CASCADE, place_id UUID REFERENCES places(id) ON DELETE CASCADE, sort_order INT DEFAULT 0, highlight_text TEXT)"
echo "place_page_links OK"

exec_sql "ALTER TABLE places ENABLE ROW LEVEL SECURITY"
exec_sql "ALTER TABLE parking_infos ENABLE ROW LEVEL SECURITY"
exec_sql "ALTER TABLE evidence_sources ENABLE ROW LEVEL SECURITY"
exec_sql "ALTER TABLE reviews_pages ENABLE ROW LEVEL SECURITY"
exec_sql "ALTER TABLE place_page_links ENABLE ROW LEVEL SECURITY"

exec_sql "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename='places' AND policyname='public read places') THEN CREATE POLICY \"public read places\" ON places FOR SELECT USING (true); END IF; END \$\$"
exec_sql "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename='parking_infos' AND policyname='public read parking') THEN CREATE POLICY \"public read parking\" ON parking_infos FOR SELECT USING (true); END IF; END \$\$"
exec_sql "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename='evidence_sources' AND policyname='public read evidence') THEN CREATE POLICY \"public read evidence\" ON evidence_sources FOR SELECT USING (true); END IF; END \$\$"
exec_sql "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename='reviews_pages' AND policyname='public read pages') THEN CREATE POLICY \"public read pages\" ON reviews_pages FOR SELECT USING (published = true); END IF; END \$\$"
exec_sql "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename='place_page_links' AND policyname='public read links') THEN CREATE POLICY \"public read links\" ON place_page_links FOR SELECT USING (true); END IF; END \$\$"

echo "All tables created!"
