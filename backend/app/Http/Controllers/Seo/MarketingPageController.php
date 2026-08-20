<?php

namespace App\Http\Controllers\Seo;

use App\Http\Controllers\Controller;
use App\Seo\PageFactory;
use Illuminate\Http\Request;

class MarketingPageController extends Controller
{
    /**
     * Handle rendering of SSR Programmatic Marketing Pages
     */
    public function show(Request $request)
    {
        $path = $request->getPathInfo();
        $payload = PageFactory::resolveByUrl($path);

        if (!$payload) {
            if (file_exists(public_path('landing/index.html'))) {
                return response()->file(public_path('landing/index.html'));
            }
            abort(404);
        }

        return view('seo.layouts.seo', $payload);
    }
}
