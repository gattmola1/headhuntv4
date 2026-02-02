import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, User } from 'lucide-react';
import { API_URL } from '../config';

const Recruiters = () => {
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecruiters();
    }, []);

    const fetchRecruiters = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recruiters`);
            const data = await res.json();
            setRecruiters(data.recruiters || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-12">
            <header className="relative py-24 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 via-black to-blue-900/20 px-8">
                <div className="relative z-10 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-500">
                        RECRUITERS
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl leading-relaxed mb-8">
                        Find and manage high-performance software engineering talent with our premium recruitment tools.
                    </p>

                    {/* Recruiter Selector Dropdown (Simulated as list for now or actual Select) */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-md backdrop-blur-sm">
                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 block">Select a Recruiter</label>
                        {loading ? (
                            <div className="text-white/50">Loading recruiters...</div>
                        ) : recruiters.length === 0 ? (
                            <div className="text-white/50">No active recruiters found.</div>
                        ) : (
                            <div className="space-y-2">
                                {recruiters.map(r => (
                                    <Link
                                        key={r.id}
                                        to={`/recruiters/${r.slug}`}
                                        className="block p-4 rounded-xl bg-black/50 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center overflow-hidden">
                                                {r.headshot_url ? (
                                                    <img src={r.headshot_url} alt={r.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-5 h-5 text-blue-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{r.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{r.bio ? r.bio.substring(0, 40) + '...' : 'Available for consultation'}</div>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informational Cards about the service */}
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold mb-3">Premium Network</h3>
                    <p className="text-gray-400">Access a curated network of elite recruiters specialized in placing top 1% engineering talent.</p>
                </div>
                <div className="p-8 rounded-3xl border border-white/10 bg-white/5">
                    <h3 className="text-xl font-bold mb-3">Direct Scheduling</h3>
                    <p className="text-gray-400">View real-time availability and book consultation windows directly with our team.</p>
                </div>
            </section>
        </div>
    );
};

export default Recruiters;
