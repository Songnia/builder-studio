<section class="hero">
    <div class="container">
        <h1>{{ $data['h1'] ?? $metadata->title }}</h1>
        <p>{{ $data['subtitle'] ?? $metadata->description }}</p>
    </div>
</section>

<section style="padding: 2rem 0;">
    <div class="container">
        <div class="glass-card" style="max-width: 800px; margin: 0 auto; padding: 2.5rem;">
            <h2 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem;" class="gradient-text">Simulateur en Ligne Gratuit</h2>
            
            <div style="display: grid; gap: 1.5rem; margin-bottom: 2rem;">
                <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">Intitulé de la Prestation / Projet</label>
                    <input type="text" id="tool-title" placeholder="Ex: Shooting Portrait / Charte Graphique" style="width: 100%; padding: 0.875rem; background: rgba(0,0,0,0.3); border: 1px solid var(--surface-border); border-radius: 0.5rem; color: #fff; font-size: 1rem;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">Montant HT / Base (FCFA)</label>
                        <input type="number" id="tool-amount" value="150000" oninput="calculateTool()" style="width: 100%; padding: 0.875rem; background: rgba(0,0,0,0.3); border: 1px solid var(--surface-border); border-radius: 0.5rem; color: #fff; font-size: 1rem;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-muted);">Acompte (%)</label>
                        <input type="number" id="tool-deposit-pct" value="30" oninput="calculateTool()" style="width: 100%; padding: 0.875rem; background: rgba(0,0,0,0.3); border: 1px solid var(--surface-border); border-radius: 0.5rem; color: #fff; font-size: 1rem;">
                    </div>
                </div>
            </div>

            <!-- Result Box -->
            <div style="background: rgba(76, 175, 80, 0.1); border: 1px solid rgba(76, 175, 80, 0.3); padding: 1.5rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-size: 0.875rem; color: var(--text-muted);">Montant Acompte à percevoir</div>
                    <div id="res-deposit" style="font-size: 1.75rem; font-weight: 800; color: var(--accent-green);">45,000 FCFA</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.875rem; color: var(--text-muted);">Solde à la livraison</div>
                    <div id="res-balance" style="font-size: 1.75rem; font-weight: 800; color: #fff;">105,000 FCFA</div>
                </div>
            </div>

            <div style="margin-top: 2rem; text-align: center;">
                <a href="{{ $data['cta_link'] ?? 'https://app.vanda-studio.org/auth/register' }}" class="btn-primary" style="width: 100%;">
                    {{ $data['cta_text'] ?? 'Générer ma facture professionnelle' }}
                </a>
            </div>
        </div>
    </div>
</section>

<script>
    function calculateTool() {
        const amount = parseFloat(document.getElementById('tool-amount').value) || 0;
        const pct = parseFloat(document.getElementById('tool-deposit-pct').value) || 0;
        
        const deposit = Math.round(amount * (pct / 100));
        const balance = amount - deposit;

        document.getElementById('res-deposit').innerText = deposit.toLocaleString() + ' FCFA';
        document.getElementById('res-balance').innerText = balance.toLocaleString() + ' FCFA';
    }
</script>
