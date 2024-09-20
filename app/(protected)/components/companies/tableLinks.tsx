'use client';

import { XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircledIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { showToast } from '@/components/ui/toast';
import { deleteCompanyById, toggleCompanyStatusById } from '@/data/company';

import EditCompanyModal from './editCompanyModal';

export function EditLink({
  id,
  onCompanyUpdated,
}: {
  id: string;
  onCompanyUpdated: (id: string, company: { companyName: string }) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleCompanyUpdate = (cid: string, company: { companyName: string }) => {
    onCompanyUpdated(cid, company);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="rounded-md p-1 transition-transform duration-200 hover:scale-105"
        >
          <Pencil1Icon className="size-7 rounded-md p-1 text-blue-600 transition-transform duration-200 hover:scale-105 hover:text-blue-800" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <EditCompanyModal
          id={id}
          onClose={() => setIsOpen(false)}
          onCompanyUpdate={handleCompanyUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteLink({
  id,
  onDelete,
}: {
  id: string;
  onDelete: (id: string) => void;
}) {
  const deleteCompany = async () => {
    await deleteCompanyById(id).then((res) => {
      if (res.success) {
        onDelete(id);
        showToast({
          message: 'Company deleted successfully',
          type: 'success',
        });
      } else {
        showToast({
          message: 'Failed to delete company',
          type: 'error',
        });
      }
    });
  };
  return (
    <Button
      variant="link"
      className="rounded-md p-1 transition-transform duration-200 hover:scale-105"
      onClick={deleteCompany}
    >
      <TrashIcon className="size-7 rounded-md p-1 text-red-600 transition-transform duration-200 hover:scale-105 hover:bg-red-100 hover:text-red-800" />
      Delete{' '}
    </Button>
  );
}

export function StatusLink({
  status,
  id,
  onStatusChange,
}: {
  status: boolean;
  id: string;
  onStatusChange: (id: string, newStatus: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    const newStatus = !status;
    const success = await toggleCompanyStatusById(id);
    if (success) {
      if (status) {
        showToast({
          message: 'Company is deactivated now.',
          type: 'warning',
        });
      } else {
        showToast({
          message: 'Company is activated now.',
          type: 'success',
        });
      }
      onStatusChange(id, newStatus);
      setIsLoading(false);
      setIsOpen(false);
    } else {
      showToast({
        message: 'Failed to update status',
        type: 'error',
      });
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="rounded-md p-1 transition-transform duration-200 hover:scale-105"
        >
          {status ? (
            <>
              <XCircleIcon className="size-7 rounded-md p-1 text-red-600  hover:text-red-800" />
              Deactivate
            </>
          ) : (
            <>
              <CheckCircledIcon className="size-7 rounded-md p-1 text-green-600  hover:text-green-800" />
              Activate
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm {status ? 'Deactivation' : 'Activation'}</DialogTitle>
          <DialogDescription>
            {status
              ? 'This company will be deactivated immediately, and will loose the access to all the accounts.'
              : 'This company will be activated immediately, and will get the access to all the accounts.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={handleClick}
              className="p-4"
            >
              Confirm
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="link">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
