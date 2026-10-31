import { useEffect, useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import { useCommunityStats } from '../../hooks/useCommunityStats';
import { regionService } from '../../services/regionService';
import { useTheme } from '../../context/ThemeContext';
import {
  CommunityHero,
  CommunityStatsStrip,
  CommunityFilters,
  CommunityFeed,
} from '../../components/community/public';
import type { Governorate, City, CommunityPostType } from '../../types';

const CommunityPage = () => {
  const { isDark } = useTheme();
  const { stats } = useCommunityStats();

  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [activeType, setActiveType] = useState<CommunityPostType | undefined>(
    undefined
  );
  const [searchInput, setSearchInput] = useState('');
  const [governorateId, setGovernorateId] = useState<number | undefined>();
  const [cityId, setCityId] = useState<number | undefined>();

  useEffect(() => {
    regionService
      .getGovernorates()
      .then(setGovernorates)
      .catch(() => {
        /* silent */
      });
  }, []);

  useEffect(() => {
    if (!governorateId) {
      setCities([]);
      return;
    }

    let mounted = true;
    regionService
      .getCities(governorateId)
      .then((data) => {
        if (mounted) setCities(data);
      })
      .catch(() => {
        if (mounted) setCities([]);
      });

    return () => {
      mounted = false;
    };
  }, [governorateId]);

  // Sync filters → URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (activeType) params.set('type', activeType);
    if (searchInput.trim()) params.set('search', searchInput.trim());
    if (governorateId) params.set('governorate_id', String(governorateId));
    if (cityId) params.set('city_id', String(cityId));

    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;

    const currentSearch = window.location.search.replace(/^\?/, '');
    if (currentSearch !== qs) {
      window.history.replaceState(null, '', newUrl);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [activeType, searchInput, governorateId, cityId]);

  const handleTypeChange = (type: CommunityPostType | undefined) => {
    setActiveType(type);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleGovernorateChange = (id: number | undefined) => {
    setGovernorateId(id);
    setCityId(undefined);
  };

  const handleCityChange = (id: number | undefined) => {
    setCityId(id);
  };

  const handleClearAll = () => {
    setActiveType(undefined);
    setSearchInput('');
    setGovernorateId(undefined);
    setCityId(undefined);
  };

  const hasActiveFilters: boolean = useMemo(
    () =>
      Boolean(activeType || searchInput.trim() || governorateId || cityId),
    [activeType, searchInput, governorateId, cityId]
  );

  const filtersComponent = (
    <CommunityFilters
      activeType={activeType}
      onTypeChange={handleTypeChange}
      search={searchInput}
      onSearchChange={handleSearchChange}
      governorateId={governorateId}
      cityId={cityId}
      onGovernorateChange={handleGovernorateChange}
      onCityChange={handleCityChange}
      governorates={governorates}
      cities={cities}
      hasActiveFilters={hasActiveFilters}
      onClearAll={handleClearAll}
    />
  );

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-body)',
        minHeight: '100vh',
        transition: 'background-color 0.3s ease',
      }}
      data-theme={isDark ? 'dark' : 'light'}
    >
      <SEO
        title="منشورات المجتمع"
        description="تحذيرات، منشورات مفقود/موجود، وإعلانات عامة تخدم مجتمعك — منصة بصمة."
        keywords="منشورات, مجتمع, تحذير, مفقود, موجود, غزة, بصمة"
      />

      <CommunityHero />

      <CommunityStatsStrip />

      <CommunityFeed
        filtersComponent={filtersComponent}
        hasFilters={hasActiveFilters}
        onClearFilters={handleClearAll}
      />

      <span style={{ display: 'none' }} data-stats={JSON.stringify(stats)} />
    </div>
  );
};

export default CommunityPage;