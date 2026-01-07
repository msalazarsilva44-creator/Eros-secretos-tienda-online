import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  id: number;
  image?: string;
  title: string;
  description: string;
  buttonText: string;
}

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const slides: Slide[] = [
    {
      id: 1,
      image: "/banner_eros_secretos.jpg",
      title: "",
      description: "",
      buttonText: "",
    },
    {
      id: 2,
      image: "/slider-slide2.png",
      title: "Descubre Tu Placer",
      description: "Productos íntimos de alta calidad seleccionados para ti",
      buttonText: "Ver Catálogo",
    },
    {
      id: 3,
      image: "/slider-slide3.png",
      title: "Encaja con tu Sensualidad",
      description: "Experimenta placer premium y discreto",
      buttonText: "Explorar Colección",
    },
  ];

  // Auto-play del slider
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, [autoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setAutoPlay(false);
  };

  return (
    <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Imagen de fondo con opacidad */}
            {slide.image && (
              <div
                className={`absolute inset-0 ${slide.title ? 'opacity-40' : 'opacity-100'}`}
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            )}

            {/* Overlay degradado */}
            <div className={`absolute inset-0 ${slide.title ? 'bg-gradient-to-t from-primary/90 via-primary/60 to-primary/40' : 'bg-transparent'}`} />

            {/* Contenido del slide */}
            {slide.title && (
              <div className="relative h-full flex items-center justify-center z-10">
                <div className="max-w-3xl mx-auto text-center px-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white/90 mb-8">
                    {slide.description}
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    {slide.buttonText}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controles de navegación - Flechas */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
        aria-label="Siguiente slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Indicadores de puntos */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Contador de slides */}
      <div className="absolute top-6 right-6 z-20 text-white/80 text-sm font-medium">
        {currentSlide + 1} / {slides.length}
      </div>
    </div>
  );
};

export default HeroSlider;
