-- Create Alerts Table
CREATE TABLE IF NOT EXISTS "Alert" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hostname" TEXT NOT NULL,
    "payload" JSONB,
    "metadata" JSONB,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- Create Sensors Table
CREATE TABLE IF NOT EXISTS "Sensor" (
    "id" TEXT NOT NULL,
    "hostname" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "version" TEXT NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- Create Unique Index for Sensor Hostname
CREATE UNIQUE INDEX IF NOT EXISTS "Sensor_hostname_key" ON "Sensor"("hostname");

-- Create Policies Table
CREATE TABLE IF NOT EXISTS "Policy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- Create System Logs Table
CREATE TABLE IF NOT EXISTS "SystemLog" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SystemLog_pkey" PRIMARY KEY ("id")
);

-- Create Commands Table
CREATE TABLE IF NOT EXISTS "Command" (
    "id" TEXT NOT NULL,
    "sensorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" TEXT,
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- OPTIONAL: Create System Config Table (For Neural Risk Engine)
CREATE TABLE IF NOT EXISTS "SystemConfig" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("key")
);

-- Enable Row Level Security (RLS) - Recommended best practice
ALTER TABLE "Alert" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Sensor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Policy" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Command" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SystemConfig" ENABLE ROW LEVEL SECURITY;

-- Create Policy to allow ALL access (Simplest for now, lock down later)
CREATE POLICY "Allow All Access" ON "Alert" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access" ON "Sensor" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access" ON "Policy" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access" ON "SystemLog" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access" ON "Command" FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access" ON "SystemConfig" FOR ALL USING (true) WITH CHECK (true);
