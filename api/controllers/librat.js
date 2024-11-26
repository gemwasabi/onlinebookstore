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


export const merrLibratSimple = (req, res) => {
  const query = "SELECT * FROM librat";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Gabim në kërkimin e librave." });
    }
    return res.status(200).json(data);
  });
};


export const merrLibrat = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is specified
  const limit = parseInt(req.query.limit) || 20; // Default to 20 books per page if no limit is specified
  const offset = (page - 1) * limit; // Calculate the offset for SQL query

  // Extract filter parameters from the query
  const category = req.query.category ? req.query.category.split(",") : [];
  const author = req.query.author ? req.query.author.split(",") : [];
  const year = req.query.year || "";
  const priceMin = parseFloat(req.query.priceMin) || 0;
  const priceMax = parseFloat(req.query.priceMax) || 100;

  // Construct the WHERE clause dynamically based on the filters
  let whereConditions = [];
  let queryParams = [];

  if (category.length > 0) {
    whereConditions.push(`lk.kategoria_id IN (?)`);
    queryParams.push(category);
  }

  console.log(author);
  if (author && author.length > 0) {
    whereConditions.push(`l.autori IN (?)`);
    queryParams.push(author);
  }

  if (priceMin >= 0) {
    whereConditions.push(`l.cmimi >= ?`);
    queryParams.push(priceMin);
  }

  if (priceMax <= 100) {
    whereConditions.push(`l.cmimi <= ?`);
    queryParams.push(priceMax);
  }

  if (year) {
    whereConditions.push(`YEAR(l.data_publikimit) = ?`);
    queryParams.push(year);
  }

  // Build the base query and apply the WHERE conditions
  let baseQuery = `
    SELECT l.* 
    FROM librat l
    LEFT JOIN librat_kategorite lk ON l.id = lk.libri_id
  `;
  if (whereConditions.length > 0) {
    baseQuery += " WHERE " + whereConditions.join(" AND ");
  }

  // Add pagination to the query
  baseQuery += " LIMIT ? OFFSET ?";
  queryParams.push(limit, offset);

  // Get total number of books based on the filters
  const totalQuery =
    `
    SELECT COUNT(DISTINCT l.id) AS total 
    FROM librat l
    LEFT JOIN librat_kategorite lk ON l.id = lk.libri_id
  ` +
    (whereConditions.length > 0
      ? " WHERE " + whereConditions.join(" AND ")
      : "");

  db.query(totalQuery, queryParams.slice(0, -2), (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Gabim në kërkimin e numrit të librave." });
    }

    const totalBooks = result[0].total;
    const totalPages = Math.ceil(totalBooks / limit); // Calculate total pages

    // Fetch the filtered books for the current page
    db.query(baseQuery, queryParams, (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Gabim në kërkimin e librave." });
      }

      // Return the filtered books and pagination info
      return res.status(200).json({
        books: data,
        currentPage: page,
        totalPages: totalPages,
      });
    });
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

export const merrAutoret = (req, res) => {
  const query = `
    SELECT DISTINCT autori
    FROM librat
  `;

  db.query(query, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Gabim në marrjen e autorëve." });
    }
    return res.status(200).json({ authors: data });
  });
};
