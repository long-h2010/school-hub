import { Info, CheckCircle, AlertTriangle, AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    duration?: number;
    onClose?: () => void;
}

const Alert: React.FC<Props> = ({ type = 'info', message, duration = 1500, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (!duration) return;

        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;
    
    const styles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };

    const icons = {
        info: <Info className='w-5 h-5' />,
        success: <CheckCircle className='w-5 h-5' />,
        warning: <AlertTriangle className='w-5 h-5' />,
        error: <AlertCircle className='w-5 h-5' />,
    };

    return (
        <div className={`flex items-center gap-3 p-4 border rounded-lg ${styles[type]}`}>
            <div className='flex-shrink-0'>{icons[type]}</div>
            <div className='flex-1'>
                <div className='font-semibold mb-1 capitalize'>{type}</div>
                <div className='text-sm'>{message}</div>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className='flex-shrink-0 hover:opacity-70 transition-opacity'
                >
                    <X className='w-5 h-5' />
                </button>
            )}
        </div>
    );
};

export default Alert;
