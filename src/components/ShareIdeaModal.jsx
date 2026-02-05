import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, Lightbulb } from 'lucide-react';
import { API_URL } from '../config';

const ShareIdeaModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        department: '', // Used as Project Name
        description: '',
        total_hours: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [newIdea, setNewIdea] = useState(null);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/ideas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const errData = JSON.parse(text);
                    throw new Error(errData.error || 'Submission failed');
                } catch (e) {
                    throw new Error('Server returned an invalid response. Please check if the backend is running.');
                }
            }

            const data = await response.json();
            setNewIdea({
                id: data.id,
                title: formData.title,
                description: formData.description,
                department: formData.department,
                total_hours: parseInt(formData.total_hours) || 0,
                participants_count: 0
            });
            setSuccess(true);
            if (onSuccess) onSuccess();
            setFormData({ title: '', department: '', description: '', total_hours: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setSuccess(false);
        setNewIdea(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-zinc-950 border border-white/10 rounded-2xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl shadow-blue-500/10"
            >
                <div className="p-8">
                    {success ? (
                        <div className="text-center space-y-6 py-4 relative">
                            <button onClick={handleSuccessClose} className="absolute -top-4 -right-4 p-2 text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lightbulb className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Idea Shipped!</h2>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Join our Discord now to drum up interest in your idea and find your first collaborators.
                            </p>
                            <div className="flex flex-col gap-3 pt-4">
                                <a
                                    href="https://discord.gg/NwQH763Gp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Go to Discord
                                </a>
                                <button
                                    onClick={() => {
                                        onSuccess(newIdea); // This triggers the collaborate modal in Match.jsx
                                        handleSuccessClose();
                                    }}
                                    className="w-full py-3.5 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg shadow-white/5"
                                >
                                    Collaborate Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center">
                                        <Lightbulb className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-bold">Pitch Your Idea</h2>
                                </div>
                                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Idea Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. Decentralized Task Protocol"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Project / Entity Name</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. Project Orion"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Initial Hours Committed</label>
                                    <input
                                        type="number"
                                        name="total_hours"
                                        value={formData.total_hours}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all font-medium"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-widest">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all h-32 resize-none font-medium"
                                        placeholder="Explain what you're building and who you need..."
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Pitched...' : <><Send className="w-4 h-4" /> Ship Idea</>}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ShareIdeaModal;
