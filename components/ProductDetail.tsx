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
        <div className="space-y-5">
          {product.description.split('\n').map((line, i) => {
             const trimmed = line.trim();
             
             // 1. Headers (Large Section Titles)
             if (trimmed.startsWith('###')) {
               return (
                 <h3 key={i} className="text-[24px] font-bold text-slate-900 mt-12 mb-6 tracking-tight leading-snug">
                   {trimmed.replace('###', '').trim()}
                 </h3>
               );
             }
             
             // 2. Bold text on its own line (Used for Names/Sub-titles)
             if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
               return (
                 <p key={i} className="text-[20px] font-bold text-slate-900 mt-8 mb-3 tracking-tight">
                   {trimmed.replace(/\*\*/g, '')}
                 </p>
               );
             }

             // 3. Images (Large - Content)
             if (trimmed.startsWith('IMAGE:')) {
               return (
                 <div key={i} className="my-8 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                   <img 
                     src={resolvePath(trimmed.replace('IMAGE:', ''))} 
                     alt="Content" 
                     className="w-full h-auto block" 
                     onError={handleImageError}
                   />
                 </div>
               );
             }

             // 4. Images (Profile/Team - Full Width Large Rectangular)
             if (trimmed.startsWith('IMAGE_S:')) {
               return (
                 <div key={i} className="my-6">
                   <img 
                     src={resolvePath(trimmed.replace('IMAGE_S:', ''))} 
                     alt="Profile" 
                     className="w-full h-auto rounded-xl border border-slate-100 shadow-sm block object-cover" 
                     onError={handleProfileImageError}
                   />
                 </div>
               );
             }

             // 5. Captions / Notes
             if (trimmed.startsWith('CAPTION:') || trimmed.startsWith('* ')) {
               return <p key={i} className="text-[14px] text-slate-500 mt-2 mb-6 leading-relaxed pl-1">{trimmed.replace('CAPTION:', '')}</p>;
             }

             // 6. Horizontal Rule
             if (trimmed.startsWith('---')) {
               return <hr key={i} className="my-12 border-slate-200" />;
             }

             // 7. Empty lines
             if (trimmed === '') {
               return <div key={i} className="h-3"></div>;
             }

             // 8. Normal Paragraphs
             const parts = line.split(/(\*\*.*?\*\*)/g);
             return (
               <p key={i} className="text-[17px] leading-[1.8] tracking-[-0.01em] text-slate-700 break-keep">
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
        <div className="mt-20 bg-[#f9fafb] p-7 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4 text-[16px] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#00c7ae]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            환불 및 교환 정책
          </h4>
          <div className="text-[14px] text-slate-600 whitespace-pre-line leading-relaxed tracking-tight">
            {product.refundPolicy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;