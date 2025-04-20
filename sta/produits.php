<?php
session_start();  // Démarre la session

// Connexion à la base de données
$host = 'localhost';
$dbname = 'volaille_du_gard';
$username = 'root';
$password = '';

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $e) {
    die("Erreur : " . $e->getMessage());
}

// Initialiser le panier s'il n'est pas encore créé
if (!isset($_SESSION['panier'])) {
    $_SESSION['panier'] = [];
}

// Fonction pour ajouter un produit au panier
function ajouter_au_panier($produit_id, $nom, $prix, $quantite) {
    if (isset($_SESSION['panier'][$produit_id])) {
        $_SESSION['panier'][$produit_id]['quantite'] += $quantite;
    } else {
        $_SESSION['panier'][$produit_id] = [
            'nom' => $nom,
            'prix' => $prix,
            'quantite' => $quantite
        ];
    }
}

// Ajouter un produit au panier lorsque le formulaire est soumis
if (isset($_POST['ajouter_panier'])) {
    $produit_id = $_POST['produit_id'];
    $produit_nom = $_POST['produit_nom'];
    $produit_prix = $_POST['produit_prix'];
    $quantite = $_POST['quantite'];
    
    ajouter_au_panier($produit_id, $produit_nom, $produit_prix, $quantite);
}
?>

<?php
// Récupérer les produits depuis la base de données
$produits = $db->query("SELECT * FROM produits"); // Assurez-vous que la table 'produits' existe dans votre base de données

// Afficher chaque produit
while ($produit = $produits->fetch(PDO::FETCH_ASSOC)) {
    echo '<div class="product-card">';
    echo '<h3>' . $produit['nom'] . '</h3>';
    echo '<p>' . $produit['description'] . '</p>';
    echo '<p>' . $produit['prix'] . ' €</p>';
    echo '<form method="POST" action="produits.php">';
    echo '<input type="hidden" name="produit_id" value="' . $produit['id'] . '">';
    echo '<input type="hidden" name="produit_nom" value="' . $produit['nom'] . '">';
    echo '<input type="hidden" name="produit_prix" value="' . $produit['prix'] . '">';
    echo '<input type="number" name="quantite" value="1" min="1" required>';
    echo '<button type="submit" name="ajouter_panier">Ajouter au panier</button>';
    echo '</form>';
    echo '</div>';
}
?>

<?php
// Afficher le panier
if (isset($_SESSION['panier']) && !empty($_SESSION['panier'])) {
    echo '<h2>Votre Panier</h2>';
    foreach ($_SESSION['panier'] as $produit_id => $produit) {
        echo '<div class="cart-item">';
        echo '<span>' . $produit['nom'] . ' x ' . $produit['quantite'] . '</span>';
        echo '<span>' . ($produit['prix'] * $produit['quantite']) . ' €</span>';
        echo '</div>';
    }

    // Calcul du total
    $total = 0;
    foreach ($_SESSION['panier'] as $produit) {
        $total += $produit['prix'] * $produit['quantite'];
    }

    echo '<div>Total: ' . $total . ' €</div>';

    // Formulaire pour valider la commande
    echo '<form method="POST" action="produits.php">';
    echo '<button type="submit" name="valider_commande">Valider la commande</button>';
    echo '</form>';
} else {
    echo '<p>Votre panier est vide.</p>';
}
?>

<?php
// Valider la commande
if (isset($_POST['valider_commande'])) {
    // Vérifier si le panier est vide avant de continuer
    if (empty($_SESSION['panier'])) {
        echo 'Votre panier est vide. Impossible de valider la commande.';
    } else {
        // Insérer une nouvelle commande dans la table commandes
        $stmt = $db->prepare("INSERT INTO commandes (date_commande) VALUES (NOW())");
        $stmt->execute();
        $commande_id = $db->lastInsertId(); // Récupérer l'ID de la commande

        $total_commande = 0;

        // Insertion des produits du panier dans la table details_commande
        foreach ($_SESSION['panier'] as $produit_id => $produit) {
            $nom = $produit['nom'];
            $prix = $produit['prix'];
            $quantite = $produit['quantite'];

            // Insertion dans la base de données (table details_commande)
            $stmt = $db->prepare("INSERT INTO details_commande (commande_id, produit_nom, produit_prix, produit_quantite) 
                                  VALUES (:commande_id, :produit_nom, :produit_prix, :produit_quantite)");
            if ($stmt->execute([
                ':commande_id' => $commande_id,
                ':produit_nom' => $nom,
                ':produit_prix' => $prix,
                ':produit_quantite' => $quantite
            ])) {
                // Calcul du total de la commande
                $total_commande += $prix * $quantite;
            } else {
                // Si une erreur se produit lors de l'insertion
                echo 'Erreur lors de l\'enregistrement des détails de la commande.';
            }
        }

        // Réinitialiser le panier après commande
        unset($_SESSION['panier']);

        // Afficher un message de succès
        echo 'Commande validée avec succès ! Total : ' . $total_commande . ' €';
    }
}
?>
