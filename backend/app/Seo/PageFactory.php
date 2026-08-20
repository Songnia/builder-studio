<?php

namespace App\Seo;

class PageFactory
{
    public static function resolveByUrl(string $url): ?array
    {
        $pages = config('seo.pages', []);
        $url = '/' . ltrim($url, '/');
        if ($url !== '/' && str_ends_with($url, '/')) {
            $url = rtrim($url, '/');
        }

        foreach ($pages as $key => $pageData) {
            if (rtrim($pageData['url'], '/') === rtrim($url, '/')) {
                return static::buildPayload($key, $pageData, $url);
            }
        }

        return null;
    }

    public static function buildPayload(string $key, array $pageData, string $currentUrl): array
    {
        $metadata = new Metadata($pageData, $currentUrl);
        $breadcrumbs = Schema::generateBreadcrumbList($pageData['breadcrumbs'] ?? []);
        
        $schemas = [
            Schema::generateOrganization(),
            Schema::generateWebSite(),
            $breadcrumbs,
        ];

        $schemaType = $pageData['schema'] ?? 'WebPage';
        if ($schemaType === 'SoftwareApplication') {
            $schemas[] = Schema::generateSoftwareApplication($pageData);
        } elseif ($schemaType === 'Service') {
            $schemas[] = Schema::generateService($pageData);
        }

        $internalLinks = InternalLinkGraph::getLinksFor($key, $pageData);

        return [
            'key' => $key,
            'data' => $pageData,
            'metadata' => $metadata,
            'schemas' => $schemas,
            'breadcrumbs' => $pageData['breadcrumbs'] ?? [],
            'internalLinks' => $internalLinks,
            'template' => 'seo.pages.' . ($pageData['template'] ?? 'home'),
        ];
    }
}
