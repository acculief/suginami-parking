-- places
CREATE TABLE IF NOT EXISTS places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category_primary TEXT NOT NULL DEFAULT '飲食店',
  ward TEXT NOT NULL DEFAULT '杉並区',
  nearest_station TEXT NOT NULL,
  address TEXT NOT NULL,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  phone TEXT,
  website_url TEXT,
  google_place_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- parking_infos
CREATE TABLE IF NOT EXISTS parking_infos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  parking_type TEXT NOT NULL DEFAULT 'unknown',
  has_parking BOOLEAN DEFAULT false,
  spaces_count INT,
  height_limit_cm INT,
  is_free BOOLEAN,
  fee_text TEXT,
  usage_conditions TEXT,
  confidence_score INT DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'ai_extracted',
  last_verified_on DATE NOT NULL DEFAULT CURRENT_DATE,
  next_review_on DATE,
  UNIQUE(place_id)
);

-- evidence_sources
CREATE TABLE IF NOT EXISTS evidence_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  evidence_type TEXT NOT NULL,
  url TEXT,
  quote TEXT,
  reliability_score INT DEFAULT 50,
  captured_at TIMESTAMPTZ DEFAULT now()
);

-- reviews_pages
CREATE TABLE IF NOT EXISTS reviews_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  ward TEXT NOT NULL DEFAULT '杉並区',
  station TEXT,
  theme TEXT,
  content_md TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- place_page_links
CREATE TABLE IF NOT EXISTS place_page_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID REFERENCES reviews_pages(id) ON DELETE CASCADE,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0,
  highlight_text TEXT
);

ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE parking_infos ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE place_page_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read places" ON places FOR SELECT USING (true);
CREATE POLICY "public read parking" ON parking_infos FOR SELECT USING (true);
CREATE POLICY "public read evidence" ON evidence_sources FOR SELECT USING (true);
CREATE POLICY "public read pages" ON reviews_pages FOR SELECT USING (published = true);
CREATE POLICY "public read links" ON place_page_links FOR SELECT USING (true);
