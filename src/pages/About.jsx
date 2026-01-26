import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const QAItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 last:border-none">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group hover:bg-white/5 px-4 transition-colors rounded-lg"
            >
                <span className="font-bold text-lg group-hover:text-blue-400 transition-colors">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-6 text-gray-400 leading-relaxed">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const About = () => {
    const faqs = [
        {
            question: "What is this platform?",
            answer: "This is a high-performance recruitment platform designed to connect top talent with leading companies. We focus on speed, transparency, and quality."
        },
        {
            question: "How do I apply for a job?",
            answer: "Simply browse the available positions on the home page, click 'Apply Now', and fill out the application form. You'll need to upload your resume in PDF format."
        },
        {
            question: "Is it free for candidates?",
            answer: "Yes, our platform is completely free for job seekers. We believe in removing barriers to career growth."
        },
        {
            question: "How does the 'Match' incubator work?",
            answer: "Match is designed to bridge the gap between underemployed talent, business hobbyists, and entrepreneurs. By sharing project ideas and committing weekly hours, these diverse groups come together in a decentralized incubator environment. It's about turning 'what if' into 'what's next' through collaborative execution."
        },
        {
            question: "I'm an employer—how can I work with you?",
            answer: "We're happy to move quickly. We can sign a CSA (Consulting Services Agreement) and start advertising your positions to our all-star network of obsessive builders and leaders immediately."
        },
        {
            question: "How is the job placement page funded?",
            answer: "The platform is powered by network momentum. While it's free for candidates, the ecosystem is funded through executive placement commissions paid by employers when they find their next critical hire through our network."
        },
        {
            question: "How can I contact support?",
            answer: "You can reach out to us via our Discord community or email us at support@example.com."
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                    About <span className="text-blue-500">Us</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    Building the future of recruitment, one connection at a time.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-2 md:p-8 backdrop-blur-sm"
            >
                <h2 className="text-2xl font-bold mb-8 px-4 flex items-center gap-2">
                    <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                    Frequently Asked Questions
                </h2>
                <div className="space-y-1">
                    {faqs.map((faq, index) => (
                        <QAItem key={index} {...faq} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default About;
