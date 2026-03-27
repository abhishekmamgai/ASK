// ============================================================
// MOCK DATA — ASK Tech Agency Dashboard
// ============================================================

export type ProjectStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold'
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical'
export type IssueStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Client {
    id: string
    name: string
    email: string
    company: string
    phone: string
    avatar: string
    joinedAt: string
    activeProjects: number
    totalProjects: number
    status: 'active' | 'inactive'
}

export interface Project {
    id: string
    name: string
    description: string
    clientId: string
    clientName: string
    clientEmail: string
    status: ProjectStatus
    progress: number
    deadline: string
    createdAt: string
    teamSize: number
    budget: string
    tags: string[]
}

export interface Issue {
    id: string
    title: string
    description: string
    priority: IssuePriority
    status: IssueStatus
    projectId: string
    projectName: string
    clientId: string
    clientName: string
    assignedTo: string | null
    createdAt: string
    updatedAt: string
    screenshot?: string
    replies: IssueReply[]
}

export interface IssueReply {
    id: string
    author: string
    role: 'admin' | 'client'
    message: string
    createdAt: string
}

export interface Task {
    id: string
    title: string
    description: string
    status: TaskStatus
    priority: IssuePriority
    assignedTo: string
    projectId: string
    projectName: string
    dueDate: string
    createdAt: string
}

export interface Message {
    id: string
    senderId: string
    senderName: string
    senderRole: 'admin' | 'client'
    recipientId: string
    recipientName: string
    content: string
    createdAt: string
    read: boolean
}

export interface Conversation {
    id: string
    clientId: string
    clientName: string
    clientAvatar: string
    lastMessage: string
    lastMessageAt: string
    unreadCount: number
    messages: Message[]
}

export interface FileItem {
    id: string
    name: string
    type: string
    size: string
    projectId: string
    projectName: string
    uploadedBy: string
    uploadedAt: string
    url: string
}

export interface ActivityItem {
    id: string
    type: 'project_created' | 'issue_submitted' | 'issue_resolved' | 'message_sent' | 'task_completed' | 'client_added' | 'project_updated'
    title: string
    description: string
    createdAt: string
    user: string
    avatar: string
}

// ============================================================
// CLIENTS
// ============================================================
export const MOCK_CLIENTS: Client[] = [
    {
        id: 'c1',
        name: 'Rajesh Verma',
        email: 'rajesh@techsolutions.in',
        company: 'TechSolutions India',
        phone: '+91 98765 43210',
        avatar: 'RV',
        joinedAt: '2025-01-15',
        activeProjects: 2,
        totalProjects: 3,
        status: 'active',
    },
    {
        id: 'c2',
        name: 'Priya Sharma',
        email: 'priya@fashionhub.com',
        company: 'FashionHub Online',
        phone: '+91 99887 76655',
        avatar: 'PS',
        joinedAt: '2025-02-01',
        activeProjects: 1,
        totalProjects: 1,
        status: 'active',
    },
    {
        id: 'c3',
        name: 'Arjun Mehta',
        email: 'arjun@startupventures.io',
        company: 'Startup Ventures',
        phone: '+91 91234 56789',
        avatar: 'AM',
        joinedAt: '2024-11-20',
        activeProjects: 1,
        totalProjects: 2,
        status: 'active',
    },
    {
        id: 'c4',
        name: 'Sneha Patil',
        email: 'sneha@edulearn.org',
        company: 'EduLearn Platform',
        phone: '+91 87654 32109',
        avatar: 'SP',
        joinedAt: '2025-03-01',
        activeProjects: 1,
        totalProjects: 1,
        status: 'active',
    },
    {
        id: 'c5',
        name: 'Vikram Nair',
        email: 'vikram@healthplus.med',
        company: 'HealthPlus Medical',
        phone: '+91 76543 21098',
        avatar: 'VN',
        joinedAt: '2024-09-10',
        activeProjects: 0,
        totalProjects: 2,
        status: 'inactive',
    },
]

// ============================================================
// PROJECTS
// ============================================================
export const MOCK_PROJECTS: Project[] = [
    {
        id: 'p1',
        name: 'E-Commerce Platform',
        description: 'Full-stack e-commerce solution with payment gateway, inventory management, and analytics dashboard.',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        clientEmail: 'rajesh@techsolutions.in',
        status: 'in-progress',
        progress: 68,
        deadline: '2026-04-30',
        createdAt: '2025-01-20',
        teamSize: 4,
        budget: '₹3,50,000',
        tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    },
    {
        id: 'p2',
        name: 'Mobile App Redesign',
        description: 'Complete UI/UX redesign of the existing iOS and Android mobile application with modern design language.',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        clientEmail: 'rajesh@techsolutions.in',
        status: 'in-progress',
        progress: 42,
        deadline: '2026-05-15',
        createdAt: '2025-02-10',
        teamSize: 2,
        budget: '₹1,80,000',
        tags: ['React Native', 'Figma', 'iOS', 'Android'],
    },
    {
        id: 'p3',
        name: 'Fashion Catalog Website',
        description: 'Product catalog with filtering, wishlist, and WhatsApp checkout integration.',
        clientId: 'c2',
        clientName: 'Priya Sharma',
        clientEmail: 'priya@fashionhub.com',
        status: 'in-progress',
        progress: 85,
        deadline: '2026-03-20',
        createdAt: '2025-01-05',
        teamSize: 3,
        budget: '₹2,20,000',
        tags: ['Next.js', 'TailwindCSS', 'Supabase'],
    },
    {
        id: 'p4',
        name: 'AI SaaS Dashboard',
        description: 'Analytics and AI insights dashboard for startup metrics with real-time data visualization.',
        clientId: 'c3',
        clientName: 'Arjun Mehta',
        clientEmail: 'arjun@startupventures.io',
        status: 'in-progress',
        progress: 30,
        deadline: '2026-06-01',
        createdAt: '2025-02-28',
        teamSize: 5,
        budget: '₹5,00,000',
        tags: ['Next.js', 'Python', 'OpenAI', 'Recharts'],
    },
    {
        id: 'p5',
        name: 'Learning Management System',
        description: 'Complete LMS platform with course creation, video hosting, quizzes, and student progress tracking.',
        clientId: 'c4',
        clientName: 'Sneha Patil',
        clientEmail: 'sneha@edulearn.org',
        status: 'not-started',
        progress: 0,
        deadline: '2026-07-31',
        createdAt: '2025-03-01',
        teamSize: 6,
        budget: '₹8,00,000',
        tags: ['Next.js', 'Video.js', 'PostgreSQL', 'AWS S3'],
    },
    {
        id: 'p6',
        name: 'Brand Identity Package',
        description: 'Logo design, brand guidelines, business card, and social media kit.',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        clientEmail: 'rajesh@techsolutions.in',
        status: 'completed',
        progress: 100,
        deadline: '2025-12-15',
        createdAt: '2024-11-01',
        teamSize: 2,
        budget: '₹80,000',
        tags: ['Figma', 'Illustrator', 'Branding'],
    },
    {
        id: 'p7',
        name: 'Healthcare Patient Portal',
        description: 'Web portal for patients to book appointments, view medical records, and consult doctors online.',
        clientId: 'c5',
        clientName: 'Vikram Nair',
        clientEmail: 'vikram@healthplus.med',
        status: 'completed',
        progress: 100,
        deadline: '2025-06-30',
        createdAt: '2024-09-15',
        teamSize: 4,
        budget: '₹4,50,000',
        tags: ['React', 'Node.js', 'MongoDB'],
    },
]

// ============================================================
// ISSUES
// ============================================================
export const MOCK_ISSUES: Issue[] = [
    {
        id: 'i1',
        title: 'Payment gateway timeout on checkout',
        description: 'Users are experiencing timeout errors when trying to complete payment through Razorpay. The issue occurs intermittently, especially during peak hours.',
        priority: 'critical',
        status: 'in-progress',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        assignedTo: 'Abhishek',
        createdAt: '2026-03-04T10:30:00',
        updatedAt: '2026-03-05T14:20:00',
        replies: [
            {
                id: 'r1',
                author: 'Rajesh Verma',
                role: 'client',
                message: 'This is causing significant revenue loss. Please prioritize!',
                createdAt: '2026-03-04T11:00:00',
            },
            {
                id: 'r2',
                author: 'Abhishek',
                role: 'admin',
                message: 'We have identified the issue. It is related to the webhook timeout configuration. Working on a fix now.',
                createdAt: '2026-03-05T14:20:00',
            },
        ],
    },
    {
        id: 'i2',
        title: 'Product images not loading on mobile',
        description: 'On mobile devices (iOS specifically), product images in the catalog page are failing to load. Shows broken image icon.',
        priority: 'high',
        status: 'open',
        projectId: 'p3',
        projectName: 'Fashion Catalog Website',
        clientId: 'c2',
        clientName: 'Priya Sharma',
        assignedTo: null,
        createdAt: '2026-03-05T09:15:00',
        updatedAt: '2026-03-05T09:15:00',
        replies: [],
    },
    {
        id: 'i3',
        title: 'Dashboard charts not rendering',
        description: 'The analytics charts on the main dashboard are showing a blank white area instead of the data visualizations.',
        priority: 'medium',
        status: 'open',
        projectId: 'p4',
        projectName: 'AI SaaS Dashboard',
        clientId: 'c3',
        clientName: 'Arjun Mehta',
        assignedTo: null,
        createdAt: '2026-03-06T08:00:00',
        updatedAt: '2026-03-06T08:00:00',
        replies: [],
    },
    {
        id: 'i4',
        title: 'Login page styling broken',
        description: 'After the latest update, the login page CSS is broken. The form fields are overlapping and the gradient background is gone.',
        priority: 'high',
        status: 'resolved',
        projectId: 'p2',
        projectName: 'Mobile App Redesign',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        assignedTo: 'Shiva',
        createdAt: '2026-03-01T16:00:00',
        updatedAt: '2026-03-03T11:00:00',
        replies: [
            {
                id: 'r3',
                author: 'Shiva',
                role: 'admin',
                message: 'Fixed! The issue was caused by a conflicting CSS import. Deployed to staging for review.',
                createdAt: '2026-03-03T11:00:00',
            },
        ],
    },
    {
        id: 'i5',
        title: 'WhatsApp checkout link broken',
        description: 'The WhatsApp checkout button generates an incorrect URL and users cannot complete their orders.',
        priority: 'medium',
        status: 'resolved',
        projectId: 'p3',
        projectName: 'Fashion Catalog Website',
        clientId: 'c2',
        clientName: 'Priya Sharma',
        assignedTo: 'Kartik',
        createdAt: '2026-02-28T12:00:00',
        updatedAt: '2026-03-02T10:00:00',
        replies: [],
    },
    {
        id: 'i6',
        title: 'Slow page load on product listing',
        description: 'The product listing page takes more than 8 seconds to load. Customers are bouncing off.',
        priority: 'low',
        status: 'closed',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        assignedTo: 'Abhishek',
        createdAt: '2026-02-20T09:00:00',
        updatedAt: '2026-02-25T15:00:00',
        replies: [],
    },
]

// ============================================================
// TASKS
// ============================================================
export const MOCK_TASKS: Task[] = [
    {
        id: 't1',
        title: 'Implement Razorpay webhook handler',
        description: 'Build a robust webhook handler for Razorpay payment events with retry logic.',
        status: 'in-progress',
        priority: 'critical',
        assignedTo: 'Abhishek',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        dueDate: '2026-03-08',
        createdAt: '2026-03-05',
    },
    {
        id: 't2',
        title: 'Design product detail page',
        description: 'Create Figma mockup for product detail page with image gallery and review section.',
        status: 'done',
        priority: 'high',
        assignedTo: 'Shiva',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        dueDate: '2026-03-05',
        createdAt: '2026-03-01',
    },
    {
        id: 't3',
        title: 'Setup CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        status: 'todo',
        priority: 'medium',
        assignedTo: 'Kartik',
        projectId: 'p4',
        projectName: 'AI SaaS Dashboard',
        dueDate: '2026-03-15',
        createdAt: '2026-03-06',
    },
    {
        id: 't4',
        title: 'Fix iOS image loading bug',
        description: 'Investigate and fix the WebP image format issue on Safari/iOS.',
        status: 'todo',
        priority: 'high',
        assignedTo: 'Abhishek',
        projectId: 'p3',
        projectName: 'Fashion Catalog Website',
        dueDate: '2026-03-07',
        createdAt: '2026-03-05',
    },
    {
        id: 't5',
        title: 'Integrate Recharts analytics',
        description: 'Add line charts, bar charts, and pie charts to the AI dashboard overview page.',
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'Kartik',
        projectId: 'p4',
        projectName: 'AI SaaS Dashboard',
        dueDate: '2026-03-10',
        createdAt: '2026-03-02',
    },
    {
        id: 't6',
        title: 'Performance optimization',
        description: 'Implement lazy loading, image optimization, and code splitting for the e-commerce platform.',
        status: 'done',
        priority: 'medium',
        assignedTo: 'Shiva',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        dueDate: '2026-03-03',
        createdAt: '2026-02-28',
    },
    {
        id: 't7',
        title: 'Mobile responsiveness audit',
        description: 'Test all pages on mobile breakpoints and fix any layout issues.',
        status: 'todo',
        priority: 'medium',
        assignedTo: 'Shiva',
        projectId: 'p3',
        projectName: 'Fashion Catalog Website',
        dueDate: '2026-03-12',
        createdAt: '2026-03-06',
    },
    {
        id: 't8',
        title: 'Client onboarding documentation',
        description: 'Write user guide and API documentation for the LMS platform.',
        status: 'todo',
        priority: 'low',
        assignedTo: 'Kartik',
        projectId: 'p5',
        projectName: 'Learning Management System',
        dueDate: '2026-03-20',
        createdAt: '2026-03-06',
    },
]

// ============================================================
// CONVERSATIONS / MESSAGES
// ============================================================
export const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: 'conv1',
        clientId: 'c1',
        clientName: 'Rajesh Verma',
        clientAvatar: 'RV',
        lastMessage: 'When will the payment issue be fixed? We are losing sales.',
        lastMessageAt: '2026-03-06T10:30:00',
        unreadCount: 2,
        messages: [
            {
                id: 'm1',
                senderId: 'c1',
                senderName: 'Rajesh Verma',
                senderRole: 'client',
                recipientId: 'admin',
                recipientName: 'ASK Team',
                content: 'Hi team, I wanted to check on the progress of the e-commerce project.',
                createdAt: '2026-03-04T09:00:00',
                read: true,
            },
            {
                id: 'm2',
                senderId: 'admin',
                senderName: 'Abhishek',
                senderRole: 'admin',
                recipientId: 'c1',
                recipientName: 'Rajesh Verma',
                content: 'Hi Rajesh! The project is 68% complete. We are currently working on the payment gateway integration.',
                createdAt: '2026-03-04T09:30:00',
                read: true,
            },
            {
                id: 'm3',
                senderId: 'c1',
                senderName: 'Rajesh Verma',
                senderRole: 'client',
                recipientId: 'admin',
                recipientName: 'ASK Team',
                content: 'Great! Also, when will the payment issue be fixed? We are losing sales.',
                createdAt: '2026-03-06T10:30:00',
                read: false,
            },
        ],
    },
    {
        id: 'conv2',
        clientId: 'c2',
        clientName: 'Priya Sharma',
        clientAvatar: 'PS',
        lastMessage: 'The website looks amazing! Just the image issue needs to be fixed.',
        lastMessageAt: '2026-03-05T15:00:00',
        unreadCount: 1,
        messages: [
            {
                id: 'm4',
                senderId: 'admin',
                senderName: 'Shiva',
                senderRole: 'admin',
                recipientId: 'c2',
                recipientName: 'Priya Sharma',
                content: 'Hi Priya! Your fashion catalog is 85% complete. We are in the final stages.',
                createdAt: '2026-03-04T14:00:00',
                read: true,
            },
            {
                id: 'm5',
                senderId: 'c2',
                senderName: 'Priya Sharma',
                senderRole: 'client',
                recipientId: 'admin',
                recipientName: 'ASK Team',
                content: 'The website looks amazing! Just the image issue needs to be fixed.',
                createdAt: '2026-03-05T15:00:00',
                read: false,
            },
        ],
    },
    {
        id: 'conv3',
        clientId: 'c3',
        clientName: 'Arjun Mehta',
        clientAvatar: 'AM',
        lastMessage: 'Looking forward to seeing the charts integrated next week.',
        lastMessageAt: '2026-03-03T11:00:00',
        unreadCount: 0,
        messages: [
            {
                id: 'm6',
                senderId: 'c3',
                senderName: 'Arjun Mehta',
                senderRole: 'client',
                recipientId: 'admin',
                recipientName: 'ASK Team',
                content: 'When will the analytics charts be ready? Our investors want to see the demo.',
                createdAt: '2026-03-02T16:00:00',
                read: true,
            },
            {
                id: 'm7',
                senderId: 'admin',
                senderName: 'Kartik',
                senderRole: 'admin',
                recipientId: 'c3',
                recipientName: 'Arjun Mehta',
                content: 'We are working on it! The Recharts integration will be done by March 10th.',
                createdAt: '2026-03-03T10:00:00',
                read: true,
            },
            {
                id: 'm8',
                senderId: 'c3',
                senderName: 'Arjun Mehta',
                senderRole: 'client',
                recipientId: 'admin',
                recipientName: 'ASK Team',
                content: 'Looking forward to seeing the charts integrated next week.',
                createdAt: '2026-03-03T11:00:00',
                read: true,
            },
        ],
    },
]

// ============================================================
// FILES
// ============================================================
export const MOCK_FILES: FileItem[] = [
    {
        id: 'f1',
        name: 'Project_Proposal_ECommerce.pdf',
        type: 'PDF',
        size: '2.4 MB',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        uploadedBy: 'Abhishek',
        uploadedAt: '2025-01-20',
        url: '#',
    },
    {
        id: 'f2',
        name: 'UI_Design_Mockup_v2.fig',
        type: 'Figma',
        size: '8.1 MB',
        projectId: 'p1',
        projectName: 'E-Commerce Platform',
        uploadedBy: 'Shiva',
        uploadedAt: '2025-02-05',
        url: '#',
    },
    {
        id: 'f3',
        name: 'Fashion_Catalog_Assets.zip',
        type: 'ZIP',
        size: '45.2 MB',
        projectId: 'p3',
        projectName: 'Fashion Catalog Website',
        uploadedBy: 'Priya Sharma',
        uploadedAt: '2025-01-10',
        url: '#',
    },
    {
        id: 'f4',
        name: 'Brand_Logo_Final.svg',
        type: 'SVG',
        size: '0.8 MB',
        projectId: 'p6',
        projectName: 'Brand Identity Package',
        uploadedBy: 'Shiva',
        uploadedAt: '2025-12-10',
        url: '#',
    },
    {
        id: 'f5',
        name: 'API_Documentation.pdf',
        type: 'PDF',
        size: '1.2 MB',
        projectId: 'p4',
        projectName: 'AI SaaS Dashboard',
        uploadedBy: 'Kartik',
        uploadedAt: '2025-03-01',
        url: '#',
    },
]

// ============================================================
// ACTIVITY TIMELINE
// ============================================================
export const MOCK_ACTIVITY: ActivityItem[] = [
    {
        id: 'a1',
        type: 'issue_submitted',
        title: 'New critical issue reported',
        description: 'Rajesh Verma reported a payment gateway timeout on E-Commerce Platform',
        createdAt: '2026-03-06T10:30:00',
        user: 'Rajesh Verma',
        avatar: 'RV',
    },
    {
        id: 'a2',
        type: 'issue_submitted',
        title: 'New issue reported',
        description: 'Arjun Mehta reported dashboard charts not rendering on AI SaaS Dashboard',
        createdAt: '2026-03-06T08:00:00',
        user: 'Arjun Mehta',
        avatar: 'AM',
    },
    {
        id: 'a3',
        type: 'project_updated',
        title: 'Project progress updated',
        description: 'E-Commerce Platform progress updated to 68%',
        createdAt: '2026-03-05T16:00:00',
        user: 'Abhishek',
        avatar: 'AB',
    },
    {
        id: 'a4',
        type: 'message_sent',
        title: 'New message from client',
        description: 'Priya Sharma sent a message about the Fashion Catalog Website',
        createdAt: '2026-03-05T15:00:00',
        user: 'Priya Sharma',
        avatar: 'PS',
    },
    {
        id: 'a5',
        type: 'issue_resolved',
        title: 'Issue resolved',
        description: 'Login page styling issue on Mobile App Redesign marked as resolved',
        createdAt: '2026-03-03T11:00:00',
        user: 'Shiva',
        avatar: 'SH',
    },
    {
        id: 'a6',
        type: 'task_completed',
        title: 'Task completed',
        description: 'Performance optimization task completed for E-Commerce Platform',
        createdAt: '2026-03-03T09:00:00',
        user: 'Shiva',
        avatar: 'SH',
    },
    {
        id: 'a7',
        type: 'client_added',
        title: 'New client onboarded',
        description: 'Sneha Patil from EduLearn Platform joined the portal',
        createdAt: '2026-03-01T10:00:00',
        user: 'Admin',
        avatar: 'AD',
    },
    {
        id: 'a8',
        type: 'project_created',
        title: 'New project created',
        description: 'Learning Management System project created for EduLearn Platform',
        createdAt: '2026-03-01T10:30:00',
        user: 'Admin',
        avatar: 'AD',
    },
]

// ============================================================
// HELPER FUNCTIONS
// ============================================================
export function getProjectsByClient(clientEmail: string): Project[] {
    return MOCK_PROJECTS.filter((p) => p.clientEmail === clientEmail)
}

export function getIssuesByClient(clientId: string): Issue[] {
    return MOCK_ISSUES.filter((i) => i.clientId === clientId)
}

export function getConversationByClient(clientId: string): Conversation | undefined {
    return MOCK_CONVERSATIONS.find((c) => c.clientId === clientId)
}

export function getFilesByClient(clientId: string): FileItem[] {
    const clientProjects = MOCK_PROJECTS.filter((p) => p.clientId === clientId).map((p) => p.id)
    return MOCK_FILES.filter((f) => clientProjects.includes(f.projectId))
}

export const DASHBOARD_STATS = {
    totalClients: MOCK_CLIENTS.length,
    activeProjects: MOCK_PROJECTS.filter((p) => p.status === 'in-progress').length,
    openIssues: MOCK_ISSUES.filter((i) => i.status === 'open' || i.status === 'in-progress').length,
    completedTasks: MOCK_TASKS.filter((t) => t.status === 'done').length,
}
