import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// Afficher la page d'accueil
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY id ASC');
    res.render('pages/home', {
      users: result.rows,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.render('pages/home', {
      users: [],
      error: 'Erreur serveur'
    });
  }
});

// Ajouter un utilisateur
router.post('/users', async (req, res) => {
  const { nom, prenom, email } = req.body;

  try {
    await query(
      'INSERT INTO users (nom, prenom, email) VALUES ($1, $2, $3)',
      [nom, prenom, email]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    const result = await query('SELECT * FROM users ORDER BY id ASC');
    res.render('pages/home', {
      users: result.rows,
      error: 'Erreur lors de l’ajout'
    });
  }
});

// Modifier un utilisateur
router.post('/users/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;

  try {
    await query(
      'UPDATE users SET nom = $1, prenom = $2, email = $3 WHERE id = $4',
      [nom, prenom, email, id]
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Supprimer un utilisateur
router.post('/users/:id/delete', async (req, res) => {
  const { id } = req.params;

  try {
    await query('DELETE FROM users WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

export default router;