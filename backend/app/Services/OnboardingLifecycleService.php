<?php

namespace App\Services;

use App\Jobs\SendOnboardingEmail;
use App\Models\OnboardingEmailDelivery;
use App\Models\OnboardingEvent;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\URL;

class OnboardingLifecycleService
{
    public function record(User $user, string $eventName, ?Model $subject = null, array $properties = []): OnboardingEvent
    {
        return OnboardingEvent::create([
            'user_id' => $user->id,
            'event_name' => $eventName,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'properties' => $properties ?: null,
            'occurred_at' => now(),
        ]);
    }

    public function recordOnce(User $user, string $eventName, ?Model $subject = null, array $properties = []): OnboardingEvent
    {
        return OnboardingEvent::query()->createOrFirst([
            'user_id' => $user->id,
            'event_name' => $eventName,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
        ], [
            'properties' => $properties ?: null,
            'occurred_at' => now(),
        ]);
    }

    public function recordAndTrigger(User $user, string $eventName, ?Model $subject = null, array $properties = []): void
    {
        $this->record($user, $eventName, $subject, $properties);

        $template = match ($eventName) {
            'account_created' => 'welcome-first-value',
            'site_published' => 'site-published-confirmation',
            'first_gallery_created' => 'gallery-created-confirmation',
            'subscription_activated' => 'subscription-confirmation',
            default => null,
        };

        if ($template) {
            $this->schedule($user, $template, $subject ? $subject->getMorphClass().':'.$subject->getKey() : 'global');
        }
    }

    public function evaluateDueUsers(): int
    {
        if (! config('onboarding.emails_enabled')) {
            return 0;
        }

        $scheduled = 0;
        User::query()->where('is_active', true)
            ->where(fn ($query) => $query->whereNull('role')->orWhere('role', '!=', 'superadmin'))
            ->chunkById(100, function ($users) use (&$scheduled) {
            foreach ($users as $user) {
                $ageHours = $user->created_at?->diffInHours(now()) ?? 0;

                if ($ageHours >= 24 && ! $user->siteConfigs()->exists()) {
                    $scheduled += (int) $this->schedule($user, 'site-setup-rescue');
                }
                if ($ageHours >= 48 && ! $user->galleries()->exists()) {
                    $scheduled += (int) $this->schedule($user, 'gallery-rescue');
                }
                if ($ageHours >= 72 && ! $user->invoices()->exists()
                    && ($user->siteConfigs()->where('is_published', true)->exists() || $user->galleries()->exists())) {
                    $scheduled += (int) $this->schedule($user, 'invoice-discovery');
                }

                $trialEnd = $user->created_at?->copy()->addDays((int) config('subscriptions.trial_days', 30));
                if (! $this->hasActivePaidSubscription($user) && $trialEnd) {
                    $daysLeft = now()->diffInDays($trialEnd, false);
                    if ($daysLeft <= 7 && $daysLeft > 2) {
                        $scheduled += (int) $this->schedule($user, 'trial-seven-days-left');
                    } elseif ($daysLeft <= 2 && $daysLeft >= 0) {
                        $scheduled += (int) $this->schedule($user, 'trial-two-days-left');
                    }
                }
            }
            });

        return $scheduled;
    }

    public function schedule(User $user, string $templateKey, string $subjectKey = 'global'): bool
    {
        if (! config('onboarding.emails_enabled') || ! $this->inRollout($user)) {
            return false;
        }

        $delivery = null;
        $created = false;
        DB::transaction(function () use ($user, $templateKey, $subjectKey, &$delivery, &$created) {
            $delivery = OnboardingEmailDelivery::firstOrCreate([
                'user_id' => $user->id,
                'template_key' => $templateKey,
                'lifecycle_version' => (int) config('onboarding.lifecycle_version', 1),
                'subject_key' => $subjectKey,
            ], [
                'status' => 'pending',
                'scheduled_for' => now(),
            ]);
            $created = $delivery->wasRecentlyCreated;
        });

        if ($created) {
            SendOnboardingEmail::dispatch($delivery->id)->afterCommit();
        }

        return $created;
    }

    public function isEligible(OnboardingEmailDelivery $delivery): bool
    {
        $user = $delivery->user;
        if (! config('onboarding.emails_enabled') || ! $user || ! $user->isActive() || $user->isSuperAdmin() || ! filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $transactional = in_array($delivery->template_key, ['welcome-first-value', 'site-published-confirmation', 'gallery-created-confirmation', 'subscription-confirmation'], true);
        if (! $transactional && DB::table('onboarding_email_preferences')->where('user_id', $user->id)->whereNotNull('unsubscribed_at')->exists()) {
            return false;
        }
        if (! $transactional && OnboardingEmailDelivery::query()->where('user_id', $user->id)->where('status', 'sent')
            ->where('sent_at', '>', now()->subHours((int) config('onboarding.frequency_cap_hours', 24)))->exists()) {
            return false;
        }

        return match ($delivery->template_key) {
            'site-setup-rescue' => ! $user->siteConfigs()->exists(),
            'gallery-rescue' => ! $user->galleries()->exists(),
            'invoice-discovery' => ! $user->invoices()->exists(),
            'trial-seven-days-left', 'trial-two-days-left' => ! $this->hasActivePaidSubscription($user),
            'site-published-confirmation' => $user->siteConfigs()->where('is_published', true)->exists(),
            'gallery-created-confirmation' => $user->galleries()->exists(),
            'subscription-confirmation' => $this->hasActivePaidSubscription($user),
            default => true,
        };
    }

    public function messageFor(OnboardingEmailDelivery $delivery): array
    {
        $base = config('onboarding.frontend_url');
        $copy = match ($delivery->template_key) {
            'welcome-first-value' => ['Bienvenue sur VANDA STUDIO', 'Commencez par créer votre studio en ligne ou préparer votre première galerie client.', 'Configurer mon studio', '/admin/site-builder'],
            'site-setup-rescue' => ['Votre studio peut être prêt aujourd’hui', 'Ajoutez votre identité, vos services et quelques photos pour publier votre présence professionnelle.', 'Créer mon site', '/admin/site-builder'],
            'site-published-confirmation' => ['Votre site est en ligne', 'Votre présence publique est disponible. Consultez-la et partagez-la avec vos futurs clients.', 'Voir mon tableau de bord', '/admin/dashboard'],
            'gallery-rescue' => ['Livrez votre première galerie privée', 'Créez une galerie protégée, ajoutez vos photos puis partagez le lien et le mot de passe avec votre client.', 'Créer une galerie', '/admin/new-delivery'],
            'gallery-created-confirmation' => ['Votre galerie est prête à être partagée', 'Ouvrez votre tableau de bord pour copier le lien, afficher le mot de passe et envoyer le message WhatsApp.', 'Partager la galerie', '/admin/dashboard'],
            'invoice-discovery' => ['Créez votre première facture', 'Transformez votre prochaine prestation en document professionnel, clair et prêt à transmettre.', 'Créer une facture', '/admin/invoices/new'],
            'trial-seven-days-left' => ['Il reste 7 jours à votre essai', 'Choisissez un forfait avant la fin de l’essai pour maintenir vos sites et galeries accessibles.', 'Choisir mon forfait', '/admin/subscription'],
            'trial-two-days-left' => ['Votre essai se termine bientôt', 'Il reste deux jours pour activer un forfait et éviter l’interruption de vos contenus publics.', 'Maintenir mon accès', '/admin/subscription'],
            'subscription-confirmation' => ['Votre abonnement est actif', 'Votre paiement a été confirmé et les fonctionnalités de votre forfait sont maintenant disponibles.', 'Accéder à mon studio', '/admin/dashboard'],
            default => ['Votre prochaine étape sur VANDA STUDIO', 'Reprenez votre travail là où vous l’avez laissé.', 'Continuer', '/admin/dashboard'],
        };

        $transactional = in_array($delivery->template_key, ['welcome-first-value', 'site-published-confirmation', 'gallery-created-confirmation', 'subscription-confirmation'], true);

        return [
            'subject' => $copy[0], 'heading' => $copy[0], 'body' => $copy[1],
            'cta_label' => $copy[2], 'cta_url' => $base.$copy[3], 'name' => $delivery->user->name,
            'unsubscribe_url' => $transactional ? null : URL::temporarySignedRoute(
                'onboarding.unsubscribe', now()->addDays(90), ['user' => $delivery->user_id]
            ),
        ];
    }

    private function hasActivePaidSubscription(User $user): bool
    {
        return $user->subscriptions()->currentlyActive()->exists();
    }

    private function inRollout(User $user): bool
    {
        $percentage = (int) config('onboarding.rollout_percentage', 100);
        return $percentage >= 100 || ($percentage > 0 && abs(crc32((string) $user->id)) % 100 < $percentage);
    }
}
