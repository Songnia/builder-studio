<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Seo\PageFactory;

class SeoArchitectureTest extends TestCase
{
    /**
     * Test that all configured SEO pages can be resolved by PageFactory with complete metadata.
     */
    public function test_all_registered_pages_resolve_payload_with_valid_metadata(): void
    {
        $pages = config('seo.pages', []);
        $this->assertNotEmpty($pages, 'SEO pages configuration should not be empty.');

        foreach ($pages as $key => $pageData) {
            $payload = PageFactory::resolveByUrl($pageData['url']);
            
            $this->assertNotNull($payload, "Page payload should resolve for URL: {$pageData['url']}");
            $this->assertNotEmpty($payload['metadata']->title, "Title should not be empty for {$key}");
            $this->assertNotEmpty($payload['metadata']->description, "Description should not be empty for {$key}");
            $this->assertNotEmpty($payload['metadata']->canonical, "Canonical URL should not be empty for {$key}");
            $this->assertTrue(
                str_starts_with($payload['metadata']->canonical, 'http://') || str_starts_with($payload['metadata']->canonical, 'https://'),
                "Canonical URL should start with http/https for {$key}"
            );
            $this->assertNotEmpty($payload['schemas'], "JSON-LD schemas array should not be empty for {$key}");
        }
    }

    /**
     * Test sitemap index endpoint returning valid XML.
     */
    public function test_sitemap_index_returns_valid_xml(): void
    {
        $response = $this->get('/sitemap.xml');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
        $this->assertStringContainsString('<sitemapindex', $response->getContent());
        $this->assertStringContainsString('/sitemap-core.xml', $response->getContent());
        $this->assertStringContainsString('/sitemap-tools.xml', $response->getContent());
    }

    /**
     * Test sitemap group endpoint returning valid XML for specific group.
     */
    public function test_sitemap_group_returns_valid_xml(): void
    {
        $groups = array_keys(config('seo.sitemaps', []));

        foreach ($groups as $group) {
            $response = $this->get("/sitemap-{$group}.xml");
            $response->assertStatus(200);
            $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
            $this->assertStringContainsString('<urlset', $response->getContent());
        }
    }

    /**
     * Test robots.txt endpoint returning valid plain text directives.
     */
    public function test_robots_txt_returns_correct_directives(): void
    {
        $response = $this->get('/robots.txt');
        $response->assertStatus(200);
        $this->assertStringContainsString('User-agent: *', $response->getContent());
        $this->assertStringContainsString('Disallow: /admin/', $response->getContent());
        $this->assertStringContainsString('Disallow: /auth/', $response->getContent());
        $this->assertStringContainsString('Disallow: /g/', $response->getContent());
        $this->assertStringContainsString('Sitemap:', $response->getContent());
    }

    /**
     * Test rendering of sample programmatic marketing pages via SSR.
     */
    public function test_marketing_pages_render_successfully(): void
    {
        $sampleUrls = [
            '/pricing',
            '/for',
            '/for/photographe',
            '/solutions/studio-mariage-et-evenementiel',
            '/tools/calculateur-facture-photographe',
            '/features/builder-site-vitrine',
            '/alternatives',
            '/alternatives/pixieset-alternative'
        ];

        foreach ($sampleUrls as $url) {
            $response = $this->get($url);
            $response->assertStatus(200);
            $this->assertStringContainsString('<!DOCTYPE html>', $response->getContent());
            $this->assertStringContainsString('<title>', $response->getContent());
            $this->assertStringContainsString('application/ld+json', $response->getContent());
        }
    }
}
