// Je mets les commentaires en vert pour montrer les étapes
// ! Je mettrais des commentaires en rouge pour expliquer mon code

// Mise en place des imports
// ! Express est un framework qui permet de faire en sorte qu'un projet node deviennent une api rest
const express = require('express');
const bcrypt = require('bcrypt');
// ! Permet de parser les requêtes HTTP
const bodyParser = require('body-parser');
// ! File System permet gérer les fichiers présent dans les dossiers (users.json du dossier data)
const fs = require('node:fs');

// Mise en place de l'api
// ! Je stocke express dans une constante app qui sera utilisée durant tous le processus de code
const app = express();
// ! Cela correspond au porta auquel l'api va répondre, l'adresse donne cela : http://localhost:8000
const port = 8000;

// Parsage des requêtes json
app.use(bodyParser.json());

// Chargement des utilisateurs
// ! J'utilise file-system pour interroger le fichier users.json
const users = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'));

// Mise en place de la route
// ! Je mets en place la route qui va gérer la connexion en gros et qui sera / login comme : http://localhost:8000/login
app.post('/login', async ( req, res ) => {
    const { login, password } = req.body;
    const user = users.find(u => u.login === login)

    if ( !user ) {
        return res.status(401).json({ error : 'Login ou mot de passe incorrect' });
    }

    const mdpValide = await bcrypt.compare(password, user.hashed_password)

    if ( !mdpValide ) {
        return res.status(401).json({ error : 'Login ou mot de passe incorrect' });
    }

    // Reception des données coté client
    res.json({
        msg : 'Bravo !!! Connexion réussie',
        data : {
            products : user.products
        }
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

