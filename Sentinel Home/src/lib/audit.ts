import { prisma } from './prisma';
import { AuditLog } from '@prisma/client';
import crypto from 'crypto';

export type AuditLogEntry = AuditLog;

export async function logAuditAction(
    actorId: string,
    actorName: string,
    action: string,
    targetResource: string,
    details?: any,
    severity: 'INFO' | 'WARN' | 'CRITICAL' = 'INFO'
) {
    try {
        // Real Cryptographic Chain
        const previousLog = await prisma.auditLog.findFirst({
            orderBy: { timestamp: 'desc' }
        });

        const timestamp = new Date();
        const prevHash = previousLog?.hash || 'GENESIS_BLOCK_INIT';

        // Canonical payload for hashing
        const payload = JSON.stringify({
            prevHash,
            actorId,
            action,
            targetResource,
            details: details || {},
            timestamp: timestamp.toISOString()
        });

        // SHA-256 Hash Generation
        const hash = crypto.createHash('sha-256').update(payload).digest('hex');

        await prisma.auditLog.create({
            data: {
                actorId,
                actorName,
                action,
                targetResource,
                details: details || {},
                severity,
                hash,
                timestamp
            }
        });
    } catch (error) {
        // Fallback for non-critical logging failures
        console.error('Failed to write audit log:', error);
    }
}

export async function fetchAuditLogs() {
    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100
        });
        return logs;
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return [];
    }
}
