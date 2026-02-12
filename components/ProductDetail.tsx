import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="w-full lg:w-[700px]">
      {/* Main Image - Slightly smaller container as requested */}
      <div className="w-full rounded-xl overflow-hidden bg-slate-100 mb-8 shadow-sm border border-slate-100">
        <div className="aspect-[16/10] w-full relative">
           <img 
            src={product.images[0]} 
            alt="Main Visual" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Tab Navigation - Removed sticky positioning */}
      <div className="bg-white border-b border-slate-200 mb-10">
        <div className="flex gap-6">
          <button className="py-3 border-b-2 border-[#00c7ae] font-bold text-[#00c7ae] text-[15px]">프로젝트 소개</button>
          <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">커뮤니티</button>
          <button className="py-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors text-[15px]">후원자</button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-12 text-slate-800">
        {/* Dynamic Parsing */}
        <div className="space-y-4">
          {product.description.split('\n').map((line, i) => {
             const trimmed = line.trim();
             
             // 1. Headers
             if (trimmed.startsWith('###')) {
               return <h3 key={i} className="text-[22px] font-bold text-slate-900 mt-10 mb-4 tracking-tight border-l-4 border-[#00c7ae] pl-3">{trimmed.replace('###', '').trim()}</h3>;
             }
             
             // 2. Bold text (simulated markdown)
             if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
               return <p key={i} className="text-[17px] font-bold text-slate-900 mt-6 mb-2 tracking-tight">{trimmed.replace(/\*\*/g, '')}</p>;
             }

             // 3. Images (Large)
             if (trimmed.startsWith('IMAGE:')) {
               return (
                 <div key={i} className="my-6 rounded-lg overflow-hidden border border-slate-100">
                   <img src={trimmed.replace('IMAGE:', '').trim()} alt="Content" className="w-full h-auto block" />
                 </div>
               );
             }

             // 4. Images (Small - Profile style)
             if (trimmed.startsWith('IMAGE_S:')) {
               return (
                 <div key={i} className="my-4 w-32 h-32 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                   <img src={trimmed.replace('IMAGE_S:', '').trim()} alt="Profile" className="w-full h-full object-cover" />
                 </div>
               );
             }

             // 5. Captions / Notes
             if (trimmed.startsWith('CAPTION:') || trimmed.startsWith('* ')) {
               return <p key={i} className="text-[13px] text-slate-500 mt-1 mb-4 leading-normal pl-1">{trimmed.replace('CAPTION:', '')}</p>;
             }

             // 6. Horizontal Rule
             if (trimmed.startsWith('---')) {
               return <hr key={i} className="my-10 border-slate-100" />;
             }

             // 7. Empty lines
             if (trimmed === '') {
               return <div key={i} className="h-2"></div>;
             }

             // 8. Normal Paragraphs
             // Highlight bold parts inside the text
             const parts = line.split(/(\*\*.*?\*\*)/g);
             return (
               <p key={i} className="text-[16px] leading-[1.75] tracking-tight text-slate-700 break-keep">
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
        <div className="mt-16 bg-[#f9fafb] p-6 rounded-lg border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-3 text-[15px] flex items-center gap-2">
            <svg className="w-4 h-4 text-[#00c7ae]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
            환불 및 교환 정책
          </h4>
          <div className="text-[13px] text-slate-600 whitespace-pre-line leading-relaxed tracking-tight">
            {product.refundPolicy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;