const { v4: uuidv4 } = require('uuid');

exports.createCommunity = async (req, res) => {
  const supabase = req.supabase;
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required.' });

  const { error } = await supabase.from('communities').insert([{
    id: uuidv4(),
    name,
    description,
    created_by: req.user.userId,
  }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Community created.' });
};

exports.getAllCommunities = async (req, res) => {
  const supabase = req.supabase;
  const { data, error } = await supabase.from('communities').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
