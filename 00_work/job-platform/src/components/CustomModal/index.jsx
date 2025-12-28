"use client";

export default function CustomModal({
  isOpen,
  onClose,
  modalStyles = `z-60 relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg `,
  children,
  zIndex = 60,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center`}
      style={{ zIndex: zIndex }}
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className={modalStyles}>{children}</div>
    </div>
  );
}
