import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, CheckCircle, ChevronRight, ChevronLeft, Users, Clock, Flame } from 'lucide-react';
import { API_URL } from '../config';

const ApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        linkedin_handle: '',
        resume: null,
        committed_hours: ''
    });
    const [participants, setParticipants] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Determine if this is an "Idea" collaboration or a "Job" application
    // Ideas typically have total_hours already (even if 0) and we use committed_hours from user
    const isIdea = job && (job.total_hours !== undefined || window.location.pathname === '/match');

    useEffect(() => {
        if (isOpen && job?.id) {
            fetchParticipants();
        }
    }, [isOpen, job?.id]);

    const fetchParticipants = async () => {
        try {
            const res = await fetch(`${API_URL}/api/jobs/${job.id}/participants`);
            const data = await res.json();
            setParticipants(data.participants || []);
        } catch (err) {
            console.error("Failed to fetch participants", err);
        }
    };

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFormData(prev => ({ ...prev, resume: file }));
            setError('');
        } else {
            setError('Please upload a PDF file.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (isIdea && !formData.committed_hours) {
            setError('Please specify how many hours you can commit.');
            setIsSubmitting(false);
            return;
        }

        if (!isIdea && !formData.resume) {
            setError('Resume is required');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();

        if (isIdea) {
            data.append('idea_id', job.id);
            data.append('committed_hours', formData.committed_hours);
        } else {
            data.append('posting_id', job.id);
            const fullLinkedinUrl = formData.linkedin_handle ? `https://www.linkedin.com/in/${formData.linkedin_handle.replace(/^\//, '')}` : '';
            data.append('linkedin_url', fullLinkedinUrl);
            if (formData.resume) data.append('resume', formData.resume);
        }

        data.append('full_name', formData.full_name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);

        try {
            const response = await fetch(`${API_URL}/api/apply`, {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Submission failed');
            }

            setSuccess(true);
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setSuccess(false);
            setStep(1);
            setFormData({ full_name: '', email: '', phone: '', linkedin_handle: '', resume: null, committed_hours: '' });
            setError('');
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl shadow-blue-500/10 flex flex-col md:flex-row h-[80vh] md:h-auto"
            >
                {/* Left Side: Participants & Info */}
                <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-white/10 bg-white/[0.02]">
                    <div className="space-y-6">
                        <div>
                            <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">{isIdea ? 'Collaborating On' : 'Applying For'}</span>
                            <h2 className="text-2xl font-bold mt-1">{job.title}</h2>
                        </div>

                        {isIdea && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                        <div className="flex items-center gap-2 text-blue-400 mb-1">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">Total Hours</span>
                                        </div>
                                        <div className="text-xl font-bold">{job.total_hours || 0}</div>
                                    </div>
                                    <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <div className="flex items-center gap-2 text-orange-400 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="text-[10px] font-bold uppercase">Participants</span>
                                        </div>
                                        <div className="text-xl font-bold">{job.participants_count || 0}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold flex items-center gap-2 text-gray-300">
                                        <Flame className="w-4 h-4 text-orange-500" />
                                        Current Contributors
                                    </h3>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                        {participants.length === 0 ? (
                                            <p className="text-xs text-gray-500 italic">No one has joined yet. Be the first!</p>
                                        ) : (
                                            participants.map((p, i) => (
                                                <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5">
                                                    <span className="text-xs font-bold">{p.full_name}</span>
                                                    <span className="text-[10px] font-mono text-blue-400">+{p.committed_hours} HRS/WK</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isIdea && (
                            <div className="text-sm text-gray-400 leading-relaxed">
                                {job.description?.substring(0, 200)}...
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 relative">
                    <button onClick={handleClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>

                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-10 px-4">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8" />
                            </motion.div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">{isIdea ? 'Contribution Recorded!' : 'Application Sent!'}</h2>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                    The final step is joining the discord and posting to prove you are human.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 w-full max-w-xs pt-4">
                                <a
                                    href="https://discord.gg/example"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    Join Discord to Verify
                                </a>
                                <button onClick={handleClose} className="w-full py-3 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl font-bold transition-all">
                                    {isIdea ? 'See more ideas' : 'Look for more jobs'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h3 className="text-lg font-bold mb-4">{isIdea ? 'Join Collaboration' : 'Personal Details'}</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono text-gray-500 mb-1 tracking-widest uppercase">Full Name *</label>
                                    <input type="text" name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder="Jane Doe" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-mono text-gray-500 mb-1 tracking-widest uppercase">Email *</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder="jane@example.com" required />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-mono text-gray-500 mb-1 tracking-widest uppercase">Phone *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none focus:border-blue-500" placeholder="+1..." required />
                                    </div>
                                </div>

                                {isIdea ? (
                                    <div>
                                        <label className="block text-[10px] font-mono text-gray-500 mb-1">WEEKLY COMMITMENT (HOURS)</label>
                                        <input type="number" name="committed_hours" value={formData.committed_hours} onChange={handleInputChange} className="w-full bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-lg font-bold text-blue-400 outline-none focus:border-blue-500" placeholder="e.g. 10" required />
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-mono text-gray-500 mb-1">LINKEDIN URL</label>
                                            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg focus-within:border-blue-500 transition-all overflow-hidden">
                                                <span className="pl-3 py-2.5 text-xs text-gray-500 select-none whitespace-nowrap">linkedin.com/in/</span>
                                                <input
                                                    type="text"
                                                    name="linkedin_handle"
                                                    value={formData.linkedin_handle}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-transparent p-2.5 text-sm text-white outline-none"
                                                    placeholder="janesmith"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-mono text-gray-500 mb-1">RESUME (PDF) *</label>
                                            <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:bg-white/5 transition-colors relative">
                                                <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required />
                                                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                                    <Upload className="w-4 h-4" />
                                                    {formData.resume ? formData.resume.name : "Upload PDF"}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {error && <div className="text-red-500 text-xs bg-red-500/10 p-2 rounded">{error}</div>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : (isIdea ? 'Commit to Project' : 'Submit Application')}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ApplicationModal;
