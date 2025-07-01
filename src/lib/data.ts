import { unstable_noStore as noStore } from 'next/cache';
import type { Permit, PermitStatus } from './types';

const plantLat = 24.2045;
const plantLng = 83.0396;

function createPermit(
    id: string, 
    riskLevel: 'low' | 'medium' | 'high', 
    description: string, 
    ppe: string, 
    status: PermitStatus,
    issuedById: string,
    issuedBy: string,
    approvedBy: string | undefined,
    issueDate: string,
    validUntil: string,
): Permit {
    const permitData = JSON.stringify({ id, risk: riskLevel });
    const createdDate = new Date(issueDate);
    createdDate.setMinutes(createdDate.getMinutes() - 5);
    
    const history = [
        { status: 'Created' as const, timestamp: createdDate.toISOString(), updatedBy: issuedBy }
    ];

    if (status !== 'Pending') {
        history.push({ status, timestamp: issueDate, updatedBy: approvedBy || 'System' });
    }
    
    return {
        id,
        description,
        ppeChecklist: ppe,
        riskLevel,
        status,
        justification: `Assessment based on description and PPE requirements.`,
        lat: plantLat + (Math.random() - 0.5) * 0.02, // Spread around the plant
        lng: plantLng + (Math.random() - 0.5) * 0.02, // Spread around the plant
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(permitData)}`,
        issuedById,
        issuedBy,
        approvedBy,
        issueDate,
        validUntil,
        statusHistory: history,
    };
}

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const initialPermitsData: Permit[] = [
    createPermit('PERMIT-001', 'high', 'Welding on main pipeline near storage tank 3. High fire potential.', 'Fire-retardant suit, helmet, safety goggles, gloves', 'Approved', '12345', 'Ramesh Kumar', 'Sunita Sharma', yesterday.toISOString(), new Date(yesterday.getTime() + 8 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-002', 'medium', 'Electrical panel maintenance in Substation B. Risk of shock.', 'Insulated gloves, safety shoes, helmet, face shield', 'Approved', '23456', 'Rajesh Singh', 'Sunita Sharma', yesterday.toISOString(), new Date(yesterday.getTime() + 4 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-003', 'low', 'Routine inspection of conveyor belt C-12. Low risk activity.', 'Helmet, Safety Shoes', 'Approved', '34567', 'Meena Iyer', 'Vikram Rathod', today.toISOString(), new Date(today.getTime() + 2 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-004', 'high', 'Working at height on Smelter roof, 50ft elevation.', 'Full body harness, helmet, non-slip boots', 'Pending', '34568', 'Manoj Verma', undefined, today.toISOString(), new Date(today.getTime() + 8 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-005', 'medium', 'Confined space entry into Tank 7 for cleaning.', 'Respirator, harness, gas detector, helmet', 'Pending', '67891', 'Suresh Patel', undefined, today.toISOString(), new Date(today.getTime() + 6 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-006', 'low', 'Cold work - replacement of water pump in cooling tower.', 'Gloves, safety shoes', 'Approved', '44556', 'Pooja Desai', 'Vikram Rathod', today.toISOString(), new Date(today.getTime() + 3 * 60 * 60 * 1000).toISOString()),
    createPermit('PERMIT-007', 'high', 'Hot tapping on active steam line. Extreme heat and pressure.', 'N/A', 'Rejected', '12346', 'Harish Tiwari', 'Sunita Sharma', yesterday.toISOString(), yesterday.toISOString()),
    createPermit('PERMIT-008', 'medium', 'Scaffolding erection for boiler maintenance.', 'Harness, helmet, gloves, safety boots', 'Approved', '67892', 'Sandeep Yadav', 'Vikram Rathod', today.toISOString(), tomorrow.toISOString()),
];


// --- Global Caching for Development ---
// This ensures our mock database persists across hot reloads in dev mode.
var globalForPermits = global as unknown as {
  permits: Permit[] | undefined;
};

// If `global.permits` doesn't exist, initialize it with a deep copy of the static data.
if (!globalForPermits.permits) {
  globalForPermits.permits = JSON.parse(JSON.stringify(initialPermitsData));
}

// All functions will now use this global array, which acts as our persistent mock DB.
export let initialPermits: Permit[] = globalForPermits.permits;


// --- Data Mutation Functions ---
// These functions simulate updating a database.

export const findPermitById = async (id: string): Promise<Permit | undefined> => {
    noStore();
    const permit = initialPermits.find(p => p.id === id);
    return permit ? JSON.parse(JSON.stringify(permit)) : undefined;
}

export const updatePermitStatus = async (
    permitId: string, 
    status: 'Approved' | 'Rejected', 
    approverName: string
): Promise<Permit | undefined> => {
    noStore();
    const permitIndex = initialPermits.findIndex(p => p.id === permitId);
    if (permitIndex > -1) {
        const permit = initialPermits[permitIndex];
        permit.status = status;
        permit.approvedBy = approverName;
        permit.statusHistory.push({
            status: status,
            timestamp: new Date().toISOString(),
            updatedBy: approverName,
        });
        initialPermits[permitIndex] = permit;
        return permit;
    }
    return undefined;
};
