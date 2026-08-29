<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{{ $messageData['subject'] }}</title></head>
<body style="margin:0;background:#f4f6f8;color:#172033;font-family:Arial,sans-serif">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="padding:24px 32px;background:#12372a;color:#ffffff;font-size:20px;font-weight:700">VANDA STUDIO</td></tr>
<tr><td style="padding:32px">
<p style="margin:0 0 18px;font-size:17px">Bonjour {{ $messageData['name'] }},</p>
<h1 style="margin:0 0 16px;font-size:26px;line-height:1.25">{{ $messageData['heading'] }}</h1>
<p style="margin:0 0 26px;color:#52606d;font-size:16px;line-height:1.65">{{ $messageData['body'] }}</p>
<p style="margin:0 0 28px"><a href="{{ $messageData['cta_url'] }}" style="display:inline-block;background:#16a34a;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:10px">{{ $messageData['cta_label'] }}</a></p>
<p style="margin:0;color:#7b8794;font-size:13px;line-height:1.5">Cet e-mail vous aide à démarrer avec VANDA STUDIO. Aucun mot de passe ni code de galerie ne sera envoyé dans cette séquence.</p>
@if($messageData['unsubscribe_url'])
<p style="margin:16px 0 0;font-size:12px"><a href="{{ $messageData['unsubscribe_url'] }}" style="color:#7b8794">Ne plus recevoir les conseils d’onboarding</a></p>
@endif
</td></tr>
</table>
</td></tr></table>
</body></html>
