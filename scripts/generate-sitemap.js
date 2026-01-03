// scripts/generate-sitemap.js
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://lacasadeteresita.com';

async function generateSitemap() {
  const urls = [
    // Homepage (pas de préfixe langue)
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
  ];

  // Blog pages (EN + ES)
  urls.push(
    { loc: '/en/blog', priority: 0.9, changefreq: 'weekly' },
    { loc: '/es/blog', priority: 0.9, changefreq: 'weekly' }
  );

  // Museum pages (EN + ES)
  urls.push(
    { loc: '/en/museum', priority: 0.9, changefreq: 'monthly' },
    { loc: '/es/museum', priority: 0.9, changefreq: 'monthly' }
  );

  // Blog posts (EN)
  const blogManifestEN = JSON.parse(
    fs.readFileSync('public/content/blog/en/manifest.json', 'utf8')
  );
  blogManifestEN.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/en/blog/${slug}`,
      priority: 0.8,
      changefreq: 'monthly'
    });
  });

  // Blog posts (ES)
  const blogManifestES = JSON.parse(
    fs.readFileSync('public/content/blog/es/manifest.json', 'utf8')
  );
  blogManifestES.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/es/blog/${slug}`,
      priority: 0.8,
      changefreq: 'monthly'
    });
  });

  // Museum artworks (EN)
  const museumManifestEN = JSON.parse(
    fs.readFileSync('public/content/museum/en/manifest.json', 'utf8')
  );
  museumManifestEN.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/en/museum/${slug}`,
      priority: 0.7,
      changefreq: 'yearly'
    });
  });

  // Museum artworks (ES)
  const museumManifestES = JSON.parse(
    fs.readFileSync('public/content/museum/es/manifest.json', 'utf8')
  );
  museumManifestES.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/es/museum/${slug}`,
      priority: 0.7,
      changefreq: 'yearly'
    });
  });

  // Générer XML avec les URLs complètes
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', xml);
}

generateSitemap().catch(console.error);
