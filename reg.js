// Registration route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
  
    // Hash the password before storing it in the database
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('Error hashing password: ' + err);
        res.status(500).json({ error: 'Registration failed' });
        return;
      }
  
      // Insert user data into the database
      db.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hash],
        (err) => {
          if (err) {
            console.error('Error registering user: ' + err);
            res.status(500).json({ error: 'Registration failed' });
          } else {
            res.status(200).json({ message: 'Registration successful' });
          }
        }
      );
    });
  });
  
  // Login route
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Query the database to retrieve user data
    db.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      (err, results) => {
        if (err) {
          console.error('Error querying database: ' + err);
          res.status(500).json({ error: 'Login failed' });
          return;
        }
  
        if (results.length === 0) {
          res.status(401).json({ error: 'Invalid username or password' });
          return;
        }
  
        const user = results[0];
  
        // Compare the stored hash with the entered password
        bcrypt.compare(password, user.password, (err, result) => {
          if (err || !result) {
            console.error('Error comparing passwords: ' + err);
            res.status(401).json({ error: 'Invalid username or password' });
            return;
          }
  
          // Set up a session to keep the user logged in
          req.session.user = user;
          res.status(200).json({ message: 'Login successful' });
        });
      }
    );
  });
  