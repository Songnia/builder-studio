# Plan du système d’onboarding par e-mail — VANDA STUDIO

## Décision produit

L’onboarding doit accélérer un résultat réel : publier un site ou partager une
première galerie. La facture vient ensuite comme adoption secondaire. Les e-mails
sont déclenchés par le comportement et sont supprimés dès que leur objectif est
atteint.

Expéditeur retenu :

```text
Assistant VANDA STUDIO <assistant@vanda-studio.org>
```

## MVP recommandé

Le premier lot contient seulement :

1. le mail de bienvenue immédiat ;
2. la relance « aucun site » après 24 heures ;
3. la relance « aucune galerie » après 48 heures ;
4. la confirmation après publication du site ;
5. la confirmation après création de la première galerie ;
6. la mesure de l’activation à sept jours.

Chaque relance est annulée si l’utilisateur a déjà terminé l’action correspondante.

## Architecture technique

Le backend Laravel devient la source de vérité. Les contrôleurs émettent des
événements après validation de leurs transactions. Un service de cycle de vie évalue
les conditions, inscrit un envoi unique dans un registre, puis place un job dans la
queue. Le scheduler Laravel exécute l’évaluation chaque heure.

```text
Action produit
→ événement persistant
→ évaluation des conditions
→ registre d’idempotence
→ job en queue
→ SMTP
→ événement envoyé/cliqué/objectif atteint
```

Le registre doit empêcher un second envoi lors d’un retry, d’un double webhook ou
d’une exécution concurrente du scheduler.

## Configuration de production

Créer réellement la boîte `assistant@vanda-studio.org` dans cPanel, puis utiliser ses
identifiants SMTP dans `backend/.env` :

```dotenv
MAIL_MAILER=smtp
MAIL_HOST=mail.vanda-studio.org
MAIL_PORT=465
MAIL_USERNAME=assistant@vanda-studio.org
MAIL_PASSWORD=MOT_DE_PASSE_DE_LA_BOITE
MAIL_SCHEME=smtps
MAIL_EHLO_DOMAIN=vanda-studio.org
MAIL_FROM_ADDRESS=assistant@vanda-studio.org
MAIL_FROM_NAME="Assistant VANDA STUDIO"
QUEUE_CONNECTION=database
```

Cette configuration utilise SMTP authentifié avec chiffrement implicite TLS sur le
port 465. Les paramètres IMAP 993 et POP3 995 servent uniquement à consulter la
boîte et ne sont pas utilisés par Laravel pour envoyer l'onboarding. Il faut activer
SPF, DKIM et DMARC avant le lancement, puis tester Gmail, Outlook et Yahoo.

Ne stockez jamais le mot de passe SMTP dans Git.

## Exploitation o2switch

Le scheduler doit tourner chaque minute :

```cron
* * * * * cd /home/COMPTE/PROJET/backend && php artisan schedule:run >> /dev/null 2>&1
```

La queue peut être drainée par un cron borné si aucun worker permanent n’est
disponible :

```cron
* * * * * cd /home/COMPTE/PROJET/backend && php artisan queue:work --stop-when-empty --tries=3 --timeout=90 >> /dev/null 2>&1
```

## Règles de contenu

- un e-mail correspond à un seul objectif ;
- une seule action principale ;
- ton humain, clair et court ;
- aucun PIN de galerie, mot de passe, token ou média privé ;
- fréquence maximale : un e-mail d’onboarding non transactionnel par 24 heures ;
- envoi entre 09:00 et 17:00, heure de Douala ;
- désinscription disponible pour les messages de découverte et de conversion.

## Validation avant lancement

1. Vérifier que `MAIL_MAILER` n’est plus `log` en production.
2. Envoyer un test à Gmail, Outlook et Yahoo.
3. Vérifier SPF, DKIM et DMARC.
4. Confirmer qu’un même événement ne produit jamais deux mails.
5. Confirmer qu’une action terminée annule sa relance.
6. Tester les retries de queue.
7. Lancer sur les comptes internes, puis 10 %, 50 % et 100 % des nouvelles
   inscriptions.

Les contrats détaillés se trouvent dans les fichiers JSON du même dossier.
