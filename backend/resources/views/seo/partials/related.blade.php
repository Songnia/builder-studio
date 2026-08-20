@if(!empty($links))
<section style="margin: 3rem 0;">
    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-main);">
        Découvrez aussi dans Vanda Studio
    </h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem;">
        @foreach($links as $link)
            <a href="{{ $link['url'] }}" class="glass-card" style="padding: 1.25rem; text-decoration: none; display: flex; flex-direction: column; gap: 0.5rem; transition: transform 0.2s;">
                <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent-green); font-weight: 700;">{{ $link['category'] }}</span>
                <span style="font-weight: 700; color: #fff; font-size: 1rem;">{{ $link['title'] }} →</span>
            </a>
        @endforeach
    </div>
</section>
@endif
