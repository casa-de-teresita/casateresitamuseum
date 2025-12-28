// src/data/roomsData.js

export const roomsDetailed = [
  {
    id: 'queen',
    slug: 'queen',
    available: 2,
    name: {
      en: 'Queen Room',
      es: 'Queen Room'
    },
    price: 60,
    size: 30,
    beds: {
      en: '1 large double bed',
      es: '1 cama doble grande'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/queenBedDeluxe.jpg'
    ],
    description: {
      en: 'With private bathroom, this room includes free toiletries.',
      es: 'Con baño privado, esta habitación incluye artículos de tocador gratuitos.'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Patio View', es: 'Vista al Patio' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle (upon request)', es: 'Hervidor Eléctrico (a solicitud)' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Shower', 'Towels', 'Hairdryer (upon request)', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Ducha', 'Toallas', 'Secador de pelo (a solicitud)', 'Papel higiénico']
    },
    view: {
      en: ['Patio view', 'Patio'],
      es: ['Vista al patio', 'Patio']
    },
    features: {
      en: ['Wooden flooring', 'Socket near bed', 'Cable channels', 'Patio'],
      es: ['Suelo de madera', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },
  {
    id: 'deluxe-queen',
    slug: 'deluxe-queen',
    available: 1,
    popular: true,
    name: {
      en: 'Deluxe Queen Room',
      es: 'Deluxe Queen Room'
    },
    price: 65,
    size: 30,
    beds: {
      en: '1 large double bed',
      es: '1 cama doble grande'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/Deluxe-room.jpeg'
    ],
    description: {
      en: 'With private bathroom, this room includes free toiletries.',
      es: 'Con baño privado, esta habitación incluye artículos de tocador gratuitos.'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Patio View', es: 'Vista al Patio' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle (upon request)', es: 'Hervidor Eléctrico (a solicitud)' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Shower', 'Towels', 'Hairdryer (upon request)', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Ducha', 'Toallas', 'Secador de pelo (a solicitud)', 'Papel higiénico']
    },
    view: {
      en: ['Patio view', 'Patio'],
      es: ['Vista al patio', 'Patio']
    },
    features: {
      en: ['Wooden flooring', 'Socket near bed', 'Cable channels', 'Patio'],
      es: ['Suelo de madera', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'single',
    slug: 'single',
    available: 2,
    name: {
      en: 'Single Room',
      es: 'Single Room'
    },
    price: 40,
    size: 20,
    beds: {
      en: '1 single bed',
      es: '1 cama individual'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/simpleRoom.jpg'
    ],
    description: {
      en: 'This single room is comprised of a flat-screen TV with cable channels...',
      es: 'Esta habitación individual cuenta con TV de pantalla plana...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Patio View', es: 'Vista al Patio' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle (upon request)', es: 'Hervidor Eléctrico (a solicitud)' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Shower', 'Towels', 'Hairdryer (upon request)', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Ducha', 'Toallas', 'Secador de pelo (a solicitud)', 'Papel higiénico']
    },
    view: {
      en: ['Patio view', 'Patio'],
      es: ['Vista al patio', 'Patio']
    },
    features: {
      en: ['Floating flooring', 'Socket near bed', 'Cable channels', 'Patio'],
      es: ['Piso flotante', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'family',
    slug: 'family',
    available: 1,
    name: {
      en: 'Family Double Room',
      es: 'Family Double Room'
    },
    price: 90,
    size: 50,
    beds: {
      en: '1 Queen bed in one room and 1 double bed + 1 single bed in another room',
      es: '1 Cama Queen en un ambiente y cama doble e individual en otro ambiente'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/doubleFamilial.jpg'
    ],
    description: {
      en: 'A private bathroom and a kitchenette space.',
      es: 'Un baño privado y un espacio para cocineta.'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Patio View', es: 'Vista al Patio' } },
      { icon: 'Users', label: { en: 'Family Friendly', es: 'Familiar' } },
      { icon: 'Coffee', label: { en: 'Kitchenette', es: 'Cocineta' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Shower', 'Towels', 'Hairdryer (upon request)', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Ducha', 'Toallas', 'Secador de pelo (a solicitud)', 'Papel higiénico']
    },
    view: {
      en: ['Patio view', 'Patio'],
      es: ['Vista al patio', 'Patio']
    },
    features: {
      en: ['Wooden flooring', 'Socket near bed', 'Cable channels', 'Patio'],
      es: ['Suelo de madera', 'Enchufe cerca de la cama', 'Canales por cable', 'Patio']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  },

  {
    id: 'twin',
    slug: 'twin',
    available: 2,
    name: {
      en: 'Twin Room',
      es: 'Twin Room'
    },
    price: 60,
    size: 25,
    beds: {
      en: '2 single beds',
      es: '2 camas individuales'
    },
    rating: 9.4,
    reviewCount: 45,
    images: [
      '/2litsSimples.jpg'
    ],
    description: {
      en: 'This twin room features cable flat-screen TV...',
      es: 'Esta habitación con camas gemelas cuenta con TV de pantalla plana...'
    },
    amenities: [
      { icon: 'Wifi', label: { en: 'Free WiFi', es: 'WiFi Gratis' } },
      { icon: 'Tv', label: { en: 'Flat-screen TV', es: 'TV Pantalla Plana' } },
      { icon: 'Bath', label: { en: 'Private Bathroom', es: 'Baño Privado' } },
      { icon: 'Trees', label: { en: 'Garden View', es: 'Vista al Jardín' } },
      { icon: 'Coffee', label: { en: 'Electric Kettle (upon request)', es: 'Hervidor Eléctrico (a solicitud)' } },
      { icon: 'Shirt', label: { en: 'Wardrobe', es: 'Armario' } }
    ],
    bathroom: {
      en: ['Free toiletries', 'Shower', 'Towels', 'Hairdryer (upon request)', 'Toilet paper'],
      es: ['Artículos de tocador gratuitos', 'Ducha', 'Toallas', 'Secador de pelo (a solicitud)', 'Papel higiénico']
    },
    view: {
      en: ['Garden view'],
      es: ['Vista al jardín']
    },
    features: {
      en: ['Wooden flooring', 'Socket near bed', 'Cable channels'],
      es: ['Suelo de madera', 'Enchufe cerca de la cama', 'Canales por cable']
    },
    included: {
      en: ['Breakfast included', 'Free cancellation'],
      es: ['Desayuno incluido', 'Cancelación gratuita']
    }
  }
];

export const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    country: "USA",
    rating: 10,
    text: {
      en: "A perfect mix between hotel and museum...",
      es: "Una mezcla perfecta entre hotel y museo..."
    }
  },
  {
    id: 2,
    name: "Carlos R.",
    country: "Argentina",
    rating: 9.5,
    text: {
      en: "The gardens are beautiful...",
      es: "Los jardines son hermosos..."
    }
  }
];