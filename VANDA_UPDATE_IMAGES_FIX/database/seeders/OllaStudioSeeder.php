<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\SiteConfig;
use Illuminate\Support\Facades\Hash;

class OllaStudioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Olla Studio user
        $user = User::updateOrCreate(
            ['email' => 'olla@ollastudio.com'],
            [
                'name' => 'Olla Studio',
                'password' => Hash::make('password'),
            ]
        );

        // Create site configuration with red/white branding
        SiteConfig::updateOrCreate(
            [
                'user_id' => $user->id,
                'site_name' => 'Olla Studio'
            ],
            [
                'slug' => 'olla-studio',
                'is_published' => true,
                'config_data' => [
                    // General Information
                    'siteName' => 'Olla Studio',
                    'tagline' => 'Capturing Life\'s Beautiful Moments',
                    'description' => 'Professional photography studio specializing in contemporary portraits, lifestyle photography, and creative visual storytelling.',
                    'logo' => '',
                    'useStudioNameAsLogo' => true,

                    // Colors - Red Primary, White Secondary
                    'primaryColor' => '#ff0000',      // Red
                    'secondaryColor' => '#ffffff',    // White
                    'accentColor' => '#cc0000',       // Dark Red
                    'backgroundColor' => '#f8f8f8',   // Light Gray
                    'textColor' => '#1a1a1a',         // Dark Gray

                    // Contact Information
                    'email' => 'contact@ollastudio.com',
                    'phone' => '+33 7 89 45 67 23',
                    'address' => '45 Avenue des Champs',
                    'city' => 'Lyon',
                    'country' => 'France',

                    // About the Promoter
                    'promoterBiography' => 'With over 10 years of experience in professional photography, I specialize in creating stunning visual narratives that capture authentic emotions and unique moments.',
                    'promoterPhilosophy' => 'I believe every photograph should tell a story. My approach combines technical excellence with artistic vision to create images that resonate with emotion and authenticity.',
                    'promoterPhoto' => '',

                    // Social Media
                    'socials' => [
                        'instagram' => 'https://instagram.com/ollastudio',
                        'facebook' => 'https://facebook.com/ollastudio',
                        'twitter' => '',
                        'youtube' => '',
                        'website' => ''
                    ],

                    // Content
                    'heroImages' => [],
                    'photos' => [],
                    'services' => [
                        [
                            'id' => '1',
                            'title' => 'Portrait Photography',
                            'description' => 'Professional portraits that capture your unique personality and style',
                            'features' => [
                                'Individual portraits',
                                'Family sessions',
                                'Corporate headshots',
                                'Creative portraits'
                            ]
                        ],
                        [
                            'id' => '2',
                            'title' => 'Event Photography',
                            'description' => 'Comprehensive coverage of your special events and celebrations',
                            'features' => [
                                'Wedding photography',
                                'Birthday parties',
                                'Corporate events',
                                'Social gatherings'
                            ]
                        ],
                        [
                            'id' => '3',
                            'title' => 'Commercial Photography',
                            'description' => 'High-quality images for your business and brand',
                            'features' => [
                                'Product photography',
                                'Brand imagery',
                                'Advertising campaigns',
                                'Social media content'
                            ]
                        ],
                        [
                            'id' => '4',
                            'title' => 'Photo Editing',
                            'description' => 'Professional retouching and enhancement services',
                            'features' => [
                                'Color correction',
                                'Advanced retouching',
                                'Photo restoration',
                                'Creative editing'
                            ]
                        ]
                    ],
                    'pricingPlans' => [
                        [
                            'id' => '1',
                            'name' => 'Starter Session',
                            'price' => '199€',
                            'description' => 'Perfect for individuals looking for quality portraits',
                            'features' => [
                                '1 hour photo session',
                                '1 outfit change',
                                '10 edited photos',
                                'Online gallery'
                            ]
                        ],
                        [
                            'id' => '2',
                            'name' => 'Professional Package',
                            'price' => '399€',
                            'description' => 'Our most popular option for comprehensive coverage',
                            'features' => [
                                '2 hour photo session',
                                'Multiple outfit changes',
                                '25 edited photos',
                                'Professional makeup',
                                'Online gallery',
                                'Print rights'
                            ],
                            'recommended' => true
                        ],
                        [
                            'id' => '3',
                            'name' => 'Elite Experience',
                            'price' => '899€',
                            'description' => 'Premium service with full customization',
                            'features' => [
                                'Half-day session',
                                'Unlimited outfit changes',
                                '50 edited photos',
                                'Hair & makeup styling',
                                'Multiple locations',
                                'All raw files included'
                            ]
                        ]
                    ],
                    'testimonials' => [
                        [
                            'id' => '1',
                            'name' => 'Emma Laurent',
                            'role' => 'Bride',
                            'content' => 'Absolutely stunning work! Every moment was captured perfectly. Highly recommend Olla Studio!',
                            'rating' => 5
                        ],
                        [
                            'id' => '2',
                            'name' => 'Thomas Blanchard',
                            'role' => 'Corporate Client',
                            'content' => 'Professional, creative, and delivered beyond expectations. Perfect for our brand imagery.',
                            'rating' => 5
                        ],
                        [
                            'id' => '3',
                            'name' => 'Camille Rousseau',
                            'role' => 'Portrait Session',
                            'content' => 'Amazing experience from start to finish. The photos are incredible and I felt so comfortable.',
                            'rating' => 5
                        ]
                    ],

                    // Enabled Sections
                    'enabledSections' => [
                        'hero' => true,
                        'portfolio' => true,
                        'services' => true,
                        'pricing' => true,
                        'testimonials' => true,
                        'contact' => true
                    ],

                    // Flash Info
                    'flashInfo' => [
                        'enabled' => true,
                        'title' => 'Grand Opening Special',
                        'subtitle' => 'Get 30% off your first photo session this month!',
                        'buttonText' => 'Book Now',
                        'whatsappMessage' => 'Hi! I\'d like to book a session and take advantage of your 30% opening discount.',
                        'backgroundImage' => ''
                    ]
                ]
            ]
        );
    }
}
