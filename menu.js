const config = {
  restaurant: {
    name: "La Fredes",
    slogan: "Del Perú a tu mesa",
    description: "Sabores que nacen de nuestra tierra y llegan directo a tu mesa.",
    about: "En La Fredes celebramos la riqueza de la cocina peruana a través de sabores que nos conectan con nuestras raíces. Cada plato está pensado para llevar un pedacito del Perú directamente a tu mesa.",
    whatsapp: "51906420034", // Reemplazar por número real
    address: "Av. Principal 123, Trujillo",
    hours: "Lun - Dom: 12:00 PM - 10:00 PM",
    socials: {
      instagram: "#",
      facebook: "#",
      tiktok: "#"
    },
    googleMaps: "#"
  },
  paymentMethods: ["Efectivo", "Yape", "Plin", "Otro"]
};

const menuData = [
  {
    id: 1,
    nombre: "Lomo Saltado",
    descripcion: "Jugosos trozos de carne salteados al wok con cebolla, tomate, papas fritas y arroz.",
    precio: 28.00,
    categoria: "Platos de fondo",
    imagen: "https://images.unsplash.com/photo-1627308595171-d1b5d67129c4?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 2,
    nombre: "Ceviche Clásico",
    descripcion: "Pescado fresco marinado en limón, ají limo, cebolla roja, acompañado de camote y choclo.",
    precio: 35.00,
    categoria: "Marinos",
    imagen: "https://images.unsplash.com/photo-1536521516147-3f3099ea6ba5?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 3,
    nombre: "Ají de Gallina",
    descripcion: "Cremoso guiso de ají amarillo con pechuga deshilachada, papa, huevo y aceituna.",
    precio: 25.00,
    categoria: "Criollos",
    imagen: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 4,
    nombre: "Causa Limeña",
    descripcion: "Suave masa de papa amarilla sazonada, rellena de pollo, mayonesa y palta.",
    precio: 18.00,
    categoria: "Entradas",
    imagen: "https://images.unsplash.com/photo-1681223405763-71887e4529db?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 5,
    nombre: "Arroz con Mariscos",
    descripcion: "Arroz graneado con una selección de mariscos al vino blanco y ají panca.",
    precio: 38.00,
    categoria: "Marinos",
    imagen: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 6,
    nombre: "Anticuchos",
    descripcion: "Corazón de res marinados en ají panca a la parrilla, con papa dorada y choclo.",
    precio: 22.00,
    categoria: "Parrillas",
    imagen: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 7,
    nombre: "Chicha Morada",
    descripcion: "Bebida tradicional de maíz morado, piña, manzana, canela y clavo.",
    precio: 7.00,
    categoria: "Bebidas",
    imagen: "https://images.unsplash.com/photo-1615486511484-9dc36481c9ba?q=80&w=800&auto=format&fit=crop",
    disponible: true
  },
  {
    id: 8,
    nombre: "Suspiro a la Limeña",
    descripcion: "Suave manjar de yemas cubierto con merengue al oporto y canela.",
    precio: 12.00,
    categoria: "Postres",
    imagen: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    disponible: false // Ejemplo de agotado
  }
];

const categorias = ["Todos", "Entradas", "Platos de fondo", "Criollos", "Marinos", "Parrillas", "Combos", "Bebidas", "Postres"];
