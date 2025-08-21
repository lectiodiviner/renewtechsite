import { useEffect, useState } from "react";
import { Link } from "wouter";
import Slider from "react-slick";
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
      <section id="qna" className="py-20 bg-brand-beige" data-testid="qna-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark-green mb-6 font-english" data-testid="qna-title-english">Q&A</h2>
            <p className="text-xl text-gray-700" data-testid="qna-title-korean">자주 묻는 질문들</p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-item-1">
              <h3 className="text-xl font-bold text-brand-green mb-4" data-testid="question-1">Q: 리뉴테크의 포장재는 어떤 소재로 만들어지나요?</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="answer-1">
                A: 리뉴테크의 포장재는 100% 재활용 종이와 식물 기반 소재로 제작됩니다. 석유 기반 플라스틱을 전혀 사용하지 않으며, 옥수수 전분 등 천연 소재를 활용하여 친환경적이면서도 내구성이 뛰어난 포장재를 제공합니다.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-item-2">
              <h3 className="text-xl font-bold text-brand-green mb-4" data-testid="question-2">Q: 방수 기능이 정말 효과적인가요?</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="answer-2">
                A: 네, 리뉴테크의 포장재는 특수 코팅 기술을 통해 뛰어난 방수 성능을 제공합니다. 비가 오는 날씨에도 내용물을 안전하게 보호하며, 플라스틱을 사용하지 않고도 우수한 방수 효과를 실현했습니다.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-item-3">
              <h3 className="text-xl font-bold text-brand-green mb-4" data-testid="question-3">Q: 대량 주문이 가능한가요?</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="answer-3">
                A: 물론입니다. 리뉴테크는 개인 고객부터 대기업까지 다양한 규모의 주문을 받고 있습니다. 브랜드 맞춤형 디자인과 로고 인쇄 서비스도 제공하며, 대량 주문 시 할인 혜택도 있습니다. 자세한 문의는 연락처로 연락 주시기 바랍니다.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg" data-testid="qna-item-4">
              <h3 className="text-xl font-bold text-brand-green mb-4" data-testid="question-4">Q: 포장재는 어떻게 폐기해야 하나요?</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="answer-4">
                A: 리뉴테크 포장재는 일반 종이류와 같이 재활용품으로 분리배출하시면 됩니다. 100% 생분해성 소재로 제작되어 자연 환경에서도 안전하게 분해되며, 재활용 과정을 통해 새로운 종이 제품으로 재탄생할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

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
