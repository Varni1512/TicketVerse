import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { eventService } from '../services/eventService';

export const AlbumDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('Gallery');
  const [rotatedImages, setRotatedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        if (!id) return;
        
        // Fetch event details for title
        const event = await eventService.getEventById(id);
        if (event) {
          setTitle(event.title);
        }

        // Fetch media
        const mediaRes = await api.get(`/events/${id}/media`);
        if (mediaRes.data && mediaRes.data.length > 0) {
          setRotatedImages(mediaRes.data.map((m: any) => m.mediaUrl));
        } else {
          // If no media, maybe just show the event image
          if (event && event.imageUrl) {
            setRotatedImages([event.imageUrl]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch album details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbumDetails();
  }, [id]);

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : rotatedImages.length === 0 ? (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            No images found for this album.
          </div>
        ) : (
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
        )}

      </div>
    </div>
  );
};
