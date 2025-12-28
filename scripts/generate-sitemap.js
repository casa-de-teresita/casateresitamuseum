// scripts/generate-sitemap.js
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://lacasadeteresita.netlify.app';

async function generateSitemap() {
  const urls = [
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
    { loc: '/blog', priority: 0.9, changefreq: 'weekly' },
    { loc: '/museum', priority: 0.9, changefreq: 'monthly' },
  ];

  // Récupérer les posts de blog
  const blogManifestEN = JSON.parse(
    fs.readFileSync('public/content/blog/en/manifest.json', 'utf8')
  );
  blogManifestEN.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/blog/${slug}`,
      priority: 0.8,
      changefreq: 'monthly'
    });
  });

  // Récupérer les œuvres du musée
  const museumManifestEN = JSON.parse(
    fs.readFileSync('public/content/museum/en/manifest.json', 'utf8')
  );
  museumManifestEN.files.forEach(file => {
    const slug = file.replace('.md', '');
    urls.push({
      loc: `/museum/${slug}`,
      priority: 0.7,
      changefreq: 'yearly'
    });
  });

  // Générer XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync('public/sitemap.xml', xml);
  console.log('✅ Sitemap généré avec', urls.length, 'URLs');
}

generateSitemap();