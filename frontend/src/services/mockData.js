export const mockedData = {
  destinations: [
    {
      id: 'd1',
      name: 'Marte (Nova Colônia Texas)',
      description: 'Experimente as dunas vermelhas e o majestoso Olympus Mons.',
      distance_earth: 225000000
    },
    {
      id: 'd2',
      name: 'Titã (Lua de Saturno)',
      description: 'Explore lagos de metano e céus laranjas em nossas cidades-domo de luxo.',
      distance_earth: 1200000000
    },
    {
      id: 'd3',
      name: 'Europa (Lua de Júpiter)',
      description: 'Oceanos subglaciais e vistas deslumbrantes de Júpiter.',
      distance_earth: 628300000
    },
    {
      id: 'd4',
      name: 'Estação Lunar Alpha',
      description: 'Uma escapada rápida! Desfrute de recreação em baixa gravidade no vizinho mais próximo da Terra.',
      distance_earth: 384400
    }
  ],
  companies: [
    {
      id: 'c1',
      name: 'SpaceX Interplanetária',
      description: 'Os pioneiros das viagens espaciais modernas.'
    },
    {
      id: 'c2',
      name: 'Fronteiras Blue Origin',
      description: 'Conforto e luxo para o viajante espacial exigente.'
    },
    {
      id: 'c3',
      name: 'Virgin Galactic Espaço Profundo',
      description: 'Estilo e experiência.'
    }
  ],
  travels: [
    {
      id: 't1',
      name: 'Expresso Marte Rota A',
      price: 250000.0,
      capacity: 50,
      company_id: 'c1',
      destination_id: 'd1',
      description: 'Voo direto para Marte utilizando a recém-reformada Starship.',
      departure_time: '2026-08-15T08:00:00Z',
      arrival_time: '2026-11-20T14:00:00Z',
      tickets_sold: 45
    },
    {
      id: 't2',
      name: 'Especial de Fim de Semana Lunar',
      price: 15000.0,
      capacity: 200,
      company_id: 'c3',
      destination_id: 'd4',
      description: 'Passe o fim de semana na Lua. Rápido, fácil e acessível.',
      departure_time: '2026-06-10T10:00:00Z',
      arrival_time: '2026-06-13T10:00:00Z',
      tickets_sold: 198
    },
    {
      id: 't3',
      name: 'Explorador de Titã',
      price: 850000.0,
      capacity: 20,
      company_id: 'c2',
      destination_id: 'd2',
      description: 'Um longo cruzeiro de luxo para os serenos lagos de Titã.',
      departure_time: '2027-01-05T00:00:00Z',
      arrival_time: '2029-05-15T12:00:00Z',
      tickets_sold: 5
    }
  ]
};

// Initialize local storage if empty (or reset to apply translations)
const initLocalDB = () => {
    if (!localStorage.getItem('stellar_data') || !localStorage.getItem('stellar_translated_pt')) {
        localStorage.setItem('stellar_data', JSON.stringify({
            users: [],
            tickets: [],
            ...mockedData
        }));
        localStorage.setItem('stellar_translated_pt', '1');
    }
}
initLocalDB();
