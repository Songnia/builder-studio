<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OnboardingMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public readonly array $messageData) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->messageData['subject']);
    }

    public function content(): Content
    {
        return new Content(view: 'mail.onboarding.message', with: ['messageData' => $this->messageData]);
    }
}
