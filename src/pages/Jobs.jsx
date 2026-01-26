import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { API_URL } from '../config';
import JobCard from '../components/JobCard';
import ApplicationModal from '../components/ApplicationModal';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/jobs`)
            .then(res => res.json())
            .then(data => {
                setJobs(data.jobs || []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch jobs", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-6 pt-20">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
                >
                    Build the Future.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto"
                >
                    Join a team of obsessive builders shipping high-performance software.
                    <br />No bureaucracy. Just code.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-4"
                >
                    <a href="https://discord.gg/example" className="px-8 py-3 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold transition-all">
                        Join our Discord
                    </a>
                    <Link to="/employers" className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition-all">
                        Post a Job
                    </Link>
                </motion.div>
            </section>

            {/* Jobs Section */}
            <section id="jobs" className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h2 className="text-2xl font-bold">Open Positions</h2>
                    <span className="text-sm text-gray-500 font-mono">{jobs.length} ROLES AVAILABLE</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500 animate-pulse">Loading positions...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} onApply={setSelectedJob} />
                        ))}
                        {jobs.length === 0 && (
                            <div className="col-span-full text-center py-20 text-gray-500 border border-white/5 rounded-xl bg-white/5">
                                No open positions at the moment. check back later.
                            </div>
                        )}
                    </div>
                )}
            </section>

            {selectedJob && (
                <ApplicationModal
                    job={selectedJob}
                    isOpen={!!selectedJob}
                    onClose={() => setSelectedJob(null)}
                />
            )}
        </div>
    );
};

export default Jobs;
