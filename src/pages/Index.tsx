import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import Footer from "@/components/Footer";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

// Fallback data para cuando el backend no esté disponible
const fallbackProducts = [
  { id: 1, name: "Vibrador Luxury Plus", price: 49.99, category: "Juguetes", image: "/placeholder.svg", isNew: true },
  { id: 2, name: "Conjunto Encaje Premium", price: 35.99, category: "Lencería", image: "/placeholder.svg", isNew: true },

  { id: 4, name: "Estimulador Duo Wave", price: 52.99, category: "Juguetes", image: "/placeholder.svg", isNew: true },
  { id: 5, name: "Body Transparente Deluxe", price: 42.99, category: "Lencería", image: "/placeholder.svg" },

  { id: 7, name: "Masajeador Personal Pro", price: 48.99, category: "Juguetes", image: "/placeholder.svg" },
  { id: 8, name: "Babydoll Satinado", price: 32.99, category: "Lencería", image: "/placeholder.svg" },

  { id: 10, name: "Vibrador de Bolsillo", price: 29.99, category: "Juguetes", image: "/placeholder.svg", isNew: true },
  { id: 11, name: "Negligée Encaje", price: 39.99, category: "Lencería", image: "/placeholder.svg" },

];

const fallbackCategories = ["Todos", "Juguetes", "Lencería"];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [useBackend, setUseBackend] = useState(true);

  // Intentar cargar datos del backend
  const {
    data: backendProducts,
    isLoading: isLoadingProducts,
    error: productsError
  } = useProducts();

  const {
    data: backendCategories,
    isLoading: isLoadingCategories,
    error: categoriesError
  } = useCategories();

  // Determinar qué datos usar (backend o fallback)
  const products = backendProducts || fallbackProducts;
  const categories = backendCategories ? ["Todos", ...backendCategories] : fallbackCategories;

  // Si hay error del backend, usar fallback
  if (productsError || categoriesError) {
    if (useBackend) {
      console.warn('Backend no disponible, usando datos de fallback');
      toast.warning('No se pudo conectar con el servidor. Mostrando datos de ejemplo.');
      setUseBackend(false);
    }
  }

  const filteredProducts = activeCategory === "Todos"
    ? products
    : products.filter(product => product.category === activeCategory);

  const isLoading = (isLoadingProducts || isLoadingCategories) && useBackend;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Filter */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            {activeCategory === "Todos" ? "Todos los Productos" : activeCategory}
          </h2>

          {isLoading ? (
            // Skeleton loader
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            // Productos
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  category={product.category}
                  image={product.image}
                  isNew={product.isNew}
                  description={product.description}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">No hay productos en esta categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
