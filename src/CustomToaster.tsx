import React from "react";
import { useToast } from "@/hooks/use-toast";
import { Transition } from "@headlessui/react";

const CustomToaster = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Transition
          key={toast.id}
          show={toast.open}
          appear={true}
          enter="animate-bounceIn"
          leave="animate-fadeOut"
        >
          <div
            className={`bg-white shadow-lg dark:bg-gray-800 dark:text-white rounded-lg p-4 flex items-start space-x-3 ${
              toast.variant === "destructive"
                ? "border-red-500"
             
                : "border-secondary"
            } border-l-4`}
          >
            <div className="flex-1">
              {toast.title && <h4 className="font-semibold">{toast.title}</h4>}
              {toast.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {toast.description}
                </p>
              )}
            </div>
            
            {toast.action && <div>{toast.action}</div>}
          </div>
        </Transition>
      ))}
    </div>
  );
};

export default CustomToaster;