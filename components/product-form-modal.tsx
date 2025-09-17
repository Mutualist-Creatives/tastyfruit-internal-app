import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export default function ProductFormModal({
  isOpen,
  onClose,
  title,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <Dialog.Title
                  as="h3"
                  className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                  <button
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-slate-100"
                  >
                    <X className="h-5 w-5 text-slate-500" />
                  </button>
                </Dialog.Title>

                {/* Body - Form Inputs */}
                <div className="mt-4 space-y-4">
                  {/* Di sini nanti kita letakkan input form kita */}
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Nama Produk
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Kategori
                    </label>
                    <select className="mt-1 w-full rounded-lg border border-slate-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"></select>
                  </div>
                </div>

                {/* Footer - Tombol Aksi */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    onClick={onClose} // Sementara onClose, nanti ini akan submit form
                  >
                    Simpan
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
