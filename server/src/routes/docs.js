import express from "express";
import Document from "../models/Document.js";
import { requireAuth } from "../middleware/auth.js";
import {
  summarizeAndTag,
  getEmbedding,
  semanticSearch,
} from "../services/gemini.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const { summary, tags: aiTags } = await summarizeAndTag({ title, content });
    const embedding = await getEmbedding(content);

    const doc = new Document({
      title,
      content,
      summary,
      tags: tags?.length ? tags : aiTags,
      embedding,
      createdBy: req.user.id,
      versions: [{ content }],
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    console.error("Error creating doc:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const docs = await Document.find().populate("createdBy", "name email");
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    doc.versions.push({ content: doc.content });

    if (title) doc.title = title;

    if (content && content !== doc.content) {
      doc.content = content;

      const { summary, tags: aiTags } = await summarizeAndTag({
        title,
        content,
      });
      const embedding = await getEmbedding(content);

      doc.summary = summary || doc.summary;
      doc.tags = tags?.length ? tags : aiTags;
      doc.embedding = embedding;
    } else {
      doc.tags = tags || doc.tags;
    }

    await doc.save();
    const updatedDoc = await Document.findById(doc._id).populate(
      "createdBy",
      "name email"
    );
    res.json(updatedDoc);
  } catch (err) {
    console.error("Error updating doc:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document not found" });

    if (doc.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await doc.deleteOne();
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
});

router.post("/search", requireAuth, async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query is required" });

 
    const queryEmbedding = await getEmbedding(query);
    const docs = await Document.find().populate("createdBy", "name email");
    const semanticResults = semanticSearch(queryEmbedding, docs);

    if (semanticResults && semanticResults.length > 0) {
      return res.json(semanticResults);
    }

    const regex = new RegExp(query, "i");
    const textResults = await Document.find({
      $or: [
        { title: regex },
        { content: regex },
        { tags: regex },
        { summary: regex },
      ],
    }).populate("createdBy", "name email");

    res.json(textResults);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
});


export default router;