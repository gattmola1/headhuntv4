import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lightbulb, Plus } from 'lucide-react';
import { API_URL } from '../config';
import IdeaCard from '../components/IdeaCard';
import ApplicationModal from '../components/ApplicationModal';
import ShareIdeaModal from '../components/ShareIdeaModal';

const Match = () => {
    const [ideas, setIdeas] = useState([]);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchIdeas = () => {
        setLoading(true);
        fetch(`${API_URL}/api/ideas`)
            .then(res => res.json())
            .then(data => {
                const sortedIdeas = (data.ideas || []).sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0));
                setIdeas(sortedIdeas);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch ideas", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchIdeas();
    }, []);

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-blue-400 to-white/40 bg-clip-text text-transparent"
                >
                    Match with Ideas.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                >
                    Find your next collaboration. Built for independent talent and incubators
                    looking to build the future outside the traditional career ladder.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4"
                >
                    <Link to="/network" className="w-[220px] py-3.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                        Join our Discord
                    </Link>
                    <button
                        onClick={() => setShowShareModal(true)}
                        className="w-[220px] py-3.5 rounded-xl bg-white text-black font-bold transition-all flex items-center justify-center gap-2 hover:bg-gray-100 shadow-lg shadow-white/5"
                    >
                        <Plus className="w-4 h-4" /> Share Idea
                    </button>
                </motion.div>
            </section>

            {/* Ideas Section */}
            <section id="ideas" className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold italic tracking-tight flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-400" />
                        Active Projects
                    </h2>
                    <span className="text-sm text-gray-500 font-mono italic">{ideas.length} MATCHES FOUND</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">Scanning the network for ideas...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ideas.map(idea => (
                            <IdeaCard key={idea.id} idea={idea} onApply={setSelectedIdea} />
                        ))}
                        {ideas.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500 border border-white/5 rounded-xl bg-white/5">
                                No active ideas at the moment. Share yours above!
                            </div>
                        )}
                    </div>
                )}
            </section>

            <ShareIdeaModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                onSuccess={(newIdea) => {
                    fetchIdeas();
                    if (newIdea && newIdea.id) {
                        setSelectedIdea(newIdea);
                    }
                }}
            />

            {selectedIdea && (
                <ApplicationModal
                    job={selectedIdea}
                    isOpen={!!selectedIdea}
                    onClose={() => setSelectedIdea(null)}
                    onSuccess={fetchIdeas}
                />
            )}
        </div>
    );
};

export default Match;
