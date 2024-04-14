<?php

namespace Repository;

use flight;
use Exception;
use Ramsey\Uuid\Uuid;

class CourseRepository {
    public static function getAll() {
        try {
            $stmt = Flight::db()->prepare("SELECT c.id, c.name, c.description, c.price, 
            c.instructor, c.modality, c.image, s.name 
            FROM course c 
            JOIN school s ON c.school_id = s.id 
            ORDER BY c.is_active DESC, c.name ASC;");
            $stmt->execute();
            $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            Flight::db()->close();

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function getOne($id) {
        try {
            $stmt = Flight::db()->prepare("SELECT c.id, c.name, c.description, c.price, 
            c.instructor, c.modality, c.image, s.name 
            FROM course c 
            JOIN school s ON c.school_id = s.id
            AND c.id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();
            $stmt->close();
            Flight::db()->close();

            if (is_null($result))
                throw new Exception("The course with id: {$id} does not exist");

            return $result;
        } catch (Exception $e) {
            Flight::error($e);
        }
    }

    public static function save($data, $image) {
        try {
            $name = $data->name;
            $description = $data->description;
            $price = $data->price;
            $instructor = $data->instructor;
            $modality = $data->modality;
            $image_path = $_ENV['COURSE_IMG'] . Uuid::uuid1() . "." . strtolower(pathinfo($image['full_path'],PATHINFO_EXTENSION));
            $school_id = $data->school_id;

            if (!move_uploaded_file($image['tmp_name'], $image_path))
                throw new Exception('The image can not be uploaded');

            $stmt = Flight::db()->prepare("INSERT INTO course (name, description, price, 
            instructor, modality, image, school_id) 
            VALUES (?,?,?,?,?,?,?);");
            $stmt->bind_param('ssdsssi', $name, $description, $price, 
            $instructor, $modality, $image_path, $school_id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();
        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The image name is already registered']));
            else
                Flight::error($e);
        }
    }

    public static function update($data, $image) {
        try {
            $id = $data->id;
            $name = $data->name;
            $description = $data->description;
            $price = $data->price;
            $instructor = $data->instructor;
            $modality = $data->modality;
            $image_path = $_ENV['COURSE_IMG'] . Uuid::uuid1() . "." . strtolower(pathinfo($image['full_path'],PATHINFO_EXTENSION));;
            $school_id = $data->school_id;

            $stmt = Flight::db()->prepare("SELECT image FROM course WHERE id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_assoc();

            if (is_null($result))
                throw new Exception("The course with id: {$id} does not exist");

            unlink($result['image']);

            if (!move_uploaded_file($image['tmp_name'], $image_path))
                throw new Exception('The image can not be uploaded');

            $stmt = Flight::db()->prepare("UPDATE course SET name = ?, description = ?, 
            price = ?, instructor = ?, modality = ?, image = ?, school_id = ?
            WHERE id = ?");
            $stmt->bind_param('ssdsssii', $name, $description,
            $price, $instructor, $modality, $image_path, $school_id, $id);
            $stmt->execute();
            $stmt->close();
            Flight::db()->close();

        } catch (Exception $e) {
            if (str_starts_with($e->getMessage(), 'Duplicate'))
                Flight::halt(400, json_encode(['status' => 'warning', 'message' => 'The image name is already registered']));
            else
                Flight::error($e);
        }
    }

    public static function eliminate($id) {
        try {
            $stmt = Flight::db()->prepare("DELETE FROM course WHERE id = ?;");
            $stmt->bind_param('i', $id);
            $stmt->execute();
            $rows = $stmt->affected_rows;
            $stmt->close();
            Flight::db()->close();

            if ($rows == 0)
                throw new Exception("The user with id: {$id} dont exist");

        } catch (Exception $e) {
            Flight::error($e);
        }
    }
}