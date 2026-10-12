import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Compass, Sparkles } from 'lucide-react';
import { eventApi } from '../../services/eventApi';
import { EventCard } from '../../components/events/EventCard';
import { EventSearch } from '../../components/events/EventSearch';
import { EventFilter } from '../../components/events/EventFilter';
import { Loading } from '../../components/common/Loading';
import { EmptyState } from '../../components/common/EmptyState';

export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const initialCat = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await eventApi.getPublicEvents();
        setAllEvents(data);
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  // Update query params when category changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category });
    }
  };

  // Sync state if URL query param changes
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    setSelectedCategory(cat);
  }, [searchParams]);

  // Compute category count breakdown
  const eventCountsByCategory = useMemo(() => {
    const counts = {};
    allEvents.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });
    return counts;
  }, [allEvents]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        event.name.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q) ||
        (event.organizer && event.organizer.toLowerCase().includes(q))
      );

      // Category
      const matchesCat = selectedCategory === 'All' || event.category === selectedCategory;

      // Date Filter
      const today = new Date().toISOString().split('T')[0];
      let matchesDate = true;
      if (selectedDateFilter === 'today') {
        matchesDate = event.date === today;
      } else if (selectedDateFilter === 'upcoming') {
        matchesDate = event.date >= today;
      } else if (selectedDateFilter === 'this-month') {
        const thisMonth = today.slice(0, 7);
        matchesDate = event.date.startsWith(thisMonth);
      }

      // Status Filter: Only show Upcoming and Live events to public users
      const matchesStatus = event.status === 'Upcoming' || event.status === 'Live';

      return matchesSearch && matchesCat && matchesDate && matchesStatus;
    });
  }, [allEvents, searchQuery, selectedCategory, selectedDateFilter]);

  return (
    <div className="main-content container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--primary-50)',
          color: 'var(--primary-700)',
          border: '1px solid #bfdbfe',
          padding: '0.25rem 0.75rem',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.78rem',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <Compass size={13} style={{ color: '#2563eb' }} />
          <span>College Event Directory</span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Discover & RSVP for Events
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
          All events are free to register for registered college students. Select an event to view details and secure your digital entry pass.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Search Bar */}
        <EventSearch
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Categories & Date Filter */}
        <EventFilter
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategoryChange}
          selectedDateFilter={selectedDateFilter}
          onSelectDateFilter={setSelectedDateFilter}
          eventCountsByCategory={eventCountsByCategory}
        />
      </div>

      {/* Events Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
        </span>
        {(selectedCategory !== 'All' || searchQuery || selectedDateFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
              setSelectedDateFilter('all');
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <Loading text="Fetching live event schedules..." fullHeight />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No Events Found"
          description="No college events matched your filter criteria. Try searching for a different keyword or selecting 'All Categories'."
          actionLabel="Clear All Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearchQuery('');
            setSelectedDateFilter('all');
            searchParams.delete('category');
            setSearchParams(searchParams);
          }}
        />
      ) : (
        <div className="grid grid-cols-3" style={{ gap: '1.75rem' }}>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

    </div>
  );
};
