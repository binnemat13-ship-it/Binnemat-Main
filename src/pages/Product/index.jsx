import React from 'react';
import { Breadcrumb } from 'antd';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductSpecsTable from './ProductSpecsTable';
import ProductCarousel from '../../components/common/ProductCarousel';
import { useProductsByCategoryQuery } from '../../hooks/useWooQueries';

export default function ProductView({ 
  product, 
  onSelectProduct, 
  onSelectCategory, 
  onNavigateHome 
}) {
  // Uses cached category products (0 network calls when navigating from catalog/home)
  const { data: categoryProducts = [] } = useProductsByCategoryQuery(product?.category);
  const relatedProducts = (categoryProducts || []).filter(p => p.id !== product?.id);

  if (!product) {
    return (
      <div className="max-w-[1360px] mx-auto px-[5%] py-20 text-center">
        <h2 className="font-wix text-2xl font-bold mb-4">No Product Selected</h2>
        <button 
          onClick={onNavigateHome}
          className="px-6 py-2.5 rounded-full bg-[#ff3131] text-white font-bold cursor-pointer border-none shadow-sm hover:bg-[#d01a1a] transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1360px] mx-auto px-[5%] py-4 sm:py-6 relative z-10">
      {/* BREADCRUMB */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { title: <span onClick={onNavigateHome} className="cursor-pointer hover:text-[#ff3131]">Home</span> },
            { title: <span onClick={() => onSelectCategory(product.category || 'all')} className="cursor-pointer hover:text-[#ff3131] capitalize">{product.category?.replace('-', ' ') || 'Appliances'}</span> },
            { title: <span className="font-bold text-[#ff3131] dark:text-[#ff8585] line-clamp-1">{product.name}</span> }
          ]}
        />
      </div>

      {/* TOP SECTION: GALLERY + INFO (SPLIT 2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-6">
          <ProductGallery 
            images={product.images} 
            badge={product.badge} 
            name={product.name} 
          />
        </div>
        <div className="lg:col-span-6">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* FULL-WIDTH PRODUCT DESCRIPTION & FEATURES SECTION (UNDER IMAGE & INFO) */}
      <div className="glass-apple-card p-6 sm:p-10 rounded-3xl border border-[#E5E4E2] dark:border-white/10 bg-white/95 dark:bg-[#1A1715]/95 my-8 shadow-sm">
        <div className="mb-6 pb-4 border-b border-[#E5E4E2] dark:border-white/10">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-[#ff3131] dark:text-[#ff8585] block mb-1">
            DETAILED OVERVIEW
          </span>
          <h2 className="font-wix text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 m-0">
            Product Description &amp; Features
          </h2>
        </div>

        {/* FORMATTED CONTENT */}
        <div 
          className="prose dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-neutral-700 dark:text-neutral-300 font-normal space-y-4
          [&_h1]:text-2xl [&_h1]:font-black [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h1]:mt-6 [&_h1]:mb-3
          [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:dark:text-white [&_h3]:mt-5 [&_h3]:mb-2
          [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-slate-800 [&_h4]:dark:text-slate-200 [&_h4]:mt-4 [&_h4]:mb-1.5
          [&_p]:mb-3 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_ul]:my-3
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-1.5 [&_ol]:my-3
          [&_li]:leading-relaxed
          [&_strong]:font-bold [&_strong]:text-slate-900 [&_strong]:dark:text-white"
        >
          {product?.descriptionHtml ? (
            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
          ) : (
            <div className="whitespace-pre-line">
              {product?.description?.split('\n').map((line, idx) => {
                const trimmed = line.trim();
                if (!trimmed) return null;
                // If line looks like a heading or numbered title
                if (/^(\d+\.|\bKey Features\b|\bExperience Comfort\b)/i.test(trimmed)) {
                  return (
                    <h3 key={idx} className="font-bold text-slate-900 dark:text-white text-base mt-4 mb-1">
                      {trimmed}
                    </h3>
                  );
                }
                return <p key={idx} className="mb-2.5 text-neutral-600 dark:text-neutral-300">{trimmed}</p>;
              })}
            </div>
          )}
        </div>
      </div>

      {/* TECHNICAL SPECIFICATIONS TABLE */}
      <ProductSpecsTable specs={product.specs} />

      {/* RELATED PRODUCTS CAROUSEL */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <ProductCarousel
            eyebrow="MATCHING CLIMATE SOLUTIONS"
            title="Related Certified Appliances"
            products={relatedProducts}
            onSelectProduct={onSelectProduct}
          />
        </div>
      )}
    </div>
  );
}
