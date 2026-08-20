<?php

namespace App\Seo;

class Metadata
{
    public string $title;
    public string $description;
    public string $canonical;
    public string $robots;
    public string $ogTitle;
    public string $ogDescription;
    public string $ogImage;
    public string $ogUrl;
    public string $twitterCard = 'summary_large_image';

    public function __construct(array $pageData, string $currentUrl)
    {
        $siteName = config('seo.site_name', 'Vanda Studio');
        $domain = config('seo.domain', 'https://vanda-studio.org');

        $this->title = $pageData['meta']['title'] ?? $siteName;
        $this->description = $pageData['meta']['description'] ?? '';
        $this->canonical = rtrim($domain, '/') . $currentUrl;
        
        $indexPolicy = $pageData['index_policy'] ?? 'INDEXABLE';
        $this->robots = ($indexPolicy === 'INDEXABLE') 
            ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' 
            : 'noindex, follow';

        $this->ogTitle = $this->title;
        $this->ogDescription = $this->description;
        $this->ogUrl = $this->canonical;
        $this->ogImage = rtrim($domain, '/') . ($pageData['meta']['og_image'] ?? config('seo.default_og_image'));
    }
}
