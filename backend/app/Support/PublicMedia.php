<?php

namespace App\Support;

class PublicMedia
{
    public static function url(string $path): string
    {
        $normalizedPath = ltrim(self::extractRelativePath($path) ?? $path, '/');
        $encodedPath = implode('/', array_map('rawurlencode', explode('/', $normalizedPath)));

        return url('/media/' . $encodedPath);
    }

    public static function normalizeUrlIfPublicMedia(?string $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return $value;
        }

        $relativePath = self::extractRelativePath($value);

        return $relativePath ? self::url($relativePath) : $value;
    }

    public static function extractRelativePath(?string $value): ?string
    {
        if (! is_string($value) || $value === '') {
            return null;
        }

        $parsedPath = parse_url($value, PHP_URL_PATH);
        $candidate = is_string($parsedPath) && $parsedPath !== '' ? $parsedPath : $value;
        $candidate = ltrim(urldecode($candidate), '/');

        if (str_starts_with($candidate, 'storage/')) {
            return substr($candidate, strlen('storage/'));
        }

        if (str_starts_with($candidate, 'media/')) {
            return substr($candidate, strlen('media/'));
        }

        return null;
    }
}
