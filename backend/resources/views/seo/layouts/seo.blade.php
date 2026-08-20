<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $metadata->title }}</title>
    <meta name="description" content="{{ $metadata->description }}">
    <meta name="robots" content="{{ $metadata->robots }}">
    <link rel="canonical" href="{{ $metadata->canonical }}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ $metadata->ogUrl }}">
    <meta property="og:title" content="{{ $metadata->ogTitle }}">
    <meta property="og:description" content="{{ $metadata->ogDescription }}">
    <meta property="og:image" content="{{ $metadata->ogImage }}">

    <!-- Twitter -->
    <meta name="twitter:card" content="{{ $metadata->twitterCard }}">
    <meta name="twitter:url" content="{{ $metadata->ogUrl }}">
    <meta name="twitter:title" content="{{ $metadata->ogTitle }}">
    <meta name="twitter:description" content="{{ $metadata->ogDescription }}">
    <meta name="twitter:image" content="{{ $metadata->ogImage }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- CSS System -->
    <style>
        :root {
            --bg-color: #0b0f19;
            --surface-color: #111827;
            --surface-border: rgba(255, 255, 255, 0.08);
            --primary-gradient: linear-gradient(135deg, #4caf50 0%, #81c784 100%);
            --accent-green: #4caf50;
            --text-main: #f9fafb;
            --text-muted: #9ca3af;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
            padding: 0 1.5rem;
        }

        .gradient-text {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .glass-card {
            background: rgba(17, 24, 39, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid var(--surface-border);
            border-radius: 1.25rem;
            padding: 2rem;
        }

        .btn-primary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: #4caf50;
            color: #000;
            font-weight: 700;
            padding: 0.875rem 2rem;
            border-radius: 0.75rem;
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .btn-primary:hover {
            background: #66bb6a;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(76, 175, 80, 0.4);
        }

        .btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            color: #fff;
            font-weight: 600;
            padding: 0.875rem 2rem;
            border-radius: 0.75rem;
            border: 1px solid var(--surface-border);
            text-decoration: none;
            transition: all 0.2s ease;
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        /* Header */
        header {
            border-bottom: 1px solid var(--surface-border);
            position: sticky;
            top: 0;
            z-index: 50;
            background: rgba(11, 15, 25, 0.85);
            backdrop-filter: blur(12px);
        }

        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 5rem;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
        }

        .logo-text {
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
        }

        .nav-links a {
            color: var(--text-muted);
            text-decoration: none;
            font-weight: 500;
            font-size: 0.95rem;
            transition: color 0.2s;
        }

        .nav-links a:hover {
            color: var(--text-main);
        }

        /* Hero */
        .hero {
            padding: 5rem 0 3rem;
            text-align: center;
            position: relative;
        }

        .hero h1 {
            font-size: 3rem;
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 1.5rem;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        .hero p {
            font-size: 1.25rem;
            color: var(--text-muted);
            max-width: 650px;
            margin: 0 auto 2.5rem;
        }

        /* Breadcrumbs */
        .breadcrumbs-nav {
            padding: 1.5rem 0;
            font-size: 0.875rem;
            color: var(--text-muted);
        }

        .breadcrumbs-nav a {
            color: var(--text-muted);
            text-decoration: none;
        }

        .breadcrumbs-nav a:hover {
            color: var(--accent-green);
        }

        /* Footer */
        footer {
            border-top: 1px solid var(--surface-border);
            padding: 4rem 0 2rem;
            margin-top: 5rem;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr repeat(3, 1fr);
            gap: 3rem;
            margin-bottom: 3rem;
        }

        .footer-bottom {
            border-top: 1px solid var(--surface-border);
            padding-top: 2rem;
            display: flex;
            justify-content: space-between;
            color: var(--text-muted);
            font-size: 0.875rem;
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .nav-links { display: none; }
            .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
        }
    </style>

    <!-- JSON-LD Schemas -->
    @foreach ($schemas as $schema)
        <script type="application/ld+json">
            {!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>
    @endforeach
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <div class="nav-inner">
                <a href="/" class="logo">
                    <img src="/logo.png" alt="Vanda Studio" height="36" style="display: block;">
                    <span class="logo-text gradient-text">VANDA STUDIO</span>
                </a>

                <ul class="nav-links">
                    <li><a href="/features/builder-site-vitrine">Fonctionnalités</a></li>
                    <li><a href="/solutions/studio-mariage-et-evenementiel">Solutions</a></li>
                    <li><a href="/for">Métiers</a></li>
                    <li><a href="/tools/calculateur-facture-photographe">Outils Gratuit</a></li>
                    <li><a href="/pricing">Tarifs</a></li>
                </ul>

                <div style="display: flex; gap: 1rem;">
                    <a href="https://app.vanda-studio.org/auth/login" class="btn-secondary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">Connexion</a>
                    <a href="https://app.vanda-studio.org/auth/register" class="btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;">Créer mon studio</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main>
        <div class="container">
            @include('seo.partials.breadcrumbs', ['breadcrumbs' => $breadcrumbs])
        </div>

        @include($template)

        <div class="container">
            @include('seo.partials.related', ['links' => $internalLinks])
            @include('seo.partials.cta', ['pageData' => $data])
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div>
                    <a href="/" class="logo" style="margin-bottom: 1rem;">
                        <span class="logo-text gradient-text">VANDA STUDIO</span>
                    </a>
                    <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 320px;">
                        La plateforme tout-en-un pour créer votre studio en ligne (site, galeries clients, devis et factures). Conçue pour photographes, graphistes et créatifs.
                    </p>
                </div>
                <div>
                    <h4 style="margin-bottom: 1rem; font-size: 1rem;">Fonctionnalités</h4>
                    <ul style="list-style: none; display: grid; gap: 0.5rem; font-size: 0.9rem;">
                        <li><a href="/features/builder-site-vitrine" style="color: var(--text-muted); text-decoration: none;">Builder No-Code</a></li>
                        <li><a href="/features/galeries-clients-privees" style="color: var(--text-muted); text-decoration: none;">Galeries Privées</a></li>
                        <li><a href="/features/facturation-et-devis" style="color: var(--text-muted); text-decoration: none;">Facturation & Devis</a></li>
                        <li><a href="/features/paiement-en-ligne-et-acompte" style="color: var(--text-muted); text-decoration: none;">Paiement Acomptes</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1rem; font-size: 1rem;">Métiers</h4>
                    <ul style="list-style: none; display: grid; gap: 0.5rem; font-size: 0.9rem;">
                        <li><a href="/for/photographe" style="color: var(--text-muted); text-decoration: none;">Photographe</a></li>
                        <li><a href="/for/graphiste" style="color: var(--text-muted); text-decoration: none;">Graphiste</a></li>
                        <li><a href="/for/illustrateur" style="color: var(--text-muted); text-decoration: none;">Illustrateur</a></li>
                        <li><a href="/for/videaste" style="color: var(--text-muted); text-decoration: none;">Vidéaste</a></li>
                    </ul>
                </div>
                <div>
                    <h4 style="margin-bottom: 1rem; font-size: 1rem;">Outils & Pricing</h4>
                    <ul style="list-style: none; display: grid; gap: 0.5rem; font-size: 0.9rem;">
                        <li><a href="/tools/calculateur-facture-photographe" style="color: var(--text-muted); text-decoration: none;">Calculateur Devis</a></li>
                        <li><a href="/tools/simulateur-tarifs-photographe" style="color: var(--text-muted); text-decoration: none;">Simulateur TJM</a></li>
                        <li><a href="/pricing" style="color: var(--text-muted); text-decoration: none;">Tarifs</a></li>
                        <li><a href="/alternatives" style="color: var(--text-muted); text-decoration: none;">Alternatives</a></li>
                    </ul>
                </div>
            </div>

            <div class="footer-bottom">
                <p>© 2026 Vanda Studio. Tous droits réservés.</p>
                <p>Fait avec ❤️ pour les créatifs</p>
            </div>
        </div>
    </footer>

</body>
</html>
