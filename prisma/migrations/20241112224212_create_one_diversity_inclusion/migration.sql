-- CreateTable
CREATE TABLE "DiversityInclusion" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "year" TEXT,
    "companyId" TEXT NOT NULL,
    "metadataId" INTEGER NOT NULL,
    "reportingPeriodId" INTEGER,

    CONSTRAINT "DiversityInclusion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DiversityInclusion" ADD CONSTRAINT "DiversityInclusion_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
