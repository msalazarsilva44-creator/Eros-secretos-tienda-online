import { MapPin, Instagram, Music2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 border-t border-slate-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Ubicación */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold">Ubicación</h3>
            </div>
            <p className="text-gray-300 text-center md:text-left">
              La Victoria, Estado Aragua
            </p>
            <p className="text-gray-400 text-sm mt-1">Venezuela</p>
          </div>

          {/* Redes Sociales */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4">Síguenos</h3>
            <div className="flex gap-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/erossecretos/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-700 hover:bg-pink-600 transition-colors duration-300 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@erossecretos"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-slate-700 hover:bg-black transition-colors duration-300 flex items-center justify-center"
                aria-label="TikTok"
              >
                <Music2 className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-bold mb-3">Eros Secretos</h3>
            <p className="text-gray-300 text-sm">
              Tu tienda de confianza para productos íntimos premium
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-6">
          <p className="text-center text-gray-400 text-sm">
            © 2024 Eros Secretos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
