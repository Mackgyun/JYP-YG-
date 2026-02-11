import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="w-full lg:w-[730px]">
      {/* Title Header - Mobile Only (Hidden on Desktop per layout req, but keeping accessible) */}
      <div className="lg:hidden mb-6">
        <span className="text-teal-500 font-bold text-sm mb-2 inline-block">문화·출판</span>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight mb-4">{product.title}</h1>
      </div>

      {/* Main Image */}
      <div className="w-full rounded-xl overflow-hidden bg-slate-100 mb-10 shadow-sm border border-slate-100">
        <div className="aspect-[4/3] w-full relative group">
           <img 
            src={product.images[0]} 
            alt="Main Visual" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-16 sm:top-20 z-10 bg-white border-b border-slate-200 mb-8">
        <div className="flex gap-8">
          <button className="py-4 border-b-[3px] border-teal-500 font-bold text-teal-600">프로젝트 소개</button>
          <button className="py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors">커뮤니티</button>
          <button className="py-4 border-b-[3px] border-transparent text-slate-500 hover:text-slate-800 font-medium transition-colors">후원자</button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-12">
        {/* Intro Header Styled */}
        <div className="mb-10 border-b border-slate-100 pb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2 border-b-2 border-slate-900 inline-block pb-1">
            &lt;YG와 JYP의 책걸상&gt;<br/>
            토크콘서트 2026
          </h2>
        </div>

        {/* Dynamic Markdown-like Parsing */}
        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900">
          {product.description.split('\n').map((line, i) => {
             if (line.startsWith('**') && line.endsWith('**')) {
               return <h3 key={i} className="text-xl mt-8 mb-4">{line.replace(/\*\*/g, '')}</h3>;
             }
             if (line.startsWith('---')) {
               return <hr key={i} className="my-8 border-slate-200" />;
             }
             if (line.trim() === '') {
               return <br key={i} />;
             }
             return <p key={i} className="my-2 leading-relaxed text-[16px]">{line}</p>;
          })}
        </div>

        {/* Team Info Card */}
        <div className="mt-16 p-6 border border-slate-200 rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-bold text-slate-900 mb-4">프로젝트 팀 소개</h3>
          <div className="flex items-start gap-4">
             <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl overflow-hidden border border-slate-100">
                <img src="https://picsum.photos/100/100?random=10" alt="team" className="w-full h-full object-cover" />
             </div>
             <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-900">{product.creator}</span>
                  <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded font-medium">진행한 프로젝트 0</span>
               </div>
               <p className="text-sm text-slate-500 mb-4">'책'에 관한 '걸'쭉하고 '상'큼한 이야기! YG와 JYP의 책걸상</p>
               <div className="flex gap-4 text-sm text-slate-400">
                  <span>팔로워 <b className="text-slate-700">0</b></span>
                  <span>응원 <b className="text-slate-700">0</b></span>
                  <span>후기 <b className="text-slate-700">0</b></span>
               </div>
             </div>
          </div>
        </div>

        {/* Refund Policy */}
        <div className="mt-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            환불 및 교환 정책
          </h4>
          <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {product.refundPolicy}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;