'use client';

import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';
import { deleteCompanyById } from '@/data/company';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircledIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
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
import { EditUserModal } from './edituserModal';
import { User } from '@prisma/client';
import { toggleUserStatusById } from '@/data/user';

export function EditUserLink({
  userData,
  onUserUpdated,
}: {
  userData: User;
  onUserUpdated: (user: User) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleUserUpdate = (user: User) => {
    onUserUpdated(user);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="rounded-md p-1 transition-transform duration-200 transform hover:scale-105"
        >
          <Pencil1Icon className="w-7 h-7 text-blue-600 transition-transform duration-200 transform hover:scale-105 hover:text-blue-800 rounded-md p-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <EditUserModal
          userData={userData}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onUserUpdated={handleUserUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}

export function DeleteUserLink({
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
          message: 'User deleted successfully',
          type: 'success',
        });
      } else {
        showToast({
          message: 'Failed to delete user',
          type: 'error',
        });
      }
    });
  };
  return (
    <Button
      variant="link"
      className="rounded-md p-1 transition-transform duration-200 transform hover:scale-105"
      onClick={deleteCompany}
    >
      <TrashIcon className="w-7 h-7 text-red-600 transition-transform duration-200 transform hover:scale-105 hover:text-red-800 hover:bg-red-100 rounded-md p-1" />
      Delete{' '}
    </Button>
  );
}

export function UserStatusLink({
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
    const success = await toggleUserStatusById(id);
    if (success) {
      if (status) {
        showToast({
          message: 'User is deactivated now.',
          type: 'warning',
        });
      } else {
        showToast({
          message: 'User is activated now.',
          type: 'success',
        });
      }
      onStatusChange(id, newStatus);
    } else {
      showToast({
        message: 'Failed to update user status',
        type: 'error',
      });
    }
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="rounded-md p-1 transition-transform duration-200 transform hover:scale-105"
        >
          {status ? (
            <>
              <XCircleIcon className="w-7 h-7 text-red-600 hover:text-red-800  rounded-md p-1" />
              Deactivate
            </>
          ) : (
            <>
              <CheckCircledIcon className="w-7 h-7 text-green-600 hover:text-green-800  rounded-md p-1" />
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
              ? 'This user will be deactivated immediately, and will loose the access to all the features as per the assigned role.'
              : 'This user will be activated immediately, and will get the access to all the features as per the assigned role.'}
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
