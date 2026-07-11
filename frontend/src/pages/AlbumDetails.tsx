import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export const AlbumDetails = () => {
  const { id } = useParams<{ id: string }>();

  // Helper to format ID to title
  const title = id ? id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Gallery';

  // Generate some premium stock images based on the album (in a real app, this would be fetched from an API)
  const albumImages = [
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540039155732-676229ebca02?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c090be5bc65?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533174000228-db9e89d532be?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1200&auto=format&fit=crop'
  ];

  // We'll shuffle them slightly based on the ID length just to make different albums look slightly different
  const seed = id ? id.length : 0;
  const rotatedImages = [...albumImages.slice(seed % albumImages.length), ...albumImages.slice(0, seed % albumImages.length)];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-32">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-10"
        >
          <Link to="/album" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Albums
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-4 text-lg">
            Immersive high-resolution gallery.
          </p>
        </motion.div>

        {/* Masonry / Bento Style Grid for the inner album */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 md:gap-6">
          {rotatedImages.map((src, index) => {
            // Create a varied grid pattern
            const isLarge = index === 0 || index === 5;
            const isTall = index === 2 || index === 7;
            
            let spanClass = "md:col-span-1 md:row-span-1";
            if (isLarge) spanClass = "md:col-span-2 md:row-span-2";
            else if (isTall) spanClass = "md:col-span-1 md:row-span-2";

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.1, ease: 'easeOut' }}
                className={`${spanClass} rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-200 dark:bg-slate-900 group`}
              >
                <img 
                  src={src} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={`Gallery image ${index + 1}`} 
                />
              </motion.div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
