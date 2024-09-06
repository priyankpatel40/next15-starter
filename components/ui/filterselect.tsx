'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

interface FilterSelectProps {
  filter: string;
}

export default function FilterSelect({ filter }: FilterSelectProps) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={filter} onValueChange={handleChange}>
      <SelectTrigger className="w-full sm:w-[180px] border border-gray-300 dark:border-gray-600 rounded-md">
        <SelectValue placeholder="Filter users" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="inactive">Inactive</SelectItem>
      </SelectContent>
    </Select>
  );
}
