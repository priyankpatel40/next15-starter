import { BuildingOffice2Icon } from '@heroicons/react/20/solid';
import { Suspense } from 'react';

import AllCompaniesTable from '@/app/(protected)/components/companies/allcompaniestable';
import CompaniesCards from '@/app/(protected)/components/companies/companiesCards';
import FilterSelect from '@/components/ui/filterselect';
import { UserTableSkeleton } from '@/components/ui/skeletons';
import TextSearch from '@/components/ui/textSearch';
import { getAllCompanies } from '@/data/company';
import type { CompaniesTableArray } from '@/utils/types';

export default async function AllCompaniesPage({
  searchParams,
}: {
  searchParams: { page?: string; filter?: string; query?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const filter = (searchParams.filter as 'all' | 'active' | 'inactive') || 'all';
  const search = searchParams.query || '';
  const itemsPerPage = 10;

  const result = await getAllCompanies({
    page,
    itemsPerPage,
    orderBy: 'asc',
    filter,
    search,
  });

  const companies: CompaniesTableArray = (result?.companies || []).map((company) => ({
    id: company.id,
    companyName: company.companyName || '',
    createdAt: company.createdAt,
    updatedAt: company.updatedAt,
    logo: company.logo || '',
    creatorName: company.creatorName || null,
    creatorEmail: company.creatorEmail || null,
    expireDate: company.expireDate,
    apiKey: company.apiKey,
    isActive: company.isActive,
    isTrial: company.isTrial,
    subscription: company.subscription ?? {
      id: '',
      cid: '',
      userId: '',
      stripeSubscriptionId: '',
      productId: '',
      priceId: '',
      quantity: 0,
      status: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt: null,
      isActive: false,
      interval: null,
      subscriptionObj: null,
    },
  }));

  const totalCount = companies.length;
  const activeCount = companies.filter((company) => company.isActive).length;
  const inactiveCount = companies.filter((company) => !company.isActive).length;
  const trialCount = companies.filter((company) => company.isTrial).length;
  const nonTrialCount = companies.filter((company) => !company.isTrial).length;

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <section className="h-full px-4 py-6 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-400 p-0.5 shadow-lg dark:from-gray-700 dark:to-gray-900">
              <div className="rounded-full bg-white p-3 dark:bg-gray-800">
                <BuildingOffice2Icon className="size-6 text-gray-800 dark:text-gray-200" />
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
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:bg-gray-800">
          <div className="space-y-4 p-4 sm:flex sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
            <CompaniesCards
              totalCount={totalCount}
              activeCount={activeCount}
              inactiveCount={inactiveCount}
              trialCount={trialCount}
              nonTrialCount={nonTrialCount}
            />

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <div className="relative">
                <TextSearch placeholder="Search by name" />
              </div>
              <FilterSelect filter={filter} />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Suspense key={companies.length} fallback={<UserTableSkeleton />}>
              <AllCompaniesTable
                companies={companies}
                page={page}
                itemsPerPage={itemsPerPage}
                totalCount={totalCount}
                totalPages={totalPages}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
