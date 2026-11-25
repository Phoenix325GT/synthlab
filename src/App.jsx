import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  collection,
  getDocs
} from 'firebase/firestore';

// ============================================================================
// FIREBASE INITIALIZATION (OUTSIDE COMPONENT)
// ============================================================================
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: 'AIzaSyBUq7qTeSbkJgM_bwbyD1SwjXxX_siPKxo',
        authDomain: 'synth-86206.firebaseapp.com',
        projectId: 'synth-86206',
        storageBucket: 'synth-86206.firebasestorage.app',
        messagingSenderId: '839402159812',
        appId: '1:839402159812:web:97b26a8d5695daa8fe9391',
        measurementId: 'G-DX2L32XF25'
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// ============================================================================
// GOOGLE FONTS INJECTION (Newsreader + Inter + JetBrains Mono)
// ============================================================================
const useEditorialFonts = () => {
  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);
};

// ============================================================================
// CRISP 1.5PX STROKE VECTOR ICONS
// ============================================================================
const Icon = ({ name, className = 'w-4 h-4' }) => {
  const icons = {
    compass: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    folder: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      </svg>
    ),
    user: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    plus: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    ),
    search: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    bookmark: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
    arrowUp: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 15-6-6-6 6" />
      </svg>
    ),
    trash: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
    ),
    check: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    x: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    ),
    send: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
    ),
    fileText: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
    chat: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    users: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    link: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    copy: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
    ),
    logOut: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" x2="9" y1="12" y2="12" />
      </svg>
    ),
    bookOpen: (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )
  };
  return icons[name] || null;
};

// ============================================================================
// CONSTANTS & SEED ARCHIVAL PROJECTS (Used only if Firestore projects is empty)
// ============================================================================
const DISCIPLINES = ['All', 'Research Papers', 'Engineering & Hardware', 'Art & Design', 'Open Science'];
const STATUS_FILTERS = ['All', 'Seeking Collaborators', 'Showcase Only', 'Published Findings'];

const DOCUMENT_SECTIONS = [
  { key: 'abstract', label: '01. Abstract' },
  { key: 'introduction', label: '02. Introduction & Motivation' },
  { key: 'methodology', label: '03. Methodology / Build Architecture' },
  { key: 'results', label: '04. Results & Experimental Findings' },
  { key: 'references', label: '05. References & Appendix' }
];

const SEED_USERS = [
  {
    uid: 'seed-investigator-1',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@nordic-cryo.org',
    affiliation: 'Nordic Low-Temperature Institute',
    discipline: 'Engineering & Hardware',
    credentials: 'Ph.D. Condensed Matter Physics (Uppsala) • 19 Peer-Reviewed Articles',
    bio: 'Focused on high-efficiency passive thermal insulation and non-invasive acoustic diagnostics for extreme environments.',
    skills: ['Thermal Modeling', 'CFD Simulation', 'Cryogenic Metrology', 'COMSOL'],
    orcidUrl: 'https://orcid.org/0000-0001-7731-4029',
    githubUrl: 'https://github.com/erostova-lab'
  },
  {
    uid: 'seed-investigator-2',
    name: 'Prof. Arvind Deshmukh',
    email: 'a.deshmukh@ict-chem.edu.in',
    affiliation: 'Dept. of Chemical Engineering, ICT Mumbai',
    discipline: 'Research Papers',
    credentials: 'Ph.D. Process Systems Engineering • Associate Editor, Industrial & Engineering Chemistry',
    bio: 'Investigating solar-driven membrane distillation and decentralized greywater recovery systems for dense urban housing.',
    skills: ['Process Simulation', 'ASPEN Plus', 'Membrane Separation', 'Heat Integration'],
    orcidUrl: 'https://orcid.org/0000-0002-8814-3120',
    githubUrl: 'https://github.com/adeshmukh-pse'
  },
  {
    uid: 'seed-investigator-3',
    name: 'Marcus Vance',
    email: 'marcus@studiokinetik.nl',
    affiliation: 'Studio Kinetik, Rotterdam',
    discipline: 'Art & Design',
    credentials: 'M.Des. Industrial & Kinetic Design • Open-Hardware Maintainer',
    bio: 'Translating hydro-static pressure gradients and environmental telemetry into architectural acoustic installations.',
    skills: ['CAD / SolidWorks', 'CNC Prototyping', 'Acoustic Resonators', 'Marine Brass'],
    orcidUrl: '',
    githubUrl: 'https://github.com/mvance-kinetik'
  }
];

const SEED_PROJECTS = [
  {
    code: 'SL-2026-101',
    title: 'Solar-Driven Vacuum Membrane Distillation for Decentralized Urban Greywater Recovery',
    discipline: 'Research Papers',
    status: 'Seeking Collaborators',
    ownerId: 'seed-investigator-2',
    ownerName: 'Prof. Arvind Deshmukh',
    ownerAffiliation: 'Dept. of Chemical Engineering, ICT Mumbai',
    createdAt: Date.now() - 86400000 * 3,
    endorsements: 34,
    endorsedBy: [],
    abstract:
      'High-rise residential blocks discharge 65% of potable intake as low-contaminant greywater. We model a rooftop parabolic-trough driven hydrophobic PTFE membrane distillation module achieving 82% permeate recovery at 68°C feed temperatures and seek co-authors for fouling kinetics and techno-economic LCA.',
    lookingFor: ['ASPEN Plus', 'Life Cycle Assessment', 'Membrane Fouling Analysis'],
    tags: ['Chemical-Engineering', 'Desalination', 'Process-Modeling', 'Preprint'],
    collaborators: ['seed-investigator-2'],
    sections: {
      abstract:
        'High-rise residential blocks discharge 65% of potable intake as low-contaminant greywater. We model a rooftop parabolic-trough driven hydrophobic PTFE membrane distillation module achieving 82% permeate recovery at 68°C feed temperatures.',
      introduction:
        'Conventional reverse osmosis suffers severe surfactant fouling on domestic greywater streams and requires high hydraulic pressures (15–25 bar). Direct-contact and vacuum membrane distillation operate near ambient pressure using low-grade solar thermal heat.',
      methodology:
        'A 0.22-micron expanded PTFE hollow-fiber contactor is coupled to a 4 m² evacuated-tube collector array. Mass transfer coefficients are solved across varying Reynolds numbers (Re = 400 to 1800) to quantify temperature polarization.',
      results:
        'Steady-state distillate flux reaches 14.8 kg/m²·h with 99.4% surfactant rejection. Seeking a collaborator to validate long-term scaling behavior and co-write Section 4 techno-economic analysis.',
      references:
        '[1] Lawson, K. W., & Lloyd, D. R. (1997). Membrane distillation. Journal of Membrane Science, 124(1), 1–25.'
    }
  },
  {
    code: 'SL-2026-102',
    title: 'Zero-Boiloff Passive Aerogel Cryostat for Portable Superconducting Magnetometers',
    discipline: 'Engineering & Hardware',
    status: 'Seeking Collaborators',
    ownerId: 'seed-investigator-1',
    ownerName: 'Dr. Elena Rostova',
    ownerAffiliation: 'Nordic Low-Temperature Institute',
    createdAt: Date.now() - 86400000 * 2,
    endorsements: 41,
    endorsedBy: [],
    abstract:
      'Field-deployable SQUID magnetometers for archaeological and mineral surveys are bottlenecked by bulky liquid-helium dewars. We are prototyping a multi-layer silica-aerogel vacuum jacket paired with a miniature pulse-tube cryocooler and seek an industrial designer to engineer a shock-isolated field chassis.',
    lookingFor: ['CAD / SolidWorks', 'Vibration Isolation', 'IP68 Enclosures'],
    tags: ['Cryogenics', 'Open-Hardware', 'Magnetometry', 'Aerogel'],
    collaborators: ['seed-investigator-1'],
    sections: {
      abstract:
        'Field-deployable SQUID magnetometers for archaeological and mineral surveys are bottlenecked by bulky liquid-helium dewars. We are prototyping a multi-layer silica-aerogel vacuum jacket paired with a miniature pulse-tube cryocooler.',
      introduction:
        'High-Tc superconducting quantum interference devices operate reliably at 77K, yet mechanical microphonics from portable coolers degrade magnetic flux sensitivity by two orders of magnitude.',
      methodology:
        'Opacified silica aerogel blankets (k = 11 mW/m·K) surround an oxygen-free high-conductivity copper cold finger decoupled via braided sapphire thermal straps.',
      results:
        'Parasitic heat leak measured at 340 mW at 77K ambient differential. Ready for mechanical chassis integration and field drop-testing.',
      references:
        '[1] Rostova, E. (2025). Thermal Boundary Resistance in Sintered Copper-Graphene Composites at 4K.'
    }
  },
  {
    code: 'SL-2026-103',
    title: 'Tidal Harmonics: Wind-Driven Brass & Saltwater Acoustic Organ on the North Sea',
    discipline: 'Art & Design',
    status: 'Showcase Only',
    ownerId: 'seed-investigator-3',
    ownerName: 'Marcus Vance',
    ownerAffiliation: 'Studio Kinetik, Rotterdam',
    createdAt: Date.now() - 86400000,
    endorsements: 52,
    endorsedBy: [],
    abstract:
      'An architectural sound sculpture installed along a Rotterdam tidal breakwater. Twenty-four marine-grade brass Helmholtz resonators are pressurized solely by rising tide displacement inside submerged concrete chambers, tuning their fundamental overtones to real-time barometric pressure.',
    lookingFor: [],
    tags: ['Kinetic-Sculpture', 'Acoustics', 'Marine-Architecture', 'Showcase'],
    collaborators: ['seed-investigator-3'],
    sections: {
      abstract:
        'An architectural sound sculpture installed along a Rotterdam tidal breakwater. Twenty-four marine-grade brass Helmholtz resonators are pressurized solely by rising tide displacement inside submerged concrete chambers.',
      introduction:
        'Coastal infrastructure is typically engineered for silent durability. Tidal Harmonics renders hydro-static pressure gradients audible to pedestrians without a single watt of grid electricity.',
      methodology:
        'Cast CuSn8 phosphor-bronze pipes machined on 5-axis CNC, coupled to cast-iron check valves and sacrificial zinc anodes to prevent galvanic corrosion.',
      results:
        'Completed 90-day winter storm deployment; acoustic output ranges from 52 dBA at slack tide to 74 dBA during spring ebb cycles.',
      references:
        '[1] Vance, M. (2025). Modular Repairable Field Enclosures for Citizen Science Instruments.'
    }
  }
];

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  useEditorialFonts();

  // Firebase Auth & User State
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [userProfiles, setUserProfiles] = useState({});

  // Firestore Collections State
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'workspaces' | 'profile' | 'guide'
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [studioSubTab, setStudioSubTab] = useState('manuscript'); // 'manuscript' | 'chat' | 'requests'

  // Filters
  const [disciplineFilter, setDisciplineFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [authModalMode, setAuthModalMode] = useState(null); // null | 'login' | 'signup'
  const [inspectProfileId, setInspectProfileId] = useState(null);
  const [detailProjectId, setDetailProjectId] = useState(null);
  const [applyProjectId, setApplyProjectId] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Archival Notification Banner
  const [notice, setNotice] = useState(null);
  const triggerNotice = (text, tone = 'forest') => {
    setNotice({ text, tone });
    setTimeout(() => setNotice(null), 4000);
  };

  // ==========================================================================
  // 1. FIREBASE AUTH INITIALIZATION (RULE 3: Auth First)
  // ==========================================================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Registered member = signed in with Email/Password (not anonymous guest)
  const isRegisteredMember = Boolean(firebaseUser && !firebaseUser.isAnonymous);
  const currentUserProfile = isRegisteredMember ? userProfiles[firebaseUser.uid] || null : null;

  // ==========================================================================
  // 2. REAL-TIME FIRESTORE LISTENERS (RULE 1 & RULE 2)
  // ==========================================================================
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    // Seed initial archival projects & dossiers once if database is completely empty
    const seedIfEmpty = async () => {
      try {
        const projCol = collection(db, 'artifacts', appId, 'public', 'data', 'projects');
        const snap = await getDocs(projCol);
        if (snap.empty) {
          for (const u of SEED_USERS) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', u.uid), u);
          }
          for (const p of SEED_PROJECTS) {
            await addDoc(projCol, p);
          }
        }
      } catch (err) {
        console.warn('Seed check skipped or failed:', err);
      }
    };
    seedIfEmpty();

    // Listener 1: User Dossiers
    const unsubUsers = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'users'),
      (snapshot) => {
        const map = {};
        snapshot.forEach((d) => {
          map[d.id] = { uid: d.id, ...d.data() };
        });
        setUserProfiles(map);
      },
      (err) => console.error('Users listener error:', err)
    );

    // Listener 2: Public Projects
    const unsubProjects = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'projects'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() });
        });
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProjects(list);
        setLoadingData(false);
      },
      (err) => {
        console.error('Projects listener error:', err);
        setLoadingData(false);
      }
    );

    // Listener 3: Collaboration Requests
    const unsubRequests = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'requests'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() });
        });
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setRequests(list);
      },
      (err) => console.error('Requests listener error:', err)
    );

    // Listener 4: Workspace Team Discussion Messages
    const unsubMessages = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'messages'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() });
        });
        list.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        setMessages(list);
      },
      (err) => console.error('Messages listener error:', err)
    );

    return () => {
      unsubUsers();
      unsubProjects();
      unsubRequests();
      unsubMessages();
    };
  }, [authReady, firebaseUser]);

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const dMatch = disciplineFilter === 'All' || p.discipline === disciplineFilter;
      const sMatch = statusFilter === 'All' || p.status === statusFilter;
      const q = searchQuery.trim().toLowerCase();
      const qMatch =
        !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.abstract || '').toLowerCase().includes(q) ||
        (p.ownerName || '').toLowerCase().includes(q) ||
        (p.code || '').toLowerCase().includes(q) ||
        (p.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (p.lookingFor || []).some((r) => r.toLowerCase().includes(q));
      return dMatch && sMatch && qMatch;
    });
  }, [projects, disciplineFilter, statusFilter, searchQuery]);

  const myWorkspaces = useMemo(() => {
    if (!isRegisteredMember || !firebaseUser) return [];
    return projects.filter(
      (p) =>
        p.ownerId === firebaseUser.uid ||
        (Array.isArray(p.collaborators) && p.collaborators.includes(firebaseUser.uid))
    );
  }, [projects, isRegisteredMember, firebaseUser]);

  const incomingPendingRequests = useMemo(() => {
    if (!isRegisteredMember || !firebaseUser) return [];
    const ownedIds = new Set(
      projects.filter((p) => p.ownerId === firebaseUser.uid).map((p) => p.id)
    );
    return requests.filter((r) => ownedIds.has(r.projectId) && r.status === 'pending');
  }, [projects, requests, isRegisteredMember, firebaseUser]);

  const activeWorkspace = useMemo(() => {
    if (myWorkspaces.length === 0) return null;
    return myWorkspaces.find((p) => p.id === selectedWorkspaceId) || myWorkspaces[0];
  }, [myWorkspaces, selectedWorkspaceId]);

  const detailProject = useMemo(
    () => projects.find((p) => p.id === detailProjectId) || null,
    [projects, detailProjectId]
  );

  const applyProject = useMemo(
    () => projects.find((p) => p.id === applyProjectId) || null,
    [projects, applyProjectId]
  );

  // ==========================================================================
  // AUTHENTICATION HANDLERS (SIGN UP, LOG IN, SIGN OUT)
  // ==========================================================================
  const handleSignUp = async (formData) => {
    const {
      name,
      email,
      password,
      affiliation,
      discipline,
      credentials,
      bio,
      skills,
      orcidUrl,
      githubUrl
    } = formData;

    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const uid = cred.user.uid;

    const dossier = {
      uid,
      name: name.trim(),
      email: email.trim(),
      affiliation: affiliation.trim(),
      discipline,
      credentials: credentials.trim(),
      bio: bio.trim(),
      skills,
      orcidUrl: orcidUrl.trim(),
      githubUrl: githubUrl.trim(),
      createdAt: Date.now()
    };

    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', uid), dossier);
    setAuthModalMode(null);
    triggerNotice(`Account created. Welcome to SynthLab, ${dossier.name}.`);
  };

  const handleLogIn = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    // Ensure a dossier document exists even if created externally
    const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', cred.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: cred.user.uid,
        name: email.split('@')[0],
        email: email.trim(),
        affiliation: 'Independent Researcher',
        discipline: 'Research Papers',
        credentials: 'Verified SynthLab Member',
        bio: '',
        skills: [],
        orcidUrl: '',
        githubUrl: '',
        createdAt: Date.now()
      });
    }
    setAuthModalMode(null);
    triggerNotice('Signed in to your SynthLab investigator account.');
  };

  const handleQuickDemoAccount = async () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const demoEmail = `researcher.${rand}@synthlab-demo.org`;
    const demoPass = 'SynthLab2026!';
    await handleSignUp({
      name: `Dr. Kiran Verma #${rand}`,
      email: demoEmail,
      password: demoPass,
      affiliation: 'Independent Systems & Materials Lab',
      discipline: 'Engineering & Hardware',
      credentials: 'M.Tech. Systems Engineering • Open-Hardware Contributor',
      bio: 'Exploring low-power acoustic telemetry, membrane separation, and reproducible open-source instrumentation.',
      skills: ['CFD Simulation', 'Membrane Fouling Analysis', 'Embedded Rust', 'LaTeX'],
      orcidUrl: 'https://orcid.org/0000-0002-1234-5678',
      githubUrl: 'https://github.com/synthlab-demo'
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await signInAnonymously(auth);
      setActiveTab('feed');
      triggerNotice('Signed out. You are browsing as a Guest Reader.', 'cobalt');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // ==========================================================================
  // CORE FIRESTORE MUTATIONS (PROJECTS, REQUESTS, PROFILE)
  // ==========================================================================
  const requireMember = (actionLabel = 'perform this action') => {
    if (!isRegisteredMember) {
      triggerNotice(`Please Log In or Create an Account to ${actionLabel}.`, 'cobalt');
      setAuthModalMode('signup');
      return false;
    }
    return true;
  };

  const handleToggleEndorse = async (project) => {
    if (!requireMember('endorse projects')) return;
    const uid = firebaseUser.uid;
    const endorsedBy = Array.isArray(project.endorsedBy) ? project.endorsedBy : [];
    const already = endorsedBy.includes(uid);
    const nextEndorsedBy = already ? endorsedBy.filter((id) => id !== uid) : [...endorsedBy, uid];
    const nextCount = Math.max(0, (project.endorsements || 0) + (already ? -1 : 1));

    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', project.id), {
      endorsedBy: nextEndorsedBy,
      endorsements: nextCount
    });
  };

  const handleCreateProject = async ({ title, discipline, mode, abstract, lookingFor, tags }) => {
    if (!requireMember('publish a proposal')) return;
    const uid = firebaseUser.uid;
    const authorName = currentUserProfile?.name || firebaseUser.email;
    const authorAffiliation = currentUserProfile?.affiliation || 'Independent Researcher';
    const code = `SL-${new Date().getFullYear()}-${Math.floor(200 + Math.random() * 799)}`;

    const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'projects'), {
      code,
      title: title.trim(),
      discipline,
      status: mode,
      ownerId: uid,
      ownerName: authorName,
      ownerAffiliation: authorAffiliation,
      createdAt: Date.now(),
      endorsements: 1,
      endorsedBy: [uid],
      abstract: abstract.trim(),
      lookingFor: mode === 'Seeking Collaborators' ? lookingFor : [],
      tags,
      collaborators: [uid],
      sections: {
        abstract: abstract.trim(),
        introduction: 'State the background literature, motivation, or engineering problem here...',
        methodology: 'Document experimental setup, mathematical model, or fabrication steps...',
        results: 'Working draft initialized — record benchmarks, observations, and measurements here.',
        references: '[1] Add primary citations, datasets, or bill of materials.'
      }
    });

    setShowPublishModal(false);
    setSelectedWorkspaceId(docRef.id);
    setActiveTab('workspaces');
    setStudioSubTab('manuscript');
    triggerNotice(`Published ${code} to the public archive.`);
  };

  const handleDeleteProject = async (projectId) => {
    if (!isRegisteredMember) return;
    const target = projects.find((p) => p.id === projectId);
    if (!target || target.ownerId !== firebaseUser.uid) return;

    await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'projects', projectId));
    setConfirmDeleteId(null);
    if (detailProjectId === projectId) setDetailProjectId(null);
    triggerNotice(`Deleted "${target.title.slice(0, 38)}..."`, 'rust');
  };

  const handleSubmitCollabRequest = async (projectId, proposedRole, pitch) => {
    if (!requireMember('send a collaboration request')) return;
    const uid = firebaseUser.uid;
    const targetProject = projects.find((p) => p.id === projectId);
    if (!targetProject || targetProject.ownerId === uid) return;

    const alreadyPending = requests.some(
      (r) => r.projectId === projectId && r.applicantId === uid && r.status === 'pending'
    );
    if (alreadyPending) {
      triggerNotice('You already have a pending request on this project.', 'cobalt');
      setApplyProjectId(null);
      return;
    }

    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'requests'), {
      projectId,
      projectTitle: targetProject.title,
      ownerId: targetProject.ownerId,
      applicantId: uid,
      applicantName: currentUserProfile?.name || firebaseUser.email,
      applicantAffiliation: currentUserProfile?.affiliation || 'Independent Researcher',
      applicantCredentials: currentUserProfile?.credentials || 'Verified Member',
      applicantSkills: currentUserProfile?.skills || [],
      proposedRole: proposedRole.trim() || 'Co-Author / Collaborator',
      pitch: pitch.trim(),
      status: 'pending',
      createdAt: Date.now()
    });

    setApplyProjectId(null);
    triggerNotice('Collaboration request & verified dossier sent to the project lead.');
  };

  const handleDecideRequest = async (reqItem, decision) => {
    if (!isRegisteredMember) return;

    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'requests', reqItem.id), {
      status: decision
    });

    if (decision === 'accepted') {
      const targetProj = projects.find((p) => p.id === reqItem.projectId);
      if (targetProj) {
        const nextCollabs = Array.from(
          new Set([...(targetProj.collaborators || []), reqItem.applicantId])
        );
        await updateDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'projects', reqItem.projectId),
          {
            collaborators: nextCollabs
          }
        );
      }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
        projectId: reqItem.projectId,
        senderId: firebaseUser.uid,
        senderName: 'System',
        senderRole: 'Workspace',
        text: `${reqItem.applicantName} (${reqItem.proposedRole}) was accepted onto the team.`,
        isSystem: true,
        createdAt: Date.now()
      });
    }

    triggerNotice(
      decision === 'accepted'
        ? `Accepted ${reqItem.applicantName} onto the project team.`
        : `Declined request from ${reqItem.applicantName}.`,
      decision === 'accepted' ? 'forest' : 'rust'
    );
  };

  const handleSaveProfile = async (updatedFields) => {
    if (!isRegisteredMember) return;
    const uid = firebaseUser.uid;
    await setDoc(
      doc(db, 'artifacts', appId, 'public', 'data', 'users', uid),
      {
        ...currentUserProfile,
        ...updatedFields,
        uid,
        email: firebaseUser.email
      },
      { merge: true }
    );
    triggerNotice('Investigator dossier saved to cloud.');
  };

  const copyText = (txt, msg = 'Copied to clipboard') => {
    const el = document.createElement('textarea');
    el.value = txt;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    triggerNotice(msg);
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div
      className="min-h-screen bg-[#F8F7F4] text-[#18181B] flex flex-col selection:bg-[#1B4332] selection:text-white"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Subtle Archival Notification Toast */}
      {notice && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-2.5 border text-xs font-medium shadow-md flex items-center gap-2.5 ${
            notice.tone === 'rust'
              ? 'bg-[#B84A27] text-white border-[#8E3519]'
              : notice.tone === 'cobalt'
              ? 'bg-[#1E40AF] text-white border-[#1E3A8A]'
              : 'bg-[#1B4332] text-white border-[#112B20]'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-white inline-block" />
          <span>{notice.text}</span>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EDITORIAL MASTHEAD & ACCOUNT BAR                                     */}
      {/* ==================================================================== */}
      <header className="sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-xs border-b border-[#E2DFD7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Masthead */}
          <button
            onClick={() => setActiveTab('feed')}
            className="flex items-baseline gap-3 text-left focus:outline-none cursor-pointer"
          >
            <span
              className="text-2xl sm:text-3xl tracking-tight text-[#18181B] font-semibold"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              SynthLab
            </span>
            <span
              className="hidden xl:inline-block text-[11px] uppercase tracking-widest text-[#52525B] border-l border-[#E2DFD7] pl-3"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Archival Research &amp; Engineering Commons
            </span>
          </button>

          {/* Center Navigation */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'feed'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-transparent text-[#52525B] border-transparent hover:text-[#18181B] hover:bg-[#F1EFEA]'
              }`}
            >
              <Icon name="compass" className="w-3.5 h-3.5" />
              <span>Explore Feed</span>
            </button>

            <button
              onClick={() => {
                if (!requireMember('access your collaborative workspaces')) return;
                setActiveTab('workspaces');
              }}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'workspaces'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-transparent text-[#52525B] border-transparent hover:text-[#18181B] hover:bg-[#F1EFEA]'
              }`}
            >
              <Icon name="folder" className="w-3.5 h-3.5" />
              <span>My Workspaces</span>
              {incomingPendingRequests.length > 0 ? (
                <span
                  className="ml-1 px-1.5 py-0.2 bg-[#B84A27] text-white text-[10px] font-bold"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {incomingPendingRequests.length} NEW
                </span>
              ) : isRegisteredMember ? (
                <span
                  className="ml-0.5 text-[11px] opacity-70"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  ({myWorkspaces.length})
                </span>
              ) : null}
            </button>

            {isRegisteredMember && (
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 py-1.5 text-xs sm:text-sm font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-transparent text-[#52525B] border-transparent hover:text-[#18181B] hover:bg-[#F1EFEA]'
                }`}
              >
                <Icon name="user" className="w-3.5 h-3.5" />
                <span className="hidden md:inline">My Profile</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-2.5 py-1.5 text-xs font-medium border transition-colors hidden lg:flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#1E40AF] text-white border-[#1E40AF]'
                  : 'bg-[#F8F7F4] text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
              }`}
            >
              <Icon name="bookOpen" className="w-3.5 h-3.5" />
              <span>How It Works</span>
            </button>
          </nav>

          {/* Right Account & Publish Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!requireMember('publish a new idea or project')) return;
                setShowPublishModal(true);
              }}
              className="px-3 py-1.5 bg-[#1B4332] hover:bg-[#143326] text-white text-xs sm:text-sm font-medium border border-[#1B4332] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="plus" className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Publish Idea</span>
            </button>

            {isRegisteredMember ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E2DFD7]">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hidden md:flex flex-col text-right hover:underline cursor-pointer"
                >
                  <span className="text-xs font-semibold text-[#18181B] leading-none">
                    {currentUserProfile?.name || firebaseUser?.email}
                  </span>
                  <span
                    className="text-[10px] text-[#52525B] mt-0.5"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    VERIFIED MEMBER
                  </span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 border border-[#E2DFD7] bg-[#F8F7F4] hover:border-[#B84A27] hover:text-[#B84A27] text-[#52525B] transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <Icon name="logOut" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#E2DFD7]">
                <button
                  onClick={() => setAuthModalMode('login')}
                  className="px-3 py-1.5 border border-[#E2DFD7] bg-white hover:border-[#18181B] text-xs font-semibold text-[#18181B] cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => setAuthModalMode('signup')}
                  className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-semibold cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* TAB 1: EXPLORE FEED                                                  */}
      {/* ==================================================================== */}
      {activeTab === 'feed' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {/* Editorial Masthead Intro */}
          <div className="border-b border-[#E2DFD7] pb-6 mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div
                className="text-[11px] uppercase tracking-widest text-[#1B4332] font-semibold mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                OPEN RESEARCH ARCHIVE &amp; COLLABORATIVE BUILD INDEX
              </div>
              <h1
                className="text-3xl sm:text-4xl text-[#18181B] leading-tight font-medium"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Publish research proposals, inspect peer qualifications, and co-author findings.
              </h1>
            </div>

            {!isRegisteredMember ? (
              <div className="bg-white border border-[#E2DFD7] p-3.5 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[#52525B]">
                  Browsing as <strong className="text-[#18181B]">Guest Reader</strong>. Create an account to collaborate or publish.
                </span>
                <button
                  onClick={() => setAuthModalMode('signup')}
                  className="px-3 py-1.5 bg-[#1B4332] text-white font-semibold cursor-pointer"
                >
                  Create Free Account
                </button>
              </div>
            ) : (
              <div className="text-xs text-[#52525B]">
                Signed in as <strong className="text-[#18181B]">{currentUserProfile?.name}</strong> •{' '}
                <button
                  onClick={() => setActiveTab('guide')}
                  className="text-[#1E40AF] underline font-medium cursor-pointer"
                >
                  Multi-user testing guide →
                </button>
              </div>
            )}
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white border border-[#E2DFD7] p-4 mb-6 space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#52525B] pointer-events-none">
                <Icon name="search" className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by paper title, DOI code, required skill (e.g., ASPEN Plus, CAD), or investigator name..."
                className="w-full pl-9 pr-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm text-[#18181B] placeholder-[#52525B]/70 focus:outline-none focus:bg-white focus:border-[#18181B]"
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-[#E2DFD7]">
              <div className="flex flex-wrap items-center gap-1.5">
                {DISCIPLINES.map((disc) => (
                  <button
                    key={disc}
                    onClick={() => setDisciplineFilter(disc)}
                    className={`px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                      disciplineFilter === disc
                        ? 'bg-[#1B4332] text-white border-[#1B4332]'
                        : 'bg-[#F8F7F4] text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
                    }`}
                  >
                    {disc}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {STATUS_FILTERS.map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                      statusFilter === st
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-white text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Cards */}
          {loadingData ? (
            <div className="bg-white border border-[#E2DFD7] p-12 text-center text-xs text-[#52525B]">
              Loading archival index from Firestore...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white border border-[#E2DFD7] p-12 text-center space-y-3">
              <p
                className="text-2xl text-[#18181B]"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                No matching proposals found.
              </p>
              <button
                onClick={() => {
                  setDisciplineFilter('All');
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => {
                const authorDossier = userProfiles[project.ownerId];
                const displayAuthorName = authorDossier?.name || project.ownerName || 'Investigator';
                const displayCreds =
                  authorDossier?.credentials ||
                  project.ownerAffiliation ||
                  'Verified SynthLab Investigator';

                const isOwner = isRegisteredMember && project.ownerId === firebaseUser?.uid;
                const isMember =
                  isRegisteredMember &&
                  (isOwner ||
                    (Array.isArray(project.collaborators) &&
                      project.collaborators.includes(firebaseUser?.uid)));
                const hasPendingReq =
                  isRegisteredMember &&
                  requests.some(
                    (r) =>
                      r.projectId === project.id &&
                      r.applicantId === firebaseUser?.uid &&
                      r.status === 'pending'
                  );
                const isEndorsed =
                  isRegisteredMember &&
                  Array.isArray(project.endorsedBy) &&
                  project.endorsedBy.includes(firebaseUser?.uid);

                return (
                  <article
                    key={project.id}
                    className="bg-white border border-[#E2DFD7] hover:border-[#18181B]/50 transition-colors flex flex-col justify-between p-6"
                  >
                    <div>
                      {/* Metadata Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E2DFD7]">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[11px] font-semibold text-[#52525B]"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {project.code || project.id.slice(0, 8)}
                          </span>
                          <span className="text-[#E2DFD7]">|</span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E40AF]">
                            {project.discipline}
                          </span>
                        </div>

                        <span
                          className={`px-2 py-0.5 text-[11px] font-semibold border ${
                            project.status === 'Seeking Collaborators'
                              ? 'bg-[#FDF4F1] text-[#B84A27] border-[#B84A27]/30'
                              : project.status === 'Published Findings'
                              ? 'bg-[#EFF5F1] text-[#1B4332] border-[#1B4332]/30'
                              : 'bg-[#F1EFEA] text-[#52525B] border-[#E2DFD7]'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        onClick={() => setDetailProjectId(project.id)}
                        className="text-2xl text-[#18181B] hover:text-[#1B4332] cursor-pointer leading-snug mb-3 font-medium"
                        style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      >
                        {project.title}
                      </h2>

                      {/* Author & Qualifications Strip */}
                      <div className="flex items-center justify-between gap-2 mb-4 bg-[#F8F7F4] border border-[#E2DFD7] px-3 py-2">
                        <button
                          onClick={() => setInspectProfileId(project.ownerId)}
                          className="flex items-center gap-2.5 text-left group cursor-pointer"
                        >
                          <div className="w-7 h-7 bg-[#18181B] text-white text-xs font-semibold flex items-center justify-center shrink-0">
                            {displayAuthorName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#18181B] group-hover:underline">
                              {displayAuthorName}{' '}
                              <span className="text-[11px] font-normal text-[#1B4332]">
                                [Inspect Qualifications]
                              </span>
                            </div>
                            <div
                              className="text-[11px] text-[#52525B] line-clamp-1"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {displayCreds}
                            </div>
                          </div>
                        </button>

                        <span
                          className="text-[11px] text-[#52525B] shrink-0"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {(project.collaborators || []).length} Member
                          {(project.collaborators || []).length > 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Abstract */}
                      <p className="text-sm text-[#18181B]/85 leading-relaxed line-clamp-3 mb-4">
                        {project.abstract}
                      </p>

                      {/* Needed Collaborator Skills */}
                      {project.status === 'Seeking Collaborators' &&
                        Array.isArray(project.lookingFor) &&
                        project.lookingFor.length > 0 && (
                          <div className="mb-4 p-3 bg-[#FDF4F1]/60 border border-[#B84A27]/25">
                            <div
                              className="text-[10px] uppercase tracking-wider font-semibold text-[#B84A27] mb-1.5"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              Seeking Collaborators With:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.lookingFor.map((role, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 bg-white border border-[#E2DFD7] text-xs font-medium text-[#18181B]"
                                >
                                  {role}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>

                    {/* Footer Controls */}
                    <div className="pt-3 border-t border-[#E2DFD7] flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleEndorse(project)}
                          className={`px-2.5 py-1.5 text-xs font-medium border flex items-center gap-1 transition-colors cursor-pointer ${
                            isEndorsed
                              ? 'bg-[#1B4332] text-white border-[#1B4332]'
                              : 'bg-[#F8F7F4] text-[#18181B] border-[#E2DFD7] hover:border-[#18181B]'
                          }`}
                          title="Endorse proposal"
                        >
                          <Icon name="arrowUp" className="w-3.5 h-3.5" />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {project.endorsements || 0}
                          </span>
                        </button>

                        {isOwner && (
                          <>
                            {confirmDeleteId === project.id ? (
                              <div className="flex items-center gap-1 bg-[#FDF4F1] border border-[#B84A27] px-2 py-1">
                                <span className="text-[11px] font-semibold text-[#B84A27]">
                                  Delete?
                                </span>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="text-[11px] font-bold underline text-[#B84A27] px-1 cursor-pointer"
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="text-[11px] text-[#52525B] px-1 cursor-pointer"
                                >
                                  No
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(project.id)}
                                className="p-1.5 border border-[#E2DFD7] bg-[#F8F7F4] text-[#52525B] hover:text-[#B84A27] hover:border-[#B84A27] transition-colors cursor-pointer"
                                title="Delete your project"
                              >
                                <Icon name="trash" className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetailProjectId(project.id)}
                          className="px-3 py-1.5 border border-[#E2DFD7] bg-white hover:border-[#18181B] text-xs font-medium text-[#18181B] cursor-pointer"
                        >
                          Read Paper
                        </button>

                        {isMember ? (
                          <button
                            onClick={() => {
                              setSelectedWorkspaceId(project.id);
                              setActiveTab('workspaces');
                            }}
                            className="px-3 py-1.5 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-medium cursor-pointer"
                          >
                            Open Workspace →
                          </button>
                        ) : project.status === 'Seeking Collaborators' ? (
                          hasPendingReq ? (
                            <span className="px-3 py-1.5 bg-[#F1EFEA] border border-[#E2DFD7] text-[#52525B] text-xs font-semibold">
                              Request Sent
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                if (!requireMember('send a collaboration request')) return;
                                setApplyProjectId(project.id);
                              }}
                              className="px-3 py-1.5 bg-[#B84A27] hover:bg-[#9B3D1F] text-white text-xs font-medium cursor-pointer"
                            >
                              Request to Collaborate
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: MY WORKSPACES (CO-WRITING STUDIO, CHAT & REQUESTS)            */}
      {/* ==================================================================== */}
      {activeTab === 'workspaces' && (
        <WorkspaceStudio
          firebaseUser={firebaseUser}
          currentUserProfile={currentUserProfile}
          userProfiles={userProfiles}
          myWorkspaces={myWorkspaces}
          activeWorkspace={activeWorkspace}
          setSelectedWorkspaceId={setSelectedWorkspaceId}
          studioSubTab={studioSubTab}
          setStudioSubTab={setStudioSubTab}
          requests={requests}
          messages={messages}
          onDecideRequest={handleDecideRequest}
          onDeleteProject={handleDeleteProject}
          onInspectProfile={(uid) => setInspectProfileId(uid)}
          onOpenPublishModal={() => setShowPublishModal(true)}
          triggerNotice={triggerNotice}
          copyText={copyText}
        />
      )}

      {/* ==================================================================== */}
      {/* TAB 3: MY PROFILE & QUALIFICATIONS                                   */}
      {/* ==================================================================== */}
      {activeTab === 'profile' && isRegisteredMember && (
        <ProfileEditor
          firebaseUser={firebaseUser}
          profile={currentUserProfile}
          onSave={handleSaveProfile}
        />
      )}

      {/* ==================================================================== */}
      {/* TAB 4: HOW IT WORKS & MULTI-USER TESTING GUIDE                       */}
      {/* ==================================================================== */}
      {activeTab === 'guide' && (
        <HowItWorksGuide
          isRegisteredMember={isRegisteredMember}
          onOpenSignUp={() => setAuthModalMode('signup')}
          onGoToFeed={() => setActiveTab('feed')}
          onGoToWorkspaces={() => {
            if (!requireMember('open your workspaces')) return;
            setActiveTab('workspaces');
          }}
        />
      )}

      {/* ==================================================================== */}
      {/* MODAL: AUTHENTICATION (SIGN UP & LOG IN)                             */}
      {/* ==================================================================== */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSignUp={handleSignUp}
          onLogIn={handleLogIn}
          onQuickDemo={handleQuickDemoAccount}
        />
      )}

      {/* ==================================================================== */}
      {/* MODAL: READ PAPER / PROJECT DETAIL                                   */}
      {/* ==================================================================== */}
      {detailProject && (
        <ProjectReaderModal
          project={detailProject}
          firebaseUser={firebaseUser}
          isRegisteredMember={isRegisteredMember}
          userProfiles={userProfiles}
          requests={requests}
          onClose={() => setDetailProjectId(null)}
          onInspectProfile={(uid) => setInspectProfileId(uid)}
          onOpenApply={(id) => {
            if (!requireMember('send a collaboration request')) return;
            setDetailProjectId(null);
            setApplyProjectId(id);
          }}
          onOpenWorkspace={(id) => {
            setDetailProjectId(null);
            setSelectedWorkspaceId(id);
            setActiveTab('workspaces');
          }}
          onDeleteProject={handleDeleteProject}
          copyText={copyText}
        />
      )}

      {/* ==================================================================== */}
      {/* MODAL: COLLABORATION REQUEST                                         */}
      {/* ==================================================================== */}
      {applyProject && isRegisteredMember && (
        <CollaborationRequestModal
          project={applyProject}
          applicantProfile={currentUserProfile}
          firebaseUser={firebaseUser}
          onClose={() => setApplyProjectId(null)}
          onSubmit={handleSubmitCollabRequest}
        />
      )}

      {/* ==================================================================== */}
      {/* MODAL: INSPECT INVESTIGATOR DOSSIER                                  */}
      {/* ==================================================================== */}
      {inspectProfileId && (
        <DossierModal
          profile={
            userProfiles[inspectProfileId] || {
              uid: inspectProfileId,
              name: 'SynthLab Investigator',
              affiliation: 'Independent Researcher',
              credentials: 'Verified Account',
              bio: 'Profile details not yet populated.',
              skills: []
            }
          }
          onClose={() => setInspectProfileId(null)}
        />
      )}

      {/* ==================================================================== */}
      {/* MODAL: PUBLISH NEW IDEA / PROPOSAL                                   */}
      {/* ==================================================================== */}
      {showPublishModal && isRegisteredMember && (
        <PublishProposalModal
          onClose={() => setShowPublishModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}

// ============================================================================
// AUTHENTICATION MODAL (REAL FIREBASE SIGN UP + LOG IN + QUICK DEMO)
// ============================================================================
function AuthModal({ initialMode, onClose, onSignUp, onLogIn, onQuickDemo }) {
  const [mode, setMode] = useState(initialMode); // 'signup' | 'login'
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [discipline, setDiscipline] = useState('Research Papers');
  const [credentials, setCredentials] = useState('');
  const [bio, setBio] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [orcidUrl, setOrcidUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setBusy(true);
    try {
      await onLogIn(loginEmail, loginPassword);
    } catch (err) {
      setErrorMsg(err?.message?.replace('Firebase:', '').trim() || 'Could not sign in.');
      setBusy(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    try {
      await onSignUp({
        name,
        email,
        password,
        affiliation,
        discipline,
        credentials,
        bio,
        skills: skillsText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        orcidUrl,
        githubUrl
      });
    } catch (err) {
      setErrorMsg(err?.message?.replace('Firebase:', '').trim() || 'Could not create account.');
      setBusy(false);
    }
  };

  const handleDemoClick = async () => {
    setErrorMsg('');
    setBusy(true);
    try {
      await onQuickDemo();
    } catch (err) {
      setErrorMsg(err?.message?.replace('Firebase:', '').trim() || 'Demo sign-up failed.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18181B]/55 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#18181B] max-w-xl w-full shadow-xl my-8">
        {/* Top Mode Tabs */}
        <div className="bg-[#F1EFEA] border-b border-[#E2DFD7] px-6 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t border-x cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-[#18181B] border-[#E2DFD7]'
                  : 'bg-transparent text-[#52525B] border-transparent hover:text-[#18181B]'
              }`}
            >
              Create Account (Sign Up)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-t border-x cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#18181B] border-[#E2DFD7]'
                  : 'bg-transparent text-[#52525B] border-transparent hover:text-[#18181B]'
              }`}
            >
              Log In
            </button>
          </div>

          <button
            onClick={onClose}
            className="pb-2 text-[#52525B] hover:text-[#18181B] cursor-pointer"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7 space-y-5 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-[#FDF4F1] border border-[#B84A27] text-xs font-medium text-[#B84A27]">
              {errorMsg}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h2
                  className="text-2xl text-[#18181B] font-medium"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  Sign In to Your Investigator Account
                </h2>
                <p className="text-xs text-[#52525B] mt-1">
                  Access your published proposals, collaboration requests, and co-writing studios.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="researcher@university.edu"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                {busy ? 'Authenticating...' : 'Log In'}
              </button>

              <div className="pt-3 border-t border-[#E2DFD7] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                <span className="text-[#52525B]">Testing in a second browser window?</span>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleDemoClick}
                  className="px-3 py-1.5 bg-[#F8F7F4] border border-[#E2DFD7] hover:border-[#18181B] font-semibold text-[#18181B] cursor-pointer"
                >
                  Instant 1-Click Demo Account
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <h2
                  className="text-2xl text-[#18181B] font-medium"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  Register Investigator &amp; Maker Dossier
                </h2>
                <p className="text-xs text-[#52525B] mt-1">
                  Your qualifications and skills are displayed when you publish ideas or request to join teams.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ameen Shaikh"
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    Primary Discipline *
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  >
                    {DISCIPLINES.filter((d) => d !== 'All').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    Password (min 6 chars) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Role / Institutional Affiliation *
                </label>
                <input
                  type="text"
                  required
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder="e.g., B.Chem.Engg. Student, ICT Mumbai / Independent Systems Engineer"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Qualifications, Degrees &amp; Notable Work *
                </label>
                <input
                  type="text"
                  required
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  placeholder="e.g., M.Sc. Physics • 2 Preprints in Process Simulation & Edge Sensing"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Skills &amp; Competencies (Comma-separated)
                </label>
                <input
                  type="text"
                  value={skillsText}
                  onChange={(e) => setSkillsText(e.target.value)}
                  placeholder="e.g., Python, ASPEN Plus, CAD, LaTeX, Technical Writing"
                  className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                  Research Bio &amp; Interests
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Briefly describe the kinds of papers, prototypes, or creative builds you want to work on..."
                  className="w-full p-2.5 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    ORCID URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={orcidUrl}
                    onChange={(e) => setOrcidUrl(e.target.value)}
                    placeholder="https://orcid.org/..."
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                    GitHub / Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleDemoClick}
                  className="text-xs text-[#1E40AF] underline font-medium cursor-pointer"
                >
                  Or create an instant 1-click demo account →
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
                >
                  {busy ? 'Creating Account...' : 'Create Account & Enter'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// WORKSPACE STUDIO (MANUSCRIPT CO-WRITING, TEAM CHAT & COLLAB REQUESTS)
// ============================================================================
function WorkspaceStudio({
  firebaseUser,
  currentUserProfile,
  userProfiles,
  myWorkspaces,
  activeWorkspace,
  setSelectedWorkspaceId,
  studioSubTab,
  setStudioSubTab,
  requests,
  messages,
  onDecideRequest,
  onDeleteProject,
  onInspectProfile,
  onOpenPublishModal,
  triggerNotice,
  copyText
}) {
  const [activeSection, setActiveSection] = useState('abstract');
  const [editorText, setEditorText] = useState('');
  const [previewPaper, setPreviewPaper] = useState(false);
  const [chatText, setChatText] = useState('');
  const [confirmDeleteStudio, setConfirmDeleteStudio] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (activeWorkspace) {
      setEditorText(activeWorkspace.sections?.[activeSection] || '');
      setConfirmDeleteStudio(false);
    }
  }, [activeWorkspace?.id, activeSection]);

  const workspaceRequests = useMemo(() => {
    if (!activeWorkspace) return [];
    return requests.filter((r) => r.projectId === activeWorkspace.id);
  }, [requests, activeWorkspace]);

  const pendingCount = workspaceRequests.filter((r) => r.status === 'pending').length;

  const workspaceMessages = useMemo(() => {
    if (!activeWorkspace) return [];
    return messages.filter((m) => m.projectId === activeWorkspace.id);
  }, [messages, activeWorkspace]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [workspaceMessages.length, studioSubTab]);

  if (myWorkspaces.length === 0) {
    return (
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#E2DFD7] p-10 space-y-4">
          <h2
            className="text-3xl text-[#18181B] font-medium"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            No Active Workspaces Yet
          </h2>
          <p className="text-sm text-[#52525B] max-w-md mx-auto">
            Publish your own research proposal or request to collaborate on an open project in the Explore Feed. Once accepted onto a team, it appears here.
          </p>
          <button
            onClick={onOpenPublishModal}
            className="px-5 py-2.5 bg-[#1B4332] text-white text-xs font-semibold cursor-pointer"
          >
            + Publish New Idea
          </button>
        </div>
      </main>
    );
  }

  const isOwner = activeWorkspace.ownerId === firebaseUser?.uid;
  const wordCount = editorText.trim() ? editorText.trim().split(/\s+/).length : 0;

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      const nextSections = {
        ...(activeWorkspace.sections || {}),
        [activeSection]: editorText
      };
      const updates = { sections: nextSections };
      if (activeSection === 'abstract') {
        updates.abstract = editorText;
      }
      await updateDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeWorkspace.id),
        updates
      );
      triggerNotice('Section saved & synced with collaborators.');
    } catch (err) {
      console.error('Save section error:', err);
    } finally {
      setSavingSection(false);
    }
  };

  const handlePublishFindings = async () => {
    await updateDoc(
      doc(db, 'artifacts', appId, 'public', 'data', 'projects', activeWorkspace.id),
      {
        status: 'Published Findings',
        abstract: activeWorkspace.sections?.abstract || activeWorkspace.abstract
      }
    );
    triggerNotice('Findings published publicly in the Explore Feed!');
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'messages'), {
      projectId: activeWorkspace.id,
      senderId: firebaseUser.uid,
      senderName: currentUserProfile?.name || firebaseUser.email,
      senderRole: currentUserProfile?.affiliation || 'Collaborator',
      text: chatText.trim(),
      isSystem: false,
      createdAt: Date.now()
    });
    setChatText('');
  };

  const insertSnippet = (snippet) => {
    setEditorText((prev) => `${prev}${prev ? '\n\n' : ''}${snippet}`);
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Sidebar: Workspaces List */}
      <aside className="lg:col-span-3 bg-white border border-[#E2DFD7] p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD7]">
          <span
            className="text-[11px] uppercase tracking-wider font-semibold text-[#52525B]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Your Studios ({myWorkspaces.length})
          </span>
          <button
            onClick={onOpenPublishModal}
            className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
          >
            + New
          </button>
        </div>

        <div className="space-y-2">
          {myWorkspaces.map((ws) => {
            const wsPending = requests.filter(
              (r) => r.projectId === ws.id && r.status === 'pending'
            ).length;
            const selected = ws.id === activeWorkspace.id;

            return (
              <button
                key={ws.id}
                onClick={() => setSelectedWorkspaceId(ws.id)}
                className={`w-full text-left p-3 border transition-colors cursor-pointer ${
                  selected
                    ? 'bg-[#18181B] text-white border-[#18181B]'
                    : 'bg-[#F8F7F4] text-[#18181B] border-[#E2DFD7] hover:border-[#18181B]'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span
                    className={`text-[10px] ${selected ? 'text-white/70' : 'text-[#52525B]'}`}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {ws.code || ws.id.slice(0, 8)}
                  </span>
                  {ws.ownerId === firebaseUser?.uid && wsPending > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#B84A27] text-white text-[10px] font-bold">
                      {wsPending} REQ
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold line-clamp-2 leading-snug">{ws.title}</div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Main Studio Content */}
      <section className="lg:col-span-9 space-y-5">
        {/* Studio Header */}
        <div className="bg-white border border-[#E2DFD7] p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span
                  className="text-xs font-semibold text-[#52525B]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {activeWorkspace.code || activeWorkspace.id.slice(0, 8)}
                </span>
                <span className="text-[#E2DFD7]">•</span>
                <span className="text-xs font-semibold text-[#1E40AF]">
                  {activeWorkspace.discipline}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#EFF5F1] text-[#1B4332] border border-[#1B4332]/30">
                  {activeWorkspace.status}
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl text-[#18181B] leading-tight font-medium"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                {activeWorkspace.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {isOwner && activeWorkspace.status !== 'Published Findings' && (
                <button
                  onClick={handlePublishFindings}
                  className="px-3.5 py-2 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold cursor-pointer"
                >
                  Publish Findings
                </button>
              )}

              {isOwner && (
                <>
                  {confirmDeleteStudio ? (
                    <div className="flex items-center gap-2 bg-[#FDF4F1] border border-[#B84A27] px-3 py-1.5">
                      <span className="text-xs font-semibold text-[#B84A27]">
                        Delete project?
                      </span>
                      <button
                        onClick={() => onDeleteProject(activeWorkspace.id)}
                        className="text-xs font-bold underline text-[#B84A27] cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteStudio(false)}
                        className="text-xs text-[#52525B] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteStudio(true)}
                      className="px-3 py-2 border border-[#E2DFD7] bg-white hover:border-[#B84A27] hover:text-[#B84A27] text-xs font-medium text-[#52525B] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                      <span>Delete Project</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Studio Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#E2DFD7]">
            <button
              onClick={() => setStudioSubTab('manuscript')}
              className={`px-3.5 py-1.5 text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                studioSubTab === 'manuscript'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-[#F8F7F4] text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
              }`}
            >
              <Icon name="fileText" className="w-3.5 h-3.5" />
              <span>Manuscript &amp; Project Editor</span>
            </button>

            <button
              onClick={() => setStudioSubTab('chat')}
              className={`px-3.5 py-1.5 text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                studioSubTab === 'chat'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-[#F8F7F4] text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
              }`}
            >
              <Icon name="chat" className="w-3.5 h-3.5" />
              <span>Team Discussion ({workspaceMessages.length})</span>
            </button>

            <button
              onClick={() => setStudioSubTab('requests')}
              className={`px-3.5 py-1.5 text-xs font-semibold border flex items-center gap-1.5 cursor-pointer ${
                studioSubTab === 'requests'
                  ? 'bg-[#18181B] text-white border-[#18181B]'
                  : 'bg-[#F8F7F4] text-[#52525B] border-[#E2DFD7] hover:text-[#18181B]'
              }`}
            >
              <Icon name="users" className="w-3.5 h-3.5" />
              <span>Team &amp; Collab Requests</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 bg-[#B84A27] text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* SUB-TAB 1: MANUSCRIPT EDITOR */}
        {studioSubTab === 'manuscript' && (
          <div className="bg-white border border-[#E2DFD7]">
            <div className="bg-[#F1EFEA] border-b border-[#E2DFD7] px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-1">
                {DOCUMENT_SECTIONS.map((sec) => (
                  <button
                    key={sec.key}
                    onClick={() => {
                      setPreviewPaper(false);
                      setActiveSection(sec.key);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium whitespace-nowrap border cursor-pointer ${
                      !previewPaper && activeSection === sec.key
                        ? 'bg-white text-[#18181B] border-[#18181B] font-semibold'
                        : 'border-transparent text-[#52525B] hover:text-[#18181B]'
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPreviewPaper(!previewPaper)}
                className="px-2.5 py-1 bg-white border border-[#E2DFD7] hover:border-[#18181B] text-xs font-semibold text-[#18181B] whitespace-nowrap cursor-pointer"
              >
                {previewPaper ? 'Back to Editor' : 'Full Manuscript Preview'}
              </button>
            </div>

            {previewPaper ? (
              <div className="p-6 sm:p-10 space-y-6 bg-white">
                <div className="border-b border-[#E2DFD7] pb-6 text-center">
                  <div
                    className="text-[11px] uppercase tracking-widest text-[#52525B] mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {activeWorkspace.code} • {activeWorkspace.discipline} • {activeWorkspace.status}
                  </div>
                  <h2
                    className="text-3xl text-[#18181B] mb-3 font-medium"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  >
                    {activeWorkspace.title}
                  </h2>
                  <p className="text-xs font-medium text-[#52525B]">
                    Co-Authors:{' '}
                    {(activeWorkspace.collaborators || [])
                      .map((uid) => userProfiles[uid]?.name || 'Contributor')
                      .join(', ')}
                  </p>
                </div>

                {DOCUMENT_SECTIONS.map((sec) => (
                  <div key={sec.key} className="space-y-1.5">
                    <h3
                      className="text-lg font-semibold text-[#18181B] border-b border-[#E2DFD7] pb-1"
                      style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    >
                      {sec.label}
                    </h3>
                    <p className="text-sm text-[#18181B]/90 leading-relaxed whitespace-pre-wrap">
                      {activeWorkspace.sections?.[sec.key] || 'Section empty.'}
                    </p>
                  </div>
                ))}

                <div className="pt-4 border-t border-[#E2DFD7] flex justify-end">
                  <button
                    onClick={() =>
                      copyText(
                        `${activeWorkspace.title}\n\n${DOCUMENT_SECTIONS.map(
                          (s) => `${s.label}\n${activeWorkspace.sections?.[s.key] || ''}`
                        ).join('\n\n')}`,
                        'Formatted manuscript copied to clipboard.'
                      )
                    }
                    className="px-4 py-2 bg-[#18181B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="copy" className="w-3.5 h-3.5" />
                    <span>Copy Full Text</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E2DFD7]">
                  <span
                    className="text-xs font-semibold text-[#18181B]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    Editing: {DOCUMENT_SECTIONS.find((s) => s.key === activeSection)?.label}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => insertSnippet('[Citation: Author et al., 2026]')}
                      className="px-2 py-1 bg-[#F8F7F4] border border-[#E2DFD7] hover:border-[#18181B] text-[11px] font-medium cursor-pointer"
                    >
                      + Citation
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('Equation (1): ΔP = f · (L / D) · (ρ v² / 2)')}
                      className="px-2 py-1 bg-[#F8F7F4] border border-[#E2DFD7] hover:border-[#18181B] text-[11px] font-medium cursor-pointer"
                    >
                      + Equation
                    </button>
                    <button
                      type="button"
                      onClick={() => insertSnippet('[Figure 1: Experimental Apparatus & Plot]')}
                      className="px-2 py-1 bg-[#F8F7F4] border border-[#E2DFD7] hover:border-[#18181B] text-[11px] font-medium cursor-pointer"
                    >
                      + Figure
                    </button>
                  </div>
                </div>

                <textarea
                  rows={14}
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  className="w-full p-4 bg-[#F8F7F4] border border-[#E2DFD7] focus:bg-white focus:outline-none focus:border-[#18181B] text-sm leading-relaxed text-[#18181B] resize-y"
                />

                <div className="flex items-center justify-between">
                  <span
                    className="text-xs text-[#52525B]"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {wordCount} words
                  </span>
                  <button
                    onClick={handleSaveSection}
                    disabled={savingSection}
                    className="px-5 py-2 bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Icon name="check" className="w-3.5 h-3.5" />
                    <span>{savingSection ? 'Syncing...' : 'Save & Sync Section'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SUB-TAB 2: TEAM DISCUSSION CHAT */}
        {studioSubTab === 'chat' && (
          <div className="bg-white border border-[#E2DFD7] flex flex-col h-[480px]">
            <div className="px-5 py-3 border-b border-[#E2DFD7] bg-[#F1EFEA] flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                Team Discussion Room • {activeWorkspace.code}
              </span>
              <span
                className="text-[11px] text-[#1B4332] font-semibold"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {(activeWorkspace.collaborators || []).length} Team Members
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8F7F4]">
              {workspaceMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#52525B]">
                  No messages yet. Coordinate sections, data tables, or CAD iterations with your team.
                </div>
              ) : (
                workspaceMessages.map((msg) => {
                  const isMe = msg.senderId === firebaseUser?.uid;
                  const timeStr = msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '';
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="text-center">
                        <span
                          className="inline-block px-3 py-1 bg-white border border-[#E2DFD7] text-[11px] text-[#52525B]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {msg.text}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[11px]">
                        <span className="font-semibold text-[#18181B]">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-[#52525B]">{msg.senderRole}</span>
                        <span
                          className="text-[#52525B]/70"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {timeStr}
                        </span>
                      </div>
                      <div
                        className={`max-w-lg px-4 py-2.5 text-xs leading-relaxed border ${
                          isMe
                            ? 'bg-[#18181B] text-white border-[#18181B]'
                            : 'bg-white text-[#18181B] border-[#E2DFD7]'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            <form
              onSubmit={handleSendChat}
              className="p-3 bg-white border-t border-[#E2DFD7] flex gap-2"
            >
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Write a message to your project team..."
                className="flex-1 px-3.5 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-xs focus:bg-white focus:outline-none focus:border-[#18181B]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="send" className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* SUB-TAB 3: TEAM ROSTER & COLLABORATION REQUESTS */}
        {studioSubTab === 'requests' && (
          <div className="space-y-6">
            {/* Accepted Team Members */}
            <div className="bg-white border border-[#E2DFD7] p-5 space-y-4">
              <h3
                className="text-xl text-[#18181B] font-medium"
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              >
                Active Project Team &amp; Co-Authors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(activeWorkspace.collaborators || []).map((uid) => {
                  const member = userProfiles[uid];
                  return (
                    <div
                      key={uid}
                      className="p-3.5 bg-[#F8F7F4] border border-[#E2DFD7] flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="text-xs font-bold text-[#18181B]">
                          {member?.name || 'Investigator'}{' '}
                          {uid === activeWorkspace.ownerId && (
                            <span className="text-[10px] uppercase px-1.5 py-0.5 bg-[#18181B] text-white ml-1">
                              Lead
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#52525B] mt-0.5">
                          {member?.affiliation || 'Collaborator'}
                        </div>
                      </div>
                      <button
                        onClick={() => onInspectProfile(uid)}
                        className="px-2.5 py-1 bg-white border border-[#E2DFD7] hover:border-[#18181B] text-[11px] font-semibold cursor-pointer"
                      >
                        Dossier
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Incoming Requests (Owner Review) */}
            <div className="bg-white border border-[#E2DFD7] p-5 space-y-4">
              <div>
                <h3
                  className="text-xl text-[#18181B] font-medium"
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                >
                  Incoming Collaboration Requests
                </h3>
                <p className="text-xs text-[#52525B]">
                  Review applicant qualifications, affiliation, and proposed role before granting workspace access.
                </p>
              </div>

              {workspaceRequests.length === 0 ? (
                <div className="p-6 bg-[#F8F7F4] border border-[#E2DFD7] text-xs text-[#52525B] text-center">
                  No collaboration requests received for this project yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {workspaceRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-[#F8F7F4] border border-[#E2DFD7] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => onInspectProfile(req.applicantId)}
                            className="text-sm font-bold text-[#18181B] underline hover:text-[#1B4332] cursor-pointer"
                          >
                            {req.applicantName}
                          </button>
                          <span className="text-xs text-[#52525B]">
                            • {req.applicantAffiliation}
                          </span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 border ${
                              req.status === 'accepted'
                                ? 'bg-[#EFF5F1] text-[#1B4332] border-[#1B4332]/30'
                                : req.status === 'declined'
                                ? 'bg-[#FDF4F1] text-[#B84A27] border-[#B84A27]/30'
                                : 'bg-white text-[#18181B] border-[#18181B]/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>

                        <div
                          className="text-[11px] text-[#52525B]"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          {req.applicantCredentials}
                        </div>

                        <div className="text-xs font-semibold text-[#1E40AF]">
                          Proposed Role: {req.proposedRole}
                        </div>

                        {Array.isArray(req.applicantSkills) && req.applicantSkills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {req.applicantSkills.map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-white border border-[#E2DFD7] text-[11px] font-medium"
                              >
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="p-3 bg-white border border-[#E2DFD7] text-xs text-[#18181B] italic">
                          “{req.pitch}”
                        </p>
                      </div>

                      {isOwner && req.status === 'pending' && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => onDecideRequest(req, 'accepted')}
                            className="px-3.5 py-2 bg-[#1B4332] hover:bg-[#143326] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Icon name="check" className="w-3.5 h-3.5" />
                            <span>Accept onto Team</span>
                          </button>
                          <button
                            onClick={() => onDecideRequest(req, 'declined')}
                            className="px-3 py-2 bg-white border border-[#E2DFD7] hover:border-[#B84A27] hover:text-[#B84A27] text-xs font-semibold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

// ============================================================================
// PROJECT READER MODAL
// ============================================================================
function ProjectReaderModal({
  project,
  firebaseUser,
  isRegisteredMember,
  userProfiles,
  requests,
  onClose,
  onInspectProfile,
  onOpenApply,
  onOpenWorkspace,
  onDeleteProject,
  copyText
}) {
  const [confirmDel, setConfirmDel] = useState(false);
  const authorDossier = userProfiles[project.ownerId];
  const authorName = authorDossier?.name || project.ownerName || 'Investigator';
  const authorCreds =
    authorDossier?.credentials || project.ownerAffiliation || 'Verified SynthLab Member';

  const isOwner = isRegisteredMember && project.ownerId === firebaseUser?.uid;
  const isMember =
    isRegisteredMember &&
    (isOwner ||
      (Array.isArray(project.collaborators) &&
        project.collaborators.includes(firebaseUser?.uid)));
  const hasPending =
    isRegisteredMember &&
    requests.some(
      (r) =>
        r.projectId === project.id &&
        r.applicantId === firebaseUser?.uid &&
        r.status === 'pending'
    );

  return (
    <div className="fixed inset-0 z-40 bg-[#18181B]/55 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#18181B] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="sticky top-0 bg-[#F1EFEA] border-b border-[#E2DFD7] px-6 py-3.5 flex items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold text-[#18181B]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {project.code || project.id.slice(0, 8)}
            </span>
            <span className="text-[#E2DFD7]">|</span>
            <span className="text-xs font-semibold text-[#1E40AF]">{project.discipline}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#52525B] hover:text-[#18181B] cursor-pointer"
          >
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h2
              className="text-3xl text-[#18181B] leading-tight mb-4 font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {project.title}
            </h2>

            <div className="p-4 bg-[#F8F7F4] border border-[#E2DFD7] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#18181B]">
                  Principal Investigator: {authorName}
                </div>
                <div
                  className="text-[11px] text-[#52525B] mt-0.5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {authorCreds}
                </div>
              </div>
              <button
                onClick={() => onInspectProfile(project.ownerId)}
                className="px-3 py-1.5 bg-white border border-[#18181B] text-xs font-semibold text-[#18181B] hover:bg-[#18181B] hover:text-white transition-colors cursor-pointer"
              >
                Inspect Qualifications
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {DOCUMENT_SECTIONS.map((sec) => {
              const content =
                project.sections?.[sec.key] || (sec.key === 'abstract' ? project.abstract : '');
              if (!content) return null;
              return (
                <div key={sec.key} className="space-y-1.5">
                  <h3
                    className="text-lg font-semibold text-[#18181B] border-b border-[#E2DFD7] pb-1"
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  >
                    {sec.label}
                  </h3>
                  <p className="text-sm text-[#18181B]/90 leading-relaxed whitespace-pre-wrap">
                    {content}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E2DFD7] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  copyText(
                    `${authorName} (${new Date().getFullYear()}). "${project.title}." SynthLab Archive ${project.code}.`,
                    'Archival citation copied!'
                  )
                }
                className="px-3 py-2 border border-[#E2DFD7] bg-[#F8F7F4] hover:border-[#18181B] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Icon name="copy" className="w-3.5 h-3.5" />
                <span>Cite Entry</span>
              </button>

              {isOwner && (
                <>
                  {confirmDel ? (
                    <div className="flex items-center gap-2 bg-[#FDF4F1] border border-[#B84A27] px-3 py-1.5">
                      <span className="text-xs font-semibold text-[#B84A27]">
                        Delete permanently?
                      </span>
                      <button
                        onClick={() => onDeleteProject(project.id)}
                        className="text-xs font-bold underline text-[#B84A27] cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDel(false)}
                        className="text-xs text-[#52525B] cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDel(true)}
                      className="px-3 py-2 border border-[#E2DFD7] bg-white hover:border-[#B84A27] hover:text-[#B84A27] text-xs font-medium text-[#52525B] flex items-center gap-1 cursor-pointer"
                    >
                      <Icon name="trash" className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </>
              )}
            </div>

            {isMember ? (
              <button
                onClick={() => onOpenWorkspace(project.id)}
                className="px-5 py-2 bg-[#1B4332] text-white text-xs font-semibold cursor-pointer"
              >
                Open Collaborative Workspace →
              </button>
            ) : project.status === 'Seeking Collaborators' ? (
              hasPending ? (
                <span className="px-4 py-2 bg-[#F1EFEA] border border-[#E2DFD7] text-xs font-semibold text-[#52525B]">
                  Request Pending Review
                </span>
              ) : (
                <button
                  onClick={() => onOpenApply(project.id)}
                  className="px-5 py-2 bg-[#B84A27] hover:bg-[#9B3D1F] text-white text-xs font-semibold cursor-pointer"
                >
                  Request to Collaborate
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COLLABORATION REQUEST MODAL
// ============================================================================
function CollaborationRequestModal({
  project,
  applicantProfile,
  firebaseUser,
  onClose,
  onSubmit
}) {
  const [proposedRole, setProposedRole] = useState(
    (project.lookingFor && project.lookingFor[0]) || 'Co-Author / Collaborator'
  );
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) return;
    setSubmitting(true);
    await onSubmit(project.id, proposedRole, pitch);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18181B]/55 flex items-center justify-center p-4">
      <div className="bg-white border border-[#18181B] max-w-xl w-full p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-[#E2DFD7] pb-4">
          <div>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold text-[#B84A27]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              COLLABORATION APPLICATION • {project.code}
            </span>
            <h3
              className="text-2xl text-[#18181B] mt-1 leading-snug font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {project.title}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#52525B] hover:text-[#18181B] cursor-pointer">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        {/* Attached Verified Profile Dossier */}
        <div className="p-4 bg-[#F8F7F4] border border-[#E2DFD7] space-y-2">
          <div
            className="text-[10px] uppercase tracking-wider font-semibold text-[#1B4332]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Your Verified Dossier Automatically Attached:
          </div>
          <div className="text-xs font-bold text-[#18181B]">
            {applicantProfile?.name || firebaseUser?.email} —{' '}
            {applicantProfile?.affiliation || 'Independent Researcher'}
          </div>
          <div className="text-xs text-[#52525B]">
            {applicantProfile?.credentials || 'Registered SynthLab Member'}
          </div>
          {Array.isArray(applicantProfile?.skills) && applicantProfile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {applicantProfile.skills.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-white border border-[#E2DFD7] text-[11px] font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Proposed Role / Contribution Track
            </label>
            <input
              type="text"
              required
              value={proposedRole}
              onChange={(e) => setProposedRole(e.target.value)}
              placeholder="e.g., Process Modeling & Section 4 Co-Author"
              className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Research Pitch &amp; Relevant Experience
            </label>
            <textarea
              rows={4}
              required
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Explain how your background qualifies you for this project and which sections or experiments you want to lead..."
              className="w-full p-3 bg-[#F8F7F4] border border-[#E2DFD7] focus:bg-white focus:outline-none focus:border-[#18181B] text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2DFD7] text-xs font-semibold text-[#52525B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-[#B84A27] hover:bg-[#9B3D1F] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              {submitting ? 'Sending...' : 'Send Request & Dossier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// INSPECT DOSSIER MODAL
// ============================================================================
function DossierModal({ profile, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-[#18181B]/55 flex items-center justify-center p-4">
      <div className="bg-white border border-[#18181B] max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-[#E2DFD7] pb-4">
          <div>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold text-[#1B4332]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              INVESTIGATOR QUALIFICATIONS DOSSIER
            </span>
            <h3
              className="text-2xl text-[#18181B] mt-0.5 font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              {profile.name}
            </h3>
            {profile.affiliation && (
              <p className="text-xs font-semibold text-[#52525B]">{profile.affiliation}</p>
            )}
          </div>
          <button onClick={onClose} className="text-[#52525B] hover:text-[#18181B] cursor-pointer">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-[#F8F7F4] border border-[#E2DFD7]">
            <div
              className="text-[10px] uppercase tracking-wider font-semibold text-[#52525B] mb-1"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Degrees, Certifications &amp; Track Record
            </div>
            <p className="font-semibold text-[#18181B]">
              {profile.credentials || 'Verified SynthLab Member'}
            </p>
          </div>

          {profile.bio && (
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-semibold text-[#52525B] mb-1"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Research &amp; Project Focus
              </div>
              <p className="text-[#18181B]/85 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {Array.isArray(profile.skills) && profile.skills.length > 0 && (
            <div>
              <div
                className="text-[10px] uppercase tracking-wider font-semibold text-[#52525B] mb-1.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Technical Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-[#F8F7F4] border border-[#E2DFD7] font-medium text-[#18181B]"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(profile.orcidUrl || profile.githubUrl) && (
            <div className="pt-3 border-t border-[#E2DFD7] flex items-center gap-4">
              {profile.orcidUrl && (
                <a
                  href={profile.orcidUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1B4332] font-semibold underline flex items-center gap-1"
                >
                  <Icon name="link" className="w-3.5 h-3.5" />
                  <span>ORCID Profile</span>
                </a>
              )}
              {profile.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#1E40AF] font-semibold underline flex items-center gap-1"
                >
                  <Icon name="link" className="w-3.5 h-3.5" />
                  <span>GitHub / Portfolio</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PUBLISH NEW PROPOSAL MODAL
// ============================================================================
function PublishProposalModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [discipline, setDiscipline] = useState('Research Papers');
  const [mode, setMode] = useState('Seeking Collaborators');
  const [abstract, setAbstract] = useState('');
  const [lookingForText, setLookingForText] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !abstract.trim()) return;
    setBusy(true);
    await onCreate({
      title,
      discipline,
      mode,
      abstract,
      lookingFor: lookingForText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    });
    setBusy(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#18181B]/55 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#18181B] max-w-2xl w-full p-6 sm:p-8 shadow-xl my-8">
        <div className="flex items-start justify-between gap-4 border-b border-[#E2DFD7] pb-4 mb-5">
          <div>
            <span
              className="text-[10px] uppercase tracking-wider font-semibold text-[#1B4332]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              PUBLISH NEW PROPOSAL OR SHOWCASE
            </span>
            <h2
              className="text-2xl sm:text-3xl text-[#18181B] mt-0.5 font-medium"
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
            >
              Share Your Research Idea or Build Project
            </h2>
          </div>
          <button onClick={onClose} className="text-[#52525B] hover:text-[#18181B] cursor-pointer">
            <Icon name="x" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('Seeking Collaborators')}
              className={`p-3.5 border text-left cursor-pointer ${
                mode === 'Seeking Collaborators'
                  ? 'bg-[#FDF4F1] border-[#B84A27]'
                  : 'bg-[#F8F7F4] border-[#E2DFD7]'
              }`}
            >
              <div className="text-xs font-bold text-[#18181B]">Seeking Collaborators</div>
              <p className="text-[11px] text-[#52525B] mt-1">
                Invite vetted co-authors or builders to join your workspace and write the paper together.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setMode('Showcase Only')}
              className={`p-3.5 border text-left cursor-pointer ${
                mode === 'Showcase Only'
                  ? 'bg-[#EFF5F1] border-[#1B4332]'
                  : 'bg-[#F8F7F4] border-[#E2DFD7]'
              }`}
            >
              <div className="text-xs font-bold text-[#18181B]">Showcase Only</div>
              <p className="text-[11px] text-[#52525B] mt-1">
                Exhibit an independent engineering build, art installation, or solo paper to the community.
              </p>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Heat-Integrated Membrane Distillation Pilot for Industrial Effluent"
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              >
                {DISCIPLINES.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Abstract / Project Summary *
            </label>
            <textarea
              rows={4}
              required
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Describe the hypothesis, methodology, or creative/engineering vision..."
              className="w-full p-3 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          {mode === 'Seeking Collaborators' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#B84A27] mb-1">
                Roles / Skills Needed (Comma-separated)
              </label>
              <input
                type="text"
                value={lookingForText}
                onChange={(e) => setLookingForText(e.target.value)}
                placeholder="e.g., ASPEN Plus, Experimental Validation, LaTeX Editing"
                className="w-full px-3 py-2 bg-[#FDF4F1]/40 border border-[#B84A27]/40 text-sm focus:bg-white focus:outline-none focus:border-[#B84A27]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Keywords / Tags (Comma-separated)
            </label>
            <input
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g., Process-Engineering, Open-Hardware, Preprint"
              className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="pt-3 border-t border-[#E2DFD7] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2DFD7] text-xs font-semibold text-[#52525B] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              {busy ? 'Publishing...' : 'Publish & Open Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// MY PROFILE & QUALIFICATIONS EDITOR
// ============================================================================
function ProfileEditor({ firebaseUser, profile, onSave }) {
  const [name, setName] = useState(profile?.name || '');
  const [affiliation, setAffiliation] = useState(profile?.affiliation || '');
  const [discipline, setDiscipline] = useState(profile?.discipline || 'Research Papers');
  const [credentials, setCredentials] = useState(profile?.credentials || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [skillsText, setSkillsText] = useState((profile?.skills || []).join(', '));
  const [orcidUrl, setOrcidUrl] = useState(profile?.orcidUrl || '');
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setAffiliation(profile.affiliation || '');
      setDiscipline(profile.discipline || 'Research Papers');
      setCredentials(profile.credentials || '');
      setBio(profile.bio || '');
      setSkillsText((profile.skills || []).join(', '));
      setOrcidUrl(profile.orcidUrl || '');
      setGithubUrl(profile.githubUrl || '');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: name.trim(),
      affiliation: affiliation.trim(),
      discipline,
      credentials: credentials.trim(),
      bio: bio.trim(),
      skills: skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      orcidUrl: orcidUrl.trim(),
      githubUrl: githubUrl.trim()
    });
    setSaving(false);
  };

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white border border-[#E2DFD7] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E2DFD7] pb-5">
          <span
            className="text-[10px] uppercase tracking-wider font-semibold text-[#1B4332]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            REGISTERED ACCOUNT • {firebaseUser?.email}
          </span>
          <h1
            className="text-3xl text-[#18181B] mt-0.5 font-medium"
            style={{ fontFamily: "'Newsreader', Georgia, serif" }}
          >
            Your Investigator Dossier &amp; Qualifications
          </h1>
          <p className="text-xs text-[#52525B] mt-1">
            Other researchers inspect this dossier before approving your collaboration requests or joining your projects.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                Primary Discipline
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              >
                {DISCIPLINES.filter((d) => d !== 'All').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Affiliation / University / Studio
            </label>
            <input
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Qualifications, Degrees &amp; Publications
            </label>
            <input
              type="text"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Skills (Comma-separated)
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                ORCID URL
              </label>
              <input
                type="url"
                value={orcidUrl}
                onChange={(e) => setOrcidUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
                GitHub / Portfolio URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3 py-2 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#18181B] mb-1">
              Bio &amp; Research Interests
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 bg-[#F8F7F4] border border-[#E2DFD7] text-sm focus:bg-white focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1B4332] hover:bg-[#143326] disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

// ============================================================================
// HOW IT WORKS & MULTI-USER TESTING GUIDE
// ============================================================================
function HowItWorksGuide({
  isRegisteredMember,
  onOpenSignUp,
  onGoToFeed,
  onGoToWorkspaces
}) {
  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      <section className="bg-white border border-[#E2DFD7] p-6 sm:p-8 space-y-5">
        <span
          className="text-[10px] uppercase tracking-wider font-semibold text-[#1B4332]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          MULTI-USER WORKFLOW &amp; VERIFICATION
        </span>
        <h1
          className="text-3xl text-[#18181B] font-medium"
          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
        >
          How Two Real Accounts Collaborate on SynthLab
        </h1>
        <p className="text-sm text-[#52525B] leading-relaxed">
          SynthLab uses real authentication and cloud syncing so every researcher, engineer, or artist creates their own account and interacts across browser windows or devices:
        </p>

        <ol className="space-y-4 text-sm text-[#18181B] border-l-2 border-[#1B4332] pl-5">
          <li>
            <strong>1. Account A (Project Lead) Signs Up &amp; Publishes:</strong> Click{' '}
            {!isRegisteredMember ? (
              <button
                onClick={onOpenSignUp}
                className="underline font-semibold text-[#1B4332] cursor-pointer"
              >
                Sign Up
              </button>
            ) : (
              <strong>+ Publish Idea</strong>
            )}{' '}
            to create an investigator account with your degrees, skills, and affiliation, then publish a research paper or engineering build proposal.
          </li>
          <li>
            <strong>2. Account B (Collaborator) Signs Up &amp; Requests to Join:</strong> Open SynthLab in a second browser window (or sign out and create a second account). Inspect Account A’s qualifications on the{' '}
            <button
              onClick={onGoToFeed}
              className="underline font-semibold text-[#1E40AF] cursor-pointer"
            >
              Explore Feed
            </button>
            , then click <strong>Request to Collaborate</strong>. Account B’s verified dossier is automatically sent with their pitch.
          </li>
          <li>
            <strong>3. Account A Reviews &amp; Accepts:</strong> Account A opens{' '}
            <button
              onClick={onGoToWorkspaces}
              className="underline font-semibold text-[#1B4332] cursor-pointer"
            >
              My Workspaces → Team &amp; Collab Requests
            </button>
            , inspects Account B’s credentials, and clicks <strong>Accept onto Team</strong>.
          </li>
          <li>
            <strong>4. Co-Write &amp; Publish Findings:</strong> Both Account A and Account B now see the shared project in <strong>My Workspaces</strong>, can chat in real time, edit all 5 sections of the manuscript, and publish the final findings publicly.
          </li>
        </ol>
      </section>
    </main>
  );
}