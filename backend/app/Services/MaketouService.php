<?php

namespace App\Services;

use App\Exceptions\MaketouApiException;
use Illuminate\Support\Facades\Http;

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
     * @param  array  $data  payload containing productDocumentId, customer info, redirectURL, and meta
     * @return array
     */
    public function createCart(array $data)
    {
        if (empty($this->apiKey)) {
            throw new MaketouApiException('INVALID_API_KEY', 503, 'Maketou API key is not configured.');
        }

        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->connectTimeout(5)
            ->timeout(15)
            ->post("{$this->baseUrl}/api/v1/stores/cart/checkout", $data);

        if ($response->failed()) {
            $body = $response->json();

            throw new MaketouApiException(
                is_array($body) && is_string($body['code'] ?? null) ? $body['code'] : null,
                $response->status(),
                is_array($body) && is_string($body['message'] ?? null)
                    ? $body['message']
                    : 'Maketou API request failed.',
            );
        }

        return $response->json();
    }

    /**
     * Retrieve a cart's status from Maketou
     *
     * @return array
     */
    public function getCart(string $cartId)
    {
        if (empty($this->apiKey)) {
            throw new MaketouApiException('INVALID_API_KEY', 503, 'Maketou API key is not configured.');
        }

        $response = Http::withToken($this->apiKey)
            ->acceptJson()
            ->connectTimeout(5)
            ->timeout(15)
            ->get("{$this->baseUrl}/api/v1/stores/cart/{$cartId}");

        if ($response->failed()) {
            $body = $response->json();

            throw new MaketouApiException(
                is_array($body) && is_string($body['code'] ?? null) ? $body['code'] : null,
                $response->status(),
                is_array($body) && is_string($body['message'] ?? null)
                    ? $body['message']
                    : 'Maketou API request failed.',
            );
        }

        return $response->json();
    }
}
