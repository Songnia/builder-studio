@if(!empty($breadcrumbs))
<nav class="breadcrumbs-nav" aria-label="Fil d'Ariane">
    @foreach($breadcrumbs as $index => $crumb)
        @if(!$loop->first)
            <span style="margin: 0 0.5rem; opacity: 0.4;">/</span>
        @endif
        @if($loop->last)
            <span style="color: var(--text-main); font-weight: 600;">{{ $crumb['name'] }}</span>
        @else
            <a href="{{ $crumb['url'] }}">{{ $crumb['name'] }}</a>
        @endif
    @endforeach
</nav>
@endif
