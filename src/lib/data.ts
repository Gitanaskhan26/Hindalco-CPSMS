import type { Permit } from './types';

function createPermit(id: string, riskLevel: 'low' | 'medium' | 'high', description: string, ppe: string): Permit {
    const permitData = JSON.stringify({ id, risk: riskLevel });
    return {
        id,
        description,
        ppeChecklist: ppe,
        riskLevel,
        justification: `Assessment based on description and PPE requirements.`,
        lat: 22.5726 + (Math.random() - 0.5) * 0.05,
        lng: 88.3639 + (Math.random() - 0.5) * 0.05,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(permitData)}`,
    };
}

export const initialPermits: Permit[] = [
    createPermit('PERMIT-001', 'high', 'Welding on main pipeline near storage tank 3. High fire potential.', 'Fire-retardant suit, helmet, safety goggles, gloves'),
    createPermit('PERMIT-002', 'medium', 'Electrical panel maintenance in Substation B. Risk of shock.', 'Insulated gloves, safety shoes, helmet, face shield'),
    createPermit('PERMIT-003', 'low', 'Routine inspection of conveyor belt C-12. Low risk activity.', 'Helmet, safety shoes'),
    createPermit('PERMIT-004', 'high', 'Working at height on Smelter roof, 50ft elevation.', 'Full body harness, helmet, non-slip boots'),
    createPermit('PERMIT-005', 'medium', 'Confined space entry into Tank 7 for cleaning.', 'Respirator, harness, gas detector, helmet'),
    createPermit('PERMIT-006', 'low', 'Cold work - replacement of water pump in cooling tower.', 'Gloves, safety shoes'),
    createPermit('PERMIT-007', 'high', 'Hot tapping on active steam line. Extreme heat and pressure.', 'Full heat-resistant gear, face shield, specialized gloves'),
    createPermit('PERMIT-008', 'medium', 'Scaffolding erection for boiler maintenance.', 'Harness, helmet, gloves, safety boots'),
];
