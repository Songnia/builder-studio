import React from 'react';
import { Box, Chip, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useSiteConfig } from '@/context/SiteConfigContext';

const FilterChips: React.FC<FilterChipsProps> = ({ selectedCategory, onSelectCategory }) => {
    const { t } = useTranslation();
    const { config } = useSiteConfig();

    const categories = React.useMemo(() => {
        const list = [{ key: 'All Work', label: t('portfolio.categories.all') }];
        
        const configCats = config?.portfolioCategories || [
            "Mariages",
            "Portraits",
            "Grossesse",
            "Bébés & Enfants",
            "Corporate",
            "Événements",
            "Mode",
            "Produit",
            "Nature",
            "Architecture"
        ];
        
        configCats.forEach(cat => {
            let label = cat;
            if (cat === 'Mariages') label = t('portfolio.categories.weddings');
            else if (cat === 'Grossesse') label = t('portfolio.categories.maternity');
            else if (cat === 'Bébés & Enfants') label = t('portfolio.categories.babies');
            else if (cat === 'Corporate') label = t('portfolio.categories.corporate');
            else if (cat === 'Événements' || cat === 'Events') label = t('portfolio.categories.events');
            else if (cat === 'Studio') label = t('portfolio.categories.studio');
            else if (cat === 'Portraits') label = t('portfolio.categories.portraits', { defaultValue: 'Portraits' });
            
            list.push({ key: cat, label });
        });
        
        return list;
    }, [config, t]);

    return (
        <Box
            sx={{
                overflowX: 'auto',
                pb: 2,
                display: 'flex',
                gap: { xs: 1, sm: 1.5 },
                px: 0,
                '&::-webkit-scrollbar': {
                    height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    borderRadius: '3px',
                },
            }}
        >
            {categories.map((cat) => (
                <StyledChip
                    key={cat.key}
                    label={cat.label}
                    variant={selectedCategory === cat.key ? 'filled' : 'outlined'}
                    icon={selectedCategory === cat.key ? <CheckIcon style={{ color: 'white' }} /> : undefined}
                    onClick={() => onSelectCategory(cat.key)}
                    clickable
                    sx={{ minWidth: 'fit-content' }}
                />
            ))}
        </Box>
    );
};

interface FilterChipsProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const StyledChip = styled(Chip)(({ theme }) => ({
    borderRadius: '8px',
    height: '36px',
    fontWeight: 500,
    '&.MuiChip-filled': {
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.common.white,
        '&:hover': {
            backgroundColor: theme.palette.text.primary,
        },
    },
    '&.MuiChip-outlined': {
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.text.primary,
        },
    },
}));

export default FilterChips;
