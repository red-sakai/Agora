const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const supabase = req.supabase;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Get default role (member)
    const { data: role } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'member')
      .single();

    // Insert user
    const { error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash,
          role_id: role ? role.id : null,
        },
      ]);

    if (error) {
      return res.status(500).json({ error: 'Failed to register user.' });
    }

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const supabase = req.supabase;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const { data: user } = await supabase
      .from('users')
      .select('id, email, password_hash, role_id')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Get role name
    const { data: role } = await supabase
      .from('roles')
      .select('name')
      .eq('id', user.role_id)
      .single();

    // Issue JWT
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: role ? role.name : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Server error.' });
  }
};
