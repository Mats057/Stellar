import { delay, getDB, saveDB } from './db';

export const ticketService = {
  async buyTicket(userId, travelId, pricePaid) {
    await delay();
    const db = getDB();
    const travelIndex = db.travels.findIndex(t => t.id === travelId);
    
    if (travelIndex === -1) throw new Error("Travel not found");
    if (db.travels[travelIndex].tickets_sold >= db.travels[travelIndex].capacity) {
        throw new Error("Sold out");
    }

    db.travels[travelIndex].tickets_sold += 1;
    const newTicket = {
      id: crypto.randomUUID(),
      user_id: userId,
      travel_id: travelId,
      price_paid: pricePaid,
      status: 'CONFIRMED',
      created_at: new Date().toISOString()
    };
    
    db.tickets.push(newTicket);
    saveDB(db);
    return newTicket;
  },

  async getUserTickets(userId) {
    await delay();
    const db = getDB();
    if (!db) return [];
    
    return db.tickets
      .filter(t => t.user_id === userId)
      .map(t => {
          const travel = db.travels.find(tr => tr.id === t.travel_id);
          return {
              ...t,
              travel: {
                  ...travel,
                  destination: db.destinations.find(d => d.id === travel?.destination_id),
                  company: db.companies.find(c => c.id === travel?.company_id)
              }
          }
      })
      .sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
  }
};
