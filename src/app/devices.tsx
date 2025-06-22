import React, { useEffect, useState } from "react"
import { getDevices, switchDevice } from "./spotify";
import { Device, DeviceRequest } from "./types";
import { FaLaptop, FaMobile, FaVolumeHigh } from "react-icons/fa6";

type DeviceModalProps = {
    onClose: () => void;
};

export default function DeviceModal({ onClose }: DeviceModalProps) {

    const [deviceInfo, setDeviceInfo] = useState<DeviceRequest | null>(null);

    async function getDeviceInfo() {
        const data = await getDevices();
        setDeviceInfo(data);
    }

    function getIcon(device: string) {
        let icon = <FaLaptop />;
        switch (device) {
            case "computer":
                icon = <FaLaptop />;
                break;
            case "smartphone":
                icon = <FaMobile />;
                break;
            case "speaker":
                icon = <FaVolumeHigh />;
                break;
        }
        return icon;
    }

    async function handleSwitch(e: React.MouseEvent<HTMLButtonElement>) {
        await switchDevice(e.currentTarget.id);
        onClose();
    }

    useEffect(() => {
        getDeviceInfo();
    }, [])

    return (
        <div className="fixed inset-0 flex flex-col gap-2 items-center justify-center bg-opacity-20 z-50 font-sans">
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
                <div className="flex flex-col">
                    {deviceInfo && deviceInfo.devices?.length > 0 ? (
                        deviceInfo.devices?.map((device: Device) => (
                            <div key={device.id} className="py-2 flex flex-row items-center justify-between border-b last:border-b-0">
                                <div className="flex flex-col">
                                    <p className="text-gray-800">{device.name}</p>
                                    <p className="text-xs text-gray-500 flex flex-row items-center gap-1">{getIcon(device.type)}{device.type}</p>
                                </div>
                                <button onClick={(e) => handleSwitch(e)} id={device.id} disabled={device.is_active} className="justify-self-end disabled:bg-gray-700 rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white hover:text-gray-900">{device.is_active?"Is Active" : "Switch"}</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No devices found.</p>
                    )}
                </div>
                <div className="flex justify-end my-2">
                    <button
                        onClick={onClose}
                        className="rounded-full bg-green-700 hover:bg-green-400 p-3 flex flex-row items-center gap-2 group transition-colors duration-200 text-white hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}