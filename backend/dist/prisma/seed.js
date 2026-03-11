"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Démarrage du seed...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const adminEntity = await prisma.entity.upsert({
        where: { code: 'ADM' },
        update: {},
        create: {
            label: 'Administration',
            description: 'Direction Administrative',
            code: 'ADM',
            email: 'admin@estsb.edu',
            phone: '0523000001',
        },
    });
    const infoEntity = await prisma.entity.upsert({
        where: { code: 'INFO' },
        update: {},
        create: {
            label: 'Informatique',
            description: 'Département Informatique',
            code: 'INFO',
            email: 'info@estsb.edu',
            phone: '0523000002',
        },
    });
    const gcEntity = await prisma.entity.upsert({
        where: { code: 'GC' },
        update: {},
        create: {
            label: 'Génie Civil',
            description: 'Département Génie Civil',
            code: 'GC',
            email: 'gc@estsb.edu',
        },
    });
    const mechEntity = await prisma.entity.upsert({
        where: { code: 'MECH' },
        update: {},
        create: {
            label: 'Génie Mécanique',
            description: 'Department of Mechanical Engineering',
            code: 'MECH',
            email: 'mechanic@estsb.edu',
            phone: '+212 5XX XXX XXX',
        },
    });
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@estsb.edu' },
        update: {},
        create: {
            email: 'admin@estsb.edu',
            name: 'Admin EST SB',
            password: hashedPassword,
            role: client_1.Role.SUPER_ADMIN,
            isActive: true,
        },
    });
    const chefUser = await prisma.user.upsert({
        where: { email: 'chef.info@estsb.edu' },
        update: {},
        create: {
            email: 'chef.info@estsb.edu',
            name: 'Chef Informatique',
            password: hashedPassword,
            role: client_1.Role.CHEF,
            entityId: infoEntity.id,
            isActive: true,
        },
    });
    const agentUser = await prisma.user.upsert({
        where: { email: 'agent.mail@estsb.edu' },
        update: {},
        create: {
            email: 'agent.mail@estsb.edu',
            name: 'Agent Courrier',
            password: hashedPassword,
            role: client_1.Role.AGENT,
            entityId: adminEntity.id,
            isActive: true,
        },
    });
    await prisma.user.upsert({
        where: { email: 'auditeur@estsb.edu' },
        update: {},
        create: {
            email: 'auditeur@estsb.edu',
            name: 'Auditeur',
            password: hashedPassword,
            role: client_1.Role.AUDITOR,
            isActive: true,
        },
    });
    for (const item of [
        { label: 'Entrant', description: 'Incoming mail' },
        { label: 'Sortant', description: 'Outgoing mail' },
        { label: 'Interne', description: 'Internal mail' },
    ]) {
        await prisma.courierType.upsert({
            where: { label: item.label },
            update: {},
            create: item,
        });
    }
    for (const item of [
        { label: 'Réclamation', description: 'Complaints' },
        { label: 'Incident', description: 'Incidents' },
        { label: 'Demande', description: 'Requests' },
        { label: 'Administration', description: 'Administrative' },
        { label: 'Convocation', description: 'Summons' },
        { label: 'Autre', description: 'Other' },
    ]) {
        await prisma.category.upsert({
            where: { label: item.label },
            update: {},
            create: item,
        });
    }
    for (const state of [
        { label: 'Nouveau', color: '#3B82F6' },
        { label: 'En cours', color: '#F59E0B' },
        { label: 'Traité', color: '#10B981' },
        { label: 'Rejeté', color: '#EF4444' },
        { label: 'Archivé', color: '#6B7280' },
    ]) {
        await prisma.refState.upsert({
            where: { label: state.label },
            update: {},
            create: state,
        });
    }
    const catDemande = await prisma.category.findFirst({ where: { label: 'Demande' } });
    const typeEntrant = await prisma.courierType.findFirst({ where: { label: 'Entrant' } });
    if (catDemande && typeEntrant) {
        const existingCourier = await prisma.courier.findUnique({
            where: { reference: 'ESTSB-202501-DEMO1' },
        });
        if (!existingCourier) {
            await prisma.courier.create({
                data: {
                    reference: 'ESTSB-202501-DEMO1',
                    subject: 'Demande de matériel informatique',
                    description: 'Demande d\'acquisition de 10 ordinateurs portables',
                    toEntityId: adminEntity.id,
                    fromEntityId: infoEntity.id,
                    categoryId: catDemande.id,
                    typeId: typeEntrant.id,
                    priority: client_1.Priority.URGENT,
                    state: client_1.CourierState.IN_PROGRESS,
                    createdById: adminUser.id,
                    history: {
                        create: [
                            { state: client_1.CourierState.NEW, changedById: adminUser.id },
                            { state: client_1.CourierState.IN_PROGRESS, changedById: adminUser.id, notes: 'En cours de traitement' },
                        ],
                    },
                },
            });
        }
    }
    console.log('✅ Seed terminé avec succès !');
    console.log('');
    console.log('Comptes de test :');
    console.log('  admin@estsb.edu      → SUPER_ADMIN');
    console.log('  chef.info@estsb.edu  → CHEF');
    console.log('  agent.mail@estsb.edu → AGENT');
    console.log('  auditeur@estsb.edu   → AUDITOR');
    console.log('  Mot de passe commun  → Password123!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map