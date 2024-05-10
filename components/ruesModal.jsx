'use client';

import { rues } from '@/config/site';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
} from '@nextui-org/react';

export default function RuesModal({ isOpen, onOpenChange }) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full h-full gap-2 items-center justify-center text-danger">
                <ExclamationTriangleIcon className="w-5 h-5" />
                Uyarı
              </ModalHeader>
              <ModalBody className="text-center">
                <p>
                  Lütfen iyi bir RC üyesi olup Ruesandora&apos;ya stakelerimizi
                  yapalım.
                </p>
                <Snippet
                  className="bg-transparent text-sm text-wrap min-w-9"
                  symbol=""
                  color="warning"
                >
                  {rues}
                </Snippet>
              </ModalBody>
              <ModalFooter className="flex items-center justify-center">
                <Button color="primary" onPress={() => onClose()}>
                  Tamam
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
