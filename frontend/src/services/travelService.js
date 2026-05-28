import { delay, getDB } from './db';

export const travelService = {
  async getAllTravels(filters = {}) {
    await delay();
    const db = getDB();
    if (!db) return [];
    
    let { travels, destinations, companies } = db;
    
    let results = travels.map(t => ({
      ...t,
      company: companies.find(c => c.id === t.company_id),
      destination: destinations.find(d => d.id === t.destination_id)
    }));

    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(t => 
        t.destination?.name.toLowerCase().includes(q) ||
        t.company?.name.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q)
      );
    }
    
    return results;
  },

  async getTravelById(id) {
    await delay();
    const db = getDB();
    if (!db) return null;
    
    const travel = db.travels.find(t => t.id === id);
    if (!travel) return null;
    
    return {
      ...travel,
      company: db.companies.find(c => c.id === travel.company_id),
      destination: db.destinations.find(d => d.id === travel.destination_id)
    };
  }
};
