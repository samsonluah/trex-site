
import React, { useState, useEffect } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import { getNextRun, RunEvent } from '../services/RunDateData';
import { useToast } from '@/components/ui/use-toast';

const Community = () => {
  const [nextRun, setNextRun] = useState<RunEvent | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const telegramLink = "https://t.me/+aV4MUnPs1zxhYTE1";

  useEffect(() => {
    const fetchNextRun = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Community component: Fetching next run');
        const run = await getNextRun();
        console.log('Community component: Received run data', run);
        setNextRun(run);
      } catch (error) {
        console.error('Failed to fetch next run:', error);
        setError('Failed to load community run data');
        toast({
          title: "Error",
          description: "Failed to load community run data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNextRun();
  }, [toast]);

  const nextRunDate = loading 
    ? "Loading..." 
    : (nextRun ? nextRun.formattedDate : "To be Announced");
    
  const nextRunLocation = loading
    ? "Loading..."
    : (nextRun ? nextRun.location : "To be Announced");

  return (
    <section id="community" className="py-20 border-b-4 border-trex-white">
      <div className="brutalist-container">
        <h2 className="brutalist-subheader mb-12">COMMUNITY RUNS</h2>
        
        <div className="w-full">
          <div className="brutalist-bordered">
            <h3 className="text-2xl font-black mb-6">NEXT RUN</h3>
            
            {error ? (
              <div className="text-red-500 mb-4">{error}</div>
            ) : (
              <>
                <div className="flex items-center mb-4 text-xl">
                  <CalendarDays className="mr-4 text-trex-accent" size={24} />
                  <span>{nextRunDate}</span>
                </div>
                
                <div className="flex items-center mb-6 text-xl">
                  <MapPin className="mr-4 text-trex-accent" size={24} />
                  <span>{nextRunLocation}</span>
                </div>
              </>
            )}
            
            <p className="text-gray-400 mb-8">
              Join us for our monthly community run! All paces welcome. Merchandise ordered online can be collected at this event.
            </p>
            
            <a 
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-trex-accent text-trex-black font-bold py-2 px-6 uppercase hover:bg-trex-white transition-colors duration-200"
            >
              RSVP
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
