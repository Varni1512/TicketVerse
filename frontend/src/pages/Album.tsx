import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { eventService } from '../services/eventService';

export const Album = () => {
  const [albums, setAlbums] = useState<{id: string, src: string, title: string}[]>([]);
  const [featuredImage, setFeaturedImage] = useState({ src: '', alt: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventsAsAlbums = async () => {
      try {
        const events = await eventService.getEvents();
        if (events.length > 0) {
          const formattedAlbums = events
            .filter(e => e.imageUrl)
            .map(e => ({
              id: e.id.toString(),
              src: e.imageUrl,
              title: e.title
            }));
          setAlbums(formattedAlbums);
          
          if (formattedAlbums.length > 0) {
            setFeaturedImage({
              src: formattedAlbums[0].src,
              alt: formattedAlbums[0].title
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventsAsAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Featured Header Section */}
      <div className="relative pt-32 pb-24 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-12 max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Event Gallery
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              A curated collection of unforgettable moments from the world's most spectacular live events. Select an album to view more.
            </p>
          </motion.div>

          {loading ? (
            <div className="w-full h-64 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : featuredImage.src ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="w-full aspect-[21/9] md:aspect-[21/7] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <img 
                src={featuredImage.src} 
                alt={featuredImage.alt} 
                className="w-full h-full object-cover"
              />
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Structured Grid Section */}
      <div className="container mx-auto px-4 max-w-7xl py-24">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            No albums found.
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album, index) => (
            <motion.div 
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: 'easeOut' }}
            >
              <Link to={`/album/${album.id}`} className="group block cursor-pointer">
                <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 relative">
                  <img 
                    src={album.src} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={album.title} 
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300"></div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                    {album.title}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    View Album &rarr;
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
