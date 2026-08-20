<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SeoController extends Controller
{
    /**
     * Generate the main sitemap index (/sitemap.xml)
     */
    public function sitemapIndex()
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');
        $groups = array_keys(config('seo.sitemaps', []));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($groups as $group) {
            $xml .= '  <sitemap>' . "\n";
            $xml .= '    <loc>' . $domain . '/sitemap-' . $group . '.xml</loc>' . "\n";
            $xml .= '    <lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
            $xml .= '  </sitemap>' . "\n";
        }

        $xml .= '</sitemapindex>';

        return response($xml, 200, ['Content-Type' => 'text/xml']);
    }

    /**
     * Generate specific sitemap group (/sitemap-{group}.xml)
     */
    public function sitemapGroup(string $group)
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');
        $sitemapConfigs = config('seo.sitemaps', []);

        if (!isset($sitemapConfigs[$group])) {
            abort(404, 'Sitemap group not found');
        }

        $groupConfig = $sitemapConfigs[$group];
        $allPages = config('seo.pages', []);

        $groupPages = array_filter($allPages, function ($page) use ($group) {
            return ($page['sitemap_group'] ?? '') === $group && ($page['index_policy'] ?? '') === 'INDEXABLE';
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($groupPages as $page) {
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . $domain . $page['url'] . '</loc>' . "\n";
            $xml .= '    <changefreq>' . ($page['changefreq'] ?? $groupConfig['changefreq'] ?? 'weekly') . '</changefreq>' . "\n";
            $xml .= '    <priority>' . ($page['priority'] ?? $groupConfig['priority'] ?? '0.8') . '</priority>' . "\n";
            $xml .= '    <lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
            $xml .= '  </url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'text/xml']);
    }

    /**
     * Generate robots.txt
     */
    public function robots()
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');

        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /superadmin/\n";
        $content .= "Disallow: /auth/\n";
        $content .= "Disallow: /builder/\n";
        $content .= "Disallow: /g/\n";
        $content .= "Disallow: /api/\n";
        $content .= "Disallow: /storage/temp/\n\n";
        $content .= "Sitemap: " . $domain . "/sitemap.xml\n";

        return response($content, 200, ['Content-Type' => 'text/plain']);
    }
}
