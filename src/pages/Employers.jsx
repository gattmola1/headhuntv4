import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, Quote, ShieldCheck, Users, Zap, FileText } from 'lucide-react';
import ProspectModal from '../components/ProspectModal';

const LogoTicker = () => {
    const companies = [
        { name: "TechCorp", color: "bg-blue-500" },
        { name: "InnovateLabs", color: "bg-purple-500" },
        { name: "FutureWorks", color: "bg-green-500" },
        { name: "AlphaSystems", color: "bg-red-500" },
        { name: "NextGen", color: "bg-yellow-500" },
        { name: "GlobalTech", color: "bg-indigo-500" },
        { name: "DataFlow", color: "bg-pink-500" },
        { name: "SmartSolutions", color: "bg-cyan-500" },
    ];

    return (
        <div className="w-full overflow-hidden bg-white/5 border-y border-white/10 py-8 mb-20 relative">
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

            <motion.div
                className="flex items-center gap-16 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: 20
                }}
            >
                {[...companies, ...companies, ...companies].map((company, i) => (
                    <div key={i} className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                        <div className={`w-8 h-8 rounded-lg ${company.color} blur-sm`} />
                        <span className="text-xl font-bold tracking-tight">{company.name}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const Employers = () => {
    const [isProspectModalOpen, setIsProspectModalOpen] = useState(false);
    const testimonials = [
        {
            quote: "Headhunt revolutionized our hiring process. We found our lead engineer in 48 hours.",
            author: "Sarah Chen",
            role: "CTO at TechCorp",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
        },
        {
            quote: "The quality of candidates is unmatched. It's the only platform we trust for executive roles.",
            author: "Marcus Rodriguez",
            role: "VP of People at InnovateLabs",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus"
        },
        {
            quote: "Transparent pricing and incredible speed. Exactly what a modern startup needs.",
            author: "Emily Watson",
            role: "Founder at NextGen",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
        }
    ];

    return (
        <div className="pb-20">
            {/* Hero Section */}
            <div className="text-center py-20 px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-7xl font-bold mb-6 tracking-tighter"
                >
                    Hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Top 1%</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 max-w-2xl mx-auto"
                >
                    Join hundreds of world-class companies building their dream teams with Headhunt.
                </motion.p>
            </div>

            {/* Logo Ticker */}
            <LogoTicker />

            {/* Trust/CTA Section */}
            <div className="max-w-7xl mx-auto px-6 mb-20">
                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-8 md:p-16 text-center transform hover:scale-[1.01] transition-transform duration-500">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to scale your team?</h2>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="tel:+15550123456"
                            className="group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-colors"
                        >
                            <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                            <span>+1 (555) 012-3456</span>
                        </a>

                        <a
                            href="/sample_csa.pdf"
                            download
                            className="group flex items-center gap-3 bg-black border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
                        >
                            <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                            <span>Download CSA Sample</span>
                        </a>
                    </div>
                    <p className="mt-6 text-sm text-gray-400">
                        Review our standard Client Service Agreement to get started immediately.
                    </p>
                </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12">Trusted by Industry Leaders</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col"
                        >
                            <Quote className="w-8 h-8 text-blue-500 mb-6 opacity-50" />
                            <p className="text-lg text-gray-300 mb-6 flex-grow leading-relaxed">"{t.quote}"</p>
                            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full bg-white/10" />
                                <div>
                                    <div className="font-bold">{t.author}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Partnership Model Section */}
            <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5 mt-20">
                <div className="grid md:grid-cols-2 gap-12 items-center bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                    <div className="space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold tracking-widest uppercase">
                            Partnership Model
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight uppercase">
                            MONETIZE YOUR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">NETWORK.</span>
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
                                <button className="w-full py-4 bg-white text-black rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5 uppercase tracking-widest">
                                    <Download size={18} />
                                    DOWNLOAD SAMPLE RSA
                                </button>
                                <p className="text-[10px] text-center text-gray-600 mt-4 leading-relaxed uppercase tracking-widest font-mono">
                                    Revenue Share Agreement Template v2.4
                                </p>
                            </div>
                        </div>
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

export default Employers;
