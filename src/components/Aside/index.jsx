import { XMarkIcon } from "@heroicons/react/24/solid";

const Aside = (props) => {
  const { 
    isOpen, 
    title, 
    children, 
    onClose 
  } = props;

  return (
    <>
      {/* Backdrop/Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => onClose()}
        />
      )}
      
      {/* Modal/Aside */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transform transition-transform duration-300 ease-in-out
        fixed top-0 right-0 z-50 
        w-full sm:w-[400px] md:w-[450px] 
        h-full 
        bg-white 
        shadow-2xl 
        flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-xl text-gray-800">{title}</h2>
          <button
            onClick={() => onClose()}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Cerrar"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </aside>
    </>
  );
}

export { Aside }