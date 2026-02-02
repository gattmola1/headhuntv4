
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_URL } from '../config';
import { Calendar, Clock, ArrowRight, User, CheckCircle2 } from 'lucide-react';

const RecruiterProfile = () => {
    const { slug } = useParams();
    const [recruiter, setRecruiter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        preferred_windows: []
    });

    useEffect(() => {
        fetchRecruiter();
    }, [slug]);

    const fetchRecruiter = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recruiters/slug/${slug}`);
            if (!res.ok) throw new Error('Recruiter not found');
            const data = await res.json();
            setRecruiter(data.recruiter);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWindowToggle = (window) => {
        setFormData(prev => {
            if (prev.preferred_windows.includes(window)) {
                return { ...prev, preferred_windows: prev.preferred_windows.filter(w => w !== window) };
            } else {
                return { ...prev, preferred_windows: [...prev.preferred_windows, window] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recruiter_id: recruiter.id,
                    ...formData
                })
            });
            if (!res.ok) throw new Error('Failed to submit inquiry');
            setSubmitted(true);
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="min-h-screen pt-32 text-center text-white">Loading profile...</div>;
    if (error) return <div className="min-h-screen pt-32 text-center text-red-400">Error: {error}</div>;
    if (!recruiter) return null;

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column: Profile & Info */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
                        <img
                            src={recruiter.headshot_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"}
                            alt={recruiter.name}
                            className="relative w-full aspect-square object-cover rounded-3xl border border-white/10 shadow-2xl"
                        />
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold mb-2">{recruiter.name}</h1>
                        <p className="text-blue-400 font-medium text-lg">Senior Technical Recruiter</p>
                    </div>

                    <div className="prose prose-invert">
                        <p className="text-gray-300 leading-relaxed text-lg">
                            {recruiter.bio || "Specializing in placing top-tier software engineering talent at high-growth startups and established tech giants."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Specializations</h3>
                        <ul className="space-y-3">
                            {recruiter.highlights && recruiter.highlights.length > 0 ? (
                                recruiter.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="text-lg">{highlight}</span>
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="text-lg">Fintech</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="text-lg">Executive Search</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                                        <span className="text-lg">AI/ML</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Calendar & Inquiry Form */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Inquiry Form */}
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                        {!submitted ? (
                            <>
                                <div className="mb-8 relative z-10">
                                    <h2 className="text-2xl font-bold mb-2">Request a Consultation</h2>
                                    <p className="text-gray-400">Select your preferred availability windows and we'll coordinate a time.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                                placeholder="Example Name"
                                                value={formData.candidate_name}
                                                onChange={e => setFormData({ ...formData, candidate_name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                                placeholder="email@example.com"
                                                value={formData.candidate_email}
                                                onChange={e => setFormData({ ...formData, candidate_email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                            placeholder="+1 (555) 000-0000"
                                            value={formData.candidate_phone}
                                            onChange={e => setFormData({ ...formData, candidate_phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-gray-400">Preferred Windows</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {[
                                                "Standard Business (9a-5p)",
                                                "Early Bird (7a-9a)",
                                                "Evening (5p-8p)",
                                                "Weekend Warrior",
                                                "Urgent (24h)"
                                            ].map((option) => (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleWindowToggle(option)}
                                                    className={`p-3 rounded-xl border text-left text-sm font-medium transition-all ${formData.preferred_windows.includes(option)
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span>{option}</span>
                                                        {formData.preferred_windows.includes(option) && <CheckCircle2 className="w-4 h-4" />}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group"
                                    >
                                        Submit Request
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Request Received</h3>
                                <p className="text-gray-400 max-w-md mx-auto">
                                    Thanks, {formData.candidate_name}. {recruiter.name} will review your preferred windows and reach out shortly to confirm a time.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Calendar Section */}
                    <div className="bg-zinc-900/50 border border-white/10 rounded-3xl p-1 overflow-hidden">
                        <div className="bg-black/50 p-4 border-b border-white/5 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="font-bold text-gray-300">Public Availability</span>
                        </div>
                        <div className="aspect-video w-full bg-black/20">
                            <iframe
                                src={`https://calendar.google.com/calendar/embed?src=${recruiter.calendar_id || 'en.usa%23holiday%40group.v.calendar.google.com'}&ctz=America%2FLos_Angeles`}
                                style={{ border: 0 }}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RecruiterProfile;
