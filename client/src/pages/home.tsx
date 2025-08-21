import { useEffect, useState } from "react";
import { Link } from "wouter";
import Slider from "react-slick";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type QnaSubmission, type InsertQnaSubmission } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import clubavoltaNature from "@assets/KakaoTalk_20250821_115422394_01_1755766655585.jpg";
import clubavoltaLakeside from "@assets/KakaoTalk_20250821_115422394_07_1755766655585.jpg";
import clubavoltaUrban from "@assets/KakaoTalk_20250821_115422394_12_1755766655586.jpg";

const EcoProductGallery = () => {
  const slides = [
    { title: 'Eco Bag – Lifestyle', img: '/images/bag_main.jpg' },
    { title: 'Eco Bag – Detail',    img: '/images/bag_detail.jpg' },
    { title: 'Eco Bag – Close-up',  img: '/images/bag_close.jpg' },
    { title: 'Eco Bag – Duo',       img: '/images/bag_pair.jpg' },
    { title: 'ClubAvolta – Nature', img: clubavoltaNature },
    { title: 'ClubAvolta – Lakeside', img: clubavoltaLakeside },
    { title: 'ClubAvolta – Urban', img: clubavoltaUrban },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  };

  return (
    <section id="gallery" className="section bg-brand-beige/40">
      <div className="container-max">
        <h2 className="text-3xl md:text-4xl font-extrabold text-brand-green">
          Eco Product Gallery
        </h2>
        <p className="mt-2 text-neutral-700">
          제품 자체에 집중한 리뉴테크의 에코 패키지 컬렉션.
        </p>

        <div className="mt-10">
          <Slider {...settings}>
            {slides.map((c, i) => (
              <div key={i} className="px-4">
                <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
                  <img src={c.img} alt={c.title} className="w-full h-80 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-lg">{c.title}</h3>
                    <p className="mt-2 text-sm text-neutral-600">
                      Comfort for you. Relief for the Earth.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
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
  const queryClient = useQueryClient();

  const { data: qnaSubmissions = [], isLoading } = useQuery<QnaSubmission[]>({
    queryKey: ["/api/qna"],
  });

  const submitQuestionMutation = useMutation({
    mutationFn: async (data: InsertQnaSubmission) => {
      const response = await apiRequest("POST", "/api/qna", data);
      return response.json();
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", question: "" });
      setIsSubmitting(false);
      toast({
        title: "질문이 제출되었습니다!",
        description: "곧 답변을 드리겠습니다.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/qna"] });
    },
    onError: () => {
      setIsSubmitting(false);
      toast({
        title: "오류가 발생했습니다",
        description: "다시 시도해 주세요.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.question) {
      toast({
        title: "모든 항목을 입력해주세요",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    submitQuestionMutation.mutate(formData);
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
          <p className="text-xl text-gray-700" data-testid="qna-title-korean">궁금한 점을 남겨주세요</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Question Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-form">
            <h3 className="text-2xl font-bold text-brand-green mb-6">질문하기</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange("name")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                  placeholder="이름을 입력해주세요"
                  data-testid="input-name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors"
                  placeholder="이메일을 입력해주세요"
                  data-testid="input-email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  질문 *
                </label>
                <textarea
                  id="question"
                  rows={4}
                  value={formData.question}
                  onChange={handleInputChange("question")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-colors resize-none"
                  placeholder="궁금한 점을 자세히 적어주세요"
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
                {isSubmitting ? "제출 중..." : "질문 제출하기"}
              </button>
            </form>
          </div>
          
          {/* Q&A List */}
          <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-list">
            <h3 className="text-2xl font-bold text-brand-green mb-6">최근 Q&A</h3>
            
            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                <div className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
              </div>
            ) : qnaSubmissions.length === 0 ? (
              <p className="text-gray-500 text-center py-8" data-testid="no-questions">아직 등록된 질문이 없습니다.</p>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {qnaSubmissions.map((submission) => (
                  <div key={submission.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0" data-testid={`qna-item-${submission.id}`}>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{submission.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          submission.isAnswered 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {submission.isAnswered ? "답변완료" : "답변대기"}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{submission.question}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(submission.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    
                    {submission.answer && (
                      <div className="bg-brand-beige/30 rounded-lg p-4">
                        <p className="text-sm font-medium text-brand-dark-green mb-1">답변:</p>
                        <p className="text-sm text-gray-700">{submission.answer}</p>
                        {submission.answeredAt && (
                          <span className="text-xs text-gray-500">
                            {new Date(submission.answeredAt).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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
              <span className="ml-2 text-lg font-medium text-gray-700" data-testid="logo-korean">리뉴테크</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => scrollToSection('problem')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-problem"
              >
                환경 문제
              </button>
              <button 
                onClick={() => scrollToSection('solution')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-solution"
              >
                솔루션
              </button>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-gallery"
              >
                갤러리
              </button>
              <button 
                onClick={() => scrollToSection('partners')}
                className="text-gray-700 hover:text-brand-green transition-colors duration-200"
                data-testid="nav-partners"
              >
                파트너
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
            지금 바꾸지 않으면, 언제 바꾸시겠습니까?
          </p>
          <button 
            onClick={() => scrollToSection('solution')}
            className="bg-brand-green hover:bg-brand-dark-green text-white px-8 py-4 rounded-lg text-lg font-medium transition-all duration-300 transform hover:scale-105 animate-float"
            data-testid="button-hero-cta"
          >
            리뉴테크 알아보기
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-testid="problem-title-korean">우리가 직면한 환경 위기</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-plastic-pollution">
              <img 
                src="https://images.unsplash.com/photo-1621451537084-482c73073a0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Ocean plastic pollution" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-plastic-pollution">플라스틱 오염</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-industrial-pollution">
              <img 
                src="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Industrial pollution" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-industrial-pollution">공장 매연</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group" data-testid="card-melting-glaciers">
              <img 
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Melting glaciers" 
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                <p className="text-white font-medium" data-testid="text-melting-glaciers">빙하 융해</p>
              </div>
            </div>
          </div>
          
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg" data-testid="statistics-card">
            <div className="text-6xl font-bold text-brand-green mb-4 font-english" data-testid="statistic-number">8M</div>
            <p className="text-2xl font-bold text-gray-900 mb-2 font-english" data-testid="statistic-text-english">tons of plastic enter the oceans every year</p>
            <p className="text-lg text-gray-600" data-testid="statistic-text-korean">매년 8백만 톤의 플라스틱이 바다로 흘러갑니다</p>
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
          <p className="text-2xl md:text-3xl font-light" data-testid="hope-title-korean">아직 늦지 않았습니다.</p>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-brand-beige" data-testid="solution-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6 font-english" data-testid="solution-title-english">Why Sustainable Packaging?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto" data-testid="solution-title-korean">지속가능한 포장재를 선택해야 하는 이유</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-plants">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Corn plants" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-plants-title">Made from plants, not petroleum</h3>
              <p className="text-gray-600" data-testid="solution-plants-description">석유가 아닌 식물에서 추출한 친환경 소재로 제작</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-paper">
              <img 
                src="https://images.unsplash.com/photo-1586075010923-2dd4570fb338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Recycled paper" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-paper-title">100% Recycled Paper</h3>
              <p className="text-gray-600" data-testid="solution-paper-description">100% 재활용 용지로 제작된 지속가능한 포장재</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="solution-card-packaging">
              <img 
                src="https://images.unsplash.com/photo-1607988795691-3d0147b43231?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Sustainable packaging" 
                className="w-full h-48 object-cover rounded-xl mb-6"
              />
              <h3 className="text-xl font-bold text-brand-green mb-4 font-english" data-testid="solution-packaging-title">Rainproof, Plastic-Free</h3>
              <p className="text-gray-600" data-testid="solution-packaging-description">방수 기능을 갖춘 플라스틱 프리 포장재</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eco Product Gallery */}
      <EcoProductGallery />

      {/* Q&A Section */}
      <QnaSection />

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-gray-50" data-testid="partners-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" data-testid="partners-title-english">Partners & Process</h2>
            <p className="text-xl text-gray-600" data-testid="partners-title-korean">협력으로 더 큰 변화를 만듭니다</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-green mb-6" data-testid="partners-subtitle">Our Partners</h3>
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4" data-testid="partner-sunjin">
                  <div className="w-16 h-16 bg-brand-green rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" data-testid="partner-sunjin-korean">선진이노텍</h4>
                    <p className="text-gray-600" data-testid="partner-sunjin-english">Sunjin Innotech</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4" data-testid="partner-paper-korea">
                  <div className="w-16 h-16 bg-brand-dark-green rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg" data-testid="partner-paper-korea-korean">페이퍼코리아</h4>
                    <p className="text-gray-600" data-testid="partner-paper-korea-english">Paper Korea</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Manufacturing process" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg"
                data-testid="img-manufacturing-process"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-dark-green text-white py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold font-english" data-testid="footer-logo-english">RENEWTECH</span>
                <span className="ml-3 text-xl" data-testid="footer-logo-korean">리뉴테크</span>
              </div>
              <p className="text-gray-300 mb-6" data-testid="footer-description">지속가능한 미래를 위한 포장재 솔루션</p>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors duration-200"
                  data-testid="link-instagram"
                >
                  <span className="sr-only">Instagram</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.351-1.053-2.351-2.351c0-1.297 1.054-2.351 2.351-2.351c1.297 0 2.351 1.054 2.351 2.351C10.8 15.935 9.746 16.988 8.449 16.988z"/>
                  </svg>
                </a>
                <a 
                  href="#" 
                  className="bg-white/10 hover:bg-white/20 p-3 rounded-lg transition-colors duration-200"
                  data-testid="link-linkedin"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
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
