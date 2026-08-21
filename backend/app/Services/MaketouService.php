<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class MaketouService
{
    protected string $baseUrl;
    protected string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.maketou.base_url') ?? 'https://api.maketou.net';
        $this->apiKey = config('services.maketou.api_key') ?? '';
    }

    /**
     * Create a checkout cart on Maketou
     * 
     * @param array $data payload containing productDocumentId, customer info, redirectURL, and meta
     * @return array
     */
    public function createCart(array $data)
    {
        if (empty($this->apiKey)) {
            throw new Exception("Maketou API Key is not configured.");
        }

        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->connectTimeout(5)
            ->timeout(15)
            ->post("{$this->baseUrl}/api/v1/stores/cart/checkout", $data);

        if ($response->failed()) {
            throw new Exception("Maketou API Error: " . $response->body());
        }

        return $response->json();
    }

    /**
     * Retrieve a cart's status from Maketou
     * 
     * @param string $cartId
     * @return array
     */
    public function getCart(string $cartId)
    {
        if (empty($this->apiKey)) {
            throw new Exception("Maketou API Key is not configured.");
        }

        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->connectTimeout(5)
            ->timeout(15)
            ->get("{$this->baseUrl}/api/v1/stores/cart/{$cartId}");

        if ($response->failed()) {
            throw new Exception("Maketou API Error: " . $response->body());
        }

        return $response->json();
    }
}
