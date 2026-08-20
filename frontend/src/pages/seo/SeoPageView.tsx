import { useLocation } from 'react-router-dom'
import { SEO_PAGES_MAP } from './seoData'
import SeoLayout from './SeoLayout'
import FeaturePage from './templates/FeaturePage'
import SolutionPage from './templates/SolutionPage'
import AudiencePage from './templates/AudiencePage'
import AudienceHubPage from './templates/AudienceHubPage'
import ToolPage from './templates/ToolPage'
import AlternativePage from './templates/AlternativePage'
import AlternativesHubPage from './templates/AlternativesHubPage'

export default function SeoPageView() {
    const { pathname } = useLocation()
    const cleanPath = pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    const page = SEO_PAGES_MAP[cleanPath] || SEO_PAGES_MAP[pathname]

    if (!page) {
        return (
            <SeoLayout>
                <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center px-4">
                    <h1 className="text-6xl font-extrabold text-green-400">404</h1>
                    <p className="text-gray-400">Page non trouvée ({pathname})</p>
                    <a href="/" className="bg-green-500 text-black font-bold px-6 py-3 rounded-xl">Retour à l'accueil</a>
                </div>
            </SeoLayout>
        )
    }

    const renderTemplate = () => {
        switch (page.template) {
            case 'tool':          return <ToolPage page={page} />
            case 'feature':       return <FeaturePage page={page} />
            case 'solution':      return <SolutionPage page={page} />
            case 'audience':      return <AudiencePage page={page} />
            case 'audience_hub':  return <AudienceHubPage page={page} />
            case 'alternative':   return <AlternativePage page={page} />
            case 'alternatives_hub': return <AlternativesHubPage page={page} />
            default:              return <FeaturePage page={page} />
        }
    }

    return <SeoLayout>{renderTemplate()}</SeoLayout>
}
