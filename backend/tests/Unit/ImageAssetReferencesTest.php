<?php

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class ImageAssetReferencesTest extends TestCase
{
    #[DataProvider('sourceDirectories')]
    public function test_public_image_references_point_to_existing_assets(string $sourceDirectory): void
    {
        $backendRoot = dirname(__DIR__, 2);
        $projectRoot = dirname($backendRoot);
        $publicRoot = $projectRoot.'/frontend/public';
        $missing = [];

        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(
            $projectRoot.'/'.$sourceDirectory,
            RecursiveDirectoryIterator::SKIP_DOTS
        ));

        foreach ($files as $file) {
            if (! $file->isFile() || ! in_array($file->getExtension(), ['php', 'ts', 'tsx'], true)) {
                continue;
            }

            $contents = file_get_contents($file->getPathname());
            preg_match_all(
                '#[\'\"](/[^\'\"]+\.(?:png|jpe?g|webp|gif|svg))[\'\"]#i',
                $contents ?: '',
                $matches
            );

            foreach (array_unique($matches[1]) as $assetPath) {
                if (! is_file($publicRoot.$assetPath)) {
                    $relativeSourcePath = ltrim(substr($file->getPathname(), strlen($projectRoot)), '/');
                    $missing[] = $relativeSourcePath.' -> '.$assetPath;
                }
            }
        }

        $this->assertSame([], $missing, "Missing image assets:\n".implode("\n", $missing));
    }

    public static function sourceDirectories(): array
    {
        return [
            'frontend' => ['frontend/src'],
            'backend SEO views' => ['backend/resources/views/seo'],
        ];
    }
}
