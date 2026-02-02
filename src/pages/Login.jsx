import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                // Determine if we need to store a token manually or rely on Supabase session
                // For backward compatibility with AdminDashboard, we might set a flag or use the access token
                sessionStorage.setItem('adminToken', data.session.access_token);
                navigate('/admin');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="w-full max-w-md p-8 border border-white/10 bg-white/5 rounded-2xl backdrop-blur-sm">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-center mb-8">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 p-3 focus:border-blue-500 outline-none transition-colors text-white"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 p-3 focus:border-blue-500 outline-none transition-colors text-white"
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Enter Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Login;
