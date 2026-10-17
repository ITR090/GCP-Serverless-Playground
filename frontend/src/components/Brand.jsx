import { Link } from 'react-router-dom';
import { ScanEye } from 'lucide-react';

const Brand = () => (
    <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-content shadow-sm">
            <ScanEye className="h-5 w-5" />
        </span>
        <span className="text-lg">Vision<span className="text-primary">Lab</span></span>
    </Link>
);

export default Brand;
