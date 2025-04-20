<?php
try {
    // Connexion à la base de données
    $pdo = new PDO('mysql:host=localhost;dbname=volaille_du_gard', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Récupération des données du formulaire
    $company = $_POST['company'];
    $siret = $_POST['siret'];
    $contact = $_POST['contact'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $activity = $_POST['activity'];
    $message = $_POST['message'];

    // Insertion des données dans la base
    $stmt = $pdo->prepare("
        INSERT INTO devis_pro (company, siret, contact, email, phone, activity, message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$company, $siret, $contact, $email, $phone, $activity, $message]);

    echo "✅ Votre demande de devis a bien été envoyée.";
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
?>
