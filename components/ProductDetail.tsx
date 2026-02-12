import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // Helper to ensure paths are absolute
  const resolvePath = (path: string) => {
    const trimmed = path.trim();
    if (trimmed.startsWith('http') || trimmed.startsWith('data:')) return trimmed;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Not+Found';
  };

  const handleProfileImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Profile';
  };

  return (
    <div className="w-full">
      <div className="pb-12 text-slate-800">
        {/* Dynamic Parsing */}
        <div className="space-y-4">
          {product.description.split('\n').map((line, i) => {
             const trimmed = line.trim();
             
             // 1. Headers (Large Section Titles)
             if (trimmed.startsWith('###')) {
               return (
                 // Reduced mobile size to 18px
                 <h3 key={i} className="text-[18px] lg:text-[22px] font-bold text-slate-900 mt-8 lg:mt-10 mb-4 lg:mb-5 tracking-tight leading-snug border-b-2 border-slate-900 pb-2 lg:pb-3 inline-block">
                   {trimmed.replace('###', '').trim()}
                 </h3>
               );
             }
             
             // 2. Bold text on its own line (Used for Names/Sub-titles)
             if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
               return (
                 <p key={i} className="text-[16px] lg:text-[18px] font-bold text-slate-900 mt-5 lg:mt-6 mb-2 tracking-tight">
                   {trimmed.replace(/\*\*/g, '')}
                 </p>
               );
             }

             // 3. Images (Large - Content)
             if (trimmed.startsWith('IMAGE:')) {
               return (
                 <div key={i} className="my-5 lg:my-6 rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                   <img 
                     src={resolvePath(trimmed.replace('IMAGE:', ''))} 
                     alt="Content" 
                     className="w-full h-auto block" 
                     onError={handleImageError}
                   />
                 </div>
               );
             }

             // 4. Images (Profile/Team - Now Larger & Rectangular)
             if (trimmed.startsWith('IMAGE_S:')) {
               return (
                 <div key={i} className="my-3 lg:my-4">
                   <img 
                     src={resolvePath(trimmed.replace('IMAGE_S:', ''))} 
                     alt="Profile" 
                     className="w-full max-w-[200px] lg:max-w-[240px] h-auto rounded-lg border border-slate-100 shadow-sm block object-cover" 
                     onError={handleProfileImageError}
                   />
                 </div>
               );
             }

             // 5. Captions / Notes
             if (trimmed.startsWith('CAPTION:') || trimmed.startsWith('* ')) {
               return <p key={i} className="text-[11px] lg:text-[13px] text-slate-500 mt-1 mb-4 leading-relaxed pl-1 tracking-tight">{trimmed.replace('CAPTION:', '')}</p>;
             }

             // 6. Horizontal Rule
             if (trimmed.startsWith('---')) {
               return <hr key={i} className="my-6 lg:my-8 border-slate-200" />;
             }

             // 7. Empty lines
             if (trimmed === '') {
               return <div key={i} className="h-1 lg:h-2"></div>;
             }

             // 8. Normal Paragraphs
             // Reduced mobile font to 14px
             const parts = line.split(/(\*\*.*?\*\*)/g);
             return (
               <p key={i} className="text-[14px] lg:text-[16px] leading-[1.65] lg:leading-[1.7] tracking-[-0.025em] text-slate-800 break-keep">
                 {parts.map((part, idx) => {
                   if (part.startsWith('**') && part.endsWith('**')) {
                     return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                   }
                   return part;
                 })}
               </p>
             );
          })}
        </div>

        {/* Refund Policy Box */}
        <div className="mt-12 lg:mt-16 bg-[#f9fafb] p-5 lg:p-6 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-3 text-[13px] lg:text-[15px] flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00c7ae]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            환불 및 교환 정책
          </h4>
          <div className="text-[11px] lg:text-[13px] text-slate-600 whitespace-pre-line leading-relaxed tracking-tight">
            {product.refundPolicy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;