"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

const DynamicContent = ({ pageLocation = 'homepage' }) => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlocks();
  }, [pageLocation]);

  const fetchBlocks = async () => {
    try {
      const response = await fetch(`/api/public/content?pageLocation=${pageLocation}`);
      if (response.ok) {
        const data = await response.json();
        setBlocks(data);
      }
    } catch (error) {
      console.error('Error fetching content blocks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ios-container space-y-12 py-20">
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!blocks.length) {
    return null;
  }

  const renderBlock = (block, index) => {
    const isEven = index % 2 === 0;
    
    switch (block.blockType) {
      case 'text':
        return (
          <section key={block.id} className="py-20 relative overflow-hidden">
            <div className="ios-container">
              <div className="max-w-4xl mx-auto text-center ios-fade-in">
                <h2 className="ios-title mb-8">{block.title}</h2>
                <div 
                  className="ios-body text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              </div>
            </div>
          </section>
        );

      case 'image':
        return (
          <section key={block.id} className="py-20 relative overflow-hidden">
            <div className="ios-container">
              <div className="max-w-6xl mx-auto text-center ios-fade-in">
                <h2 className="ios-title mb-12">{block.title}</h2>
                {block.image && (
                  <div className="relative rounded-3xl overflow-hidden ios-card group">
                    <Image
                      src={block.image}
                      alt={block.title}
                      width={1200}
                      height={600}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                  </div>
                )}
                <div 
                  className="ios-body text-lg mt-8 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              </div>
            </div>
          </section>
        );

      case 'text_image':
        return (
          <section key={block.id} className="py-20 relative overflow-hidden">
            <div className="ios-container">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`ios-fade-in ${!isEven ? 'lg:order-2' : ''}`}>
                  <h2 className="ios-title mb-6">{block.title}</h2>
                  <div 
                    className="ios-body text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
                {block.image && (
                  <div className={`ios-fade-in ${!isEven ? 'lg:order-1' : ''}`}>
                    <div className="relative rounded-3xl overflow-hidden ios-card group">
                      <Image
                        src={block.image}
                        alt={block.title}
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'hero':
        return (
          <section key={block.id} className="relative py-32 overflow-hidden">
            {block.image && (
              <div className="absolute inset-0">
                <Image
                  src={block.image}
                  alt={block.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/50"></div>
              </div>
            )}
            <div className="relative z-10 ios-container text-center">
              <div className="max-w-4xl mx-auto ios-fade-in">
                <h2 className="ios-title mb-8 text-white">{block.title}</h2>
                <div 
                  className="ios-body text-xl text-white/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              </div>
            </div>
          </section>
        );

      case 'feature':
        return (
          <section key={block.id} className="py-20 relative overflow-hidden">
            <div className="ios-container">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16 ios-fade-in">
                  <h2 className="ios-title mb-6">{block.title}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="ios-card p-8 text-center ios-fade-in group hover:scale-105 transition-all duration-300">
                    {block.image && (
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl overflow-hidden">
                        <Image
                          src={block.image}
                          alt={block.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div 
                      className="ios-body leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'testimonial':
        return (
          <section key={block.id} className="py-20 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden">
            <div className="ios-container">
              <div className="max-w-4xl mx-auto text-center ios-fade-in">
                <h2 className="ios-title mb-12">{block.title}</h2>
                <div className="ios-card p-12">
                  {block.image && (
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                      <Image
                        src={block.image}
                        alt={block.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div 
                    className="ios-body text-lg italic leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              </div>
            </div>
          </section>
        );

      default:
        return (
          <section key={block.id} className="py-20 relative overflow-hidden">
            <div className="ios-container">
              <div className="max-w-4xl mx-auto text-center ios-fade-in">
                <h2 className="ios-title mb-8">{block.title}</h2>
                <div 
                  className="ios-body text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: block.content }}
                />
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="relative">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default DynamicContent;
