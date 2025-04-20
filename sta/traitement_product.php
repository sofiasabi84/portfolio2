<?php
try {
    // Connexion à la base de données
    $pdo = new PDO('mysql:host=localhost;dbname=volaille_du_gard', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données du formulaire
    $name = $_POST['name'];
    $email = $_POST['email'];
    $product = $_POST['product'];
    $quantity = $_POST['quantity'];
    $message = $_POST['message'];

    // Insertion dans la base
    $stmt = $pdo->prepare("
        INSERT INTO devis_product (name, email, product, quantity, message)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$name, $email, $product, $quantity, $message]);

    echo "✅ Votre demande de devis a bien été envoyée.";
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
?>
