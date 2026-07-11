import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Album = () => {
  const featuredImage = {
    src: 'https://images.unsplash.com/photo-1540039155732-676229ebca02?q=80&w=2000&auto=format&fit=crop',
    alt: 'Massive Festival Crowd'
  };

  const albums = [
    { id: 'live-concert', src: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop', title: 'Live Concert' },
    { id: 'stadium', src: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop', title: 'Stadium' },
    { id: 'conference', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop', title: 'Conference' },
    { id: 'performance', src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop', title: 'Performance' },
    { id: 'standup-comedy', src: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1200&auto=format&fit=crop', title: 'Standup Comedy' },
    { id: 'event-crowd', src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop', title: 'Event Crowd' },
    { id: 'theater', src: 'https://images.unsplash.com/photo-1470229722913-7c090be5bc65?q=80&w=1200&auto=format&fit=crop', title: 'Theater' },
    { id: 'sports', src: 'https://images.unsplash.com/photo-1554068865-24cecd4e34d8?q=80&w=1200&auto=format&fit=crop', title: 'Sports' },
  ];

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
        </div>
      </div>

      {/* Structured Grid Section */}
      <div className="container mx-auto px-4 max-w-7xl py-24">
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
      </div>
    </div>
  );
};
