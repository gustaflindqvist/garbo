-- AddForeignKey
ALTER TABLE "DiversityInclusion" ADD CONSTRAINT "DiversityInclusion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("wikidataId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiversityInclusion" ADD CONSTRAINT "DiversityInclusion_reportingPeriodId_fkey" FOREIGN KEY ("reportingPeriodId") REFERENCES "ReportingPeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;
