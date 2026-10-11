import { LISTING_TYPE, RENT_MODE, PAYMENT_TERM, USER_VERIFICATION_STATUS, REQUEST_STATUS } from '../constants/requestStatus';

export const INITIAL_USERS = [
  {
    id: 'user_admin',
    phone: '+998901234567',
    firstName: 'Sherzod',
    lastName: 'Adminov',
    role: 'ADMIN',
    pinfl: '31204951230012',
    birthDate: '1988-04-15',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rating: 5.0,
    dealsCount: 42
  },
  {
    id: 'user_owner_1',
    phone: '+998931112233',
    firstName: 'Azizbek',
    lastName: 'Qodirov',
    role: 'USER',
    pinfl: '32508924560098',
    birthDate: '1992-08-25',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    rating: 4.9,
    dealsCount: 8
  },
  {
    id: 'user_owner_2',
    phone: '+998972223344',
    firstName: 'Nilufar',
    lastName: 'Karimova',
    role: 'USER',
    pinfl: '41911963210045',
    birthDate: '1996-11-19',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=250&q=80',
    rating: 4.8,
    dealsCount: 5
  },
  {
    id: 'user_tenant_1',
    phone: '+998993334455',
    firstName: 'Jasur',
    lastName: 'Mansurov',
    role: 'USER',
    pinfl: '51402017890067',
    birthDate: '2001-02-14',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    rating: 5.0,
    dealsCount: 2
  },
  {
    id: 'user_new_pending',
    phone: '+998904445566',
    firstName: 'Bobur',
    lastName: 'Ergashev',
    role: 'USER',
    pinfl: '31505991120033',
    birthDate: '1999-05-15',
    verificationStatus: USER_VERIFICATION_STATUS.PENDING,
    passportPhoto: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    rating: 0,
    dealsCount: 0
  },
  {
    id: 'user_unverified',
    phone: '+998915556677',
    firstName: 'Dilshod',
    lastName: 'Xolmatov',
    role: 'USER',
    pinfl: '',
    birthDate: '2003-09-01',
    verificationStatus: USER_VERIFICATION_STATUS.UNVERIFIED,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=250&q=80',
    rating: 0,
    dealsCount: 0
  },
  {
    id: 'user_agent_1',
    phone: '+998901110011',
    firstName: 'Farrux',
    lastName: 'Zokirov',
    role: 'AGENT',
    pinfl: '32009854410099',
    birthDate: '1995-03-20',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
    assignedRegion: 'tashkent_city',
    rating: 4.95,
    dealsCount: 18,
    activeTasks: 2
  },
  {
    id: 'user_agent_2',
    phone: '+998902220022',
    firstName: 'Otabek',
    lastName: 'Yoqubov',
    role: 'AGENT',
    pinfl: '31804921130055',
    birthDate: '1997-07-14',
    verificationStatus: USER_VERIFICATION_STATUS.VERIFIED,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=250&q=80',
    assignedRegion: 'samarkand',
    rating: 4.88,
    dealsCount: 12,
    activeTasks: 1
  }
];

export const INITIAL_LISTINGS = [
  {
    id: 'list_1',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Yunusobod 4-mavzeda shinam 3 xonali evro-taʼmir xonadon',
    description: 'Yangi taʼmirdan chiqqan, toʻliq jihozlangan xonadon. Shahriston metrosiga 5 daqiqa piyoda. Oilaga uzoq muddatga beriladi.',
    price: 650,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.POSTPAY,
    deposit: 650,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'yunusabad',
    address: 'Yunusobod 4-kvartal, 18-uy, 42-xonadon',
    coordinates: [41.3652, 69.2885],
    distanceToMetro: 'Shahriston metro - 400 m',
    roomsCount: 3,
    areaTotal: 85,
    areaLiving: 60,
    floor: 4,
    totalFloors: 9,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Mehmonxona (Zal)',
        area: 26,
        capacity: 4,
        price: 0,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['ac', 'tv', 'furniture', 'wifi'],
        drawbacks: 'Balkon tomonida quyosh ertalab kuchli tushadi, parda tutilgan.'
      },
      {
        name: 'Asosiy yotoqxona',
        area: 18,
        capacity: 2,
        photos: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'heating', 'balcony'],
        drawbacks: 'Shkaf eshigi biroz qattiq yopiladi.'
      },
      {
        name: 'Bolalar / Ish xonasi',
        area: 16,
        capacity: 2,
        photos: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'wifi'],
        drawbacks: 'Konditsioner faqat zalda bor.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plita, idish yuvish moshina, mikrotoʻlqinli pech bor.'
      },
      {
        name: 'Hammom & Sanuzel',
        photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        notes: 'Kafel yangi, kirmoshina 7kg LG.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating', 'tv', 'elevator', 'parking'],
    rules: ['no_pets', 'no_smoking', 'family_only'],
    ownershipDoc: 'cadastre_pdf_verified.png',
    createdAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'list_2',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ROOM,
    title: 'Chilonzorda talaba qizlar uchun xona-xona shinam xonadon',
    description: 'Chilonzor metrosiga yaqin. 4 xonali uy xona-xona ijaraga beriladi. Faqat talaba yoki ishlaydigan qizlar uchun.',
    price: 150,
    currency: 'USD',
    isUtilityIncluded: true,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 50,
    minRentalPeriodMonths: 3,
    region: 'tashkent_city',
    district: 'chilonzor',
    address: 'Chilonzor 7-mavze, 12-uy',
    coordinates: [41.2825, 69.2045],
    distanceToMetro: 'Chilonzor metro - 350 m',
    roomsCount: 4,
    areaTotal: 96,
    floor: 3,
    totalFloors: 5,
    buildingType: 'panel',
    condition: 'furnished',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: '1-xona (2 kishilik)',
        area: 16,
        capacity: 2,
        price: 130,
        photos: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'wifi'],
        drawbacks: 'Balkon yoʻq, deraza hovliga qaraydi.'
      },
      {
        name: '2-xona (Katta yotoqxona, 3 kishilik)',
        area: 22,
        capacity: 3,
        price: 100,
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'wifi', 'balcony'],
        drawbacks: 'Kir moshina navbat bilan ishlatiladi.'
      }
    ],
    commonAreas: [
      {
        name: 'Umumiy oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: '2 ta muzlatgich, gaz plitasi, barcha idish-tovoqlar mavjud.'
      },
      {
        name: 'Hammom',
        photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
        notes: 'Issiq suv Ariston va markaziy taʼminot.'
      }
    ],
    amenities: ['wifi', 'washing_machine', 'refrigerator', 'furniture', 'gas_stove'],
    rules: ['girls_only', 'no_smoking', 'no_parties'],
    ownershipDoc: 'cadastre_chilonzor_doc.png',
    createdAt: '2026-03-22T14:30:00.000Z'
  },
  {
    id: 'list_3',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.SALE,
    title: 'Mirzo Ulugʻbek tumanida yangi binoda 2 xonali kvartira sotiladi',
    description: 'Yangi uy, monolit. Kadastr hujjatlari tayyor ("krishka" qilingan). Narx kelishiladi, torg bor. Ipotekaga ham beriladi.',
    price: 78000,
    currency: 'USD',
    isBargain: true,
    region: 'tashkent_city',
    district: 'mirzo_ulugbek',
    address: 'Buyuk Ipak Yoʻli koʻchasi, 140/2',
    coordinates: [41.3268, 69.3375],
    distanceToMetro: 'Buyuk Ipak Yoʻli metro - 600 m',
    roomsCount: 2,
    areaTotal: 68,
    areaLiving: 45,
    floor: 7,
    totalFloors: 12,
    buildingType: 'monolith',
    condition: 'unfurnished',
    repairType: 'rough',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Katta zal',
        area: 28,
        photos: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Taʼmirsiz, qora suvoq holatida.'
      },
      {
        name: 'Yotoqxona',
        area: 17,
        photos: [
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Panoramik derazalar montaji tugallangan.'
      }
    ],
    commonAreas: [],
    amenities: ['elevator', 'parking', 'security'],
    rules: [],
    ownershipDoc: 'ownership_mirzo_ulugbek_78k.pdf',
    createdAt: '2026-03-25T09:15:00.000Z'
  },
  {
    id: 'list_4',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Mirobod tumanida premium klassdagi 1 xonali studio',
    description: 'Oybek metrosi yaqinida, zamonaviy dizaynerlik taʼmiri. Barcha maishiy texnika yangi. Yakkaxon mutaxassis yoki yosh oilaga.',
    price: 500,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.PREPAY,
    deposit: 300,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'mirobod',
    address: 'Nukus koʻchasi, 22-uy',
    coordinates: [41.2941, 69.2789],
    distanceToMetro: 'Oybek metro - 500 m',
    roomsCount: 1,
    areaTotal: 45,
    areaLiving: 32,
    floor: 5,
    totalFloors: 9,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'designer',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Studio yotoqxona va mehmonxona',
        area: 32,
        capacity: 2,
        photos: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1502005229762-ee1afd3298a4?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'ac', 'tv', 'furniture'],
        drawbacks: 'Balkon yoʻq, fransuz derazalar.'
      }
    ],
    commonAreas: [],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating', 'tv', 'elevator', 'security'],
    rules: ['no_smoking', 'no_pets'],
    ownershipDoc: 'cadastre_mirobod_verified.pdf',
    createdAt: '2026-03-26T12:00:00.000Z'
  },
  {
    id: 'list_5',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ROOM,
    title: 'Talaba yigitlar uchun Beruniy metro yaqinida xona',
    description: 'ToshDTU va OʻzMU talabalari uchun qulay joylashuv. Har xonada 2 tadan yigit yashaydi.',
    price: 90,
    currency: 'USD',
    isUtilityIncluded: true,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 30,
    minRentalPeriodMonths: 2,
    region: 'tashkent_city',
    district: 'olmazor',
    address: 'Talabalar shaharchasi, Universitet koʻchasi',
    coordinates: [41.3475, 69.2062],
    distanceToMetro: 'Beruniy metro - 200 m',
    roomsCount: 3,
    areaTotal: 72,
    floor: 2,
    totalFloors: 4,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Katta xona (2 oʻrinlik)',
        area: 18,
        capacity: 2,
        price: 90,
        photos: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'furniture'],
        drawbacks: 'Konditsioner yoʻq, parrak ventilyator beriladi.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plita, muzlatgich bor.'
      }
    ],
    amenities: ['wifi', 'refrigerator', 'furniture', 'heating'],
    rules: ['boys_only', 'students_allowed', 'no_smoking'],
    ownershipDoc: 'cadastre_olmazor.pdf',
    createdAt: '2026-03-27T08:00:00.000Z'
  },
  {
    id: 'list_6',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.SALE,
    title: 'Yakkasaroyda yangi hovli uy sotiladi, 4 sotix',
    description: '6 xona, 3 ta sanuzel, podval, sauna, avtoturargoh. Barcha hujjatlar 100% toza, kadastr bor.',
    price: 240000,
    currency: 'USD',
    isBargain: true,
    region: 'tashkent_city',
    district: 'yakkarasay',
    address: 'Boshliq mavzesi, Bobur koʻchasi',
    coordinates: [41.2721, 69.2554],
    distanceToMetro: 'Janubiy vokzal - 800 m',
    roomsCount: 6,
    areaTotal: 280,
    areaLiving: 210,
    floor: 2,
    totalFloors: 2,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Mehmonxona (Katta zal)',
        area: 45,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Isitish quvurlari tekshiruvdan oʻtgan.'
      }
    ],
    commonAreas: [],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating', 'parking', 'security'],
    rules: [],
    ownershipDoc: 'yakkasaroy_hovli_doc.pdf',
    createdAt: '2026-03-27T15:00:00.000Z'
  },
  {
    id: 'list_7',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Samarqand markazida 2 xonali zamonaviy kvartira',
    description: 'Registon maydoniga 10 daqiqa. Sayyohlar va oilalar uchun barcha sharoitlar yaratilgan.',
    price: 400,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 200,
    minRentalPeriodMonths: 3,
    region: 'samarkand',
    district: 'samarkand_city',
    address: 'Rudakiy koʻchasi, 45-uy',
    coordinates: [39.6542, 66.9597],
    distanceToMetro: 'Temir yoʻl vokzali - 1.2 km',
    roomsCount: 2,
    areaTotal: 62,
    areaLiving: 44,
    floor: 2,
    totalFloors: 5,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 24,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'ac', 'tv', 'furniture'],
        drawbacks: 'Avtoturargoh faqat koʻchada.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Jihozlar yangi.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating', 'tv'],
    rules: ['no_smoking', 'no_parties'],
    ownershipDoc: 'samarkand_rudakiy_doc.pdf',
    createdAt: '2026-03-28T11:00:00.000Z'
  },
  {
    id: 'list_8',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Sergeli 7-bekat yaqinida yangi qurilgan 2 xonali uy',
    description: 'Yerusti metro bekatiga 2 daqiqa. Arzon kommunal, toza havo, yangi mebellar.',
    price: 380,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.POSTPAY,
    deposit: 380,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'sergeli',
    address: 'Sergeli Yangi Hayot mavzesi, 15-uy',
    coordinates: [41.2215, 69.2211],
    distanceToMetro: '7-bekat (Sergeli) - 150 m',
    roomsCount: 2,
    areaTotal: 58,
    areaLiving: 40,
    floor: 6,
    totalFloors: 16,
    buildingType: 'monolith',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Yotoqxona',
        area: 18,
        photos: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'heating'],
        drawbacks: 'Balkon pardasini yangilash kerak.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Yangi mebellar va plita.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'elevator', 'parking'],
    rules: ['family_only', 'no_pets'],
    ownershipDoc: 'sergeli_doc.pdf',
    createdAt: '2026-03-29T10:30:00.000Z'
  },
  {
    id: 'list_9',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.SALE,
    title: 'Shayxontohurda qulay 3 xonali kvartira sotiladi',
    description: 'Chorsu bozori va Xadra yaqinida. Barcha infratuzilma piyoda masofada.',
    price: 89000,
    currency: 'USD',
    isBargain: true,
    region: 'tashkent_city',
    district: 'shayxontohur',
    address: 'Navoiy koʻchasi, 28-uy',
    coordinates: [41.3212, 69.2458],
    distanceToMetro: 'Chorsu metro - 500 m',
    roomsCount: 3,
    areaTotal: 78,
    areaLiving: 55,
    floor: 3,
    totalFloors: 9,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Mehmonxona',
        area: 25,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Konditsioner eskiroq rusumda.'
      }
    ],
    commonAreas: [],
    amenities: ['elevator', 'heating', 'balcony', 'parking'],
    rules: [],
    ownershipDoc: 'shayxontohur_doc.pdf',
    createdAt: '2026-03-29T14:00:00.000Z'
  },
  {
    id: 'list_10',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Yashnobod tumanida 2 xonali arzon va toza xonadon',
    description: 'Doʻstlik metrosiga 10 daqiqa. Hamma narsa yetarli, tinch mahalla.',
    price: 350,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 150,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'yashnobod',
    address: 'Aviasozlar 2-mavze, 8-uy',
    coordinates: [41.2956, 69.3341],
    distanceToMetro: 'Doʻstlik metro - 800 m',
    roomsCount: 2,
    areaTotal: 52,
    areaLiving: 36,
    floor: 2,
    totalFloors: 4,
    buildingType: 'panel',
    condition: 'standard',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 20,
        photos: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture', 'wifi'],
        drawbacks: 'Kir yuvish moshina yarim avtomat.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Toza va ozoda.'
      }
    ],
    amenities: ['wifi', 'furniture', 'gas_stove', 'refrigerator'],
    rules: ['family_only', 'no_smoking'],
    ownershipDoc: 'yashnobod_doc.pdf',
    createdAt: '2026-03-30T09:00:00.000Z'
  },
  {
    id: 'list_11',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ROOM,
    title: 'Chilonzorda 3 xonali xonadondan 1 ta alohida xona ijaraga',
    description: 'Yakkaxon mutaxassis yoki tartibli talaba uchun. Uyda barcha qulayliklar bor.',
    price: 120,
    currency: 'USD',
    isUtilityIncluded: true,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 60,
    minRentalPeriodMonths: 3,
    region: 'tashkent_city',
    district: 'chilonzor',
    address: 'Katta Qani koʻchasi, 19-uy',
    coordinates: [41.2789, 69.1852],
    distanceToMetro: 'Mirzo Ulugʻbek metro - 900 m',
    roomsCount: 3,
    areaTotal: 68,
    floor: 4,
    totalFloors: 9,
    buildingType: 'panel',
    condition: 'furnished',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Alohida xona',
        area: 14,
        capacity: 1,
        price: 120,
        photos: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'furniture'],
        drawbacks: 'Xona eshigi qulfi yoʻq edi, yangi qoʻyildi.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Umumiy foydalanish uchun barcha anjomlar mavjud.'
      }
    ],
    amenities: ['wifi', 'washing_machine', 'refrigerator', 'furniture', 'elevator'],
    rules: ['no_smoking', 'no_parties'],
    ownershipDoc: 'chilonzor_room_doc.pdf',
    createdAt: '2026-03-30T16:00:00.000Z'
  },
  {
    id: 'list_12',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Uchtepa tumanida 3 xonali keng va yorugʻ xonadon',
    description: 'Oilaga beriladi. Maktab, bogʻcha, bozorcha barchasi yonginasida.',
    price: 450,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.POSTPAY,
    deposit: 450,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'uchtepa',
    address: 'Uchtepa 26-mavze, 44-uy',
    coordinates: [41.2912, 69.1724],
    distanceToMetro: 'Chilonzor metro - 1.5 km',
    roomsCount: 3,
    areaTotal: 74,
    areaLiving: 50,
    floor: 3,
    totalFloors: 5,
    buildingType: 'panel',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 22,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['ac', 'furniture', 'wifi'],
        drawbacks: 'Lift yoʻq (3-qavat).'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plita, muzlatgich bor.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating'],
    rules: ['family_only', 'no_smoking', 'no_pets'],
    ownershipDoc: 'uchtepa_doc.pdf',
    createdAt: '2026-03-31T11:00:00.000Z'
  },
  {
    id: 'list_13',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.SALE,
    title: 'Buxoro shahar markazida 3 xonali hovli uy sotiladi',
    description: 'Labihovuz yaqinida. Tarixiy zona, mehmonxona qilish uchun ham juda qulay joylashuv.',
    price: 110000,
    currency: 'USD',
    isBargain: true,
    region: 'bukhara',
    district: 'bukhara_city',
    address: 'B. Naqshband koʻchasi, 65-uy',
    coordinates: [39.7747, 64.4286],
    distanceToMetro: 'Buxoro vokzali - 12 km',
    roomsCount: 4,
    areaTotal: 160,
    areaLiving: 120,
    floor: 1,
    totalFloors: 1,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Katta ayvon va zal',
        area: 35,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Eski uslubdagi ganchkorlik naqshlari bor.'
      }
    ],
    commonAreas: [],
    amenities: ['heating', 'parking', 'gas_stove'],
    rules: [],
    ownershipDoc: 'bukhara_doc.pdf',
    createdAt: '2026-03-31T17:00:00.000Z'
  },
  {
    id: 'list_14',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Chirchiq shahrida 2 xonali arzon kvartira',
    description: 'Chirchiq markazida. Toshkentga marshrutkalar 20 daqiqada boradi.',
    price: 200,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 100,
    minRentalPeriodMonths: 6,
    region: 'tashkent_region',
    district: 'chirchiq',
    address: 'Alisher Navoiy koʻchasi, 14-uy',
    coordinates: [41.4689, 69.5822],
    distanceToMetro: 'Chirchiq vokzali - 1 km',
    roomsCount: 2,
    areaTotal: 50,
    areaLiving: 34,
    floor: 2,
    totalFloors: 4,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 20,
        photos: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture'],
        drawbacks: 'Wi-fi ulanmagan, ijarachi oʻzi ulashi mumkin.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plitasi bor.'
      }
    ],
    amenities: ['furniture', 'gas_stove', 'heating'],
    rules: ['family_only', 'no_smoking'],
    ownershipDoc: 'chirchiq_doc.pdf',
    createdAt: '2026-04-01T08:30:00.000Z'
  },
  {
    id: 'list_15',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Yunusobod 19-mavzeda yangi 2 xonali uy',
    description: 'Metroning Yunusobod bekatiga yaqin. Hammasi yangi olingan.',
    price: 480,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.POSTPAY,
    deposit: 480,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'yunusabad',
    address: 'Yunusobod 19-mavze, 3-uy',
    coordinates: [41.3812, 69.2945],
    distanceToMetro: 'Yunusobod metro - 700 m',
    roomsCount: 2,
    areaTotal: 65,
    areaLiving: 45,
    floor: 5,
    totalFloors: 9,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Mehmonxona',
        area: 25,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'ac', 'tv', 'furniture'],
        drawbacks: 'Balkon kichikroq.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Barcha jihozlar mavjud.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'elevator', 'heating'],
    rules: ['no_pets', 'no_smoking'],
    ownershipDoc: 'yunusabad_19_doc.pdf',
    createdAt: '2026-04-01T12:00:00.000Z'
  },
  {
    id: 'list_16',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.SALE,
    title: 'Chilonzor Oqtepada 1 xonali ixcham kvartira sotiladi',
    description: 'Metro Mirzo Ulugʻbekka 10 daqiqa. Tayyor ijaraga berish uchun aʼlo variant.',
    price: 45000,
    currency: 'USD',
    isBargain: false,
    region: 'tashkent_city',
    district: 'chilonzor',
    address: 'Muqimiy koʻchasi, 12-uy',
    coordinates: [41.2891, 69.2198],
    distanceToMetro: 'Mirzo Ulugʻbek metro - 600 m',
    roomsCount: 1,
    areaTotal: 38,
    areaLiving: 24,
    floor: 4,
    totalFloors: 4,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Xona',
        area: 24,
        photos: [
          'https://images.unsplash.com/photo-1502005229762-ee1afd3298a4?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Tom qismi 2025 yilda toʻliq yangilangan, oqmaydi.'
      }
    ],
    commonAreas: [],
    amenities: ['balcony', 'gas_stove'],
    rules: [],
    ownershipDoc: 'chilonzor_45k_doc.pdf',
    createdAt: '2026-04-02T10:00:00.000Z'
  },
  {
    id: 'list_17',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Qibray tumanida shinam dala hovli ijaraga',
    description: 'Dam olish kunlari yoki oilaviy yashash uchun. Hovuz, sauna, mangal zonasi bor.',
    price: 800,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 400,
    minRentalPeriodMonths: 3,
    region: 'tashkent_region',
    district: 'qibray',
    address: 'Baytqoʻrgʻon, Bogʻbon koʻchasi',
    coordinates: [41.3985, 69.4521],
    distanceToMetro: 'Toshkent aylanma yoʻli - 5 km',
    roomsCount: 4,
    areaTotal: 180,
    areaLiving: 130,
    floor: 2,
    totalFloors: 2,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 40,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['ac', 'furniture', 'tv'],
        drawbacks: 'Qishda qoʻshimcha isitgich kerak boʻladi.'
      }
    ],
    commonAreas: [
      {
        name: 'Yozgi va qishki oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Oʻchoq-qozon bor.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'parking', 'security'],
    rules: ['no_smoking', 'family_only'],
    ownershipDoc: 'qibray_doc.pdf',
    createdAt: '2026-04-02T15:00:00.000Z'
  },
  {
    id: 'list_18',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ROOM,
    title: 'Mirzo Ulugʻbek tumanida IT mutaxassislari uchun xona',
    description: 'Yuqori tezlikdagi 500 Mbps internet, sokin muhit, kovorking zonasi.',
    price: 180,
    currency: 'USD',
    isUtilityIncluded: true,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 90,
    minRentalPeriodMonths: 3,
    region: 'tashkent_city',
    district: 'mirzo_ulugbek',
    address: 'Sayram koʻchasi, 21-uy',
    coordinates: [41.3341, 69.3214],
    distanceToMetro: 'Buyuk Ipak Yoʻli metro - 400 m',
    roomsCount: 3,
    areaTotal: 80,
    floor: 2,
    totalFloors: 4,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'euro',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Ish va yotoq xonasi',
        area: 18,
        capacity: 1,
        price: 180,
        photos: [
          'https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['wifi', 'ac', 'furniture'],
        drawbacks: 'Balkon boshqa xona orqali.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Kofe mashinasi, mikrotoʻlqinli pech bor.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating'],
    rules: ['no_smoking', 'no_parties'],
    ownershipDoc: 'mirzo_sayram_doc.pdf',
    createdAt: '2026-04-03T10:00:00.000Z'
  },
  {
    id: 'list_19',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Zangiota tumanida yangi 3 xonali hovli',
    description: 'Ippodrom bozoriga yaqin. Yashash uchun hamma qulayliklar yetarli.',
    price: 320,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 150,
    minRentalPeriodMonths: 6,
    region: 'tashkent_region',
    district: 'zangiota',
    address: 'Quyoshli mavzesi, 10-uy',
    coordinates: [41.2415, 69.1524],
    distanceToMetro: 'Chilonzor metro - 6 km',
    roomsCount: 3,
    areaTotal: 95,
    areaLiving: 70,
    floor: 1,
    totalFloors: 1,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'modern',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 25,
        photos: [
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['furniture'],
        drawbacks: 'Avtoturargoh hovlida 2 ta mashina sigʻadi.'
      }
    ],
    commonAreas: [
      {
        name: 'Oshxona',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Gaz plitasi bor.'
      }
    ],
    amenities: ['furniture', 'gas_stove', 'heating', 'parking'],
    rules: ['family_only', 'no_smoking'],
    ownershipDoc: 'zangiota_doc.pdf',
    createdAt: '2026-04-03T14:30:00.000Z'
  },
  {
    id: 'list_20',
    ownerId: 'user_owner_2',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Toshkent markazida Amir Temur xiyoboni yaqinida 4 xonali VIP xonadon',
    description: 'Diplomatlar, xorijiy kompaniyalar rahbarlari uchun moʻljallangan premium xonadon.',
    price: 1500,
    currency: 'USD',
    isUtilityIncluded: true,
    paymentTerm: PAYMENT_TERM.POSTPAY,
    deposit: 1500,
    minRentalPeriodMonths: 12,
    region: 'tashkent_city',
    district: 'mirobod',
    address: 'Amir Temur shoh koʻchasi, 8-uy',
    coordinates: [41.3111, 69.2797],
    distanceToMetro: 'Amir Temur xiyoboni metro - 200 m',
    roomsCount: 4,
    areaTotal: 140,
    areaLiving: 105,
    floor: 6,
    totalFloors: 10,
    buildingType: 'brick',
    condition: 'furnished',
    repairType: 'designer',
    status: 'ACTIVE',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Grand Mehmonxona',
        area: 45,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        amenities: ['ac', 'furniture', 'tv', 'wifi'],
        drawbacks: 'Shahar markazida shovqin boʻlishi mumkin, shovqin yutuvchi oynalar oʻrnatilgan.'
      }
    ],
    commonAreas: [
      {
        name: 'Italiya oshxonasi',
        photo: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
        notes: 'Miele texnikalari.'
      }
    ],
    amenities: ['wifi', 'ac', 'washing_machine', 'refrigerator', 'furniture', 'heating', 'tv', 'elevator', 'parking', 'security'],
    rules: ['no_smoking', 'no_pets'],
    ownershipDoc: 'vip_mirobod_doc.pdf',
    createdAt: '2026-04-04T11:00:00.000Z'
  },
  {
    id: 'list_pending_demo',
    ownerId: 'user_owner_1',
    type: LISTING_TYPE.RENT,
    rentMode: RENT_MODE.ENTIRE,
    title: 'Moderatsiyada tekshirilayotgan sinov eʼloni (Admin tasdiqlashi uchun)',
    description: 'Yangi yuborilgan eʼlon. Admin panelda tasdiqlash uchun koʻrinadi.',
    price: 400,
    currency: 'USD',
    isUtilityIncluded: false,
    paymentTerm: PAYMENT_TERM.MONTHLY,
    deposit: 200,
    minRentalPeriodMonths: 6,
    region: 'tashkent_city',
    district: 'shayxontohur',
    address: 'Beruniy 14-uy',
    coordinates: [41.335, 69.215],
    distanceToMetro: 'Tinchlik metro - 300 m',
    roomsCount: 2,
    areaTotal: 55,
    floor: 2,
    totalFloors: 5,
    buildingType: 'brick',
    condition: 'standard',
    repairType: 'euro',
    status: 'PENDING_MODERATION',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    roomsData: [
      {
        name: 'Zal',
        area: 25,
        photos: [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80'
        ],
        drawbacks: 'Barcha jihozlar joyida.'
      }
    ],
    commonAreas: [],
    amenities: ['wifi', 'ac', 'furniture'],
    rules: ['no_smoking'],
    ownershipDoc: 'test_ownership_kadastr.pdf',
    createdAt: '2026-04-05T09:00:00.000Z'
  }
];

export const INITIAL_REQUESTS = [
  {
    id: 'req_101',
    listingId: 'list_1',
    tenantId: 'user_tenant_1',
    ownerId: 'user_owner_1',
    status: REQUEST_STATUS.PAID_ESCROW,
    escrowAmount: 30,
    escrowCurrency: 'USD',
    paidAt: '2026-04-08T10:00:00.000Z',
    paymentProvider: 'click', // 'click' | 'payme'
    paymentTransactionId: 'CLK-98421458',
    history: [
      { status: REQUEST_STATUS.SUBMITTED, timestamp: '2026-04-07T14:20:00.000Z', note: 'Zayavka yuborildi' },
      { status: REQUEST_STATUS.ACCEPTED, timestamp: '2026-04-07T16:00:00.000Z', note: 'Egasi qabul qildi' },
      { status: REQUEST_STATUS.PAYMENT_PENDING, timestamp: '2026-04-07T16:01:00.000Z', note: '30$ toʻlov ochildi' },
      { status: REQUEST_STATUS.PAID_ESCROW, timestamp: '2026-04-08T10:00:00.000Z', note: 'Click orqali 30$ toʻlandi. Mablagʻ Escrowda muzlatildi' }
    ],
    createdAt: '2026-04-07T14:20:00.000Z',
    expiresAt: new Date(Date.now() + 42 * 3600 * 1000).toISOString() // ~42 hours left
  },
  {
    id: 'req_102',
    listingId: 'list_2',
    tenantId: 'user_tenant_1',
    ownerId: 'user_owner_2',
    status: REQUEST_STATUS.SUBMITTED,
    escrowAmount: 0,
    escrowCurrency: 'USD',
    history: [
      { status: REQUEST_STATUS.SUBMITTED, timestamp: '2026-04-09T08:00:00.000Z', note: 'Talaba qizlar xonasi uchun zayavka' }
    ],
    createdAt: '2026-04-09T08:00:00.000Z'
  }
];

export const INITIAL_CONTRACTS = [
  {
    id: 'contract_201',
    requestId: 'req_101',
    listingId: 'list_1',
    landlordId: 'user_owner_1',
    tenantId: 'user_tenant_1',
    landlordName: 'Azizbek Qodirov',
    tenantName: 'Jasur Mansurov',
    landlordPinfl: '32508924560098',
    tenantPinfl: '51402017890067',
    propertyAddress: 'Yunusobod 4-kvartal, 18-uy, 42-xonadon',
    monthlyPrice: 650,
    depositAmount: 650,
    isPostPayDepositRequired: true,
    minRentalMonths: 6,
    penaltyEarlyExit: '1 oylik ijara toʻlovi miqdorida jarima',
    rules: 'Uy hayvonlari taqiqlanadi, chekish taqiqlanadi, faqat oilaviy yashash.',
    inventoryAct: [
      { item: 'Konditsioner Artel 12', condition: 'Aʼlo darajada, yangi', photo: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80' },
      { item: 'Muzlatgich LG', condition: 'Toza, sovutishi yaxshi', photo: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
      { item: 'Mehmonxona divani', condition: 'Yangi, dogʻlar yoʻq', photo: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80' }
    ],
    landlordSigned: true,
    landlordSignedAt: '2026-04-08T11:00:00.000Z',
    tenantSigned: true,
    tenantSignedAt: '2026-04-08T11:30:00.000Z',
    status: 'ACTIVE',
    startDate: '2026-04-10',
    endDate: '2026-10-10',
    createdAt: '2026-04-08T10:30:00.000Z'
  }
];

export const INITIAL_COUPONS = [
  {
    id: 'coupon_demo_1',
    userId: 'user_tenant_1',
    code: 'VIEW-FREE-9842',
    valueUSD: 30,
    title: '1 ta Bepul qayta koʻrsatish kuponi',
    reason: 'Uyni koʻrgach yoqmaganligi sababli taqdim etilgan kafolat kuponi',
    validUntil: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    isUsed: false,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_VIEWINGS = [
  {
    id: 'viewing_1',
    requestId: 'req_1',
    listingId: 'list_1',
    agentId: 'user_agent_1',
    tenantId: 'user_tenant_1',
    landlordId: 'user_owner_1',
    status: 'SCHEDULE_CONFIRMED', // 'PENDING_ASSIGNMENT' | 'ASSIGNED' | 'SCHEDULE_CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    scheduledAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    address: 'Yunusobod 4-kvartal, 18-uy, 42-xonadon',
    proposedSlots: [
      new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      new Date(Date.now() + 8 * 3600 * 1000).toISOString()
    ],
    rescheduleCount: 0,
    slaAssignedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 42 * 3600 * 1000).toISOString(),
    notes: 'Mijoz 14:00 da metro oldidan kutib olinadi',
    checklist: {
      matchesListing: true,
      drawbacksNoted: false,
      landlordPresent: true,
      photosTaken: true
    },
    outcome: null // 'LIKED' | 'DISLIKED' | 'MISMATCH' | 'OWNER_ABSENT' | 'CLIENT_ABSENT'
  },
  {
    id: 'viewing_2',
    requestId: 'req_2',
    listingId: 'list_2',
    agentId: 'user_agent_1',
    tenantId: 'user_tenant_1',
    landlordId: 'user_owner_2',
    status: 'PENDING_ASSIGNMENT',
    scheduledAt: null,
    address: 'Mirzo Ulugʻbek tumani, Buyuk Ipak Yoʻli 12-uy',
    proposedSlots: [],
    rescheduleCount: 0,
    slaAssignedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    slaDeadline: new Date(Date.now() + 47 * 3600 * 1000).toISOString(),
    notes: 'Avto-tayinlov kutmoqda (Yaqin agent: Farrux Zokirov)',
    checklist: null,
    outcome: null
  }
];

