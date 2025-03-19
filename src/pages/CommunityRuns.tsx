
import React, { useState, useEffect } from 'react';
import { fetchAllRuns, RunEvent } from '../services/RunDateData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CalendarDays, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CommunityRuns = () => {
  const [runs, setRuns] = useState<RunEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const telegramLink = "https://t.me/+aV4MUnPs1zxhYTE1";

  useEffect(() => {
    const loadRuns = async () => {
      try {
        setLoading(true);
        setError(null);
        const allRuns = await fetchAllRuns();
        setRuns(allRuns);
      } catch (err) {
        console.error('Failed to fetch community runs:', err);
        setError('Failed to load community runs data');
        toast({
          title: "Error",
          description: "Failed to load community runs data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadRuns();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-20">
          <div className="brutalist-container">
            <h1 className="brutalist-header mb-12">COMMUNITY RUNS</h1>
            
            {loading ? (
              <div className="text-center py-12">Loading community runs...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-12">{error}</div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {runs.map(run => (
                  <div key={run.id} className="brutalist-bordered p-6">
                    <div className="flex items-center mb-4 text-xl">
                      <CalendarDays className="mr-4 text-trex-accent" size={24} />
                      <span>{run.formattedDate}</span>
                    </div>
                    
                    <div className="flex items-center mb-6 text-xl">
                      <MapPin className="mr-4 text-trex-accent" size={24} />
                      <span>{run.location}</span>
                    </div>
                    
                    <div className="mt-4">
                      <a 
                        href={telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-trex-accent text-trex-black font-bold py-2 px-4 uppercase hover:bg-trex-white transition-colors duration-200"
                      >
                        RSVP
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && runs.length === 0 && (
              <div className="text-center py-12">
                <p>No community runs scheduled at this time.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityRuns;
