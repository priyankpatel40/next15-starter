'use server';
import { getAllCompanies } from '@/data/company';
import { Company } from '@prisma/client';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import { Card } from '@/components/ui/card';
import { BuildingOffice2Icon } from '@heroicons/react/20/solid';
import FilterSelect from '@/components/ui/filterselect';
import { Suspense } from 'react';
import AllCompaniesTable from '@/app/(protected)/components/companies/allcompaniestable';
import TextSearch from '@/components/ui/textSearch';
import { CompaniesCards } from '@/app/(protected)/components/companies/companiesCards';

interface Company {
  id: string;
  company_name: string;
  logo: string;
  api_key: string;
  is_active: boolean;
  creatorName: string;
  creatorEmail: string;
  created_at: Date;
  is_trial: boolean;
}

// Convert to an async Server Component
export default async function AllCompaniesPage({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const filter = searchParams.filter || 'all';
  const search = searchParams.query || '';
  const itemsPerPage = 10;

  const result = await getAllCompanies({
    page,
    itemsPerPage,
    orderBy: 'asc',
    filter,
    search,
  });
  console.log('🚀 ~ file: page.tsx:59 ~ result:', result);
  const companies = result.companies;
  const totalCount = companies.length;
  // Calculate counts based on the fetched companies
  const activeCount = companies.filter((company) => company.is_active).length;
  const inactiveCount = companies.filter((company) => !company.is_active).length;
  const trialCount = companies.filter((company) => company.is_trial).length;
  const nonTrialCount = companies.filter((company) => !company.is_trial).length;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  async function handleUpdateCompany(id: string, data: Partial<Company>) {
    'use server';
    console.log('🚀 ~ file: page.tsx:65 ~ handleUpdateCompany ~ data:', data);
  }

  return (
    <section className="h-full py-6 px-4 sm:px-6 lg:px-8 pt-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 p-0.5 rounded-full shadow-lg">
              <div className="bg-white dark:bg-gray-800 rounded-full p-3">
                <BuildingOffice2Icon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
              </div>
            </div>
            <div className="ml-4 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Companies
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage and oversee all companies within your organization
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4 space-y-4 sm:flex sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
            <CompaniesCards
              totalCount={totalCount}
              activeCount={activeCount}
              inactiveCount={inactiveCount}
              trialCount={trialCount}
              nonTrialCount={nonTrialCount}
            />

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <TextSearch placeholder="Search by name" />
              </div>
              <FilterSelect filter={filter} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Suspense key={companies} fallback={<UserTableSkeleton />}>
              <AllCompaniesTable
                companies={companies}
                page={page}
                itemsPerPage={itemsPerPage}
                totalCount={totalCount}
                totalPages={totalPages}
                onUpdateCompany={handleUpdateCompany}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
