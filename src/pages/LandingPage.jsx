import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Briefcase, Lightbulb, Users, Clock, MapPin, DollarSign, Zap, FileText, Download, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import ProspectModal from '../components/ProspectModal';

const ScrollingBanner = ({ items, type }) => {
    // Need at least a few items for a good scroll, duplicate if needed
    const displayItems = items.length > 0 ? [...items, ...items, ...items] : [];

    return (
        <div className="w-full py-10 overflow-hidden relative group">
            <div className="flex gap-6 px-6 w-max animate-scroll group-hover:[animation-play-state:paused]">
                {displayItems.map((item, idx) => (
                    <div key={idx} className="flex-shrink-0 w-[350px] p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all flex flex-col justify-between h-40">
                        {type === 'job' ? (
                            <>
                                <div>
                                    <h3 className="font-bold text-lg truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-gray-500 font-mono tracking-widest">{item.company}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                        <MapPin className="w-3 h-3" /> {item.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono">
                                        <DollarSign className="w-3 h-3" /> ${item.salary?.toLocaleString()}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <h3 className="font-bold text-lg truncate mb-1">{item.title}</h3>
                                    <p className="text-xs text-blue-400 font-mono tracking-widest uppercase">{item.department}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                    <div className="flex items-center gap-2 text-[10px] text-orange-400 font-mono">
                                        <Users className="w-3 h-3" /> {item.participants_count || 0}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-blue-400 font-mono">
                                        <Clock className="w-3 h-3" /> {item.total_hours || 0} HRS
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const LandingPage = () => {
    const [jobs, setJobs] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);

    useEffect(() => {
        // Fetch Jobs
        fetch(`${API_URL}/api/jobs`)
            .then(res => res.json())
            .then(data => setJobs(data.jobs || []));

        // Fetch Ideas
        fetch(`${API_URL}/api/ideas`)
            .then(res => res.json())
            .then(data => setIdeas(data.ideas || []));
    }, []);

    return (
        <div className="space-y-32 pb-32">
            {/* 1. Discord Hero */}
            <section className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6 px-6 pt-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-20 h-20 bg-[#5865F2]/20 text-[#5865F2] rounded-3xl flex items-center justify-center mb-4"
                >
                    <MessageSquare size={40} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-9xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
                >
                    Join the Elite.
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
                >
                    A community of obsessive builders, founders, and high-performance talent
                    shipping the next generation of software.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        to="/network"
                        className="px-12 py-4 rounded-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all text-lg shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center gap-3"
                    >
                        Join our Discord <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </section>

            {/* 2. Job Scrolling Banner */}
            <section className="space-y-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Live Postings</h2>
                </div>
                <ScrollingBanner items={jobs} type="job" />
            </section>

            {/* 3. Employer CTA */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-y border-white/5">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Looking for your next star?</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Access a curated network of talent that actually ships.
                            We move faster than traditional agencies and focus on technical excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/employers" className="px-8 py-3 bg-white text-black font-bold rounded-xl text-center hover:bg-gray-200 transition-colors">
                                For Employers
                            </Link>
                            <Link to="/about" className="px-8 py-3 border border-white/10 text-white font-bold rounded-xl text-center hover:bg-white/5 transition-colors">
                                Our Philosophy
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
                            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Fast Execution</p>
                        </div>
                        <div className="aspect-square bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center p-8 text-center mt-8">
                            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase">Verified Talent</p>
                        </div>
                    </div>
                </div>
            </section>


            {/* 4. The Non-JOB Hero */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 px-6 bg-gradient-to-b from-transparent via-blue-500/[0.03] to-transparent">
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 30 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Lightbulb size={40} />
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                        NOT EVERYONE IS READY FOR A <br />
                        <span className="text-blue-500">SALARY</span> AND A <span className="underline decoration-blue-500 underline-offset-8 decoration-4 italic">J-O-B</span>.
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed pt-4">
                        We build for the side-hustlers, the business hobbyists, and the dreamers who want to build the future outside the traditional 9-to-5 grind.
                    </p>
                    <Link to="/match" className="inline-flex items-center gap-3 text-blue-400 font-bold text-lg group hover:text-white transition-all pt-8">
                        Explore the Incubator <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </motion.div>
            </section>

            {/* 5. Idea Scrolling Banner */}
            <section className="space-y-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-orange-400" />
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase">Incubator Pitches</h2>
                </div>
                <ScrollingBanner items={ideas} type="idea" />
            </section>
            {/* 5.5. Reused Network Hero */}
            <section className="text-center space-y-8 py-20 bg-gradient-to-b from-transparent via-blue-500/[0.02] to-transparent">
                <motion.div
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    viewport={{ once: true }}
                    className="w-24 h-24 bg-[#5865F2]/20 text-[#5865F2] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#5865F2]/10"
                >
                    <MessageSquare size={48} />
                </motion.div>
                <div className="space-y-4">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-8xl font-black tracking-tighter uppercase"
                    >
                        JOIN OUR <span className="text-[#5865F2]">NETWORK</span>
                    </motion.h2>
                    <motion.p
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 20 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-light leading-relaxed"
                    >
                        Network with 2,000+ builders, collaborate on new ideas and projects, and get direct access to resume help, interview prep, and real-time industry intelligence. Stop talking and start building—find your next role today.
                    </motion.p>
                </div>
                <motion.div
                    whileInView={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
                >
                    <a
                        href="https://discord.gg/NwQH763Gp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-12 py-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-black transition-all text-xl shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                    >
                        Join our Discord
                    </a>
                </motion.div>
            </section>

            {/* 6. Monetize Your Network Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                            Partnership Model
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                            MONETIZE YOUR <br />
                            <span className="text-blue-500">NETWORK.</span>
                        </h2>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-md">
                            You get paid residuals and kickbacks automatically whenever profit is derived from your network connections.
                        </p>

                        <div className="space-y-6 pt-4">
                            {[
                                {
                                    title: "High-Performance Talent",
                                    desc: "Share elite builders and technical leaders who are ready for high-stakes placement.",
                                    icon: <Users size={18} />
                                },
                                {
                                    title: "Strategic Access",
                                    desc: "Share hiring decision-makers with the authority to sign contracts and build teams.",
                                    icon: <Zap size={18} />
                                },
                                {
                                    title: "Network Nodes",
                                    desc: "Share contacts who would be willing to volunteer their own professional graph for automated upside.",
                                    icon: <FileText size={18} />
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 group">
                                    <div className="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        {item.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-white leading-none">{item.title}</h4>
                                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 bg-black/40 border border-white/5 p-8 rounded-[2rem] backdrop-blur-xl relative z-10">
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold italic tracking-tight">Partner Actions</h3>
                            <div>
                                <button
                                    onClick={() => setIsProspectModalOpen(true)}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20 uppercase tracking-widest"
                                >
                                    <Users size={18} />
                                    Suggest a Contact
                                </button>
                            </div>
                            <div className="pt-2">
                                <a
                                    href="/network_partner_revenue_share_agreement.pdf"
                                    download
                                    className="w-full py-4 bg-white text-black rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest"
                                >
                                    <Download size={18} />
                                    DOWNLOAD REVENUE SHARE AGREEMENT
                                </a>
                                <p className="text-[10px] text-center text-gray-600 mt-4 leading-relaxed uppercase tracking-widest font-mono">
                                    Revenue Share Agreement
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.5. Recruiters CTA */}
            <section className="max-w-7xl mx-auto px-6 py-20 border-y border-white/5">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-2 gap-4 order-2 md:order-1">
                        <div className="aspect-square bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center p-8 text-center mt-8">
                            <p className="text-xs font-mono text-blue-400 tracking-widest uppercase">Win-Win Ethics</p>
                        </div>
                        <div className="aspect-square bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
                            <p className="text-xs font-mono text-gray-500 tracking-widest uppercase">Premium Access</p>
                        </div>
                    </div>
                    <div className="space-y-6 order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">An exclusive network of excellence.</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Join a premium circle of high-value recruiters.
                            We bridge connections through transparent, win-win contracts,
                            ensuring every node in our network thrives on mutual success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link to="/recruiters" className="px-8 py-3 bg-white text-black font-bold rounded-xl text-center hover:bg-gray-200 transition-colors">
                                Join the Network
                            </Link>
                            <Link to="/network" className="px-8 py-3 border border-white/10 text-white font-bold rounded-xl text-center hover:bg-white/5 transition-colors">
                                Partner with Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. Final Community CTA */}
            <section className="max-w-4xl mx-auto px-6 pt-16">
                <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-all duration-700"></div>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">Ready to ship?</h2>
                    <p className="text-lg text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
                        Polish your profile, connect with technical leaders, and start shipping the future.
                    </p>
                    <div className="pt-4 flex justify-center">
                        <Link
                            to="/network"
                            className="bg-white text-black px-12 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-xl shadow-black/20 uppercase tracking-widest"
                        >
                            Explore the Network
                        </Link>
                    </div>
                </div>
            </section>

            <ProspectModal
                isOpen={isProspectModalOpen}
                onClose={() => setIsProspectModalOpen(false)}
            />
        </div>
    );
};

export default LandingPage;
