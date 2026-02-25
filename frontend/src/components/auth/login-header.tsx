import { GraduationCap } from 'lucide-react';

const LoginHeader: React.FC = () => {
    return (
        <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-4 shadow-lg'>
                <GraduationCap className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-4xl font-bold text-red-700 mb-2'>Duy Tan University</h1>
            <p className='text-gray-600 text-lg'>DTU HUB</p>
        </div>
    );
}

export default LoginHeader;
