const express = require("express");
const mongoose = require("mongoose");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("loadsh");
const { auth } = require("../middleware/authenticate");
const { checkRole } = require("../middleware/Admin");
const Book = require("../models/book");
const router = express.Router();
router.post("/admin/add/books", (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        msg: "image not uploaded",
      });
    }
    const {
      title,
      ISBN,
      available,
      author,
      description,
      category,
      photo,
    } = fields;
    let bookCreate = new Book(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status.json({
          msg: "image should not be greater than 1000000",
        });
      }
      bookCreate.photo.data = fs.readFileSync(files.photo.path);
      bookCreate.photo.contenType = files.photo.type;
    }
    bookCreate.save((err, success) => {
      if (err) {
        return res.status(400).json({
          msg: "Book not created suceessfully",
        });
      }
      return res.status(201).json("sucess");
    });
  });
});
router.post("/book/add", async (req, res) => {
  const {
    title,
    ISBN,
    available,
    author,
    description,
    category,
    photo,
  } = req.body;
  try {
    let bookCreate = new Book(req.body);
    const booksaved = await bookCreate.save();
    return res.status(201).json(booksaved);
  } catch (err) {
    return res.status(404).json({ msg: "Not created" });
  }
});
router.get("/book/:id", async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id);
    res.json(bookById);
  } catch (err) {
    res.status(404).json(err);
  }
});
router.get("/book", [auth, checkRole], async (req, res) => {
  try {
    const bookById = await Book.find();
    res.json(bookById);
  } catch (err) {
    res.status(404).json(err);
  }
});

router.get("/", async (req, res) => {
  const page_per = 10;
  var page = req.query.page || 1;
  const filter = req.query.filter;
  const value = req.query.bysearchvalue;
  if (value == "") {
    return res.status(400).json({
      msg: "Not found",
    });
  }
  const Obj = {};
  Obj[filter] = value;
  try {
    const books = await Book.find(Obj)
      .skip(page_per * page - page_per)
      .limit(page_per);
    const count = await Book.find(Obj).countDocuments();
    console.log(count);
    res.status(201).json({
      books: books,
      current: page,
      pages: Math.ceil(count / page_per),
      filter: filter,
      value: value,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
  }
});
router.get("/books", (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Book.find()
    .select("-photo")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, book) => {
      if (err) {
        return res.status(404).json({ msg: "Book not found" });
      }
      return res.json(book);
    });
});
router.get("/admin/user/:page", [auth, checkRole], async (req, res) => {
  const PER_PAGE = 10;
  try {
    const page = req.params.page || 1;

    const users = await User.find()
      .sort("-joined")
      .skip(PER_PAGE * page - PER_PAGE)
      .limit(PER_PAGE);

    const users_count = await User.find().countDocuments();

    res.status(200).json({
      users: users,
      current: page,
      pages: Math.ceil(users_count / PER_PAGE),
    });
  } catch (err) {
    res.status(403).json({
      msg: "Nothing",
    });
  }
});

module.exports = router;
