import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import ProjectHeader from '../../Common/ProjectHeader';
import ConferenceTabs from './ConferenceTabs';
import api from '../../../utils/api';

const Conferences = ({ onBack }) => {
    const [conferences, setConferences] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        available: 0,
        registered: 0
    });

    // Fetch conferences from backend
    const fetchConferences = async () => {
        try {
            setLoading(true);
            const response = await api.get('/conferences');
            
            if (response.data.success) {
                setConferences(response.data.data);
                setStats(prev => ({
                    ...prev,
                    available: response.data.data.length
                }));
            }
        } catch (error) {
            console.error('Error fetching conferences:', error);
            toast.error('Failed to load conferences');
        } finally {
            setLoading(false);
        }
    };

    // Fetch user registrations (you'll need to implement this endpoint)
    const fetchRegistrations = async () => {
        try {
            // Uncomment when you have the registration endpoint
            // const response = await api.get('/conferences/registrations');
            // if (response.data.success) {
            //     setRegistrations(response.data.data);
            //     setStats(prev => ({
            //         ...prev,
            //         registered: response.data.data.length
            //     }));
            // }
            
            // For now, use empty array
            setRegistrations([]);
            setStats(prev => ({
                ...prev,
                registered: 0
            }));
        } catch (error) {
            console.error('Error fetching registrations:', error);
        }
    };

    useEffect(() => {
        fetchConferences();
        fetchRegistrations();
    }, []);

    const headerConfig = {
        icon: BookOpen,
        title: 'Conferences & Events',
        subtitle: 'Find below the list of upcoming conferences and events',
        stats: [
            { value: stats.available.toString(), label: 'Available Conferences' },
            { value: stats.registered.toString(), label: 'Your Registrations' },
        ]
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <Loader className="h-8 w-8 text-[#169AB4] animate-spin mr-3" />
                        <span className="text-lg text-[#04445E]">Loading conferences...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ProjectHeader {...headerConfig} />
                <ConferenceTabs
                    upcomingConferences={conferences}
                    registrations={registrations}
                />
            </div>
        </div>
    );
};

export default Conferences;