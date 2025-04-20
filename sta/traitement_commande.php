<?php
$host = "localhost";
$dbname = "volaille_du_gard";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name     = $_POST["name"] ?? '';
    $email    = $_POST["email"] ?? '';
    $phone    = $_POST["phone"] ?? '';
    $address  = $_POST["address"] ?? '';
    $products = $_POST["products"] ?? '';

    $sql = "INSERT INTO commandes_particuliers (name, email, phone, address, products) 
            VALUES (:name, :email, :phone, :address, :products)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':address' => $address,
        ':products' => $products
    ]);

    echo "<script>alert('Commande bien enregistrée !'); window.location.href = 'commander.html';</script>";
    exit;
}
?>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $orderDetails = json_decode($_POST['orderDetails'], true);

    // Connexion à la base de données
    $conn = new mysqli('localhost', 'root', '', 'volaille_du_gard');

    if ($conn->connect_error) {
        die('Connexion échouée : ' . $conn->connect_error);
    }

    // Insérer la commande dans la base de données
    $items = json_encode($orderDetails['items']);
    $total = $orderDetails['total'];

    $sql = "INSERT INTO commandes_particuliers (products, total) VALUES ('$items', '$total')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erreur de base de données']);
    }

    $conn->close();
}
?>
