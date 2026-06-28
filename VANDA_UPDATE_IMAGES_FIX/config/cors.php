<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Local development
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        // Production
        'https://vanda-studio.org',
        'https://www.vanda-studio.org',
        'https://app.vanda-studio.org',
    ],

    'allowed_origins_patterns' => [
        // Photographer public sites such as https://ultima-studios.vanda-studio.org
        '#^https://([a-z0-9-]+\.)?vanda-studio\.org$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
