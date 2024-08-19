import React from "react";

const InputLabel = ({ icon: IconComponent, ...props }) => {
    return (
        <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {IconComponent && <IconComponent className="w-5 h-5 text-rose-400" />}
            </div>
            <input
                {...props}
                className="w-full pl-10 pr-3 py-2 bg-amber-700 bg-opacity-50 rounded-lg border border-amber-600
                focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400
                transition duration-200"
            />
        </div>
    )
}

export default InputLabel;