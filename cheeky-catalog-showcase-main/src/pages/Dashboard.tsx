import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  Package,
  BarChart3,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  category_name: string;
  stock: number;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  image_url: string;
  attributes: Record<string, string>;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    stock: "",
    is_new: false,
    is_featured: false,
    image_url: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi<Product[]>("/api/products");
      setProducts(data);
    } catch (error) {
      toast.error("Error al cargar productos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const openCreateDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      stock: "",
      is_new: false,
      is_featured: false,
      image_url: "",
    });
    setImageFile(null);
    setImagePreview("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      stock: product.stock.toString(),
      is_new: product.is_new,
      is_featured: product.is_featured,
      image_url: product.image_url || "",
    });
    setImageFile(null);
    setImagePreview(product.image_url || "");
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor selecciona una imagen válida");
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen no debe superar 5MB");
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("stock", formData.stock || "0");
      formDataToSend.append("is_new", String(formData.is_new));
      formDataToSend.append("is_featured", String(formData.is_featured));

      // Agregar imagen si hay una nueva
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (formData.image_url && !editingProduct) {
        // Si es nuevo producto y no hay imagen, usar la URL si existe
        formDataToSend.append("image_url", formData.image_url);
      }

      if (editingProduct) {
        await fetchApi(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          body: formDataToSend,
        });
        toast.success("Producto actualizado exitosamente");
      } else {
        await fetchApi("/api/products", {
          method: "POST",
          body: formDataToSend,
        });
        toast.success("Producto creado exitosamente");
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al guardar producto"
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetchApi(`/api/products/${id}`, {
        method: "DELETE",
      });
      toast.success("Producto eliminado exitosamente");
      fetchProducts();
    } catch (error) {
      toast.error("Error al eliminar producto");
    }
  };

  // Estadísticas
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const newProducts = products.filter((p) => p.is_new).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">
            Cargando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Eros Secretos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Panel de Administración
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4 text-blue-600" />
                Total de Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {totalProducts === 1
                  ? "1 producto disponible"
                  : `${totalProducts} productos disponibles`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4 text-green-600" />
                Valor Total Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                €
                {totalValue.toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Calculado por stock × precio
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-purple-600" />
                Productos Nuevos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{newProducts}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Marcados como nuevos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Productos */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Productos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona tu catálogo de productos
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={openCreateDialog}
                className="gap-2 shadow-md hover:shadow-lg transition-shadow"
              >
                <Plus className="h-4 w-4" />
                Nuevo Producto
              </Button>
            </DialogTrigger>

            {/* Dialog Modal para crear/editar */}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Modifica los datos del producto"
                    : "Completa los datos del nuevo producto"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Vibrador Luxury Plus"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el producto..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (EUR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="49.99"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category_id">Categoría *</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>

                        <SelectItem value="1">Juguetes</SelectItem>
                        <SelectItem value="2">Lencería</SelectItem>

                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="15"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">Imagen del Producto</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Formatos: JPG, PNG, WebP (máximo 5MB)
                    </p>
                  </div>
                </div>

                {/* Vista previa de imagen */}
                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Vista Previa de Imagen</Label>
                    <div className="relative w-full h-48 rounded-lg border border-dashed border-slate-300 overflow-hidden bg-slate-50">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-100 text-green-800">
                          ✅ Imagen lista
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_new"
                      checked={formData.is_new}
                      onChange={(e) =>
                        setFormData({ ...formData, is_new: e.target.checked })
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor="is_new"
                      className="font-normal cursor-pointer"
                    >
                      Marcar como nuevo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_featured: e.target.checked,
                        })
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor="is_featured"
                      className="font-normal cursor-pointer"
                    >
                      Destacar producto
                    </Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-2">
                    {editingProduct ? "💾 Actualizar" : "✅ Crear"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabla de Productos */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle>Lista de Productos</CardTitle>
            <CardDescription>
              {products.length === 0
                ? "No hay productos aún"
                : `${products.length} producto${products.length !== 1 ? "s" : ""
                } disponible${products.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground font-medium mb-4">
                  No hay productos aún
                </p>
                <Button onClick={openCreateDialog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Crear primer producto
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="w-24 h-24 rounded-lg overflow-hidden bg-slate-50">
                          {product.image_url ? (
                            <img
                              src={
                                product.image_url.startsWith("http")
                                  ? product.image_url
                                  : `http://localhost:8001${product.image_url}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No Imagen
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.category_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          €
                          {product.price.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${product.stock > 10
                              ? "text-green-600"
                              : product.stock > 0
                                ? "text-amber-600"
                                : "text-red-600"
                              }`}
                          >
                            {product.stock} un.
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {product.is_new && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                ✨ Nuevo
                              </Badge>
                            )}
                            {product.is_featured && (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                ⭐ Destacado
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(product)}
                              className="gap-1"
                            >
                              <Edit className="h-4 w-4" />
                              <span className="hidden sm:inline">Editar</span>
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar producto?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Estás seguro de que deseas eliminar "
                                    {product.name}"? Esta acción no se puede
                                    deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(product.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

