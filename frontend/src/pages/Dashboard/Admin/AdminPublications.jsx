import React, { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    FileText,
    Upload,
    Download,
    ChevronDown,
    ChevronUp,
    User,
    Mail,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    X
} from 'lucide-react';
import api from '../../../services/api';
import { toast } from 'react-toastify';

const AdminPublications = () => {
    const [publications, setPublications] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [uploadingId, setUploadingId] = useState(null);
    const [pendingFiles, setPendingFiles] = useState({}); // { id: File }

    const handleFileSelect = (e, id) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        setPendingFiles(prev => ({ ...prev, [id]: file }));
    };

    const performProjectFileUpload = async (pubId, projectId) => {
        const file = pendingFiles[`file-${pubId}-${projectId}`];
        if (!file) return;

        try {
            setUploadingId(`${pubId}-${projectId}`);
            const formData = new FormData();
            formData.append('document', file);

            const response = await api.post(`/publications/${pubId}/projects/${projectId}/file`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success('File uploaded successfully');
                setPendingFiles(prev => {
                    const next = { ...prev };
                    delete next[`file-${pubId}-${projectId}`];
                    return next;
                });
                fetchAllData();
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    const performPublicationCertificateUpload = async (pubId) => {
        const file = pendingFiles[`cert-${pubId}`];
        if (!file) return;

        try {
            setUploadingId(`cert-${pubId}`);
            const formData = new FormData();
            formData.append('certificate', file);

            const response = await api.post(`/publications/${pubId}/certificate`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success('Certificate uploaded successfully');
                setPendingFiles(prev => {
                    const next = { ...prev };
                    delete next[`cert-${pubId}`];
                    return next;
                });
                fetchAllData();
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newPublication, setNewPublication] = useState({
        userEmail: '',
        teamSize: 1,
        numberOfProjects: 1,
        projects: [{ name: '', stage: 1 }]
    });

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [pubsRes, usersRes] = await Promise.all([
                api.get('/publications'),
                api.get('/users/all')
            ]);

            if (pubsRes.data.success) setPublications(pubsRes.data.data);
            if (usersRes.data.success) setUsers(usersRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this publication?')) return;
        try {
            const response = await api.delete(`/publications/${id}`);
            if (response.data.success) {
                toast.success('Publication deleted');
                fetchAllData();
            }
        } catch (error) {
            toast.error('Failed to delete publication');
        }
    };

    const handleCreatePublication = async (e) => {
        e.preventDefault();
        const selectedUser = users.find(u => u.email === newPublication.userEmail);
        if (!selectedUser) {
            toast.error('Please select a valid user');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                ...newPublication,
                user: selectedUser._id,
                userName: selectedUser.fullName
            };

            const response = await api.post('/publications/create', payload);
            if (response.data.success) {
                toast.success('Publication created successfully');
                setShowCreateModal(false);
                setNewPublication({
                    userEmail: '',
                    teamSize: 1,
                    numberOfProjects: 1,
                    projects: [{ name: '', stage: 1 }]
                });
                fetchAllData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create publication');
        } finally {
            setIsSubmitting(false);
        }
    };

    const addProjectField = () => {
        setNewPublication(prev => ({
            ...prev,
            projects: [...prev.projects, { name: '', stage: 1 }],
            numberOfProjects: prev.numberOfProjects + 1
        }));
    };

    const removeProjectField = (index) => {
        const updatedProjects = newPublication.projects.filter((_, i) => i !== index);
        setNewPublication(prev => ({
            ...prev,
            projects: updatedProjects,
            numberOfProjects: updatedProjects.length
        }));
    };

    const filteredPublications = publications.filter(pub =>
        pub.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pub.userEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#04445E]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Publications Management</h1>
                    <p className="text-gray-500 text-sm">Manage research projects and certificates for all students</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#04445E]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#04445E] text-white rounded-lg hover:bg-[#033647] transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Create
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4 text-center">Projects</th>
                                <th className="px-6 py-4 text-center">Team size</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Certificate</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 italic">
                            {filteredPublications.map((pub) => (
                                <React.Fragment key={pub._id}>
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{pub.userName}</p>
                                                    <p className="text-xs text-gray-500">{pub.userEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                                {pub.numberOfProjects}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600 text-sm">
                                            {pub.teamSize}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${pub.status === 'active' ? 'bg-green-50 text-green-700' :
                                                pub.status === 'completed' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-red-50 text-red-700'
                                                }`}>
                                                {pub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {pub.certificate?.url ? (
                                                <button
                                                    onClick={() => window.open(pub.certificate.url, '_blank')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 shadow-sm transition-all"
                                                >
                                                    <Download className="h-3.5 w-3.5" />
                                                    View Cert
                                                </button>
                                            ) : pendingFiles[`cert-${pub._id}`] ? (
                                                <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                    <div className="flex items-center justify-between gap-2 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100 italic">
                                                        <span className="text-[10px] text-blue-700 font-bold truncate max-w-[100px]" title={pendingFiles[`cert-${pub._id}`].name}>
                                                            {pendingFiles[`cert-${pub._id}`].name}
                                                        </span>
                                                        <button
                                                            onClick={() => setPendingFiles(prev => {
                                                                const next = { ...prev };
                                                                delete next[`cert-${pub._id}`];
                                                                return next;
                                                            })}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => performPublicationCertificateUpload(pub._id)}
                                                        disabled={uploadingId === `cert-${pub._id}`}
                                                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 shadow-sm transition-all italic"
                                                    >
                                                        {uploadingId === `cert-${pub._id}` ? (
                                                            <div className="animate-spin h-3 w-3 border-b-2 border-white rounded-full"></div>
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3" />
                                                        )}
                                                        Confirm & Upload
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        id={`cert-${pub._id}`}
                                                        className="hidden"
                                                        accept=".pdf"
                                                        onChange={(e) => handleFileSelect(e, `cert-${pub._id}`)}
                                                        disabled={uploadingId === `cert-${pub._id}`}
                                                    />
                                                    <label
                                                        htmlFor={`cert-${pub._id}`}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${uploadingId === `cert-${pub._id}`
                                                            ? 'bg-gray-200 text-gray-500'
                                                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 italic'
                                                            }`}
                                                    >
                                                        <Upload className="h-3.5 w-3.5" />
                                                        Select PDF
                                                    </label>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-sm italic">
                                                <button
                                                    onClick={() => setExpandedId(expandedId === pub._id ? null : pub._id)}
                                                    className="p-2 text-[#04445E] hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    {expandedId === pub._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pub._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedId === pub._id && (
                                        <tr className="bg-gray-50/50">
                                            <td colSpan="5" className="px-6 py-6 border-b-2 bg-gradient-to-r from-blue-50/20 to-indigo-50/20">
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-bold text-[#04445E] flex items-center gap-2">
                                                        <Users className="h-4 w-4" />
                                                        Research Projects Breakdown
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {pub.projects.map((proj, idx) => (
                                                            <div key={proj._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="min-w-0">
                                                                        <p className="font-bold text-gray-900 text-sm truncate">{proj.name || `Project ${idx + 1}`}</p>
                                                                        <p className="text-xs text-indigo-600 font-medium mt-1">Stage {proj.stage}</p>
                                                                    </div>
                                                                    <div className={`p-1.5 rounded-lg ${proj.file ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                                                        {proj.file ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                                                    </div>
                                                                </div>
                                                                <div className="pt-2 flex items-center justify-between gap-3">
                                                                    {proj.file ? (
                                                                        <button
                                                                            onClick={() => window.open(proj.file.url, '_blank')}
                                                                            className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-bold hover:bg-green-100 transition-colors border border-green-200"
                                                                        >
                                                                            <Download className="h-3 w-3" />
                                                                            Download
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-xs text-gray-400">No document</span>
                                                                    )}

                                                                    <div className="relative">
                                                                        {pendingFiles[`file-${pub._id}-${proj._id}`] ? (
                                                                            <div className="flex flex-col gap-1.5">
                                                                                <div className="flex items-center justify-between gap-1.5 px-2 py-1 bg-blue-50 rounded border border-blue-100">
                                                                                    <span className="text-[10px] text-blue-700 font-bold truncate max-w-[80px]" title={pendingFiles[`file-${pub._id}-${proj._id}`].name}>
                                                                                        {pendingFiles[`file-${pub._id}-${proj._id}`].name}
                                                                                    </span>
                                                                                    <button
                                                                                        onClick={() => setPendingFiles(prev => {
                                                                                            const next = { ...prev };
                                                                                            delete next[`file-${pub._id}-${proj._id}`];
                                                                                            return next;
                                                                                        })}
                                                                                        className="text-red-500 hover:text-red-700"
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </button>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => performProjectFileUpload(pub._id, proj._id)}
                                                                                    disabled={uploadingId === `${pub._id}-${proj._id}`}
                                                                                    className="flex items-center justify-center gap-1.5 px-3 py-1 bg-green-600 text-white rounded text-[10px] font-bold hover:bg-green-700"
                                                                                >
                                                                                    {uploadingId === `${pub._id}-${proj._id}` ? (
                                                                                        <div className="animate-spin h-3 w-3 border-b-2 border-white rounded-full"></div>
                                                                                    ) : (
                                                                                        <CheckCircle className="h-3 w-3" />
                                                                                    )}
                                                                                    Upload
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <>
                                                                                <input
                                                                                    type="file"
                                                                                    id={`file-${pub._id}-${proj._id}`}
                                                                                    className="hidden"
                                                                                    accept=".pdf"
                                                                                    onChange={(e) => handleFileSelect(e, `file-${pub._id}-${proj._id}`)}
                                                                                    disabled={uploadingId === `${pub._id}-${proj._id}`}
                                                                                />
                                                                                <label
                                                                                    htmlFor={`file-${pub._id}-${proj._id}`}
                                                                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${uploadingId === `${pub._id}-${proj._id}`
                                                                                        ? 'bg-gray-200 text-gray-500'
                                                                                        : 'bg-[#04445E] text-white hover:bg-[#033647]'
                                                                                        }`}
                                                                                >
                                                                                    <Upload className="h-3 w-3" />
                                                                                    {proj.file ? 'Change' : 'Choose PDF'}
                                                                                </label>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 Italics">Create Publication Strategy</h2>
                            <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePublication} className="space-y-6 italic">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Select Student</label>
                                <select
                                    className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#04445E]"
                                    value={newPublication.userEmail}
                                    onChange={(e) => setNewPublication({ ...newPublication, userEmail: e.target.value })}
                                    required
                                >
                                    <option value="">Select a student...</option>
                                    {users.map(u => (
                                        <option key={u._id} value={u.email}>{u.fullName} ({u.email})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Team Size</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#04445E]"
                                        value={newPublication.teamSize}
                                        onChange={(e) => setNewPublication({ ...newPublication, teamSize: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Number of Projects</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                                        value={newPublication.numberOfProjects}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-gray-700">Projects</label>
                                    <button
                                        type="button"
                                        onClick={addProjectField}
                                        className="text-xs font-bold text-[#169AB4] hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add Project
                                    </button>
                                </div>
                                {newPublication.projects.map((proj, idx) => (
                                    <div key={idx} className="flex gap-3 items-end bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Project Name</label>
                                            <input
                                                className="w-full p-2 border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-[#04445E]"
                                                placeholder="e.g. Systematic Review of..."
                                                value={proj.name}
                                                onChange={(e) => {
                                                    const updated = [...newPublication.projects];
                                                    updated[idx].name = e.target.value;
                                                    setNewPublication({ ...newPublication, projects: updated });
                                                }}
                                                required
                                            />
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <label className="text-[10px] uppercase font-bold text-gray-400">Stage</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="11"
                                                className="w-full p-2 border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-[#04445E]"
                                                value={proj.stage}
                                                onChange={(e) => {
                                                    const updated = [...newPublication.projects];
                                                    updated[idx].stage = parseInt(e.target.value);
                                                    setNewPublication({ ...newPublication, projects: updated });
                                                }}
                                                required
                                            />
                                        </div>
                                        {newPublication.projects.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeProjectField(idx)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-[#04445E] text-white rounded-xl font-bold hover:bg-[#033647] transition-colors disabled:bg-gray-400"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Publication'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPublications;
