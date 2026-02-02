import { useState, useEffect } from 'react';
import { Plus, Trash2, FileText, Download, Briefcase, Users, ExternalLink, Clock, Heart, Lightbulb, Target, MessageCircle } from 'lucide-react';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('postings');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [ideas, setIdeas] = useState([]);
    const [prospects, setProspects] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [token] = useState(sessionStorage.getItem('adminToken'));

    // New Job Form State
    const [newJob, setNewJob] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: ''
    });

    // State for new features
    const [recruiters, setRecruiters] = useState([]);
    const [leads, setLeads] = useState([]);
    const [showRecruiterModal, setShowRecruiterModal] = useState(false);

    useEffect(() => {
        fetchJobs();
        if (activeTab === 'applications') fetchApplications();
        if (activeTab === 'collaborators') fetchCollaborators();
        if (activeTab === 'ideas') fetchIdeas();
        if (activeTab === 'prospects') fetchProspects();
        if (activeTab === 'recruiters') fetchRecruiters();
        if (activeTab === 'leads') fetchLeads();
    }, [activeTab]);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/jobs`);
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (err) { console.error(err); }
    };

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${API_URL}/api/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setApplications(data.applications || []);
        } catch (err) { console.error(err); }
    };

    const fetchCollaborators = async () => {
        try {
            const res = await fetch(`${API_URL}/api/collaborators`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCollaborators(data.collaborators || []);
        } catch (err) { console.error(err); }
    };

    const fetchIdeas = async () => {
        try {
            const res = await fetch(`${API_URL}/api/ideas`);
            const data = await res.json();
            setIdeas(data.ideas || []);
        } catch (err) { console.error(err); }
    };

    const fetchProspects = async () => {
        try {
            const res = await fetch(`${API_URL}/api/prospects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setProspects(data.prospects || []);
        } catch (err) { console.error(err); }
    };

    const fetchRecruiters = async () => {
        try {
            const res = await fetch(`${API_URL}/api/recruiters`);
            const data = await res.json();
            setRecruiters(data.recruiters || []);
        } catch (err) { console.error(err); }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/api/leads`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setLeads(data.leads || []);
        } catch (err) { console.error(err); }
    };

    const handleDeleteJob = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    const handleDeleteIdea = async (id) => {
        if (!confirm('Permanently delete this project pitch?')) return;
        try {
            await fetch(`${API_URL}/api/ideas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchIdeas();
        } catch (err) { console.error(err); }
    };

    const handleDeleteProspect = async (id) => {
        if (!confirm('Delete this prospect entry?')) return;
        try {
            await fetch(`${API_URL}/api/prospects/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchProspects();
        } catch (err) { console.error(err); }
    };

    const handleDeleteRecruiter = async (id) => {
        if (!confirm('Delete this recruiter?')) return;
        try {
            await fetch(`${API_URL}/api/recruiters/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchRecruiters();
        } catch (err) { console.error(err); }
    };

    const handleViewResume = async (path) => {
        try {
            const res = await fetch(`${API_URL}/api/admin/resume-link/${encodeURIComponent(path)}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.url) {
                window.open(data.url, '_blank');
            } else {
                alert('Could not generate secure link: ' + (data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Error fetching resume link');
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/api/jobs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newJob)
            });
            setShowCreateModal(false);
            setNewJob({ title: '', company: '', location: '', salary: '', description: '' });
            fetchJobs();
        } catch (err) { console.error(err); }
    };

    const handleCreateRecruiter = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            // highlights is comma separated
            data.highlights = data.highlights.split(',').map(s => s.trim());

            await fetch(`${API_URL}/api/recruiters`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            setShowRecruiterModal(false);
            fetchRecruiters();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex bg-white/5 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('postings')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'postings' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Postings</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'applications' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Applications</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('collaborators')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'collaborators' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> Collabs</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('ideas')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'ideas' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Lightbulb className="w-3.5 h-3.5" /> Ideas</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('prospects')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'prospects' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Target className="w-3.5 h-3.5" /> Prospects</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('recruiters')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'recruiters' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Recruiters</div>
                    </button>
                    <button
                        onClick={() => setActiveTab('leads')}
                        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'leads' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-400 hover:text-white'}`}
                    >
                        <div className="flex items-center gap-2"><MessageCircle className="w-3.5 h-3.5" /> Leads</div>
                    </button>
                </div>
            </header>

            {activeTab === 'postings' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create New Posting
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {jobs.map(job => (
                            <div key={job.id} className="p-6 rounded-xl border border-white/10 bg-white/5 flex justify-between items-center group">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                                    <p className="text-sm text-gray-500">{job.company} • {job.location || 'Remote'} • ${job.salary?.toLocaleString()}/yr</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {jobs.length === 0 && <p className="text-center text-gray-500">No postings found.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-mono text-gray-500">
                            <tr>
                                <th className="p-4">Candidate</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Resume</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {applications.map(app => (
                                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4"><div className="font-bold text-white">{app.full_name}</div></td>
                                    <td className="p-4 text-white">{app.job_title || 'Unknown'}</td>
                                    <td className="p-4">
                                        <div className="text-white">{app.email}</div>
                                        <div className="text-xs">{app.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleViewResume(app.resume_url)}
                                            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            <FileText className="w-4 h-4" /> View PDF
                                        </button>
                                    </td>
                                    <td className="p-4 font-mono text-xs">{new Date(app.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {applications.length === 0 && <div className="p-8 text-center text-gray-500">No applications yet.</div>}
                </div>
            )}

            {activeTab === 'collaborators' && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-mono text-gray-500">
                            <tr>
                                <th className="p-4">Collaborator</th>
                                <th className="p-4">Project Title</th>
                                <th className="p-4">Entity</th>
                                <th className="p-4">Commitment</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Date Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {collaborators.map(c => (
                                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-white font-bold">{c.full_name}</td>
                                    <td className="p-4 text-white font-bold">{c.idea_title || 'Unknown'}</td>
                                    <td className="p-4 text-gray-500">{c.idea_entity}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2 text-blue-400 font-bold">
                                            <Clock className="w-4 h-4" /> {c.committed_hours} HRS/WK
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-white">{c.email}</div>
                                        <div className="text-xs font-mono">{c.phone}</div>
                                    </td>
                                    <td className="p-4 font-mono text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {collaborators.length === 0 && <div className="p-8 text-center text-gray-500">No collaborators found.</div>}
                </div>
            )}
            {activeTab === 'ideas' && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-mono text-gray-500">
                            <tr>
                                <th className="p-4">Project Title</th>
                                <th className="p-4">Entity</th>
                                <th className="p-4">Hours</th>
                                <th className="p-4">Users</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {ideas.map(idea => (
                                <tr key={idea.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-white font-bold">{idea.title}</td>
                                    <td className="p-4 text-gray-500">{idea.department}</td>
                                    <td className="p-4 text-blue-400 font-bold">{idea.total_hours}</td>
                                    <td className="p-4">{idea.participants_count}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDeleteIdea(idea.id)}
                                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {ideas.length === 0 && <div className="p-12 text-center text-gray-500">No public ideas pitched yet.</div>}
                </div>
            )}

            {activeTab === 'prospects' && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-mono text-gray-500">
                            <tr>
                                <th className="p-4">Type</th>
                                <th className="p-4">Recommender Name</th>
                                <th className="p-4">Recommender Email</th>
                                <th className="p-4">Recommender Phone</th>
                                <th className="p-4">Prospect Name</th>
                                <th className="p-4">Prospect Email</th>
                                <th className="p-4">Prospect Phone</th>
                                <th className="p-4">Intro?</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {prospects.map(p => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${p.target_type === 'decision_maker' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-blue-500/20 text-blue-400 border border-blue-500/20'}`}>
                                            {p.target_type === 'decision_maker' ? 'Decision Maker' : 'Talent'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white font-bold">{p.recommender_name}</td>
                                    <td className="p-4 text-gray-400">{p.recommender_email}</td>
                                    <td className="p-4 text-gray-500 font-mono text-xs">{p.recommender_phone}</td>
                                    <td className="p-4 text-white font-bold">{p.prospect_name}</td>
                                    <td className="p-4 text-gray-400">{p.prospect_email}</td>
                                    <td className="p-4 text-gray-500 font-mono text-xs">{p.prospect_phone}</td>
                                    <td className="p-4">
                                        {p.willing_to_connect ? (
                                            <span className="flex items-center gap-1 text-green-400 font-bold text-[10px] uppercase tracking-tighter">
                                                <MessageCircle className="w-3 h-3" /> YES
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 font-bold text-[10px] uppercase tracking-tighter">
                                                NO
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono text-[10px]">{new Date(p.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDeleteProspect(p.id)}
                                            className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {prospects.length === 0 && <div className="p-12 text-center text-gray-500 italic">No prospect signal received yet.</div>}
                </div>
            )}

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Create New Posting</h2>
                        <form onSubmit={handleCreateJob} className="space-y-4">
                            <input
                                placeholder="Job Title"
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white"
                                value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} required
                            />
                            <input
                                placeholder="Company Name"
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white"
                                value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Location (e.g. SF or Remote)"
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white"
                                    value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                                />
                                <input
                                    type="number"
                                    placeholder="Annual Salary (e.g. 120000)"
                                    className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white"
                                    value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white h-32"
                                value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} required
                            />
                            <div className="flex gap-2 justify-end pt-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg text-white font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'recruiters' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowRecruiterModal(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Recruiter
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {recruiters.map(r => (
                            <div key={r.id} className="p-6 rounded-xl border border-white/10 bg-white/5 flex gap-4 items-center group">
                                <img src={r.headshot_url || "https://via.placeholder.com/50"} alt={r.name} className="w-16 h-16 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-white mb-1">{r.name}</h3>
                                    <p className="text-sm text-gray-400">{r.slug}</p>
                                    <div className="flex gap-2 mt-2">
                                        {r.highlights && r.highlights.map((h, i) => (
                                            <span key={i} className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">{h}</span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteRecruiter(r.id)}
                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                        {recruiters.length === 0 && <p className="text-center text-gray-500">No recruiters found.</p>}
                    </div>
                </div>
            )}

            {activeTab === 'leads' && (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 text-xs uppercase font-mono text-gray-500">
                            <tr>
                                <th className="p-4">Candidate</th>
                                <th className="p-4">Recruiter</th>
                                <th className="p-4">Windows</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.map(lead => (
                                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-white">{lead.candidate_name}</div>
                                        <div className="text-xs">{lead.candidate_email}</div>
                                    </td>
                                    <td className="p-4 text-white">{lead.recruiters?.name || 'Unknown'}</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {lead.preferred_windows && lead.preferred_windows.map((w, i) => (
                                                <span key={i} className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">{w}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 font-mono text-xs uppercase">{lead.status}</td>
                                    <td className="p-4 font-mono text-xs">{new Date(lead.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {leads.length === 0 && <div className="p-8 text-center text-gray-500">No leads found.</div>}
                </div>
            )}

            {showRecruiterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-950 border border-white/10 p-8 rounded-2xl max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Add Recruiter</h2>
                        <form onSubmit={handleCreateRecruiter} className="space-y-4">
                            <input name="name" placeholder="Full Name" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" required />
                            <input name="slug" placeholder="Slug (e.g. matt-gola)" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" required />
                            <input name="headshot_url" placeholder="Headshot URL" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" />
                            <input name="calendar_id" placeholder="Google Calendar ID" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" />
                            <textarea name="bio" placeholder="Professional Bio" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white h-24" />
                            <input name="highlights" placeholder="Highlights (comma separated)" className="w-full bg-black/50 border border-white/10 p-3 rounded-lg text-white" />

                            <div className="flex gap-2 justify-end pt-4">
                                <button type="button" onClick={() => setShowRecruiterModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg text-white font-bold">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
