import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://suginami-parking.vercel.app'
  let placeUrls: MetadataRoute.Sitemap = []
  try {
    const { data } = await supabase.from('places').select('slug, updated_at').limit(1000)
    placeUrls = (data || []).map((p) => ({
      url: `${baseUrl}/p/${p.slug}`,
      lastModified: new Date(p.updated_at),
    }))
  } catch {}

  return [
    { url: baseUrl },
    { url: `${baseUrl}/suginami` },
    { url: `${baseUrl}/suginami/ogikubo` },
    { url: `${baseUrl}/suginami/asagaya` },
    { url: `${baseUrl}/suginami/nishiogikubo` },
    { url: `${baseUrl}/suginami/koenji` },
    ...placeUrls,
  ]
}
