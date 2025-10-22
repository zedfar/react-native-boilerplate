module.exports = (req, res, next) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  // Mock authentication for login
  if (req.method === 'POST' && req.path === '/auth/login') {
    const { email, password } = req.body;
    const db = require('./db.json');
    const user = db.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return res.json({
        token: `mock-token-${user.id}`,
        user: userWithoutPassword
      });
    }
    
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Mock authentication for register
  if (req.method === 'POST' && req.path === '/auth/register') {
    const { email, name, password } = req.body;
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    return res.json({
      token: `mock-token-${newUser.id}`,
      user: newUser
    });
  }

  // Mock get current user
  if (req.method === 'GET' && req.path === '/auth/me') {
    const db = require('./db.json');
    const user = db.users[1]; // Return regular user
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }

  next();
};