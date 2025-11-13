import React, { useState, useEffect, useRef } from 'react';
import { Home, FileText, Calendar, GitMerge, ShieldCheck, CheckCircle2, XCircle, Users, User, UserCheck } from 'lucide-react';
import Chart from 'chart.js/auto';

// --- Data ---
const timelineData = {
    'Phase 1: Discovery & Planning (Weeks 1-2)': [
        'Conduct final stakeholder interviews (Registrar, IT, Student Services).',
        'Refine user stories and build the initial Product Backlog.',
        'Finalize technical architecture and perform SIS integration analysis.',
        'Set up all development, testing, and production environments.',
        'Establish the project\'s "Definition of Done" and testing criteria.',
    ],
    'Phase 2: Design & Prototyping (Weeks 3-4)': [
        'Develop user flow diagrams and wireframes.',
        'Create high-fidelity mockups and a clickable prototype (e.g., in Figma).',
        'Conduct usability testing with a small student focus group.',
        'Obtain final design sign-off from CTI.',
    ],
    'Phase 3: Development Sprints (Weeks 5-12)': [
        'Sprint 1: Core Architecture, Secure Authentication, and "View Grades & Schedule".',
        'Sprint 2: Build "Document Request" module (student-facing forms and admin-facing queue).',
        'Sprint 3: Build "Secure Messaging" module and "Announcements" feed.',
        'Sprint 4: Implement notification system, final SIS integration testing, and bug fixes.',
    ],
    'Phase 4: User Acceptance Testing (UAT) & QA (Week 13)': [
        'Provide a feature-complete system to CTI staff (Registrar, department admins) for formal UAT.',
        'Release the portal to a pilot group of students for end-to-end testing.',
        'Identify and remediate all critical and high-priority bugs.',
        'Obtain final UAT sign-off from CTI.',
    ],
    'Phase 5: Deployment & Launch (Week 14)': [
        'Deploy final, approved code to the production environment.',
        'Conduct final "Go-Live" checks.',
        'Provide training documentation and sessions for administrative staff.',
        'Officially launch "CampusConnect" to the student body.',
        'Transition to a 2-week post-launch support and stabilization period.',
    ]
};

const scopeModules = {
    module1: {
        title: "Academic & Schedule Management",
        items: [
            "View current course schedule with times and locations.",
            "Access official final grades for all past semesters.",
            "See in-progress grades for the current term (if available).",
        ]
    },
    module2: {
        title: "Online Document Request Center",
        items: [
            "Submit online requests for official transcripts.",
            "Request proof of enrollment certifications.",
            "Track the status of document requests (Submitted, In-Progress, Ready).",
            "Provide an admin queue for the Registrar's Office to manage requests.",
        ]
    },
    module3: {
        title: "Department Communication",
        items: [
            "Send secure messages to the administrative staff of their assigned department.",
            "Receive secure responses and view correspondence history.",
        ]
    },
    module4: {
        title: "Campus Announcements",
        items: [
            "View a central feed for campus-wide news (registration dates, events).",
            "Receive high-priority notifications for urgent alerts (campus closures).",
        ]
    }
};

const complianceTabsData = {
    privacy: {
        title: "Data Privacy (R.A. 10173)",
        description: "We will use the Data Privacy Act of 2012 (Republic Act No. 10173) as the gold standard for protecting all personal and sensitive student data.",
        items: [
            "All student data (grades, PII, schedules, contact info) will be classified as 'Sensitive Personal Information' and treated with the highest level of confidentiality.",
            "The system will be built with Role-Based Access Control (RBAC) to ensure only authorized personnel can access relevant information, adhering to the principles of proportionality and legitimate purpose.",
            "Student data will not be processed or shared without explicit, informed consent, except where permitted by law.",
            "We will appoint a Data Protection Officer (DPO) contact for the system and provide clear privacy notices to all users."
        ]
    },
    security: {
        title: "Data Security",
        description: "To protect student data from breaches, the system will implement robust, multi-layered organizational, physical, and technical security measures.",
        items: [
            "<strong>Authentication:</strong> Secure login with strong password requirements. Multi-factor authentication (MFA) will be strongly recommended.",
            "<strong>Encryption:</strong> All data will be encrypted in transit (using SSL/TLS) and at rest (database-level encryption).",
            "<strong>Auditing & Monitoring:</strong> We will maintain secure audit logs to track access to and modification of sensitive records.",
            "<strong>Breach Notification:</strong> We will implement a clear breach notification protocol as required by the National Privacy Commission (NPC)."
        ]
    },
    accessibility: {
        title: "Accessibility (WCAG)",
        description: "The portal must be usable by all students, including those with disabilities.",
        items: [
            "The portal will be developed to meet the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards.",
            "This includes ensuring the site is navigable via keyboard, compatible with screen readers, provides text alternatives for non-text content, and maintains proper color contrast.",
        ]
    }
};

// --- Reusable Components ---

const NavLink = ({ icon, label, target, activePage, setActivePage }) => {
    const isActive = activePage === target;
    const activeClasses = "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold";
    const inactiveClasses = "text-stone-700 hover:bg-stone-100 border-l-4 border-transparent";

    return (
        <li>
            <a
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
                onClick={(e) => {
                    e.preventDefault();
                    setActivePage(target);
                }}
            >
                {icon}
                {label}
            </a>
        </li>
    );
};

const TabButton = ({ label, target, activeTab, setActiveTab }) => {
    const isActive = activeTab === target;
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "text-stone-600 hover:bg-stone-100 hover:text-blue-700";

    return (
        <button
            className={`py-2 px-4 rounded-t-lg text-sm font-medium transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
            onClick={() => setActiveTab(target)}
        >
            {label}
        </button>
    );
};

const InfoCard = ({ title, value, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
        <h3 className="text-sm font-semibold text-stone-500 uppercase">{title}</h3>
        <p className="text-xl font-bold text-stone-800">{value}</p>
    </div>
);

const JustificationCard = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-center gap-3 mb-2">
            <span className="flex-shrink-0 bg-blue-100 text-blue-700 p-2 rounded-full">
                {icon}
            </span>
            <h4 className="text-lg font-semibold text-blue-700">{title}</h4>
        </div>
        <p className="text-stone-700 pl-11">{children}</p>
    </div>
);

const ScopeListItem = ({ icon, title, children }) => (
    <li className="flex gap-3">
        <div className="flex-shrink-0 text-lg">{icon}</div>
        <div>
            <span className="font-semibold">{title}:</span> {children}
        </div>
    </li>
);

// --- Page Components ---

const Sidebar = ({ activePage, setActivePage }) => (
    <nav className="md:w-64 w-full bg-white shadow-lg md:h-screen md:sticky md:top-0">
        <div className="p-6">
            <h1 className="text-2xl font-bold text-blue-700">CampusConnect</h1>
            <p className="text-sm text-stone-600">Project Proposal</p>
        </div>
        <ul className="space-y-2 p-4">
            <NavLink icon={<Home size={20} />} label="Overview" target="overview" activePage={activePage} setActivePage={setActivePage} />
            <NavLink icon={<FileText size={20} />} label="Scope of Work" target="scope" activePage={activePage} setActivePage={setActivePage} />
            <NavLink icon={<Calendar size={20} />} label="Project Timeline" target="timeline" activePage={activePage} setActivePage={setActivePage} />
            <NavLink icon={<GitMerge size={20} />} label="Methodology" target="methodology" activePage={activePage} setActivePage={setActivePage} />
            <NavLink icon={<ShieldCheck size={20} />} label="Compliance" target="compliance" activePage={activePage} setActivePage={setActivePage} />
        </ul>
    </nav>
);

const Overview = () => (
    <section id="overview-content" className="space-y-8">
        <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Project Overview</h2>
            <p className="text-lg text-stone-700 max-w-3xl">This proposal outlines the scope, methodology, compliance, and timeline for "CampusConnect," a web-based portal for The City Technical Institute (CTI) designed to modernize and streamline core student services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Client" value="The City Technical Institute (CTI)" />
            <InfoCard title="Prepared By" value="Senior Project Manager" />
            <InfoCard title="Date" value="November 12, 2025" />
        </div>

        <div>
            <h3 className="text-2xl font-bold text-stone-800 mb-3">Executive Summary</h3>
            <p className="text-base text-stone-700 leading-relaxed max-w-3xl">This proposal outlines the scope, methodology, compliance considerations, and timeline for the development of "CampusConnect," a web-based student services portal for the City Technical Institute (CTI). The project's goal is to modernize and streamline core student services by migrating from manual, paper-based processes to an efficient, secure, and accessible online platform.</p>
        </div>
    </section>
);

const Scope = () => {
    const [activeTab, setActiveTab] = useState('module1');
    const activeModule = scopeModules[activeTab];

    return (
        <section id="scope-content" className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Scope of Work</h2>
                <p className="text-lg text-stone-700 max-w-3xl">To ensure clear expectations, the project scope is divided into what is included (In-Scope) and what is not (Out-of-Scope). This section details the core features and modules to be built.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-2xl font-bold text-green-700 mb-4">In-Scope Features</h3>
                    <p className="text-stone-700 mb-6">The portal will provide a central hub for students to manage academic needs. Explore the core modules below.</p>
                    
                    <div className="mb-4 flex flex-wrap gap-2 border-b border-stone-200">
                        <TabButton label="Module 1: Academics" target="module1" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 2: Documents" target="module2" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 3: Communication" target="module3" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 4: Announcements" target="module4" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    
                    <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-stone-800">{activeModule.title}</h4>
                        <ul className="list-disc list-outside pl-5 text-stone-700 space-y-2">
                            {activeModule.items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-2xl font-bold text-red-700 mb-4">Out-of-Scope</h3>
                    <p className="text-stone-700 mb-6">To maintain focus, the following items are not included in this project:</p>
                    <ul className="text-stone-700 space-y-4">
                        <ScopeListItem icon={<UserCheck size={20} className="text-red-600" />} title="New Student Admissions">
                            The portal will not handle applications for prospective students.
                        </ScopeListItem>
                        <ScopeListItem icon={<span className="text-red-600 font-bold text-xl">₱</span>} title="Tuition & Financial Services">
                            No features for paying tuition, managing financial aid, or scholarships.
                        </ScopeListItem>
                        <ScopeListItem icon={<User size={20} className="text-red-600" />} title="Faculty-Side Course Management">
                            Professors will not use this portal for grading or course management.
                        </ScopeListItem>
                        <ScopeListItem icon={<Users size={20} className="text-red-600" />} title="Student-to-Student Interaction">
                            No social forums, clubs, or direct messaging between students.
                        </ScopeListItem>
                    </ul>
                </div>
            </div>
        </section>
    );
};

const Timeline = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [selectedPhase, setSelectedPhase] = useState(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        
        if (chartRef.current) { // Add check to ensure ref is mounted
            const ctx = chartRef.current.getContext('2d');
            
            const labels = Object.keys(timelineData);
            const data = labels.map(label => {
                const match = label.match(/\(Weeks ([\d-]+)\)/) || label.match(/\(Week ([\d]+)\)/);
                if (!match) return 0;
                const weeks = match[1];
                if (weeks.includes('-')) {
                    const [start, end] = weeks.split('-').map(Number);
                    return end - start + 1;
                }
                return 1;
            });

            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Duration in Weeks',
                        data: data,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.7)',
                            'rgba(34, 197, 94, 0.7)',
                            'rgba(249, 115, 22, 0.7)',
                            'rgba(139, 92, 246, 0.7)',
                            'rgba(239, 68, 68, 0.7)'
                        ],
                        borderColor: [
                            'rgba(59, 130, 246, 1)',
                            'rgba(34, 197, 94, 1)',
                            'rgba(249, 115, 22, 1)',
                            'rgba(139, 92, 246, 1)',
                            'rgba(239, 68, 68, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: (context) => ` ${context.raw} weeks`
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: { display: true, text: 'Weeks' }
                        }
                    },
                    onClick: (e, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const label = labels[index];
                            setSelectedPhase({
                                title: label,
                                tasks: timelineData[label]
                            });
                        }
                    }
                }
            });

            // Select the first phase by default
            setSelectedPhase({
                title: labels[0],
                tasks: timelineData[labels[0]]
            });
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []); // Empty dependency array ensures this runs once on mount

    return (
        <section id="timeline-content" className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Project Timeline</h2>
                <p className="text-lg text-stone-700 max-w-3xl">We propose a 14-week (3.5-month) high-level timeline. The chart below visualizes the duration of each project phase. Click on a phase to see the key tasks involved.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-bold text-stone-800 mb-4 text-center">Project Phases (14 Weeks Total)</h3>
                    <div className="relative w-full max-w-3xl mx-auto h-96">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                <div id="timeline-details" className="sticky top-12">
                    {selectedPhase ? (
                        <div className="bg-blue-50 p-6 rounded-xl shadow-inner animate-fadeIn">
                            <h4 className="text-xl font-bold text-blue-700 mb-3">{selectedPhase.title}</h4>
                            <ul className="list-disc list-outside pl-5 text-stone-700 space-y-2">
                                {selectedPhase.tasks.map((task, index) => (
                                    <li key={index}>{task}</li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-stone-100 p-6 rounded-xl text-center text-stone-500">
                            <p>Click on a phase in the chart to see details.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Using style tag for keyframes, as JSX style prop doesn't support @keyframes */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </section>
    );
};

const Methodology = () => (
    <section id="methodology-content" className="space-y-8">
        <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Software Development Methodology</h2>
            <p className="text-lg text-stone-700 max-w-3xl">This project will use the <span className="font-bold text-blue-700">Agile (Scrum Framework)</span> methodology. This approach involves iterative development in short, 2-week cycles ("Sprints") to ensure flexibility and continuous stakeholder feedback.</p>
        </div>
        
        <div>
            <h3 className="text-2xl font-bold text-stone-800 mb-4">Justification for Agile</h3>
            <p className="text-stone-700 max-w-3xl mb-6">This choice is ideal for CTI's transition from manual processes. The key benefits include:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <JustificationCard icon={<Users size={20} />} title="1. Stakeholder Feedback">
                    Allows the Registrar's Office to see and test working software every 2 weeks, rather than waiting months for a final product.
                </JustificationCard>
                <JustificationCard icon={<GitMerge size={20} />} title="2. Evolving Requirements">
                    CTI staff may not realize all needs until they use the system. Agile allows us to adapt and refine requirements iteratively.
                </JustificationCard>
                <JustificationCard icon={<CheckCircle2 size={20} />} title="3. Faster Time-to-Value">
                    We can prioritize and deliver the most critical features (like "View Grades") to students quickly, providing immediate value.
                </JustificationCard>
                <JustificationCard icon={<XCircle size={20} />} title="4. Risk Mitigation">
                    Helps identify technical risks (like SIS integration challenges) early in the process, not at the very end.
                </JustificationCard>
            </div>
        </div>
    </section>
);

const Compliance = () => {
    const [activeTab, setActiveTab] = useState('privacy');
    const activeTabData = complianceTabsData[activeTab];

    return (
        <section id="compliance-content" className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Legal & Ethical Compliance</h2>
                <p className="text-lg text-stone-700 max-w-3xl">Handling sensitive student data is a top priority. This section details our action plan for the key compliance areas of Data Privacy, Security, and Accessibility.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="mb-4 flex flex-wrap gap-2 border-b border-stone-200">
                    <TabButton label="1. Data Privacy (R.A. 10173)" target="privacy" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="2. Data Security" target="security" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton label="3. Accessibility (WCAG)" target="accessibility" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                <div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3">{activeTabData.title}</h3>
                    <p className="text-stone-700 mb-4">{activeTabData.description}</p>
                    <h4 className="text-lg font-semibold text-stone-800 mb-2">Action Plan:</h4>
                    <ul className="list-disc list-outside pl-5 text-stone-700 space-y-2">
                        {activeTabData.items.map((item, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

// --- Footer Component ---
const Footer = () => (
    <footer className="w-full bg-white py-4 mt-8 border-t border-stone-200 text-center">
        <p className="text-sm text-stone-500">
            RLTBackend CaseStudy 1 @cfbautista 2025
        </p>
    </footer>
);

// --- Main App Component ---

export default function App() {
    const [activePage, setActivePage] = useState('overview');

    const renderPage = () => {
        switch (activePage) {
            case 'overview':
                return <Overview />;
            case 'scope':
                return <Scope />;
            case 'timeline':
                return <Timeline />;
            case 'methodology':
                return <Methodology />;
            case 'compliance':
                return <Compliance />;
            default:
                return <Overview />;
        }
    };

    return (
        <div className="bg-stone-50 font-sans text-stone-800">
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Main content area */}
                    <main className="flex-grow p-6 md:p-12 overflow-y-auto">
                        {renderPage()}
                    </main>
                    
                    {/* Footer is now outside the scrolling main area, at the bottom of the flex container */}
                    <Footer />
                </div>
                
            </div>
        </div>
    );
}