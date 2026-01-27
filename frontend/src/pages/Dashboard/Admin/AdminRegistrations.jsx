import React, { useState, useEffect } from 'react';
import {
    Users,
    Calendar,
    CheckCircle,
    X,
    Download,
    Upload,
    Loader,
    Search,
    Filter,
    ArrowRight,
    BookOpen,
    Award,
    ExternalLink
} from 'lucide-react';
import api from '../../../services/api.js';
import { toast } from 'react-toastify';

const AdminRegistrations = () => {
    const [activeType, setActiveType] = useState('workshops'); // workshops, conferences, emr
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadingId, setUploadingId] = useState(null);
    const [pendingFiles, setPendingFiles] = useState({}); // { registrationId: File }

    useEffect(() => {
        fetchRegistrations();
    }, [activeType]);

    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            let endpoint = '';
            if (activeType === 'workshops') endpoint = '/workshops/pending-registrations';
            else if (activeType === 'conferences') endpoint = '/conferences/pending-registrations';
            else if (activeType === 'emr') endpoint = '/emr-training/pending-registrations';

            const response = await api.get(endpoint);
            if (response.data.success) {
                setRegistrations(response.data.data);
            }
        } catch (error) {
            console.error(`Error fetching ${activeType} registrations:`, error);
            toast.error(`Failed to load ${activeType} registrations`);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (registrationId, newStatus) => {
        try {
            let endpoint = '';
            if (activeType === 'workshops') {
                endpoint = `/workshops/registrations/${registrationId}/${newStatus === 'confirmed' ? 'confirm' : 'reject'}`;
            } else if (activeType === 'conferences') {
                endpoint = `/conferences/registrations/${registrationId}`;
            } else if (activeType === 'emr') {
                endpoint = `/emr-training/registrations/${registrationId}/${newStatus === 'confirmed' ? 'confirm' : 'reject'}`;
            }

            const response = activeType === 'conferences'
                ? await api.patch(endpoint, { status: newStatus })
                : await api.put(endpoint);

            if (response.data.success) {
                toast.success(`Registration ${newStatus} successfully`);
                fetchRegistrations();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed');
        }
    };

    const handleFileSelect = (e, registrationId) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            toast.error('Please upload a PDF file');
            return;
        }

        setPendingFiles(prev => ({ ...prev, [registrationId]: file }));
    };

    const performUpload = async (registrationId) => {
        const file = pendingFiles[registrationId];
        if (!file) return;

        const formData = new FormData();
        formData.append('certificate', file);

        setUploadingId(registrationId);
        try {
            let endpoint = '';
            if (activeType === 'workshops') endpoint = `/workshops/registrations/${registrationId}/certificate`;
            else if (activeType === 'conferences') endpoint = `/conferences/registrations/${registrationId}/certificate`;
            else if (activeType === 'emr') endpoint = `/emr-training/registrations/${registrationId}/certificate`;

            const response = await api.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                toast.success('Certificate uploaded successfully');
                setPendingFiles(prev => {
                    const next = { ...prev };
                    delete next[registrationId];
                    return next;
                });
                fetchRegistrations();
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setUploadingId(null);
        }
    };

    const filteredRegistrations = registrations.filter(reg =>
        reg.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (reg.workshop?.title || reg.conference?.name || reg.month)?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProgramName = (reg) => {
        if (activeType === 'workshops') return reg.workshop?.title;
        if (activeType === 'conferences') return reg.conference?.name;
        if (activeType === 'emr') return `${reg.month} ${reg.year || 2026}`;
        return '';
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#04445E]">Registration Management</h1>
                        <p className="text-gray-500 mt-1">Review registrations and upload completion certificates</p>
                    </div>

                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                        {['workshops', 'conferences', 'emr'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setActiveType(type)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeType === type
                                    ? 'bg-[#04445E] text-white shadow-md'
                                    : 'text-gray-500 hover:text-[#04445E] hover:bg-gray-50'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students or programs..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#169AB4] transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Program</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Certificate</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader className="h-8 w-8 animate-spin text-[#169AB4]" />
                                                <p className="text-gray-400 font-medium">Loading registrations...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            No registrations found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((reg) => (
                                        <tr key={reg._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-[#169AB4]/10 rounded-full flex items-center justify-center text-[#169AB4] font-bold">
                                                        {reg.user?.fullName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900">{reg.user?.fullName}</p>
                                                        <p className="text-xs text-gray-500">{reg.user?.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 bg-blue-50 text-[#04445E] rounded-lg">
                                                        {activeType === 'workshops' ? <BookOpen className="h-4 w-4" /> :
                                                            activeType === 'conferences' ? <Users className="h-4 w-4" /> :
                                                                <Award className="h-4 w-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-800">{getProgramName(reg)}</p>
                                                        <p className="text-[10px] text-gray-400">{new Date(reg.registeredAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${reg.status === 'confirmed' || reg.status === 'registered' || reg.status === 'attended'
                                                    ? 'bg-green-100 text-green-700'
                                                    : reg.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {reg.certificate?.url ? (
                                                    <button
                                                        onClick={() => window.open(reg.certificate.url, '_blank')}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#04445E] text-white rounded-lg text-xs font-bold hover:bg-[#033647] shadow-sm transition-all"
                                                    >
                                                        <Download className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                ) : pendingFiles[reg._id] ? (
                                                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                        <div className="flex items-center justify-between gap-2 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100">
                                                            <span className="text-[10px] text-blue-700 font-bold truncate max-w-[100px]" title={pendingFiles[reg._id].name}>
                                                                {pendingFiles[reg._id].name}
                                                            </span>
                                                            <button
                                                                onClick={() => setPendingFiles(prev => {
                                                                    const next = { ...prev };
                                                                    delete next[reg._id];
                                                                    return next;
                                                                })}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        <button
                                                            onClick={() => performUpload(reg._id)}
                                                            disabled={uploadingId === reg._id}
                                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold hover:bg-green-700 shadow-sm transition-all"
                                                        >
                                                            {uploadingId === reg._id ? (
                                                                <Loader className="h-3 w-3 animate-spin" />
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
                                                            id={`cert-${reg._id}`}
                                                            className="hidden"
                                                            accept=".pdf"
                                                            onChange={(e) => handleFileSelect(e, reg._id)}
                                                            disabled={uploadingId === reg._id}
                                                        />
                                                        <label
                                                            htmlFor={`cert-${reg._id}`}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${uploadingId === reg._id
                                                                ? 'bg-gray-100 text-gray-400'
                                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-[#169AB4] hover:text-[#169AB4]'
                                                                }`}
                                                        >
                                                            <Upload className="h-3.5 w-3.5" />
                                                            Select PDF
                                                        </label>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(reg.status === 'pending' || reg.status === 'registered') && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(reg._id, activeType === 'conferences' ? 'attended' : 'confirmed')}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Confirm/Mark Attended"
                                                            >
                                                                <CheckCircle className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(reg._id, 'rejected')}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                                                        <ArrowRight className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
