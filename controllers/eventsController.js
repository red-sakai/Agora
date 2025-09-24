const { v4: uuidv4 } = require('uuid');

// Get all events
exports.getAllEvents = async (req, res) => {
  const supabase = req.supabase;
  const { data, error } = await supabase.from('events').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Get event by ID
exports.getEventById = async (req, res) => {
  const supabase = req.supabase;
  const { id } = req.params;
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Event not found.' });
  res.json(data);
};

// Create event
exports.createEvent = async (req, res) => {
  const supabase = req.supabase;
  const { name, description, community_id, start_time, end_time } = req.body;
  if (!name || !community_id || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const { error } = await supabase.from('events').insert([{
    id: uuidv4(),
    name,
    description,
    community_id,
    start_time,
    end_time,
    created_by: req.user.userId,
  }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ message: 'Event created.' });
};

// Update event
exports.updateEvent = async (req, res) => {
  const supabase = req.supabase;
  const { id } = req.params;
  // Check if user is creator or admin
  const { data: event } = await supabase.from('events').select('created_by').eq('id', id).single();
  if (!event) return res.status(404).json({ error: 'Event not found.' });
  if (event.created_by !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden.' });
  }
  const { name, description, community_id, start_time, end_time } = req.body;
  const { error } = await supabase.from('events').update({
    name, description, community_id, start_time, end_time, updated_at: new Date().toISOString()
  }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Event updated.' });
};

// Delete event
exports.deleteEvent = async (req, res) => {
  const supabase = req.supabase;
  const { id } = req.params;
  // Check if user is creator or admin
  const { data: event } = await supabase.from('events').select('created_by').eq('id', id).single();
  if (!event) return res.status(404).json({ error: 'Event not found.' });
  if (event.created_by !== req.user.userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden.' });
  }
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Event deleted.' });
};
