<?php

namespace App\Seo;

class Schema
{
    public static function generateOrganization(): array
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => 'Vanda Studio',
            'url' => $domain,
            'logo' => $domain . '/logo.png',
            'description' => 'La plateforme web qui permet à chaque créatif (photographe, graphiste, vidéaste...) de créer, gérer et monétiser son propre studio en ligne.',
            'sameAs' => [
                'https://twitter.com/vandastudio',
                'https://instagram.com/vandastudio',
                'https://linkedin.com/company/vanda-studio',
            ],
        ];
    }

    public static function generateWebSite(): array
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'WebSite',
            'name' => 'Vanda Studio',
            'url' => $domain,
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => $domain . '/search?q={search_term_string}',
                'query-input' => 'required name=search_term_string',
            ],
        ];
    }

    public static function generateBreadcrumbList(array $breadcrumbs): array
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');
        $itemList = [];

        foreach ($breadcrumbs as $index => $crumb) {
            $itemList[] = [
                '@type' => 'ListItem',
                'position' => $index + 1,
                'name' => $crumb['name'],
                'item' => $domain . $crumb['url'],
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => $itemList,
        ];
    }

    public static function generateSoftwareApplication(array $pageData): array
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'SoftwareApplication',
            'name' => $pageData['h1'] ?? $pageData['meta']['title'] ?? 'Vanda Studio',
            'operatingSystem' => 'All (Web-based SaaS)',
            'applicationCategory' => 'BusinessApplication',
            'offers' => [
                '@type' => 'Offer',
                'price' => '0.00',
                'priceCurrency' => 'EUR',
                'seller' => [
                    '@type' => 'Organization',
                    'name' => 'Vanda Studio',
                ],
            ],
            'description' => $pageData['meta']['description'] ?? '',
        ];
    }

    public static function generateService(array $pageData): array
    {
        $domain = rtrim(config('seo.domain', 'https://vanda-studio.org'), '/');

        return [
            '@context' => 'https://schema.org',
            '@type' => 'Service',
            'name' => $pageData['h1'] ?? $pageData['meta']['title'] ?? 'Solution Vanda Studio',
            'provider' => [
                '@type' => 'Organization',
                'name' => 'Vanda Studio',
                'url' => $domain,
            ],
            'serviceType' => 'Création de Studio & Facturation en Ligne',
            'description' => $pageData['meta']['description'] ?? '',
        ];
    }
}
