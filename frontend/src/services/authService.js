import { delay, getDB, saveDB } from './db';

export const authService = {
  async register(name, email, password) {
    await delay();
    const db = getDB();
    if (db.users.find(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = { id: crypto.randomUUID(), name, email, password };
    db.users.push(newUser);
    saveDB(db);
    return { id: newUser.id, name: newUser.name, email: newUser.email };
  },
  
  async login(email, password) {
    await delay();
    const db = getDB();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return { id: user.id, name: user.name, email: user.email };
  }
};
