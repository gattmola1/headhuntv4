import { ArrowRight, Lightbulb, MapPin, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const IdeaCard = ({ idea, onApply }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{idea.title}</h3>
                    <p className="text-gray-400 text-sm font-medium">{idea.department}</p>
                </div>
                <button
                    onClick={() => onApply(idea)}
                    className="px-4 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-blue-400 hover:text-white transition-all flex items-center gap-2"
                >
                    Collaborate <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                {idea.description}
            </p>

            <div className="flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2 text-blue-400">
                    <Users className="w-4 h-4" />
                    <span className="text-white font-bold">{idea.participants_count || 0}</span>
                    <span className="text-gray-500">Participants</span>
                </div>
                <div className="flex items-center gap-2 text-orange-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-white font-bold">{idea.total_hours || 0}</span>
                    <span className="text-gray-500">Hours Total</span>
                </div>
            </div>
        </motion.div>
    );
};

export default IdeaCard;
