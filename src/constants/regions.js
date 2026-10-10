export const REGIONS_DATA = [
  {
    id: 'tashkent_city',
    name: { uz: 'Toshkent shahri', ru: 'г. Ташкент', en: 'Tashkent City' },
    districts: [
      { id: 'yunusabad', name: { uz: 'Yunusobod tumani', ru: 'Юнусабадский район', en: 'Yunusabad district' } },
      { id: 'mirzo_ulugbek', name: { uz: 'Mirzo Ulugʻbek tumani', ru: 'Мирзо-Улугбекский район', en: 'Mirzo Ulugbek district' } },
      { id: 'chilonzor', name: { uz: 'Chilonzor tumani', ru: 'Чиланзарский район', en: 'Chilanzar district' } },
      { id: 'yakkarasay', name: { uz: 'Yakkasaroy tumani', ru: 'Яккасарайский район', en: 'Yakkasaray district' } },
      { id: 'mirobod', name: { uz: 'Mirobod tumani', ru: 'Мирабадский район', en: 'Mirobod district' } },
      { id: 'shayxontohur', name: { uz: 'Shayxontohur tumani', ru: 'Шайхантахурский район', en: 'Shaykhontokhur district' } },
      { id: 'olmazor', name: { uz: 'Olmazor tumani', ru: 'Алмазарский район', en: 'Olmazor district' } },
      { id: 'uchtepa', name: { uz: 'Uchtepa tumani', ru: 'Учтепинский район', en: 'Uchtepa district' } },
      { id: 'sergeli', name: { uz: 'Sergeli tumani', ru: 'Сергелийский район', en: 'Sergeli district' } },
      { id: 'yashnobod', name: { uz: 'Yashnobod tumani', ru: 'Яшнабадский район', en: 'Yashnabad district' } }
    ]
  },
  {
    id: 'tashkent_region',
    name: { uz: 'Toshkent viloyati', ru: 'Ташкентская область', en: 'Tashkent Region' },
    districts: [
      { id: 'chirchiq', name: { uz: 'Chirchiq shahri', ru: 'г. Чирчик', en: 'Chirchiq city' } },
      { id: 'qibray', name: { uz: 'Qibray tumani', ru: 'Кибрайский район', en: 'Qibray district' } },
      { id: 'zangiota', name: { uz: 'Zangiota tumani', ru: 'Зангиатинский район', en: 'Zangiata district' } }
    ]
  },
  {
    id: 'samarkand',
    name: { uz: 'Samarqand viloyati', ru: 'Самаркандская область', en: 'Samarkand Region' },
    districts: [
      { id: 'samarkand_city', name: { uz: 'Samarqand shahri', ru: 'г. Самарканд', en: 'Samarkand city' } },
      { id: 'urgut', name: { uz: 'Urgut tumani', ru: 'Ургутский район', en: 'Urgut district' } },
      { id: 'pastdargom', name: { uz: 'Pastdargʻom tumani', ru: 'Пастдаргомский район', en: 'Pastdargom district' } }
    ]
  },
  {
    id: 'bukhara',
    name: { uz: 'Buxoro viloyati', ru: 'Бухарская область', en: 'Bukhara Region' },
    districts: [
      { id: 'bukhara_city', name: { uz: 'Buxoro shahri', ru: 'г. Бухара', en: 'Bukhara city' } },
      { id: 'gijduvon', name: { uz: 'Gʻijduvon tumani', ru: 'Гиждуванский район', en: 'Gijduvon district' } }
    ]
  }
];

export const BUILDING_TYPES = [
  { id: 'brick', name: { uz: 'Gʻishtli', ru: 'Кирпичный', en: 'Brick' } },
  { id: 'panel', name: { uz: 'Panelli', ru: 'Панельный', en: 'Panel' } },
  { id: 'monolith', name: { uz: 'Monolit', ru: 'Монолитный', en: 'Monolith' } },
  { id: 'block', name: { uz: 'Blokli', ru: 'Блочный', en: 'Block' } }
];

export const REPAIR_TYPES = [
  { id: 'euro', name: { uz: 'Evro taʼmir', ru: 'Евроремонт', en: 'Euro repair' } },
  { id: 'modern', name: { uz: 'Oʻrtacha taʼmir', ru: 'Косметический', en: 'Cosmetic repair' } },
  { id: 'rough', name: { uz: 'Qora suvoq (Xomaki)', ru: 'Черновая отделка', en: 'Rough finish' } },
  { id: 'designer', name: { uz: 'Mualliflik dizayni', ru: 'Дизайнерский ремонт', en: 'Designer repair' } }
];
