<?php


include 'DBconnect.php';
$objDB = new DbConnect();
$conn = $objDB->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case "GET":


        if (isset($_GET['report_id'])) {
            $report_id_spe = $_GET['report_id'];
            $sql = "SELECT * FROM report WHERE report_id = :report_id";
        }


        if (!isset($_GET['report_id'])) {
            $sql = " SELECT * FROM reports ORDER BY report_id DESC";
        }


        if (isset($sql)) {
            $stmt = $conn->prepare($sql);

            if (isset($report_id_spe)) {
                $stmt->bindParam(':report_id', $report_id_spe);
            }

            $stmt->execute();
            $report = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($report);
        }

        break;



    case "POST":
        $report = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO reports (incident_report, location, datetime_occured, more_details, image, status) VALUES (:incident_report, :location, :datetime_occured, :more_details,:image, :status)";
        $stmt = $conn->prepare($sql);


        $status = "active";
        $stmt->bindParam(':incident_report', $report->incident_report);
        $stmt->bindParam(':location', $report->location);
        $stmt->bindParam(':datetime_occured', $report->datetime_occured);
        $stmt->bindParam(':more_details', $report->more_details);
        $stmt->bindParam(':image', $report->image);
        $stmt->bindParam(':status', $status);



        if ($stmt->execute()) {

            $response = [
                "status" => "success",
                "message" => "report successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "report failed"
            ];
        }

        echo json_encode($response);
        break;

    case "PUT":
        $report = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE report SET report_name= :report_name, description = :description, expiration_date = :expiration_date, racks = :racks
                    WHERE report_id = :report_id";

        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':report_id', $report->report_id);
        $stmt->bindParam(':report_name', $report->report_name);
        $stmt->bindParam(':description', $report->description);
        $stmt->bindParam(':expiration_date', $report->expiration_date);
        $stmt->bindParam(':racks', $report->racks);


        if ($stmt->execute()) {

            $response = [
                "status" => "success",
                "message" => "report updated successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "report update failed"
            ];
        }

        echo json_encode($response);
        break;

    case "DELETE":
        $report = json_decode(file_get_contents('php://input'));
        $sql = "DELETE FROM report WHERE report_id = :report_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':report_id', $report->report_id);

        if ($stmt->execute()) {
            $response = [
                "status" => "success",
                "message" => "report deleted successfully"
            ];
        } else {
            $response = [
                "status" => "error",
                "message" => "report delete failed"
            ];
        }

        echo json_encode($response);
        break;
}
