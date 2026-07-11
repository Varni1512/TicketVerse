import { useEffect, useState } from 'react';
import { eventService } from '../../services/eventService';
import { Event } from '../../types';
import { HeroSection } from './HeroSection';
import { CategoriesSection } from './CategoriesSection';
import { TrendingSection } from './TrendingSection';
import { FeaturesSection } from './FeaturesSection';
import { CTASection } from './CTASection';

export const Landing = () => {
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await eventService.getEvents();
        // Just take the first 4 for trending
        setTrendingEvents(events.slice(0, 4));
      } catch (error) {
        console.error('Error fetching trending events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <HeroSection />
      <CategoriesSection />
      <TrendingSection events={trendingEvents} loading={loading} />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};
