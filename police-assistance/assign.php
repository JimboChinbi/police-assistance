<?php


include 'DBconnect.php';
$objDB = new DbConnect();
$conn = $objDB->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":


        if (isset($_GET['police_id'])) {
            $police_id_spe = $_GET['police_id'];
            $sql = "SELECT * FROM police WHERE police_id = :police_id";
        }


        if (!isset($_GET['police_id'])) {
            $sql = " SELECT * FROM police ORDER BY police_id DESC";
        }


        if (isset($sql)) {
            $stmt = $conn->prepare($sql);

            if (isset($police_id_spe)) {
                $stmt->bindParam(':police_id', $police_id_spe);
            }

            $stmt->execute();
            $police = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($police);
        }

        break;



    case "POST":
        $police = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO report_assigned (police_id, report_id, created_at) VALUES (:police_id, :report_id, :created_at)";
        $stmt = $conn->prepare($sql);
        $created_at = date('Y-m-d H:i:s');
        $stmt->bindParam(':police_id', $police->police_id);
        $stmt->bindParam(':report_id', $police->report_id);
        $stmt->bindParam(':created_at', $created_at);


        if ($stmt->execute()) {

            $sql2 = "UPDATE reports SET status = :status, assigned =:assigned WHERE report_id = :report_id";

            $stmt2 = $conn->prepare($sql2);
            $status = "police assigned";
            $stmt2->bindParam(':report_id', $police->report_id);
            $stmt2->bindParam(':status', $status);
            $stmt2->bindParam(':assigned', $police->assigned);

            $stmt2->execute();


            $response = [
                "status" => "success",
                "message" => "police successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "police failed"
            ];
        }

        echo json_encode($response);
        break;

    case "PUT":
        $report = json_decode(file_get_contents('php://input'));
        $sql2 = "UPDATE reports SET status = :status WHERE report_id = :report_id";

        $stmt2 = $conn->prepare($sql2);
        $stmt2->bindParam(':report_id', $report->report_id);
        $stmt2->bindParam(':status', $report->status);


        if ($stmt2->execute()) {

            $response = [
                "status" => "success",
                "message" => "police updated successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "police update failed"
            ];
        }

        echo json_encode($response);
        break;

    case "DELETE":
        $police = json_decode(file_get_contents('php://input'));
        $sql = "DELETE FROM police WHERE police_id = :police_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':police_id', $police->police_id);

        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                "message" => "police deleted successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "police delete failed"
            ];
        }

        echo json_encode($response);
        break;
}
