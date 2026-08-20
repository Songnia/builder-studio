<?php

namespace App\Seo;

class InternalLinkGraph
{
    /**
     * Resolve related internal links for a given page key or template family
     */
    public static function getLinksFor(string $pageKey, array $pageData): array
    {
        $allPages = config('seo.pages', []);
        $links = [];

        $template = $pageData['template'] ?? '';

        switch ($template) {
            case 'tool':
                // Tools link to related features, pricing, and main audiences
                $links[] = ['title' => 'Module Facturation', 'url' => '/features/facturation-et-devis', 'category' => 'Fonctionnalités'];
                $links[] = ['title' => 'Simulateur de Tarifs', 'url' => '/tools/simulateur-tarifs-photographe', 'category' => 'Outils'];
                $links[] = ['title' => 'Photographes', 'url' => '/for/photographe', 'category' => 'Pour qui ?'];
                $links[] = ['title' => 'Graphistes', 'url' => '/for/graphiste', 'category' => 'Pour qui ?'];
                break;

            case 'feature':
                // Features link to related tools and solution hubs
                $links[] = ['title' => 'Calculateur de Devis', 'url' => '/tools/calculateur-facture-photographe', 'category' => 'Outils'];
                $links[] = ['title' => 'Builder de Site', 'url' => '/features/builder-site-vitrine', 'category' => 'Fonctionnalités'];
                $links[] = ['title' => 'Mariage & Événementiel', 'url' => '/solutions/studio-mariage-et-evenementiel', 'category' => 'Solutions'];
                $links[] = ['title' => 'Tarifs', 'url' => '/pricing', 'category' => 'Tarifs'];
                break;

            case 'solution_hub':
                // Solution hubs link to audiences and features
                $links[] = ['title' => 'Galeries Privées', 'url' => '/features/galeries-clients-privees', 'category' => 'Fonctionnalités'];
                $links[] = ['title' => 'Paiement Acomptes', 'url' => '/features/paiement-en-ligne-et-acompte', 'category' => 'Fonctionnalités'];
                $links[] = ['title' => 'Photographe', 'url' => '/for/photographe', 'category' => 'Métiers'];
                $links[] = ['title' => 'Wedding Planner', 'url' => '/for/wedding-planner', 'category' => 'Métiers'];
                break;

            case 'audience':
                // Audiences link to sibling audiences, tools, and solution hubs
                $links[] = ['title' => 'Photographes', 'url' => '/for/photographe', 'category' => 'Métiers'];
                $links[] = ['title' => 'Graphistes', 'url' => '/for/graphiste', 'category' => 'Métiers'];
                $links[] = ['title' => 'Vidéastes', 'url' => '/for/videaste', 'category' => 'Métiers'];
                $links[] = ['title' => 'Illustrateurs', 'url' => '/for/illustrateur', 'category' => 'Métiers'];
                $links[] = ['title' => 'Calculateur Facture', 'url' => '/tools/calculateur-facture-photographe', 'category' => 'Outils'];
                break;

            default:
                $links[] = ['title' => 'Découvrir Vanda Studio', 'url' => '/', 'category' => 'Accueil'];
                $links[] = ['title' => 'Voir les Tarifs', 'url' => '/pricing', 'category' => 'Tarifs'];
                $links[] = ['title' => 'Calculateur de Factures', 'url' => '/tools/calculateur-facture-photographe', 'category' => 'Outils'];
                break;
        }

        return $links;
    }
}
