import { useEffect, useState } from "react";
import { Link } from "wouter";
import Slider from "react-slick";
import { type InsertQnaSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SlideItem {
  title: string;
  img: string;
  category: string;
  description?: string;
  isFromSupabase?: boolean;
  mediaType?: 'image' | 'video';
}

const EcoProductGallery = () => {
  const [slides, setSlides] = useState<SlideItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // 사용자 상호작용 후 자동재생 시도
  const attemptAutoplay = () => {
    if (!userInteracted) return;
    
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((video, index) => {
      if (video.paused) {
        video.play().catch((error) => {
          console.log(`영상 ${index} 자동 재생 실패:`, error);
        });
      }
    });
  };

  // 사용자 상호작용 감지
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteracted(true);
      // 상호작용 후 자동재생 시도
      setTimeout(attemptAutoplay, 100);
    };

    // 다양한 사용자 상호작용 이벤트 리스너
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  // Supabase에서 등록된 이미지 가져오기
  useEffect(() => {
    const fetchProductImages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_gallery')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('이미지 가져오기 오류:', error);
          return;
        }

        if (data && data.length > 0) {
          // 디버깅: 데이터 구조 확인
          console.log('Supabase에서 가져온 데이터:', data);
          
          // Supabase 미디어를 슬라이드로 변환
          const supabaseSlides: SlideItem[] = data.map((item) => ({
            title: item.title,
            img: item.image_url,
            category: item.description || 'Product',
            description: item.description,
            isFromSupabase: true,
            mediaType: (item.mime_type && item.mime_type.startsWith('video/') ? 'video' : 'image') as 'image' | 'video'
          }));

          console.log('변환된 슬라이드:', supabaseSlides);

          // Supabase 미디어만 사용
          setSlides(supabaseSlides);
        }
      } catch (error) {
        console.error('이미지 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductImages();

    // 실시간 구독 설정
    const channel = supabase
      .channel('product_gallery_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'product_gallery'
        },
        () => {
          // 변경사항이 발생하면 이미지 목록을 다시 가져오기
          fetchProductImages();
        }
      )
      .subscribe();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 슬라이더 초기화 후 첫 번째 영상 자동 재생
  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      // 슬라이더가 렌더링된 후 첫 번째 영상 자동 재생
      const timer = setTimeout(() => {
        if (userInteracted) {
          const firstVideo = document.querySelector('video');
          if (firstVideo && firstVideo.paused) {
            firstVideo.play().catch(() => {
              console.log('첫 번째 영상 자동 재생 실패:', firstVideo.src);
            });
          }
        }
      }, 1000); // 1초 후 실행

      // 추가로 모든 영상이 로드된 후 자동재생 시도
      const loadTimer = setTimeout(() => {
        if (userInteracted) {
          const allVideos = document.querySelectorAll('video');
          allVideos.forEach((video, index) => {
            if (index === 0 && video.paused) {
              video.play().catch(() => {
                console.log('첫 번째 영상 자동 재생 실패:', video.src);
              });
            }
          });
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(loadTimer);
      };
    }
  }, [isLoading, slides.length, userInteracted]);

  const productCategories = [
    'Recycled Kraft Paper Shopping Bag',
    'Biodegradable shopping bag', 
    'Biodegradable straws'
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    beforeChange: (oldIndex: number, newIndex: number) => {
      // 슬라이드 변경 시 이전 영상 정지, 새 영상 재생
      const allVideos = document.querySelectorAll('video');
      allVideos.forEach((video, index) => {
        if (index === newIndex) {
          // 새 슬라이드의 영상 재생 (사용자 상호작용 후에만)
          if (userInteracted) {
            setTimeout(() => {
              if (video.paused) {
                video.play().catch(() => {
                  console.log('슬라이드 변경 후 자동 재생 실패:', video.src);
                });
              }
            }, 100);
          }
        } else {
          // 다른 슬라이드의 영상 정지
          video.pause();
          video.currentTime = 0;
        }
      });
    },
    afterChange: (currentIndex: number) => {
      // 슬라이드 변경 완료 후 현재 영상 재생 확인
      if (userInteracted) {
        setTimeout(() => {
          const currentSlide = document.querySelector(`[data-slick-index="${currentIndex}"]`);
          if (currentSlide) {
            const video = currentSlide.querySelector('video');
            if (video && video.paused) {
              video.play().catch(() => {
                console.log('슬라이드 변경 완료 후 자동 재생 실패:', video.src);
              });
            }
          }
        }, 200);
      }
    }
  };

  return (
    <section id="gallery" className="section bg-brand-beige/40">
      <div className="container-max">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green">
          Eco Product Gallery
        </h2>
        <p className="mt-2 text-neutral-700">
          RenewTech's eco package collection focused on the products themselves.
        </p>

        <div className="mt-10">
          {/* Product Categories */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {productCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg text-center" data-testid={`category-${index}`}>
                <h3 className="text-xl font-bold text-brand-green mb-2">{category}</h3>
                <p className="text-sm text-gray-600">
                  {category === 'Recycled Kraft Paper Shopping Bag' ? 'Made from 100% recycled kraft paper' :
                   category === 'Biodegradable shopping bag' ? 'Completely biodegradable material' :
                   'Eco-friendly biodegradable straws'}
                </p>
              </div>
            ))}
          </div>
          
          {/* Product Gallery Slider */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-brand-green mb-6 text-center">Product Gallery</h3>
            
            {/* 자동재생 안내 메시지 */}
            {!userInteracted && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-700">
                  💡 영상 자동재생을 위해 페이지를 클릭하거나 스크롤해주세요
                </p>
              </div>
            )}
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green"></div>
                <span className="ml-3 text-gray-600">이미지를 불러오는 중...</span>
              </div>
            ) : slides.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>등록된 제품 이미지가 없습니다.</p>
              </div>
            ) : (
                              <Slider {...settings}>
                  {slides.map((c, i) => (
                    <div key={i} className="px-4">
                      <div className="rounded-2xl overflow-hidden shadow-lg bg-white">
                        {c.mediaType === 'video' ? (
                          <video 
                            src={c.img} 
                            className="w-full h-64 object-contain bg-gray-50"
                            controls
                            preload="auto"
                            autoPlay
                            muted
                            loop
                            playsInline
                            onLoadedData={(e) => {
                              // 영상 로드 완료 시 자동재생
                              const video = e.target as HTMLVideoElement;
                              if (video.paused) {
                                video.play().catch(() => {
                                  console.log('자동 재생이 차단되었습니다:', video.src);
                                });
                              }
                            }}
                            onCanPlay={(e) => {
                              // 영상 재생 가능 시 자동재생
                              const video = e.target as HTMLVideoElement;
                              if (video.paused) {
                                video.play().catch(() => {
                                  console.log('CanPlay 이벤트에서 자동 재생 실패:', video.src);
                                });
                              }
                            }}
                            onPlay={(e) => {
                              console.log('영상 재생 시작:', (e.target as HTMLVideoElement).src);
                            }}
                            onPause={(e) => {
                              console.log('영상 일시정지:', (e.target as HTMLVideoElement).src);
                            }}
                            onError={(e) => {
                              // 영상 로드 실패 시 기본 이미지로 대체
                              const target = e.target as HTMLVideoElement;
                              target.style.display = 'none';
                              const img = document.createElement('img');
                              img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBDMTEwLjQ1NyA2MCAxMTkuMDQzIDY4LjU4NTggMTE5LjA0MyA3OVYxMjFDMTE5LjA0MyAxMzEuNDE0IDExMC40NTcgMTQwIDEwMCAxNDBDODkuNTQzIDg5LjU4NTggODAuOTU3IDgxIDgwLjk1NyA3OVYxMjFDODAuOTU3IDY4LjU4NTggODkuNTQzIDYwIDEwMCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                              img.className = 'w-full h-64 object-contain bg-gray-50';
                              img.alt = c.title;
                              target.parentNode?.appendChild(img);
                            }}
                          />
                        ) : (
                          <img 
                            src={c.img} 
                            alt={c.title} 
                            className="w-full h-64 object-contain bg-gray-50"
                            onError={(e) => {
                              // 이미지 로드 실패 시 기본 이미지로 대체
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNjBDMTEwLjQ1NyA2MCAxMTkuMDQzIDY4LjU4NTggMTE5LjA0MyA3OVYxMjFDMTE5LjA0MyAxMzEuNDE0IDExMC40NTcgMTQwIDEwMCAxNDBDODkuNTQzIDg5LjU4NTggODAuOTU3IDgxIDgwLjk1NyA3OVYxMjFDODAuOTU3IDY4LjU4NTggODkuNTQzIDYwIDEwMCA2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                        )}
                        <div className="p-6">
                          <h4 className="font-bold text-lg text-brand-dark-green">{c.title}</h4>
                          <p className="mt-2 text-sm text-neutral-600">
                            {c.description || 'Comfort for you. Relief for the Earth.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const QnaSection = () => {
  const [formData, setFormData] = useState<InsertQnaSubmission>({
    name: "",
    email: "",
    question: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.question) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    
    // Simulate form submission without actually saving
    setTimeout(() => {
      setFormData({ name: "", email: "", question: "" });
      setIsSubmitting(false);
      toast({
        title: "Question submitted!",
        description: "We will get back to you soon.",
      });
    }, 1000);
  };

  const handleInputChange = (field: keyof InsertQnaSubmission) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <section id="qna" className="py-20 bg-brand-beige" data-testid="qna-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6 font-english" data-testid="qna-title-english">Q&A</h2>
          <p className="text-xl text-gray-700" data-testid="qna-title-english">Have questions? Send them to us</p>
        </div>
        
         <div className="max-w-2xl mx-auto">
           {/* Question Form */}
           <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-form">
            <h3 className="text-2xl font-bold text-brand-green mb-6">Ask a Question</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                  placeholder="Enter your name"
                  data-testid="input-name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                  placeholder="Enter your email"
                  data-testid="input-email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Question *
                </label>
                <textarea
                  id="question"
                  rows={4}
                  value={formData.question}
                  onChange={handleInputChange("question")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors resize-none"
                  placeholder="Please describe your question in detail"
                  data-testid="textarea-question"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-green hover:bg-brand-dark-green disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                data-testid="button-submit-question"
              >
                {isSubmitting ? "Submitting..." : "Submit Question"}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [navOpacity, setNavOpacity] = useState(0.9);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setNavOpacity(0.95);
      } else {
        setNavOpacity(0.9);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="font-korean bg-white text-gray-900">
      {/* Navigation */}
      <nav 
        className="fixed top-0 w-full z-50 backdrop-blur-sm border-b border-gray-100 transition-all duration-300"
        style={{ backgroundColor: `rgba(255, 255, 255, ${navOpacity})` }}
        data-testid="navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-brand-green font-english" data-testid="logo-english">RENEWTECH</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('problem')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-problem"
              >
                Environmental Issues
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-solution"
              >
                Solutions
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-gallery"
              >
                Gallery
              </button>
              <button 
                onClick={() => scrollToSection('qna')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-qna"
              >
                Q&A
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <div 
          className="absolute inset-0 hero-bg" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&h=1440')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        ></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in font-english" data-testid="hero-title-english">
            If not now, then when?
          </h1>
          <p className="text-2xl md:text-3xl mb-8 animate-slide-up font-light" data-testid="hero-title-korean">
            Change starts now, not later.
          </p>
          <button 
            onClick={() => scrollToSection('solution')}
            className="bg-brand-green hover:bg-brand-dark-green text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-float"
            data-testid="button-hero-cta"
          >
            Learn About RenewTech
          </button>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" data-testid="scroll-indicator">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gray-50" data-testid="problem-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-english" data-testid="problem-title-english">The Crisis We Face</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="problem-title-korean">The environmental crisis we face today</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-plastic-pollution">
              <img 
                src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ocean plastic pollution" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-plastic-pollution">Plastic Pollution</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-industrial-pollution">
              <img 
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Industrial pollution" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-industrial-pollution">Industrial Pollution</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-melting-glaciers">
              <img 
                src="https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Melting glaciers" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-melting-glaciers">Melting Glaciers</p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg" data-testid="statistics-card">
            <div className="text-6xl font-bold text-brand-green mb-4 font-english" data-testid="statistic-number">8M</div>
            <p className="text-2xl font-bold text-gray-900 mb-2 font-english" data-testid="statistic-text-english">tons of plastic enter the oceans every year</p>
            <p className="text-lg text-gray-600" data-testid="statistic-text-korean">8 million tons of plastic flow into our oceans every year</p>
          </div>
        </div>
      </section>

      {/* Hope Section */}
      <section id="hope" className="py-20 relative" data-testid="hope-section">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&h=1440')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed"
          }}
        ></div>
        <div className="absolute inset-0 bg-black/30"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 font-english" data-testid="hope-title-english">But it's not too late.</h2>
          <p className="text-2xl md:text-3xl font-light" data-testid="hope-title-korean">It's not too late to make a change.</p>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-brand-beige" data-testid="solution-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6 font-english" data-testid="solution-title-english">Why Sustainable Packaging?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto" data-testid="solution-title-korean">Why you should choose sustainable packaging</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-plants">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Corn plants" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-plants-title">Made from plants, not petroleum</h3>
              <p className="text-gray-600" data-testid="solution-plants-description">Made from eco-friendly materials extracted from plants, not petroleum</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-paper">
              <img 
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Recycled paper" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-paper-title">100% Recycled Paper</h3>
              <p className="text-gray-600" data-testid="solution-paper-description">Sustainable packaging made from 100% recycled paper</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-packaging">
              <img 
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Waterproof paper demonstration" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-packaging-title">Waterproof</h3>
              <p className="text-gray-600" data-testid="solution-packaging-description">Waterproof paper</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eco Product Gallery */}
      <EcoProductGallery />

      {/* Q&A Section */}
      <QnaSection />


      {/* Footer */}
      <footer className="bg-brand-dark-green text-white py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold font-english" data-testid="footer-logo-english">RENEWTECH</span>
              </div>
              <p className="text-gray-300 mb-6" data-testid="footer-description">Sustainable packaging solutions for a better future</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4" data-testid="footer-contact-title">Contact</h3>
              <div className="space-y-2 text-gray-300">
                <p data-testid="contact-email">Email: <a href="mailto:anytime@naver.com" className="hover:text-white transition-colors duration-200 underline">anytime@naver.com</a></p>
                <p data-testid="contact-phone">Phone: <a href="tel:+821087673888" className="hover:text-white transition-colors duration-200 underline">+82-10-8767-3888</a></p>
                <p data-testid="contact-address">Address: A-216, 484 Tongilro, Seodaemun-gu, Seoul, Korea 03628</p>
                <p data-testid="contact-website">Website: <a href="https://www.anytime.kim" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200 underline">www.anytime.kim</a></p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4" data-testid="footer-solutions-title">Solutions</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-200" data-testid="link-sustainable-packaging">Sustainable Packaging</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200" data-testid="link-paper-solutions">Paper Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200" data-testid="link-custom-design">Custom Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200" data-testid="link-consulting">Consulting</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center text-gray-300">
            <p data-testid="copyright">&copy; 2025 RENEWTECH. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
