<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=volaille_du_gard', 'root', '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $name     = $_POST['name'];
        $email    = $_POST['email'];
        $phone    = $_POST['phone'];
        $address  = $_POST['address'];
        $products = $_POST['products'];

        $stmt = $pdo->prepare("
            INSERT INTO commandes_particuliers (name, email, phone, address, products)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $email, $phone, $address, $products]);

        echo "✅ Votre commande a bien été envoyée.";
    } catch (Exception $e) {
        echo "❌ Erreur : " . $e->getMessage();
    }
} else {
    echo "❌ Requête invalide.";
}
?>
