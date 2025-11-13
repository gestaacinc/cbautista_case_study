import React, { useState, useEffect, useRef } from 'react';
import { Home, FileText, Calendar, GitMerge, ShieldCheck, CheckCircle2, XCircle, DollarSign, Users, User, UserCheck, Zap, Package, BarChart } from 'lucide-react';
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
        title: "Data Privacy (FERPA)",
        description: "We will use the Family Educational Rights and Privacy Act (FERPA) as the gold standard for protecting student education records.",
        items: [
            "All student data (grades, PII, schedules) will be treated as confidential.",
            "The system will be built with Role-Based Access Control (RBAC) to ensure only authorized personnel can access relevant information.",
            "Student data will never be shared with third parties without explicit consent.",
        ]
    },
    security: {
        title: "Data Security",
        description: "To protect student data from breaches, the system will implement robust, multi-layered security measures.",
        items: [
            "Authentication: Secure login with strong password requirements. Multi-factor authentication (MFA) will be strongly recommended.",
            "Encryption: All data will be encrypted in transit (using SSL/TLS) and at rest (database-level encryption).",
            "Auditing: We will maintain secure audit logs to track access to and modification of sensitive records.",
        ]
    },
    accessibility: {
        title: "Accessibility (WCAG)",
        description: "The portal must be usable by all students, including those with disabilities.",
        items: [
            "The portal will be developed to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.",
            "This includes ensuring the site is navigable via keyboard, compatible with screen readers, provides text alternatives for non-text content, and maintains proper color contrast.",
        ]
    }
};

// --- Components ---

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

const InfoCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{title}</h4>
        <p className="text-lg text-stone-800">{value}</p>
    </div>
);

const TabButton = ({ label, target, activeTab, setActiveTab }) => {
    const isActive = activeTab === target;
    return (
        <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
            onClick={() => setActiveTab(target)}
        >
            {label}
        </button>
    );
};

const ScopeListItem = ({ icon, title, children }) => (
    <li className="flex gap-4">
        <div className="flex-shrink-0 w-6 pt-1">
            {icon}
        </div>
        <div>
            <h5 className="font-semibold text-stone-800">{title}</h5>
            <p className="text-sm">{children}</p>
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
            <InfoCard title="Prepared By" value="Chester Allan F. Bautista" />
            <InfoCard title="Date" value="November 12, 2025" />
        </div>

        <div>
            <h3 className="text-2xl font-bold text-stone-800 mb-3">Project Summary</h3>
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
                    
                    <div className="mb-4 flex flex-wrap gap-2 border-b border-stone-200 pb-4">
                        <TabButton label="Module 1: Academics" target="module1" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 2: Documents" target="module2" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 3: Communication" target="module3" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton label="Module 4: Announcements" target="module4" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                    
                    <div className="space-y-3 min-h-[150px]">
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
    const [selectedPhase, setSelectedPhase] = useState(null);

    useEffect(() => {
        const chartElement = chartRef.current;
        if (!chartElement) return;

        const chart = new Chart(chartElement, {
            type: 'bar',
            data: {
                labels: [
                    'Phase 1: Discovery & Planning',
                    'Phase 2: Design & Prototyping',
                    'Phase 3: Development Sprints',
                    'Phase 4: UAT & QA',
                    'Phase 5: Deployment & Launch',
                ],
                datasets: [
                    {
                        label: 'Weeks',
                        data: [
                            [0, 2],
                            [2, 4],
                            [4, 12],
                            [12, 13],
                            [13, 14],
                        ],
                        backgroundColor: [
                            '#3b82f6', // blue-500
                            '#10b981', // emerald-500
                            '#f97316', // orange-500
                            '#8b5cf6', // violet-500
                            '#ef4444', // red-500
                        ],
                        borderSkipped: false,
                        borderRadius: 6,
                        barPercentage: 0.7,
                    },
                ],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Weeks' },
                        min: 0,
                        max: 14,
                        ticks: { stepSize: 1 },
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                        },
                    },
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: (context) => {
                                const duration = context.raw[1] - context.raw[0];
                                return `Duration: ${duration} week(s)`;
                            },
                        },
                    },
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const elementIndex = elements[0].index;
                        const label = chart.data.labels[elementIndex];
                        const key = Object.keys(timelineData).find(k => k.includes(label));
                        if (key) {
                            setSelectedPhase({
                                title: key,
                                tasks: timelineData[key],
                            });
                        }
                    }
                },
            },
        });

        return () => {
            chart.destroy();
        };
    }, []);

    return (
        <section id="timeline-content" className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Project Timeline</h2>
                <p className="text-lg text-stone-700 max-w-3xl">We propose a 14-week (3.5-month) high-level timeline. The chart below visualizes the duration of each project phase. Click on a phase to see the key tasks involved.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                
                {/* Column 1: The Chart */}
                <div className="bg-white p-6 rounded-xl shadow-md lg:col-span-3">
                    <h3 className="text-xl font-bold text-stone-800 mb-4 text-center">Project Phases (14 Weeks Total)</h3>
                    <div className="relative w-full max-w-3xl mx-auto h-96">
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>

                {/* Column 2: The Details Pane */}
                <div className="lg:col-span-2 lg:sticky lg:top-12">
                    <div id="timeline-details" className="bg-white p-6 rounded-xl shadow-md min-h-[450px]">
                        {selectedPhase ? (
                            // Show details when a phase is clicked
                            <div className="animate-fadeIn">
                                <h4 className="text-xl font-bold text-blue-700 mb-3">{selectedPhase.title}</h4>
                                <ul className="list-disc list-outside pl-5 text-stone-700 space-y-2">
                                    {selectedPhase.tasks.map((task, index) => (
                                        <li key={index}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            // Show placeholder text by default
                            <div className="flex items-center justify-center h-full min-h-[400px]">
                                <p className="text-stone-500 text-lg text-center p-4">Click on a phase in the chart to see its key tasks here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

      
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
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
            <p className="text-lg text-stone-700 max-w-3xl">To deliver the best value and adapt to CTI's needs, this project will use the <span className="font-bold text-blue-700">Agile (Scrum)</span> methodology.</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-stone-800 mb-6">Justification for Agile (Scrum)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-700">Iterative Progress & Feedback</h4>
                    <p className="text-stone-700">CTI is moving from a fully manual process. Agile allows CTI stakeholders (like the Registrar's Office) to see and test working features like the document request queue in small, iterative pieces. This ensures the final product is genuinely useful and not just what was thought to be needed at the start.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-700">Risk Management</h4>
                    <p className="text-stone-700">The biggest risk is integrating with CTI's existing Student Information System (SIS). An Agile approach allows us to tackle this high-risk component early (in Sprint 1) and test it thoroughly, rather than discovering a major issue at the very end of the project.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-700">Adaptability</h4>
                    <p className="text-stone-700">As CTI staff and students see the portal for the first time, they will have valuable feedback. Scrum allows us to adapt the product backlog, adding, removing, or re-prioritizing features in subsequent sprints to reflect this feedback and deliver the highest-value product.</p>
                </div>
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-blue-700">Transparency & Collaboration</h4>
                    <p className="text-stone-700">Through regular sprint reviews and a visible product backlog, CTI will have full transparency into the project's status. This builds trust and encourages a collaborative partnership rather than a hands-off client/vendor relationship.</p>
                </div>
            </div>
        </div>
    </section>
);

const Compliance = () => {
    const [activeTab, setActiveTab] = useState('privacy');
    const activeData = complianceTabsData[activeTab];

    return (
        <section id="compliance-content" className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold text-blue-700 mb-4">Legal & Ethical Compliance</h2>
                <p className="text-lg text-stone-700 max-w-3xl">Protecting student data is a non-negotiable requirement. The system will be designed from the ground up to comply with key legal and accessibility standards.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Compliance Tabs */}
                    <div className="md:w-1/3 bg-stone-50 p-6 border-b md:border-b-0 md:border-r border-stone-200">
                        <h3 className="text-xl font-bold text-stone-800 mb-4">Key Considerations</h3>
                        <nav className="flex flex-col gap-1">
                            <ComplianceTab
                                label="Data Privacy (FERPA)"
                                target="privacy"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                icon={<ShieldCheck size={18} />}
                            />
                            <ComplianceTab
                                label="Data Security"
                                target="security"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                icon={<Zap size={18} />}
                            />
                            <ComplianceTab
                                label="Accessibility (WCAG)"
                                target="accessibility"
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                icon={<BarChart size={18} />}
                            />
                        </nav>
                    </div>
                    
                    {/* Compliance Content Pane */}
                    <div className="md:w-2/3 p-8">
                        <div className="space-y-3 min-h-[300px]">
                            <h3 className="text-2xl font-bold text-blue-700 mb-2">{activeData.title}</h3>
                            <p className="text-stone-700 text-base mb-4">{activeData.description}</p>
                            
                            <ul className="list-disc list-outside pl-5 text-stone-700 space-y-2">
                                {activeData.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ComplianceTab = ({ label, target, activeTab, setActiveTab, icon }) => {
    const isActive = activeTab === target;
    return (
        <button
            className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${isActive ? 'bg-blue-100 text-blue-700' : 'text-stone-600 hover:bg-stone-200'}`}
            onClick={() => setActiveTab(target)}
        >
            {icon}
            {label}
        </button>
    );
};

// --- Footer Component ---
 
const Footer = () => (
    <footer className="py-4 border-t border-stone-200 text-center">
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
        
                <div className="flex-1 flex flex-col overflow-y-auto">
                    <main className="flex-grow p-6 md:p-12">
                        {renderPage()}
                    </main>
                    <Footer />
                </div>
                
            </div>
        </div>
    );
}