import { db } from "../db.js";
import multer from "multer";
import path from "path";

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.resolve(__dirname, "../client/public/assets/img/bookcovers/")
    );
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const merrLibrat = (req, res) => {
  const query = "SELECT * FROM librat";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Gabim në kërkimin e librave." });
    }
    return res.status(200).json(data);
  });
};

export const merrLibrin = (req, res) => {
  const bookId = req.params.id;

  // Query to get a single book by ID
  const q1 = `SELECT *, date_format(data_publikimit, "d-m-Y") as data_publikimit FROM librat WHERE id = ?`;

  db.query(q1, [bookId], (err, booksData) => {
    if (err) return res.json(err);
    if (booksData.length === 0)
      return res.status(404).json({ message: "Libri nuk u gjet." });

    const book = booksData[0];

    // Query to get categories for the specific book
    const q2 = `
      SELECT kategorite.id AS kategori_id, kategorite.emri AS kategori_emri
      FROM librat_kategorite
      LEFT JOIN kategorite ON librat_kategorite.kategoria_id = kategorite.id
      WHERE librat_kategorite.libri_id = ?
    `;

    db.query(q2, [bookId], (err, categoriesData) => {
      if (err) return res.json(err);

      // Attach categories to the book
      book.kategoria = categoriesData.map((category) => ({
        id: category.kategori_id,
        name: category.kategori_emri,
      }));

      return res.status(200).json(book);
    });
  });
};

export const shtoLiber = (req, res) => {
  // Check if a book with the same ISBN already exists
  const checkIsbnQuery = "SELECT * FROM librat WHERE isbn = ?";
  db.query(checkIsbnQuery, [req.body.isbn], (err, existingBooks) => {
    if (err) {
      return res.status(500).json({ message: "Gabim në verifikimin e ISBN." });
    }

    if (existingBooks.length > 0) {
      return res.status(400).json({ message: "Libri me këtë ISBN ekziston." });
    }

    // Handle file upload
    const filename = req.file ? req.file.filename : null;

    // Insert new book
    const insertQuery = `
      INSERT INTO librat (
        titulli, autori, isbn, pershkrimi, cmimi, gjuha, data_publikimit, tipi, foto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      req.body.titulli,
      req.body.autori,
      req.body.isbn,
      req.body.pershkrimi,
      req.body.cmimi,
      req.body.gjuha,
      req.body.data_publikimit,
      req.body.tipi,
      filename,
    ];

    db.query(insertQuery, values, function (err, result) {
      if (err) {
        return res.status(500).json({ message: "Gabim në shtimin e librit." });
      }

      // Get the newly inserted book's ID
      const libri_id = result.insertId;

      // Insert categories
      const categories = req.body.kategoria.split(","); // Assuming this is an array of category IDs
      if (categories && categories.length > 0) {
        const insertCategoriesQuery = `
          INSERT INTO librat_kategorite (libri_id, kategoria_id) VALUES ?
        `;

        // Prepare values for insertion
        const categoryValues = categories.map((kategoria_id) => [
          libri_id,
          kategoria_id,
        ]);

        db.query(insertCategoriesQuery, [categoryValues], (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Gabim në shtimin e kategoriave për librin." });
          }

          return res
            .status(200)
            .json({ message: "Libri dhe kategoritë u shtuan me sukses." });
        });
      } else {
        return res.status(200).json({
          message: "Libri u shtua me sukses, por nuk ka kategori të dhëna.",
        });
      }
    });
  });
};

export const shlyejLibrin = (req, res) => {
  const query = "DELETE FROM librat WHERE id = ?";

  db.query(query, [req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Gabim në fshirjen e librit." });
    }
    return res.status(200).json({ message: "Libri u fshi me sukses!" });
  });
};

export const editoLibrin = async (req, res) => {
  const {
    id,
    titulli,
    autori,
    isbn,
    pershkrimi,
    cmimi,
    gjuha,
    data_publikimit,
    tipi,
    cmimi_vjeter, // New field
  } = req.body;
  const filename = req.file ? req.file.filename : null;

  try {
    // Fetch the current details from the database
    const [existingBooks] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT foto, cmimi_vjeter FROM librat WHERE id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve([results]);
        }
      );
    });

    if (existingBooks.length === 0) {
      return res.status(404).json({ message: "Libri nuk u gjet." });
    }

    const currentPhoto = existingBooks[0].foto;
    const currentCmimiVjeter = existingBooks[0].cmimi_vjeter;

    // Use the existing photo filename if no new file is provided
    const updatedFilename = filename || currentPhoto;
    // Use the existing cmimi_vjeter if no new value is provided
    const updatedCmimiVjeter = cmimi_vjeter || currentCmimiVjeter;

    // Construct the query and values for the update
    const query = `
      UPDATE librat
      SET titulli = ?, autori = ?, isbn = ?, pershkrimi = ?, cmimi = ?, gjuha = ?, data_publikimit = ?, tipi = ?, foto = ?, cmimi_vjeter = ?
      WHERE id = ?
    `;

    const values = [
      titulli,
      autori,
      isbn,
      pershkrimi,
      cmimi,
      gjuha,
      data_publikimit,
      tipi,
      updatedFilename,
      updatedCmimiVjeter,
      id,
    ];

    // Execute the update query
    await new Promise((resolve, reject) => {
      db.query(query, values, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    return res.status(200).json({ message: "Libri u editua me sukses!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Gabim në lidhjen me serverin." });
  }
};

export const kerkoLibrat = (req, res) => {
  const searchTerm = req.query.query || "";
  const query = `
    SELECT *
    FROM librat
    WHERE titulli LIKE ? OR pershkrimi LIKE ?
  `;
  const values = [`%${searchTerm}%`, `%${searchTerm}%`];

  db.query(query, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Gabim në kërkimin e librave." });
    }
    return res.status(200).json({ results: data });
  });
};
