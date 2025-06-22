import React from "react"

type DeviceModalProps = {
    onClose: () => void;
};

export default function DeviceModal({ onClose }: DeviceModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-20 z-50 font-sans">
            <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
            <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-900 font-semibold">Devices</p>
                <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                aria-label="Close"
                >
                &times;
                </button>
            </div>
            <div className="flex justify-end">
                <button
                onClick={onClose}
                className="rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white"
                >
                Close Modal
                </button>
            </div>
            </div>
        </div>
    )
}