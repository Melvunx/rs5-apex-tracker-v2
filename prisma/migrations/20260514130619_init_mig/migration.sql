-- CreateTable
CREATE TABLE "challenges" (
    "id" TEXT NOT NULL,
    "challenge_name" TEXT NOT NULL,
    "shots_hit" INTEGER NOT NULL,
    "kills" INTEGER NOT NULL,
    "weapon" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "damage" INTEGER NOT NULL,
    "critical_shots" INTEGER NOT NULL,
    "total_shots" INTEGER NOT NULL,
    "roundtime" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "challenges_weapon_idx" ON "challenges"("weapon");

-- CreateIndex
CREATE INDEX "challenges_challenge_name_idx" ON "challenges"("challenge_name");
