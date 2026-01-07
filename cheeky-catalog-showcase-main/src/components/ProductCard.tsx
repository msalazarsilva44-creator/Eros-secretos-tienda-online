import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface ProductCardProps {
  id?: number;
  name: string;
  price: number;
  category: string;
  image: string;
  isNew?: boolean;
  description?: string;
}

const ProductCard = ({ id, name, price, category, image, isNew, description }: ProductCardProps) => {
  const handleWhatsApp = () => {
    const message = `Hola, me interesa consultar sobre el producto: ${name}`;
    const encodedMessage = encodeURIComponent(message);
    // Número de WhatsApp de Eros Secretos - Venezuela
    const phoneNumber = "584129360095"; // +58 412-9360095 (sin símbolos ni espacios)
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        {isNew && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            ✨ Nuevo
          </Badge>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <Badge variant="secondary" className="mb-2 text-xs self-start">
          {category}
        </Badge>
        <h3 className="font-semibold text-lg mb-2 text-card-foreground line-clamp-2">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-auto space-y-3">
          <p className="text-2xl font-bold text-primary">
            €{price.toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <Button 
            onClick={handleWhatsApp}
            className="w-full bg-green-500 hover:bg-green-600 text-white gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
