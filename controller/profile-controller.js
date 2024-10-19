const conexion = require("../database");

const profileController = {
    //funcion para registrar un perfil      
  addProfile(req, res) {
    let {
      full_name,
      phone_number,
      age,
      gender,
      email,
      medical_conditions,
      injuries,
      medications,
      allergies,
      skin_conditions,
      stress_level,
      physical_activity,
      sleep_pattern,
      water_consumption,
      massage_type,
      massage_reason,
      focus_areas,
      avoid_areas,
      massage_intensity,
      aroma_preferences,
      massage_experience,
      positive_results,
      feedback,
      body_ritual_experience,
      facial_massage_experience,
    } = req.body;
    let comandoAdd = `
    INSERT INTO client_profiles 
    (phone_number, full_name, age, gender, email, medical_conditions, injuries, medications, allergies, skin_conditions, stress_level, physical_activity, sleep_pattern, water_consumption, massage_type, massage_reason, focus_areas, avoid_areas, massage_intensity, aroma_preferences, massage_experience, positive_results, feedback, body_ritual_experience, facial_massage_experience) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
    full_name = VALUES(full_name),
    age = VALUES(age),
    gender = VALUES(gender),
    email = VALUES(email),
    medical_conditions = VALUES(medical_conditions),
    injuries = VALUES(injuries),
    medications = VALUES(medications),
    allergies = VALUES(allergies),
    skin_conditions = VALUES(skin_conditions),
    stress_level = VALUES(stress_level),
    physical_activity = VALUES(physical_activity),
    sleep_pattern = VALUES(sleep_pattern),
    water_consumption = VALUES(water_consumption),
    massage_type = VALUES(massage_type),
    massage_reason = VALUES(massage_reason),
    focus_areas = VALUES(focus_areas),
    avoid_areas = VALUES(avoid_areas),
    massage_intensity = VALUES(massage_intensity),
    aroma_preferences = VALUES(aroma_preferences),
    massage_experience = VALUES(massage_experience),
    positive_results = VALUES(positive_results),
    feedback = VALUES(feedback),
    body_ritual_experience = VALUES(body_ritual_experience),
    facial_massage_experience = VALUES(facial_massage_experience)
  `;
    conexion.query(
      comandoAdd,
      [
        phone_number,
        full_name,
        age,
        gender,
        email,
        medical_conditions,
        injuries,
        medications,
        allergies,
        skin_conditions,
        stress_level,
        physical_activity,
        sleep_pattern,
        water_consumption,
        massage_type,
        massage_reason,
        focus_areas,
        avoid_areas,
        massage_intensity,
        aroma_preferences,
        massage_experience,
        positive_results,
        feedback,
        body_ritual_experience,
        facial_massage_experience,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al guardar el perfil del cliente:", error);
          res
            .status(500)
            .json({ error: "Error al guardar el perfil del cliente" });
        } else {
          res
            .status(200)
            .json({ message: "Perfil del cliente guardado exitosamente" });
        }
      }
    );
  },
  //funcion para obtener un perfil
  getProfile(req, res) {
    const { phone_number } = req.params;
    let comandoGet = `SELECT * FROM client_profiles WHERE phone_number = ?`;
    
    conexion.query(comandoGet, [phone_number], (error, results) => {
      if (error) {
        console.error("Error al obtener el perfil del cliente:", error);
        res.status(500).json({ error: "Error al obtener el perfil del cliente" });
      } else {
        if (results.length > 0) {
          res.status(200).json(results[0]);
        } else {
          res.status(404).json({ message: "No se encontró un perfil para este número de teléfono" });
        }
      }
    });
  },
};

module.exports = profileController;
